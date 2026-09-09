# Phone-sized rendering and download optimization

Criteria: partial V04/V05; D39. Revision: uncommitted 0.1.0, unchanged simulation/content release. Date/tester: 2026-09-07, Codex, Windows desktop in-app Chromium, Three.js 0.180.0, Node 24.19.0. Viewport/drawing buffer 390×844, low graphics, reduced motion off. This is not physical phone hardware.

Scenario: development-only sustained synthetic twelve-character orbit, with twelve dash/hit events twice per second and capped particles. Thirty-second warmup then 180 seconds of requestAnimationFrame sampling. Unlike ordinary bot rounds, all twelve characters remain visible throughout. Synthetic motion tests rendering only, not gameplay determinism or human feel.

Observed completed sample: **10,798 frames, p95 16.8 ms, zero hidden frames**, peak 160 particles and 12 impact pulses. Final observed scene: 149 render calls, 186,946 triangles, 60 geometries; draw/triangle counts vary with transient effects. Browser warning/error query during the run returned []. Twelve characters and effects visually inspected inline. No saved screenshot or video claimed. V04 remains incomplete: real phone/recorded reference laptop measurements are required; this cannot be labeled a phone benchmark pass.

Implemented optimization: particle movement/colors preserved while rendered through three instanced batches instead of separate meshes. Roster DOM is rebuilt only when match, local seat, identity or alive status changes. No simulation tuning or graphics reduction was introduced by batching. There is no controlled before/after frame-time comparison, so the measured p95 is not presented as an improvement percentage.

Transfer: original 18-file audio WAV bank 8,860,490 bytes; gzip total 6,346,415 bytes, 28.37% savings. Preview HTTP now negotiates gzip and preserves decoded asset content; `gzip;q=0` receives identity. LAN GET for harmony returned 200, gzip, 2,822,444 decoded bytes. This is local HTTP evidence, not a cold-load time or cellular network measurement. Public-host compression remains future configuration.

Checks actually run: strict TypeScript, static build, four targeted server/touch/effect tests, all passed. Server test compares decoded compressed harmony to original bytes and checks identity rejection behavior and private-path exclusions. Full 42-test suite passed in the preceding phone increment; not rerun for these rendering/HTTP-only changes.

Status: PARTIAL. Next: real-device multitouch, phone browser/audio unlock and speaker/headphone listening, sustained phone measurements, full first-play transfer/cold-load and ten-cycle memory check. Current LAN preview session 14345 at http://192.168.12.250:4183. Full goal active.
