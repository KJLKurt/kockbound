import {ITEM_HELP,pickupHint,updateItemHud} from '../ui/item-feedback.ts';
import {nearbyItem} from './nearby-item.ts';
import {SKINS,validAppearance,validSkin,type Appearance,type Skin} from '../../shared/content/characters.ts';
import {HAZARD_DEFINITIONS,type HazardId} from '../../shared/content/hazards.ts';
import {ITEM_DEFINITIONS,type ItemId} from '../../shared/content/items.ts';
import { Sound } from '../audio/sound.ts';
import { LocalSession } from './local-session.ts';
import { KeyboardInput } from '../input/keyboard.ts';
import { TouchControls } from '../input/touch.ts';
import {watchGraphicsContext} from '../rendering/context-recovery.ts';
import {CameraLook,cameraRelative,type CameraMode} from '../input/camera-controls.ts';
import { ArenaView, COLORS } from '../rendering/arena-view.ts';
import { OnlineSession } from '../networking/online-session.ts';
import type { Admission } from '../../shared/protocol/messages.ts';
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
let skin:Skin='classic';
let session:LocalSession|OnlineSession=new LocalSession(1),appearance:Appearance='sprout',playing=false,seed=1,view:ArenaView;
let joinGeneration=0,graphicsLost=false;
const sound=new Sound();
const playerId=()=>session instanceof OnlineSession?session.participantId:'p1';
let toastUntil=0,lastTime=0,resultShown=false,rosterSignature="";
const input=new KeyboardInput(()=>{if(!el('settings').hidden)closeSettings();else togglePause();});
const touch=new TouchControls(input,el('touch-stick'),el('touch-knob'));
const look=new CameraLook(el<HTMLCanvasElement>('game'),()=>togglePause(true));
function readSetting(key:string,fallback:boolean){try{const value=localStorage.getItem(key);return value===null?fallback:value==='true';}catch{return fallback;}}
function saveSetting(key:string,value:boolean){try{localStorage.setItem(key,String(value));}catch{/* Settings still apply when storage is disabled. */}}
function toast(message:string,duration=2400){el('toast').textContent=message;toastUntil=performance.now()+duration;}
function togglePause(force?:boolean){if(!playing || session.world.result || graphicsLost&&force!==true)return;session.paused=force??!session.paused;if(session.paused)look.enabled=false;el('pause-panel').hidden=!session.paused;input.enabled=!session.paused;input.clear();if(session instanceof OnlineSession){session.neutral();el('pause-copy').textContent='Your controls are paused. The shared round keeps going.';}else el('pause-copy').textContent='The local round is paused.';}
function closeSettings(){el('settings').hidden=true;if(playing&&!session.world.result)togglePause(false);}
function enter(next:LocalSession|OnlineSession){
  if(session instanceof OnlineSession)session.close();session=next;
  input.sequence=0;input.clear();const owner=session.world.players.find(p=>p.id===playerId())!;input.facingX=owner.facingX;input.facingZ=owner.facingZ;
  input.enabled=true;playing=true;resultShown=false;view.lobby=false;view.localParticipantId=playerId();view.populate(session.world);
  el('lobby').hidden=el('character-picker').hidden=el('lobby-footer').hidden=true;el('result').hidden=el('pause-panel').hidden=el('room-panel').hidden=true;el('hud').hidden=false;
  el('network-bar').hidden=!(session instanceof OnlineSession);el('again').textContent=session instanceof OnlineSession?'Back to room setup':'One more round →';
  if(session instanceof OnlineSession)el<HTMLAnchorElement>('another-player').href=`/?room=${session.roomId}`;
  el('result-note').textContent=session instanceof OnlineSession?'Local room preview · no online rewards':'Local practice · no online rewards';document.body.classList.add('playing');document.body.classList.toggle('network-play',session instanceof OnlineSession);updateHud();
}
const selectedItems=():ItemId[]=>el<HTMLInputElement>('items-enabled').checked?(Object.keys(ITEM_DEFINITIONS) as ItemId[]).filter(id=>el<HTMLInputElement>(id+'-enabled').checked):[];
const selectedHazards=():HazardId[]=>el<HTMLInputElement>('hazards-enabled').checked?(Object.keys(HAZARD_DEFINITIONS) as HazardId[]).filter(id=>el<HTMLInputElement>('hazard-'+id).checked):[];
function start(){joinGeneration++;seed++;enter(new LocalSession(seed,4,appearance,selectedItems(),selectedHazards(),skin));}
function home(){el('room-message').textContent='';joinGeneration++;if(session instanceof OnlineSession)session.close();playing=false;input.enabled=false;input.clear();session=new LocalSession(seed,4,appearance,[],[],skin);view.localParticipantId='p1';view.populate(session.world);view.lobby=true;el('lobby').hidden=el('character-picker').hidden=el('lobby-footer').hidden=false;el('hud').hidden=el('result').hidden=el('pause-panel').hidden=el('network-bar').hidden=el('error').hidden=el('room-panel').hidden=true;el('announcement').textContent='';el('toast').textContent='';document.body.classList.remove('playing','network-play');}
async function joinRoom(create:boolean){
  const generation=++joinGeneration,code=el<HTMLInputElement>('room-code').value.trim().toUpperCase();
  if(!create&&!/^[A-Z0-9]{6}$/.test(code)){el('room-message').textContent='Enter the six-character room code.';return;}
  el<HTMLButtonElement>('create-room').disabled=el<HTMLButtonElement>('join-room').disabled=true;el('room-message').textContent='Connecting to the island…';
  try{
    const response=await fetch(create?'/api/rooms':`/api/rooms/${code}/join`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(create?{humanCount:Number(el<HTMLSelectElement>('human-count').value),items:selectedItems(),hazards:selectedHazards()}:{})});
    const data=await response.json();if(!response.ok)throw new Error(typeof data.error==='string'?data.error:'The room could not be reached.');
    if(generation!==joinGeneration)return;
    const connected=await OnlineSession.connect(data as Admission,{appearance,skin,onStatus:message=>{if(generation===joinGeneration)el('network-status').textContent=message;}});
    if(generation!==joinGeneration){connected.close();return;}enter(connected);
  }catch(error){if(generation===joinGeneration)el('room-message').textContent=error instanceof Error?error.message:'Connection failed. Try again.';}
  finally{el<HTMLButtonElement>('create-room').disabled=el<HTMLButtonElement>('join-room').disabled=false;}
}
function updateHud(){const w=session.world,p=w.players.find(p=>p.id===playerId())!,localIndex=w.players.indexOf(p);
  updateItemHud(p,w.activeTick,w.phase,session.paused);
  el('alive').textContent=`${w.players.filter(p=>p.alive).length} standing`;
  const remaining=Math.max(0,Math.ceil((w.config.rules.durationTicks-w.activeTick)*.05));el('timer').textContent=`${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`;el('timer').classList.toggle('danger',remaining<=30);
  const signature=JSON.stringify([w.config.matchId,playerId(),w.players.map(p=>[p.id,p.name,p.control,p.alive])]);
  if(signature!==rosterSignature){rosterSignature=signature;
  el('roster').replaceChildren(...w.players.map((p,i)=>{const row=document.createElement('div');row.className=`roster-row${p.alive?'':' out'}`;const dot=document.createElement('i');dot.style.background=`#${COLORS[i===localIndex?0:i===0?localIndex:i].toString(16)}`;const name=document.createElement('span');name.textContent=p.id===playerId()?'You':p.name;const kind=document.createElement('small');kind.textContent=p.id===playerId()?'YOU':p.control==='bot'?'CPU':'PLAYER';row.append(dot,name,kind);return row;}));
  }
  el('dash-fill').style.transform=`scaleY(${1-p.cooldownTicks/w.config.rules.cooldownTicks})`;el('vulnerability').textContent=!p.alive?'Watching the remaining players':p.vulnerability>.1?`${Math.round(p.vulnerability*100)}% extra knockback`:'Keep your footing';
  if(session instanceof OnlineSession&&session.roomPhase==='waiting')el('announcement').innerHTML='Ready?<small>Waiting for everyone to join</small>';
  else if(w.phase==='countdown')el('announcement').innerHTML=`${Math.ceil((w.config.rules.countdownTicks-w.tick)*.05)}<small>You are the gold marker</small>`;
  else if(w.activeTick<16)el('announcement').innerHTML='GO!<small>Last one standing</small>';
  else el('announcement').textContent='';
  if(session instanceof OnlineSession)el('another-player').hidden=session.roomPhase!=='waiting';
  if(w.result&&!resultShown){resultShown=true;input.enabled=false;const winner=w.players.find(p=>p.id===w.result?.winnerId);const won=winner?.id===p.id;el('result-title').textContent=won?'Little legend. Big win.':winner?`${winner.name} takes the crown!`:'Too close to call.';el('result-copy').textContent=won?'You kept your footing when it mattered.':winner?'A good dash can turn the next round around.':'A sky-high draw. Settle it in the next round.';el('result-stats').innerHTML=`<div><strong>${p.hits}</strong><small>Hits landed</small></div><div><strong>${p.knockouts}</strong><small>Ring-outs</small></div><div><strong>${Math.round(w.activeTick*.05)}s</strong><small>Round time</small></div>`;setTimeout(()=>{if(playing&&session.world.config.matchId===w.config.matchId&&session.world.result)el('result').hidden=false;},900);}
}
el('emote-wave').onclick=()=>view?.playEmote('emote_01');el('emote-dance').onclick=()=>view?.playEmote('emote_02');
el('item-use').onpointerdown=e=>{e.preventDefault();if(input.enabled)input.pendingUse=true;};el('item-drop').onclick=()=>{if(input.enabled)input.pendingDrop=true;};
el('retry-audio').onclick=()=>void sound.unlock(true);el('graphics-reload').onclick=()=>location.reload();
el('play').onclick=start;el('again').onclick=()=>{if(session instanceof OnlineSession){home();el('room-panel').hidden=false;}else start();};el('home').onclick=home;el('quit').onclick=home;el('pause').onclick=()=>togglePause();el('resume').onclick=()=>togglePause(false);
el('multiplayer-open').onclick=()=>{el('room-message').textContent='';el('room-panel').hidden=false;};el('room-close').onclick=()=>{joinGeneration++;el('room-panel').hidden=true;};el('create-room').onclick=()=>void joinRoom(true);el('join-room').onclick=()=>void joinRoom(false);el('error-home').onclick=()=>{if(view)home();else location.reload();};
el('dash-button').onpointerdown=e=>{e.preventDefault();if(input.enabled&&!el<HTMLButtonElement>('dash-button').disabled)input.pendingDash=true;};
el('settings-open').onclick=()=>{if(playing&&!session.world.result)togglePause(true);el('pause-panel').hidden=true;el('settings').hidden=false;};el('settings-close').onclick=closeSettings;
document.querySelectorAll<HTMLButtonElement>('[data-character]').forEach(button=>button.onclick=()=>{appearance=button.dataset.character as typeof appearance;try{localStorage.setItem('knockbound.character',appearance);}catch{}for(const b of document.querySelectorAll<HTMLButtonElement>('[data-character]')){b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));}session=new LocalSession(seed,4,appearance,[],[],skin);view.populate(session.world);});
window.addEventListener('blur',()=>{if(playing&&!session.paused&&!session.world.result)togglePause(true);});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing&&!session.paused&&!session.world.result)togglePause(true);});
async function boot(){try{
  sound.prepare();
  const palette=el<HTMLSelectElement>('skin-choice');for(const [id,option]of Object.entries(SKINS)){const element=document.createElement('option');element.value=id;element.textContent=option.name;palette.append(element);}palette.onchange=()=>{skin=palette.value as Skin;try{localStorage.setItem('knockbound.skin',skin);}catch{}session=new LocalSession(seed,4,appearance,[],[],skin);view.populate(session.world);};
  for(const [id,definition] of Object.entries(ITEM_DEFINITIONS)){const label=document.createElement('label');label.className='toggle';const text=document.createElement('span');text.textContent=definition.name;const help=document.createElement('small');help.textContent=ITEM_HELP[id as ItemId];text.append(help);const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.id=id+'-enabled';label.append(text,checkbox);el('item-options').append(label);}
  for(const id of ['items-enabled',...Object.keys(ITEM_DEFINITIONS).map(id=>id+'-enabled')]){const toggle=el<HTMLInputElement>(id);toggle.checked=readSetting('knockbound.'+id,true);toggle.onchange=()=>saveSetting('knockbound.'+id,toggle.checked);}
  for(const [id,definition]of Object.entries(HAZARD_DEFINITIONS)){const label=document.createElement('label');label.className='toggle';const text=document.createElement('span');text.textContent=definition.name;const help=document.createElement('small');help.textContent=({tiles:'Gold-marked tiles fall away. Move to intact ground.',skyrock:'Red circles mark incoming rocks. Step clear to avoid being flattened.',gust:'Arrows warn which way the wind will push. Leave room from the edge.'} as Record<HazardId,string>)[id as HazardId];text.append(help);const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.id='hazard-'+id;label.append(text,checkbox);el('hazard-options').append(label);}
  for(const id of ['hazards-enabled',...Object.keys(HAZARD_DEFINITIONS).map(id=>'hazard-'+id)]){const toggle=el<HTMLInputElement>(id);toggle.checked=readSetting('knockbound.'+id,true);toggle.onchange=()=>saveSetting('knockbound.'+id,toggle.checked);}
  try{const a=localStorage.getItem('knockbound.character'),s=localStorage.getItem('knockbound.skin');if(validAppearance(a))appearance=a;if(validSkin(s))skin=s;}catch{}palette.value=skin;session=new LocalSession(seed,4,appearance,[],[],skin);for(const b of document.querySelectorAll<HTMLButtonElement>('[data-character]')){const selected=b.dataset.character===appearance;b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));}
  view=new ArenaView(el<HTMLCanvasElement>('game'));
  watchGraphicsContext(el('game'),()=>{
    graphicsLost=true;togglePause(true);input.enabled=false;input.clear();touch.clear();sound.setHidden(true);
    el('graphics-copy').textContent=session instanceof OnlineSession?'Your controls are paused while graphics recover. The online round keeps going.':'Your local round is paused while graphics recover.';
    el('graphics-panel').hidden=false;
  },()=>{graphicsLost=false;el('graphics-panel').hidden=true;sound.setHidden(document.hidden||graphicsLost);});
  await view.load();view.populate(session.world);
  const mouseLook=el<HTMLInputElement>('mouse-look');mouseLook.checked=readSetting('knockbound.mouseLook',true);look.mouseLook=mouseLook.checked;mouseLook.onchange=()=>{look.enabled=false;look.mouseLook=mouseLook.checked;saveSetting('knockbound.mouseLook',mouseLook.checked);};
  const camera=el<HTMLSelectElement>('camera-view');let savedCamera='arena';try{savedCamera=localStorage.getItem('knockbound.camera')??'arena';}catch{}
  camera.value=['arena','third','first'].includes(savedCamera)?savedCamera:'arena';view.cameraMode=camera.value as CameraMode;
  camera.onchange=()=>{view.cameraMode=camera.value as CameraMode;input.clear();look.yaw=0;look.pitch=-.08;try{localStorage.setItem('knockbound.camera',camera.value);}catch{}};
  for(const key of ['master','music','sfx'] as const){const slider=el<HTMLInputElement>('volume-'+key);slider.value=String(Math.round(sound.settings[key]*100));slider.oninput=()=>sound.setVolume(key,Number(slider.value)/100);}
  const mute=el<HTMLInputElement>('mute-audio');mute.checked=sound.settings.muted;mute.onchange=()=>sound.setVolume('muted',mute.checked);
  document.addEventListener('pointerdown',()=>{void sound.unlock();}, {capture:true});
  document.addEventListener('keydown',()=>{void sound.unlock();}, {capture:true});
  document.addEventListener('click',event=>{if((event.target as HTMLElement).closest('button'))sound.cue('ui',1,.45);});
  document.addEventListener('visibilitychange',()=>sound.setHidden(document.hidden||graphicsLost));
  const reduced=el<HTMLInputElement>('reduced-motion'),quality=el<HTMLInputElement>('quality');
  reduced.checked=readSetting('knockbound.reducedMotion',matchMedia('(prefers-reduced-motion: reduce)').matches);view.reducedMotion=reduced.checked;
  quality.checked=readSetting('knockbound.highQuality',!matchMedia('(pointer: coarse)').matches);view.quality(quality.checked);
  reduced.onchange=()=>{view.reducedMotion=reduced.checked;saveSetting('knockbound.reducedMotion',reduced.checked);};quality.onchange=()=>{view.quality(quality.checked);saveSetting('knockbound.highQuality',quality.checked);};
  el<HTMLButtonElement>('play').disabled=false;el('play').innerHTML='Let’s play <span>→</span>';
  el('multiplayer-open').hidden=document.body.dataset.multiplayer!=='true';
  const roomCode=new URLSearchParams(location.search).get('room');if(roomCode&&/^[A-Z0-9]{6}$/.test(roomCode)&&document.body.dataset.multiplayer==='true'){el<HTMLInputElement>('room-code').value=roomCode;el('room-panel').hidden=false;}
  const frame=(time:number)=>{const dt=Math.min(.1,(time-lastTime)/1000||0);lastTime=time;let alpha=1;
    const canTouch=playing&&input.enabled&&!session.paused&&!session.world.result&&!!session.world.players.find(p=>p.id===playerId())?.alive;
    look.enabled=canTouch&&view.cameraMode!=='arena';look.update(dt);view.cameraYaw=look.yaw;view.cameraPitch=look.pitch;el('look-hint').hidden=!look.enabled;el('look-hint').textContent=look.hint;
    el('item-hud').hidden=!canTouch||!session.world.players.find(p=>p.id===playerId())?.heldItem;
    touch.update(canTouch);el('touch-controls').hidden=!playing||session.paused||!!session.world.result;
    const nearby=canTouch?nearbyItem(session.world,playerId()):null;el('pickup-hint').hidden=!nearby;el('pickup-hint').textContent=nearby?.message??'';el('pickup-hint').classList.toggle('with-item',!!nearby?.hasHeldItem);
    if(session instanceof OnlineSession){input.enabled=playing&&!graphicsLost&&!session.paused&&session.connected&&session.roomPhase==='active'&&!session.failure;if(!input.enabled)input.clear();if(session.failure){el('error-message').textContent=session.failure;el('error').hidden=false;}}
    const owner=session.world.players.find(p=>p.id===playerId());
    const dashStatus=!owner?.alive?'Enjoy the view':session.paused?'Paused':!input.enabled?'Controls unavailable':session.world.phase!=='active'?'Get ready':session.world.activeTick<(owner.stunnedUntil??0)?'Recovering':owner.cooldownTicks>0?`Dash in ${(owner.cooldownTicks*.05).toFixed(1)}s`:'Dash ready';
    el('dash-label').textContent=dashStatus;
    el<HTMLButtonElement>('dash-button').disabled=!playing||!!session.world.result||dashStatus!=='Dash ready';
    el('dash-button').setAttribute('aria-label',dashStatus==='Dash ready'?'Dash':dashStatus);
    if(playing)alpha=session.advance(dt,()=>cameraRelative(input.sample(),view.cameraMode==='arena'?0:look.yaw,view.cameraMode!=='arena'),w=>{sound.update(w,playing,session.paused,playerId());view.events(w);for(const e of w.events){if(e.type==='pickup'&&e.source===playerId())toast(pickupHint(w.players.find(p=>p.id===playerId())?.heldItem?.kind),4000);if(e.type==='ringout'&&e.target===playerId())toast('You’re out! Watch the round, or pause to leave.');if(e.type==='podarm')toast('Spring pod arming! Step outside the marked area.');if(e.type==='hazardwarning')toast(e.strength===3?'Wind is coming! Watch the arrows.':e.strength===2?'Look out! Move clear of the red circles.':'A tile is falling! Move off the gold block.');if(e.type==='crateopen'&&e.source===playerId())toast('Crate opened! Walk near the revealed item to pick it up.');if(e.type==='tilewarning')toast('A marked tile is falling! Step clear.');if(e.type==='warning')toast('The edge is about to shrink. Head inward!');}updateHud();});
    sound.update(session.world,playing,session.paused,playerId());el('audio-status').textContent=sound.status;el('retry-audio').hidden=!sound.retryAvailable;
    if(time>toastUntil)el('toast').textContent='';view.render(session.world,session.previous,alpha,session.paused&&!(session instanceof OnlineSession)?0:dt);requestAnimationFrame(frame);};requestAnimationFrame(frame);
  // Read-only QA snapshot; no state mutation or outcome injection.
  Object.defineProperty(window,'knockbound',{value:{snapshot:()=>structuredClone(session.world),metrics:()=>({overruns:session.overruns,drawCalls:view.renderer.info.render.calls,triangles:view.renderer.info.render.triangles,geometries:view.renderer.info.memory.geometries,playing,paused:session.paused,audio:sound.metrics()})}});
}catch(error){el('error-message').textContent=`${error instanceof Error?error.message:'Loading failed'}. A browser with WebGL support is required.`;el('error').hidden=false;console.error(error);}}
void boot();














