# M1 local playable foundation

Milestone and criterion IDs: M1, P01–P07 (agent-operated playtest limitations below).
Build/revision and content release: package 0.1.0; knockbound-sim-0.1.0; knockbound-protocol-0.1.0; knockbound-local-0.1.0. Uncommitted workspace increment; pre-existing staged asset work preserved.
Date/tester: 2026-09-06, Codex automated checks and browser-operated local play, not outside user feedback.
Environment: Windows, Node 24.19.0, pnpm 11.19.0, TypeScript 5.9.3, Three.js 0.180.0. Codex in-app Chromium browser, 1920×1080 test viewport plus narrow app-panel inspection, loopback network with no throttling.

## Automated scenarios

Status: PASS. Ten tests cover P01–P06 and config validation. Full output: [simulation-tests.txt](simulation-tests.txt).

- P01: 10,000 recorded command ticks replay to identical per-tick state/event digests, including RNG and JSON serialize/restore. Aggregate digest `2da36a3690f5d703e5fa7d9c08fa958cbb5e99cbdefeb8e946e8d670988ce576`. 30/60/144 Hz LocalSession playback produces the same authority state.
- P02: cardinal/diagonal/oversized axes obey speed bounds; NaN/Infinity and duplicate sequence are ignored; expired input stops movement.
- P03: one hit per target/dash, cooldown cannot be bypassed by repeated action requests, recovery after delay, later hits multiply impulse by prior vulnerability and stop increasing at the cap.
- P04: coincident centers separate, head-on dashes hit both players, maximum supported dash plus impulse does not tunnel through a 2 cm wall.
- P05: simultaneous final ring-outs draw, eliminate once, terminal events do not repeat, reset is clean, timeout resolves, empty roster cancels.
- P06: one recorded keyboard-like controller and three bots complete 20 seeds; finite state and normal cooldown bounds checked throughout. All 20 terminate with winners in 217–1507 active ticks (10.85–75.35 seconds). Inputs and seed loop are reproducible in the test file.

Commands actually run from repository root, using the bundled Node executable where Node is not on PATH:

```powershell
pnpm install --ignore-scripts
node --test tests/simulation.test.ts
node node_modules/typescript/bin/tsc --noEmit
node tools/build.mjs
node tools/dev-server.mjs 4177
node tools/dev-server.mjs 4178 --dist
```

Strict typecheck: PASS, exit 0. Static build: PASS, then independently opened at port 4178, loaded both modules and Sprout GLB, and completed a keyboard-driven round. Browser console warning/error query returned none during the initial development-build run; this is a point-in-time observation rather than a production error-rate measurement.

Root lockfile SHA256: `1fd8dc91012abd12a93da5302ec29d5240702dc37e2b9f219621de400baac3fc`.

## Browser play and observations

Status: PASS for the M1 agent-operated interaction loop; limited subjective feel evidence. Six full browser rounds were observed, five with keyboard or pause/resume interaction and one intentionally idle baseline. These are not five human playtests. Tool-mediated key taps do not substitute for sustained hands-on controller feedback.

| Round | Build/character | Observed result | Interaction/observation |
|---|---|---|---|
| 1 | Development / Sprout, seed 2 | Pip wins, 31 s, 0 human hits | Move-direction tap and dash; visible cooldown, falling and result |
| 2 | Development / Lumi, seed 2 after reload | Pip wins, 52 s, 1 human hit | Multiple directed dashes; readable gold YOU marker despite same species as rival |
| 3 | Development / Lumi, seed 3 | Pip wins, 63 s, 1 human hit | Replay returns four alive and full timer/countdown; dash and sudden-death ending |
| 4 | Development / Lumi, seed 4 | Pip wins, 63 s, 0 human hits | Idle baseline; bots finish without human participation |
| 5 | Development / Lumi, seed 5 | Human wins, 49 s, 0 human hits | Countdown paused at 5 and stayed fixed across observations; resume then inward dash; win screen |
| 6 | Compiled / Sprout, seed 2 | Pip wins, 49 s, 1 human hit | Static-build countdown and directed dashes; ring-out, result and return to lobby |

Expected loop: choose appearance → Play → five-second countdown → move/dash/hit → ring-out → results → replay. Observed: loop works, roster and timer reset, no stuck terminal state in these samples. Pause disables action and holds the local world; focus-loss neutralization also has explicit implementation, but multi-tab focus-loss behavior needs further browser coverage.

Observed screenshot evidence: [round-three-desktop.png](round-three-desktop.png), captured through Computer Use from the actual Codex window. Full-resolution lobby/gameplay screenshots were also visually inspected inline in the active task. The saved desktop screenshot contains the surrounding Codex UI; it is local QA evidence rather than a marketing export.

Tuning and fixes from inspection: initial 639px panel clipped the lobby character, so narrow camera framing was adjusted; gameplay camera moved closer; quick direction taps are remembered for dash aiming; eliminated characters use presentation elapsed time so a terminal simulation tick does not freeze the final fall. Top surface and support perimeter are aligned. Player/bot labels, gold local-player marker and cooldown meter remain readable at 1080p.

Known limits: prototype cloudy scenery is visually repetitive and bright; crowded labels can overlap; only original idle/run/dash proof clips are integrated; no music/SFX yet; no touch/gamepad play; no measured three-minute frame/heap run, outside testers or actual phone test. Bots are basic nearest-opponent/safe-ground controllers, and an idle human can sometimes win; tune decision quality from more hands-on play. These limits prevent a finished-game or M3 quality claim.

Next action: retain local play while adding M2 authority/transport and integration tests, then complete intentional character/world/audio presentation under the active user goal. Deployment, outside-tester and reference-device gates stay pending until actually run.
