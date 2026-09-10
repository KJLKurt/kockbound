# Landscape item and aiming hints

Milestone/criteria: M3 V01 presentation support; M4 C06 partial viewport evidence, not a real-phone pass.
Build/content: local CSS change, compatibility0.12.1 unchanged.
Date/tester/environment:2026-09-09,Codex,Windows in-app Chromium.
Scenario: normal third-person solo at844x390; controlled passive item fixture at667x375.
Expected: hints clear action center and avoid thumb/item/HUD areas in short landscape windows.
Observed: before, look hint crossed the player/action center; held-item pickup hint used bottom310px, which would place it near top HUD. Landscape rule now puts look hint at bottom16px (safe-area aware), pickup hint bottom70px, both constrained between side controls; item HUD bottom155px and safe-area-right. Normal countdown screenshot inspected after reload: aiming hint now below character. Controlled667x375 DOM bounds: item HUD x524.109..649,y135..220; pickup hint x239.945..427.055,y272..305. They do not intersect. Fixture diagnostic output obscures part of hint in screenshot, so no unobstructed fixture text visibility claimed. Earlier portrait checks remain separate; this rule applies only max-height500/min-width581.
Status: layout check PASS within this limited scope. Browser error logs empty on main and QA. QA23 closed, viewport reset, main22 returned to lobby with existing Pebble/Mint/third settings preserved.
Commands: pinned Node tools/build.mjs (outcome below). No new unit test for reversible CSS spacing; no fresh full-suite claim.
Screenshots/logs: inline task screenshots and DOM observations, no disk images.
Performance: not measured in this increment.
Limitations/next: physical touch comfort, simultaneous real-device inputs and full visual/audio quality gates remain unverified. Continue work; goal active.

Static build completed successfully, session74564exit0.
