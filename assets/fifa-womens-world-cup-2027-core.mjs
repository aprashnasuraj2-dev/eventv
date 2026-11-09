// Topic 41: offline planning primitives. No official fixtures, travel estimates or ticket inventory.
export const CITIES=Object.freeze(["Belo Horizonte","Brasília","Fortaleza","Porto Alegre","Recife","Rio de Janeiro","Salvador","São Paulo"]);
const pad=n=>String(n).padStart(2,"0");
// Resolve Brazil wall time using the runtime IANA database, not a legislated-future offset guess.
// Search the bounded set of plausible offsets; reject gaps and ambiguous local instants.
const brazilParts = new Intl.DateTimeFormat("en-GB",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"});
function wallParts(ms){const x=Object.fromEntries(brazilParts.formatToParts(new Date(ms)).filter(p=>p.type!=="literal").map(p=>[p.type,p.value]));return [x.year,x.month,x.day,x.hour,x.minute].join("-");}
export function brazilWallToUtc(date,time){
 if(!/^2027-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date)||!/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(time))throw Error("Enter a valid 2027 date and HH:MM.");
 const [y,m,d]=date.split("-").map(Number),[h,min]=time.split(":").map(Number);
 const wall=Date.UTC(y,m-1,d,h,min);
 if(new Date(wall).getUTCFullYear()!==y||new Date(wall).getUTCMonth()!==m-1||new Date(wall).getUTCDate()!==d)throw Error("Invalid calendar date.");
 const target=[String(y),pad(m),pad(d),pad(h),pad(min)].join("-");
 const matches=[];
 for(let offset=-14;offset<=14;offset+=0.25){const ms=wall-offset*3600000;if(wallParts(ms)===target)matches.push(ms);}
 const unique=[...new Set(matches)];
 if(unique.length===0)throw Error("Nonexistent Brazil wall time under installed IANA timezone rules.");
 if(unique.length>1)throw Error("Ambiguous Brazil wall time under installed IANA timezone rules.");
 return new Date(unique[0]).toISOString();
}
export function formatInstant(iso,zone){
 const dt=new Date(iso);if(!Number.isFinite(dt.getTime()))throw Error("Invalid instant.");
 return new Intl.DateTimeFormat("en-GB",{timeZone:zone,dateStyle:"full",timeStyle:"short",hourCycle:"h23"}).format(dt);
}
export function planGap(first,second,travelHours,arrivalHours=2,riskHours=1,firstMatchHours=2.5){
 for(const n of [travelHours,arrivalHours,riskHours,firstMatchHours])if(typeof n!=="number"||!Number.isFinite(n)||n<0)throw Error("Enter finite, nonnegative hour estimates.");
 const a=Date.parse(first),b=Date.parse(second);
 if(!Number.isFinite(a)||!Number.isFinite(b))throw Error("Valid kickoff instants required.");
 const kickoffGap=(b-a)/3600000,gap=kickoffGap-firstMatchHours,required=travelHours+arrivalHours+riskHours;
 return {kickoffGapHours:kickoffGap,firstMatchHours: firstMatchHours,gapHours:gap,requiredHours:required,slackHours:gap-required,feasibleByUserAssumptions:gap>=required,warning:"Hypothetical: flight availability, delays, local transit and venue rules are not verified."};
}
export function validateNotebookItem(x){
 if(!x||typeof x!=="object"||!CITIES.includes(x.city)||typeof x.note!=="string"||x.note.length>2000)throw Error("Invalid notebook entry.");
 if(!["USER_INPUT","CONFIRMED","PENDING","HISTORICAL","CONFLICTED"].includes(x.status))throw Error("Invalid evidence status.");
 if(x.status==="CONFIRMED"&&(!/^https:\/\//.test(x.source||"")||!/^\d{4}-\d{2}-\d{2}$/.test(x.checked||"")))throw Error("Confirmed entries require source and check date.");
 return {city:x.city,note:x.note,status:x.status,source:String(x.source||""),checked:String(x.checked||"")};
}
export function safeCsvCell(value){
 const s=String(value??"");const neutral=/^[\s]*[=+@-]/.test(s)?"'"+s:s;
 return '"'+neutral.replace(/"/g,'""')+'"';
}
export function exportNotebook(items){
 if(!Array.isArray(items)||items.length>500)throw Error("Notebook exceeds limit.");
 return ["city,note,status,source,checked",...items.map(item=>{const x=validateNotebookItem(item);return [x.city,x.note,x.status,x.source,x.checked].map(safeCsvCell).join(",");})].join("\r\n");
}
