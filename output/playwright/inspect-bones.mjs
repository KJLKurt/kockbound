import {readFile} from 'node:fs/promises';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {Vector3,PropertyBinding} from 'three';
import {ItemPose} from '../../client/rendering/item-pose.ts';
const b=await readFile('assets/runtime/character.sprout-prototype/r003/sprout-prototype.glb');
const a=await new GLTFLoader().parseAsync(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),'');
const p=new ItemPose(a.scene);
for(let f=0;f<90;f++){p.restore();p.apply(true,0,1,1/60);}
for(const n of ['chest','upper_arm.R','lower_arm.R','hand.R']) console.log(n,a.scene.getObjectByName(PropertyBinding.sanitizeNodeName(n)).getWorldPosition(new Vector3()).toArray());
