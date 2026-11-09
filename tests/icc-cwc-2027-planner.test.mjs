import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveSlot,parseDuration,planTransfer,formatInstant,normalizeShortlist,escapeText} from '../content/tools/icc-cwc-2027-planner.mjs';
test('conditional slots never masquerade as confirmed fixtures',()=>{
 assert.deepEqual(resolveSlot('B3'),{slot:'B3',team:null,conditional:true});
 assert.deepEqual(resolveSlot('B3',{B3:'Bangladesh'}),{slot:'B3',team:'Bangladesh',conditional:true});
 assert.throws(()=>resolveSlot('FINAL'),RangeError);
});
test('missing kickoff and travel estimates remain unknown',()=>{
 assert.equal(planTransfer({},{iso:'2027-10-10T08:00:00Z'}).status,'unknown-time');
 assert.equal(planTransfer({iso:'2027-10-10T08:00:00Z'},{iso:'2027-10-10T12:00:00Z'}).status,'unknown-travel');
});
test('travel conflicts and rollover use instants, not local string subtraction',()=>{
 const a={iso:'2027-10-10T22:30:00Z'},b={iso:'2027-10-11T01:00:00Z'};
 assert.equal(planTransfer(a,b,{travelMinutes:120,arrivalBufferMinutes:60}).status,'conflict');
 assert.equal(planTransfer(a,b,{travelMinutes:60,arrivalBufferMinutes:30}).marginMinutes,60);
 assert.equal(planTransfer(b,a,{travelMinutes:0,arrivalBufferMinutes:0}).status,'conflict');
});
test('invalid input and timezone are rejected',()=>{
 for(const value of [-1,Infinity,10081,'not-a-number'])assert.throws(()=>parseDuration(value),RangeError);
 assert.throws(()=>formatInstant('bad'),RangeError);
 assert.throws(()=>formatInstant('2027-10-10T10:00:00Z','Mars/Phobos'),RangeError);
});
test('DST formats differ across zones without assuming same wall time',()=>{
 const iso='2027-10-31T01:30:00Z';
 assert.notEqual(formatInstant(iso,'Europe/London'),formatInstant(iso,'Africa/Johannesburg'));
});
test('shortlist bounds and text safety',()=>{
 assert.equal(normalizeShortlist([{id:'match-1',note:'<script>',status:'made-up'}])[0].status,'conditional');
 assert.equal(escapeText('<img src=x onerror="alert(1)">'),'&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
 assert.throws(()=>normalizeShortlist([{id:''}]),RangeError);
});
