"""Render actual candidate poses and independently reimport both animation GLBs. Never saves masters."""
import bpy,json,sys
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2]
clips=['idle','run','dash','hit','stunned','falling','eliminated','victory','emote_01','emote_02']
if '--affected-only' in sys.argv:clips=['victory','falling','emote_01','eliminated']
for asset,source,revision,label in [('character.sprout-prototype','sprout-animated.blend','r003','sprout'),('character.lumi-prototype','lumi-animated.blend','r002','lumi')]:
    output=ROOT/'tests/evidence'/('M3-animation-'+label);output.mkdir(parents=True,exist_ok=True)
    bpy.ops.wm.open_mainfile(filepath=str(ROOT/'assets/source/blender'/asset/source))
    scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=8
    scene.render.resolution_x=256;scene.render.resolution_y=288;scene.render.resolution_percentage=100
    camera=scene.camera;camera.location=(2.3,-5,2.5);camera.rotation_euler=(Vector((0,0,1))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.ortho_scale=2.85
    rig=bpy.data.objects['knockbound_rig']
    for name in clips:
        action=bpy.data.actions[name];rig.animation_data.action=action
        frame={'dash':8,'hit':3,'victory':20,'emote_01':16,'emote_02':19}.get(name,round(action.frame_range[1]*.5))
        scene.frame_set(frame);scene.render.filepath=str(output/(name+'.png'));bpy.ops.render.render(write_still=True)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    directory=ROOT/'assets/runtime'/asset/revision;bpy.ops.import_scene.gltf(filepath=str(directory/'sprout-prototype.glb'))
    assert len(bpy.data.actions)==10
    meshes=[o for o in bpy.context.scene.objects if o.type=='MESH' and any(m.type=='ARMATURE' for m in o.modifiers)]
    points=[o.matrix_world@v.co for o in meshes for v in o.data.vertices]
    bounds=[[min(p[i] for p in points)for i in range(3)],[max(p[i] for p in points)for i in range(3)]]
    meta=json.loads((directory/'asset.json').read_text())
    assert all(abs(bounds[j][i]-meta['bounds_blender_rest'][j][i])<.002 for j in range(2)for i in range(3))
    (output/'blender-reimport.json').write_text(json.dumps({'status':'PASS','actions':10,'rest_bounds':bounds,'blender':bpy.app.version_string},indent=2))
    print('ANIMATION_REIMPORT_PASS',label)

