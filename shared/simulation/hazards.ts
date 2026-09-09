import type {World,GameEvent} from '../game-types/index.ts';
import {arenaTiles,warnTile,supported} from '../content/tiles.ts';
import {playerMass} from './item-effects.ts';
type Emit=(w:World,type:GameEvent['type'],x?:number,z?:number,source?:string,target?:string,strength?:number)=>void;
export function stepHazards(w:World,random:(w:World)=>number,emit:Emit){
 if(!w.config.hazards?.length)return;const h=w.hazards??={nextAt:200,serial:0,rocks:[]},now=w.activeTick;
 if(now>=h.nextAt){h.nextAt=now+140;const kind=w.config.hazards[Math.floor(random(w)*w.config.hazards.length)];
  if(kind==='tiles'){const candidates=arenaTiles(w.config.rules.radius,w.config.rules.minimumRadius).filter(t=>t.id!=='core'&&!w.tiles?.[t.id]);if(candidates.length){const tile=candidates[Math.floor(random(w)*candidates.length)];warnTile(w,tile.id);emit(w,'hazardwarning',tile.x,tile.z,undefined,undefined,1);}}
  if(kind==='skyrock'){const live=w.players.filter(p=>p.alive),target=live[Math.floor(random(w)*live.length)];let x=(target?.x??0)+(random(w)-.5)*3,z=(target?.z??0)+(random(w)-.5)*3;if(!supported(w,x,z)){x=0;z=0;}h.rocks.push({id:`sky-${++h.serial}`,x,z,at:now+30});emit(w,'hazardwarning',x,z,undefined,undefined,2);}
  if(kind==='gust'){const angle=random(w)*Math.PI*2;h.gust={dx:Math.cos(angle),dz:Math.sin(angle),startAt:now+20,endAt:now+80};emit(w,'hazardwarning',0,0,undefined,undefined,3);}
 }
 for(const rock of h.rocks)if(now===rock.at){emit(w,'skyimpact',rock.x,rock.z);for(const p of w.players){if(!p.alive)continue;const dx=p.x-rock.x,dz=p.z-rock.z,d=Math.hypot(dx,dz);if(d>1.6)continue;const push=4/playerMass(p);p.ix+=(d?dx/d:p.facingX)*push;p.iz+=(d?dz/d:p.facingZ)*push;p.stunnedUntil=Math.max(p.stunnedUntil??0,now+16);p.flattenedUntil=now+16;p.dashTicks=0;p.vx=p.vz=0;emit(w,'hit',p.x,p.z,undefined,p.id,push);}}
 h.rocks=h.rocks.filter(r=>now<r.at+10);
 if(h.gust){if(now>=h.gust.startAt&&now<h.gust.endAt)for(const p of w.players)if(p.alive){const push=4*w.config.rules.tickSeconds/playerMass(p);p.ix+=h.gust.dx*push;p.iz+=h.gust.dz*push;}if(now>=h.gust.endAt)delete h.gust;}
}
