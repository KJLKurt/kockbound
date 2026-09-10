import {test} from 'node:test';
import assert from 'node:assert/strict';
import {nearbyItem} from '../client/game/nearby-item.ts';
import {createMatch} from '../shared/simulation/index.ts';
import {localConfig} from '../shared/content/arena.ts';

test('nearby guidance distinguishes pickup, swapping and crates without marking live thrown traps as pickups',()=>{
 const world=createMatch(localConfig(1,2));world.phase='active';world.activeTick=10;const player=world.players[0];player.x=player.z=0;
 const base={expiresAt:100,vx:0,vz:0,owner:null,blockedId:null,blockedUntil:0,thrown:false};
 world.items={serial:2,nextSpawn:999,ground:[{...base,id:'far',kind:'blaster',x:4,z:0},{...base,id:'near',kind:'bomb',x:2,z:0}]};
 assert.match(nearbyItem(world,player.id)!.message,/live fuse/);
 world.items.ground[1].thrown=true;assert.equal(nearbyItem(world,player.id),null);
 world.items.ground[1]={...base,id:'pod',kind:'pod',x:1,z:0,armedAt:20};assert.equal(nearbyItem(world,player.id),null);
 world.items.ground[1]={...base,id:'gun',kind:'blaster',x:2,z:0};assert.match(nearbyItem(world,player.id)!.message,/walk closer/);
 player.heldItem={id:'held',kind:'shovel',expiresAt:100};assert.match(nearbyItem(world,player.id)!.message,/Drop \/ Q/);
 world.items.ground[1].kind='crate';assert.match(nearbyItem(world,player.id)!.message,/dash to open/);
 world.items.ground[1].blockedId=player.id;world.items.ground[1].blockedUntil=20;assert.equal(nearbyItem(world,player.id),null);
 world.items.ground[1].blockedUntil=0;player.alive=false;assert.equal(nearbyItem(world,player.id),null);
});
