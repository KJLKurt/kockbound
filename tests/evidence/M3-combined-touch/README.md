# Combined movement, aim and actions

Environment: 2026-09-09, Codex, Windows, pinned Node 24.19.0. Partial C06 control evidence; no browser pointer synthesis or physical-device pass.

Scenario: real TouchControls, CameraLook, KeyboardInput and cameraRelative together, driven by independent pointer IDs on EventTarget surfaces with capture tracking. Hold full strafe on the movement pad, drag the other finger through 90 degrees, then sample simultaneous dash/use edges. Expected and observed: bounded camera-relative strafe remains perpendicular to item aim; actions occur on one sample; movement continues afterward. Cancel the camera finger: movement capture remains, camera capture clears and subsequent orphan movement is ignored. Resize clears both captures/movement. Disabling controls and clearing input releases both fingers and pending use.

Checks: `node --test tests/touch.test.ts tests/camera.test.ts` passed all four tests (584 ms); strict TypeScript check exited 0. This is integration evidence for independent pointer ownership and command composition, not proof of browser capture delivery, hardware ergonomics or simultaneous authoritative dash/item effects. No runtime behavior changed. Existing physical-phone limitation remains; next work is visual moving/grip animation and ordinary item navigation.
