# Acceptance criteria and quality bar

No gameplay criterion has passed during bootstrap. Each gate requires evidence, not a checked box inferred from code. Store run environment, build/release, scenario, expected/actual result and evidence path using tests/evidence/TEMPLATE.md. A blocked hardware/deployed test remains pending.

## Bootstrap

| ID | Pass condition |
|---|---|
| B01 | Canonical docs, HANDOFF and AGENTS exist; local links resolve; current product name is consistent outside history |
| B02 | Every foundation section 1–89 is mapped to canonical docs; later amendments and unresolved choices are recorded |
| B03 | Repository ownership folders and asset ledger exist; no game implementation/deployment is misrepresented |
| B04 | Historical concepts available from source are preserved with provenance and status; retrieval limitations are disclosed |

## M1 physics and local bot proof

| ID | Scenario and required outcome |
|---|---|
| P01 | Same pinned runtime, seed/config and 10,000 recorded input ticks produce identical logical state/event digest; different render FPS does not alter outcomes |
| P02 | Cardinal and diagonal movement obey the same speed bound; zero/NaN/invalid input cannot corrupt state; no retained movement after input timeout |
| P03 | One dash yields at most one qualifying hit per target, cooldown cannot be bypassed; repeated hits increase vulnerability and recovery follows configured delay |
| P04 | Coincident circles, head-on dashes and maximum-speed thin-obstacle contacts resolve without NaN, permanent overlap or tunneling |
| P05 | Edge crossing eliminates once; same-tick final ring-outs draw; timeout cannot hang; restart resets world/actions/events |
| P06 | One keyboard player plus three bots completes 20 seeded rounds with no crash or stuck round; bot inputs obey human speed/cooldowns |
| P07 | Locally play at least five rounds, record tuning changes and observations about control, impact and edge readability; no invented user feedback |

## M2 online authority

| ID | Scenario and required outcome |
|---|---|
| N01 | Four independent clients complete ten matches with consistent result/roster; 12-participant load fixture has no unbounded queues |
| N02 | Forged position/reward, wrong seat, duplicate sequence, spammed dash, oversized/malformed packet are rejected without corrupting the match |
| N03 | Simulate 100 ms RTT + 20 ms jitter, then 200 ms RTT + 50 ms jitter; record correction frequency, responsiveness and snapshot bytes; no divergent final outcomes |
| N04 | Drop/reconnect within 10 s restores same participant and full state; old socket cannot control; expired grace uses mode disconnect rule |
| N05 | Focus loss neutralizes controls; late joins do not enter active Arena; rejected release/protocol mismatch never reaches readiness |
| N06 | Inject room restart and duplicate terminal submission: clear cancellation/resolution, no silent match restart or duplicate result; reward grant remains absent until M5 |
| N07 | Record deployed room timing/latency/cost probe when authorized; local emulator success alone cannot certify hosting viability |

## M3 vertical slice

| ID | Scenario and required outcome |
|---|---|
| V01 | One exported finished character and Sky Ring reviewed in actual game, including turntable, crowd scene and recorded gameplay; all required clips transition without visible popping/clipping |
| V02 | Dash/hit/elimination have coherent animation, VFX and sound; warning is distinguishable before every damaging/mutating event; reduced motion preserves gameplay information |
| V03 | Lobby → load → 5 s countdown → active → outcome → play again works ten consecutive cycles; errors/reconnect are understandable |
| V04 | On recorded reference laptop/browser at 1080p, target p95 frame time ≤16.7 ms in 12-participant fixture; on chosen phone low tier target p95 ≤33.3 ms (phone measurement in M4). Measure 3 minutes after warmup |
| V05 | Initial compressed first-play transfer ≤15 MiB target; no missing asset/console error; record cold-load time and network profile, heap before/after ten cycles and investigate sustained growth |
| V06 | Listen to gameplay on headphones and speakers; no clipping/clicks or warning masked by music; volume/mute persists and audio unlock works |
| V07 | At least three outside testers attempt first session without coaching: record whether controls/objective are understood within 60 s and whether they voluntarily choose another match. Target all understand and at least two replay; report sample limits and actual feedback |

Do not claim objective commercial polish solely from these numeric targets. Visual/audio review and observed fun are additional requirements. Missing external testers block V07, not independent implementation work.

## M4 extensibility/local/co-op

| ID | Scenario and required outcome |
|---|---|
| C01 | 2, 3 and 4 local humans plus allowed bot fill can join, play and restart without cloud access; controller disconnect/reassignment preserves seat identity |
| C02 | King of the Hill scores only uncontested occupancy, resolves tie/timeout and respawns safely; bots pursue objective |
| C03 | Boss telegraphs/attacks/vulnerability/phase transitions and win/team-wipe/timeout all complete; co-op bots can contribute to the objective |
| C04 | Second map variant, boss sequence and item variant use existing registered behaviors with no simulation/network/wallet edits |
| C05 | Invalid host capacities, unsupported maps, forbidden rules and in-round config changes are rejected; UI explains allowed presets |
| C06 | Touch move/dash at same time, resize/orientation, safe area and cooldown readability pass on recorded real phone; desktop controls remain usable |
| C07 | Equivalent recorded input/config yields equivalent local and online authoritative outcomes; offline results cannot claim online rewards |

## M5–M8 integrity/content

| ID | Scenario and required outcome |
|---|---|
| E01 | Guest can play before account; repeated account-save/merge cannot duplicate entitlements or currency |
| E02 | Duplicate/reordered match result deliveries and crash/retry produce exactly one eligible reward transaction per user/result/rule |
| E03 | Forged client challenge/currency/inventory claims fail; only eligible authoritative counters progress challenges |
| E04 | Wallet, ledger, receipt and entitlement writes remain atomic on injected failure; concurrent spending cannot overdraw |
| E05 | UTC daily rollover, delayed processing and duplicate challenge claim are correct; all daily goals are purchase-free |
| A01 | Every integrated external asset has license evidence, author/source, modification and runtime/source mapping |
| A02 | Cosmetics share rig or documented supported binding; no gameplay stat/collider change; representative combined loadouts pass extreme poses |
| A03 | Missing clip/socket, incompatible rig, bad reference, duplicate ID, dependency cycle and invalid parameters fail content validation |
| A04 | Exported GLBs and metadata pass pinned exporter/loader preview, asset budgets or documented profiled exceptions |
| E06 | Catalog price is server-resolved; earned-currency purchase retries grant one item/debit; featured rotation uses server time |
| E07 | Event starts inclusively and ends exclusively in UTC; started eligible match can finish; expired new entry is blocked; earned badge/accessory remains equipped |
| E08 | Second event works with data/assets; rollback affects new matches, old match pins survive, retired inventory IDs still resolve |
| E09 | Before paid launch: verified provider webhook/replay/refund/reversal tests, purchase history, receipt and fraud handling; no client-success grant |

## Public release

R01: specify supported browser/device matrix, production load/cost envelope, restore/rollback drills and observed performance before release.
R02: guest/account privacy and retention, username limits/moderation/report workflow, protected/audited admin actions are operational.
R03: catalog/mode/map balance and sufficient playtest evidence support release; ranked waits for actual competitive data. No launch claim based on historical content-count suggestions alone.
