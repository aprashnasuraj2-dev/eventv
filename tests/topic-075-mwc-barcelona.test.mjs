// Run with Node 22: node --test tests/topic-075-mwc-barcelona.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const html=fs.readFileSync('content/pilots/mwc-barcelona-2027.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Planner script must exist');
const logic=script.slice(0,script.indexOf('function values()'));
const context=vm.createContext({});
vm.runInContext(logic+';globalThis.evaluate=assess;',context);
const assess=context.evaluate;
const base={day:'2027-03-01',firstStart:'10:00',firstEnd:'11:00',secondStart:'11:45',transfer:'30',buffer:'15'};
test('exactly sufficient transfer is feasible',()=>assert.equal(assess(base).slack,0));
test('off-campus transfer plus check-in catches false feasible calendar gap',()=>{
 const r=assess({...base,firstStart:'14:00',firstEnd:'14:45',secondStart:'15:00',transfer:'20',buffer:'10'});
 assert.equal(r.slack,-15);assert.equal(r.ok,false);
});
test('valid zero allowance is distinct from missing allowance',()=>{
 assert.equal(assess({...base,transfer:'0',buffer:'0'}).ok,true);
 assert.equal(assess({...base,transfer:'',buffer:'0'}).ok,false);
 assert.equal(assess({...base,transfer:'0',buffer:''}).ok,false);
});
test('reject invalid day, malformed clock, reversed and overnight meeting',()=>{
 for(const scenario of [{day:'2027-03-05'},{firstStart:'9:00'},{firstEnd:'09:00'},{firstStart:'23:00',firstEnd:'00:10'}])
 assert.equal(assess({...base,...scenario}).ok,false);
});
test('reject negative, fractional, excessive and nonnumeric allowances',()=>{
 for(const transfer of ['-1','0.5','241','NaN','Infinity'])assert.equal(assess({...base,transfer}).ok,false);
 for(const buffer of ['-1','0.5','121','abc'])assert.equal(assess({...base,buffer}).ok,false);
});
test('explicit noindex, canonical, official citations and no unsafe HTML injection',()=>{
 assert.match(html,/name="robots" content="noindex,follow"/);
 assert.match(html,/rel="canonical" href="https:\/\/aafnaipatro.com\/events\/mwc-barcelona-2027\/"/);
 assert.match(html,/gsma-mwc27-barcelona-countdown/);
 assert.match(html,/prior organizer FAQ|previously inconsistent/i);
 assert.doesNotMatch(script,/innerHTML\s*=/);
 assert.match(script,/textContent=/);
});

test('EUR budget computes group costs and contingency without invented official prices',()=>{
 const b=vm.createContext({});
 vm.runInContext(logic+';globalThis.budget=budgetEstimate;',b);
 const scenario={attendees:'2',nights:'3',hotel:'180',badge:'0',ground:'60',contingency:'15'};
 assert.equal(b.budget(scenario).subtotal,1200);
 assert.equal(b.budget(scenario).total,1380);
 assert.equal(b.budget({...scenario,hotel:''}).ok,false);
 assert.equal(b.budget({...scenario,attendees:'0'}).ok,false);
 assert.equal(b.budget({...scenario,contingency:'101'}).ok,false);
 assert.equal(b.budget({...scenario,nights:'1.5'}).ok,false);
});
test('source discrepancy is dated and not presented as an unresolved live FAQ contradiction',()=>{
 assert.match(html,/Previously inconsistent, now rechecked/);
 assert.match(html,/budgetCheck/);
 assert.match(html,/budgetAssessment/);
});
