"""Fresh-process reimport, negative validation, and meter/axis fixture evidence."""
import bpy, sys, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2]; sys.path.insert(0,str(Path(__file__).parent))
from export_character import export_character
rig=bpy.data.objects['knockbound_rig']
revision=rig.get('revision','r001')
evidence=ROOT/'tests/evidence'/('asset-pipeline' if revision=='r001' else 'asset-pipeline-r002')
assetdir=ROOT/'assets/runtime/character.sprout-prototype'/revision
tests=[]
# Fail before any export writes; restore each mutation immediately.
b=rig.data.bones['socket.head']; b.name='socket.missing'
try:
    export_character(); raise RuntimeError('Missing socket accepted')
except AssertionError as e:
    assert 'Missing socket' in str(e); tests.append('missing socket rejected')
finally: b.name='socket.head'
a=bpy.data.actions['dash']; a.name='incorrect_clip'
try:
    export_character(); raise RuntimeError('Missing clip accepted')
except AssertionError as e:
    assert 'clips' in str(e); tests.append('missing/unexpected clip rejected')
finally: a.name='dash'
mesh=bpy.data.objects['sprout_body']; mesh.scale.x=-1
try:
    export_character(); raise RuntimeError('Negative scale accepted')
except AssertionError as e:
    assert 'scale' in str(e); tests.append('negative scale rejected')
finally: mesh.scale.x=1
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=str(assetdir/'sprout-prototype.glb'))
# Blender importer creates mesh widgets for bone display; measure skinned asset meshes only.
imported=[o for o in bpy.context.scene.objects if o.type=='MESH' and any(m.type=='ARMATURE' for m in o.modifiers)]; assert imported
assert len(bpy.data.actions)==3 # Exact clip names independently checked with Three.
points=[o.matrix_world@v.co for o in imported for v in o.data.vertices]
bounds=[[min(p[i] for p in points) for i in range(3)],[max(p[i] for p in points) for i in range(3)]]
meta=json.loads((assetdir/'asset.json').read_text())
assert all(abs(bounds[j][i]-meta['bounds_blender_rest'][j][i])<.002 for j in range(2) for i in range(3)), bounds
assert any(o.type=='ARMATURE' for o in bpy.data.objects)
tests.append('fresh Blender GLB reimport: all six rest bounds match metadata')
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.context.scene.unit_settings.system='METRIC'; bpy.context.scene.unit_settings.scale_length=1
bpy.ops.mesh.primitive_cube_add(size=1,location=(2,0,.5)); bpy.context.object.name='meter_cube'
for name,pos in [('forward',(0,-1,0)),('up',(0,0,1)),('right',(1,0,0)),('ground',(0,0,0))]:
    o=bpy.data.objects.new(name,None); bpy.context.scene.collection.objects.link(o); o.location=pos
bpy.ops.mesh.primitive_plane_add(size=4); bpy.context.object.name='floor'
bpy.ops.export_scene.gltf(filepath=str(evidence/'coordinate-fixture.glb'),export_format='GLB',export_yup=True,export_animations=False)
(evidence/'blender-validation.json').write_text(json.dumps({'status':'PASS','blender':bpy.app.version_string,'checks':tests,'reimport_bounds_blender':bounds},indent=2)+'\n')
print('BLENDER_VERIFICATION_PASS',tests)
