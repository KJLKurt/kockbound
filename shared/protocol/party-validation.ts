import {coresPerPhase} from '../content/party.ts';
import type {World} from '../game-types/index.ts';
const integer=(n:unknown,max=100000)=>Number.isSafeInteger(n)&&(n as number)>=0&&(n as number)<=max;
const point=(p:{x:number;z:number})=>p&&[p.x,p.z].every(n=>Number.isFinite(n)&&Math.abs(n)<=30);
export function validPartyState(w:World):boolean{
  if(w.config.modeId!=='boss'){if(w.boss!==undefined)return false;}
  else{
    const b=w.boss;if(!b||![1,2].includes(b.phase)||!['runes','exposed','recover','won'].includes(b.stage)||!integer(b.cores,coresPerPhase(w.config)*2)||!integer(b.until)||!integer(b.nextAttack)||!integer(b.serial)||!Array.isArray(b.switches)||b.switches.length!==3||b.switches.some(n=>!integer(n,20))||!point(b.core)||![b.core.vx,b.core.vz].every(n=>Number.isFinite(n)&&Math.abs(n)<=16)||!b.lastDash||typeof b.lastDash!=='object'||Array.isArray(b.lastDash)||Object.entries(b.lastDash).some(([id,dash])=>!w.config.roster.some(p=>p.id===id)||!integer(dash)))return false;
    if(b.attack!==null&&(!b.attack||!['boulder','sweep'].includes(b.attack.kind)||!integer(b.attack.at)||!Array.isArray(b.attack.marks)||b.attack.marks.length>3||b.attack.marks.some(m=>!point(m))))return false;
  }
  if(w.players.some(p=>p.teamId!==w.config.roster.find(r=>r.id===p.id)?.teamId))return false;
  if(w.result){const r=w.result;
    if(r.winnerTeamId!==undefined&&(!integer(r.winnerTeamId,5)||!w.config.roster.some(p=>p.teamId===r.winnerTeamId)||w.config.modeId==='arena'||r.outcome!=='winner'))return false;
    if(w.config.modeId!=='arena'&&(r.winnerId!==null||(r.outcome==='winner'&&r.winnerTeamId===undefined)))return false;
    if(w.config.modeId!=='boss'&&r.outcome==='defeat')return false;
  }
  return true;
}
