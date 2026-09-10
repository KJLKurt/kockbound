# Keyboard camera turning and capture diagnosis

2026-09-09. M3 desktop control usability; compatibility0.12.3 unchanged. Node24.19.0, Windows, Chrome extension test tab268509952,974x903,local4179.
Previous turn: progress (retry correction and browser evidence).

Diagnosis: inspected dev-server response header construction; no pointer-lock sandbox/permissions policy is sent. Temporary request-rejection logging produced exact Chrome error: WrongDocumentError: The root document of this element is not valid for pointer lock. This narrows the observed automated failure to document validity; it does not prove why that document is invalid or what a manual foreground click will do. Diagnostic logging removed before final checks/build.

Behavior: first/third-person players may hold J to turn left or L to turn right at2.4radians/sec. Existing camera-relative movement/item aim follows that yaw. Both keys cancel; input is disabled in arena view/menus/death, and held turning clears on pause/blur. Normal mouse and touch aiming remains. Hint and Settings disclose keys.

Verification: ten camera/touch/item-aim tests pass, including frame-rate independence at30/60Hz, opposite keys, pause/blur and disabled-key cleanup. Initial run's sole failure was old hint wording assertion; corrected to semantic capture-failure assertion, final10pass. Final strict typecheck/build session43903 outcome follows.

Browser: twelve ordinary L presses visibly rotated third-person view; switched via Settings to first, twelve J presses visibly rotated first-person view. Screenshots inspected inline (not saved). Escape paused; returned home. Errors/warnings empty. Restored original third-person, Wisp/Classic and Mouse look off. No existing user tab controlled.

Limitations: continuous mouse capture and physical phone remain unverified. Keyboard/browser evidence does not establish subjective whole-game approval. Next remaining natural item/control/animation/audio/device review. Goal remains active.

FINAL: session43903 exited0, strict typecheck and static build passed. Isolated Chrome268509952 closed; no viewport override or active verification session. Source search confirms temporary diagnostic logging removed.
