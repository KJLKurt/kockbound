# Mouse capture retry and Chrome check

Milestone: M3 control usability. Date: 2026-09-09. Compatibility 0.12.3, no authority change.
Environment: Windows, Node 24.19.0; regular Chrome via browser extension, 974x903 viewport, local 4179.

Previous goal turn classification: progress (mouse-look implementation, targeted checks, build, and fallback browser evidence).

Observed: new isolated Chrome tab268509950 loaded the game. Existing user settings were third person, Wisp/Classic and Mouse look off. Temporarily enabled Mouse look for test. A click in the arena produced fallback in both attempts; actual pointer lock was not acquired under automation. No console warnings/errors were returned. Cause is not established; do not describe this as a successful continuous-look browser test or assume it proves manually clicked Chrome cannot capture. Escape paused the local game. Updated failure hint and Settings help visually inspected; screenshots inline, not saved. Restored Mouse look off and left appearance/camera unchanged. Existing user tabs were not controlled.

Reproduced defect: after an initial denied request, turning Mouse look off/on never reset lockFailed. Expanded existing test failed with expected true/actual false for retry. Fix: accessor resets failed state when enabled and releases existing capture when disabled. Denied capture now has explicit fallback hint, with retry instructions in Settings. Touch remains independent drag.

Checks: nine camera/touch/item-aim tests passed after fix, including retry success after denial and immediate release when disabled. Final typecheck/build session53285 outcome follows.

Limitations/next action: actual continuously captured mouse motion remains unverified. Continue camera/device and broader gameplay/presentation review. Phone connection unavailable as reported by user; no repeat connection request. Whole goal remains active.

FINAL: session53285 exited0; strict typecheck and static build passed after nine targeted tests. Isolated Chrome test tab268509950 closed, no viewport override used, saved Mouse look off restored. No running verification process remains.
