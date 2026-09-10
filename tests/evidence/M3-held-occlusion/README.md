# Acceptance evidence

Date2026-09-10. M3 V01/V02 visibility support. Windows headed Chrome, isolated CLI0.1.19, QA4181,929x917 and390x844. Compatibility0.12.6 unchanged.

Retained change: a translucent cyan silhouette reveals occluded parts of the local player's directed held tool in third-person view. Instanced copies use GreaterDepth, opacity.28 and no depth write, rendered after ordinary opaque geometry. Only explicit held poses request the cue. First person, arena view, other players, dropped items and passive items do not request it. Original material, camera, aim, socket placement and authoritative state remain unchanged. This is a visibility aid, not a complete hand-contact redesign. GreaterDepth can also reveal occluded parts within the tool itself and behind other foreground opaque geometry; it is not a character-only mask.

Inspected screenshots in output/playwright: occluded-tool-desktop.png, occluded-tool-phone.png (Sprout strafing/blaster); occluded-wisp-wind.png and occluded-wisp-drop.png (Wisp backward/wind/drop). QA header hidden through browser DOM styling for unobstructed phone captures only; no product UI or game state injected. The previously hidden blaster is discernible through the head; visible Wisp tool remains recognizable and drop removes the cue. Not every character/item/angle has been reviewed. No physical phone or performance acceptance claimed.

Checks:10 targeted item rendering/rig/aim tests pass10.60s. New regression verifies cue expiry blink, reduced motion, camera/owner opt-out, drop removal, lobby hide and unchanged authority. Existing rendering tests preserve material/transform batching and all four rigs restore animation state. Initial preview module failed because a TypeScript parameter property was not erasable by development server; replaced with an explicit field assignment, reloaded and captures succeeded. Initial404 is not a final renderer defect. Final typecheck/build/console recorded below.

Previous turn classification: progress from a visually rejected wide-arm candidate. Prior shoulder camera evidence also rules out repeating that phone-framing regression. Main4179 remains running; refresh loads the retained source. Next: natural crate interaction and remaining animation/device checks, not a claim of finished presentation at every angle.

Final strict typecheck84010 and static build33164 passed. Final browser console0errors/0warnings after corrected reload. Isolated browser closed; main4179 and QA4181 servers untouched.
