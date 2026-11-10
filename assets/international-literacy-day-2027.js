// Topic 101: user-entered literacy session feasibility, not UNESCO programme data.
export function planSessions(sessions,{volunteers=1,minutesAvailable=240}={}){
 if(!Number.isInteger(volunteers)||volunteers<1||volunteers>100)throw Error('Volunteers must be 1–100');
 if(!Number.isInteger(minutesAvailable)||minutesAvailable<1||minutesAvailable>1440)throw Error('Available minutes must be 1–1440');
 if(!Array.isArray(sessions)||sessions.length>40)throw Error('Maximum 40 sessions');
 const items=[],warnings=[];let personMinutes=0;
 for(const [i,s] of sessions.entries()){
  const name=String(s.name||'').trim(),language=String(s.language||'').trim();
  if(!name||name.length>100)throw Error('Session '+(i+1)+': invalid title');
  if(!language||language.length>60)throw Error(name+': specify language');
  const learners=Number(s.learners),groupSize=Number(s.groupSize),duration=Number(s.duration);
  if(!Number.isInteger(learners)||learners<1||learners>10000)throw Error(name+': learners must be 1–10000');
  if(!Number.isInteger(groupSize)||groupSize<1||groupSize>1000)throw Error(name+': group size must be 1–1000');
  if(!Number.isInteger(duration)||duration<5||duration>480)throw Error(name+': duration must be 5–480 minutes');
  const groups=Math.ceil(learners/groupSize),required=groups*duration;
  personMinutes+=required;
  if(s.accessibility==='unverified')warnings.push(name+': accessibility arrangements need confirmation');
  if(s.venue==='unverified')warnings.push(name+': venue availability is not confirmed');
  items.push({name,language,learners,groups,duration,required});
 }
 const capacity=volunteers*minutesAvailable;
 if(personMinutes>capacity)warnings.push('Insufficient volunteer time: '+(personMinutes-capacity)+' additional volunteer-minutes needed');
 return {items,personMinutes,capacity,minimumVolunteers:Math.ceil(personMinutes/minutesAvailable),warnings};
}
export const STORAGE_KEY='eventv-literacy-2027-v1';
export function load(storage){try{const x=JSON.parse(storage?.getItem(STORAGE_KEY)||'[]');return Array.isArray(x)?x.slice(0,40):[]}catch{return []}}
export function store(storage,x){try{storage?.setItem(STORAGE_KEY,JSON.stringify(x));return !!storage}catch{return false}}
if(typeof document!=='undefined'){
 const f=document.querySelector('#session-form'),out=document.querySelector('#output'),list=document.querySelector('#sessions');let storage=null;try{storage=window.localStorage}catch{}
 let sessions=load(storage);
 const render=()=>{list.replaceChildren();for(const [i,s] of sessions.entries()){const li=document.createElement('li');li.textContent=s.name+' · '+s.language+' · '+s.learners+' learners';const b=document.createElement('button');b.textContent='Remove';b.setAttribute('aria-label','Remove '+s.name);b.addEventListener('click',()=>{sessions.splice(i,1);store(storage,sessions);render()});li.append(b);list.append(li)}};
 f.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(f);const s={name:d.get('name'),language:d.get('language'),learners:Number(d.get('learners')),groupSize:Number(d.get('groupSize')),duration:Number(d.get('duration')),accessibility:d.get('accessibility'),venue:d.get('venue')};try{planSessions([s]);sessions.push(s);planSessions(sessions);store(storage,sessions);render();out.textContent='Session added.';f.reset()}catch(err){out.textContent=err.message}});
 document.querySelector('#calculate').addEventListener('click',()=>{try{const x=planSessions(sessions,{volunteers:Number(document.querySelector('#volunteers').value),minutesAvailable:Number(document.querySelector('#minutes').value)});out.textContent='Required: '+x.personMinutes+' volunteer-minutes. Capacity: '+x.capacity+'. Minimum volunteers: '+x.minimumVolunteers+'. '+x.warnings.join(' ')}catch(err){out.textContent=err.message}});
 document.querySelector('#reset').addEventListener('click',()=>{sessions=[];store(storage,sessions);render();out.textContent='Cleared.'});
 document.querySelector('#export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({source:'user-entered',sessions},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='literacy-plan-2027.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)});
 render();
}
