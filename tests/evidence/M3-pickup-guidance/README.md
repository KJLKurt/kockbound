# Nearby pickup guidance

Milestone and criterion IDs: M3 V01/V02 presentation support; not complete acceptance.
Build/content release: local working tree, protocol 0.12.0 unchanged.
Date/tester/environment: 2026-09-09, Codex, Windows, Node24.19.0, Three0.180.0, in-app Chromium.
Scenario: normal solo walkthrough with only blasters and no hazards, followed by controlled crate and passive-item fixtures.
Expected: identify a nearby loose item and explain pickup, swap or crate action without changing simulation eligibility.
Observed: nearest eligible item within3.25m gets a ground ring and text. Thrown bombs, armed pods, expiry and drop grace are excluded; bomb wording warns of a live fuse. Existing authoritative pickup range remains unchanged. Crate cue inspected at390x844; held-item swap cue at320x844 fits above item controls. Screenshots displayed inline in task; no disk recording. Browser error log empty. QA21 closed and viewport reset.
Checks: nine targeted nearby/items/crates tests passed; strict TypeScript check passed before final QA fixture integration. Final combined typecheck/build outcome recorded below after process completion. Test command uses pinned Node with --test tests/nearby-item.test.ts tests/items.test.ts tests/crates.test.ts. New guidance test included in main suite; no fresh full suite claimed (prior85/85 evidence remains M3-label-transforms).
Limitations: normal UI walkthrough did not verify local pickup/fire/drop before bots reached items. This motivated a visibility improvement, not a claim about balance or successful natural pickup. Fixtures are synthetic. User confirmed music/SFX audible in browser/mobile viewports and physical phone connection unavailable; router cause not diagnosed. No physical-phone, headphone/speaker mix or outside-playtest approval inferred.
Next: review natural pickup/use flow and remaining presentation/interaction gates. Goal active.

Final combined command completed with exit0: nine targeted tests, strict typecheck including QA fixture changes, and static dist build all passed (session63938).
