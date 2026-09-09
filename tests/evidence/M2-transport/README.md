# M2 real loopback transport increment

Date/tester: 2026-09-07, Codex. Runtime: Windows, Node 24.19.0, TypeScript 5.9.3, ws 8.18.3 and @types/ws 8.18.1. Uncommitted workspace; no public or Cloudflare deployment.

Implemented: real HTTP admission and WebSocket transport attached to the optional local development server, cryptographically random room/seat tickets, exact loopback Host/Origin policy, 1 KiB frame limits, binary rejection, eight-room/96-socket limits, bounded room/journal retention and restart cancellation journal. The normal browser game remains local-only until its networking UI/adapter is connected.

Expected/observed: four independent real WebSocket clients complete ten matches with identical world/result data; invalid transport requests are rejected; replacement closes the old connection while preserving the seat; recreating the transport with the same journal cancels unfinished rooms.

Checks actually run:

```powershell
node --test tests/transport.test.ts tests/server.test.mjs
node node_modules/typescript/bin/tsc --noEmit
node tools/dev-server.mjs 4179 --multiplayer
```

Status: **PASS**, five targeted tests, zero failures; strict typecheck exit 0. Four tests are new transport tests and one is the existing static-server security smoke test. Prior simulation/authority tests were not rerun during this transport-only increment; no simulation/authority implementation changed. `pnpm test` now includes all 23 current tests.

Final targeted run output:

```text
Ten 4-client WebSocket rounds passed; snapshot bytes observed: 14450172
PASS Local server serves playable modules and rejects encoded traversal outside public roots
PASS N01 real loopback WebSockets: four clients complete ten matches with identical results
PASS Transport rejects foreign origins, bad tickets, malformed settings and binary/oversize frames
PASS N06 real transport restart: unfinished room is cancelled persistently, never silently restarted
PASS N04 actual socket replacement restores the same participant and closes the old owner
tests 5; pass 5; fail 0; duration_ms 35535.1949
```

The ten-match fixture uses real TCP/WebSocket framing and independent message consumers with an injected server clock. The clock advances in 50 ms steps so the test finishes quickly; this is not wall-clock gameplay pacing, latency or regional performance evidence. Four clients receive JSON-equivalent snapshots and results every tick. 14,450,172 bytes is aggregate serialized snapshot data inspected by the test, not measured transfer compression/throughput or a per-client bandwidth budget. Small differences between runs reflect random server seeds and ordinary packet arrival timing.

N01 now has real socket evidence but still lacks browser multiplayer playtesting. N02 transport rejection and N04 actual close/reconnect paths are exercised. N06 has persisted journal evidence across transport/server recreation in one test process, not an injected operating-system process kill or Cloudflare Durable Object restart. N03 prediction/jitter/correction measurements and N07 hosting probes remain NOT RUN.

`pnpm dev:online` runs port 4179 with the transport. During this increment that server started successfully and returned a live command session (76592). Revalidate the handle/port before restarting it. The static UI served there still plays the local game; no user-facing online option is advertised yet.

Development endpoints: same-origin POST `/api/rooms` with `{humanCount: 1..12}` reserves seats and admits Player 1; POST `/api/rooms/CODE/join` with `{}` admits the next reserved seat while waiting; `/api/socket?room=CODE&ticket=...` upgrades only a claimed valid admission. Browser code must use native WebSocket. Do not put tickets in logs, results or journal files. No public authentication or reward eligibility is claimed by this loopback adapter.

Journal: `.knockbound/room-journal/`, excluded from version control. It records room identity and terminal receipts, never admission tickets. Every unfinished record becomes cancelled at startup. Invalid journal data fails startup instead of silently restarting a match. Terminal rooms retire after 60 seconds and their sockets close; waiting rooms cancel after 120 seconds. Journal storage caps at 4096 entries and does not silently delete history. This local adapter will not replace the required Cloudflare Durable Object implementation.

Implementation reference: [official ws documentation](https://github.com/websockets/ws), reviewed for HTTP upgrade, native browser clients, payload limits and compression behavior. Compression is disabled in this prototype; profile before changing it.

Browser limitation remains: the previous settings check was rejected by automatic approval review for account usage limits. No browser action was retried through another surface. No new visual, music, SFX or user-playtest evidence is claimed.

Next: connect browser admission/room flow and OnlineSession to this transport, with local-player prediction, remote interpolation, neutral controls, reconnect/error/replay and robust received-state validation. Then run browser multiplayer and jitter fixtures, add the Cloudflare adapter, and continue the requested visual/audio work. The complete-game goal remains active.
