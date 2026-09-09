import * as THREE from 'three';
import {arenaTiles} from '../../shared/content/tiles.ts';
import type {World} from '../../shared/game-types/index.ts';
import {floorTexture} from './sky-ring.ts';
export class TileView{
 private root=new THREE.Group();private tiles=new Map<string,THREE.Mesh>();private key='';private time=0;
 private top=new THREE.MeshStandardMaterial({map:floorTexture(),roughness:.86});private warning=new THREE.MeshStandardMaterial({color:0xffc36e,emissive:0xf28536,emissiveIntensity:.35,roughness:.75});private side=new THREE.MeshStandardMaterial({color:0x50829a,roughness:.85});
 constructor(scene:THREE.Scene){scene.add(this.root);}
 update(w:World,lobby:boolean,reduced:boolean,dt:number){this.root.visible=!lobby;if(lobby)return;
  const key=`${w.config.matchId}:${w.config.rules.radius}:${w.config.rules.minimumRadius}`;
  if(key!==this.key){for(const tile of this.tiles.values())tile.geometry.dispose();this.tiles.clear();this.root.clear();this.key=key;this.time=w.activeTick*.05;
   for(const tile of arenaTiles(w.config.rules.radius,w.config.rules.minimumRadius)){
    const inset=tile.id==='core'?0:.002;tile.start+=inset;tile.end-=inset;tile.outer-=.008;if(tile.inner)tile.inner+=.008;
    const shape=new THREE.Shape();shape.moveTo(Math.cos(tile.start)*tile.outer,Math.sin(tile.start)*tile.outer);shape.absarc(0,0,tile.outer,tile.start,tile.end,false);
    if(tile.inner){shape.lineTo(Math.cos(tile.end)*tile.inner,Math.sin(tile.end)*tile.inner);shape.absarc(0,0,tile.inner,tile.end,tile.start,true);}shape.closePath();
    const geometry=new THREE.ExtrudeGeometry(shape,{depth:.85,bevelEnabled:false,curveSegments:tile.id==='core'?32:6});
    const positions=geometry.getAttribute('position'),uv=geometry.getAttribute('uv');for(let i=0;i<positions.count;i++)uv.setXY(i,(positions.getX(i)/w.config.rules.radius+1)/2,(1-positions.getY(i)/w.config.rules.radius)/2);uv.needsUpdate=true;
    geometry.rotateX(Math.PI/2);const mesh=new THREE.Mesh(geometry,[this.top,this.side]);mesh.receiveShadow=true;mesh.castShadow=true;this.root.add(mesh);this.tiles.set(tile.id,mesh);
   }
  }
  this.time=w.phase==='results'?this.time+dt:w.activeTick*.05;
  for(const [id,mesh]of this.tiles){const fall=w.tiles?.[id],gone=fall&&w.activeTick>=fall.fallAt,seconds=fall?Math.max(0,this.time-fall.fallAt*.05):0;
   mesh.visible=!gone||(!reduced&&seconds<1.5);mesh.position.y=gone?-8*seconds*seconds:0;
   mesh.material=[fall&&!gone?this.warning:this.top,this.side];
  }
  this.warning.emissiveIntensity=reduced?.35:.3+Math.sin(this.time*12)*.15;
 }
}
