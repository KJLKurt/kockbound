# Bounded 3D render resolution

Milestone/criteria:M3 V01/V04 presentation/performance support.
Build/content:workingtree,compatibility0.12.1 unchanged. renderPixelRatio caps3D drawing area at1,536,000pixels while keeping previous high1.75/low1 DPR caps. Resize recomputes budget and camera aspect; DOM UI remains native resolution. Sun1024PCFSoft retained.
Date/tester/environment:2026-09-09,Codex,Windows in-app Chromium,Intel UHD ANGLE D3D11.
Scenario:1920x1080viewport produced1652x929buffer,highquality;5s warmup30s expandedfixture.1799frames/GPU,framep9516.8ms,GPU11.133ms,renderCPU10.2ms,submission8.5ms;nohidden/discarded/pending/errors. Comparison to earliernative33ms samples is suggestive only; this is explicitly lower internal resolution, not native1080p or completed180s acceptance. Strict16.7target remains unproven.
Visual: close-camera characters, tile boundaries and soft grounding shadows readable at1920x1080; modest3D softness accepted as reversible default. Phone390x844resize preserves390x844buffer on observed1xdevice and screenshot inspected. UI/collision/input dimensions unchanged.
Checks: strictTypeScript passed; pinnedNode inline assertions verify390x844/844x390DPR3 retain high1.75/low1, large1920/3840/portrait displays stay withinpixelbudget. Staticbuild passedexit0. No freshfullsuite claim.
Evidence:profile.json, inline screenshots/report. QA33closed/reset;main22lastready,4179session37497unchanged.
Next: full-duration validation of this retained cap, accurately reportviewport vsdrawingresolution; still complete broader phone/naturalgameplay/animation/audio gates. Goalactive.

Full-duration follow-up: same1920x1080viewport/1652x929buffer/highquality/1024PCFSoft,30s warmup180s sample completed10,772frames/GPU (~59.84FPS). Framep9516.8ms,GPU11.16677,CPUcallback12.1,render10.2,submit8.4ms. Hidden/pending/discarded0/browsererrors0. sustained.json preserves values. No agent compile during measurement. This establishes sustained near60cadence on this desktop fixture, not physical-phone performance or native1080p rendering. Strict16.7ms target still narrowly exceeded; do not mark V04passed. QA34closed/reset after recording. Next broader normal gameplay/animation/audio review; avoid chasing0.1ms browser timestamp variation with further visual degradation.
