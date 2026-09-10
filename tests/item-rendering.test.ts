import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Scene,Vector3,InstancedMesh,Matrix4,Object3D} from 'three';
import type {Shot} from '../shared/content/items.ts';
import {ItemView} from '../client/rendering/item-view.ts';
import {sampleProjectiles} from '../client/game/projectile-presentation.ts';
import {createMatch} from '../shared/simulation/index.ts';
test('projectile presentation interpolates existing shots without resurrecting removals or predicting new shots',()=>{
 const a:Shot={id:'moving',kind:'rock',x:0,z:2,dx:1,dz:0,distance:0,owner:'p1',hitTargets:[]};
 const b={...a,x:2,z:4,distance:2,hitTargets:['p2']},fresh={...b,id:'new',x:8};
 const older=[a,{...a,id:'removed'}],latest=[b,fresh],before=structuredClone({older,latest});
 const sampled=sampleProjectiles(latest,older,latest,.25);
 assert.equal(sampled.length,2);assert.equal(sampled[0].x,.5);assert.equal(sampled[0].z,2.5);assert.equal(sampled[0].distance,.5);
 assert.deepEqual(sampled[0].hitTargets,['p2']);assert.deepEqual(sampled[1],fresh);
 assert.equal(sampleProjectiles(latest,older,latest,9)[0].x,2);assert.equal(sampleProjectiles(latest,older,latest,-1)[0].x,0);
 assert.deepEqual({older,latest},before);
 const world=createMatch(localConfig(3,2));world.items={serial:2,nextSpawn:999,ground:[],shots:latest};const previous=structuredClone(world);previous.items!.shots=older;
 const scene=new Scene(),view=new ItemView(scene);view.update(world,false,false,new Map(),0,previous,.25);
 const batch=scene.getObjectByName('projectiles-rock') as InstancedMesh,matrix=new Matrix4();batch.getMatrixAt(0,matrix);
 assert.ok(Math.abs(matrix.elements[12]-.5)<1e-6);assert.ok(Math.abs(matrix.elements[14]-2.5)<1e-6);assert.equal(batch.count,2);
 world.items.shots=[];view.update(world,false,false,new Map(),0,previous,.25);assert.equal(batch.count,0);
});
import {localConfig} from '../shared/content/arena.ts';

test('local held-tool occlusion cue follows expiry, reduced motion and drop without changing authority',()=>{
 const scene=new Scene(),view=new ItemView(scene),world=createMatch(localConfig(3,2));
 world.activeTick=10;world.players[0].heldItem={id:'tool',kind:'blaster',expiresAt:999};
 const poses=new Map([['tool',{x:0,y:1,z:0,yaw:0,revealOccluded:true}]]),before=structuredClone(world);
 const cue=()=>scene.getObjectByName('item-occlusion-batches')!;
 const visible=()=>cue().children.filter(child=>child.visible);
 view.update(world,false,false,poses);assert.ok(visible().length>0);assert.deepEqual(world,before);
 for(const part of visible()){const material=(part as InstancedMesh).material as import('three').Material;assert.equal(material.depthWrite,false);assert.equal(material.transparent,true);}
 world.players[0].heldItem.expiresAt=12;view.update(world,false,false,poses);assert.equal(visible().length,0);
 view.update(world,false,true,poses);assert.ok(visible().length>0);
 view.update(world,false,true,new Map());assert.equal(visible().length,0,'camera/owner change removes the cue');
 view.update(world,false,true,poses);world.players[0].heldItem=null;
 world.items={serial:1,nextSpawn:999,ground:[{id:'tool',kind:'blaster',expiresAt:999,x:0,z:0,vx:0,vz:0,thrown:false,owner:null,blockedId:null,blockedUntil:0}]};
 view.update(world,false,false,new Map());assert.equal(visible().length,0,'dropped tools do not retain a ghost');
 view.update(world,true);assert.equal(cue().visible,false);
});
test('dropping a socket-held prop restores ground scale and keeps its danger circle on the floor',()=>{
 const scene=new Scene(),view=new ItemView(scene),world=createMatch(localConfig(3,2));world.activeTick=10;
 world.players[0].heldItem={id:'bomb',kind:'bomb',expiresAt:20};
 view.update(world,false,false,new Map([['bomb',{x:2,y:1.3,z:3,yaw:1,scale:.8}]]));
 const object=scene.children[0].children[0],model=object.children[0],halo=object.children[2];scene.updateMatrixWorld(true);
 assert.ok(Math.abs(halo.getWorldPosition(new Vector3()).y-.025)<1e-12);assert.equal(halo.scale.x,1);assert.equal(model.scale.x,.8);
 world.players[0].heldItem=null;world.items={serial:1,nextSpawn:999,ground:[{id:'bomb',kind:'bomb',expiresAt:20,x:4,z:5,vx:0,vz:0,thrown:false,owner:null,blockedId:null,blockedUntil:0}]};
 view.update(world,false);scene.updateMatrixWorld(true);assert.equal(scene.children[0].children[0],object);
 assert.equal(model.scale.x,1);assert.equal(model.rotation.y,0);assert.deepEqual(object.position.toArray(),[4,.55,5]);assert.ok(Math.abs(halo.getWorldPosition(new Vector3()).y-.025)<1e-12);
});

test('item part batches preserve shared materials, world placement, blinking and rotor motion',()=>{
 const scene=new Scene(),view=new ItemView(scene),world=createMatch(localConfig(4,12));world.activeTick=10;
 world.players.forEach((player,i)=>player.heldItem={id:`pod-${i}`,kind:'pod',expiresAt:999});
 world.items={serial:99,nextSpawn:999,ground:Array.from({length:5},(_,i)=>({id:`ground-${i}`,kind:'pod' as const,expiresAt:999,x:i,z:2,vx:0,vz:0,thrown:false,owner:null,blockedId:null,blockedUntil:0}))};
 view.update(world,false);
 const batches=scene.getObjectByName('item-model-batches')!;
 assert.equal(batches.children.filter(child=>child.visible).length,2);
 assert.deepEqual(batches.children.map(child=>(child as InstancedMesh).count).sort((a,b)=>a-b),[17,68]);
 const original=scene.children[0].children[0].children[0].children[0] as import('three').Mesh;
 const shell=batches.children.find(child=>(child as InstancedMesh).geometry===original.geometry) as InstancedMesh;
 assert.equal(shell.material,original.material);const placement=new Matrix4();shell.getMatrixAt(0,placement);
 placement.elements.forEach((value,i)=>assert.ok(Math.abs(value-original.matrixWorld.elements[i])<1e-6));
 world.players.forEach(player=>player.heldItem=null);world.items.ground=[];
 world.players[0].heldItem={id:'hat',kind:'helicopter',expiresAt:12};
 view.update(world,false,false);assert.equal(batches.children.some(child=>child.visible),false,'expiration blink hides batched parts');
 view.update(world,false,true);assert.ok(batches.children.some(child=>child.visible),'reduced motion keeps expiring parts visible');
 const rotor=scene.children[0].getObjectByName('rotor')!;assert.equal(rotor.rotation.y,0);
 world.players[0].heldItem.expiresAt=999;view.update(world,false,false);assert.equal(rotor.rotation.y,5);
 const rotorBatch=batches.children.find(child=>(child as InstancedMesh).geometry===(rotor as import('three').Mesh).geometry) as InstancedMesh;
 rotorBatch.getMatrixAt(0,placement);placement.elements.forEach((value,i)=>assert.ok(Math.abs(value-rotor.matrixWorld.elements[i])<1e-6));
 const snapshot=structuredClone(world),poses=new Map();
 view.update(world,false,false,poses,.5);const first=rotor.rotation.y;
 view.update(world,false,false,poses,.5+1/120);
 assert.ok(rotor.rotation.y>first,'rotor advances between authority ticks');
 assert.ok(Math.abs(rotor.rotation.y-first-10/120)<1e-10,'cosmetic spin retains its ten-radian-per-second speed');
 const paused=rotor.rotation.y;view.update(world,false,false,poses,.5+1/120);assert.equal(rotor.rotation.y,paused,'unchanged presentation time freezes spin');
 view.update(world,false,true,poses,1);assert.equal(rotor.rotation.y,0);assert.deepEqual(world,snapshot);
 view.update(world,true);assert.equal(batches.visible,false);
});

test('projectile batches preserve each original transform, full capacity and expiry cleanup',()=>{
 const scene=new Scene(),view=new ItemView(scene),world=createMatch(localConfig(3,2));
 const kinds=['blaster','wind','rock'] as const;
 const shots:Shot[]=kinds.map((kind,i)=>({id:`shot-${i}`,kind,x:i+2,z:-3,dx:1,dz:0,distance:2,owner:'p1',hitTargets:[]}));
 world.items={serial:3,nextSpawn:999,ground:[],shots};view.update(world,false);
 for(const shot of shots){
   const batch=scene.getObjectByName(`projectiles-${shot.kind}`) as InstancedMesh;
   assert.equal(batch.count,shot.kind==='wind'?3:1);
   const parent=new Object3D();parent.position.set(shot.x,shot.kind==='rock'?.8:.85,shot.z);parent.rotation.y=Math.atan2(shot.dx,shot.dz);
   for(let i=0;i<batch.count;i++){
     const child=new Object3D();if(shot.kind==='wind'){child.position.z=-i*.4;child.scale.setScalar(1-i*.15);}else if(shot.kind==='blaster')child.scale.setScalar(.6);else child.rotation.x=shot.distance/.8;
     parent.add(child);parent.updateMatrixWorld(true);const actual=new Matrix4();batch.getMatrixAt(i,actual);
     actual.elements.forEach((value,j)=>assert.ok(Math.abs(value-child.matrixWorld.elements[j])<1e-6));
   }
 }
 world.items.shots=Array.from({length:64},(_,i)=>({...shots[1],id:`wind-${i}`}));view.update(world,false);
 assert.equal((scene.getObjectByName('projectiles-wind') as InstancedMesh).count,192);
 assert.equal(scene.getObjectByName('projectiles-rock')!.visible,false);
 world.items.shots=[shots[2]];view.update(world,false,true);
 const stillRock=new Matrix4(),expectedRock=new Object3D();expectedRock.position.set(shots[2].x,.8,shots[2].z);expectedRock.rotation.y=Math.PI/2;expectedRock.updateMatrix();
 (scene.getObjectByName('projectiles-rock') as InstancedMesh).getMatrixAt(0,stillRock);
 stillRock.elements.forEach((value,i)=>assert.ok(Math.abs(value-expectedRock.matrix.elements[i])<1e-6));
 world.items.shots=[];view.update(world,false);
 for(const kind of kinds){const batch=scene.getObjectByName(`projectiles-${kind}`) as InstancedMesh;assert.equal(batch.count,0);assert.equal(batch.visible,false);}
});
