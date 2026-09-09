import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker,{GameRoom} from '../server/worker/index.ts';

function storageFixture(initial:unknown){
  let stored=structuredClone(initial),writes=0,ready:Promise<unknown>=Promise.resolve();
  const state={storage:{async get<T>(){return structuredClone(stored) as T;},async put(_key:string,value:unknown){stored=structuredClone(value);writes++;}},blockConcurrencyWhile<T>(callback:()=>Promise<T>){const task=callback();ready=task;return task;}};
  return {state,ready:()=>ready,stored:()=>stored,writes:()=>writes};
}
test('Worker restart cancels an unfinished persistent room exactly once and never recreates it',async()=>{
  const fixture=storageFixture({roomId:'ABC123',status:'unfinished'}),first=new GameRoom(fixture.state);await fixture.ready();
  assert.deepEqual(fixture.stored(),{roomId:'ABC123',status:'cancelled',reason:'Room cancelled after server restart'});
  assert.equal((await first.fetch(new Request('https://game.example/join',{method:'POST'}))).status,410);
  assert.equal((await first.fetch(new Request('https://game.example/create/ABC123',{method:'POST',body:'{"humanCount":4}'}))).status,409);
  const second=new GameRoom(fixture.state);await fixture.ready();
  assert.equal((await second.fetch(new Request('https://game.example/socket',{headers:{Upgrade:'websocket'}}))).status,410);assert.equal(fixture.writes(),1);
});
test('Worker restart preserves an existing terminal receipt without regranting or rewriting it',async()=>{
  const record={roomId:'ABC123',status:'finished',receipt:{status:'finished',rewardsEnabled:false}},fixture=storageFixture(record);
  new GameRoom(fixture.state);await fixture.ready();assert.deepEqual(fixture.stored(),record);assert.equal(fixture.writes(),0);
});
test('Worker routing fails closed before allocation for disabled rooms, foreign origins and hostile settings',async()=>{
  let allocations=0;
  const env={ENABLE_ROOMS:'false',ROOMS:{idFromName(){allocations++;return 'id';},get(){throw new Error('Unexpected room allocation');}},ASSETS:{async fetch(){return new Response('<body data-multiplayer="false">',{headers:{'Content-Type':'text/html'}});}}};
  const request=(body:string,origin='https://game.example')=>new Request('https://game.example/api/rooms',{method:'POST',headers:{Origin:origin},body});
  assert.equal((await worker.fetch(request('{"humanCount":4}'),env)).status,503);
  env.ENABLE_ROOMS='true';assert.equal((await worker.fetch(request('{"humanCount":4}','https://foreign.example'),env)).status,403);
  for(const body of ['null','[]','{','{"humanCount":13}','{"humanCount":4,"reward":999}','x'.repeat(1025)])assert.equal((await worker.fetch(request(body),env)).status,400);
  assert.equal(allocations,0);
  assert.match(await (await worker.fetch(new Request('https://game.example/'),env)).text(),/data-multiplayer="true"/);
});

