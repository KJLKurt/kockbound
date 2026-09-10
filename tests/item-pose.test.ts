import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {CHARACTERS} from '../shared/content/characters.ts';
import {ItemPose} from '../client/rendering/item-pose.ts';

test('all exported character rigs support item posing without cumulative changes to the animation base',async()=>{
  for(const definition of Object.values(CHARACTERS)){
    const bytes=await readFile(`assets/runtime/${definition.path}/sprout-prototype.glb`);
    const asset=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
    const pose=new ItemPose(asset.scene),base=new Map<string,number[]>();
    asset.scene.traverse(node=>base.set(node.uuid,node.quaternion.toArray()));
    for(let frame=0;frame<180;frame++){
      pose.restore();
      asset.scene.traverse(node=>assert.deepEqual(node.quaternion.toArray(),base.get(node.uuid)));
      pose.apply(frame<120,Math.sin(frame*.03),Math.cos(frame*.03),1/60);
      asset.scene.updateMatrixWorld(true);
      asset.scene.traverse(node=>assert.ok(node.matrixWorld.elements.every(Number.isFinite)));
    }
    pose.restore();asset.scene.traverse(node=>assert.deepEqual(node.quaternion.toArray(),base.get(node.uuid)));
  }
});
