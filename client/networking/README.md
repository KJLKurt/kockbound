# client/networking

Versioned transport, buffering, prediction/reconciliation integration and connection UX. No wallet authority.

OnlineSession uses native WebSocket with injected sockets for integration checks. It validates incoming snapshots, controls the assigned seat, acknowledges/reconciles pending inputs, neutralizes paused controls and retries abnormal disconnections within the room grace period. Room admission is currently loopback development transport; public authentication/rewards are not implemented.

Prediction is bounded to two 50 ms steps because the authority coalesces input packets. Preserve an outstanding dash edge; do not equate queued packet count with elapsed ticks. OwnerSmoother blends positions with a 35 ms time constant, snapping on elimination or corrections above 2.5 m. Neither it nor remote interpolation can change authority. Diagnostic target-adjustment counters include actual movement and impacts; they are not pure prediction error.

Tests: network-client, network-latency and transport suites. See current STATUS and tests/evidence/M2-latency for actual measurements and limits.
