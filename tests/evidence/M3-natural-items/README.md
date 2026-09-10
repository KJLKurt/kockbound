# Ordinary pickup / fire / drop walkthrough

2026-09-10. M3/M4 item usability evidence. Current compatibility0.12.5. Windows, Chrome via isolated Playwright CLI0.1.19 with Node24.19.0;390x844viewport. Normal solo+3bots, Sprout/Classic/fullarena, blaster only and hazards off via actual Settings controls. No world/seed/input/held-item injection. Real held keyboard movement and visible action buttons; Escape pause between actions for inspection. This is not an uninterrupted human playtest or physical touch-device pass.

Previous goal turn: progress (packaged transfer/heap measurements).

Observed screenshots (../../.. relative paths below):
- [First ground pickup](../../../output/playwright/first-pickup.png): first scheduled blaster on arena.
- [Approach](../../../output/playwright/approach-pickup.png): held W/D movement reaches guidance radius; walk-closer cue visible.
- [Automatic pickup](../../../output/playwright/picked-up.png): no pickup button used;5shots,19.9s,held prop and Fire/Drop panel.
- [Fire](../../../output/playwright/fired.png): ordinary aim movement then visible Fire click;4shots,19.4s,0.3s cooldown and visible projectile.
- [Drop](../../../output/playwright/dropped.png): visible Drop click; item HUD hidden during active play.
- [Reacquisition attempt](../../../output/playwright/repicked.png): after1.1s and nearby bot contact, HUD remains hidden. Stale hidden status text is not reacquisition evidence. That step is NOT VERIFIED; preservation remains covered by authority tests, not this walkthrough.

Browser console:0messages/errors/warnings. CLI action scripts and PNGs under output/playwright. Temporary origin64353 separates settings from user's main preview. No production game code changed.

Tool limitations/setup: initial CUA rapid taps/drags did not establish sustained movement; no success claimed from them. Playwright skill applied. Installed npx was outside PATH/normal executable permission; approved execution used it. No-install CLI probe ended canceled (no cached package). Official npm metadata returned0.1.19; that exact CLI was acquired. Launcher initially used systemNode18.15.0 and failed; pinnedNode24.19.0 PATH corrected it. One help invocation printed an exit assertion; subsequent commands succeeded. Current CLI run-code requires a function and supports --filename; file-based commands avoided Windows quoting issues. This was an isolated browser profile, not user's Chrome profile. No auto-review rejection occurred.

Cleanup: initial in-app39 closed and viewport reset. Final isolated CLI session and temporary server28857 closed below; main4179/session60040 and retained in-app37 untouched. Whole goal remains active; remaining reacquisition/natural controls, precise art/audio and physical device gates are not silently passed.
