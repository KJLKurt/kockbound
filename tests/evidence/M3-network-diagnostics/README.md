# Acceptance evidence

Date: 2026-09-10. Criteria: N01/N04 browser continuity diagnosis. Compatibility: 0.12.6 unchanged. Environment: pinned Node24.19.0, Windows headed Chrome, cached Playwright CLI0.1.19, four pages in one isolated context, loopback4185.

Change: optional LocalRoomTransport diagnostic callback records socket open, errors, requested close and observed close with room/participant/connection identifiers. Tickets and message payloads are omitted. `node tools/dev-server.mjs 4185 --multiplayer --network-qa` enables console JSON and a separate `.knockbound/network-qa-journal`. Normal preview behavior and admission limits are unchanged.

Expected: reproduce the earlier two-peer rejection and capture its close reason. Observed: NOT REPRODUCED. All four normal forms joined room248497; all four pages reached the same76second draw, zero hits/ring-outs, timer0:14. Server logged four opens, no socket errors, then all four closed with1000 / “Room ended”. This successful round does not establish the cause or fix the earlier room7D6DF5 failure. Players were idle; no crate collection or physical-device result is claimed.

Checks: five transport tests passed (98.38s), including ten four-client rounds, malformed/binary/oversize rejection, restart, replacement and the real OnlineSession adapter. Strict typecheck passed before the final close-request logging addition; final targeted/typecheck results recorded below. No build needed for these development-server diagnostics.

Artifacts: `output/playwright/network-prepare.js`, `network-start.js`, `room-status.js`; screenshot `output/playwright/network-room-start.png` captured, not visually reviewed in this increment. Verification of all four outcomes comes from visible body text and server logs. The reused start script overwrote `crate-room-start.png` from the prior experiment; that older screenshot is no longer valid evidence. Prior structured peer-status observations remain intact.

Cleanup: isolated Chrome session closed; diagnostic server45207 stopped. Main4179/session35734 untouched. Next: use logging if the rejection recurs, and continue remaining normal item and presentation quality work without weakening validation based on an unconfirmed hypothesis.

Final checks: strict typecheck59136 passed after close-request logging; targeted transport rejection test passed (1/1,2.05s) on final source. The earlier five-test run preceded only that logging addition.
