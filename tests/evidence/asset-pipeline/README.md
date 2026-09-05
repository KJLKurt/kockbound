# Blender asset pipeline evidence

Milestone / acceptance: explicitly authorized preproduction pipeline increment alongside M0. A01 provenance and A04 exporter/loader budget checks demonstrated for ONE prototype; A03 missing clip/socket rejection demonstrated only within this exporter profile. V01, full A02/A03 and production A04 remain incomplete; M1/M2 gameplay tests remain NOT RUN.

Build / content: character.sprout-prototype/r001, rig.knockbound_v1_prototype, character-contract-v0.1. Exact source/GLB hashes and exporter settings: [asset.json](../../../assets/runtime/character.sprout-prototype/r001/asset.json).

Date / tester: 2026-09-05, Codex agent inspection. No external tester or user playtest approval.

Environment: Windows desktop; Blender 5.2.1 LTS build 9e2066aef7ef, Khronos exporter 5.2.40; Node v24.19.0, pnpm 11.19.0, Three.js r180, gltf-validator 2.0.0-dev.3.10. Chrome connected browser, captured content viewport 974×903. Loopback server, local files/modules; no gameplay network profile. Hardware reference-device performance is not established.

Scenario: generate one source, validate/export, reopen source, reimport GLB in a fresh Blender process, load via independent Three.js, validate coordinates with metre cube/basis markers, then inspect Blender and live browser. Expected: consistent scale/forward direction, visible palette, working skin/clips/sockets, no studio payload or validation error.

## Observed results

| Check | Result / evidence |
|---|---|
| Direct Python access | PASS: installed bpy generated/saved/exported/reopened source and reimported GLB across fresh processes |
| Native Computer Use | PASS after recovery: separate saved-source window responded to default setup, splash dismissal and Space playback start/stop; initial unsaved window did not respond and was preserved |
| Editable source | PASS: source opens with mesh, vertex colors, rig, three Actions, camera and studio |
| Budget guard | PASS: first 16,064-triangle build rejected; tessellation reduced before export |
| Final asset budget | PASS: 10,738 triangles, 5,491 GLB vertices, 2 primitives/materials, 20 deform / 34 total bones, 445,344 bytes, no images |
| Khronos validation | PASS: final zero errors, zero warnings; [full report](khronos-validation.json) |
| Three.js loader / root | PASS: all clip/bone names, skin attributes, exact counts, rest bounds, finite poses at five times/clip, fixed root; [report](loader-validation.json) |
| Scale / orientation fixture | PASS: 1 m cube and Blender -Y forward / Z-up become Three +Z forward / Y-up, without corrective rotation; [fixture](coordinate-fixture.glb) |
| Fresh Blender GLB import | PASS: 1.965 m height, mesh/armature imported; [report](blender-validation.json) |
| Negative cases | PASS: missing head socket, missing/unexpected clip and negative scale rejected before export; restored after each test |
| Browser render / motion | PASS: GLB visibly loaded; run, dash and idle selected; gameplay-distance and light/dark floor views; no game integration claimed |
| Production character gate | NOT RUN / incomplete: full clip library, blended deformation, fitted accessories, crowd fixture, performance and outside review |

Initial Khronos warning NODE_SKINNED_MESH_NON_ROOT was removed by making the source skinned mesh a scene root while retaining its Armature modifier. Blender logs a non-parented-armature warning; the single-rig/no-instance profile is explicit, and independent skin/bounds/animation checks passed. Do not ignore this for a future multi-rig scene. Verification factory resets also logged denied writes to the optional user extension cache; required checks completed successfully.

Commands actually run (from repository root, executable path as documented in [tooling README](../../../tools/asset-pipeline/README.md)):

```text
blender --background --factory-startup --python-expr <bpy version/exporter probe>
blender --background --factory-startup --python-exit-code 1 --python tools/asset-pipeline/build_character.py
pnpm install --ignore-scripts                         (in tools/asset-pipeline; approved network retry)
blender --background <master.blend> --python-exit-code 1 --python-expr <clear mesh parent; save; run export_character.py>
blender --background <master.blend> --python-exit-code 1 --python tools/asset-pipeline/verify_blender.py
node tools/asset-pipeline/validate-glb.mjs
node tools/asset-pipeline/preview-server.mjs
blender <master.blend>                               (separate GUI process)
blender --background --factory-startup <master.blend> --python-exit-code 1 --python tools/asset-pipeline/verify_blender.py
blender --background --factory-startup <master.blend> --python-exit-code 1 --python tools/asset-pipeline/export_character.py
node tools/validate-bootstrap.mjs
```

## Visual evidence and assessment

[Hero](hero.png), [front](front.png), [back](back.png), [elevated render](gameplay.png), [Blender source viewport](blender-viewport.png), [Blender timeline pose](blender-animation.png), [browser run](browser-run.png), [browser gameplay distance](browser-gameplay.png), [browser light-floor side/turntable](browser-turntable.png).

Reimport verification initially included Blender-generated bone-display widget meshes in bounds. The strengthened assertion caught this; the verifier now measures meshes with an Armature modifier and compares all six bounds coordinates with the exported rest metadata. Final fresh-process verification passed. `--factory-startup` before loading the master avoids reliance on local user preferences. Bootstrap checker passed with all 89 sections and ten original concepts intact; the link count reflects current documentation.

The broad fan-fin outline survives the elevated view; cream head, dark eyes and blue body separate clearly. Fin insets and cheek/mouth colors remain visible. The prototype reads as a friendly compact creature. This is agent judgment, not user approval. Faceted fin rims, mitten fingers, shoe construction and the simple open-mouth expression need art refinement. Rigid-weight limb parts can gap/intersect in stronger poses; foot contact is not polished. No facial animation, blended clothing deformation or retargeting was proved. The pale Cycles studio differs from the darker browser environment; palette transport is intact, lighting is deliberately independent of GLB.

Review images show the final geometry/palette. The source-parent-only fix occurred after Cycles rendering; it changes no resting geometry. Browser screenshots use the final GLB. No additional character, arena, cosmetic or production image generation was made. Floor/grid/arrow/cube are validation fixtures only.

Performance method/sample: asset size and primitive/triangle counts measured, five sample poses per clip checked, four 900×900 renders at 24 samples (~5 minutes total). No FPS, p95, crowd, phone, heap-growth or network-load benchmark was run. No claim that the 12-player performance budget has passed.

Next action: use [the documented source workflow](../../../tools/asset-pipeline/README.md) for an explicitly assigned compatible asset or refine this character's topology/weights and full animation library at the art gate. Keep gameplay milestones separate.
