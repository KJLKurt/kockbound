"""Validate editable source and export only RUNTIME. Never exports studio fixtures."""
import bpy, json, hashlib, math, struct
from pathlib import Path
from mathutils import Vector

ROOT=Path(__file__).resolve().parents[2]
REQUIRED_CLIPS={'idle','run','dash'}
PRODUCTION_CLIPS={'idle','run','dash','hit','stunned','falling','eliminated','victory','emote_01','emote_02'}
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def export_character():
    assert bpy.app.version[:3]==(5,2,1), 'Use pinned Blender 5.2.1'
    coll=bpy.data.collections.get('RUNTIME'); assert coll, 'Missing RUNTIME collection'
    objects=list(coll.all_objects)
    rigs=[o for o in objects if o.type=='ARMATURE']; meshes=[o for o in objects if o.type=='MESH']
    assert len(rigs)==1 and len(meshes)==1, 'Prototype profile: one rig and one joined mesh'
    assert all(o.type in ('MESH','ARMATURE') for o in objects), 'Unexpected runtime helper'
    rig=rigs[0]; mesh=meshes[0]
    assert rig.get('rig_id')=='rig.knockbound_v1_prototype'
    for o in objects:
        assert max(abs(s-1) for s in o.scale)<1e-6, 'Apply scale before binding'
        assert o.location.length<1e-6 and max(abs(a) for a in o.rotation_euler)<1e-6, 'Object must be identity at ground origin'
    mesh.data.calc_loop_triangles(); triangles=len(mesh.data.loop_triangles)
    assert triangles<=12000, f'Triangle budget exceeded: {triangles}'
    assert len(mesh.data.materials)<=4 and all(mesh.data.materials), 'Material budget/empty slot'
    assert len([b for b in rig.data.bones if b.use_deform])<=64
    assert mesh.data.color_attributes.get('Color'), 'Missing vertex palette'
    for v in mesh.data.vertices:
        assert all(math.isfinite(x) for x in v.co), 'Nonfinite geometry'
        assert 1<=len(v.groups)<=4 and abs(sum(g.weight for g in v.groups)-1)<1e-5, 'Bad skin weights'
        assert all(mesh.vertex_groups[g.group].name in rig.data.bones for g in v.groups), 'Unknown skin bone'
    clips={a.name for a in bpy.data.actions}
    assert REQUIRED_CLIPS<=clips and clips<=PRODUCTION_CLIPS, 'Missing or unexpected clips'
    expected_sockets={'head','face','back','chest','waist','trail','aura','hand.L','hand.R','foot.L','foot.R','leg.L','leg.R'}
    assert {'socket.'+s for s in expected_sockets}<={b.name for b in rig.data.bones}, 'Missing socket'
    source=Path(bpy.data.filepath); assert source.is_file(), 'Save source before exporting'
    asset=rig['asset_id']; revision=rig.get('revision','r001')
    assert revision in ('r001','r002','r003'), 'Unknown candidate revision'
    out=ROOT/'assets/runtime'/asset/revision; out.mkdir(parents=True,exist_ok=True)
    oldaction=rig.animation_data.action; oldframe=bpy.context.scene.frame_current
    rig.animation_data.action=None
    for p in rig.pose.bones: p.matrix_basis.identity()
    bpy.context.view_layer.update()
    bounds=[[min(v.co[i] for v in mesh.data.vertices) for i in range(3)],[max(v.co[i] for v in mesh.data.vertices) for i in range(3)]]
    assert abs(bounds[0][2])<.005 and 1.7<bounds[1][2]<2.2, 'Unexpected ground or height'
    bones=[{'name':b.name,'parent':b.parent.name if b.parent else None,'deform':b.use_deform,'head_blender':list(b.head_local),'tail_blender':list(b.tail_local),'rest_matrix_blender':[list(row) for row in b.matrix_local], 'inverse_bind_blender':[list(row) for row in b.matrix_local.inverted()]} for b in rig.data.bones]
    bpy.ops.object.select_all(action='DESELECT')
    for o in objects: o.select_set(True)
    bpy.context.view_layer.objects.active=rig
    settings=dict(export_format='GLB',use_selection=True,export_yup=True,export_animations=True,export_animation_mode='ACTIONS',export_frame_range=False,export_force_sampling=True,export_frame_step=1,export_def_bones=False,export_skins=True,export_all_influences=False,export_morph=False,export_extras=True,export_cameras=False,export_lights=False,export_texcoords=False,export_normals=True,export_tangents=False,export_materials='EXPORT',export_image_format='AUTO',export_draco_mesh_compression_enable=False)
    dest=out/'sprout-prototype.glb'
    try:
        bpy.ops.export_scene.gltf(filepath=str(dest),**settings)
    finally:
        rig.animation_data.action=oldaction; bpy.context.scene.frame_set(oldframe)
    raw=dest.read_bytes(); length=struct.unpack_from('<I',raw,12)[0]; gltf=json.loads(raw[20:20+length])
    actual={a['name'] for a in gltf.get('animations',[])}
    assert actual==clips, f'Exported clips mismatch {actual} vs {clips}'
    assert not gltf.get('images') and not gltf.get('cameras'), 'Unexpected payload'
    assert len(raw)<1024*1024, 'Prototype GLB exceeds 1 MiB'
    assert all('COLOR_0' in p['attributes'] and 'JOINTS_0' in p['attributes'] for m in gltf['meshes'] for p in m['primitives']), 'Missing skin/palette'
    meta={'asset_id':asset,'revision':'r001','status':'pipeline_prototype_not_production_approved','contract':'character-contract-v0.1','rig_id':rig['rig_id'],'blender':bpy.app.version_string,'blender_build_hash':bpy.app.build_hash.decode(),'exporter':gltf['asset'].get('generator'),'source':str(source.relative_to(ROOT)).replace('\\','/'),'source_sha256':sha(source),'glb_sha256':sha(dest),'bytes':len(raw),'triangles':triangles,'materials':len(mesh.data.materials),'bones_total':len(bones),'deform_bones':sum(b['deform'] for b in bones),'bounds_blender_rest':bounds,'bounds_runtime_rest':[[bounds[0][0],bounds[0][2],-bounds[1][1]],[bounds[1][0],bounds[1][2],-bounds[0][1]]],'clips':sorted(clips),'missing_production_clips':sorted(PRODUCTION_CLIPS-clips),'export_settings':settings,'bones':bones,'collider':{'type':'circle','radius_m':.45,'plane':'XZ','source':'docs/IMPLEMENTATION_SPEC.md','embedded_mesh':False},'script_sha256':{p.name:sha(p) for p in Path(__file__).parent.glob('*.py')}}
    meta['revision']=revision; meta['contract']=rig.get('contract','character-contract-v0.1')
    meta['authoring_modules']=bool(bpy.data.collections.get('AUTHORING_MODULES'))
    (out/'asset.json').write_text(json.dumps(meta,indent=2)+'\n')
    print('SOURCE_AND_EXPORT_VALIDATION_PASS',json.dumps({k:meta[k] for k in ('triangles','materials','bones_total','bytes','clips')}))
    return meta
if __name__=='__main__': export_character()
