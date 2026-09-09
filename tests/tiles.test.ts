import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,step} from '../shared/simulation/index.ts';
import {localConfig} from '../shared/content/arena.ts';
import {arenaTiles,supported,tileAt,warnTile} from '../shared/content/tiles.ts';
function fixture(){const c=localConfig(7,2);c.rules.countdownTicks=0;const w=createMatch(c);w.players[0].x=0;w.players[0].z=0;w.players[1].x=5;w.players[1].z=0;return w;}
test('shrink warns complete outside blocks for one second, then support disappears',()=>{
 const w=fixture();w.activeTick=1200;step(w,[]);const outer=arenaTiles(10,2.2).find(t=>t.id==='tile-3-0')!;assert.ok(w.tiles![outer.id]);const expiry=w.tiles![outer.id].fallAt;assert.equal(expiry-w.activeTick,20);assert.equal(supported(w,outer.x,outer.z),true);
 w.activeTick=expiry;assert.equal(supported(w,outer.x,outer.z),false);assert.equal(supported(w,0,0),true);assert.equal(supported(w,5,0),true);
});
test('platform remover warns a forward tile and consumes once, never the protected core',()=>{
 const w=fixture();w.config.items=['remover'];w.items={nextSpawn:9999,serial:0,ground:[]};w.players[0].facingX=1;w.players[0].facingZ=0;w.players[0].heldItem={id:'tool',kind:'remover',expiresAt:400};step(w,[{participantId:'p1',sequence:1,x:0,z:0,dash:false,useItem:true}]);assert.equal(w.players[0].heldItem,null);assert.ok(w.tiles![tileAt(w,3,0)!]);assert.equal(w.tiles!.core,undefined);assert.ok(w.events.some(e=>e.type==='tilewarning'));
});
test('removed support eliminates occupants; helicopter selects intact ground',()=>{
 const w=fixture();const id=tileAt(w,5,0)!;warnTile(w,id);w.activeTick=20;const rescued=structuredClone(w);rescued.players[1].heldItem={id:'hat',kind:'helicopter',expiresAt:400};step(w,[]);assert.equal(w.players[1].alive,false);step(rescued,[]);assert.equal(rescued.players[1].alive,true);assert.equal(supported(rescued,rescued.players[1].x,rescued.players[1].z),true);assert.equal(rescued.players[1].heldItem,null);
});
test('dashing through a narrow angular gap cannot skip lost support',()=>{
 const w=fixture();w.players[0].x=2.5;w.players[0].z=-.3;w.players[0].facingX=0;w.players[0].facingZ=1;const id=tileAt(w,2.5,.1)!;warnTile(w,id);w.activeTick=20;step(w,[{participantId:'p1',sequence:1,x:0,z:1,dash:true}]);assert.equal(w.players[0].alive,false);
});
