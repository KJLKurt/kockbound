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
    static current:Context;state='suspended';currentTime=0;destination={};
    constructor(){Context.current=this;}
    async resume(){this.state='running';}
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
    Context.current.state='suspended';await sound.unlock();assert.equal(Context.current.state,'running');assert.equal(starts,3);assert.equal(downloads,36);
  }finally{globalThis.fetch=oldFetch;globalThis.AudioContext=oldContext;}
});

test('Audio preferences survive malformed storage without NaN or out-of-range gains',()=>{
  assert.deepEqual(readVolumes('{'),readVolumes(null));assert.deepEqual(readVolumes('null'),readVolumes(null));
  assert.deepEqual(readVolumes('{"master":2,"music":-1,"sfx":"loud","muted":true}'),{master:1,music:0,sfx:.8,muted:true});
  assert.deepEqual(readVolumes('{"master":0.4,"music":0.2,"sfx":0.7,"muted":false}'),{master:.4,music:.2,sfx:.7,muted:false});
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
