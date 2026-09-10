# client/networking

Versioned transport, buffering, prediction/reconciliation integration and connection UX. No wallet authority.

OnlineSession uses native WebSocket with injected sockets for integration checks. It validates incoming snapshots, controls the assigned seat, acknowledges/reconciles pending inputs, neutralizes paused controls and retries abnormal disconnections within the room grace period. Room admission is currently loopback development transport; public authentication/rewards are not implemented.

Prediction is bounded to two 50 ms steps because the authority coalesces input packets. Preserve an outstanding dash edge; do not equate queued packet count with elapsed ticks. OwnerSmoother blends positions with a 35 ms time constant, snapping on elimination or corrections above 2.5 m. Neither it nor remote interpolation can change authority. Diagnostic target-adjustment counters include actual movement and impacts; they are not pure prediction error.

Tests: network-client, network-latency and transport suites. See current STATUS and tests/evidence/M2-latency for actual measurements and limits.

Projectile presentation uses the same buffered snapshot interval as remote players. Only positions and rolling distance interpolate; latest authority retains hit records and removal. A new shot enters when the buffered upper snapshot contains its ID, at that snapshot's position, avoiding a forward-then-back birth jump. Local rendering uses its previous/current simulation pair. Neither path extrapolates or changes projectile authority. See tests/evidence/M3-projectile-interpolation.
