import {test} from 'node:test';
import assert from 'node:assert/strict';
import {BoxGeometry,MeshBasicMaterial,type BufferAttribute} from 'three';
import {TileBatch} from '../client/rendering/tile-batch.ts';

test('batched tile ranges fall and disappear independently without changing UVs or adjacent tiles',()=>{
  const a=new BoxGeometry(2,1,2),b=a.clone().translate(4,0,0),material=new MeshBasicMaterial();
  const batch=new TileBatch([{id:'a',geometry:a,materialIndex:0},{id:'b',geometry:b,materialIndex:0}],material);
  const positions=batch.mesh.geometry.getAttribute('position') as BufferAttribute,uv=batch.mesh.geometry.getAttribute('uv');
  const original=Array.from(positions.array),originalUV=Array.from(uv.array),split=positions.count/2;
  batch.set('a',-2,true);
  assert.deepEqual(positions.updateRanges,[{start:0,count:split*3}]);
  positions.clearUpdateRanges();
  batch.set('a',-2,true);assert.deepEqual(positions.updateRanges,[],'stationary tiles schedule no upload');
  for(let i=0;i<split;i++){assert.equal(positions.getY(i),original[i*3+1]-2);assert.equal(positions.getX(i),original[i*3]);}
  assert.deepEqual(Array.from(positions.array).slice(split*3),original.slice(split*3));
  batch.set('a',-2,false);assert.ok(Array.from(positions.array).slice(0,split*3).every(v=>v===0));assert.equal(batch.mesh.visible,true);
  batch.set('b',0,false);assert.equal(batch.mesh.visible,false);
  assert.deepEqual(positions.updateRanges,[{start:0,count:split*3},{start:split*3,count:split*3}]);
  const hiddenVersion=(positions as any).version;batch.set('b',-200,false);assert.equal((positions as any).version,hiddenVersion);
  batch.set('a',0,true);batch.set('b',0,true);assert.equal(batch.mesh.visible,true);
  assert.deepEqual(Array.from(positions.array),original);assert.deepEqual(Array.from(uv.array),originalUV);
  let disposed=0;batch.mesh.geometry.addEventListener('dispose',()=>disposed++);batch.dispose();assert.equal(disposed,1);
  a.dispose();b.dispose();material.dispose();
});
