# Acceptance evidence

Milestone and criterion IDs: M3 phone input reliability, interruption/recovery coverage.
Build/revision and content release: 0.12.6; client-only, D81.
Date, tester and environment: 2026-09-10, agent, Windows Node24.19.0.
Runtime/browser/device, viewport and network profile: DOM event-surface regression; no physical device or new browser walkthrough.
Scenario/config/seed: joystick capture throws because the pointer is no longer active; no pointerup reaches the pad; a second, valid pointer tries to steer.
Expected outcome: failed gesture remains neutral and relinquishes ownership so the next touch works.
Observed outcome: before fix, test failed0!==1 for the second touch and reported the uncaught capture exception. After fix, catch clears pointer ownership, input and knob state, then returns without moving. Second touch steers normally and releases cleanly. Normal captured gestures remain covered by the existing simultaneous movement/aim/action and cancellation/rotation tests.
Status: PASS for the reproduced recovery case and targeted checks.
Commands actually run:

- Node --test --test-name-pattern='rejected joystick capture' tests/touch.test.ts: failed before fix.
- Node --test tests/touch.test.ts tests/camera.test.ts tests/item-aim.test.ts:11/11 passed in4.22s.
- Node node_modules/typescript/bin/tsc --noEmit: passed, session77819.
- Node tools/build.mjs: session75747; final outcome appended below.

Screenshot/recording/log paths: regression and command output in this task; no visual appearance change.
Performance measurement method and sample: none.
Limitations and next action: synthetic capture rejection proves recovery logic, not the frequency of rejection on real phones. The earlier canvas capture issue motivated checking this path, but no physical joystick failure was reported by the user. No fresh full-suite or phone claim. Main preview server35734 remains running; source changes load on refresh. Prior turn was progress through narrower normal crate/spectator evidence; successful crate collection remains open.

Final packaged build: passed (session75747 exit0). No preview restart was required for this client-only source change.
