import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localConfig, PROTOCOL_VERSION, CONTENT_RELEASE } from '../shared/content/arena.ts';
import { RoomAuthority } from '../server/game-room/authority.ts';
import type { Peer } from '../server/game-room/authority.ts';
import type { ServerMessage } from '../shared/protocol/messages.ts';
import { createMatch, step } from '../shared/simulation/index.ts';
import { parseClientMessage } from '../shared/protocol/messages.ts';

class TestPeer implements Peer {
  id:string;bufferedAmount=0;messages:ServerMessage[]=[];closed:number|null=null;
  constructor(id:string){this.id=id;}
  send(data:string){this.messages.push(JSON.parse(data));}
  close(code:number){this.closed=code;}
  latest(){return this.messages.filter(m=>m.type==='snapshot').at(-1)!;}
}
const ready=JSON.stringify({type:'ready',protocolVersion:PROTOCOL_VERSION,contentReleaseId:CONTENT_RELEASE});
const command=(id:string,sequence:number,x=0,z=0,dash=false)=>JSON.stringify({type:'input',protocolVersion:PROTOCOL_VERSION,command:{participantId:id,sequence,x,z,dash}});
function setup(count=4,seed=1,countdown=0){
  const config=localConfig(seed,count);config.roster.forEach(p=>p.control='human');config.rules.countdownTicks=countdown;
  const tickets=new Map(config.roster.map(p=>[`ticket-${p.id}`,p.id]));const room=new RoomAuthority(config,tickets);
  const peers=config.roster.map(p=>new TestPeer(`socket-${p.id}`));peers.forEach((peer,i)=>{assert.ok(room.connect(`ticket-${config.roster[i].id}`,peer,0));});
  peers.forEach(peer=>assert.ok(room.receive(peer.id,ready,0)));
  return {room,peers,config};
}
test('N02/N05: strict schema excludes forged state/rewards, malformed and incompatible packets',()=>{
  for(const raw of ['{','null','[]','x'.repeat(1025),JSON.stringify({type:'ready',protocolVersion:'old',contentReleaseId:CONTENT_RELEASE}),JSON.stringify({type:'ready',protocolVersion:PROTOCOL_VERSION,contentReleaseId:'old'}),command('p1',0,1,1),command('p1',-1),command('p1',0,Infinity)])assert.equal(parseClientMessage(raw),null);
  const value=JSON.parse(command('p1',0));value.command.position={x:10,z:10};assert.equal(parseClientMessage(JSON.stringify(value)),null);
  delete value.command.position;value.reward=100;assert.equal(parseClientMessage(JSON.stringify(value)),null);
  const {room,peers}=setup();const before=room.snapshot();
  assert.equal(room.receive(peers[0].id,command('p2',0),10),false);
  assert.ok(room.receive(peers[0].id,command('p1',0,1),20));
  assert.equal(room.receive(peers[0].id,command('p1',0,-1),30),false);
  assert.equal(room.receive(peers[0].id,command('p1',10000),40),false);
  assert.deepEqual(room.snapshot(),before);room.advance(50);assert.equal(room.snapshot().players[0].lastSequence,0);
});
test('N02: dash spam is rejected during cooldown and message queues remain bounded',()=>{
  const {room,peers}=setup();assert.ok(room.receive(peers[0].id,command('p1',0,0,-1,true),1));room.advance(50);
  for(let i=1;i<500;i++)room.receive(peers[0].id,command('p1',i,0,-1,true),51);
  assert.ok(room.rejectedMessages>=499);assert.equal(room.queueSize(),0);room.advance(100);assert.equal(room.snapshot().players[0].dashId,1);
});
test('N01 local fixture: four independent peers observe identical outcomes in ten matches, matching local authority',()=>{
  for(let seed=1;seed<=10;seed++){
    const {room,peers,config}=setup(4,seed);const local=createMatch(config);
    for(let tick=0;tick<1800 && !room.terminalReceipt();tick++){
      const inputs=config.roster.map((p,i)=>({participantId:p.id,sequence:tick,x:Math.cos(tick*.06+i),z:Math.sin(tick*.06+i),dash:tick%30===0}));
      for(const [i,c] of inputs.entries())if(local.players[i].alive)assert.ok(room.receive(peers[i].id,command(c.participantId,c.sequence,c.x,c.z,c.dash),tick*50+1));
      step(local,inputs);room.advance((tick+1)*50);
      assert.deepEqual(room.snapshot(),local);
      for(const peer of peers){assert.deepEqual(peer.latest().world,JSON.parse(JSON.stringify(local)));peer.messages=[];}
    }
    assert.ok(room.terminalReceipt());assert.equal(room.terminalReceipt()!.rewardsEnabled,false);
  }
});
test('N04: reconnect restores seat, old socket loses control, neutral state and next sequence are explicit',()=>{
  const {room,peers}=setup();room.receive(peers[0].id,command('p1',0,1),1);room.advance(50);
  room.receive(peers[0].id,command('p1',1,1),51);room.disconnect(peers[0].id,52);
  assert.equal(room.snapshot().players[0].moveX,0);assert.equal(room.queueSize(),0);
  const replacement=new TestPeer('replacement');assert.ok(room.connect('ticket-p1',replacement,9999));
  assert.equal(replacement.latest().nextSequence,2);assert.equal(replacement.latest().acknowledgedSequence,0);
  assert.equal(room.receive(peers[0].id,command('p1',2,1),10000),false);
  assert.ok(room.receive(replacement.id,command('p1',2,-1),10000));
  const takeover=new TestPeer('takeover');assert.ok(room.connect('ticket-p1',takeover,10001));assert.equal(replacement.closed,1000);
  room.disconnect(replacement.id,10002);assert.ok(room.receive(takeover.id,command('p1',3),10003));
});
test('N04/N05: exact grace expiry eliminates once; late/mismatched admission cannot enter',()=>{
  const {room,peers}=setup();room.disconnect(peers[0].id,0);
  const stranger=new TestPeer('stranger');assert.equal(room.connect('unknown',stranger,10),false);
  for(let t=50;t<=10000;t+=50)room.advance(t);
  assert.equal(room.snapshot().players[0].alive,false);
  assert.equal(room.connect('ticket-p1',new TestPeer('late'),10000),false);
  room.advance(10050);assert.equal(room.snapshot().events.some(e=>e.type==='ringout'&&e.target==='p1'),false);
});
test('N04: same-tick disconnected final seats draw, including grace expiry during countdown',()=>{
  const {room,peers}=setup(2,3,240);peers.forEach(p=>room.disconnect(p.id,0));
  for(let t=50;t<=12500;t+=50)room.advance(t);
  assert.equal(room.terminalReceipt()?.world.result?.outcome,'draw');
});
test('N05: neutral message cancels pending action and acknowledges release; waiting room cannot simulate',()=>{
  const {room,peers}=setup();room.receive(peers[0].id,command('p1',0,1,0,true),1);
  assert.ok(room.receive(peers[0].id,JSON.stringify({type:'neutral',protocolVersion:PROTOCOL_VERSION,sequence:1}),2));
  room.advance(50);assert.equal(room.snapshot().players[0].dashId,0);assert.equal(peers[0].latest().acknowledgedSequence,1);
  const config=localConfig();const waiting=new RoomAuthority(config,new Map([['ticket','p1']]));waiting.advance(10000);assert.equal(waiting.snapshot().tick,0);
  const p=new TestPeer('peer');waiting.connect('ticket',p,10000);assert.equal(waiting.receive(p.id,JSON.stringify({type:'ready',protocolVersion:PROTOCOL_VERSION,contentReleaseId:'old'}),10000),false);assert.equal(waiting.status(),'waiting');
});
test('N01/N06: 12-seat backlog is disconnected rather than queued; cancel is terminal and idempotent',()=>{
  const {room,peers}=setup(12);peers[0].bufferedAmount=65537;
  room.advance(50);assert.equal(peers[0].closed,1013);assert.ok(room.queueSize()<=12);
  room.cancel('Room restart',51);const receipt=room.terminalReceipt();assert.equal(receipt?.status,'cancelled');
  room.cancel('Duplicate restart',52);room.advance(1000);assert.deepEqual(room.terminalReceipt(),receipt);
  assert.equal(room.connect('ticket-p2',new TestPeer('new'),1001),false);assert.equal(room.receive(peers[1].id,command('p2',1),1002),false);
  for(const peer of peers.slice(1))assert.equal(peer.messages.filter(m=>m.type==='cancelled').length,1);
});

test('cosmetic ready schema rejects unknown looks and authority fields',()=>{
 const base={type:'ready',protocolVersion:PROTOCOL_VERSION,contentReleaseId:CONTENT_RELEASE,appearance:'pebble',skin:'mint'};
 assert.ok(parseClientMessage(JSON.stringify(base)));
 for(const extra of [{appearance:'unknown'},{skin:'unknown'},{participantId:'p2'},{mass:99}])assert.equal(parseClientMessage(JSON.stringify({...base,...extra})),null);
});
