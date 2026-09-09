import {test} from 'node:test';
import assert from 'node:assert/strict';
import {localConfig} from '../shared/content/arena.ts';
import {createMatch,step} from '../shared/simulation/index.ts';
import {botInputs} from '../shared/simulation/bots.ts';
import {validRoomOptions} from '../shared/content/items.ts';
function fixture(){const config=localConfig(42,2);config.rules.countdownTicks=0;config.items=['bomb'];const w=createMatch(config);w.players[0].x=0;w.players[0].z=0;w.players[0].facingX=1;w.players[0].facingZ=0;w.players[1].x=5;w.players[1].z=0;w.items={nextSpawn:9999,serial:1,ground:[{id:'item-1',kind:'bomb',expiresAt:100,x:0,z:0,vx:0,vz:0,owner:null,thrown:false,blockedId:null,blockedUntil:0}]};return w;}
test('shovel extends forward dash reach without widening ordinary body collisions',()=>{
  const a=fixture();a.items!.ground=[];a.config.items=['shovel'];a.players[0].heldItem={id:'shovel',kind:'shovel',expiresAt:1000,activated:true};a.players[1].x=2.5;
  const b=structuredClone(a);b.players[0].heldItem=null;
  const command={participantId:'p1',sequence:1,x:1,z:0,dash:true};step(a,[command]);step(b,[command]);assert.equal(a.players[0].hits,1);assert.equal(b.players[0].hits,0);
});
test('big mode reduces blast impulse and expires without resetting through a drop',()=>{
  const a=fixture();a.config.items=['bomb','big'];a.items!.ground[0].expiresAt=1;a.players[0].heldItem={id:'big',kind:'big',expiresAt:1000,activated:true};const b=structuredClone(a);b.players[0].heldItem=null;
  step(a,[]);step(b,[]);assert.ok(Math.abs(a.players[0].ix*1.8-b.players[0].ix)<1e-8);
  a.players[0].stunnedUntil=0;step(a,[{participantId:'p1',sequence:1,x:0,z:0,dash:false,dropItem:true}]);assert.equal(a.items!.ground[0].expiresAt,1000);assert.equal(a.items!.ground[0].activated,true);
  a.players[1].x=a.items!.ground[0].x;a.players[1].z=a.items!.ground[0].z;step(a,[]);assert.equal(a.players[1].heldItem?.expiresAt,1000);a.activeTick=999;step(a,[]);assert.equal(a.players[1].heldItem,null);
});
test('helicopter rescues exactly one fall but cannot evade a server forfeit',()=>{
  const w=fixture();w.items!.ground=[];w.config.items=['helicopter'];w.players[0].heldItem={id:'hat',kind:'helicopter',expiresAt:1000};w.players[0].x=11;
  const forfeited=structuredClone(w);step(forfeited,[],['p1']);assert.equal(forfeited.players[0].alive,false);assert.ok(!forfeited.events.some(e=>e.type==='rescue'));
  step(w,[]);assert.equal(w.players[0].alive,true);assert.equal(w.players[0].heldItem,null);assert.ok(w.events.some(e=>e.type==='rescue'));assert.ok(Math.hypot(w.players[0].x,w.players[0].z)<w.radius-1);
  w.players[0].x=11;step(w,[]);assert.equal(w.players[0].alive,false);
});
test('one slot proximity pickup, drop grace and fuse preservation prevent reset exploits',()=>{
  const w=fixture();step(w,[]);assert.equal(w.players[0].heldItem?.id,'item-1');assert.equal(w.items!.ground.length,0);
  step(w,[{participantId:'p1',sequence:1,x:0,z:0,dash:false,dropItem:true}]);assert.equal(w.players[0].heldItem,null);assert.equal(w.items!.ground[0].expiresAt,100);
  for(let i=0;i<10;i++)step(w,[]);assert.equal(w.players[0].heldItem,null);
  w.players[1].x=w.items!.ground[0].x;w.players[1].z=0;step(w,[]);assert.equal(w.players[1].heldItem?.id,'item-1');
});
test('throw detonates after twenty ticks, pushes/stuns and cannot be picked up in flight',()=>{
  const w=fixture();step(w,[]);step(w,[{participantId:'p1',sequence:1,x:0,z:0,dash:false,useItem:true}]);const expiry=w.items!.ground[0].expiresAt;
  assert.equal(expiry,w.activeTick+20);assert.equal(w.players[0].heldItem,null);
  while(w.activeTick<expiry-1){step(w,[]);assert.ok(!w.events.some(e=>e.type==='blast'));}
  step(w,[]);assert.ok(w.events.some(e=>e.type==='blast'));assert.ok((w.players[1].stunnedUntil??0)>w.activeTick);assert.ok(Math.hypot(w.players[1].ix,w.players[1].iz)>0);assert.equal(w.items!.ground.length,0);
});
test('held bombs expire, disabled catalog stays empty, seeded items replay identically',()=>{
  const w=fixture();w.items!.ground[0].expiresAt=3;step(w,[]);step(w,[]);step(w,[]);assert.equal(w.players[0].heldItem,null);assert.ok(w.events.some(e=>e.type==='blast'));
  const config=localConfig(19,4);config.items=['bomb'];config.rules.countdownTicks=0;const a=createMatch(config),b=createMatch(config);for(let i=0;i<1000;i++){step(a,botInputs(a));step(b,botInputs(b));}assert.deepEqual(a,b);
  const off=createMatch(localConfig(1));for(let i=0;i<400;i++)step(off,botInputs(off));assert.equal(off.items,undefined);
  assert.equal(validRoomOptions({humanCount:2,items:['unknown']}),false);assert.equal(validRoomOptions({humanCount:2,items:['bomb'],wallet:10}),false);assert.equal(validRoomOptions({humanCount:2,items:['bomb']}),true);
});
