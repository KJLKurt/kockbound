# Asset pipeline evidence · Sprout r002

Validated 2026-09-05 after the refinement pass. The saved source is [sprout-refined.blend](../../../assets/source/blender/character.sprout-prototype/sprout-refined.blend); runtime is [sprout-prototype.glb](../../../assets/runtime/character.sprout-prototype/r002/sprout-prototype.glb).

The refinement adds a shaped face and smile, eye details, gradient fins, hood folds and drawcords, chest emblem, glove seams, layered shoes and continuous limbs while keeping the export at 11,415 triangles, two materials and 483,004 bytes (~472 KiB). Hidden `AUTHORING_MODULES/BODY`, `OUTFIT` and `SHOES` collections are assembled by `tools/asset-pipeline/assemble_character.py`.

Evidence:

- [hero render](hero.png)
- [front render](front.png)
- [browser run view](browser-run.png)
- [Blender viewport](blender-viewport.png)
- [Khronos report](khronos-validation.json)
- [Three.js loader report](loader-validation.json)

Checks: Blender source inspection and negative cases pass; fresh Blender GLB reimport passes; Khronos validator reports 0 errors and 0 warnings; Three.js loader verifies bounds, scale/orientation fixture, fixed root, sockets and idle/run/dash clips. Browser preview: `node tools/asset-pipeline/preview-server.mjs r002 4174`, then `http://127.0.0.1:4174/`.

This remains a preproduction proof. Final topology, facial rig, remaining clips, accessory variants and performance profiling are deferred.
