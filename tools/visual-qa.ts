import {updateItemHud} from '../client/ui/item-feedback.ts';
import {KeyboardInput} from '../client/input/keyboard.ts';
import {nearbyItem} from '../client/game/nearby-item.ts';
import {CameraLook,cameraRelative} from '../client/input/camera-controls.ts';
import {arenaTiles} from '../shared/content/tiles.ts';
import {Vector2} from 'three';
import {ArenaView} from '../client/rendering/arena-view.ts';
import {localConfig} from '../shared/content/arena.ts';
import {createMatch,step} from '../shared/simulation/index.ts';
import {botInputs} from '../shared/simulation/bots.ts';
import {ITEM_DEFINITIONS,type ItemId} from '../shared/content/items.ts';
import {CHARACTERS,type Appearance} from '../shared/content/characters.ts';
import {GpuTimer} from '../client/rendering/gpu-timer.ts';
const view=new ArenaView(document.querySelector<HTMLCanvasElement>('#game')!),report=document.querySelector<HTMLOutputElement>('#report')!;
await view.load();view.lobby=false;
const graphicsContext=view.renderer.getContext(),graphicsDebug=graphicsContext.getExtension('WEBGL_debug_renderer_info');
const graphicsBackend=graphicsDebug?String(graphicsContext.getParameter(graphicsDebug.UNMASKED_RENDERER_WEBGL)):'unavailable';
const gpuTimerAvailable=!!graphicsContext.getExtension('EXT_disjoint_timer_query_webgl2');
// Pinned Three0.180 WebGLRenderer requires WebGL2; its declaration retains a legacy union.
const gpuTimer=new GpuTimer(graphicsContext as WebGL2RenderingContext);let gpuMeasuring=false;
const originalRender=view.renderer.render.bind(view.renderer);
view.renderer.render=(scene,camera)=>{gpuTimer.begin(gpuMeasuring);try{originalRender(scene,camera);}finally{gpuTimer.end();}};
const aimLook=new CameraLook(document.querySelector<HTMLCanvasElement>('#game')!);let aimSequence=0,lastAimShot:{dx:number;dz:number}|null=null;

let reviewAppearance:Appearance='sprout',reviewItem:ItemId='blaster',reviewMotion='idle';
const reviewMotions:Record<string,{name:string;x:number;z:number}>={idle:{name:'Idle',x:0,z:0},right:{name:'Strafe right',x:1,z:0},left:{name:'Strafe left',x:-1,z:0},forward:{name:'Run forward',x:0,z:-1},back:{name:'Run backward',x:0,z:1}};
let scene='crowd',seed=31,world=makeWorld(),previous=structuredClone(world),last=0,accumulator=0,lastReport=0,stressTime=0,stressEvent=-1;
let practicePaused=false;
const practiceInput=new KeyboardInput(()=>{if(scene==='crateplay'){practicePaused=!practicePaused;practiceInput.clear();practiceInput.enabled=!practicePaused;}});
let benchmarkStart:number|null=null,frames:number[]=[],hiddenFrames=0,maximumParticles=0,maximumPulses=0;
let sampleDuration=180000,renderTimes:number[]=[],prepareTimes:number[]=[],callbackTimes:number[]=[];
let sceneTimes:number[]=[],submitTimes:number[]=[],matrixTimes:number[]=[];
const percentileCache=new WeakMap<number[],{count:number;value:number|null}>();
const percentile95=(values:number[])=>{
  // Keep growing-array sorts outside both warmup and the measurement window.
  if(benchmarkStart===null||performance.now()<benchmarkStart+sampleDuration)return null;
  const cached=percentileCache.get(values);if(cached?.count===values.length)return cached.value;
  const sorted=[...values].sort((a,b)=>a-b),value=sorted[Math.floor(sorted.length*.95)]??null;
  percentileCache.set(values,{count:values.length,value});return value;
};
function makeWorld(){const config=localConfig(seed,['crowd','stress'].includes(scene)?12:4,reviewAppearance);config.rules.countdownTicks=0;config.roster.forEach(p=>p.control='bot');return createMatch(config);}
function choose(name:string){
  practicePaused=false;practiceInput.clear();practiceInput.sequence=0;practiceInput.facingX=1;practiceInput.facingZ=0;practiceInput.enabled=name==='crateplay';
  scene=name;aimLook.enabled=scene==='aim';view.cameraMode=scene==='aim'?'third':'arena';lastAimShot=null;world=makeWorld();previous=structuredClone(world);accumulator=0;benchmarkStart=null;stressTime=0;stressEvent=-1;view.populate(world);
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
    world.players[0].z=2;
    world.config.items=['shovel','big','helicopter'];world.activeTick=100;
    world.players[0].heldItem={id:'qa-shovel',kind:'shovel',expiresAt:300,activated:true};world.players[1].heldItem={id:'qa-big',kind:'big',expiresAt:300,activated:true};world.players[2].heldItem={id:'qa-hat',kind:'helicopter',expiresAt:300,activated:true};
    world.items={nextSpawn:999,serial:3,ground:[{id:'qa-ground',kind:'helicopter',expiresAt:300,x:0,z:0,vx:0,vz:0,thrown:false,owner:null,blockedId:null,blockedUntil:0}]};
  }
  if(scene==='aim'){const player=world.players[0],motion=reviewMotions[reviewMotion];world.config.items=[reviewItem];player.x=player.z=0;player.facingX=motion.x;player.facingZ=motion.x||motion.z?motion.z:-1;player.vx=motion.x*3;player.vz=motion.z*3;player.heldItem={id:`aim-${reviewItem}`,kind:reviewItem,expiresAt:9999};world.items={serial:0,nextSpawn:9999,ground:[]};}
  if(scene==='remover'){world.players[0].x=0;world.players[0].z=2;world.players[0].facingX=0;world.players[0].facingZ=-1;world.players[0].heldItem={id:'qa-remover',kind:'remover',expiresAt:9999};world.config.items=['remover'];world.items={serial:0,nextSpawn:9999,ground:[]};}
  if(scene==='pod'){world.config.items=['pod'];world.activeTick=100;world.items={serial:1,nextSpawn:999,ground:[{id:'qa-pod',kind:'pod',x:0,z:0,vx:0,vz:0,armedAt:110,expiresAt:310,thrown:false,owner:'p1',blockedId:null,blockedUntil:0}]};}
  if(scene==='hazards'){world.activeTick=100;world.hazards={nextAt:999,serial:1,rocks:[{id:'qa-strike',x:0,z:0,at:120}],gust:{dx:1,dz:0,startAt:120,endAt:180}};}
  if(scene==='crate'||scene==='crateplay'){world.players[0].x=-1.3;world.players[0].z=0;world.players[0].facingX=1;world.players[0].facingZ=0;world.config.items=['crate','blaster'];world.activeTick=100;world.items={serial:1,nextSpawn:999,ground:[{id:'qa-crate',kind:'crate',expiresAt:400,x:0,z:0,vx:0,vz:0,thrown:false,owner:null,blockedId:null,blockedUntil:0}]};}
  if(scene==='ranged'){world.config.items=['blaster','wind','rock'];world.activeTick=100;world.players[0].heldItem={id:'qa-gun',kind:'blaster',expiresAt:400,charges:5};world.players[1].heldItem={id:'qa-wind',kind:'wind',expiresAt:400,charges:1};world.players[2].flattenedUntil=120;world.items={nextSpawn:999,serial:3,ground:[],shots:[{id:'qa-bubble',kind:'blaster',x:-3,z:0,dx:1,dz:0,distance:3,owner:'p1',hitTargets:[]},{id:'qa-gust',kind:'wind',x:0,z:0,dx:1,dz:0,distance:3,owner:'p1',hitTargets:[]},{id:'qa-rock',kind:'rock',x:3,z:0,dx:1,dz:0,distance:3,owner:'p1',hitTargets:[]}]};}
  if(scene==='flight'){world.config.items=[];world.items={nextSpawn:9999,serial:3,ground:[],shots:(['blaster','wind','rock'] as const).map((kind,i)=>({id:`flight-${kind}`,kind,x:-7,z:(i-1)*2,dx:1,dz:0,distance:0,owner:'p1',hitTargets:[]}))};}
  if(scene==='stress'){
    world.activeTick=100;
    const held:ItemId[]=['blaster','wind','rock','bomb','pod','remover','shovel','big','helicopter'];
    world.players.forEach((player,i)=>{player.heldItem={id:`stress-held-${i}`,kind:held[i%held.length],expiresAt:99999};player.itemAim={x:1,z:0};});
    world.items={serial:99,nextSpawn:99999,ground:([ 'bomb','pod','crate','shovel','helicopter'] as ItemId[]).map((kind,i)=>({id:`stress-ground-${i}`,kind,x:(i-2)*2,z:2,vx:0,vz:0,expiresAt:kind==='bomb'?130:99999,thrown:false,owner:null,blockedId:null,blockedUntil:0,...(kind==='pod'?{armedAt:115}:{})})),shots:Array.from({length:18},(_,i)=>({id:`stress-shot-${i}`,kind:(['blaster','wind','rock'] as const)[i%3],x:0,z:0,dx:1,dz:0,distance:0,owner:'p1',hitTargets:[]}))};
    world.hazards={serial:1,nextAt:99999,rocks:[{id:'stress-red',x:-2,z:-2,at:120}],gust:{dx:1,dz:0,startAt:120,endAt:180}};
    for(const tile of arenaTiles(world.config.rules.radius,world.config.rules.minimumRadius))if(tile.outer>8)world.tiles![tile.id]={warnAt:100,fallAt:120};
    world.tiles!['tile-1-4']={warnAt:60,fallAt:80};
  }
  previous=structuredClone(world);view.render(world,previous,1,.1);
}
for(const id of ['item-use','item-drop'])document.querySelector<HTMLButtonElement>('#'+id)!.onclick=()=>{if(scene==='crateplay'){if(id==='item-use')practiceInput.pendingUse=true;else practiceInput.pendingDrop=true;return;}previous=structuredClone(world);step(world,[cameraRelative({participantId:'p1',sequence:++aimSequence,x:0,z:0,dash:false,...(id==='item-use'?{useItem:true}:{dropItem:true})},scene==='aim'?aimLook.yaw:0,scene==='aim')]);view.events(world);};
document.querySelector<HTMLButtonElement>('#aim-first')!.onclick=()=>{choose('aim');view.cameraMode='first';};
document.querySelector<HTMLButtonElement>('#aim-strafe')!.onclick=()=>{reviewMotion='right';motionChoice.value='right';choose('aim');};
document.querySelector<HTMLButtonElement>('#aim-fire')!.onclick=()=>{if(scene!=='aim')return;world.activeTick+=8;previous=structuredClone(world);step(world,[cameraRelative({participantId:'p1',sequence:++aimSequence,x:0,z:0,dash:false,useItem:true},aimLook.yaw,true)]);const shot=world.items?.shots?.at(-1);if(shot)lastAimShot={dx:shot.dx,dz:shot.dz};view.events(world);};
document.querySelector<HTMLButtonElement>('#crate-dash')!.onclick=()=>{choose('crate');for(let i=0;i<3;i++){previous=structuredClone(world);step(world,[{participantId:'p1',sequence:i+1,x:1,z:0,dash:i===0}]);view.events(world);}};
document.querySelectorAll<HTMLButtonElement>('[data-scene]').forEach(button=>button.onclick=()=>{if(button.dataset.scene==='aim'){reviewMotion='idle';motionChoice.value='idle';}choose(button.dataset.scene!);});
document.querySelector<HTMLInputElement>('#reduced')!.onchange=event=>{view.reducedMotion=(event.target as HTMLInputElement).checked;choose(scene);};
document.querySelector<HTMLInputElement>('#quality')!.onchange=event=>{view.quality((event.target as HTMLInputElement).checked);choose(scene);};
function beginMeasurement(duration:number,warmup:number){gpuTimer.reset();choose('stress');view.profiling=true;sampleDuration=duration;benchmarkStart=performance.now()+warmup;frames=[];renderTimes=[];prepareTimes=[];callbackTimes=[];sceneTimes=[];submitTimes=[];matrixTimes=[];hiddenFrames=0;maximumParticles=0;maximumPulses=0;}
document.querySelector<HTMLButtonElement>('#benchmark')!.onclick=()=>beginMeasurement(180000,30000);
document.querySelector<HTMLButtonElement>('#profile')!.onclick=()=>beginMeasurement(30000,5000);
// Explicit review controls keep asset comparisons reproducible without browser-state injection.
const poseControls=document.createElement('details'),poseSummary=document.createElement('summary');poseSummary.textContent='Character / item pose review';poseControls.append(poseSummary);document.querySelector('header')!.append(poseControls);
function reviewChoice(labelText:string,choices:Record<string,{name:string}>,value:string,onChange:(value:string)=>void){
  const label=document.createElement('label'),select=document.createElement('select');label.append(document.createTextNode(labelText+' '),select);
  for(const [id,choice] of Object.entries(choices))select.add(new Option(choice.name,id));
  select.value=value;select.onchange=()=>{onChange(select.value);choose('aim');};poseControls.append(label);return select;
}
reviewChoice('Review character',CHARACTERS,reviewAppearance,value=>reviewAppearance=value as Appearance);
reviewChoice('Review held item',Object.fromEntries(Object.entries(ITEM_DEFINITIONS).filter(([id])=>id!=='crate')),reviewItem,value=>reviewItem=value as ItemId);
const motionChoice=reviewChoice('Review movement',reviewMotions,reviewMotion,value=>reviewMotion=value);
const flightButton=document.createElement('button');flightButton.textContent='Projectile motion';flightButton.onclick=()=>choose('flight');document.querySelector('header')!.append(flightButton);
const practiceButton=document.createElement('button');practiceButton.textContent='Crate control practice';practiceButton.title='WASD move, Space dash, E use, Q drop, Esc pause. Click again to reset.';practiceButton.onclick=()=>choose('crateplay');document.querySelector('header')!.append(practiceButton);
choose('crowd');
function frame(time:number){
  const callbackStart=performance.now(),measuring=benchmarkStart!==null&&time>=benchmarkStart&&time<benchmarkStart+sampleDuration;
  gpuTimer.poll();gpuMeasuring=measuring;
  const ms=last?time-last:0;last=time;
  if(scene==='crateplay'&&!practicePaused){accumulator+=Math.min(.1,ms/1000);while(accumulator>=.05){previous=structuredClone(world);step(world,[practiceInput.sample()]);view.events(world);accumulator-=.05;}}
  if(scene==='crowd'||scene==='flight'){
    accumulator+=Math.min(.1,ms/1000);
    while(accumulator>=.05){previous=structuredClone(world);step(world,scene==='crowd'?botInputs(world):[]);view.events(world);accumulator-=.05;}
    if(scene==='flight'&&!world.items?.shots?.length)choose('flight');
    if(world.result){seed++;world=makeWorld();previous=structuredClone(world);view.populate(world);}
  }
  if(scene==='stress'){
    stressTime+=Math.min(.1,ms/1000);previous=structuredClone(world);
    world.items?.shots?.forEach((shot,i)=>{const angle=stressTime*.8+i*Math.PI/9;shot.x=Math.cos(angle)*4;shot.z=Math.sin(angle)*4;shot.dx=-Math.sin(angle);shot.dz=Math.cos(angle);shot.distance=4;});
    world.players.forEach((player,i)=>{const angle=stressTime*.5+i*Math.PI/6,radius=i%2?6:8;player.x=Math.cos(angle)*radius;player.z=Math.sin(angle)*radius;player.facingX=-Math.sin(angle);player.facingZ=Math.cos(angle);player.vx=player.facingX*3;player.vz=player.facingZ*3;player.dashTicks=stressTime%1<.15?3:0;});
    const event=Math.floor(stressTime*2);
    if(event!==stressEvent){stressEvent=event;world.events=world.players.flatMap((p,i)=>[{id:`stress:${event}:${i}:dash`,tick:event,type:'dash' as const,x:p.x,z:p.z,source:p.id},{id:`stress:${event}:${i}:hit`,tick:event,type:'hit' as const,x:p.x,z:p.z,source:p.id,target:p.id,strength:12}]);view.events(world);}
  }
  if(scene==='aim'){view.cameraYaw=aimLook.yaw;view.cameraPitch=aimLook.pitch;}
  const renderStart=performance.now();
  view.render(world,previous,['crowd','flight','crateplay'].includes(scene)?accumulator/.05:1,['crowd','stress','aim','flight','crateplay'].includes(scene)&&!practicePaused?Math.min(.1,ms/1000):0);
  if(measuring){matrixTimes.push(view.timings.matrixCpuMilliseconds);sceneTimes.push(view.timings.sceneCpuMilliseconds);submitTimes.push(view.timings.submitCpuMilliseconds);renderTimes.push(performance.now()-renderStart);prepareTimes.push(renderStart-callbackStart);frames.push(ms);if(document.hidden)hiddenFrames++;maximumParticles=Math.max(maximumParticles,view.particles.length);maximumPulses=Math.max(maximumPulses,view.impacts.count());}
  updateItemHud(world.players[0],world.activeTick,world.phase,practicePaused);
  const nearby=nearbyItem(world,world.players[0].id),hint=document.querySelector<HTMLElement>('#pickup-hint')!;
  hint.hidden=!nearby;hint.textContent=nearby?.message??'';hint.classList.toggle('with-item',!!nearby?.hasHeldItem);
  if(time-lastReport>250){
    const resolution=view.renderer.getDrawingBufferSize(new Vector2());
    const base={scene,...(scene==='aim'?{cameraYaw:aimLook.yaw,lastAimShot,playerPosition:{x:world.players[0].x,z:world.players[0].z}}:{}),...(['crate','crateplay'].includes(scene)?{practicePaused,controls:'WASD move / Space dash / E use / Q drop / Esc pause',heldItem:world.players[0].heldItem?.kind??null,groundItems:world.items?.ground.map(i=>i.kind)}:{}),viewport:[innerWidth,innerHeight],drawingBuffer:resolution,reducedMotion:view.reducedMotion,drawCalls:view.renderer.info.render.calls,triangles:view.renderer.info.render.triangles,geometries:view.renderer.info.memory.geometries,particles:view.particles.length,pulses:view.impacts.count(),warning:view.warningBand.visible};
    if(benchmarkStart!==null){Object.assign(base,{benchmark:time<benchmarkStart?'warming up':time<benchmarkStart+sampleDuration?'measuring':'complete',sampleSeconds:sampleDuration/1000,secondsRemaining:Math.max(0,Math.ceil((benchmarkStart+sampleDuration-time)/1000)),sampleFrames:frames.length,p95Milliseconds:percentile95(frames),p95RenderCpuMilliseconds:percentile95(renderTimes),p95SceneCpuMilliseconds:percentile95(sceneTimes),p95SubmitCpuMilliseconds:percentile95(submitTimes),p95MatrixCpuMilliseconds:percentile95(matrixTimes),p95FixtureCpuMilliseconds:percentile95(prepareTimes),p95CallbackCpuMilliseconds:percentile95(callbackTimes),hiddenFrames,maximumParticles,maximumPulses});}
    Object.assign(base,{graphicsBackend,gpuTimerAvailable,gpuSamples:gpuTimer.samples.length,p95GpuMilliseconds:percentile95(gpuTimer.samples),gpuPending:gpuTimer.pendingCount,gpuDiscarded:gpuTimer.discarded});report.textContent=JSON.stringify(base);lastReport=time;
  }
  if(measuring)callbackTimes.push(performance.now()-callbackStart);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);




