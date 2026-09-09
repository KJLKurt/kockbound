import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {localConfig} from '../shared/content/arena.ts';
import {createMatch,step} from '../shared/simulation/index.ts';
import {CHARACTERS,SKINS,type Skin,type Appearance} from '../shared/content/characters.ts';
test('new roster exports preserve shared bind rig and all ten animations within budget',()=>{
 const read=(path:string)=>JSON.parse(fs.readFileSync(`assets/runtime/${path}/asset.json`,'utf8'));const base=read(CHARACTERS.sprout.path);
 for(const name of ['pebble','wisp'] as const){const meta=read(CHARACTERS[name].path);assert.deepEqual(meta.bones,base.bones);assert.deepEqual(meta.clips,base.clips);assert.ok(meta.triangles<=12000);assert.ok(meta.bytes<1048576);}
});
test('every character and palette has identical authoritative movement and hit behavior',()=>{
 const worlds=(Object.keys(CHARACTERS) as Appearance[]).flatMap(appearance=>(Object.keys(SKINS) as Skin[]).map(skin=>{const c=localConfig(15,2,appearance);c.rules.countdownTicks=0;c.roster[0].skin=skin;return createMatch(c);}));
 for(let tick=0;tick<200;tick++)for(const w of worlds)step(w,[{participantId:'p1',sequence:tick,x:tick<15?1:0,z:0,dash:tick%25===0}]);
 const physical=(w:typeof worlds[number])=>w.players.map(({appearance,skin,...p})=>p);for(const w of worlds)assert.deepEqual(physical(w),physical(worlds[0]));
});
