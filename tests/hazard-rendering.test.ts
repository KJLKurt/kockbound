import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Scene,InstancedMesh,Matrix4,Vector3} from 'three';
import {HazardView} from '../client/rendering/hazard-view.ts';
import {createMatch} from '../shared/simulation/index.ts';
import {localConfig} from '../shared/content/arena.ts';

test('batched gust arrows retain placement, direction and warning-to-active presentation',()=>{
  const scene=new Scene(),view=new HazardView(scene),world=createMatch(localConfig(3,2));
  const wind=scene.children[0].children[0],arrows=wind.children[0] as InstancedMesh;
  assert.ok(arrows.isInstancedMesh);assert.equal(wind.children.length,1);assert.equal(arrows.count,21);
  const positions=new Set<string>(),matrix=new Matrix4();
  for(let i=0;i<arrows.count;i++){arrows.getMatrixAt(i,matrix);const point=new Vector3().setFromMatrixPosition(matrix);assert.ok(Math.abs(point.y-.08)<1e-7);assert.ok(Math.hypot(point.x,point.z)<=8);positions.add(`${point.x}:${point.z}`);}
  assert.equal(positions.size,21);
  world.activeTick=10;world.hazards={serial:1,nextAt:999,rocks:[],gust:{dx:1,dz:0,startAt:20,endAt:80}};
  view.update(world,false,true);assert.equal(wind.visible,true);assert.equal(wind.rotation.y,Math.PI/2);assert.equal(wind.position.y,0);
  world.activeTick=20;view.update(world,false,true);assert.equal(wind.position.y,.2);
  world.hazards.gust=undefined;view.update(world,false,false);assert.equal(wind.visible,false);
});
