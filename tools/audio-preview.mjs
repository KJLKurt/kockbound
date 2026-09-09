import fs from 'node:fs/promises';
import {renderMusic,renderEffect,wav,RATE} from '../assets/source/audio/sky-ring/score.mjs';
const stems=renderMusic(),mix=new Float32Array(RATE*24);
for(let i=0;i<mix.length;i++){const t=i/RATE;mix[i]=.8*.55*.65*(stems.harmony[i]+stems.rhythm[i]*(t<8?.08:.75)+stems.spark[i]*(t<16?0:.65));}
for(const [at,name,variant]of [[7,'countdown',0],[8,'go',0],[10,'dash',0],[10.2,'hit',0],[12,'dash',1],[12.25,'hit',1],[14,'ringout',2],[16,'warning',0],[19,'dash',2],[19.2,'hit',2],[21,'victory',0]]){
  const effect=renderEffect(name,variant),offset=Math.round(at*RATE);for(let i=0;i<effect.length&&i+offset<mix.length;i++)mix[i+offset]+=effect[i]*.64*.8;
}
for(let i=0;i<mix.length;i++)mix[i]*=Math.min(1,i/(RATE*.03),(mix.length-i-1)/(RATE*.3));
await fs.mkdir('tests/evidence/M3-audio',{recursive:true});await fs.writeFile('tests/evidence/M3-audio/mix-preview.wav',wav(mix));
console.log('Wrote 24-second offline arrangement preview; not a browser recording.');
