# Direct Chrome busy-arena performance

2026-09-10. M3 V04 measurement, current0.12.5. Isolated headed Chrome through PlaywrightCLI0.1.19/Node24.19.0; Windows IntelUHD ANGLE/D3D11. Previous turn: progress (actual direct mouse capture verification).

Normal existing synthetic stress fixture:12characters, held/ground/projectile items, warned tiles/holes, gust/rock cues and repeated effects. High quality enabled, soft1024shadows,1920x1080viewport and1652x929drawing buffer under retained pixel budget. Screenshot [direct-stress.png](../../../output/playwright/direct-stress.png) inspected; fixture labels make synthetic status explicit. No authority/audio load claim.

UI Measure3minutes button starts30second warmup then180seconds sample. Final10,757frames/GPU samples (~59.76FPS), p95frame16.9ms, GPU10.03ms, callback9.8ms. Hidden/discarded/pending0. Raw values in measurement.json. One QA favicon.ico404 at page load; no other browser errors/warnings. Do not report zero console errors.

Outcome: near60FPS reproduced in direct Chrome. Strict16.7ms V04target remains missed; notnative1080 or physical phone pass. CPU/GPU figures differ from in-app sample, but browser/run conditions differ, so no code optimization gain claimed. No production code change or reason to degrade visuals solely to chase a few tenths of a millisecond. Continue other concrete quality work; preserve this limitation in completion review.

Isolated browser closed after completion; main4179/session60040 and in-app37 unchanged, QA4181 server left available. No benchmark still running. Goal active.
