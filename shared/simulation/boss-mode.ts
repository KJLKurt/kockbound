import {BOSS_DEFINITIONS,BOSS_RUNES,BOSS_TARGET,coresPerPhase} from '../content/party.ts';
import {supported} from '../content/tiles.ts';
import {playerMass} from './item-effects.ts';
import type {BossState,Player,World} from '../game-types/index.ts';
import type {ModeHandler} from './arena-mode.ts';

export const initialBoss=():BossState=>({phase:1,cores:0,stage:'runes',until:0,switches:[0,0,0],core:{x:0,z:2,vx:0,vz:0},lastDash:{},nextAttack:100,attack:null,serial:0});
function event(w:World,type:'blast'|'warning',x:number,z:number,strength:number){w.events.push({id:`${w.config.matchId}:${++w.eventSerial}`,tick:w.tick,type,x,z,strength});}
export const bossMode:ModeHandler={
  initialize(w){w.boss=initialBoss();},beforeStep:stepBoss,substep:pushBossCore,botIntent:bossIntent,shrinks:false,
  update(w){w.radius=w.config.rules.radius;},
  determineOutcome(w){
    const alive=w.players.some(p=>p.alive),won=w.boss?.stage==='won';
    if(!w.players.length||!alive||won||w.activeTick>=w.config.rules.durationTicks){
      w.phase='results';w.result={matchId:w.config.matchId,outcome:!w.players.length?'cancelled':!alive?'defeat':won?'winner':'defeat',winnerId:null,...(alive&&won?{winnerTeamId:0}:{}),origin:'local-practice',tick:w.tick};
    }
  },
};
/** Boss mechanics use public state and the same fixed tick as ordinary movement. */
export function stepBoss(w:World){
  const b=w.boss;if(!b||b.stage==='won')return;
  const now=w.activeTick,d=BOSS_DEFINITIONS[w.config.bossVariant??'cloud-king'];
  if(b.stage==='recover'&&now>=b.until){b.stage='runes';b.switches=[0,0,0];b.core={x:0,z:2,vx:0,vz:0};}
  if(b.stage==='runes'){
    BOSS_RUNES.forEach((r,i)=>{if(w.players.some(p=>p.alive&&Math.hypot(p.x-r.x,p.z-r.z)<1.25))b.switches[i]=Math.min(20,b.switches[i]+1);});
    if(b.switches.every(n=>n===20)){b.stage='exposed';event(w,'blast',0,2,1);}
  }
  if(b.attack&&now>=b.attack.at){
    const attack=b.attack;
    for(const p of w.players){if(!p.alive)continue;const mark=attack.marks.find(m=>attack.kind==='sweep'?Math.abs(p.x-m.x)<1.3&&Math.abs(p.z)<8:Math.hypot(p.x-m.x,p.z-m.z)<2);
      if(mark){const dx=attack.kind==='sweep'?1:p.x-mark.x,dz=attack.kind==='sweep'?0:p.z-mark.z,len=Math.hypot(dx,dz)||1,push=d.push*(1+p.vulnerability)/playerMass(p);
        p.ix+=(dx||(!dz?1:0))/len*push;p.iz+=dz/len*push;p.vulnerability=Math.min(w.config.rules.vulnerabilityCap,p.vulnerability+w.config.rules.vulnerabilityGain);p.lastHitTick=w.tick;p.lastHitBy=null;p.stunnedUntil=Math.max(p.stunnedUntil??0,now+6);
      }
    }
    attack.marks.forEach(m=>event(w,'blast',m.x,m.z,2));b.attack=null;
  }
  if(now>=b.nextAttack&&b.stage!=='recover'){
    const live=w.players.filter(p=>p.alive);const kind=b.phase===2&&b.serial%2===1?'sweep':'boulder';
    const count=Math.max(1,Math.ceil(live.length/4));const marks=Array.from({length:Math.min(count,live.length)},(_,i)=>{const p=live[(b.serial+i)%live.length];return {x:p.x,z:kind==='sweep'?0:p.z};});
    b.attack={kind,at:now+d.windup,marks};b.serial++;b.nextAttack=now+d.attackInterval-(b.phase===2?20:0);
    if(marks.length)event(w,'warning',marks[0].x,marks[0].z,4);
  }
}
/** Called at movement substeps so a dash cannot tunnel through the core. */
export function pushBossCore(w:World,dt:number){
  const b=w.boss;if(!b||b.stage!=='exposed')return;
  const c=b.core;
  for(const p of w.players){
    if(!p.alive||w.activeTick<(p.stunnedUntil??0))continue;
    const dx=c.x-p.x,dz=c.z-p.z,d=Math.hypot(dx,dz);if(d>=1.05)continue;
    const nx=d>1e-8?dx/d:p.facingX,nz=d>1e-8?dz/d:p.facingZ;
    const approach=Math.max(0,p.vx*nx+p.vz*nz);
    if(p.dashTicks>0&&b.lastDash[p.id]!==p.dashId){b.lastDash[p.id]=p.dashId;c.vx+=nx*12;c.vz+=nz*12;}
    c.x+=nx*approach*dt*.65;c.z+=nz*approach*dt*.65;
  }
  const speed=Math.hypot(c.vx,c.vz);if(speed>16){c.vx*=16/speed;c.vz*=16/speed;}
  c.x+=c.vx*dt;c.z+=c.vz*dt;c.vx*=Math.exp(-2*dt);c.vz*=Math.exp(-2*dt);
  if(Math.hypot(c.x-BOSS_TARGET.x,c.z-BOSS_TARGET.z)<1.35){
    b.cores++;b.attack=null;b.stage=b.cores>=coresPerPhase(w.config)*2?'won':'recover';b.until=w.activeTick+100;
    b.phase=b.cores>=coresPerPhase(w.config)?2:1;
    event(w,'blast',BOSS_TARGET.x,BOSS_TARGET.z,3);
  }else if(!supported(w,c.x,c.z)){b.core={x:0,z:2,vx:0,vz:0};}
}
/** Bots fill different rune jobs, then line up behind the core before pushing. */
export function bossIntent(w:World,p:Player):{x:number;z:number;dash:boolean}{
  const b=w.boss!;let target={x:0,z:3},dash=false;
  if(b.stage==='runes'){
    const available=BOSS_RUNES.map((r,i)=>({...r,i})).filter(r=>b.switches[r.i]<20);
    const bots=w.players.filter(q=>q.alive&&q.control==='bot');target=available[bots.findIndex(q=>q.id===p.id)%Math.max(1,available.length)]??target;
  }else if(b.stage==='exposed'){
    const c=b.core,dx=BOSS_TARGET.x-c.x,dz=BOSS_TARGET.z-c.z,len=Math.hypot(dx,dz)||1,nx=dx/len,nz=dz/len;
    const behind={x:c.x-nx*1.5,z:c.z-nz*1.5},aligned=(p.x-c.x)*nx+(p.z-c.z)*nz<-.8&&Math.abs((p.x-c.x)*nz-(p.z-c.z)*nx)<.5;
    target=aligned?BOSS_TARGET:behind;dash=aligned&&Math.hypot(p.x-c.x,p.z-c.z)<2.3;
  }
  if(b.attack){const danger=b.attack.marks.find(m=>b.attack!.kind==='sweep'?Math.abs(p.x-m.x)<2:Math.hypot(p.x-m.x,p.z-m.z)<2.8);if(danger){const sign=p.x>=danger.x?1:-1;target={x:Math.max(-6,Math.min(6,danger.x+sign*3.2)),z:p.z};dash=false;}}
  const dx=target.x-p.x,dz=target.z-p.z;if(Math.hypot(dx,dz)<.2)return{x:0,z:0,dash:false};return{x:dx,z:dz,dash};
}
