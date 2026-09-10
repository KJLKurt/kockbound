# Item pickup/action feedback

Criteria: partial V02 and expanded item usability. Date/tester/environment: 2026-09-09, Codex, Windows desktop in-app Chromium; current 0.12.0 protocol/simulation unchanged.

Changed: each registered item has a specific pickup hint, shown for four seconds. Passive shovel/big/hat messages describe their automatic benefit; they no longer tell the player to press Fire. Blaster hints do not promise five remaining shots after transfer. HUD displays actual/effective charges with singular/plural wording, expiry, action-specific labels, firing cooldown and stun state. Use disables while cooling down/stunned/expired/outside active play; Drop remains available during ordinary firing cooldown but not stun/expiry/countdown. Result/paused/dead item panels hide. Neutral generic pickup text handles same-tick item consumption. Footer now says Playable preview instead of an obsolete M1 implementation label.

Browser checks: the real item HUD renderer/CSS was included in the development-only visual fixture. At 390×844, clicking the HUD Fire action produced four remaining shots and a disabled 0.4s button with accessible description Fire ready in 0.4 seconds; Drop stayed available. Passive shovel fixture at 320×568 showed Drop only and the correct shovel hint in accessible help. That narrow screenshot verifies the panel only: the development toolbar occupies much of the viewport, so it is not evidence for the complete main-game layout at that size. Default full-charge fallback was corrected afterward for fixture/server states whose optional charges field is absent, matching the simulation's existing default. No real phone or human understanding approval.

Verification: strict typecheck passed before the final default-charge fallback; final strict typecheck and static build passed after that change (build.txt). Fresh five-shot fallback was then observed in the browser. No new unit suite for this reversible presentation change, and no fresh full simulation suite claimed. Prior full77 plus separate drop regression remain previous-increment evidence. Screenshots inline only; no recording. Main game integrates the same helper, while the controlled fixture does not prove natural pickup navigation or real-device multitouch.

Remaining: physical controls/audio and broader animation/first-session review; full goal active.

Final QA browser error log was empty. QA tab8 closed and viewport reset. LAN phone preview was confirmed unavailable, restarted at port4183 session12992, and http://192.168.12.250:4183 returned 200 from this computer for the page, 0.12.0 config and current item-feedback module. This proves computer-side LAN service only; phone test requested asynchronously, no response yet.

## User test report — 2026-09-09

User reports they cannot connect from the phone right now and suspect router/networking they note the agent does not control. Treat physical-device testing as unavailable; no actual phone failure cause has been diagnosed and no C06/V04 physical-phone pass is claimed. Do not repeatedly ask them to retry the same unavailable setup.

User also reports hearing music and sound effects while testing in the browser and mobile-sized viewports. This is direct evidence of browser audibility, not a claim of headphone/speaker mix quality, absence of masking/clicks, or actual mobile-device playback. Continue independent gameplay/presentation work; this limitation alone is not a global goal impasse.
