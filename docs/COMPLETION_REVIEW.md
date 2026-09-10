# Playable goal review — updated 2026-09-10

The expanded user goal remains active. This review separates implemented behavior from missing evidence and known defects; it is not a release or completion declaration. Earlier milestone history remains in STATUS.md.

Current compatibility: **0.12.6**. Full regression after the current rotor, projectile and held-tool visibility changes: **104/104 passed**, 165.47 seconds ([output](../tests/evidence/M3-current-render-regression/full-tests.txt)). This includes ten four-client WebSocket rounds, reconnect/restart, deterministic replay, item/hazard rules and input recovery. Strict typecheck and packaged build passed with the latest client change. Tests do not certify physical devices or subjective polish.

| Requested result | Current evidence | Remaining work |
|---|---|---|
| Playable solo and room rounds, replay |104-test suite, ten four-peer WebSocket rounds, prior two-browser result agreement | Four-page Chrome run rejected two background peers (M3-four-browser-followup); diagnostic retry completed all four seats with normal1000 closures (M3-network-diagnostics). Earlier cause remains unresolved. Ten UI replay cycles passed earlier; human balance review remains |
| Phone controls, all three cameras | Independent touch movement/aim tests; normal Chromium emulated joystick+Dash/release verified (M3-browser-multitouch); portrait/landscape fixtures; actual Chrome J/L turning | Normal Chromium touch move+look verified in first/third view (M3-touch-close-cameras), move+Dash separately verified. Physical simultaneous touch use remains unavailable; direct Chrome mouse capture also verified. |
| Independent/master item and hazard settings | Registered selection, strict room config, saved controls; M3-room-selections verifies disabled/item-only/hazard-only/mixed real rooms through spawn schedules | 390px ordinary blaster approach/pickup/fire/drop verified in M3-natural-items; physical touch and reacquisition remain unverified |
| Bomb, shovel, big, blaster, wind, rolling rock, rescue hat | Authority tests cover charges, timers, mass, rescue, aim, bomb/passive expiry and overlapping stuns | Local third-person occlusion cue reviewed in M3-held-occlusion; exact hand contact, remaining angles and natural play balance still open |
| Crate, remover, interactive spring pod | Crate authority tests, pod arming/owner risk, shared cyan remover preview; deterministic safe spawn placement; normal crate proximity cue | Controlled keyboard dash/open/collect/fire/drop verified (M3-crate-controls). Natural random-spawn collection and risk/reward review remain; user question pending |
| Falling tiles, sky rocks and gusts | Warning/impact tests and visual fixtures; expanded 12-character busy-scene review | Physical-phone readability/performance |
| Warned falling edge blocks | Support/substep/rescue tests; batched tile visual review; full180s expanded benchmark | Strict16.7ms target narrowly missed (latest direct Chrome16.9ms); physical phone unmeasured |
| More characters and colors | Four identities/four palettes, shared rig/export checks, online cosmetics; arm/torso pose layer | Exact grip at every angle and remaining deformation/transition polish |
| Good music and SFX | Original18-WAV bank; user reports “everything sounds good” in response to warning clarity/clicks/harshness/missing-effects question; priority/interruption regression coverage | Separate headphone/speaker coverage was not specified; physical phone audio unverified |

Performance evidence: [sustained sample](../tests/evidence/M3-render-budget/sustained.json) contains10,772 frames over180seconds after30seconds warmup, framep9516.8ms, GPU11.17ms, zero hidden/discarded/pending/errors. Viewport1920x1080, drawing buffer1652x929: near60FPS on that desktop fixture, **not** native1080 or V04 pass.

Release limitations remain explicit: V05 now has a separate packaged desktop load/heap observation in M3-load-memory:7.15MiB transfer, Play ready1.284s on loopback, ten-cycle samples without sustained used-heap growth. Approximate Chromium heap and loopback timing are not physical-phone results. V06/V07 listening/outside-tester gates remain open. Later design milestones remain gated; this review does not authorize commerce or public deployment.

## Control issue fixed in 0.11.0

Camera dragging changes view yaw, but item commands carry only movement. A stationary first/third-person player can turn their camera and then fire along the character's old world heading. The ranged/remover paths use movement or saved facing; bomb/pod also use saved facing before the current movement is applied. This is indirect source evidence, not yet a captured interactive reproduction. This is now fixed by optional bounded aim across local/online validation and all directed items; 76 tests and a camera-drag/fire browser fixture pass. See ITEM_AIM_CONTRACT.md and M4-camera-aim evidence. Held-prop alignment and real-device controls remain next.

## Evidence boundaries

Desktop Chromium at phone dimensions does not prove physical phone/Safari behavior. Numeric PCM checks do not prove pleasing or audible audio. No outside tester approval has been supplied. Native Cloudflare workerd on Windows remains unverified after its startup crash; Node room preview is the working local online authority. No deployment or commerce is authorized implicitly.

Update 0.12.0: held models now follow animated shared hand/head sockets and replicated item bearing; stationary body/prop turn and first-person fit reviewed. Moving upper-body/grip animation remains incomplete. Full77 plus drop transition regression, typecheck/build passed.

Follow-up: a blended, reversible chest/right-arm hold layer now supports idle/run with limited reach and reaction transitions. All four GLBs pass repeated restoration checks; desktop/phone-size synthetic poses inspected (M3-item-pose). This advances moving presentation but does not establish precise hand contact for every item and aim angle.

## User test report — 2026-09-09

Follow-up 2026-09-10: asked whether warning sounds stay clear over music and whether clicks, harsh sounds or missing effects were noticeable, the user replied “everything sounds good.” This is positive subjective browser audio feedback, beyond the earlier audibility-only report. Playback hardware was not specified, so it does not establish both headphone and speaker coverage for V06. See M3-user-audio-feedback evidence. Do not repeat the same general listening question.

User reports they cannot connect from the phone right now and suspect router/networking they note the agent does not control. Treat physical-device testing as unavailable; no actual phone failure cause has been diagnosed and no C06/V04 physical-phone pass is claimed. Do not repeatedly ask them to retry the same unavailable setup.

User also reports hearing music and sound effects while testing in the browser and mobile-sized viewports. This is direct evidence of browser audibility, not a claim of headphone/speaker mix quality, absence of masking/clicks, or actual mobile-device playback. Continue independent gameplay/presentation work; this limitation alone is not a global goal impasse.

Latest user feedback: the game seems good from what they can tell; desktop first/third camera turning felt awkward. Mouse look, retry recovery and J/L were added in response. J/L was visually verified in both close views. This is limited positive feedback, not blanket acceptance of every quality gate.


2026-09-10 replay evidence: ten normal rounds and ten replay countdowns completed without reload, including win/loss screens; browser warnings/errors empty. Idle local player, so this verifies repeated UI lifecycle only. It does not measure heap or replace natural control/item use and outside testing. See M3-current-regression/replay-results.json.




2026-09-10 direct mouse check: isolated headed Chrome successfully captured game canvas, turned first/third views after mouse-button release, and released/paused on Escape. Screenshots and DOM evidence in M3-direct-mouse supersede earlier uncertainty for direct Chrome only. No physical-phone or subjective comfort approval inferred.


2026-09-10 direct Chrome performance: full180safter30warmup,10,757frames, p95frame16.9ms/GPU10.03ms, nohidden/discarded/pending. Same1920viewport/1652x929drawingbuffer. M3-direct-performance confirms near60FPS but still misses strict16.7ms; one QA favicon404, no other errors. No optimization gain claimed across differing browser contexts.








