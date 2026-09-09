# Phone controls and responsive play

Milestone/criteria: current M3 phone priority (D38), partial C06/V02/V03/V04/V06. Build: uncommitted 0.1.0, same simulation/content release. Date/tester: 2026-09-07, Codex, Windows, Node 24.19.0 / TypeScript 5.9.3 / Three.js 0.180.0. In-app Chromium viewport overrides: 390×844 portrait, 844×390 landscape, 320×568 compact portrait. These are desktop browser sizes, not physical phone emulation or Safari evidence.

Implemented: analog radial joystick and independent large dash target using ordinary shared inputs; 14% dead zone; exclusive joystick pointer ownership; release/cancel/lost capture/resize/blur/hidden neutralization; remembered dash direction; safe-area thumb placement; compact HUD and portrait/landscape lobby layouts; scrollable constrained modals; low-quality default for coarse pointers. Retained desktop controls and saved quality overrides.

Expected: launch, move, dash, outcome/replay controls remain usable at phone dimensions. Observed: 390×844 lobby/play/joystick drag/dash cooldown (1.0 s) and a complete 63-second round with Pip winner. The browser pointer action exercises pointer events but does not establish real simultaneous two-finger input. Landscape lobby/countdown/gameplay reviewed with both controls visible. Compact portrait lobby/settings reviewed; Sound ready reported after click. Settings scrolling reaches overflowed content. No actual hardware audio listening is claimed.

Visual fixes from review: corrected distance-dependent fog that washed out portrait gameplay, brought arena closer, initialized camera without a giant-character first-frame view, fixed grid modal width that clipped the right side, shortened compact portrait heading/removed overlapping intro. Inline screenshots were visually inspected in the task; no saved screenshot or recording file is claimed.

Checks actually run: strict typecheck; static build; four targeted input/effect/server tests; full Node suite **42 tests, 42 passed, 66.901 s**. Touch tests cover analog bounds, dead zone, retained direction, one-shot dash, second-finger ownership, cancellation, rotation and disabled input. Existing determinism/network/audio checks remain green. Live Cloudflare emulator tests are excluded from this count and remain unverified.

Phone access: `pnpm dev:phone` binds explicit solo-only LAN preview to 0.0.0.0:4183; current adapter URL http://192.168.12.250:4183. Computer HTTP GET through that LAN address returned 200. No firewall setting or public deployment changed. Actual phone reachability is NOT yet verified.

Status: PARTIAL. Required next evidence: real iPhone/Safari and/or Android/Chrome, simultaneous move/dash, interrupted touches, orientation/safe areas, headphone/speaker unlock/mix, sustained three-minute phone frame measurement and cold-load cost. Phone performance and C06/V06 gates are not passed by desktop viewport review. Full user goal remains active.
