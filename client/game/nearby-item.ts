import type {World} from '../../shared/game-types/index.ts';
import {ITEM_DEFINITIONS} from '../../shared/content/items.ts';
import {closestGroundItem} from '../../shared/content/item-pickup.ts';

/** Presentation guidance only; the shared simulation still owns pickup eligibility. */
export function nearbyItem(world:World,participantId:string){
  const player=world.players.find(p=>p.id===participantId);
  if(world.phase!=='active'||world.result||!player?.alive||world.activeTick<(player.stunnedUntil??0))return null;
  const selected=closestGroundItem(world.items?.ground??[],player,world.activeTick,3.25,true);
  if(!selected)return null;
  const action=selected.kind==='crate'?'dash to open':player.heldItem?selected.kind==='bomb'?'live fuse — Drop / Q to swap':'Drop / Q to swap':selected.kind==='bomb'?'live fuse — grab and toss quickly':'walk closer to pick up';
  return {item:selected,hasHeldItem:!!player.heldItem,message:`${ITEM_DEFINITIONS[selected.kind].name} · ${action}`};
}
