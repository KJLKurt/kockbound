import * as THREE from 'three';
import {BOSS_RUNES,BOSS_TARGET} from '../../shared/content/party.ts';
import type {World} from '../../shared/game-types/index.ts';

/** Original procedural Cloud King: presentation only; floor geometry never defines collision. */
export class BossView{
  root=new THREE.Group();king=new THREE.Group();core=new THREE.Group();
  runes:THREE.Mesh<THREE.CylinderGeometry,THREE.MeshStandardMaterial>[]=[];
  warnings:THREE.Mesh<THREE.BufferGeometry,THREE.MeshBasicMaterial>[]=[];
  circle=new THREE.CircleGeometry(1,40);lane=new THREE.PlaneGeometry(1,1);
  rocks:THREE.Mesh[]=[];
  hands:THREE.Group[]=[];chest:THREE.Mesh;portal:THREE.Mesh;
  constructor(scene:THREE.Scene){
    scene.add(this.root);this.root.add(this.king,this.core);this.king.position.set(0,.5,-10.2);
    const cloud=new THREE.MeshStandardMaterial({color:0xeaf6fc,roughness:.9}),shade=new THREE.MeshStandardMaterial({color:0xb3d0e4,roughness:.8}),gold=new THREE.MeshStandardMaterial({color:0xe8b954,metalness:.45,roughness:.3}),face=new THREE.MeshStandardMaterial({color:0x214b70,roughness:.7}),glow=new THREE.MeshStandardMaterial({color:0x8bffff,emissive:0x39cfe3,emissiveIntensity:1.4});
    const sphere=new THREE.SphereGeometry(1,16,12);
    const rockGeometry=new THREE.IcosahedronGeometry(.75,0);for(let i=0;i<3;i++){const rock=new THREE.Mesh(rockGeometry,shade);rock.castShadow=true;this.root.add(rock);this.rocks.push(rock);}
    const orb=(parent:THREE.Group,x:number,y:number,z:number,sx:number,sy:number,sz:number,material:THREE.Material)=>{const m=new THREE.Mesh(sphere,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;parent.add(m);return m;};
    orb(this.king,0,2,0,2.4,2,1.3,shade);
    for(let i=0;i<9;i++){const a=i/9*Math.PI*2;orb(this.king,Math.cos(a)*1.6,1+Math.sin(a)*.7,.25,.9,.85,.8,cloud);}
    orb(this.king,0,4.4,.2,1.7,1.45,1.1,cloud);orb(this.king,0,4.35,1.05,1.18,.85,.3,face);
    for(const side of [-1,1]){
      const eye=orb(this.king,side*.46,4.52,1.34,.25,.12,.07,glow);eye.rotation.z=side*.18;
      const hand=new THREE.Group();hand.position.set(side*3,2.2,.2);this.hands.push(hand);this.king.add(hand);
      orb(hand,0,0,0,1,.85,.9,shade);for(let i=0;i<3;i++)orb(hand,(i-1)*.4,-.2,.7,.27,.4,.3,cloud);
      const cuff=new THREE.Mesh(new THREE.TorusGeometry(.75,.16,8,24),gold);cuff.rotation.x=Math.PI/2;cuff.position.y=.55;hand.add(cuff);
    }
    for(let i=0;i<5;i++)orb(this.king,(i-2)*.44,3.5-Math.abs(i-2)*.12,1.05,.5,.6,.42,cloud);
    const crown=new THREE.Mesh(new THREE.CylinderGeometry(1.45,1.2,.5,8),gold);crown.position.y=5.5;this.king.add(crown);
    for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const tip=new THREE.Mesh(new THREE.ConeGeometry(.33,1,4),gold);tip.position.set(Math.cos(a)*1.2,6,Math.sin(a)*1.2);this.king.add(tip);}
    this.chest=new THREE.Mesh(new THREE.OctahedronGeometry(.65),new THREE.MeshStandardMaterial({color:0xe593fa,emissive:0x9939c9,emissiveIntensity:.7,metalness:.35,roughness:.2}));this.chest.position.set(0,2.4,1.4);this.king.add(this.chest);
    const frame=new THREE.Mesh(new THREE.TorusGeometry(.84,.14,8,32),gold);frame.position.copy(this.chest.position);this.king.add(frame);
    const ball=new THREE.Mesh(new THREE.IcosahedronGeometry(.55,1),glow);this.core.add(ball);const orbit=new THREE.Mesh(new THREE.TorusGeometry(.72,.055,8,32),gold);orbit.rotation.x=.65;this.core.add(orbit);
    BOSS_RUNES.forEach((r,i)=>{const mat=new THREE.MeshStandardMaterial({color:0xe8bd67,emissive:0x98611b,emissiveIntensity:.2});const pad=new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.1,.14,6),mat);pad.position.set(r.x,.12,r.z);this.root.add(pad);this.runes.push(pad);
      for(let n=0;n<=i;n++){const pip=new THREE.Mesh(new THREE.SphereGeometry(.1,8,6),glow);pip.position.set(r.x+(n-i/2)*.3,.25,r.z);this.root.add(pip);}
    });
    this.portal=new THREE.Mesh(new THREE.TorusGeometry(1.3,.13,8,40),gold);this.portal.rotation.x=-Math.PI/2;this.portal.position.set(BOSS_TARGET.x,.19,BOSS_TARGET.z);this.root.add(this.portal);
    for(let i=0;i<3;i++){const m=new THREE.Mesh<THREE.BufferGeometry,THREE.MeshBasicMaterial>(this.circle,new THREE.MeshBasicMaterial({color:0xe9664f,transparent:true,opacity:.5,depthWrite:false,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.y=.21;this.root.add(m);this.warnings.push(m);}
  }
  update(w:World,previous:World,alpha:number,lobby:boolean,reduced:boolean,time:number){
    const b=w.boss;this.root.visible=!!b&&!lobby;if(!b)return;
    const exposed=b.stage==='exposed';this.core.visible=exposed;
    const prior=previous.boss?.stage==='exposed'?previous.boss.core:b.core;
    const interpolate=Math.hypot(prior.x-b.core.x,prior.z-b.core.z)<3;
    this.core.position.set(interpolate?THREE.MathUtils.lerp(prior.x,b.core.x,alpha):b.core.x,.75,interpolate?THREE.MathUtils.lerp(prior.z,b.core.z,alpha):b.core.z);
    this.core.rotation.y=reduced?0:time;
    this.runes.forEach((r,i)=>{r.material.color.setHex(b.switches[i]===20?0x68dcca:0xe8bd67);r.material.emissiveIntensity=.2+b.switches[i]/20*.8;});
    (this.chest.material as THREE.MeshStandardMaterial).emissiveIntensity=exposed?2:.4;this.chest.rotation.y=reduced?0:time*.6;
    this.portal.visible=exposed;
    this.king.position.y=b.stage==='won'?-.8:.5+(reduced?0:Math.sin(time*1.4)*.1);
    this.king.rotation.z=b.stage==='recover'&&!reduced?Math.sin(time*12)*.035:0;
    this.hands.forEach((h,i)=>{h.position.y=b.attack?3.1:2.2;h.rotation.z=b.attack?(i?-.25:.25):0;});
    this.rocks.forEach((rock,i)=>{const mark=b.attack?.marks[i];rock.visible=!!mark&&b.attack?.kind==='boulder';if(mark&&b.attack){rock.position.set(mark.x,.7+Math.min(1,Math.max(0,(b.attack.at-w.activeTick-alpha)/16))*9,mark.z);rock.rotation.set(reduced?0:time*.7,reduced?0:time,0);}});
    this.warnings.forEach((m,i)=>{const mark=b.attack?.marks[i];m.visible=!!mark;if(mark&&b.attack){m.position.set(mark.x,.21,mark.z);m.geometry=b.attack.kind==='sweep'?this.lane:this.circle;m.scale.set(b.attack.kind==='sweep'?2.6:2,b.attack.kind==='sweep'?16:2,1);m.material.opacity=reduced?.5:.35+.2*Math.sin(time*8);}});
  }
}
