import type {Player} from '../game-types/index.ts';
export const playerMass=(p:Player)=>p.heldItem?.kind==='big'?1.8:1;
export const playerRadius=(p:Player)=>p.heldItem?.kind==='big'?.65:.45;
