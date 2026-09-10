# Reachable item spawns

2026-09-09. M3 gameplay reliability. Windows, Node24.19.0, compatibility0.12.5.
Previous goal turn: progress (overlapping stun fix, checks and updated authority).

Reproduction: fixed-seed match with all outer tiles fallen lost its scheduled pickup in the spawning tick (ground length0 instead of1). Previous position sampler ignored holes/warnings; cleanup deleted unsupported item immediately.

Fix:16 bounded seeded position attempts; accept only intact, unmarked tiles outside obstacle footprints with0.5m clearance. Fallback scans tile centers inside the same radius-minus2 spawn disk, core first. If every candidate is blocked, skip until next scheduled attempt. Item selection, cadence, inventory rules and timers remain. Shared pure authority and all compatibility constants updated0.12.5.

Checks:27 items/tiles/crates/authority checks passed. Added explicit bounded fallback/all-ground-obstructed case; final13 items tests passed. Test obstacle initially lacked required id, corrected; strict typecheck and transport final outcome below. Static build19789 exited0 (game source unchanged by subsequent test-only correction). Tests cover fallen and warned outer tiles, deterministic cloned replay, safe core fallback and no infinite retry with no valid space.

No asset/audio change and no new visual quality approval. Real-device and natural-play quality gates remain open; phone currently unavailable per user.

FINAL: corrected strict typecheck and actual WebSocketbrowseradapter round passed(session13621,20.36s). Oldconfirmed-live4179session82106 stopped, replacement60040 successfullystarted, HTTP200 source0.12.5 verified. No running checks/build. Existing browserclients need refresh; usertabs untouched.
