import {MODE_DEFINITIONS,BOSS_DEFINITIONS,coresPerPhase,TEAM_NAMES,validPartyOptions} from '../../shared/content/party.ts';
import type {ModeId,PartyOptions,World} from '../../shared/game-types/index.ts';
const el=<T extends HTMLElement=HTMLElement>(id:string)=>document.getElementById(id) as T;
let selection:PartyOptions={modeId:'arena',totalCount:4};
export const partyOptions=()=>({...selection});
export function setupParty(){
  const mode=el<HTMLSelectElement>('party-mode'),count=el<HTMLSelectElement>('party-count'),size=el<HTMLSelectElement>('party-size'),variant=el<HTMLSelectElement>('boss-variant');
  for(const [id,d]of Object.entries(MODE_DEFINITIONS))mode.add(new Option(d.name,id));
  for(let n=2;n<=12;n++)count.add(new Option(String(n),String(n)));
  for(const [id,d]of Object.entries(BOSS_DEFINITIONS))variant.add(new Option(d.name,id));
  try{const saved=JSON.parse(localStorage.getItem('knockbound.party')??'null');if(saved&&validPartyOptions(saved)&&saved.totalCount>=2)selection=saved;}catch{}
  mode.value=selection.modeId!;count.value=String(selection.totalCount);variant.value=selection.bossVariant??'cloud-king';
  function update(){
    const teams=mode.value==='teams',boss=mode.value==='boss';
    for(const option of count.options)option.disabled=teams&&![4,6,8,9,10,12].includes(Number(option.value));
    if(count.selectedOptions[0]?.disabled)count.value='4';
    const total=Number(count.value),previous=Number(size.value)||selection.teamSize||2;
    size.replaceChildren();for(let n=2;n<=6;n++)if(total%n===0&&total/n>=2)size.add(new Option(`${n} per team`,String(n)));
    size.value=[...size.options].some(o=>Number(o.value)===previous)?String(previous):size.options[0]?.value??'';
    selection={modeId:mode.value as ModeId,totalCount:total,...(teams?{teamSize:Number(size.value)}:{}),...(boss?{bossVariant:variant.value as 'cloud-king'|'tempest'}:{})};
    el('team-size-label').hidden=!teams;el('boss-variant-label').hidden=!boss;
    const format=teams?Array.from({length:total/selection.teamSize!},()=>selection.teamSize).join('v'):boss?`${total} allies`:`${total} contenders`;
    el('party-summary').textContent=`${MODE_DEFINITIONS[selection.modeId!].name} · ${format} · you + ${total-1} bots`;
    el('mode-intro').innerHTML=boss?'Face the Cloud King together.<br>Charge runes. Push the glowing core.<br>Calm the storm as a team.':teams?'Pick a side. Push together.<br>Protect your teammates. Hold your ground.<br>Be the last team standing.':'Find your footing in the clouds.<br>Dash into rivals. Stay on the island.<br>Be the last little legend standing.';
    el('party-help').textContent=boss?'Charge all three gold runes, then dash the glowing core into the north target. Everyone is allied. Boss arenas keep their floor; falling rocks and wind remain available.':teams?`${total/selection.teamSize!} equal teams. Last team standing wins. Friendly attacks do not launch teammates.`:'Everyone for themselves. Last survivor wins.';
    const humans=el<HTMLSelectElement>('human-count'),old=Number(humans.value)||1;humans.replaceChildren();for(let n=1;n<=total;n++)humans.add(new Option(`${n} human${n===1?'':'s'} + ${total-n} bots`,String(n)));humans.value=String(Math.min(old,total));
    el('room-format').textContent=`${MODE_DEFINITIONS[selection.modeId!].name} · ${format}. Seats alternate between teams in joining order. Change the format in Match setup.`;
    try{localStorage.setItem('knockbound.party',JSON.stringify(selection));}catch{}
  }
  mode.onchange=count.onchange=variant.onchange=update;
  size.onchange=()=>{selection.teamSize=Number(size.value);update();};
  update();el('party-open').onclick=()=>{el('party-panel').hidden=false;};el('party-close').onclick=()=>{el('party-panel').hidden=true;};
}
export function updatePartyHud(w:World,playerId:string){
  const boss=w.boss,teams=w.config.modeId==='teams',p=w.players.find(p=>p.id===playerId)!;
  el('objective-hud').hidden=!boss;
  if(teams)el('alive').textContent=`${new Set(w.players.filter(p=>p.alive).map(p=>p.teamId)).size} teams · ${w.players.filter(p=>p.alive).length} standing`;
  if(boss){
    const d=BOSS_DEFINITIONS[w.config.bossVariant??'cloud-king'];
    el('objective-title').textContent=`${d.name} · Phase ${boss.phase}/2 · ${boss.cores}/${coresPerPhase(w.config)*2} cores`;
    el('objective-copy').textContent=boss.stage==='runes'?`Stand on gold runes: ${boss.switches.filter(n=>n===20).length}/3 charged`:boss.stage==='exposed'?'Shield open! Dash the core into the north gold ring.':boss.stage==='won'?'The storm is over!':'Core landed! Get ready to recharge the runes.';
    el('boss-warning').textContent=boss.attack?boss.attack.kind==='sweep'?'WIND SWEEP — leave the red lane!':'SKY BOULDERS — leave the red circles!':'';
  }
  if(w.phase==='countdown'&&w.config.modeId!=='arena')el('announcement').innerHTML=`${Math.ceil((w.config.rules.countdownTicks-w.tick)*.05)}<small>${teams?`You are Team ${TEAM_NAMES[p.teamId!]}`:'Charge runes. Push the core. Together.'}</small>`;
  else if(w.phase==='active'&&w.activeTick<16&&w.config.modeId!=='arena')el('announcement').innerHTML=`GO!<small>${teams?'Last team standing':'Work together!'}</small>`;
  if(w.result&&w.config.modeId!=='arena'){
    const win=w.result.winnerTeamId!==undefined&&w.result.winnerTeamId===p.teamId;
    el('result-title').textContent=boss?(win?'Together, you calmed the storm!':'The storm wins this time.'):w.result.winnerTeamId===undefined?'A team draw!':`Team ${TEAM_NAMES[w.result.winnerTeamId]} wins!`;
    el('result-copy').textContent=boss?(win?'Every rune and every push brought you here.':'Protect your footing, charge the runes and line up the core.'):win?'Your team kept its footing.':'Regroup and take the island together.';
    if(boss)el('result-stats').innerHTML=`<div><strong>${boss.cores}</strong><small>Cores delivered</small></div><div><strong>${w.players.filter(p=>p.alive).length}</strong><small>Allies standing</small></div><div><strong>${Math.round(w.activeTick*.05)}s</strong><small>Round time</small></div>`;
  }
}
