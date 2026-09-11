# Party modes — compatibility 0.13.0

## Configuration and ownership

Registered handlers in `shared/simulation/modes.ts` select arena, teams or boss. Shared `PartyOptions` adds modeId, totalCount, teamSize and bossVariant to room creation and solo configuration. Total capacity is bounded at12; human count must not exceed capacity. The UI offers2–12 participants. Offline controls still belong to one human; other participants are explicitly bots. The same simulation and authored profiles power both server adapters. No remote executable configuration or reward claims are introduced.

Team Arena requires equal teams of2–6 members and at least2 teams. Supported examples include2v2v2,3v3v3v3,2v2v2v2v2v2,4v4v4 and6v6. A validated integer teamId is assigned round-robin in seat/join order, distributing early human seats across teams. Manual seat swapping is not implemented. Configurations and membership lock when the existing room countdown begins.

## Team rules

Dash, shovel, projectile and owned bomb/pod attacks do not apply impulse, vulnerability or stun to other members of the same team. Ordinary body separation remains, and an owner's own explosives can still affect the owner. Neutral/environmental hazards affect everyone. Bots target opponents using ordinary inputs. One life; no respawn. Last surviving team wins even with several survivors; simultaneous complete wipes and unresolved timeout draw. Dead members share their team's eventual victory. Team name text and floor-ring colors identify teams independently of cosmetic colors.

Result extends the existing envelope with optional winnerTeamId. Team/co-op wins have null winnerId; boss loss uses outcome `defeat`. Team identity, boss snapshots and results are validated before rendering. Prediction advances only the local player's movement; it does not advance boss objectives, attacks or outcomes. Compatibility versions all move to0.13.0.

## Cloud King co-op

All participants belong to team0. The encounter has two phases, one life per ally, and a five-minute timeout. Team wipe or timeout loses; completing both phases wins. A final simultaneous wipe takes precedence over victory.

Stand within1.25m of each of three gold rune centers for20 cumulative ticks (one second). Rune charge latches so a surviving lone ally can complete the task. Once all three are charged, the shield opens and a shared energy core appears. Push it with movement or dash it into the north target at(0,-6), within1.35m. Core contact is checked on ordinary movement substeps; each player's dash can boost it only once per dash ID. Its speed is capped16m/s and damping2/s. A core falling off supported ground resets at(0,2), preventing a soft lock. After delivery the boss recoils for100 ticks (five seconds), then the runes reset.

Authored profiles live in [cloud-king.ts](../content/bosses/cloud-king.ts). Cloud King needs2 cores per phase for up to4 participants; Tempest King needs3. Add one core per phase for each additional group of up to4 participants. Up to3 attack targets scale with living participants. Cloud King uses130-tick attack intervals,36-tick windup and base push6; Tempest uses105/30/7. Phase2 shortens intervals by20 ticks and alternates targeted boulders with a wind sweep. All attacks have a visible warning before a single bounded strike, followed by downtime; core delivery interrupts a pending attack. Boulders affect a2m radius; sweep lanes are2.6m wide and16m long. Both respect temporary mass and accumulated vulnerability and apply0.3s stun. Warning and impact sounds reuse the original audio bank.

The boss arena retains its floor: falling-tile hazards and the platform-remover item are filtered from this mode so objectives cannot become inaccessible. Other selected falling items, falling rocks and wind remain. Cooperative bots split rune jobs, move behind the core, dash it toward the target and avoid telegraphs using ordinary input. They have no secret damage, objective completion or invulnerability privileges.

## Presentation and current limits

The original cloud/beard/crown/glowing-core concept informs a repository-authored procedural boss in `client/rendering/boss-view.ts`. Its geometry and animation are presentation only. It is a playable encounter visual, not a claim that the original detailed concept has been reproduced as a finished Blender character. Procedural source is reproducible and recorded in the asset ledger. No new external asset or audio download was added.

Match setup persists mode/count/team size/encounter locally. Lobby copy distinguishes bots from humans; online creation offers human seats up to the chosen capacity. Team HUD/result and co-op objective/warning/result displays use authoritative state. Desktop and phone-sized rendering require visual QA; actual phone frame-time and human cooperation checks remain distinct from simulation and socket tests.

This delivers team and boss modes requested by the user. It does not complete all M4: same-device2–4 human/controller joining, King of the Hill, the second map proof and full physical-device gates remain open. Cloudflare runtime/public-hosting limitations remain unchanged. GitHub Pages can run these modes with bots; separate-phone shared play requires the online backend.
