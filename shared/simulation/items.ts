import {itemDirection} from './item-aim.ts';
import {closestGroundItem} from '../content/item-pickup.ts';
import {stepPods} from './pods.ts';
import {arenaTiles,tileAt,removerTarget,warnTile,supported} from '../content/tiles.ts';
import {stepRanged} from './ranged.ts';
import {playerMass} from './item-effects.ts';
import {ITEM_DEFINITIONS,isRanged} from '../content/items.ts';
import type {GameEvent,Input,World} from '../game-types/index.ts';
type Emit=(w:World,type:GameEvent['type'],x?:number,z?:number,source?:string,target?:string,strength?:number)=>void;
export function stepItems(w:World,commands:readonly Input[],random:(w:World)=>number,emit:Emit){
  if(!w.config.items?.length)return;
  const state=w.items??={nextSpawn:80,serial:0,ground:[]},now=w.activeTick,definition=ITEM_DEFINITIONS.bomb;
  const spawnable=w.config.items.filter(id=>id!=='crate'||w.config.items!.some(other=>other!=='crate'));
  if(spawnable.length&&now>=state.nextSpawn){state.nextSpawn=now+160;if(state.ground.length<5){const kind=spawnable[Math.floor(random(w)*spawnable.length)];const point=spawnPoint(w,random);if(point)state.ground.push({id:`item-${++state.serial}`,kind,expiresAt:now+(kind==='bomb'?definition.fuseTicks:kind==='pod'?160:400),x:point.x,z:point.z,vx:0,vz:0,thrown:false,owner:null,blockedId:null,blockedUntil:0});}}
  const explosions=stepPods(w,commands,emit);
  for(const p of w.players){
    if(!p.alive){p.heldItem=null;continue;}
    const command=commands.find(c=>c.participantId===p.id);
    if(p.heldItem?.kind==='remover'&&command?.useItem&&!command.dropItem&&now>=(p.stunnedUntil??0)&&now<p.heldItem.expiresAt){const {dx,dz}=itemDirection(p,command);const target=removerTarget(w,p,{dx,dz});if(target&&warnTile(w,target.id)){p.heldItem=null;emit(w,'tilewarning',target.x,target.z,p.id);}}
    if(p.heldItem&&now<p.heldItem.expiresAt&&command&&(command.dropItem||(command.useItem&&p.heldItem.kind==='bomb'))&&now>=(p.stunnedUntil??0)){
      const item=p.heldItem,thrown=item.kind==='bomb'&&!command.dropItem;const {dx,dz}=itemDirection(p,command);
      state.ground.push({...item,x:p.x+dx*.65,z:p.z+dz*.65,vx:thrown?dx*6:0,vz:thrown?dz*6:0,thrown,expiresAt:thrown?now+definition.throwTicks:item.expiresAt,owner:p.id,blockedId:p.id,blockedUntil:now+20});p.heldItem=null;emit(w,thrown?'throw':'drop',p.x,p.z,p.id);
    }
    if(!p.heldItem&&now>=(p.stunnedUntil??0)){const item=closestGroundItem(state.ground,p,now,.85);if(item){state.ground.splice(state.ground.indexOf(item),1);p.heldItem={id:item.id,kind:item.kind,charges:item.charges??(isRanged(item.kind)?ITEM_DEFINITIONS[item.kind].charges:undefined),readyAt:item.readyAt,expiresAt:item.kind==='bomb'||item.activated?item.expiresAt:now+ITEM_DEFINITIONS[item.kind].durationTicks,activated:true};emit(w,'pickup',p.x,p.z,p.id);}}
  }
  stepRanged(w,commands,emit);
  for(let i=state.ground.length-1;i>=0;i--){const item=state.ground[i];if(!item.thrown&&!supported(w,item.x,item.z)){state.ground.splice(i,1);continue;}item.x+=item.vx*.05;item.z+=item.vz*.05;if(now>=item.expiresAt){if(item.kind==='bomb')explosions.push(item);state.ground.splice(i,1);}}
  for(const p of w.players)if(p.alive&&p.heldItem&&now>=p.heldItem.expiresAt){const bomb=p.heldItem.kind==='bomb';p.heldItem=null;if(bomb)explosions.push({x:p.x,z:p.z,owner:p.id});}
  for(const explosion of explosions){const definition=explosion.pod?ITEM_DEFINITIONS.pod:ITEM_DEFINITIONS.bomb;emit(w,'blast',explosion.x,explosion.z,explosion.owner??undefined,undefined,definition.blastRadius);for(const p of w.players){if(!p.alive)continue;const dx=p.x-explosion.x,dz=p.z-explosion.z,d=Math.hypot(dx,dz);if(d>definition.blastRadius)continue;const power=definition.push*(1-.35*d/definition.blastRadius)*(1+p.vulnerability)/playerMass(p);p.ix+=(d?dx/d:p.facingX)*power;p.iz+=(d?dz/d:p.facingZ)*power;p.stunnedUntil=Math.max(p.stunnedUntil??0,now+definition.stunTicks);p.dashTicks=0;p.vx=p.vz=0;p.lastHitTick=w.tick;p.lastHitBy=explosion.owner===p.id?null:explosion.owner;p.vulnerability=Math.min(w.config.rules.vulnerabilityCap,p.vulnerability+w.config.rules.vulnerabilityGain);if(p.lastHitBy){const source=w.players.find(q=>q.id===p.lastHitBy);if(source)source.hits++;}emit(w,'hit',p.x,p.z,explosion.owner??undefined,p.id,power);}}
}



/** Called on actual dash movement substeps; failed dash requests cannot open crates. */
export function openCrates(w:World,random:(w:World)=>number,emit:Emit){
 const ground=w.items?.ground;if(!ground)return;
 const choices=w.config.items?.filter(id=>id!=='crate')??[];
 for(let i=ground.length-1;i>=0;i--){const crate=ground[i];if(crate.kind!=='crate'||w.activeTick>=crate.expiresAt||!supported(w,crate.x,crate.z))continue;
  const opener=w.players.find(p=>p.alive&&p.dashTicks>0&&w.activeTick>=(p.stunnedUntil??0)&&supported(w,p.x,p.z)&&Math.hypot(p.x-crate.x,p.z-crate.z)<1);
  if(!opener)continue;ground.splice(i,1);
  if(choices.length){const kind=choices[Math.floor(random(w)*choices.length)];ground.push({...crate,id:`item-${++w.items!.serial}`,kind,expiresAt:w.activeTick+(kind==='bomb'?ITEM_DEFINITIONS.bomb.fuseTicks:kind==='pod'?160:400)});}
  emit(w,'crateopen',crate.x,crate.z,opener.id,undefined,choices.length?1:0);
 }
}


/** Bounded sampling avoids lost pickups on holes, warnings or inside obstacles. */
function spawnPoint(w:World,random:(w:World)=>number){
 const limit=Math.max(0,w.radius-2);
 const valid=(x:number,z:number)=>{const tile=tileAt(w,x,z);return tile!==null&&!w.tiles?.[tile]&&!w.config.obstacles.some(o=>Math.abs(x-o.x)<o.halfX+.5&&Math.abs(z-o.z)<o.halfZ+.5);};
 for(let attempt=0;attempt<16;attempt++){const angle=random(w)*Math.PI*2,radius=Math.sqrt(random(w))*limit,x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;if(valid(x,z))return {x,z};}
 return arenaTiles(w.config.rules.radius,w.config.rules.minimumRadius).find(t=>Math.hypot(t.x,t.z)<=limit&&valid(t.x,t.z));
}

