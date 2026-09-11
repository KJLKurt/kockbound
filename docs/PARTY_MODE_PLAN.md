# Party modes: player feedback and next-demo scope

Superseded by the user's explicit implementation request and [0.13.0 party-mode contract](PARTY_MODE_CONTRACT.md). The notes below preserve the pre-implementation assessment. Teams, larger lobbies and boss co-op are now implemented for testing; the earlier priority question is no longer blocking or pending.

## Feedback recorded 2026-09-10

User reports players enjoy the random falling items/hazards and want cooperative play, free-for-all, 2v2/teams with selectable team size, more participants, and the cooperative boss fight from the original concepts. Preserve the falling-content feature and its existing host toggles. This feedback concerns the current demo; it is not acceptance of unimplemented modes or of the new D86 push tuning.

## What the demo actually supports

- GitHub Pages solo starts one human and three bots. This is already free-for-all, last survivor wins.
- The shared configuration supports up to12 total participants; this is a simulation bound, not a claim of12-human hosted readiness or acceptable12-player phone performance.
- Solo start currently passes a fixed count4. The room UI offers1–4 humans, with bots filling to4. Both server adapters can create larger rosters, but the ordinary UI does not expose them.
- Teams, boss encounters, and multiple local-human input seats are not implemented.
- Pages hosts independent browser simulations. A bot teammate can cooperate locally once implemented; separate phones sharing a match require the online authority/backend. Pages hosting alone does not provide multiplayer.

## Proposed delivery sequence

1. **Larger free-for-all:** expose total participant count, bounded2–12, with one human and the remaining seats explicitly labeled as bots on Pages. Retain4 as the default until phone testing supports a larger default. In online rooms, distinguish human seats from total capacity and fill remaining seats with bots.
2. **Team Arena:** a selectable mode with balanced team-size presets2v2,3v3,4v4 and6v6 within the existing12-participant bound. Label bot teammates/opponents explicitly. Proposed first rules: last surviving team wins; one life; no friendly attack knockback or vulnerability gain; normal body separation; clear team markers independent of cosmetic color. Validate team allocations, handle simultaneous team elimination, and ensure bots target opponents. These are proposed defaults, not implemented behavior or user-approved final rules.
3. **Boss co-op:** implement the M4 proof from the canonical specifications: one original cloud boss encounter, two phases, telegraphed attacks/recovery, a shared switch/push-core objective, team victory, team-wipe/timeout failure, and a configured encounter variant. Start with up to4 allied participants and ordinary-input cooperative bots. Larger boss groups require encounter scaling and performance checks. Preserve the cloud/stone concept intent; do not implement a generic health-bar enemy as a substitute for the shared pushing objective.

The next-demo priority between Pages modes with bots and real friends on separate phones is pending the user's response. Online play requires the recorded Worker runtime/public-hosting work; increasing a dropdown does not complete that work. No deployment or spend is implied.

## Integration and acceptance

Use a registered mode contract and validated configuration shared by LocalSession, room authority and bots. Team affiliation, mode state and result semantics require corresponding protocol/snapshot validation, prediction/reconnect handling, UI and integration tests. Content authors must not edit networking to add authored encounter variants. Apply existing P01/P03/P04 determinism/collision checks, N01/N04/N05 authority/parity/reconnect checks, and relevant C01–C07 mode/bot/phone gates. Measure crowded phone play and inspect team identity, boss telegraphs and objective feedback at phone size. No gate is passed by this plan.

References: [Game design](GAME_DESIGN.md), [M4 and dependencies](MILESTONES.md), [Mode proof contracts](IMPLEMENTATION_SPEC.md), [Original concept gallery](CONCEPT_ART_GALLERY.md), [Branch interpretations](BRANCH_DESIGN_ADDENDUM.md), [Acceptance criteria](ACCEPTANCE_CRITERIA.md).
