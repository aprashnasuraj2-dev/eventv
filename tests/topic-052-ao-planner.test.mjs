import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyDate,aedtToUtc,ticketGuidance,assessSessions,estimateAud} from '../content/pilots/topic-052-ao-planner.mjs';
test('separate Kids Day from Opening Week and main draw',()=>{
 assert.equal(classifyDate('2027-01-10'),'kids-day');
 assert.equal(classifyDate('2027-01-11'),'opening-week');
 assert.equal(classifyDate('2027-01-17'),'main-draw-window');
 assert.equal(classifyDate('2027-02-01'),'outside');
 assert.equal(classifyDate('2027-01-32'),'outside');
});
test('AEDT conversion crosses UTC day without host timezone dependency',()=>{
 assert.equal(aedtToUtc('2027-01-17','09:30'),'2027-01-16T22:30:00.000Z');
 assert.equal(aedtToUtc('2027-01-17','25:00'),null);
 assert.equal(aedtToUtc('2027-02-17','09:30'),null);
});
test('ground pass does not imply reserved arena or concert admission',()=>{
 assert.equal(ticketGuidance('ground','rod-laver').status,'not-included');
 assert.equal(ticketGuidance('ground','separate-event').status,'not-included');
 assert.equal(ticketGuidance('rod-laver','rod-laver').status,'conditional');
 assert.equal(ticketGuidance('unknown','ground').status,'unknown');
});
test('detects overlap and cross-venue transfer shortfall, tolerates malformed entries',()=>{
 const sessions=[
  {id:'a',date:'2027-01-17',start:'10:00',end:'11:00',venue:'A'},
  {id:'b',date:'2027-01-17',start:'11:10',end:'12:00',venue:'B'},
  {id:'c',date:'2027-01-17',start:'10:30',end:'11:30',venue:'A'},
  {id:'a',date:'2027-01-17',start:'14:00',end:'15:00',venue:'A'},
  {id:'d',date:'2027-01-31',start:'09:00',end:'10:00',venue:'B'}
 ];
 const result=assessSessions(sessions,20);
 assert.equal(result.valid.length,4);
 assert.equal(result.errors.length,1);
 assert(result.conflicts.some(x=>x.reason==='insufficient-transfer-buffer'));
 assert(result.conflicts.some(x=>x.reason==='overlap'));
 assert(!result.conflicts.some(x=>x.second==='d'));
 assert.equal(assessSessions([], -1).errors.length,1);
});
test('cost estimates reject negative, NaN, absurd or fractional ticket counts',()=>{
 assert.equal(estimateAud({tickets:2,unitPrice:100,fees:5,transport:30,accommodation:200}),440);
 assert.equal(estimateAud({tickets:2,unitPrice:-1}),null);
 assert.equal(estimateAud({tickets:1.5,unitPrice:100}),null);
 assert.equal(estimateAud({tickets:2,unitPrice:NaN}),null);
 assert.equal(estimateAud({tickets:2,unitPrice:1e12}),null);
});

test('validated session persistence preserves bounded labels and caps untrusted arrays',()=>{
 const s={id:'label',label:'A'.repeat(120),date:'2027-01-17',start:'10:00',end:'11:00',venue:'Court'};
 const result=assessSessions(Array.from({length:120},(_,i)=>({...s,id:String(i)})));
 assert.equal(result.valid.length,100);
 assert.equal(result.valid[0].label.length,90);
});
