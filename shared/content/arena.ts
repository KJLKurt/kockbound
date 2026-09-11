import {CHARACTERS,validAppearance,validSkin,type Appearance} from './characters.ts';
import {validHazards} from './hazards.ts';
import type { MatchConfig, Participant, Rules } from '../game-types/index.ts';
import {validItems} from './items.ts';
import {validPartyOptions,validBossProfiles} from './party.ts';

export const SIMULATION_VERSION = 'knockbound-sim-0.13.0';
export const PROTOCOL_VERSION = 'knockbound-protocol-0.13.0';
export const CONTENT_RELEASE = 'knockbound-local-0.13.0';
export const DEFAULT_RULES: Readonly<Rules> = Object.freeze({
  tickSeconds: 0.05, radius: 10, speed: 5, acceleration: 35, deceleration: 25,
  dashSpeed: 14, dashTicks: 3, cooldownTicks: 24, hitImpulse: 8.5, impulseCap: 22,
  impulseDamping: 4, vulnerabilityGain: 0.3, vulnerabilityCap: 2,
  recoveryDelayTicks: 120, recoveryPerSecond: 0.05, inputTimeoutTicks: 5,
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
  if(!validBossProfiles())throw new Error('Invalid boss content profile.');
  if(c.hazards!==undefined&&!validHazards(c.hazards))throw new Error('Invalid hazards.');
  if(c.items!==undefined&&!validItems(c.items))throw new Error('Invalid item selection.');
  if (c.simulationVersion !== SIMULATION_VERSION || c.protocolVersion !== PROTOCOL_VERSION || c.contentReleaseId !== CONTENT_RELEASE) throw new Error('Incompatible game version.');
  if (!validPartyOptions({modeId:c.modeId,totalCount:c.roster.length||1,teamSize:c.teamSize,bossVariant:c.bossVariant}) || c.mapId !== 'sky-ring') throw new Error('Unsupported mode or map.');
  if(c.modeId==='arena'&&c.roster.some(p=>p.teamId!==undefined))throw new Error('Arena has no teams.');
  if(c.modeId==='boss'&&(c.roster.some(p=>p.teamId!==0)||c.rules.suddenDeathTicks!==0))throw new Error('Boss allies share one team and a stable arena.');
  if(c.modeId==='boss'&&(c.hazards?.includes('tiles')||c.items?.includes('remover')))throw new Error('Boss objectives require an intact floor.');
  if(c.modeId==='teams'){
    const count=c.roster.length/c.teamSize!;
    if(c.roster.some(p=>!Number.isInteger(p.teamId)||p.teamId!<0||p.teamId!>=count)||Array.from({length:count},(_,i)=>c.roster.filter(p=>p.teamId===i).length).some(n=>n!==c.teamSize))throw new Error('Teams must be equal and within capacity.');
  }
  if (!Number.isSafeInteger(c.seed) || !c.matchId || c.matchId.length > 100) throw new Error('Invalid match identity.');
  if (c.roster.length > 12 || new Set(c.roster.map(p => p.id)).size !== c.roster.length) throw new Error('Invalid roster.');
  for (const p of c.roster) if (!/^p\d{1,2}$/.test(p.id) || !['bot', 'human'].includes(p.control) || !validAppearance(p.appearance)||(p.skin!==undefined&&!validSkin(p.skin)) || p.name.length > 20) throw new Error('Invalid participant.');
  for (const v of Object.values(c.rules)) if (!Number.isFinite(v) || v < 0 || v > 100000) throw new Error('Invalid rule value.');
  if (c.rules.tickSeconds !== .05 || c.rules.radius < 3 || c.rules.radius > 20 || c.rules.speed > 10 || c.rules.dashSpeed > 20 || c.rules.impulseCap > 30 || c.rules.minimumRadius < 1 || c.rules.minimumRadius > c.rules.radius || c.rules.durationTicks < 1 || c.rules.suddenDeathTicks > c.rules.durationTicks) throw new Error('Unsupported physics bounds.');
  for (const key of ['countdownTicks', 'durationTicks', 'suddenDeathTicks', 'dashTicks', 'cooldownTicks', 'inputTimeoutTicks', 'recoveryDelayTicks'] as const) if (!Number.isInteger(c.rules[key])) throw new Error('Tick rules must be integers.');
  if (c.obstacles.length > 32 || c.obstacles.some(o => ![o.x, o.z, o.halfX, o.halfZ].every(Number.isFinite) || o.halfX <= 0 || o.halfZ <= 0)) throw new Error('Invalid obstacles.');
}




