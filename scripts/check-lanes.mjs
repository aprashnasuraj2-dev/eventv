// EventV v2 topic-lane ownership guard. CI only; does not alter other topics.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const {lanes}=JSON.parse(fs.readFileSync('data/worker-lanes-v2.json','utf8'));
const seen=new Set();
for(const l of lanes){
 assert.match(l.lane,/^[A-E]$/);assert.ok(Number.isInteger(l.min)&&Number.isInteger(l.max));
 for(let n=l.min;n<=l.max;n++){assert.ok(n>=1&&n<=200&&!seen.has(n),'Overlapping/invalid topic '+n);seen.add(n);}
}
assert.equal(seen.size,200,'Every ID 1..200 requires exactly one owner');
const branch=process.env.GITHUB_HEAD_REF||'';
if(!branch || !branch.startsWith('eventv/topic-')){console.log('Lane partition valid; non-topic branch');process.exit(0);}
// Historical numeric lane PRs are preserved during migration. New PRs MUST use letters.
if(/^eventv\/topic-\d{3}-lane-[1-5]$/.test(branch)){
 console.log('Legacy pre-v2 topic branch — migrate to designated owner on fresh main before completion');process.exit(0);
}
const match=branch.match(/^eventv\/topic-(\d{3})-lane-([A-E])$/);
assert.ok(match,'New topic branches require eventv/topic-NNN-lane-A..E');
const id=Number(match[1]),lane=match[2],owner=lanes.find(x=>id>=x.min&&id<=x.max);
assert.equal(owner?.lane,lane,'Topic '+id+' is owned by '+owner?.lane+', not '+lane);
const legacy=JSON.parse(fs.readFileSync('data/events-50.json','utf8')).events;
let topic=id<=50?legacy[id-1]:null;
if(id>50){
 const f='data/topics/'+String(id).padStart(3,'0')+'.json';
 assert.ok(fs.existsSync(f),'Missing independent per-ID topic manifest '+f);
 topic=JSON.parse(fs.readFileSync(f,'utf8'));
}
assert.equal(topic.rank,id,'Topic identity mismatch');
const slug=topic.slug,nnn=String(id).padStart(3,'0');
const base=process.env.BASE_SHA;
if(!base){console.log('Lane ownership valid; no diff base available');process.exit(0);}
let changed=[];
try{changed=execFileSync('git',['diff','--name-only',base+'...HEAD'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);}
catch(e){throw Error('Cannot verify changed files; fail closed: '+e.message);}
const permitted=p=>p==='data/topics/'+nnn+'.json'||p==='data/approvals/'+nnn+'.json'||
 p==='content/pilots/'+slug+'.html'||p.startsWith('events/'+slug+'/')||
 p.startsWith('assets/'+slug)||p.startsWith('research/topic-'+nnn)||
 p.startsWith('tests/topic-'+nnn)||p.startsWith('tests/'+slug)||
 p.startsWith('scripts/topic-'+nnn)||p.startsWith('scripts/'+slug)||p.startsWith('docs/topics/'+nnn+'/');
for(const p of changed)assert.ok(permitted(p),'Cross-lane or shared file forbidden in topic PR: '+p);
assert.ok(changed.length>0,'Empty topic PR');
console.log('Lane '+lane+' owns #'+id+'; '+changed.length+' isolated changed files verified.');
