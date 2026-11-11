import {test} from 'node:test';import assert from 'node:assert/strict';import {capacity,tripCost} from '../assets/expo-2027-belgrade-planner.js';
const a={days:2,hours:8,arrival:60,rest:60,visit:45,queue:15,transfer:10,desired:12};
test('per-day capacity does not carry unused minutes across days',()=>{const r=capacity(a);assert.equal(r.perDay,5);assert.equal(r.total,10);assert.equal(r.shortfall,2);assert.equal(r.unused,10)});
test('no usable time means zero capacity',()=>{assert.equal(capacity({...a,hours:1,arrival:60,rest:60}).total,0)});
test('reject empty, negative, fractional counts and unreasonable inputs',()=>{for(const x of [{...a,visit:''},{...a,queue:-1},{...a,days:1.5},{...a,hours:25}])assert.throws(()=>capacity(x))});
test('group budget includes per-person tickets and daily spending',()=>{assert.equal(tripCost({days:2,people:3,nights:2,room:100,transport:40,daily:20,tickets:10,other:5}),425);assert.throws(()=>tripCost({days:2,people:0,nights:0,room:0,transport:0,daily:0,tickets:0,other:0}))});
