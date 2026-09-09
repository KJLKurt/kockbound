import type { World } from '../game-types/index.ts';

export interface ModeHandler { update(world: World): void; determineOutcome(world: World): void }
export const arenaMode: ModeHandler = {
  update(w) {
    const r = w.config.rules;
    const elapsed = Math.max(0, w.activeTick - (r.durationTicks - r.suddenDeathTicks));
    w.radius = r.radius + (r.minimumRadius - r.radius) * Math.min(1, elapsed / Math.max(1, r.suddenDeathTicks));
  },
  determineOutcome(w) {
    const survivors = w.players.filter(p => p.alive);
    if (w.players.length === 0 || survivors.length === 0 || (w.players.length > 1 && survivors.length === 1) || w.activeTick >= w.config.rules.durationTicks) {
      w.phase = 'results';
      const winnerId = w.players.length > 1 && survivors.length === 1 ? survivors[0].id : null;
      w.result = { matchId: w.config.matchId, outcome: w.players.length === 0 ? 'cancelled' : winnerId ? 'winner' : 'draw', winnerId, origin: 'local-practice', tick: w.tick };
    }
  },
};
