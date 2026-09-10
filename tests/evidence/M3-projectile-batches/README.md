# Batched ranged-item effects

Date/tester/environment:2026-09-09,Codex,Windows,Node24.19.0,Three0.180.0. Rendering-only, protocol/simulation0.12.0 unchanged. Partial V04 evidence; no physical-phone claim.

Change: shared instanced meshes render bubbles, rolling rocks and wind arcs in up to3 submissions. Capacity matches the authoritative/validated64-shot limit; wind holds192 arcs. Matrices retain original parent yaw, rock roll, bubble scale and each wind arc's translated/scaled placement. Empty batches hide, lobby hides the whole layer, and buffers persist across shot expiry instead of allocating per-shot scene objects. Per-instance frustum culling is traded for bounded batch submissions; offscreen shots may still submit triangles. No collision or targeting changes.

Checks: six targeted rendering/ranged tests pass, including comparison with the original parent/child transform construction,64 simultaneous wind shots, empty-batch cleanup and existing hit/cooldown/falloff rules. Additional reduced-motion rock assertion passed on rerun. Initial typecheck/static build passed; final test-only typecheck tracked below. Shared meshes/materials remain owned by ItemView.

Visuals: ranged fixture at1280×720 shows bubble, three wind arcs and rock with held weapons; expanded390×844 low-quality scene inspected. The18-projectile expanded fixture would previously submit30 projectile meshes when all visible, now3; this is draw topology, not a claimed FPS increase. Screenshots inline, not disk recordings.

Performance sample: same expanded synthetic load/method as M3-expanded-performance,30s warmup plus180s measurement. Running on retained tab13 at4181/qa; do not reload or change controls until complete. This measures desktop at phone dimensions and includes QA overhead/background workload; no hardware phone result.

Final strict typecheck passed after the reduced-motion test addition (session53019); static build passed (session65988). No full-suite rerun or audio listening claim in this increment.

Measurement completed:8,991frames,p95=33.4ms,zero hidden frames,max particles160/max pulses12; browser error log empty. benchmark.json stores observed output. This is effectively unchanged from the prior gust-batched33.4ms sample; no meaningful FPS gain claimed. Instantaneous draw counts vary with effects and are not phase-matched. Remaining work: investigate CPU/render/benchmark overhead rather than assuming additional draw batching solves frame pacing. QA13 closed, viewport reset, main11 retained.
