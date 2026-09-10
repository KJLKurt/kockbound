# Acceptance evidence

Milestone and criterion IDs: M3 V02 projectile presentation; client networking integration.
Build/revision and content release:0.12.6, D83; no authoritative/schema change.
Date, tester and environment:2026-09-10, agent, Windows Node24.19.0, isolated Chrome.
Runtime/browser/device, viewport and network profile: QA4181 at929x917/390x844; actual loopback WebSocket adapter check.
Scenario/config/seed: shared pure client sampler blends existing shot positions and rolling distance. Local ItemView uses previous/current+alpha; RemoteBuffer uses its existing buffered display interval. New QA Projectile motion fixture advances ordinary simulation at20Hz and renders intermediate frames for three shot kinds, looping when expired.
Expected outcome: interpolate existing projectiles without extrapolation, state mutation, resurrecting expired shots, or backward jumps as new remote shots enter history.
Observed outcome:19 targeted tests passed after final buffered-spawn refinement. Tests verify midpoint positions in actual instance matrices, retained latest hit records, bounded alpha, current-only membership, no state mutation, local new shots, buffered remote birth and terminal cleanup. Initial candidate showed latest new shots before the buffered interval; code review identified a potential backward jump, so that candidate was refined before delivery. No failing-before reproduction is claimed for this increment.
Status: PASS for targeted behavior/integration and sampled visuals.
Commands actually run:

- Node --test tests/item-rendering.test.ts tests/network-client.test.ts tests/ranged.test.ts: final19/19 passed12.56s, session96426.
- Strict typecheck: passed, session34358, includes final QA fixture.
- Node tools/build.mjs: final passed, session36947 (earlier60002 build superseded).
- Node --test --test-name-pattern='browser OnlineSession adapter' tests/transport.test.ts:1/1 passed76.59s, session9027, actual loopback round.
- CLI open/projectiles-moving.js/console/screenshots. Final console appended below.

Screenshot/recording/log paths:

- [Desktop moving-projectile fixture](../../../output/playwright/projectiles-moving-desktop.png)
- [Phone-size fixture](../../../output/playwright/projectiles-moving-phone.png)
- [Reduced-motion fixture](../../../output/playwright/projectiles-moving-reduced.png)

Performance measurement method and sample: no frame-time benchmark; screenshots verify shapes/layout at sampled frames, tests verify intermediate positions. Existing QA header covers part of the phone scene; this is not normal game UI.
Limitations and next action: online new shots can wait for the existing buffered display interval, consistent with remote-player presentation; latest removal still takes precedence. No physical-phone/latency-comfort approval or current full-suite claim. Prior full100 predates rotor and projectile changes. Main4179/session35734 unchanged; source refresh and final dist contain the change. Continue remaining natural item and pose/device review.

Previous goal turn classification: progress through retained and verified rotor animation improvement. Goal remains active.

Final browser console after reload: zero errors/warnings. Isolated browser cleanup requested; production preview remains running.
