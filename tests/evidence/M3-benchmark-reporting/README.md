# Percentile reporting outside measurement

Milestone/criterion: M3 V04 measurement reliability. Target remains FAIL at1080p (33.7ms vs16.7ms).
Build/content: QA-only working-tree change, compatibility0.12.1 unchanged. Normal game does not use this reporting.
Date/tester/environment:2026-09-09,Codex,Windows in-app Chromium/Intel UHD ANGLE D3D11,1920x1080 high quality, reduced motion off.
Change: percentile function returns null during warmup/measurement. It computes exact sorted percentiles afterward, cached by sample-array identity/length; delayed GPU samples can refresh final value. Raw sampling and sample duration unchanged. Source arrays are append-only within each run; new arrays on restart avoid stale cache.
Observed: live reports retained sample counts and null percentiles throughout; final report populated all values.30s warmup+180s sample:8,519frames and valid GPU samples, framep9533.7ms, callback14.9ms (prior19.8), render13.9, submission11.4 includingmatrix0.8, GPU16.319ms. No hidden/pending/discarded samples; browsererrors0. Raw final metrics in benchmark.json. No agent compile during measurement.
Interpretation: lower callback cost consistent with removed repeated sorts, but uncontrolled desktop run cannot assign exact delta. Frame target still missed; instrumentation overhead was not sufficient explanation. Next isolate high-resolution GPU/shadow cost and renderer submission. Do not claim game optimization or acceptance from QA-only change.
Checks: strict TypeScript passed. Browser full-duration check is relevant validation; no new implementation-mirroring unit test or normal dist build needed for tools-only code.
Cleanup: QA28closed and viewport reset after recording; main4179session37497/main22lastready unchanged. Goal active; physical-phone, natural gameplay and presentation/audio gates remain open.
