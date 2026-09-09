"""Original compatible Pebble/Wisp candidates; never overwrites Sprout/Lumi sources."""
import bpy, math, sys
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2];sys.path.insert(0,str(Path(__file__).parent))
def build(name):
 bpy.ops.wm.open_mainfile(filepath=str(ROOT/'assets/source/blender/character.sprout-prototype/sprout-animated.blend'))
 rig=bpy.data.objects['knockbound_rig'];modules=bpy.data.collections['AUTHORING_MODULES'];slots={c.name.lower():c for c in modules.children};mat=bpy.data.materials['knockbound_matte']
 rig['asset_id']='character.'+name;rig['revision']='r001'
 for ob in list(modules.all_objects):
  if ob.name.startswith('gill_') or (name=='pebble' and ob.name.startswith(('body_tail','nose'))):bpy.data.objects.remove(ob,do_unlink=True)
 def color(ob,hexv):
  attr=ob.data.color_attributes.get('Color') if ob.type=='MESH' else None
  if attr:
   rgb=tuple(int(hexv[i:i+2],16)/255 for i in (0,2,4))
   for value in attr.data:value.color_srgb=(*rgb,1)
 def ball(label,center,scale,hexv,bone='head',slot='body'):
  nu,nv=10,6;vertices=[]
  for j in range(nv+1):
   t=.02+(math.pi-.04)*j/nv
   for i in range(nu):
    a=2*math.pi*i/nu;vertices.append((center[0]+scale[0]*math.sin(t)*math.cos(a),center[1]+scale[1]*math.sin(t)*math.sin(a),center[2]+scale[2]*math.cos(t)))
  faces=[(j*nu+i,j*nu+(i+1)%nu,(j+1)*nu+(i+1)%nu,(j+1)*nu+i)for j in range(nv)for i in range(nu)]
  mesh=bpy.data.meshes.new(label);mesh.from_pydata(vertices,[],faces);mesh.update();ob=bpy.data.objects.new(label,mesh);slots[slot].objects.link(ob);ob['slot']=slot;mesh.materials.append(mat);mesh.color_attributes.new(name='Color',type='BYTE_COLOR',domain='CORNER');color(ob,hexv)
  for poly in mesh.polygons:poly.use_smooth=True
  group=ob.vertex_groups.new(name=bone);group.add(list(range(len(vertices))),1,'REPLACE');mod=ob.modifiers.new('Skin','ARMATURE');mod.object=rig
 for ob in modules.all_objects:
  if ob.name.startswith(('body_head','body_arm_','body_leg_','body_tail')):color(ob,'B88865' if name=='pebble' else 'B6A1E0')
  if ob.name.startswith(('outfit_hood','outfit_sleeve')):color(ob,'4F846D' if name=='pebble' else '367F99')
 if name=='pebble':
  for sign in [-1,1]:
   ball('pebble_ear_'+str(sign),(sign*.29,0,1.76),(.16,.095,.18),'B88865');ball('pebble_inner_'+str(sign),(sign*.29,-.08,1.76),(.09,.025,.105),'F3C1AD')
  ball('pebble_muzzle',(0,-.32,1.30),(.235,.065,.105),'FFE6C6');ball('pebble_nose',(0,-.39,1.35),(.052,.025,.035),'34303A');ball('pebble_tail',(0,.26,.56),(.12,.14,.12),'B88865','tail')
 else:
  for sign in [-1,1]:
   ball('wisp_antenna_'+str(sign),(sign*.23,.01,1.84),(.055,.065,.25),'A589D0');ball('wisp_tip_'+str(sign),(sign*.25,-.005,2.04),(.085,.07,.08),'FFF1B7')
  ball('wisp_charm',(0,-.235,.91),(.075,.035,.105),'F5D57C','chest','outfit')
 target=ROOT/'assets/source/blender'/('character.'+name)/(name+'.blend');target.parent.mkdir(parents=True,exist_ok=True);bpy.ops.wm.save_as_mainfile(filepath=str(target))
 from assemble_character import assemble
 meta=assemble();assert len(meta['clips'])==10
 scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=12;scene.render.resolution_x=384;scene.render.resolution_y=432;scene.render.resolution_percentage=100
 camera=scene.camera;camera.location=(2.3,-5,2.5);camera.rotation_euler=(Vector((0,0,1))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.ortho_scale=2.75
 evidence=ROOT/'tests/evidence'/('M3-roster-'+name);evidence.mkdir(parents=True,exist_ok=True)
 rig.animation_data.action=bpy.data.actions['idle'];scene.frame_set(1);scene.render.filepath=str(evidence/'idle.png');bpy.ops.render.render(write_still=True)
 print('ROSTER_CANDIDATE',name,meta['triangles'] if 'triangles' in meta else meta['asset_id'])
for name in ['pebble','wisp']:build(name)
