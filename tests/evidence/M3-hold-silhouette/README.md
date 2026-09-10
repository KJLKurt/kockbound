# Acceptance evidence

Milestone and criterion IDs: M3 held-item silhouette and animation review.
Build/revision and content release: 0.12.5 source QA; candidate reverted.
Date, tester and environment: 2026-09-10, agent visual review, isolated headed Chrome.
Runtime/browser/device, viewport and network profile: pinned Node 24.19.0, Playwright CLI 0.1.19; Windows Chrome at 929x917 and 390x844, localhost QA4181.
Scenario/config/seed: Camera aim practice and Moving hold pose synthetic fixtures. No normal game or saved user settings changed.
Expected outcome: outward upper/lower arm reach exposes the hand-held blaster beside the body.
Observed outcome: Sprout rest-rig numerical probe moved hand x from -.240 to -.393; y .901 to .925, z .310 to .280. Candidate added .7 outward to upper-arm direction and .25 outward to forearm direction, with outward perpendicular to reach yaw. Actual moving fixture still largely hides the blaster behind the character's head/body, including portrait view. Reverted both directions exactly; no retained runtime change.
Status: FAIL for candidate visibility improvement; PASS for restored rig regression.
Commands actually run: cached CLI open/click/run-code/console; Node inspect-bones.mjs; node --test tests/item-pose.test.ts (1 test covering all four rigs, passed, 2.87 seconds).
Screenshot/recording/log paths:

- [Baseline moving](../../../output/playwright/hold-before.png)
- [Candidate idle](../../../output/playwright/hold-outward-idle.png)
- [Candidate moving](../../../output/playwright/hold-outward-moving.png)
- [Candidate phone viewport](../../../output/playwright/hold-outward-phone.png)

The first candidate moving capture, hold-outward.png, actually shows the crowd scene because the click occurred before asynchronous asset loading installed handlers. It is not pose evidence; the later moving capture waited for the visible report to say aim. Final console inspection after reload returned zero messages; initial navigation had one error (not diagnosed in this turn).
Performance measurement method and sample: none. No new build or full suite needed after exact revert.
Limitations and next action: screenshots sample animation phases and synthetic content, not physical touch or all-character grip acceptance. Do not repeat the same outward-arm experiment. Next consider local character/tool occlusion treatment or a deliberate carry silhouette redesign; preserve normal hand attachment and gameplay collision.
