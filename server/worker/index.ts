import {configureParty} from '../../shared/content/party.ts';
import {validRoomOptions} from '../../shared/content/items.ts';
import {localConfig,PROTOCOL_VERSION,CONTENT_RELEASE} from '../../shared/content/arena.ts';
import {RoomAuthority} from '../game-room/authority.ts';

// Narrow platform boundary; no Cloudflare types or APIs enter shared simulation.
interface Storage {get<T>(key:string):Promise<T|undefined>;put(key:string,value:unknown):Promise<void>}
interface State {storage:Storage;blockConcurrencyWhile<T>(callback:()=>Promise<T>):Promise<T>}
interface WorkerSocket extends WebSocket {accept():void}
declare const WebSocketPair:{new():{0:WorkerSocket;1:WorkerSocket}};
interface Env {ROOMS:{idFromName(name:string):unknown;get(id:unknown):{fetch(request:Request):Promise<Response>}};ASSETS:{fetch(request:Request):Promise<Response>};ENABLE_ROOMS?:string}
type RecordState={status:'unfinished'|'finished'|'cancelled';roomId:string;reason?:string;receipt?:unknown};
const json=(status:number,value:unknown)=>Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const randomHex=(bytes:number)=>Array.from(crypto.getRandomValues(new Uint8Array(bytes)),b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
const ticket=()=>btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32)))).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
async function readBody(request:Request):Promise<unknown>{
  const reader=request.body?.getReader();if(!reader)throw new Error('Missing JSON');
  const chunks:Uint8Array[]=[];let size=0;
  try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>1024)throw new Error('Request too large');chunks.push(value);}}
  finally{await reader.cancel();}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  return JSON.parse(new TextDecoder().decode(bytes));
}

export default {
  async fetch(request:Request,env:Env):Promise<Response>{
    const url=new URL(request.url);
    if(!url.pathname.startsWith('/api/')){
      const response=await env.ASSETS.fetch(request);
      if(env.ENABLE_ROOMS==='true'&&response.headers.get('Content-Type')?.includes('text/html')){
        const headers=new Headers(response.headers);headers.delete('Content-Length');headers.delete('ETag');
        return new Response((await response.text()).replace('data-multiplayer="false"','data-multiplayer="true"'),{status:response.status,headers});
      }
      return response;
    }
    if(env.ENABLE_ROOMS!=='true')return json(503,{error:'Room preview is disabled'});
    if(request.headers.get('Origin')!==url.origin)return json(403,{error:'Same-origin request required'});
    if(url.pathname==='/api/rooms'&&request.method==='POST'){
      let body:unknown;try{body=await readBody(request);}catch{return json(400,{error:'Invalid or oversized JSON'});}
      if(!validRoomOptions(body))return json(400,{error:'Choose 1–12 human seats'});
      for(let attempt=0;attempt<3;attempt++){
        const roomId=randomHex(3),stub=env.ROOMS.get(env.ROOMS.idFromName(roomId));
        const response=await stub.fetch(new Request(`${url.origin}/create/${roomId}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}));
        if(response.status!==409)return response;
      }
      return json(503,{error:'Room allocation unavailable'});
    }
    const join=/^\/api\/rooms\/([A-Z0-9]{6})\/join$/.exec(url.pathname);
    if(join&&request.method==='POST'){
      let body:unknown;try{body=await readBody(request);}catch{return json(400,{error:'Invalid JSON'});}
      if(!body||typeof body!=='object'||Array.isArray(body)||Object.keys(body).length)return json(400,{error:'Join request must be empty'});
      return env.ROOMS.get(env.ROOMS.idFromName(join[1])).fetch(new Request(`${url.origin}/join`,{method:'POST'}));
    }
    if(url.pathname==='/api/socket'&&request.method==='GET'&&request.headers.get('Upgrade')?.toLowerCase()==='websocket'){
      const room=url.searchParams.get('room')??'',seatTicket=url.searchParams.get('ticket')??'';
      if(!/^[A-Z0-9]{6}$/.test(room)||!/^[A-Za-z0-9_-]{43}$/.test(seatTicket))return json(403,{error:'Invalid admission'});
      return env.ROOMS.get(env.ROOMS.idFromName(room)).fetch(new Request(`${url.origin}/socket?ticket=${encodeURIComponent(seatTicket)}`,request));
    }
    return json(404,{error:'Unknown endpoint'});
  },
};

/** One live room per Durable Object; a runtime restart cancels, never replays, its match. */
export class GameRoom {
  private state:State;private record:RecordState|undefined;
  private authority:RoomAuthority|null=null;private tickets:string[]=[];private claimed=0;
  private interval:ReturnType<typeof setInterval>|null=null;private createdAt=0;private finishedAt:number|null=null;private persisting=false;
  private peers=new Set<WorkerSocket>();
  constructor(state:State){this.state=state;state.blockConcurrencyWhile(async()=>{
    this.record=await state.storage.get<RecordState>('room');
    if(this.record?.status==='unfinished'){this.record={roomId:this.record.roomId,status:'cancelled',reason:'Room cancelled after server restart'};await state.storage.put('room',this.record);}
  });}
  async fetch(request:Request):Promise<Response>{
    const url=new URL(request.url),create=/^\/create\/([A-Z0-9]{6})$/.exec(url.pathname);
    if(create&&request.method==='POST'){
      if(this.record)return json(409,{error:'Room identity already used'});
      const options=await request.json();if(!validRoomOptions(options))return json(400,{error:'Invalid room options'});const {humanCount}=options;
      if(!Number.isInteger(humanCount)||humanCount<1||humanCount>12)return json(400,{error:'Invalid human count'});
      const config=localConfig(crypto.getRandomValues(new Uint32Array(1))[0],options.totalCount??Math.max(4,humanCount));config.matchId=`room-${create[1]}`;if(options.items?.length)config.items=options.items;if(options.hazards?.length)config.hazards=options.hazards;
      configureParty(config,options);
      config.roster.forEach((p,i)=>{p.control=i<humanCount?'human':'bot';if(i<humanCount)p.name=`Player ${i+1}`;});
      this.record={roomId:create[1],status:'unfinished'};await this.state.storage.put('room',this.record);
      this.tickets=Array.from({length:humanCount},ticket);this.claimed=1;this.createdAt=Date.now();
      this.authority=new RoomAuthority(config,new Map(this.tickets.map((value,i)=>[value,config.roster[i].id])),this.createdAt);
      this.interval=setInterval(()=>this.tick(),25);return this.admission(0,201);
    }
    if(!this.record)return json(404,{error:'Room not found'});
    if(!this.authority||this.record.status==='cancelled')return json(410,{error:this.record.reason??'Room ended'});
    if(url.pathname==='/join'&&request.method==='POST'){
      if(this.authority.status()!=='waiting'||this.claimed>=this.tickets.length)return json(409,{error:'Room is full or already started'});
      return this.admission(this.claimed++,200);
    }
    if(url.pathname==='/socket'&&request.headers.get('Upgrade')?.toLowerCase()==='websocket'){
      const admission=url.searchParams.get('ticket')??'';
      if(!this.tickets.slice(0,this.claimed).includes(admission)||this.peers.size>=24)return json(403,{error:'Admission unavailable'});
      const pair=new WebSocketPair(),client=pair[0],server=pair[1],id=crypto.randomUUID();server.accept();this.peers.add(server);
      const close=()=>{this.peers.delete(server);this.authority?.disconnect(id,Date.now());};
      server.addEventListener('close',close);server.addEventListener('error',close);
      server.addEventListener('message',event=>{
        if(typeof event.data!=='string'){server.close(1003,'Text messages required');return;}
        if(new TextEncoder().encode(event.data).length>1024){server.close(1009,'Frame too large');return;}
        this.authority?.receive(id,event.data,Date.now());
      });
      this.authority.connect(admission,{id,get bufferedAmount(){return server.bufferedAmount??0;},send:data=>server.send(data),close:(code,reason)=>server.close(code,reason)},Date.now());
      return new Response(null,{status:101,webSocket:client} as ResponseInit);
    }
    return json(404,{error:'Unknown room endpoint'});
  }
  private admission(index:number,status:number){return json(status,{roomId:this.record!.roomId,participantId:`p${index+1}`,ticket:this.tickets[index],protocolVersion:PROTOCOL_VERSION,contentReleaseId:CONTENT_RELEASE});}
  private tick(){
    const now=Date.now(),authority=this.authority;if(!authority)return;
    authority.advance(now);
    if(authority.status()==='waiting'&&now-this.createdAt>120000)authority.cancel('Room readiness timed out',now);
    const receipt=authority.terminalReceipt();
    if(receipt){
      this.finishedAt??=now;
      if(this.record?.status==='unfinished'&&!this.persisting){
        this.persisting=true;const record:RecordState={roomId:this.record.roomId,status:receipt.status==='finished'?'finished':'cancelled',receipt};
        void this.state.storage.put('room',record).then(()=>{this.record=record;}).catch(()=>{/* Retry; unfinished records cancel on restart. */}).finally(()=>{this.persisting=false;});
      }
      if(now-this.finishedAt>60000){for(const peer of this.peers)peer.close(1000,'Room ended');this.peers.clear();if(this.interval)clearInterval(this.interval);this.interval=null;this.authority=null;this.tickets=[];}
    }
  }
}

