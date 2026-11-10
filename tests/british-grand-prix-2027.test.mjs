import assert from 'node:assert/strict';import {plan,compare,minutes} from '../assets/british-grand-prix-2027.js';
const base={day:'2027-07-04',mode:'shuttle',station:'Northampton',departure:'07:30',duration:60,walk:20,queue:30,buffer:45,target:'10:00'};
assert.equal(plan(base).arrival,'09:20');assert.equal(plan(base).slack,-5);assert.equal(plan({...base,target:'10:30'}).slack,25);
assert.equal(plan({...base,mode:'camping',station:''}).station,null);
assert.equal(compare(base,{...base,departure:'06:30'}).better,'b');
for(const bad of [{...base,day:'2027-07-05'},{...base,station:'London'},{...base,departure:'25:00'},{...base,queue:-1},{...base,queue:2.5},{...base,departure:'23:40',duration:60}])assert.throws(()=>plan(bad));
assert.throws(()=>compare(base,{...base,day:'2027-07-03'}));
assert.equal(minutes('00:00'),0);assert.equal(minutes('23:59'),1439);
console.log('British GP 2027 scenario tests passed');
