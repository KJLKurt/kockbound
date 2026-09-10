# Shared item-part submissions

Date/tester/environment:2026-09-09,Codex,Windows desktop Chromium,Three0.180.0,Node24.19.0. Rendering-only, protocol0.12.0 unchanged. Partial performance/presentation evidence; not actual-phone acceptance.

Change: opaque held/ground model parts share instanced batches keyed by the exact geometry/material identity. Original model transforms are retained as source nodes; batches copy their world matrices, then source model rendering hides to prevent duplicates. Each update restores the model's intended blink visibility before collecting. Rotor animation, shovel lean, socket/ground placement and colors therefore retain the same inputs. Warning halos and bomb fuse caps stay separate. Batch capacity grows when needed, preserves existing matrices, and disposes the old instance buffer; empty batches hide. Individual frustum culling is traded for shared submissions; original materials/geometries remain owned by ItemView.

Checks: three rendering tests and strict typecheck pass. Tests cover existing held→ground transition, projectile transforms, plus17 spring pods producing just2 model batches (17 bulbs/68 petals), growth beyond initial capacity, material identity/world matrix preservation, expiry blink, reduced-motion visibility, moving rotor matrix and lobby hiding. Static build tracked below.

Visual checks: passive fixture1280×720 and combined390×844 low-quality scene inspected; shovel, big mode/hat, ground models and hazard markers remain visible. Inline screenshots only; no full hand-contact approval.

30-second paired CPU/GPU diagnostic after5s warmup:1,555frames/GPU samples,frame p9533.5ms,submission12.4ms,scene3.5ms,GPU6.311ms,hidden/pending/discarded0 (profile.json). Previous diagnostic submission was14.1ms; this is suggestive of reduced overhead, not a controlled FPS improvement—frame p95 remains unchanged and desktop background activity is uncontrolled. Instantaneous draw count94 is not phase-matched. No agent compilation during collection. Next inspect remaining CPU/layout overhead and normal game behavior; full goal active.

Final build passed (session84664); QA error log empty. QA17 closed and viewport reset. Main11 was confirmed in lobby and reloaded with current rendering code, then retained.
