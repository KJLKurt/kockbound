# Content system specification

First-class means stable identity, typed definition, validation, independent authoring, lifecycle and tests. A folder alone does not satisfy this requirement. This document defines the contract; executable schemas arrive incrementally with their consumers.

Concrete content recipes and creator-tool responsibilities are retained in [the branch addendum](BRANCH_DESIGN_ADDENDUM.md): named Cloud King attacks, switch/core/launcher boss objectives, occupancy-triggered tile variants and four seasonal packages. Each selected recipe must reference registered typed behaviors. New launch/support or minion behavior needs a reviewed engine capability before a content author can configure it; a concept image is not executable geometry or a behavior schema.

## Common envelope

Each definition has:
- id: globally unique lowercase namespace ID, e.g. map.sky_ring; never reused for unrelated content.
- kind: registered content kind.
- schemaVersion: integer format version; contentVersion: immutable revision.
- displayNameKey and descriptionKey: localization keys; tags: discoverability/theme metadata.
- assets: logical asset references; dependencies: typed IDs and pinned compatible revisions.
- behavior: registered behavior key plus typed parameters where relevant.
- availability: explicit acquisition/play conditions; status: draft, validated, released, retired.
- provenance: creator/source and rights ledger reference for external assets.

Do not use display names as save keys. Availability and owned entitlement are separate. A retired reward may be unavailable to earn while remaining usable by its owner. Runtime manifests contain only validated releases; draft definitions and design examples cannot enter matchmaking.

## Types and required payloads

| Type | Required payload and validation |
|---|---|
| CharacterBase | Rig version, mesh refs, sockets, animation set, cosmetic masks; standard gameplay collider reference |
| Skin | Compatible character/rig, mesh/material overrides and hide regions; no combat fields |
| Accessory | Slot, socket or skin-binding, transform and exclusions; bounds/readability check |
| Emote / Effect | Animation/effect event refs, duration, limits; cosmetic-only impact |
| Ability | Behavior key, cooldown, targeting, parameters, telegraph/effect refs, allowed modes |
| Item | Behavior, charges/duration, pickup rules, spawn weight, mode restrictions, visuals |
| Hazard | Collider/zone shape, activation schedule, telegraph ticks, registered effect and parameters |
| Map | Playable geometry, boundaries, spawn transforms, hazard instances, mutation timeline, navigation/objective anchors, capacity, mode compatibility and art |
| Boss | Rig/assets, encounter map compatibility, phases, transitions, attack refs, vulnerabilities/objectives, completion/failure, reward references |
| GameMode | Behavior key, capacity, team/life/respawn/scoring defaults, host-setting constraints, compatible capabilities |
| Event | UTC start/end, release dependencies, enabled modes/maps/items, theme overlays, challenge/reward refs and entitlement policy |
| ChallengeTemplate | Trusted counter/event, filter, target, period, completion/reward rule and eligibility |
| RewardTrack | Ordered requirements and entitlement/currency grants; no executable expressions |
| BotProfile | Reaction interval, observation limits, action selection parameters, mode capability and difficulty |
| ThemePack | Material/decoration/music/UI variants, compatible maps, no unauthorized collider changes |

Store these in content/characters, skins, accessories, emotes, effects, abilities, items, hazards, maps, bosses, modes, events, challenges, rewards, bots and themes. New registered engine behavior requires code, review and tests. Variants using existing behavior should need only data/assets.

## Engine/content contract

The registry resolves a kind/behavior to a versioned code handler. Definitions cannot import code, run scripts, call URLs or modify engine services. Parameters are checked against a discriminated schema. Unknown types/fields, duplicate IDs, nonfinite numbers, missing references, dependency cycles, unsafe paths, incompatible rigs/modes and out-of-budget payloads fail validation.

Map authoring defines simulation geometry separately from render mesh. A decorative rail is not a wall unless the gameplay definition says so. Spawn points must lie on supported ground, avoid hazards and have enough clearance. Objective and boss anchors must be reachable by humans and bots. Validate capacity at each supported count.

Boss state machine contract: entry actions → telegraph → active attack → recovery → vulnerability/objective evaluation → transition. Timeouts guarantee no unwinnable stuck phase. Transition conditions are typed (objective count, elapsed ticks, threshold), never arbitrary expression strings. Damage/health may be boss-specific but cannot silently add player RPG stats.

## Lifecycle and releases

Author source + definition → schema and reference checks → behavioral sandbox → asset QA → release manifest → staged playtest → publish immutable release.
A release binds content IDs/revisions and asset hashes. Both client and server pin the same gameplay release for a whole match. A new release applies to new matches. Rollback changes the active release pointer, not old artifacts. Client receives friendly missing/incompatible-content error before readiness, rather than playing half a map.

Retire content through tombstones and replacements/migrations; keep inventory references resolvable. Breaking schema changes require migration tests and protocol/release compatibility gates. Content edits should not require a wallet migration unless entitlement semantics actually change.

## Seasonal events and rewards

Event windows use server UTC, inclusive start and exclusive end. Match pins the event eligibility at start by default; a valid started match can finish and receive its earned reward after the window closes. New matches cannot enter expired content. Cosmetic entitlement remains equipped and displayable after expiry. Offline date changes grant no online rewards.

A New Year proof fixture should enable a theme/map variant, temporary item, challenge and badge/accessory, then retire the play content while retaining the entitlement. Another event must work by replacing definitions and assets without networking changes. Claim and retry deduplication is required.

Private/local practice has no trusted online progression by default. A later bounded private reward policy requires abuse testing. Reward rules must declare eligible modes/presets and online/offline origin.

## Independent work acceptance

A map variant with a supported hazard, second boss phase sequence using existing attacks, accessory on existing sockets and second seasonal event must be addable without modifying simulation, networking or wallets. A novel mechanic may extend a registered handler; record why data was insufficient. Authoring tools use these contracts; custom level/boss/live-ops editors are later scope.

Initial bootstrap examples are design metadata only, under content/examples. They intentionally do not pretend to be complete runtime definitions or valid launch assets.
