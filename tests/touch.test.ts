import {test} from 'node:test';
import assert from 'node:assert/strict';
import {stickVector,TouchControls} from '../client/input/touch.ts';
import {KeyboardInput} from '../client/input/keyboard.ts';

test('touch movement uses bounded analog input and preserves the last direction for a released-stick dash',()=>{
  const oldWindow=globalThis.window;globalThis.window=new EventTarget() as unknown as Window & typeof globalThis;
  try{
    const input=new KeyboardInput(()=>{});input.enabled=true;
    assert.deepEqual(stickVector(2,3),{x:0,z:0});
    const diagonal=stickVector(500,-500);assert.ok(Math.abs(Math.hypot(diagonal.x,diagonal.z)-1)<1e-12);
    const half=stickVector(24,0);assert.ok(half.x>0&&half.x<.5);
    input.touch(diagonal.x,diagonal.z);assert.equal(input.sample().z,diagonal.z);
    input.touch(0,0);assert.equal(input.sample().x,0);input.pendingDash=true;
    const dash=input.sample();assert.equal(dash.dash,true);assert.equal(dash.z,diagonal.z);assert.equal(input.sample().dash,false);
    input.touch(1,0);input.clear();assert.equal(input.sample().x,0);input.enabled=false;input.touch(1,0);assert.equal(input.sample().x,0);
  }finally{globalThis.window=oldWindow;}
});

test('pointer ownership ignores a second finger and releases motion on cancellation or rotation',()=>{
  const oldWindow=globalThis.window,oldDocument=globalThis.document;
  globalThis.window=new EventTarget() as unknown as Window & typeof globalThis;globalThis.document=new EventTarget() as unknown as Document;
  class Pad extends EventTarget{captured=new Set<number>();getBoundingClientRect(){return {left:0,top:0,width:128,height:128};}setPointerCapture(id:number){this.captured.add(id);}hasPointerCapture(id:number){return this.captured.has(id);}releasePointerCapture(id:number){this.captured.delete(id);}setAttribute(){} }
  const pad=new Pad(),knob={style:{transform:''}};
  const pointer=(type:string,id:number,x:number,y:number)=>{const event=new Event(type,{cancelable:true});Object.assign(event,{pointerId:id,clientX:x,clientY:y});pad.dispatchEvent(event);};
  try{
    const input=new KeyboardInput(()=>{});input.enabled=true;const touch=new TouchControls(input,pad as unknown as HTMLElement,knob as unknown as HTMLElement);touch.update(true);
    pointer('pointerdown',1,110,64);assert.ok(input.sample().x>.9);
    pointer('pointerdown',2,10,64);pointer('pointerup',2,10,64);assert.ok(input.sample().x>.9);
    pointer('pointercancel',1,110,64);assert.equal(input.sample().x,0);assert.equal(pad.captured.size,0);
    pointer('pointerdown',3,64,10);assert.ok(input.sample().z<-.9);window.dispatchEvent(new Event('resize'));assert.equal(input.sample().z,0);
    pointer('pointerdown',4,110,64);touch.update(false);assert.equal(input.sample().x,0);assert.equal(knob.style.transform,'');
  }finally{globalThis.window=oldWindow;globalThis.document=oldDocument;}
});
