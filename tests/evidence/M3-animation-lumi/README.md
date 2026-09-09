# Lumi expanded animation candidate

Date/tester: 2026-09-07, Codex, Windows; Blender 5.2.1 / Three r180 / Node 24.19.0. character.lumi-prototype/r002: 617,664 bytes, 11,536 triangles, two primitives, original 34-bone shared rig. Original saved Lumi source remains intact; separate candidate is `assets/source/blender/character.lumi-prototype/lumi-animated.blend`.

Same ten-clip library and pose corrections as [Sprout evidence](../M3-animation-sprout/README.md). [Khronos](khronos-validation.json): zero errors/warnings. [Loader and stationary-root samples](loader-validation.json): PASS. [Fresh Blender reimport](blender-reimport.json): ten actions and matching rest bounds. [Victory](victory.png), [wave](emote_01.png), and [eliminated](eliminated.png) were visually inspected after the correction. All ten pose PNGs were generated; static samples do not establish perfect transitions.

Lumi's lobby dance, a complete solo result and a subsequent accepted dash were checked in the real browser with the new GLB. Status remains animation candidate: fixed face/prototype weighting, continuous blend/foot-contact/crowd review and broader M3 gates remain pending. No outside animation, audio-listening or human playtest approval is inferred.
