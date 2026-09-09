import {test} from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import fs from 'node:fs/promises';
process.argv[2]='0';
const {server}=await import('../tools/dev-server.mjs');
if(!server.listening)await once(server,'listening');
const base=`http://127.0.0.1:${server.address().port}`;
test('Local server serves playable modules and rejects encoded traversal outside public roots',async()=>{
  try{
    const page=await fetch(base);assert.equal(page.status,200);assert.match(await page.text(),/Knockbound/);
    const module=await fetch(base+'/client/game/main.ts');assert.equal(module.status,200);assert.match(module.headers.get('content-type'),/javascript/);assert.doesNotMatch(await module.text(),/let session.*appearance\s*:/);
    const audioRoute='/assets/runtime/audio.sky-ring/r001/harmony.wav';
    const encoded=await fetch(base+audioRoute,{headers:{'Accept-Encoding':'gzip'}});assert.equal(encoded.headers.get('content-encoding'),'gzip');assert.equal(encoded.headers.get('vary'),'Accept-Encoding');
    assert.deepEqual(Buffer.from(await encoded.arrayBuffer()),await fs.readFile(new URL('..'+audioRoute,import.meta.url)));
    const identity=await fetch(base+audioRoute,{headers:{'Accept-Encoding':'gzip;q=0, identity'}});assert.equal(identity.headers.get('content-encoding'),null);assert.equal((await identity.arrayBuffer()).byteLength,2822444);
    for(const route of ['/qa-context.ts','/qa','/qa-runner.ts','/tools/visual-qa.ts','/package.json','/HANDOFF.md','/client/%2e%2e%2fpackage.json','/client/%2e%2e%2f.env'])assert.ok([403,404].includes((await fetch(base+route)).status),route);
  }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});

