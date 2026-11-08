import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync('assets/seasonal-2027.js','utf8');
function probe(local,zone,destination='Europe/London'){
 const listeners={};const fields={
  zone,destination,'local-time':local,'shift-start':local.slice(0,10)+'T00:30','shift-end':local.slice(0,10)+'T04:30','fold-choice':'earlier',
  'time-result':'','shift-result':''
 };
 const elements=Object.fromEntries(Object.entries(fields).map(([id,value])=>[id,{value,textContent:'',addEventListener:(name,fn)=>{listeners[id+':'+name]=fn}}]));
 const document={body:{dataset:{event:'us-daylight-saving-start-2027',type:'time'}},getElementById:id=>elements[id]||null};
 const context={document,Intl,Date,JSON,Number,String,Array,Set,Math,RegExp,console,localStorage:{getItem:()=>null},confirm:()=>false,URL};
 vm.runInNewContext(source,context,{timeout:1000});
 return {text:elements['time-result'].textContent,shift:elements['shift-result'].textContent};
}
function expect(local,zone,part){
 const v=probe(local,zone);assert.ok(v.text.includes(part),zone+' '+local+' expected '+part+'; got '+v.text);return v.text;
}
expect('2027-03-14T02:30','America/New_York','NONEXISTENT LOCAL TIME');
expect('2027-03-14T03:30','America/New_York','UNAMBIGUOUS');
expect('2027-03-14T02:30','America/Phoenix','UNAMBIGUOUS');
expect('2027-03-14T02:30','BC/PCT','UNAMBIGUOUS');
const fall=expect('2027-11-07T01:30','America/New_York','REPEATED HOUR');
assert.ok(fall.includes('Option 1')&&fall.includes('Option 2'),'Fall fold must report both instants');
expect('2027-11-07T01:30','America/Phoenix','UNAMBIGUOUS');
expect('2027-11-07T01:30','BC/PCT','UNAMBIGUOUS');
expect('2027-03-28T01:30','Europe/London','NONEXISTENT LOCAL TIME');
expect('2027-10-31T01:30','Europe/London','REPEATED HOUR');
expect('2027-10-31T01:30','America/New_York','UNAMBIGUOUS');
console.log('DST browser model: tested US/UK spring gaps and autumn folds, Phoenix and B.C. fixed-PCT counterexamples');
