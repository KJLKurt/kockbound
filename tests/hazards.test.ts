import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,step} from '../shared/simulation/index.ts';
import {localConfig} from '../shared/content/arena.ts';
import {stepHazards} from '../shared/simulation/hazards.ts';
import {validRoomOptions} from '../shared/content/items.ts';
function fixture(){const c=localConfig(9,2);c.rules.countdownTicks=0;c.hazards=['skyrock'];const w=createMatch(c);w.players[0].x=0;w.players[0].z=0;w.players[1].x=6;w.players[1].z=0;return w;}
test('falling rock warning lasts thirty ticks, then flattens/stuns/pushes once inside its marker',()=>{
 const w=fixture();w.activeTick=200;stepHazards(w,()=>.5,()=>{});const rock=w.hazards!.rocks[0];assert.equal(rock.at,230);w.players[0].x=rock.x;w.players[0].z=rock.z;w.players[1].x=-8;w.players[1].z=-8;w.activeTick=229;stepHazards(w,()=>.5,()=>{});assert.equal(w.players[0].stunnedUntil,undefined);w.activeTick=230;stepHazards(w,()=>.5,()=>{});assert.equal(w.players[0].flattenedUntil,246);assert.equal(w.players[1].flattenedUntil,undefined);const push=w.players[0].ix;w.activeTick++;stepHazards(w,()=>.5,()=>{});assert.equal(w.players[0].ix,push);
});
test('gust warns before applying directional mass-adjusted force and ends cleanly',()=>{
 const w=fixture();w.config.hazards=['gust'];w.activeTick=200;stepHazards(w,()=>0,()=>{});assert.equal(w.players[0].ix,0);w.players[1].heldItem={id:'big',kind:'big',expiresAt:999};w.activeTick=220;stepHazards(w,()=>0,()=>{});assert.ok(w.players[0].ix>0);assert.ok(Math.abs(w.players[0].ix-w.players[1].ix*1.8)<1e-10);w.activeTick=280;stepHazards(w,()=>0,()=>{});assert.equal(w.hazards!.gust,undefined);
});
test('random tile hazard preserves core; disabled hazards stay absent and selection is validated',()=>{
 const w=fixture();w.config.hazards=['tiles'];w.activeTick=200;stepHazards(w,()=>0,()=>{});assert.equal(Object.keys(w.tiles!).length,1);assert.equal(w.tiles!.core,undefined);assert.equal(Object.values(w.tiles!)[0].fallAt,220);
 const off=fixture();off.config.hazards=[];for(let i=0;i<250;i++)step(off,[]);assert.equal(off.hazards,undefined);assert.equal(validRoomOptions({humanCount:2,hazards:['gust','gust']}),false);assert.equal(validRoomOptions({humanCount:2,hazards:['unknown']}),false);assert.equal(validRoomOptions({humanCount:2,hazards:['gust']}),true);
});
