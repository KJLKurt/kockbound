# Normal crate opening attempts

2026-09-10, Windows isolated headed Chrome929x917, normal preview4179, current0.12.6. Scope: natural dash-open and collection of a random mystery crate. No simulation injection or hidden browser-state inspection.

Status: NOT VERIFIED. Three local round openings were inspected. First opening showed a blaster; after W/dash then A movement and waiting, the player was eliminated before the next desired crate opportunity. Next round moved inward during opening and again showed a bot-held blaster. Third opening also showed a bot-held blaster. No crate opened or collected in these attempts. These observations do not demonstrate a crate bug, precise elimination cause, or successful collection. Previous contested crate evidence remains separate.

Inspected captures: output/playwright/crate-review-first.png, crate-review-second.png, crate-review-round3.png, crate-review-round4.png. Scripts share crate-review prefix. Ordinary keys, pause/resume, settings, leave/start controls were used. Initial retry referenced the outcome screen's Back to the island button instead of the observed pause screen's Leave round button; the locator timed out and was corrected after reading the snapshot. No game fix was needed. Final console: zero errors/warnings.

Decision: repeating random first-spawn attempts is not an efficient path to this remaining evidence. A targeted user question about crate opening/collection is pending; do not duplicate it or treat elapsed time as feedback. Independent fixture/interaction review remains possible. No runtime changes, build or automated tests this turn. Main4179 unchanged; isolated browser cleanup below. Prior goal turn was progress via full104 regression evidence and contract corrections. This attempt adds limited normal-play observations and changes the next testing approach, not a completion claim.

Cleanup: isolated CLI-owned browser closed; main preview server was not stopped or restarted.
