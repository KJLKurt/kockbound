# Batched falling-tile rendering

Milestone/criteria: partial V02/V04, falling-tile presentation and phone performance work. Build/content: uncommitted 0.10.0; no simulation/protocol change. Date/tester/environment: 2026-09-09, Codex, Windows, pinned Node 24.19.0/Three 0.180.0, in-app Chromium.

Changed behavior: 97 separately drawn blocks become three material batches (normal caps, warned caps, side walls). Each tile retains independent vertex ranges, unchanged geometry/UVs and warning/fall/reduced-motion timing. Hidden triangles degenerate and hidden/unchanged ranges avoid further buffer writes. Rebuilds dispose old geometry.

Expected: lower draw submission cost without changing visible support boundaries, texture or warning colors.
Observed: static four-character edge-warning fixture, 1280×720 high quality, changed from 237 draws/137 geometries/95,065 triangles to 46 draws/43 geometries/99,797 submitted triangles. Draw count is about 81% lower. Extra warning-cap capacity is a deliberate triangle/memory tradeoff, including degenerate hidden triangles. No before/after sustained frame-time comparison is claimed.

Visual checks: original versus batched edge warning inspected inline; crown/paving, gold caps, seams and blue walls preserved. Falling outer blocks and interior gap inspected at 1280×720. Reduced-motion gap removal inspected at 390×844. These are synthetic fixtures, not recorded human traversal. Browser error log on retained QA tab: empty.

Commands actually run: pinned node --test tests/tile-rendering.test.ts tests/tiles.test.ts (5/5 pass, targeted-tests.txt); pinned tsc --noEmit (pass); node tools/build.mjs (final pass, build.txt). New test covers indexed source geometry extraction, independent range movement/hiding/restoration, unchanged UVs/adjacent geometry, hidden-write suppression and disposal. Previous full suite was 71/71 before this rendering-only increment; not reported as a newly run 72-test suite.

Sustained measurement: first attempt was interrupted by the task/browser session transition before completion and is excluded. Retained replacement tab runs the existing 30-second warmup plus 180-second twelve-character/effects fixture at 390×844, low quality, reduced motion off. It uses all four character identities, capped particles and repeated impact/dash effects. It does not exercise the full simultaneous item/hazard catalog or physical phone hardware. Completed result: 10,799 sample frames, p95 16.8 ms, zero hidden frames, maximum 160 particles/12 pulses. See benchmark.json. This is a desktop phone-size sample, not the real-phone acceptance target.

Status: PASS for listed targeted/build/visual checks; physical-phone V04/C06 and complete V01/V06/V07 remain unverified. Next fix camera-versus-item aim direction identified in docs/COMPLETION_REVIEW.md, then full control/pose/audio review. Full user goal active.
