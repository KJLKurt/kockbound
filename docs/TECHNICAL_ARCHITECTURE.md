# Technical architecture

Canonical target, not implemented software. New engineering defaults are recorded in DECISIONS.md.

## Stack and dependency direction

Recovered stack: TypeScript, Three.js, HTML/CSS UI, WebSockets; Cloudflare Workers, one Durable Object per active match, D1 persistence, R2 assets, later Queues and Cron. Blender sources export GLB/glTF. Pin actual package, Node and Blender versions when implementation begins; this bootstrap installs none.

Dependency direction:
client presentation → client session adapter → shared simulation/protocol/content contracts.
server room adapter → shared simulation/protocol/content contracts.
shared simulation → pure game types and validated gameplay definitions.
reward service → verified match results → database/ledger.
Art tooling → validated asset/content outputs → release manifest.

The shared simulation must import no browser, renderer, Cloudflare, storage, wallet or audio implementation. Mode implementations depend on constrained engine services; the engine never imports a specific map, boss or cosmetic. Presentation consumes read-only snapshots/events. Simulation state is serializable plain data with stable entity IDs.

## Local and online authority

LocalSession owns one simulation instance, seeded RNG and tick clock. Input sources map keyboard/controller seats and bots to participant IDs. It requires no account, WebSocket, Cloudflare request or reward server. Offline results stay local and cannot be uploaded as trusted currency claims.

OnlineSession sends inputs and presents predicted/interpolated state. A Worker authenticates a short-lived room admission and routes to GameRoom. The GameRoom owns roster, input validation, tick scheduling, bot inputs, rules, hazards, elimination and results. The lobby host owns configuration permission, never simulation authority.

Both adapters construct the same MatchConfig, invoke the same step function and consume the same event types. Rendering and sound never mutate authoritative state. One local client can eventually carry multiple seats, but online multi-seat admission is deferred rather than assumed.

## Clock, simulation and networking

Start at 20 Hz fixed simulation and snapshot cadence with 60 FPS presentation target. Tune from measurements. Use elapsed monotonic time to accumulate fixed steps, with bounded catch-up (default five steps); record overruns. Never integrate an arbitrarily huge delta after a stalled tab or room. Local pause stops the session clock; an online client's focus loss does not pause the server.

Input messages include protocolVersion, session/participant association, monotonic sequence, input axes and action edges. The server derives elapsed time and outcomes. Validate finite numbers, vector magnitude, sequence window, packet size, action rates, owned seat, round state and cooldown. Never accept client position, inventory grants or claimed results.

Prototype uses structured JSON. Input, dash and ability may share one ordered command envelope to avoid contradictory timing; historical message names remain listed in shared/protocol/README.md. Snapshot carries server tick, acknowledged input sequence, roster/entity state, phase, remaining ticks and content release ID. Events have unique IDs and authoritative tick to deduplicate VFX/SFX and results. Binary encoding is a later measured optimization.

Predict only the local player's controllable movement; reconcile from acknowledged authoritative state and replay pending inputs. Interpolate remote snapshots with a small bounded buffer (initial 100 ms). Do not promise cross-engine bitwise lockstep: the server wins. Reject incompatible protocol/release combinations before countdown. Rendering interpolation cannot alter ring-out or hit decisions.

Cap outbound queues. Slow consumers get a resync or disconnect, not unbounded memory use. Stale held input neutralizes after a configurable input timeout; actions never auto-repeat from replayed packets. Authoritative hit events correct speculative effects.

## Room lifecycle and failures

States: waiting → loading → countdown → active → suddenDeath → results → closed; canceled is an explicit terminal alternative.
Only ready, admitted participants enter countdown. Late joiners spectate or wait for next round by default. Lock roster/settings/release at countdown.

Recovered reconnect example: 10-second grace. Default disconnected avatar remains vulnerable with neutral input; reconnect replaces the socket for the same participant, invalidates the old control session and sends full state. At expiry apply the mode's disconnect rule (Arena elimination). A dropped lobby host cannot stop an active authoritative match; elect a lobby host for next-round configuration.

A restarting active room must never silently begin a new match or regrant rewards. M2 default: cancel interrupted matches and issue no competitive rewards, with a clear client message. Durable resumable checkpointing is a later explicit enhancement. Persist terminal match identity/result receipt when reward processing is introduced.

Cloudflare supports coordinating multiple WebSocket clients in a Durable Object. Hibernation retains sockets but resets in-memory state; waiting-room restoration must reconstruct required state. Active simulation should be budgeted as active compute, not assumed to hibernate. Verify actual runtime timing and regional latency in M2. [Cloudflare WebSockets documentation](https://developers.cloudflare.com/durable-objects/best-practices/websockets/) checked 2026-09-05.

## Persistent systems (after the slice)

D1 logical records:
users and provider identities; profiles; loadouts; inventory entitlements; wallets and immutable currency ledger; challenges and progress; achievements; match history and reward receipts; catalog/featured offers; later friendships.
Inventory uniqueness is user + content entitlement identity. A loadout references owned compatible cosmetic IDs. Session/account merge needs one idempotent transaction; do not let repeated guest linking duplicate inventory/currency.

Room result includes match ID, server build, pinned content release, rules preset, participants, outcome, authoritative counters and eligibility. Accept only an internal authenticated service submission, not a browser endpoint accepting arbitrary result JSON.
Reward service deduplicates by match + participant + reward rule version. Ledger entry, wallet update, entitlement grant and processing receipt commit atomically; retry must return the same result. Insufficient balance cannot go negative. Corrections use compensating ledger entries.

Payments remain M8: server-verified provider events, deduplication by provider event/payment ID, receipts, refunds, reversals and fraud checks. Client success redirects never grant currency. No provider chosen or payment claims validated in this bootstrap.

R2/CDN holds versioned GLBs, textures, audio and release assets; D1 stores metadata, not large binaries. Match release pins prevent mid-round data drift. Queues can later process analytics/achievements with idempotent consumers. Cron schedules global daily/event rotations from server UTC; delayed jobs compute current eligibility instead of duplicating rotations.

## Security and operations

Before public service: validate origins/admissions, limit room creation/messages, expiry and replay-protect tokens, use server-only credentials, authenticate admin actions and audit grants. No client-authoritative wallet or inventory. Avoid tokens in logs. Report usernames/content safely as text.

Metrics: simulation step duration/overruns, snapshot bytes, RTT, reconnect and room cancellation, load time/frame time, queue wait and bot ratio. Later events: game_loaded, tutorial_started/completed, queue_started, match_started/finished, play_again_clicked, challenge_completed, shop_opened, item_viewed/purchased, currency_purchased, player_quit.
Track retention, completion, matches/player and ability/map balance after privacy/retention choices. No analytics dependency may stall gameplay. Cloud costs, supported regions, privacy requirements and production load envelope remain prelaunch gates.

Retained mature metric candidates: daily active users, average matches/user, completion and queue time, day-1/day-7/day-30 retention, purchase conversion, average revenue per paying user, popular cosmetics and win rates by ability/map. Collect only when the relevant feature and data policy exist.

## Repository layout

client/: game composition, rendering, networking, input, UI and audio adapters.
server/: Worker routing, matchmaking, room lifecycle, auth, rewards, economy, challenges.
shared/: simulation, protocol, game types and content contracts.
content/: independently authored definitions grouped by type.
assets/source/: editable Blender/concept/audio masters; assets/runtime/: reviewed exports.
tools/: asset-pipeline and validation; tools/admin reserved for later.
tests/: scenario plans, fixtures and evidence; infra/: future environment/deployment configuration.

Pure engine boundaries are implemented first. Do not build an abstract editor or plugin framework before two real use cases require it.
