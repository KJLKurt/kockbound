# Camera view increment

Scope: expansion requirement 1, partial phone control/visual acceptance. Date/tester: 2026-09-08, Codex, Windows in-app Chromium, 390×844 viewport, local solo LAN preview. Uncommitted build; no simulation/protocol change.

Implemented: persisted Settings selector for full arena / third person / first person, following owned participant; camera-relative analog/key movement preserves sequence/dash; drag look yaw and bounded pitch; first-person own model hidden; behind-camera labels suppressed; elimination/results return to overview. CameraLook releases capture on disable, resize, blur and matching pointer cancellation. D42 treats host camera as that player's preference, not a rule forced on guests.

Observed: third-person countdown and gameplay screenshot reviewed; pointer look drag; switched to first person mid-round through paused Settings; first-person scene and opponents reviewed; complete 63-second round with Pip winner; reload Settings preserved First person. Inline screenshots only. This is desktop pointer/viewport evidence, not physical simultaneous touch or subjective human feel.

Checks: three camera/touch tests passed, strict TypeScript passed. Rotation test covers forward at quarter-turn, analog magnitude through many angles, and unchanged participant/sequence/dash metadata. Existing simulation remains unchanged. No complete camera-specific online room playtest performed.

Status: implemented local views, further device/online QA pending. Next shared item/hazard/tile systems and complete named expansion. Full game goal active.

First final build attempt hit an EBUSY lock while writing an unused Three addon; retry pending. Browser warning/error log was empty. Restored Full arena and reset temporary viewport after review.


The build retry completed successfully (exit 0). No file deletion or permission change was needed.
