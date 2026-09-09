import {test} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {once} from 'node:events';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {WebSocket} from 'ws';
import {LocalRoomTransport} from '../server/game-room/local-transport.ts';
import type {Admission} from '../server/game-room/local-transport.ts';
import {PROTOCOL_VERSION,CONTENT_RELEASE} from '../shared/content/arena.ts';
import type {ServerMessage} from '../shared/protocol/messages.ts';
import {OnlineSession} from '../client/networking/online-session.ts';
import type {Socket} from '../client/networking/online-session.ts';

const ready=JSON.stringify({type:'ready',protocolVersion:PROTOCOL_VERSION,contentReleaseId:CONTENT_RELEASE});
async function harness(directory?:string){
  const journal=directory??await fs.mkdtemp(path.join(os.tmpdir(),'knockbound-transport-'));
  let now=0;
  const server=http.createServer((req,res)=>{void transport.handleHttp(req,res).then(handled=>{if(!handled)res.writeHead(404).end();});});
  const transport=new LocalRoomTransport(server,{journalDirectory:journal,clock:()=>now,automaticTicks:false});
  server.listen(0,'127.0.0.1');await once(server,'listening');
  const port=(server.address() as {port:number}).port,origin=`http://127.0.0.1:${port}`;
  return {origin,journal,transport,
    post:async(endpoint:string,body:unknown)=>fetch(origin+endpoint,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)}),
    advance:(ms=50)=>{now+=ms;transport.tick();},
    close:async()=>{await transport.close();server.closeAllConnections();await new Promise<void>(resolve=>server.close(()=>resolve()));},
  };
}
async function client(origin:string,admission:Admission){
  const messages:ServerMessage[]=[];
  const ws=new WebSocket(origin.replace('http:','ws:')+`/api/socket?room=${admission.roomId}&ticket=${admission.ticket}`,{origin});
  ws.on('message',data=>messages.push(JSON.parse(data.toString())));ws.on('error',()=>{});
  await once(ws,'open');
  const until=async(predicate:(message:ServerMessage)=>boolean)=>{
    for(let i=0;i<200;i++){const found=messages.findLast(predicate);if(found)return found;await new Promise(r=>setTimeout(r,5));}
    throw new Error('Timed out waiting for WebSocket state');
  };
  await until(m=>m.type==='snapshot');
  return {ws,messages,until,latest:()=>messages.filter(m=>m.type==='snapshot').at(-1)!};
}
test('N01 real loopback WebSockets: four clients complete ten matches with identical results',async()=>{
  const h=await harness();let snapshotBytes=0;
  try{
    for(let round=0;round<10;round++){
      const created=await h.post('/api/rooms',{humanCount:4});assert.equal(created.status,201);const first=await created.json() as Admission;
      const admissions=[first];for(let i=1;i<4;i++)admissions.push(await (await h.post(`/api/rooms/${first.roomId}/join`,{})).json() as Admission);
      const clients=await Promise.all(admissions.map(a=>client(h.origin,a)));
      clients.forEach(c=>c.ws.send(ready));await Promise.all(clients.map(c=>c.until(m=>m.type==='snapshot'&&m.roomPhase==='countdown')));
      let tick=0;
      while(!clients[0].latest().world.result && tick<1900){
        if(clients[0].latest().roomPhase==='active')clients.forEach((c,i)=>{
          const p=c.latest().world.players.find(p=>p.id===admissions[i].participantId)!;
          if(!p.alive)return;const d=Math.hypot(p.x,p.z);
          c.ws.send(JSON.stringify({type:'input',protocolVersion:PROTOCOL_VERSION,command:{participantId:p.id,sequence:tick,x:p.x/d,z:p.z/d,dash:false}}));
        });
        // Allow real TCP input callbacks to run, then advance only the injected server clock.
        await new Promise(r=>setTimeout(r,1));h.advance();tick++;
        await Promise.all(clients.map(c=>c.until(m=>m.type==='snapshot'&&m.world.tick>=tick)));
        const reference=clients[0].latest().world;
        for(const c of clients){assert.deepEqual(c.latest().world,reference);snapshotBytes+=Buffer.byteLength(JSON.stringify(c.latest()));c.messages.splice(0,Math.max(0,c.messages.length-2));}
      }
      assert.ok(clients[0].latest().world.result);assert.ok(clients.every(c=>c.latest().rewardsEnabled===false));
      clients.forEach(c=>c.ws.close());await Promise.all(clients.map(c=>once(c.ws,'close')));
      h.advance(60001); // Retire terminal room, avoiding artificial test-only capacity growth.
    }
    console.log('Ten 4-client WebSocket rounds passed; snapshot bytes observed:',snapshotBytes);
  }finally{await h.close();}
});
test('Transport rejects foreign origins, bad tickets, malformed settings and binary/oversize frames',async()=>{
  const h=await harness();
  try{
    assert.equal((await fetch(h.origin+'/api/rooms',{method:'POST',body:'{}',headers:{Origin:'https://untrusted.example'}})).status,403);
    assert.equal((await h.post('/api/rooms',{humanCount:13})).status,400);
    assert.equal((await h.post('/api/rooms',{humanCount:1,seed:1})).status,400);
    const admission=await (await h.post('/api/rooms',{humanCount:1})).json() as Admission;
    const bad=new WebSocket(h.origin.replace('http:','ws:')+`/api/socket?room=${admission.roomId}&ticket=wrong`,{origin:h.origin});bad.on('error',()=>{});
    const [,response]=await once(bad,'unexpected-response'); // Request is rejected before upgrade.
    assert.equal(response.statusCode,403);bad.terminate();
    const c=await client(h.origin,admission);c.ws.send(Buffer.from([1,2]));const [code]=await once(c.ws,'close');assert.equal(code,1003);
    const large=await client(h.origin,admission);large.ws.send('x'.repeat(1025));const [largeCode]=await once(large.ws,'close');assert.equal(largeCode,1009);
  }finally{await h.close();}
});
test('N06 real transport restart: unfinished room is cancelled persistently, never silently restarted',async()=>{
  const first=await harness();const admission=await (await first.post('/api/rooms',{humanCount:1})).json() as Admission;
  const c=await client(first.origin,admission);c.ws.send(ready);await c.until(m=>m.type==='snapshot'&&m.roomPhase==='countdown');first.advance();
  await first.close();
  const restarted=await harness(first.journal);
  try{
    assert.equal((await restarted.post(`/api/rooms/${admission.roomId}/join`,{})).status,410);
    const entry=JSON.parse(await fs.readFile(path.join(first.journal,`${admission.roomId}.json`),'utf8'));
    assert.equal(entry.state,'cancelled');assert.equal(entry.receipt,undefined);
    assert.equal(JSON.stringify(entry).includes(admission.ticket),false);
  }finally{await restarted.close();}
});
test('N04 actual socket replacement restores the same participant and closes the old owner',async()=>{
  const h=await harness();
  try{
    const admission=await (await h.post('/api/rooms',{humanCount:1})).json() as Admission;
    const first=await client(h.origin,admission);first.ws.send(ready);await first.until(m=>m.type==='snapshot'&&m.roomPhase==='countdown');h.advance();
    await first.until(m=>m.type==='snapshot'&&m.world.tick===1);
    const oldClose=once(first.ws,'close');const replacement=await client(h.origin,admission);
    assert.equal((await oldClose)[0],1000);
    assert.equal(replacement.latest().world.config.matchId,first.latest().world.config.matchId);
    assert.equal(replacement.latest().world.tick,1);
    assert.deepEqual(replacement.latest().world.players,first.latest().world.players);
    const closed=once(replacement.ws,'close');replacement.ws.terminate();await closed;
    h.advance(1000);const reconnected=await client(h.origin,admission);
    assert.equal(reconnected.latest().world.config.matchId,first.latest().world.config.matchId);
    reconnected.ws.close();await once(reconnected.ws,'close');
  }finally{await h.close();}
});
test('The browser OnlineSession adapter completes a round through real WebSockets',async()=>{
  const h=await harness();let session:OnlineSession|undefined;
  try{
    const admission=await (await h.post('/api/rooms',{humanCount:1,items:['bomb','shovel','big','helicopter','blaster','wind','rock','remover','crate','pod'],hazards:['tiles','skyrock','gust']})).json() as Admission;
    session=await OnlineSession.connect(admission,{origin:h.origin,socketFactory:url=>new WebSocket(url,{origin:h.origin}) as unknown as Socket});
    for(let attempts=0;attempts<200&&session.roomPhase==='waiting';attempts++)await new Promise(r=>setTimeout(r,5));
    assert.equal(session.roomPhase,'countdown');
    let tick=0,sawBomb=false;
    while(!session.authoritative.result&&tick<1900){
      session.advance(.05,()=>({participantId:'wrong-seat',sequence:999,x:0,z:-1,dash:false,useItem:true}),()=>{});
      await new Promise(r=>setTimeout(r,1));h.advance();tick++;
      for(let attempts=0;attempts<200&&session.authoritative.tick<tick&&!session.failure;attempts++)await new Promise(r=>setTimeout(r,5));
      sawBomb ||= (session.authoritative.items?.serial??0)>0;assert.equal(session.failure,null);assert.equal(session.authoritative.tick,tick);
    }
    assert.deepEqual(session.authoritative.config.hazards,['tiles','skyrock','gust']);assert.equal(sawBomb,true);assert.deepEqual(session.authoritative.config.items,['bomb','shovel','big','helicopter','blaster','wind','rock','remover','crate','pod']);assert.ok(session.authoritative.result);assert.equal(session.participantId,'p1');
    assert.ok(session.authoritative.players.find(p=>p.id==='p1')!.lastSequence>=0);
  }finally{session?.close();await h.close();}
});


