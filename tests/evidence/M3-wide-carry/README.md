# Acceptance evidence

2026-09-10, M3 held-tool silhouette review. Windows headed Chrome, isolated CLI0.1.19, QA4181 synthetic Sprout left-strafe blaster fixture,929x917 and390x844. Compatibility0.12.6 unchanged.

Experiment: wider carry direction, upper arm outward1 + forward.2 + down.3; forearm forward1 + outward.7 + up.15. Tool retained actual hand socket and existing aim. This differs from the earlier small outward elbow candidate. Expected: recognizable blaster beside the head in third person.

Observed: desktop capture still largely hides the tool behind head/ear geometry. Wider arm exposes more hand without a clear blaster silhouette. Phone capture also has the QA header covering its upper portion, so it cannot certify full phone presentation. Candidate REJECTED and exact original ItemPose directions restored. No production improvement or new build claimed.

Inspected screenshots: output/playwright/wide-carry-desktop.png and wide-carry-phone.png; baseline review-sprout-left.png. Script: output/playwright/wide-carry.js. Initial selector wait failed because the review details were collapsed and the early button click preceded loaded fixture state; loaded snapshot inspected, details opened, capture succeeded. Console after reload: zero errors/warnings. Initial open had one error; no claim about its cause made here.

Verification: exported-rig restore regression run after revert; final outcome below. Main4179 and QA4181 servers untouched; isolated browser closed after review. Previous goal turn: progress via real-room host-selection coverage. This experiment narrows the next approach: do not repeat modest or wide arm-only offsets; address camera/head overlap or a deliberately revised tool carry design with useful phone framing. Goal remains active.

Final regression: all four exported rigs pass restoration/finite transforms over180frames each (1 test,7.25s total), after exact revert.
