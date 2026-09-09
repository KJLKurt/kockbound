import {test} from 'node:test';
import assert from 'node:assert/strict';
import {OnlineSession,type Socket} from '../client/networking/online-session.ts';
import {RoomAuthority} from '../server/game-room/authority.ts';
import {localConfig,CONTENT_RELEASE,PROTOCOL_VERSION} from '../shared/content/arena.ts';

/** Ordered delivery models WebSocket/TCP: jitter can bunch messages, never reorder them. */
class Link {
  queue:{at:number;deliver:()=>void}[]=[];last=0;
  private clock:()=>number;private delay:()=>number;
  constructor(clock:()=>number,delay:()=>number){this.clock=clock;this.delay=delay;}
  send(deliver:()=>void){this.last=Math.max(this.last,this.clock()+this.delay());this.queue.push({at:this.last,deliver});}
  flush(){while(this.queue[0]?.at<=this.clock())this.queue.shift()!.deliver();}
}

for(const profile of [{rtt:100,jitter:20},{rtt:200,jitter:50}])test(`N03 four OnlineSessions: ${profile.rtt} ms RTT with ±${profile.jitter} ms one-way jitter`,async()=>{
  let now=0,rng=7391;
  const random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296;};
  const delay=()=>profile.rtt/2+(random()*2-1)*profile.jitter;
  const config=localConfig(44,4);config.matchId='room-LAG123';config.roster.forEach(p=>p.control='human');
  const tickets=config.roster.map((_,i)=>String(i).repeat(43));
  const room=new RoomAuthority(config,new Map(tickets.map((ticket,i)=>[ticket,config.roster[i].id])));
  const links:Link[]=[];const sessions:OnlineSession[]=[];
  const receivedErrors:string[]=[];const sockets:Socket[]=[];
  const promises=config.roster.map((player,i)=>OnlineSession.connect({roomId:'LAG123',participantId:player.id,ticket:tickets[i],protocolVersion:PROTOCOL_VERSION,contentReleaseId:CONTENT_RELEASE},{origin:'http://127.0.0.1:9999',socketFactory:()=>{
    const upstream=new Link(()=>now,delay),downstream=new Link(()=>now,delay);links.push(upstream,downstream);
    const socket:Socket={readyState:1,bufferedAmount:0,onopen:null,onmessage:null,onclose:null,onerror:null,
      send(data){upstream.send(()=>room.receive(player.id,data,now));},close(){room.disconnect(player.id,now);}};
    sockets.push(socket);
    queueMicrotask(()=>{socket.onopen?.call(socket as WebSocket,{} as Event);room.connect(tickets[i],{id:player.id,bufferedAmount:0,send(data){downstream.send(()=>{const message=JSON.parse(data);if(message.type==='error')receivedErrors.push(message.code);socket.onmessage?.call(socket as WebSocket,{data} as MessageEvent);});},close(){socket.close();}},now);});
    return socket;
  }}).then(session=>{sessions.push(session);return session;}));
  try{
    await Promise.resolve();
    for(;now<2000&&sessions.length<4;now+=10){links.forEach(l=>l.flush());room.advance(now);await Promise.resolve();}
    await Promise.all(promises);assert.equal(sessions.length,4);
    const responseMs=new Map<string,number>();const requestAt=new Map<string,number>();
    let maxQueuedMessages=0;
    for(;now<100000;now+=10){
      links.forEach(l=>l.flush());room.advance(now);
      for(const session of sessions){
        const before=session.world.players.find(p=>p.id===session.participantId)!;
        const oldX=before.x,oldZ=before.z;
        if(session.roomPhase==='active'&&!requestAt.has(session.participantId))requestAt.set(session.participantId,now);
        session.advance(.01,()=>{

          const p=session.world.players.find(p=>p.id===session.participantId)!;
          const angle=now/1700+Number(p.id.slice(1))*Math.PI/2;
          const x=Math.cos(angle)*3-p.x,z=Math.sin(angle)*3-p.z,length=Math.max(1,Math.hypot(x,z));
          return {participantId:p.id,sequence:0,x:x/length,z:z/length,dash:session.authoritative.activeTick%37===0};
        },()=>{});
        const after=session.world.players.find(p=>p.id===session.participantId)!;
        if(requestAt.has(session.participantId)&&!responseMs.has(session.participantId)&&Math.hypot(after.x-oldX,after.z-oldZ)>.001)responseMs.set(session.participantId,now-requestAt.get(session.participantId)!);
        assert.equal(session.failure,null);
        assert.ok(session.world.players.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.z)));
      }
      maxQueuedMessages=Math.max(maxQueuedMessages,...links.map(l=>l.queue.length));
      if(sessions.every(s=>s.authoritative.result))break;
    }
    assert.ok(room.terminalReceipt());assert.equal(responseMs.size,4);
    for(const ms of responseMs.values())assert.ok(ms<=50,`Local input waited ${ms}ms for movement`);
    for(const session of sessions)assert.deepEqual(session.authoritative,JSON.parse(JSON.stringify(room.snapshot())));
    assert.ok(sessions.every(s=>s.maxCorrection<4),'This fixture regressed to multi-tick backlog overprediction');
    assert.ok(maxQueuedMessages<12);assert.ok(!receivedErrors.some(code=>!['dash-cooldown','not-active'].includes(code)),receivedErrors.join(','));
    console.log(JSON.stringify({profile,simulatedMs:now,maxQueuedMessages,players:sessions.map(s=>({id:s.participantId,inputToPredictedMovementMs:responseMs.get(s.participantId),targetAdjustmentsAbove15cm:s.corrections,maxTargetAdjustmentMetres:Number(s.maxCorrection.toFixed(3)),snapshotBytes:s.snapshotBytes,winner:s.authoritative.result?.winnerId}))}));
  }finally{sessions.forEach(s=>s.close());}
});



