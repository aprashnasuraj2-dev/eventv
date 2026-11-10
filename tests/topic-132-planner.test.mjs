import test from 'node:test';import assert from 'node:assert/strict';import {dayUTC,assessItinerary} from '../scripts/topic-132-planner.mjs';
test('date bounds',()=>{assert.ok(dayUTC('2027-07-02'));assert.throws(()=>dayUTC('2027-07-01'));assert.throws(()=>dayUTC('2027-07-32'))});
test('same-day multi-town warning',()=>{const p=assessItinerary([{date:'2027-07-02',town:'Edinburgh',travelMinutes:120},{date:'2027-07-02',town:'Carlisle',travelMinutes:20}]);assert.equal(p.warnings.length,2)});
test('bad travel assumptions and oversized plans rejected',()=>{assert.throws(()=>assessItinerary([{date:'2027-07-02',town:'Edinburgh',travelMinutes:-1}]));assert.throws(()=>assessItinerary(Array(31).fill({date:'2027-07-02',town:'Edinburgh',travelMinutes:90})))});
