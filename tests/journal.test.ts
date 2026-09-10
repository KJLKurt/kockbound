import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {RoomJournal} from '../server/game-room/journal.ts';

test('restart writes only unfinished rooms and subsequent startup is read-only',t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'knockbound-journal-'));
  t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const cancelled='{"roomId":"CANCEL","state":"cancelled"}\n';
  const finished='{"roomId":"FINISH","state":"finished"}\n';
  fs.writeFileSync(path.join(directory,'CANCEL.json'),cancelled);
  fs.writeFileSync(path.join(directory,'FINISH.json'),finished);
  fs.writeFileSync(path.join(directory,'WAIT01.json'),JSON.stringify({roomId:'WAIT01',state:'waiting'}));
  const rename=fs.renameSync,renamed:string[]=[];
  t.mock.method(fs,'renameSync',(from:fs.PathLike,to:fs.PathLike)=>{renamed.push(String(to));return rename(from,to);});
  const first=new RoomJournal(directory);
  assert.equal(first.state('WAIT01'),'cancelled');
  assert.deepEqual(renamed,[path.join(directory,'WAIT01.json')]);
  assert.equal(fs.readFileSync(path.join(directory,'CANCEL.json'),'utf8'),cancelled);
  assert.equal(fs.readFileSync(path.join(directory,'FINISH.json'),'utf8'),finished);
  // A terminal archive can be loaded even if the filesystem now refuses mutations.
  t.mock.method(fs,'writeFileSync',()=>{throw Object.assign(new Error('write denied'),{code:'EPERM'});});
  const second=new RoomJournal(directory);
  assert.equal(second.state('WAIT01'),'cancelled');assert.equal(second.state('FINISH'),'finished');
  assert.equal(renamed.length,1);
});

test('failed cancellation persistence fails startup and leaves the waiting record recoverable',t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'knockbound-journal-'));
  t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  const filename=path.join(directory,'WAIT01.json');
  fs.writeFileSync(filename,JSON.stringify({roomId:'WAIT01',state:'waiting'}));
  const rename=t.mock.method(fs,'renameSync',()=>{throw Object.assign(new Error('locked'),{code:'EPERM'});});
  assert.throws(()=>new RoomJournal(directory),{code:'EPERM'});
  assert.equal(JSON.parse(fs.readFileSync(filename,'utf8')).state,'waiting');
  rename.mock.restore();
  assert.equal(new RoomJournal(directory).state('WAIT01'),'cancelled');
  assert.equal(JSON.parse(fs.readFileSync(filename,'utf8')).state,'cancelled');
});
