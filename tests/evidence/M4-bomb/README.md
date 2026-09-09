# First optional item: Cloud bomb

Scope: expansion requirements 2/3, partial C02/C06 and presentation. Date/tester: 2026-09-08, Codex, Windows, Node 24.19.0, Three.js 0.180.0, in-app Chromium. Simulation/protocol/content 0.2.0. Contract: docs/ITEM_CONTRACT.md.

Implemented: registered/validated selection, saved solo/host master and bomb toggle, seeded spawn, one slot proximity pickup, use/drop input edges, fuse-preserving drop grace, one-second thrown bomb, blast push/stun/credit, ordinary-input bots, snapshot validation and no speculative item effects. Node transport and Worker source accept item settings; Worker native runtime remains unverified. Blue/gold pickup, held orb, fuse blink, danger area, event SFX and phone/keyboard controls integrated.

Tests: three item tests cover proximity slot/drop/fuse/other-player pickup, throw timing/stun/push/no flight pickup, held expiry, disabled items, seeded replay and invalid room options. Nineteen targeted item/authority/client checks passed. Eighteen simulation/transport/Worker-contract checks passed, including actual OnlineSession with bomb-enabled room and observed spawned items through real WebSockets. Full suite: **48 tests, 48 passed, 102.016 s**, saved in full-tests.txt. No live Worker test is included in that count. Baseline 20 seeded results unchanged; replay hash changed with version strings to ce151fdfbb87834abd3e6a82d5a03fda85ca6640f5556b013189d787bf6fed81.

Browser observations: enabled solo rounds reached both defeat and victory screens (observed 12- and 16-second outcomes); no errors in queried browser log. Synthetic bomb warning/held item fixture reviewed at 390×844. Initial warning ring was too faint; increased outline opacity, added translucent area, enlarged orb and preserved static warnings under reduced motion. Corrected fixture visually inspected inline. No saved screenshot file or physical phone claim.

Limits: actual human-controlled pickup→drop→repick→toss has not yet been demonstrated in browser; unit/transport tests prove mechanics but not subjective feel. Short observed rounds suggest balance needs broader review. Bomb SFX reuse the original bank and require listening. Other named items/hazards/tiled shrink/characters remain pending. Status: playable first item, further QA and full catalog required. Full goal active.

Final warning/size/reduced-motion and pickup-toast edits passed strict typecheck and static build. Node room preview restarted deliberately for latest 0.2.0 authority, session 8587 / port 4179; solo LAN preview remains session 14345 / port 4183.
