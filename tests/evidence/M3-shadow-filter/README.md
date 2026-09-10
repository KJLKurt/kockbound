# Basic shadow filter candidate — rejected

Milestone/criteria:M3 V01/V04 visual/performance diagnostic.
Date/tester/environment:2026-09-09,Codex,Windows in-app Chromium,Intel UHD ANGLE D3D11,1920x1080highquality.
Experiment: temporarily replace retainedPCFSoft1024 with BasicShadowMap2048. Pinned shader source confirms basic uses one comparison. Larger map intended to preserve crisp edge detail. Changes tested through freshQA32;5s warmup30s expandedstress.
Observed:1568frames/GPU,framep9533.5ms,GPU14.241666ms,render12.7ms,submission10.7ms,callback14ms;hidden/pending/discarded0. No useful gain over retained1024PCFSoft sample(frame33.2,GPU12.813), not a controlled causality claim.
Visual: actual close camera screenshot shows jagged ground-shadow edges and conspicuous self-shadow stippling on antennae/ears/clothing. This fails intended smooth playful presentation. Candidate rejected; source restored to PCFSoftShadowMap and1024map. No runtime code retained; dist already retained configuration, no rebuild necessary.
Next: do not repeat basic-filter or eye-caster experiments. Review shadow-pass geometry work or adaptive resolution with explicit visual verification; frame target remains unmet. Also preserve broader natural gameplay/audio/device gates. Goal active.
Evidence: inline screenshot and report/tool output. QA32closed/reset after recording; main22lastready and4179session37497unchanged. No new tests/fullsuite claim.
