# Held-tool expiry precedes gameplay effects

Milestone/criteria: item lifetime contract and M2 authority parity.
Build/content: working tree, compatibility 0.12.3.
Date/tester/environment: 2026-09-09, Codex, Windows, Node 24.19.0.
Reproduction: Big mode expires at active tick 1 while a gust starts at tick 1. Before the fix its impulse was 0.090970 rather than normal 0.163746 after damping; the regression failed on the player's resulting position and impulse.
Change: clear expired ordinary held tools immediately after the active tick advances, before hazards/items/movement. Bombs and pods retain explicit explosion/arming expiry handlers. This also makes the empty slot eligible for ordinary pickup that tick. No duration, strength or cosmetic changes.
Verification: initial 28 item/hazard/pod/tile/authority checks passed, strict typecheck and static build passed (83150 exit 0). Added explicit expiry-tick shovel reach and hat rescue checks; final items rerun 10/10 passed. Existing live-duration tests retain shovel/hat benefits before expiry. No fresh full-suite or browser transport claim for this increment.
Visual/audio: no new assets or rendering behavior; current presentation reads authoritative held state. No physical-device or listening approval inferred.
Preview: old 4179 session 12168 stopped; new session 71369 started successfully with 0.12.3. Existing open clients require refresh. No user Chrome interaction.
Evidence: reproduced failure and passing terminal output in task; no screenshot required for simulation boundary change.
Next: remaining natural gameplay, presentation, audio and phone checks. Goal active.
