import type {GroundItem} from './items.ts';

/** Strict range; equal distances retain authoritative ground-list order. */
export function closestGroundItem(items:readonly GroundItem[],player:{id:string;x:number;z:number},now:number,range:number,includeCrates=false):GroundItem|undefined{
  let closest:GroundItem|undefined,distance=range;
  for(const item of items){
    if((item.kind==='crate'&&!includeCrates)||item.thrown||item.armedAt!==undefined||item.expiresAt<=now||(item.blockedId===player.id&&now<item.blockedUntil))continue;
    const separation=Math.hypot(item.x-player.x,item.z-player.z);
    if(separation<distance){closest=item;distance=separation;}
  }
  return closest;
}
