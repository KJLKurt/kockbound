# Decisions and unresolved choices

2026-09-09 DEFAULT D62: move projected player labels with CSS transforms rather than per-frame left/top layout changes, preserving screen anchors and visibility. Evidence M3-label-transforms; no FPS improvement inferred from a short diagnostic.

2026-09-09 DEFAULT D61: instance opaque item parts by exact geometry/material identity, retaining source transforms and separate warning halos. Dynamic capacity supports crowded content; tests preserve blinking, rotor motion, colors and placement. M3-item-batches records visual and CPU/GPU diagnostic limits.

2026-09-09 DEFAULT D60: batch each ranged effect kind into persistent instanced meshes, up to3 submissions within the shared64-shot cap. Preserve exact projectile transforms and reduced-motion behavior; trade individual frustum culling for bounded batch draws. See M3-projectile-batches for checks and measurement limits.

2026-09-09 DEFAULT D59: render the21 identical gust arrows in one instanced draw, retaining original positions, direction, warning opacity/color and active height. Expanded synthetic rendering load now includes held/ground items, projectiles, hazard/tile warnings and12 characters. Measure separately from real-device gameplay; see M3-expanded-performance.

2026-09-09 DEFAULT D58: camera first in Settings; individual content choices in native expandable panels with concise use/risk help. Master switches remain visible and existing selection/persistence semantics are preserved. Phone settings evidence M3-settings-help.

2026-09-09 DEFAULT D57: layer reversible chest/right-arm carrying aim after the locomotion mixer; restore before the next mixer update. Limit torso yaw to60 degrees and arm bearing to86 degrees from movement heading, fade for reaction clips. Rendering only; item aim and collision remain authoritative and unchanged. Evidence M3-item-pose. Precise grip contact remains polish.

2026-09-09 DEFAULT D55: item-specific four-second pickup hints, passive benefits described directly, charge/cooldown/stun-aware action feedback. Disable only unavailable actions and preserve Drop during ordinary firing cooldown. UI-only; no protocol or simulation change.

2026-09-09 DEFAULT D54: replicate optional validated Player.itemAim for prop presentation, version 0.12.0; preserve physics and action targeting. Attach props after animation to shared hand/head sockets, orient directed props from aim, turn idle visuals toward aim and use a compact first-person prop placement. Ground transitions restore scale/rotation and keep danger markers on the floor. Dedicated moving aim/grip animation remains polish.

2026-09-09 DEFAULT D53: add optional bounded horizontal aim to ordinary inputs (0.11.0). Close-camera items follow camera-forward independently of movement; full arena uses accepted movement then facing. All directed items share the same helper. Keep dash/physics unchanged and preserve passive items. ITEM_AIM_CONTRACT.md records validation, pod expiry, coalescing and presentation limits.

2026-09-09 DEFAULT D52: batch tile cap, warning-cap and side geometry into three material draws with independent mutable vertex ranges. Preserve source geometry/UVs, warning material, fall timing, reduced-motion removal and shared support. Invisible ranges become degenerate triangles; unchanged/hidden ranges avoid redundant writes. Rendering-only optimization, no protocol or physics version change.

2026-09-09 DEFAULT D51: use authenticated ready message for online appearance/skin choice, version 0.10.0. Validate registered values, bind to sender’s seat, update both world/config roster only while waiting, broadcast and lock at countdown. Send ready once per connection to avoid broadcast feedback; renderer detects cosmetic changes. No new HTTP cosmetic endpoint or competitive stat fields.


2026-09-08 DEFAULT D50: add original Pebble and Wisp geometry identities via shared Sprout rig/modules and four cosmetic palettes. Version 0.9.0 introduces validated skin key and expanded appearance registry; no competitive stat changes. Local selection persists; online seat diversity works but chosen cosmetic transmission remains next. Concepts and runtime/source contract in ROSTER_CONCEPTS.md and ROSTER_CONTRACT.md.


2026-09-08 DEFAULT D49: extra interactive danger is Spring pod, a safe pickup that can be planted into a proximity trap and can catch its owner. Version 0.8.0 adds armedAt. Eight-second unclaimed timer, twenty-second held timer, 0.75-second arming and ten-second dormant lifetime; radius/push/stun in POD_CONTRACT.md. Magenta danger area separates it from bombs. No hidden immunity, stat cosmetic or reward system.


2026-09-08 DEFAULT D48: version 0.7.0 adds independent optional hazards and master switch, default enabled for preview. Schedule first at 10 seconds then every 7; rock warns 1.5 seconds, radius 1.6/push 4/stun 0.8; gust warns 1 second then acceleration 4 for 3 seconds; random tile warns 1 second. Hazard state is authoritative, no predicted impacts. See HAZARD_CONTRACT.md. Original visual/audio assets, automated/browser evidence, no inferred hardware or human balance approval.


2026-09-08 DEFAULT D47: version 0.6.0 registers mystery crates as ground-only interactables opened by actual dash contact within one metre. Reveal one seeded other enabled item at the crate position; preserve normal single-slot pickup. Twenty-second expiry; crate-only selection spawns nothing and Settings explains another enabled item is required. No hidden disabled-item reward or currency. Original code art/cue, 61 automated checks and controlled browser interaction evidence; human feel remains unapproved.


2026-09-08 DEFAULT D46: version 0.5.0 introduces shared sector-tile support, four 24-block rows and protected minimum-radius core. Outer blocks warn at least one second, then fall in staggered groups; substep support checks prevent dashing across gaps. Platform remover consumes once after marking a forward tile. Helicopter rescue chooses intact ground. See TILE_CONTRACT.md for reversible targeting, timing and geometry defaults. Seeded results may change intentionally; hazards/crate/extra danger remain required.


2026-09-08 DEFAULT D45: add Bubble blaster (five weak shots), one-shot Wind blaster and Rolling rock through a shared authoritative projectile contract, version 0.4.0. Reversible tuning and transfer/collision semantics in ITEM_CONTRACT.md. Wind/rock pierce each opponent once; obstacles stop all shots; rock flattens/stuns one second. Original code geometry/cues, no external assets. Automated and synthetic visual evidence does not imply physical-phone or human aim/balance approval.


2026-09-08 DEFAULT D44: register Push shovel, Big mode and Helicopter hat alongside bombs, with passive single-slot effects and independent saved selection. Version 0.3.0 covers activated expiry transfer, effective mass/radius, shovel reach and one-use rescue event. Reversible durations are 12/10/30 seconds; big mass 1.8/radius 0.65; rescue consumes the hat and cannot defeat server forfeit. Full rules in ITEM_CONTRACT.md. All 51 tests/typecheck/build passed; visual fixtures and saved settings reviewed, without claiming physical phone or human balance approval.

2026-09-08 DEFAULT D43: first registered optional item is Cloud bomb, with shared one-slot proximity pickup, E/touch use, Q/touch drop, timed live fuse, one-second toss, ordinary-input bot interactions and authoritative blast/stun. Saved master/per-item settings choose new solo/host config. See ITEM_CONTRACT.md for reversible numbers and 0.2.0 schema/version boundary. Other named items remain required pending work; no economy/cosmetic stat change is implied.

2026-09-08 DEFAULT D42: camera is a saved per-player presentation preference available in Settings to solo players, hosts and guests, rather than a room-wide enforced view. Choices: full arena, third-person follow and first person. Close views use camera-relative movement and drag-to-look with bounded pitch; first person hides the owner's model, elimination/results return to arena overview. World authority remains independent. Real-phone combined movement/look/dash and online seat-specific camera verification remain pending.

2026-09-08 USER D41: expanded goal explicitly authorizes and requires camera choices, optional per-item/per-hazard host and solo settings, one-slot pickup/use/drop with expiry, the named interactive items/hazards, tile-fall shrink and more characters/colors. [PLAYABLE_EXPANSION](PLAYABLE_EXPANSION.md) preserves the complete list. These capabilities move into current playable work rather than remaining deferred catalog ideas. Shared simulation/content contracts, cosmetics fairness and no implicit deployment/spend remain.

2026-09-07 DEFAULT D40: transient audio failures remain nonfatal to play and can be retried without page reload. Automatic interaction-triggered retry has a three-second failure backoff; explicit Settings Retry sound bypasses it. Resume loaded audio without duplicate music sources. Actual phone interruption/listening remains a separate gate.

2026-09-07 DEFAULT D39: batch transient impact particles into three shared instanced draws, rebuild roster DOM only when roster/outcome information changes, and gzip compress eligible preview responses when the browser accepts it. This preserves simulation and original PCM audio, needs no codec/dependency, and applies to the explicit LAN preview as well as local/static preview. It does not configure compression for a future public host.

2026-09-07 USER D38: updated goal explicitly requires the game to work on a phone and prioritizes that now. Implement touch input and portrait/landscape layouts in the current slice; preserve desktop controls and pure simulation. DEFAULT: fixed left analog stick, right dash, 14% radial dead zone, release/cancel/resize neutralization, low graphics default for coarse pointers, safe-area offsets, and an explicit solo-only LAN preview flag. Real phone multitouch/audio/performance remains required evidence; desktop viewport tests are partial.

2026-09-07 DEFAULT D37: render short directional dash ribbons and bounded ground impact pulses without simulation changes. Reduced motion removes ribbons and uses short static pulses. An explicit development-only `--qa` page provides synthetic warning/effect fixtures and normal-rule twelve-player round-cycle measurements; production/static output excludes it. A small-viewport round-cycle sample does not satisfy the sustained twelve-participant 1080p V04 gate.

Statuses: ESTABLISHED = supplied foundation direction; USER = explicit later user requirement; DEFAULT = new reversible implementation choice; CANDIDATE = historical suggestion; OPEN = not yet selected. Routine defaults may be tuned with evidence; preserve the decision history.

| ID | Status | Decision / consequence |
|---|---|---|
| D01 | USER | Name Knockbound; internal slug knockbound; Push Arena remains history |
| D02 | ESTABLISHED | Browser desktop-first with mobile considered; TypeScript/Three.js and planar simulation |
| D03 | ESTABLISHED | Cloudflare Worker + authoritative match Durable Object + WebSockets; D1/R2 later persistence/assets |
| D04 | USER | Strong local play against/with bots and a shared extensible engine |
| D05 | USER | First-class independently authored maps, bosses, items, accessories, skins and timed events with earned wearable rewards |
| D06 | ESTABLISHED | Fair competition; cosmetics/levels never buy or grant permanent combat advantages |
| D07 | ESTABLISHED | Physics → online → polished slice before progression and commerce |
| D08 | DEFAULT | Add M4 local/KOTH/boss proof before progression; preserves later expanded design |
| D09 | ESTABLISHED | One common character rig and GLB export from editable sources |
| D10 | DEFAULT | Small pure simulation module with mode handlers and local/online adapters; no general plugin scripting framework |
| D11 | DEFAULT | 20 Hz, numerical physics values and movement/contact order in IMPLEMENTATION_SPEC are initial tuning values |
| D12 | DEFAULT | Draw on same-tick final elimination or unresolved hard timeout |
| D13 | DEFAULT | Offline practice never grants trusted online currency; private rewards disabled until policy exists |
| D14 | DEFAULT | Room interruption cancels M2 match; no implicit recovery or reward replay |
| D15 | DEFAULT | Immutable content release per match; server-UTC event eligibility pinned on start |
| D16 | DEFAULT | Event expiry removes new access/acquisition, not previously earned entitlement |
| D17 | DEFAULT | JSON messages initially; pin protocol/release; optimize binary only from measured need |
| D18 | CANDIDATE | Sprout and Lumi concepts, crown motif, Cloud King/Sky Titan treatments and future catalog names are exploratory; compare both character sheets before choosing a production base |
| D19 | DEFAULT | Local Party is a session configuration; single product hosts multiple mode families |
| D20 | ESTABLISHED | Guest-first, no unrestricted early text/voice chat, ledger-backed earned economy before money |

## Original section 89: all twenty questions disposition

| # | Topic | Disposition / gate |
|---|---|---|
| 1 | Exact character identity | OPEN for M3 refinement; compare recovered Sprout and Lumi sheets at gameplay scale; select one shared-rig base before cosmetic volume |
| 2 | Game/world name | USER: Knockbound; no separate world name required |
| 3 | Proportions/art | Established stylized expressive; new 3.5-head default is tunable at concept gate |
| 4 | Camera | DEFAULT 45° downward within recovered 35–55° range; tune M3 |
| 5 | Movement physics | DEFAULT values and algorithm in IMPLEMENTATION_SPEC; tune M1 |
| 6 | Dash mechanics | DEFAULT 0.15 s / 1.2 s cooldown, one hit per target/dash; tune M1 |
| 7 | Knockback formula | DEFAULT impulse × vulnerability, clamp and decay; tune M1 |
| 8 | Ability system | Established one ability; DEFAULT Shockwave first optional implementation |
| 9 | First map | Established Sky Ring; M1 static support, M3 one mutation, other features later |
| 10 | Elimination/sudden death | DEFAULT support-center ring-out, timed shrink and draw rules |
| 11 | Currency balance | OPEN until M5/M7 telemetry; old numbers are examples |
| 12 | Daily challenges | Established approximately three shared daily goals, purchase-free; server UTC default |
| 13 | First cosmetics | CANDIDATE counts/categories retained; exact roster decided M6 after rig proof |
| 14 | UI wireframes | Canonical state flow and art direction; actual visual wireframes M3 |
| 15 | Network protocol | Canonical contract now; executable versioned schemas M2 |
| 16 | Database schema | Logical records and invariants now; SQL and migration validation M5 |
| 17 | Matchmaking | Latency → queue time → broad skill; bot fill established; exact thresholds OPEN M2/M9 |
| 18 | Bot behavior | Normal-rule local bots mandatory; DEFAULT safety/target/dash policy M1, objective policies M4 |
| 19 | Mobile controls | Touch joystick/actions; DEFAULT landscape first, real phone gate M4 |
| 20 | Asset specs | Pipeline conventions/budgets documented; pin exporter and rig tables M3 |

## Additional preproduction choices

Reference laptop/phone, browser support floor, measured draw/asset budgets, exact logo/species/rig, music sources, Cloudflare regions/load/cost envelope and deployment environment remain open until their milestone. Choose routine reversible details and record evidence. Payment provider, paid asset budget and commercial commitments require a separate explicit scope; do not guess.

Hybrid local-online seats, full service-worker offline reload, a social 3D hub, custom editors, advanced host settings and user-generated content are not first-slice commitments. Local play must run without cloud services once the app/assets are loaded; installable offline caching is a separate future decision.

## Change log

2026-09-07 DEFAULT D36: retain Sprout as the default hero and Lumi as the compatible alternate while expanding their shared rig to all ten named clips. Use separate sprout-animated.blend/lumi-animated.blend candidates and r003/r002 exports; preserve original masters and physics. Seven authored clips, raised-arm corrections from pose review, one-shot action behavior and lobby emotes are implemented. Rig/geometry unchanged; fixed facial expressions and prototype weighting remain explicit quality limits. Full 39-test suite and asset validators pass; this does not approve final M3 character quality.

2026-09-07 DEFAULT D35: Sky Ring visual pass retains the continuous simulation support disk while adopting the recovered crown inlay, paved stone, blue/gold trim and floating garden architecture. Original code/canvas assets only; no reference-image mechanics are silently enabled. Isolate warning material, provide static reduced-motion band and use continuous aspect-dependent camera distance. Narrow actual-game review improved character scale; full production/crowd/telegraph gates remain pending.

2026-09-07 DEFAULT D34: first original Sky Ring audio pass uses 120 BPM/32 bars, three aligned 64-second stems and fifteen synthesized effect variants. Editable repository score has no external samples. Web Audio unlocks on input, retains volume/mute preferences, ducks music for important cues and caps logical SFX voices at twenty with brief release tails. Current mono 22050 Hz WAV bank is 8.86 MB; compressed exports and actual headphone/speaker/mix approval remain pending. This is playable audio, not V06 completion.

2026-09-07 DEFAULT D33: add a Cloudflare Worker/GameRoom adapter and pin Wrangler 4.129.1 for local verification. Room APIs default disabled outside the explicit local command; no deployment or commerce authority is inferred. Persistent unfinished records cancel on restart, tickets stay in memory, and existing terminal receipts are retained. Dry-run/contracts pass; native Windows workerd crashes, leaving runtime/backpressure/deployment gates open. Proceed with independent M3 presentation/audio work while retaining these incomplete M2 checks, consistent with D24 and the user's priority. The Node adapter remains a development preview.

2026-09-07 DEFAULT D32: cap client prediction at two 50 ms ticks because authority coalesces movement packets; preserve a pending dash edge. Smooth owner presentation with a 35 ms time constant, snap authoritative elimination and adjustments above 2.5 m. N03 deterministic delayed-message fixtures cover 100/20 and 200/50 ms profiles with matching final states. Measured target adjustments still include real motion/impacts and can reach 3.5 m; no human feel approval is inferred. See M2-latency evidence.

2026-09-07 DEFAULT D31: browser room preview uses native WebSocket, 20 Hz assigned-seat input, shared-simulation movement prediction only and a bounded eight-frame/two-tick remote interpolation buffer. Reconnect retries every 400 ms within nine seconds; neutral messages clear queued actions. Confirmed results survive terminal transport closure. Rooms assign characters by seat and rematch returns to setup. Thirty tests and two-browser matching results are recorded; latency metrics and Cloudflare hosting are still pending.

2026-09-07 DEFAULT D30: use ws 8.18.3 and @types/ws 8.18.1 for a loopback-only Node WebSocket development adapter, preserving Cloudflare Worker/Durable Object as the hosting target. Server-minted 32-byte seat tickets, six-character random room IDs, exact loopback Host/Origin, no compression, eight retained rooms and 96 sockets; waiting rooms expire after 120 seconds and terminal rooms retire/close after 60 seconds. A local atomic-replacement journal (maximum 4096 records; ignored by Git) cancels unfinished rooms on restart without persisting tickets. Ten four-client real socket rounds plus rejection/reconnect/recreation tests pass. Browser adapter, latency/prediction and Cloudflare integration are still required.

2026-09-07 DEFAULT D29: M2 introduces a transport-independent RoomAuthority with trusted server-injected admission tickets, strict 1 KiB JSON client messages, 60 messages/s and burst 10 per seat, a 128-command sequence window, one pending input per seat and 64 KiB transport-backlog cutoff. Reconnect preserves the participant, replaces socket ownership before closing the old connection and sends full state with consumed/next sequence values. Ten-second expiry forfeits through shared simulation's optional server-selected participant list, resolving all same-tick eliminations together. Nineteen local tests pass; these are unprofiled defaults and partial M2 evidence, not hosted capacity or browser-network proof. No reward eligibility is granted by the room or client-visible fields.

2026-09-06 USER D24: the active goal supersedes the old bootstrap/M1-only assignment and authorizes sustained game implementation, with playable gameplay and high-quality character/world/music/SFX as priorities. Follow milestone order and distinguish implemented work from pending outside/hardware/deployment gates. No inferred commerce or cloud spending.

2026-09-06 DEFAULT D25: local practice preset uses 90-second rounds, 5-second countdown and a 30-second shrink to radius 2.2, announced 2 seconds in advance. This keeps bot practice replayable while preserving hard-timeout draws. Original 180-second public-match target is retained. Initial 20 seeded rounds finished without a stuck round, between 10.85 and 75.35 seconds. Movement/dash/impulse defaults are otherwise unchanged.

2026-09-06 DEFAULT D26: pin Node 24.19.0, pnpm 11.19.0, TypeScript 5.9.3, Three.js/@types/three 0.180.0 and @types/node 24.10.1 in the root lockfile. Use Node's pinned TypeScript erasure for the minimal local server/static build and its built-in test runner; run tsc separately. No UI framework. Runtime and art never enter pure simulation.

2026-09-06 DEFAULT D27: simulation uses 16 deterministic collision substeps with bounded supported speeds, a pre-resolution contact set for simultaneous dash hits, once-per-dash target records, separate voluntary/external velocities and JSON-serializable authority state. The first Arena mode handler owns shrink/outcome; further mode hooks will be added as needed with integration tests. Bots react every 250 ms and submit normal input commands.

2026-09-06 DEFAULT D28: integrate the existing Sprout r002 and Lumi r001 as visibly labeled development art, preserving shared rig, clips, colliders and source files. Sky Ring geometry is original code-authored prototype scenery. This does not approve a final character identity, production animation or M3 visual gate. Browser testing prompted a closer gameplay camera, corrected narrow-view lobby framing, queued dash direction for brief key taps and render-time falls that continue after a terminal simulation tick.

2026-09-05 asset pipeline session: explicit user scope authorizes one character and Blender pipeline ahead of M1, without broad game/art production. DEFAULT D21: Sprout-derived prototype after Sprout/Lumi comparison; recovered compact proportions supersede 3.5-head default for this proof only. DEFAULT D22: character-contract-v0.1 / rig.knockbound_v1_prototype, 1.965 m height, 10,738 triangles, two vertex-color materials, 20 deform bones plus root/13 sockets. DEFAULT D23: direct Blender 5.2.1 Python and glTF exporter v5.2.40; isolated Three.js 0.180.0 preview, Node 24.19.0/pnpm 11.19.0, Khronos validator 2.0.0-dev.3.10. No image generation or external production assets. Three proof clips only; final rig and seven other production clips remain pending. Full contract and rationale: [CHARACTER_ASSET_CONTRACT](CHARACTER_ASSET_CONTRACT.md).

2026-09-05: recovered all 89 foundation topics and later amendments; established rename; created M0 package; added explicitly labeled prototype/pipeline defaults and acceptance gates. No tuning or gameplay validation has occurred.

2026-09-05 branch recovery follow-up: added eight original PNGs to complete the observed ten-image gallery. Added [detailed branch consolidation](BRANCH_DESIGN_ADDENDUM.md). Preserved Lumi alongside Sprout; retained named Cloud King attacks, alternate boss treatment, crown transfer illustration, team Hill meter, social hub and portrait UI. Image-only dual currency/jump/three-phase/ranked details remain candidates; no silent economy, input or milestone expansion. Previous image-retrieval limitation is resolved for all ten images exposed by the branch viewer.






# 2026-09-09 DEFAULT D56: Dash availability feedback

The visible dash action disables during countdown, cooldown, stun, pause, spectating/results or unavailable controls, with a matching accessible status. This is presentation only; keyboard and authoritative dash rules remain unchanged. Phone-size normal-play evidence: tests/evidence/M3-dash-feedback.

2026-09-09 DEFAULT D63: nearby eligible ground items receive a presentation-only ring and action hint within3.25m; closest wins, thrown/armed/expired/grace-blocked items excluded. Bomb text preserves fuse urgency. Authoritative pickup/collision rules unchanged. Evidence M3-pickup-guidance.

2026-09-09 DEFAULT D64: automatic pickup chooses closest eligible item within strict0.85m rather than spawn order; exact ties retain ground-list order. Shared pure candidate helper also drives nearby guidance. Drop/same-tick swap retains charges/lifetime and drop grace. Compatibility0.12.1 prevents old authority behavior from mixing with this client.

2026-09-09 DEFAULT D65: short landscape viewports place aim/pickup hints in lower center between thumb controls; item panel sits above right thumb area. Portrait spacing unchanged. Evidence M3-landscape-hints.

2026-09-09 DEFAULT D66: local room journal startup writes only waiting-to-cancelled transitions. Existing terminal records remain untouched. Required persistence failure still aborts startup and preserves recoverable input. Evidence M2-journal-restart; no network/simulation change.

2026-09-09 DEFAULT D67: local remover target preview uses cyan, distinct from gold committed tile warning; same shared target sampler as authoritative action. Existing behavior preserved, compatibility0.12.1 unchanged. Evidence M3-remover-preview.

2026-09-09 DEFAULT D68: audio readiness reflects actual AudioContext state after loading; browser suspension exposes tap-to-resume status and existing Settings retry. Resume without running state cannot report ready. No sound/mix changes. Evidence M3-audio-state.

2026-09-09 DEFAULT D69: tile batches mark only changed position-component ranges for upload; pinned Three merges adjacent ranges. Preserve geometry, motion, UVs and collision. M3-tile-upload-ranges records structural/visual evidence, no FPS claim.

2026-09-09 DEFAULT D70: high-quality sun shadow map1024x1024 (previous2048), retaining dynamic updates/PCFSoft/frustum/bias. Close desktop/portrait shadows inspected; one quarter texels, shortGPU12.8ms sample but frame target unmet. M3-shadow-resolution records tradeoff and limits.

2026-09-09 DEFAULT D71: bound3D framebuffer to1,536,000pixels, retaining high1.75/low1 DPR limits belowbudget; DOMcontrols native. Large-display mildsoftness reviewed, softshadows preserved. M3-render-budget:1080viewport/1652x929buffer shortp9516.8ms, notnative1080acceptance. Reversible tuning.

2026-09-09 DEFAULT D72: first-person non-hat prop y1.4 andscale*.36 to reveal identifying upperpart above phoneitemHUD without coveringcentral target. Third-personcamera/armposing unchanged after rejectedexperiments. M3-first-person-framing.

2026-09-09 DEFAULT D73: expiry takes precedence over heldbomb toss/drop. Disallow action at/afterexpiresAt, preserve just-beforeexpiry one-secondtoss. Compatibility0.12.2. M3-bomb-expiry-boundary has reproducedfailure/authority+transport evidence.

2026-09-09 DEFAULT D74: expire ordinary held tools before the active tick's hazard/item/movement effects; preserve bomb/pod special expiry. Compatibility 0.12.3. Reproduced Big gust resistance boundary and explicit shovel/hat checks in M3-passive-expiry.

2026-09-09 DEFAULT D75: desktop close-camera Mouse look defaults on, saved per browser. Click arena requests pointer lock, mouse motion turns without dragging, Escape/unlock pauses. Touch remains drag; denied lock falls back to drag with an accurate hint. No authoritative input contract change. User requested easier desktop camera direction control; M3-mouse-look records checks and embedded-browser limitations.

2026-09-09 DEFAULT D76: Mouse look re-enable resets a previous browser denial, disable releases capture immediately; failure hint explicitly identifies capture unavailability. M3-mouse-retry includes failing-before/passing-after regression and Chrome automation fallback evidence. No simulation change.

2026-09-09 DEFAULT D77: J/L provide continuous close-camera yaw at2.4rad/sec, both cancel, pause/blur clears. Mouse/touch remain available; no authority contract change. M3-keyboard-camera includes actual Chrome first/third turning and precise WrongDocumentError capture diagnosis.

2026-09-09 DEFAULT D78: overlapping bomb/pod stuns preserve later recovery, matching existing rock behavior; durations do not add. Reproduced early recovery corrected in shared simulation, compatibility0.12.4. M3-overlapping-stuns records targeted/transport checks.

2026-09-09 DEFAULT D79: random item spawn placement rejects missing/warned tiles and obstacles;16 attempts plus deterministic valid tile-center fallback, otherwise skip scheduled spawn. Compatibility0.12.5; M3-safe-spawns records reproduced lost pickup, deterministic/bounded checks.

2026-09-10 DEFAULT D80: bots coincident with a bomb/pod danger choose an inward movement direction, or +X at arena center, instead of a zero away vector. Existing terrain checks and ordinary simulation movement still apply; no teleport, extra dash or immunity. Compatibility0.12.6 separates changed bot replay behavior. M3-bot-danger-escape records regression and integration evidence.

2026-09-10 DEFAULT D81: a rejected joystick pointer-capture request cancels that gesture and resets its ownership/visual/input state. The next touch can acquire control without a missing pointerup leaving the pad stuck. Normal capture behavior is unchanged; compatibility remains0.12.6. M3-touch-capture-recovery records failing-before/passing-after checks.

2026-09-10 DEFAULT D82: helicopter-hat rotor uses render presentation time at the existing10rad/s speed instead of20Hz authority ticks. Frozen presentation time stops it; reduced motion fixes angle at0. Item lifetime, rescue and simulation state remain authoritative and unchanged. M3-rotor-interpolation records regression and visual review; compatibility0.12.6 unchanged.

2026-09-10 DEFAULT D83: projectile positions/rolling distance interpolate between presentation snapshots. Latest authority controls hit records and removal; buffered online shots enter only when their birth snapshot reaches the display interval, preventing backward spawn jumps. Local new shots display at their current position. No extrapolation or simulation/schema change, compatibility0.12.6. M3-projectile-interpolation records targeted tests, actual WebSocket round and visual fixtures.

2026-09-10 DEFAULT D84: reveal occluded local third-person directed held tools with a cyan translucent silhouette (opacity.28, GreaterDepth, no depth write). Preserve camera/aim/socket pose; follow expiry blink and reduced motion. No cue for other players, ground/passive items, first person or arena view. Client-only0.12.6; M3-held-occlusion records visual review, tests and depth-mask limitations.
