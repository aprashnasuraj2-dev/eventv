import assert from 'node:assert/strict';
import test from 'node:test';
import {formatTopicScore,hasTopicScore,compareTopicScore} from '../scripts/catalog-score.mjs';
test('optional sparse topic scores render as Not scored rather than crashing',()=>{
 for(const val of [undefined,null,NaN,Infinity,-1,11,'8.1']) {
   assert.equal(hasTopicScore(val),false);
   assert.equal(formatTopicScore(val),'Not scored');
 }
 assert.equal(formatTopicScore(8.17),'8.2');
 assert.equal(formatTopicScore(0),'0.0');
});
test('known topic scores rank first; unknown sparse topic IDs retain stable catalog order',()=>{
 const entries=[{rank:100},{rank:75,score:8.1},{rank:170},{rank:2,score:9.3},{rank:1,score:8.1}];
 assert.deepEqual(entries.sort(compareTopicScore).map(e=>e.rank),[2,1,75,100,170]);
});
