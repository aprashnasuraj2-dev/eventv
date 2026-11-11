// Independent Edinburgh Fringe itinerary engine. All performances are user-entered, never official listings.
export const FESTIVAL_START='2027-08-06', FESTIVAL_END='2027-08-30';
const clock=/^([01]\d|2[0-3]):([0-5]\d)$/;
export function localMinute(date,time){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!clock.test(time))throw Error('Enter a valid Edinburgh date and 24-hour time.');
 const d=new Date(date+'T00:00:00Z');if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==date)throw Error('Invalid calendar date.');
 return Math.floor(d.getTime()/60000)+Number(time.slice(0,2))*60+Number(time.slice(3));
}
export function normalizeShow(input){
 const title=String(input.title??'').trim(),venue=String(input.venue??'').trim();
 if(!title||!venue||title.length>180||venue.length>180)throw Error('Enter a title and venue (maximum 180 characters each).');
 const date=String(input.date??''),time=String(input.time??'');
 if(date<FESTIVAL_START||date>FESTIVAL_END)throw Error('Select a date within 6–30 August 2027.');
 const start=localMinute(date,time);
 const duration=Number(input.duration),buffer=Number(input.buffer??0),price=Number(input.price??0);
 if(!Number.isInteger(duration)||duration<1||duration>720)throw Error('Duration must be 1–720 whole minutes.');
 if(!Number.isInteger(buffer)||buffer<0||buffer>240)throw Error('Transfer/access buffer must be 0–240 whole minutes.');
 if(!Number.isFinite(price)||price<0||price>10000||!/^\d+(\.\d{1,2})?$/.test(String(input.price??0)))throw Error('Enter a nonnegative GBP price with at most two decimals.');
 const status=String(input.status??'candidate');if(!['candidate','confirmed','booked'].includes(status))throw Error('Invalid personal booking status.');
 return {title,venue,date,time,duration,buffer,price,status,start,end:start+duration};
}
export function itinerary(entries){
 if(!Array.isArray(entries)||entries.length>200)throw Error('Too many shows.');
 const shows=entries.map(normalizeShow).sort((a,b)=>a.start-b.start||a.title.localeCompare(b.title));
 const conflicts=[];
 for(let i=0;i<shows.length;i++)for(let j=i+1;j<shows.length;j++){
  const a=shows[i],b=shows[j];
  const required=a.end+a.buffer;
  if(b.start<required)conflicts.push({first:a.title,second:b.title,shortfallMinutes:required-b.start,reason:b.start<a.end?'overlapping performances':'insufficient transfer/access buffer'});
 }
 return {shows,conflicts,totalGBP:Math.round(shows.reduce((sum,s)=>sum+s.price,0)*100)/100};
}
export function recover(json){try{const x=JSON.parse(json);if(x?.version!==1||!Array.isArray(x.shows))return [];return itinerary(x.shows).shows.map(({title,venue,date,time,duration,buffer,price,status})=>({title,venue,date,time,duration,buffer,price,status}));}catch{return [];}}
export function exportData(shows){return JSON.stringify({version:1,shows:itinerary(shows).shows.map(({title,venue,date,time,duration,buffer,price,status})=>({title,venue,date,time,duration,buffer,price,status}))},null,2);}
