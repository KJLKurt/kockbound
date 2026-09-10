# Dynamic shadow cost comparison

Milestone/criterion: M3 V04 diagnostic, not full-duration acceptance.
Date/tester/environment:2026-09-09,Codex,Windows in-app Chromium,Intel UHD ANGLE D3D11,1920x1080 viewport and drawing buffer both runs. Compatibility0.12.1.
Method: existing QA high-quality toggle calls ArenaView.quality; at observed1x drawing resolution its pixel-ratio cap leaves resolution unchanged while switching shadowMap.enabled. Off then on, each5s warmup+30s expanded12character stress fixture, revised post-sample percentiles. No game code/asset changes or agent compilation during runs.
Observed: shadows off1,800frames/GPU,framep9516.8ms,GPU10.440ms,CPUsubmission7.7ms. Shadows on1,478frames/GPU,frame33.7ms,GPU15.375ms,submission12.3ms. Bothhidden/discarded/pending0 and browsererrors0. Comparison.json has main timings. Draw counts vary with fixture phase and are not paired counts.
Interpretation: strong diagnostic evidence that dynamic shadows contribute significantly to both GPU and submission cost at1080p. Sequential uncontrolled short samples do not establish precise causal delta or V04pass. Off16.8ms remains above strict16.7target and is only30s. No user quality preferences changed; toggle confined to QA.
Next: investigate cheaper shadow map/caster/update strategy while retaining intentional character grounding; measure and visually inspect tradeoff before changing default quality. Current sun2048map,PCFSoftShadowMap,30x30shadow frustum;12animated character casters. Phone low-quality already disables shadows.
Commands/evidence: browser normal QA controls and read-only report/logs; current quality/shadow source inspected. No new tests/build required for a read-only diagnostic.
Cleanup: QA29closed/reset after recording; main22lastready and4179session37497 unchanged. Goal active; broader device/gameplay/presentation/audio gates remain open.
