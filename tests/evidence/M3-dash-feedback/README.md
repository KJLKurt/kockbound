# Normal play and dash availability

Date/tester/environment: 2026-09-09, Codex, Windows desktop in-app Chromium at 390×844, Node 24.19.0. Partial P05/P07/V02 evidence; no physical-phone or human balance approval. Version remains 0.12.0; simulation/protocol unchanged.

Changed behavior: dash button disables outside active, available owner control: countdown, pause/disconnection, spectator/results, stun and cooldown. Visible and accessible status explains readiness, recovery, pause or cooldown. Disabled styling preserves the circular phone target and avoids hover movement. Pointer handler also checks disabled state. Keyboard/simulation rules remain unchanged.

Normal UI observations: third-person Pebble/Mint round ended with Clover winning at 26 seconds, zero hits; replay ended with Pip winning at 56 seconds and one hit. A normal dash click changed the HUD to 1.2 seconds. Sparse automated inputs do not support a balance conclusion. An attempted wait for the brief GO announcement timed out; subsequent live control observation succeeded. No hidden state or injected game outcome was used.

After change: reload and Play showed disabled Get ready during the five-second countdown. The button then accepted a click and showed disabled Dash in 1.2s; screenshot at 390×844 visually inspected the cooldown at 1.1s. Pause showed disabled Paused. Left round through the normal menu and reset viewport; main tab retained at ready lobby. Spectator/stun/disconnection disabled conditions were inspected in source, not separately reproduced after this change. Screenshot is inline in the task, no disk recording.

Checks actually run: strict TypeScript check exited 0 (session47028); static build exited 0 and reported built dist. No fresh full suite for this presentation-only increment. Previous simulation evidence remains historical. Remaining: natural full item/control walkthrough, moving grip/animation quality and broader audio/performance checks. Actual phone testing unavailable per user report; browser music/SFX audibility confirmed by user. Goal remains active.
