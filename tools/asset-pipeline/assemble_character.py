"""Reassemble saved modular edits without regenerating artwork. Default outfit only.
Run against sprout-refined.blend; updates its RUNTIME copy, saves, validates/exports.
"""
import bpy,sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).parent))
def assemble():
    modules=bpy.data.collections.get('AUTHORING_MODULES'); assert modules, 'No modular authoring collection'
    rig=bpy.data.objects['knockbound_rig']; runtime=bpy.data.collections['RUNTIME']
    sources=[o for o in modules.all_objects if o.type=='MESH' and not o.get('covered_by_default_outfit',False)]
    assert sources and {'body','outfit','shoes'}<={o.get('slot') for o in sources}, 'Incomplete default outfit'
    oldaction=rig.animation_data.action;rig.animation_data.action=None
    for p in rig.pose.bones:p.matrix_basis.identity()
    copies=[]
    for source in sources:
        obj=source.copy();obj.data=source.data.copy();runtime.objects.link(obj)
        for m in list(obj.modifiers):obj.modifiers.remove(m)
        copies.append(obj)
    for obj in list(runtime.objects):
        if obj.type=='MESH' and obj not in copies:bpy.data.objects.remove(obj,do_unlink=True)
    bpy.ops.object.select_all(action='DESELECT')
    for obj in copies:obj.select_set(True)
    bpy.context.view_layer.objects.active=copies[0];bpy.ops.object.join()
    body=bpy.context.object;body.name='sprout_body';body['assembly']='default_outfit'
    m=body.modifiers.new('Skin','ARMATURE');m.object=rig
    rig.animation_data.action=oldaction;bpy.context.scene.frame_set(1)
    bpy.ops.wm.save_as_mainfile(filepath=bpy.data.filepath)
    from export_character import export_character
    return export_character()
if __name__=='__main__':assemble()
