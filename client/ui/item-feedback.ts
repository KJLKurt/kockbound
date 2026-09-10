import {isRanged,ITEM_DEFINITIONS,type ItemId} from '../../shared/content/items.ts';
import type {Player,Phase} from '../../shared/game-types/index.ts';

export const PICKUP_HINTS:Record<ItemId,string>={
  bomb:'Live bomb! Tap Toss / E before the fuse runs out.',
  shovel:'Shovel equipped: dash to push from farther away. Drop / Q to swap.',
  big:'Big mode is active: you are heavier and harder to push.',
  helicopter:'Rescue hat equipped: it brings you back from one fall.',
  blaster:'Bubble blaster ready. Aim, then tap Fire / E. Check the remaining shots.',
  wind:'One strong wind blast. Aim, then tap Fire / E.',
  rock:'One rolling rock. Aim, then tap Fire / E to flatten rivals.',
  remover:'Aim for the cyan tile, then tap Remove / E. Gold means it will fall.',
  pod:'Tap Plant / E, then step away. The trap can catch you too!',
  crate:'Dash into the crate to reveal an item.'
};
export const pickupHint=(kind?:ItemId)=>kind?PICKUP_HINTS[kind]:'Item picked up.';
export const ITEM_HELP:Record<ItemId,string>={
  bomb:'Toss it quickly. Its blast pushes and stuns everyone nearby, including you.',
  shovel:'While held, your dash reaches farther in front of you.',
  big:'Temporarily grow bigger and become harder to push.',
  helicopter:'Rescues you from one fall while you hold it.',
  blaster:'Several light pushing shots. Aim and tap Fire for each shot.',
  wind:'One powerful blast that gets weaker with distance.',
  rock:'One rolling rock that flattens and briefly stuns players in its path.',
  remover:'Preview the cyan tile, then remove it after a warning. The hole can catch anyone.',
  crate:'Dash into it to reveal another enabled item.',
  pod:'Plant it and leave the marked area. The armed trap can catch you too.'
};
const actions:Partial<Record<ItemId,string>>={bomb:'Toss',blaster:'Fire',wind:'Fire',rock:'Fire',remover:'Remove',pod:'Plant'};
export function updateItemHud(player:Player,tick:number,phase:Phase,paused:boolean){
  const hud=document.querySelector<HTMLElement>('#item-hud')!,use=document.querySelector<HTMLButtonElement>('#item-use')!,drop=document.querySelector<HTMLButtonElement>('#item-drop')!,status=document.querySelector<HTMLElement>('#item-status')!;
  const item=player.heldItem;hud.hidden=!item||!player.alive||paused||phase==='results';
  if(!item)return;
  const action=actions[item.kind],stunned=tick<(player.stunnedUntil??0),wait=Math.max(0,(item.readyAt??0)-tick),expired=tick>=item.expiresAt;
  use.hidden=!action;use.disabled=!action||stunned||wait>0||expired||phase!=='active';drop.disabled=stunned||expired||phase!=='active';
  use.textContent=stunned?'Stunned':wait?`${(wait*.05).toFixed(1)}s`:action??'Active';
  use.setAttribute('aria-label',stunned?'Recovering from stun':wait?`${action} ready in ${(wait*.05).toFixed(1)} seconds`:`${action??'Active'} item (E)`);
  const charges=item.charges??(isRanged(item.kind)?ITEM_DEFINITIONS[item.kind].charges:undefined);
  status.textContent=ITEM_DEFINITIONS[item.kind].name+(charges!==undefined?` · ${charges} ${charges===1?'shot':'shots'}`:'')+` · ${Math.max(0,(item.expiresAt-tick)*.05).toFixed(1)}s`;
  hud.title=PICKUP_HINTS[item.kind];
}
