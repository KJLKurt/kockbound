# Sky Ring — first original audio arrangement

Editable master: `score.mjs`, original repository-authored composition and sample synthesis. No third-party samples, music, recordings or voices. 120 BPM, C-major-family harmony, 32 bars / 64 seconds, 22,050 Hz mono PCM per stem. Harmony carries plucked melody and soft pad; rhythm adds bass/percussion; spark adds the final-survivor ostinato. The second half varies melody/register. Circular delay tails cross the loop seam.

`pnpm build:audio` reproducibly renders three stems and fifteen sound effects/variants, checks peak headroom, and writes SHA-256/PCM metrics in the runtime manifest. `pnpm preview:audio` makes a 24-second offline arrangement preview in tests/evidence/M3-audio. This is not a recorded browser session. The current runtime uses universally decodable WAV masters; compressed runtime exports and a more detailed listening/mix pass remain pending. Total bank 8,860,490 bytes. No first-play compressed-transfer claim.

Current status: **mix review pending**. Browser decoding, volume/mute persistence and file checks passed. No headphone/speaker listening approval, recorded crowded-match listening or final musical quality approval is claimed. Tune instruments, arrangement and effects from actual listening; retaining procedural source does not imply the first render is finished art.
