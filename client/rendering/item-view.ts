import * as THREE from 'three';
import type {World} from '../../shared/game-types/index.ts';
import type {ItemId} from '../../shared/content/items.ts';
export class ItemView {
  private root=new THREE.Group();private objects=new Map<string,THREE.Group>();private projectiles=new Map<string,THREE.Group>();
  private shell=new THREE.SphereGeometry(.38,12,10);private collar=new THREE.CylinderGeometry(.12,.13,.12,10);private ring=new THREE.RingGeometry(3.3,3.5,48);
  private area=new THREE.CircleGeometry(3.3,48);
  private body=new THREE.MeshStandardMaterial({color:0x287e9e,roughness:.45,metalness:.25});private fuse=new THREE.MeshBasicMaterial({color:0xffd47b});
  private shaft=new THREE.BoxGeometry(.09,.85,.09);private blade=new THREE.BoxGeometry(.45,.34,.1);private gem=new THREE.OctahedronGeometry(.45);private dome=new THREE.SphereGeometry(.35,12,8,0,Math.PI*2,0,Math.PI/2);private rotor=new THREE.BoxGeometry(1.15,.035,.13);private orange=new THREE.MeshStandardMaterial({color:0xef9865,roughness:.6});
  private gustArc=new THREE.TorusGeometry(.8,.055,6,24,Math.PI*1.35);private crateBox=new THREE.BoxGeometry(.9,.9,.9);private crateBand=new THREE.BoxGeometry(.96,.12,.96);private stone=new THREE.DodecahedronGeometry(.8);private stoneMaterial=new THREE.MeshStandardMaterial({color:0x8c9caa,roughness:.92});private barrel=new THREE.CylinderGeometry(.18,.26,.7,12);private bubbleMaterial=new THREE.MeshStandardMaterial({color:0x7de4ef,emissive:0x237f99,emissiveIntensity:.3,roughness:.2});
  private shape(kind:ItemId){const group=new THREE.Group();
    if(kind==='pod'){group.add(new THREE.Mesh(this.shell,this.orange));for(let i=0;i<4;i++){const petal=new THREE.Mesh(this.gem,this.body);petal.scale.set(.35,.6,.35);petal.position.set(Math.cos(i*Math.PI/2)*.36,.1,Math.sin(i*Math.PI/2)*.36);group.add(petal);}}
    if(kind==='bomb')group.add(new THREE.Mesh(this.shell,this.body));
    if(kind==='shovel'){const shaft=new THREE.Mesh(this.shaft,this.fuse),blade=new THREE.Mesh(this.blade,this.body);blade.position.y=-.4;group.add(shaft,blade);group.rotation.z=-.3;}
    if(kind==='big'){group.add(new THREE.Mesh(this.gem,this.orange));const cap=new THREE.Mesh(this.collar,this.fuse);cap.position.y=.48;group.add(cap);}
    if(kind==='helicopter'){const dome=new THREE.Mesh(this.dome,this.body),rotor=new THREE.Mesh(this.rotor,this.fuse);rotor.name='rotor';rotor.position.y=.42;group.add(dome,rotor);}
    if(kind==='crate'){const box=new THREE.Mesh(this.crateBox,this.orange),band=new THREE.Mesh(this.crateBand,this.fuse),cross=new THREE.Mesh(this.crateBand,this.fuse);cross.rotation.z=Math.PI/2;group.add(box,band,cross);const gem=new THREE.Mesh(this.gem,this.body);gem.scale.setScalar(.25);gem.position.set(0,.56,0);group.add(gem);}
    if(kind==='remover'){const block=new THREE.Mesh(this.blade,this.orange);block.scale.set(1.7,1.7,3);const mark=new THREE.Mesh(this.shaft,this.fuse);mark.rotation.z=Math.PI/4;group.add(block,mark);}
    if(kind==='rock')group.add(new THREE.Mesh(this.stone,this.stoneMaterial));
    if(kind==='blaster'||kind==='wind'){const barrel=new THREE.Mesh(this.barrel,kind==='wind'?this.orange:this.body);barrel.rotation.x=Math.PI/2;const tank=new THREE.Mesh(this.shell,this.bubbleMaterial);tank.scale.setScalar(.6);tank.position.y=.25;group.add(barrel,tank);}
    return group;
  }
  constructor(scene:THREE.Scene){scene.add(this.root);}
  update(w:World,lobby:boolean,reduced=false){
    this.root.visible=!lobby;const visible=new Set<string>();
    const items=[...(w.items?.ground??[]).map(i=>({...i,y:i.thrown?.45+Math.sin(Math.max(0,20-(i.expiresAt-w.activeTick))/20*Math.PI)*1.6:.55})),...w.players.filter(p=>p.alive&&p.heldItem).map(p=>({...p.heldItem!,x:p.x+(p.heldItem!.kind==='helicopter'?0:p.facingZ*.55),z:p.z-(p.heldItem!.kind==='helicopter'?0:p.facingX*.55),y:p.heldItem!.kind==='helicopter'?2.05:1.1,thrown:false,armedAt:undefined}))];
    for(const item of items){visible.add(item.id);let object=this.objects.get(item.id);if(!object){object=new THREE.Group();object.add(this.shape(item.kind));const cap=new THREE.Mesh(this.collar,this.fuse);cap.position.y=.4;cap.visible=item.kind==='bomb';object.add(cap);const halo=new THREE.Mesh(this.ring,new THREE.MeshBasicMaterial({color:item.kind==='pod'?0xc53283:0xf16c43,transparent:true,opacity:.9,depthWrite:false,side:THREE.DoubleSide}));halo.rotation.x=-Math.PI/2;object.add(halo);const area=new THREE.Mesh(this.area,new THREE.MeshBasicMaterial({color:item.kind==='pod'?0xc53283:0xf16c43,transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide}));area.rotation.x=-Math.PI/2;object.add(area);this.objects.set(item.id,object);this.root.add(object);}
      object.position.set(item.x,item.y,item.z);const remaining=item.expiresAt-w.activeTick;object.children[0].visible=reduced||remaining>40||Math.floor(w.activeTick/3)%2===0;const halo=object.children[2];halo.position.y=.025-item.y;halo.visible=(item.kind==='bomb'&&remaining<=20)||(item.kind==='pod'&&item.armedAt!==undefined);const dangerScale=item.kind==='pod'?2.5/3.5:1;halo.scale.setScalar(dangerScale);object.children[3].scale.setScalar(dangerScale);const rotor=object.getObjectByName('rotor');if(rotor)rotor.rotation.y=reduced?0:w.activeTick*.5;object.children[3].position.y=.02-item.y;object.children[3].visible=halo.visible;
    }
    const shotIds=new Set<string>();
    for(const shot of w.items?.shots??[]){shotIds.add(shot.id);let object=this.projectiles.get(shot.id);if(!object){object=new THREE.Group();if(shot.kind==='rock')object.add(new THREE.Mesh(this.stone,this.stoneMaterial));else if(shot.kind==='blaster'){const bubble=new THREE.Mesh(this.shell,this.bubbleMaterial);bubble.scale.setScalar(.6);object.add(bubble);}else{for(let j=0;j<3;j++){const arc=new THREE.Mesh(this.gustArc,this.bubbleMaterial);arc.scale.setScalar(1-j*.15);arc.position.z=-j*.4;object.add(arc);}}this.projectiles.set(shot.id,object);this.root.add(object);}object.position.set(shot.x,shot.kind==='rock'?.8:.85,shot.z);object.rotation.y=Math.atan2(shot.dx,shot.dz);if(shot.kind==='rock')object.children[0].rotation.x=reduced?0:shot.distance/.8;}
    for(const [id,object]of this.projectiles)if(!shotIds.has(id)){this.root.remove(object);this.projectiles.delete(id);}
    for(const [id,object]of this.objects)if(!visible.has(id)){for(const i of [2,3])(object.children[i] as THREE.Mesh<THREE.BufferGeometry,THREE.MeshBasicMaterial>).material.dispose();this.root.remove(object);this.objects.delete(id);}
  }
}



