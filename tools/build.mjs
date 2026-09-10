import fs from 'node:fs/promises';
import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
const root = path.resolve(import.meta.dirname,'..'), out = path.join(root,'dist');
const basePath = process.env.BASE_PATH || '/';
if (!/^\/(?:[A-Za-z0-9._-]+\/)*$/.test(basePath) || basePath.split('/').some(part=>part==='.'||part==='..')) {
  throw new Error('BASE_PATH must be / or a path such as /Knockbound/ (with leading and trailing slashes).');
}
await fs.mkdir(out,{recursive:true});
async function copyTree(relative, destination=relative) {
  for (const entry of await fs.readdir(path.join(root,relative),{withFileTypes:true})) {
    const from=path.join(relative,entry.name),to=path.join(destination,entry.name);
    if(entry.isDirectory()) await copyTree(from,to);
    else if(!entry.name.endsWith('.md')) {
      await fs.mkdir(path.dirname(path.join(out,to)),{recursive:true});
      let data=await fs.readFile(path.join(root,from));
      if(from.endsWith('.ts')) data=Buffer.from(stripTypeScriptTypes(data.toString(),{mode:'strip'}).replaceAll('.ts\'', '.js\'').replaceAll('.ts"','.js"'));
      await fs.writeFile(path.join(out,to.replace(/\.ts$/,'.js')),data);
    }
  }
}
await copyTree('client'); await copyTree('shared'); await copyTree('assets/runtime');
await copyTree('node_modules/three/build','three/build'); await copyTree('node_modules/three/examples/jsm','three/examples/jsm');
await fs.copyFile(path.join(root,'node_modules/three/LICENSE'),path.join(out,'three/LICENSE'));
await fs.writeFile(path.join(out,'index.html'),(await fs.readFile(path.join(root,'index.html'),'utf8')).replaceAll('.ts"','.js"').replaceAll('"/','"'+basePath));
console.log('Built static game in dist/ (serve over HTTP).');
