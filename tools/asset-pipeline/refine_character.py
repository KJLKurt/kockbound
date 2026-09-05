"""Refine the SAME character using r001's exact rig. Preserve r001; write r002.
Run Blender --background --factory-startup --python-exit-code 1 --python this_file.
AUTHORING_MODULES holds editable weighted components; RUNTIME is an assembled copy.
"""
import bpy, math, sys
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2]; sys.path.insert(0,str(Path(__file__).parent))
SOURCE=ROOT/'assets/source/blender/character.sprout-prototype'
EVIDENCE=ROOT/'tests/evidence/asset-pipeline-r002'; EVIDENCE.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(SOURCE/'sprout-prototype.blend'))
scene=bpy.context.scene; runtime=bpy.data.collections['RUNTIME']; rig=bpy.data.objects['knockbound_rig']
rig['revision']='r002'; rig['contract']='character-contract-v0.2'
rig.animation_data.action=None
for p in rig.pose.bones: p.matrix_basis.identity()
for o in list(runtime.objects):
    if o.type=='MESH': bpy.data.objects.remove(o,do_unlink=True)
modules=bpy.data.collections.new('AUTHORING_MODULES'); scene.collection.children.link(modules)
slots={}
for slot in ('body','outfit','shoes'):
    slots[slot]=bpy.data.collections.new(slot.upper()); modules.children.link(slots[slot])
mat=bpy.data.materials['knockbound_matte']; gloss=bpy.data.materials['knockbound_eyes']
mat.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.58
gloss.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.19
CREAM='FFE2B3'; WHITE='FFF2D6'; BLUE='286DC5'; NAVY='162D52'; CYAN='51BFEB'; PINK='EE73A7'; DARK='15213C'
parts=[]
def color(h): return Vector(tuple(int(h[i:i+2],16)/255 for i in (0,2,4)))
def blend(a,b,t): return color(a).lerp(color(b),max(0,min(1,t)))
def add(name,verts,faces,palette,bone,slot='body',glossy=False,weight=None,covered=False):
    mesh=bpy.data.meshes.new(name); mesh.from_pydata(verts,[],faces); mesh.update()
    obj=bpy.data.objects.new(name,mesh); slots[slot].objects.link(obj)
    obj.data.materials.append(gloss if glossy else mat)
    attr=mesh.color_attributes.new(name='Color',type='BYTE_COLOR',domain='CORNER')
    for poly in mesh.polygons:
        poly.use_smooth=True
        for loop in poly.loop_indices:
            i=mesh.loops[loop].vertex_index
            c=palette(i,Vector(verts[i])) if callable(palette) else color(palette)
            attr.data[loop].color_srgb=tuple(c)+(1,)
    for i,v in enumerate(verts):
        weights=weight(Vector(v)) if weight else {bone:1}
        for bn,w in weights.items():
            if w>1e-5:
                vg=obj.vertex_groups.get(bn) or obj.vertex_groups.new(name=bn); vg.add([i],w,'REPLACE')
    mod=obj.modifiers.new('Skin','ARMATURE'); mod.object=rig
    obj['slot']=slot; obj['covered_by_default_outfit']=covered
    bpy.ops.object.select_all(action='DESELECT'); obj.select_set(True); bpy.context.view_layer.objects.active=obj
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode='OBJECT')
    parts.append(obj); return obj
def rings_mesh(rings):
    n=len(rings[0]); verts=[v for ring in rings for v in ring]; faces=[]
    for j in range(len(rings)-1):
        for i in range(n): faces.append((j*n+i,j*n+(i+1)%n,(j+1)*n+(i+1)%n,(j+1)*n+i))
    faces.extend([tuple(range(n-1,-1,-1)),tuple((len(rings)-1)*n+i for i in range(n))]); return verts,faces
def tube(name,centers,radii,palette,bone,slot='body',n=12,weight=None):
    centers=[Vector(c) for c in centers]; rings=[]
    for j,c in enumerate(centers):
        axis=(centers[min(j+1,len(centers)-1)]-centers[max(j-1,0)]).normalized()
        u=axis.cross(Vector((0,1,0)))
        if u.length<.1: u=axis.cross(Vector((1,0,0)))
        u.normalize(); v=axis.cross(u).normalized()
        radi=radii[j]; a,b=radi if isinstance(radi,tuple) else (radi,radi)
        rings.append([c+u*(a*math.cos(i*2*math.pi/n))+v*(b*math.sin(i*2*math.pi/n)) for i in range(n)])
    return add(name,*rings_mesh(rings),palette,bone,slot,weight=weight)
def line(name,points,radius,palette,bone,slot='outfit',n=6):
    return tube(name,points,[radius]*len(points),palette,bone,slot,n)
def ellipsoid(name,center,scale,palette,bone,slot='body',nu=20,nv=12,glossy=False,covered=False):
    verts=[]
    # Tiny nonzero terminal rings avoid degenerate UV-sphere pole triangles.
    for j in range(nv+1):
        t=.025+(math.pi-.05)*j/nv
        for i in range(nu):
            p=i*2*math.pi/nu
            verts.append((center[0]+scale[0]*math.sin(t)*math.cos(p),center[1]+scale[1]*math.sin(t)*math.sin(p),center[2]+scale[2]*math.cos(t)))
    rings=[verts[j*nu:(j+1)*nu] for j in range(nv+1)]
    return add(name,*rings_mesh(rings),palette,bone,slot,glossy,covered=covered)
def head_dims(z):
    v=max(-.9999,min(.9999,(z-1.405)/.335)); r=math.sqrt(1-v*v)
    return .435*r*(1-.10*v),.303*r
def face(x,z,offset=0):
    rx,ry=head_dims(z)
    yy=-ry*max(0,1-(x/rx)**2)**.45
    yy-=.025*math.exp(-((x/.25)**2+((z-1.30)/.115)**2))
    return Vector((x,yy-offset,z))

# One shaped head with lower cheeks and integrated muzzle curvature.
rings=[]
for j in range(25):
    t=.022+(math.pi-.044)*j/24; z=1.405+.335*math.cos(t); rx,ry=head_dims(z)
    ring=[]
    for i in range(40):
        p=2*math.pi*i/40; x=rx*math.cos(p); si=math.sin(p)
        y=-ry*math.copysign(abs(si)**.9,si)
        if si>0: y-=.025*math.exp(-((x/.25)**2+((z-1.30)/.115)**2))*si
        ring.append((x,y,z))
    rings.append(ring)
add('body_head',*rings_mesh(rings),lambda i,v:blend('E6B88C',CREAM,.62+.38*max(0,(v.z-1.10)/.48)),'head')
def patch(name,cx,cz,rx,rz,palette,offset=.006,glossy=False,shape=None):
    verts=[face(cx,cz,offset+.008)]; faces=[]; n=24
    for k in range(1,4):
        r=k/3
        for i in range(n):
            a=i*2*math.pi/n; x=rx*r*math.cos(a); z=rz*r*math.sin(a)
            if shape: x,z=shape(x,z)
            verts.append(face(cx+x,cz+z,offset+.014*(1-r*r)))
    for i in range(n): faces.append((0,1+i,1+(i+1)%n))
    for k in range(2):
        for i in range(n): faces.append((1+k*n+i,1+(k+1)*n+i,1+(k+1)*n+(i+1)%n,1+k*n+(i+1)%n))
    return add(name,verts,faces,palette,'head',glossy=glossy)
for side,s in [('L',1),('R',-1)]:
    # Eye surfaces follow the cheek; no protruding white rim or floating iris spheres.
    patch('eye_socket_'+side,s*.187,1.47,.112,.127,'C39580',.002)
    patch('eye_white_'+side,s*.187,1.472,.104,.117,WHITE,.006)
    patch('eye_lens_'+side,s*.175,1.466,.091,.107,lambda i,v:blend('080F22','285B93',max(0,(1.51-v.z)/.16)),.016,True)
    patch('eye_pupil_'+side,s*.176,1.481,.061,.076,'0A1224',.024,True)
    patch('eye_glint_'+side,s*.176-.030,1.515,.025,.030,'FFFFFF',.039,True)
    patch('eye_glint_small_'+side,s*.176+.024,1.428,.011,.012,'A9DEF3',.038,True)
    patch('cheek_blush_'+side,s*.308,1.336,.055,.030,lambda i,v:blend('F4B7A1','EE8B97',.65),.003)
    # Cream eyelid and blush brow instead of blue floating eyebrows.
    points=[face(s*(.105+.16*j/8),1.595+.025*math.sin(math.pi*j/8),.012) for j in range(9)]
    line('brow_'+side,points,.012,'ECA9A2','head','body',6)
    patch('nostril_'+side,s*.037,1.362,.008,.005,'CF9E86',.004)

# Sculpted smile aperture: curved top edge and lower bowl, rather than an oval badge.
verts=[]; faces=[]; columns=25
for j in range(5):
    v=j/4
    for i in range(columns):
        u=-.999+1.998*i/(columns-1); x=.184*u
        top=1.326-.029*(1-u*u); bottom=1.326-.133*(1-u*u)
        z=top*(1-v)+bottom*v
        verts.append(face(x,z,.008))
for j in range(4):
    for i in range(columns-1):
        a=j*columns+i; faces.append((a,a+1,a+columns+1,a+columns))
mouth=add('smile_aperture',verts,faces,lambda i,v:blend('291625','682635',(1.32-v.z)/.14),'head')
# Rounded tongue and two tiny pointed upper teeth within the smile.
patch('tongue',0,1.225,.079,.026,lambda i,v:blend('BE4065','F98D9E',(v.z-1.20)/.045),.020)
for s in (-1,1):
    coords=[(s*.121,1.316),(s*.082,1.307),(s*.099,1.278)]
    add('tooth_'+str(s),[face(x,z,.023) for x,z in coords],[(0,1,2)],WHITE,'head')
lip=[face(.183*u,1.326-.135*(1-u*u),.006) for u in [-1+i/12 for i in range(25)]]
line('lower_lip',lip,.009,'E5B48C','head','body',6)

# Rounded fins with continuous vertex gradients; all color detail costs zero textures.
for side,s in [('L',1),('R',-1)]:
    for k,(base,tip,width) in enumerate([
        ((s*.29,.02,1.53),(s*.51,.08,1.955),.128),
        ((s*.36,.025,1.43),(s*.71,.085,1.705),.113),
        ((s*.35,.05,1.345),(s*.695,.10,1.425),.094)]):
        base,tip=Vector(base),Vector(tip); axis=(tip-base).normalized(); u=Vector((0,1,0)); v=axis.cross(u).normalized(); rings=[]
        for j in range(13):
            t=.012+.976*j/12; w=width*math.sin(math.pi*t)**.60
            c=base.lerp(tip,t)+Vector((0,.035*math.sin(t*math.pi),.026*math.sin(t*math.pi)))
            rings.append([c+v*(w*math.cos(i*2*math.pi/12))+u*(w*.40*math.sin(i*2*math.pi/12)) for i in range(12)])
        def fincolor(i,p):
            t=(i//12)/12; around=(i%12)/12
            core=blend('277FCB','7265CB',t)
            core=core.lerp(color(CYAN),max(0,1-abs(t-.38)*3)*.55)
            rim=abs(math.cos(around*2*math.pi))**6
            return core.lerp(color(PINK),max(0,(t-.63)/.37)*.85+rim*.10)
        add('gill_'+side+str(k),*rings_mesh(rings),fincolor,'gill.'+side)

# Source body underneath clothing: retained for fitting but omitted from default runtime.
ellipsoid('body_torso_under_outfit',(0,0,.83),(.248,.168,.31),CREAM,'chest',covered=True)
ellipsoid('body_hips_under_outfit',(0,0,.57),(.246,.17,.15),CREAM,'hips',covered=True)
tube('body_neck',[(0,0,1.02),(0,0,1.10),(0,0,1.18)],[.12,.115,.13],CREAM,'neck')
levels=[(.59,.244,.173),(.61,.265,.192),(.68,.275,.201),(.79,.287,.213),(.9,.282,.204),(1.0,.259,.185),(1.065,.182,.132)]
def torso_y(x,z):
    for j in range(len(levels)-1):
        z0,x0,y0=levels[j];z1,x1,y1=levels[j+1]
        if z0<=z<=z1:
            t=(z-z0)/(z1-z0);rx=x0+(x1-x0)*t;ry=y0+(y1-y0)*t
            return -ry*math.sqrt(max(.01,1-(x/rx)**2))-.006
    return -.2
rings=[[(rx*math.cos(i*2*math.pi/32),ry*math.sin(i*2*math.pi/32),z) for i in range(32)] for z,rx,ry in levels]
def torso_weights(p):
    t=max(0,min(1,(p.z-.64)/.28)); return {'hips':1-t,'chest':t}
add('outfit_hoodie',*rings_mesh(rings),lambda i,v:blend('24549E','3988DA',(v.z-.59)/.48),'chest','outfit',weight=torso_weights)
# Ribbed waistband; small contrast edging defines actual clothing thickness.
for j,(z,rx,ry) in enumerate([(.604,.268,.196),(.625,.269,.197)]):
    pts=[(rx*math.cos(i*2*math.pi/32),ry*math.sin(i*2*math.pi/32),z) for i in range(33)]
    line('hem_piping_'+str(j),pts,.012,'244F8C','hips')
# Open folded hood, thick across back, pinched at chest to form a V opening.
centers=[]
for i in range(29):
    a=2*math.pi*i/28; x=.224*math.cos(a); y=.164*math.sin(a)
    z=1.080 + .024*math.sin(a) - .066*max(0,-math.sin(a))**6
    centers.append((x,y,z))
tube('hood_fold',centers,[.044+.023*max(0,math.sin(i*2*math.pi/28)) for i in range(29)],lambda i,v:blend(BLUE,CYAN,.4+.5*max(0,-v.y)/.2),'chest','outfit',10)
# Pocket and seam strips mapped to garment surface.
vs=[];faces=[]
for j in range(5):
    z=.697+.099*j/4;width=.137-.05*max(0,(j-2)/2)
    for i in range(9):
        x=width*(-1+i/4);vs.append((x,torso_y(x,z)-.004,z))
for j in range(4):
    for i in range(8):
        a=j*9+i;faces.append((a,a+1,a+10,a+9))
add('kangaroo_pocket',vs,faces,'2C69B3','chest','outfit',weight=torso_weights)
for s in (-1,1):
    pts=[(s*x,torso_y(s*x,z)-.011,z) for x,z in [(.087,.793),(.12,.773),(.137,.735)]]
    line('pocket_welt_'+str(s),pts,.005,CYAN,'chest')
    points=[(s*(.093+.006*math.sin(t*math.pi)), -.208-.005*t, 1.042-.15*t) for t in [0,.25,.5,.75,1]]
    line('drawcord_'+str(s),points,.007,WHITE,'chest')
    line('cord_tip_'+str(s),[points[-1],Vector(points[-1])+Vector((0,0,-.026))],.009,NAVY,'chest')
# Crown chest appliqué, modeled as a thin surface, no separate cosmetic asset.
crown=[(-.063,.89),(-.076,.957),(-.033,.928),(0,.981),(.033,.928),(.076,.957),(.063,.89)]
add('chest_crown',[(x,torso_y(x,z)-.013,z) for x,z in crown],[tuple(range(len(crown)))],WHITE,'chest','outfit')

for side,s in [('L',1),('R',-1)]:
    # Continuous arm across elbow, with blended bone influence.
    def armweight(p,side=side):
        t=max(0,min(1,(p.z-.80)/.12)); return {'upper_arm.'+side:t,'lower_arm.'+side:1-t}
    centers=[(s*.255,0,1.00),(s*.30,0,.954),(s*.35,0,.892),(s*.39,-.008,.827),(s*.437,-.02,.75)]
    tube('body_arm_'+side,centers,[.077,.086,.084,.075,.068],CREAM,'upper_arm.'+side,weight=armweight)
    tube('sleeve_'+side,centers[:3],[.112,.121,.105],BLUE,'upper_arm.'+side,'outfit',16)
    tube('sleeve_edge_'+side,[(s*.342,0,.904),(s*.355,0,.885)],[.108,.103],CYAN,'upper_arm.'+side,'outfit',16)
    # Legs are continuous through knees; shorts hide the pelvis seam.
    def legweight(p,side=side):
        t=max(0,min(1,(p.z-.335)/.13)); return {'upper_leg.'+side:t,'lower_leg.'+side:1-t}
    tube('body_leg_'+side,[(s*.155,0,.61),(s*.17,0,.53),(s*.18,0,.43),(s*.195,0,.30),(s*.20,0,.18)],[.106,.109,.091,.076,.068],CREAM,'upper_leg.'+side,weight=legweight)
    tube('shorts_'+side,[(s*.147,0,.65),(s*.155,0,.57),(s*.172,0,.466)],[.136,.137,.117],NAVY,'upper_leg.'+side,'outfit',16)
    # Glove is one pillow-like contour with integrated thumb, no ball joints.
    outline=[(.424,.741),(.49,.735),(.555,.699),(.589,.648),(.601,.58),(.58,.546),(.532,.532),(.478,.535),(.444,.552),(.421,.580),(.385,.588),(.365,.615),(.372,.652),(.395,.673),(.424,.651)]
    cx=.487; cz=.632; grings=[]
    for depth,factor in [(.075,.69),(.055,.92),(0,1),(-.079,.92),(-.102,.67),(-.112,.25)]:
        grings.append([(s*(cx+(x-cx)*factor),-.026+depth,cz+(z-cz)*factor) for x,z in outline])
    add('glove_'+side,*rings_mesh(grings),lambda i,v:blend('D6D4C8',WHITE,.6+.4*max(0,-v.y)/.14),'hand.'+side,'outfit')
    for j in range(2):
        xx=.489+j*.041
        line('glove_seam_'+side+str(j),[(s*xx,-.116,.555),(s*(xx+.001),-.124,.584),(s*(xx-.002),-.121,.612)],.0025,'B2BDC2','hand.'+side)
    tube('glove_cuff_'+side,[(s*.445,-.021,.715),(s*.448,-.022,.75)],[.086,.082],NAVY,'hand.'+side,'outfit',16)

    # Shoes use an actual layered sole/toe/heel profile instead of stacked spheres.
    shoe_outline=[]
    for i in range(24):
        a=i*2*math.pi/24
        xx=.146*math.copysign(abs(math.cos(a))**.65,math.cos(a))
        yy=.223*math.copysign(abs(math.sin(a))**.72,math.sin(a))-.065
        shoe_outline.append((xx,yy))
    layers=[(.00,.87),(.025,1),(.067,1.025),(.082,.99),(.105,.96),(.158,.91),(.207,.73),(.239,.54)]
    srings=[]
    for z,f in layers:
        srings.append([(s*.20+x*f,-.065+(y+.065)*f,z+(.026 if y>-.04 and z>.1 else 0)) for x,y in shoe_outline])
    def shoecolor(i,p):
        j=i//24
        if j<=1:return color('21416B')
        if j<=3:return color(WHITE)
        if p.y<-.21:return color(WHITE)
        return blend('214C94',BLUE,(p.z-.09)/.16)
    add('shoe_'+side,*rings_mesh(srings),shoecolor,'foot.'+side,'shoes')
    # Tongue and flat laces sit against the sloped upper.
    tongue=[(s*.20-.055,-.192,.204),(s*.20+.055,-.192,.204),(s*.20+.065,-.047,.268),(s*.20-.065,-.047,.268)]
    add('shoe_tongue_'+side,tongue,[(0,1,2,3)],NAVY,'foot.'+side,'shoes')
    for j in range(3):
        y=-.177+j*.043; z=.218+j*.016
        line('lace_'+side+str(j),[(s*.20-.062,y,z),(s*.20,y-.006,z+.01),(s*.20+.062,y,z)],.007,WHITE,'foot.'+side,'shoes')
    # Broad outside quarter panel and two stitched accents.
    x=s*(.20+.136)
    panel=[(x,-.12,.11),(x,-.04,.20),(x,.073,.19),(x,.08,.106)]
    add('shoe_side_panel_'+side,panel,[(0,1,2,3)],CYAN,'foot.'+side,'shoes')

tube('body_tail',[(0,.16,.63),(0,.31,.57),(.025,.48,.565),(.06,.615,.63),(.07,.688,.74),(.065,.71,.815)],[.114,.112,.083,.059,.036,.009],lambda i,v:blend(CREAM,PINK,max(0,(v.y-.53)/.18)),'tail',n=14)

# Preserve weighted source components, assemble only visible surfaces for the default outfit.
copies=[]
for o in parts:
    if o.get('covered_by_default_outfit'): continue
    c=o.copy(); c.data=o.data.copy(); runtime.objects.link(c)
    for m in list(c.modifiers): c.modifiers.remove(m)
    copies.append(c)
bpy.ops.object.select_all(action='DESELECT')
for o in copies:o.select_set(True)
bpy.context.view_layer.objects.active=copies[0]; bpy.ops.object.join()
body=bpy.context.object; body.name='sprout_body'; body['assembly']='default_outfit'; body['source_modules']='AUTHORING_MODULES'
m=body.modifiers.new('Skin','ARMATURE');m.object=rig
modules.hide_render=True; modules.hide_viewport=True
rig.animation_data.action=bpy.data.actions['idle']; scene.frame_set(1)
# Save a neutral, softly lit source view. Two review renders only to conserve compute.
floor=bpy.data.objects['studio_floor']; fm=floor.data.materials[0]; fm.use_nodes=True
fm.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(.055,.09,.135,1)
fm.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.9
cam=bpy.data.objects['review_camera'];cam.location=(2.7,-5,2.55)
cam.rotation_euler=(Vector((0,0,1))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.ortho_scale=2.55
scene.camera=cam; scene.cycles.samples=32;scene.render.resolution_x=900;scene.render.resolution_y=900
scene.view_settings.view_transform='AgX'; scene.view_settings.look='AgX - Medium High Contrast'
bpy.ops.object.select_all(action='DESELECT');body.select_set(True);bpy.context.view_layer.objects.active=body
scene['pipeline_contract']='character-contract-v0.2'
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE/'sprout-refined.blend'))
from export_character import export_character
export_character()
if '--no-render' not in sys.argv:
    for label,pos in [('hero',(2.7,-5,2.55)),('front',(0,-5,1.6))]:
        cam.location=pos;cam.rotation_euler=(Vector((0,0,1))-cam.location).to_track_quat('-Z','Y').to_euler()
        scene.render.filepath=str(EVIDENCE/(label+'.png'));bpy.ops.render.render(write_still=True)
print('REFINEMENT_COMPLETE')
