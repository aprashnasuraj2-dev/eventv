const number=(v,label,min,max)=>{const s=String(v??"").trim();if(!/^(?:0|[1-9]\d*)$/.test(s)||Number(s)<min||Number(s)>max)throw Error(label+" must be a whole number from "+min+" to "+max);return Number(s)};
const money=(v,label)=>{const s=String(v??"").trim();if(!/^\d+(?:\.\d{1,2})?$/.test(s))throw Error(label+" must be a nonnegative amount with at most 2 decimals");const c=Math.round(Number(s)*100);if(!Number.isSafeInteger(c)||c>100000000)throw Error(label+" out of supported range");return c};
const stamp=v=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(v??""))throw Error("Enter a valid date");const d=new Date(v+"T00:00:00Z");if(!Number.isFinite(d.valueOf())||d.toISOString().slice(0,10)!==v)throw Error("Invalid calendar date");return d};
const clock=(v,label)=>{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v??""))throw Error("Enter a valid "+label+" in 24-hour HH:MM");return Number(v.slice(0,2))*60+Number(v.slice(3))};
const hm=n=>{const x=((n%1440)+1440)%1440;return String(Math.floor(x/60)).padStart(2,"0")+":"+String(x%60).padStart(2,"0")};
export function budget(v){const p=number(v.people,"People",1,50),a=money(v.ticket,"Ticket per person"),n=number(v.nights,"Nights",0,30),h=money(v.hotel,"Group lodging per night"),t=money(v.transport,"Shared transport"),c=money(v.contingency,"Shared contingency");const total=p*a+n*h+t+c;if(!Number.isSafeInteger(total))throw Error("Scenario too large");return {total:total/100,share:total/p/100}};
export function plan(v){const p=number(v.people,"Delegates",1,50),rate=money(v.per,"Rate"),alternative=money(v.alternate,"Alternate rate");const x=p*rate,y=p*alternative;return "For "+p+" delegates: your verified-category scenario is USD "+(x/100).toFixed(2)+"; alternate is USD "+(y/100).toFixed(2)+"; difference USD "+((x-y)/100).toFixed(2)+". Eligibility and actual checkout rates must be checked with NRF.";}

/** Snapshot of official NRF 2027 published per-person USD rates, checked 2026-11-12.
 * This is pricing arithmetic, NOT a badge eligibility or availability decision. */
export function quote2027(v){
 const d=String(v.date??"");
 const dateRx=/^\d{4}-\d{2}-\d{2}$/;
 if(!dateRx.test(d))throw Error("Enter a valid purchase-date scenario.");
 const parsed=new Date(d+"T00:00:00Z");
 if(!Number.isFinite(parsed.valueOf())||parsed.toISOString().slice(0,10)!==d||d<"2026-10-01"||d>"2027-01-12")throw Error("Choose a valid date in the published 2026–27 rate period.");
 const p=number(v.people,"Delegates",1,50),segment=String(v.segment),membership=String(v.membership),kind=String(v.pass);
 if(!["retail","nonretail"].includes(segment)||!["member","nonmember"].includes(membership)||!["all","expo"].includes(kind))throw Error("Choose supported badge categories and pass type.");
 let unit,notes=[];
 if(segment==="nonretail"){
   const cap=membership==="member"?5:2;
   if(p>cap)throw Error("Official non-retail company limit is "+cap+" registrations; group size is not eligible as modeled.");
   if(kind==="all")unit=membership==="member"?2600:3800;
   else unit=membership==="member"?(d<="2026-12-30"?2000:2100):(d<="2026-12-30"?3200:3500);
   notes.push("Non-retail category and company limit require NRF verification.");
 }else if(kind==="expo"){
   unit=d<="2026-12-30"?0:100;
   notes.push("Retail classification must be confirmed by NRF; Expo access is not All-Access.");
 }else{
   if(p>=5){
     unit=p>=10?(membership==="member"?750:1250):(membership==="member"?900:1500);
     notes.push("Team rate assumes all passes are bought by the same eligible company at the same time.");
   }else{
     const window=d<="2026-10-02"?0:d<="2026-11-19"?1:d<="2027-01-07"?2:3;
     unit=(membership==="member"?[1100,1200,1300,1400]:[2100,2200,2300,2400])[window];
   }
   notes.push("Only a verified retail-eligible company can use these published retail rates.");
 }
 return {rate:unit,total:unit*p,people:p,kind,asOf:d,notes:notes.join(" ")};
}
