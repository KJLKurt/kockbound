# Acceptance evidence

2026-09-10, normal game4179, Chrome touch emulation390x844, isolated headed CLI0.1.19. Compatibility0.12.6 unchanged. Scope: production joystick and Dash event wiring with two simultaneous browser touch contacts. No simulation/state injection or game code changes.

Corrected result: while joystick was held45px upward, a second contact pressed Dash. Knob retained translate(0px,-45px) and Dash label changed to “Dash in1.1s”. Releasing only the Dash contact retained the same knob displacement and cooldown continued to1.0s. Releasing all contacts cleared the knob style. This confirms independent pointer ownership through the normal browser event path; it does not certify a physical phone, camera aiming or measured movement speed under bot collisions.

Initial test mistakenly sent touchEnd with a nonempty point list and the joystick reset. This is rejected test evidence, not a game bug. The [Chromium protocol documentation](https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-dispatchTouchEvent) specifies empty lists for touchEnd/touchCancel and changed active points for start/move. Corrected test used touchMove with only the retained joystick point, then touchEnd with no points. Corrected result above passed without a production fix.

Scripts: output/playwright/touch-round.js (invalid partial-release step), touch-round-corrected.js (final). Captures: touch-round-corrected-before.png, touch-round-corrected-moving.png. Normal solo game with bots; DOM bounding boxes located joystick/Dash. CDP Emulation enables two touch points; Input.dispatchTouchEvent generates browser gestures. Pause used between review calls. Final console/cleanup below. No build or new automated suite run for unchanged game code;104-test baseline remains applicable.

Previous turn was progress via controlled crate keyboard path. This normal browser test adds touch integration evidence beyond unit tests while keeping the physical-phone gap explicit. Pending user crate question remains unanswered; do not duplicate it. Main4179 remains running. Next close-camera touch drag alongside movement and remaining human/device quality review.

Both corrected screenshots inspected: player moves from near center toward the north edge, knob stays displaced, cooldown visible. Final console0errors/0warnings.
Cleanup confirmed: isolated browser30949 closed successfully. Main4179 was not stopped or restarted.
