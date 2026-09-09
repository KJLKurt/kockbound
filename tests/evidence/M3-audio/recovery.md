# Audio recovery evidence

Criteria: partial V06/C06. Date/tester: 2026-09-07, Codex, Windows, Node 24.19.0 and in-app Chromium. Revision: uncommitted 0.1.0. Scenario: initial audio fetch returns 503, ordinary repeated tap, explicit concurrent retries after recovery, then suspended-context resume.

Expected: gameplay remains independent, failed promises are replaceable, repeated taps are backed off, one decoded bank and three synchronized music sources remain after retry/resume. Observed controlled fixture: failed bank has zero buffers/sources; immediate ordinary retry makes no additional requests; successful concurrent retries produce 18 buffers, exactly three music starts and one replacement set of 18 requests; suspended resume makes no additional download or music start. This is a mock AudioContext lifecycle check, not audible browser output or real mobile interruption.

Commands: `node --test tests/audio.test.ts` (3 tests passed), strict TypeScript and static build passed. Actual LAN browser reload/click/Settings showed Sound ready and hid Retry sound after successful load. No failed-network browser fixture or hardware recording was performed. No screenshot file claimed.

Status: PARTIAL. Fixed the permanent failed-promise state, added explicit Retry sound and three-second automatic retry backoff. Still required: actual phone interruptions, Safari/Android unlock, headphones/speakers and mix review. Full goal active.
