# M0 bootstrap verification

Date: 2026-09-05. Environment: Windows PowerShell, Node v24.19.0. Repository was an existing empty Git working tree before bootstrap. Changes remain uncommitted.

Scope: specifications and implementation scaffold only. No gameplay or deployment was attempted.

- B01 PASS: required canonical artifacts present; local document/image links resolve.
- B02 PASS: sections 1–89 mapped once each; semantic review reconciled the original roadmap with later local/co-op/content requirements; original twenty open questions each have a disposition.
- B03 PASS: ownership directories, private bootstrap package, provenance ledger and runnable validation command exist; no game runtime, cloud configuration or production art is claimed.
- B04 PASS WITH DISCLOSED LIMITATION: two historical concept PNGs preserved unchanged and visually inspected; other historical image groups were not individually retrievable and remain referenced through the source conversation.

Command: `node tools/validate-bootstrap.mjs`.
Result: PASS; 19 required artifacts, 89 foundation sections, 107 local links and valid JSON metadata. The final checker also validates canonical Markdown whitespace and final newlines. Archived excerpts are intentionally excluded from formatting checks to preserve retrieved text.

Manual review: authority boundaries, milestone dependencies, local/online parity, event entitlement persistence, no-stat cosmetics, staged economy, candidate/default distinction and explicit bootstrap-only scope.

An initial Git whitespace check found an extra terminal blank line in AGENTS.md; canonical text files were normalized before the final recheck. Ordinary `git diff` cannot validate untracked bootstrap content, so it is not used as proof of the package's contents.

Gameplay acceptance P/N/V/C/E/A/R: NOT RUN. External testers, performance, Cloudflare timing/cost, Blender export and mobile/controller hardware remain future milestone evidence.

Follow-up: the historical B04 image limitation above was resolved for all ten images exposed by the branch viewer; see [branch recovery evidence](M0-branch-recovery.md). The original result above remains as the initial-run record.
