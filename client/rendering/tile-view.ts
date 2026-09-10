import * as THREE from 'three';
import {arenaTiles} from '../../shared/content/tiles.ts';
import type {World} from '../../shared/game-types/index.ts';
import {floorTexture} from './sky-ring.ts';
import {TileBatch} from './tile-batch.ts';
export class TileView{
 private root=new THREE.Group();private tiles:string[]=[];private batches:TileBatch[]=[];private key='';private time=0;
 private top=new THREE.MeshStandardMaterial({map:floorTexture(),roughness:.86});private warning=new THREE.MeshStandardMaterial({color:0xffc36e,emissive:0xf28536,emissiveIntensity:.35,roughness:.75});private side=new THREE.MeshStandardMaterial({color:0x50829a,roughness:.85});
 constructor(scene:THREE.Scene){scene.add(this.root);}
 update(w:World,lobby:boolean,reduced:boolean,dt:number){this.root.visible=!lobby;if(lobby)return;
  const key=`${w.config.matchId}:${w.config.rules.radius}:${w.config.rules.minimumRadius}`;
  if(key!==this.key){for(const batch of this.batches)batch.dispose();this.tiles=[];this.root.clear();this.key=key;this.time=w.activeTick*.05;
   const parts:{id:string;geometry:THREE.BufferGeometry;materialIndex:number}[]=[];
   for(const tile of arenaTiles(w.config.rules.radius,w.config.rules.minimumRadius)){
    const inset=tile.id==='core'?0:.002;tile.start+=inset;tile.end-=inset;tile.outer-=.008;if(tile.inner)tile.inner+=.008;
    const shape=new THREE.Shape();shape.moveTo(Math.cos(tile.start)*tile.outer,Math.sin(tile.start)*tile.outer);shape.absarc(0,0,tile.outer,tile.start,tile.end,false);
    if(tile.inner){shape.lineTo(Math.cos(tile.end)*tile.inner,Math.sin(tile.end)*tile.inner);shape.absarc(0,0,tile.inner,tile.end,tile.start,true);}shape.closePath();
    const geometry=new THREE.ExtrudeGeometry(shape,{depth:.85,bevelEnabled:false,curveSegments:tile.id==='core'?32:6});
    const positions=geometry.getAttribute('position'),uv=geometry.getAttribute('uv');for(let i=0;i<positions.count;i++)uv.setXY(i,(positions.getX(i)/w.config.rules.radius+1)/2,(1-positions.getY(i)/w.config.rules.radius)/2);uv.needsUpdate=true;
    geometry.rotateX(Math.PI/2);parts.push({id:tile.id,geometry,materialIndex:0});this.tiles.push(tile.id);
   }
   this.batches=[new TileBatch(parts,this.top),new TileBatch(parts,this.warning),new TileBatch(parts.map(p=>({...p,materialIndex:1})),this.side)];
   for(const batch of this.batches)this.root.add(batch.mesh);for(const part of parts)part.geometry.dispose();
  }
  this.time=w.phase==='results'?this.time+dt:w.activeTick*.05;
  for(const id of this.tiles){const fall=w.tiles?.[id],gone=fall&&w.activeTick>=fall.fallAt,seconds=fall?Math.max(0,this.time-fall.fallAt*.05):0;
   const visible=!gone||(!reduced&&seconds<1.5),y=gone?-8*seconds*seconds:0,warning=!!fall&&!gone;
   this.batches[0].set(id,y,visible&&!warning);this.batches[1].set(id,y,visible&&warning);this.batches[2].set(id,y,visible);
  }
  this.warning.emissiveIntensity=reduced?.35:.3+Math.sin(this.time*12)*.15;
 }
}
