# Acceptance evidence

Milestone and criterion IDs: complete configured automated regression, including P01–P06, N01–N06 coverage and M3 input/rendering/audio logic.
Build/revision and content release: current working tree0.12.6, after D80 bot escape and D81 joystick capture recovery.
Date, tester and environment: 2026-09-10, agent, Windows Node24.19.0.
Runtime/browser/device, viewport and network profile: Node test runner, real loopback WebSockets plus simulated latency profiles; no new browser/device walkthrough.
Scenario/config/seed: package.json test command's complete file list, executed with the pinned Node executable. Includes ten four-client WebSocket matches,20seeded bot rounds,10,000-tick replay, item/hazard/input and rendering logic checks.
Expected outcome: all configured tests finish without regression after the latest changes.
Observed outcome:100passed,0failed,0cancelled,0skipped,97.8570618seconds. Ten four-client WebSocket rounds agreed on results; test logged14,519,800snapshot bytes. Both new regressions pass within the full suite.
Status: PASS for configured automated suite, not blanket milestone or release acceptance.
Commands actually run: pinned Node wrapper reads package.json scripts.test arguments and spawnSyncs the same pinned executable, inheriting output redirected to full-tests.txt. Session27273 exited0. No test process remains.
Screenshot/recording/log paths: [Full test output](full-tests.txt).
Performance measurement method and sample: test duration is not frame time; no new rendering benchmark.
Limitations and next action: physical-phone controls/performance, subjective pose/tool readability, normal crate collection and outside testers remain open. Prior targeted strict typecheck/build passed; neither needed repetition because game code was unchanged in this turn. Worker contract mocks do not certify native workerd startup. No deployment or commerce performed. Next concrete gameplay/presentation work rather than another unchanged full-suite run.

Previous goal turn classification: progress, because it fixed and verified a reproduced joystick recovery failure. This turn adds broader integration evidence and updates the current requirement review.
