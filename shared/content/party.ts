import type {MatchConfig,PartyOptions,Player} from '../game-types/index.ts';
import {BOSS_PROFILES} from '../../content/bosses/cloud-king.ts';

export const MODE_DEFINITIONS = {arena:{name:'Free-for-all'},teams:{name:'Team Arena'},boss:{name:'Boss co-op'}} as const;
export const TEAM_NAMES=['Sun','Tide','Rose','Leaf','Moon','Ember'];
export const TEAM_COLORS=[0xe4a735,0x269cb8,0xd54d79,0x5d9c38,0x9673cb,0xc46732];
export const BOSS_DEFINITIONS=BOSS_PROFILES;
export function validBossProfiles(){return Object.values(BOSS_DEFINITIONS).every(d=>typeof d.name==='string'&&d.name.length>0&&d.name.length<=40&&Number.isInteger(d.coresPerPhase)&&d.coresPerPhase>=1&&d.coresPerPhase<=6&&Number.isInteger(d.windup)&&d.windup>=20&&d.windup<=80&&Number.isInteger(d.attackInterval)&&d.attackInterval>=d.windup+20&&d.attackInterval<=400&&Number.isFinite(d.push)&&d.push>=1&&d.push<=12);}
export const BOSS_RUNES=[{x:-4,z:1},{x:4,z:1},{x:0,z:4}];
export const BOSS_TARGET={x:0,z:-6};
export const coresPerPhase=(c:MatchConfig)=>BOSS_DEFINITIONS[c.bossVariant??'cloud-king'].coresPerPhase+Math.floor((c.roster.length-1)/4);
export function validPartyOptions(v:Record<string,unknown>,fallback=4):boolean {
  const mode=v.modeId??'arena',count=v.totalCount??fallback,size=v.teamSize;
  if(typeof mode!=='string'||!Object.hasOwn(MODE_DEFINITIONS,mode)||!Number.isInteger(count)||(count as number)<1||(count as number)>12)return false;
  if(mode==='teams')return Number.isInteger(size)&&(size as number)>=2&&(size as number)<=6&&(count as number)%(size as number)===0&&(count as number)/(size as number)>=2&&v.bossVariant===undefined;
  if(size!==undefined)return false;
  return mode==='boss'?(v.bossVariant===undefined||typeof v.bossVariant==='string'&&Object.hasOwn(BOSS_DEFINITIONS,v.bossVariant)):v.bossVariant===undefined;
}
export function configureParty(c:MatchConfig,options:PartyOptions):void {
  if(!validPartyOptions({...options,totalCount:c.roster.length}))throw new Error('Choose a valid participant count and equal team size.');
  c.modeId=options.modeId??'arena';delete c.teamSize;delete c.bossVariant;
  c.roster.forEach(p=>delete p.teamId);
  if(c.modeId==='teams'){c.teamSize=options.teamSize!;c.roster.forEach((p,i)=>p.teamId=i%(c.roster.length/c.teamSize!));}
  if(c.modeId==='boss'){
    c.bossVariant=options.bossVariant??'cloud-king';c.roster.forEach(p=>p.teamId=0);
    c.rules.durationTicks=6000;c.rules.suddenDeathTicks=0;
    c.hazards=c.hazards?.filter(id=>id!=='tiles');c.items=c.items?.filter(id=>id!=='remover');
  }
}
export const teammates=(a:Pick<Player,'id'|'teamId'>,b:Pick<Player,'id'|'teamId'>)=>a.id!==b.id&&a.teamId!==undefined&&a.teamId===b.teamId;
export function friendlySource(w:{players:Player[]},source:string|null|undefined,target:Player){const owner=w.players.find(p=>p.id===source);return !!owner&&teammates(owner,target);}
