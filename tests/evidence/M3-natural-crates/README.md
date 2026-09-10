# Acceptance evidence

Milestone and criterion IDs: M3 natural item interaction and phone-layout review; partial crate walkthrough.
Build/revision and content release: normal source preview0.12.6 at4179.
Date, tester and environment: 2026-09-10, agent, isolated headed Chrome with pinned PlaywrightCLI0.1.19 and Node24.19.0.
Runtime/browser/device, viewport and network profile: Windows Chrome390x844, localhost; physical keyboard events at phone dimensions, not physical touch.
Scenario/config/seed: selected crate+blaster, optional hazards off, Full arena, Sprout Classic through visible Settings; normal solo+3bots. No world mutation or debug fixture. Pauses between actions for inspection.
Expected outcome: approach crate, dash open, collect revealed blaster.
Observed outcome: initial spawn was a blaster. Second spawn was a crate on the left; approach displayed “Mystery crate · dash to open.” The following right dash crossed the contested area and crate disappeared, but local held HUD remained false; another character was next to it. No attribution of opening or reward collection is proven. Later north-side crate approach ended in local ring-out during a dash with a nearby rival; that crate visibly remained intact. Toast reported elimination, spectator label appeared and Dash was disabled. Do not attribute the ring-out to a specific unobserved collision.
Status: PASS for proximity cue and spectator transition; NOT VERIFIED for successful local crate opening/collection.
Commands actually run: isolated CLI open, settings clicks, run-code action scripts crate-start.js, crate-approach.js, crate-near.js, crate-open.js, crate-next.js, crate-fourth.js, crate-north.js and crate-north-open.js; screenshots visually inspected. No code changes or fresh automated tests.
Screenshot/recording/log paths:

- [First spawn](../../../output/playwright/crate-start.png)
- [Crate appears](../../../output/playwright/crate-second-spawn.png)
- [Proximity cue](../../../output/playwright/crate-near.png)
- [After contested dash](../../../output/playwright/crate-open.png)
- [Later north crate](../../../output/playwright/crate-fourth.png)
- [North approach](../../../output/playwright/crate-north-approach.png)
- [Ring-out, crate intact](../../../output/playwright/crate-north-open.png)

Performance measurement method and sample: none. Slow automation responses were polled on the same live handles; no timeout-based restart.
Limitations and next action: no uninterrupted human playtest, no physical-phone claim, no demonstrated successful crate collection. These contested outcomes do not establish a crate authority defect. Next direct gameplay check should seek a clearer uncontested pickup opportunity and capture the immediate crate-open toast before screenshots; avoid repeating this outcome as a pass. User's regular profile and main preview server unchanged.

Final browser console inspection: zero errors and warnings. Isolated session cleanup follows this inspection.
