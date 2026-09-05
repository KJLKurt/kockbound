# Knockbound

Implementation bootstrap • 2026-09-05 • No game implementation yet.

Knockbound (formerly Push Arena) is a stylized 3D browser party-action game with planar authoritative simulation, satisfying knockback, competitive and cooperative rulesets, local players and bots, and modular content.

Start with [HANDOFF.md](HANDOFF.md), then [AGENTS.md](AGENTS.md).
The canonical specification is the set of documents indexed below; archived conversations are evidence rather than competing specifications.

| Document | Purpose |
|---|---|
| [Game design](docs/GAME_DESIGN.md) | Product, mechanics, modes, progression and scope |
| [Architecture](docs/TECHNICAL_ARCHITECTURE.md) | Boundaries, local/online authority, protocol, persistence |
| [Content system](docs/CONTENT_SYSTEM.md) | Definitions, ownership, validation, release lifecycle |
| [Art direction](docs/ART_DIRECTION.md) | Character/world/UI identity and visual standards |
| [Concept art gallery](docs/CONCEPT_ART_GALLERY.md) | All ten recovered historical concept sheets |
| [Branch design details](docs/BRANCH_DESIGN_ADDENDUM.md) | Boss attacks, character alternatives, modes, host presets, social/mobile/event details and reconciliations |
| [Blender pipeline](docs/BLENDER_PIPELINE.md) | Authoring, rig, export, budgets and QA |
| [Character asset contract](docs/CHARACTER_ASSET_CONTRACT.md) | Proved prototype rig, scale, sockets, clips and runtime conventions |
| [Audio direction](docs/AUDIO_DIRECTION.md) | Music, sound events and mixing |
| [Implementation specification](docs/IMPLEMENTATION_SPEC.md) | Concrete contracts and starting defaults |
| [Milestones](docs/MILESTONES.md) | Dependencies, deliverables and stop gates |
| [Acceptance criteria](docs/ACCEPTANCE_CRITERIA.md) | Measurable verification and playtest evidence |
| [Decisions](docs/DECISIONS.md) | Established choices, new defaults and unresolved choices |
| [Source coverage](docs/SOURCE_COVERAGE.md) | All 89 original sections and later amendments |
| [Status](docs/STATUS.md) | Current handoff state and next action |

Repository folders are ownership boundaries; gameplay remains unimplemented. The bootstrap checker (`node tools/validate-bootstrap.mjs`) checks links, coverage and metadata. One explicitly authorized character pipeline proof now also runs: [asset commands and browser preview](tools/asset-pipeline/README.md).

Game tooling remains an M1 choice. Asset tooling is separately pinned and isolated. No deployment, cloud resource, purchase, account flow or payment integration has been created.
