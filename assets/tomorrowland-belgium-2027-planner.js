const int=(v,min,max,label)=>{const s=String(v??"").trim();if(!/^(0|[1-9]\d*)$/.test(s)||Number(s)<min||Number(s)>max)throw Error(label+" requires an integer between "+min+" and "+max);return Number(s)};
const money=(v,label)=>{const s=String(v??"").trim();if(!/^\d+(?:\.\d{1,2})?$/.test(s))throw Error(label+" requires a nonnegative number with at most 2 decimals");const n=Math.round(Number(s)*100);if(!Number.isSafeInteger(n)||n>1e8)throw Error(label+" exceeds supported range");return n};
const clock=s=>{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(s??""))throw Error("Enter HH:MM in 24-hour time");return Number(s.slice(0,2))*60+Number(s.slice(3))};
const hm=n=>{const a=((n%1440)+1440)%1440;return String(Math.floor(a/60)).padStart(2,"0")+":"+String(a%60).padStart(2,"0")};
export function budget(v){const p=int(v.people,1,50,"People"),t=money(v.ticket,"Ticket"),n=int(v.nights,0,30,"Nights"),h=money(v.hotel,"Group hotel per night"),tr=money(v.transport,"Transport"),b=money(v.extra,"Contingency"),sum=p*t+n*h+tr+b;if(!Number.isSafeInteger(sum))throw Error("Total exceeds supported range");return {total:sum/100,perPerson:sum/p/100}};

function isDate(value){const s=String(value??"");if(!/^2027-\d{2}-\d{2}$/.test(s))return false;const d=new Date(s+"T00:00:00Z");return Number.isFinite(d.valueOf())&&d.toISOString().slice(0,10)===s}
const official=link=>/^https:\/\/(?:[a-z0-9-]+\.)*tomorrowland\.com(?:\/|$)/i.test(String(link??"").trim());
const https=link=>/^https:\/\/[a-z0-9][a-z0-9.-]+(?:\/|$)/i.test(String(link??"").trim());
export function evidence(v){
 const keys=["dates","tickets","travel"];
 if(keys.some(k=>!["yes","no"].includes(v[k])))throw Error("Complete every evidence status.");
 if(v.dates==="yes"){
   if(!official(v.datesUrl))throw Error("A date confirmation requires a Tomorrowland-owned HTTPS source link.");
   if(!isDate(v.start)||!isDate(v.end)||v.end<v.start)throw Error("Provide a valid 2027 start/end range from that official announcement.");
 }
 if(v.tickets==="yes"&&!official(v.ticketsUrl))throw Error("Ticket confirmation requires a Tomorrowland-owned HTTPS source link.");
 if(v.travel==="yes"&&!https(v.travelUrl))throw Error("Travel confirmation requires an HTTPS source link.");
 const checked=keys.filter(k=>v[k]==="yes"),missing=keys.filter(k=>v[k]==="no");
 return {verified:checked.length,missing,claimedDates:v.dates==="yes"?[v.start,v.end]:null};
}
export function plan(v){
 const s=evidence(v);
 return s.verified+" / 3 source-backed claims recorded BY YOU. Missing: "+(s.missing.length?s.missing.join(", "):"none")+". "+(s.claimedDates?"You entered a claimed 2027 date range "+s.claimedDates.join("–")+". This has NOT been fetched or independently verified by this tool.":"Exact Belgium 2027 festival dates remain unannounced in the cited September 2026 FAQ.")+" The tool validates link shape only, not source truth or real-time sales.";
}
