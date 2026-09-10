# Desktop mouse look

Date/environment: 2026-09-09, Windows, Node 24.19.0, in-app browser 639x642.
Scope: M3 control usability; user reported desktop first/third-person turning awkward. User said other aspects seem good from what they can tell; this is not complete device/audio acceptance.

Changed behavior: saved Mouse look setting defaults on. In close cameras, a mouse click requests pointer lock; relative mouse motion turns continuously without holding a button. Movement and item aim remain camera-relative. Escape/browser unlock pauses, and pause/blur/resize/end releases capture. Touch keeps independent drag aiming. Disabled or denied mouse lock keeps dragging and updates the hint. No simulation/protocol changes (0.12.3).

Checks: 9 camera/touch/item-aim tests passed, including continuous motion, pause release, browser denial fallback and touch exclusion. Initial parameter-property syntax was incompatible with Node stripping and corrected to an explicit field. A mock-document typing error was corrected. Browser exposed setPointerCapture InvalidStateError during a lock transition; capture now tolerates this while retaining canvas drag.

Visual/browser: setting and explanation inspected at 639x642. Embedded browser denied lock; corrected fallback drag changed the camera and displayed the drag hint. Screenshot inspected inline, not saved to disk. Actual continuous capture in a regular browser remains unverified. Do not claim embedded denial establishes Chrome behavior.

Full regression before this camera change: 93/93 passed in 174.509 seconds, including ten four-peer WebSocket rounds; ../M3-expiry-integration/full-tests.txt. This predates the new camera test and is not a fresh 94-test result.

Final typecheck/build and final browser error check: pending below.
Next: regular-browser mouse-look feel, remaining natural gameplay/presentation checks; physical phone is currently unavailable, no connection retry requested.

Final strict typecheck passed (session85247). Corrected browser reload produced no newer error entries; log retained only the initial 04:36:21 UTC capture error. Fallback camera drag inspected, ordinary 63-second round completed with Clover winner, returned home. Main in-app tab36 retained ready; user Chrome tabs untouched. Build outcome follows.

Added document-level pointer release after capture failure, so releasing outside the canvas cannot leave drag aiming stuck. Expanded the same regression to force a capture exception and verify release stops rotation; all nine targeted checks rerun successfully. Final verification session99824 follows.

FINAL: session99824 exited 0: nine targeted tests, strict typecheck and static build all passed with the document-release fix included. Main tab36 refreshed to latest client, lobby ready. No further running build/test sessions.
