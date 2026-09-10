# Held item sockets and bearing

Milestone/criteria: partial V01/V02 and expanded camera/item presentation. Version: uncommitted 0.12.0. Date/tester/environment: 2026-09-09, Codex, Windows, pinned Node24.19.0/Three0.180.0, in-app Chromium. Contract: ITEM_AIM_CONTRACT.md, D54. No outside feedback or physical-phone claim.

Changed: optional validated Player.itemAim replicates the last accepted camera bearing for remote prop presentation. Shared hand/head sockets drive held positions after character interpolation/animation; directed props rotate with aim. Idle visuals turn smoothly toward aim without changing physics/dash facing. First-person props have a reduced lower-right placement. Toy blasters now have grip, bright muzzle rim and dark opening. Ground drops reset scale/orientation; bomb/pod danger rings stay on the floor independently of prop height/scale.

Checks actually run: 16 focused aim/client/character tests passed; full 77/77 passed in 154.949 seconds (full-tests.txt); subsequent dedicated held-to-ground scale/rotation/floor-danger regression passed separately (not a newly run 78-test suite). Strict typecheck and static build passed before that final test-only addition; final typecheck after that test-only addition also passed. Replicated aim tests prove copy isolation, rejection of invalid snapshot bearing, clearing on non-aim input, and presence in the authenticated authority snapshot. Character rig tests plus actual load establish the shared sockets exist across the four models.

Visual checks: 1280×720 third-person hand attachment; 390×844 stationary quarter-turn camera where character and held blaster turn together; first-person phone fixture initially clipped its oversized prop, corrected position/scale and re-inspected with visible arena ahead; full-view passive fixture inspected with shovel at hand and hat above head. Inline screenshots only, no exported recording. First-person fixture is isolated ordinary camera controls/shared item state, not physical multitouch. Rotated hand may still differ from ideal grip during movement; dedicated upper-body aiming/hand poses are not claimed finished. No new Blender asset or license requirement.

Status: listed integration/visual checks pass. Remaining full pose/deformation/transition review, natural-control item walkthrough, physical phone and audio listening. Goal active. QA route remains development-only.

Browser QA error log was empty. QA tab7 closed, viewport reset; main tab5 reloaded to current 0.12.0 lobby with Play enabled. Room server refreshed at 4179, session98872.
