import {test} from 'node:test';
import assert from 'node:assert/strict';
import {localConfig} from '../shared/content/arena.ts';
import {createMatch,step} from '../shared/simulation/index.ts';
function fixture(){const c=localConfig(31,3);c.rules.countdownTicks=0;c.items=['pod'];const w=createMatch(c);w.items={serial:1,nextSpawn:9999,ground:[]};w.players.forEach((p,i)=>{p.x=i*4;p.z=0;p.facingX=1;p.facingZ=0;});w.players[0].heldItem={id:'pod',kind:'pod',expiresAt:400};return w;}
test('planted pod warns before arming, cannot be repicked and can trigger on its owner',()=>{
 const w=fixture();step(w,[{participantId:'p1',sequence:1,x:0,z:0,dash:false,useItem:true}]);assert.equal(Boolean(w.players[0].heldItem),false);assert.equal(w.items!.ground[0].armedAt,16);for(let i=0;i<14;i++)step(w,[]);assert.equal(w.players[0].heldItem,null);assert.ok(!w.events.some(e=>e.type==='blast'));step(w,[]);assert.ok(w.events.some(e=>e.type==='blast'&&e.strength===2.5));assert.equal(w.items!.ground.length,0);assert.ok((w.players[0].stunnedUntil??0)>w.activeTick);assert.equal(w.players[0].lastHitBy,null);
});
test('unclaimed pod becomes a trap, dormant traps expire, drops preserve the held timer',()=>{
 const w=fixture();step(w,[{participantId:'p1',sequence:1,x:0,z:0,dash:false,dropItem:true}]);assert.equal(w.items!.ground[0].armedAt,undefined);assert.equal(w.items!.ground[0].expiresAt,400);w.players[0].x=-6;w.activeTick=399;step(w,[]);assert.equal(w.items!.ground[0].armedAt,415);w.activeTick=614;step(w,[]);assert.equal(w.items!.ground.length,0);
});
test('nearby opponents trigger the pod, area burst credits its planter and respects mass',()=>{
 const w=fixture();step(w,[{participantId:'p1',sequence:1,x:0,z:0,dash:false,useItem:true}]);w.players[0].x=-6;w.players[1].x=.8;w.players[2].x=2.8;w.players[2].heldItem={id:'big',kind:'big',expiresAt:400};w.activeTick=15;step(w,[]);assert.equal(w.players[1].lastHitBy,'p1');assert.equal(w.players[0].hits,2);assert.ok(Math.hypot(w.players[1].ix,w.players[1].iz)>Math.hypot(w.players[2].ix,w.players[2].iz));
});
