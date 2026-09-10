# Eye-shadow caster experiment — reverted

Milestone/criterion:M3 V04 diagnostic.
Date/tester/environment:2026-09-09,Codex,Windows in-app Chromium,Intel UHD ANGLE D3D11,1920x1080highquality1024shadowmap.
Source audit: four GLBs each use knockbound_matte and knockbound_eyes. Sprout matte5504vertices,eyes584. Original renderer enables casting/receiving on both. Decorative scenery meshes do not cast; tile batches and characters do.
Experiment: temporarily exclude only pure knockbound_eyes meshes from castShadow, preserving normal mesh and receiveShadow.30s expanded fixture after5s warmup,1678frames/GPU,framep9533.3ms,GPU13.190364ms,renderCPU10.5ms,submission8.7ms,scene2ms,callback11.1ms,hidden/pending/discarded0. Prior1024-map sample1706frames/frame33.2/GPU12.813. No useful measured improvement; host uncontrolled so no causal slowdown asserted.
Visual: close-camera screenshot inspected; character body shadows/eyes rendered, no obvious difference. No new acceptance claim. The renderer source was restored exactly to castShadow=true/receiveShadow=true for all character meshes. Previous dist already has this retained behavior; no rebuild/test needed for discarded code.
Status: experiment rejected; no retained game change. Evidence changes next action: focus shadow filtering/pass cost rather than tiny eye casters. QA31closed/reset after recording. Main22lastready,4179session37497 unchanged. Goal active; all broader quality/device gaps remain.
