# Acceptance evidence

Milestone and criterion IDs: N01/N04 normal-browser room follow-up; intended natural crate walkthrough.
Build/revision and content release: current0.12.6, after projectile presentation change.
Date, tester and environment:2026-09-10, agent, Windows isolated headed Chrome, four pages in one CLI-owned context; Node24.19.0, cached PlaywrightCLI0.1.19.
Runtime/browser/device, viewport and network profile: localhost4179,929x917 host. Normal UI only, no world-state injection. Host selects four human seats, crate+blaster and no optional hazards; other seats idle.
Expected outcome: all four pages join/stay connected, enabling uncontested crate approach/open/collection.
Observed outcome: preparation created four loaded pages. First roomBDB1AC was delayed by a script ReferenceError (URL unavailable in CLI sandbox) and peer Join locator timeouts, then visibly cancelled by the120second readiness limit. It was not restarted merely because a tool timed out. With already-loaded pages and normal forms, fresh room7D6DF5 started. Host screenshot at1:18 showed only two standing. Final peer DOM text showed p3/p4 at countdown1 with “The room rejected the connection. Please rejoin.” Host and p2 reached the same visible draw at76seconds,0hits/0ring-outs; host timer0:14. This establishes a four-page browser connection failure, not its exact cause. The first two spawned items were blasters; successful crate collection was not observed.
Status: FAIL for all-four-browser continuity; NOT VERIFIED for crate collection. No production fix made in this increment.
Commands actually run: cached CLI open, crate-room-prepare.js, crate-room-start.js (URL ReferenceError), crate-room-join.js (Join timeout), room-status.js, crate-room-retry.js, crate-room-center.js and room-status.js again. Inspected source close paths and server limits. No runtime tests/build rerun for an unchanged game.
Screenshot/recording/log paths:

- Original started-room screenshot was inadvertently overwritten during M3-network-diagnostics; do not use current crate-room-start.png as evidence of this failure. Structured peer observations below remain valid.
- Host final capture: output/playwright/crate-room-center.png; DOM result also reported round complete.
- Structured observations: [peer-status.json](peer-status.json).

Tooling: read cached @playwright/cli package.json and verified version0.1.19/bin playwright-cli.js. Added machine-local output/playwright/Invoke-CachedCLI.ps1 calling that entry with pinned Node. Browser calls still took substantial time; no measured speed improvement claimed. Existing npx wrapper preserved.
Performance measurement method and sample: none. This is not four-device or phone evidence.
Limitations and next action: client's generic rejection branch covers1002/1003/1008/1009; the precise code/reason and preceding reconnect sequence were not captured. Do not conclude a backpressure, admission, timer-throttling or renderer cause from the message alone. Next collect exact close evidence for the failing background peers before changing limits or retry rules. Keep existing authoritative validation. Main4179/session35734 and user browser profile unchanged. Current room finished; isolated browser cleanup follows console collection.

Previous goal turn classification: progress via retained projectile interpolation and integration evidence. This turn produces actionable real-browser failure evidence, so goal remains active rather than complete or blocked.

Final host console: zero errors/warnings. This does not describe the rejected peers' console or socket-close code.
