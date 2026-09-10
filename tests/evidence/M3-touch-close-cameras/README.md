# Acceptance evidence

2026-09-10. Normal preview4179, Windows headed Chrome with two-contact touch emulation,390x844, CLI0.1.19. Compatibility0.12.6. Scope: simultaneous movement and camera look in both first/third-person views. No game code change or hidden simulation inspection.

Method: choose camera through normal settings, start a solo round, wait through countdown. Touch1 holds the joystick35px upward. Touch2 starts on unobstructed arena at250,420 and drags70px right. Capture before/after. Remove touch2 using the active touch-point list, then end all contacts. Read actual knob style and document pointer-lock state, pause and leave round. Repeat for the other camera.

Results: PASS for both browser integration scenarios. During look drag and after only look contact releases, knob remains translate(0px,-35px). Releasing all contacts clears it. Pointer lock stays false. All four screenshots inspected: camera bearing changes while moving; third-person avatar remains visible and first-person body stays hidden. These are visual/event-path observations, not exact yaw or movement-speed measurements. Normal bots move during the capture interval. No physical-phone result claimed.

Artifacts: output/playwright/touch-close-cameras.js; touch-third-before.png, touch-third-turned.png, touch-first-before.png, touch-first-turned.png. Current CDP touch semantics follow M3-browser-multitouch. Final console/cleanup below. No new automated test/build for unchanged game code; full104 baseline remains current.

Previous goal turn was progress through normal-browser joystick+Dash coverage. This turn adds both close-camera touch combinations relevant to the user's camera feedback. Physical-phone controls/performance and outside-tester gates still need external observations. Pending crate question stays open; do not duplicate. Main4179 unchanged.

Final browser console:0errors/0warnings.
Cleanup confirmed: isolated browser39965 closed successfully; main4179 unchanged.
