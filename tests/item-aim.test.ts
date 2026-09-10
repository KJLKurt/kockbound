import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cameraRelative} from '../client/input/camera-controls.ts';
import {localConfig,PROTOCOL_VERSION} from '../shared/content/arena.ts';
import {createMatch,step} from '../shared/simulation/index.ts';
import {parseClientMessage,parseServerMessage} from '../shared/protocol/messages.ts';
import type {ItemId} from '../shared/content/items.ts';
const command={participantId:'p1',sequence:1,x:0,z:0,dash:false,useItem:true};
function fixture(kind:ItemId){
 const config=localConfig(42,2);config.rules.countdownTicks=0;config.items=[kind];config.roster.forEach(p=>p.control='human');
 const w=createMatch(config);w.players[0].x=w.players[0].z=0;w.players[0].facingX=0;w.players[0].facingZ=-1;w.players[1].x=-7;w.players[1].z=0;
 w.items={nextSpawn:9999,serial:0,ground:[]};w.players[0].heldItem={id:'held',kind,expiresAt:500};return w;
}
test('stationary camera aim reaches every directed item without introducing movement',()=>{
 const aimed=cameraRelative(command,Math.PI/2,true);assert.equal(aimed.x,0);assert.equal(aimed.z,0);
 for(const kind of ['bomb','pod','remover','blaster','wind','rock'] as ItemId[]){
  const w=fixture(kind);step(w,[aimed]);const p=w.players[0];assert.equal(p.x,0,kind);assert.equal(p.z,0,kind);assert.equal(p.facingZ,-1,kind);
  if(kind==='bomb'){assert.equal(w.items!.ground[0].vx,6);assert.ok(Math.abs(w.items!.ground[0].vz)<1e-12);}
  else if(kind==='pod'){assert.equal(w.items!.ground[0].x,.8);assert.ok(Math.abs(w.items!.ground[0].z)<1e-12);}
  else if(kind==='remover'){assert.ok(w.events.some(e=>e.type==='tilewarning'&&e.x>=3&&Math.abs(e.z)<1e-12));}
  else {assert.equal(w.items!.shots![0].dx,1);assert.ok(Math.abs(w.items!.shots![0].dz)<1e-12);}
 }
});
test('camera aim remains forward while strafing; arena throw and plant honor the current turn',()=>{
 const aimed=cameraRelative({...command,x:1},0,true);const w=fixture('blaster');step(w,[aimed]);assert.ok(w.players[0].x>0);assert.equal(w.items!.shots![0].dx,0);assert.equal(w.items!.shots![0].dz,-1);
 for(const kind of ['bomb','pod'] as ItemId[]){const w=fixture(kind);step(w,[{...command,x:1}]);assert.ok(w.items!.ground[0].x>0);assert.equal(w.items!.ground[0].z,0);}
});
test('malformed aim cannot consume items, move players or advance accepted sequence',()=>{
 for(const aim of [null,{},[],{x:0,z:0},{x:2,z:0},{x:NaN,z:0},{x:0,z:Infinity},{x:1,z:0,target:'p2'}]){
  const input={...command,aim};assert.equal(parseClientMessage(JSON.stringify({type:'input',protocolVersion:PROTOCOL_VERSION,command:input})),null);
  const w=fixture('blaster');step(w,[input as any]);assert.equal(w.players[0].lastSequence,-1);assert.equal(w.items!.shots!.length,0);assert.equal(w.players[0].heldItem?.id,'held');
 }
 assert.ok(parseClientMessage(JSON.stringify({type:'input',protocolVersion:PROTOCOL_VERSION,command:{...command,aim:{x:.6,z:.8}}})));
});
test('replicated item bearing is validated, copied and cleared when returning to movement aim',()=>{
 const w=fixture('blaster'),input={...command,useItem:false,aim:{x:1,z:0}};step(w,[input]);
 assert.deepEqual(w.players[0].itemAim,{x:1,z:0});input.aim.x=-1;assert.equal(w.players[0].itemAim?.x,1);
 const snapshot=()=>JSON.stringify({type:'snapshot',protocolVersion:PROTOCOL_VERSION,contentReleaseId:w.config.contentReleaseId,roomPhase:'active',acknowledgedSequence:1,nextSequence:2,world:w,rewardsEnabled:false});
 assert.ok(parseServerMessage(snapshot()));w.players[0].itemAim={x:2,z:0};assert.equal(parseServerMessage(snapshot()),null);
 step(w,[{...command,sequence:2,useItem:false}]);assert.equal(w.players[0].itemAim,undefined);assert.ok(parseServerMessage(snapshot()));
});
