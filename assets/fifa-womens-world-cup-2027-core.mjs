// Topic 41: offline planning primitives. No official fixtures, travel estimates or ticket inventory.
export const CITIES=Object.freeze(["Belo Horizonte","Brasília","Fortaleza","Porto Alegre","Recife","Rio de Janeiro","Salvador","São Paulo"]);
const pad=n=>String(n).padStart(2,"0");
export function brazilWallToUtc(date,time){
 if(!/^2027-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date)||!/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(time))throw Error("Enter a valid 2027 date and HH:MM.");
 const [y,m,d]=date.split("-").map(Number),[h,min]=time.split(":").map(Number);
 const utc=Date.UTC(y,m-1,d,h+3,min); // Brazil host cities currently observe UTC−03; verify 2027 legislation before publication.
 const check=new Date(utc-3*3600000);
 if(check.getUTCFullYear()!==y||check.getUTCMonth()!==m-1||check.getUTCDate()!==d)throw Error("Invalid calendar date.");
 return new Date(utc).toISOString();
}
export function formatInstant(iso,zone){
 const dt=new Date(iso);if(!Number.isFinite(dt.getTime()))throw Error("Invalid instant.");
 return new Intl.DateTimeFormat("en-GB",{timeZone:zone,dateStyle:"full",timeStyle:"short",hourCycle:"h23"}).format(dt);
}
export function planGap(first,second,travelHours,arrivalHours=2,riskHours=1){
 for(const n of [travelHours,arrivalHours,riskHours])if(typeof n!=="number"||!Number.isFinite(n)||n<0)throw Error("Enter finite, nonnegative hour estimates.");
 const a=Date.parse(first),b=Date.parse(second);
 if(!Number.isFinite(a)||!Number.isFinite(b))throw Error("Valid kickoff instants required.");
 const gap=(b-a)/3600000,required=travelHours+arrivalHours+riskHours;
 return {gapHours:gap,requiredHours:required,slackHours:gap-required,feasibleByUserAssumptions:gap>=required,warning:"Hypothetical: flight availability, delays, local transit and venue rules are not verified."};
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
