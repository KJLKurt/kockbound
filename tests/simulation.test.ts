import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { localConfig } from '../shared/content/arena.ts';
import { createMatch, step } from '../shared/simulation/index.ts';
import { botInputs } from '../shared/simulation/bots.ts';
import { LocalSession } from '../client/game/local-session.ts';
import type { Input, World } from '../shared/game-types/index.ts';

function fixture(count=4) { const c=localConfig(71,count); c.rules.countdownTicks=0; return createMatch(c); }
function input(id='p1',x=0,z=0,dash=false,sequence=0): Input { return {participantId:id,x,z,dash,sequence}; }
const digest = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

test('P01: 10,000 recorded ticks replay identically, including bot RNG/events and restored state',()=>{
  const records: Input[][]=[]; const first: string[]=[]; let w=fixture(); let saved:World|undefined;
  for(let i=0;i<10000;i++) {
    if(w.phase==='results') { const c=localConfig(i+1); c.rules.countdownTicks=0; w=createMatch(c); }
    const commands=[input('p1',Math.sin(i*.033),Math.cos(i*.027),i%29===0,i),...botInputs(w)];
    records.push(structuredClone(commands)); step(w,commands); first.push(digest(w));
    if(i===420) saved=structuredClone(w);
  }
  let replay=fixture();
  for(let i=0;i<10000;i++) {
    if(replay.phase==='results') {const c=localConfig(i+1);c.rules.countdownTicks=0;replay=createMatch(c);}
    botInputs(replay); step(replay,records[i]); assert.equal(digest(replay),first[i],`tick ${i}`);
    if(i===420) { assert.deepEqual(replay,saved); replay=JSON.parse(JSON.stringify(saved)); }
  }
  console.log('P01 replay digest:',digest(first));
});
test('P01: 30, 60 and 144 Hz presentation produce the same authority state',()=>{
  const run=(fps:number)=>{const s=new LocalSession(81);let sequence=0;
    for(let f=0;f<fps*40;f++) s.advance(1/fps,()=>input('p1',0,0,false,sequence++),()=>{});
    return digest(s.world);
  };
  assert.equal(run(30),run(60)); assert.equal(run(60),run(144));
});
test('P02: cardinal/diagonal speed, hostile numbers, duplicate sequence and stale controls',()=>{
  for(const [x,z] of [[1,0],[1,1],[1000,1000],[0,0]]) {
    const w=fixture(1); w.players[0].x=w.players[0].z=0;
    for(let i=0;i<15;i++) step(w,[input('p1',x,z,false,i)]);
    assert.ok(Math.hypot(w.players[0].vx,w.players[0].vz)<=5+1e-9);
  }
  const w=fixture(1),p=w.players[0]; p.x=p.z=0;
  step(w,[input('p1',1,0,false,1)]);
  step(w,[input('p1',NaN,Infinity,true,2),input('p1',0,1,false,1)]);
  assert.equal(p.lastSequence,1); assert.equal(p.dashId,0);
  for(let i=0;i<10;i++)step(w,[]);
  assert.equal(p.moveX,0); assert.equal(p.vx,0); assert.ok(Number.isFinite(p.x));
});
test('P03: single-hit dash, cooldown and vulnerability recovery',()=>{
  const w=fixture(2),[a,b]=w.players;a.x=-.5;a.z=0;b.x=.5;b.z=0;
  step(w,[input('p1',1,0,true,0)]);
  assert.equal(a.hits,1);assert.equal(b.vulnerability,.2);
  for(let i=1;i<12;i++) {b.x=a.x+.7;b.z=a.z;step(w,[input('p1',1,0,true,i)]);}
  assert.equal(a.dashId,1);assert.equal(a.hits,1);
  a.x=-1;a.z=0;b.x=1;b.z=0;a.ix=a.iz=b.ix=b.iz=a.vx=a.vz=b.vx=b.vz=0;
  for(let i=12;i<60;i++)step(w,[input('p1',0,0,false,i)]);
  assert.ok(b.vulnerability<.2);
});
test('P04: coincident centers settle; simultaneous head-on dashes hit both',()=>{
  const w=fixture(2),[a,b]=w.players;a.x=b.x=a.z=b.z=0;
  step(w,[]);assert.ok(Math.hypot(a.x-b.x,a.z-b.z)>=.9-1e-8);
  a.x=-.5;b.x=.5;a.z=b.z=0;
  step(w,[input('p1',1,0,true,0),input('p2',-1,0,true,0)]);
  assert.equal(a.hits,1);assert.equal(b.hits,1);assert.equal(a.vulnerability,.2);assert.equal(b.vulnerability,.2);
  assert.ok(a.ix<0 && b.ix>0);
});
test('P03: later dash increases impulse from previous vulnerability; vulnerability is capped',()=>{
  const w=fixture(2),[a,b]=w.players;let sequence=0;
  for(let hit=0;hit<12;hit++) {
    a.x=-.5;a.z=0;b.x=.5;b.z=0;a.ix=a.iz=b.ix=b.iz=a.vx=a.vz=b.vx=b.vz=0;
    a.cooldownTicks=0;a.dashTicks=0;
    const before=b.vulnerability;
    step(w,[input('p1',1,0,true,sequence++)]);
    assert.equal(w.events.find(e=>e.type==='hit')?.strength,7*(1+before));
    assert.equal(b.vulnerability,Math.min(2,before+.2));
  }
  assert.equal(b.vulnerability,2);
});
test('P04: maximum supported impulse/dash cannot tunnel through a 2 cm wall',()=>{
  const c=localConfig(1,1);c.rules.countdownTicks=0;c.obstacles=[{id:'thin',x:0,z:0,halfX:.01,halfZ:5}];
  const w=createMatch(c),p=w.players[0];p.x=-1;p.z=0;p.ix=22;
  step(w,[input('p1',1,0,true)]);assert.ok(p.x<=-.46+1e-8);assert.ok(Number.isFinite(p.x));
});
test('P05: simultaneous final falls draw, terminal events are once-only, restart is clean',()=>{
  const w=fixture(2);for(const p of w.players){p.x=11;p.z=0;}
  step(w,[]);assert.equal(w.result?.outcome,'draw');assert.equal(w.events.filter(e=>e.type==='ringout').length,2);
  step(w,[]);assert.equal(w.events.length,0);
  const reset=createMatch(w.config);assert.equal(reset.tick,0);assert.ok(reset.players.every(p=>p.alive && !p.dashId && !p.hits));
  const c=localConfig(1,2);c.rules.countdownTicks=0;c.rules.durationTicks=1;c.rules.suddenDeathTicks=0;
  const timeout=createMatch(c);step(timeout,[]);assert.equal(timeout.result?.outcome,'draw');
  const empty=localConfig();empty.roster=[];assert.equal(createMatch(empty).result?.outcome,'cancelled');
});
test('P06: keyboard-like input + three normal-rule bots finish 20 seeded rounds',()=>{
  const outcomes=[];
  for(let seed=1;seed<=20;seed++) {
    const c=localConfig(seed);c.rules.countdownTicks=0;const w=createMatch(c);
    let hits=0;
    for(let i=0;i<2000 && !w.result;i++) {
      const p=w.players[0];const towardCenter=Math.hypot(p.x,p.z)>5;
      step(w,[input('p1',towardCenter?-p.x:Math.sin(i*.021),towardCenter?-p.z:Math.cos(i*.021),i%31===0,i),...botInputs(w)]);
      hits+=w.events.filter(e=>e.type==='hit').length;
      for(const p of w.players) {assert.ok([p.x,p.z,p.vx,p.vz,p.ix,p.iz].every(Number.isFinite));assert.ok(p.cooldownTicks<=24);}
    }
    assert.ok(w.result,`seed ${seed} stuck`);outcomes.push({seed,ticks:w.activeTick,outcome:w.result.outcome,winner:w.result.winnerId,hits});
  }
  console.log('P06 seeded round results:',JSON.stringify(outcomes));
});
test('Config rejects incompatible releases, unsupported capacities and unsafe physics',()=>{
  assert.throws(()=>localConfig(1,13));
  for(const change of [(c:ReturnType<typeof localConfig>)=>c.rules.dashSpeed=100,(c:ReturnType<typeof localConfig>)=>c.protocolVersion='bad',(c:ReturnType<typeof localConfig>)=>c.roster.push(c.roster[0])]){const c=localConfig();change(c);assert.throws(()=>createMatch(c));}
});
