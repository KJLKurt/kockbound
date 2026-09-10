import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {spawnSync} from 'node:child_process';

test('static builds resolve entrypoints, models and audio at root and project paths', async()=>{
  for (const base of ['/KnockBound/','/']) {
    const build=spawnSync(process.execPath,['tools/build.mjs'],{env:{...process.env,BASE_PATH:base},encoding:'utf8'});
    assert.equal(build.status,0,build.stderr);
    const html=await fs.readFile('dist/index.html','utf8');
    assert.match(html,/data-multiplayer="false"/);
    for (const file of ['client/ui/style.css','client/game/main.js','three/build/three.module.js']) {
      assert.ok(html.includes(`"${base}${file}"`),file);
      await fs.access(`dist/${file}`);
    }
    assert.ok(html.includes(`href="${base}"`));
    for (const [module,relative] of [
      ['client/audio/sound.js','../../assets/runtime/audio.sky-ring/r001/'],
      ['client/rendering/arena-view.js','../../assets/runtime/'],
    ]) {
      const code=await fs.readFile(`dist/${module}`,'utf8');
      assert.ok(code.includes(relative));
      assert.ok(code.includes('import.meta.url'));
      const resolved=new URL(relative,`https://example.test${base}${module}`);
      assert.ok(resolved.pathname.startsWith(`${base}assets/runtime/`));
      await fs.access(`dist/${resolved.pathname.slice(base.length)}`);
    }
  }
});

test('static build rejects invalid base paths',()=>{
  for(const base of ['KnockBound','/KnockBound','/../','/bad"/']){
    const build=spawnSync(process.execPath,['tools/build.mjs'],{env:{...process.env,BASE_PATH:base},encoding:'utf8'});
    assert.notEqual(build.status,0);
    assert.match(build.stderr,/BASE_PATH must/);
  }
});
