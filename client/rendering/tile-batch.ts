import * as THREE from 'three';

/** One material draw with independently movable tile ranges. No simulation state. */
export class TileBatch {
  readonly mesh:THREE.Mesh;
  private ranges=new Map<string,{start:number;end:number;y:number;visible:boolean}>();
  private base:Float32Array;
  private positions:THREE.BufferAttribute;
  private visibleCount=0;
  constructor(parts:{id:string;geometry:THREE.BufferGeometry;materialIndex:number}[],material:THREE.Material){
    const values={position:[] as number[],normal:[] as number[],uv:[] as number[]};
    for(const {id,geometry,materialIndex} of parts){
      const start=values.position.length/3;
      for(const group of geometry.groups.filter(g=>g.materialIndex===materialIndex)){
        for(let i=group.start;i<group.start+group.count;i++){
          const vertex=geometry.index?geometry.index.getX(i):i;
          for(const name of ['position','normal','uv'] as const){
            const attribute=geometry.getAttribute(name);
            values[name].push(attribute.getX(vertex),attribute.getY(vertex));
            if(name!=='uv')values[name].push(attribute.getZ(vertex));
          }
        }
      }
      this.ranges.set(id,{start,end:values.position.length/3,y:0,visible:true});
      this.visibleCount++;
    }
    const geometry=new THREE.BufferGeometry();
    for(const name of ['position','normal','uv'] as const)geometry.setAttribute(name,new THREE.Float32BufferAttribute(values[name],name==='uv'?2:3));
    this.positions=geometry.getAttribute('position') as THREE.BufferAttribute;
    this.positions.setUsage(THREE.DynamicDrawUsage);this.base=new Float32Array(this.positions.array);
    this.mesh=new THREE.Mesh(geometry,material);this.mesh.castShadow=this.mesh.receiveShadow=true;
    // Falling ranges leave the original bounds. Hidden triangles are degenerate.
    this.mesh.frustumCulled=false;
  }
  set(id:string,y:number,visible:boolean){
    const range=this.ranges.get(id);if(!range||range.visible===visible&&(!visible||range.y===y))return;
    if(range.visible!==visible)this.visibleCount+=visible?1:-1;
    this.mesh.visible=this.visibleCount>0;range.y=y;range.visible=visible;
    for(let i=range.start;i<range.end;i++)this.positions.setXYZ(i,visible?this.base[i*3]:0,visible?this.base[i*3+1]+y:0,visible?this.base[i*3+2]:0);
    // Pinned Three merges adjacent ranges and clears them after GPU upload.
    this.positions.addUpdateRange(range.start*3,(range.end-range.start)*3);
    this.positions.needsUpdate=true;
  }
  dispose(){this.mesh.geometry.dispose();}
}
