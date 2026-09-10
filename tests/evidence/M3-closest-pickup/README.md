# Closest pickup and same-tick swap

Milestone/criteria: M3 interaction support; M2 N01/N02/N04/N05 transport regression.
Build/content: working tree; simulation/protocol/content compatibility0.12.1.
Date/tester/environment:2026-09-09,Codex,Windows,Node24.19.0.
Scenario: two eligible overlapping pickups, dropping a held shovel beside a nearer partly used blaster; equal-distance and strict-radius boundary cases.
Expected/observed: closest eligible item wins rather than older spawn; same-tick drop/pickup preserves two charges and original expiry. Exact ties keep ground-list order. At0.85m no pickup. Cloned replay matches. Shared pure helper keeps guidance eligibility consistent; guidance alone includes crates and wider range. No new UI geometry/art changes; prior M3-pickup-guidance visual inspection applies only to unchanged cue presentation.
Status: targeted checks PASS after correction of empty-slot assertion (undefined, not null). Initial24-test run23passed/1failed solely on that assertion; all authority, crate and real WebSocket tests passed, including ten4-peer rounds and browser OnlineSession adapter. Corrected items/nearby rerun8/8 passed. Final strict typecheck and static build passed, session78195exit0. No fresh full suite claimed.
Commands: pinned node --test tests/items.test.ts tests/nearby-item.test.ts tests/authority.test.ts tests/transport.test.ts tests/crates.test.ts; then corrected items/nearby rerun; tsc --noEmit; tools/build.mjs.
Logs/screenshots: tool output in task; no new screenshot or timing sample.
Preview: old4179authority98872stopped; first restart failed EPERM renaming persisted room journal, retry succeeded session37497. Cause not established; no journal deletion or bypass. Previously retained in-app tab11 absent on inspection; user Chrome untouched.
Limitations/next: natural phone pickup/control feel and external playtest remain unverified. Continue gameplay/presentation review. Goal active.
