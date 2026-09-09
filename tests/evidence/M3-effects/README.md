# M3 directional effects and visual QA

Milestone/criteria: partial V02/V04/V05. Build: uncommitted 0.1.0, unchanged simulation/content contract. Date/tester: 2026-09-07, Codex on Windows; Node 24.19.0, TypeScript 5.9.3, Three.js 0.180.0, in-app Chromium, loopback 4181, native 639×642 drawing buffer, high quality.

Implemented: short directional dash ribbon; ground hit pulse capped at 16 with material disposal; reset clears particles/pulses. Reduced motion removes the ribbon, limits bursts and uses short static pulses. Original canvas/geometry visuals introduce no external asset or authoritative collision change.

Scenario: `pnpm dev:qa`, development-only synthetic warning/shrink/effect frames and twelve-bot normal-rule round cycles beginning seed 31. Fixtures do not prove full match timing. Expected: readable warning with reduced motion, bounded transient effects, stable normal match rendering. Observed: effects frame and warning with reduced motion on/off visually inspected inline; twelve-player scene observed. No screenshot file or continuous animation recording is claimed. Browser error/warning query returned [].

Commands actually run: strict `tsc --noEmit`, `node tools/build.mjs`, `node --test tests/effects.test.ts tests/server.test.mjs`. All passed; 2 targeted tests. Lifecycle test verifies 16-pulse cap, expiry/disposal and preservation of unrelated scene objects. Normal-server smoke rejects QA/tools routes. QA runner is now part of strict typechecking; static build excludes it.

Performance method: requestAnimationFrame intervals, 30-second warmup, intended 180-second sample, real normal-rule bot rounds with automatic restart. Last observed at 38 seconds remaining: 8,522 frames, p95 16.80000000000291 ms, zero hidden frames, maximum 160 particles and 11 pulses. Browser task transition removed the unretained QA tab before final collection; completed three-minute result is NOT verified. This is preliminary small-viewport evidence, not V04 pass. Participants are eliminated normally, so density is not twelve standing throughout. A subsequent sustained twelve-character reference measurement is required.

Status: PARTIAL. Next: durable benchmark result capture, sustained crowd/reference 1080p check, audio listening/compression, continuous animation/deformation polish and outside playtest. Full game goal remains active.

Follow-up: benchmark button now selects a sustained synthetic twelve-character orbit/effect fixture, while the separate crowd button retains ordinary bot round cycles. The new stress fixture is typechecked but no completed measurement is claimed. Phone work took priority under D38.
