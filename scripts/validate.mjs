import fs from 'node:fs';import assert from 'node:assert/strict';
const data=JSON.parse(fs.readFileSync('data/events-50.json','utf8')).events;
const rows=fs.readFileSync('research/routes-200.csv','utf8').trim().split('\n');
const intents=fs.readFileSync('research/search-intents-1000.csv','utf8').trim().split('\n');
assert.equal(data.length,50);assert.equal(new Set(data.map(e=>e.slug)).size,50);
assert.equal(rows.length,201);assert.equal(intents.length,1001);
assert.equal(data.filter(e=>e.slug.includes('eclipse')).length,0);
for(const e of data){assert.equal(e.facets.length,5);for(const p of ['hub','planning','during','after']){const filepath='events/'+e.slug+'/'+(p==='hub'?'':p+'/')+'index.html';assert.ok(fs.existsSync(filepath),filepath);const h=fs.readFileSync(filepath,'utf8');assert.ok(h.includes('noindex,follow'));assert.ok(h.includes(e.name.replace(/&/g,'&amp;')));assert.ok(h.includes('rel="canonical"'));}}
assert.ok(fs.existsSync('index.html')&&fs.existsSync('events/index.html'));
console.log('Validated: 50 clusters; 1000 intent rows; 200 event pages; 202 HTML total; noindex draft safety');
