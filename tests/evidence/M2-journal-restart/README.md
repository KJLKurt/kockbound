# Preserve terminal room records on restart

Milestone and criterion IDs: M2 N06 restart/cancellation reliability.
Build/revision/content: local working tree; compatibility0.12.1 unchanged, no network or simulation schema change.
Date/tester/environment:2026-09-09,Codex,Windows,Node24.19.0.
Scenario: restart journal containing waiting, finished and cancelled rooms; deny writes on subsequent startup; simulate EPERM on required rename.
Expected: cancel unfinished rooms durably once, leave terminal records untouched, never claim a failed persistence operation succeeded.
Observed: only the waiting record is renamed on first load; existing terminal JSON bytes preserved. Second load succeeds with writeFileSync forced to fail, proving no record writes attempted. Required cancellation rename failure aborts startup, original remains waiting, later retry cancels durably. Actual transport restart integration retains410 admission rejection for cancelled room.
Status: PASS for these three focused checks. Strict TypeScript check passed.
Commands: pinned node --test tests/journal.test.ts; node --test --test-name-pattern='real transport restart' tests/transport.test.ts; node node_modules/typescript/bin/tsc --noEmit. Exit0.
Screenshot/recording/logs: terminal output in task; server-only change, no visual/audio change.
Performance measurement: none.
Limitations/next: original Windows EPERM cause remains unknown. Removing unnecessary terminal rewrites reduces exposure; required writes can still fail and are not silently ignored. No archive deletion, retry loop or durability bypass. Current4179server remains session37497; changed constructor takes effect on next restart. Main22 last ready lobby. Goal active; continue gameplay/presentation quality review. No fresh full-suite or phone pass claimed.
