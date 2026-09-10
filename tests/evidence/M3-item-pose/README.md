# Blended carrying and aim pose

Date/environment: 2026-09-09, Codex, Windows, pinned Node 24.19.0 and Three 0.180.0. Partial animation/presentation evidence. No simulation, collision or protocol changes; remains 0.12.0.

Behavior: a reversible layer after the locomotion mixer turns the chest toward item aim (limited to 60 degrees) and raises the right carrying arm for bomb, pod, remover and ranged items. Comfortable arm bearing is bounded to about 86 degrees from body heading. Blend enters/exits over several frames; ordinary hits, dash, stun, fall and victory clips disable the holding target. The underlying pose is restored before each mixer update so the adjustment cannot accumulate. Head/hand sockets are evaluated after the layer. Existing complete item shot direction remains authoritative; reach limits do not alter targeting.

Visual checks: development-only Moving hold pose fixture fixes position while supplying a run velocity and a perpendicular body heading, so it reviews animation without claiming natural traversal. Inspected at 1280×720, idle after a camera turn, and moving at 390×844. Torso/arm pose remains coherent with the run cycle. Rear camera naturally obscures much of the forward-held blaster; these screenshots do not establish precise finger/grip contact from every angle. QA toolbar occupies the upper phone viewport. Screenshots inline, not a disk recording. No new external art or Blender exports.

Checks: all four actual exported GLBs load through GLTFLoader; 180 repeated apply/restore frames per rig preserve exact animation-base quaternions and finite matrices. Combined with the held-to-ground prop regression, two tests passed (1.97 seconds); strict typecheck passed. Build tracked separately below. New test added to the regular suite; no fresh full-suite claim.

Remaining: precise hand/grip contact across aiming extremes and held item shapes, broader natural traversal and transition review, actual-phone control/performance test when available. Full goal active.

Final static build completed successfully (session41351, exit0). QA tab9 closed, viewport reset; main tab5 reloaded with current rendering code at the ready lobby.

## Full regression follow-up

Current complete package test command passed 80/80, zero failures/skips, in 75.23 seconds on pinned Node24.19.0 (session27617, exit0). Log: full-tests.txt. This includes simulation, authority, real WebSocket adapter, cosmetics, tile rendering, combined pointer controls and all exported item-pose rigs. It does not include the separately unavailable native Windows workerd test or physical-phone tests.

The actual static dist directory was served on temporary loopback62643 (session71992), loaded in a fresh-origin browser tab with default settings, and entered the normal four-player round. Countdown and full arena presentation visually inspected; clicking Dash produced the disabled one-second cooldown and a gust warning appeared during ordinary play. Browser error log was empty at this observation. Round outcome recorded separately when observed; no balance claim from sparse inputs.

Packaged round completed normally: Clover won at32seconds, local player zero hits/ring-outs. Spectator/result Dash button was visibly disabled with Enjoy the view. One more round reset to four standing/1:30/five-second countdown. Pause→Leave returned to lobby; final error log empty and temporary tab10 closed. This also supplies the previously missing post-change spectator dash check from M3-dash-feedback. No physical-phone or balance approval.
