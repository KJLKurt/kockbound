import {test} from 'node:test';
import assert from 'node:assert/strict';
import {localConfig,validateConfig,PROTOCOL_VERSION,CONTENT_RELEASE} from '../shared/content/arena.ts';
import {configureParty,coresPerPhase} from '../shared/content/party.ts';
import {validRoomOptions} from '../shared/content/items.ts';
import {createMatch,step} from '../shared/simulation/index.ts';
import {botInputs} from '../shared/simulation/bots.ts';
import {parseServerMessage} from '../shared/protocol/messages.ts';
import {predictLocal} from '../client/networking/prediction.ts';
import {LocalSession} from '../client/game/local-session.ts';
import {Sound} from '../client/audio/sound.ts';
import {RoomAuthority} from '../server/game-room/authority.ts';
import type {World,PartyOptions} from '../shared/game-types/index.ts';
function fixture(count:number,party:PartyOptions){const c=localConfig(19,count);configureParty(c,party);c.rules.countdownTicks=0;return createMatch(c);}
function packet(w:World){return JSON.stringify({type:'snapshot',protocolVersion:PROTOCOL_VERSION,contentReleaseId:CONTENT_RELEASE,roomPhase:w.phase==='results'?'results':'active',acknowledgedSequence:-1,nextSequence:0,world:w,rewardsEnabled:false});}
test('Team and co-op victories use the victory cue, including eliminated winning teammates',()=>{
  for(const modeId of ['teams','boss'] as const){
    const w=fixture(4,{modeId,...(modeId==='teams'?{teamSize:2}:{})});w.players[0].alive=false;
    w.result={matchId:w.config.matchId,outcome:'winner',winnerId:null,winnerTeamId:0,origin:'local-practice',tick:1};w.phase='results';w.events=[{id:`${w.config.matchId}:1`,tick:1,type:'result',x:0,z:0}];
    const sound=new Sound(),cues:string[]=[];sound.cue=name=>{cues.push(name);};sound.update(w,true,false,'p1');assert.deepEqual(cues,['victory']);
  }
});
test('Team layouts include 2v2v2 and every equal split of twelve with two or more per team',()=>{
  for(const [count,size]of [[6,2],[12,2],[12,3],[12,4],[12,6],[9,3]]){
    const w=fixture(count,{modeId:'teams',teamSize:size});assert.equal(w.result,null);
    assert.equal(new Set(w.players.map(p=>p.teamId)).size,count/size);
    assert.ok(parseServerMessage(packet(w)));
  }
  for(const options of [{humanCount:12,totalCount:8},{humanCount:6,totalCount:6,modeId:'teams',teamSize:4},{humanCount:12,totalCount:12,modeId:'teams',teamSize:12},{humanCount:2,modeId:'boss',bossVariant:'unknown'}])assert.equal(validRoomOptions(options),false);
  assert.equal(validRoomOptions({humanCount:12,totalCount:12,modeId:'teams',teamSize:3}),true);
  const bad=fixture(6,{modeId:'teams',teamSize:2});bad.config.roster[0].teamId=9;assert.throws(()=>validateConfig(bad.config));
});
test('Allied dash and shovel contacts separate bodies without hits; enemy contacts still launch',()=>{
  for(const shovel of [false,true]){
    const w=fixture(4,{modeId:'teams',teamSize:2}),a=w.players[0],ally=w.players.find(p=>p.id!==a.id&&p.teamId===a.teamId)!;
    w.players.forEach((p,i)=>{p.x=-6+i*3;p.z=-5;});a.x=-.5;a.z=0;ally.x=.5;ally.z=0;
    if(shovel)a.heldItem={id:'shovel',kind:'shovel',expiresAt:200};
    step(w,[{participantId:a.id,x:1,z:0,dash:true,sequence:0}]);assert.equal(a.hits,0);assert.equal(ally.vulnerability,0);assert.ok(Math.hypot(a.x-ally.x,a.z-ally.z)>=.9-1e-8);
    const enemy=w.players.find(p=>p.teamId!==a.teamId)!;a.x=-.5;a.z=0;enemy.x=.5;enemy.z=0;ally.z=5;a.cooldownTicks=a.dashTicks=0;
    step(w,[{participantId:a.id,x:1,z:0,dash:true,sequence:1}]);assert.equal(a.hits,1);assert.ok(enemy.vulnerability>0);
  }
});
test('Friendly projectiles and bombs spare allies while retaining enemy and self interactions',()=>{
  for(const kind of ['blaster','wind','rock','bomb','pod'] as const){
    const w=fixture(4,{modeId:'teams',teamSize:2});w.config.items=[kind];const a=w.players[0],ally=w.players.find(p=>p.id!==a.id&&p.teamId===a.teamId)!,enemy=w.players.find(p=>p.teamId!==a.teamId)!;
    w.players.forEach(p=>{p.x=-6;p.z=-6;});a.x=0;a.z=0;ally.x=1;ally.z=0;enemy.x=2;enemy.z=0;
    if(kind==='bomb'||kind==='pod')w.items={serial:1,nextSpawn:9999,ground:[{id:'blast',kind,x:1,z:0,vx:0,vz:0,thrown:false,owner:a.id,blockedId:null,blockedUntil:0,expiresAt:kind==='bomb'?1:100,...(kind==='pod'?{armedAt:0}:{})}]};
    else w.items={serial:1,nextSpawn:9999,ground:[],shots:[{id:'shot',kind,x:0,z:0,dx:1,dz:0,distance:0,owner:a.id,hitTargets:[]}]};
    for(let n=0;n<4;n++)step(w,[]);assert.equal(ally.vulnerability,0,kind);assert.ok(enemy.vulnerability>0,kind);
  }
});
test('Team victory waits for the last team, includes surviving allies, and simultaneous wipes draw',()=>{
  const w=fixture(6,{modeId:'teams',teamSize:2});w.players.filter(p=>p.teamId!==0).forEach(p=>p.alive=false);step(w,[]);
  assert.equal(w.result?.winnerTeamId,0);assert.equal(w.result?.winnerId,null);assert.ok(parseServerMessage(packet(w)));
  const draw=fixture(12,{modeId:'teams',teamSize:3});draw.players.forEach(p=>p.x=30);step(draw,[]);assert.equal(draw.result?.outcome,'draw');
});
test('Both authored boss variants replay and complete with ordinary allied bot inputs',()=>{
  for(const variant of ['cloud-king','tempest'] as const)for(const count of [4,12]){
    const w=fixture(count,{modeId:'boss',bossVariant:variant});w.players.forEach(p=>p.control='bot');w.config.roster.forEach(p=>p.control='bot');const replay=structuredClone(w);
    let sawPhase2=false;while(!w.result){const commands=botInputs(w);assert.deepEqual(commands,botInputs(replay));step(w,commands);step(replay,commands);assert.deepEqual(w,replay);sawPhase2||=w.boss!.phase===2;assert.ok(parseServerMessage(packet(w)));}
    assert.equal(w.result.outcome,'winner');assert.equal(w.boss!.cores,coresPerPhase(w.config)*2);assert.ok(sawPhase2);console.log('Boss bot completion',variant,count,w.activeTick);
  }
});
test('Boss telegraphs precede strikes; safe ground avoids them; wipe and timeout lose',()=>{
  const w=fixture(2,{modeId:'boss'});while(!w.boss!.attack)step(w,[]);const at=w.boss!.attack!.at,p=w.players[0];assert.equal(p.vulnerability,0);
  while(w.activeTick<at-1)step(w,[]);assert.equal(p.vulnerability,0);step(w,[]);assert.ok(p.vulnerability>0);assert.equal(w.players[1].vulnerability,0,'outside the marked circle is safe');
  const timeout=fixture(2,{modeId:'boss'});timeout.config.rules.durationTicks=1;step(timeout,[]);assert.equal(timeout.result?.outcome,'defeat');assert.ok(parseServerMessage(packet(timeout)));
  const wipe=fixture(2,{modeId:'boss'});wipe.players.forEach(p=>p.x=30);step(wipe,[]);assert.equal(wipe.result?.outcome,'defeat');
});
test('Boss state and team identity are validated; prediction cannot advance objectives or boss attacks',()=>{
  const w=fixture(4,{modeId:'boss'}),original=structuredClone(w);const p=predictLocal(w,'p1',[{participantId:'p1',sequence:0,x:0,z:-1,dash:true}]);assert.deepEqual(w,original);assert.deepEqual(p.boss,w.boss);
  for(const mutate of [(w:World)=>w.boss!.core.x=NaN,(w:World)=>w.players[0].teamId=5,(w:World)=>w.boss!.switches=[99,0,0],(w:World)=>w.boss!.attack={kind:'boulder',at:1,marks:Array(4).fill({x:0,z:0})}]){const bad=structuredClone(w);mutate(bad);assert.equal(parseServerMessage(packet(bad)),null);}
  const local=new LocalSession(1,12,'sprout',[],[],'classic',{modeId:'teams',teamSize:3});assert.equal(new Set(local.world.players.map(p=>p.teamId)).size,4);
});

test('Complete team and boss rounds match local and online authority tick for tick',()=>{
  for(const options of [{modeId:'teams',teamSize:3,totalCount:12},{modeId:'boss',totalCount:4}] as const){
    const local=fixture(options.totalCount,options),room=new RoomAuthority(local.config,new Map([['ticket','p1']]));
    room.connect('ticket',{id:'peer',bufferedAmount:0,send(){},close(){}},0);
    room.receive('peer',JSON.stringify({type:'ready',protocolVersion:PROTOCOL_VERSION,contentReleaseId:CONTENT_RELEASE}),0);
    let tick=0;while(!local.result){
      const command={participantId:'p1',sequence:tick,x:0,z:0,dash:false},alive=local.players.find(p=>p.id==='p1')!.alive;
      if(alive)assert.ok(room.receive('peer',JSON.stringify({type:'input',protocolVersion:PROTOCOL_VERSION,command}),tick*50+1));
      step(local,[...(alive?[command]:[]),...botInputs(local)]);room.advance(++tick*50);assert.deepEqual(room.snapshot(),local);
    }
    assert.equal(room.terminalReceipt()?.rewardsEnabled,false);
  }
});
