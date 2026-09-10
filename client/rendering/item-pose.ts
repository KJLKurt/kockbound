import * as THREE from 'three';

/** Reversible presentation layer, applied after the ordinary locomotion mixer. */
export class ItemPose {
  private bones:THREE.Object3D[];
  private saved:THREE.Quaternion[]=[];
  private weight=0;
  private model:THREE.Object3D;
  constructor(model:THREE.Object3D){
    this.model=model;
    this.bones=['chest','upper_arm.R','lower_arm.R','hand.R'].map(name=>{
      const bone=model.getObjectByName(THREE.PropertyBinding.sanitizeNodeName(name));
      if(!bone)throw new Error(`Character is missing item pose bone ${name}`);
      return bone;
    });
  }
  restore(){this.bones.forEach((bone,i)=>{if(this.saved[i])bone.quaternion.copy(this.saved[i]);});this.saved=[];}
  apply(enabled:boolean,dx:number,dz:number,dt:number){
    this.weight=THREE.MathUtils.damp(this.weight,enabled?1:0,16,dt);
    if(this.weight<.001)return;
    this.saved=this.bones.map(bone=>bone.quaternion.clone());
    const [chest,upper,lower,hand]=this.bones;
    const yaw=Math.atan2(dx,dz),difference=THREE.MathUtils.euclideanModulo(yaw-this.model.rotation.y+Math.PI,Math.PI*2)-Math.PI;
    const turn=THREE.MathUtils.clamp(difference,-Math.PI/3,Math.PI/3)*this.weight;
    const world=chest.getWorldQuaternion(new THREE.Quaternion());
    const parent=chest.parent!.getWorldQuaternion(new THREE.Quaternion());
    chest.quaternion.copy(parent.invert().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),turn)).multiply(world));
    // Keep the arm within a comfortable reach of the turned torso.
    const reachYaw=this.model.rotation.y+THREE.MathUtils.clamp(difference,-Math.PI*.48,Math.PI*.48);
    const forward=new THREE.Vector3(Math.sin(reachYaw),0,Math.cos(reachYaw));
    this.point(upper,lower,forward.clone().multiplyScalar(.7).add(new THREE.Vector3(0,-.7,0)));
    this.point(lower,hand,forward.clone().add(new THREE.Vector3(0,.15,0)));
  }
  private point(bone:THREE.Object3D,child:THREE.Object3D,direction:THREE.Vector3){
    const origin=bone.getWorldPosition(new THREE.Vector3()),current=child.getWorldPosition(new THREE.Vector3()).sub(origin).normalize();
    const world=bone.getWorldQuaternion(new THREE.Quaternion()),parent=bone.parent!.getWorldQuaternion(new THREE.Quaternion());
    const target=parent.invert().multiply(new THREE.Quaternion().setFromUnitVectors(current,direction.normalize())).multiply(world);
    bone.quaternion.slerp(target,this.weight);
  }
}
