# Crowded audio priority and replacement scheduling

Date/tester/environment:2026-09-09,Codex,Windows,Node24.19.0. Audio engine only; waveform bank and simulation/protocol0.12.0 unchanged. Partial audio scheduling evidence, not a listening-quality approval.

Defect: at the20-voice limit, the previous fallback allowed any priority2 hit to replace the oldest priority3 warning when no lower-priority voice existed. New sounds also started immediately while evicted voices continued a30ms fade, allowing replacement bursts to exceed20 simultaneous audible effects.

Fix: choose the oldest voice of the lowest eligible priority; lower-priority events cannot steal higher-priority warnings/outcomes. High/equal-priority replacements retain the outgoing30ms fade and begin at its scheduled stop time. Completion still disconnects source/gain/panner nodes. Existing music stems, mixing gains and waveforms are unchanged.

Verification: four audio tests pass (616ms), including a simulated Web Audio cue storm:20 warnings reject100 dashes and100 hits, a victory replaces an eligible warning after30ms, then50 warning replacements never exceed20 concurrently playing effects at sampled transition boundaries. End callbacks clean the tracked voices. Prior download recovery/no-duplicate stems and WAV alignment/headroom checks also pass. Final strict typecheck and static build pass (session48315). No fresh full-suite result claimed.

Limitations: fake Web Audio scheduling validates requested timing and priority behavior, not perceived mix quality or real hardware clicks. User previously confirmed browser music/SFX audibility; headphone/speaker listening and runtime recording remain open. Main ready lobby reloaded with current code. Full goal active.
