import {arenaTiles} from '../shared/content/tiles.ts';
import {Vector2} from 'three';
import {ArenaView} from '../client/rendering/arena-view.ts';
import {localConfig} from '../shared/content/arena.ts';
import {createMatch,step} from '../shared/simulation/index.ts';
import {botInputs} from '../shared/simulation/bots.ts';
const view=new ArenaView(document.querySelector<HTMLCanvasElement>('#game')!),report=document.querySelector<HTMLOutputElement>('#report')!;
await view.load();view.lobby=false;
let scene='crowd',seed=31,world=makeWorld(),previous=structuredClone(world),last=0,accumulator=0,lastReport=0,stressTime=0,stressEvent=-1;
let benchmarkStart:number|null=null,frames:number[]=[],hiddenFrames=0,maximumParticles=0,maximumPulses=0;
function makeWorld(){const config=localConfig(seed,['crowd','stress'].includes(scene)?12:4);config.rules.countdownTicks=0;config.roster.forEach(p=>p.control='bot');return createMatch(config);}
function choose(name:string){
  scene=name;world=makeWorld();previous=structuredClone(world);accumulator=0;benchmarkStart=null;stressTime=0;stressEvent=-1;view.populate(world);
  if(scene==='warning'||scene==='shrink'){world.activeTick=world.config.rules.durationTicks-world.config.rules.suddenDeathTicks-(scene==='warning'?20:-200);world.tick=world.activeTick;if(scene==='shrink')world.radius=7.4;}
  if(scene==='warning'||scene==='shrink'){for(const tile of arenaTiles(world.config.rules.radius,world.config.rules.minimumRadius)){if(tile.id==='core')continue;if(tile.outer>8)world.tiles![tile.id]={warnAt:world.activeTick-(scene==='shrink'?30:0),fallAt:world.activeTick+(scene==='shrink'?-10:20)+(Number(tile.id.split('-')[2])%6)*2};}if(scene==='shrink')world.tiles!['tile-1-4']={warnAt:world.activeTick-60,fallAt:world.activeTick-40};}
  if(scene==='effects'){
    world.players[0].x=-2;world.players[0].z=0;world.players[0].facingX=1;world.players[0].facingZ=0;world.players[0].dashTicks=3;
    world.players[1].x=0;world.players[1].z=0;
    world.events=[{id:'qa:1',tick:1,type:'dash',x:-2,z:0,source:'p1'},{id:'qa:2',tick:1,type:'hit',x:0,z:0,source:'p1',target:'p2',strength:12}];view.events(world);
  }
  if(scene==='bomb'){
    world.config.items=['bomb'];world.activeTick=90;world.items={nextSpawn:999,serial:2,ground:[{id:'qa-bomb',kind:'bomb',expiresAt:110,x:0,z:0,vx:0,vz:0,thrown:false,owner:null,blockedId:null,blockedUntil:0}]};
    world.players[0].heldItem={id:'qa-held',kind:'bomb',expiresAt:130};
  }
  if(scene==='passive'){
    world.config.items=['shovel','big','helicopter'];world.activeTick=100;
    world.players[0].heldItem={id:'qa-shovel',kind:'shovel',expiresAt:300,activated:true};world.players[1].heldItem={id:'qa-big',kind:'big',expiresAt:300,activated:true};world.players[2].heldItem={id:'qa-hat',kind:'helicopter',expiresAt:300,activated:true};
    world.items={nextSpawn:999,serial:3,ground:[{id:'qa-ground',kind:'helicopter',expiresAt:300,x:0,z:0,vx:0,vz:0,thrown:false,owner:null,blockedId:null,blockedUntil:0}]};
  }
  if(scene==='pod'){world.config.items=['pod'];world.activeTick=100;world.items={serial:1,nextSpawn:999,ground:[{id:'qa-pod',kind:'pod',x:0,z:0,vx:0,vz:0,armedAt:110,expiresAt:310,thrown:false,owner:'p1',blockedId:null,blockedUntil:0}]};}
  if(scene==='hazards'){world.activeTick=100;world.hazards={nextAt:999,serial:1,rocks:[{id:'qa-strike',x:0,z:0,at:120}],gust:{dx:1,dz:0,startAt:120,endAt:180}};}
  if(scene==='crate'){world.players[0].x=-1.3;world.players[0].z=0;world.players[0].facingX=1;world.players[0].facingZ=0;world.config.items=['crate','blaster'];world.activeTick=100;world.items={serial:1,nextSpawn:999,ground:[{id:'qa-crate',kind:'crate',expiresAt:400,x:0,z:0,vx:0,vz:0,thrown:false,owner:null,blockedId:null,blockedUntil:0}]};}
  if(scene==='ranged'){world.config.items=['blaster','wind','rock'];world.activeTick=100;world.players[0].heldItem={id:'qa-gun',kind:'blaster',expiresAt:400,charges:5};world.players[1].heldItem={id:'qa-wind',kind:'wind',expiresAt:400,charges:1};world.players[2].flattenedUntil=120;world.items={nextSpawn:999,serial:3,ground:[],shots:[{id:'qa-bubble',kind:'blaster',x:-3,z:0,dx:1,dz:0,distance:3,owner:'p1',hitTargets:[]},{id:'qa-gust',kind:'wind',x:0,z:0,dx:1,dz:0,distance:3,owner:'p1',hitTargets:[]},{id:'qa-rock',kind:'rock',x:3,z:0,dx:1,dz:0,distance:3,owner:'p1',hitTargets:[]}]};}
  previous=structuredClone(world);view.render(world,previous,1,.1);
}
document.querySelector<HTMLButtonElement>('#crate-dash')!.onclick=()=>{choose('crate');for(let i=0;i<3;i++){previous=structuredClone(world);step(world,[{participantId:'p1',sequence:i+1,x:1,z:0,dash:i===0}]);view.events(world);}};
document.querySelectorAll<HTMLButtonElement>('[data-scene]').forEach(button=>button.onclick=()=>choose(button.dataset.scene!));
document.querySelector<HTMLInputElement>('#reduced')!.onchange=event=>{view.reducedMotion=(event.target as HTMLInputElement).checked;choose(scene);};
document.querySelector<HTMLInputElement>('#quality')!.onchange=event=>{view.quality((event.target as HTMLInputElement).checked);choose(scene);};
document.querySelector<HTMLButtonElement>('#benchmark')!.onclick=()=>{choose('stress');benchmarkStart=performance.now()+30000;frames=[];hiddenFrames=0;maximumParticles=0;maximumPulses=0;};
choose('crowd');
function frame(time:number){
  const ms=last?time-last:0;last=time;
  if(scene==='crowd'){
    accumulator+=Math.min(.1,ms/1000);
    while(accumulator>=.05){previous=structuredClone(world);step(world,botInputs(world));view.events(world);accumulator-=.05;}
    if(world.result){seed++;world=makeWorld();previous=structuredClone(world);view.populate(world);}
  }
  if(scene==='stress'){
    stressTime+=Math.min(.1,ms/1000);previous=structuredClone(world);
    world.players.forEach((player,i)=>{const angle=stressTime*.5+i*Math.PI/6,radius=i%2?6:8;player.x=Math.cos(angle)*radius;player.z=Math.sin(angle)*radius;player.facingX=-Math.sin(angle);player.facingZ=Math.cos(angle);player.vx=player.facingX*3;player.vz=player.facingZ*3;player.dashTicks=stressTime%1<.15?3:0;});
    const event=Math.floor(stressTime*2);
    if(event!==stressEvent){stressEvent=event;world.events=world.players.flatMap((p,i)=>[{id:`stress:${event}:${i}:dash`,tick:event,type:'dash' as const,x:p.x,z:p.z,source:p.id},{id:`stress:${event}:${i}:hit`,tick:event,type:'hit' as const,x:p.x,z:p.z,source:p.id,target:p.id,strength:12}]);view.events(world);}
  }
  view.render(world,previous,scene==='crowd'?accumulator/.05:1,['crowd','stress'].includes(scene)?Math.min(.1,ms/1000):0);
  if(benchmarkStart!==null&&time>=benchmarkStart&&time<benchmarkStart+180000){frames.push(ms);if(document.hidden)hiddenFrames++;maximumParticles=Math.max(maximumParticles,view.particles.length);maximumPulses=Math.max(maximumPulses,view.impacts.count());}
  if(time-lastReport>250){
    const resolution=view.renderer.getDrawingBufferSize(new Vector2());
    const base={scene,...(scene==='crate'?{heldItem:world.players[0].heldItem?.kind??null,groundItems:world.items?.ground.map(i=>i.kind)}:{}),viewport:[innerWidth,innerHeight],drawingBuffer:resolution,reducedMotion:view.reducedMotion,drawCalls:view.renderer.info.render.calls,triangles:view.renderer.info.render.triangles,geometries:view.renderer.info.memory.geometries,particles:view.particles.length,pulses:view.impacts.count(),warning:view.warningBand.visible};
    if(benchmarkStart!==null){const sorted=[...frames].sort((a,b)=>a-b);Object.assign(base,{benchmark:time<benchmarkStart?'warming up':time<benchmarkStart+180000?'measuring':'complete',secondsRemaining:Math.max(0,Math.ceil((benchmarkStart+180000-time)/1000)),sampleFrames:frames.length,p95Milliseconds:sorted[Math.floor(sorted.length*.95)]??null,hiddenFrames,maximumParticles,maximumPulses});}
    report.textContent=JSON.stringify(base);lastReport=time;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

