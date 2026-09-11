# Project status

## Multi-team Arena and cooperative Cloud King — 2026-09-10

Explicit user implementation request completed as a playable 0.13.0 candidate. Match setup selects free-for-all, Team Arena or Boss co-op and 2–12 participants. Team size supports every valid equal split with 2–6 members and at least two teams, including 2v2v2 and 3v3v3v3. Team IDs, bot targeting, friendly attack immunity, team outcomes, HUD and victory audio use the shared contract. Rooms expose up to 12 human seats; Pages remains one human with bot fill.

Cloud King and the authored Tempest variant have two phases, three chargeable runes, a dash-pushed core, boulder/sweep telegraphs, scaled objective counts, recovery, victory and wipe/timeout defeat. Bots complete objectives with ordinary inputs. Boss floors stay intact; other chosen falling content remains. The procedural crown/cloud/face/hands/core visual follows the original concept vocabulary; it is an encounter candidate, not a finished Blender reproduction. [Contract](PARTY_MODE_CONTRACT.md) records exact rules and limits.

Final full suite: **115/115 passed**, 383.259s, including twelve-human socket checks, complete team/boss local-authority parity, deterministic bot completion of both boss variants at 4 and 12 participants, reconnect/restart, and existing gameplay checks. Typecheck exit 0. Worker dry-run passed with pinned Node 24 outside the sandbox after a directory-access error and an initial retry selecting system Node 18; no deployment/resources created. Desktop 3v3v3v3, 390px 2v2v2 setup, boss phone layout and corrected desktop boss framing visually inspected. Normal browser co-op with falling content completed in 34s with an idle human and three bot allies. [Evidence](../tests/evidence/M4-party-modes/README.md) records final build and browser checks.

Next: user publishes through Pages Actions and playtests team/boss feel on physical phones. Existing dev servers need restarting for the new `content/` module route and 0.13.0 server rules. No deployment performed, no physical 12-player performance claim, and no completion claim for all M4: controller/local-human seats, Hill, second map and remaining device/public-hosting gates are still open. The earlier mode-priority question is superseded by the explicit implementation request.

Final integration cleanup routes boss lifecycle and bot behavior through ModeHandler hooks. After that refactor, party/simulation checks passed 21/21, typecheck and root build passed; the 115-test full suite and Worker dry-run preceded the refactor. Root/project-subdirectory static checks passed 2/2. Final browser warning/error console was empty, viewport reset, temporary tab/server closed; existing port 4179 server untouched.

## Party-mode feedback and scope clarification — 2026-09-10

User reports falling content is popular and requests more participants, teams with selectable sizes, and original-concept boss co-op. Inspected current implementation: Pages is fixed1human+3bots FFA; room menu max4humans; shared config supports up to12 but teams/boss/local multi-human seats are unimplemented. [Party-mode plan](PARTY_MODE_PLAN.md) records proposed increments and acceptance work. User priority question pending: Pages modes with bots or friends on separate phones first. No gameplay changes or tests in this feedback/planning increment; no deployment. D86 modifications remain preserved.

## Stronger pushes and persistent duel buildup — 2026-09-10

User relayed positive player feedback and requested more impact in difficult 1v1 finishes. D86 playtest candidate raises base dash/shovel impulse7→8.5 and per-hit vulnerability.2→.3; recovery begins after6 seconds (was2), at.05/s (was.1). Movement/dash timing, vulnerability cap2 and impulse speed cap22 are unchanged. Shared local/online/human/bot rules remain identical; item-hit buildup shares the tuning and wind's existing falloff floor follows the dash baseline. Compatibility0.12.7. HUD already displays extra knockback percentage.

Controlled four-second exchanges: old pushes remained7 on all four hits; new8.5/11.05/13.6/16.15. Measured target displacement2.023 each old hit versus2.392/3.020/3.648/4.319 units. Direct typecheck and root static build passed. Final simulation12/12 passed, including10,000-tick replay and20 seeded rounds; other40 targeted authority/network/item tests passed. Browser solo round completed (Clover winner,17s, idle human); screenshot inspected and console warning/error list empty. This is functional verification, not player approval of the new feel. [Evidence](../tests/evidence/M3-duel-knockback/README.md) records full-suite outcome and limitations. Next: publish through the existing Pages workflow and gather player feedback on this candidate; no deployment performed. Scope remains this feedback adjustment, not autonomous milestone work.

## Solo GitHub Pages deployment preparation — 2026-09-10

User requested GitHub Actions publishing under the repository-name subdirectory for phone testing. Added `.github/workflows/pages.yml`, deployment guide, validated `BASE_PATH` static build option, and module-relative model/audio URLs. Static output keeps multiplayer disabled; root builds and Cloudflare config remain supported. No gameplay feature work resumed and no deployment executed.

Direct installed TypeScript check passed (exit 0); two static-build tests passed for root/project paths and invalid-path rejection. In-app Chromium loaded `/KnockBound/`, started a four-character solo round and rendered the arena; screenshot inspected, warning/error log empty. Local pnpm launcher failed its automatic dependency check; direct Node tools were used without reinstalling dependencies. [Evidence](../tests/evidence/M3-pages/README.md). Next: user enables Pages → GitHub Actions, pushes to main (or adjusts release branch), then tests the deployed HTTPS URL on a physical phone. Live Actions and phone checks remain unrun.

## Development stopped at user request — 2026-09-10

User requested deployment and phone-test instructions and stopped feature work. No deployment executed. Unfinished input-aware hint tweak reverted; existing104-test game baseline retained. Public Cloudflare URL/rooms remain disabled in config until user changes them. Solo is ready for deployed playtesting; multiplayer still needs live Worker validation and public deployment safeguards. See server/worker/README.md for known limitations. Do not continue feature work without a new user request.

## First/third-person touch integration — 2026-09-10

Normal390px Chrome touch emulation verified joystick movement plus camera drag in both close views, independent look release and final joystick clear. Four before/after screenshots inspected; touch never captured the mouse. [Evidence](../tests/evidence/M3-touch-close-cameras/README.md) records limits and final cleanup. No game change; physical-device and outside-player evidence remain open.

## Normal-browser simultaneous touch — 2026-09-10

Chromium two-contact emulation in the normal390px game verified joystick+Dash, retaining movement when only Dash contact releases, and clearing on final release. [Evidence](../tests/evidence/M3-browser-multitouch/README.md) records a corrected protocol test mistake; no game bug/fix inferred from the invalid first attempt. This strengthens browser wiring coverage, not physical-phone proof. No runtime change; next close-camera touch alongside movement.

## Controlled crate input path verified — 2026-09-10

New QA Crate control practice uses production KeyboardInput and ordinary simulation ticks. Actual D/Space opened/collected5shot blaster, E reduced to4, Q cleared HUD;390px repeat collected successfully. Desktop/phone captures inspected, console0. [Evidence](../tests/evidence/M3-crate-controls/README.md) distinguishes controlled fixture from random-spawn/physical-touch tests. QA-only change; pending user question remains open.

## Normal crate openings remain unverified — 2026-09-10

Three normal round openings produced blasters; one subsequent attempt ended in player elimination. No successful crate interaction observed. [Evidence](../tests/evidence/M3-crate-opening-attempts/README.md) records inspected captures, zero console errors and test-script correction. No game change. Targeted user question is pending; do not repeat random opening attempts or duplicate the question. Continue independent fixture/interaction review.

## Current full rendering regression — 2026-09-10

All104 default-suite tests passed165.47s after the current rotor/projectile/occlusion changes. Includes ten four-client WebSocket rounds, host-option exclusions, deterministic replay, input and rendering checks. [Full evidence](../tests/evidence/M3-current-render-regression/README.md). Corrected obsolete item-contract version/future-work prose. No game change or preview restart. Remaining physical-device, natural interaction and outside-test evidence stays open.

## Held-tool visibility cue — 2026-09-10

Local third-person directed tools now show a subtle cyan silhouette where opaque geometry hides them. Camera, aim and hand attachment stay unchanged. Sprout blaster and Wisp wind/drop inspected at desktop/phone sizes;10 targeted checks pass. [Evidence](../tests/evidence/M3-held-occlusion/README.md) records final checks and limits. This improves recognition without claiming every pose is polished. Compatibility0.12.6; refresh main4179.

## Wider carry pose rejected — 2026-09-10

A substantially wider hand-attached carry pose still failed to expose the third-person blaster clearly in the desktop fixture. Reverted exactly; [evidence](../tests/evidence/M3-wide-carry/README.md) retains inspected captures and phone-header limitation. No game/build change retained. Next address camera/head overlap rather than repeat arm-only offsets.

## Host selection integration coverage — 2026-09-10

Four real WebSocket rooms now exercise all-off, item-only, hazard-only and mixed selections across400 ticks each. Disabled systems stayed absent; selected blasters and gusts actually appeared. Targeted test passed30.02s; [evidence](../tests/evidence/M3-room-selections/README.md) records fixture correction and typecheck. No production behavior change; preview4179 unchanged. Remaining natural interaction/presentation/device work stays open.

## Four-browser diagnostic round — 2026-09-10

Added optional local socket diagnostics and an isolated QA journal. All four normal Chrome seats completed room248497; server closures were1000 “Room ended”, with no socket errors. Earlier rejection was not reproduced and remains unexplained. Five transport checks passed; [evidence](../tests/evidence/M3-network-diagnostics/README.md) records final checks and artifact limits. Main4179 unchanged. Continue quality work and capture actual rejection details if it recurs.

## Four-browser connection follow-up — 2026-09-10

Normal four-human room7D6DF5 revealed two rejected background peers; host and one peer reached a76second draw while the rejected seats forfeited. Visible rejection is verified, root cause is not. [Evidence](../tests/evidence/M3-four-browser-followup/README.md). Crate collection remains unverified. Next capture close code/reason and resolve the browser connection issue; automated WebSocket passes do not explain it. No production code changes this turn.

## Projectile motion between ticks — 2026-09-10

Blaster/wind/rock positions now interpolate in local and online presentation; latest authority retains hits/removal. Buffered spawn handling avoids backward jumps.19 targeted checks, strict typecheck/build and a real WebSocket round passed. Desktop/390px/reduced fixtures inspected; [evidence](../tests/evidence/M3-projectile-interpolation/README.md). Gameplay/schema unchanged,0.12.6. Frame-rate/device acceptance remains separate.

## Smooth helicopter rotor — 2026-09-10

Helicopter-hat spin now advances on presentation frames instead of20Hz authority ticks, retaining its speed and reduced-motion stop. Frozen presentation time freezes spin; game state is unchanged. Four rendering/rig checks, typecheck and build passed; actual hat frames/reduced mode inspected. [Evidence](../tests/evidence/M3-rotor-interpolation/README.md). Client-only change,0.12.6; full100-test run predates this increment.

## Repeatable character/item review — 2026-09-10

QA page now selects all four characters, nine held items and five movement poses. Four blaster character comparisons and corrected rock/hat phone fixtures inspected. A reused fixture ID initially retained the old item model; corrected with per-kind IDs. [Evidence](../tests/evidence/M3-pose-review-controls/README.md) separates rejected captures from final results. No production game change; the new controls support the remaining grip and visibility review.

## Current full regression — 2026-09-10

All100 tests passed in97.86seconds on0.12.6 after both recent fixes. Includes10four-client WebSocket rounds, deterministic replay, reconnect/restart and touch recovery. [Evidence and full log](../tests/evidence/M3-current-100/README.md). Completion review refreshed with current verification and remaining limits; no game code change or fresh build this turn. Main4179 unchanged. Goal active.

## Joystick capture recovery — 2026-09-10

Fixed a reproduced control recovery bug: rejected pointer capture left the joystick owned by a failed gesture, ignoring the next touch. Failure now clears ownership, input and knob position.11 targeted tests and strict typecheck passed; [evidence](../tests/evidence/M3-touch-capture-recovery/README.md) records final build outcome. Client-only change, compatibility0.12.6. No physical-phone result claimed.

## Normal crate walkthrough — 2026-09-10

Phone-sized Chrome ordinary controls verified the crate proximity instruction and continued play through a contested dash and ring-out. Successful local crate collection was not observed; the second crate stayed intact at elimination. [Evidence](../tests/evidence/M3-natural-crates/README.md) preserves screenshots and this limitation. No code change or new automated test run; current0.12.6/main4179 unchanged.

## Bot escape direction — 2026-09-10

Fixed bots standing still when directly on a bomb or arming pod: coincident centers now choose a deterministic inward escape, with +X fallback at arena center. Ordinary input/collision rules remain in force. Compatibility0.12.6. [Evidence](../tests/evidence/M3-bot-danger-escape/README.md): reproduced failure,27 targeted checks including replay/20rounds, strict typecheck/build and real WebSocket adapter round passed. Main preview restarted at4179/session35734; refresh existing clients. Goal remains active.

## Held-tool silhouette experiment — 2026-09-10

An outward elbow/forearm candidate increased hand clearance but did not make the third-person blaster sufficiently visible in desktop and 390px moving fixtures. Reverted to the existing pose; four-character restoration check passes. [Evidence](../tests/evidence/M3-hold-silhouette/README.md) preserves comparison images and the rejected values. No retained gameplay or asset change. Next investigate tool occlusion treatment or a deliberately revised carry silhouette.

## Positive user audio feedback — 2026-09-10

The user reports “everything sounds good” after a question about warning clarity, clicks, harshness and missing effects. Recorded as subjective browser audio feedback in [evidence](../tests/evidence/M3-user-audio-feedback/README.md); hardware unspecified, so separate headphone/speaker and physical-phone coverage remain unverified. Camera help and the prior direct Chrome first/third mouse-capture evidence were rechecked. No runtime change or new test run. Next: remaining held-tool visibility and animation review; do not repeat the general audio question.

## Direct Chrome performance — 2026-09-10

Full180s stress sample10,757frames (~59.8FPS), p95frame16.9ms/GPU10.0ms, no hidden/invalid samples. [Evidence](../tests/evidence/M3-direct-performance/README.md). Same capped1080viewport, strict16.7target still missed; QA favicon404 only. Isolated browser closed, no game code change. Goal active.

## Direct mouse capture verified — 2026-09-10

Headed Chrome captured the game canvas and turned first/third views with no held button. Escape released/paused in both; console0. [Evidence](../tests/evidence/M3-direct-mouse/README.md) includes before/after screenshots. Supersedes previous direct-Chrome uncertainty, not physical-phone verification. Isolated browser closed; no game code change. Goal active.

## Ordinary item walkthrough — 2026-09-10

Normal390x844Chrome controls verified approach/automatic blaster pickup,5-to4shot Fire and Drop hiding inventory. Screenshots and limits in [evidence](../tests/evidence/M3-natural-items/README.md). Pauses used for inspection, no game-state injection; reacquisition after bot contact not observed. Console0. CLI0.1.19/pinnedNode setup complete, temp browser/server cleaned up. Goal active.

## Packaged load and memory — 2026-09-10

Fresh packaged load transferred7.15MiB, Play ready1.284s on local loopback. Ten round results sampled: no extra assets/errors, used heap returned below pre-play after lobby settle; approximate measurement, not phone speed or complete leak proof. [Evidence](../tests/evidence/M3-load-memory/README.md). Opt-in load QA tool/typecheck/server test complete, temp server/tab cleaned up. Goal active.

## Current regression and replay — 2026-09-10

Full98/98 tests pass in71.87seconds on0.12.5. Ten consecutive UI results and replay countdowns passed, win/loss paths, no warnings/errors; idle local player, so no control/balance approval. [Evidence](../tests/evidence/M3-current-regression/README.md). Main in-app37 lobby, authority4179/session60040 unchanged. Completion review refreshed; remaining cold-load/heap, natural play, visual/audio/device gates open. Goal active.

## Safe pickup placement — 2026-09-09

Fixed scheduled items spawning over holes and vanishing immediately. Bounded seeded placement avoids holes, warnings and obstacles; deterministic fallback when needed. Compatibility0.12.5. [Evidence](../tests/evidence/M3-safe-spawns/README.md) records27 targeted checks, final13-item rerun and final transport/build status. Goal active.

## Overlapping stun recovery — 2026-09-09

Fixed bomb/pod blasts shortening an existing stun. Shared simulation preserves the later recovery tick; compatibility0.12.4. Thirty targeted tests, real WebSocket adapter round, typecheck/build pass. [Evidence](../tests/evidence/M3-overlapping-stuns/README.md). Preview restart recorded there; old clients need refresh. Goal active.

## Keyboard camera control — 2026-09-09

Added J/L continuous turning in first/third person, verified visually in Chrome; ten targeted controls tests pass. [Evidence](../tests/evidence/M3-keyboard-camera/README.md) records final typecheck/build. Mouse capture diagnosis: automated Chrome returns WrongDocumentError for invalid root document, not a server policy. Temporary logging removed. Original Chrome preferences restored. Goal active.

## Mouse capture recovery — 2026-09-09

Fixed reproduced off/on retry failure after denied mouse capture; explicit fallback hint and immediate capture release. Nine targeted checks pass. [Evidence](../tests/evidence/M3-mouse-retry/README.md) records final build status. Isolated regular Chrome automation also fell back, Escape paused, errors/warnings empty; actual continuous capture still unverified. Restored original Mouse look off setting. Goal active.

## Desktop camera usability — 2026-09-09

Added saved Mouse look option for continuous desktop first/third-person turning; touch and denied-capture drag fallback preserved. Nine targeted controls/aim checks pass; browser setting/fallback inspected. [Evidence](../tests/evidence/M3-mouse-look/README.md). Earlier full regression 93/93 passed. Final build/check outcomes recorded in evidence; regular-browser capture feel remains unverified. User reports game seems good except awkward desktop turning; physical phone unavailable. Goal active.

## Passive expiry order — 2026-09-09

Fixed Big mode retaining gust resistance on its expiry tick. Ordinary tools now expire before gameplay effects; bomb/pod handlers remain intact. 28 targeted checks, final 10-item rerun, typecheck and build passed. [Evidence](../tests/evidence/M3-passive-expiry/README.md). Compatibility 0.12.3; preview session 71369 at 4179. Goal active.


## Bomb expiry boundary — 2026-09-09

Fixed expiry-tick Toss extending an expired bomb fuse and Drop relocating its blast.20targeted checks plus realWebSocketadapter round/typecheck/build pass. Compatibility0.12.2; preview4179restarted session12168. [Evidence](../tests/evidence/M3-bomb-expiry-boundary/README.md). Goal active.


## First-person item framing — 2026-09-09

Raised/reduced first-person prop so its upperpart is visible above phoneitemHUD;390px inspected/errors0. Reverted shoulder-camera/arm experiments. Eight item/aim/pose checks pass. [Evidence](../tests/evidence/M3-first-person-framing/README.md). Third-person occlusion remains; goal active.


## Sustained render-budget validation — 2026-09-09

180s after30s warmup:10,772frames (~59.8FPS), framep9516.8ms/GPU11.2ms withsoftshadows,1080viewport/1652x929buffer. No hidden/invalid samples/errors. [Evidence](../tests/evidence/M3-render-budget/README.md). Strict16.7target still narrowly exceeded, notnative1080/phonepass. Continue broader gameplay/presentation work; goal active.


## 3D render pixel budget — 2026-09-09

Cappedlarge-display3D drawing area while keeping nativeUI and small-phone resolution.1080viewport/1652x929buffer shortsamplep9516.8ms,softshadows retained; desktop/portrait inspected. Typecheck/assertions/build pass. [Evidence](../tests/evidence/M3-render-budget/README.md). Full-duration/native1080acceptance unproven; goal active.


## Shadow filter candidate rejected — 2026-09-09

Basic2048shadows produced jagged/self-shadow artifacts and no useful timing gain; restoredPCFSoft1024. [Evidence](../tests/evidence/M3-shadow-filter/README.md). Preserve visual quality; frame target remains open. Goal active.


## Shadow caster experiment — 2026-09-09

Excluding eye meshes from shadow casting yielded no useful timing gain (framep9533.3ms/GPU13.2ms); experiment reverted. [Evidence](../tests/evidence/M3-shadow-casters/README.md). Keep full character shadows; next investigate filtering/pass cost. Goal active.


## Shadow map resolution — 2026-09-09

High-quality shadows use1024map with existing filtering/update cadence; close desktop/portrait shadows inspected. Short1080pGPU p9512.8ms, frame33.2ms still misses target. [Evidence](../tests/evidence/M3-shadow-resolution/README.md). Goal active.


## Dynamic shadow diagnostic — 2026-09-09

Paired30s1080p samples: shadows off framep9516.8ms/GPU10.4ms; on33.7ms/GPU15.4ms. Resolution unchanged, no hidden/invalid samples/errors. [Evidence](../tests/evidence/M3-shadow-cost/README.md). Strong optimization lead, not acceptance; preserve quality until cheaper shadows are reviewed. Goal active.


## Benchmark reporting overhead — 2026-09-09

Percentile sorting now occurs after measurement and caches final results. Full1080p180s sample8,519frames: callbackp9514.9ms (previous19.8), frame still33.7ms, GPU16.3ms; no invalid/hidden samples/errors. [Evidence](../tests/evidence/M3-benchmark-reporting/README.md). Target still missed; next GPU/shadow and submission cost. Goal active.


## 1080p performance baseline — 2026-09-09

Expanded high-quality180s sample after30s warmup:8,306frames, p9533.7ms versus16.7ms target; GPU16.6ms, no hidden/discarded frames/errors. [Evidence](../tests/evidence/M3-1080-baseline/README.md). Target missed; growing percentile-report sorting may add overhead. Next bound instrumentation work and distinguish renderer/GPU costs. Goal active.


## Partial tile buffer uploads — 2026-09-09

Falling/hidden tiles upload only changed position ranges. Five tile checks/typecheck/build pass; falling and reduced-motion fixtures inspected/errors0. [Evidence](../tests/evidence/M3-tile-upload-ranges/README.md). No FPS improvement measured; goal active.


## Audio interruption feedback — 2026-09-09

Audio status now reflects browser suspension and exposes resume; it reports ready only when context is running. Four audio tests/typecheck/build pass; existing layers reused. [Evidence](../tests/evidence/M3-audio-state/README.md). Physical interruption/listening checks remain open. Goal active.


## Full integration regression — 2026-09-09

Full90/90 pass in70.27seconds. Packaged dist at390x844 loads/plays with accepted dash, spectator state and pause/leave/new-round flow; logs empty. [Evidence](../tests/evidence/M3-integration-followup/README.md). Temporaryserver/tab cleaned up. Goal active; real-device, presentation and performance gates remain open.


## Remover target preview — 2026-09-09

Cyan tile preview now shows the remover target before use, sharing the authority sampler. Desktop action changes that tile to gold warning; portrait fixture inspected/errors0. Nine targeted tests/typecheck pass. [Evidence](../tests/evidence/M3-remover-preview/README.md). Goal active.


## Restart journal reliability — 2026-09-09

Removed repeated writes of already-cancelled records at startup. Two filesystem regressions and real transport restart check pass, plus strict typecheck. Required save errors still fail startup safely. [Evidence](../tests/evidence/M2-journal-restart/README.md). Constructor fix applies on next restart; current4179session37497 unchanged. Goal active.


## Landscape hint placement — 2026-09-09

Moved aim/pickup hints to lower center for short landscape viewports and adjusted item panel spacing. Normal844x390 screenshot and667x375 fixture bounds checked; browser errors0. [Evidence](../tests/evidence/M3-landscape-hints/README.md). Main22 ready lobby, viewport reset. Actual phone comfort remains unverified; goal active.


## Closest pickup and switching — 2026-09-09

Automatic pickup now selects the closest eligible item, matching nearby guidance. Same-tick drop/swap preserves charges and expiry; tie/range cases checked. Authority and real WebSocket checks passed; corrected item tests8/8, typecheck/build pass. Compatibility0.12.1. [Evidence](../tests/evidence/M3-closest-pickup/README.md). Preview4179 restarted session37497 after transient EPERM on first attempt. Goal active.


## Nearby pickup guidance — 2026-09-09

Added closest-item ring and pickup/swap/crate guidance, including live-fuse warning. Nine targeted tests pass;390/320px fixtures inspected without logged errors. Natural local pickup/fire/drop remains unverified in this walkthrough. [Evidence](../tests/evidence/M3-pickup-guidance/README.md). Physical-phone connection unavailable per user; browser audio audible, no full mix approval inferred. Goal active.


## Label transforms and full regression — 2026-09-09

Labels now move via transforms, preserving their projected anchor. Close/phone fixtures inspected; short diagnostic frame p95 still33.5ms. Full85/85 tests pass in114.75s. Current normal phone-sized round completed with1hit and working results/home; no browser errors. [Evidence](../tests/evidence/M3-label-transforms/README.md). Main11 ready lobby, viewport reset. Physical phone/quality gates remain open; goal active.

## Item-part batching — 2026-09-09

Held/ground item parts share geometry/material submissions while keeping original transforms, blinking, rotor motion and warnings. Three rendering tests/typecheck pass; passive/crowded fixtures inspected. Short diagnostic submission p9512.4ms (previous14.1), frame still33.5ms: no established FPS gain. [Evidence](../tests/evidence/M3-item-batches/README.md). Goal active.

## Direct GPU diagnostic — 2026-09-09

Asynchronous query sample completed with1,516/1,516 valid GPU/frame samples and no discarded/pending/hidden frames. GPU p956.3ms versus CPU submission14.1ms suggests CPU/driver overhead is the stronger current target; not a phone or FPS-improvement claim. Diagnostic test and corrected typecheck pass. [Evidence](../tests/evidence/M3-cpu-profile/README.md). Goal active.

## Graphics backend diagnostic — 2026-09-09

Matrix split gives p951.8ms for scene matrices versus10.5ms inclusive submission and33.3ms frame in a30-second sample. Browser reports Intel UHD/ANGLE D3D11 and GPU timer queries available. [Evidence](../tests/evidence/M3-cpu-profile/README.md). Next measure asynchronous GPU duration; do not assume static transform work dominates. No phone-performance claim; full goal active.

## Frame CPU diagnostic — 2026-09-09

Opt-in timing separates scene preparation from WebGL submission. Two30-second desktop phone-size samples suggest submission is the largest measured region (split p95:14.7ms submission,6.3ms scene,33.5ms frame); uncontrolled background build means this is diagnostic, not an acceptance result or GPU timing. [Evidence](../tests/evidence/M3-cpu-profile/README.md). Next isolate submission/driver work before assuming more batching solves frame pacing. Goal active.

## Projectile batching — 2026-09-09

Ranged effects now share three persistent rendering batches, preserving projectile positions/rotation, wind spacing and reduced-motion rocks. Six targeted checks plus the added reduced-motion assertion pass; final typecheck and static build pass. Ranged and expanded phone-size fixtures inspected. [Evidence](../tests/evidence/M3-projectile-batches/README.md). Timing result tracked there; lower draw count alone is not a phone-performance claim. Goal active.

## Audio cue priority — 2026-09-09

Fixed crowded effects stealing important warnings and starting replacements before outgoing fades ended. Four audio checks/final typecheck/build pass; simulated cue storms retain20-voice playback bound. [Evidence](../tests/evidence/M3-audio-priority/README.md). Waveforms unchanged; actual listening/mix approval remains open. Main tab11 refreshed; goal active.

## Expanded rendering load — 2026-09-09

Expanded stress scene now combines12 animated characters, held/ground items,18 projectiles, hazard warnings and tile gaps. Batched21 gust arrows into one draw, preserving presentation and removing20 submissions. Four targeted tests, corrected typecheck and build pass. Baseline180-second desktop phone-size sample p95=33.5ms; optimized sample tracked in [evidence](../tests/evidence/M3-expanded-performance/README.md). No physical-phone or material FPS improvement claimed. Goal active.

## Phone settings help — 2026-09-09

Camera selection moved to top; individual item/hazard choices expand into concise use/risk explanations, keeping master switches visible. Checked collapsed390px and expanded320px views, all hazard help and All set. Typecheck/build pass; no new full-suite claim. [Evidence](../tests/evidence/M3-settings-help/README.md). Main tab11 retained ready at4179; viewport reset. Goal active.

## Full build regression — 2026-09-09

Current full suite passes80/80 in75.23 seconds, including real WebSocket rounds and the recent input/pose checks. Actual dist build loaded through a separate loopback server; normal Play/dash/hazard warning observed and browser error log empty. [Log and scope](../tests/evidence/M3-item-pose/README.md). Physical-phone and native Windows workerd checks remain separate and unverified. Full goal active.

## Blended item pose — 2026-09-09

Holding arm and limited torso aim now blend over idle/run, restoring the mixer pose each frame and yielding to reactions. All four exported rigs pass a repeated restoration/finite-transform check; two targeted rendering tests and strict typecheck pass. Desktop/phone-size synthetic poses inspected. [Evidence](../tests/evidence/M3-item-pose/README.md). Precise grip contact and natural traversal remain next; no complete animation or physical-device approval. Full goal active.

## Combined touch input — 2026-09-09

Added an integration check for independent movement/aim fingers, camera-relative strafe, one-shot dash/use actions, camera cancellation without losing movement, and resize/pause cleanup. Four targeted touch/camera tests pass. [Evidence](../tests/evidence/M3-combined-touch/README.md). No runtime change or physical-device approval. Next moving character/grip presentation and natural item navigation; full goal active.

## Normal play and dash feedback — 2026-09-09

Normal replay completed with one recorded hit; dash produced its expected 1.2-second cooldown. Dash button now reflects countdown, pause, unavailable controls, stun, cooldown and spectating instead of always looking actionable. Phone-size countdown/cooldown/pause inspected; strict typecheck and static build pass. [Evidence](../tests/evidence/M3-dash-feedback/README.md). No balance or physical-device approval inferred. Ready lobby retained at 4179. Next continue natural item/control and animation review; do not repeat unavailable phone connection requests. Full goal active.

Phone preview refreshed 2026-09-09: LAN4183 session12992, http://192.168.12.250:4183, page/current0.12.0/config/UI module HTTP200 verified from computer. User replied: phone cannot connect now, suspects router/network; physical-phone testing unavailable, do not repeatedly request retry. User has heard music/SFX in browser/mobile viewport tests, confirming browser audibility only. No physical-phone pass or full mix/listening quality approval claimed. Multiplayer4179 session98872 remains separate.

## Item feedback — 2026-09-09

Item-specific pickup hints explain passive effects, actual charges and danger; visible cooldown/stun feedback disables unavailable actions while retaining Drop during normal firing cooldown. Shared HUD browser fixture verifies five-shot start, four-shot/0.4s cooldown after use, and passive Drop-only display at phone widths. Final typecheck/build pass; no new full-suite claim for UI-only changes. [Evidence](../tests/evidence/M3-item-feedback/README.md). Next verify current LAN phone preview and continue natural input/audio/animation gates. Full goal active.

## Held prop sockets and bearing — 2026-09-09

Version 0.12.0 replicates validated aim for remote props, attaches held models to shared hand/head sockets after animation, turns stationary visuals toward aim and improves blaster details/first-person fit. Full 77 tests plus a separate drop/danger-marker regression pass; strict typecheck and build pass. Phone-size third/first-person and full-view passive fixtures inspected, correcting an oversized first-person prop. [Evidence](../tests/evidence/M3-held-props/README.md). Dedicated moving upper-body/grip poses, natural phone controls and broader animation/audio gates remain open. Full goal active.

## Camera-directed items — 2026-09-09

Version 0.11.0 separates camera aim from movement across the strict input protocol and shared directed-item rules. Stationary/strafe aim and first-frame bomb/pod turns fixed. Full 76 tests and final strict typecheck/build pass. Browser drag/fire fixture confirms 90-degree camera turn produces the matching shot with unchanged player position; offset floor bearing cue inspected at 390×844. [Evidence](../tests/evidence/M4-camera-aim/README.md), [contract](ITEM_AIM_CONTRACT.md). Room preview refreshed at 4179, session6961. Next held-prop/upper-body aim alignment, full phone control/pose/audio review. Full goal active.

## Batched falling tiles — 2026-09-09

Reduced static warning-scene draw calls from 237 to 46 while preserving block warnings, falls and gaps. Five targeted tests, strict typecheck and final static build pass. Visual checks at 1280×720 and 390×844; three-minute phone-size desktop sample completed with 10,799 frames, p95 16.8 ms, zero hidden frames. [Evidence](../tests/evidence/M3-tile-performance/README.md). [Completion review](COMPLETION_REVIEW.md) identifies next concrete issue: stationary close-camera aiming does not redirect items. Physical-phone/audio/pose and broader gameplay review remain open. Full goal active.

Updated 2026-09-09.

## Online chosen characters and colors — 2026-09-09

Version 0.10.0 sends host/guest choices on authenticated ready, updates only that seat and locks at round start. Renderer refreshes arriving guest looks. Eighteen focused and full 71 tests pass; strict typecheck/build pass. Two-browser room showed selected Sunset Wisp remotely and matching Player 1 victory at 24 seconds; guest own palette was not captured before elimination. [Evidence](../tests/evidence/M3-online-cosmetics/README.md). Next broad gameplay/camera/item quality review, actual-phone/performance, animation polish and audio listening. Full goal active.


## Pebble, Wisp and color palettes

Version 0.9.0 adds two distinct source-authored characters and Classic/Sunset/Mint/Violet palettes to local selection, saved across reload. New sources/GLBs preserve rig and ten clips, under budget; zero-warning Khronos and fresh Blender reimport pass. Full 69 tests, strict typecheck/build pass. Phone picker overlap corrected; Pebble/Wisp/palette reviewed at 390×844 and 320×568, and a Wisp round ended normally at 68 seconds. [Evidence](../tests/evidence/M3-roster/README.md), [contract](ROSTER_CONTRACT.md). Next transmit selected identity/palette for online host/join; room seats currently use assigned appearances. Broader phone/audio/pose/feel/performance gates remain open. Full goal active.


## Spring pod interactive danger

Version 0.8.0 adds Spring pod, the tenth item: pick up while safe or plant a proximity trap; it can catch its owner and expires if untouched. Warning delay, area push/stun, expiry/drop preservation and credit/mass rules tested. Nine focused and full 67 tests pass, strict typecheck/build pass. Phone-size pod footprint corrected to magenta and re-inspected. [Evidence](../tests/evidence/M4-pods/README.md), [contract](POD_CONTRACT.md). Requested item/hazard types are implemented; next additional characters/colors and remaining human/physical-phone/audio/performance/presentation checks. Full goal active.


## Optional hazards

Version 0.7.0 adds saved master/individual falling-tile, sky-rock and gust choices for solo/host rooms. Shared simulation schedules warned tile gaps, marked rock stun/push and timed directional gusts; bots avoid dangers. Seven focused and full 64 tests, strict typecheck/build pass. Phone-size warning review improved arrow contrast; Wind gusts off persisted on reload. [Evidence](../tests/evidence/M4-hazards/README.md), [contract](HAZARD_CONTRACT.md). Next additional interactive danger and character/color choices, then broader phone/audio/feel/performance QA. Full goal active.


## Mystery crates

Version 0.6.0 adds the ninth catalog choice: dash-open crates reveal one of the other enabled items, with normal single-slot pickup. Proximity/failed dashes do not open crates; full hands leave the reveal on the ground. Eight focused and all 61 suite tests passed; strict typecheck/build passed after correcting a test narrowing issue. Browser ordinary-input fixture visibly opened a crate and acquired its blaster at 390×844. [Evidence](../tests/evidence/M4-crates/README.md). Next optional tile/sky-rock/wind hazards, additional interactive danger and character/color options. Full goal active.


## Falling blocks and platform remover

Version 0.5.0 replaces uniform arena shrinking with shared support tiles: gold warning, staggered falling outside blocks, real gaps, substep fall checks, safe helicopter return and bot avoidance. Platform remover is the eighth independently selectable item and marks a forward tile before removing support. Final 59/59 suite, strict typecheck and build passed. Corrected crown/seams/fall timing reviewed at 390×844, including reduced-motion warnings. [Evidence](../tests/evidence/M4-tiles/README.md), [contract](TILE_CONTRACT.md). Next optional tile/rock/wind hazards, mystery crate/extra danger and character/color choices. Full goal active; real phone, human feel and performance/audio gates remain open.


## Ranged item catalog

Bubble blaster, wind blaster and rolling rock now work in shared solo/online authority, with charges, cooldown, range/falloff, swept hits, one-hit piercing, and rock flatten/stun. Seven saved individual toggles, Fire/count HUD, projectile models and cues integrated. Version 0.4.0. Ten focused tests and full 55/55 suite passed; strict typecheck/static build also passed after the final gust-geometry tweak. Multiplayer preview refreshed at 4179, session 40071. Phone-size synthetic scene reviewed. [Evidence](../tests/evidence/M4-ranged/README.md). Next crate/remover/additional danger, shared falling tiles/hazards and more character/color choices. Full goal active; physical-phone, audio listening and human aim/balance review remain open.


## Shovel, big mode and helicopter rescue

Four optional items now work in the shared solo/online simulation. Shovel extends forward dash reach; big mode changes temporary mass/size; helicopter hat rescues once. Passive expiry survives transfers. Models, countdown/drop HUD, rescue cue and independent saved toggles are integrated. Protocol/sim/content are 0.3.0. Targeted 16 tests and full **51/51** suite, strict typecheck and static build passed; the real OnlineSession test enables all four items. [Evidence](../tests/evidence/M4-passive-items/README.md), [contract](ITEM_CONTRACT.md).

Browser fixture and four-item Settings reviewed; disabling shovel persisted after reload, then restored. Multiplayer preview deliberately restarted for 0.3.0, session 21057 / port 4179. LAN solo remains 4183. Next blasters, rolling rock, crate/remover, tile hazards/shrink and additional characters/colors. Physical phone, audio listening and human interaction/balance gates remain open. Full expanded goal active.

## First optional item: Cloud bomb

Added shared item state/input/selection and live bomb gameplay across solo and room authority, with pickup, toss, drop, fuse, push/stun, bot use and warnings. Saved master/bomb settings apply to new solo/host matches. Cross-boundary schema versions are 0.2.0; read [item contract](ITEM_CONTRACT.md). Full 48-test suite passed, including a bomb-enabled actual OnlineSession/WebSocket round. Browser solo win/loss outcomes and corrected phone-sized warning fixture observed. [Evidence and limits](../tests/evidence/M4-bomb/README.md).

Only bombs are registered so far. Next complete interaction QA and expand to shovel/big/blasters/rolling rock/helicopter/crate/remover, optional hazards and shared falling support tiles, then additional character/color choices. Physical phone/audio checks remain pending. Full expanded goal active.

## Camera selection increment

Settings now offers full arena, third person and first person, persisted per player (D42). Close views follow the owned participant, transform movement into camera coordinates and support pointer drag look with limited pitch. First-person own mesh/label hidden; dead/result view falls back to full arena. Reviewed third/first person and mid-round switching at 390×844, a terminal 63-second round and saved First person after reload. Three camera/touch tests and strict typecheck pass; see [camera evidence](../tests/evidence/M3-camera/README.md). Camera host access is a personal Settings preference, not an enforced room rule. Next shared optional item/tile/hazard contracts, pickup/use/drop and the named catalog. Full expanded goal remains active.

## Expanded playable scope and graphics recovery

The updated user goal now requires the full [camera/item/hazard/tile/character expansion](PLAYABLE_EXPANSION.md), in addition to phone play and presentation quality. All named features are active scope under D41 and remain pending, rather than deferred catalog suggestions. Next implement camera settings and matching controls, then authoritative item/hazard/tile contracts and their complete end-to-end catalog.

Graphics context loss now pauses local simulation, neutralizes controls, mutes sound and shows a dedicated recovery panel; online controls neutralize while authority continues. Restoration clears the graphics panel but preserves local pause for manual resume. Actual browser WEBGL_lose_context loss/restore/resume was verified with arena rendering recovered. Six targeted graphics/touch/audio tests passed; additional server/typecheck/build checks recorded in [recovery evidence](../tests/evidence/M3-phone/graphics-recovery.md). No physical phone memory-pressure test or online interruption claim. Full expanded goal remains active.

## Phone audio recovery

Fixed permanent audio failure after a transient fetch/decode error. Failed loads can retry on later interaction (three-second backoff) or immediately through Retry sound in Settings. Existing decoded music survives interruption/resume without duplicate layers. Three audio tests, strict typecheck and static build pass. Actual LAN browser Settings reports Sound ready after click; failure/resume paths were tested with a controlled AudioContext/fetch fixture, not physical Safari interruption. See [recovery evidence](../tests/evidence/M3-audio/recovery.md). Hardware listening, actual phone testing and full polish remain pending; goal active.

## Phone rendering and transfer optimization

Impact particles now share three instanced batches instead of up to 160 separate meshes; roster DOM updates only when its displayed data changes. Preview servers negotiate gzip for eligible assets, preserving decoded bytes and honoring gzip rejection. Audio WAV payload measured 8,860,490 → 6,346,415 bytes (28.37% saved). Strict typecheck/static build and four targeted server/input/effect tests pass. LAN server was deliberately restarted for the HTTP change: current session 14345, same port/address 4183 / 192.168.12.250. See [performance evidence](../tests/evidence/M3-phone-performance/README.md). Full goal active; real phone and audio hardware evidence remains pending.

## Phone priority and touch play (D38)

The updated user goal explicitly requires phone play now. Added analog joystick, independent thumb dash, cancellation/orientation cleanup, portrait/landscape layouts, safe-area placement and coarse-pointer low-quality default. Visual review corrected fog/framing and narrow modal clipping. Reviewed 390×844, 844×390 and 320×568 desktop browser viewports; one complete portrait round, pointer joystick and accepted dash, settings Sound ready. Full Node suite 42/42 passed; strict typecheck/static build pass. See [phone evidence](../tests/evidence/M3-phone/README.md).

`pnpm dev:phone` provides solo LAN preview, current http://192.168.12.250:4183 (session 41225; revalidate before restarting). Computer LAN HTTP GET returned 200. No firewall/public deployment changed. Real phone reachability, multitouch, Safari/Android audio and sustained hardware performance remain unverified. Next prioritize these phone checks and graphics/audio refinement. Full goal active; do not equate viewport review with C06/V04/V06 completion.

## M3 effects and repeatable visual review

Added directional dash ribbons, capped/disposed impact rings and reset cleanup. Reduced motion suppresses ribbons, limits burst particles and keeps the warning band visible. The development-only `pnpm dev:qa` page serves loopback 4181 synthetic warning/shrink/effect fixtures and twelve-bot round cycles. Normal servers reject QA routes; the QA runner is included in strict TypeScript checking. Browser effects and warning/reduced-motion fixtures were inspected inline at 639×642. Targeted lifecycle/server tests (2/2), strict typecheck and static build pass. See [effects evidence](../tests/evidence/M3-effects/README.md) for measurement and limits.

Next: sustained twelve-character 1080p reference measurement, audio listening/output compression, continuous animation/deformation polish and remaining local/co-op content. Full goal remains active. Cloudflare runtime, outside playtests and headphone/speaker approval are still unverified.

## M3 expanded character animation increment (2026-09-07)

Sprout r003 and Lumi r002 now contain all ten required clips, adding authored hit/stunned/falling/eliminated/victory/wave/dance to the original idle/run/dash. Separate animated .blend candidates preserve the saved masters and shared rig/geometry. Pose renders caught weak arm gestures; corrected them from actual bind-bone directions and re-rendered. Both GLBs pass source/export, zero-warning Khronos, stationary-root Three sampling and fresh Blender reimport checks. Sizes 607,140 / 617,664 bytes. See [Sprout evidence](../tests/evidence/M3-animation-sprout/README.md) and [Lumi evidence](../tests/evidence/M3-animation-lumi/README.md).

Game uses actual recoil/stagger/fall/victory states, short dash recovery and two lobby emote buttons. Corrected Sprout wave, Lumi dance, a complete Lumi round and subsequent accepted dash were observed in-browser. Strict typecheck/static build pass. Full Node suite: 39 tests, 39 passed, 60.443 seconds. No Cloudflare runtime test is included in that green count.

Remaining: prototype weighting/fixed faces, continuous transitions/foot contacts, directional dash/impact VFX, warning/reduced-motion capture, twelve-player/wider/performance recording, audio listening/compression and outside playtest. Library completeness is not final character approval. Next improve directional dash/impact presentation and run repeatable visual/performance QA, then address audio output/listening. Full goal active.

## M3 Sky Ring visual increment (2026-09-07)

Replaced the plain floor with an original crown/paving treatment, dimensional blue/gold stone trim, rock underside and distant garden islands/waterfalls; softened lighting and batched clouds with instancing. Continuous camera framing makes characters larger near square viewports. Warning rim now owns its material; added outer warning band and reduced-motion handling. Actual lobby/four-player gameplay/outcome were visually inspected at 639×642; console warning/error query was empty. Typecheck/build/server smoke pass. See [world evidence](../tests/evidence/M3-world/README.md).

Next: complete and inspect character animation/deformation using the existing saved Blender rig/source, improve movement/impact VFX, capture warning/reduced-motion behavior and wider/twelve-player views. Audio is playable but listening/compression remains pending. This is visual progress, not finished M3 approval; full goal remains active.

## M3 playable audio increment (2026-09-07)

Added original Sky Ring music and sound synthesis: a 64-second / 120 BPM arrangement with three synchronized stems, fifteen SFX variants, event-driven music transitions, warning/impact ducking, stereo positioning, voice budgeting and compressor. Master/music/SFX/mute controls persist. Browser decoded the bank, saved music/mute through reload, and completed a 63-second solo round. Two audio tests, strict typecheck and static build pass. See [audio evidence and preview](../tests/evidence/M3-audio/README.md).

Audio is now implemented but not finished-quality approved. Headphone/speaker listening and browser-output recording have not been performed; offline preview is not a captured gameplay mix. WAV bank is 8,860,490 bytes; compressed exports and full V05 measurements remain next. Editable score/provenance are in assets/source/audio/sky-ring. Next character/arena polish from the concept gallery and asset contract, plus real audio review/optimization. M2 Cloudflare native-runtime and outside/hardware gates remain recorded; full goal active.

## M2 Worker adapter increment (2026-09-07)

Implemented the Cloudflare Worker/GameRoom adapter using the shared authority, same-origin admissions, static assets and persistent restart cancellation. Pinned Wrangler 4.129.1 and its locked local runtime. Dry-run bundle and strict typecheck pass; three Node restart/routing contract tests pass. Actual workerd startup fails with native Windows access violation 0xc0000005 before port 4180 opens, so both attempted live Worker tests fail with connection refused. No deployment, cloud resources or system runtime changes. See [Worker evidence](../tests/evidence/M2-worker/README.md).

The normal Node multiplayer preview remains the playable route. M2 Cloudflare runtime/backpressure, process-restart and public N07 evidence are incomplete. Next continue independent M3 character/world/audio production under the user's priority; start with the concept gallery, character contract, art/audio direction and existing assets. Do not let the native emulator failure indefinitely displace the requested presentation work, and do not call M2 fully passed. Revisit the Worker tests on a functioning runtime before remote room enablement. Full goal remains active.

## M2 latency and prediction increment (2026-09-07)

Four OnlineSessions now complete simulated 100 ms RTT/20 ms jitter and 200 ms RTT/50 ms jitter matches with identical final authority state across clients. The fixture exposed packet-count overprediction; speculation is now capped at 100 ms while retaining a queued dash edge. Owner rendering blends between 20 Hz targets and snaps on elimination/large corrections. Fifteen targeted client/latency/real-transport tests, strict typecheck and static build pass. Browser dash/cooldown, one recorded hit and a 64-second result were observed. See [latency evidence](../tests/evidence/M2-latency/README.md).

Measured input response is 0–40 ms in the scripted fixture; queues peak at seven messages per link. Largest target adjustment fell from 7.523 m to 3.499 m at the high-latency profile, but trajectories changed and counters include normal motion/impacts. Do not equate this with human-approved feel. Full suite now contains 34 tests; this increment ran the 15 relevant tests, not all 34.

Next: remaining Cloudflare host adapter/local integration and process-restart contract, then M3 character/world/audio work. Public probe, human feel testing, finished animation, music/SFX and full game goal remain incomplete. Development server session 12990 was confirmed live this increment; verify before restarting.

## M2 browser room client increment (2026-09-07)

Room creation/joining now works in the browser against the real loopback server. OnlineSession adds assigned-seat input, prediction/reconciliation, remote interpolation, strict received-state validation, neutral pause/focus handling and bounded reconnect. Both browser players in one observed room saw the same winner/time. Browser review caught and fixed a terminal-socket error overlay and overlapping room/toast messages. All 30 automated tests pass; strict typecheck and static build pass. See [M2 client evidence](../tests/evidence/M2-client/README.md) for methods and limits.

Run `pnpm dev:online`, open http://127.0.0.1:4179 and choose Room play. Command session 12990 is the most recently verified running server; revalidate before restart. Normal dev/static builds retain solo play. The earlier browser usage limit reset and normal tool access resumed.

Next: N03 latency/jitter/correction fixtures and remaining Cloudflare host integration, then M3 finished character/world/audio work. Full M2 gates, human feel testing, music/SFX and polished presentation are not complete. The user's full game goal remains active. The following dated increments are historical snapshots; their statements that the room UI was unavailable are superseded here.

## M2 real WebSocket transport increment (2026-09-07)

Added the optional loopback HTTP/WebSocket adapter and server-owned admissions, using pinned ws 8.18.3/@types/ws 8.18.1. It enforces origins/seat tickets/frame limits and records interrupted rooms in a local restart journal. Four independent real socket clients completed ten accelerated-clock matches with matching snapshots/results; actual replacement/reconnect and transport recreation cancellation passed. Five targeted tests passed (four transport plus static-server smoke), and strict typecheck passed. See [M2 transport evidence](../tests/evidence/M2-transport/README.md).

`pnpm dev:online` serves the game and API at loopback 4179. It started successfully during this increment (command session 76592); verify the live handle before restart. The UI still plays local matches because the browser network adapter/room controls are the next task. This is a development adapter, not substitution for the specified Cloudflare host. No deployment or rewards.

Next: browser OnlineSession/admission UI, prediction/interpolation, reconnect/error/replay and received-message validation; then real browser/jitter fixtures and the Cloudflare adapter. Full M2, polished characters/world, music/SFX and later gates remain incomplete. The earlier browser usage-limit rejection was not bypassed.

## M2 authority core increment (2026-09-07)

Implemented strict versioned client messages and a transport-independent authoritative room using the existing simulation. It validates seat ownership/sequences/actions, waits for compatible ready clients, bounds input and outbound queues, neutralizes disconnected controls, restores seats on reconnect, invalidates old sockets, forfeits after ten seconds and produces an idempotent cancellation receipt. No wallet or reward grant exists.

Checks actually run: 19 tests passed (10 simulation, 8 authority, 1 local server), plus strict TypeScript exit 0. Four serialized test peers saw matching outcomes across ten seeded matches and matched the independently stepped local simulation. Replay digest is unchanged. Full scope/limits: [M2 authority evidence](../tests/evidence/M2-authority/README.md).

M2 remains incomplete: real WebSocket/Worker and admission adapters, persisted restart cancellation, browser prediction/reconnect, latency/jitter and deployed probe are pending. The last browser settings action was denied by automatic approval review for account usage limits; no alternate-browser workaround was attempted. Local code/tests made meaningful progress despite that limitation. Next work is actual transport/client networking, then the requested visual/audio polish. The active goal remains incomplete.

## Active game goal and playable increment

The user now authorizes sustained implementation toward a complete playable Knockbound game, with strong character/world art, music/SFX and gameplay. The old bootstrap-only and stop-after-M1 assignments are superseded (D24). The active goal is NOT complete.

M1 local foundation is playable: choose Sprout or Lumi, five-second countdown, WASD/arrows, direction-aware Space dash, normal-rule CPU opponents, movement momentum, contacts, escalating knockback, ring-outs, shrinking sudden death, winner/draw, pause/focus neutralization and replay. Shared simulation has no rendering/browser/service imports. Existing character sources and staged asset work were preserved. The Sky Ring and UI are development art, not M3 approval.

Checks actually run: 10 Node tests passed (P01–P06 coverage), including 10,000 recorded ticks/JSON restore, 30/60/144 Hz parity, invalid/stale input, single and repeated hits, coincident/head-on/thin-wall collision cases, same-tick draw/reset and 20 seeded full rounds. TypeScript strict check passed. Static build succeeded and was separately booted and played in the browser. Six browser rounds observed: five with keyboard/pause interaction and one idle baseline, with both win/loss screens and replay. Evidence and limitations: [M1 local evidence](../tests/evidence/M1-local/README.md).

Local commands: `pnpm install --frozen-lockfile --ignore-scripts`, `pnpm dev`, `pnpm test`, `pnpm typecheck`, `pnpm build`, `pnpm preview`. Exact bundled Windows paths and ports are in [README](../README.md). During this task the development server uses 4177 and compiled preview uses 4178. No cloud service, deployment or spending occurred.

Tuning: 90-second local rounds, final 30-second shrink and 2-second warning; original public target remains 180 seconds. Browser review prompted narrower lobby framing, closer gameplay camera, queued dash direction on short key taps and rendering-clock fall animation after terminal ticks. Retained original simulation movement/impulse numbers. No outside user approval or sustained human-controller feel test is claimed.

Remaining: M2 online adapter/room/protocol tests; production character animation/deformation, intentional world polish, music and SFX in M3; external testers and actual headphone/speaker/reference-device measurements. Touch/gamepads, local multiplayer, co-op, accounts/economy and public hosting remain unimplemented. Do not claim this prototype meets mature-game or commercial-quality gates.

Next increment: M2 local authoritative room/protocol and client networking using the same simulation, with bounded inputs/reconnect/cancellation and integration fixtures. Then continue the active goal through playable slice polish; deployment/hardware/outside-testing gates remain explicitly pending until actually available. Do not stop just because the old handoff said M1 only.

## Historical asset/bootstrap status (2026-09-05)

The following is retained history; the statements that gameplay was unimplemented and required a new assignment applied before the current game goal.

Current milestone: M0 bootstrap plus an explicitly authorized one-character Blender pipeline proof. Gameplay M1 onward remains unimplemented. No Cloudflare deployment or payment integration. Two pinned dependencies exist only for isolated asset validation/preview.

Completed asset increment: one editable Sprout-derived r002 prototype, GLB, provisional shared rig/socket contract, three proof clips (idle/run/dash), refined face/hoodie/shoe/fins, modular BODY/OUTFIT/SHOES authoring collections, assembly script, source/export checks, negative validation cases, fresh Blender reimport, Khronos validation and isolated Three.js browser preview. See [character contract](CHARACTER_ASSET_CONTRACT.md), [repeatable commands/handoff](../tools/asset-pipeline/README.md), and [r002 evidence](../tests/evidence/asset-pipeline-r002/README.md).

Follow-up asset increment: one Lumi-inspired compatible variant built from the same saved r002 rig. It uses tall ears, a cyan body and orange scarf while preserving all 34 bones, sockets, scale and idle/run/dash names. The detailed pass adds a cream muzzle, forehead tuft, scarf knot/badge, darker gloves and orange/white shoe blocking. The variant is 11,536 triangles and 493,528 bytes; Khronos and Three.js validation pass. See [Lumi evidence](../tests/evidence/asset-pipeline-lumi-r001/README.md).

Measured r002 export: 11,415 triangles, two materials, 20 deform bones plus root/13 sockets, 483,004 bytes (~472 KiB). Khronos: zero errors and zero warnings. Three.js verifies skin, clip/bone names, bounds, fixed root and metre/axis fixture. Blender source viewport and timeline playback inspected with Computer Use after opening a separate working window; original unsaved scene preserved. Browser run/dash/idle and gameplay-distance/light/dark views inspected. No new raster concept generation or external production asset was used.

Limitations: provisional species/rig, prototype weighting and topology, unfinished deformation/foot contacts/facial expression, seven missing production clips, no fitted accessories, crowd/performance test or outside approval. V01 and production gates remain incomplete. The client is still documentation-only; the preview is tooling, not game implementation. Final topology, facial rig, complete animation library, texture atlas, accessory catalog and mobile/crowd budgets are intentionally deferred to the next reset. Next asset agent should copy the existing rig/source and follow the contract, not rediscover or rebuild it. Any additional characters need a new assignment.

Completed: source recovery of all 89 text sections; later design amendments; canonical game/architecture/content/art/audio/Blender/implementation specs; constitution; milestone and acceptance plan; repository ownership scaffold; all ten historical concept PNGs exposed by the branch gallery with provenance/hashes; bootstrap validation utility.

Historical source excerpts are truncated and labeled. All 89 text topics were subsequently read through the browser and mapped. The branch follow-up recovered the remaining eight images by opening the media viewer. See [the gallery](CONCEPT_ART_GALLERY.md) and [branch details](BRANCH_DESIGN_ADDENDUM.md) for character alternatives, boss attacks/objectives, host settings, local/social play, mobile concepts and seasonal recipes. Image-retrieval limitation is resolved for the observed ten-image gallery.

Next authorized implementation assignment should be M1 as written in HANDOFF.md. Pick and pin compatible tooling, create pure simulation and local bot prototype, run P01–P07, then stop for a milestone handoff.

Historical bootstrap validation passed (19 required artifacts, all 89 source sections, 105 local links, valid JSON planning metadata); that recheck is recorded in tests/evidence/M0-bootstrap.md. Gameplay gates remain NOT RUN. Limited asset checks now have separate pipeline evidence above; no assets are production-approved.

Branch recovery validation is recorded separately in [M0 branch recovery evidence](../tests/evidence/M0-branch-recovery.md). No game implementation was added.


















2026-09-10 D86 final verification: FULL105/105 PASS110.635s on0.12.7, including10 real four-client WebSocket rounds and OnlineSession round. M3-duel-knockback/full-tests.txt records output. Temporary4193/tab closed; root build complete. Candidate awaits player feedback; no deployment.
