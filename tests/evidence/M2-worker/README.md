# M2 Cloudflare adapter: build verified, runtime blocked

Milestone/criteria: M2 host integration, partial N02/N06 contracts; N01/N04 runtime and N07 remain unverified. Build/revision: uncommitted 0.1.0, unchanged shared simulation/protocol/content. Date/tester: 2026-09-07, Codex, Windows. Pinned Wrangler 4.129.1, transitive workerd 1.20260907.1 and Miniflare 5.20260907.0-alpha (lockfile). Node 24.19.0 / TypeScript 5.9.3. No cloud account use, deployment, purchase or outside test.

Implemented: Worker same-origin API routing/static assets, random server-owned admission tickets, one GameRoom Durable Object per six-character code, the existing RoomAuthority, bounded incoming frames/seat count, readiness timeout, terminal persistence and restart cancellation. Default configuration disables room APIs. The local wrapper enables them only for `dev --local`, suppresses metrics and writes logs under ignored `.knockbound/`. Tickets are not stored in room records.

Expected: build succeeds, runtime accepts four browser-compatible WebSockets, completes a shared match, rejects malformed admissions/frames, replaces sockets and cancels unfinished rooms after an actual persistent restart.

Observed:

- **PASS** strict typecheck and local dry-run bundle. Initial bundle: 30.58 KiB / gzip 9.07 KiB (Worker code only, excluding static assets).
- **PASS** three Node contract tests: unfinished persisted records cancel exactly once and reject reuse; finished receipts remain unchanged; disabled/foreign/hostile requests fail before allocation.
- **BLOCKED** actual emulator startup: workerd exited 1 with native exception `0xc0000005: access violation` before port 4180 opened. Wrangler suggests an outdated Visual C++ redistributable as one possible cause; this was not independently diagnosed. No system runtime was installed or changed.
- **FAILED due to unavailable server** both `tests/worker.test.ts` live integration cases: ECONNREFUSED at 127.0.0.1:4180. These are not passing tests. No actual Worker match, persistent process-restart or browser evidence was obtained.

Commands actually run:

```text
node node_modules/wrangler/bin/wrangler.js dev --local --var ENABLE_ROOMS:true
node --test tests/worker.test.ts
node --test tests/worker-contract.test.ts
node node_modules/typescript/bin/tsc --noEmit
node node_modules/wrangler/bin/wrangler.js deploy --dry-run --outdir .knockbound/worker-build
```

The first sandboxed build could not traverse parent folders. The normal escalation was approved; the subsequent native crash is a distinct runtime failure, not an automatic-approval rejection. Dry-run exited successfully and did not publish anything. No performance/browser/media evidence applies to this infrastructure increment. Prior Node multiplayer/latency tests remain separate evidence; they cannot establish Cloudflare compatibility.

Limitations: platform types are a narrow structural boundary, not generated full Worker types. Cloudflare socket backpressure (`bufferedAmount` availability), admission throttling/global room capacity, persistence retention, actual 20 Hz timing/lifecycle, reconnect after terminal persistence and operational cost still require runtime verification/design before remote enablement. The configured room feature defaults off. Standard accepted sockets keep a timed match active; no hibernation cost claim.

Next: use a functioning compatible workerd environment to run `pnpm dev:worker` / `pnpm test:worker` and an actual restart probe. The working Node room preview remains at 4179. Continue independent M3 character/world/music/SFX production under the user's priority while retaining these incomplete M2 gates; do not block all game work on this native-runtime limitation.

Primary implementation references: [Cloudflare WebSocket example](https://developers.cloudflare.com/durable-objects/examples/websocket-server/), [startup ordering/state](https://developers.cloudflare.com/durable-objects/api/state/), [asset binding](https://developers.cloudflare.com/workers/static-assets/binding/). No outside assets or media were introduced.
