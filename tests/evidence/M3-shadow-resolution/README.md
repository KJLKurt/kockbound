# Lower-cost dynamic shadow map

Milestone/criteria: M3 V01/V04 presentation/performance support.
Build/content: current working tree compatibility0.12.1; sun map2048 to1024, PCFSoft filtering/frustum/bias/update frequency retained. High-quality mode retains dynamic shadows; low-quality mode already disables them.
Date/tester/environment:2026-09-09,Codex,Windows in-app Chromium,Intel UHD ANGLE D3D11.
Scenario:1920x1080 expanded12character fixture,5s warmup30s diagnostic; close-camera aim fixture at1920x1080 then390x844.
Observed:1,706frames/GPU samples,framep9533.2ms,GPU12.813ms,renderCPU6.4ms,submission4.9ms;hidden/discarded/pending0/errors0. Prior2048shortsample frame33.7/GPU15.375/submit12.3. Host conditions uncontrolled, so exact performance delta not established. One quarter of shadow texels by construction. Frame target remains unmet; not V04pass.
Visual: close-view character ground shadows remain readable, mildly softer at1024. Desktop and portrait inline screenshots inspected; no missing shadow/obvious detached edge observed in these views. Dynamic motion/update cadence unchanged. No final art/human approval inferred.
Checks: strict typecheck/build command tracked session61742; final outcome below. No new unit test for reversible renderer configuration. No sound/simulation changes.
Evidence: profile.json and inline screenshots. QA30closed/reset; main22lastready,4179session37497unchanged.
Next: further shadow caster/submission optimization and representative performance validation while preserving visual quality. Full goal active, physical-phone and remaining gameplay/audio gates open.

Final typecheck and static build both passed, session61742exit0.
