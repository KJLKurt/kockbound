import type {Appearance,Skin} from '../content/characters.ts';
import type {HazardId,HazardState} from '../content/hazards.ts';
import type {TileFall} from '../content/tiles.ts';
import type {HeldItem,ItemId,ItemState} from '../content/items.ts';
export type Vec2 = { x: number; z: number };
export type Phase = 'countdown' | 'active' | 'results';
export type Input = Vec2 & { participantId: string; sequence: number; dash: boolean; useItem?:boolean; dropItem?:boolean; aim?:Vec2 };
export type Participant = { id: string; name: string; control: 'human' | 'bot'; appearance: Appearance;skin?:Skin };
export type Obstacle = { id: string; x: number; z: number; halfX: number; halfZ: number };
export type Rules = {
  tickSeconds: number; radius: number; speed: number; acceleration: number; deceleration: number;
  dashSpeed: number; dashTicks: number; cooldownTicks: number; hitImpulse: number;
  impulseCap: number; impulseDamping: number; vulnerabilityGain: number; vulnerabilityCap: number;
  recoveryDelayTicks: number; recoveryPerSecond: number; inputTimeoutTicks: number;
  countdownTicks: number; durationTicks: number; suddenDeathTicks: number; minimumRadius: number;
};
export type MatchConfig = {
  matchId: string; seed: number; simulationVersion: string; protocolVersion: string;
  contentReleaseId: string; modeId: 'arena'; mapId: 'sky-ring'; roster: Participant[];
  rules: Rules; obstacles: Obstacle[]; items?:ItemId[];hazards?:HazardId[];
};
export type Player = Participant & Vec2 & {
  vx: number; vz: number; ix: number; iz: number; facingX: number; facingZ: number;
  moveX: number; moveZ: number; lastInputTick: number; lastSequence: number;
  dashTicks: number; cooldownTicks: number; dashId: number; hitTargets: string[];
  vulnerability: number; lastHitTick: number; alive: boolean; eliminatedTick: number | null;
  hits: number; knockouts: number; lastHitBy: string | null;
  itemAim?:Vec2;heldItem?:HeldItem|null;stunnedUntil?:number;flattenedUntil?:number;
};
export type GameEvent = Vec2 & { id: string; tick: number; type: 'go' | 'dash' | 'hit' | 'ringout' | 'result' | 'warning' | 'pickup' | 'throw' | 'drop' | 'blast' | 'rescue' | 'shot' | 'tilewarning' | 'crateopen' | 'hazardwarning' | 'skyimpact' | 'podarm'; source?: string; target?: string; strength?: number };
export type MatchResult = { matchId: string; outcome: 'winner' | 'draw' | 'cancelled'; winnerId: string | null; origin: 'local-practice'; tick: number };
export type BotMemory = { nextTick: number; x: number; z: number; sequence: number };
export type World = {
  config: MatchConfig; tick: number; activeTick: number; phase: Phase; radius: number;
  players: Player[]; events: GameEvent[]; eventSerial: number; rng: number;
  bots: Record<string, BotMemory>; result: MatchResult | null;
  items?:ItemState;hazards?:HazardState;tiles?:Record<string,TileFall>;
};

