# M3 first playable audio pass

Criteria: partial V02/V03/V05/V06. Build: uncommitted 0.1.0, audio.sky-ring/r001, unchanged simulation/protocol. Date/tester: 2026-09-07, Codex on Windows, Node 24.19.0, TypeScript 5.9.3; Codex in-app Chromium at 639×642, loopback server 4179. No external samples/recordings and no outside human feedback.

Implemented: original 120 BPM/32-bar composition, three synchronized 64-second music stems, fifteen effect variants; audio unlock, volume/mute persistence, stereo positioning, cue priorities/ducking, voice limit and compressor. Gameplay events retain visible cues and remain authoritative. Editable score and deterministic generation commands are in assets/source/audio/sky-ring.

Checks actually run: `node tools/build-audio.mjs`, `node tools/audio-preview.mjs`, `node --test tests/audio.test.ts`, strict TypeScript check, static build. Two audio tests passed: malformed saved preferences normalize safely; all 18 PCM files have valid aligned format, headroom and faded effect boundaries. Generated total 8,860,490 bytes, largest sample peak 0.630627. Music seam sample deltas: harmony 0.001802, rhythm 0, spark 0.003140. These are file-level metrics, not loudness or listening approval.

Browser: reloaded current source, clicked solo/settings, and observed **Sound ready** after all 18 buffers decoded. Music 55→54 and mute enabled both persisted after reload; restored music 55/mute off. Settings screenshot inspected inline with all controls and All set reachable at the native narrow panel size. Started a solo round with the bank enabled. This establishes loading/settings integration, not audibility on a physical device.

[Offline 24-second mix preview](mix-preview.wav) includes lobby/base/intensity music, countdown/go, dash/hit variants, ring-out, warning and victory. It is composed from the same masters at representative default gains; it is not a captured Web Audio output and does not include the runtime compressor/duck automation. It has not been claimed as listened-to through headphones or speakers.

Status: **PARTIAL**. Actual listening to browser output, crowded-match recording, headphone/speaker masking/click review, final instrumentation/mix iteration, compressed runtime exports and first-play network/heap measurement remain pending. The PCM bank is currently ~8.45 MiB before HTTP compression and must be included in later V05 transfer measurements. No claim that V06 or finished audio quality has passed. Continue visual production and audio listening/optimization; the full goal remains active.

Follow-up: the enabled-bank solo round reached Pip winning at 63 seconds; result and replay controls remained available. No sound-related gameplay error was observed.

## User test report — 2026-09-09

User reports they cannot connect from the phone right now and suspect router/networking they note the agent does not control. Treat physical-device testing as unavailable; no actual phone failure cause has been diagnosed and no C06/V04 physical-phone pass is claimed. Do not repeatedly ask them to retry the same unavailable setup.

User also reports hearing music and sound effects while testing in the browser and mobile-sized viewports. This is direct evidence of browser audibility, not a claim of headphone/speaker mix quality, absence of masking/clicks, or actual mobile-device playback. Continue independent gameplay/presentation work; this limitation alone is not a global goal impasse.
