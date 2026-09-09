import type {Input} from '../../shared/game-types/index.ts';
export type CameraMode='arena'|'third'|'first';
export function cameraRelative(input:Input,yaw:number):Input{const c=Math.cos(yaw),s=Math.sin(yaw);return {...input,x:input.x*c-input.z*s,z:input.x*s+input.z*c};}
export class CameraLook {
  yaw=0;pitch=-.08;private active=false;private release=()=>{};private pointer:number|null=null;private x=0;private y=0;
  get enabled(){return this.active;}
  set enabled(value:boolean){if(!value&&this.active)this.release();this.active=value;}
  constructor(canvas:HTMLCanvasElement){
    canvas.addEventListener('pointerdown',event=>{if(!this.enabled||this.pointer!==null)return;this.pointer=event.pointerId;this.x=event.clientX;this.y=event.clientY;canvas.setPointerCapture(event.pointerId);event.preventDefault();});
    canvas.addEventListener('pointermove',event=>{if(!this.enabled||event.pointerId!==this.pointer)return;this.yaw+=(event.clientX-this.x)*.006;this.pitch=Math.max(-.45,Math.min(.25,this.pitch-(event.clientY-this.y)*.003));this.x=event.clientX;this.y=event.clientY;event.preventDefault();});
    const clear=()=>{const pointer=this.pointer;this.pointer=null;if(pointer!==null&&canvas.hasPointerCapture(pointer))canvas.releasePointerCapture(pointer);};
    this.release=clear;
    for(const name of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(name,event=>{if((event as PointerEvent).pointerId===this.pointer)clear();});
    window.addEventListener('blur',clear);window.addEventListener('resize',clear);
  }
}
