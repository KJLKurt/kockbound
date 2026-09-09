import {test} from 'node:test';
import assert from 'node:assert/strict';
import {watchGraphicsContext} from '../client/rendering/context-recovery.ts';
test('graphics loss permits restoration and reports one transition per loss/recovery',()=>{
  const canvas=new EventTarget(),transitions:string[]=[];
  const stop=watchGraphicsContext(canvas,()=>transitions.push('pause'),()=>transitions.push('restored'));
  canvas.dispatchEvent(new Event('webglcontextrestored'));assert.deepEqual(transitions,[]);
  const event=new Event('webglcontextlost',{cancelable:true});canvas.dispatchEvent(event);assert.equal(event.defaultPrevented,true);
  canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));assert.deepEqual(transitions,['pause']);
  canvas.dispatchEvent(new Event('webglcontextrestored'));assert.deepEqual(transitions,['pause','restored']);
  stop();canvas.dispatchEvent(new Event('webglcontextlost'));assert.equal(transitions.length,2);
});
