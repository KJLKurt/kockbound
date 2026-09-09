# M2 delayed-network responsiveness

Criteria: N03 simulated profiles; regression support for N01/N04. Build: uncommitted 0.1.0, unchanged simulation/protocol/content release. Date/tester: 2026-09-07, Codex. Windows, Node 24.19.0, TypeScript 5.9.3; scripted transport model plus existing real ws transport tests. No external human feedback or public deployment.

Expected: four OnlineSessions respond locally within one 50 ms input tick, remain finite and bounded, and converge to the same complete authoritative state/result under both required latency profiles. Observed: **PASS** for those checks. Fifteen targeted tests passed, zero failures, 57844.736 ms. Strict typecheck and static build exited 0. The simulation/authority files were unchanged; their previously passing tests were not repeated for this client-only increment.

Commands actually run:

```text
node --test tests/network-client.test.ts tests/network-latency.test.ts tests/transport.test.ts
node node_modules/typescript/bin/tsc --noEmit
node tools/build.mjs
```

Method: deterministic PRNG seed 7391, game seed 44, four human seats driven by ordinary rotating-target movement/dash inputs, default 90-second round. Ordered upstream/downstream message queues preserve WebSocket/TCP ordering and model symmetric half-RTT plus uniform one-way jitter. Model/client frames advance in 10 ms increments; authority remains 20 Hz. This tests actual OnlineSession code and RoomAuthority, not browser/OS traffic shaping. No packet loss, bandwidth cap, disconnection or regional hosting is modeled here; separate tests cover real sockets and reconnect. One full scripted match per profile is a small sample.

| Profile | Simulated elapsed | Input intent to first predicted movement | Largest queue per link | Target adjustments >15 cm, per player | Maximum target adjustment | Received snapshot bytes per player | Agreed outcome |
|---|---:|---:|---:|---:|---:|---:|---|
| 100 ms RTT, ±20 ms one-way jitter | 83.44 s | 0–30 ms | 3 | 670–776 | 3.464 m | 5,499,705–5,499,712 | Draw |
| 200 ms RTT, ±50 ms one-way jitter | 83.72 s | 0–40 ms | 7 | 958–1153 | 3.499 m | 5,467,203–5,467,210 | Player 4 wins |

Counters compare the last presented owner position with the next reconciled target. They include ordinary motion, smoothing lag, dash/impact displacement and speculative error; they are **not pure prediction-error frequency**. Snapshot bytes are serialized JSON bytes including full configurations, not compressed transfer. These figures reveal room for movement/bandwidth tuning, not a production-quality declaration.

The initial fixture exposed an unbounded-time assumption: each pending input was replayed as another tick, despite authority coalescing packets. At 200 ms RTT it produced a largest target adjustment of 7.523 m. Prediction is now capped at two ticks (100 ms), preserving an outstanding dash edge, and a regression rejects a return to >4 m adjustments in this exact fixture. Because the scripted controller reads its presented position, trajectories/outcomes also change; this is not a matched-trajectory statistical comparison. Owner rendering now blends between network targets with a 35 ms time constant, snaps corrections >2.5 m and authoritative eliminations, and never changes simulation state.

Browser check: normal in-app browser access; loopback room 94184A, 639×642 panel. Clicked Dash; HUD displayed cooldown. Result showed one hit, Pip winner, 64 seconds, and correct local-room/no-rewards label. Result screenshot inspected inline in this task. This is a short functional check, not sustained controller-feel or latency-shaped browser evidence. No standalone screenshot file or audio listening is claimed.

Remaining: human review of high-latency contacts (3.5 m adjustments can still be noticeable), more seeds/network-loss/stall profiles, tighter correction instrumentation, bandwidth optimization if measurements justify it, Cloudflare adapter/local integration and deployed N07 probe. N03 now has the specified simulated profile evidence; broad responsive-online quality remains unproven. Continue toward M3 character/world/music/SFX after remaining local M2 integration, without claiming missing deployment/human gates have passed.
