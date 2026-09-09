import fs from 'node:fs';
import path from 'node:path';
import type { RoomReceipt } from './authority.ts';

type JournalEntry = { roomId: string; state: 'waiting' | 'finished' | 'cancelled'; receipt?: RoomReceipt };
/** Local-adapter journal. A Worker adapter will use Durable Object storage instead. */
export class RoomJournal {
  private directory: string;
  private entries = new Map<string,JournalEntry>();
  constructor(directory: string) {
    this.directory=path.resolve(directory);fs.mkdirSync(this.directory,{recursive:true});
    const files=fs.readdirSync(this.directory).filter(f=>f.endsWith('.json'));
    if(files.length>4096)throw new Error('Room journal capacity reached. Archive old local test records.');
    for(const name of files){
      const entry:JournalEntry=JSON.parse(fs.readFileSync(path.join(this.directory,name),'utf8'));
      if(!/^[A-Z0-9]{6}$/.test(entry.roomId) || name!==`${entry.roomId}.json` || !['waiting','finished','cancelled'].includes(entry.state))throw new Error('Invalid local room journal.');
      if(entry.state==='waiting')entry.state='cancelled';
      this.entries.set(entry.roomId,entry);
      if(entry.state==='cancelled')this.write(entry);
    }
  }
  state(roomId:string):JournalEntry['state']|undefined{return this.entries.get(roomId)?.state;}
  create(roomId:string){if(this.entries.size>=4096)throw new Error('Local room journal capacity reached');if(this.entries.has(roomId))throw new Error('Room identity already recorded');this.write({roomId,state:'waiting'});}
  finish(roomId:string,receipt:RoomReceipt){const current=this.entries.get(roomId);if(current?.state!=='waiting')return;this.write({roomId,state:receipt.status==='finished'?'finished':'cancelled',receipt});}
  private write(entry:JournalEntry){
    if(!/^[A-Z0-9]{6}$/.test(entry.roomId))throw new Error('Invalid room identity');
    const file=path.join(this.directory,`${entry.roomId}.json`),temporary=file+'.tmp';
    fs.writeFileSync(temporary,JSON.stringify(entry));fs.renameSync(temporary,file);this.entries.set(entry.roomId,structuredClone(entry));
  }
}
