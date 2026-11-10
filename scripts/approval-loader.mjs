// Independent topic approvals coexist with the original immutable approvals registry.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {events} from './catalog.mjs';
const all=JSON.parse(fs.readFileSync('data/index-approved.json','utf8')).approved||[];
const dir='data/approvals';
if(fs.existsSync(dir))for(const filename of fs.readdirSync(dir).filter(f=>/^\\d{3}\\.json$/.test(f)).sort()){
 const id=Number(filename.slice(0,3));
 assert.ok(id>50&&id<=200,'Per-topic approval outside extension range '+id);
 const entry=JSON.parse(fs.readFileSync(dir+'/'+filename,'utf8'));
 const entries=Array.isArray(entry.approved)?entry.approved:[entry];
 const topic=events.find(e=>e.rank===id);
 assert.ok(topic,'Approval for absent topic '+id);
 for(const a of entries){assert.equal(a.slug,topic.slug,'Approval slug/ID mismatch '+id);all.push(a);}
}
const seen=new Set();
for(const a of all){
 const key=a.slug+'|'+a.page_type;
 assert.ok(!seen.has(key),'Duplicate editorial approval '+key);seen.add(key);
 assert.ok(events.some(e=>e.slug===a.slug),'Orphan approved slug '+key);
}
export const approvals=all;
