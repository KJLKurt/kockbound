import type {Appearance,Skin} from '../../shared/content/characters.ts';
import type { Input, World } from '../../shared/game-types/index.ts';
import { CONTENT_RELEASE, PROTOCOL_VERSION } from '../../shared/content/arena.ts';
import { parseServerMessage } from '../../shared/protocol/messages.ts';
import type { Admission, RoomPhase } from '../../shared/protocol/messages.ts';
import { predictLocal, RemoteBuffer, OwnerSmoother } from './prediction.ts';

export type Socket=Pick<WebSocket,'onopen'|'onmessage'|'onclose'|'onerror'|'readyState'|'bufferedAmount'|'send'|'close'>;
type Options={appearance?:Appearance;skin?:Skin;origin?:string;socketFactory?:(url:string)=>Socket;onStatus?:(status:string)=>void};
export class OnlineSession {
  world!:World;previous!:World;authoritative!:World;
  roomPhase:RoomPhase='waiting';paused=false;overruns=0;connected=false;failure:string|null=null;
  readonly participantId:string;readonly roomId:string;
  corrections=0;maxCorrection=0;snapshotBytes=0;
  private admission:Admission;private origin:string;private options:Options;
  private socket:Socket|null=null;private closed=false;private timer:ReturnType<typeof setTimeout>|null=null;
  private pending:Input[]=[];private nextSequence=0;private accumulator=0;private frameClock=0;
  private buffer=new RemoteBuffer();private events:World[]=[];private lastEventSerial=0;
  private ownerSmoother=new OwnerSmoother();
  private reconnectAt:number|null=null;private firstResolve!:()=>void;private firstReject!:(error:Error)=>void;
  private initialized=false;
  private constructor(admission:Admission,options:Options){this.admission=admission;this.participantId=admission.participantId;this.roomId=admission.roomId;this.options=options;this.origin=options.origin??location.origin;}
  static async connect(admission:Admission,options:Options={}):Promise<OnlineSession>{
    if(admission.protocolVersion!==PROTOCOL_VERSION||admission.contentReleaseId!==CONTENT_RELEASE||!/^p\d{1,2}$/.test(admission.participantId)||!/^[A-Z0-9]{6}$/.test(admission.roomId)||!/^[A-Za-z0-9_-]{43}$/.test(admission.ticket))throw new Error('Incompatible room admission.');
    const session=new OnlineSession(admission,options);
    const ready=new Promise<void>((resolve,reject)=>{session.firstResolve=resolve;session.firstReject=reject;});
    const timeout=setTimeout(()=>session.fail('The room did not respond. Try joining again.'),10000);
    session.open();try{await ready;return session;}catch(error){session.close();throw error;}finally{clearTimeout(timeout);}
  }
  private open(){
    if(this.closed)return;
    const url=new URL('/api/socket',this.origin);url.protocol=url.protocol==='https:'?'wss:':'ws:';url.searchParams.set('room',this.roomId);url.searchParams.set('ticket',this.admission.ticket);
    const socket=(this.options.socketFactory??(url=>new WebSocket(url)))(url.toString());this.socket=socket;let first=true,readySent=false;
    socket.onopen=()=>{if(this.socket!==socket)return;this.connected=true;this.options.onStatus?.('Connected');};
    socket.onerror=()=>{}; // Close owns bounded retry and the user-facing error.
    socket.onmessage=event=>{
      if(this.socket!==socket||this.closed)return;
      const message=parseServerMessage(event.data);
      if(!message){this.fail('The server sent incompatible game data.');return;}
      if(message.type==='cancelled'){this.fail(message.reason);return;}
      if(message.type==='error'){if(!['dash-cooldown','not-active','invalid-sequence','roster-locked'].includes(message.code))this.options.onStatus?.(`Room: ${message.code}`);return;}
      if(message.world.config.matchId!==`room-${this.roomId}`||!message.world.players.some(p=>p.id===this.participantId)){this.fail('The room assigned an invalid player.');return;}
      if(this.initialized && message.world.tick<this.authoritative.tick)return;
      this.snapshotBytes+=typeof event.data==='string'?new TextEncoder().encode(event.data).length:0;
      if(first){this.pending=[];this.accumulator=0;this.buffer.reset();this.ownerSmoother.reset();this.nextSequence=message.nextSequence;this.reconnectAt=null;first=false;}
      this.pending=this.pending.filter(c=>c.sequence>message.acknowledgedSequence);this.nextSequence=Math.max(this.nextSequence,message.nextSequence);
      const before=this.world?.players.find(p=>p.id===this.participantId);
      this.authoritative=message.world;this.roomPhase=message.roomPhase;
      this.buffer.push(message.world,this.frameClock);
      const predicted=predictLocal(this.authoritative,this.participantId,this.pending),after=predicted.players.find(p=>p.id===this.participantId)!;
      if(before){const distance=Math.hypot(before.x-after.x,before.z-after.z);if(distance>.15)this.corrections++;this.maxCorrection=Math.max(this.maxCorrection,distance);}
      this.world=predicted;this.previous=structuredClone(predicted);
      const events=structuredClone(message.world);events.events=events.events.filter(e=>Number(e.id.split(':').at(-1))>this.lastEventSerial);this.lastEventSerial=message.world.eventSerial;this.events.push(events);if(this.events.length>16)this.events.shift();
      if(!this.initialized){this.initialized=true;this.firstResolve();}
      if(this.roomPhase==='waiting'){this.options.onStatus?.(`Room ${this.roomId} · waiting for players`);if(!readySent){readySent=true;this.send({type:'ready',protocolVersion:PROTOCOL_VERSION,contentReleaseId:CONTENT_RELEASE,...(this.options.appearance?{appearance:this.options.appearance}:{}),...(this.options.skin?{skin:this.options.skin}:{})});}}
      else this.options.onStatus?.(`Room ${this.roomId}`);
    };
    socket.onclose=event=>{
      if(this.socket!==socket||this.closed)return;this.connected=false;this.pending=[];
      if(this.authoritative?.result){this.options.onStatus?.(`Room ${this.roomId} · round complete`);this.close();return;}
      if(event.code===1000){this.fail('This connection was replaced or the room ended.');return;}
      if([1002,1003,1008,1009].includes(event.code)){this.fail('The room rejected the connection. Please rejoin.');return;}
      this.reconnectAt??=performance.now();
      if(performance.now()-this.reconnectAt>9000){this.fail('Connection lost. The reconnect window has ended.');return;}
      this.options.onStatus?.('Reconnecting… controls are neutral');this.timer=setTimeout(()=>this.open(),400);
    };
  }
  private send(value:unknown){if(this.socket?.readyState!==1)return false;if(this.socket.bufferedAmount>16384){this.socket.close(1013,'Input backlog');return false;}this.socket.send(JSON.stringify(value));return true;}
  neutral(){this.pending=[];this.accumulator=0;if(this.initialized)this.send({type:'neutral',protocolVersion:PROTOCOL_VERSION,sequence:this.nextSequence++});}
  advance(seconds:number,sample:()=>Input,onStep:(world:World)=>void):number{
    this.frameClock+=Math.min(.25,Math.max(0,seconds))*1000;
    if(!this.initialized)return 1;
    this.accumulator+=Math.min(.25,Math.max(0,seconds));
    let steps=0;
    while(this.accumulator+1e-9>=.05&&steps<5){
      this.accumulator-=.05;steps++;
      if(this.connected&&!this.paused&&!this.failure&&this.roomPhase==='active'&&this.authoritative.players.find(p=>p.id===this.participantId)!.alive){
        const raw=sample(),length=Math.max(1,Math.hypot(raw.x,raw.z));
        const command={...raw,participantId:this.participantId,sequence:this.nextSequence++,x:raw.x/length,z:raw.z/length};
        if(this.send({type:'input',protocolVersion:PROTOCOL_VERSION,command})){this.pending.push(command);if(this.pending.length>64){this.neutral();this.options.onStatus?.('Waiting for the server…');}}
      }
    }
    const presentation=this.buffer.sample(this.frameClock)??structuredClone(this.authoritative);
    const predicted=predictLocal(this.authoritative,this.participantId,this.pending);
    const owner=this.ownerSmoother.sample(predicted.players.find(p=>p.id===this.participantId)!,Math.min(.25,Math.max(0,seconds)));
    presentation.players=presentation.players.map(p=>p.id===this.participantId?owner:p);
    this.world=presentation;this.previous=structuredClone(presentation);
    for(const eventWorld of this.events.splice(0))onStep(eventWorld);
    return 1;
  }
  private fail(message:string){if(this.closed)return;this.failure=message;this.options.onStatus?.(message);if(!this.initialized)this.firstReject(new Error(message));this.close();}
  close(){this.closed=true;this.connected=false;if(this.timer)clearTimeout(this.timer);this.socket?.close();this.pending=[];}
}
