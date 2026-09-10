# Phone settings and content explanations

Date/environment: 2026-09-09, Codex, Windows desktop in-app Chromium, 390×844 and320×568. Presentation-only; version0.12.0 and authority contracts unchanged.

Changed behavior: camera selector appears first in Settings. Individual item/hazard checkboxes live in native expandable details panels, with master switches outside. All ten items have brief benefit/use/risk explanations; three hazards explain their warning colors or arrows. Existing checkbox IDs and selection/persistence handlers remain in use. Collapsed controls remain selected normally; expansion does not reset their values.

Verification: strict typecheck and static build passed. Browser390×844 screenshot shows camera, both master switches and collapsed selectors with audio controls much nearer the top. Expanded items at320×568 show readable wrapping and accessible checkbox labels including descriptions. Collapsed items, expanded hazards and checked all three descriptions in the accessibility tree. Closed with All set, reset viewport, retained ready main tab11 at4179. Previous tab5 was absent from the browser inventory, so a new tab was opened. Screenshots inline only; no physical-phone approval. No new full suite for this reversible UI change; preceding80-test result remains prior-increment evidence.

Next: natural item navigation and remaining grip/animation/audio review. Full goal active.
