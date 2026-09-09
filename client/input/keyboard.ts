import type { Input } from '../../shared/game-types/index.ts';
export class KeyboardInput {
  keys = new Set<string>();
  sequence = 0;
  pendingDash = false;
  pendingUse=false;pendingDrop=false;
  facingX = 0;
  facingZ = -1;
  enabled = false;
  touchX=0;touchZ=0;
  constructor(onPause: () => void) {
    window.addEventListener('keydown',e=>{
      if ((e.target as HTMLElement)?.matches('input,select,textarea')) return;
      if (this.enabled && ['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
      if (e.code === 'Escape' && !e.repeat) onPause();
      if (!this.enabled) return;
      this.keys.add(e.code);
      const x = Number(this.keys.has('KeyD') || this.keys.has('ArrowRight'))-Number(this.keys.has('KeyA') || this.keys.has('ArrowLeft'));
      const z = Number(this.keys.has('KeyS') || this.keys.has('ArrowDown'))-Number(this.keys.has('KeyW') || this.keys.has('ArrowUp'));
      if (x || z) { this.facingX=x;this.facingZ=z; }
      if (e.code==='Space' && !e.repeat) this.pendingDash=true;
      if(e.code==='KeyE'&&!e.repeat)this.pendingUse=true;if(e.code==='KeyQ'&&!e.repeat)this.pendingDrop=true;
    });
    window.addEventListener('keyup',e=>this.keys.delete(e.code));
    window.addEventListener('blur',()=>this.clear());
  }
  clear() {this.keys.clear();this.pendingDash=false;this.pendingUse=this.pendingDrop=false;this.touchX=this.touchZ=0;}
  touch(x:number,z:number){this.touchX=x;this.touchZ=z;if(x||z){this.facingX=x;this.facingZ=z;}}
  sample(): Input {
    const held=(...keys:string[])=>keys.some(k=>this.keys.has(k))?1:0;
    const result:Input={participantId:'p1',sequence:++this.sequence,x:this.enabled?held('KeyD','ArrowRight')-held('KeyA','ArrowLeft'):0,z:this.enabled?held('KeyS','ArrowDown')-held('KeyW','ArrowUp'):0,dash:this.enabled&&this.pendingDash,...(this.enabled&&this.pendingUse?{useItem:true}:{}),...(this.enabled&&this.pendingDrop?{dropItem:true}:{})};
    if(this.enabled&&(this.touchX||this.touchZ)){result.x=this.touchX;result.z=this.touchZ;}
    if (result.dash && !result.x && !result.z) {result.x=this.facingX;result.z=this.facingZ;}
    this.pendingDash=false;this.pendingUse=this.pendingDrop=false;return result;
  }
}
