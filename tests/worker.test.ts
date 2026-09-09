import {test} from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {WebSocket} from 'ws';
import {PROTOCOL_VERSION,CONTENT_RELEASE} from '../shared/content/arena.ts';
import type {Admission,ServerMessage} from '../shared/protocol/messages.ts';
import type {World} from '../shared/game-types/index.ts';

const origin=process.env.KNOCKBOUND_WORKER_ORIGIN??'http://127.0.0.1:4180';
const post=(path:string,body:unknown,requestOrigin=origin)=>fetch(origin+path,{method:'POST',headers:{Origin:requestOrigin,'Content-Type':'application/json'},body:JSON.stringify(body)});
async function connect(admission:Admission){
  const ws=new WebSocket(origin.replace('http:','ws:')+`/api/socket?room=${admission.roomId}&ticket=${admission.ticket}`,{origin});
  let latest:World|null=null;ws.on('message',data=>{const message=JSON.parse(data.toString()) as ServerMessage;if(message.type==='snapshot')latest=message.world;});
  await once(ws,'open');return {ws,world:()=>latest};
}
async function until(predicate:()=>boolean){const deadline=Date.now()+15000;while(!predicate()){assert.ok(Date.now()<deadline,'Worker response timed out');await new Promise(r=>setTimeout(r,20));}}

test('Cloudflare local runtime serves room UI, validates admission and completes a real four-player match',async()=>{
  assert.match(await (await fetch(origin)).text(),/data-multiplayer="true"/);
  assert.equal((await post('/api/rooms',{humanCount:4},'https://foreign.example')).status,403);
  assert.equal((await post('/api/rooms',{humanCount:99})).status,400);
  assert.equal((await post('/api/rooms',{humanCount:4,forgedReward:999})).status,400);
  const response=await post('/api/rooms',{humanCount:4});assert.equal(response.status,201);
  const first=await response.json() as Admission,admissions=[first];
  for(let i=1;i<4;i++){const joined=await post(`/api/rooms/${first.roomId}/join`,{});assert.equal(joined.status,200);admissions.push(await joined.json() as Admission);}
  assert.equal((await post(`/api/rooms/${first.roomId}/join`,{})).status,409);
  const clients=await Promise.all(admissions.map(connect));
  let interval:ReturnType<typeof setInterval>|undefined;
  try{
    for(const c of clients)c.ws.send(JSON.stringify({type:'ready',protocolVersion:PROTOCOL_VERSION,contentReleaseId:CONTENT_RELEASE}));
    await until(()=>clients.every(c=>c.world()?.phase==='countdown'));
    const sequences=[0,0,0,0];
    interval=setInterval(()=>clients.forEach((c,i)=>{
      const world=c.world(),p=world?.players[i];if(world?.phase!=='active'||!p?.alive)return;
      const length=Math.max(1,Math.hypot(p.x,p.z));
      c.ws.send(JSON.stringify({type:'input',protocolVersion:PROTOCOL_VERSION,command:{participantId:p.id,sequence:sequences[i]++,x:p.x/length,z:p.z/length,dash:false}}));
    }),50);
    await until(()=>clients.every(c=>!!c.world()?.result));
    for(const c of clients)assert.deepEqual(c.world(),clients[0].world());
    assert.ok(clients[0].world()!.players.some(p=>p.lastSequence>=0));
    console.log(`Cloudflare local match ${first.roomId}: ${clients[0].world()!.result!.outcome}, identical terminal tick ${clients[0].world()!.tick}`);
  }finally{if(interval)clearInterval(interval);await Promise.all(clients.map(async c=>{const closed=once(c.ws,'close');c.ws.close();await closed;}));}
});

test('Cloudflare real socket replacement and frame validation use the existing seat authority',async()=>{
  const admission=await (await post('/api/rooms',{humanCount:1})).json() as Admission;
  const first=await connect(admission);await until(()=>!!first.world());
  const closed=once(first.ws,'close'),replacement=await connect(admission);assert.equal((await closed)[0],1000);
  await until(()=>!!replacement.world());assert.deepEqual(replacement.world(),first.world());
  const binaryClose=once(replacement.ws,'close');replacement.ws.send(Buffer.from([1,2]));assert.equal((await binaryClose)[0],1003);
  const large=await connect(admission),largeClose=once(large.ws,'close');large.ws.send('x'.repeat(1025));assert.equal((await largeClose)[0],1009);
});
