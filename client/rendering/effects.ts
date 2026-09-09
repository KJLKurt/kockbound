import * as THREE from 'three';

export function trailMaterial(){
  const canvas=document.createElement('canvas');canvas.width=64;canvas.height=256;const ctx=canvas.getContext('2d')!;
  const fade=ctx.createLinearGradient(0,0,0,256);fade.addColorStop(0,'rgba(130,224,246,0)');fade.addColorStop(.7,'rgba(130,224,246,.5)');fade.addColorStop(1,'rgba(255,245,201,.9)');
  ctx.fillStyle=fade;ctx.beginPath();ctx.moveTo(32,0);ctx.quadraticCurveTo(18,110,2,256);ctx.lineTo(62,256);ctx.quadraticCurveTo(46,110,32,0);ctx.fill();
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:THREE.DoubleSide,opacity:.7});
}

type Pulse={mesh:THREE.Mesh<THREE.RingGeometry,THREE.MeshBasicMaterial>;age:number;duration:number;size:number};
export class ImpactPulses {
  private scene:THREE.Scene;private geometry=new THREE.RingGeometry(.72,1,32);private pulses:Pulse[]=[];
  constructor(scene:THREE.Scene){this.scene=scene;}
  emit(x:number,z:number,strong:boolean,reduced:boolean){
    if(this.pulses.length>=16)this.remove(0);
    const mesh=new THREE.Mesh(this.geometry,new THREE.MeshBasicMaterial({color:strong?0xffcf76:0xe9fbef,transparent:true,opacity:.8,depthWrite:false,side:THREE.DoubleSide}));
    mesh.rotation.x=-Math.PI/2;mesh.position.set(x,.09,z);mesh.scale.setScalar(.2);this.scene.add(mesh);this.pulses.push({mesh,age:0,duration:reduced?.14:.28,size:strong?1:.7});
  }
  update(dt:number,reduced:boolean){for(let i=this.pulses.length-1;i>=0;i--){const pulse=this.pulses[i];pulse.age+=dt;const phase=pulse.age/pulse.duration;if(phase>=1){this.remove(i);continue;}pulse.mesh.scale.setScalar(pulse.size*(reduced?.65:.2+.8*phase));pulse.mesh.material.opacity=.75*(1-phase);}}
  private remove(index:number){const [pulse]=this.pulses.splice(index,1);this.scene.remove(pulse.mesh);pulse.mesh.material.dispose();}
  clear(){while(this.pulses.length)this.remove(0);}
  count(){return this.pulses.length;}
}
