import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const revision=process.argv[2]??'r001';
if(!['r001','r002'].includes(revision))throw new Error('Unknown revision');
const port=Number(process.argv[3]??4173);
const asset=path.resolve(here,'../../assets/runtime/character.sprout-prototype',revision);
const routes=new Map([['/',path.join(here,'preview.html')],['/sprout-prototype.glb',path.join(asset,'sprout-prototype.glb')],['/asset.json',path.join(asset,'asset.json')],['/favicon.ico',null]]);
const three=path.join(here,'node_modules/three');
http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost'); let file=routes.get(url.pathname);
  if(url.pathname.startsWith('/three/')) {
    const relative=decodeURIComponent(url.pathname.slice(7));
    const candidate=path.resolve(three,relative);
    if(candidate.startsWith(three+path.sep)) file=candidate;
  }
  if(!file||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}
  res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.glb':'model/gltf-binary','.json':'application/json'})[path.extname(file)]??'application/octet-stream');
  res.setHeader('Cache-Control','no-store');fs.createReadStream(file).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log(`Asset preview http://127.0.0.1:${port} (${revision}, loopback only)`));
