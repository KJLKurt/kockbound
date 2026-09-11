import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { localConfig } from '../shared/content/arena.ts';
import { createMatch, step } from '../shared/simulation/index.ts';
import { botInputs } from '../shared/simulation/bots.ts';

test('bots escape a coincident bomb or arming pod using ordinary deterministic movement',()=>{
  for(const kind of ['bomb','pod'] as const)for(const x of [0,3]){
    const config=localConfig(19,2);config.rules.countdownTicks=0;config.obstacles=[];
    const w=createMatch(config),bot=w.players.find(p=>p.control==='bot')!;
    bot.x=x;bot.z=0;bot.heldItem={id:'full',kind:'shovel',expiresAt:400};
    const human=w.players.find(p=>p.control==='human')!;human.x=-6;human.z=-4;
    w.items={serial:1,nextSpawn:9999,ground:[{id:'danger',kind,x,z:0,vx:0,vz:0,expiresAt:20,thrown:false,owner:null,blockedId:null,blockedUntil:0,...(kind==='pod'?{armedAt:10}:{})}]};
    const replay=structuredClone(w),command=botInputs(w);
    assert.deepEqual(command,botInputs(replay));
    const escape=command.find(input=>input.participantId===bot.id)!;
    assert.ok(Math.hypot(escape.x,escape.z)>.99,`${kind} at ${x}: bot must choose an escape direction`);
    assert.equal(escape.dash,false);
    if(x>0)assert.ok(escape.x<0,'escape from coincidence points toward arena center');
    step(w,command);step(replay,command);assert.deepEqual(w,replay);
    assert.ok(Math.hypot(bot.x-x,bot.z)>0,'ordinary simulation input moves the bot away');
  }
});
import { LocalSession } from '../client/game/local-session.ts';
import type { Input, World } from '../shared/game-types/index.ts';

function fixture(count=4) { const c=localConfig(71,count); c.rules.countdownTicks=0; return createMatch(c); }
function input(id='p1',x=0,z=0,dash=false,sequence=0): Input { return {participantId:id,x,z,dash,sequence}; }
const digest = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

test('P01: 10,000 recorded ticks replay identically, including bot RNG/events and restored state',()=>{
  const records: Input[][]=[]; const first: string[]=[]; let w=fixture(); let saved:World|undefined;
  for(let i=0;i<10000;i++) {
    if(w.phase==='results') { const c=localConfig(i+1); c.rules.countdownTicks=0; w=createMatch(c); }
    const commands=[input('p1',Math.sin(i*.033),Math.cos(i*.027),i%29===0,i),...botInputs(w)];
    records.push(structuredClone(commands)); step(w,commands); first.push(digest(w));
    if(i===420) saved=structuredClone(w);
  }
  let replay=fixture();
  for(let i=0;i<10000;i++) {
    if(replay.phase==='results') {const c=localConfig(i+1);c.rules.countdownTicks=0;replay=createMatch(c);}
    botInputs(replay); step(replay,records[i]); assert.equal(digest(replay),first[i],`tick ${i}`);
    if(i===420) { assert.deepEqual(replay,saved); replay=JSON.parse(JSON.stringify(saved)); }
  }
  console.log('P01 replay digest:',digest(first));
});
test('P01: 30, 60 and 144 Hz presentation produce the same authority state',()=>{
  const run=(fps:number)=>{const s=new LocalSession(81);let sequence=0;
    for(let f=0;f<fps*40;f++) s.advance(1/fps,()=>input('p1',0,0,false,sequence++),()=>{});
    return digest(s.world);
  };
  assert.equal(run(30),run(60)); assert.equal(run(60),run(144));
});
test('P02: cardinal/diagonal speed, hostile numbers, duplicate sequence and stale controls',()=>{
  for(const [x,z] of [[1,0],[1,1],[1000,1000],[0,0]]) {
    const w=fixture(1); w.players[0].x=w.players[0].z=0;
    for(let i=0;i<15;i++) step(w,[input('p1',x,z,false,i)]);
    assert.ok(Math.hypot(w.players[0].vx,w.players[0].vz)<=5+1e-9);
  }
  const w=fixture(1),p=w.players[0]; p.x=p.z=0;
  step(w,[input('p1',1,0,false,1)]);
  step(w,[input('p1',NaN,Infinity,true,2),input('p1',0,1,false,1)]);
  assert.equal(p.lastSequence,1); assert.equal(p.dashId,0);
  for(let i=0;i<10;i++)step(w,[]);
  assert.equal(p.moveX,0); assert.equal(p.vx,0); assert.ok(Number.isFinite(p.x));
});
test('P03: single-hit dash, cooldown and vulnerability recovery',()=>{
  const w=fixture(2),[a,b]=w.players;a.x=-.5;a.z=0;b.x=.5;b.z=0;
  step(w,[input('p1',1,0,true,0)]);
  assert.equal(a.hits,1);assert.equal(b.vulnerability,w.config.rules.vulnerabilityGain);
  for(let i=1;i<12;i++) {b.x=a.x+.7;b.z=a.z;step(w,[input('p1',1,0,true,i)]);}
  assert.equal(a.dashId,1);assert.equal(a.hits,1);
  a.x=-1;a.z=0;b.x=1;b.z=0;a.ix=a.iz=b.ix=b.iz=a.vx=a.vz=b.vx=b.vz=0;
  for(let i=12;i<=w.config.rules.recoveryDelayTicks;i++)step(w,[input('p1',0,0,false,i)]);
  assert.equal(b.vulnerability,w.config.rules.vulnerabilityGain,'buildup persists through the recovery delay');
  for(let i=0;i<20;i++)step(w,[]);
  assert.ok(b.vulnerability<w.config.rules.vulnerabilityGain);
});
test('P04: coincident centers settle; simultaneous head-on dashes hit both',()=>{
  const w=fixture(2),[a,b]=w.players;a.x=b.x=a.z=b.z=0;
  step(w,[]);assert.ok(Math.hypot(a.x-b.x,a.z-b.z)>=.9-1e-8);
  a.x=-.5;b.x=.5;a.z=b.z=0;
  step(w,[input('p1',1,0,true,0),input('p2',-1,0,true,0)]);
  assert.equal(a.hits,1);assert.equal(b.hits,1);assert.equal(a.vulnerability,w.config.rules.vulnerabilityGain);assert.equal(b.vulnerability,w.config.rules.vulnerabilityGain);
  assert.ok(a.ix<0 && b.ix>0);
});
test('P03: later dash increases impulse from previous vulnerability; vulnerability is capped',()=>{
  const w=fixture(2),[a,b]=w.players;let sequence=0;
  for(let hit=0;hit<12;hit++) {
    a.x=-.5;a.z=0;b.x=.5;b.z=0;a.ix=a.iz=b.ix=b.iz=a.vx=a.vz=b.vx=b.vz=0;
    a.cooldownTicks=0;a.dashTicks=0;
    const before=b.vulnerability;
    step(w,[input('p1',1,0,true,sequence++)]);
    assert.equal(w.events.find(e=>e.type==='hit')?.strength,w.config.rules.hitImpulse*(1+before));
    assert.equal(b.vulnerability,Math.min(w.config.rules.vulnerabilityCap,before+w.config.rules.vulnerabilityGain));
  }
  assert.equal(b.vulnerability,2);
});

test('P03: four-second duel exchanges retain buildup and push farther than the previous tuning',()=>{
  function exchanges(previous=false){
    const config=localConfig(71,2);config.rules.countdownTicks=0;config.items=[];config.hazards=[];
    if(previous)Object.assign(config.rules,{hitImpulse:7,vulnerabilityGain:.2,recoveryDelayTicks:40,recoveryPerSecond:.1});
    const w=createMatch(config),[a,b]=w.players,powers:number[]=[],travel:number[]=[];
    for(let hit=0;hit<4;hit++){
      // Re-stage the contact to isolate the effect of retained vulnerability.
      for(const p of [a,b]){p.z=p.vx=p.vz=p.ix=p.iz=p.moveX=p.moveZ=0;p.dashTicks=0;}
      a.x=-.5;b.x=.5;
      step(w,[input('p1',1,0,true,hit)]);
      powers.push(w.events.find(e=>e.type==='hit'&&e.target===b.id)!.strength!);
      a.x=-6;a.z=-6;a.vx=a.vz=a.ix=a.iz=a.moveX=a.moveZ=0;a.dashTicks=0;
      for(let tick=1;tick<80;tick++)step(w,[]);
      assert.equal(w.phase,'active');
      travel.push(b.x-.5);
    }
    return {powers,travel};
  }
  const old=exchanges(true),current=exchanges();
  assert.ok(current.travel[0]>old.travel[0]*1.15,'fresh hits move a neutral target noticeably farther');
  assert.ok(current.powers[3]>current.powers[0]*1.8,'spaced duel hits build rather than reset');
  assert.ok(current.travel[3]>old.travel[3]*1.8,'fourth exchange translates buildup into displacement');
  console.log('Duel tuning comparison:',JSON.stringify({old,current}));
});
test('P04: maximum supported impulse/dash cannot tunnel through a 2 cm wall',()=>{
  const c=localConfig(1,1);c.rules.countdownTicks=0;c.obstacles=[{id:'thin',x:0,z:0,halfX:.01,halfZ:5}];
  const w=createMatch(c),p=w.players[0];p.x=-1;p.z=0;p.ix=22;
  step(w,[input('p1',1,0,true)]);assert.ok(p.x<=-.46+1e-8);assert.ok(Number.isFinite(p.x));
});
test('P05: simultaneous final falls draw, terminal events are once-only, restart is clean',()=>{
  const w=fixture(2);for(const p of w.players){p.x=11;p.z=0;}
  step(w,[]);assert.equal(w.result?.outcome,'draw');assert.equal(w.events.filter(e=>e.type==='ringout').length,2);
  step(w,[]);assert.equal(w.events.length,0);
  const reset=createMatch(w.config);assert.equal(reset.tick,0);assert.ok(reset.players.every(p=>p.alive && !p.dashId && !p.hits));
  const c=localConfig(1,2);c.rules.countdownTicks=0;c.rules.durationTicks=1;c.rules.suddenDeathTicks=0;
  const timeout=createMatch(c);step(timeout,[]);assert.equal(timeout.result?.outcome,'draw');
  const empty=localConfig();empty.roster=[];assert.equal(createMatch(empty).result?.outcome,'cancelled');
});
test('P06: keyboard-like input + three normal-rule bots finish 20 seeded rounds',()=>{
  const outcomes=[];
  for(let seed=1;seed<=20;seed++) {
    const c=localConfig(seed);c.rules.countdownTicks=0;const w=createMatch(c);
    let hits=0;
    for(let i=0;i<2000 && !w.result;i++) {
      const p=w.players[0];const towardCenter=Math.hypot(p.x,p.z)>5;
      step(w,[input('p1',towardCenter?-p.x:Math.sin(i*.021),towardCenter?-p.z:Math.cos(i*.021),i%31===0,i),...botInputs(w)]);
      hits+=w.events.filter(e=>e.type==='hit').length;
      for(const p of w.players) {assert.ok([p.x,p.z,p.vx,p.vz,p.ix,p.iz].every(Number.isFinite));assert.ok(p.cooldownTicks<=24);}
    }
    assert.ok(w.result,`seed ${seed} stuck`);outcomes.push({seed,ticks:w.activeTick,outcome:w.result.outcome,winner:w.result.winnerId,hits});
  }
  console.log('P06 seeded round results:',JSON.stringify(outcomes));
});
test('Config rejects incompatible releases, unsupported capacities and unsafe physics',()=>{
  assert.throws(()=>localConfig(1,13));
  for(const change of [(c:ReturnType<typeof localConfig>)=>c.rules.dashSpeed=100,(c:ReturnType<typeof localConfig>)=>c.protocolVersion='bad',(c:ReturnType<typeof localConfig>)=>c.roster.push(c.roster[0])]){const c=localConfig();change(c);assert.throws(()=>createMatch(c));}
});
