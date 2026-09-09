import bpy,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
for name in ['pebble','wisp']:
 bpy.ops.wm.read_factory_settings(use_empty=True)
 directory=ROOT/'assets/runtime'/('character.'+name)/'r001';bpy.ops.import_scene.gltf(filepath=str(directory/'sprout-prototype.glb'))
 assert len(bpy.data.actions)==10
 rig=next(o for o in bpy.context.scene.objects if o.type=='ARMATURE');assert len(rig.data.bones)==34
 meta=json.loads((directory/'asset.json').read_text());meshes=[o for o in bpy.context.scene.objects if o.type=='MESH' and any(m.type=='ARMATURE' for m in o.modifiers)];assert len(meshes)==1;points=[o.matrix_world@v.co for o in meshes for v in o.data.vertices];bounds=[[min(p[i]for p in points)for i in range(3)],[max(p[i]for p in points)for i in range(3)]]
 print('BOUNDS_CHECK',name,bounds,meta['bounds_blender_rest'],[(o.name,list(o.location),list(o.rotation_euler))for o in meshes])
 assert all(abs(bounds[j][i]-meta['bounds_blender_rest'][j][i])<.002 for j in range(2)for i in range(3))
 (ROOT/'tests/evidence'/('M3-roster-'+name)/'blender-reimport.json').write_text(json.dumps({'status':'PASS','actions':10,'bones':34,'bounds':bounds},indent=2))
 print('ROSTER_REIMPORT_PASS',name)
