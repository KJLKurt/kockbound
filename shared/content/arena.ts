import {CHARACTERS,validAppearance,validSkin,type Appearance} from './characters.ts';
import {validHazards} from './hazards.ts';
import type { MatchConfig, Participant, Rules } from '../game-types/index.ts';
import {validItems} from './items.ts';

export const SIMULATION_VERSION = 'knockbound-sim-0.12.6';
export const PROTOCOL_VERSION = 'knockbound-protocol-0.12.6';
export const CONTENT_RELEASE = 'knockbound-local-0.12.6';
export const DEFAULT_RULES: Readonly<Rules> = Object.freeze({
  tickSeconds: 0.05, radius: 10, speed: 5, acceleration: 35, deceleration: 25,
  dashSpeed: 14, dashTicks: 3, cooldownTicks: 24, hitImpulse: 7, impulseCap: 22,
  impulseDamping: 4, vulnerabilityGain: 0.2, vulnerabilityCap: 2,
  recoveryDelayTicks: 40, recoveryPerSecond: 0.1, inputTimeoutTicks: 5,
  countdownTicks: 100, durationTicks: 1800, suddenDeathTicks: 600, minimumRadius: 2.2,
});
export function localConfig(seed = 1, count = 4, appearance: Appearance = 'sprout'): MatchConfig {
  if (!Number.isInteger(count) || count < 1 || count > 12) throw new Error('Choose 1–12 participants.');
  const names = ['You', 'Pip', 'Clover', 'Mochi', 'Nova', 'Sunny', 'Pebble', 'Echo', 'Wisp', 'Miso', 'Bramble', 'Skye'];
  const roster: Participant[] = Array.from({ length: count }, (_, i) => ({
    id: `p${i + 1}`, name: names[i], control: i === 0 ? 'human' : 'bot', appearance: i === 0 ? appearance : (Object.keys(CHARACTERS) as Appearance[])[i%4],
  }));
  return { matchId: `local-${seed}`, seed, simulationVersion: SIMULATION_VERSION, protocolVersion: PROTOCOL_VERSION,
    contentReleaseId: CONTENT_RELEASE, modeId: 'arena', mapId: 'sky-ring', roster, rules: { ...DEFAULT_RULES }, obstacles: [] };
}
export function validateConfig(c: MatchConfig): void {
  if(c.hazards!==undefined&&!validHazards(c.hazards))throw new Error('Invalid hazards.');
  if(c.items!==undefined&&!validItems(c.items))throw new Error('Invalid item selection.');
  if (c.simulationVersion !== SIMULATION_VERSION || c.protocolVersion !== PROTOCOL_VERSION || c.contentReleaseId !== CONTENT_RELEASE) throw new Error('Incompatible game version.');
  if (c.modeId !== 'arena' || c.mapId !== 'sky-ring') throw new Error('Unsupported mode or map.');
  if (!Number.isSafeInteger(c.seed) || !c.matchId || c.matchId.length > 100) throw new Error('Invalid match identity.');
  if (c.roster.length > 12 || new Set(c.roster.map(p => p.id)).size !== c.roster.length) throw new Error('Invalid roster.');
  for (const p of c.roster) if (!/^p\d{1,2}$/.test(p.id) || !['bot', 'human'].includes(p.control) || !validAppearance(p.appearance)||(p.skin!==undefined&&!validSkin(p.skin)) || p.name.length > 20) throw new Error('Invalid participant.');
  for (const v of Object.values(c.rules)) if (!Number.isFinite(v) || v < 0 || v > 100000) throw new Error('Invalid rule value.');
  if (c.rules.tickSeconds !== .05 || c.rules.radius < 3 || c.rules.radius > 20 || c.rules.speed > 10 || c.rules.dashSpeed > 20 || c.rules.impulseCap > 30 || c.rules.minimumRadius < 1 || c.rules.minimumRadius > c.rules.radius || c.rules.durationTicks < 1 || c.rules.suddenDeathTicks > c.rules.durationTicks) throw new Error('Unsupported physics bounds.');
  for (const key of ['countdownTicks', 'durationTicks', 'suddenDeathTicks', 'dashTicks', 'cooldownTicks', 'inputTimeoutTicks', 'recoveryDelayTicks'] as const) if (!Number.isInteger(c.rules[key])) throw new Error('Tick rules must be integers.');
  if (c.obstacles.length > 32 || c.obstacles.some(o => ![o.x, o.z, o.halfX, o.halfZ].every(Number.isFinite) || o.halfX <= 0 || o.halfZ <= 0)) throw new Error('Invalid obstacles.');
}




