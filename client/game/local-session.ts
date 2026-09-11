import type {Appearance,Skin} from '../../shared/content/characters.ts';
import type {HazardId} from '../../shared/content/hazards.ts';
import type { Input, World } from '../../shared/game-types/index.ts';
import { createMatch, step } from '../../shared/simulation/index.ts';
import { botInputs } from '../../shared/simulation/bots.ts';
import { localConfig } from '../../shared/content/arena.ts';
import type {ItemId} from '../../shared/content/items.ts';
import {configureParty} from '../../shared/content/party.ts';
import type {PartyOptions} from '../../shared/game-types/index.ts';

export class LocalSession {
  world: World;
  previous: World;
  accumulator = 0;
  overruns = 0;
  paused = false;
  constructor(seed: number, count = 4, appearance: Appearance = 'sprout',items:ItemId[]=[],hazards:HazardId[]=[],skin:Skin='classic',party:PartyOptions={}) {
    const config=localConfig(seed,count,appearance);config.roster[0].skin=skin;if(items.length)config.items=items;if(hazards.length)config.hazards=hazards;
    configureParty(config,party);
    this.world = createMatch(config); this.previous = structuredClone(this.world);
  }
  advance(seconds: number, input: () => Input, onStep: (world: World) => void): number {
    if (this.paused || this.world.phase === 'results') return 1;
    this.accumulator += Math.min(.25,Math.max(0,seconds));
    let steps = 0;
    while (this.accumulator+1e-9 >= .05 && steps < 5) {
      this.previous = structuredClone(this.world);
      step(this.world,[input(),...botInputs(this.world)]); this.accumulator -= .05; steps++; onStep(this.world);
    }
    if (this.accumulator >= .05) { this.accumulator = 0; this.overruns++; }
    return Math.max(0,this.accumulator/.05);
  }
}
