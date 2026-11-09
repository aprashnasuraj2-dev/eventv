import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const html=readFileSync(new URL('../content/pilots/icc-cricket-world-cup-2027.html',import.meta.url),'utf8');
const inline=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1]).filter(Boolean);
assert.equal(inline.length,1,'expected one browser application script');
function browser(){
 const nodes=new Map();
 const element=id=>{if(!nodes.has(id))nodes.set(id,{id,value:'',textContent:'',children:[],style:{},className:'',attributes:{},replaceChildren(...c){this.children=c;},append(...c){this.children.push(...c);},setAttribute(k,v){this.attributes[k]=v;},click(){this.clicked=true;}});return nodes.get(id)};
 const store=new Map();
 const context={document:{getElementById:element,createElement:tag=>element('generated-'+tag+'-'+Math.random())},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},Intl,Date,Number,JSON,Array,Blob,URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{}},setTimeout:()=>{},console};
 vm.runInNewContext(inline[0],context,{timeout:2000});
 return {element,store};
}
test('actual browser handler rejects missing and offset-free kickoffs',()=>{
 const {element:e}=browser();
 e('from').value='2027-10-10T10:00:00';e('to').value='2027-10-10T14:00:00Z';
 e('calculate').onclick();
 assert.match(e('result').textContent,/explicit offsets/i);
});
test('actual browser handler subtracts match duration and transfer buffer',()=>{
 const {element:e}=browser();
 e('from').value='2027-10-10T08:00:00Z';e('to').value='2027-10-10T12:00:00Z';
 e('match-duration').value='180';e('minutes').value='90';e('buffer').value='30';
 e('calculate').onclick();
 assert.match(e('result').textContent,/CONFLICT/);
 assert.match(e('result').textContent,/Margin -60 min/);
});
test('actual browser handler validates estimates and does not invent fixtures',()=>{
 const {element:e}=browser();
 e('from').value='2027-10-10T08:00:00Z';e('to').value='2027-10-10T12:00:00Z';
 e('match-duration').value='';e('minutes').value='90';e('buffer').value='30';
 e('calculate').onclick();assert.match(e('result').textContent,/valid match-duration/i);
 e('add').onclick();assert.match(e('watch').textContent,/Enter a match identifier/);
});
test('source remains noindex and no third-party or unsafe HTML injection',()=>{
 assert.match(html,/<meta name="robots" content="noindex,follow">/);
 assert.doesNotMatch(inline[0],/\.innerHTML\s*=/);
 assert.match(html,/User-entered kickoff instant/);
});
