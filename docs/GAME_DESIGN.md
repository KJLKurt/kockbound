# Knockbound game design

Status: canonical consolidated design. Sources and decision status: SOURCE_COVERAGE.md and DECISIONS.md.

[Branch design details](BRANCH_DESIGN_ADDENDUM.md) preserve the expanded host-setting options, bot personalities, item effects, cooperative recipes, seasonal packages and newly recovered visual annotations. [Concept gallery](CONCEPT_ART_GALLERY.md) contains the ten supporting images. These details supplement the sections below with clearly labeled candidates and conflict resolutions.

## Vision and pillars

A browser-first party-action game that must work on phones and desktop: stylized 3D humanoid creatures on readable arenas, primarily X/Z gameplay simulation, elevated camera, short rounds, environmental chaos and expressive cosmetics. Phone play is a current user priority (D38), superseding its former later-platform status. Standard online matches target 4–12 participants and 2–4 minutes; total play/reward/replay cycle is about 3–5 minutes.

Pillars: easy to start; skill through timing, positioning and momentum; short replayable matches; recognizable personality; fair competition. The central feeling is playful competitive chaos. Characters fly away, vanish into clouds or fall comically; they do not die violently.

Later discussion expands the product into one shared competitive/cooperative/local party-action engine. Preserve one product and shared cosmetics initially; possible separate games are a future option, not launch scope.

## Controls and core loop

Movement: touch joystick and WASD/arrows; gamepad stick remains planned. Dash: large touch action or Space, with controller support planned. Touch movement and dash must work simultaneously, with neutral input on cancellation, focus loss or orientation change. One selectable ability, one temporary held item as later content. Emote/interact stays simple. No large inventory or stat-heavy equipment.

Guest-friendly flow: load → simple appearance/name → brief bot tutorial → round → results → play again/lobby. Later progression introduces first earned currency and inexpensive cosmetic within the first session. Never require registration before trying the game.

Standard Arena: last survivor wins. Movement carries momentum; dash attacks and escapes; repeated hits increase knockback vulnerability. No conventional player health bar in this mode. Colliders are consistent across cosmetics. Ring-outs, lethal hazard zones and map events eliminate. Dead players cannot affect authoritative play. Tie, timeout and elimination ordering defaults are specified in IMPLEMENTATION_SPEC.md.

Round lifecycle: lobby → matchmaking/assignment → content loading → 5-second countdown → active round with map mutations → sudden death if needed → result → rewards when enabled → replay/lobby. Finish rules belong to each mode.

## Modes and local play

| Experience | Role | Planned stage |
|---|---|---|
| Arena | Free-for-all last survivor; see Team Arena below | M1–M3 |
| Team Arena | Equal teams including2v2v2 and3v3v3v3; last surviving team wins | Implemented0.13.0; player testing pending |
| King of the Hill | Hold a zone; contested zone earns no score | M4 |
| Boss Battle | Co-op objectives, telegraphed pushes and vulnerable phases | M4 |
| Local Party | 2–4 same-device humans plus bots using supported modes | M4; solo bots in M1 |
| Team Knockout, Crown Chase, Treasure Grab, Hot Potato | Later competitive variety | Future catalog |
| Survival Waves, Boss Rush, Raid Escape, Protect the VIP | Later structured cooperation | Future catalog |
| Race, Infection, Payload Push, Relic Hold, Bounty Hunt, Zone Collapse, Capture the Creature | Experiments using shared interactions | Future catalog |

Current team and boss implementation details, limits and authored variants: [party-mode contract](PARTY_MODE_CONTRACT.md).

Co-op can target 5–10-minute sessions; it does not replace short standard rounds. Bosses reuse pushing, switches, hazards and objective objects rather than introducing unrelated RPG combat. Example encounter: dodge shockwaves, activate switches, expose boss, push energy objects into weak points, transition phase. Names Cloud King and Sky Titan are exploratory alternatives, not two committed encounters.

Local solo, couch versus and couch co-op must be useful without online population. Target one keyboard plus controllers, up to four local humans. CPU players understand survival, contested zones and cooperative objectives; difficulty changes reaction and decision quality, not hidden speed or invulnerability. Hybrid couch-plus-online is deferred pending explicit design.

## Arenas, items and hazards

First arena: Sky Ring, a floating circular arena with disappearing edge tiles; moving bumpers and jump pads are subsequent variants. M1 starts with a simple static ring; M3 introduces one telegraphed mutation.
Next proposed maps: Magma Works (lava, bridges, pressure vents, eruptions) and Frostfall (ice, snow gusts, breakable ground, snowballs).
Earlier Training Grounds/Volcano/Ice Station/Sky Temple/Factory names are exploratory archetypes; do not create duplicate maps merely to preserve names.
Later ideas: Jungle Ruins, Clockwork Core, Festival Plaza; bosses Magma Titan, Frost Queen, Junkyard Mech, Trickster Moon and holiday variants.

Abilities: Shockwave, Shield, Grapple, Ground Slam, Blink and Magnet are candidates, not a requirement to ship all in M3. Default first optional ability is Shockwave.
Items extend positioning: hammer, boxing glove, air cannon, boomerang, magnet, spring mine, snowball, sticky bomb, bubble, vacuum and rocket boots. Temporary item pickups differ from persistent loadout abilities. No paid stat advantages.
Hazard vocabulary includes falling tiles, currents, conveyors, fans, cannons, hammers, bumpers, teleporters, bridges, rotating floors, ice/mud, walls, tornadoes, barrels, sweeps and gravity zones. Add only needed behavior primitives.

## Lobby and host settings

Launch starts with an intentional menu lobby showing the animated equipped character, Play, mode selection and later Character/Shop/Challenges. An interactive social hub with random rooms, emotes, practice and rotating activity portals is future scope.

Quick Play is primary; matchmaking favors acceptable latency, short waits then broad skill fit. Bot filling avoids empty queues. Private room codes and persistent parties follow the slice. Hosts configure mode, map, participant/bot count and supported presets. Later advanced settings can expose teams, lives, duration, abilities/items, hazards, knockback, mutations and respawns. Validate combinations against the mode; lock settings at countdown. Public queues use curated presets. Private/local rewards must not become farming routes.

## Progression and economy

Earnable currency with optional future purchases; the historical working currency label is Arena Coins. Purchases primarily buy expression. No paid random loot boxes, launch battle pass or permanent stat growth.

Account XP/levels, common global daily challenges (approximately three), achievements, collections, event rewards and profiles support retention. Never require a purchase to complete a challenge. Cosmetic slots: head, hair, face, body, legs, feet, back, effects, trail, emotes and victory; later banners, nameplates, knockout/spawn effects and frames. Shared rigs and cosmetics travel between modes.

Rarity candidates: Common/Rare/Epic/Legendary/Mythic; Event is an acquisition/history tag rather than combat strength. Achievement-only rewards remain distinct from shop items. Earned event badges/accessories remain displayable after event content ends.

Historical economy examples are explicitly illustrative: match 20–40 coins, top-three +20, win +30; daily total 300–500; engaged daily earnings 500–800. Cosmetic examples 500/1,200/3,500/8,000/15,000/20,000 coins. Purchase bundle examples were 1,000/$0.99, 5,500/$4.99, 12,000/$9.99, 25,000/$19.99. None are approved prices or tuned economy values.

## Social, operations and long-term release

No unrestricted text or voice chat initially. Use emotes, pings and preset phrases. Before public launch implement username constraints, report handling and moderation. Guests can later save progress to accounts; exact provider remains open.

Username policy must cover length, prohibited words, duplicates and rename cooldown as well as reports. Historical preset phrase examples: Nice, Oops, Let's Go, GG, Help and Over Here. Profiles may show username/avatar, level, wins, matches, win rate, top-three finishes, knockouts, favorite ability, achievements and cosmetic showcase; avoid overwhelming casual players with competitive statistics. Candidate account providers were email, Google, Apple and Discord, without a locked selection.

Retained expansion examples include Cyber/Pirate/Space/Medieval/Monster/Food/Sports cosmetic collections, a Pirate season and Meteor Weekend (helmet/trail/victory reward variants). Candidate future rank labels were Bronze, Silver, Gold, Platinum, Diamond, Master and Champion; rank follows results rather than account level or spending. Achievement examples include first/10/100 wins, 1,000 games, 100 knockouts, surviving sudden death, an ability-free win and wins on every map. These are content ideas, not mandatory launch quantities.

Future systems: parties/friends, achievements, shop rotation, seasons, ranked after real data, admin tools and analytics. Admin operations include catalog scheduling, transaction review, controlled grants, bans, reports and event control with audit records.

Original proposed release envelope: one customizable body, three polished maps, Solo/Team/Chaos/Private experiences, 4–6 balanced abilities, 30–50 cosmetics, about 30 challenge templates and 50–100 levels. This is a planning envelope, not the slice gate; the later co-op/local proof precedes mature expansion.

Exclude initially: clans/guilds, trading/marketplaces, blockchain, user-generated maps, 100-player rounds, crafting, complex inventory/skill trees, stat equipment/pets, loot boxes and battle passes.
