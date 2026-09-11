import type {World} from '../game-types/index.ts';
import {arenaMode,type ModeHandler} from './arena-mode.ts';
import {bossMode} from './boss-mode.ts';
const teamMode:ModeHandler={update:arenaMode.update,determineOutcome(w){
  const teams=new Set(w.players.filter(p=>p.alive).map(p=>p.teamId!));
  if(teams.size<=1||w.activeTick>=w.config.rules.durationTicks){
    const winnerTeamId=teams.size===1?[...teams][0]:undefined;w.phase='results';
    w.result={matchId:w.config.matchId,outcome:winnerTeamId===undefined?'draw':'winner',winnerId:null,...(winnerTeamId===undefined?{}:{winnerTeamId}),origin:'local-practice',tick:w.tick};
  }
}};
export const MODES:Record<World['config']['modeId'],ModeHandler>={arena:arenaMode,teams:teamMode,boss:bossMode};
