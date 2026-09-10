# Acceptance evidence

2026-09-10, M3 crate interaction pipeline. Windows headed Chrome, pinned Node24.19.0, CLI0.1.19, QA4181. Compatibility0.12.6 unchanged. Scope: controlled fixture with actual KeyboardInput, ordinary20Hz simulation, rendered item HUD; not random-spawn natural play or physical touch.

Added QA-only Crate control practice button. It reuses the existing crate fixture with an empty-handed player1.3m from the box, enables the production KeyboardInput class, and advances ordinary ticks with its sampled inputs. Other players remain idle. WASD/Space/E/Q control move/dash/use/drop; Escape toggles pause and clears input. Clicking the practice button resets. Item HUD buttons queue ordinary use/drop edges. Continuous rendering/interpolation, pause state and explicit instructions/report are included. Existing scripted Dash into crate fixture remains separate.

Observed desktop result: actual D+Space opened the crate and auto-collected a blaster; visible HUD showed5shots/19.5seconds. Actual E reduced this to4shots/18.9seconds; actual Q hid the item HUD. Phone-sized390x844 repeat likewise showed5shots after opening/collection. Header hidden via DOM styling for the phone capture only, to uncover the arena. No browser game-state injection; fixture placement is explicit QA source. Inspected collected desktop and phone screenshots; fired screenshot captured, its4shot result verified by visible DOM text. Final console0errors/0warnings.

Artifacts: output/playwright/crate-controls.js, crate-controls-phone.js; crate-controls-collected.png, crate-controls-fired.png, crate-controls-phone.png. These are controlled keyboard tests, not a user playtest, music review, normal bot round or phone touch result. Pending user crate question remains open; do not duplicate it.

Checks: final strict typecheck below. No production behavior change, new package dependency or static build required; QA served from source only. Prior full104 remains the game regression baseline. Previous turn added limited normal-play evidence and ruled out further repeated random opening attempts; this turn establishes the input-to-crate-to-HUD path and a reusable controlled fixture. Next remaining natural play/balance and device/presentation checks. Main4179 unchanged.


Final strict typecheck70388 passed (exit0) on the updated fixture.
Cleanup confirmed: isolated browser23803 closed successfully. Main4179 and QA4181 remain untouched.
