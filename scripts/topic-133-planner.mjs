export const CITIES={Perth:'Australia/Perth',Adelaide:'Australia/Adelaide',Brisbane:'Australia/Brisbane',Sydney:'Australia/Sydney',Melbourne:'Australia/Melbourne',Newcastle:'Australia/Sydney',Townsville:'Australia/Brisbane'};
export function planMatches(rows,minimumHours=4){
 if(!Array.isArray(rows)||rows.length>30)throw Error('Enter at most 30 matches');
 if(!Number.isFinite(minimumHours)||minimumHours<0||minimumHours>72)throw Error('Transfer buffer must be 0–72 hours');
 const results=rows.map((row,i)=>{
  const city=String(row.city||'');if(!CITIES[city])throw Error('Select an official host city');
  const time=String(row.time||'');if(!/^2027-(10-(0[1-9]|[12][0-9]|3[01])|11-(0[1-9]|1[0-3]))T([01][0-9]|2[0-3]):[0-5][0-9]$/.test(time))throw Error('Enter a valid tournament date and local time');
  const name=String(row.name||'').trim();if(!name||name.length>90)throw Error('Match label must contain 1–90 characters');
  const [date,clock]=time.split('T');const [year,month,day]=date.split('-').map(Number);const [hour,minute]=clock.split(':').map(Number);
  if(new Date(Date.UTC(year,month-1,day)).toISOString().slice(0,10)!==date)throw Error('Invalid calendar date');
  const tz=CITIES[city];let guess=Date.UTC(year,month-1,day,hour,minute);
  for(let n=0;n<3;n++){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(guess)).filter(x=>x.type!=='literal').map(x=>[x.type,Number(x.value)]));guess+=Date.UTC(year,month-1,day,hour,minute)-Date.UTC(parts.year,parts.month-1,parts.day,parts.hour,parts.minute)}
  return {name,city,time,utc:new Date(guess).toISOString(),index:i};
 }).sort((a,b)=>a.utc.localeCompare(b.utc));
 const warnings=[];for(let i=1;i<results.length;i++){const prev=results[i-1],next=results[i],hours=(Date.parse(next.utc)-Date.parse(prev.utc))/36e5;if(hours<minimumHours)warnings.push('Short gap ('+hours.toFixed(1)+' h) between '+prev.name+' and '+next.name+(prev.city!==next.city?' across different cities':'')+'.');}
 return {matches:results,warnings};
}