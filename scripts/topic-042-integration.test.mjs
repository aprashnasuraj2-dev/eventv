import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseDohaLocal,analyzeGames,budgetQar,passCoverage} from './topic-042-planner.mjs';

const html=fs.readFileSync('content/pilots/fiba-world-cup-2027.html','utf8');
const browser=fs.readFileSync('assets/topic-042-planner.mjs','utf8');
const engine=fs.readFileSync('scripts/topic-042-planner.mjs','utf8');

test('browser utility matches tested engine exactly',()=>assert.equal(browser,engine));
test('approved hub has canonical and source-backed index metadata',()=>{
 assert.match(html,/<meta name="robots" content="index,follow,max-image-preview:large">/);
 assert.match(html,/rel="canonical" href="https:\/\/aafnaipatro\.com\/events\/fiba-world-cup-2027\/"/);
 assert.match(html,/import \{parseDohaLocal,formatInZone,budgetQar,analyzeGames,passCoverage\} from '\/assets\/topic-042-planner\.mjs'/);
 assert.doesNotMatch(html,/innerHTML\s*=/);
 assert.match(html,/replaceChildren\(\)/);
 assert.match(html,/textContent/);
});
test('planner does not fabricate fixture feeds',()=>{
 assert.match(html,/visitor-entered-hypothetical-scenarios/);
 assert.match(html,/verifiedFixtures:false/);
 assert.match(html,/No live match or ticket feed/);
 assert.match(html,/Historical/);
 assert.match(html,/Pending verification/);
});
test('adjacent matches with zero buffer are feasible but one-minute shortfall is flagged',()=>{
 const a={id:'a',dohaStart:'2027-09-01T12:00',durationMinutes:120};
 const b={id:'b',dohaStart:'2027-09-01T14:00',durationMinutes:120};
 assert.equal(analyzeGames([a,b],0).conflicts.length,0);
 assert.equal(analyzeGames([a,b],1).conflicts[0].kind,'TRANSFER_BUFFER');
});
test('Doha-local tournament bounds and September month rollover',()=>{
 const start=parseDohaLocal('2027-08-27T00:00');
 const end=parseDohaLocal('2027-09-12T23:59');
 assert.ok(start<end);
 assert.equal(new Date(parseDohaLocal('2027-09-01T00:00')).toISOString(),'2027-08-31T21:00:00.000Z');
});
test('money preserves exact cents and rejects hidden negative amounts',()=>{
 assert.equal(budgetQar(['0.01','0.02','0.03']),'0.06');
 assert.throws(()=>budgetQar(['-0.01']));
 assert.throws(()=>budgetQar(['1.234']));
});
test('pass inference never implies confirmed admission',()=>{
 for(const pass of ['lusail-series','final-phase','follow-qatar','unknown']){
  for(const game of [{phase:'group',venue:'Lusail',team:'Qatar'},{phase:'final',venue:'Elsewhere',team:'Canada'},{}]){
   assert.notEqual(passCoverage(pass,game),'CONFIRMED');
  }
 }
});

test('pass evidence UI is wired to conservative engine and source navigation exists',()=>{
 assert.match(html,/id="pass-type"/);
 assert.match(html,/id="pass-phase"/);
 assert.match(html,/id="pass-venue"/);
 assert.match(html,/id="pass-team"/);
 assert.match(html,/id="pass-check"/);
 assert.match(html,/passCoverage\(pass,\{phase,venue,team\}\)/);
 assert.match(html,/id="pass-result" aria-live="polite"/);
 assert.match(html,/href="#references"/);
 assert.doesNotMatch(html,/href="#sources"/);
 assert.match(html,/POTENTIALLY COVERED under the entered assumptions/);
});

test('saved scenarios reject invalid dates, duplicate IDs and out-of-range durations before analysis',()=>{
 assert.match(html,/const ids=new Set\(\)/);
 assert.match(html,/ids\.has\(g\.id\)/);
 assert.match(html,/g\.durationMinutes<1\|\|g\.durationMinutes>600/);
 assert.match(html,/const t=parseDohaLocal\(g\.dohaStart\)/);
 assert.match(html,/ids\.add\(g\.id\)/);
});

test('approved hub route and source parity are explicit; spokes remain noindex',()=>{const approvals=JSON.parse(fs.readFileSync('data/index-approved.json','utf8')).approved;const entry=approvals.find(x=>x.slug==='fiba-world-cup-2027'&&x.page_type==='hub');assert.ok(entry);assert.equal(fs.readFileSync(entry.output_path,'utf8'),html);assert.equal(approvals.filter(x=>x.slug==='fiba-world-cup-2027').length,1);const rows=fs.readFileSync('research/routes-200.csv','utf8').split('\n').filter(x=>x.startsWith('"fiba-world-cup-2027"'));assert.equal(rows.length,4);assert.match(rows[0],/index,follow,max-image-preview:large/);for(const row of rows.slice(1))assert.match(row,/noindex,follow/);assert.match(html,/ticketing-terms-and-conditions/)});
