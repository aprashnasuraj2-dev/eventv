import {test} from 'node:test';import assert from 'node:assert/strict';import {check} from '../assets/nab-show-las-vegas-2027-planner.js';
const x={day:'3',firstEnd:'10:00',secondStart:'10:30',transfer:'20'};
test('event day versus exhibit day',()=>{assert.equal(check(x).exhibitDay,false);assert.equal(check({...x,day:'4'}).exhibitDay,true);assert.equal(check({...x,day:'7'}).exhibitDay,true)});
test('transfer margin identifies tight or overlapping meetings',()=>{assert.equal(check(x).margin,10);assert.equal(check({...x,secondStart:'10:10'}).margin,-10);assert.equal(check({...x,secondStart:'09:50'}).gap,-10)});
test('reject invalid inputs',()=>{for(const v of [{day:'8'},{day:'03'},{firstEnd:'24:00'},{transfer:'-1'},{transfer:'1.2'}])assert.throws(()=>check({...x,...v}))});
