import {BossView} from './boss-view.ts';
import {TEAM_COLORS,TEAM_NAMES} from '../../shared/content/party.ts';
import {CHARACTERS} from '../../shared/content/characters.ts';
import {applySkin,disposeSkin} from './character-skins.ts';
import {HazardView} from './hazard-view.ts';
import {TileView} from './tile-view.ts';
import { buildSkyRing } from './sky-ring.ts';
import { ImpactPulses, trailMaterial } from './effects.ts';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone } from 'three/addons/utils/SkeletonUtils.js';
import type { World } from '../../shared/game-types/index.ts';
import type {CameraMode} from '../input/camera-controls.ts';
import {ItemView,type HeldPose} from './item-view.ts';
import {ItemPose} from './item-pose.ts';
import {nearbyItem} from '../game/nearby-item.ts';
import {RemoverPreview} from './remover-preview.ts';
import {renderPixelRatio} from './render-resolution.ts';

type Avatar = {root:THREE.Group;model:THREE.Object3D;itemPose:ItemPose;hand:THREE.Object3D;head:THREE.Object3D;mixer:THREE.AnimationMixer;actions:Map<string,THREE.AnimationAction>;clip:string;ring:THREE.Mesh;trail:THREE.Group;label:HTMLDivElement;hitTime:number;dashTime:number;fallTime:number};
type Particle = {x:number;y:number;z:number;color:number;vx:number;vy:number;vz:number;life:number;maxLife:number};
export const COLORS = [0xffd17b,0x65d1ed,0xf2939c,0xb4cb85,0xc3a1e5,0xf9aa68,0x87d0af,0x8ebaff,0xe5bda1,0xee95c8,0xb4ceef,0xd6e08d];
export class ArenaView {
  renderer:THREE.WebGLRenderer;
  scene=new THREE.Scene();
  bossView=new BossView(this.scene);
  itemView=new ItemView(this.scene);
  tileView=new TileView(this.scene);
  removerPreview=new RemoverPreview(this.scene);
  hazardView=new HazardView(this.scene);
  impacts=new ImpactPulses(this.scene);
  ribbonMaterial=trailMaterial();ribbonGeometry=new THREE.PlaneGeometry(.6,2.2);
  camera=new THREE.PerspectiveCamera(38,1,.1,180);
  arena=new THREE.Group();
  stage=new THREE.Group();
  clouds=new THREE.Group();
  avatars:Avatar[]=[];
  templates=new Map<string,{scene:THREE.Group;animations:THREE.AnimationClip[]}>();
  particles:Particle[]=[];
  elapsed=0;
  emoteTime=0;emoteName='emote_01';
  reducedMotion=false;
  lobby=true;
  localParticipantId='p1';
  cameraMode:CameraMode='arena';cameraYaw=0;cameraPitch=-.08;
  width=0;height=0;
  private highQuality=true;
  profiling=false;timings={sceneCpuMilliseconds:0,submitCpuMilliseconds:0,matrixCpuMilliseconds:0};
  private cameraReady=false;private appearanceKey='';
  private rosterLook(w:World){return w.players.map(p=>p.id+':'+p.appearance+':'+(p.skin??'classic')+':'+p.teamId).join('|');}
  dustGeometry=new THREE.IcosahedronGeometry(.09,0);
  dustMaterials=[new THREE.MeshBasicMaterial({color:0xffde8d}),new THREE.MeshBasicMaterial({color:0xfffbdf}),new THREE.MeshBasicMaterial({color:0x8ce5e9})];
  dustBatches:THREE.InstancedMesh[]=[];
  private dustTransform=new THREE.Object3D();
  rim:THREE.Mesh;
  warningBand:THREE.Mesh;
  private aimGuide:THREE.Mesh;
  private pickupRing:THREE.Mesh<THREE.RingGeometry,THREE.MeshBasicMaterial>;
  constructor(canvas:HTMLCanvasElement) {
    this.renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
    this.scene.background=new THREE.Color(0x8ec3dd);this.scene.fog=new THREE.Fog(0x8ec3dd,45,110);
    this.scene.add(new THREE.HemisphereLight(0xf3fbff,0x567b94,1.3));
    const sun=new THREE.DirectionalLight(0xffefce,2.4);sun.position.set(-12,22,9);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-15;sun.shadow.camera.right=15;sun.shadow.camera.top=15;sun.shadow.camera.bottom=-15;sun.shadow.normalBias=.045;sun.shadow.bias=-.00015;sun.shadow.radius=4;this.scene.add(sun);
    const fill=new THREE.DirectionalLight(0x91dbf4,.7);fill.position.set(12,7,-10);this.scene.add(fill);
    const environment=buildSkyRing(this.scene,this.arena,this.clouds);this.rim=environment.rim;this.warningBand=environment.warning;this.scene.add(this.stage);
    const arrow=new THREE.Shape();arrow.moveTo(-.055,-.7);for(const [x,z]of [[.055,-.7],[.055,-2],[.2,-2],[0,-2.45],[-.2,-2],[-.055,-2]])arrow.lineTo(x,z);arrow.closePath();
    this.aimGuide=new THREE.Mesh(new THREE.ShapeGeometry(arrow).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({color:0x164b60,side:THREE.DoubleSide}));this.aimGuide.visible=false;this.scene.add(this.aimGuide);
    this.pickupRing=new THREE.Mesh(new THREE.RingGeometry(.6,.73,40),new THREE.MeshBasicMaterial({color:0x15566c,side:THREE.DoubleSide,depthWrite:false}));this.pickupRing.rotation.x=-Math.PI/2;this.pickupRing.visible=false;this.scene.add(this.pickupRing);
    this.dustBatches=this.dustMaterials.map(material=>{const batch=new THREE.InstancedMesh(this.dustGeometry,material,160);batch.count=0;batch.instanceMatrix.setUsage(THREE.DynamicDrawUsage);batch.frustumCulled=false;this.scene.add(batch);return batch;});
    this.resize();window.addEventListener('resize',()=>this.resize());
  }
  async load() {
    const loader=new GLTFLoader();
    for(const [id,path] of Object.entries(CHARACTERS).map(([id,c])=>[id,c.path])) {
      const gltf=await loader.loadAsync(new URL(`../../assets/runtime/${path}/sprout-prototype.glb`,import.meta.url).href);
      gltf.scene.traverse(o=>{if(o instanceof THREE.Mesh){o.castShadow=true;o.receiveShadow=true;}});
      this.templates.set(id,{scene:gltf.scene,animations:gltf.animations});
    }
  }
  resize(){this.width=innerWidth;this.height=innerHeight;this.renderer.setPixelRatio(renderPixelRatio(this.width,this.height,devicePixelRatio,this.highQuality));this.renderer.setSize(this.width,this.height);this.camera.aspect=this.width/this.height;this.camera.updateProjectionMatrix();}
  quality(high:boolean){this.highQuality=high;this.renderer.shadowMap.enabled=high;this.resize();}
  populate(w:World) {this.appearanceKey=this.rosterLook(w);
    this.impacts.clear();this.particles=[];for(const batch of this.dustBatches)batch.count=0;
    for(const a of this.avatars){disposeSkin(a.model);this.stage.remove(a.root);a.mixer.stopAllAction();a.mixer.uncacheRoot(a.model);a.label.remove();a.ring.geometry.dispose();(a.ring.material as THREE.Material).dispose();}
    this.avatars=[];
    for(const [i,p] of w.players.entries()){
      const template=this.templates.get(p.appearance)!;const model=clone(template.scene);applySkin(model,p.skin??'classic');const root=new THREE.Group();root.add(model);this.stage.add(root);
      const mixer=new THREE.AnimationMixer(model),actions=new Map<string,THREE.AnimationAction>();
      for(const clip of template.animations)actions.set(clip.name.toLowerCase(),mixer.clipAction(clip));
      const localIndex=w.players.findIndex(player=>player.id===this.localParticipantId);
      const ring=new THREE.Mesh(new THREE.RingGeometry(.51,.59,40),new THREE.MeshBasicMaterial({color:p.teamId===undefined?COLORS[i===localIndex?0:i===0?localIndex:i]:TEAM_COLORS[p.teamId],side:THREE.DoubleSide,transparent:true,opacity:.9}));ring.rotation.x=-Math.PI/2;ring.position.y=.025;root.add(ring);
      const trail=new THREE.Group(),ribbon=new THREE.Mesh(this.ribbonGeometry,this.ribbonMaterial);ribbon.rotation.x=-Math.PI/2;ribbon.position.set(0,.055,-1.1);trail.add(ribbon);trail.visible=false;root.add(trail);
      const label=document.createElement('div');label.className=`player-label${p.id===this.localParticipantId?' you':''}`;label.style.left=label.style.top='0';label.style.willChange='transform';label.textContent=(p.id===this.localParticipantId?'YOU':p.name)+(p.teamId===undefined?'':` · ${TEAM_NAMES[p.teamId]}`);document.querySelector('#labels')!.append(label);
      const hand=model.getObjectByName(THREE.PropertyBinding.sanitizeNodeName('socket.hand.R')),head=model.getObjectByName(THREE.PropertyBinding.sanitizeNodeName('socket.head'));
      if(!hand||!head)throw new Error('Character is missing the shared item sockets.');
      const avatar={root,model,itemPose:new ItemPose(model),hand,head,mixer,actions,clip:'',ring,trail,label,hitTime:0,dashTime:0,fallTime:0};this.avatars.push(avatar);this.animate(avatar,'idle');
    }
  }
  playEmote(name:'emote_01'|'emote_02'){if(!this.lobby)return;this.emoteName=name;this.emoteTime=this.avatars[0]?.actions.get(name)?.getClip().duration??0;if(this.avatars[0])this.avatars[0].clip='';}
  animate(a:Avatar,name:string){if(a.clip===name)return;const action=a.actions.get(name)??[...a.actions.entries()].find(([key])=>key.includes(name))?.[1];if(!action)return;for(const other of a.actions.values())if(other!==action)other.fadeOut(.12);action.setLoop(['idle','run','falling','stunned'].includes(name)?THREE.LoopRepeat:THREE.LoopOnce,Infinity);action.clampWhenFinished=true;action.timeScale=name==='dash'?2:1;action.reset().fadeIn(.1).play();a.clip=name;}
  events(w:World){for(const e of w.events){if(e.type==='skyimpact'){this.impacts.emit(e.x,e.z,true,this.reducedMotion);this.burst(e.x,e.z,30);}if(e.type==='crateopen')this.burst(e.x,e.z,25);if(e.type==='rescue')this.burst(e.x,e.z,30);if(e.type==='blast'){this.impacts.emit(e.x,e.z,true,this.reducedMotion);this.burst(e.x,e.z,40);}if(e.type==='hit'||e.type==='ringout'||e.type==='dash'){const i=w.players.findIndex(p=>p.id===(e.type==='dash'?e.source:e.target));if(i>=0){if(e.type==='hit')this.avatars[i].hitTime=.32;if(e.type==='dash')this.avatars[i].dashTime=.32;}if(e.type==='hit')this.impacts.emit(e.x,e.z,(e.strength??0)>8,this.reducedMotion);this.burst(e.x,e.z,e.type==='ringout'?24:e.type==='hit'?15:5);}}}
  burst(x:number,z:number,count:number){if(this.reducedMotion)count=Math.min(5,count);for(let i=0;i<count && this.particles.length<160;i++){const a=Math.random()*Math.PI*2;this.particles.push({x,y:.6,z,color:i%3,vx:Math.cos(a)*(1+Math.random()*3),vz:Math.sin(a)*(1+Math.random()*3),vy:2+Math.random()*4,life:.45+Math.random()*.4,maxLife:.85});}}
  render(w:World,previous:World,alpha:number,dt:number){
    const profileStart=this.profiling?performance.now():0;
    if(this.appearanceKey!==this.rosterLook(w))this.populate(w);
    this.elapsed+=dt;this.emoteTime=Math.max(0,this.emoteTime-dt);
    const compact=this.width<580, narrow=this.width<1000;
    const distance=Math.max(w.boss&&!this.lobby?33:29,25/this.camera.aspect);
    const desiredPosition=new THREE.Vector3(this.lobby&&!narrow?-9:0,this.lobby?18:distance*.76,this.lobby?24:distance*.9);
    const desiredTarget=new THREE.Vector3(this.lobby&&!narrow?-4.5:0,this.lobby?-1:0,0);
    if(w.boss&&!this.lobby)desiredTarget.set(0,1,-1.5);
    const owner=w.players.find(p=>p.id===this.localParticipantId),closeView=!this.lobby&&owner?.alive&&!w.result&&this.cameraMode!=='arena';
    this.removerPreview.update(w,owner,{dx:closeView?Math.sin(this.cameraYaw):owner?.facingX??0,dz:closeView?-Math.cos(this.cameraYaw):owner?.facingZ??-1},!this.lobby);
    const nearby=this.lobby?null:nearbyItem(w,this.localParticipantId);this.pickupRing.visible=!!nearby;
    if(nearby){this.pickupRing.position.set(nearby.item.x,.06,nearby.item.z);this.pickupRing.material.color.setHex(nearby.item.kind==='bomb'?0xc94e36:nearby.item.kind==='crate'?0x9e6928:0x15566c);}
    this.aimGuide.visible=!this.lobby&&!!owner?.alive&&!w.result&&!!owner.heldItem&&['bomb','pod','remover','blaster','wind','rock'].includes(owner.heldItem.kind);
    if(this.aimGuide.visible&&owner){const before=previous.players.find(p=>p.id===owner.id)??owner;this.aimGuide.position.set(THREE.MathUtils.lerp(before.x,owner.x,alpha),.06,THREE.MathUtils.lerp(before.z,owner.z,alpha));this.aimGuide.scale.setScalar(closeView?1.6:1);if(closeView){this.aimGuide.position.x+=Math.cos(this.cameraYaw)*.9;this.aimGuide.position.z+=Math.sin(this.cameraYaw)*.9;}this.aimGuide.rotation.y=closeView?-this.cameraYaw:Math.atan2(-owner.facingX,-owner.facingZ);}
    if(closeView&&owner){const before=previous.players.find(p=>p.id===owner.id)??owner,x=THREE.MathUtils.lerp(before.x,owner.x,alpha),z=THREE.MathUtils.lerp(before.z,owner.z,alpha),fx=Math.sin(this.cameraYaw),fz=-Math.cos(this.cameraYaw);
      if(this.cameraMode==='first'){const eye=owner.heldItem?.kind==='big'?2.4:1.65;desiredPosition.set(x,eye,z);desiredTarget.set(x+fx*8,eye+this.cameraPitch*8,z+fz*8);}
      else {desiredPosition.set(x-fx*6,4-this.cameraPitch*3,z-fz*6);desiredTarget.set(x+fx*1.5,1.1,z+fz*1.5);}
    }
    if(!this.cameraReady||closeView){this.camera.position.copy(desiredPosition);this.cameraReady=true;}else this.camera.position.lerp(desiredPosition,.1);this.camera.lookAt(desiredTarget);
    const fog=this.scene.fog as THREE.Fog;fog.near=Math.max(45,this.camera.position.distanceTo(desiredTarget)+12);fog.far=fog.near+65;
    this.camera.fov=this.lobby?38:closeView?this.cameraMode==='first'?75:64:42;this.camera.updateProjectionMatrix();
    this.arena.visible=this.lobby;this.arena.scale.setScalar(1);this.tileView.update(w,this.lobby,this.reducedMotion,dt);this.hazardView.update(w,this.lobby,this.reducedMotion);
    const warning=!w.boss&&w.phase==='active'&&w.activeTick>=w.config.rules.durationTicks-w.config.rules.suddenDeathTicks-40;
    (this.rim.material as THREE.MeshStandardMaterial).color.setHex(warning?0xf07f57:0xd9a857);
    this.warningBand.visible=warning;(this.warningBand.material as THREE.MeshBasicMaterial).opacity=this.reducedMotion?.65:.45+Math.sin(this.elapsed*7)*.15;
    this.clouds.rotation.y=this.reducedMotion?0:Math.sin(this.elapsed*.02)*.035;
    const heldPoses=new Map<string,HeldPose>();
    for(const [i,a] of this.avatars.entries()){
      const p=w.players[i],before=previous.players[i]??p;
      a.trail.visible=!this.lobby&&p.alive&&!this.reducedMotion&&(p.dashTicks>0||a.dashTime>.12);a.trail.rotation.y=Math.atan2(p.facingX,p.facingZ);a.trail.scale.z=Math.max(.2,Math.min(1,a.dashTime/.2));
      if(this.lobby){a.root.visible=i===0;a.label.hidden=true;a.root.position.set(compact?0:narrow?4:4.5,0,compact?0:1);a.model.scale.setScalar(compact?2.05:narrow?2.2:2.7);a.model.rotation.y=Math.sin(this.elapsed*.3)*.22+.2;a.model.rotation.z=0;this.animate(a,this.emoteTime>0?this.emoteName:'idle');a.ring.visible=false;}
      else {
        const size=p.heldItem?.kind==='big'?1.45:1;a.model.scale.setScalar(size);a.root.visible=true;a.ring.visible=p.alive;a.label.hidden=!p.alive;
        a.root.position.set(THREE.MathUtils.lerp(before.x,p.x,alpha),0,THREE.MathUtils.lerp(before.z,p.z,alpha));
        const standingAim=!!p.heldItem&&['bomb','pod','remover','blaster','wind','rock'].includes(p.heldItem.kind)&&Math.hypot(p.vx,p.vz)<.3&&p.dashTicks===0;const aimX=closeView&&p.id===this.localParticipantId?Math.sin(this.cameraYaw):p.itemAim?.x??p.facingX,aimZ=closeView&&p.id===this.localParticipantId?-Math.cos(this.cameraYaw):p.itemAim?.z??p.facingZ;const targetAngle=Math.atan2(standingAim?aimX:p.facingX,standingAim?aimZ:p.facingZ);let difference=targetAngle-a.model.rotation.y;difference=Math.atan2(Math.sin(difference),Math.cos(difference));a.model.rotation.y+=difference*Math.min(1,dt*18);
        a.fallTime=p.alive?0:a.fallTime+dt;
        const fall=a.fallTime;
        if(!p.alive){a.root.position.y=-fall*fall*8;a.model.rotation.z=fall*2;a.root.visible=fall<1.6;this.animate(a,fall<.85?'falling':'eliminated');}
        else {a.model.rotation.z=0;this.animate(a,(w.result?.winnerId===p.id||w.result?.winnerTeamId!==undefined&&w.result.winnerTeamId===p.teamId)?'victory':a.hitTime>0?'hit':p.dashTicks>0||a.dashTime>0?'dash':(w.activeTick<(p.stunnedUntil??0)||Math.hypot(p.ix,p.iz)>8)?'stunned':Math.hypot(p.vx,p.vz)>.3?'run':'idle');}
        if(a.hitTime>0){a.hitTime=Math.max(0,a.hitTime-dt);if(!this.reducedMotion)a.model.scale.set(size*(1+a.hitTime*.45),size*(1-a.hitTime*.45),size*(1+a.hitTime*.45));}
        if(p.alive&&w.activeTick<(p.flattenedUntil??0))a.model.scale.set(size*1.3,size*.4,size*1.3);
        const point=new THREE.Vector3(a.root.position.x,p.heldItem?.kind==='big'?3.15:2.25,a.root.position.z).project(this.camera);a.label.style.transform=`translate3d(${(point.x*.5+.5)*this.width}px,${(-point.y*.5+.5)*this.height}px,0) translate(-50%,-100%)`;
        if(point.z>1||point.z< -1)a.label.hidden=true;
        if(closeView&&this.cameraMode==='first'&&p.id===this.localParticipantId){a.root.visible=false;a.label.hidden=true;}
      }
      a.dashTime=Math.max(0,a.dashTime-dt);a.itemPose.restore();a.mixer.update(dt);
      const poseAim=closeView&&p.id===this.localParticipantId;
      a.itemPose.apply(!this.lobby&&p.alive&&!w.result&&['idle','run'].includes(a.clip)&&!!p.heldItem&&['bomb','pod','remover','blaster','wind','rock'].includes(p.heldItem.kind),poseAim?Math.sin(this.cameraYaw):p.itemAim?.x??p.facingX,poseAim?-Math.cos(this.cameraYaw):p.itemAim?.z??p.facingZ,dt);
      if(!this.lobby&&p.alive&&p.heldItem){
        const hat=p.heldItem.kind==='helicopter',localAim=closeView&&p.id===this.localParticipantId;
        const dx=localAim?Math.sin(this.cameraYaw):p.itemAim?.x??p.facingX,dz=localAim?-Math.cos(this.cameraYaw):p.itemAim?.z??p.facingZ;
        const point=(hat?a.head:a.hand).getWorldPosition(new THREE.Vector3());
        const pose:HeldPose={x:point.x+(hat?0:dx*.14),y:point.y+(hat?.1:.14),z:point.z+(hat?0:dz*.14),yaw:Math.atan2(dx,dz),scale:hat?1:p.heldItem.kind==='rock'?.45:.8};
        pose.revealOccluded=localAim&&this.cameraMode==='third'&&['bomb','pod','remover','blaster','wind','rock'].includes(p.heldItem.kind);
        if(localAim&&this.cameraMode==='first'&&!hat){pose.x=a.root.position.x+Math.cos(this.cameraYaw)*.14+dx*.85;pose.z=a.root.position.z+Math.sin(this.cameraYaw)*.14+dz*.85;pose.y=1.4;pose.scale!*=.36;}
        heldPoses.set(p.heldItem.id,pose);
      }
    }
    this.bossView.update(w,previous,alpha,this.lobby,this.reducedMotion,this.elapsed);
    this.itemView.update(w,this.lobby,this.reducedMotion,heldPoses,this.elapsed,previous,alpha);
    for(let i=this.particles.length-1;i>=0;i--){const p=this.particles[i];p.life-=dt;if(p.life<=0){this.particles.splice(i,1);continue;}p.vy-=dt*10;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;}
    for(const batch of this.dustBatches)batch.count=0;
    for(const p of this.particles){this.dustTransform.position.set(p.x,p.y,p.z);this.dustTransform.scale.setScalar(Math.min(1,p.life*4));this.dustTransform.updateMatrix();const batch=this.dustBatches[p.color];batch.setMatrixAt(batch.count++,this.dustTransform.matrix);}
    for(const batch of this.dustBatches)batch.instanceMatrix.needsUpdate=true;
    this.impacts.update(dt,this.reducedMotion);const submitStart=this.profiling?performance.now():0;
    if(this.profiling){
      const auto=this.scene.matrixWorldAutoUpdate;
      if(auto)this.scene.updateMatrixWorld();
      this.timings.matrixCpuMilliseconds=performance.now()-submitStart;
      this.scene.matrixWorldAutoUpdate=false;
      try{this.renderer.render(this.scene,this.camera);}finally{this.scene.matrixWorldAutoUpdate=auto;}
    }else this.renderer.render(this.scene,this.camera);
    if(this.profiling){this.timings.sceneCpuMilliseconds=submitStart-profileStart;this.timings.submitCpuMilliseconds=performance.now()-submitStart;}
  }
}










