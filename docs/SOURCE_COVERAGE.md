# Source provenance and coverage

Consolidated on 2026-09-05.

S1: [Assess Game Build Guidance](https://chatgpt.com/c/6a9bf6e0-9948-83ea-bb88-28fc29bdf46f).
S2: [Branch · Assess Game Build Guidance](https://chatgpt.com/c/6a9c044c-94d4-83ea-ab27-4033c4278de0).
S3: current bootstrap request, including authoritative rename to Knockbound and prohibition on full-game implementation.

The app conversation reader truncated the foundation at section 38 and its production response at 20,000 characters. These retrieved excerpts are retained honestly in sources/. The browser subsequently exposed and was used to read all 89 original sections, including the full architecture, phase plan and 20 unresolved choices. The complete original text is available at the source conversation; the local excerpt is NOT a full verbatim archive. The table below records every section's consolidated destination.

Historical assistant recommendations are not all user-approved details. DECISIONS.md distinguishes supplied direction, explicit later user requirements, candidate content and new engineering defaults. Current user rename supersedes every historical title. Irrelevant historical claims about AI capabilities/plans are deliberately excluded.

## Foundation coverage

| Section | Original topic | Canonical destination |
|---|---|---|
| 1 | High-Level Vision | [GAME_DESIGN](GAME_DESIGN.md) |
| 2 | Core Design Pillars | [GAME_DESIGN](GAME_DESIGN.md) |
| 3 | Visual Direction | [ART_DIRECTION](ART_DIRECTION.md) |
| 4 | Art Style | [ART_DIRECTION](ART_DIRECTION.md) |
| 5 | Art Production Pipeline | [BLENDER_PIPELINE](BLENDER_PIPELINE.md) |
| 6 | Character Customization | [GAME_DESIGN](GAME_DESIGN.md) |
| 7 | Cosmetic Rarity | [GAME_DESIGN](GAME_DESIGN.md) |
| 8 | Player Progression | [GAME_DESIGN](GAME_DESIGN.md) |
| 9 | No Statistical Character Growth | [GAME_DESIGN](GAME_DESIGN.md) |
| 10 | Abilities | [GAME_DESIGN](GAME_DESIGN.md) |
| 11 | Match Structure | [GAME_DESIGN](GAME_DESIGN.md) |
| 12 | Lobby Design | [GAME_DESIGN](GAME_DESIGN.md) |
| 13 | Game Selection | [GAME_DESIGN](GAME_DESIGN.md) |
| 14 | Matchmaking | [GAME_DESIGN](GAME_DESIGN.md) |
| 15 | Private Games | [GAME_DESIGN](GAME_DESIGN.md) |
| 16 | Party System | [GAME_DESIGN](GAME_DESIGN.md) |
| 17 | Standard Arena Mode | [GAME_DESIGN](GAME_DESIGN.md) |
| 18 | Arena Mutation System | [GAME_DESIGN](GAME_DESIGN.md) |
| 19 | Traps | [GAME_DESIGN](GAME_DESIGN.md) |
| 20 | Map Philosophy | [GAME_DESIGN](GAME_DESIGN.md) |
| 21 | Map Configuration | [CONTENT_SYSTEM](CONTENT_SYSTEM.md) |
| 22 | Daily Challenges | [GAME_DESIGN](GAME_DESIGN.md) |
| 23 | Global Daily Challenges | [GAME_DESIGN](GAME_DESIGN.md) |
| 24 | Challenge Categories | [GAME_DESIGN](GAME_DESIGN.md) |
| 25 | Economy | [GAME_DESIGN](GAME_DESIGN.md) |
| 26 | Example Coin Economy | [GAME_DESIGN](GAME_DESIGN.md) |
| 27 | Cosmetic Prices | [GAME_DESIGN](GAME_DESIGN.md) |
| 28 | Premium Purchases | [GAME_DESIGN](GAME_DESIGN.md) |
| 29 | Avoid Loot Boxes | [GAME_DESIGN](GAME_DESIGN.md) |
| 30 | Shop | [GAME_DESIGN](GAME_DESIGN.md) |
| 31 | Exclusive Cosmetics | [GAME_DESIGN](GAME_DESIGN.md) |
| 32 | Collections | [GAME_DESIGN](GAME_DESIGN.md) |
| 33 | Seasonal Content | [GAME_DESIGN](GAME_DESIGN.md) |
| 34 | Achievements | [GAME_DESIGN](GAME_DESIGN.md) |
| 35 | Player Profile | [GAME_DESIGN](GAME_DESIGN.md) |
| 36 | Server Architecture | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 37 | One Durable Object Per Match | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 38 | Authoritative Server | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 39 | Network Tick Rate | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 40 | Client Prediction | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 41 | Database Architecture | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 42 | Example Player Data | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 43 | Currency Ledger | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 44 | Asset Storage | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 45 | Async Processing | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 46 | Authentication | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 47 | Username System | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 48 | Communication | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 49 | Anti-Cheat | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 50 | Reconnection | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 51 | Bots | [GAME_DESIGN](GAME_DESIGN.md) |
| 52 | Tutorial | [GAME_DESIGN](GAME_DESIGN.md) |
| 53 | Sound | [AUDIO_DIRECTION](AUDIO_DIRECTION.md) |
| 54 | Game Feel | [AUDIO_DIRECTION](AUDIO_DIRECTION.md) |
| 55 | Performance Targets | [BLENDER_PIPELINE](BLENDER_PIPELINE.md) |
| 56 | Shared Skeleton | [BLENDER_PIPELINE](BLENDER_PIPELINE.md) |
| 57 | Animation Library | [BLENDER_PIPELINE](BLENDER_PIPELINE.md) |
| 58 | Game UI | [GAME_DESIGN](GAME_DESIGN.md) |
| 59 | Post-Match Screen | [GAME_DESIGN](GAME_DESIGN.md) |
| 60 | New Player First Session | [GAME_DESIGN](GAME_DESIGN.md) |
| 61 | Retention Loop | [GAME_DESIGN](GAME_DESIGN.md) |
| 62 | Ranked Mode | [GAME_DESIGN](GAME_DESIGN.md) |
| 63 | Live Events | [CONTENT_SYSTEM](CONTENT_SYSTEM.md) |
| 64 | Content Without New Code | [CONTENT_SYSTEM](CONTENT_SYSTEM.md) |
| 65 | Administration Dashboard | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 66 | Analytics | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 67 | Development Strategy | [MILESTONES](MILESTONES.md) |
| 68 | Phase 1 Physics | [MILESTONES](MILESTONES.md) |
| 69 | Phase 2 Multiplayer | [MILESTONES](MILESTONES.md) |
| 70 | Phase 3 Vertical Slice | [MILESTONES](MILESTONES.md) |
| 71 | Phase 4 Progression | [MILESTONES](MILESTONES.md) |
| 72 | Phase 5 Cosmetics | [MILESTONES](MILESTONES.md) |
| 73 | Phase 6 Shop | [MILESTONES](MILESTONES.md) |
| 74 | Phase 7 Monetization | [MILESTONES](MILESTONES.md) |
| 75 | Phase 8 Expansion | [MILESTONES](MILESTONES.md) |
| 76 | Recommended Launch Content | [GAME_DESIGN](GAME_DESIGN.md) |
| 77 | First Three Maps | [GAME_DESIGN](GAME_DESIGN.md) |
| 78 | Character Identity | [ART_DIRECTION](ART_DIRECTION.md) |
| 79 | Brand Personality | [ART_DIRECTION](ART_DIRECTION.md) |
| 80 | Future Modes | [GAME_DESIGN](GAME_DESIGN.md) |
| 81 | Long-Term Vision | [GAME_DESIGN](GAME_DESIGN.md) |
| 82 | Technical Stack | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 83 | Repository Structure | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 84 | Network Messages | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 85 | Separate Gameplay From Economy | [TECHNICAL_ARCHITECTURE](TECHNICAL_ARCHITECTURE.md) |
| 86 | Initial Exclusions | [GAME_DESIGN](GAME_DESIGN.md) |
| 87 | Prototype Question | [GAME_DESIGN](GAME_DESIGN.md) |
| 88 | Recommended Product Direction | [GAME_DESIGN](GAME_DESIGN.md) |
| 89 | Decisions To Lock | [DECISIONS](DECISIONS.md) |

## Later amendments

| Source turn | Decision retained | Destination |
|---|---|---|
| c0d6cd15-d1c4-42d1-bbc7-d2b74dbae010 production response | Finished visual/audio quality, concepts, tools, asset provenance, real visual/play QA, shared rig, layered music/SFX, phased delivery | ART_DIRECTION, AUDIO_DIRECTION, BLENDER_PIPELINE, ACCEPTANCE_CRITERIA, AGENTS |
| 38532ccf-123f-4315-b888-225e017a8760 | Art runs locally; authority over WebSockets; 20 Hz starting point; active matches should not assume hibernation; milestone handoff | TECHNICAL_ARCHITECTURE, HANDOFF |
| b4197f49-f3df-413b-8a29-a0a45565d72e | Explicit strong local bots, cooperative/objective interest, simple host rules, shared engine; suggested four-experience proof | GAME_DESIGN, CONTENT_SYSTEM, MILESTONES M4 |
| bbb210e8-7113-4c41-9035-2a79f42136d3 | Explicit first-class maps/bosses/items/cosmetics/events, seasonal availability and earned wearable rewards; independent content authors | CONTENT_SYSTEM, E07/E08/C04 acceptance |
| c9f05348-2549-493d-81a5-d574bc127bb7 and 37d422fd-7b30-433b-9ca7-7a3b7aba99a5 | Requested character/map/mode/boss/phone/lobby concepts | Historical concept index; exploratory, not final geometry |
| Current request | Rename and implementation bootstrap only | Entire package |

## Visual references

The initial bootstrap recovered two PNGs. The follow-up opened the branch media viewer and recovered eight more, resolving that limitation for all ten unique images exposed by its ten-image gallery. All ten originals are now preserved and visually inspected in [the concept gallery](CONCEPT_ART_GALLERY.md), with file IDs, dimensions and hashes in [the image manifest](../assets/source/concepts/history/manifest.json).

The collection includes original Sky Ring and Sprout; Lumi character/cosmetic studies; expanded Sky Ring; King of the Hill; Crown Chase; Cloud King character/attack/weak-point studies; a cooperative boss encounter; the social lobby; and portrait mobile home/shop/match UI. [The branch addendum](BRANCH_DESIGN_ADDENDUM.md) records the newly readable annotations, retained discussion details and interpretations where images differ from written scope. Completeness here means the observed ten-image viewer at retrieval, not unseen or future conversation revisions.

Image labels retain the historical title. Use them as reference only; do not reproduce obsolete logos in runtime output. Sprout and Lumi are concept labels, not newly locked species names.

## Completeness and interpretation

All 89 text topics and the retrieved later amendments are mapped; there is no known missing text decision. This is a consolidation, not a claim that every example is a commitment. Exact physics, timings, currency values, content quantities and technical defaults retain their stated provisional status.
