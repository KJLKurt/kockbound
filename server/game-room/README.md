# server/game-room

Authoritative online lifecycle, validation, fixed tick and reconnect. Import shared simulation; no wallet writes.

M2 `authority.ts` owns readiness, input validation/queues, fixed ticks, reconnect/grace, snapshots/backpressure and terminal cancellation. It receives trusted admission tickets and a transport peer interface; it is not an authentication endpoint or a complete Worker adapter. `tests/authority.test.ts` covers the in-process contract. Persisted restart recovery/cancellation, actual socket tests and browser prediction remain pending. Rewards are explicitly disabled.

Follow-up: `local-transport.ts` now supplies a real loopback HTTP/WebSocket development adapter; `journal.ts` cancels unfinished local rooms after restart. `tests/transport.test.ts` exercises real sockets and persisted transport recreation. The Cloudflare adapter, actual process-restart fixture and browser prediction remain pending; the earlier pending socket/journal statement above describes the first core increment.
