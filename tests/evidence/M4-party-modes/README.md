# Acceptance evidence

Milestone and criterion IDs: M4 requested team/boss increment; C03 boss behavior, C05 valid host settings, C07 local/online parity; supporting P01/P03/P04 and N01/N04/N05. This does not close every M4 gate.

Build/revision and content release: working tree, simulation/protocol/content 0.13.0, D87. Prior D86 push tuning and user changes preserved.

Date, tester and environment: 2026-09-10, Codex, Windows with pinned Node 24.19.0. Wrangler 4.129.1 dry-run only.

Runtime/browser/device, viewport and network profile: in-app Chromium at desktop 1280×720, intermediate 639px width and phone-sized 390×844; localhost. No physical-device or network-latency performance claim.

Scenario/config/seed: ordinary UI setup for 12 participants in four teams of three and six participants in three teams of two. Normal four-ally Cloud King with existing falling content enabled, idle human plus bots. Seed19 deterministic boss fixtures with 4/12 bots, both authored profiles. Twelve real human WebSocket clients for teams and boss room creation/countdown/active snapshots. Complete recorded team and boss rounds compared between local simulation and RoomAuthority tick for tick.

Expected outcome: valid equal team layouts, no allied offensive knockback, opponent-aware bots, last-team outcomes, boss rune/core/phase progression, safe telegraph avoidance, win/wipe/timeout, validated snapshots and unmodified authority boundaries. Working source/static module graph and correct desktop/phone presentation.

Observed outcome: **final full115/115 PASS**, 383.259 seconds, exit0, in [final-tests.txt](final-tests.txt). Earlier full113/113 also passed before subsequent audio/parity/profile work, retained in [full-tests.txt](full-tests.txt). Final run includes team/boss victory cue routing, team/snapshot validation, friendly dash/shovel/projectile/bomb/pod behavior, deterministic boss wins, safe/unsafe boulder footprints, failure outcomes, prediction isolation, full local/online parity and twelve-human socket contracts. Both boss profiles completed with ordinary bot commands: Cloud King 4/12 at748/1393 ticks, Tempest at1294/1994 ticks. These are controlled bot fixtures, not estimates of human completion time.

Status: PASS for implemented local/simulation/socket/build checks; user gameplay approval, physical phone performance and Cloudflare live runtime NOT RUN.

Commands actually run: package full test script through installed Node; `node --test tests/party.test.ts tests/audio.test.ts`; `node --test tests/party.test.ts tests/server.test.mjs tests/static-build.test.mjs`; twelve-socket targeted transport test; `node node_modules/typescript/bin/tsc --noEmit` exit0; final static build tests logged in [static-build.txt](static-build.txt); `node tools/worker-local.mjs --check` and pinned absolute Node equivalent outside sandbox. The dry-run initially failed sandbox directory access; first unsandboxed invocation selected Node18 and failed before building. Pinned Node24 rerun completed successfully: 554 asset files, Worker bundle67.73KiB /18.27KiB gzip, ENABLE_ROOMS false, dry-run exit0. No cloud write/deployment.

Screenshot/recording/log paths: screenshots displayed and visually inspected through CUA in this task, not saved to disk. Desktop twelve-player team markers/roster; phone 2v2v2 modal; phone boss/runes/HUD; final desktop boss framing. First boss HUD covered the face, then panel placement and camera framing were corrected. Normal browser co-op reached phase2 and victory with four allies after34 seconds; old pre-final stats showed hits before changing the boss results to cores/allies. Final console and cleanup recorded below.

Performance measurement method and sample: none. Rendering and socket correctness are not frame-time, public capacity or latency qualification.

Final verification addendum: after the 115-test suite, boss lifecycle and bot hooks were moved behind the shared ModeHandler registry. The final targeted party/simulation run passed 21/21 in 49.090s, including complete local/authority parity and deterministic rounds; see [mode-hooks.txt](mode-hooks.txt). Typecheck and root static build then passed. The separate root/project-subdirectory static build checks passed 2/2 in 110.516s; see [static-build.txt](static-build.txt). The full suite and Worker dry-run preceded this hook refactor and were not repeated. Final browser results displayed four cores delivered, four allies standing and 34 seconds; the warning/error console was empty. Viewport override reset, temporary browser tab closed, and task-owned port 4194 server stopped. Existing port 4179 server was untouched.

Limitations and next action: one local human plus bots on Pages; real friends require the backend. Teams are assigned round-robin by joining order, with no manual swapping. Boss presentation is original procedural geometry, not the fully detailed historical concept or a newly approved production Blender asset. Original audio cues are reused; event routing was tested, but no fresh listening approval was supplied. Other M4 work remains open. Restart old dev servers before testing because the module-serving route and server compatibility changed. Publish through the existing Actions workflow only when the user chooses; no deployment performed.
