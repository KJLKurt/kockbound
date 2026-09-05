"""One reproducible Sprout-derived pipeline prototype. Run with pinned Blender, --background --factory-startup."""
import bpy, math, sys
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).parent))
ASSET = 'character.sprout-prototype'
SOURCE = ROOT / 'assets/source/blender' / ASSET
EVIDENCE = ROOT / 'tests/evidence/asset-pipeline'
SOURCE.mkdir(parents=True, exist_ok=True)
EVIDENCE.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for a in list(bpy.data.actions): bpy.data.actions.remove(a)
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.unit_settings.scale_length = 1
scene.render.fps = 30
runtime = bpy.data.collections.new('RUNTIME')
scene.collection.children.link(runtime)
studio = bpy.data.collections.new('STUDIO_DO_NOT_EXPORT')
scene.collection.children.link(studio)
CREAM='FFE4BB'; BLUE='2879CD'; CYAN='59D5EA'; CORAL='F37F9B'; NAVY='162D50'; WHITE='FFF7E8'
def rgba(h): return tuple(int(h[i:i+2],16)/255 for i in (0,2,4))+(1,)
def material(name, rough):
    m=bpy.data.materials.new(name); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Roughness'].default_value=rough
    v=m.node_tree.nodes.new('ShaderNodeVertexColor'); v.layer_name='Color'
    m.node_tree.links.new(v.outputs['Color'],p.inputs['Base Color'])
    return m
mat=material('knockbound_matte',.68); gloss=material('knockbound_eyes',.25)
parts=[]
def finish(o,name,color,bone, glossy=False):
    o.name=name
    bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    for c in list(o.users_collection): c.objects.unlink(o)
    runtime.objects.link(o)
    o.data.materials.append(gloss if glossy else mat)
    ca=o.data.color_attributes.new(name='Color',type='BYTE_COLOR',domain='CORNER')
    for d in ca.data: d.color_srgb=rgba(color)
    for p in o.data.polygons: p.use_smooth=True
    o.vertex_groups.new(name=bone).add(list(range(len(o.data.vertices))),1,'REPLACE')
    parts.append(o); return o
def ball(name,loc,scale,color,bone,seg=16,rings=10,rot=None,glossy=False):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=max(10,round(seg*.8)),ring_count=max(6,round(rings*.8)),location=loc)
    o=bpy.context.object; o.scale=scale
    if rot: o.rotation_euler=rot
    return finish(o,name,color,bone,glossy)
def limb(name,a,b,r,color,bone):
    a,b=Vector(a),Vector(b)
    o=ball(name,(a+b)/2,(r,r,(a-b).length/2+r*.45),color,bone)
    # Vertices have already been applied: rotate around segment center in data space.
    q=(b-a).to_track_quat('Z','Y'); center=(a+b)/2
    for v in o.data.vertices: v.co=center+q@(v.co-center)
    return o
def fin(name,base,tip,width,color,bone):
    a,b=Vector(base),Vector(tip); axis=(b-a).normalized()
    u=Vector((0,1,0)); v=axis.cross(u).normalized(); verts=[a]; faces=[]
    for j in range(1,7):
        t=j/7; w=width*math.sin(math.pi*t)**.75
        center=a.lerp(b,t)+Vector((0,.06*math.sin(math.pi*t),0))
        for i in range(10):
            ang=2*math.pi*i/10
            verts.append(center+v*(w*math.cos(ang))+u*(w*.32*math.sin(ang)))
    verts.append(b)
    for i in range(10): faces.append((0,1+i,1+(i+1)%10))
    for j in range(5):
        for i in range(10):
            a0=1+j*10+i; a1=1+j*10+(i+1)%10
            faces.append((a0,a0+10,a1+10,a1))
    for i in range(10): faces.append((51+i,61,51+(i+1)%10))
    mesh=bpy.data.meshes.new(name); mesh.from_pydata(verts,[],faces); mesh.update()
    o=bpy.data.objects.new(name,mesh); scene.collection.objects.link(o)
    bpy.context.view_layer.objects.active=o; o.select_set(True)
    finish(o,name,color,bone)
    # Recalculate face normals for procedural lofts.
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode='OBJECT')
    return o

# Compact, broad cheek silhouette; -Y is forward in Blender.
ball('hoodie',(0,0,.85),(.285,.205,.335),BLUE,'chest',24,14)
ball('hem',(0,0,.595),(.28,.203,.07),NAVY,'hips')
ball('hood',(0,.025,1.09),(.30,.235,.11),CYAN,'chest')
ball('head',(0,-.015,1.405),(.415,.305,.34),CREAM,'head',32,20)
ball('muzzle',(0,-.269,1.30),(.245,.085,.135),CREAM,'head',24,12)
for side,sign in [('L',1),('R',-1)]:
    x=lambda n: sign*n
    limb('shorts_'+side,(x(.16),0,.60),(x(.18),0,.45),.13,NAVY,'upper_leg.'+side)
    limb('shin_'+side,(x(.18),0,.45),(x(.20),0,.20),.092,CREAM,'lower_leg.'+side)
    ball('sole_'+side,(x(.20),-.065,.075),(.155,.237,.075),WHITE,'foot.'+side)
    ball('shoe_'+side,(x(.20),-.065,.16),(.15,.223,.11),BLUE,'foot.'+side)
    ball('toe_'+side,(x(.20),-.24,.135),(.137,.064,.068),WHITE,'foot.'+side)
    ball('strap_'+side,(x(.20),-.15,.243),(.122,.035,.018),CYAN,'foot.'+side,12,8)
    limb('sleeve_'+side,(x(.24),0,1.01),(x(.37),0,.87),.122,BLUE,'upper_arm.'+side)
    limb('forearm_'+side,(x(.37),0,.87),(x(.46),-.025,.72),.086,CREAM,'lower_arm.'+side)
    ball('cuff_'+side,(x(.45),-.02,.735),(.103,.10,.064),NAVY,'hand.'+side)
    ball('mitten_'+side,(x(.49),-.035,.64),(.132,.122,.14),WHITE,'hand.'+side)
    ball('thumb_'+side,(x(.39),-.11,.655),(.065,.063,.075),WHITE,'hand.'+side,12,8)
    # Three broad fanned gills, no borrowed rabbit ears.
    for i,(base,tip,w) in enumerate([
        ((x(.30),.015,1.55),(x(.52),.04,1.965),.122),
        ((x(.35),.025,1.46),(x(.685),.045,1.735),.119),
        ((x(.36),.04,1.36),(x(.70),.065,1.46),.104)]):
        fin('fin_'+side+str(i),base,tip,w,BLUE,'gill.'+side)
        # Front inset with broad coral color, keeps readable silhouette.
        aa=Vector(base).lerp(Vector(tip),.22); bb=Vector(base).lerp(Vector(tip),.89)
        aa.y-=.035; bb.y-=.035
        fin('fin_inset_'+side+str(i),aa,bb,w*.64,CORAL if i==0 else CYAN,'gill.'+side)
    ball('eye_rim_'+side,(x(.165),-.284,1.46),(.112,.038,.137),WHITE,'head',20,12)
    ball('eye_'+side,(x(.166),-.314,1.457),(.081,.039,.11),NAVY,'head',20,12,glossy=True)
    ball('iris_'+side,(x(.161),-.348,1.429),(.053,.012,.049),BLUE,'head',16,10,glossy=True)
    ball('pupil_'+side,(x(.165),-.354,1.46),(.048,.013,.071),NAVY,'head',16,10,glossy=True)
    ball('glint_'+side,(x(.165)-.021,-.367,1.502),(.023,.01,.028),WHITE,'head',12,8,glossy=True)
    ball('cheek_'+side,(x(.29),-.255,1.32),(.067,.023,.035),CORAL,'head',12,8)
    ball('brow_'+side,(x(.166),-.273,1.61),(.077,.022,.021),BLUE,'head',12,8,rot=(0,sign*-.14,0))
ball('smile',(0,-.343,1.287),(.126,.018,.063),NAVY,'head',24,12)
ball('tongue',(0,-.361,1.26),(.068,.009,.021),CORAL,'head',16,8)
ball('tooth',(0,-.363,1.322),(.054,.008,.014),WHITE,'head',12,8)
ball('nose',(0,-.361,1.368),(.033,.016,.015),CORAL,'head',12,8)
# Deliberate jersey chevron, part of base mesh rather than separate accessory.
limb('chevron_L',(-.082,-.198,.93),(0,-.22,.86),.022,WHITE,'chest')
limb('chevron_R',(0,-.22,.86),(.082,-.198,.93),.022,WHITE,'chest')
fin('tail',(0,.12,.62),(0,.66,.82),.15,CREAM,'tail')
fin('tail_tip',(0,.48,.74),(0,.72,.87),.085,CORAL,'tail')

# Shared provisional rig; side labels are character anatomical left/right.
rigdata=bpy.data.armatures.new('rig.knockbound_v1_prototype')
rig=bpy.data.objects.new('knockbound_rig',rigdata); runtime.objects.link(rig)
bpy.ops.object.select_all(action='DESELECT'); rig.select_set(True); bpy.context.view_layer.objects.active=rig
bpy.ops.object.mode_set(mode='EDIT')
def bone(name,head,tail,parent=None,deform=True):
    b=rigdata.edit_bones.new(name); b.head=head; b.tail=tail; b.use_deform=deform
    if parent: b.parent=rigdata.edit_bones[parent]
bone('root',(0,0,0),(0,0,.15),deform=False)
bone('hips',(0,0,.59),(0,0,.73),'root')
bone('spine',(0,0,.73),(0,0,.88),'hips')
bone('chest',(0,0,.88),(0,0,1.08),'spine')
bone('neck',(0,0,1.08),(0,0,1.19),'chest')
bone('head',(0,0,1.19),(0,0,1.61),'neck')
bone('tail',(0,.12,.62),(0,.66,.82),'hips')
for side,s in [('L',1),('R',-1)]:
    bone('upper_arm.'+side,(s*.24,0,1.01),(s*.37,0,.87),'chest')
    bone('lower_arm.'+side,(s*.37,0,.87),(s*.46,-.025,.72),'upper_arm.'+side)
    bone('hand.'+side,(s*.46,-.025,.72),(s*.49,-.035,.59),'lower_arm.'+side)
    bone('upper_leg.'+side,(s*.16,0,.60),(s*.18,0,.40),'hips')
    bone('lower_leg.'+side,(s*.18,0,.40),(s*.20,0,.16),'upper_leg.'+side)
    bone('foot.'+side,(s*.20,0,.16),(s*.20,-.23,.16),'lower_leg.'+side)
    bone('gill.'+side,(s*.31,.025,1.43),(s*.52,.04,1.85),'head')
socket_specs={
    'head':('head',(0,0,1.76)), 'face':('head',(0,-.39,1.43)),
    'back':('chest',(0,.235,.94)), 'chest':('chest',(0,-.23,.94)),
    'waist':('hips',(0,0,.62)), 'trail':('root',(0,.3,.15)), 'aura':('root',(0,0,0)),
}
for side,s in [('L',1),('R',-1)]:
    socket_specs['hand.'+side]=('hand.'+side,(s*.49,-.04,.64))
    socket_specs['foot.'+side]=('foot.'+side,(s*.20,0,.16))
    socket_specs['leg.'+side]=('upper_leg.'+side,(s*.18,0,.47))
for name,(parent,pos) in socket_specs.items():
    bone('socket.'+name,pos,Vector(pos)+Vector((0,0,.06)),parent,False)
bpy.ops.object.mode_set(mode='OBJECT')
rig.show_in_front=True; rig['rig_id']='rig.knockbound_v1_prototype'; rig['asset_id']=ASSET
bpy.ops.object.select_all(action='DESELECT')
for o in parts: o.select_set(True)
bpy.context.view_layer.objects.active=parts[0]; bpy.ops.object.join()
body=bpy.context.object; body.name='sprout_body'
mod=body.modifiers.new('Skin','ARMATURE'); mod.object=rig
rig.animation_data_create()
for pb in rig.pose.bones: pb.rotation_mode='XYZ'
def key(frame, pose):
    for pb in rig.pose.bones:
        pb.location=(0,0,0); pb.rotation_euler=(0,0,0); pb.scale=(1,1,1)
        if pb.name in pose:
            loc,rot=pose[pb.name]; pb.location=loc; pb.rotation_euler=rot
        if not pb.name.startswith('socket.'):
            pb.keyframe_insert(data_path='location',frame=frame)
            pb.keyframe_insert(data_path='rotation_euler',frame=frame)
def action(name,end,poses):
    a=bpy.data.actions.new(name); a.use_fake_user=True; rig.animation_data.action=a
    for frame,pose in poses: key(frame,pose)
    a['loop']=name in ('idle','run'); a['prototype']=True
    return a
idle=action('idle',60,[(1,{}),(16,{'head':((0,0,0),(.015,0,-.025)), 'tail':((0,0,0),(0,.08,0))}),(31,{'chest':((0,0,.012),(.018,0,0)), 'gill.L':((0,0,0),(0,.06,0)), 'gill.R':((0,0,0),(0,-.06,0))}),(46,{'head':((0,0,0),(-.01,0,.025))}),(61,{})])
runposes=[]
for frame,phase in [(1,0),(6,math.pi/2),(11,math.pi),(16,3*math.pi/2),(21,2*math.pi)]:
    p={'hips':((0,.025*(1-math.cos(2*phase)),0),(.07,0,0))}
    for side,s in [('L',1),('R',-1)]:
        v=math.cos(phase)*s
        p['upper_leg.'+side]=((0,0,0),(.42*v,0,0))
        p['lower_leg.'+side]=((0,0,0),(-.35*max(0,-v),0,0))
        p['upper_arm.'+side]=((0,0,0),(-.32*v,0,0))
        p['lower_arm.'+side]=((0,0,0),(.12,0,0))
    runposes.append((frame,p))
action('run',20,runposes)
action('dash',18,[(1,{}),(4,{'hips':((0,0,-.055),(.20,0,0)), 'head':((0,0,0),(-.14,0,0))}),(8,{'chest':((0,0,0),(.35,0,0)), 'head':((0,0,0),(-.25,0,0)), 'upper_arm.L':((0,0,0),(-.7,0,0)), 'upper_arm.R':((0,0,0),(-.7,0,0))}),(13,{'chest':((0,0,0),(.18,0,0))}),(19,{})])
rig.animation_data.action=idle; scene.frame_start=1; scene.frame_end=61; scene.frame_set(1)

# Non-exported studio with explicit camera, lighting and floor.
def studio_obj(o):
    for c in list(o.users_collection): c.objects.unlink(o)
    studio.objects.link(o); return o
bpy.ops.mesh.primitive_plane_add(size=200)
floor=studio_obj(bpy.context.object); floor.name='studio_floor'
m=bpy.data.materials.new('studio_floor'); m.diffuse_color=(.035,.065,.10,1); floor.data.materials.append(m)
world=scene.world; world.use_nodes=True; world.node_tree.nodes['Background'].inputs[0].default_value=(.13,.19,.27,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.45
def aim(o,target): o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
for name,pos,power,size in [('key',(-3,-4,6),650,4),('fill',(4,-2,3),450,3),('rim',(2,3,4),850,3)]:
    bpy.ops.object.light_add(type='AREA',location=pos); l=studio_obj(bpy.context.object); l.name=name; l.data.energy=power; l.data.shape='DISK'; l.data.size=size; aim(l,(0,0,1))
bpy.ops.object.camera_add(location=(3,-5,2.9)); cam=studio_obj(bpy.context.object); cam.name='review_camera'; aim(cam,(0,0,1)); cam.data.type='ORTHO'; cam.data.ortho_scale=2.65; scene.camera=cam
scene.render.engine='CYCLES'; scene.cycles.samples=24
scene.render.resolution_x=900; scene.render.resolution_y=900; scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX'
scene.render.image_settings.file_format='PNG'
bpy.ops.object.select_all(action='DESELECT'); body.select_set(True); bpy.context.view_layer.objects.active=body
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type=='VIEW_3D':
            area.spaces.active.region_3d.view_perspective='CAMERA'
            area.spaces.active.shading.type='MATERIAL'
            area.spaces.active.overlay.show_overlays=False
scene['pipeline_contract']='character-contract-v0.1'
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE/'sprout-prototype.blend'))
from export_character import export_character
export_character()
for label,pos,scale in [('hero',(3,-5,2.9),2.65),('front',(0,-5,1.1),2.35),('back',(0,5,1.9),2.5),('gameplay',(3,-5,6.8),2.9)]:
    cam.location=pos; aim(cam,(0,0,1)); cam.data.ortho_scale=scale
    scene.render.filepath=str(EVIDENCE/(label+'.png')); bpy.ops.render.render(write_still=True)
print('BUILD_COMPLETE', ASSET)
