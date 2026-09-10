# Moving label transforms and regression follow-up

Date/tester/environment:2026-09-09,Codex,Windows desktop Chromium,Node24.19.0,Three0.180.0. Rendering/UI-only, protocol0.12.0 unchanged.

Change: player labels use fixed left/top0 and a translated3D transform preserving the projected screen coordinate and original -50%/-100% anchor. A transform-change hint allows browser compositing; repeated movement no longer writes layout left/top. Labels still hide for elimination, lobby, offscreen projection and local first-person view. No collision changes.

Visual checks: close-camera moving fixture at1280×720 and expanded390×844 low-quality scene show labels above the associated players. Inline screenshots, no disk recording.30s diagnostic after5s warmup completed1,537CPU/GPU samples: frame p9533.5ms,CPU callback16.2ms,submission11.7ms,GPU6.378ms;hidden/pending/discarded0 (profile.json). Frame cadence did not improve; lower CPU readings across these short uncontrolled samples are not a controlled performance claim. Browser error log empty; QA18 closed, viewport reset.

Normal main game was confirmed in lobby, refreshed and tested at390×844: Play/countdown, accepted dash showing cooldown, joystick drag and subsequent spectator-disabled dash observed. A later attempted directional dash was not captured as accepted before elimination, so it is not claimed. Sparse agent inputs do not establish control feel/balance or physical-phone behavior.

Strict typecheck passed. Full suite currently tracked in full-tests.txt/session78401; final outcome and build will be recorded after terminal completion. No full-suite success inferred from partial output. Goal active.

Full suite completed85/85,zero failures/skips,in114.75seconds (session78401 exit0; full-tests.txt). This covers the accumulated audio priority, GPU-query, hazard/projectile/item batching and simulation/network regressions. Native Windows workerd/physical-phone tests remain separately unavailable, not implied by this result.

Normal UI round completed: Mochi won at22seconds,local player1hit/0ring-outs. Back to the island returned to lobby; viewport reset, main11 retained, final browser error log empty. This is a functional round observation, not human balance approval.

Final static build passed (session17645 exit0).
