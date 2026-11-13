import {test} from 'node:test';
import assert from 'node:assert/strict';
import {plan} from '../assets/salone-del-mobile-milano-2027-planner.js';
const x={day:'17',category:'public',start:'09:30',end:'18:30',booths:'10',per:'30',transfers:'120'};
test('access categories use distinct opening days',()=>{assert.equal(plan({...x,day:'16'}).dayPossible,false);assert.equal(plan({...x,day:'16',category:'student'}).dayPossible,true);assert.equal(plan({...x,day:'13',category:'trade'}).dayPossible,true);assert.equal(plan({...x,day:'15',category:'supplier'}).dayPossible,false)});
test('hours and user-entered capacity are separate',()=>{assert.deepEqual(plan(x),{dayPossible:true,inHours:true,available:540,needed:420,remaining:120});assert.equal(plan({...x,start:'09:29'}).inHours,false);assert.equal(plan({...x,booths:'20'}).remaining,-180)});
test('invalid and malformed inputs are rejected',()=>{for(const patch of [{day:'19'},{category:'__proto__'},{start:'24:00'},{end:'09:30'},{booths:'1.5'},{transfers:'-1'}])assert.throws(()=>plan({...x,...patch}))});
