export function parseEntry(v) {
  const title=String(v.title??'').trim().slice(0,100), venue=String(v.venue??'').trim().slice(0,100);
  if(!title || !venue) throw Error('Enter a title and venue.');
  if(!/^2027-05-(1[1-9]|2[0-2])$/.test(v.date??'')) throw Error('Choose a festival date from 11–22 May 2027.');
  if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v.time??'')) throw Error('Enter a valid 24-hour start time.');
  if (String(v.duration??'').trim()==='' || String(v.buffer??'').trim()==='') throw Error('Enter duration and transfer buffer; blank is not zero.');
  const duration=Number(v.duration), buffer=Number(v.buffer);
  if(!Number.isInteger(duration)||duration<1||duration>600) throw Error('Duration must be 1–600 minutes.');
  if(!Number.isInteger(buffer)||buffer<0||buffer>360) throw Error('Transfer buffer must be 0–360 minutes.');
  const [y,m,d]=v.date.split('-').map(Number), [h,min]=v.time.split(':').map(Number);
  return {title,venue,date:v.date,time:v.time,duration,buffer,start:Date.UTC(y,m-1,d,h,min)/60000};
}
export function conflicts(entries){
 const sorted=entries.map(parseEntry).sort((a,b)=>a.start-b.start);const result=[];
 // Compare every earlier screening, not just the adjacent one: a long film can overlap multiple later events.
 for(let i=0;i<sorted.length;i++)for(let j=i+1;j<sorted.length;j++){
  const a=sorted[i],b=sorted[j], gap=b.start-(a.start+a.duration);
  if(gap<a.buffer)result.push({from:a.title,to:b.title,gap,buffer:a.buffer,kind:gap<0?'overlap':'transfer'});
 }
 return result;
}
export function estimate(v){
 const keys=['nights','nightly','travel','daily','days','other'];
 if(keys.some(k=>String(v[k]??'').trim()==='')) throw Error('Complete every estimate; blank is not zero.');
 const vals=keys.map(k=>Number(v[k]));
 if(vals.some(n=>!Number.isFinite(n)||n<0||n>1000000)) throw Error('Costs and quantities must be non-negative finite numbers.');
 const [nights,nightly,travel,daily,days,other]=vals;
 if(!Number.isInteger(nights)||!Number.isInteger(days)||nights>365||days>365) throw Error('Nights and days must be whole numbers from 0 to 365.');
 return nights*nightly+travel+daily*days+other;
}
