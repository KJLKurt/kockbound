import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {readVolumes,Sound} from '../client/audio/sound.ts';

test('sound recovers from a failed download and resumes interruptions without duplicate music layers',async()=>{
  const oldFetch=globalThis.fetch,oldContext=globalThis.AudioContext;
  let downloads=0,starts=0,fail=true;
  const parameter=()=>({value:0,setTargetAtTime(){},cancelScheduledValues(){}});
  const node=()=>({connect(){},disconnect(){},gain:parameter()});
  class Context {
    static current:Context;state='suspended';currentTime=0;destination={};onstatechange:(()=>void)|null=null;allowResume=true;
    constructor(){Context.current=this;}
    async resume(){if(this.allowResume)this.state='running';this.onstatechange?.();}
    createGain(){return node();}
    createDynamicsCompressor(){return {...node(),threshold:parameter(),knee:parameter(),ratio:parameter(),attack:parameter(),release:parameter()};}
    async decodeAudioData(){return {};}
    createBufferSource(){return {...node(),start(){starts++;}};}
  }
  globalThis.AudioContext=Context as unknown as typeof AudioContext;
  globalThis.fetch=(async()=>{downloads++;return new Response(new Uint8Array(8),{status:fail?503:200});}) as typeof fetch;
  try{
    const sound=new Sound();await sound.unlock();assert.equal(sound.retryAvailable,true);assert.equal(sound.metrics().buffers,0);assert.equal(starts,0);
    await sound.unlock();assert.equal(downloads,18,'ordinary taps are backed off after failure');
    fail=false;await Promise.all([sound.unlock(true),sound.unlock(true)]);
    assert.equal(sound.status,'Sound ready');assert.equal(sound.metrics().buffers,18);assert.equal(downloads,36);assert.equal(starts,3);
    Context.current.state='suspended';Context.current.onstatechange?.();
    assert.equal(sound.retryAvailable,true);assert.match(sound.status,/paused by browser/);
    Context.current.allowResume=false;await sound.unlock(true);assert.match(sound.status,/paused by browser/);assert.equal(sound.retryAvailable,true);
    Context.current.allowResume=true;await sound.unlock();assert.equal(Context.current.state,'running');assert.equal(starts,3);assert.equal(downloads,36);assert.equal(sound.retryAvailable,false);assert.equal(sound.status,'Sound ready');
  }finally{globalThis.fetch=oldFetch;globalThis.AudioContext=oldContext;}
});

test('Audio preferences survive malformed storage without NaN or out-of-range gains',()=>{
  assert.deepEqual(readVolumes('{'),readVolumes(null));assert.deepEqual(readVolumes('null'),readVolumes(null));
  assert.deepEqual(readVolumes('{"master":2,"music":-1,"sfx":"loud","muted":true}'),{master:1,music:0,sfx:.8,muted:true});
  assert.deepEqual(readVolumes('{"master":0.4,"music":0.2,"sfx":0.7,"muted":false}'),{master:.4,music:.2,sfx:.7,muted:false});
});

test('a cue storm preserves critical warnings and replacement voices wait for the outgoing fade',async()=>{
  const oldFetch=globalThis.fetch,oldContext=globalThis.AudioContext;
  const parameter=()=>({value:0,setTargetAtTime(){},cancelScheduledValues(){}});
  const node=()=>({connect(){},disconnect(){},gain:parameter()});
  const sources:{loop?:boolean;startAt:number;stopAt:number;onended?:()=>void}[]=[];
  class Context {
    state='running';currentTime=0;destination={};async resume(){}
    createGain(){return node();}createStereoPanner(){return {...node(),pan:parameter()};}
    createDynamicsCompressor(){return {...node(),threshold:parameter(),knee:parameter(),ratio:parameter(),attack:parameter(),release:parameter()};}
    async decodeAudioData(){return {};}
    createBufferSource(){const source={...node(),loop:false,playbackRate:parameter(),startAt:Infinity,stopAt:Infinity,onended:undefined as (()=>void)|undefined,start(at=0){this.startAt=at;},stop(at=0){this.stopAt=at;}};sources.push(source);return source;}
  }
  globalThis.AudioContext=Context as unknown as typeof AudioContext;
  globalThis.fetch=(async()=>new Response(new Uint8Array(8))) as typeof fetch;
  try{
    const sound=new Sound();await sound.unlock();
    for(let i=0;i<20;i++)sound.cue('warning',3);
    const before=sources.length;
    for(let i=0;i<100;i++){sound.cue('dash',1);sound.cue('hit',2);}
    assert.equal(sources.length,before,'lower priority events cannot displace warning voices');
    sound.cue('victory',3);
    assert.equal(sources.at(-1)!.startAt,.03);assert.equal(sources.filter(s=>!s.loop&&s.stopAt===.03).length,1);
    for(let i=0;i<50;i++)sound.cue('warning',3);
    const effects=sources.filter(s=>!s.loop);
    for(const time of [0,.029,.03,.031])assert.ok(effects.filter(s=>s.startAt<=time&&s.stopAt>time).length<=20,'at most twenty effects play concurrently');
    assert.equal(sound.metrics().voices,20);
    for(const source of effects)source.onended?.();assert.equal(sound.metrics().voices,0);
  }finally{globalThis.fetch=oldFetch;globalThis.AudioContext=oldContext;}
});
test('Exported music stems align exactly; effects have faded boundaries and all PCM retains headroom',async()=>{
  const root='assets/runtime/audio.sky-ring/r001';
  const manifest=JSON.parse(await fs.readFile(`${root}/asset.json`,'utf8'));assert.equal(manifest.records.length,18);
  let bytes=0;
  for(const record of manifest.records){
    const data=await fs.readFile(`${root}/${record.name}.wav`);bytes+=data.length;
    assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.readUInt32LE(24),22050);assert.equal(data.readUInt16LE(22),1);
    const length=data.readUInt32LE(40)/2;let peak=0;
    for(let i=0;i<length;i++)peak=Math.max(peak,Math.abs(data.readInt16LE(44+i*2))/32768);
    assert.ok(peak>0&&peak<.95,`${record.name} headroom`);
    if(['harmony','rhythm','spark'].includes(record.name)){assert.equal(length,22050*64);assert.ok(Math.abs(data.readInt16LE(44)-data.readInt16LE(data.length-2))/32768<.01,`${record.name} loop seam`);}
    else {assert.equal(data.readInt16LE(44),0);assert.equal(data.readInt16LE(data.length-2),0);}
  }
  assert.ok(bytes<9*1024*1024);
});
