# Graphics interruption recovery

Criteria: partial C06/V03. Date/tester: 2026-09-08, Codex, Windows in-app Chromium at 639×642, Node 24.19.0. Uncommitted build, unchanged simulation/content release.

Scenario: `node tools/dev-server.mjs 4184 --qa`, `/?context-qa`. Development-only controls invoke actual WEBGL_lose_context extension, rather than synthetic DOM loss alone. Expected: pause/neutralize, explicit recovery message, restored arena, manual resume. Observed: loss during countdown/active transition displayed recovery panel and paused local round; restoration removed only recovery panel, leaving pause; Back to the action restored visible arena/characters and countdown. Initial test helper incorrectly reacquired the extension after loss; corrected it to retain the original extension, then repeated successfully. Screenshots inspected inline; no separate file claimed.

Unit checks: graphics listener cancels default loss handling to permit restoration, deduplicates loss events, ignores unsolicited restores and removes listeners on disposal. Graphics/touch/audio targeted run: 6 tests passed. Actual online context-loss neutralization and real device memory-pressure behavior remain unverified. Test controls are only injected by an explicit QA server/query; normal and compiled product pages exclude them.

Status: PARTIAL phone resilience improvement. Continue the expanded goal in PLAYABLE_EXPANSION.md; do not treat this check as whole-phone or finished-game approval.

Final checks: strict TypeScript and static build passed; one server test passed, including rejection of /qa-context.ts on normal servers.
