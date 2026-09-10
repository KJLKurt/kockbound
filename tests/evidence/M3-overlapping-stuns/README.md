# Overlapping stun recovery

Date:2026-09-09. M3 gameplay reliability. Windows, pinned Node24.19.0. Current compatibility0.12.4.
Previous goal turn: progress (keyboard turning implementation, actual Chrome first/third checks, tests/build).

Defect reproduced: a bomb blast at active tick1 replaced an existing stun ending at30 with13, allowing early recovery. Spring pods shared the same assignment. Regression failed with actual13/expected30.

Fix: blast stun end is max(existingEnd, blastEnd), consistent with rolling/sky rocks. Durations do not add. Push, vulnerability and attribution remain intact. Shared pure simulation serves local and online authority; all three compatibility constants bumped0.12.4 to reject stale room clients.

Checks:30 items/ranged/pods/hazards/authority tests passed, including both bomb/pod and shorter/longer previous stuns plus cloned deterministic replay. Strict typecheck and build session3898 exited0. Real browser OnlineSession adapter completed a round over WebSockets (8.18s,1testpass). No visual asset or audio change; no new subjective approval claimed.

Preview: prior confirmed-live4179session71369 stopped for updated authority. Replacement startup recorded below. Existing clients need reload.
Next: remaining natural gameplay, presentation, audio/device verification. Whole goal remains active; physical phone remains unavailable per user.

FINAL preview: new4179multiplayer session82106 started successfully. HTTP200 shared/content/arena.ts contains knockbound-sim-0.12.4. No build/test process pending. Main user browser tabs were not refreshed or controlled.
