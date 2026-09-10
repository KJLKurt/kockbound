# Acceptance evidence

Milestone and criterion IDs: M3 V01/V02 and A02 visual-review support; not full pose acceptance.
Build/revision and content release: current0.12.6; only tools/visual-qa.ts changed.
Date, tester and environment: 2026-09-10, agent, isolated headed Chrome, Node24.19.0 and PlaywrightCLI0.1.19.
Runtime/browser/device, viewport and network profile: localhost QA4181,929x917 then390x844.
Scenario/config/seed: explicit QA selectors for registered character, non-crate held item, and idle/left/right/forward/backward movement. Synthetic fixed-position locomotion with normal rendering; not a natural-match or touch test.
Expected outcome: reproduce each selected character/item/pose without browser game-state injection, preserving ordinary QA buttons.
Observed outcome: four left-strafe blaster character captures visibly changed the character correctly. Blaster remains occluded in this sampled view for all four, so it is not a single-character asset issue. Wisp backward rock and hat selections initially displayed the previous blaster model because all fixtures reused aim-gun ID; the new controls now use aim-${reviewItem} IDs, matching the renderer's stable-kind identity contract. Corrected phone captures show the rock and hat.
Status: PASS for review-control function and sampled corrected models. Overall grip/occlusion acceptance remains open.
Commands actually run: strict typecheck before and after fixture correction; isolated CLI open/snapshot/run-code/console and screenshots. First getByLabel exact locator timed out; refreshed snapshot showed valid accessible combobox names, and getByRole combobox worked. No production build/full-suite rerun needed for tool-only changes.
Screenshot/recording/log paths:

- [Sprout, left strafe](../../../output/playwright/review-sprout-left.png)
- [Lumi, left strafe](../../../output/playwright/review-lumi-left.png)
- [Pebble, left strafe](../../../output/playwright/review-pebble-left.png)
- [Wisp, left strafe](../../../output/playwright/review-wisp-left.png)
- [Corrected rock, phone](../../../output/playwright/review-rock-corrected.png)
- [Corrected hat, phone](../../../output/playwright/review-hat-corrected.png)

Earlier review-wisp-rock-back.png, review-phone-controls.png and review-wisp-hat-phone.png document the fixture identity defect and are not valid item-appearance evidence. The controls fit/wrap at390px and can collapse, but the existing QA header still covers the upper part of the scene; this is not the normal game layout.
Performance measurement method and sample: no benchmark. Initial navigation logged one error; final console status appended below.
Limitations and next action: five motion choices and nine held-item options exist, but only the listed samples were visually reviewed. Character palette/animation polish, precise grip across transitions and normal item collection are still separate. Use these controls for focused backward-aim and grip inspection; no physical-phone claim. Main4179/session35734 and user settings unchanged.

Previous goal turn classification: progress through full100-test integration evidence. This turn adds repeatable review controls and visual evidence, without claiming the full game goal complete.

Final strict typecheck passed (session49929 exit0). Final browser console after reload: zero errors/warnings. Isolated browser cleanup requested; no production server was restarted.
