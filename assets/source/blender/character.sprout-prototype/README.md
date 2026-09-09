# Sprout pipeline prototype

Editable masters: [sprout-prototype.blend](sprout-prototype.blend) (r001 baseline) and [sprout-refined.blend](sprout-refined.blend) (r002 candidate). The refined source adds detail while preserving the shared rig and keeps hidden `AUTHORING_MODULES/BODY`, `OUTFIT` and `SHOES` collections for future swappable parts. Source generated with repository-owned Blender Python from the recovered Sprout concept direction, after comparison with Lumi. No external mesh, texture, animation, asset service or new image generation was used.

RUNTIME contains the mesh and rig. STUDIO_DO_NOT_EXPORT contains lights, camera and floor. Materials use vertex colors. Actions idle/run/dash are proof clips; missing production clips are explicitly recorded. Save edits before exporting; do not rerun the builder over a manually refined master.

Read [the complete contract](../../../../docs/CHARACTER_ASSET_CONTRACT.md), [commands and next-character handoff](../../../../tools/asset-pipeline/README.md), and [r002 evidence](../../../../tests/evidence/asset-pipeline-r002/README.md). The rest rig and socket matrices in [asset.json](../../../runtime/character.sprout-prototype/r002/asset.json) are authoritative for this candidate version.
