import test from 'node:test';
import assert from 'node:assert/strict';
import {parseDohaLocal,formatInZone,parseMoney,budgetQar,analyzeGames,passCoverage} from './topic-042-planner.mjs';
test('Doha midnight rolls back to previous UTC date',()=>{
 assert.equal(new Date(parseDohaLocal('2027-08-27T00:30')).toISOString(),'2027-08-26T21:30:00.000Z');
});
test('invalid calendar and absent fixture are rejected',()=>{
 for(const value of ['2027-02-30T12:00','2027-08-27T24:00','',null]) assert.throws(()=>parseDohaLocal(value));
});
test('viewer zones respect daylight saving and date boundaries',()=>{
 const instant=parseDohaLocal('2027-08-27T00:30');
 assert.match(formatInZone(instant,'America/New_York'),/26 Aug 2027/);
 assert.match(formatInZone(instant,'Europe/London'),/26 Aug 2027/);
 assert.throws(()=>formatInZone(instant,'Invalid/Zone'));
});
test('overlap and transfer buffer are separate classifications',()=>{
 const games=[{id:'a',dohaStart:'2027-08-27T10:00',durationMinutes:120},{id:'b',dohaStart:'2027-08-27T11:00',durationMinutes:90},{id:'c',dohaStart:'2027-08-27T13:00',durationMinutes:90}];
 const result=analyzeGames(games,45);
 assert.ok(result.conflicts.some(c=>c.first==='a'&&c.second==='b'&&c.kind==='OVERLAP'));
 assert.ok(result.conflicts.some(c=>c.first==='b'&&c.second==='c'&&c.kind==='TRANSFER_BUFFER'));
 assert.equal(analyzeGames([],30).conflicts.length,0);
 assert.throws(()=>analyzeGames([games[0],games[0]]));
});
test('budget rejects negative, scientific and nonnumeric amounts',()=>{
 assert.equal(budgetQar(['4700.00','125.25','30']),'4855.25');
 for(const v of ['-1','1e4','NaN','<img src=x onerror=alert(1)>']) assert.throws(()=>parseMoney(v));
});
test('unknown pass coverage never becomes confirmed admission',()=>{
 assert.equal(passCoverage('final-phase',{phase:'final'}),'POTENTIALLY_COVERED');
 assert.equal(passCoverage('final-phase',{phase:'group'}),'NOT_COVERED');
 assert.equal(passCoverage('follow-qatar',{phase:'group',team:'Canada'}),'NOT_COVERED');
 assert.equal(passCoverage('lusail-series',{phase:'group'}),'UNKNOWN');
});
