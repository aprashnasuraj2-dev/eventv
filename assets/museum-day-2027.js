// Topic 100: offline museum visit feasibility; no external data, rates or invented schedules.
export const KEY='eventv-museum-2027-v1';
const minutes=s=>{if(!/^\d\d:\d\d$/.test(s))return NaN;const [h,m]=s.split(':').map(Number);return h<24&&m<60?h*60+m:NaN};
export function assess(visits,{group=1,budget=null}={}){
 if(!Number.isInteger(group)||group<1||group>100)throw Error('Group must be 1–100 people');
 if(!Array.isArray(visits)||visits.length>30)throw Error('Maximum 30 visits');
 const warnings=[],totals={},items=[];
 visits.forEach((v,i)=>{
  const label=String(v.name||'').trim();
  if(!label||label.length>100)throw Error('Visit '+(i+1)+': enter a museum name (1–100 characters)');
  if(!/^2027-\d\d-\d\d$/.test(v.date)||Number.isNaN(Date.parse(v.date+'T00:00:00Z'))||new Date(v.date+'T00:00:00Z').toISOString().slice(0,10)!==v.date)throw Error(label+': invalid 2027 visit date');
  const start=minutes(v.start),end=minutes(v.end);
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start)throw Error(label+': end must follow start on the same local day');
  const transfer=Number(v.transfer||0),price=Number(v.price||0),currency=String(v.currency||'').trim().toUpperCase();
  if(!Number.isFinite(transfer)||transfer<0||transfer>1440)throw Error(label+': transfer must be 0–1440 minutes');
  if(!Number.isFinite(price)||price<0||price>1000000)throw Error(label+': price must be 0–1,000,000');
  if(!/^[A-Z]{3}$/.test(currency))throw Error(label+': use a three-letter currency code');
  if(v.source && !/^https:\/\//i.test(v.source))throw Error(label+': evidence URL must use HTTPS');
  const cost=Math.round(price*group*100)/100;totals[currency]=(totals[currency]||0)+cost;
  if(!v.source||!v.checked)warnings.push(label+': museum hours, accessibility and admission are unverified');
  if(v.access==='needed'&&!v.accessConfirmed)warnings.push(label+': accessibility request not confirmed with venue');
  if(v.reservation==='needed'&&!v.reservationConfirmed)warnings.push(label+': timed reservation not confirmed');
  items.push({label,date:v.date,start,end,transfer,cost,currency});
 });
 for(let i=1;i<items.length;i++){
  const prev=items[i-1],cur=items[i];
  if(cur.date<prev.date||cur.date===prev.date&&cur.start<prev.start)warnings.push('Itinerary is not in chronological order near '+cur.label);
  if(cur.date===prev.date&&cur.start<prev.end+cur.transfer)warnings.push('Time conflict: '+prev.label+' → '+cur.label+' needs '+(prev.end+cur.transfer-cur.start)+' more minutes');
 }
 if(budget&&typeof budget==='object'){const limit=Number(budget.amount);if(!/^[A-Z]{3}$/.test(budget.currency||'')||!Number.isFinite(limit)||limit<0)throw Error('Invalid budget');if((totals[budget.currency]||0)>limit)warnings.push('Budget exceeded in '+budget.currency);if(Object.keys(totals).some(c=>c!==budget.currency))warnings.push('Other currencies are not converted or compared to budget');}
 return {items,warnings,totals,group};
}
export function readSaved(storage){try{const v=JSON.parse(storage.getItem(KEY)||'[]');return Array.isArray(v)?v.slice(0,30):[]}catch{return []}}
export function save(storage,visits){storage.setItem(KEY,JSON.stringify(visits))}
if(typeof document!=='undefined'){
 const form=document.querySelector('#museum-form'),list=document.querySelector('#visit-list'),result=document.querySelector('#results'),message=document.querySelector('#message');let visits=readSaved(localStorage);
 const value=id=>form.elements.namedItem(id).value;
 const render=()=>{
  list.replaceChildren();
  visits.forEach((v,i)=>{const li=document.createElement('li');const span=document.createElement('span');span.textContent=v.name+' · '+v.date+' · '+v.start+'–'+v.end+' · '+v.currency+' '+v.price;const button=document.createElement('button');button.type='button';button.textContent='Remove';button.setAttribute('aria-label','Remove '+v.name);button.addEventListener('click',()=>{visits.splice(i,1);save(localStorage,visits);render()});li.append(span,button);list.append(li)});
  try{const report=assess(visits,{group:Number(document.querySelector('#group').value||1)});result.textContent=visits.length?'Estimated group costs: '+Object.entries(report.totals).map(([c,n])=>c+' '+n.toFixed(2)).join(' · ')+'\n'+(report.warnings.length?report.warnings.join('\n'):'No time conflicts found. Confirm all venue details independently.'):'Add your first museum to check visit feasibility.';message.textContent='';}catch(e){message.textContent=e.message}
 };
 form?.addEventListener('submit',e=>{e.preventDefault();const v={name:value('museum'),date:value('date'),start:value('start'),end:value('end'),transfer:value('transfer'),price:value('price'),currency:value('currency'),source:value('source'),checked:value('checked'),access:value('access'),accessConfirmed:form.elements.namedItem('accessConfirmed').checked,reservation:value('reservation'),reservationConfirmed:form.elements.namedItem('reservationConfirmed').checked};try{assess([...visits,v],{group:Number(value('group'))});visits.push(v);save(localStorage,visits);render();form.elements.namedItem('museum').focus()}catch(err){message.textContent=err.message}});
 document.querySelector('#group')?.addEventListener('input',render);
 document.querySelector('#reset')?.addEventListener('click',()=>{visits=[];localStorage.removeItem(KEY);render()});
 document.querySelector('#export')?.addEventListener('click',()=>{const blob=new Blob([JSON.stringify({note:'User-entered unverified museum visit scenarios, not official event programme',visits},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='museum-day-2027-private-plan.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
 render();
}