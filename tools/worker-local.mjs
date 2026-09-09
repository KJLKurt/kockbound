import {spawnSync,spawn} from 'node:child_process';
import path from 'node:path';
const built=spawnSync(process.execPath,['tools/build.mjs'],{stdio:'inherit'});
if(built.status!==0)process.exit(built.status??1);
const check=process.argv.includes('--check');
const args=check?['deploy','--dry-run','--outdir','.knockbound/worker-build']:['dev','--local','--var','ENABLE_ROOMS:true','--log-level','error'];
const child=spawn(process.execPath,['node_modules/wrangler/bin/wrangler.js',...args],{stdio:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false',WRANGLER_LOG_PATH:path.resolve('.knockbound/wrangler.log')}});
child.on('exit',code=>process.exit(code??1));
child.on('error',error=>{console.error(error.message);process.exit(1);});
