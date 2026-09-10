import * as THREE from 'three';
import {arenaTiles,removerTarget} from '../../shared/content/tiles.ts';
import type {World,Player} from '../../shared/game-types/index.ts';

export class RemoverPreview{
  private mesh=new THREE.Mesh(new THREE.BufferGeometry(),new THREE.MeshBasicMaterial({color:0x27dfed,transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false}));
  private key='';
  constructor(scene:THREE.Scene){this.mesh.name='remover-target-preview';this.mesh.position.y=.045;this.mesh.visible=false;scene.add(this.mesh);}
  update(world:World,player:Player|undefined,direction:{dx:number;dz:number},enabled:boolean){
    const ready=enabled&&player?.alive&&player.heldItem?.kind==='remover'&&player.heldItem.expiresAt>world.activeTick&&world.phase==='active'&&!world.result&&world.activeTick>=(player.stunnedUntil??0);
    const target=ready?removerTarget(world,player,direction):null;
    this.mesh.visible=!!target;if(!target)return;
    const key=`${world.config.rules.radius}:${world.config.rules.minimumRadius}:${target.id}`;
    if(key===this.key)return;this.key=key;
    const tile=arenaTiles(world.config.rules.radius,world.config.rules.minimumRadius).find(t=>t.id===target.id)!;
    const shape=new THREE.Shape(),inset=.015,start=tile.start+.006,end=tile.end-.006;
    shape.moveTo(Math.cos(start)*(tile.outer-inset),Math.sin(start)*(tile.outer-inset));
    shape.absarc(0,0,tile.outer-inset,start,end,false);
    shape.lineTo(Math.cos(end)*(tile.inner+inset),Math.sin(end)*(tile.inner+inset));
    shape.absarc(0,0,tile.inner+inset,end,start,true);shape.closePath();
    const geometry=new THREE.ShapeGeometry(shape,12).rotateX(Math.PI/2);
    this.mesh.geometry.dispose();this.mesh.geometry=geometry;
  }
}
