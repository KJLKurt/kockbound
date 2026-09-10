import type { Input, MatchConfig, World } from '../../shared/game-types/index.ts';
import { createMatch, step } from '../../shared/simulation/index.ts';
import { botInputs } from '../../shared/simulation/bots.ts';
import { CONTENT_RELEASE, PROTOCOL_VERSION } from '../../shared/content/arena.ts';
import { parseClientMessage } from '../../shared/protocol/messages.ts';
import type { RoomPhase, ServerMessage } from '../../shared/protocol/messages.ts';

export interface Peer {
  readonly id: string;
  readonly bufferedAmount: number;
  send(data: string): void;
  close(code: number, reason: string): void;
}
type Seat = {
  participantId: string; peer: Peer | null; ready: boolean; lastSequence: number;
  pending: Input | null; disconnectedAt: number | null; expired: boolean;
  tokens: number; tokenTime: number;
};
export type RoomReceipt = { matchId: string; status: 'finished' | 'cancelled'; reason: string | null; world: World; rewardsEnabled: false };
const RECONNECT_MS = 10000;
const MAX_BUFFER_BYTES = 65536;

/** Transport-independent room. Admission tickets come only from a trusted server adapter.
 * This class does not expose an authentication endpoint or mutate a reward wallet.
 */
export class RoomAuthority {
  private world: World;
  private phase: RoomPhase = 'waiting';
  private seats = new Map<string, Seat>();
  private tickets: Map<string,string>;
  private receipt: RoomReceipt | null = null;
  private lastTime: number;
  private accumulator = 0;
  overruns = 0;
  rejectedMessages = 0;

  constructor(config: MatchConfig, admissionTickets: ReadonlyMap<string,string>, now = 0) {
    this.world = createMatch(config);
    this.tickets = new Map(admissionTickets);
    this.lastTime = now;
    const humans = config.roster.filter(p=>p.control==='human');
    if (!humans.length || humans.some(p=>![...this.tickets.values()].includes(p.id)) || [...this.tickets.values()].some(id=>!humans.some(p=>p.id===id)) || this.tickets.size !== humans.length) throw new Error('One unique server admission per human seat is required.');
    for (const p of humans) this.seats.set(p.id,{participantId:p.id,peer:null,ready:false,lastSequence:-1,pending:null,disconnectedAt:null,expired:false,tokens:10,tokenTime:now});
  }

  snapshot(): World { return structuredClone(this.world); }
  terminalReceipt(): RoomReceipt | null { return structuredClone(this.receipt); }
  status(): RoomPhase { return this.phase; }
  queueSize(): number { return [...this.seats.values()].filter(s=>s.pending!==null).length; }

  connect(ticket: string, peer: Peer, now: number): boolean {
    const id = this.tickets.get(ticket), seat = id ? this.seats.get(id) : undefined;
    if (!seat || this.phase === 'cancelled' || seat.expired || (seat.disconnectedAt !== null && now-seat.disconnectedAt >= RECONNECT_MS)) { peer.close(1008,'Admission unavailable'); return false; }
    if ([...this.seats.values()].some(s=>s.peer?.id===peer.id)) { peer.close(1008,'Connection identity already in use'); return false; }
    const previous = seat.peer;
    seat.peer = peer; seat.disconnectedAt = null; seat.pending = null;
    // Replace ownership before closing the old socket; a synchronous close callback cannot remove the new owner.
    previous?.close(1000,'Replaced by reconnect');
    this.sendSnapshot(seat,now);
    return seat.peer === peer;
  }

  disconnect(connectionId: string, now: number): void {
    const seat = this.findSeat(connectionId); if (!seat) return;
    seat.peer = null; seat.disconnectedAt = now; this.neutralize(seat);
    if (this.phase==='waiting') seat.ready=false;
  }

  receive(connectionId: string, raw: unknown, now: number): boolean {
    const seat = this.findSeat(connectionId);
    if (!seat || this.receipt) return false;
    seat.tokens = Math.min(10,seat.tokens+Math.max(0,now-seat.tokenTime)*.06); seat.tokenTime = Math.max(now,seat.tokenTime);
    if (seat.tokens < 1) return this.reject(seat,'rate-limit',now);
    seat.tokens--;
    const message = parseClientMessage(raw);
    if (!message) return this.reject(seat,'invalid-message',now);
    if (message.type==='ready') {
      if(this.phase!=='waiting') return this.reject(seat,'roster-locked',now);
      const player=this.world.players.find(p=>p.id===seat.participantId)!,roster=this.world.config.roster.find(p=>p.id===seat.participantId)!;
      const changed=(message.appearance!==undefined&&message.appearance!==player.appearance)||(message.skin!==undefined&&message.skin!==player.skin);
      if(message.appearance!==undefined)player.appearance=roster.appearance=message.appearance;if(message.skin!==undefined)player.skin=roster.skin=message.skin;
      seat.ready=true;
      if([...this.seats.values()].every(s=>s.ready && s.peer)) {
        this.phase=this.world.phase==='countdown'?'countdown':'active'; this.lastTime=now; this.accumulator=0; this.broadcast(now);
      }else if(changed)this.broadcast(now);
      return true;
    }
    const seq=message.type==='input'?message.command.sequence:message.sequence;
    if(seq<=seat.lastSequence || seq>seat.lastSequence+128) return this.reject(seat,'invalid-sequence',now);
    if(message.type==='neutral') {seat.lastSequence=seq;this.neutralize(seat);this.world.players.find(p=>p.id===seat.participantId)!.lastSequence=seq;return true;}
    if(this.phase!=='active' || !this.world.players.find(p=>p.id===seat.participantId)?.alive) return this.reject(seat,'not-active',now);
    if(message.command.participantId!==seat.participantId) return this.reject(seat,'wrong-seat',now);
    if(message.command.dash && this.world.players.find(p=>p.id===seat.participantId)!.cooldownTicks>1) return this.reject(seat,'dash-cooldown',now);
    seat.lastSequence=seq;
    // Bound each seat to one pending input, keeping an action edge if a later movement packet arrives before the tick.
    seat.pending={...message.command,dash:message.command.dash || !!seat.pending?.dash,...(message.command.useItem||seat.pending?.useItem?{useItem:true}:{}),...(message.command.dropItem||seat.pending?.dropItem?{dropItem:true}:{})};
    return true;
  }

  advance(now: number): void {
    if (!Number.isFinite(now) || now<this.lastTime) throw new Error('Room requires a monotonic server clock.');
    const elapsed=now-this.lastTime;this.lastTime=now;
    if(this.receipt || this.phase==='waiting')return;
    // Grace is measured by the server clock, independently of bounded simulation catch-up.
    const expired:string[]=[];
    for(const seat of this.seats.values())if(this.phase==='active' && !seat.peer && !seat.expired && seat.disconnectedAt!==null && now-seat.disconnectedAt>=RECONNECT_MS){seat.expired=true;expired.push(seat.participantId);}
    this.accumulator+=Math.min(elapsed,250);
    if(elapsed>250)this.overruns++;
    let ticks=0;
    while(this.accumulator>=50 && ticks<5 && !this.receipt){
      const commands:Input[]=[];
      for(const seat of this.seats.values()){if(seat.pending)commands.push(seat.pending);seat.pending=null;}
      step(this.world,[...commands,...botInputs(this.world)],ticks===0?expired:[]);
      this.accumulator-=50;ticks++;
      this.phase=this.world.phase;
      if(this.world.result)this.receipt={matchId:this.world.config.matchId,status:'finished',reason:null,world:structuredClone(this.world),rewardsEnabled:false};
      this.broadcast(now);
    }
    // Carry expiry to the next actual tick if the call had less than 50 ms accumulated.
    if(!ticks)for(const id of expired)this.seats.get(id)!.expired=false;
  }

  cancel(reason: string, now: number): void {
    if(this.receipt)return;
    this.phase='cancelled';
    for(const seat of this.seats.values())this.neutralize(seat);
    this.receipt={matchId:this.world.config.matchId,status:'cancelled',reason,world:structuredClone(this.world),rewardsEnabled:false};
    for(const seat of this.seats.values())this.send(seat,{type:'cancelled',matchId:this.world.config.matchId,reason,rewardsEnabled:false},now);
  }

  private findSeat(connectionId: string): Seat | undefined { return [...this.seats.values()].find(s=>s.peer?.id===connectionId); }
  private neutralize(seat: Seat): void {seat.pending=null;const p=this.world.players.find(p=>p.id===seat.participantId)!;p.moveX=p.moveZ=0;p.lastInputTick=-100;}
  private reject(seat: Seat, code: string, now: number): false {
    this.rejectedMessages++;
    // Do not amplify a spammer's traffic with an error for every rejected packet.
    if(code!=='rate-limit')this.send(seat,{type:'error',code},now);
    return false;
  }
  private sendSnapshot(seat: Seat, now: number): void {
    this.send(seat,{type:'snapshot',protocolVersion:PROTOCOL_VERSION,contentReleaseId:CONTENT_RELEASE,roomPhase:this.phase,acknowledgedSequence:this.world.players.find(p=>p.id===seat.participantId)!.lastSequence,nextSequence:seat.lastSequence+1,world:this.world,rewardsEnabled:false},now);
  }
  private broadcast(now: number): void {for(const seat of this.seats.values())this.sendSnapshot(seat,now);}
  private send(seat: Seat, message: ServerMessage, now: number): void {
    const peer=seat.peer;if(!peer)return;
    if(peer.bufferedAmount>MAX_BUFFER_BYTES){this.disconnect(peer.id,now);peer.close(1013,'Slow consumer; reconnect for full state');return;}
    try{peer.send(JSON.stringify(message));}catch{this.disconnect(peer.id,now);peer.close(1011,'Transport failed');}
  }
}

