# Milestone plan

M0 is this bootstrap. Everything else is unimplemented. Acceptance IDs refer to ACCEPTANCE_CRITERIA.md. Later milestones require a new implementation assignment; this document is not permission to execute all of them.

| Milestone | Depends on | Deliverable | Exit gate |
|---|---|---|---|
| M0 Bootstrap | Existing design | Canonical specs, constitution, scaffold, provenance, handoff | B01–B04 |
| M1 Physics/local bot prototype | M0 | Pinned minimal tooling; shared simulation, simple arena, keyboard, bots, dash, hit, ring-out, result/restart | P01–P07 |
| M2 Responsive online prototype | M1 | Worker/room/WebSockets, four players, validation, prediction/interpolation, reconnect and cancellation | N01–N07 |
| M3 Polished 3D vertical slice | M2 | One finished creature/rig, Sky Ring, animations, telegraphed mutation, lighting, VFX, HUD, SFX/music, replay | V01–V07 |
| M4 Local/objective/co-op proof | M3 | 2–4 local humans + bots, King of the Hill, one boss and configured variant, one item and variant, content validators, constrained host settings, mobile proof | C01–C07 |
| M5 Accounts/progression | M3 and M4 | Guest-save flow, profile, XP, coins, shared daily challenges, inventory, reward ledger | E01–E05 |
| M6 Cosmetic pipeline/catalog | M3 and M5 | 3 hair, 5 head, 5 outfit, 3 back, 3 trail, 3 emote candidates; quality-driven counts | A01–A04 |
| M7 Earned-currency shop/events | M5 and M6 | Catalog, featured rotation, earned spending, event lifecycle and reward retention | E06–E08 |
| M8 Monetization readiness | M7 plus explicit commercial scope | Provider verification, receipts/refunds, fraud and operational readiness | E09 |
| M9 Expanded public product | Validated prior gates | Additional maps/abilities, parties/private online, team/chaos, social/events, later ranked | R01–R03 |

Original phases 1–3 map directly to M1–M3; phases 4–7 map to M5–M8. Original phase 8 is M9, with the later requested local/co-op/content proof elevated to M4. A small private-room transport test in M2 is not the finished private-host product.

## Scope and stop rules

M1: no accounts, commerce or production art. Temporary circles are appropriate. Tune the hit before adding breadth.
M2: local tests first; a deployed latency/cost probe is required before claiming Cloudflare production viability, and needs authorized environment/spend. No silent provider substitution.
M3: gate on polish and external play evidence; do not declare success because every feature exists.
M4: demonstrate reusable boundaries with real alternate rules/content. Do not build every future mode or editor.
M5–M8: integrate transactional progression only after the core play experience is validated. Earned economy precedes paid currency.
M9: the historical release quantities are planning targets. Capacity, quality and audience tests determine final release scope.

## Work packets for M1

1. Inspect tools; select/pin TypeScript dev server/test runner and document clean setup.
2. Define simulation/input/mode types and minimal Arena mode; implement fixed-step movement and collisions.
3. Add dash, vulnerability, ring-out, simultaneous outcome handling and reset.
4. Add normal-rule bots and local session adapter.
5. Add debug presentation/input/HUD with visible tuning controls or config file.
6. Execute P01–P07, record replayable seeds/input fixtures and subjective feel notes.
7. Update STATUS and deliver local run instructions. Stop at M1.

Future work packet estimates should follow measured implementation progress. No calendar deadlines or fabricated effort estimates are imposed here.
