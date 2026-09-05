# Decisions and unresolved choices

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

2026-09-05 asset pipeline session: explicit user scope authorizes one character and Blender pipeline ahead of M1, without broad game/art production. DEFAULT D21: Sprout-derived prototype after Sprout/Lumi comparison; recovered compact proportions supersede 3.5-head default for this proof only. DEFAULT D22: character-contract-v0.1 / rig.knockbound_v1_prototype, 1.965 m height, 10,738 triangles, two vertex-color materials, 20 deform bones plus root/13 sockets. DEFAULT D23: direct Blender 5.2.1 Python and glTF exporter v5.2.40; isolated Three.js 0.180.0 preview, Node 24.19.0/pnpm 11.19.0, Khronos validator 2.0.0-dev.3.10. No image generation or external production assets. Three proof clips only; final rig and seven other production clips remain pending. Full contract and rationale: [CHARACTER_ASSET_CONTRACT](CHARACTER_ASSET_CONTRACT.md).

2026-09-05: recovered all 89 foundation topics and later amendments; established rename; created M0 package; added explicitly labeled prototype/pipeline defaults and acceptance gates. No tuning or gameplay validation has occurred.

2026-09-05 branch recovery follow-up: added eight original PNGs to complete the observed ten-image gallery. Added [detailed branch consolidation](BRANCH_DESIGN_ADDENDUM.md). Preserved Lumi alongside Sprout; retained named Cloud King attacks, alternate boss treatment, crown transfer illustration, team Hill meter, social hub and portrait UI. Image-only dual currency/jump/three-phase/ranked details remain candidates; no silent economy, input or milestone expansion. Previous image-retrieval limitation is resolved for all ten images exposed by the branch viewer.
