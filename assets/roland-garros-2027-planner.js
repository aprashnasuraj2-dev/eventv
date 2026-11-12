const number=(v,label,min,max)=>{const s=String(v??"").trim();if(!/^(?:0|[1-9]\d*)$/.test(s)||Number(s)<min||Number(s)>max)throw Error(label+" must be a whole number from "+min+" to "+max);return Number(s)};
const money=(v,label)=>{const s=String(v??"").trim();if(!/^\d+(?:\.\d{1,2})?$/.test(s))throw Error(label+" must be a nonnegative amount with at most 2 decimals");const c=Math.round(Number(s)*100);if(!Number.isSafeInteger(c)||c>100000000)throw Error(label+" out of supported range");return c};
const stamp=v=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(v??""))throw Error("Enter a valid date");const d=new Date(v+"T00:00:00Z");if(!Number.isFinite(d.valueOf())||d.toISOString().slice(0,10)!==v)throw Error("Invalid calendar date");return d};
const clock=(v,label)=>{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v??""))throw Error("Enter a valid "+label+" in 24-hour HH:MM");return Number(v.slice(0,2))*60+Number(v.slice(3))};
const hm=n=>{const x=((n%1440)+1440)%1440;return String(Math.floor(x/60)).padStart(2,"0")+":"+String(x%60).padStart(2,"0")};
export function budget(v){const p=number(v.people,"People",1,50),a=money(v.ticket,"Ticket per person"),n=number(v.nights,"Nights",0,30),h=money(v.hotel,"Group lodging per night"),t=money(v.transport,"Shared transport"),c=money(v.contingency,"Shared contingency");const total=p*a+n*h+t+c;if(!Number.isSafeInteger(total))throw Error("Scenario too large");return {total:total/100,share:total/p/100}};

export function plan(v){
 const d=String(v.date??"");stamp(d);
 const ticket=String(v.ticket??"unknown"),desired=String(v.desired??"day");
 if(!["day","night","unknown"].includes(ticket)||!["day","night"].includes(desired))throw Error("Choose valid session labels.");
 if(d<"2027-05-17"||d>"2027-06-06")return "Outside official 17 May–6 June 2027 tournament dates. This is not evidence of a session or access.";
 if(d<"2027-05-23")return "Opening Week (17–22 May 2027). The cited Philippe-Chatrier day/night split applies from 23 May; do not assume that this ticket-label checker covers Opening Week products.";
 if(d>"2027-06-02")return "Final-phase date "+d+" lies outside the organiser's 23 May–2 June Philippe-Chatrier day/night split. Do not infer that a separate night session is scheduled or offered; check the actual ticket.";
 if(ticket==="unknown")return "From 23 May to 2 June 2027, the FFT describes distinct Philippe-Chatrier day and night tickets. Your proposed access product is unverified; no admission is established.";
 if(ticket!==desired)return "POTENTIAL SESSION MISMATCH for "+d+": "+ticket+" ticket label does not imply admission to the "+desired+" Philippe-Chatrier session. Day and night products are distinct under the official conditions.";
 return "Philippe-Chatrier "+desired+" label matches your selected "+ticket+" product for "+d+", within the published day/night programme window. This does not verify a purchased credential, session start time, player appearance or availability.";
}
