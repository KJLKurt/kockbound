# Platform remover target preview

Milestone/criteria: M3 V01/V02 interaction and telegraph support.
Build/content: working tree, compatibility0.12.1; targeting helper extraction preserves existing authority behavior.
Date/tester/environment:2026-09-09,Codex,Windows,Node24.19.0,Three0.180.0,in-app Chromium.
Scenario: synthetic remover fixture at1280x720 and390x844; use actual item action button on fixture. Player facing forward from near protected core.
Expected/observed: cyan overlay marks exact eligible tile, skips core/already warned tiles, becomes the gold committed warning on Remove. Desktop before/after screenshots visually inspected and same tile confirmed. Portrait preview inspected. No logged browser errors. QA24 closed, viewport reset. Main22 last retained lobby.
Tests: nine remover-preview/tile/item-aim tests passed, including matching authority target, stable geometry reuse, hidden preview during stun/no target, protected core, falling support and camera-directed actions. Strict typecheck passed. Build before hint wording change passed session41024; final copy rebuild recorded below. No new full-suite claim.
Commands: pinned node --test tests/remover-preview.test.ts tests/tiles.test.ts tests/item-aim.test.ts; tsc --noEmit; tools/build.mjs.
Screenshots/logs: inline task screenshots/tool output; no disk image.
Performance: no new timing sample; one translucent mesh visible only while a valid remover is held; geometry replaced/disposed when target tile changes.
Limitations/next: synthetic fixture is not natural pickup proof. Online preview is advisory until authoritative movement/action processing. Actual phone usability, audio mix and other quality gates remain open; goal active.

Final static rebuild after cyan-target help text change completed exit0.
