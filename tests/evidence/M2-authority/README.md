# M2 authority core increment

Date/tester: 2026-09-07, Codex. Environment: Windows, Node 24.19.0, TypeScript 5.9.3, local in-process peers. Package 0.1.0 and current uncommitted worktree; no hosted service.

Scope: transport-independent authoritative room and strict client message codec. This is an M2 increment, not completion of M2 or the active game goal.

Expected: ordinary inputs drive the shared simulation; malformed or forged client messages cannot change authority; seats survive reconnect without old-socket control; input/backpressure remain bounded; terminal cancellation cannot resume play or issue rewards.

Observed: eight authority tests passed. Combined with ten existing simulation tests and one local-server test, all **19 tests passed**, zero failures. Strict TypeScript check also passed, exit 0.

Commands actually run:

```powershell
node --test tests/authority.test.ts tests/simulation.test.ts tests/server.test.mjs
node node_modules/typescript/bin/tsc --noEmit
```

The bundled executable used was `C:/Users/Kurt/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`. Combined test duration was 2968.3009 ms; this is test-run duration, not gameplay frame/latency evidence. The existing 10,000-tick simulation digest remained `2da36a3690f5d703e5fa7d9c08fa958cbb5e99cbdefeb8e946e8d670988ce576`.

| Criterion | Actual evidence | Gate status |
|---|---|---|
| N01 | Four independently serialized test peers observe identical world/result data across ten seeded rounds. Every room tick matches a separately stepped local simulation. A 12-seat fixture closes a peer whose outbound buffer exceeds 64 KiB. | PARTIAL: real independent WebSocket/browser clients still required |
| N02 | Reject malformed/oversized packets, unknown position/reward fields, unsupported versions, wrong seat, duplicate/oversized sequence gaps, illegal vector length, cooldown dash spam and message-rate floods. | Room tests PASS; transport integration pending |
| N03 | No latency/jitter/prediction or snapshot-bandwidth measurements yet. | NOT RUN |
| N04 | Reconnect sends full state for the same seat, exposes consumed/next sequences, invalidates old sockets and survives a stale close callback. Exact ten-second expiry eliminates once. Same-tick final disconnects draw, including grace expiring during countdown. | Room tests PASS; actual dropped socket path pending |
| N05 | Release mismatch cannot reach ready, waiting cannot advance simulation, unknown admissions cannot join, and explicit neutral input discards a queued dash and acknowledges release. | PARTIAL: browser focus-loss and real admission adapter pending |
| N06 | Cancellation yields one terminal receipt/message and rejects further play/connect. No reward service or grant exists. | PARTIAL: persisted restart journal/adapter and injected process restart pending |
| N07 | No deployment, regional timing, hosting-cost or load probe. | NOT RUN |

Implementation defaults: one server-issued admission ticket per human seat, injected by a future trusted transport adapter; one pending input per seat; 1 KiB client message maximum; 60 messages/s with burst 10; 128-command forward sequence window; 64 KiB peer-buffer cutoff; 20 Hz simulation with at most five catch-up ticks. These are reversible unprofiled defaults, not production capacity guarantees. Tickets are not included in snapshots. Transport callbacks and the monotonic clock are trusted server capabilities.

Cross-boundary contract: shared `step` now accepts an optional server-selected list of forfeited participants. Arena collects those eliminations alongside normal ring-outs before resolving the outcome, so simultaneous final disconnects draw. Client message schemas do not expose this argument. The default empty list preserves M1 behavior and replay digest. Local-practice result data and explicit `rewardsEnabled: false` remain in this no-rewards prototype; the eventual reward service must independently verify server provenance rather than trusting any client-visible field.

Test correction: the first peer comparison failed because JSON correctly omits optional `undefined` event fields. Wire-state equality now compares JSON-normalized values; the independent room/local simulation assertion still compares complete in-memory states. The corrected suite passed; no gameplay outcome discrepancy was hidden.

Browser restriction: the preceding settings-panel check was rejected by automatic approval review because of account usage limits. This increment did not retry that browser action through another tool. No new browser, graphics, audio or human playtest evidence is claimed here.

Next: add actual WebSocket/Worker transport and trusted admission/restart storage, then connect the browser networking adapter with prediction/reconciliation and test real clients plus latency/jitter. Continue the requested graphics/animation/music/SFX work after the M2 engineering increment; full game completion remains unproven.
