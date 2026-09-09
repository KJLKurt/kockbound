# client/audio

Sound events, music layers, mixing and user volume settings. No simulation randomness or outcome authority.

`sound.ts` loads the original Sky Ring bank, unlocks AudioContext on pointer/keyboard input, plays aligned 64-second music stems, transitions on two-second bar boundaries and maps authoritative events to sound. It deduplicates event IDs, uses three dash/hit/ring-out variants, stereo placement, a 20-voice logical budget with brief release tails, cue-driven music ducking and a final compressor. Authoritative simulation is unchanged.

Master/music/SFX sliders and mute persist under `knockbound.audio`, clamp hostile storage values and degrade gracefully when storage/audio is unavailable. Hidden tabs mute; local pause lowers music. Failed sound loading cannot block gameplay. Review bank provenance/source under assets/source/audio/sky-ring and actual evidence under tests/evidence/M3-audio. Headphone/speaker review, compressed exports and final mix polish remain pending.
