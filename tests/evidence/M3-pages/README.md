# Acceptance evidence

Milestone and criterion IDs: M3 deployment preparation; supports later C06 phone checks, does not close C06/V04.
Build/revision and content release: working tree; simulation/content compatibility unchanged at 0.12.6.
Date, tester and environment: 2026-09-10, Codex, Windows, Node 24.19.0.
Runtime/browser/device, viewport and network profile: in-app Chromium, 1280×720, localhost `/KnockBound/`, normal network.
Scenario/config/seed: compiled static solo build, default four participants; random ordinary round.
Expected outcome: root and project-path builds resolve assets and retain solo mode; default Cloudflare path supported.
Observed outcome: two static build tests passed (77.09 seconds total), direct typecheck exit 0. Browser lobby home link pointed to `/KnockBound/`; Let's play started a round with four rendered characters, arena, HUD and active countdown. Screenshot visually inspected at 1:19 remaining. Browser warnings/errors: empty list.
Status: PASS for local build/path/browser checks; NOT RUN for hosted GitHub Actions and physical phone.
Commands actually run: `node node_modules/typescript/bin/tsc --noEmit`; `node --test tests/static-build.test.mjs`; `BASE_PATH=/KnockBound/ node tools/build.mjs` (PowerShell env syntax used); temporary `.knockbound/pages-preview.mjs` on 4192; `node tools/build.mjs` to restore root output; git diff check.
Screenshot/recording/log paths: screenshot displayed and inspected through CUA in this task, not persisted to a file; test results and browser empty warning/error list in tool transcript.
Performance measurement method and sample: none; not a performance test.
Limitations and next action: local pnpm commands failed automatic dependency checking (registry fetch and noninteractive purge rejection); direct installed Node/TypeScript succeeded without reinstall. Browser path check used a local mount of dist, not GitHub's deployed service. No new audio listening claim. Temporary tab closed and server stopped. User must enable Pages/Actions and push before hosted/phone verification. Full gameplay suite not rerun for hosting-path changes.
