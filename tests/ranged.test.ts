import {test} from 'node:test';
import assert from 'node:assert/strict';
import {localConfig} from '../shared/content/arena.ts';
import {createMatch,step} from '../shared/simulation/index.ts';
import {stepRanged} from '../shared/simulation/ranged.ts';
import type {ShotKind} from '../shared/content/items.ts';
function fixture(kind:ShotKind){const c=localConfig(42,4);c.rules.countdownTicks=0;c.items=[kind];const w=createMatch(c);w.items={nextSpawn:99999,serial:0,ground:[]};w.players.forEach((p,i)=>{p.x=i*3;p.z=i>1?6:0;p.facingX=1;p.facingZ=0;p.control='human';});w.players[0].heldItem={id:'gun',kind,expiresAt:500,activated:true};return w;}
const fire=(sequence=1)=>({participantId:'p1',sequence,x:0,z:0,dash:false,useItem:true});
test('blaster has five weak shots, cooldown and no charge reset on drop/transfer',()=>{
 const w=fixture('blaster');step(w,[fire()]);assert.equal(w.players[0].heldItem?.charges,4);step(w,[fire(2)]);assert.equal(w.players[0].heldItem?.charges,4);
 for(let i=0;i<3;i++)step(w,[]);assert.equal(w.players[0].hits,1);assert.ok(Math.hypot(w.players[1].ix,w.players[1].iz)<w.config.rules.hitImpulse);
 step(w,[{...fire(3),dropItem:true}]);assert.equal(w.items!.ground[0].charges,4);const expiry=w.items!.ground[0].expiresAt;w.players[2].x=w.items!.ground[0].x;w.players[2].z=w.items!.ground[0].z;step(w,[]);assert.equal(w.players[2].heldItem?.charges,4);assert.equal(w.players[2].heldItem?.expiresAt,expiry);
 const empty=fixture('blaster');for(let i=0;i<5;i++){empty.activeTick=i*8;stepRanged(empty,[fire(i+1)],()=>{});}assert.equal(empty.players[0].heldItem,null);assert.equal(empty.items!.serial,5);
});
test('wind crosses the board, pierces once per player and falls off toward dash strength',()=>{
 const w=fixture('wind');w.players[1].x=2;w.players[2].x=18;w.players[2].z=0;
 const powers:number[]=[];stepRanged(w,[fire()],(_w,type,_x,_z,_source,_target,power)=>{if(type==='hit')powers.push(power!);});
 for(let i=0;i<24;i++)stepRanged(w,[],(_w,type,_x,_z,_source,_target,power)=>{if(type==='hit')powers.push(power!);});
 assert.equal(w.players[0].heldItem,null);assert.equal(powers.length,2);assert.ok(powers[0]>powers[1]);assert.ok(powers[1]>=w.config.rules.hitImpulse);assert.equal(w.items!.shots!.length,0);
});
test('rolling rock flattens and stuns each player once; swept shots stop at thin walls',()=>{
 const w=fixture('rock');w.players[2].x=6;w.players[2].z=0;
 for(let i=0;i<20;i++){w.activeTick=i;stepRanged(w,i===0?[fire()]:[],()=>{});}assert.equal(w.players[0].hits,2);assert.ok(w.players[1].flattenedUntil!>0);assert.equal(w.players[1].flattenedUntil,w.players[1].stunnedUntil);
 const wall=fixture('blaster');wall.players[1].x=1;wall.config.obstacles=[{id:'thin',x:.5,z:0,halfX:.01,halfZ:2}];stepRanged(wall,[fire()],()=>{});assert.equal(wall.players[0].hits,0);assert.equal(wall.items!.shots!.length,0);
});
test('ranged aiming honors accepted turn input; stun and expiry prevent firing',()=>{
 const w=fixture('blaster');w.players[0].stunnedUntil=10;stepRanged(w,[fire()],()=>{});assert.equal(w.items!.serial,0);w.players[0].stunnedUntil=0;stepRanged(w,[{...fire(),x:0,z:1}],()=>{});assert.equal(w.items!.shots![0].dz,1);
 w.activeTick=500;stepRanged(w,[fire(2)],()=>{});assert.equal(w.items!.serial,1);
});
