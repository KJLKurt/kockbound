import {validAim} from '../game-types/input.ts';
import {validAppearance,validSkin,type Appearance,type Skin} from '../content/characters.ts';
import {arenaTiles} from '../content/tiles.ts';
import {ITEM_DEFINITIONS,isRanged} from '../content/items.ts';
import { CONTENT_RELEASE, PROTOCOL_VERSION } from '../content/arena.ts';
import type { Input, World } from '../game-types/index.ts';
import { validateConfig } from '../content/arena.ts';

export type Admission = {roomId:string;participantId:string;ticket:string;protocolVersion:string;contentReleaseId:string};

export const MAX_INPUT_BYTES = 1024;
export type ClientMessage =
  | { type: 'ready'; protocolVersion: string; contentReleaseId: string;appearance?:Appearance;skin?:Skin }
  | { type: 'input'; protocolVersion: string; command: Input }
  | { type: 'neutral'; protocolVersion: string; sequence: number };
export type RoomPhase = 'waiting' | 'countdown' | 'active' | 'results' | 'cancelled';
export type ServerMessage =
  | { type: 'snapshot'; protocolVersion: string; contentReleaseId: string; roomPhase: RoomPhase; acknowledgedSequence: number; nextSequence: number; world: World; rewardsEnabled: false }
  | { type: 'error'; code: string }
  | { type: 'cancelled'; matchId: string; reason: string; rewardsEnabled: false };

const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const keys = (v: Record<string, unknown>, expected: string[]) => Object.keys(v).length === expected.length && expected.every(k => Object.hasOwn(v,k));
const sequence = (v: unknown): v is number => Number.isSafeInteger(v) && (v as number) >= 0;

/** Reject unknown fields as well as unknown message kinds: positions/rewards never reach authority. */
export function parseClientMessage(raw: unknown): ClientMessage | null {
  if (typeof raw !== 'string' || raw.length > MAX_INPUT_BYTES || new TextEncoder().encode(raw).length > MAX_INPUT_BYTES) return null;
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return null; }
  if (!record(value) || value.protocolVersion !== PROTOCOL_VERSION) return null;
  if (value.type === 'ready' && keys(value,['type','protocolVersion','contentReleaseId',...('appearance' in value?['appearance']:[]),...('skin' in value?['skin']:[])]) && (value.appearance===undefined||validAppearance(value.appearance)) && (value.skin===undefined||validSkin(value.skin)) && value.contentReleaseId === CONTENT_RELEASE) return value as ClientMessage;
  if (value.type === 'neutral' && keys(value,['type','protocolVersion','sequence']) && sequence(value.sequence)) return value as ClientMessage;
  if (value.type !== 'input' || !keys(value,['type','protocolVersion','command']) || !record(value.command)) return null;
  const c = value.command;
  if (!keys(c,['participantId','sequence','x','z','dash',...('useItem' in c?['useItem']:[]),...('dropItem' in c?['dropItem']:[]),...('aim' in c?['aim']:[])]) || ('useItem' in c&&typeof c.useItem!=='boolean') || ('dropItem' in c&&typeof c.dropItem!=='boolean') || typeof c.participantId !== 'string' || !/^p\d{1,2}$/.test(c.participantId) || !sequence(c.sequence) || typeof c.dash !== 'boolean') return null;
  if ('aim' in c&&!validAim(c.aim))return null;
  if (typeof c.x !== 'number' || typeof c.z !== 'number' || !Number.isFinite(c.x) || !Number.isFinite(c.z) || Math.hypot(c.x,c.z) > 1.000001) return null;
  return value as ClientMessage;
}

/** Validate snapshots before they reach animation, UI or prediction. */
export function parseServerMessage(raw: unknown): ServerMessage | null {
  if(typeof raw!=='string' || raw.length>131072)return null;
  try {
    const m=JSON.parse(raw);if(!record(m))return null;
    if(m.type==='error')return typeof m.code==='string'&&m.code.length<=80?m as ServerMessage:null;
    if(m.type==='cancelled')return typeof m.matchId==='string'&&m.matchId.length<=100&&typeof m.reason==='string'&&m.reason.length<=200&&m.rewardsEnabled===false?m as ServerMessage:null;
    if(m.type!=='snapshot'||m.protocolVersion!==PROTOCOL_VERSION||m.contentReleaseId!==CONTENT_RELEASE||m.rewardsEnabled!==false||!['waiting','countdown','active','results'].includes(String(m.roomPhase)))return null;
    if(!Number.isSafeInteger(m.acknowledgedSequence)||(m.acknowledgedSequence as number)<-1||!sequence(m.nextSequence))return null;
    const w=m.world as World;validateConfig(w.config);
    const held=(item:unknown)=>item===null||item===undefined||(record(item)&&typeof item.kind==='string'&&Object.hasOwn(ITEM_DEFINITIONS,item.kind)&&(item.activated===undefined||typeof item.activated==='boolean')&&(item.charges===undefined||(sequence(item.charges)&&item.charges<=5))&&(item.readyAt===undefined||sequence(item.readyAt))&&typeof item.id==='string'&&item.id.length<=80&&sequence(item.expiresAt));
    if(w.items!==undefined&&(!record(w.items)||!sequence(w.items.nextSpawn)||!sequence(w.items.serial)||!Array.isArray(w.items.ground)||w.items.ground.length>32||w.items.ground.some(i=>!held(i)||!i||![i.x,i.z,i.vx,i.vz].every(n=>Number.isFinite(n)&&Math.abs(n)<10000)||(i.armedAt!==undefined&&(i.kind!=='pod'||!sequence(i.armedAt)))||typeof i.thrown!=='boolean'||!sequence(i.blockedUntil)||(i.owner!==null&&!w.config.roster.some(p=>p.id===i.owner))||(i.blockedId!==null&&!w.config.roster.some(p=>p.id===i.blockedId)))))return null;
    if(w.items?.shots!==undefined&&(!Array.isArray(w.items.shots)||w.items.shots.length>64||w.items.shots.some(s=>!record(s)||!isRanged(s.kind)||typeof s.id!=='string'||s.id.length>80||![s.x,s.z,s.dx,s.dz,s.distance].every(n=>Number.isFinite(n)&&Math.abs(n)<10000)||Math.abs(Math.hypot(s.dx,s.dz)-1)>.00001||s.distance<0||s.distance>24||!w.config.roster.some(p=>p.id===s.owner)||!Array.isArray(s.hitTargets)||s.hitTargets.length>12||s.hitTargets.some(id=>!w.config.roster.some(p=>p.id===id)))))return null;
    if(w.hazards!==undefined){const h=w.hazards;if(!record(h)||!sequence(h.nextAt)||!sequence(h.serial)||!Array.isArray(h.rocks)||h.rocks.length>8||h.rocks.some(r=>!record(r)||typeof r.id!=='string'||r.id.length>80||!Number.isFinite(r.x)||!Number.isFinite(r.z)||Math.abs(r.x)>20||Math.abs(r.z)>20||!sequence(r.at)))return null;if(h.gust&&(!record(h.gust)||![h.gust.dx,h.gust.dz].every(Number.isFinite)||Math.abs(Math.hypot(h.gust.dx,h.gust.dz)-1)>.00001||!sequence(h.gust.startAt)||!sequence(h.gust.endAt)||h.gust.endAt<h.gust.startAt))return null;}
    if(w.tiles!==undefined){const ids=new Set(arenaTiles(w.config.rules.radius,w.config.rules.minimumRadius).filter(t=>t.id!=='core').map(t=>t.id));if(!record(w.tiles)||Object.entries(w.tiles).some(([id,f])=>!ids.has(id)||!record(f)||!sequence(f.warnAt)||!sequence(f.fallAt)||f.fallAt<f.warnAt+20))return null;}
    if(!sequence(w.tick)||!sequence(w.activeTick)||!['countdown','active','results'].includes(w.phase)||!Number.isFinite(w.radius)||w.radius<0||w.radius>20||!sequence(w.eventSerial)||!sequence(w.rng)||!record(w.bots))return null;
    if(!Array.isArray(w.players)||w.players.length!==w.config.roster.length||new Set(w.players.map(p=>p.id)).size!==w.players.length)return null;
    const numbers=['x','z','vx','vz','ix','iz','facingX','facingZ','moveX','moveZ','lastInputTick','lastSequence','dashTicks','cooldownTicks','dashId','vulnerability','lastHitTick','hits','knockouts'] as const;
    for(const p of w.players){
      if(p.heldItem?.kind==='crate'||p.itemAim!==undefined&&!validAim(p.itemAim))return null;
      if((p.flattenedUntil!==undefined&&!sequence(p.flattenedUntil))||!held(p.heldItem)||(p.stunnedUntil!==undefined&&!sequence(p.stunnedUntil)))return null;
      const roster=w.config.roster.find(r=>r.id===p.id);
      if(!roster||p.name!==roster.name||p.appearance!==roster.appearance||p.skin!==roster.skin||p.control!==roster.control||typeof p.alive!=='boolean'||!numbers.every(k=>Number.isFinite(p[k])&&Math.abs(p[k])<=1e8)||!(p.eliminatedTick===null||sequence(p.eliminatedTick))||!Array.isArray(p.hitTargets)||p.hitTargets.length>12||p.hitTargets.some(id=>!w.config.roster.some(r=>r.id===id)))return null;
    }
    if(!Array.isArray(w.events)||w.events.length>512)return null;
    for(const e of w.events)if(!e||typeof e.id!=='string'||e.id.length>160||!sequence(e.tick)||e.tick>w.tick||!['go','dash','hit','ringout','result','warning','pickup','throw','drop','blast','rescue','shot','tilewarning','crateopen','hazardwarning','skyimpact','podarm'].includes(e.type)||!Number.isFinite(e.x)||!Number.isFinite(e.z))return null;
    if(w.result!==null && (!record(w.result)||w.result.matchId!==w.config.matchId||!['winner','draw','cancelled'].includes(w.result.outcome)||!sequence(w.result.tick)||w.result.origin!=='local-practice'||(w.result.winnerId!==null&&!w.players.some(p=>p.id===w.result!.winnerId))))return null;
    if((w.phase==='results')!==(w.result!==null))return null;
    return m as ServerMessage;
  }catch{return null;}
}


