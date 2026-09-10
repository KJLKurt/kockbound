# CPU frame diagnostic

Date/tester/environment:2026-09-09,Codex,Windows desktop in-app Chromium,390×844 low quality,reduced motion off. Same expanded stress scene as M3-expanded-performance. Two30-second diagnostic samples after5-second warmup; these are not the3-minute V04 acceptance sample or actual-phone evidence.

Added opt-in profiling to ArenaView, disabled in the normal game. Performance timestamps split scene/animation/HUD preparation from the call to Three WebGLRenderer.render. The QA runner records fixture preparation, whole render-call CPU and complete callback CPU; it also offers a30-second diagnostic button alongside the unchanged180-second sample option. Report sorting/DOM work is included in callback time. No gameplay or artwork changes.

Initial:1,527frames,p95 frame33.4ms/render CPU15.1ms/fixture1.6ms/callback16.4ms,hidden0 (initial.json). Split follow-up:1,462frames,p95 frame33.5ms/scene6.3ms/submission14.7ms/render18.8ms/fixture2ms/callback20.3ms,hidden0 (split.json). Independent percentiles must not be added. Development typecheck/build ran during the split sample and desktop workload was uncontrolled, so magnitudes are diagnostic rather than a controlled comparison.

Finding: WebGL submission is the largest measured CPU region, with nontrivial scene preparation too. This does not isolate GPU execution: renderer.render includes scene matrix updates, traversal, driver work and potentially stalls. It supports investigating that region rather than assuming animation or the QA fixture alone explains the cadence. No FPS improvement or hardware acceleration diagnosis claimed. Next: isolate submission work/GPU timing or compare stable scene complexity before further broad optimization.

Checks: strict typecheck passed. Static build tracked separately. Both observed samples completed; no benchmark left running. QA tab14 will be closed and viewport reset after recording. Full goal active.

Final static build exited0 (session95813). Browser error log empty. QA14 closed, viewport reset and main11 retained.

## Matrix/backend follow-up

Opt-in profile now separately times the scene matrix update normally performed inside WebGLRenderer.render. It performs that same update once before submission and restores matrixWorldAutoUpdate in finally; normal gameplay retains its original path. A30s/5s-warmup sample with no agent compilation running completed1,560frames: frame p9533.3ms,scene4.7ms,submission10.5ms (includes matrices),matrices1.8ms,fixture1.5ms,callback14.2ms;hidden0 (matrix.json). Matrix updates are not the dominant measured portion, so this does not justify a broad static-transform rewrite. Background system activity still uncontrolled; not V04 or phone evidence.

The QA report now exposes its actual graphics backend and GPU timer capability. Browser15 reported `ANGLE (Intel, Intel(R) UHD Graphics (0x000046D2) Direct3D11 vs_5_0 ps_5_0, D3D11)` and gpuTimerAvailable=true. This is backend capability evidence, not an execution-time measurement. Next use asynchronous GPU queries around submission to distinguish GPU work from driver/CPU overhead. No graphics-driver settings changed.

Final follow-up strict typecheck/static build passed (session23779). Browser error log empty; QA15 closed, viewport reset, main11 retained.

## Asynchronous GPU follow-up

Added optional GpuTimer used only by the QA runner. It wraps renderer submission with EXT_disjoint_timer_query_webgl2, polls availability on later frames, caps pending queries at8 and deletes resolved/disjoint queries. No synchronous waits/finish calls. Regular gameplay does not instantiate it. Unit test verifies capped pending work, no premature result reads, nanosecond conversion, disjoint discard/reset and unavailable extension fallback. Test passed; initial typecheck caught Three's legacy WebGL1|2 union, corrected using the pinned renderer's explicit WebGL2-only contract, and final typecheck passed.

Paired30s/5s-warmup sample at390×844 low quality:1,516frame samples and1,516GPU samples,zero pending/discarded/hidden at completion; GPU p956.287ms,CPU submission14.1ms,scene3.9ms,matrices1.3ms,whole callback18.7ms,frame33.5ms (gpu.json). No agent compilation ran during collection. This suggests CPU/driver-side submission overhead is the larger optimization target on this Intel UHD/D3D11 desktop. Separate percentiles are not additive; GPU timers and wrapping affect timing, and this does not identify one expensive Three call or establish real-phone performance. Next focus CPU-side draw/material/object overhead, retaining measured presentation fidelity.

Final static build passed (session63215). Browser error log empty; QA16 closed and viewport reset, main11 retained. No diagnostic sample remains running.
