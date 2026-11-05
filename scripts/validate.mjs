import fs from 'node:fs';import assert from 'node:assert/strict';
const data=JSON.parse(fs.readFileSync('data/events-50.json','utf8')).events;
const approvals=JSON.parse(fs.readFileSync('data/index-approved.json','utf8')).approved||[];
const approved=new Map(approvals.map(x=>[x.slug+'|'+x.page_type,x]));
const rows=fs.readFileSync('research/routes-200.csv','utf8').trim().split('\n');
const intents=fs.readFileSync('research/search-intents-1000.csv','utf8').trim().split('\n');
assert.equal(data.length,50);assert.equal(new Set(data.map(e=>e.slug)).size,50);
assert.equal(rows.length,201);assert.equal(intents.length,1001);
assert.equal(data.filter(e=>e.slug.includes('eclipse')).length,0);
assert.equal(approvals.length,2,'Pilot release currently expects exactly two index-approved routes');
for(const e of data){assert.equal(e.facets.length,5);for(const p of ['hub','planning','during','after']){
  const filepath='events/'+e.slug+'/'+(p==='hub'?'':p+'/')+'index.html';
  assert.ok(fs.existsSync(filepath),filepath);
  const h=fs.readFileSync(filepath,'utf8');
  assert.ok(h.includes(e.name.replace(/&/g,'&amp;'))||h.includes(e.name),'Missing event name '+filepath);
  assert.ok(h.includes('rel="canonical"'),'Missing canonical '+filepath);
  const key=e.slug+'|'+p, override=approved.get(key);
  if(override){
    assert.ok(fs.existsSync(override.source_path),'Missing approved source '+override.source_path);
    assert.equal(h,fs.readFileSync(override.source_path,'utf8'),'Approved output must match source '+filepath);
    assert.ok(h.includes('index,follow,max-image-preview:large'),'Approved page missing index directive');
    assert.ok(!h.includes('content="noindex,follow"'),'Approved page still noindex');
    assert.ok(h.includes('application/ld+json'),'Approved page missing structured data');
    assert.ok(h.includes('id="references"'),'Approved page missing compact references');
    assert.ok(h.length>15000,'Approved pilot page unexpectedly thin');
  } else assert.ok(h.includes('noindex,follow'),'Unapproved page must remain noindex: '+filepath);
}}
assert.ok(fs.existsSync('assets/steam-next-fest-feb-2027.css'));
assert.ok(fs.existsSync('assets/steam-next-fest-feb-2027.js'));
assert.ok(fs.existsSync('assets/steam-next-fest-feb-2027-social.svg'));
assert.ok(fs.existsSync('assets/steam-winter-sale-2026.css'));
assert.ok(fs.existsSync('assets/steam-winter-sale-2026.js'));
assert.ok(fs.existsSync('assets/steam-winter-sale-2026-social.svg'));
assert.ok(fs.existsSync('index.html')&&fs.existsSync('events/index.html'));
console.log('Validated: 50 clusters; 1000 intent rows; 200 event pages; 202 HTML total; 2 source-verified pilot hubs index-ready; all remaining event pages noindex');