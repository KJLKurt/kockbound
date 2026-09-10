# Browser audio interruption status

Milestone/criteria: M3 V06 recovery support, not listening approval.
Build/content: local working tree, compatibility0.12.1 unchanged; no waveform/mix changes.
Date/tester/environment:2026-09-09,Codex,Windows,Node24.19.0.
Scenario: audio context becomes suspended after successful loading, then resume resolves while still suspended, then resumes successfully.
Expected/observed: statechange reports Sound paused by browser and exposes existing Settings retry. Unlock completion consults actual context state rather than unconditionally reporting ready. Successful resume clears retry and retains exactly three music layers/eighteen decoded buffers with no extra downloads. Existing document pointer/keyboard handlers already invoke unlock; main frame displays status/retry visibility.
Status: four audio tests PASS, strict typecheck PASS, static build PASS (session99146exit0).
Commands: pinned node --test tests/audio.test.ts; tsc --noEmit; tools/build.mjs.
Screenshots/recordings: none; mocked context verifies lifecycle behavior, not a physical browser suspension or actual playback. No new sound assets to listen to.
Performance: not measured.
Limitations/next: physical-phone background/interruption recovery and headphone/speaker listening remain unverified. User previously confirmed browser audio audible only. Goal active; continue remaining quality work. Prior full90/90 suite predates this small audio state change; no new full-suite claim.
