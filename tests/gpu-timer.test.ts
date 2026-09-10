import {test} from 'node:test';
import assert from 'node:assert/strict';
import {GpuTimer} from '../client/rendering/gpu-timer.ts';

test('GPU diagnostic bounds pending work, reads only available results and discards invalid timing',()=>{
  let ready=false,disjoint=false,created=0,reads=0,deleted=0;
  const gl={QUERY_RESULT_AVAILABLE:1,QUERY_RESULT:2,getExtension(){return {TIME_ELAPSED_EXT:3,GPU_DISJOINT_EXT:4};},getParameter(){return disjoint;},createQuery(){return {id:++created};},beginQuery(){},endQuery(){},deleteQuery(){deleted++;},getQueryParameter(_query:unknown,key:number){if(key===1)return ready;assert.ok(ready);reads++;return 2500000;}};
  const timer=new GpuTimer(gl as unknown as WebGL2RenderingContext);
  timer.begin(false);timer.end();assert.equal(created,0);
  for(let i=0;i<20;i++){timer.begin(true);timer.end();timer.poll();}
  assert.equal(created,8);assert.equal(reads,0);assert.equal(timer.pendingCount,8);
  ready=true;timer.poll();assert.equal(reads,8);assert.equal(deleted,8);assert.deepEqual(timer.samples,Array(8).fill(2.5));
  timer.begin(true);timer.end();disjoint=true;timer.poll();assert.equal(timer.discarded,1);assert.equal(reads,8);
  timer.reset();assert.equal(timer.samples.length,0);assert.equal(timer.pendingCount,0);
  const unavailable=new GpuTimer({...gl,getExtension:()=>null} as unknown as WebGL2RenderingContext);unavailable.begin(true);unavailable.end();unavailable.poll();assert.equal(unavailable.available,false);
});
