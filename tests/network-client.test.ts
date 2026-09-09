import {test} from 'node:test';
import assert from 'node:assert/strict';
import {OnlineSession} from '../client/networking/online-session.ts';
import {predictLocal,RemoteBuffer,OwnerSmoother} from '../client/networking/prediction.ts';
import {parseServerMessage} from '../shared/protocol/messages.ts';
import {RoomAuthority} from '../server/game-room/authority.ts';
import {createMatch} from '../shared/simulation/index.ts';
import {localConfig,PROTOCOL_VERSION,CONTENT_RELEASE} from '../shared/content/arena.ts';

const ticket='A'.repeat(43);
function config(){const c=localConfig(3,2);c.matchId='room-ABC123';c.rules.countdownTicks=0;c.roster[0].control='bot';c.roster[1].control='human';return c;}
class SocketFixture {
  onopen:WebSocket['onopen']=null;onmessage:WebSocket['onmessage']=null;onclose:WebSocket['onclose']=null;onerror:WebSocket['onerror']=null;
  readyState=0;bufferedAmount=0;id:string;room:RoomAuthority;clock:()=>number;
  constructor(room:RoomAuthority,clock:()=>number,id:string){
    this.room=room;this.clock=clock;this.id=id;
    queueMicrotask(()=>{this.readyState=1;this.onopen?.call(this as unknown as WebSocket,{} as Event);room.connect(ticket,{id,bufferedAmount:0,send:data=>this.deliver(data),close:(code)=>this.close(code)},clock());});
  }
  deliver(data:string){this.onmessage?.call(this as unknown as WebSocket,{data} as MessageEvent);}
  send(data:string|ArrayBufferLike|Blob|ArrayBufferView){this.room.receive(this.id,data,this.clock());}
  close(code=1000){if(this.readyState===3)return;this.readyState=3;this.room.disconnect(this.id,this.clock());this.onclose?.call(this as unknown as WebSocket,{code} as CloseEvent);}
}
async function connected(){
  let now=0;const room=new RoomAuthority(config(),new Map([[ticket,'p2']]));const sockets:SocketFixture[]=[];
  const session=await OnlineSession.connect({roomId:'ABC123',participantId:'p2',ticket,protocolVersion:PROTOCOL_VERSION,contentReleaseId:CONTENT_RELEASE},{origin:'http://127.0.0.1:9999',socketFactory:()=>{const socket=new SocketFixture(room,()=>now,`socket-${sockets.length}`);sockets.push(socket);return socket;}});
  return {room,session,sockets,tick:(delta=50)=>{now+=delta;room.advance(now);}};
}
test('Client rejects malformed snapshots before rendering and accepts the real server envelope',()=>{
  const world=createMatch(config());
  const message={type:'snapshot',protocolVersion:PROTOCOL_VERSION,contentReleaseId:CONTENT_RELEASE,roomPhase:'active',acknowledgedSequence:-1,nextSequence:0,world,rewardsEnabled:false};
  assert.ok(parseServerMessage(JSON.stringify(message)));
  for(const bad of ['null','[]','{','x'.repeat(131073),JSON.stringify({...message,protocolVersion:'old'}),JSON.stringify({...message,world:{...world,players:[null]}}),JSON.stringify({...message,world:{...world,events:[{}]}})])assert.equal(parseServerMessage(bad),null);
});
test('Prediction moves only the local player and cannot invent a hit, elimination or result',()=>{
  const world=createMatch(config());world.players[1].x=9.9;world.players[1].z=0;const original=structuredClone(world);
  const predicted=predictLocal(world,'p2',[{participantId:'p2',sequence:0,x:1,z:0,dash:true}]);
  assert.ok(predicted.players[1].x>world.radius);assert.equal(predicted.players[1].alive,true);assert.equal(predicted.players[1].hits,0);assert.equal(predicted.result,null);
  assert.deepEqual(predicted.players[0],world.players[0]);assert.deepEqual(world,original);assert.deepEqual(predicted.events,world.events);
});

test('A jitter backlog cannot multiply the prediction horizon or lose its queued dash edge',()=>{
  const world=createMatch(config());world.players[1].x=0;world.players[1].z=0;
  const inputs=Array.from({length:20},(_,sequence)=>({participantId:'p2',sequence,x:1,z:0,dash:sequence===0}));
  const predicted=predictLocal(world,'p2',inputs);
  assert.ok(predicted.players[1].x>1);assert.ok(predicted.players[1].x<=world.config.rules.dashSpeed*.1+.001);
  assert.equal(predicted.result,null);assert.equal(predicted.players[1].alive,true);
});
test('Remote interpolation uses a bounded two-tick delay and does not extrapolate past the newest snapshot',()=>{
  const buffer=new RemoteBuffer();
  for(let i=0;i<20;i++){const world=createMatch(config());world.tick=i;world.players[0].x=i;buffer.push(world,i*50);}
  assert.equal(buffer.size(),8);assert.equal(buffer.sample(950)!.players[0].x,17);assert.equal(buffer.sample(975)!.players[0].x,17.5);assert.equal(buffer.sample(10000)!.players[0].x,19);
});

test('Owner presentation moves between network ticks but snaps to authoritative elimination and large correction',()=>{
  const smoother=new OwnerSmoother(),player=createMatch(config()).players[1];
  smoother.sample(player,.016);player.x+=.25;const target=structuredClone(player);
  const first=smoother.sample(player,.016),second=smoother.sample(player,.016);
  assert.ok(first.x<second.x&&second.x<player.x);assert.deepEqual(player,target);
  player.alive=false;assert.equal(smoother.sample(player,.016).x,player.x);
  player.alive=true;player.x+=3;assert.equal(smoother.sample(player,.016).x,player.x);
});
test('OnlineSession controls its assigned seat, normalizes diagonal input, reconciles, and neutralizes queued dash',async()=>{
  const h=await connected();
  try{
    assert.equal(h.session.participantId,'p2');assert.equal(h.session.roomPhase,'active');
    h.session.advance(.05,()=>({participantId:'p1',sequence:900,x:1,z:1,dash:false}),()=>{});h.tick();
    const owner=h.room.snapshot().players.find(p=>p.id==='p2')!;
    assert.equal(owner.lastSequence,0);assert.ok(Math.abs(owner.moveX-Math.SQRT1_2)<1e-9);
    h.session.advance(.05,()=>({participantId:'p1',sequence:901,x:1,z:0,dash:true}),()=>{});h.session.neutral();h.tick();
    assert.equal(h.room.snapshot().players[1].dashId,0);assert.equal(h.room.snapshot().players[1].moveX,0);
    h.session.paused=true;let sampled=false;h.session.advance(.1,()=>{sampled=true;throw new Error('Paused controls sampled');},()=>{});h.tick(100);assert.equal(sampled,false);
    assert.equal(h.session.authoritative.tick,h.room.snapshot().tick);
  }finally{h.session.close();}
});
test('OnlineSession retries a dropped connection with the same seat and rejects malformed received state',async()=>{
  const h=await connected();
  try{
    h.sockets[0].close(1006);assert.equal(h.session.connected,false);h.tick(100);
    await new Promise(r=>setTimeout(r,450));assert.equal(h.sockets.length,2);assert.equal(h.session.connected,true);assert.equal(h.session.participantId,'p2');
    h.sockets[1].deliver('{}');assert.equal(h.session.connected,false);assert.match(h.session.failure!,/incompatible/);
  }finally{h.session.close();}
});

test('A retired completed room preserves its result without a connection-error overlay',async()=>{
  const h=await connected();
  try{
    for(let i=0;i<2200&&!h.session.authoritative.result;i++)h.tick();
    assert.ok(h.session.authoritative.result);
    const result=structuredClone(h.session.authoritative.result);
    h.sockets[0].close(1000);
    assert.equal(h.session.failure,null);assert.equal(h.session.connected,false);
    assert.deepEqual(h.session.authoritative.result,result);
  }finally{h.session.close();}
});
