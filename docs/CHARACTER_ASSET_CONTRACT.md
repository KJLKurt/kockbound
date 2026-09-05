# Initial character asset contract · v0.1

Status: validated pipeline prototype, 2026-09-05. This is a reversible preproduction contract, not publication of the final rig.knockbound_v1 or approval of M3. Session scope explicitly authorized one character and pipeline work ahead of gameplay milestones. See [pipeline commands](../tools/asset-pipeline/README.md), [evidence](../tests/evidence/asset-pipeline/README.md), and [machine-readable rest rig/export metadata](../assets/runtime/character.sprout-prototype/r001/asset.json).

## Visual selection

Reviewed both original Sprout (`concept-02.png`) and Lumi (`branch-lumi-character.png`) in [the gallery](CONCEPT_ART_GALLERY.md). Sprout offers a broad six-fin silhouette, cream face and clothing-friendly compact body; Lumi offers taller ears and a contrasting orange scarf. Use the Sprout direction for this single proof, retain Lumi as an unresolved alternative for the eventual production selection. This is not a merged species or a final species name.

Retained: fan fins, warm cream face, blue/coral accents, hoodie, mittens, large sneakers and a small tail. Simplified: solid vertex palette, geometric face, no fabric textures or hair, no separately equipable outfit. Two main masses dominate. Head/body proportions follow the concept rather than the old untested 3.5-head default: about 2.6 head heights excluding fins, 2.9 including fins. Prototype height is 1.965 m including fins, head crown about 1.745 m, width 1.40 m including fins. Face and clothing remain readable in a single-character elevated-camera preview; actual multiplayer readability is not established.

## Scale, coordinates and collision

One unit = one metre. Blender: Z-up, X-right, character faces -Y. Runtime glTF/Three.js: Y-up, X-right, faces +Z; map `(x,y,z)` from Blender to `(x,z,-y)` once through the exporter. Ground root is `(0,0,0)` between the feet. Apply mesh transforms before binding; mesh and armature objects have identity transforms and positive unit scale. Never apply an extra 90-degree corrective rotation in client code. The 1 m cube and basis markers in the evidence fixture verify this independently of character bounds.

The simulation remains planar X/Z with the existing radius 0.45 m circle from IMPLEMENTATION_SPEC. No collision mesh, rigid body, capsule or art-derived bounds enters the simulation. Fins, shoes, tail and future accessories can extend beyond the gameplay circle. The preview ring makes this separation visible. Render root placement follows simulation position/yaw; animation never owns authoritative movement. Renderer-only height/bounds support camera and culling, not gameplay reach.

## Mesh, material and texture limits

Target ≤12,000 triangles, ≤4 material primitives, ≤64 deform bones, ≤4 normalized bone weights/vertex, ≤1 MiB uncompressed prototype GLB. Current export: 10,738 triangles, 5,491 exported vertices, two material primitives, 20 deform bones and 34 total joints including root/sockets; 445,344 bytes. No mesh compression or decoder dependency is needed at this size. Budgets are unprofiled initial ceilings.

One editable joined mesh contains disconnected modeled body/garment/face parts. `Color` is a BYTE_COLOR/CORNER attribute authored in sRGB, exported as glTF COLOR_0 with linear interpretation handled by Blender. Two Principled-compatible materials: matte roughness 0.68 and eyes roughness 0.25, metallic 0, opaque, no transmission. Palette: cream FFE4BB, blue 2879CD, cyan 59D5EA, coral F37F9B, navy 162D50, warm white FFF7E8. These are provisional art swatches, not team rules.

There are no external textures or required UVs in this profile. Future textured characters may use a packed 1K atlas with base color sRGB and normal/ORM linear; any such change needs a texture-aware validator and loader review before adoption. Studio light rigs, ground and cameras remain in `STUDIO_DO_NOT_EXPORT` and are excluded from GLB.

## Skeleton and bind pose

Rig ID `rig.knockbound_v1_prototype`. Source armature object `knockbound_rig`; source mesh `sprout_body` with an Armature modifier pointing at it. Mesh is a scene root, not parented beneath the armature object, to avoid glTF NODE_SKINNED_MESH_NON_ROOT. Blender logs a non-parented-armature warning during export; this single-rig profile has no instances, the modifier resolves the rig, and skin/bounds/animations pass independent importer checks. Do not generalize that warning exception to multiple armatures.

Copy the master armature in Object mode for compatible characters. Never rebuild the rest rig by eyeballing this table, rename bones, change roll, or apply armature transforms after binding. Exact head/tail coordinates, parents, deform flags, rest matrices and inverse bind matrices in Blender space are in asset.json. GLB skin accessors carry runtime inverse bind matrices. Edit-bone local Y points head→tail; pose translations use the bone basis, not world axes. Pose is a relaxed A stance with arms down/out and feet forward. Left `.L` is anatomical left, on Blender/runtime +X.

| Chain | Parent / names |
|---|---|
| Body | root → hips → spine → chest → neck → head |
| Arms, each side | chest → upper_arm.L/R → lower_arm.L/R → hand.L/R |
| Legs, each side | hips → upper_leg.L/R → lower_leg.L/R → foot.L/R |
| Secondary | hips → tail; head → gill.L and gill.R |

Only root and `socket.*` are nondeforming. Export all bones so attachments survive. Current surface parts use one rigid weight each: this proves skin transport and pose playback, not production shoulder/knee deformation. Upgrade topology and blended weights within the same bind rig before making tight fitted clothing. There are no finger bones, facial bones, morphs, IK controls or constraints. A later compatible control rig may bake down to this deform rig; any rest-pose change creates a new rig version.

## Attachment sockets

Sockets are nondeforming bones. Their origin is the published bone head, not its tail. Socket local +X is right, +Y is up and +Z is forward (Blender -Y); use the full published matrix, not just position. To attach at the head with Blender bone parenting, compensate Blender's tail-based parenting offset or use explicit matrices. In Three.js, parenting an Object3D at local identity to the loaded socket bone uses the bone head correctly.

| Socket | Parent | Rest head, Blender metres | Intended slot |
|---|---|---|---|
| socket.head | head | 0, 0, 1.76 | Hat/hair; keep fins clear |
| socket.face | head | 0, -0.39, 1.43 | Face ornament |
| socket.chest | chest | 0, -0.23, 0.94 | Chest badge |
| socket.back | chest | 0, 0.235, 0.94 | Back attachment; tail clearance |
| socket.waist | hips | 0, 0, 0.62 | Waist |
| socket.hand.L/R | hand.L/R | ±0.49, -0.04, 0.64 | Held presentation props |
| socket.leg.L/R | upper_leg.L/R | ±0.18, 0, 0.47 | Leg attachment |
| socket.foot.L/R | foot.L/R | ±0.20, 0, 0.16 | Shoe attachment |
| socket.trail | root | 0, 0.30, 0.15 | Trail emission |
| socket.aura | root | 0, 0, 0 | Ground aura |

Three.js r180 sanitizes dots in loaded bone names: `socket.head` → `sockethead`, `upper_arm.L` → `upper_armL`. Resolve the sanitized names deliberately, or traverse `userData.name` if present; do not assume getObjectByName accepts the source dotted name. The loader validator checks every expected bone. No actual accessories or compatibility loadouts were produced in this session. Socket presence is proved; fitted costume clearance remains a future gate.

## Animation contract

Lowercase exact action IDs: `idle`, `run`, `dash`, `hit`, `stunned`, `falling`, `eliminated`, `victory`, `emote_01`, `emote_02`. No dummy clips may stand in for missing work. The prototype validator requires exactly the implemented proof subset (idle/run/dash) and rejects unrelated action names; production readiness requires the entire list and transition/pose QA.

Author at 30 FPS, one Action per clip, fake user retained, baked transform animation, no NLA mixing required. Export all Actions, force sampling step 1, no scene-range truncation. Root translation/rotation remains constant. Idle and run loop. Dash is an action, normally LoopOnce with recovery to idle/run; the preview repeats it for inspection. Current exported durations are idle 2.033333 s, run 0.7 s, dash 0.633333 s. The pinned exporter includes the initial 1/30 s interval before frame 1; derive duration from the actual clip rather than assuming end-frame minus start-frame. Animation timing cannot redefine the gameplay dash active window.

Future hit/stunned/falling/eliminated/victory/emotes need authored durations, entry/exit behavior, and presentation event metadata. Do not invent events from mesh motion. There are no gameplay event markers in these proof clips. Production blend starting suggestion: 0.1 s crossfade, tune through gameplay; no transition quality claim is made here.

## Delivery and export rules

Editable source: `assets/source/blender/<asset-id>/*.blend`. Runtime: `assets/runtime/<asset-id>/<revision>/*.glb` plus asset.json. This prototype is `character.sprout-prototype/r001`, locally reviewable but not an approved immutable release. While iterating r001, export overwrites the same candidate path. Once published, create a new revision instead of replacing it. No release manifest or deployment is created here.

Run the pinned exporter from a saved source in a fresh Blender process. Export only RUNTIME with selected objects; GLB, +Y up, skins, normals, COLOR_0, all declared bones and Actions, custom properties. Exclude cameras/lights/morphs/UVs/tangents/textures in this profile. No negative scales, external resources, Draco/Meshopt, arbitrary extensions, or procedural shader dependencies. Export settings, Blender build, Khronos exporter version, source/export/script hashes, bounds and counts are recorded in asset.json. Saved user edits are the source of truth; the builder is a reproducible starting point and must not overwrite a manually refined master unintentionally.

Validate source → export → Khronos validator → independent Three.js load → fresh Blender reimport → browser visual review. Asset scripts have no simulation, server, economy or networking dependency. In a future client, use GLTFLoader and AnimationMixer as the preview demonstrates, transform the entire loaded scene under a participant render container, and attach cosmetics to the loaded skeleton. For repeated participants, clone using SkeletonUtils.clone; ordinary Object3D.clone does not establish independent skin bindings. That multiplayer path has not been implemented or tested.

Reference behavior: [Blender glTF manual](https://docs.blender.org/manual/en/3.6/addons/import_export/scene_gltf2.html), [Three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html), [Three.js animation system](https://threejs.org/manual/en/animation-system.html). Exact settings were verified against the installed Blender 5.2.1 exporter RNA/source; generic documentation is not a substitute for the pinned profile.
