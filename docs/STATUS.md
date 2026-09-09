# Project status

Updated 2026-09-08.

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






