import * as THREE from 'three';
import type {Shot,ShotKind} from '../../shared/content/items.ts';

/** The authoritative shot cap is64; each wind shot has three independently placed arcs. */
export class ProjectileView {
  private root=new THREE.Group();
  private batches:Record<ShotKind,THREE.InstancedMesh>;
  private transform=new THREE.Object3D();
  constructor(scene:THREE.Scene,geometry:{blaster:THREE.BufferGeometry;rock:THREE.BufferGeometry;wind:THREE.BufferGeometry},material:{blaster:THREE.Material;rock:THREE.Material;wind:THREE.Material}){
    this.batches=Object.fromEntries((['blaster','rock','wind'] as const).map(kind=>{
      const batch=new THREE.InstancedMesh(geometry[kind],material[kind],kind==='wind'?192:64);
      batch.name=`projectiles-${kind}`;batch.count=0;batch.visible=false;batch.frustumCulled=false;
      batch.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.root.add(batch);return [kind,batch];
    })) as Record<ShotKind,THREE.InstancedMesh>;
    scene.add(this.root);
  }
  update(shots:readonly Shot[],lobby:boolean,reduced:boolean){
    this.root.visible=!lobby;
    for(const batch of Object.values(this.batches))batch.count=0;
    for(const shot of shots){
      const batch=this.batches[shot.kind],yaw=Math.atan2(shot.dx,shot.dz);
      for(let arc=0;arc<(shot.kind==='wind'?3:1);arc++){
        const offset=shot.kind==='wind'?-.4*arc:0;
        this.transform.position.set(shot.x+Math.sin(yaw)*offset,shot.kind==='rock'?.8:.85,shot.z+Math.cos(yaw)*offset);
        this.transform.rotation.set(shot.kind==='rock'&&!reduced?shot.distance/.8:0,yaw,0,'YXZ');
        this.transform.scale.setScalar(shot.kind==='blaster'?.6:shot.kind==='wind'?1-arc*.15:1);
        this.transform.updateMatrix();batch.setMatrixAt(batch.count++,this.transform.matrix);
      }
    }
    for(const batch of Object.values(this.batches)){batch.visible=batch.count>0;batch.instanceMatrix.needsUpdate=true;}
  }
}
