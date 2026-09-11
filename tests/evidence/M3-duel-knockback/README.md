# Acceptance evidence

Milestone and criterion IDs: M3 gameplay tuning; P01 determinism, P03 hit buildup/recovery, P04 collision, P06 seeded rounds, N01 local/online parity.
Build/revision and content release: working tree, simulation/protocol/content 0.12.7, D86.
Date, tester and environment: 2026-09-10, Codex, Windows, Node24.19.0.
Runtime/browser/device, viewport and network profile: in-app Chromium1280×720, local solo4193; no physical-phone test.
Scenario/config/seed: controlled two-player exchanges, seed71, no items/hazards, neutral target, contact positions reset every80 ticks while preserving vulnerability. Old rule overrides versus new defaults. Separately, normal browser solo round with idle human and3 bots.
Expected outcome: first hit moves a target noticeably farther; four-second exchanges retain increasing vulnerability; delayed recovery remains available; deterministic and authority contracts preserved.
Observed outcome: old hit strengths7/7/7/7 and displacement2.023/2.023/2.023/2.023 units. Current strengths8.5/11.05/13.6/16.15 and displacement2.392/3.020/3.648/4.319. First displacement about18% larger, fourth about113% larger. Existing cap, one-hit-per-dash, cooldown, collision and recovery checks pass. All12 simulation tests passed, including10,000 replay ticks and20 seeded rounds. Other40 targeted authority/client/item/ranged/pod tests passed. New fixture initially used the wrong phase label ('playing' instead of 'active'); corrected test expectation, no production bug inferred.
Status: local candidate verified; user acceptance and physical-device feel NOT RUN.
Commands actually run: `node --test tests/simulation.test.ts tests/items.test.ts tests/ranged.test.ts tests/pods.test.ts tests/authority.test.ts tests/network-client.test.ts`; corrected simulation file rerun; `node node_modules/typescript/bin/tsc --noEmit` exit0; `node tools/build.mjs`; full package test script through installed Node with output in full-tests.txt.
Screenshot/recording/log paths: browser result screenshot inspected inline in this task (Clover winner,17s, human0hits/0ringouts), not saved. Browser warning/error log empty. Full suite log: [full-tests.txt](full-tests.txt).
Performance measurement method and sample: displacement is a controlled simulation measurement, not a frame-time benchmark or human duel duration estimate.
Limitations and next action: positive feedback applies to the prior version, not approval of this tuning. No artificial 1v1-only buff; all qualifying hits share vulnerability gain/recovery, including items, while wind follows the configured dash baseline. Browser round confirms functional completion only. Have players retest the Pages build, particularly later exchanges and crowded early rounds. No public deployment or Worker runtime validation performed.

Final verification: FULL105/105 PASS in110.635 seconds, exit0, including ten actual four-client WebSocket rounds (14,552,452 snapshot bytes), real OnlineSession round, transport restart and host selections. Git diff whitespace check passed. Temporary browser tab and4193server closed; root dist build completed. No other preview server restarted.
