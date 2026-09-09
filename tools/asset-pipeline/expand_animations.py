"""Create separate animation candidates from saved character masters; preserve original sources."""
import bpy, sys, math, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(Path(__file__).parent))
from export_character import export_character

def build(source,destination,revision):
    target=ROOT/destination
    refresh='--refresh-generated' in sys.argv
    assert not target.exists() or refresh, 'Candidate already exists; export saved edits instead of rebuilding over them'
    bpy.ops.wm.open_mainfile(filepath=str(target if target.exists() else ROOT/source))
    rig=bpy.data.objects['knockbound_rig']
    if refresh:
        assert rig.get('animation_candidate')=='m3-library-v1'
        rig.animation_data.action=None
        for clip in list(bpy.data.actions):
            if clip.get('candidate')=='m3-library-v1':bpy.data.actions.remove(clip)
    rig['revision']=revision;rig['animation_candidate']='m3-library-v1'
    def raised_arm(side,out=.45,up=.8,forward=-.15):
        bone=rig.data.bones['upper_arm.'+side]
        target=Vector((out if side=='L' else -out,forward,up)).normalized()
        local=bone.matrix_local.to_3x3().inverted()@target
        return tuple(Vector((0,1,0)).rotation_difference(local).to_euler('XYZ'))
    def key(frame,pose):
        for bone in rig.pose.bones:
            bone.rotation_mode='XYZ';bone.location=(0,0,0);bone.rotation_euler=(0,0,0);bone.scale=(1,1,1)
            if bone.name in pose:bone.rotation_euler=pose[bone.name]
            if not bone.name.startswith('socket.'):
                bone.keyframe_insert(data_path='location',frame=frame)
                bone.keyframe_insert(data_path='rotation_euler',frame=frame)
    def action(name,poses,loop=False):
        assert not bpy.data.actions.get(name), 'Unexpected existing authored clip '+name
        clip=bpy.data.actions.new(name);clip.use_fake_user=True;clip['loop']=loop;clip['candidate']='m3-library-v1';rig.animation_data.action=clip
        for frame,pose in poses:key(frame,pose)
        return clip
    recoil={'chest':(-.28,0,.07),'head':(.18,0,-.08),'upper_arm.L':(-.55,0,-.25),'upper_arm.R':(-.5,0,.25),'lower_leg.L':(-.15,0,0),'lower_leg.R':(-.15,0,0)}
    action('hit',[(1,{}),(3,recoil),(7,{'chest':(-.12,0,-.04),'head':(.12,0,.04)}),(13,{})])
    action('stunned',[(1,{'chest':(-.12,0,-.08),'head':(.15,0,.13)}),(9,{'chest':(-.14,0,.08),'head':(.16,0,-.13),'upper_arm.L':(-.22,0,0)}),(17,{'chest':(-.12,0,-.08),'head':(.15,0,.13)}),(25,{'chest':(-.14,0,.08),'head':(.16,0,-.13)}),(33,{'chest':(-.12,0,-.08),'head':(.15,0,.13)})],True)
    flail={'chest':(-.16,0,0),'head':(-.15,0,0),'upper_arm.L':raised_arm('L',.9,.35),'upper_arm.R':raised_arm('R',.9,.15),'upper_leg.L':(.3,0,0),'upper_leg.R':(-.3,0,0),'lower_leg.L':(-.5,0,0),'lower_leg.R':(-.1,0,0)}
    flail_other={**flail,'upper_arm.L':raised_arm('L',.9,.15),'upper_arm.R':raised_arm('R',.9,.35),'upper_leg.L':(-.3,0,0),'upper_leg.R':(.3,0,0),'lower_leg.L':(-.1,0,0),'lower_leg.R':(-.5,0,0)}
    action('falling',[(1,flail),(9,flail_other),(17,flail),(25,flail_other),(33,flail)],True)
    slump={'chest':(.4,0,0),'head':(.3,0,.15),'upper_arm.L':(.25,0,0),'upper_arm.R':(.25,0,0),'upper_leg.L':(.25,0,0),'upper_leg.R':(.25,0,0),'lower_leg.L':(-.35,0,0),'lower_leg.R':(-.35,0,0)}
    action('eliminated',[(1,flail),(9,slump),(25,{**slump,'head':(.4,0,.12)})])
    cheer={'chest':(-.12,0,0),'head':(-.12,0,0),'upper_arm.L':raised_arm('L'),'upper_arm.R':raised_arm('R'),'lower_arm.L':(.2,0,0),'lower_arm.R':(.2,0,0)}
    action('victory',[(1,{}),(8,{'chest':(.15,0,0),'head':(.1,0,0)}),(17,cheer),(25,{**cheer,'chest':(-.07,0,-.08),'head':(-.1,0,.1)}),(33,{**cheer,'chest':(-.07,0,.08),'head':(-.1,0,-.1)}),(41,cheer),(49,{})])
    wave={'upper_arm.R':raised_arm('R',.6,.65),'lower_arm.R':(.3,0,.25),'head':(0,0,-.12)}
    action('emote_01',[(1,{}),(10,wave),(16,{**wave,'lower_arm.R':(.3,.2,-.4)}),(22,wave),(28,{**wave,'lower_arm.R':(.3,.2,-.4)}),(34,wave),(43,{})])
    dance=[]
    for frame in range(1,62,6):
        phase=(frame-1)/60*math.tau*2;s=math.sin(phase)
        dance.append((frame,{'hips':(0,.06*s,.08*s),'chest':(0,-.08*s,-.1*s),'head':(0,.05*s,.12*s),'upper_arm.L':(-.5-.3*s,0,-.25),'upper_arm.R':(-.5+.3*s,0,.25),'upper_leg.L':(.12*s,0,0),'upper_leg.R':(-.12*s,0,0)}))
    dance[0]=(1,{});dance[-1]=(61,{})
    action('emote_02',dance)
    rig.animation_data.action=bpy.data.actions['idle'];bpy.context.scene.frame_start=1;bpy.context.scene.frame_end=61;bpy.context.scene.frame_set(1)
    bpy.ops.wm.save_as_mainfile(filepath=str(target));meta=export_character()
    assert not meta['missing_production_clips']
    print('ANIMATION_CANDIDATE_EXPORTED',meta['asset_id'],revision)

build('assets/source/blender/character.sprout-prototype/sprout-refined.blend','assets/source/blender/character.sprout-prototype/sprout-animated.blend','r003')
build('assets/source/blender/character.lumi-prototype/lumi-prototype.blend','assets/source/blender/character.lumi-prototype/lumi-animated.blend','r002')

