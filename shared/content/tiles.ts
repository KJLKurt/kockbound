import type {World} from '../game-types/index.ts';
export type Tile={id:string;inner:number;outer:number;start:number;end:number;x:number;z:number};
export type TileFall={warnAt:number;fallAt:number};
export const TILE_SECTORS=24,TILE_RINGS=4;
export function arenaTiles(radius:number,core:number):Tile[]{
 const tiles:Tile[]=[{id:'core',inner:0,outer:core,start:0,end:Math.PI*2,x:0,z:0}];
 for(let ring=0;ring<TILE_RINGS;ring++)for(let sector=0;sector<TILE_SECTORS;sector++){const inner=core+(radius-core)*ring/TILE_RINGS,outer=core+(radius-core)*(ring+1)/TILE_RINGS,start=sector/TILE_SECTORS*Math.PI*2,end=(sector+1)/TILE_SECTORS*Math.PI*2,mid=(start+end)/2;tiles.push({id:`tile-${ring}-${sector}`,inner,outer,start,end,x:Math.cos(mid)*(inner+outer)/2,z:Math.sin(mid)*(inner+outer)/2});}return tiles;
}
export function tileAt(w:World,x:number,z:number){const radius=Math.hypot(x,z),r=w.config.rules;if(radius>r.radius)return null;if(radius<=r.minimumRadius)return 'core';const ring=Math.min(3,Math.floor((radius-r.minimumRadius)/(r.radius-r.minimumRadius)*4)),angle=(Math.atan2(z,x)+Math.PI*2)%(Math.PI*2),sector=Math.min(23,Math.floor(angle/(Math.PI*2)*24));return `tile-${ring}-${sector}`;}
export function supported(w:World,x:number,z:number){const id=tileAt(w,x,z);return id!==null&&(!w.tiles?.[id]||w.activeTick<w.tiles[id].fallAt);}
export function warnTile(w:World,id:string,delay=20){if(id==='core'||w.tiles?.[id])return false;(w.tiles??={})[id]={warnAt:w.activeTick,fallAt:w.activeTick+delay};return true;}
export function shrinkTiles(w:World){for(const tile of arenaTiles(w.config.rules.radius,w.config.rules.minimumRadius))if(tile.outer>w.radius+.00001)warnTile(w,tile.id,20+(Number(tile.id.split('-')[2])%6)*2);}
export function rescuePoint(w:World,x:number,z:number){const safe=arenaTiles(w.config.rules.radius,w.config.rules.minimumRadius).filter(t=>!w.tiles?.[t.id]&&Math.hypot(t.x,t.z)<=w.radius-1.2);safe.sort((a,b)=>Math.hypot(a.x-x,a.z-z)-Math.hypot(b.x-x,b.z-z));return safe[0]??{x:0,z:0};}
