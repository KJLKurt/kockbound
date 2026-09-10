# Integration regression and packaged play check

Milestone/criteria: M2 authority/transport coverage; M3 V03/V05 partial packaged gameplay evidence.
Build/content: current working tree, compatibility0.12.1.
Date/tester/environment:2026-09-09,Codex,Windows,Node24.19.0,in-app Chromium390x844.
Scenario: full package test script after pickup, journal and remover changes; serve current dist with tools/dev-server.mjs0 --dist on61055 and play through normal UI.
Expected/observed: full90/90 tests pass, zero failures/skips,70.267seconds. Includes determinism, real four-peer ten-round WebSocket parity, reconnect/restart, audio, touch, camera, items/hazards/tiles, model/rendering regressions. See full-tests.txt; session22382exit0.
Packaged browser: assets loaded, countdown/active play, hazard notifications, elimination/spectator-disabled controls, pause/leave and a new round observed. Fresh-round dash accepted (Dash in1.1s). Joystick drags issued, but first round elimination overlapped the attempted dash, so that first dash is not claimed. A click during second countdown timed out on correctly-disabled control; next click after countdown succeeded. Logs empty. This is a functional check, not subjective control/balance or physical-phone approval.
Status: PASS for full suite and limited packaged smoke check; full goal remains active.
Commands: pinned Node package.json test list with output redirected to full-tests.txt; node tools/dev-server.mjs0 --dist.
Screenshots/recordings: inline screenshot of spectator state and AX output, no disk recording.
Performance: full test duration is not gameplay frame timing; no new frame/phone measurement.
Cleanup: QA25closed, viewport reset, temporary61055server89329stopped. Main4179authority37497 and main22lastready untouched.
Limitations/next: natural item collection/use, precise animation contact, headphone/speaker listening, outside playtests and physical-phone checks remain open. Existing V04 stress result does not meet desktop16.7ms target. Continue remaining gameplay/presentation/performance work; do not mark complete from passing suite.
