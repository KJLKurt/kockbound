# Blender production pipeline

Target workflow, not an installed exporter. Exact Blender/exporter versions and compatible options must be verified and pinned in M3 before producing assets. Editable masters remain .blend; runtime uses GLB/glTF. Three.js documents glTF as a runtime delivery format; correct origins and scale must be authored deliberately. [Three.js loading guide](https://threejs.org/manual/en/load-gltf.html).

## Directory and naming contract

assets/source/concepts/<asset-id>/ : selected references and decision notes.
assets/source/blender/<asset-id>/ : master .blend and authoring notes.
assets/source/audio/<asset-id>/ : editable audio masters.
assets/runtime/<asset-id>/<revision>/ : reviewed immutable exports.
tools/asset-pipeline/ : future repeatable validation/export scripts.
assets/ASSET_MANIFEST.csv : provenance and conversion record.

Use stable IDs, lowercase filenames, no absolute texture paths. Source files must retain editable topology, rig and materials. Generated runtime files record source revision, exporter version, settings and hash; do not hand-edit exports as the only source of truth.

## Coordinate and geometry defaults

New pipeline convention: one world unit = one meter; runtime Y-up, gameplay X/Z, runtime character faces +Z. Blender authoring is Z-up; verify one explicit exporter conversion with a meter cube, forward arrow and floor fixture. Do not apply a second corrective rotation in gameplay code. Character root origin is ground center; environment origin uses declared map origin; accessory origin matches attachment socket.

Apply intended mesh transforms before binding; avoid negative/mirrored runtime scale. Preserve armature/bind compatibility when exporting. Gameplay collider and map metadata export separately from decorative mesh. No accidental art mesh collider generation.

## Rig and cosmetics

Review both [Sprout and Lumi references](CONCEPT_ART_GALLERY.md) before finalizing the base. Preserve a written selection and silhouette comparison, rather than accidentally merging incompatible heads/proportions. Optional ear/tail bones must have declared rig compatibility and cosmetic clearances. For the Cloud King, test the concept's approximately six-player-height staging against actual camera occlusion, weak-point readability and rendering budgets before locking model scale; separate presentation scale from gameplay reach/colliders.

Publish rig.knockbound_v1 only after deformation/export review. Record bone names, rest pose, inverse bind matrices and attachment transforms. Root plus hips/spine/chest/neck/head, left/right arms/hands and legs/feet; exact bone table is an M3 deliverable. Do not invent a supposedly final skeleton in this bootstrap.

Rigid accessories attach to named sockets; skinned clothing uses the common skeleton and compatible bind pose. Sockets cover head/hair/face, torso/back, hands, waist, legs/feet and presentation trail/aura anchors. Publish socket transforms and slot compatibility.
Clothing definitions declare hidden body regions and incompatible overlapping items. Preview base + each cosmetic and representative combined loadouts. Check shoulders, knees, extreme dash/hit and victory poses.

## Animation export contract

Clip IDs: idle, run, dash, hit, stunned, falling, eliminated, victory, emote_01, emote_02.
Idle/run loop; action clips have declared duration, transition behavior and event markers. Gameplay animation is in-place. Presentation-only root/bone offsets must not move authoritative position. Bake supported transforms where needed, remove accidental unrelated actions, and check every clip after GLB import.
Default authoring sample rate 30 FPS; runtime blends independently. Retargeted external animation requires foot-contact, reach, clipping and identity review.

## Initial budgets (new targets; profile before locking)

| Asset | Starting budget |
|---|---|
| Base dressed character at gameplay LOD | ≤12,000 triangles, ≤4 material draws, ≤64 deform bones |
| Accessory | ≤2,000 triangles and ≤1 extra material draw |
| Sky Ring environment visible geometry | ≤100,000 triangles; instance repeated props |
| Character textures | Usually 1K atlas; 2K only with measured benefit |
| First-play compressed assets | ≤15 MiB; other cosmetics lazy-loaded |
| Desktop scene draw calls | ≤150 at 12 participants on reference fixture |

These are review thresholds, not verified performance. Record exceptions with measured frame time and visual benefit. LOD, compression and atlas choices must be validated with the pinned loader; do not ship unsupported extensions or assume compression is free.

## Repeatable export procedure

1. Resolve approved concept and provenance; verify source asset license before integration.
2. Open master with pinned Blender version and export profile. Check object names, scale/origin, materials, mesh topology, UVs, rig and clips.
3. Export only declared runtime collections; exclude cameras/helpers unless explicitly required.
4. Produce GLB plus metadata (bounds, triangle/material/bone counts, clip/socket IDs, rig version, hash and source revision).
5. Load in the actual game asset-preview scene. Check axes, scale, texture/color, lighting, animation and cosmetic fit.
6. Validate gameplay bounds separately; render turntable and arena screenshots, log exceptions.
7. Publish only passed exports into a release manifest; retain source and previous release for rollback.

Batch exports must fail clearly on missing objects/textures, unexpected bone changes, unsupported material features, invalid floats or missing clips. Two exports from the same pinned inputs must produce semantically equivalent asset metadata; binary hashes may vary if exporter metadata is nondeterministic, which must be recorded.

## Asset provenance

Prefer CC0, allow suitable attributed material with required notices. Verify each actual asset's license; a library name is not proof. Never copy proprietary game assets. Record original author/source URL, acquisition date, license evidence, modifications, source and runtime paths. Generated concepts record prompt/tool/date and reference provenance. No external assets are imported by this bootstrap.

Quality evidence must show the exported asset in the game, not only a Blender beauty render. Blender documentation could not be fetched during bootstrap; verify exporter details against the installed version during M3.
