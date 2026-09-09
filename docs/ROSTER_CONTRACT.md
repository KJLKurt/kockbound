# Expanded roster and palettes

Version 0.9.0 registers Sprout, Lumi, Pebble and Wisp as cosmetic identities and Classic/Sunset/Mint/Violet skin keys. Participant.skin is optional (Classic fallback), validated against the registry and matched to roster snapshots. All four identities share the existing rest rig and simulation collider; palette selection never reaches mass, speed or hit rules. The local picker persists identity and palette across reload and replay. Online rosters now include new characters by seat, but transmitting the user's chosen identity/palette in room creation/join remains next work; do not claim online cosmetic selection is complete.

Separate editable Pebble/Wisp sources are derived from saved Sprout animation modules by build_roster.py, preserving masters. Pebble has round ears, muzzle/nose and short tail; Wisp has antennae/tips and chest charm. Ten inherited animations, 34 joints, two primitives. Pebble 10,243 triangles/570,420 bytes; Wisp 10,167 triangles/566,824 bytes. Original source geometry; no external assets. Shared bind rig and clip list verified against Sprout. Reproducible source/export metadata retained in runtime asset.json.

Palettes recolor cool accent vertices in cloned per-avatar geometry, preserving warm cream, dark outlines and highlights. Geometry is disposed when the avatar population is replaced; original shared geometry is never mutated. Initial palette mapping can also shift cool body/eye accents as a coherent theme. Additional outfit geometry is not claimed.

Concepts: ROSTER_CONCEPTS.md. Evidence: tests/evidence/M3-roster, M3-roster-pebble and M3-roster-wisp. Remaining: online selected cosmetics, more animation pose/deformation review, real phone/performance, audio listening and human playability approval.
