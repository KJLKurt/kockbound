import type {Input} from '../../shared/game-types/index.ts';
export type CameraMode='arena'|'third'|'first';
export function cameraRelative(input:Input,yaw:number,aim=false):Input{const c=Math.cos(yaw),s=Math.sin(yaw);return {...input,x:input.x*c-input.z*s,z:input.x*s+input.z*c,...(aim?{aim:{x:s,z:-c}}:{})};}
export class CameraLook {
  private canvas:HTMLCanvasElement;private turnKeys=new Set<string>();private useMouseLook=true;private lockFailed=false;private wasLocked=false;
  get mouseLook(){return this.useMouseLook;}
  set mouseLook(value:boolean){this.useMouseLook=value;if(value)this.lockFailed=false;else this.release();}
  get locked(){return document.pointerLockElement===this.canvas;}
  get hint(){return this.locked?'Mouse to look · WASD to move · E to use · Esc to pause':this.mouseLook&&!this.lockFailed?'Click arena or J/L to turn · Touch: drag to aim':this.mouseLook&&this.lockFailed?'Mouse capture unavailable · Drag or J/L to turn':'Drag or J/L to turn · WASD or stick to move';}
  yaw=0;pitch=-.08;private active=false;private release=()=>{};private pointer:number|null=null;private x=0;private y=0;
  update(dt:number){if(this.enabled)this.yaw+=(Number(this.turnKeys.has('KeyL'))-Number(this.turnKeys.has('KeyJ')))*2.4*Math.max(0,Math.min(.1,dt));}
  get enabled(){return this.active;}
  set enabled(value:boolean){const release=!value&&this.active;this.active=value;if(release){this.turnKeys.clear();this.release();}}
  constructor(canvas:HTMLCanvasElement,onUnlock:()=>void=()=>{}){this.canvas=canvas;
    window.addEventListener('keydown',event=>{if(!this.enabled||!['KeyJ','KeyL'].includes(event.code)||(event.target as HTMLElement)?.matches?.('input,select,textarea'))return;this.turnKeys.add(event.code);event.preventDefault();});
    window.addEventListener('keyup',event=>this.turnKeys.delete(event.code));
    const rotate=(x:number,y:number)=>{this.yaw+=x*.006;this.pitch=Math.max(-.45,Math.min(.25,this.pitch-y*.003));};
    canvas.addEventListener('pointerdown',event=>{
      if(!this.enabled||this.locked||event.pointerType!=='mouse'||event.button!==0||!this.mouseLook||this.lockFailed||!canvas.requestPointerLock)return;
      try{const request=canvas.requestPointerLock();request?.catch(()=>{this.lockFailed=true;});}catch{this.lockFailed=true;}
    });
    canvas.addEventListener('pointerdown',event=>{if(!this.enabled||this.locked||this.pointer!==null)return;this.pointer=event.pointerId;this.x=event.clientX;this.y=event.clientY;try{canvas.setPointerCapture(event.pointerId);}catch{/* Pointer lock transitions may temporarily reject capture; canvas dragging remains available. */}event.preventDefault();});
    canvas.addEventListener('pointermove',event=>{if(!this.enabled||this.locked||event.pointerId!==this.pointer)return;rotate(event.clientX-this.x,event.clientY-this.y);this.x=event.clientX;this.y=event.clientY;event.preventDefault();});
    document.addEventListener('mousemove',event=>{if(this.enabled&&this.locked)rotate(event.movementX,event.movementY);});
    const clear=()=>{const pointer=this.pointer;this.pointer=null;if(pointer!==null&&canvas.hasPointerCapture(pointer))canvas.releasePointerCapture(pointer);};
    this.release=()=>{clear();if(this.locked)document.exitPointerLock();};
    document.addEventListener('pointerlockerror',()=>{this.lockFailed=true;});
    document.addEventListener('pointerlockchange',()=>{const locked=this.locked;if(locked){clear();if(!this.enabled||!this.mouseLook){document.exitPointerLock();return;}}const lost=this.wasLocked&&!locked;this.wasLocked=locked;if(lost&&this.enabled)onUnlock();});
    for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,event=>{if((event as PointerEvent).pointerId===this.pointer)clear();});
    for(const name of ['pointerup','pointercancel'])document.addEventListener(name,event=>{if((event as PointerEvent).pointerId===this.pointer)clear();});
    window.addEventListener('blur',()=>{this.turnKeys.clear();this.release();});window.addEventListener('resize',()=>this.release());
  }
}








