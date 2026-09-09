# Shovel, big mode and helicopter hat

Milestone/criteria: expanded playable item requirements 2/4/5/9; partial C02/C06 and presentation, not overall milestone approval.
Build/content: simulation, protocol and content 0.3.0; uncommitted workspace increment.
Date/tester/environment: 2026-09-08, Codex, Windows, pinned Node 24.19.0 / Three 0.180.0, in-app Chromium.

Scenario: deterministic passive item fixtures and real OnlineSession with all four registered items selected. Expected: shovel reaches beyond normal dash, big reduces blast impulse, timed transfers cannot refresh a passive, hat prevents one fall only and cannot override forfeit. Observed: all targeted assertions pass. Registered toggles and item models are visible. Disabling shovel survives browser reload; restored all four enabled after review.

Commands actually run: pinned Node --test tests/items.test.ts tests/simulation.test.ts (16 passed); complete package test command (51 passed, 87.881 seconds); tsc --noEmit; node tools/build.mjs. All exit 0. Full log: full-tests.txt. Baseline 20 seed outcomes unchanged; versioned replay digest a3ecd4fd9f52a3c000a3417519e6eb72bd3fc3b4eec57b3ecdee57a7161fcbbe. Green suite includes actual WebSocket integration and Worker source-contract mocks, not the failing native workerd runtime.

Visual QA: synthetic passive scene at 390×844 reviewed inline, showing shovel, enlarged character and helicopter/rotor pickup. Increased big label height afterwards; final rendering typecheck/build pass. Four-item settings screenshot inspected at ordinary desktop viewport; no overlap in shown controls. Screenshot files were not saved. No performance measurement in this increment.

Status: PASS for automated mechanics/build and observed settings persistence; human item interaction/feel, exact held-model alignment in every animation/camera, rescue animation quality, physical phone multitouch and hardware audio listening NOT RUN. Models are original code geometry with no external assets; rescue reuses the original score bank cue. Next implement remaining catalog and shared support tiles, then broaden interaction/balance/presentation review. Multiplayer preview restarted deliberately for 0.3.0 at port 4179, session 21057; normal LAN solo preview unchanged at 4183.
