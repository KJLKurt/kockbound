import type {World} from '../../shared/game-types/index.ts';
export type VolumeSettings={master:number;music:number;sfx:number;muted:boolean};
const defaults:VolumeSettings={master:.8,music:.55,sfx:.8,muted:false};
export function readVolumes(raw:string|null):VolumeSettings{
  try{const value=JSON.parse(raw??'{}');return {master:volume(value?.master,defaults.master),music:volume(value?.music,defaults.music),sfx:volume(value?.sfx,defaults.sfx),muted:typeof value?.muted==='boolean'?value.muted:false};}catch{return {...defaults};}
}
const volume=(value:unknown,fallback:number)=>typeof value==='number'&&Number.isFinite(value)?Math.max(0,Math.min(1,value)):fallback;
const effects=['dash','hit','ringout','warning','countdown','go','victory','defeat','ui'];
const names=['harmony','rhythm','spark',...effects.flatMap(name=>Array.from({length:['dash','hit','ringout'].includes(name)?3:1},(_,i)=>`${name}-${i}`))];
type Voice={source:AudioBufferSourceNode;gain:GainNode;priority:number};
export class Sound {
  settings:VolumeSettings;status='Sound starts with your first click';
  retryAvailable=false;private retryAfter=0;
  private context:AudioContext|null=null;private master!:GainNode;private music!:GainNode;private sfx!:GainNode;private duck!:GainNode;
  private layers=new Map<string,GainNode>();private buffers=new Map<string,AudioBuffer>();private voices:Voice[]=[];
  private raw:Promise<ArrayBuffer[]>|null=null;private loading:Promise<void>|null=null;private mode='';private desired='lobby';private epoch=0;
  private matchId='';private serial=0;private countdown=-1;private variant=0;private hidden=false;
  constructor(){let stored=null;try{stored=localStorage.getItem('knockbound.audio');}catch{}this.settings=readVolumes(stored);}
  prepare(){this.raw??=Promise.all(names.map(async name=>{const response=await fetch(new URL(`../../assets/runtime/audio.sky-ring/r001/${name}.wav`,import.meta.url));if(!response.ok)throw new Error('Sound download failed');return response.arrayBuffer();}));void this.raw.catch(()=>{this.retryAvailable=true;this.status='Sound unavailable · retry in Settings';});}
  async unlock(retry=false){
    if(!retry&&Date.now()<this.retryAfter)return;
    if(retry&&this.retryAvailable&&!this.loading)this.raw=null;
    try{
      if(!this.context){
        this.context=new AudioContext();this.master=this.context.createGain();this.music=this.context.createGain();this.sfx=this.context.createGain();this.duck=this.context.createGain();
        this.context.onstatechange=()=>this.reportContextState();
        const limiter=this.context.createDynamicsCompressor();limiter.threshold.value=-8;limiter.knee.value=5;limiter.ratio.value=12;limiter.attack.value=.003;limiter.release.value=.12;
        this.music.connect(this.duck);this.duck.connect(this.master);this.sfx.connect(this.master);this.master.connect(limiter);limiter.connect(this.context.destination);this.applyVolumes();
      }
      await this.context.resume();
      if(!this.loading){this.status='Getting the band ready…';this.prepare();this.loading=this.load();}
      await this.loading;
      this.retryAfter=0;this.reportContextState();
    }catch{if(!this.buffers.size){this.loading=null;this.raw=null;}this.retryAfter=Date.now()+3000;this.retryAvailable=true;this.status='Sound unavailable · retry in Settings';}
  }
  private reportContextState(){
    if(!this.context||!this.buffers.size)return;
    const running=this.context.state==='running';this.retryAvailable=!running;
    this.status=running?'Sound ready':'Sound paused by browser · tap to resume';
  }
  private async load(){
    const ctx=this.context!,raw=await this.raw!;
    const decoded=await Promise.all(raw.map(data=>ctx.decodeAudioData(data)));decoded.forEach((buffer,i)=>this.buffers.set(names[i],buffer));
    this.epoch=ctx.currentTime+.05;
    for(const name of ['harmony','rhythm','spark']){const source=ctx.createBufferSource(),gain=ctx.createGain();source.buffer=this.buffers.get(name)!;source.loop=true;source.loopStart=0;source.loopEnd=64;gain.gain.value=0;source.connect(gain);gain.connect(this.music);source.start(this.epoch);this.layers.set(name,gain);}
    this.status='Sound ready';this.setMode(this.desired,true);
  }
  setVolume(key:keyof VolumeSettings,value:number|boolean){
    if(key==='muted')this.settings.muted=!!value;else this.settings[key]=volume(value,this.settings[key]);
    try{localStorage.setItem('knockbound.audio',JSON.stringify(this.settings));}catch{}
    this.applyVolumes();
  }
  setHidden(hidden:boolean){this.hidden=hidden;this.applyVolumes();}
  private applyVolumes(){if(!this.context)return;const at=this.context.currentTime;this.master.gain.setTargetAtTime(this.settings.muted||this.hidden?0:this.settings.master,at,.02);this.music.gain.setTargetAtTime(this.settings.music*.65,at,.04);this.sfx.gain.setTargetAtTime(this.settings.sfx,at,.02);}
  private setMode(mode:string,immediate=false){
    this.desired=mode;if(!this.context||!this.layers.size||this.mode===mode&&!immediate)return;this.mode=mode;
    const now=this.context.currentTime,at=immediate||mode==='paused'?now:this.epoch+Math.ceil(Math.max(0,now-this.epoch)/2)*2;
    const levels=mode==='lobby'?[.85,.08,0]:mode==='paused'?[.22,0,0]:mode==='results'?[.35,.1,0]:mode==='sudden'?[.8,.9,1]:mode==='final'?[.85,.8,.65]:[1,.75,0];
    ['harmony','rhythm','spark'].forEach((name,i)=>{const param=this.layers.get(name)!.gain;param.cancelScheduledValues(now);param.setTargetAtTime(levels[i],at,.28);});
  }
  cue(name:string,priority=1,gain=1,pan=0){
    const ctx=this.context;if(!ctx||ctx.state!=='running'||!this.buffers.size||this.settings.muted||this.hidden)return;
    const variant=['dash','hit','ringout'].includes(name)?this.variant++%3:0,buffer=this.buffers.get(`${name}-${variant}`);if(!buffer)return;
    let startAt=ctx.currentTime;
    if(this.voices.length>=20){const eligible=this.voices.filter(v=>v.priority<priority||priority>=2&&v.priority===priority);const victim=eligible.reduce<Voice|null>((lowest,voice)=>!lowest||voice.priority<lowest.priority?voice:lowest,null);if(!victim)return;startAt=ctx.currentTime+.03;victim.gain.gain.setTargetAtTime(0,ctx.currentTime,.008);victim.source.stop(startAt);this.voices.splice(this.voices.indexOf(victim),1);}
    const source=ctx.createBufferSource(),node=ctx.createGain(),panner=ctx.createStereoPanner();source.buffer=buffer;source.playbackRate.value=variant?1+(variant-1)*.02:1;node.gain.value=Math.max(0,Math.min(1,gain));panner.pan.value=Math.max(-.65,Math.min(.65,pan));source.connect(node);node.connect(panner);panner.connect(this.sfx);
    const voice={source,gain:node,priority};this.voices.push(voice);source.onended=()=>{source.disconnect();node.disconnect();panner.disconnect();const index=this.voices.indexOf(voice);if(index>=0)this.voices.splice(index,1);};source.start(startAt);
    if(priority>=2){const param=this.duck.gain,now=ctx.currentTime;param.cancelScheduledValues(now);param.setTargetAtTime(priority>=3?.25:.55,now,.012);param.setTargetAtTime(1,now+(priority>=3?.8:.18),.2);}
  }
  update(world:World,playing:boolean,paused:boolean,participantId:string){
    if(!playing){this.setMode('lobby');return;}
    if(world.config.matchId!==this.matchId){this.matchId=world.config.matchId;this.serial=0;this.countdown=-1;}
    const alive=world.players.filter(p=>p.alive).length;
    this.setMode(paused?'paused':world.result?'results':world.radius<world.config.rules.radius?'sudden':alive<=2?'final':'active');
    if(world.phase==='countdown'){const count=Math.ceil((world.config.rules.countdownTicks-world.tick)*.05);if(count!==this.countdown&&count>0&&!paused){this.countdown=count;this.cue('countdown',2,.65);}}
    for(const event of world.events){
      const serial=Number(event.id.split(':').at(-1));if(serial<=this.serial)continue;this.serial=serial;
      const pan=event.x/world.config.rules.radius*.6;
      if(event.type==='dash')this.cue('dash',1,event.source===participantId?.8:.45,pan);
      if(event.type==='hit')this.cue('hit',2,Math.min(.95,.55+(event.strength??1)*.06),pan);
      if(event.type==='ringout')this.cue('ringout',2,event.target===participantId?.9:.6,pan);
      if(event.type==='warning')this.cue('warning',3,.9);
      if(event.type==='podarm')this.cue('ui',2,.8,pan);if(event.type==='hazardwarning')this.cue('go',3,.7);if(event.type==='skyimpact')this.cue('ringout',3,.7,pan);if(event.type==='crateopen')this.cue('ui',2,.85,pan);if(event.type==='tilewarning')this.cue('go',3,.7);if(event.type==='shot')this.cue('dash',1,event.strength===1?.45:.85,pan);if(event.type==='rescue')this.cue('go',3,.7);if(event.type==='pickup')this.cue('ui',1,.7);if(event.type==='throw')this.cue('dash',1,.7,pan);if(event.type==='blast')this.cue('ringout',3,.9,pan);
      if(event.type==='go')this.cue('go',3,.8);
      if(event.type==='result')this.cue(world.result?.winnerId===participantId?'victory':'defeat',3,.8);
    }
  }
  metrics(){return {state:this.context?.state??'locked',buffers:this.buffers.size,voices:this.voices.length,mode:this.mode,status:this.status};}
}


