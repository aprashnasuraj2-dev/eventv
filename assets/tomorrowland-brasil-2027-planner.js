const number=(v,label,min,max)=>{const s=String(v??"").trim();if(!/^(?:0|[1-9]\d*)$/.test(s)||Number(s)<min||Number(s)>max)throw Error(label+" must be a whole number from "+min+" to "+max);return Number(s)};
const money=(v,label)=>{const s=String(v??"").trim();if(!/^\d+(?:\.\d{1,2})?$/.test(s))throw Error(label+" must be a nonnegative amount with at most 2 decimals");const c=Math.round(Number(s)*100);if(!Number.isSafeInteger(c)||c>100000000)throw Error(label+" out of supported range");return c};
const stamp=v=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(v??""))throw Error("Enter a valid date");const d=new Date(v+"T00:00:00Z");if(!Number.isFinite(d.valueOf())||d.toISOString().slice(0,10)!==v)throw Error("Invalid calendar date");return d};
const clock=(v,label)=>{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v??""))throw Error("Enter a valid "+label+" in 24-hour HH:MM");return Number(v.slice(0,2))*60+Number(v.slice(3))};
const hm=n=>{const x=((n%1440)+1440)%1440;return String(Math.floor(x/60)).padStart(2,"0")+":"+String(x%60).padStart(2,"0")};
export function budget(v){const p=number(v.people,"People",1,50),a=money(v.ticket,"Ticket per person"),n=number(v.nights,"Nights",0,30),h=money(v.hotel,"Group lodging per night"),t=money(v.transport,"Shared transport"),c=money(v.contingency,"Shared contingency");const total=p*a+n*h+t+c;if(!Number.isSafeInteger(total))throw Error("Scenario too large");return {total:total/100,share:total/p/100}};

export function plan(v){
 const date=String(v.date??"");stamp(date);
 const tier=String(v.ticket??"unknown");
 const tierDate={friday:"2027-04-30",saturday:"2027-05-01",sunday:"2027-05-02",weekend:null,unknown:null};
 if(!Object.hasOwn(tierDate,tier))throw Error("Choose a supported ticket-date label.");
 if(date<"2027-04-30"||date>"2027-05-02")return "Outside the announced Tomorrowland Brasil 2027 festival dates. Verify any separate accommodation or arrival entitlement.";
 if(tier==="unknown")return "Festival date "+date+" is within 30 April–2 May 2027. Ticket category not yet verified; this does not establish access.";
 if(tier==="weekend")return "Date "+date+" falls in the announced festival weekend. An actual Full Madness or multi-day product must explicitly cover the selected date; this label does not verify purchase, admission or live inventory.";
 if(tierDate[tier]!==date)return "POTENTIAL MISMATCH: "+tier+" day category corresponds to "+tierDate[tier]+" but your visit is "+date+". Check the actual badge/ticket product before travel.";
 return "Day labels are consistent: "+tier+" corresponds to "+date+". As of the organiser-page snapshot checked 12 November 2026, Friday/Sunday categories were offered and Saturday/Full Madness were waitlisted. Stock may change. Matching labels is not admission proof.";
}
