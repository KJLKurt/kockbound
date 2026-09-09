import type {World,Input,GameEvent} from '../game-types/index.ts';
import {supported} from '../content/tiles.ts';
type Emit=(w:World,type:GameEvent['type'],x?:number,z?:number,source?:string,target?:string,strength?:number)=>void;
export function stepPods(w:World,commands:readonly Input[],emit:Emit){
 const ground=w.items!.ground,now=w.activeTick,blasts:{x:number;z:number;owner:string|null;pod?:boolean}[]=[];
 for(const p of w.players){const command=commands.find(c=>c.participantId===p.id),item=p.heldItem;if(!p.alive||item?.kind!=='pod')continue;
  if(now>=item.expiresAt||(command?.useItem&&!command.dropItem&&now>=(p.stunnedUntil??0))){const x=p.x+p.facingX*.8,z=p.z+p.facingZ*.8;ground.push({...item,x,z,vx:0,vz:0,thrown:false,owner:p.id,blockedId:null,blockedUntil:0,armedAt:now+15,expiresAt:now+215});p.heldItem=null;emit(w,'podarm',x,z,p.id);}
 }
 for(let i=ground.length-1;i>=0;i--){const pod=ground[i];if(pod.kind!=='pod'||!supported(w,pod.x,pod.z))continue;
  if(pod.armedAt===undefined&&now>=pod.expiresAt){pod.armedAt=now+15;pod.expiresAt=now+215;emit(w,'podarm',pod.x,pod.z);}
  if(pod.armedAt!==undefined&&now>=pod.armedAt&&now<pod.expiresAt&&w.players.some(p=>p.alive&&Math.hypot(p.x-pod.x,p.z-pod.z)<1.1)){blasts.push({x:pod.x,z:pod.z,owner:pod.owner,pod:true});ground.splice(i,1);}
 }return blasts;
}
