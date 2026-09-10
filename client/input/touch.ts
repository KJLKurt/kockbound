import type {KeyboardInput} from './keyboard.ts';

/** Radial dead zone with analog travel, matching the ordinary input contract. */
export function stickVector(dx:number,dy:number,radius=48){
  const length=Math.hypot(dx,dy),travel=Math.min(1,length/radius);
  if(!Number.isFinite(length)||travel<=.14)return {x:0,z:0};
  const strength=(travel-.14)/.86;return {x:dx/length*strength,z:dy/length*strength};
}

export class TouchControls {
  private pointer:number|null=null;private origin={x:0,y:0};private active=false;
  private input:KeyboardInput;private pad:HTMLElement;private knob:HTMLElement;
  constructor(input:KeyboardInput,pad:HTMLElement,knob:HTMLElement){
    this.input=input;this.pad=pad;this.knob=knob;
    pad.addEventListener('pointerdown',event=>{
      if(!this.active||this.pointer!==null)return;
      event.preventDefault();this.pointer=event.pointerId;
      const rect=pad.getBoundingClientRect();this.origin={x:rect.left+rect.width/2,y:rect.top+rect.height/2};
      try{pad.setPointerCapture(event.pointerId);}catch{this.clear();return;}
      this.move(event);
    });
    pad.addEventListener('pointermove',event=>{if(event.pointerId===this.pointer)this.move(event);});
    for(const name of ['pointerup','pointercancel','lostpointercapture'])pad.addEventListener(name,event=>{if((event as PointerEvent).pointerId===this.pointer)this.clear();});
    window.addEventListener('blur',()=>this.clear());window.addEventListener('resize',()=>this.clear());
    document.addEventListener('visibilitychange',()=>{if(document.hidden)this.clear();});
  }
  private move(event:PointerEvent){
    event.preventDefault();const dx=event.clientX-this.origin.x,dy=event.clientY-this.origin.y;
    const vector=stickVector(dx,dy);this.input.touch(vector.x,vector.z);
    const length=Math.hypot(dx,dy),scale=length>48?48/length:1;
    this.knob.style.transform=`translate(${dx*scale}px,${dy*scale}px)`;
  }
  clear(){const pointer=this.pointer;this.pointer=null;this.input.touch(0,0);this.knob.style.transform='';if(pointer!==null&&this.pad.hasPointerCapture(pointer))this.pad.releasePointerCapture(pointer);}
  update(active:boolean){if(!active&&this.active)this.clear();this.active=active;this.pad.setAttribute('aria-disabled',String(!active));}
}
