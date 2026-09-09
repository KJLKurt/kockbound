import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cameraRelative} from '../client/input/camera-controls.ts';
test('camera-relative controls preserve input identity, speed and dash while rotating movement',()=>{
  const forward={participantId:'p2',sequence:17,x:0,z:-1,dash:true};
  const east=cameraRelative(forward,Math.PI/2);assert.ok(Math.abs(east.x-1)<1e-12);assert.ok(Math.abs(east.z)<1e-12);assert.equal(east.sequence,17);assert.equal(east.dash,true);assert.equal(east.participantId,'p2');
  for(let yaw=-6;yaw<=6;yaw+=.1){const analog={...forward,x:.3,z:-.4};const result=cameraRelative(analog,yaw);assert.ok(Math.abs(Math.hypot(result.x,result.z)-.5)<1e-12);}
  assert.deepEqual(cameraRelative(forward,0),forward);assert.deepEqual(cameraRelative({...forward,x:0,z:0},1),{...forward,x:0,z:0});
});
