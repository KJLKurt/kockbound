# Acceptance evidence

Milestone and criterion IDs: gameplay bot behavior; P01 deterministic replay and P06 ordinary-rule rounds.
Build/revision and content release: 0.12.6, D80.
Date, tester and environment: 2026-09-10, agent, Windows Node24.19.0.
Runtime/browser/device, viewport and network profile: Node simulation tests and actual loopback WebSockets; no physical phone or visual change in this increment.
Scenario/config/seed: bot exactly at bomb/pod center, origins0 and3, full item slot; ordinary movement input. Cloned state confirms deterministic choice and result.
Expected outcome: choose a nonzero escape direction and move under ordinary rules.
Observed outcome: test failed before the fix with “bomb at 0: bot must choose an escape direction.” Existing vector subtraction returned0. The fix chooses inward movement for coincident/near-coincident centers, +X at arena center, then retains existing terrain checks and normalization. All four regression combinations pass and move away through step(). No additional RNG, teleport or immunity.
Status: PASS for this regression and targeted integration.
Commands actually run:

- Node --test --test-name-pattern='bots escape a coincident' tests/simulation.test.ts: failed before fix.
- Node --test tests/simulation.test.ts tests/pods.test.ts tests/items.test.ts:27/27 passed in14.49s. Includes10,000 recorded/replayed ticks and20seeded completed rounds.
- Node node_modules/typescript/bin/tsc --noEmit: passed, session2876.
- Node tools/build.mjs: passed, session88398.
- Node --test --test-name-pattern='browser OnlineSession adapter' tests/transport.test.ts:1/1 passed in39.79s, actual WebSockets.

Screenshot/recording/log paths: assertions and command output in this task; no screenshots needed for the unchanged presentation.
Performance measurement method and sample: no frame-performance claim.
Limitations and next action: deterministic movement does not guarantee surviving an imminent blast or solve all multi-hazard pathfinding. Full prior98-test run was0.12.5. Shared bot code applies to local and room authority; compatibility IDs bumped together without schema changes. Main4179 old session60040 stopped; replacement35734 announced ready. Existing clients should refresh.

The previous goal turn yielded useful rejected-pose evidence. This turn's side-camera idea was deferred before editing: converging the view from an offset position would change its yaw relative to the existing camera-relative input/aim contract. No camera or pose change was retained or claimed tested here. Continue natural gameplay and presentation review.
