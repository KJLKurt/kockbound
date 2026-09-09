import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {renderMusic,renderEffect,wav,RATE,BPM,BARS,SECONDS} from '../assets/source/audio/sky-ring/score.mjs';
const directory=path.resolve('assets/runtime/audio.sky-ring/r001');await fs.mkdir(directory,{recursive:true});
const assets={...renderMusic()};
for(const name of ['dash','hit','ringout','warning','countdown','go','victory','defeat','ui'])for(let variant=0;variant<(['dash','hit','ringout'].includes(name)?3:1);variant++)assets[`${name}-${variant}`]=renderEffect(name,variant);
const records=[];
for(const [name,samples]of Object.entries(assets)){
  let peak=0,sum=0;for(const value of samples){if(!Number.isFinite(value))throw new Error(`Invalid sample ${name}`);peak=Math.max(peak,Math.abs(value));sum+=value*value;}
  if(peak>=.95)throw new Error(`Insufficient headroom: ${name} ${peak}`);
  const bytes=wav(samples);await fs.writeFile(path.join(directory,`${name}.wav`),bytes);
  records.push({name,seconds:samples.length/RATE,bytes:bytes.length,peak,rms:Math.sqrt(sum/samples.length),seamDelta:Math.abs(samples[0]-samples.at(-1)),sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
}
await fs.writeFile(path.join(directory,'asset.json'),JSON.stringify({id:'audio.sky-ring',revision:'r001',bpm:BPM,bars:BARS,loopSeconds:SECONDS,sampleRate:RATE,channels:1,source:'assets/source/audio/sky-ring/score.mjs',rights:'Original repository-authored composition and synthesis; no external samples',status:'mix-review-pending',records},null,2));
console.log(JSON.stringify({files:records.length,totalBytes:records.reduce((sum,r)=>sum+r.bytes,0),maximumPeak:Math.max(...records.map(r=>r.peak)),musicSeams:records.slice(0,3).map(r=>({name:r.name,delta:r.seamDelta}))}));
