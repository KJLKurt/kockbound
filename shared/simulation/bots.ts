import {supported,tileAt,rescuePoint} from '../content/tiles.ts';
import type { Input, World } from '../game-types/index.ts';
import { random } from './index.ts';

export function botInputs(w: World): Input[] {
  if (w.phase !== 'active') return [];
  const inputs: Input[] = [];
  for (const p of w.players) {
    if (p.control !== 'bot' || !p.alive) continue;
    const mem = w.bots[p.id] ??= { nextTick: 0, x: 0, z: 0, sequence: 0 };
    let dash = false;
    if (w.tick >= mem.nextTick) {
      mem.nextTick = w.tick+5;
      const target = w.players.filter(q=>q.alive && q.id!==p.id).sort((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(b.x-p.x,b.z-p.z))[0];
      const distanceToEdge = w.radius-Math.hypot(p.x,p.z);
      if (distanceToEdge < 2.2 || !target) { mem.x = -p.x; mem.z = -p.z; }
      else {
        mem.x = target.x-p.x+(random(w)-.5)*.65; mem.z = target.z-p.z+(random(w)-.5)*.65;
        const d = Math.hypot(mem.x,mem.z);
        const endX = p.x+mem.x/Math.max(.001,d)*3, endZ = p.z+mem.z/Math.max(.001,d)*3;
        dash = d > .9 && d < 3.2 && Math.hypot(endX,endZ) < w.radius-.8 && random(w) > .18;
      }
      const danger=w.items?.ground.find(i=>((i.kind==='bomb'&&i.expiresAt-w.activeTick<25)||(i.kind==='pod'&&i.armedAt!==undefined))&&Math.hypot(i.x-p.x,i.z-p.z)<4);
      const loot=!p.heldItem?w.items?.ground.find(i=>i.armedAt===undefined&&!i.thrown&&i.expiresAt-w.activeTick>40&&Math.hypot(i.x-p.x,i.z-p.z)<4):undefined;
      if(danger){
        mem.x=p.x-danger.x;mem.z=p.z-danger.z;dash=false;
        // Coincident centers have no away vector; choose a stable inward escape.
        if(Math.hypot(mem.x,mem.z)<.01){mem.x=-p.x;mem.z=-p.z;if(Math.hypot(mem.x,mem.z)<.01){mem.x=1;mem.z=0;}}
      }else if(loot&&distanceToEdge>2.2){mem.x=loot.x-p.x;mem.z=loot.z-p.z;dash=loot.kind==='crate'&&Math.hypot(mem.x,mem.z)<3;}
      const strike=w.hazards?.rocks.find(r=>r.at>=w.activeTick&&Math.hypot(r.x-p.x,r.z-p.z)<2.6);if(strike){mem.x=p.x-strike.x;mem.z=p.z-strike.z;if(Math.hypot(mem.x,mem.z)<.01){mem.x=1;mem.z=0;}dash=false;}
      const here=tileAt(w,p.x,p.z),lenBefore=Math.hypot(mem.x,mem.z),nx=mem.x/Math.max(.001,lenBefore),nz=mem.z/Math.max(.001,lenBefore);
      if((here&&w.tiles?.[here])||![.5,1,2].every(d=>supported(w,p.x+nx*d,p.z+nz*d))){const safe=rescuePoint(w,p.x,p.z);mem.x=safe.x-p.x;mem.z=safe.z-p.z;dash=false;}
      if(dash&&![.5,1,2,3].every(d=>supported(w,p.x+nx*d,p.z+nz*d)))dash=false;
      const len = Math.hypot(mem.x,mem.z); if (len > 0) { mem.x/=len; mem.z/=len; }
    }
    inputs.push({participantId:p.id,sequence:++mem.sequence,x:mem.x,z:mem.z,dash,...(p.heldItem?{useItem:true}:{})});
  }
  return inputs;
}

