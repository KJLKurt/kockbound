import * as THREE from 'three';

/** Share submissions for opaque item parts with the same geometry and material. */
export class ItemBatches {
  private root=new THREE.Group();
  private batches=new Map<string,THREE.InstancedMesh>();
  private overrideMaterial?:THREE.Material;
  constructor(scene:THREE.Scene,overrideMaterial?:THREE.Material){this.overrideMaterial=overrideMaterial;this.root.name=overrideMaterial?'item-occlusion-batches':'item-model-batches';scene.add(this.root);}
  update(models:readonly THREE.Object3D[],lobby:boolean){
    this.root.visible=!lobby;
    for(const batch of this.batches.values())batch.count=0;
    const collect=(object:THREE.Object3D)=>{
      if(!object.visible)return;
      if(object instanceof THREE.Mesh){
        if(Array.isArray(object.material))throw new Error('Item batches require one material per part.');
        const material=this.overrideMaterial??object.material;
        const key=object.geometry.uuid+':'+material.uuid;
        let batch=this.batches.get(key);
        if(!batch||batch.count===batch.instanceMatrix.count){
          const previous=batch;
          batch=new THREE.InstancedMesh(object.geometry,material,previous?previous.instanceMatrix.count*2:16);
          if(this.overrideMaterial)batch.renderOrder=20;
          batch.count=previous?.count??0;batch.frustumCulled=false;batch.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
          if(previous){batch.instanceMatrix.array.set(previous.instanceMatrix.array);this.root.remove(previous);previous.dispose();}
          this.batches.set(key,batch);this.root.add(batch);
        }
        batch.setMatrixAt(batch.count++,object.matrixWorld);
      }
      for(const child of object.children)collect(child);
    };
    for(const model of models){model.updateWorldMatrix(true,true);collect(model);model.visible=false;}
    for(const batch of this.batches.values()){batch.visible=batch.count>0;batch.instanceMatrix.needsUpdate=true;}
  }
}
