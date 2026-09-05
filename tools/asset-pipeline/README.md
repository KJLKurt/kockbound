# Blender → GLB → Three.js workflow

Start with [the character contract](../../docs/CHARACTER_ASSET_CONTRACT.md) and [evidence/limitations](../../tests/evidence/asset-pipeline/README.md). One Sprout-derived prototype exists; no finished catalog or game runtime is implied.

Pinned tools: Blender 5.2.1 LTS, build `9e2066aef7ef`, bundled Khronos glTF Blender I/O v5.2.40; Node 24.19.0; pnpm 11.19.0; Three.js 0.180.0; gltf-validator 2.0.0-dev.3.10. pnpm-lock.yaml records package integrity. Only two tooling dependencies; no client framework.

## Commands from repository root (PowerShell)

```powershell
$blenderExe = 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe'
$pnpmExe = 'C:/Users/Kurt/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm.cmd'
& $pnpmExe --dir tools/asset-pipeline install --frozen-lockfile --ignore-scripts

# Export SAVED edits; does not rebuild or overwrite the master.
& $blenderExe --background --factory-startup assets/source/blender/character.sprout-prototype/sprout-prototype.blend --python-exit-code 1 --python tools/asset-pipeline/export_character.py

# Fresh import, negative tests, and independent scale/axis fixture.
& $blenderExe --background --factory-startup assets/source/blender/character.sprout-prototype/sprout-prototype.blend --python-exit-code 1 --python tools/asset-pipeline/verify_blender.py
node tools/asset-pipeline/validate-glb.mjs

# Keep process running; open http://127.0.0.1:4173 in browser.
node tools/asset-pipeline/preview-server.mjs
```

Use installed equivalent paths on another machine, preserving versions. Node is on PATH here. The server listens only on loopback and serves the preview, selected asset and installed Three.js modules. No CDN, cloud account, deployment or paid API. Stop its terminal process with Ctrl+C when done.

Optional complete regeneration (overwrites prototype master and r001; preserve manual edits first):

```powershell
& $blenderExe --background --factory-startup --python-exit-code 1 --python tools/asset-pipeline/build_character.py
```

This creates one mesh, rig, three Actions, studio, source, GLB/metadata and four Cycles images. Four 900×900, 24-sample renders took about five minutes here. Re-export takes seconds; do not regenerate/rerender for documentation edits. .blend saves need not be byte-identical; counts, contract checks and loader behavior establish reproducibility. Source/export/script hashes identify actual inputs.

## Creating a compatible character tomorrow

1. Read STATUS, the contract and the Sprout/Lumi comparison. A new assignment must authorize another character; this handoff alone does not.
2. Copy the master to a new stable asset-ID source directory. Preserve exact armature rest transforms, bone names and Actions. Never regenerate over manual artwork.
3. Model around that rig and ground origin. Keep RUNTIME to one mesh and one armature for this profile. Apply transforms before skinning; keep Color and supported materials. Normalize weights, maximum four influences. Preserve editable topology.
4. Change the armature asset_id; preserve rig_id. The exporter derives the directory from asset_id, but filename/revision and preview/validator target are deliberately fixed to this proof. Parameterize them together for the next asset so the validator cannot accidentally check Sprout instead. New bind pose means new rig ID. Add source/runtime/provenance to ASSET_MANIFEST.csv.
5. Save source, export, run Blender verification and Khronos/Three validation. Fix source, never only GLB. Source checks reject budgets, missing sockets/clips, bad weights/transforms, helpers and unexpected payloads. This is a narrow asset profile, not the future content registry validator.
6. Inspect front/back/side, turntable, every clip, gameplay distance, bright/dark floor, silhouette, face, limb gaps and socket clearance. Preview includes animation selector, orbit, turntable, gameplay view, floor theme and pause. Forward arrow is +Z; ring radius is 0.45 m.
7. Record actual checks, hashes, screenshots, limitations and next step in STATUS/evidence. Candidate r001 may be overwritten during local iteration; published revisions must be immutable. Passing validation alone is not production approval.

## Access and recovery notes

No callable Blender MCP was exposed. Installed Blender Python (`bpy`, background CLI) reliably generated/saved/exported/reopened/reimported the asset. Prefer that precise path; no MCP add-on installation is needed.

Computer Use uses the computer-use skill (`@oai/sky` via node_repl), not the browser-only native-disabled CUA entrypoint. Enumerate windows, choose the exact source title, activate, inspect, act once and refresh. The original unsaved window accepted screenshots but clicks/keys had no visible effect. Do not treat silent success as proof or modify that user scene. Open the saved master in a separate Blender process: default Quick Setup Continue, dismiss splash, then viewport inspection and Space timeline start/stop worked. The original unsaved window was left intact.

Blender warns when the skinned mesh is a scene root rather than armature child. This one-armature/no-instance profile resolves the Armature modifier correctly and produces zero Khronos warnings; independent skin, bounds and animation checks pass. Do not generalize this exception to multiple rigs/instances. Factory reset during verification also logged denied user extension-cache writes inside the sandbox; required import/export still completed. No extension was installed.

Browser attachment was lost once when switching desktop windows; one replacement tab on the same browser restored inspection. Package installation initially failed EACCES; an approved network retry installed the two pinned packages. Export and validation are offline after installation.
