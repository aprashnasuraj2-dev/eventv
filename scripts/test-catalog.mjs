import assert from 'node:assert/strict';
import fs from 'node:fs';
import {events,extension,LEGACY_COUNT} from './catalog.mjs';
assert.equal(LEGACY_COUNT,50);
assert.equal(events.length,50+extension.events.length);
assert.equal(events[40].rank,41);
assert.equal(events[40].slug,'fifa-womens-world-cup-2027');
assert.equal(events[49].rank,50);
assert.ok(events.length<=200);
assert.equal(new Set(events.map(x=>x.slug)).size,events.length);
const raw=fs.readFileSync('data/events-50.json','utf8');
assert.equal(JSON.parse(raw).events.length,50);
const approvals=JSON.parse(fs.readFileSync('data/index-approved.json','utf8')).approved;
assert.ok(approvals.length>=35,'Do not downgrade baseline approvals');
for(const a of approvals) assert.ok(events.some(e=>e.slug===a.slug),'Approval orphan: '+a.slug);
// Approved Eurovision hub must be indexable without exposing its unfinished spokes.
const routeLines=fs.readFileSync('research/routes-200.csv','utf8').split(/\r?\n/);
const euro=routeLines.filter(line=>line.startsWith('"eurovision-2027",'));
assert.equal(euro.length,4,'Eurovision must retain exactly four route records');
const hub=euro.find(line=>line.includes(',"hub",'));
assert.ok(hub?.includes('"index,follow,max-image-preview:large","pilot-index-ready"'),'Approved Eurovision hub route must match approval');
for(const spoke of euro.filter(line=>!line.includes(',"hub",'))) {
  assert.ok(spoke.includes('"noindex,follow","research-draft"'),'Unfinished Eurovision spoke must remain noindex');
}
console.log('Catalog extension validation passed: '+events.length+' ordered unique topics; '+approvals.length+' approvals preserved.');
