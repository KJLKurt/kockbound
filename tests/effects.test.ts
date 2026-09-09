import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Scene,Object3D} from 'three';
import {ImpactPulses} from '../client/rendering/effects.ts';

test('impact bursts stay bounded and release expired materials without removing world objects',()=>{
  const scene=new Scene(),worldObject=new Object3D();scene.add(worldObject);
  const pulses=new ImpactPulses(scene);
  pulses.emit(1,2,true,false);
  let disposed=0;
  (scene.children[1] as any).material.addEventListener('dispose',()=>disposed++);
  for(let i=0;i<30;i++)pulses.emit(i,0,false,false);
  assert.equal(pulses.count(),16);assert.equal(disposed,1);assert.equal(scene.children.length,17);
  pulses.update(.3,false);assert.equal(pulses.count(),0);assert.deepEqual(scene.children,[worldObject]);
  pulses.emit(0,0,true,true);pulses.update(.15,true);assert.equal(pulses.count(),0);
  pulses.emit(0,0,false,false);pulses.clear();assert.deepEqual(scene.children,[worldObject]);
});
