# Implementation specification

All numeric values below are NEW reversible prototype defaults unless marked recovered. Do not present them as tuned or previously approved. Use named configuration fields; record changes and playtest observations in DECISIONS.md.

## Shared contracts

MatchConfig: matchId, seed, simulationVersion, protocolVersion, contentReleaseId, modeId, mapId, rulesPresetId, roster and mode settings.
Participant: participantId, seatId/controller association, teamId, controlKind (human/bot), appearance references; no wallet.
WorldState: tick, phase, entities, player movement/action states, vulnerability, mode state, hazard state and RNG state.
InputCommand: participantId, sequence, normalized move vector, aim/facing intent, dash/ability/item/interact action edges.
SimulationEvent: eventId, tick, type, source/target IDs, world position and typed payload.
MatchResult: matchId, terminal status, outcome, participants, authoritative counters, release/rule versions and eligibility origin.

Core API contract:
createMatch(config, validatedContent) returns initial state.
step(state, orderedInputs, fixedTick, capabilities) returns next state and events.
serialize/restore preserve logical state and RNG.
Mode API: initialize, update, handlePlayerEvent, evaluateObjective, calculateScore, determineOutcome.
Engine services expose queries and typed commands (spawn, impulse, status, objective update), not direct wallet/render access.
Implement these as small TypeScript interfaces and pure functions when M1 begins; no general scripting language.

## Movement, dash and contact defaults

| Parameter | Initial value |
|---|---|
| Fixed tick | 50 ms (20 Hz; recovered approximate target) |
| Player circle radius | 0.45 world units |
| Arena radius | 10 units |
| Movement speed | 5 units/s |
| Acceleration | 35 units/s² |
| Input release deceleration | 25 units/s² |
| Dash speed / duration / cooldown | 14 units/s / 0.15 s / 1.2 s |
| Base knockback impulse | 8.5 units/s (D86 playtest candidate) |
| Vulnerability increase / cap | +0.3 per qualifying hit / 2.0 (D86) |
| Vulnerability recovery | 0.05/s after 6 seconds without a hit (D86) |
| Impulse speed cap | 22 units/s |
| Input timeout | 250 ms before neutral movement |
| Standard round / sudden death | 180 s / last 30 s; local M1 preset now 90 s / last 30 s (D25) |
| Reconnect grace | 10 s (recovered example) |

Normalize diagonal movement. Store voluntary movement velocity separately from external impulse so steering cannot instantly erase a hit. Approach desired movement velocity with bounded acceleration; decay impulse with a documented damping parameter (start 4/s). Dash uses last nonzero move direction, or facing when standing; no automatic invulnerability.

Contact resolution separates overlapping circles by penetration, with stable entity-ID ordering and deterministic fallback normal for coincident centers. A qualifying dash contacts a target once per dash ID, not once per tick. Impulse along attacker-to-target normal is baseImpulse × (1 + targetVulnerability) × allowed mode multiplier; clamp final impulse speed. Increase vulnerability after applying that hit. Plain body contact separates without escalating vulnerability in the first prototype.

Use swept circle contact or sufficient deterministic substeps for dash/high-speed travel; a narrow obstacle may not be skipped between ticks. Resolve simultaneous hits from one pre-resolution contact set so iteration order does not award an arbitrary winner. Tick order: validate inputs → update actions → integrate/sweep → resolve contacts → apply hazards/objectives → collect eliminations → evaluate outcome → emit events.

At ring edge, initial support rule eliminates when the player center leaves the playable support region; test and tune edge tolerance explicitly. Visual falling follows elimination and grants no rescue unless a future mode explicitly supports one. Same-tick final eliminations produce a draw. One remaining player wins only after all that tick's eliminations. Zero-player matches cancel. Solo practice can run but does not claim a competitive win.

## Round, map and mode defaults

M1 static ring and spaced spawn points; countdown can be minimal but input is disabled until active. Restart creates new state and resets pending actions/events.
M3 Sky Ring mutation: visibly telegraph edge removal for at least 1 s before loss of support. Sudden death shrinks support toward a minimum playable radius. At hard timeout, unresolved survivors draw; do not rank by entity ID. Mutation timelines use ticks, not client clocks.

King of the Hill proof: fixed central zone, 1 point per uncontested second, first to 60 or highest score at 180 s; equal scores draw. Respawn after 3 s at safe spawns. Bots contest the zone. These are M4 proof defaults.
Boss proof: one original boss with two phases, visible telegraph/recovery, at least one cooperative switch/push-object objective, win after objective completion and lose on team wipe or configured timeout. No loot/purchases required. A second configured encounter variant proves composability.

Implemented 0.13.0: [party-mode contract](PARTY_MODE_CONTRACT.md) specifies multi-team Arena, Cloud King/Tempest co-op profiles, shared rune/core objectives, membership/result validation and current limits. User-requested team and boss work is now active; this does not imply the other M4 gates have passed.

M1 bots perceive current public world state and output ordinary controls. Start with safe-ground steering, target choice and dash when aligned; add reaction delay (250 ms normal) and bounded aim error. No future input knowledge. Later objective/co-op policies share navigation and interaction primitives.

## Host and input policy

The [branch addendum](BRANCH_DESIGN_ADDENDUM.md) retains the original candidate host-option ranges and mobile mockup details. These are not extra M1 controls. Jump/pad-launch and crown-transfer behavior require explicit typed rules when selected; two-currency UI, three boss phases and portrait mockups do not silently replace the written prototype defaults. The explicit phone priority D38 brings portrait/landscape touch controls and real-device readability checks into the current slice; compare the recovered mobile layout without changing authoritative rules.

Public Arena preset: up to 12 total participants, FFA, one life, respawns disabled, standard knockback; target initial tests with four.
M4 local: 1–4 humans, bots fill up to configured capacity. Device joins bind stable seats; disconnect pauses local session and prompts reassignment, never steals another seat.
Initial private/local controls: mode/map, supported count, bot difficulty and simple item/hazard presets. Only expose advanced settings after validation exists. Reject unsupported mode/map pairs, human+bot overflow, impossible team layouts, respawn-in-survival combinations and unbounded durations.
Touch proof uses left joystick + separate dash/ability/item buttons, safe areas and no hover-only controls. Prioritize landscape gameplay; portrait offers deliberate layout or rotate guidance. Phone support is measured in M4.

## UI states to implement incrementally

Boot/loading (progress and recoverable failure) → guest start/tutorial → lobby/mode/settings → countdown → active HUD → elimination/spectate → result → replay.
Later add appearance editor, account-save prompt, progression and catalog. Always support loading error/retry, disconnect/reconnect/cancel, empty/invalid configuration and controller reassignment.
No fake shop balances or fabricated backend success. Offline prototype results are clearly practice results.

## Database and reward contract (M5+)

SQL migrations must establish unique entitlement and reward receipt keys; wallet balance and ledger changes are atomic. Minimum ledger fields: transactionId, userId, signed amount, type, source ID, createdAt, reversalOf when applicable. Result processing stores eligibility, rule version and immutable source evidence.
Global daily challenges derive from server UTC date and seeded rotation; approximately three templates, purchase-free and feasible in eligible modes. Claim is idempotent; late processing uses recorded event period.
Exact provider/schema indexes, guest merge policy and production retention are implementation decisions before those services ship, not M1 dependencies.

