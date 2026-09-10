# First-person item visibility

Milestone/criteria:M3 V01/V02 phone presentation support.
Date/tester/environment:2026-09-09,Codex,Windows in-app Chromium390x844,Node24.19.0.
Build/content:workingtree compatibility0.12.1. Retained change: first-person non-hat prop placement y1.2->1.4 and scale multiplier.48->.36. Item targeting/collision/camera direction unchanged. Temporary right-shoulder camera and raised-arm experiments both reverted to prior values. Temporary item-batch diagnostics removed.
Finding: centered third-person body occludes forward-held tool. Shoulder offset moved player too near phone edge without solving visibility. First-person model initially appeared absent, but batch transforms were valid and desktop1280view showed it. Phone itemHUD was covering most of it; this was not a failed renderer/batch.
Observed: raised, smaller first-person blaster shows tank/upper barrel above itemHUD while leaving centered target readable. Grip/lower barrel can still overlap panel; no claim of whole-weapon visibility.390px final screenshot inspected, browsererrors0. Third-person camera and existing arm pose remain unchanged; no improved third-person visibility claimed.
Checks: eight item-rendering/item-pose/item-aim tests passed; strict typecheck/build outcome below. No new test for a reversible presentation constant. Existing tests validate transforms/drop restoration/aim isolation; not a substitute for visual/device review.
Evidence: inline phone/desktop screenshots and task diagnostics. QA35closed/reset; main22lastready and4179session37497 unchanged.
Next: actual gameplay item use/third-person pose readability and remaining broader quality/device/audio gates. Goal active.

Final stricttypecheck/staticbuild passed,session78062exit0.
