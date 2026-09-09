// Original Knockbound score and sound synthesis. No samples or external recordings.
export const RATE=22050,BPM=120,BARS=32,SECONDS=BARS*4*60/BPM;
const TAU=Math.PI*2,frequency=midi=>440*2**((midi-69)/12);
const clamp=value=>Math.max(-1,Math.min(1,value));
function noise(seed){let state=seed;return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/2147483648-1;};}
function add(buffer,at,duration,synth,gain=1,wrap=false){
  const start=Math.round(at*RATE),length=Math.round(duration*RATE);
  for(let i=0;i<length;i++){const index=start+i;if(!wrap&&index>=buffer.length)break;const edge=Math.min(1,i/90,(length-i-1)/180);buffer[index%buffer.length]+=synth(i/RATE,i)*gain*Math.max(0,edge);}
}
function note(buffer,at,midi,duration,gain,kind='pluck',wrap=true){
  const f=frequency(midi);
  add(buffer,at,duration,t=>{
    const phase=TAU*f*t;
    if(kind==='pad')return (Math.sin(phase)+.22*Math.sin(phase*2+.2*Math.sin(TAU*.7*t)))*Math.sin(Math.PI*t/duration)**2;
    if(kind==='bass')return (Math.sin(phase)+.22*Math.sin(phase*2))*Math.exp(-t*3);
    return (Math.sin(phase)+.28*Math.sin(phase*2)*Math.exp(-t*8)+.1*Math.sin(phase*3)*Math.exp(-t*14))*Math.exp(-t*5);
  },gain,wrap);
}
export function renderMusic(){
  const harmony=new Float32Array(RATE*SECONDS),rhythm=new Float32Array(harmony.length),spark=new Float32Array(harmony.length);
  const chords=[[48,55,59,64],[45,52,55,60],[41,48,52,57],[43,50,55,59],[40,47,55,59],[45,52,55,60],[50,53,57,60],[43,50,55,62]];
  const phrases=[[72,76,79,76,74,72],[72,71,69,72,76,74],[69,72,76,79,76,72],[74,71,67,71,74,79],[71,74,79,78,76,74],[72,76,81,79,76,72],[74,77,81,77,76,74],[71,74,79,74,72,71]];
  const offsets=[0,.75,1.5,2,2.75,3.5];const random=noise(24731);
  for(let bar=0;bar<BARS;bar++){
    const at=bar*2,chord=chords[bar%8],phrase=phrases[(bar+(bar>=16?4:0))%8];
    for(const midi of chord)note(harmony,at,midi+12,2.5,.023,'pad');
    // Melody leaves room in every fourth bar; the second half changes register/phrasing.
    offsets.forEach((beat,i)=>{if(bar%4===3&&i>3)return;note(harmony,at+beat*.5,phrase[i]+(bar>=24?12:0),.9,.105*(i%2?.8:1));});
    for(let beat=0;beat<4;beat++){
      note(rhythm,at+beat*.5,chord[beat%2?1:0]-12,.45,.12,'bass');
      if(beat%2===0)add(rhythm,at+beat*.5,.16,t=>Math.sin(TAU*(48*t+65*.018*(1-Math.exp(-t/.018))))*Math.exp(-t*24),.2,true);
      else add(rhythm,at+beat*.5,.1,t=>(random()*.65+Math.sin(TAU*180*t)*.35)*Math.exp(-t*38),.06,true);
      for(let half=0;half<2;half++)add(rhythm,at+beat*.5+half*.25,.045,t=>random()*Math.exp(-t*80),half?.018:.012,true);
      // A restrained upper ostinato and tom lift for final survivors / shrinking edge.
      note(spark,at+beat*.5+.25,chord[(beat+bar)%4]+24,.28,.047);
      if(beat===3)add(spark,at+1.75,.18,t=>Math.sin(TAU*95*t)*Math.exp(-t*19),.1,true);
    }
  }
  // Circular tap delays retain tails across the loop seam, avoiding a cut reverb tail.
  const dry=harmony.slice();for(let i=0;i<dry.length;i++){harmony[(i+Math.round(.375*RATE))%dry.length]+=dry[i]*.18;harmony[(i+Math.round(.75*RATE))%dry.length]+=dry[i]*.075;}
  return {harmony,rhythm,spark};
}
export function renderEffect(name,variant=0){
  const duration={dash:.32,hit:.28,ringout:.7,warning:.9,countdown:.2,go:.55,victory:1.9,defeat:1.3,ui:.15}[name];
  if(!duration)throw new Error(`Unknown sound ${name}`);
  const buffer=new Float32Array(Math.ceil(duration*RATE)),random=noise(1747+variant*7919),pitch=1+(variant-1)*.035;
  if(name==='dash')add(buffer,0,.3,t=>(random()*.6+Math.sin(TAU*(320*t-210*t*t))*.15)*Math.sin(Math.PI*t/.3)**1.5,.35);
  if(name==='hit'){
    add(buffer,0,.24,t=>Math.sin(TAU*(90*pitch*t+160*.014*(1-Math.exp(-t/.014))))*Math.exp(-t*19),.57);
    add(buffer,0,.08,t=>random()*Math.exp(-t*55),.18);
    add(buffer,.025,.16,t=>Math.sin(TAU*(550*pitch*t-500*t*t))*Math.exp(-t*22),.09);
  }
  if(name==='ringout')add(buffer,0,.65,t=>(Math.sin(TAU*(520*pitch*t-300*t*t))*.6+random()*.1)*Math.sin(Math.PI*t/.65)*Math.exp(-t*2),.4);
  if(name==='warning'){note(buffer,0,86,.28,.27,'pluck',false);note(buffer,.32,86,.28,.27,'pluck',false);note(buffer,.64,91,.26,.27,'pluck',false);}
  if(name==='countdown')note(buffer,0,76,.2,.25,'pluck',false);
  if(name==='go')[72,76,79,84].forEach((m,i)=>note(buffer,i*.07,m,.32,.2,'pluck',false));
  if(name==='victory')[72,76,79,84,83,84].forEach((m,i)=>note(buffer,[0,.16,.32,.56,.92,1.08][i],m,.75,.2,'pluck',false));
  if(name==='defeat')[76,74,72,67].forEach((m,i)=>note(buffer,i*.21,m,.6,.18,'pluck',false));
  if(name==='ui')note(buffer,0,84,.15,.16,'pluck',false);
  return buffer;
}
export function wav(samples){
  const bytes=new Uint8Array(44+samples.length*2),view=new DataView(bytes.buffer),text=(at,value)=>[...value].forEach((c,i)=>view.setUint8(at+i,c.charCodeAt(0)));
  text(0,'RIFF');view.setUint32(4,bytes.length-8,true);text(8,'WAVE');text(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,RATE,true);view.setUint32(28,RATE*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);text(36,'data');view.setUint32(40,samples.length*2,true);
  samples.forEach((value,i)=>view.setInt16(44+i*2,Math.round(clamp(value)*32767),true));return bytes;
}
