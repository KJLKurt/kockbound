import {test} from 'node:test';
import assert from 'node:assert/strict';
import {localConfig} from '../shared/content/arena.ts';
import {createMatch,step} from '../shared/simulation/index.ts';
import {botInputs} from '../shared/simulation/bots.ts';
import {validRoomOptions} from '../shared/content/items.ts';
function fixture(){const config=localConfig(42,2);config.rules.countdownTicks=0;config.items=['bomb'];const w=createMatch(config);w.players[0].x=0;w.players[0].z=0;w.players[0].facingX=1;w.players[0].facingZ=0;w.players[1].x=5;w.players[1].z=0;w.items={nextSpawn:9999,serial:1,ground:[{id:'item-1',kind:'bomb',expiresAt:100,x:0,z:0,vx:0,vz:0,owner:null,thrown:false,blockedId:null,blockedUntil:0}]};return w;}
test('pickup selects closest and drop swaps in the same tick without resetting charges or expiry',()=>{
  const w=fixture();w.config.items=['bomb','blaster','shovel'];
  const base=w.items!.ground[0];
  w.items!.ground=[{...base,id:'older-far',x:.7},{...base,id:'nearest',kind:'blaster',x:.2,charges:2,activated:true,expiresAt:60}];
  w.players[0].heldItem={id:'held-shovel',kind:'shovel',expiresAt:80,activated:true};
  const replay=structuredClone(w),command={participantId:'p1',sequence:1,x:0,z:0,dash:false,dropItem:true};
  step(w,[command]);step(replay,[command]);assert.deepEqual(w,replay);
  assert.equal(w.players[0].heldItem?.id,'nearest');assert.equal(w.players[0].heldItem?.charges,2);assert.equal(w.players[0].heldItem?.expiresAt,60);
  assert.deepEqual(w.events.filter(e=>e.source==='p1'&&['drop','pickup'].includes(e.type)).map(e=>e.type),['drop','pickup']);
  assert.equal(w.items!.ground.find(i=>i.id==='held-shovel')?.expiresAt,80);
  const tie=fixture();tie.items!.ground=[{...base,id:'first',x:.4},{...base,id:'second',x:-.4}];step(tie,[]);assert.equal(tie.players[0].heldItem?.id,'first');
  const boundary=fixture();boundary.items!.ground[0].x=.85;step(boundary,[]);assert.equal(boundary.players[0].heldItem,undefined);
});
test('shovel extends forward dash reach without widening ordinary body collisions',()=>{
  const a=fixture();a.items!.ground=[];a.config.items=['shovel'];a.players[0].heldItem={id:'shovel',kind:'shovel',expiresAt:1000,activated:true};a.players[1].x=2.5;
  const b=structuredClone(a);b.players[0].heldItem=null;
  const command={participantId:'p1',sequence:1,x:1,z:0,dash:true};step(a,[command]);step(b,[command]);assert.equal(a.players[0].hits,1);assert.equal(b.players[0].hits,0);
});
test('big mode reduces blast impulse and expires without resetting through a drop',()=>{
  const a=fixture();a.config.items=['bomb','big'];a.items!.ground[0].expiresAt=1;a.players[0].heldItem={id:'big',kind:'big',expiresAt:1000,activated:true};const b=structuredClone(a);b.players[0].heldItem=null;
  step(a,[]);step(b,[]);assert.ok(Math.abs(a.players[0].ix*1.8-b.players[0].ix)<1e-8);
  a.players[0].stunnedUntil=0;step(a,[{participantId:'p1',sequence:1,x:0,z:0,dash:false,dropItem:true}]);assert.equal(a.items!.ground[0].expiresAt,1000);assert.equal(a.items!.ground[0].activated,true);
  a.players[1].x=a.items!.ground[0].x;a.players[1].z=a.items!.ground[0].z;step(a,[]);assert.equal(a.players[1].heldItem?.expiresAt,1000);a.activeTick=999;step(a,[]);assert.equal(a.players[1].heldItem,null);
});
test('expired Big mode grants no extra tick of resistance to a hazard',()=>{
  const world=fixture();world.items!.ground=[];world.config.items=['big'];world.config.hazards=['gust'];
  world.hazards={serial:0,nextAt:999,rocks:[],gust:{dx:1,dz:0,startAt:1,endAt:30}};
  world.players[0].heldItem={id:'expired-big',kind:'big',expiresAt:1};
  const normal=structuredClone(world);normal.players[0].heldItem=null;
  step(world,[]);step(normal,[]);
  assert.deepEqual(world.players[0],normal.players[0]);
});
test('expired shovel cannot extend a dash and expired hat cannot rescue a fall',()=>{
  const shovel=fixture();shovel.items!.ground=[];shovel.config.items=['shovel'];shovel.players[1].x=2.5;
  shovel.players[0].heldItem={id:'old-shovel',kind:'shovel',expiresAt:1};
  step(shovel,[{participantId:'p1',sequence:1,x:1,z:0,dash:true}]);assert.equal(shovel.players[0].hits,0);
  const hat=fixture();hat.items!.ground=[];hat.config.items=['helicopter'];hat.players[0].x=11;hat.players[0].heldItem={id:'old-hat',kind:'helicopter',expiresAt:1};
  step(hat,[]);assert.equal(hat.players[0].alive,false);assert.equal(hat.events.some(e=>e.type==='rescue'),false);
});
test('helicopter rescues exactly one fall but cannot evade a server forfeit',()=>{
  const w=fixture();w.items!.ground=[];w.config.items=['helicopter'];w.players[0].heldItem={id:'hat',kind:'helicopter',expiresAt:1000};w.players[0].x=11;
  const forfeited=structuredClone(w);step(forfeited,[],['p1']);assert.equal(forfeited.players[0].alive,false);assert.ok(!forfeited.events.some(e=>e.type==='rescue'));
  step(w,[]);assert.equal(w.players[0].alive,true);assert.equal(w.players[0].heldItem,null);assert.ok(w.events.some(e=>e.type==='rescue'));assert.ok(Math.hypot(w.players[0].x,w.players[0].z)<w.radius-1);
  w.players[0].x=11;step(w,[]);assert.equal(w.players[0].alive,false);
});
test('one slot proximity pickup, drop grace and fuse preservation prevent reset exploits',()=>{
  const w=fixture();step(w,[]);assert.equal(w.players[0].heldItem?.id,'item-1');assert.equal(w.items!.ground.length,0);
  step(w,[{participantId:'p1',sequence:1,x:0,z:0,dash:false,dropItem:true}]);assert.equal(w.players[0].heldItem,null);assert.equal(w.items!.ground[0].expiresAt,100);
  for(let i=0;i<10;i++)step(w,[]);assert.equal(w.players[0].heldItem,null);
  w.players[1].x=w.items!.ground[0].x;w.players[1].z=0;step(w,[]);assert.equal(w.players[1].heldItem?.id,'item-1');
});
test('throw detonates after twenty ticks, pushes/stuns and cannot be picked up in flight',()=>{
  const w=fixture();step(w,[]);step(w,[{participantId:'p1',sequence:1,x:0,z:0,dash:false,useItem:true}]);const expiry=w.items!.ground[0].expiresAt;
  assert.equal(expiry,w.activeTick+20);assert.equal(w.players[0].heldItem,null);
  while(w.activeTick<expiry-1){step(w,[]);assert.ok(!w.events.some(e=>e.type==='blast'));}
  step(w,[]);assert.ok(w.events.some(e=>e.type==='blast'));assert.ok((w.players[1].stunnedUntil??0)>w.activeTick);assert.ok(Math.hypot(w.players[1].ix,w.players[1].iz)>0);assert.equal(w.items!.ground.length,0);
});
test('an action on the expiry tick cannot postpone or relocate a held bomb blast',()=>{
  for(const action of [{useItem:true},{dropItem:true}]){
    const world=fixture();world.items!.ground=[];world.players[0].heldItem={id:'last-tick',kind:'bomb',expiresAt:1};
    step(world,[{participantId:'p1',sequence:1,x:0,z:0,dash:false,...action}]);
    assert.equal(world.players[0].heldItem,null);assert.equal(world.items!.ground.length,0);
    assert.equal(world.events.some(e=>e.type==='throw'||e.type==='drop'),false);
    const blast=world.events.find(e=>e.type==='blast');assert.ok(blast);assert.equal(blast.x,0);assert.equal(blast.z,0);
    assert.ok((world.players[0].stunnedUntil??0)>world.activeTick);
  }
  const before=fixture();before.items!.ground=[];before.players[0].heldItem={id:'just-in-time',kind:'bomb',expiresAt:2};
  step(before,[{participantId:'p1',sequence:1,x:0,z:0,dash:false,useItem:true}]);
  assert.equal(before.items!.ground[0].thrown,true);assert.equal(before.items!.ground[0].expiresAt,before.activeTick+20);
});
test('held bombs expire, disabled catalog stays empty, seeded items replay identically',()=>{
  const w=fixture();w.items!.ground[0].expiresAt=3;step(w,[]);step(w,[]);step(w,[]);assert.equal(w.players[0].heldItem,null);assert.ok(w.events.some(e=>e.type==='blast'));
  const config=localConfig(19,4);config.items=['bomb'];config.rules.countdownTicks=0;const a=createMatch(config),b=createMatch(config);for(let i=0;i<1000;i++){step(a,botInputs(a));step(b,botInputs(b));}assert.deepEqual(a,b);
  const off=createMatch(localConfig(1));for(let i=0;i<400;i++)step(off,botInputs(off));assert.equal(off.items,undefined);
  assert.equal(validRoomOptions({humanCount:2,items:['unknown']}),false);assert.equal(validRoomOptions({humanCount:2,items:['bomb'],wallet:10}),false);assert.equal(validRoomOptions({humanCount:2,items:['bomb']}),true);
});

test('bomb and pod blasts never shorten an existing stun, but can extend a shorter one',()=>{
  for(const kind of ['bomb','pod'] as const)for(const previous of [3,30]){
    const world=fixture();world.config.items=[kind];const item=world.items!.ground[0];item.kind=kind;
    if(kind==='bomb')item.expiresAt=1;else{item.armedAt=1;item.expiresAt=100;}
    world.players[0].stunnedUntil=previous;
    const replay=structuredClone(world);step(world,[]);step(replay,[]);assert.deepEqual(world,replay);
    assert.ok(world.events.some(e=>e.type==='blast'));
    const expected=Math.max(previous,1+(kind==='bomb'?12:6));
    assert.equal(world.players[0].stunnedUntil,expected,`${kind} after stun ending at ${previous}`);
  }
});

test('random pickups spawn on intact ground even when all outer tiles are gone or warned',async()=>{
  const {arenaTiles,tileAt}=await import('../shared/content/tiles.ts');
  for(const fallAt of [1,100]){
    const world=fixture();world.config.items=['shovel'];world.items={nextSpawn:1,serial:0,ground:[]};
    world.players[0].x=-1.5;world.players[1].x=1.5;for(const p of world.players)p.heldItem={id:`held-${p.id}`,kind:"shovel",expiresAt:999};
    world.tiles=Object.fromEntries(arenaTiles(10,2.2).filter(t=>t.id!=='core').map(t=>[t.id,{warnAt:0,fallAt}]));
    const replay=structuredClone(world);step(world,[]);step(replay,[]);assert.deepEqual(world,replay);
    assert.equal(world.items!.ground.length,1,'scheduled spawn must not be lost over a hole');
    assert.equal(tileAt(world,world.items!.ground[0].x,world.items!.ground[0].z),'core');
  }
});


test('spawn fallback terminates when random candidates miss safe ground or obstacles cover it',async()=>{
  const {arenaTiles}=await import('../shared/content/tiles.ts');const {stepItems}=await import('../shared/simulation/items.ts');
  for(const blocked of [false,true]){
    const world=fixture();world.activeTick=1;world.config.items=['shovel'];world.items={nextSpawn:1,serial:0,ground:[]};
    world.players[0].x=-1.5;world.players[1].x=1.5;
    world.tiles=Object.fromEntries(arenaTiles(10,2.2).filter(t=>t.id!=='core').map(t=>[t.id,{warnAt:0,fallAt:1}]));
    if(blocked)world.config.obstacles=[{id:"covered",x:0,z:0,halfX:20,halfZ:20}];
    let draws=0;stepItems(world,[],()=>{assert.ok(++draws<40,'spawning must use bounded attempts');return .5;},()=>{});
    assert.equal(world.items.ground.length,blocked?0:1);if(!blocked)assert.deepEqual([world.items.ground[0].x,world.items.ground[0].z],[0,0]);
    assert.ok(world.items.nextSpawn>world.activeTick);
  }
});

