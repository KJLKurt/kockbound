# Knockbound

Playable solo game and local room preview • M3 presentation in progress.

Knockbound (formerly Push Arena) is a stylized 3D browser party-action game with planar authoritative simulation, satisfying knockback, competitive and cooperative rulesets, local players and bots, and modular content.

Start with [HANDOFF.md](HANDOFF.md), then [AGENTS.md](AGENTS.md).
The canonical specification is the set of documents indexed below; archived conversations are evidence rather than competing specifications.

## Play locally

Use **Match setup** to choose free-for-all, teams (including2v2v2 and3v3v3v3), or boss co-op, with up to12 participants. Solo uses one human plus bots. For co-op, charge the three gold runes and dash the energy core into the north target. [Party rules and online limits](docs/PARTY_MODE_CONTRACT.md).

For a hosted solo demo and phone testing, follow the [GitHub Actions / GitHub Pages deployment guide](docs/DEPLOYMENT.md). The included workflow builds for your repository subdirectory and publishes pushes to `main` after you enable Pages with GitHub Actions.

Use Node **24.19.0** and pnpm **11.19.0**. No cloud account or credentials are needed.

```powershell
pnpm install --frozen-lockfile --ignore-scripts
pnpm dev
```

Open **http://127.0.0.1:4173**. Choose Sprout or Lumi and select **Let's play**. Move with **WASD/arrows**, dash with **Space**, pause with **Escape**. Stay on the island and push the three bots off. Repeated hits increase knockback. After one minute the island shrinks; rounds end within 90 seconds. Results offer immediate replay. Focus loss pauses local play and clears input.

On this Codex machine, if the executables are not on PATH:

```powershell
$gameNode = 'C:/Users/Kurt/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
$gamePnpm = 'C:/Users/Kurt/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm.cmd'
& $gamePnpm install --frozen-lockfile --ignore-scripts
& $gameNode tools/dev-server.mjs 4177
```

Open **http://127.0.0.1:4177** for that command. Keep the terminal running; Ctrl+C stops it. The server binds only to this machine.

## Checks and static build

### Play on a phone on the same Wi-Fi

Run `pnpm dev:phone` (or the bundled Node executable with `tools/dev-server.mjs 4183 --lan`). Open the printed **Phone on the same network** URL in the phone browser. This explicit command serves the solo game to your local network; keep the computer/server running. It does not publish the game or enable LAN multiplayer. The current session address is **http://192.168.12.250:4183**; addresses can change. The computer reached this address successfully; actual phone/firewall reachability still needs verification.

Drag the left joystick and tap **Dash** with your right thumb. Releasing movement stops input; dash retains your last direction. Portrait and landscape layouts are supported. Coarse-pointer devices default to lower graphics, with saved overrides in Settings. Touch/browser device checks remain in progress; see [phone evidence](tests/evidence/M3-phone/README.md).

The M2 WebSocket development backend can be started with `pnpm dev:online` at **http://127.0.0.1:4179**. Choose **Room play**, create a room for 1–4 humans (remaining seats are bots), and open its player link in another browser tab to join. All reserved humans must join before countdown. Escape pauses only your controls; the shared room continues. After a result, return to room setup for another match. This loopback backend requires no account and is not publicly hosted. Restarted unfinished test rooms are cancelled using `.knockbound/room-journal/`. See [browser room evidence and limitations](tests/evidence/M2-client/README.md).

```powershell
pnpm test
pnpm typecheck
pnpm build
pnpm preview
```

`preview` serves the compiled static build at **http://127.0.0.1:4178**. Serve `dist/` over HTTP; opening `index.html` directly as a file does not support module loading. Pinned Node strips TypeScript syntax; the separate typecheck is required. There is no UI framework or CDN dependency. Keyboard and touch controls are implemented; gamepad support remains planned. Original music and SFX start after your first tap/click; Settings provides saved master/music/SFX volume and mute. The audio mix is still under review.

| Document | Purpose |
|---|---|
| [Game design](docs/GAME_DESIGN.md) | Product, mechanics, modes, progression and scope |
| [Architecture](docs/TECHNICAL_ARCHITECTURE.md) | Boundaries, local/online authority, protocol, persistence |
| [Content system](docs/CONTENT_SYSTEM.md) | Definitions, ownership, validation, release lifecycle |
| [Art direction](docs/ART_DIRECTION.md) | Character/world/UI identity and visual standards |
| [Concept art gallery](docs/CONCEPT_ART_GALLERY.md) | All ten recovered historical concept sheets |
| [Branch design details](docs/BRANCH_DESIGN_ADDENDUM.md) | Boss attacks, character alternatives, modes, host presets, social/mobile/event details and reconciliations |
| [Blender pipeline](docs/BLENDER_PIPELINE.md) | Authoring, rig, export, budgets and QA |
| [Character asset contract](docs/CHARACTER_ASSET_CONTRACT.md) | Proved prototype rig, scale, sockets, clips and runtime conventions |
| [Audio direction](docs/AUDIO_DIRECTION.md) | Music, sound events and mixing |
| [Implementation specification](docs/IMPLEMENTATION_SPEC.md) | Concrete contracts and starting defaults |
| [Milestones](docs/MILESTONES.md) | Dependencies, deliverables and stop gates |
| [Acceptance criteria](docs/ACCEPTANCE_CRITERIA.md) | Measurable verification and playtest evidence |
| [Decisions](docs/DECISIONS.md) | Established choices, new defaults and unresolved choices |
| [Source coverage](docs/SOURCE_COVERAGE.md) | All 89 original sections and later amendments |
| [Status](docs/STATUS.md) | Current handoff state and next action |

Repository folders are ownership boundaries. The bootstrap checker (`node tools/validate-bootstrap.mjs`) checks links, coverage and metadata separately from gameplay tests. The original character pipeline also runs: [asset commands and browser preview](tools/asset-pipeline/README.md).

Asset tooling remains separately pinned and isolated. No deployment, cloud resource, purchase, account flow or payment integration has been created. See [current status](docs/STATUS.md) for actual acceptance evidence and unfinished work.


Cloudflare adapter development: see [Worker setup and known runtime limitation](server/worker/README.md). Its local emulator currently crashes on this Windows host; use the working Node preview above. The Worker has not been deployed or runtime-validated.


