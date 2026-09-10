# Packaged load and memory observation

2026-09-10. V05 evidence, Windows desktop in-app Chromium,639x642,DPR1, local loopback without bandwidth/latency throttling. Compatibility0.12.5, packaged dist from latest completed build.
Previous goal turn: progress (98-test suite and actual10-round replay sequence).

Added opt-in --load-qa development-server route. It injects read-only Resource Timing/approximate Chromium heap report into ordinary packaged game; normal server/game is unchanged. It samples visible outcome transitions, with no simulation control or forced GC. Server routing test and strict typecheck passed. Instrumentation file is served only with explicit flag and is included in measured transfer.

Fresh unique origin http://127.0.0.1:64849, no-store responses: first ready observation1284ms,70resource entries plus navigation, transfer7,497,463bytes (about7.15MiB), encoded7,476,163, decoded13,576,551, zero-transfer entries0. Largest assets: harmony2,479,391bytes, rhythm2,235,130, spark1,309,091. Sample visible after11,743ms. This supports initial transferred size below15MiB in this environment; not phone-network latency. Play readiness is observed at250ms sampling resolution, not exact loader instrumentation. Audio is prefetched; first-click checks follow.

Memory observation started with normal round through UI. Approximate performance.memory may include shared-process allocations and uncollected garbage; no forced GC, no claim of exact retained memory. Final samples/results follow. No game balancing or outside-playtest approval inferred from idle-human rounds.

FINAL: ten ordinary rounds completed with memory recorded at each visible result; see measurements.json. Pre-play heap28,506,527bytes. Result samples19,630,333–32,901,223bytes; tenth23,593,253. A live post-result sample40,187,881 subsequently fell to25,808,376 in settled lobby at742,990ms, below pre-play. Allocated capacity grew from45,059,427 to84,580,896bytes. This run shows collection/reuse and no sustained used-heap growth, not proof that every allocation is leak-free. No forced collection, process isolation or retained-object analysis. Resource count70 and total transfer7,497,463 unchanged after all rounds; browser warning/error logs empty. Local human idle, no simulation mutation. This independently covers packaged first-load transfer and ten-cycle approximate heap observations.

Temporary tab38 closed and measurement server4758 stopped; main4179/session60040 and in-app37 lobby unaffected. Typecheck and existing server-routing test passed; no production client/asset change and no rebuild needed for opt-in server tool. Next: remaining natural item/control use, precise poses, listening, and physical-device checks. Goal active.
