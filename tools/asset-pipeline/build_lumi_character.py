"""Create one Lumi-inspired compatible character from the refined Sprout source."""
import bpy, math, sys
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2]; sys.path.insert(0,str(Path(__file__).parent))
SRC=ROOT/'assets/source/blender/character.lumi-prototype'; SRC.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'assets/source/blender/character.sprout-prototype/sprout-refined.blend'))
scene=bpy.context.scene; rig=bpy.data.objects['knockbound_rig']; modules=bpy.data.collections['AUTHORING_MODULES']; slots={c.name.lower():c for c in modules.children}
rig['asset_id']='character.lumi-prototype'; rig['revision']='r001'; rig['contract']='character-contract-v0.2'
# Lumi uses tall ears rather than the Sprout fan fins.
for o in list(modules.all_objects):
    if o.name.startswith('gill_'): bpy.data.objects.remove(o,do_unlink=True)
mat=bpy.data.materials['knockbound_matte']; gloss=bpy.data.materials['knockbound_eyes']
def col(hexv): return tuple(int(hexv[i:i+2],16)/255 for i in (0,2,4))
def add(name,verts,faces,color,bone,slot='body',material=None):
    me=bpy.data.meshes.new(name); me.from_pydata(verts,[],faces); me.update(); ob=bpy.data.objects.new(name,me); slots[slot].objects.link(ob); me.materials.append(material or mat)
    a=me.color_attributes.new(name='Color',type='BYTE_COLOR',domain='CORNER'); c=col(color)
    for p in me.polygons:
        p.use_smooth=True
        for li in p.loop_indices:a.data[li].color_srgb=(*c,1)
    vg=ob.vertex_groups.new(name=bone); vg.add(list(range(len(verts))),1.0,'REPLACE'); mod=ob.modifiers.new('Skin','ARMATURE'); mod.object=rig; ob['slot']=slot
    return ob
def ellipsoid(name,center,scale,color,bone):
    nu,nv=16,10; verts=[]
    for j in range(nv+1):
        t=.03+(math.pi-.06)*j/nv
        for i in range(nu):
            p=2*math.pi*i/nu; verts.append((center[0]+scale[0]*math.sin(t)*math.cos(p),center[1]+scale[1]*math.sin(t)*math.sin(p),center[2]+scale[2]*math.cos(t)))
    faces=[]
    for j in range(nv):
        for i in range(nu):faces.append((j*nu+i,j*nu+(i+1)%nu,(j+1)*nu+(i+1)%nu,(j+1)*nu+i))
    return add(name,verts,faces,color,bone)
# Recolor existing accessory surfaces toward Lumi's darker gloves and orange/white shoes.
def recolor(ob,hexv):
    attr=ob.data.color_attributes.get('Color') if ob.type=='MESH' else None
    if not attr:return
    c=col(hexv)
    for d in attr.data:d.color_srgb=(*c,1)
# Cyan body surfaces keep the same weights and proportions.
for o in modules.all_objects:
    if o.type!='MESH' or not o.data.color_attributes: continue
    if o.name.startswith(('body_head','body_arm_','body_leg_','body_tail')):
        attr=o.data.color_attributes.get('Color')
        for d in attr.data:
            r,g,b,_=d.color_srgb; t=max(0,min(1,(g-r)*2.5)); base=Vector((.08,.62,.86)).lerp(Vector((.16,.83,.94)),t*.55); d.color_srgb=(*base,1)
# Cream muzzle gives the face the high-contrast mask from the concept sheet.
ellipsoid('lumi_muzzle',(0,-.286,1.315),(.285,.030,.135),'FFE8D0','head')
# Small forehead tufts break up the otherwise smooth head without a texture atlas.
ellipsoid('lumi_tuft_center',(0,-.255,1.665),(.095,.055,.11),'1A8FCB','head')
# Tall ears with a slight backward sweep, weighted to head for animation compatibility.
for s,label in ((1,'L'),(-1,'R')):
    ellipsoid('lumi_ear_'+label,(s*.245,.005,1.83),(.135,.105,.30),'26BDEB','head')
    ellipsoid('lumi_ear_inner_'+label,(s*.245,-.088,1.83),(.075,.022,.18),'F6B3A6','head')
# Orange scarf: collar ring and pointed front bib, chest-weighted.
nu=20; verts=[]; faces=[]
for z,rx,ry in [(1.075,.235,.17),(1.13,.22,.155)]:
    for i in range(nu):
        a=2*math.pi*i/nu; verts.append((rx*math.cos(a),ry*math.sin(a),z))
for i in range(nu):faces.append((i,(i+1)%nu,nu+(i+1)%nu,nu+i))
add('lumi_scarf_collar',verts,faces,'F47A25','chest','outfit')
add('lumi_scarf_bib',[(-.22,-.205,1.08),(.22,-.205,1.08),(.17,-.245,.82),(0,-.27,.70),(-.17,-.245,.82)],[(0,1,2,3,4)],'F47A25','chest','outfit')
add('lumi_scarf_badge',[(-.07,-.278,.91),(.07,-.278,.91),(.055,-.279,.84),(0,-.28,.82),(-.055,-.279,.84)],[(0,1,2,3,4)],'FFF2D6','chest','outfit')
# A small scarf knot and trailing point read clearly in side and gameplay views.
add('lumi_scarf_knot',[(-.09,-.23,1.09),(.09,-.23,1.09),(.075,-.27,1.00),(0,-.29,.96),(-.075,-.27,1.00)],[(0,1,2,3,4)],'E85D1A','chest','outfit')
# Push the gloves and shoe accents toward the default Lumi look.
for o in modules.all_objects:
    if o.name.startswith('glove_') and 'cuff' not in o.name: recolor(o,'24233E')
    elif o.name.startswith('glove_cuff_'): recolor(o,'F47A25')
    elif o.name.startswith('shoe_') and 'lace' not in o.name and 'tongue' not in o.name: recolor(o,'F47A25' if 'side_panel' in o.name else 'F6E9DA')
# Save the editable variant, then reuse the standard modular assembly/export path.
bpy.ops.wm.save_as_mainfile(filepath=str(SRC/'lumi-prototype.blend'))
from assemble_character import assemble
assemble()
print('LUMI_VARIANT_COMPLETE')
