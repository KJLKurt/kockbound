# Direct desktop mouse capture

2026-09-10. M3 desktop camera usability, current0.12.5. Windows, isolated headed Chrome via pinned PlaywrightCLI0.1.19/Node24.19.0. Screenshot viewport929x917. Normal game4179, no simulation mutation. Previous goal turn: progress (ordinary item controls and screenshots).

Verified in third and first person via actual Settings, Play, mouse and Escape input. Mouse click completed down/up; subsequent mouse movement used no held button. DOM pointerLockElement.id was game in each view. Before/after screenshots visibly show rotation while characters remain at countdown positions, avoiding ambiguity from movement/knockback. Escape yielded pointerLockElement null and visible Back to the action in both cases. Browser console reported0errors/warnings.

Screenshots:
- [Third before](../../../output/playwright/mouse-before.png)
- [Third after](../../../output/playwright/mouse-after.png)
- [First before](../../../output/playwright/first-mouse-before.png)
- [First after](../../../output/playwright/first-mouse-after.png)

This positively verifies direct Chrome capture and ordinary release, superseding the prior unverified status for this environment. Earlier CUA automated document returned WrongDocumentError; do not generalize that to direct Chrome or claim its exact internal cause is diagnosed. Physical-device touch and subjective camera comfort remain separate. User's actual Chrome profile/settings were not used. No production code change or rebuild required.

The isolated browser session was closed after inspection; main4179/session60040 and in-app37 lobby unaffected. No verification process pending. Goal active; continue remaining natural controls/poses/audio/device checks.
