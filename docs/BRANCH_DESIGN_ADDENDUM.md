# Branch design addendum

Canonical consolidation of branch-specific details, including newly recovered image annotations. This supplements the domain specifications; it does not replace their milestone limits. Evidence: [mode/local-play discussion](sources/b4197f49-f3df-413b-8a29-a0a45565d72e.md), [content/events discussion](sources/bbb210e8-7113-4c41-9035-2a79f42136d3.md), and [all ten concept sheets](CONCEPT_ART_GALLERY.md).

User requirements: strong local bots, cooperative and competitive possibilities, host-selected settings, shared engine, independent content authors, seasonal play content and earned wearable rewards.
Historical assistant suggestions and image annotations are retained below as candidates. They are not automatically approved mechanics or a mandate to ship every depicted feature.

## Character identity and presentation

Two distinct explored directions exist:
- Sprout: cream skin, blue/pink head fins, tail, hoodie, sneakers and strongly expressive face; Classic, Street, Explorer and Neon outfit studies.
- Lumi: blue fur/skin, tall swept ears/head tufts, cream face, orange scarf, broad gloves and sneakers; Default Lumi, Neon Racer, Explorer, Royal and Snowbound variants.

The later sheet matters: the project must not describe Sprout as the only recovered character concept. Both show front/side/back views, expression/silhouette exploration and modular head/body/back/shoe/trail elements. Other gameplay sheets show additional creature-like silhouettes, including red and penguin-like characters. Those are roster exploration, not proof that multiple production species or rigs were selected.

At M3 compare both concepts at the real gameplay camera, then choose and record one production base before rig/cosmetic volume. Reuse a common skeleton where practical; ear/tail secondary motion may use optional presentation bones without altering gameplay collision. The historical names and slogans are concepts, not locked species names or final Knockbound copy.

## Sky Ring, movement and mode readability

The expanded Sky Ring sheet adds a central crown island, segmented outer walkway, connecting segments, broken/open edges and elevated background islands with waterfalls. It includes top/side/environment views useful for modeling. Bumpers sweep or move near the perimeter; magenta arrow pads communicate launch direction; translucent dissolving segments communicate disappearing support.

Image annotation says disappearing tiles can react to standing too long. Preserve occupancy-triggered collapse as a future hazard variant; it does not replace the timed telegraphed mutation chosen for the first slice. Raised surfaces and apparent decorative rails are visual concepts; author explicit support/collision metadata rather than inferring collision from mesh.

Several sheets say jump/grab and depict airborne characters. The written core controls do not establish a separate universal jump button. Pad-launch arcs, dash, falling and animation can explain much of the imagery. A controllable jump, air steering, landing support and weak-point reach rules need an explicit mode/mechanic decision before implementation. Keep the primarily planar simulation; do not silently introduce full 3D rigid-body physics.

King of the Hill: emphasize a bright central capture footprint, crown marker, readable control state and score meter. The art shows a team meter, while M4's initial default is the simpler fixed-zone proof. Preserve team and moving-zone variants for future rulesets; contested occupancy must be clear and must follow the configured scoring rule.

Crown Chase: the carrier holds a visibly luminous crown, opponents chase and use pushes to change possession, and a transfer storyboard explains the interaction. A timer and open-edge hazards maintain urgency. Before this future mode ships, define transfer/drop conditions, ring-out recovery, carrier marking, whether victory means possession at expiry or cumulative possession, and ties. The concept's timer is illustrative, not a locked round length.

## Boss production and encounter vocabulary

Cloud King sheet: a regal but friendly giant with cloud beard/body, blue face/hands, gold crown/armor and a glowing crown core. It calls him a gentle giant and depicts happy, focused and laughing expressions. Approximate six-times-player height is a staging reference, not a collider or performance requirement.

| Sheet attack | Recovered intent | Engine/content implication |
|---|---|---|
| Wind Slam | Hands slam and emit outward wind waves that push players | Telegraph footprint, radial impulse and recovery |
| Cloud Summon | Floating cloud platforms move around the arena | Explicit support/path lifetime and safe landing rules before use |
| Sky Boulders | Floating stone chunks are hurled into the arena | Authored projectile trajectory, warning and knockback |
| Tempest Spin | Spinning ring creates a vortex pulling inward | Bounded attraction field with readable radius and escape options |
| Exposed crown core | Vulnerable after major attacks; cooperate to open it | Typed vulnerability window and objective requirements |

The boss gameplay sheet is a separate more imposing cloud-and-stone titan exploration with a glowing chest core. Do not claim its identity is conclusively the same model as the friendly Cloud King, or ship two bosses merely because two treatments exist.

That sheet adds:
- Smash: breaks tiles and creates shockwaves.
- Cloud Blast: gust/projectile pushes players backward.
- Spawn: introduces small sky minions.
- Sweep: wide shockwave with a dodge/jump depiction.
- Push the Core: shared objective object used to break the boss's shield.
- Reach Weak Points: pads/cannons provide access to the core.
- Three-phase escalation: introduction, more hazards/minions, then a final team effort.

The textual branch encounter also proposes three switches → vulnerability → push energy bombs into the boss → knockback → next phase. A volcano encounter proposes pushing magma cores into three launchers to fire them back at the boss. Keep these as alternative authored encounter recipes built from common interactions.

M4 remains one boss with two proof phases and a configured variant. The three-phase storyboard and full attack list are later candidate content. Its essential test is cooperation through shared movement/pushing/objectives, not a separate RPG combat system. Every selected attack needs windup/active/recovery, safe responses, bounded duration and completion/failure rules.

## Social staging and local play

The branch's social intent is stronger than a menu: players should eventually remain together in a public/random room, interact between structured activities, enter a short boss or competitive challenge and return to the same group. The discussion suggests an approximately eight-player hub, activity announcements and portals. Exact capacity/timing remain candidates.

The lobby concept supplies a sky-island plaza, central globe/crown landmark, readable Play portal, challenge board, gathering seats, emotes, practice-push stations and a cosmetic showroom. A Ranked portal is pictured, but ranked still waits for real gameplay data. Shop/friends/social hub remain later stages; M3's menu lobby can borrow the character display, hierarchy and world backdrop.

Local expectations cover solo bots, couch versus, couch co-op and couch boss play. Example: four local humans plus four CPU players in one eight-participant match. Bot personalities retained from the discussion: Aggressor (attack), Survivor (safety), Objective Player (zones/items), Troublemaker (hazards), Support (protect teammates). Party bots may make readable mistakes, but never gain hidden stat advantages.

## Host settings: retained candidate domains

These are the actual suggested option families, not all required at M4:

| Setting | Branch examples |
|---|---|
| Participants | 2–12 total; solo practice separately supported |
| Teams | FFA, two teams, three teams, co-op |
| Bots | 0–10, bounded by total capacity |
| Round duration | 1, 2, 3, 5 or 10 minutes |
| Lives | 1, 3 or unlimited where supported |
| Abilities | Off, Standard, Random, Custom |
| Items | Off, Low, Normal, Chaos |
| Hazards | Off, Low, Normal, High |
| Knockback multiplier | 50%, 100%, 150%, 200% |
| Mutations | Off, Normal, Fast |
| Respawn delay | Off, 3 s, 5 s, 10 s |

Start with supported presets and a small settings screen. Advanced controls depend on mode validation; arbitrary combinations can be invalid. These historical example ranges are not a substitute for each mode's validated capacity limits.

## Items, modes and reusable objects

Keep one temporary item plus one loadout ability, simple action controls and positioning-oriented effects. Example items: slow strong hammer, quick boxing glove, air cannon push, grapple pull, boomerang stun, magnet attraction, spring mine launch, snowball push/slip, sticky knockback bomb, temporary bubble, vacuum and rocket boots. A random in-match pickup is different from a paid randomized loot box; paid loot boxes remain excluded.

The reusable object vocabulary includes carry, throw, activate, defend, collect, push, break and capture. The objective vocabulary includes survival, score, capture, escort, collect, defeat, defend, race and cooperation. Add registered capabilities as real modes need them rather than implementing every verb upfront.

The branch's broader candidate catalog includes Arena, King of the Hill, Crown Chase, Boss Battle, Team Knockout, Treasure Grab, Hot Potato, Payload Push, Relic Hold, Survival Waves, Boss Rush, Obstacle Race, Infection, Bounty Hunt, Zone Collapse, Capture the Creature, Protect the VIP and Raid Escape. Party mutators include Floor Is Lava, Low Gravity, Everyone Has Grapples and Super Knockback. Competitive variants may last 2–5 minutes; cooperative sessions 5–10 minutes. The standard Arena target remains 2–4 minutes.

## Mobile UI and conflicts that must not be lost

The phone sheet shows portrait home/shop/match views. Home centers the avatar on a pedestal with profile/level progress, a dominant gold Play button, mode cards, customization/emote/collection shortcuts and daily challenge progress. Shop uses featured cards and category navigation. Match HUD uses a left joystick, right action buttons, remaining players and round/time indicators.

Use these for layout hierarchy and touch exploration. Preserve a portrait prototype comparison at M4 rather than assuming the landscape-first default was an approved rejection of portrait. If portrait cannot frame action/readable controls, record the evidence and provide deliberate rotate guidance.

| Image detail | Canonical disposition |
|---|---|
| Coins plus purple gems, purchasable packs and shop prices | Exploratory mockup; initial single earnable currency and earned-only shop sequence still govern |
| Rush, Survival and locked Events cards | Candidate navigation labels, not new required launch modes or paid access |
| Jump icon and jump/bumpers daily goal | Candidate action/challenge; do not require an action absent from the implemented rules |
| Round 2/3 | Multi-round presentation idea, not replacement for standard single-round loop |
| Mail badge, Friends tab, squad/friend play | Later social/account feature ideas, not M3 prerequisites |
| Team meter in Hill | Preserve future team variant; do not silently change M4 proof scoring |
| Three boss phases | Preserve escalation idea; two-phase proof scope remains |
| Push Arena logos and slogans | Keep historical originals unchanged; new production brand is Knockbound |

## Seasonal content and creator independence

Retain the branch's concrete event packages:
- New Year: fireworks map variant, countdown lobby, confetti trail, participation badge/crown and boss reskin/mutator.
- Winter/Christmas: snowy hub, gift pickups, snowball item, winter boss variant, hat/scarf/emote/badge.
- Halloween: fog theme, ghost trails, pumpkin head, haunted boss and playful spooky audio.
- Summer: beach outfits, water-slide hazards, sandcastle lobby and visor set.

Rewards can include badges, accessories, skins, emotes, titleplates, trails, banners, profile frames and commemorative trophies. Expiring play content must not erase earned displayable rewards. All examples need event eligibility and entitlement rules from CONTENT_SYSTEM.md.

Future authoring tools have separate jobs: levels place geometry/spawns/hazards/navigation/anchors; encounters compose phases/attacks/vulnerabilities/rewards; item/ability tools configure existing behaviors and preview balance; cosmetic tools validate rigs/slots; live-ops tools schedule content/challenges/rewards. Authors should not need to edit networking, account progression or unrelated game systems. No free-form scripting, public UGC or complete editor suite is added to the initial milestone.
