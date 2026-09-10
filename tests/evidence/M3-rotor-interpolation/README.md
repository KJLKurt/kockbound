# Acceptance evidence

Milestone and criterion IDs: M3 V01/V02 cosmetic animation and reduced motion.
Build/revision and content release:0.12.6, D82; client presentation change only.
Date, tester and environment:2026-09-10, agent, Node24.19.0 and isolated headed Chrome929x917.
Runtime/browser/device, viewport and network profile: localhost QA4181; synthetic Wisp/backward run/hat selected through visible controls.
Scenario/config/seed: unchanged authoritative tick rendered at two presentation times1/120second apart, then frozen time and reduced motion. Actual QA frames sampled with the hat equipped.
Expected outcome: rotor advances between authority ticks at unchanged10rad/s, freezes with presentation time, remains still for reduced motion, and never mutates simulation.
Observed outcome: regression failed before fix (“rotor advances between authority ticks”). ArenaView now supplies its elapsed presentation time to ItemView; other callers default to authority seconds. Regression passes for subtick motion, rate, frozen time, reduced motion and unchanged world. Browser frames show the intact hat/rotor; reduced mode keeps its fixed orientation. Screenshots are sampled poses, not a measured playback frame-rate claim.
Status: PASS for targeted animation behavior and sampled visual check.
Commands actually run:

- Node --test --test-name-pattern='item part batches' tests/item-rendering.test.ts: failed before fix.
- Node --test tests/item-rendering.test.ts tests/item-pose.test.ts:4/4 passed in3.61seconds.
- Strict typecheck: passed, session23751.
- Node tools/build.mjs: passed, session73793.
- CLI open/rotor-review.js/screenshots/console; final console result appended below.

Screenshot/recording/log paths:

- [Frame A](../../../output/playwright/rotor-frame-a.png)
- [Frame B](../../../output/playwright/rotor-frame-b.png)
- [Reduced motion](../../../output/playwright/rotor-reduced.png)

Performance measurement method and sample: none. The100-test full suite predates this change; no unchanged broad rerun claimed.
Limitations and next action: no physical-phone review or fresh user animation approval. This improves only cosmetic rotor timing, not remaining grip/backward-aim or normal crate collection evidence. Main4179/session35734 unchanged; source refresh and packaged dist contain the change. Prior goal turn was progress via repeatable pose controls and sampled visual evidence. Goal remains active.

Final console: one missing /favicon.ico404 on the QA page, zero warnings and no other reported errors.
