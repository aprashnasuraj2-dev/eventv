import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const slug='icc-cricket-world-cup-2027';
const source=readFileSync('content/pilots/'+slug+'.html','utf8');
const generated=readFileSync('events/'+slug+'/index.html','utf8');
const routes=readFileSync('research/routes-200.csv','utf8');
const registry=JSON.parse(readFileSync('data/index-approved.json','utf8'));
test('Topic 43 generated staging hub exactly matches original browser tool',()=>{
 assert.equal(generated,source,'Build emitted generic scaffold instead of Topic 43 original hub');
 assert.match(generated,/<meta\s+name="robots"\s+content="noindex,follow"/i);
 assert.match(generated,/https:\/\/aafnaipatro.com\/events\/icc-cricket-world-cup-2027\//);
 assert.match(generated,/id="calculate"/);
});
test('Topic 43 remains unapproved and all four routes remain noindex',()=>{
 assert.ok(!(registry.approved||[]).some(x=>x.slug===slug),'Staging integration must not grant editorial approval');
 const rows=routes.split('\n').filter(x=>x.startsWith('"'+slug+'",'));
 assert.equal(rows.length,4);
 for(const row of rows)assert.match(row,/"noindex,follow","research-draft"/);
 for(const phase of ['planning','during','after']){
  const html=readFileSync('events/'+slug+'/'+phase+'/index.html','utf8');
  assert.match(html,/<meta name="robots" content="noindex,follow">/);
 }
});
