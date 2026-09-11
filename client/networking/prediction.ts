import type { Input, Player, World } from '../../shared/game-types/index.ts';
import { step } from '../../shared/simulation/index.ts';
import {sampleProjectiles} from '../game/projectile-presentation.ts';

/** Predict only the local player's movement; remote collisions and all outcomes remain server-owned. */
export function predictLocal(authoritative:World, participantId:string, pending:readonly Input[]):World {
  const output=structuredClone(authoritative),original=output.players.find(p=>p.id===participantId);
  if(!original?.alive || authoritative.phase!=='active')return output;
  const prediction=structuredClone(authoritative);prediction.players=[structuredClone(original)];prediction.events=[];prediction.config.items=[];delete prediction.items;prediction.config.hazards=[];delete prediction.hazards;
  // Boss mechanics and team outcomes are authoritative, never predicted.
  prediction.config.modeId='arena';delete prediction.boss;
  // The server coalesces queued movement per tick. An unacknowledged packet is
  // therefore not necessarily another simulation tick, especially with jitter.
  // Bound speculation to 100 ms and retain an unacknowledged dash edge.
  const commands=pending.slice(-2);
  if(pending.length>2){const dash=pending.find(input=>input.dash);if(dash&&dash.sequence<commands[0].sequence)commands[0]=dash;}
  for(const input of commands){
    prediction.phase='active';prediction.result=null;
    step(prediction,[input]);
    // A speculative edge crossing must never eliminate a participant or end the match.
    prediction.players[0].alive=original.alive;prediction.players[0].eliminatedTick=original.eliminatedTick;
  }
  const predicted=prediction.players[0];
  for(const key of ['x','z','vx','vz','ix','iz','facingX','facingZ','dashTicks','cooldownTicks'] as const)original[key]=predicted[key];
  return output;
}

export class RemoteBuffer {
  private frames:{world:World;at:number}[]=[];
  push(world:World,at:number){
    if(this.frames.length && world.tick<this.frames.at(-1)!.world.tick)return;
    if(this.frames.at(-1)?.world.tick===world.tick)this.frames.pop();
    this.frames.push({world:structuredClone(world),at});if(this.frames.length>8)this.frames.shift();
  }
  reset(){this.frames=[];}
  sample(now:number):World|null{
    const last=this.frames.at(-1);if(!last)return null;
    if(last.world.phase!=='active')return structuredClone(last.world);
    const tick=Math.min(last.world.tick,last.world.tick-2+Math.max(0,now-last.at)/50);
    const lower=this.frames.findLast(f=>f.world.tick<=tick)??this.frames[0];
    const upper=this.frames.find(f=>f.world.tick>=tick)??last;
    const alpha=upper.world.tick===lower.world.tick?1:Math.max(0,Math.min(1,(tick-lower.world.tick)/(upper.world.tick-lower.world.tick)));
    const result=structuredClone(last.world);
    for(const p of result.players){const a=lower.world.players.find(q=>q.id===p.id),b=upper.world.players.find(q=>q.id===p.id);if(!a||!b||!p.alive)continue;p.x=a.x+(b.x-a.x)*alpha;p.z=a.z+(b.z-a.z)*alpha;}
    if(result.items?.shots)result.items.shots=sampleProjectiles(result.items.shots,lower.world.items?.shots??[],upper.world.items?.shots??[],alpha);
    return result;
  }
  size(){return this.frames.length;}
}

/** Smooth presentation between 20 Hz targets, without modifying prediction or authority. */
export class OwnerSmoother {
  private position:{x:number;z:number}|null=null;
  reset(){this.position=null;}
  sample(target:Player,seconds:number):Player{
    const distance=this.position?Math.hypot(target.x-this.position.x,target.z-this.position.z):Infinity;
    if(!this.position||!target.alive||distance>2.5)this.position={x:target.x,z:target.z};
    else {
      const alpha=1-Math.exp(-Math.max(0,seconds)/.035);
      this.position.x+=(target.x-this.position.x)*alpha;this.position.z+=(target.z-this.position.z)*alpha;
    }
    return {...target,...this.position};
  }
}

