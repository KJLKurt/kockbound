"""Build the small back-pack accessory used to prove socket-based cosmetics."""
import bpy, json, hashlib
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'assets/source/blender/accessory.sprout-backpack'
OUT = ROOT / 'assets/runtime/accessory.sprout-backpack/r001'

def mat(name, color, rough=.65):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF'); bs.inputs['Base Color'].default_value=(*color,1); bs.inputs['Roughness'].default_value=rough
    return m

def cube(name, loc, scale, material, bevel=.04):
    bpy.ops.mesh.primitive_cube_add(location=loc); o=bpy.context.object; o.name=name; o.scale=scale; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if bevel:
        mod=o.modifiers.new('soft_edges','BEVEL'); mod.width=bevel; mod.segments=2
        bpy.context.view_layer.objects.active=o; bpy.ops.object.modifier_apply(modifier=mod.name)
    o.data.materials.append(material); return o

def build():
    bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
    for c in list(bpy.data.collections):
        if c.name != 'Collection': bpy.data.collections.remove(c)
    cream=mat('BackpackBlue',(0.06,.28,.60)); coral=mat('BackpackCoral',(.95,.20,.34)); navy=mat('BackpackNavy',(.03,.08,.18))
    parts=[]
    # Geometry is socket-local: the loaded scene can parent to socket.back at local identity.
    parts.append(cube('backpack_body',(0,0,.02),(.24,.10,.24),cream,.06))
    parts.append(cube('backpack_top',(0,-.05,.27),(.18,.07,.05),coral,.03))
    parts.append(cube('backpack_badge',(0,-.115,.04),(.08,.025,.08),navy,.02))
    parts.append(cube('strap.L',(-.20,-.105,.05),(.035,.035,.20),navy,.02))
    parts.append(cube('strap.R',(.20,-.105,.05),(.035,.035,.20),navy,.02))
    bpy.ops.object.select_all(action='DESELECT')
    for o in parts: o.select_set(True)
    bpy.context.view_layer.objects.active=parts[0]; bpy.ops.object.join(); body=bpy.context.object; body.name='sprout_backpack'; body['attachment_socket']='socket.back'; body['asset_id']='accessory.sprout-backpack'; body['revision']='r001'
    # authoring source collection
    src_coll=bpy.data.collections.new('AUTHORING'); bpy.context.scene.collection.children.link(src_coll)
    for c in list(body.users_collection): c.objects.unlink(body)
    src_coll.objects.link(body)
    SRC.mkdir(parents=True,exist_ok=True); OUT.mkdir(parents=True,exist_ok=True)
    source=SRC/'sprout-backpack.blend'; bpy.ops.wm.save_as_mainfile(filepath=str(source))
    bpy.ops.object.select_all(action='DESELECT'); body.select_set(True); bpy.context.view_layer.objects.active=body
    dest=OUT/'sprout-backpack.glb'; bpy.ops.export_scene.gltf(filepath=str(dest),export_format='GLB',use_selection=True,export_yup=True,export_materials='EXPORT',export_normals=True,export_texcoords=False,export_cameras=False,export_lights=False,export_animations=False)
    raw=dest.read_bytes(); body.data.calc_loop_triangles(); meta={'asset_id':'accessory.sprout-backpack','revision':'r001','status':'pipeline_prototype_not_production_approved','source':str(source.relative_to(ROOT)).replace('\\','/'),'runtime':str(dest.relative_to(ROOT)).replace('\\','/'),'attachment_socket':'socket.back','triangles':len(body.data.loop_triangles),'materials':len(body.data.materials),'bytes':len(raw),'scale_m':1.0,'notes':'Attach mesh root to the loaded socket.back bone at local identity; accessory does not affect gameplay collision.'}
    (OUT/'asset.json').write_text(json.dumps(meta,indent=2)+'\n')
    print('BACKPACK_ACCESSORY_PASS',json.dumps(meta))

if __name__=='__main__': build()
