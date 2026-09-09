# server/worker

HTTP routing, room admission and service bindings. No per-frame gameplay logic.

`index.ts` implements same-origin routing, static assets and one GameRoom Durable Object per room. It uses the shared RoomAuthority, server-owned random admissions, a 25 ms scheduler for 20 Hz ticks, terminal receipts and cancellation of unfinished records after restart. Tickets remain in memory. Default configuration disables room admission; the local command enables it only in its process. No public authentication, reward grants or deployment has been implemented.

`pnpm dev:worker` builds static assets and runs the pinned Wrangler 4.129.1 emulator at loopback 4180. `pnpm check:worker` only bundles with `deploy --dry-run`; it does not deploy. `pnpm test:worker` expects a live emulator and checks real four-client completion, admission, socket replacement and frame rejection. Normal `pnpm test` includes worker-contract tests without an emulator.

Current environment limitation: workerd 1.20260907.1 crashes on this Windows host with native access violation 0xc0000005 before binding the port. Dry-run build and three contract tests pass; actual Worker WebSocket behavior, persistent runtime restart and Cloudflare throughput/backpressure are unverified. The Node development server remains the usable multiplayer preview. Do not treat the narrow structural platform types or mock storage tests as a substitute for runtime verification. Native `bufferedAmount` availability/semantics need checking; the fallback cannot prove the room's 64 KiB outbound threshold on Cloudflare. Admission throttling/global capacity, persistent retention, idle lifecycle/cost and public security must be completed before enabling remote rooms.

References used: [Cloudflare WebSocket server](https://developers.cloudflare.com/durable-objects/examples/websocket-server/), [Durable Object state and startup ordering](https://developers.cloudflare.com/durable-objects/api/state/), [static asset binding](https://developers.cloudflare.com/workers/static-assets/binding/). This adapter uses standard accepted sockets during an active timed match; it does not claim hibernation savings.
