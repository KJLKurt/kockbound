# Partial tile position uploads

Milestone/criteria: M3 V04 performance implementation support, no timing acceptance claim.
Build/content: working tree, compatibility0.12.1 unchanged.
Date/tester/environment:2026-09-09,Codex,Windows,Node24.19.0,Three0.180.0,in-app Chromium1280x720.
Scenario: tile ranges change height/visibility while adjacent tiles remain unchanged.
Expected/observed: TileBatch marks only changed vertex-component ranges for GPU upload. Pinned Three WebGLAttributes merges adjacent/overlapping ranges and clears them after upload. Existing unchanged-tile early return preserves no-upload path. Regression confirms exact changed ranges, unchanged neighboring positions/UVs, hiding/reappearance and geometry disposal.
Status: five tile-rendering/tile-simulation tests PASS; strict typecheck/build PASS (session39013). No simulation or collision behavior change.
Visual: shrinking fixture shows independently displaced outer blocks and intact neighboring geometry; reduced-motion toggle hides fallen blocks and preserves interior gap. Inline screenshots inspected; browser error log empty. QA26closed, viewport reset.
Commands: pinned node --test tests/tile-rendering.test.ts tests/tiles.test.ts; tsc --noEmit; tools/build.mjs. Local pinned Three source inspected for update-range behavior.
Screenshots/logs: inline task output, no disk recording.
Performance: upload range reduction is structural evidence only. No measured FPS gain or V04 pass claimed; previous frame-pacing issue remains open.
Limitations/next: measure representative moving-tile load if timing benefit needs quantification. Continue broader gameplay/graphics/audio/device quality work. Goal active. Main4179session37497 unaffected; main22lastready.
