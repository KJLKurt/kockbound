import * as THREE from 'three';

/** Original code-authored environment after the recovered Sky Ring concepts. Visuals never define support. */
export function floorTexture(){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;const ctx=canvas.getContext('2d')!;
  ctx.translate(512,512);ctx.fillStyle='#c5ddd9';ctx.fillRect(-512,-512,1024,1024);
  const sector=(inner:number,outer:number,a:number,b:number,color:string)=>{ctx.beginPath();ctx.arc(0,0,outer,a,b);ctx.arc(0,0,inner,b,a,true);ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#92b4b6';ctx.stroke();};
  for(let row=0;row<4;row++)for(let i=0;i<24;i++){
    const a=(i+(row%2)*.5)/24*Math.PI*2;
    sector(157+row*82,239+row*82,a+.003,a+Math.PI/12-.003,['#d8e8df','#cedfd8','#e3e9db','#cbdedb'][(i+row*3)%4]);
  }
  for(let i=0;i<32;i++){const a=i/32*Math.PI*2;sector(452,508,a+.003,a+Math.PI/16-.003,i%4===0?'#609bb4':i%2?'#eee1c5':'#dcd7c1');}
  ctx.strokeStyle='#d6b26f';ctx.lineWidth=7;for(const radius of [510,447,155]){ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.stroke();}
  ctx.fillStyle='#528da5';ctx.beginPath();ctx.arc(0,0,151,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#9bc5cb';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,133,0,Math.PI*2);ctx.stroke();
  // Flat crown inlay: a readable motif, without suggesting a physical obstacle.
  ctx.beginPath();ctx.moveTo(-84,35);ctx.lineTo(-100,-49);ctx.lineTo(-42,-16);ctx.lineTo(0,-80);ctx.lineTo(42,-16);ctx.lineTo(100,-49);ctx.lineTo(84,35);ctx.closePath();ctx.fillStyle='#f4cc76';ctx.fill();
  ctx.fillRect(-82,46,164,16);ctx.strokeStyle='#ffdfa0';ctx.lineWidth=4;ctx.stroke();
  for(const [x,y]of [[-100,-49],[0,-80],[100,-49]]){ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.fill();}
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
}
export function buildSkyRing(scene:THREE.Scene,arena:THREE.Group,clouds:THREE.Group){
  const mat=(color:number,roughness=.8,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
  const cream=mat(0xe9dfc2),stone=mat(0x7296a6),blue=mat(0x377899),gold=mat(0xd5a653,.42,.35),rock=mat(0x66899a);
  const mesh=(geometry:THREE.BufferGeometry,material:THREE.Material,x:number,y:number,z:number,parent:THREE.Object3D=arena)=>{const object=new THREE.Mesh(geometry,material);object.position.set(x,y,z);object.receiveShadow=true;parent.add(object);return object;};
  mesh(new THREE.CylinderGeometry(10,9.9,.5,96),cream,0,-.26,0);
  const top=mesh(new THREE.CircleGeometry(10,96),new THREE.MeshStandardMaterial({map:floorTexture(),roughness:.86}),0,.003,0);top.rotation.x=-Math.PI/2;
  mesh(new THREE.CylinderGeometry(9.85,9.2,.8,64),blue,0,-.9,0);
  mesh(new THREE.CylinderGeometry(9.25,8.4,.35,64),gold,0,-1.46,0);
  mesh(new THREE.CylinderGeometry(8.6,5.8,1.9,20),rock,0,-2.55,0);
  mesh(new THREE.CylinderGeometry(5.8,1.2,2.9,13),stone,0,-4.85,0);
  const shard=new THREE.ConeGeometry(1,3,5);
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2,r=7.2+(i%3)*.35;const object=mesh(shard,i%3?stone:rock,Math.sin(a)*r,-2.5-(i%4)*.45,Math.cos(a)*r);object.rotation.z=Math.PI;object.rotation.y=a;object.scale.set(.75+(i%3)*.25,1+(i%4)*.2,.8);}
  const rim=mesh(new THREE.TorusGeometry(9.96,.065,8,128),gold.clone(),0,.055,0);rim.rotation.x=-Math.PI/2;
  const warning=mesh(new THREE.RingGeometry(9.45,9.85,96),new THREE.MeshBasicMaterial({color:0xf17c51,transparent:true,opacity:.7,side:THREE.DoubleSide}),0,.012,0);warning.rotation.x=-Math.PI/2;warning.visible=false;
  for(let i=0;i<16;i++){const a=i/16*Math.PI*2;const trim=mesh(new THREE.BoxGeometry(.32,.6,.16),gold,Math.sin(a)*9.68,-.81,Math.cos(a)*9.68);trim.rotation.y=a;}
  // One instanced cloud batch keeps the soft background inexpensive.
  const cloudMesh=new THREE.InstancedMesh(new THREE.SphereGeometry(1,18,12),mat(0xeaf2ed,1),100),transform=new THREE.Object3D();
  for(let i=0;i<20;i++)for(let j=0;j<5;j++){
    const angle=i*2.39996,radius=24+(i%5)*5,scale=1+(i%3)*.5;
    transform.position.set(Math.cos(angle)*radius+(j-2)*1.4*scale,-9-(i%4)*2+Math.sin(j*2+i)*.6,Math.sin(angle)*radius+Math.cos(j+i)*.7);
    transform.scale.set(1.9*scale,(1.1+(j%2)*.4)*scale,1.6*scale);transform.updateMatrix();cloudMesh.setMatrixAt(i*5+j,transform.matrix);
  }
  clouds.add(cloudMesh);
  const scenery=new THREE.Group();scene.add(scenery);
  const waterCanvas=document.createElement('canvas');waterCanvas.width=64;waterCanvas.height=256;const waterPaint=waterCanvas.getContext('2d')!;
  waterPaint.fillStyle='#80dbed';waterPaint.fillRect(0,0,64,256);
  for(let i=0;i<9;i++){waterPaint.fillStyle=i%2?'#d6f5f5':'#a4e8ef';waterPaint.fillRect(i*8,0,2+i%3,256);}
  const fade=waterPaint.createLinearGradient(0,0,0,256);fade.addColorStop(0,'rgba(255,255,255,.9)');fade.addColorStop(.5,'rgba(255,255,255,.6)');fade.addColorStop(1,'rgba(255,255,255,0)');waterPaint.globalCompositeOperation='destination-in';waterPaint.fillStyle=fade;waterPaint.fillRect(0,0,64,256);
  const waterTexture=new THREE.CanvasTexture(waterCanvas);waterTexture.colorSpace=THREE.SRGBColorSpace;
  const water=new THREE.MeshStandardMaterial({map:waterTexture,roughness:.4,transparent:true,depthWrite:false,side:THREE.DoubleSide});const falls:THREE.Mesh[]=[];
  for(const [x,y,z,size]of [[-22,-5,-23,4],[24,-8,-29,5],[-33,-12,12,3],[35,-14,8,3]]){
    const island=new THREE.Group();island.position.set(x,y,z);scenery.add(island);
    const body=mesh(new THREE.ConeGeometry(size,size*2.5,7),stone,0,-size*1.25,0,island);body.rotation.z=Math.PI;
    mesh(new THREE.CylinderGeometry(size,size,.45,24),cream,0,0,0,island);
    mesh(new THREE.CylinderGeometry(size*.87,size*.87,.08,24),mat(0x8fb8a0),0,.27,0,island);
    for(const side of [-1,1]){mesh(new THREE.CylinderGeometry(.28,.4,3,8),cream,side*1.25,1.6,0,island);mesh(new THREE.SphereGeometry(.38,10,8),gold,side*1.25,3.3,0,island);}
    mesh(new THREE.BoxGeometry(3,.35,.6),blue,0,3.05,0,island);
    const fall=mesh(new THREE.PlaneGeometry(size*.36,size*3),water,0,-size*1.5,size*.95,island);falls.push(fall);
    for(let i=0;i<3;i++){const tree=mesh(new THREE.IcosahedronGeometry(.9,1),mat(i%2?0x5a9e83:0x74ad89),-size*.5+i*.8,.95,-size*.5,island);tree.scale.y=1.25;}
  }
  scene.add(arena,clouds);
  return {rim,warning,falls};
}
