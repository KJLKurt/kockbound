# 1080p expanded stress baseline

Milestone/criterion: M3 V04. Status: FAIL target16.7ms, measured33.7ms frame p95. Not a phone measurement.
Date/tester/environment:2026-09-09,Codex,Windows in-app Chromium,1920x1080 drawing buffer, high quality, reduced motion off. Backend Intel UHD ANGLE D3D11 recorded in benchmark.json. CPU inventory via Get-CimInstance returned access denied; CPU model not claimed.
Build/content: working tree compatibility0.12.1, after tile partial uploads/audio interruption feedback. QA27at4181/qa.
Scenario/method:12animated characters with held/ground items,18projectiles,hazard warnings/repeated effect events;30s warmup then180s measurement. Authoritative tick fixed for warning load; synthetic visual fixture, no simulation/audio load. No agent compilation during sample.
Observed:8,306frames/GPU samples, frame p9533.7ms, GPU16.603ms, sceneCPU2.6ms, renderer submission12.3ms (inclusive matrix0.9ms), render14.7ms, whole fixture callback19.8ms. Percentiles are not additive. Hidden0, pending0, discarded0, browsererrors0. No performance acceptance or optimization gain claimed.
Instrumentation caveat: QA sorts growing sample arrays for percentile display every250ms. Whole callback p95 grew through run; reporting overhead may contaminate frame cadence. GPU query wraps actual renderer call. Next make percentile reporting bounded/cached and compare measured runs with minimal reporting before interpreting all delays as game cost. Full-resolution GPU load also higher than previous small viewport sample, not solely CPU-limited.
Commands/screenshots: browser benchmark UI and read-only report DOM; no new tests/code/assets this increment; JSON preserves final report values. No screenshot required for numeric sample.
Limitations: uncontrolled desktop host, not physical-phone or human gameplay evidence. Full goal active; no narrowing to benchmark-only completion.
