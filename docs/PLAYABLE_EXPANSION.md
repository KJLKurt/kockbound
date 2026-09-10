# Current user expansion requirements — 2026-09-08

This is active implementation scope from the updated goal, not historical suggestions. Preserve phone play, intentional characters/world/music/SFX and responsive gameplay. Individual implementation defaults below are reversible; completion requires working features and appropriate evidence, not this checklist alone.

1. Camera: host/single-player settings for first person, third person and full arena view. Phone controls and aiming must remain natural in each view. Record whether online camera choice is host-enforced or each player's preference; do not silently omit host control.
2. Items: host/solo master toggle plus per-item toggles; authoritative random spawning, one held item maximum, use and drop controls, finite shots or duration, clear pickup and expiry. Default proposal: proximity pickup into an empty slot; explicit drop with a short repickup grace period. Unclaimed items blink before disappearing. Bots use ordinary item inputs and rules.
3. Bomb: pick up quickly, toss, explode one second after toss; blast pushes and briefly stuns. Unclaimed live bombs also become a threat after a readable fuse. Telegraph blast area/fuse and distinguish them from inert pickups.
4. Shovel: wider pushing area while held, finite useful lifetime.
5. Big mode: temporary visibly larger character and greater resistance to knockback. This is authoritative item state, never a cosmetic stat benefit.
6. Blaster: multiple weak ranged pushing shots, each weaker than normal dash push. Choose playful water/snow visual treatment.
7. Wind blaster: one powerful board-length shot; strength decreases with distance to a minimum around ordinary dash impulse.
8. Rolling rock: moves from player across arena, pushes/briefly flattens-stuns characters along its path.
9. Helicopter hat: consumes itself to rescue a holder who falls, returning them safely to supported platform once.
10. Mystery crate: dash to open and reveal a configured item; not an automatic known-item pickup.
11. Platform remover: telegraph a selected area before removing support so occupants can fall.
12. Additional interactive danger: add a small coherent extension of the bomb-style risk/reward interaction after the named items work; do not substitute it for a named requirement.
13. Hazards: host/solo master and independent toggles for warned falling tiles, falling rocks with red landing circles and brief flatten/stun/push, and directional wind gusts. Extra hazards are discretionary after these named features work.
14. Shrink: replace uniform mesh scaling with highlighted outer tile blocks that fall away progressively. Authoritative support and visible disappearing tiles must agree. Warning precedes removal; interior tile hazards/remover use the same support contract.
15. Characters: add more selectable characters plus distinct skins/colors for current characters. Preserve a shared skeleton/export provenance and competitive collider fairness. Color-only variants do not by themselves satisfy additional-character scope.

Implement in coherent, verified increments: finish interruption recovery; camera/control presentation; shared typed settings/items/hazards/support contracts and simulation tests; pickups/use/drop + initial items end to end; complete named catalog/hazards/tiled shrink; additional character and skin selection; phone, local/online parity, visual/audio/playability review. Register capabilities as data-selected content, never arbitrary executable configuration. Existing deployment/commerce restrictions remain; this request does not require purchases or a public deployment.

All items above are currently **pending** as of creation. Existing full-arena camera, two characters, uniform radial shrink and touch controls are baseline functionality, not completion of the expansion. Keep progress/evidence in STATUS and relevant acceptance records.

Progress 2026-09-08: requirement 1 now has implemented three-view personal Settings selection (D42), tested locally at phone dimensions; real-device and online camera QA remains. Other numbered expansion features remain pending.

Progress 2026-09-08: shared item controls/settings and first bomb are playable (ITEM_CONTRACT.md, M4-bomb evidence); 48 tests passed. Requirements 2/3 have initial implementation with remaining interaction/phone/balance QA. All other catalog/hazard/tile/character requirements remain pending.

Progress 2026-09-08: shovel/big/helicopter and blaster/wind/rolling rock now implemented in shared authority, version 0.4.0, with seven independent saved selections. See M4-passive-items and M4-ranged evidence; latest 55 tests pass. Crate/remover/additional danger, hazards/tile shrink and additional characters/colors remain required. Human interaction, physical-phone and presentation/audio gates remain open.

Progress 2026-09-08: requirement 11 remover and 14 falling outside blocks now share authoritative tile support, version 0.5.0. Eight items; final 59 tests pass. See M4-tiles evidence for inspected fixtures and limits. Optional hazard system, mystery crate, extra danger and additional character/color choices still required.

Progress 2026-09-08: requirement 10 mystery crate implemented in 0.6.0 with enabled-item-only reveal; 61 tests and controlled browser dash/pickup pass. Requirement 12 additional danger, 13 optional hazards and 15 additional characters/colors remain unimplemented, alongside final phone/presentation/feel gates.

Progress 2026-09-08: requirement 13 optional hazards implemented in 0.7.0, all three independently selectable plus master, 64 tests and warning/settings browser evidence. Requirement 12 extra interactive danger and 15 additional characters/colors remain unimplemented. Final physical-phone, audio/presentation and human playability checks remain required.

Progress 2026-09-08: requirement 12 additional danger now implemented as Spring pod (0.8.0), 67 tests and corrected phone fixture. All requested item/hazard types and cameras/tile shrink have initial implementations. Requirement 15 additional character identities plus skins/colors remains unimplemented; full physical-phone, human playability and presentation/audio evidence remains incomplete. Do not mark the goal complete from catalog presence alone.

Progress 2026-09-08: requirement 15 now has two additional geometric identities (Pebble/Wisp) plus four local palettes, 0.9.0 and 69 tests. Online selected cosmetics remain next; final hardware/human/presentation evidence remains incomplete.

Progress 2026-09-09: selected character/palette now propagates for online host/guest in 0.10.0. Full 71 tests and a two-browser matching result pass. All numbered capabilities have implementations; full quality acceptance still requires audit, broad playability/presentation checks, real-device performance and audio listening evidence.

Progress 2026-09-09: camera-directed item input fixed in 0.11.0 with independent validated aim, 76 tests and stationary drag/fire browser evidence. Full natural phone/presentation/audio acceptance remains incomplete.
