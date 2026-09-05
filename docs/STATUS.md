# Project status

Updated 2026-09-05.

Current milestone: M0 bootstrap plus an explicitly authorized one-character Blender pipeline proof. Gameplay M1 onward remains unimplemented. No Cloudflare deployment or payment integration. Two pinned dependencies exist only for isolated asset validation/preview.

Completed asset increment: one editable Sprout-derived prototype, GLB, provisional shared rig/socket contract, three proof clips (idle/run/dash), procedural builder, source/export checks, negative validation cases, fresh Blender reimport, Khronos validation and isolated Three.js browser preview. See [character contract](CHARACTER_ASSET_CONTRACT.md), [repeatable commands/handoff](../tools/asset-pipeline/README.md), and [evidence](../tests/evidence/asset-pipeline/README.md).

Measured final export: 10,738 triangles, two materials, 20 deform bones plus root/13 sockets, 445,344 bytes. Khronos: zero errors and zero warnings. Three.js verifies skin, clip/bone names, bounds, fixed root and metre/axis fixture. Blender source viewport and timeline playback inspected with Computer Use after opening a separate working window; original unsaved scene preserved. Browser run/dash/idle and gameplay-distance/light/dark views inspected. No new raster concept generation or external production asset was used.

Limitations: provisional species/rig, disconnected rigid-weight limb parts, unfinished deformation/foot contacts/facial expression, seven missing production clips, no fitted accessories, crowd/performance test or outside approval. V01 and production gates remain incomplete. The client is still documentation-only; the preview is tooling, not game implementation. Next asset agent should copy the existing rig/source and follow the contract, not rediscover or rebuild it. Any additional characters need a new assignment.

Completed: source recovery of all 89 text sections; later design amendments; canonical game/architecture/content/art/audio/Blender/implementation specs; constitution; milestone and acceptance plan; repository ownership scaffold; all ten historical concept PNGs exposed by the branch gallery with provenance/hashes; bootstrap validation utility.

Historical source excerpts are truncated and labeled. All 89 text topics were subsequently read through the browser and mapped. The branch follow-up recovered the remaining eight images by opening the media viewer. See [the gallery](CONCEPT_ART_GALLERY.md) and [branch details](BRANCH_DESIGN_ADDENDUM.md) for character alternatives, boss attacks/objectives, host settings, local/social play, mobile concepts and seasonal recipes. Image-retrieval limitation is resolved for the observed ten-image gallery.

Next authorized implementation assignment should be M1 as written in HANDOFF.md. Pick and pin compatible tooling, create pure simulation and local bot prototype, run P01–P07, then stop for a milestone handoff.

Historical bootstrap validation passed (19 required artifacts, all 89 source sections, 105 local links, valid JSON planning metadata); that recheck is recorded in tests/evidence/M0-bootstrap.md. Gameplay gates remain NOT RUN. Limited asset checks now have separate pipeline evidence above; no assets are production-approved.

Branch recovery validation is recorded separately in [M0 branch recovery evidence](../tests/evidence/M0-branch-recovery.md). No game implementation was added.
