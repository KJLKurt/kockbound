import {test} from 'node:test';
import assert from 'node:assert/strict';
import {localConfig} from '../shared/content/arena.ts';
import {createMatch,step} from '../shared/simulation/index.ts';
function fixture(){const c=localConfig(21,2);c.rules.countdownTicks=0;c.items=['crate','blaster'];const w=createMatch(c);w.players[0].x=0;w.players[0].z=0;w.players[0].facingX=1;w.players[0].facingZ=0;w.players[1].x=-5;w.players[1].z=0;w.items={serial:1,nextSpawn:9999,ground:[{id:'box',kind:'crate',x:.8,z:0,vx:0,vz:0,expiresAt:400,thrown:false,owner:null,blockedId:null,blockedUntil:0}]};return w;}
test('crate ignores proximity and invalid dash; actual dash reveals exactly one enabled item',()=>{
 const w=fixture();step(w,[]);assert.equal(Boolean(w.players[0].heldItem),false);assert.equal(w.items!.ground[0].kind,'crate');w.players[0].cooldownTicks=10;step(w,[{participantId:'p1',sequence:1,x:0,z:0,dash:true}]);assert.equal(w.items!.ground[0].kind,'crate');w.players[0].cooldownTicks=0;step(w,[{participantId:'p1',sequence:2,x:1,z:0,dash:true}]);assert.equal(w.items!.ground.length,1);assert.equal(w.items!.ground[0].kind,'blaster');assert.equal(w.items!.serial,2);assert.equal(w.events.filter(e=>e.type==='crateopen').length,1);step(w,[]);assert.equal(w.players[0].heldItem?.kind,'blaster');assert.equal(w.players[0].heldItem?.charges,5);
});
test('full slot does not consume crate reward; expiry and crate-only settings never enable excluded items',()=>{
 const w=fixture();w.players[0].heldItem={id:'held',kind:'shovel',expiresAt:200};step(w,[{participantId:'p1',sequence:1,x:1,z:0,dash:true}]);assert.equal(w.players[0].heldItem.kind,'shovel');assert.equal(w.items!.ground[0].kind,'blaster');
 const expired=fixture();expired.items!.ground[0].expiresAt=1;step(expired,[{participantId:'p1',sequence:1,x:1,z:0,dash:true}]);assert.equal(expired.items!.ground.length,0);assert.ok(!expired.events.some(e=>e.type==='crateopen'));
 const alone=fixture();alone.config.items=['crate'];alone.items!.ground=[];alone.items!.nextSpawn=1;for(let i=0;i<100;i++)step(alone,[]);assert.equal(alone.items!.ground.length,0);
});
