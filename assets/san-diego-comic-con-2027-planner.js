const number=(v,label,min,max)=>{const s=String(v??"").trim();if(!/^(?:0|[1-9]\d*)$/.test(s)||Number(s)<min||Number(s)>max)throw Error(label+" must be a whole number from "+min+" to "+max);return Number(s)};
const money=(v,label)=>{const s=String(v??"").trim();if(!/^\d+(?:\.\d{1,2})?$/.test(s))throw Error(label+" must be a nonnegative amount with at most 2 decimals");const c=Math.round(Number(s)*100);if(!Number.isSafeInteger(c)||c>100000000)throw Error(label+" out of supported range");return c};
const stamp=v=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(v??""))throw Error("Enter a valid date");const d=new Date(v+"T00:00:00Z");if(!Number.isFinite(d.valueOf())||d.toISOString().slice(0,10)!==v)throw Error("Invalid calendar date");return d};
const clock=(v,label)=>{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(v??""))throw Error("Enter a valid "+label+" in 24-hour HH:MM");return Number(v.slice(0,2))*60+Number(v.slice(3))};
const hm=n=>{const x=((n%1440)+1440)%1440;return String(Math.floor(x/60)).padStart(2,"0")+":"+String(x%60).padStart(2,"0")};
export function budget(v){const p=number(v.people,"People",1,50),a=money(v.ticket,"Ticket per person"),n=number(v.nights,"Nights",0,30),h=money(v.hotel,"Group lodging per night"),t=money(v.transport,"Shared transport"),c=money(v.contingency,"Shared contingency");const total=p*a+n*h+t+c;if(!Number.isSafeInteger(total))throw Error("Scenario too large");return {total:total/100,share:total/p/100}};

export function plan(v){
 const s=String(v.date??"");stamp(s);
 const covers={preview:"2027-07-21",thursday:"2027-07-22",friday:"2027-07-23",saturday:"2027-07-24",sunday:"2027-07-25",multi:null,unknown:null};
 const badge=String(v.badgeDay??"unknown");if(!Object.hasOwn(covers,badge))throw Error("Select a supported badge-day label.");
 if(s<"2027-07-21"||s>"2027-07-25")return "Outside the official Comic-Con 2027 Preview Night and main-convention dates. This does not evaluate off-site or other events.";
 const isPreview=s==="2027-07-21";
 const dayType=isPreview?"Preview Night":"main convention";
 if(badge==="unknown")return s+" is a "+dayType+" date. Badge-day coverage is unverified; calendar classification cannot authorize admission.";
 if(badge==="multi")return s+" is a "+dayType+" date. Multi-day badge contents and Preview Night entitlement must be checked on the exact 2027 product; no access guarantee is inferred.";
 if(covers[badge]!==s)return "POTENTIAL BADGE-DAY MISMATCH: the selected "+badge+" day label corresponds to "+covers[badge]+", while the intended "+dayType+" visit is "+s+". Check the registered badge, transfer and pickup rules.";
 return "Day labels match for "+s+" ("+dayType+"). A valid acquired badge and individual venue rules are still required; panel seats and capacity-controlled activities are not guaranteed.";
}
