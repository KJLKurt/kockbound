import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import validator from 'gltf-validator';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const revision=process.argv[2]??'r001'; assert.ok(['r001','r002','r003'].includes(revision));
const assetId=process.argv[3]??'character.sprout-prototype';
const evidenceName=process.argv[4]??(assetId==='character.sprout-prototype'?(revision==='r001'?'asset-pipeline':'asset-pipeline-r002'):'asset-pipeline-'+assetId.replaceAll('.','-'));
const evidence=path.join(root,'tests/evidence',evidenceName);
fs.mkdirSync(evidence,{recursive:true});
const dir=path.join(root,'assets/runtime',assetId,revision);
const bytes=fs.readFileSync(path.join(dir,'sprout-prototype.glb'));
const meta=JSON.parse(fs.readFileSync(path.join(dir,'asset.json')));
if((assetId==='character.sprout-prototype'&&revision==='r003')||(assetId==='character.lumi-prototype'&&revision==='r002'))assert.deepEqual(meta.clips,['dash','eliminated','emote_01','emote_02','falling','hit','idle','run','stunned','victory'],'Animation candidate requires the complete library');
const hash=b=>createHash('sha256').update(b).digest('hex');
assert.equal(hash(bytes),meta.glb_sha256,'Stale GLB metadata');
assert.equal(hash(fs.readFileSync(path.join(root,meta.source))),meta.source_sha256,'Source changed since export');
if(assetId==='character.sprout-prototype' && ['r002','r003'].includes(revision)) {
  const prior=JSON.parse(fs.readFileSync(path.join(root,'assets/runtime/character.sprout-prototype/r001/asset.json')));
  assert.deepEqual(meta.bones,prior.bones,'Refinement changed shared bind rig');
}
if(assetId==='character.lumi-prototype') {
  const prior=JSON.parse(fs.readFileSync(path.join(root,'assets/runtime/character.sprout-prototype/r002/asset.json')));
  assert.deepEqual(meta.bones,prior.bones,'Lumi variant changed shared bind rig');
}
const report=await validator.validateBytes(new Uint8Array(bytes),{uri:'sprout-prototype.glb',maxIssues:100});
fs.writeFileSync(path.join(evidence,'khronos-validation.json'),JSON.stringify(report,null,2)+'\n');
assert.equal(report.issues.numErrors,0,'Khronos validation errors');
assert.equal(report.issues.numWarnings,0,'Khronos validation warnings');
const load=buffer=>new GLTFLoader().parseAsync(buffer.buffer.slice(buffer.byteOffset,buffer.byteOffset+buffer.byteLength),'');
const gltf=await load(bytes);
assert.deepEqual(gltf.animations.map(a=>a.name).sort(),meta.clips);
gltf.scene.updateMatrixWorld(true);
const box=new THREE.Box3().setFromObject(gltf.scene,true);
for(let i=0;i<3;i++) {
  assert.ok(Math.abs(box.min.getComponent(i)-meta.bounds_runtime_rest[0][i])<.002,'Runtime min axis mismatch');
  assert.ok(Math.abs(box.max.getComponent(i)-meta.bounds_runtime_rest[1][i])<.002,'Runtime max axis mismatch');
}
const rootBone=gltf.scene.getObjectByName('root'); assert.ok(rootBone);
let primitives=0,triangles=0;
gltf.scene.traverse(o=>{if(o.isMesh){primitives++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3; assert.ok(o.isSkinnedMesh); assert.ok(o.geometry.attributes.color);}});
assert.equal(triangles,meta.triangles); assert.ok(primitives<=4);
for(const b of meta.bones) assert.ok(gltf.scene.getObjectByName(b.name.replaceAll('.','')), 'Missing bone '+b.name);
// Three PropertyBinding sanitizes dots in glTF node names; preserve original glTF names in metadata.
const mixer=new THREE.AnimationMixer(gltf.scene);
const animationEvidence=[];
const restRoot=rootBone.position.clone();
const restRotation=rootBone.quaternion.clone(),restScale=rootBone.scale.clone();
for(const clip of gltf.animations) {
  mixer.stopAllAction(); const action=mixer.clipAction(clip).play();
  const poses=[];
  for(const t of [0,clip.duration*.25,clip.duration*.5,clip.duration*.75,clip.duration]) {
    mixer.setTime(t); gltf.scene.updateMatrixWorld(true);
    const bound=new THREE.Box3().setFromObject(gltf.scene,true);
    assert.ok([...bound.min,...bound.max].every(Number.isFinite),'Nonfinite animated bounds');
    assert.ok(rootBone.position.distanceTo(restRoot)<1e-6,'Authoritative root motion');
    assert.ok(rootBone.quaternion.angleTo(restRotation)<1e-6&&rootBone.scale.distanceTo(restScale)<1e-6,'Root rotation/scale changed');
    const arm=gltf.scene.getObjectByName('upper_armL');
    poses.push({t,bounds:[bound.min.toArray(),bound.max.toArray()],armQuaternion:arm.quaternion.toArray()});
  }
  action.stop(); animationEvidence.push({clip:clip.name,duration:clip.duration,samples:poses});
}
const fixture=await load(fs.readFileSync(path.join(root,'tests/evidence/asset-pipeline/coordinate-fixture.glb')));
fixture.scene.updateMatrixWorld(true);
for(const [name,xyz] of Object.entries({forward:[0,0,1],up:[0,1,0],right:[1,0,0],ground:[0,0,0]})) {
  const pos=fixture.scene.getObjectByName(name).getWorldPosition(new THREE.Vector3());
  assert.ok(pos.distanceTo(new THREE.Vector3(...xyz))<1e-6,'Axis fixture '+name);
}
const cubeBox=new THREE.Box3().setFromObject(fixture.scene.getObjectByName('meter_cube'));
assert.ok(cubeBox.getSize(new THREE.Vector3()).distanceTo(new THREE.Vector3(1,1,1))<1e-6,'One metre cube');
const result={status:'PASS',node:process.version,three:THREE.REVISION,khronosErrors:report.issues.numErrors,khronosWarnings:report.issues.numWarnings,coordinateFixture:'PASS: metre cube and basis vectors',triangles,primitives,bounds:[box.min.toArray(),box.max.toArray()],animations:animationEvidence};
fs.writeFileSync(path.join(evidence,'loader-validation.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,animations:animationEvidence.map(a=>({clip:a.clip,duration:a.duration}))},null,2));
