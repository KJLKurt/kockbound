import type {Shot} from '../../shared/content/items.ts';

/** Interpolate positions only; the latest authority owns existence, hits and lifetime. */
export function sampleProjectiles(latest:readonly Shot[],older:readonly Shot[],newer:readonly Shot[],alpha:number):Shot[]{
  const from=new Map(older.map(shot=>[shot.id,shot])),to=new Map(newer.map(shot=>[shot.id,shot]));
  const fraction=Math.max(0,Math.min(1,alpha));
  return latest.flatMap(shot=>{
    const a=from.get(shot.id),b=to.get(shot.id);
    // A remote shot must not jump ahead of the buffered timeline, then back at birth.
    if(!b||b.kind!==shot.kind)return [];
    if(!a||a.kind!==shot.kind)return [{...shot,x:b.x,z:b.z,distance:b.distance}];
    return [{...shot,x:a.x+(b.x-a.x)*fraction,z:a.z+(b.z-a.z)*fraction,distance:a.distance+(b.distance-a.distance)*fraction}];
  });
}
