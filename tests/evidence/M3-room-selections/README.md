# Acceptance evidence

Date: 2026-09-10. Scope: requested independent/master item and hazard choices, N01 real local transport. Compatibility0.12.6 unchanged. Environment: Windows, pinned Node24.19.0, real loopback WebSockets, injected authority clock.

Added an integration test in tests/transport.test.ts that creates four rooms through HTTP: all options off, blaster only, gust only, and blaster plus gust. Four ordinary human admissions connect and ready each room. Each room advances400 ticks, including countdown and the first two item spawn attempts plus the first hazard warning/active interval. Received snapshots must retain each selection; disabled systems remain absent throughout; enabled blasters actually spawn and only blasters appear on the ground/in hands; enabled gusts appear and sky rocks stay absent.

Result: PASS, final targeted test30.02s total (28.49s test body). No production bug found or runtime behavior changed. This strengthens coverage of host exclusions across HTTP, room authority and serialized WebSocket snapshots. It does not prove every item/hazard combination, browser persistence, physical touch controls or the earlier intermittent browser rejection.

Initial one-human/three-bot fixture timed out waiting for a later world tick after31.13s; no exact terminal snapshot was captured, so bot elimination is a plausible cause rather than a proven diagnosis. Replaced with four idle human seats and an explicit assertion that the round remains active through the interval. Final test passes without changing game behavior or weakening assertions.

Commands: pinned Node `--test --test-name-pattern='Host selections' tests/transport.test.ts`; strict TypeScript check (final result below). No build or screenshot needed for a test-only increment. Main4179 unchanged; no browser/server opened. Previous turn classification: progress through optional diagnostics and new four-browser continuity evidence. Goal remains active. Next: remaining natural item interaction and held-tool presentation review.

Final strict typecheck35779 passed (exit0) after the four-human fixture change. No full-suite pass is claimed for this increment.
