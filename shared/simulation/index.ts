import {validAim} from '../game-types/input.ts';
import {stepHazards} from './hazards.ts';
import {supported,shrinkTiles,rescuePoint} from '../content/tiles.ts';
import {playerMass,playerRadius} from './item-effects.ts';
import type { GameEvent, Input, MatchConfig, Player, World } from '../game-types/index.ts';
import { validateConfig } from '../content/arena.ts';
import { MODES } from './modes.ts';
import {teammates} from '../content/party.ts';
import {stepItems,openCrates} from './items.ts';

export const PLAYER_RADIUS = .45;
const SUBSTEPS = 16; // Max supported relative travel is < one player diameter per substep.
export function random(w: World): number {
  let t = w.rng += 0x6D2B79F5;
  t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  w.rng >>>= 0; return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
export function createMatch(config: MatchConfig): World {
  validateConfig(config);
  const c = structuredClone(config);
  const w: World = { config: c, tick: 0, activeTick: 0, phase: c.rules.countdownTicks ? 'countdown' : 'active',
    radius: c.rules.radius, players: [], events: [], eventSerial: 0, rng: c.seed >>> 0, bots: {}, tiles:{}, result: null };
  const rotation = (random(w) - .5) * .4;
  w.players = [...c.roster].sort((a,b) => a.id.localeCompare(b.id, 'en')).map((p, i) => {
    const angle = i * Math.PI * 2 / c.roster.length + Math.PI / 2 + rotation;
    const x = Math.cos(angle) * c.rules.radius * .57, z = Math.sin(angle) * c.rules.radius * .57;
    return { ...p, x, z, vx: 0, vz: 0, ix: 0, iz: 0, facingX: -Math.cos(angle), facingZ: -Math.sin(angle),
      moveX: 0, moveZ: 0, lastInputTick: -100, lastSequence: -1, dashTicks: 0, cooldownTicks: 0,
      dashId: 0, hitTargets: [], vulnerability: 0, lastHitTick: -100, alive: true, eliminatedTick: null, hits: 0, knockouts: 0, lastHitBy: null };
  });
  MODES[c.modeId].initialize?.(w);
  MODES[c.modeId].determineOutcome(w); return w;
}
function emit(w: World, type: GameEvent['type'], x = 0, z = 0, source?: string, target?: string, strength?: number) {
  w.events.push({ id: `${w.config.matchId}:${++w.eventSerial}`, tick: w.tick, type, x, z, source, target, strength });
}
function cap(x: number, z: number, maximum: number): [number, number] {
  const size = Math.hypot(x,z), scale = size > maximum ? maximum / size : 1;
  return [x * scale, z * scale];
}
function approach(x: number, z: number, tx: number, tz: number, maximum: number): [number, number] {
  const [dx,dz] = cap(tx-x, tz-z, maximum); return [x+dx,z+dz];
}
function obstacleContact(p: Player, w: World) {
  for (const o of w.config.obstacles) {
    const cx = Math.max(o.x-o.halfX, Math.min(o.x+o.halfX,p.x));
    const cz = Math.max(o.z-o.halfZ, Math.min(o.z+o.halfZ,p.z));
    const dx = p.x-cx, dz = p.z-cz, d = Math.hypot(dx,dz);
    if (d >= playerRadius(p)) continue;
    let nx: number, nz: number, penetration: number;
    if (d > 1e-9) { nx = dx/d; nz = dz/d; penetration = playerRadius(p)-d; }
    else {
      const sides = [{ v:p.x-(o.x-o.halfX), x:-1,z:0 }, { v:o.x+o.halfX-p.x,x:1,z:0 }, { v:p.z-(o.z-o.halfZ),x:0,z:-1 }, { v:o.z+o.halfZ-p.z,x:0,z:1 }].sort((a,b)=>a.v-b.v);
      nx = sides[0].x; nz = sides[0].z; penetration = sides[0].v+playerRadius(p);
    }
    p.x += nx*penetration; p.z += nz*penetration;
    for (const pair of [['vx','vz'],['ix','iz']] as const) {
      const dot = p[pair[0]]*nx+p[pair[1]]*nz;
      if (dot < 0) { p[pair[0]] -= dot*nx; p[pair[1]] -= dot*nz; }
    }
  }
}
/** Mutates an exclusively owned, serializable authority state. Presentation receives read-only views. */
export function step(w: World, inputs: readonly Input[], forfeitedIds: readonly string[] = []): World {
  w.events = [];
  if (w.phase === 'results') return w;
  w.tick++;
  if (w.phase === 'countdown') {
    if (w.tick >= w.config.rules.countdownTicks) { w.phase = 'active'; emit(w,'go'); }
    return w;
  }
  w.activeTick++;
  // Expired tools cannot affect this tick's hazard forces, collision or rescue.
  // Bombs and pods retain their explicit explosion/arming expiry handlers.
  for(const player of w.players){const item=player.heldItem;if(item&&w.activeTick>=item.expiresAt&&item.kind!=='bomb'&&item.kind!=='pod')player.heldItem=null;}
  const r = w.config.rules, dt = r.tickSeconds;
  if (MODES[w.config.modeId].shrinks!==false&&w.activeTick === r.durationTicks-r.suddenDeathTicks-40) emit(w,'warning');
  const dashRequests = new Set<string>();
  const accepted:Input[]=[];
  for (const input of inputs) {
    if (!input || !Number.isSafeInteger(input.sequence) || input.sequence < 0 || !Number.isFinite(input.x) || !Number.isFinite(input.z) || typeof input.dash !== 'boolean') continue;
    if(input.aim!==undefined&&!validAim(input.aim))continue;
    if((input.useItem!==undefined&&typeof input.useItem!=='boolean')||(input.dropItem!==undefined&&typeof input.dropItem!=='boolean'))continue;
    const p = w.players.find(p => p.id === input.participantId);
    if (!p?.alive || input.sequence <= p.lastSequence || input.sequence > p.lastSequence + 10000) continue;
    p.lastSequence = input.sequence; p.lastInputTick = w.tick;p.itemAim=input.aim?{...input.aim}:undefined;
    const prior=accepted.findIndex(c=>c.participantId===input.participantId);if(prior>=0)accepted[prior]={...input,useItem:input.useItem||accepted[prior].useItem,dropItem:input.dropItem||accepted[prior].dropItem};else accepted.push(input);
    [p.moveX,p.moveZ] = cap(input.x,input.z,1);
    if (input.dash) dashRequests.add(p.id);
  }
  MODES[w.config.modeId].update(w);if(MODES[w.config.modeId].shrinks!==false)shrinkTiles(w);
  MODES[w.config.modeId].beforeStep?.(w);
  stepHazards(w,random,emit);
  stepItems(w,accepted,random,emit);
  for (const p of w.players) {
    if (!p.alive) continue;
    p.cooldownTicks = Math.max(0,p.cooldownTicks-1);
    if(w.activeTick<(p.stunnedUntil??0)){p.vx=p.vz=0;p.dashTicks=0;continue;}
    if (w.tick-p.lastInputTick >= r.inputTimeoutTicks) { p.moveX = 0; p.moveZ = 0; }
    if (p.dashTicks === 0 && Math.hypot(p.moveX,p.moveZ) > .01) {
      const len = Math.hypot(p.moveX,p.moveZ); p.facingX = p.moveX/len; p.facingZ = p.moveZ/len;
    }
    if (dashRequests.has(p.id) && p.cooldownTicks === 0 && p.dashTicks === 0) {
      p.dashTicks = r.dashTicks; p.cooldownTicks = r.cooldownTicks; p.dashId++; p.hitTargets = []; emit(w,'dash',p.x,p.z,p.id);
    }
    if (p.dashTicks > 0) { p.vx = p.facingX*r.dashSpeed; p.vz = p.facingZ*r.dashSpeed; }
    else [p.vx,p.vz] = approach(p.vx,p.vz,p.moveX*r.speed,p.moveZ*r.speed,(Math.hypot(p.moveX,p.moveZ) > .01 ? r.acceleration : r.deceleration)*dt);
    if (w.tick-p.lastHitTick > r.recoveryDelayTicks) p.vulnerability = Math.max(0,p.vulnerability-r.recoveryPerSecond*dt);
  }
  const live = w.players.filter(p=>p.alive),unsupported=new Set<string>();
  for (let sub = 0; sub < SUBSTEPS; sub++) {
    for (const p of live) { p.x += (p.vx+p.ix)*dt/SUBSTEPS; p.z += (p.vz+p.iz)*dt/SUBSTEPS; obstacleContact(p,w);if(!supported(w,p.x,p.z))unsupported.add(p.id); }
    MODES[w.config.modeId].substep?.(w,dt/SUBSTEPS);
    openCrates(w,random,emit);
    // Gather every simultaneous contact before changing impulses or vulnerability.
    const contacts: {a: Player;b: Player;nx:number;nz:number;depth:number}[] = [];
    for (let i=0;i<live.length;i++) for (let j=i+1;j<live.length;j++) {
      const a=live[i],b=live[j],dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);
      const radius=playerRadius(a)+playerRadius(b);if (d < radius) contacts.push({a,b,nx:d>1e-9?dx/d:1,nz:d>1e-9?dz/d:0,depth:radius-d});
    }
    const hits: {source:Player;target:Player;nx:number;nz:number;power:number}[]=[];
    for (const {a,b,nx,nz,depth} of contacts) {
      const total=playerMass(a)+playerMass(b),aShare=playerMass(b)/total,bShare=playerMass(a)/total;a.x -= nx*depth*aShare; a.z -= nz*depth*aShare; b.x += nx*depth*bShare; b.z += nz*depth*bShare;
      for (const [source,target,sign] of [[a,b,1],[b,a,-1]] as const) {
        if (!teammates(source,target)&&source.dashTicks > 0 && !source.hitTargets.includes(target.id)) {
          source.hitTargets.push(target.id); hits.push({source,target,nx:nx*sign,nz:nz*sign,power:r.hitImpulse*(1+target.vulnerability)/playerMass(target)});
        }
      }
    }
    for(const source of live)if(source.heldItem?.kind==='shovel'&&source.dashTicks>0)for(const target of live){if(source===target||teammates(source,target)||source.hitTargets.includes(target.id))continue;const dx=target.x-source.x,dz=target.z-source.z,d=Math.hypot(dx,dz);if(d>0&&d<1.5+playerRadius(target)&&(dx*source.facingX+dz*source.facingZ)/d>.35){source.hitTargets.push(target.id);hits.push({source,target,nx:dx/d,nz:dz/d,power:r.hitImpulse*(1+target.vulnerability)/playerMass(target)});}}
    for (const {source,target,nx,nz,power} of hits) {
      target.ix += nx*power; target.iz += nz*power;
      target.vulnerability = Math.min(r.vulnerabilityCap,target.vulnerability+r.vulnerabilityGain);
      target.lastHitTick = w.tick; target.lastHitBy = source.id; source.hits++;
      emit(w,'hit',target.x,target.z,source.id,target.id,power);
    }
    for (const p of live) { [p.ix,p.iz] = cap(p.ix,p.iz,r.impulseCap); obstacleContact(p,w); }
  }
  MODES[w.config.modeId].update(w);
  for (const p of live) {
    p.dashTicks = Math.max(0,p.dashTicks-1);
    const damping = Math.exp(-r.impulseDamping*dt); p.ix *= damping; p.iz *= damping;
    if (unsupported.has(p.id)||!supported(w,p.x,p.z)||forfeitedIds.includes(p.id)) {
      if(p.heldItem?.kind==='helicopter'&&!forfeitedIds.includes(p.id)){
        const safe=rescuePoint(w,p.x,p.z);p.x=safe.x;p.z=safe.z;p.heldItem=null;p.vx=p.vz=p.ix=p.iz=p.moveX=p.moveZ=0;p.dashTicks=0;p.stunnedUntil=w.activeTick+10;p.lastHitBy=null;emit(w,'rescue',p.x,p.z,p.id);continue;
      }
      p.alive = false; p.eliminatedTick = w.tick; p.moveX = p.moveZ = 0;
      if (p.lastHitBy && w.tick-p.lastHitTick <= 60) { const source = w.players.find(q=>q.id === p.lastHitBy); if (source) source.knockouts++; }
      emit(w,'ringout',p.x,p.z,p.lastHitBy??undefined,p.id);
    }
  }
  MODES[w.config.modeId].determineOutcome(w);
  if (w.result) emit(w,'result');
  return w;
}


