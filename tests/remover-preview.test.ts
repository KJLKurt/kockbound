import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {RemoverPreview} from '../client/rendering/remover-preview.ts';
import {createMatch,step} from '../shared/simulation/index.ts';
import {localConfig} from '../shared/content/arena.ts';
import {removerTarget,warnTile} from '../shared/content/tiles.ts';

test('remover preview follows authoritative targeting and hides when action cannot target',()=>{
  const config=localConfig(77,2);config.rules.countdownTicks=0;config.items=['remover'];
  const world=createMatch(config),player=world.players[0];player.x=0;player.z=2;player.facingX=0;player.facingZ=-1;
  player.heldItem={id:'tool',kind:'remover',expiresAt:999};world.items={serial:0,nextSpawn:9999,ground:[]};
  const direction={dx:0,dz:-1},target=removerTarget(world,player,direction)!;
  assert.ok(target);assert.notEqual(target.id,'core');
  const scene=new THREE.Scene(),preview=new RemoverPreview(scene),mesh=scene.getObjectByName('remover-target-preview') as THREE.Mesh;
  preview.update(world,player,direction,true);assert.equal(mesh.visible,true);
  const geometry=mesh.geometry;preview.update(world,player,direction,true);assert.equal(mesh.geometry,geometry);
  const authority=structuredClone(world);step(authority,[{participantId:player.id,sequence:1,x:0,z:0,dash:false,useItem:true}]);assert.ok(authority.tiles?.[target.id]);
  player.stunnedUntil=1;preview.update(world,player,direction,true);assert.equal(mesh.visible,false);player.stunnedUntil=0;
  for(let i=0;i<10;i++){const next=removerTarget(world,player,direction);if(!next)break;warnTile(world,next.id);}
  preview.update(world,player,direction,true);assert.equal(mesh.visible,false);
});
