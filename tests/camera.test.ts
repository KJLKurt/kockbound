import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cameraRelative} from '../client/input/camera-controls.ts';
test('camera-relative controls preserve input identity, speed and dash while rotating movement',()=>{
  const forward={participantId:'p2',sequence:17,x:0,z:-1,dash:true};
  const east=cameraRelative(forward,Math.PI/2);assert.ok(Math.abs(east.x-1)<1e-12);assert.ok(Math.abs(east.z)<1e-12);assert.equal(east.sequence,17);assert.equal(east.dash,true);assert.equal(east.participantId,'p2');
  for(let yaw=-6;yaw<=6;yaw+=.1){const analog={...forward,x:.3,z:-.4};const result=cameraRelative(analog,yaw);assert.ok(Math.abs(Math.hypot(result.x,result.z)-.5)<1e-12);}
  assert.deepEqual(cameraRelative(forward,0),forward);assert.deepEqual(cameraRelative({...forward,x:0,z:0},1),{...forward,x:0,z:0});
});

test('mouse look turns without held buttons, releases on pause and keeps drag after denial',async()=>{
  const oldWindow=globalThis.window,oldDocument=globalThis.document;
  const doc=Object.assign(new EventTarget(),{pointerLockElement:null as unknown,exitPointerLock(){this.pointerLockElement=null;doc.dispatchEvent(new Event('pointerlockchange'));}});
  globalThis.window=new EventTarget() as unknown as Window & typeof globalThis;globalThis.document=doc as unknown as Document;
  class Canvas extends EventTarget{captured=new Set<number>();deny=false;requestPointerLock(){if(this.deny)return Promise.reject(new Error('denied'));doc.pointerLockElement=this;doc.dispatchEvent(new Event('pointerlockchange'));return Promise.resolve();}setPointerCapture(id:number){this.captured.add(id);}hasPointerCapture(id:number){return this.captured.has(id);}releasePointerCapture(id:number){this.captured.delete(id);}}
  const canvas=new Canvas();const send=(target:EventTarget,type:string,props:object)=>{const e=new Event(type,{cancelable:true});Object.assign(e,props);target.dispatchEvent(e);};
  try{
    const {CameraLook}=await import('../client/input/camera-controls.ts');let unlocked=0;const look=new CameraLook(canvas as unknown as HTMLCanvasElement,()=>unlocked++);look.enabled=true;
    const down={pointerType:'mouse',button:0,pointerId:1,clientX:100,clientY:100};send(canvas,'pointerdown',down);assert.equal(look.locked,true);
    send(canvas,'pointerup',down);send(doc,'mousemove',{movementX:100,movementY:100});assert.equal(look.yaw,.6);assert.equal(look.pitch,-.38);
    look.enabled=false;assert.equal(look.locked,false);send(doc,'mousemove',{movementX:100,movementY:0});assert.equal(look.yaw,.6);
    look.enabled=true;send(canvas,'pointerdown',down);doc.exitPointerLock();assert.ok(unlocked>=1);
    canvas.deny=true;send(canvas,'pointerup',down);send(canvas,'pointerdown',down);await Promise.resolve();assert.match(look.hint,/Mouse capture unavailable/);
    send(canvas,'pointermove',{...down,clientX:150});assert.ok(Math.abs(look.yaw-.9)<1e-12);
    send(canvas,'pointerup',down);canvas.setPointerCapture=()=>{throw new Error('capture unavailable');};send(canvas,'pointerdown',down);send(doc,'pointerup',down);const stopped=look.yaw;send(canvas,'pointermove',{...down,clientX:900});assert.equal(look.yaw,stopped);canvas.deny=false;send(canvas,'pointerdown',{...down,pointerType:'touch'});assert.equal(look.locked,false);send(canvas,'pointerup',down);look.mouseLook=false;look.mouseLook=true;send(canvas,'pointerdown',down);assert.equal(look.locked,true,'enabling mouse look must allow retry after a previous denial');look.mouseLook=false;assert.equal(look.locked,false,'disabling mouse look releases capture immediately');
  }finally{globalThis.window=oldWindow;globalThis.document=oldDocument;}
});




test('keyboard camera turning is continuous, frame-rate independent and clears on pause or blur',async()=>{
  const oldWindow=globalThis.window,oldDocument=globalThis.document;
  globalThis.window=new EventTarget() as unknown as Window & typeof globalThis;globalThis.document=new EventTarget() as unknown as Document;
  try{
    const {CameraLook}=await import('../client/input/camera-controls.ts');const look=new CameraLook(new EventTarget() as HTMLCanvasElement);
    const key=(type:string,code:string)=>{const e=new Event(type,{cancelable:true});Object.assign(e,{code});window.dispatchEvent(e);};
    look.enabled=true;key('keydown','KeyL');for(let i=0;i<60;i++)look.update(1/60);assert.ok(Math.abs(look.yaw-2.4)<1e-12);
    key('keydown','KeyJ');look.update(.1);assert.ok(Math.abs(look.yaw-2.4)<1e-12);key('keyup','KeyL');for(let i=0;i<30;i++)look.update(1/30);assert.ok(Math.abs(look.yaw)<1e-12);
    look.enabled=false;look.enabled=true;look.update(.1);assert.ok(Math.abs(look.yaw)<1e-12);
    key('keydown','KeyL');window.dispatchEvent(new Event('blur'));look.update(.1);assert.ok(Math.abs(look.yaw)<1e-12);
    look.enabled=false;key('keydown','KeyL');look.enabled=true;look.update(.1);assert.ok(Math.abs(look.yaw)<1e-12);
  }finally{globalThis.window=oldWindow;globalThis.document=oldDocument;}
});

