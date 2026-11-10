// EventV catalog v2: immutable legacy 50 + independently researched extensions.
// No implicit topic discovery or publication; absent entries are not fabricated.
import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = p => JSON.parse(fs.readFileSync(p,'utf8'));
const legacy = read('data/events-50.json');
const extension = read('data/events-extra.json');
const LEGACY_COUNT = 50;
const slugRE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isoDate = s => {
  if (s === null) return true;
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.valueOf()) && d.toISOString().slice(0,10) === s;
};
assert.equal(legacy.events.length, LEGACY_COUNT, 'Preserve all 50 legacy event records');
assert.equal(extension.schema_version, 2, 'Unexpected extended catalog schema');
assert.ok(Array.isArray(extension.events), 'Extension events must be an array');
assert.ok(extension.events.length <= 150, 'Topic ID must not exceed 200');
// Sparse independent per-topic manifests let five ranges advance without inventing lower IDs.
const topicDir='data/topics';
const topicFiles=fs.existsSync(topicDir)?fs.readdirSync(topicDir).filter(f=>/^\d{3}\.json$/.test(f)).sort():[];
const independent=topicFiles.map(f=>{
 const e=read(topicDir+'/'+f);
 assert.equal(String(e.rank).padStart(3,'0')+'.json',f,'Manifest filename/rank mismatch '+f);
 assert.ok(e.rank>LEGACY_COUNT&&e.rank<=200,'Independent ID outside extension range '+f);
 return e;
});
const events=[...legacy.events,...extension.events,...independent].sort((a,b)=>a.rank-b.rank);
const ids = new Set(), slugs = new Set(), canonical = new Set();
for (const [i,e] of events.entries()) {
  const id=e.rank;
  assert.ok(Number.isInteger(id)&&id>=1&&id<=200,'Topic ID out of bounds '+id);
  if(i<LEGACY_COUNT) assert.equal(id,i+1,'Legacy topic ID order must remain unchanged');
  assert.ok(!ids.has(id),'Duplicate topic ID '+id);
  assert.ok(typeof e.name === 'string' && e.name.trim().length >= 5, 'Missing event name '+id);
  assert.ok(slugRE.test(e.slug), 'Invalid slug at '+id);
  assert.ok(!slugs.has(e.slug), 'Duplicate event slug '+e.slug);
  slugs.add(e.slug);ids.add(e.rank);
  assert.ok(Array.isArray(e.facets) && e.facets.length === 5 && e.facets.every(x=>typeof x==='string'&&x.trim().length>=8), 'Five meaningful facets required '+id);
  assert.ok(Array.isArray(e.geo) && e.geo.length > 0, 'Region list required '+id);
  assert.ok(typeof e.job==='string' && e.job.trim().length>=25, 'Differentiated job required '+id);
  assert.ok(typeof e.source==='string' && /^https:\/\//.test(e.source), 'Official-source candidate URL required '+id);
  assert.ok(isoDate(e.start) && isoDate(e.end), 'Invalid ISO date '+id);
  assert.ok(!e.start || !e.end || e.start <= e.end, 'Reversed event dates '+id);
  const url = 'https://aafnaipatro.com/events/'+e.slug+'/';
  assert.equal(e.canonical_root,url,'Canonical mismatch '+id);
  assert.ok(!canonical.has(url),'Duplicate canonical '+url);
  canonical.add(url);
  if (id>LEGACY_COUNT) {
    assert.ok(typeof e.verified_on==='string' && isoDate(e.verified_on) && e.verified_on !== null, 'Extension source verification date required '+id);
    assert.ok(['confirmed','unannounced','research-needed','rule-derived','seasonal-window'].includes(e.date_status),'Invalid date status '+id);
    assert.ok(['draft-research','approved'].includes(e.state), 'Invalid editorial state '+id);
    assert.ok(e.source_notes && typeof e.source_notes==='string' && e.source_notes.length >= 40,'Source evidence and uncertainty required '+id);
    assert.ok(e.name.toLowerCase().includes('202') || e.source_notes.includes('recurring'), 'Event edition or recurrence must be explicit '+id);
  }
}
export {events, extension, independent, LEGACY_COUNT};
