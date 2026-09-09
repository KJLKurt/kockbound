# Decisions and unresolved choices

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






