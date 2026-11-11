import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseEntry,conflicts,estimate} from '../assets/festival-de-cannes-2027-planner.js';
const item=(title,time,duration=60,buffer=15,date='2027-05-11')=>({title,venue:'A',date,time,duration,buffer});
test('validates festival boundary and numeric limits',()=>{assert.throws(()=>parseEntry(item('A','12:00',60,0,'2027-05-23')));assert.throws(()=>parseEntry(item('A','12:00',0)));assert.throws(()=>parseEntry(item('','12:00')));assert.equal(parseEntry(item('A','12:00')).duration,60)});
test('finds all overlapping entries, including long and overnight films',()=>{let c=conflicts([item('Long','22:00',240,20),item('Late','23:30',30,0),item('Tomorrow','00:30',30,0,'2027-05-12')]);assert.equal(c.length,2);assert.ok(c.some(x=>x.to==='Tomorrow'&&x.kind==='overlap'))});
test('equal buffer is enough; smaller gap warns',()=>{assert.equal(conflicts([item('A','10:00',60,15),item('B','11:15')]).length,0);assert.equal(conflicts([item('A','10:00',60,15),item('B','11:14')])[0].kind,'transfer')});
test('calculates editable costs, rejecting invalid values',()=>{assert.equal(estimate({nights:2,nightly:100,travel:50,daily:20,days:3,other:10}),320);assert.throws(()=>estimate({nights:1,nightly:-1,travel:0,daily:0,days:0,other:0}));assert.throws(()=>estimate({nights:1.5,nightly:1,travel:0,daily:0,days:0,other:0}))});
test('missing budget or buffer is unknown, never silently converted to zero',()=>{assert.throws(()=>parseEntry({...item('A','12:00'),buffer:''}));assert.throws(()=>estimate({nights:2,nightly:'',travel:50,daily:20,days:3,other:10}));assert.equal(parseEntry({...item('A','12:00'),buffer:'0'}).buffer,0)});
