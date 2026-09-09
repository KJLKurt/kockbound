import {validRoomOptions} from '../../shared/content/items.ts';
import type { IncomingMessage, Server, ServerResponse } from 'node:http';
import { randomBytes, randomUUID } from 'node:crypto';
import { WebSocketServer, WebSocket } from 'ws';
import { localConfig, PROTOCOL_VERSION, CONTENT_RELEASE } from '../../shared/content/arena.ts';
import { RoomAuthority } from './authority.ts';
import { RoomJournal } from './journal.ts';

type Entry = { authority:RoomAuthority;tickets:string[];claimed:number;createdAt:number;finishedAt:number|null;journaled:boolean;peers:Set<WebSocket> };
import type { Admission } from '../../shared/protocol/messages.ts';
export type { Admission } from '../../shared/protocol/messages.ts';
type Options = {journalDirectory:string;clock?:()=>number;automaticTicks?:boolean};

/** Loopback development transport; this is not a replacement for the specified Cloudflare host. */
export class LocalRoomTransport {
  private server:Server;
  private wss=new WebSocketServer({noServer:true,maxPayload:1024,perMessageDeflate:false});
  private rooms=new Map<string,Entry>();
  private journal:RoomJournal;
  private clock:()=>number;
  private interval:ReturnType<typeof setInterval>|null=null;
  constructor(server:Server,options:Options){
    this.server=server;this.clock=options.clock??(()=>performance.now());this.journal=new RoomJournal(options.journalDirectory);
    server.on('upgrade',(request,socket,head)=>{
      const url=this.url(request);
      if(!url || request.headers.origin!==url.origin || url.pathname!=='/api/socket' || this.wss.clients.size>=96){socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');return;}
      const roomId=url.searchParams.get('room')??'',ticket=url.searchParams.get('ticket')??'';
      const entry=this.rooms.get(roomId);
      if(!entry || !entry.tickets.slice(0,entry.claimed).includes(ticket)){socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');return;}
      this.wss.handleUpgrade(request,socket,head,ws=>{
        const id=randomUUID();
        entry.peers.add(ws);
        ws.on('error',()=>{entry.authority.disconnect(id,this.clock());});
        ws.on('close',()=>{entry.peers.delete(ws);entry.authority.disconnect(id,this.clock());});
        ws.on('message',(data,binary)=>{if(binary){ws.close(1003,'Text messages required');return;}entry.authority.receive(id,data.toString(),this.clock());});
        entry.authority.connect(ticket,{id,get bufferedAmount(){return ws.bufferedAmount;},send:data=>{if(ws.readyState!==WebSocket.OPEN)throw new Error('Socket closed');ws.send(data);},close:(code,reason)=>ws.close(code,reason)},this.clock());
      });
    });
    if(options.automaticTicks!==false)this.interval=setInterval(()=>this.tick(),25);
  }
  private url(req:IncomingMessage):URL|null{
    const address=this.server.address();if(!address || typeof address==='string')return null;
    const origin=`http://127.0.0.1:${address.port}`;
    if(req.headers.host!==`127.0.0.1:${address.port}`)return null;
    try{return new URL(req.url??'/',origin);}catch{return null;}
  }
  async handleHttp(req:IncomingMessage,res:ServerResponse):Promise<boolean>{
    if(!req.url?.startsWith('/api/'))return false;
    const url=this.url(req);
    const respond=(status:number,value:unknown)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}).end(JSON.stringify(value));};
    if(!url || req.headers.origin!==url.origin || req.method!=='POST'){respond(403,{error:'Same-origin POST required'});return true;}
    let body:unknown;
    try{
      let bytes=0;const chunks:Buffer[]=[];
      for await(const chunk of req){bytes+=chunk.length;if(bytes>1024){respond(413,{error:'Request too large'});req.resume();return true;}chunks.push(chunk);}
      body=JSON.parse(Buffer.concat(chunks).toString('utf8'));
    }catch{respond(400,{error:'Invalid JSON'});return true;}
    try{
      if(url.pathname==='/api/rooms'){
        if(!validRoomOptions(body)){respond(400,{error:'Choose 1–12 human seats'});return true;}
        if(this.rooms.size>=8){respond(429,{error:'Local room capacity reached; finish an existing round'});return true;}
        let roomId:string;do{roomId=randomBytes(3).toString('hex').toUpperCase();}while(this.journal.state(roomId));
        const humans=body.humanCount as number,config=localConfig(randomBytes(4).readUInt32LE(),Math.max(4,humans));config.matchId=`room-${roomId}`;if(body.items?.length)config.items=body.items;if(body.hazards?.length)config.hazards=body.hazards;
        config.roster.forEach((p,i)=>{p.control=i<humans?'human':'bot';p.name=i<humans?`Player ${i+1}`:p.name;});
        const tickets=Array.from({length:humans},()=>randomBytes(32).toString('base64url'));
        const authority=new RoomAuthority(config,new Map(tickets.map((ticket,i)=>[ticket,config.roster[i].id])),this.clock());
        this.journal.create(roomId);
        this.rooms.set(roomId,{authority,tickets,claimed:1,createdAt:this.clock(),finishedAt:null,journaled:false,peers:new Set()});
        respond(201,this.admission(roomId,tickets[0],1));return true;
      }
      const match=/^\/api\/rooms\/([A-Z0-9]{6})\/join$/.exec(url.pathname);
      if(match){
        if(!body || typeof body!=='object' || Array.isArray(body) || Object.keys(body).length){respond(400,{error:'Join request must be empty'});return true;}
        const roomId=match[1],entry=this.rooms.get(roomId);
        if(!entry){respond(this.journal.state(roomId)?410:404,{error:this.journal.state(roomId)?'Room ended or was cancelled by a restart':'Room not found'});return true;}
        if(entry.authority.status()!=='waiting' || entry.claimed>=entry.tickets.length){respond(409,{error:'Room is full or already started'});return true;}
        const index=entry.claimed++;respond(200,this.admission(roomId,entry.tickets[index],index+1));return true;
      }
      respond(404,{error:'Unknown endpoint'});
    }catch{respond(503,{error:'Local room storage is unavailable'});}
    return true;
  }
  private admission(roomId:string,ticket:string,seat:number):Admission{return {roomId,ticket,participantId:`p${seat}`,protocolVersion:PROTOCOL_VERSION,contentReleaseId:CONTENT_RELEASE};}
  tick():void{
    const now=this.clock();
    for(const [id,entry] of this.rooms){
      entry.authority.advance(now);
      if(entry.authority.status()==='waiting' && now-entry.createdAt>120000)entry.authority.cancel('Room readiness timed out',now);
      const receipt=entry.authority.terminalReceipt();
      if(receipt && !entry.journaled){
        try{this.journal.finish(id,receipt);entry.journaled=true;}catch{/* No rewards; keep the unfinished journal so a restart cancels instead of silently replaying. */}
        entry.finishedAt??=now;
      }
      if(entry.finishedAt!==null && now-entry.finishedAt>60000){for(const peer of entry.peers)peer.close(1000,'Room ended');this.rooms.delete(id);}
    }
  }
  async close():Promise<void>{
    if(this.interval)clearInterval(this.interval);
    for(const peer of this.wss.clients)peer.terminate();
    await new Promise<void>(resolve=>this.wss.close(()=>resolve()));
  }
}

