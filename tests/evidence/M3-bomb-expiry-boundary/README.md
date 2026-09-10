# Bomb expiry beats late actions

Milestone/criteria:item contract, M2 authority validation/local parity support.
Date/tester/environment:2026-09-09,Codex,Windows,Node24.19.0.
Build/content:workingtree compatibility0.12.2 for changed authoritative behavior.
Reproduction: held bomb expiresAt1, accepted Toss on activeTick1 previously spawned a thrown bomb expiring20ticks later. Regression initially failed with groundlength1 instead of0. Drop could also relocate the expiry blast by.65m.
Fix: held-item drop/throw branch requires activeTick<expiresAt. Expiry tick therefore reaches normal held expiry handling, bursts at holder position and stuns. Just-before-expiry toss remains allowed with intended20tick flight fuse. Ranged/remover already have expiry guards; pods retain explicit automatic arming-on-expiry behavior.
Checks:20items/pods/authority tests passed, including new exact-expiry toss/drop and just-in-time throw cases, deterministic replay and local authority parity. Real WebSocket browser OnlineSession round passed separately(15.37s). Strict typecheck and distbuild passed(session30610exit0); adapter17640exit0. No freshfullsuite claimed.
Visual/audio: no asset/animation/UI change, existing blast rendering reused; no new visual/listening approval.
Preview: old4179session37497stopped, new12168started successfully first attempt at4179. This also loads previous journal constructor fix. Existing open clients need refresh for compatibility0.12.2; no automatic userChrome reload.
Evidence: failingthenpassing terminaloutputs in task; no screenshot. Next remaining naturalinteraction/presentation/device/audio checks. Goal active.
