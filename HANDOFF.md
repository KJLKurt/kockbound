# Start here: Knockbound implementation handoff

Read AGENTS.md, docs/STATUS.md, docs/DECISIONS.md, then the canonical specification documents linked from README.md. Consult docs/SOURCE_COVERAGE.md when tracing prior design. All 89 foundation sections were read; later local-play, modes, content-platform and production-quality discussions are incorporated.

Before visual production or M4 mode/co-op work, review [the full concept gallery](docs/CONCEPT_ART_GALLERY.md) and [branch design addendum](docs/BRANCH_DESIGN_ADDENDUM.md). Both Sprout and Lumi are recovered character explorations. Boss attack names, objective illustrations and phone UI details have explicit interpretations; image labels do not silently override written rules or milestone scope.

## Active implementation goal (2026-09-06)

Latest: [four characters/palettes](tests/evidence/M3-roster/README.md), version 0.9.0. Pebble/Wisp separate Blender sources, ten inherited clips, source/Khronos/fresh-reimport checks passed. Local four-character/four-palette picker persists; corrected phone layout, Wisp Sunset 68-second terminal round observed. Full 69 tests/typecheck/build pass. NEXT: online host/join must carry selected appearance/skin rather than assigned seat-only cosmetics. Then broader real-phone/audio/performance/pose/feel review. Preserve staged prior art; new originals in character.pebble and character.wisp. Full goal active.


Latest: [Spring pod](tests/evidence/M4-pods/README.md), version 0.8.0. Extra interactive danger implemented as safe pickup/plantable proximity trap with owner risk, finite timer, arming delay, area push/stun and magenta warning. Ten items plus three hazards. Full 67 tests/final typecheck/build pass. Pod phone fixture reviewed; human control/audio not claimed. Next add genuine character identities plus skins/colors using existing shared rig/source pipeline, then broader phone/gameplay/presentation gates. Full goal active.


Latest: [optional hazards](tests/evidence/M4-hazards/README.md), version 0.7.0. Master/per-type saved tiles/skyrock/gust selections reach solo and room authority. Warned tile removal, red rock landing/flatten/stun/push, directional warned gusts; bot avoidance, protocol validation and prediction isolation. Full 64 tests/typecheck/build pass. Corrected dark-arrow phone fixture and saved Wind off checked. Next extra interactive danger, more characters/colors and remaining phone/audio/feel/performance gates. Full goal active.


Latest: [mystery crate](tests/evidence/M4-crates/README.md), version 0.6.0. Nine items including dash-open crate; draws only other enabled items, normal pickup, twenty-second expiry, no crate-only spawning. Actual dash substeps open it; bots dash ordinary inputs. Full 61 tests/typecheck/build pass. Browser controlled dash fixture opens crate and holds blaster. Next optional hazards, extra interactive danger, more characters/colors and broader phone/audio/feel QA. Full goal active.


Latest: [falling tiles/remover](tests/evidence/M4-tiles/README.md), protocol/sim/content 0.5.0. Shared radial sectors support real holes, one-second warning/staggered collapse, dash substep falls, intact-ground rescue and bot avoidance. Eight items include remover. Playing arena uses individual extruded textured blocks; original island lobby preserved. Final 59 tests/typecheck/build pass; phone-size corrected fall and reduced-motion fixtures inspected. Next optional hazards, crate/additional danger, character/color choices and final QA. Full goal active.


Latest: [ranged items](tests/evidence/M4-ranged/README.md), version 0.4.0. Seven registered items; blaster five shots, wind one distance-falloff piercing shot, rolling rock one piercing flatten/stun roll. Swept collision, authoritative charges and saved toggles work; 55 tests pass including seven-item-enabled OnlineSession round. Next crate/remover/additional danger plus shared tile support/hazards/falling-edge shrink, then character choices/colors and final QA. Full goal active.


Latest: [three passive items](tests/evidence/M4-passive-items/README.md), version **0.3.0**. Bomb/shovel/big/helicopter all registered with saved independent toggles. Shovel forward reach, big mass/collider/visual scale and one-use helicopter rescue are authoritative; passive transfers preserve expiry. Full 51 tests, strict typecheck and build passed. Browser settings persistence and passive fixture inspected. Multiplayer restarted at 4179 session 21057; LAN solo 4183 session 14345. Next remaining named blasters/rolling rock/crate/remover, shared tile hazards and falling-edge shrink, then character choices/colors. Full goal active; old entries below are historical.

Latest: [Cloud bomb item](tests/evidence/M4-bomb/README.md), [cross-boundary contract](docs/ITEM_CONTRACT.md). Protocol/sim/content bumped to 0.2.0; registered bomb with optional solo/host selection, authoritative pickup/use/drop, fuse/push/stun, bot use, visuals/SFX. 48 tests passed including real bomb-enabled OnlineSession. Phone-size danger fixture corrected; actual human-control pickup/drop/toss walkthrough and balance remain next. Continue the named catalog, shared tile/hazard system and characters. Old room servers/clients must reload for 0.2.0; do not overwrite staged art. Full goal active.

Latest: [three camera views](tests/evidence/M3-camera/README.md). Full/third/first saved in Settings, camera-relative inputs and drag look, first-person self hiding and overview after elimination. Portrait views, switch mid-round, result and reload persistence observed; camera/touch tests/typecheck pass. D42 makes view personal to host/solo/guest, no room-wide force. Next implement shared optional item/hazard/tile configuration and pickup/use/drop, retaining every named feature in PLAYABLE_EXPANSION.md. Full goal active.

Graphics recovery completed as a local-browser increment: actual extension loss → pause/message → restore → manual resume/visible arena. [Evidence](tests/evidence/M3-phone/graphics-recovery.md). New listener/main integration and development-only context QA source; QA server 4184 session 38677. Six targeted tests plus server smoke passed; final typecheck/static build passed. Next the explicitly requested camera options and expanded shared item/tile/hazard rules, not further unrelated resilience polish. Full expanded goal active.

2026-09-08 expanded goal: [active camera/item/hazard/character requirements](docs/PLAYABLE_EXPANSION.md) are now authorized and required. Read all 15 entries. Cameras, nine named pickup/crate/remover features, independent toggles, hazards, falling edge tiles and additional characters/colors must be implemented; do not declare completion around the earlier small Arena slice. Finish pending graphics-recovery browser check, then camera and shared gameplay contracts.

Latest audio fix: failed download/decode no longer permanently poisons Sound's cached promise. Retry sound in Settings or later interaction retries with bounded backoff; resuming an already loaded context preserves three music layers. Three audio tests/typecheck/build pass, browser Sound ready verified. [Recovery evidence](tests/evidence/M3-audio/recovery.md). Next physical phone/audio checks and continued character/gameplay polish; full goal active.

Latest phone optimization: three instanced particle batches, cached roster DOM and negotiated gzip preview delivery. Audio transfer shrinks 28.37% with identical decoded PCM. Four targeted tests/typecheck/build pass. LAN server restarted intentionally to apply gzip: session **14345**, same http://192.168.12.250:4183. [Performance evidence](tests/evidence/M3-phone-performance/README.md) records the sustained scene; actual phone/Safari/audio gates remain pending. Full goal active.

Updated user goal requires **phone play**, with explicit Browser/Computer authorization. Latest [phone controls/evidence](tests/evidence/M3-phone/README.md): touch joystick + dash, portrait/landscape layouts, cancellation/orientation cleanup, low graphics coarse-pointer default. Three desktop viewport sizes reviewed; 42 Node tests/typecheck/build passed. Current solo LAN server 4183, session 41225, http://192.168.12.250:4183 returned 200 from computer. Next real-phone multitouch/audio/performance and continued polish. Phone platform C06/V04/V06 is now current priority, not deferred to later modes. Full goal active. Before ending a browser turn reset temporary viewport and retain needed tabs.

Latest increment: [directional effects and visual QA](tests/evidence/M3-effects/README.md). Dash ribbons, capped impact pulses and reset cleanup; reduced-motion warning/effects reviewed. `pnpm dev:qa` exposes only development fixtures on 4181, excluded from static builds and normal routes. Two targeted tests/typecheck/build passed. Next sustained twelve-character 1080p measurement and audio listening/compression; retain outstanding Cloudflare and outside-testing gates. Full goal active.

Current increment: [Sprout ten-clip candidate](tests/evidence/M3-animation-sprout/README.md) and [Lumi counterpart](tests/evidence/M3-animation-lumi/README.md). New separate saved animation sources, r003/r002 GLBs, pose-render corrections and actual game/lobby states. Both exporters/Khronos/Three/fresh reimport pass; typecheck/build and all 39 Node tests pass. Next directional dash/impact VFX and repeatable warning/crowd/performance QA; then audio listening/compression and remaining deformation/facial polish. Full goal active; Cloudflare native runtime remains unverified.

Previous increment: [Sky Ring visual evidence](tests/evidence/M3-world/README.md). Crown/paved floor, blue/gold trim, background islands/waterfalls, instanced clouds and continuous camera framing are integrated. Narrow-view lobby/gameplay inspected, no browser errors, typecheck/build/server smoke pass. Next character animation library via saved Blender sources/contract, then VFX/telegraph and wider/twelve-player review. Audio listening/compression and Cloudflare runtime gates remain pending; full goal active.

Previous increment: [playable audio and preview](tests/evidence/M3-audio/README.md). Original three-stem score and fifteen effect variants are integrated with game events, ducking and saved master/music/SFX/mute controls. Two audio tests/typecheck/build and browser load/persistence/full solo result passed. Headphone/speaker listening, actual Web Audio recording, final mix and compressed exports remain pending. Next character/arena polish from gallery/asset contract, plus sound review. Full goal active.

Previous increment: [Worker adapter evidence](tests/evidence/M2-worker/README.md). Worker source, restart persistence contracts and dry-run bundle exist; three contract tests/typecheck pass. Actual Windows workerd crashes before port 4180 binds, so live Worker tests remain failed/unverified. No deployment occurred. Next start independent M3 character/world/music/SFX work from the gallery and art/audio specs, retaining incomplete M2 hosting/backpressure gates. Node multiplayer preview remains usable. Full user goal remains active.

Previous increment: [M2 latency evidence](tests/evidence/M2-latency/README.md). Both specified jitter profiles now converge across four clients. Fixed queued-packet overprediction with a 100 ms horizon and added owner visual smoothing. Fifteen targeted tests, typecheck/build and browser dash/result checks pass. Next remaining Cloudflare local integration, then M3 character/world/audio. Human high-latency feel and deployed probes remain pending; full goal active.

Previous increment, 2026-09-07: browser room creation/joining, OnlineSession, prediction/interpolation and reconnect now work. Read [M2 client evidence](tests/evidence/M2-client/README.md) and current STATUS. All 30 tests, strict typecheck and static build pass. Two browser participants saw matching results. Terminal-room closure no longer turns a confirmed result into an error. `pnpm dev:online` serves loopback 4179; latest verified session 12990. Earlier browser usage-limit rejection has reset and normal browser tool access is restored. Next: N03 jitter/correction evidence and remaining Cloudflare host contract, then M3 character/world/music/SFX polish. Full goal remains active. Below are historical increment notes, superseded where they say room UI is unavailable.
Historical transport increment, 2026-09-07: real loopback WebSocket transport and local restart journal now exist; read [M2 transport evidence](tests/evidence/M2-transport/README.md). `pnpm dev:online` serves port 4179 (started as command session 76592; revalidate before restarting). Five targeted transport/server tests and strict typecheck pass. The browser UI is still local-only. Next implement OnlineSession and room controls against the real API, then prediction/jitter/browser evidence and the Cloudflare adapter. Do not mistake the Node development transport for the specified production host or completed multiplayer UI.

Latest increment, 2026-09-07: `server/game-room/authority.ts` and `shared/protocol/messages.ts` implement the M2 room core/codec. Nineteen tests and strict typecheck pass. Read [M2 authority evidence](tests/evidence/M2-authority/README.md) before continuing. Real transport, admission/restart storage and the browser networking adapter remain next; in-process peer tests are not full N01–N07 completion. The prior browser settings action was blocked by automatic approval review's usage limit; do not bypass it through alternate UI tooling.

The user explicitly asks to complete a playable game with strong character graphics, level graphics, background music, SFX and gameplay, and authorizes use of Browser/Computer tools. This supersedes the previous bootstrap/M1-only scope. Work in milestone order; preserve quality gates and separate deployment/commercial authority. Do not declare the active goal complete after the first playable prototype.

M1 is now implemented and locally playable. Start with [M1 evidence](tests/evidence/M1-local/README.md) and current STATUS. Ten simulation tests, strict typecheck and static build pass. Six browser rounds were observed, including five with interaction and one idle baseline. The existing Sprout/Lumi models are development art. Audio, finished animation and M2 online play are still pending.

Next: implement M2 room/protocol/local integration checks and connect a browser online adapter to the same simulation. Preserve M1 local play. No cloud deployment/spend is required for independent local implementation; do not imply emulator success proves N07. After recording M2 progress, continue graphics/audio polish under the active goal rather than asking again for the already-authorized implementation.

Run instructions are in README. Pinned Node 24.19.0, pnpm 11.19.0, TypeScript 5.9.3 and Three.js 0.180.0 are introduced and locked. `pnpm dev` serves loopback 4173; this task currently uses `node tools/dev-server.mjs 4177`. `pnpm build` and `pnpm preview` serve compiled output at 4178.

## Historical asset handoff

Asset pipeline follow-up (2026-09-05): preproduction Sprout and Lumi characters exist independently of gameplay milestones. For any asset work, start with [the character contract](docs/CHARACTER_ASSET_CONTRACT.md), [repeatable commands and next-character instructions](tools/asset-pipeline/README.md), and [actual evidence/limitations](tests/evidence/asset-pipeline/README.md). Do not rebuild over manual source edits or infer a large catalog from the active playable-game goal.

The original M1 assignment was a local prototype with one keyboard player and CPU opponents, simple arena, movement, dash, collisions, knockback, ring-out, winner and restart. It is retained here as historical scope; its stop-after-M1 instruction is superseded by the active user goal above.

The M1 tool inspection and pinning are complete. No cloud credentials are needed for local practice.

## Delivery expectations

Provide runnable local instructions, the completed acceptance IDs and evidence, remaining failures, and the next milestone. The interaction that must work is: move, dash, knock another player away, fall, see the outcome, play again.

Exact physics values, character topology, music and budgets are starting defaults, not claims of prior approval or empirical quality. Tune routine details autonomously and preserve the product's identity.

Do not treat the proposed mature launch catalog as the first assignment. Local Party is a session configuration, not a separate simulation. King of the Hill and Boss Battle prove extensibility after the first polished slice. Their contracts must influence M1/M2 boundaries without requiring their early implementation.







