# Start here: Knockbound implementation handoff

Read AGENTS.md, docs/STATUS.md, docs/DECISIONS.md, then the canonical specification documents linked from README.md. Consult docs/SOURCE_COVERAGE.md when tracing prior design. All 89 foundation sections were read; later local-play, modes, content-platform and production-quality discussions are incorporated.

Before visual production or M4 mode/co-op work, review [the full concept gallery](docs/CONCEPT_ART_GALLERY.md) and [branch design addendum](docs/BRANCH_DESIGN_ADDENDUM.md). Both Sprout and Lumi are recovered character explorations. Boss attack names, objective illustrations and phone UI details have explicit interpretations; image labels do not silently override written rules or milestone scope.

## First implementation assignment (ready to copy into the next task)

Asset pipeline follow-up (2026-09-05): one explicitly authorized preproduction character now exists independently of gameplay milestones. For any asset work, start with [the character contract](docs/CHARACTER_ASSET_CONTRACT.md), [repeatable commands and next-character instructions](tools/asset-pipeline/README.md), and [actual evidence/limitations](tests/evidence/asset-pipeline/README.md). Do not rebuild over manual source edits or infer authorization for a catalog. The M1 assignment below is still unimplemented.

Implement M1 only from docs/MILESTONES.md: a local Knockbound physics prototype with one keyboard player and CPU opponents, simple arena, movement, dash, collisions, knockback, ring-out, winner and restart. Use the shared simulation and mode boundaries from docs/TECHNICAL_ARCHITECTURE.md. Use the documented tunable defaults, run the M1 acceptance scenarios, and make the prototype playable locally. Record tuning observations and evidence. Stop after M1 with a clear handoff; do not implement M2 or the mature game automatically.

Before coding, inspect the machine, choose and pin compatible TypeScript/build/test tooling, document commands, and create only dependencies needed for M1. No cloud credentials are needed for M1.

## Delivery expectations

Provide runnable local instructions, the completed acceptance IDs and evidence, remaining failures, and the next milestone. The interaction that must work is: move, dash, knock another player away, fall, see the outcome, play again.

Exact physics values, character topology, music and budgets are starting defaults, not claims of prior approval or empirical quality. Tune routine details autonomously and preserve the product's identity.

Do not treat the proposed mature launch catalog as the first assignment. Local Party is a session configuration, not a separate simulation. King of the Hill and Boss Battle prove extensibility after the first polished slice. Their contracts must influence M1/M2 boundaries without requiring their early implementation.
