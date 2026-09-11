import {validPartyOptions} from './party.ts';
import type {PartyOptions} from '../game-types/index.ts';
import {validHazards,type HazardId} from './hazards.ts';
export const ITEM_DEFINITIONS={pod:{name:'Spring pod',durationTicks:400,blastRadius:2.5,push:8,stunTicks:6},crate:{name:'Mystery crate',durationTicks:400},remover:{name:'Platform remover',durationTicks:400},bomb:{name:'Cloud bomb',fuseTicks:100,throwTicks:20,blastRadius:3.5,push:10,stunTicks:12},shovel:{name:'Push shovel',durationTicks:240},big:{name:'Big mode',durationTicks:200},helicopter:{name:'Helicopter hat',durationTicks:600},blaster:{name:'Bubble blaster',durationTicks:400,charges:5,speed:16,range:18,radius:.22,push:3,cooldownTicks:8},wind:{name:'Wind blaster',durationTicks:400,charges:1,speed:24,range:24,radius:1.1,push:14,cooldownTicks:8},rock:{name:'Rolling rock',durationTicks:400,charges:1,speed:8,range:24,radius:.85,push:8,cooldownTicks:8}} as const;
export type ItemId=keyof typeof ITEM_DEFINITIONS;
export type HeldItem={id:string;kind:ItemId;expiresAt:number;activated?:boolean;charges?:number;readyAt?:number};
export type ShotKind='blaster'|'wind'|'rock';
export const isRanged=(kind:ItemId):kind is ShotKind=>kind==='blaster'||kind==='wind'||kind==='rock';
export type Shot={id:string;kind:ShotKind;x:number;z:number;dx:number;dz:number;distance:number;owner:string;hitTargets:string[]};
export type GroundItem=HeldItem&{x:number;z:number;vx:number;vz:number;thrown:boolean;owner:string|null;blockedId:string|null;blockedUntil:number;armedAt?:number};
export type ItemState={nextSpawn:number;serial:number;ground:GroundItem[];shots?:Shot[]};
export function validItems(value:unknown):value is ItemId[]{return Array.isArray(value)&&value.length<=Object.keys(ITEM_DEFINITIONS).length&&new Set(value).size===value.length&&value.every(id=>typeof id==='string'&&Object.hasOwn(ITEM_DEFINITIONS,id));}
export function validRoomOptions(value:unknown):value is PartyOptions&{humanCount:number;items?:ItemId[];hazards?:HazardId[]}{if(!value||typeof value!=='object'||Array.isArray(value))return false;const v=value as Record<string,unknown>;return Object.keys(v).every(k=>['humanCount','items','hazards','modeId','totalCount','teamSize','bossVariant'].includes(k))&&Number.isInteger(v.humanCount)&&(v.humanCount as number)>=1&&(v.humanCount as number)<=12&&(v.items===undefined||validItems(v.items))&&(v.hazards===undefined||validHazards(v.hazards))&&validPartyOptions(v,Math.max(4,v.humanCount as number))&&(v.totalCount===undefined||(v.totalCount as number)>=(v.humanCount as number));}
