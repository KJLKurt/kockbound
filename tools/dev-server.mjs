import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {gzip} from 'node:zlib';
import {promisify} from 'node:util';
const compress=promisify(gzip);
import { stripTypeScriptTypes } from 'node:module';
const isBuild = process.argv.includes('--dist');
const visualQA = process.argv.includes('--qa') && !isBuild;
const root = path.resolve(import.meta.dirname,isBuild ? '../dist' : '..');
const port = Number(process.argv[2] || 4173);
const lan=process.argv.includes('--lan');
if(lan&&process.argv.includes('--multiplayer'))throw new Error('LAN preview currently supports solo play only.');
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.ts':'text/javascript', '.json':'application/json', '.glb':'model/gltf-binary', '.png':'image/png', '.svg':'image/svg+xml', '.wav':'audio/wav' };
export const server = http.createServer(async (req,res) => {
  try {
    if (transport && await transport.handleHttp(req,res)) return;
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(visualQA && ['/qa','/qa-runner.ts','/qa-context.ts'].includes(pathname)){
      const filename=pathname==='/qa'?'visual-qa.html':pathname==='/qa-context.ts'?'context-qa.ts':'visual-qa.ts';let data=await fs.readFile(path.join(root,'tools',filename),'utf8');
      if(filename.endsWith('.ts'))data=stripTypeScriptTypes(data,{mode:'strip'});
      res.writeHead(200,{'Content-Type':filename.endsWith('.html')?'text/html':'text/javascript','Cache-Control':'no-store'}).end(data);return;
    }
    let relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!isBuild && relative.startsWith('three/')) relative = 'node_modules/three/'+relative.slice(6);
    if (!/^(index\.html|client\/|shared\/|assets\/runtime\/|node_modules\/three\/|three\/)/.test(relative)) { res.writeHead(404).end(); return; }
    const file = path.resolve(root,relative);
    if (!file.startsWith(root+path.sep)) { res.writeHead(403).end(); return; }
    const canonical = path.relative(root,file).split(path.sep).join('/');
    if (!/^(index\.html$|client\/|shared\/|assets\/runtime\/|node_modules\/three\/|three\/)/.test(canonical)) { res.writeHead(403).end(); return; }
    let data = await fs.readFile(file);
    if (canonical==='index.html' && transport) data=Buffer.from(data.toString().replace('data-multiplayer="false"','data-multiplayer="true"'));
    if(canonical==='index.html'&&visualQA&&new URL(req.url,'http://localhost').searchParams.has('context-qa'))data=Buffer.from(data.toString().replace('</body>','<script type="module" src="/qa-context.ts"></script></body>'));
    if (file.endsWith('.ts')) data = Buffer.from(stripTypeScriptTypes(data.toString(),{ mode:'strip' }));
    const headers={'Content-Type':mime[path.extname(file)]??'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Accept-Encoding'};
    const acceptsGzip=String(req.headers['accept-encoding']??'').split(',').some(entry=>/^gzip\s*(?:;\s*q\s*=\s*(?:1(?:\.0*)?|0?\.\d*[1-9]\d*))?\s*$/i.test(entry.trim()));
    if(data.length>1024&&acceptsGzip&&['.html','.css','.ts','.js','.json','.glb','.wav'].includes(path.extname(file))){data=await compress(data);headers['Content-Encoding']='gzip';}
    res.writeHead(200,headers).end(data);
  } catch { res.writeHead(404).end('Not found'); }
});
let transport = null;
if(process.argv.includes('--multiplayer')) {
  const {LocalRoomTransport}=await import('../server/game-room/local-transport.ts');
  transport=new LocalRoomTransport(server,{journalDirectory:path.resolve(import.meta.dirname,'../.knockbound/room-journal')});
  server.on('close',()=>void transport.close());
}
server.listen(port,lan?'0.0.0.0':'127.0.0.1',()=>{
  const actual=server.address().port;console.log(`Knockbound playable at http://127.0.0.1:${actual}`);
  if(lan)for(const adapters of Object.values(os.networkInterfaces()))for(const adapter of adapters??[])if(adapter.family==='IPv4'&&!adapter.internal)console.log(`Phone on the same network: http://${adapter.address}:${actual}`);
});
