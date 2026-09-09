# M2 browser room client

Milestone/criteria: partial N01–N05, UI portion of V03. Build: uncommitted package 0.1.0, existing pinned protocol/content releases. Date/tester: 2026-09-07, Codex. Windows, Node 24.19.0, TypeScript 5.9.3, ws 8.18.3; Codex in-app Chromium, loopback without network throttling. Browser views included 1280×720 and the native 639×642 panel. No outside human feedback.

Implemented: native browser WebSocket OnlineSession, validated incoming snapshots, assigned-seat input, local movement prediction with authoritative hit/outcome decisions, bounded remote interpolation, readiness, room create/join links, neutral pause/focus handling, bounded reconnect, meaningful errors and return to room setup. Local practice remains available; static builds hide unavailable room controls. Rooms currently assign characters by seat.

Expected/observed automated outcome: **PASS**, all 30 tests, zero failures, 122559 ms. Strict typecheck exit 0; static build exit 0. Commands actually run:

```text
node --test tests/simulation.test.ts tests/server.test.mjs tests/authority.test.ts tests/transport.test.ts tests/network-client.test.ts
node node_modules/typescript/bin/tsc --noEmit
node tools/build.mjs
```

Ten real four-client matches agree on state/results (14,459,340 aggregate serialized snapshot bytes; accelerated clock, not measured network throughput). The actual OnlineSession class also completes a real-socket match and submits the assigned seat's inputs. Client tests exercise malformed received data, prediction without fabricated results, bounded interpolation, normalized input, neutral queued dash, pause, reconnect and completed-room retirement. The 10,000-tick simulation digest remains `2da36a3690f5d703e5fa7d9c08fa958cbb5e99cbdefeb8e946e8d670988ce576`.

Browser observation: created room 57DBF8, joined from a second tab using its actual link, and observed distinct Player 1/Player 2 ownership and shared countdown. Both views ended with Mochi winning at 63 seconds. This was an idle observer/network flow check, not sustained controller-feel evidence. Joining expired room E40E36 produced a readable ended/restart error. A fresh one-human room 802966 reached Mochi's 60-second result. Screenshots were inspected inline in the task; no standalone image file is claimed.

Browser findings fixed: network banner overlapped elimination toast; terminal room retirement incorrectly opened a connection-error overlay. Added spacing and a regression for retaining confirmed results after socket closure. Browser tool access resumed normally after the earlier usage reset; no alternative surface was used to bypass the earlier rejection.

Limits: N03 latency/jitter profiles and correction measurements, Cloudflare adapter, actual process-kill recovery and N07 deployed probes are still pending. Current correction counters are diagnostic, not N03 measurements. No page-reload seat restoration or seamless coordinated rematch; return to room setup creates a new room. Mobile controls, audio and finished character/world presentation remain pending. No rewards or public hosting. Next complete remaining local M2 responsiveness/host contracts, then continue M3 graphics/audio work; the full user goal remains active.

Follow-up browser verification: room 802966 later displayed 'round complete' after server retirement, retained its outcome without an error overlay, and Back to room setup opened the creation/join dialog. Cleared the previous connecting message when returning home. Final mode-specific result copy identifies local room preview separately from solo practice.
