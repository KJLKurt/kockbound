import {ITEM_DEFINITIONS,isRanged} from '../content/items.ts';
import type {GameEvent,Input,World} from '../game-types/index.ts';
import {playerMass,playerRadius} from './item-effects.ts';
type Emit=(w:World,type:GameEvent['type'],x?:number,z?:number,source?:string,target?:string,strength?:number)=>void;
/** Ray intervals avoid tunnelling, including narrow obstacles and glancing player hits. */
function circle(x:number,z:number,dx:number,dz:number,cx:number,cz:number,r:number){
  const ox=x-cx,oz=z-cz,b=ox*dx+oz*dz,c=ox*ox+oz*oz-r*r;
  if(c<=0)return 0;const d=b*b-c;return d<0?Infinity:(-b-Math.sqrt(d)>=0?-b-Math.sqrt(d):Infinity);
}
function box(x:number,z:number,dx:number,dz:number,cx:number,cz:number,hx:number,hz:number){
  let near=0,far=Infinity;
  for(const [origin,direction,center,half]of [[x,dx,cx,hx],[z,dz,cz,hz]]){
    if(Math.abs(direction)<1e-9){if(Math.abs(origin-center)>half)return Infinity;continue;}
    const a=(center-half-origin)/direction,b=(center+half-origin)/direction;
    near=Math.max(near,Math.min(a,b));far=Math.min(far,Math.max(a,b));if(near>far)return Infinity;
  }return near;
}
export function stepRanged(w:World,commands:readonly Input[],emit:Emit){
  const state=w.items!;const shots=state.shots??=[];
  for(const p of w.players){const item=p.heldItem,command=commands.find(c=>c.participantId===p.id);
    if(!p.alive||!item||!isRanged(item.kind)||!command?.useItem||command.dropItem||w.activeTick<(p.stunnedUntil??0)||w.activeTick<(item.readyAt??0)||w.activeTick>=item.expiresAt||shots.length>=64)continue;
    const def=ITEM_DEFINITIONS[item.kind];if((item.charges??def.charges)<=0)continue;
    // Aim from this accepted movement command, including the first frame of a turn.
    const length=Math.hypot(command.x,command.z),dx=length>.01?command.x/length:p.facingX,dz=length>.01?command.z/length:p.facingZ;
    shots.push({id:`shot-${++state.serial}`,kind:item.kind,x:p.x,z:p.z,dx,dz,distance:0,owner:p.id,hitTargets:[]});
    item.charges=(item.charges??def.charges)-1;item.readyAt=w.activeTick+def.cooldownTicks;
    emit(w,'shot',p.x,p.z,p.id,undefined,item.kind==='blaster'?1:item.kind==='wind'?2:3);
    if(item.charges===0)p.heldItem=null;
  }
  for(let i=shots.length-1;i>=0;i--){const shot=shots[i],def=ITEM_DEFINITIONS[shot.kind];let travel=Math.min(def.speed*w.config.rules.tickSeconds,def.range-shot.distance),blocked=false;
    for(const o of w.config.obstacles){const distance=box(shot.x,shot.z,shot.dx,shot.dz,o.x,o.z,o.halfX+def.radius,o.halfZ+def.radius);if(distance<=travel){travel=distance;blocked=true;}}
    const hits=w.players.filter(p=>p.alive&&p.id!==shot.owner&&!shot.hitTargets.includes(p.id)).map(p=>({p,d:circle(shot.x,shot.z,shot.dx,shot.dz,p.x,p.z,def.radius+playerRadius(p))})).filter(h=>h.d<travel).sort((a,b)=>a.d-b.d||a.p.id.localeCompare(b.p.id,'en'));
    for(const {p,d}of hits){const distance=shot.distance+d,base=shot.kind==='wind'?Math.max(w.config.rules.hitImpulse,def.push-(def.push-w.config.rules.hitImpulse)*distance/def.range):def.push,power=base*(1+p.vulnerability)/playerMass(p);
      p.ix+=shot.dx*power;p.iz+=shot.dz*power;p.lastHitTick=w.tick;p.lastHitBy=shot.owner;p.vulnerability=Math.min(w.config.rules.vulnerabilityCap,p.vulnerability+w.config.rules.vulnerabilityGain);
      if(shot.kind==='rock'){p.stunnedUntil=Math.max(p.stunnedUntil??0,w.activeTick+20);p.flattenedUntil=w.activeTick+20;p.dashTicks=0;p.vx=p.vz=0;}
      const owner=w.players.find(q=>q.id===shot.owner);if(owner)owner.hits++;shot.hitTargets.push(p.id);emit(w,'hit',p.x,p.z,shot.owner,p.id,power);
      if(shot.kind==='blaster'){travel=d;blocked=true;break;}
    }
    shot.x+=shot.dx*travel;shot.z+=shot.dz*travel;shot.distance+=travel;
    if(blocked||shot.distance>=def.range)shots.splice(i,1);
  }
}
