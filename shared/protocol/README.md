# shared/protocol

Versioned message schemas and validation. Historical messages: JOIN, INPUT, DASH, ABILITY, EMOTE, PING; WELCOME, PLAYER_JOINED, PLAYER_LEFT, SNAPSHOT, EVENT, ELIMINATED, ROUND_END, ERROR, PONG. Consolidate action edges in ordered input envelopes per architecture.

M2 room-core codec now lives in `messages.ts`: exact ready/input/neutral schemas, bounded UTF-8 packet size, version/release checks and client-visible snapshot/error/cancellation contracts. Snapshot acknowledgements distinguish consumed sequence from the next permissible sequence after reconnect. Real transport and browser decoding/reconciliation remain pending.
