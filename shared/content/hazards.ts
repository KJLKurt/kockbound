export const HAZARD_DEFINITIONS={tiles:{name:'Falling tiles'},skyrock:{name:'Falling rocks'},gust:{name:'Wind gusts'}} as const;
export type HazardId=keyof typeof HAZARD_DEFINITIONS;
export type RockStrike={id:string;x:number;z:number;at:number};
export type HazardState={nextAt:number;serial:number;rocks:RockStrike[];gust?:{dx:number;dz:number;startAt:number;endAt:number}};
export function validHazards(v:unknown):v is HazardId[]{return Array.isArray(v)&&v.length<=3&&new Set(v).size===v.length&&v.every(id=>typeof id==='string'&&Object.hasOwn(HAZARD_DEFINITIONS,id));}
