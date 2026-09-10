import type {Vec2} from './index.ts';
/** Optional horizontal aim is a direction, never a target position or extra movement. */
export function validAim(value:unknown):value is Vec2{
  if(!value||typeof value!=='object'||Array.isArray(value))return false;
  const v=value as Record<string,unknown>;
  return Object.keys(v).length===2&&typeof v.x==='number'&&typeof v.z==='number'&&Number.isFinite(v.x)&&Number.isFinite(v.z)&&Math.hypot(v.x,v.z)>.01&&Math.hypot(v.x,v.z)<=1.000001;
}
