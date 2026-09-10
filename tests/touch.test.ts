import {test} from 'node:test';
import assert from 'node:assert/strict';
import {stickVector,TouchControls} from '../client/input/touch.ts';
import {KeyboardInput} from '../client/input/keyboard.ts';
import {CameraLook,cameraRelative} from '../client/input/camera-controls.ts';

test('a rejected joystick capture leaves neutral input and allows the next touch',()=>{
  const oldWindow=globalThis.window,oldDocument=globalThis.document;
  globalThis.window=new EventTarget() as unknown as Window & typeof globalThis;
  globalThis.document=new EventTarget() as unknown as Document;
  class Pad extends EventTarget{
    deny=true;captured=new Set<number>();
    getBoundingClientRect(){return {left:0,top:0,width:128,height:128};}
    setPointerCapture(id:number){if(this.deny)throw new Error('Pointer is no longer active');this.captured.add(id);}
    hasPointerCapture(id:number){return this.captured.has(id);}
    releasePointerCapture(id:number){this.captured.delete(id);}
    setAttribute(){}
  }
  const pad=new Pad(),knob={style:{transform:''}};
  const pointer=(type:string,id:number)=>{const event=new Event(type,{cancelable:true});Object.assign(event,{pointerId:id,clientX:112,clientY:64});pad.dispatchEvent(event);};
  try{
    const input=new KeyboardInput(()=>{});input.enabled=true;
    const touch=new TouchControls(input,pad as unknown as HTMLElement,knob as unknown as HTMLElement);touch.update(true);
    pointer('pointerdown',1);assert.equal(input.sample().x,0);assert.equal(knob.style.transform,'');
    // The failed pointer may end outside the pad, so no local pointerup is delivered.
    pad.deny=false;pointer('pointerdown',2);assert.equal(input.sample().x,1);
    pointer('pointerup',2);assert.equal(input.sample().x,0);assert.equal(pad.captured.size,0);
  }finally{globalThis.window=oldWindow;globalThis.document=oldDocument;}
});

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

test('two fingers can steer and aim while action edges fire once; releasing aim does not release movement',()=>{
  const oldWindow=globalThis.window,oldDocument=globalThis.document;
  globalThis.window=new EventTarget() as unknown as Window & typeof globalThis;
  globalThis.document=new EventTarget() as unknown as Document;
  class Surface extends EventTarget {
    captured=new Set<number>();
    getBoundingClientRect(){return {left:0,top:0,width:128,height:128};}
    setPointerCapture(id:number){this.captured.add(id);}
    hasPointerCapture(id:number){return this.captured.has(id);}
    releasePointerCapture(id:number){this.captured.delete(id);}
    setAttribute(){}
  }
  const stick=new Surface(),canvas=new Surface();
  const pointer=(surface:Surface,type:string,id:number,x:number,y:number)=>{
    const event=new Event(type,{cancelable:true});Object.assign(event,{pointerId:id,clientX:x,clientY:y});surface.dispatchEvent(event);
  };
  try{
    const input=new KeyboardInput(()=>{});input.enabled=true;
    const touch=new TouchControls(input,stick as unknown as HTMLElement,{style:{transform:''}} as unknown as HTMLElement);
    const look=new CameraLook(canvas as unknown as HTMLCanvasElement);touch.update(true);look.enabled=true;
    pointer(stick,'pointerdown',11,112,64); // Full right strafe, held throughout camera drag.
    pointer(canvas,'pointerdown',22,180,200);
    pointer(canvas,'pointermove',22,180+Math.PI/.012,200);
    input.pendingUse=true;input.pendingDash=true;
    const action=cameraRelative(input.sample(),look.yaw,true);
    assert.ok(Math.abs(action.x)<1e-12&&Math.abs(action.z-1)<1e-12);
    assert.ok(Math.abs(action.aim!.x-1)<1e-12&&Math.abs(action.aim!.z)<1e-12);
    assert.equal(action.useItem,true);assert.equal(action.dash,true);
    const held=cameraRelative(input.sample(),look.yaw,true);
    assert.equal(held.useItem,undefined);assert.equal(held.dash,false);assert.equal(held.z,action.z);
    pointer(canvas,'pointercancel',22,0,0);
    assert.equal(canvas.captured.size,0);assert.equal(stick.captured.size,1);assert.equal(input.sample().x,1);
    const yaw=look.yaw;pointer(canvas,'pointermove',22,900,200);assert.equal(look.yaw,yaw);
    pointer(canvas,'pointerdown',33,200,200);window.dispatchEvent(new Event('resize'));
    assert.equal(canvas.captured.size,0);assert.equal(stick.captured.size,0);assert.equal(input.sample().x,0);
    pointer(stick,'pointerdown',44,112,64);pointer(canvas,'pointerdown',55,200,200);
    input.pendingUse=true;touch.update(false);look.enabled=false;input.clear();input.enabled=false;
    assert.equal(stick.captured.size,0);assert.equal(canvas.captured.size,0);
    const paused=input.sample();assert.equal(paused.x,0);assert.equal(paused.useItem,undefined);
  }finally{globalThis.window=oldWindow;globalThis.document=oldDocument;}
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
