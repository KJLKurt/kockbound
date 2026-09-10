# Directed item aim — 0.11.0

Input may contain aim: {x,z}, a finite horizontal direction with magnitude greater than 0.01 and at most 1.000001. Both fields are required together, with no other nested keys. Strict wire validation and the shared simulation reject malformed aim before consuming the input sequence or item. Aim does not change movement, dash, mass, collision or outcome authority. All directions are normalized before use.

Full-arena controls keep movement/current facing as the default item direction. First/third-person controls send camera-forward aim independently of movement on each input; strafing or remaining stationary does not redirect fire away from the camera. Camera pitch is visual only in the X/Z simulation. No target identity or target position is accepted.

Bubble blaster, wind, rolling rock, bomb throw/drop, platform remover and explicit pod planting use the same direction helper. Without explicit aim, the latest accepted nonzero movement takes precedence over saved facing, fixing the previous one-tick turn lag in bomb/pod actions. Automatic pod expiry uses saved facing. Shovel/big/hat remain passive; dash follows ordinary movement/facing. Existing drop/use precedence and cooldowns remain intact. Bots use the same fallback through ordinary commands.

OnlineSession transmits aim without changing assigned seat/sequence handling; Node/Worker share the validator and authority. Existing latest-packet coalescing retains action edges and latest aim. Client prediction still does not execute item effects. No wallet or authoritative hit claim comes from the client. Protocol/simulation/content identifiers advance together to 0.11.0; stale room servers/clients must reload.

Presentation adds an item bearing marker on the floor, offset beside the character in close cameras to remain visible. It indicates horizontal direction, not a collision/trajectory/range guarantee. The current held model remains tied to the character pose; upper-body/prop aim alignment is still a presentation task. Reduced motion does not remove the direction cue.

## Replicated bearing and prop presentation — 0.12.0

Player.itemAim is an optional copy of the latest accepted input aim for presentation. It is cleared by a subsequent accepted command without explicit aim, and snapshot validation applies the same finite bounded-direction check. It never changes physics, item targeting, dash heading or competitive stats. Local camera bearing can override the replicated direction visually for immediate feedback; remote props use the authoritative bearing. Existing neutral input prevents actions; the retained last bearing itself causes none.

Held props use the shared socket.hand.R or socket.head world position after animation/interpolation, rather than fixed simulation-coordinate offsets. Directed barrels face item aim. Ground pickup scale/orientation resets on drop; danger rings remain on the floor and retain their authoritative radius. Idle characters visually turn smoothly toward directed aim; moving/dashing characters retain movement-facing animation. First-person local non-hat props use a smaller lower-right camera-relative pose. Upper-body aiming while moving and dedicated grip animation remain future presentation polish; no skeletal master or physics collider changed.

Desktop usability (D75): saved Mouse look defaults on for first/third person. A mouse click in the arena requests pointer lock; relative mouse motion updates the same local yaw/pitch used by cameraRelative. Escape/unlock pauses, and pause/blur/resize releases capture. Touch remains drag; disabled/denied lock falls back to drag. This changes no authoritative aim fields or simulation version. See tests/evidence/M3-mouse-look for actual browser limitations.

Capture recovery (D76): Mouse look off/on retries after denial; turning it off immediately releases an existing lock. Failed capture keeps drag available and exposes an explicit hint.

Keyboard look (D77): hold J/L for left/right camera yaw at2.4rad/sec in first/third person. Uses the same camera-relative movement/aim path; both cancel and paused/blurred input clears. Full-arena controls unchanged.
