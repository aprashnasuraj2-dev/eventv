const integer=(v,min,max,label)=>{const s=String(v??"").trim();if(!/^(0|[1-9]\d*)$/.test(s)||Number(s)<min||Number(s)>max)throw Error(label+" must be a whole number in "+min+"–"+max);return Number(s)};
const money=(v,label)=>{const s=String(v??"").trim();if(!/^\d+(?:\.\d{1,2})?$/.test(s))throw Error(label+" requires a nonnegative value with up to two decimals");const n=Math.round(Number(s)*100);if(!Number.isSafeInteger(n)||n>100000000)throw Error(label+" exceeds range");return n};
const clock=s=>{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(s??""))throw Error("Enter valid 24-hour clock HH:MM");return Number(s.slice(0,2))*60+Number(s.slice(3))};
const day=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s??""))throw Error("Enter valid date");const d=new Date(s+"T00:00:00Z");if(!Number.isFinite(d.valueOf())||d.toISOString().slice(0,10)!==s)throw Error("Invalid date");return d};
export function budget(v){const p=integer(v.people,1,50,"People"),ticket=money(v.ticket,"Ticket"),n=integer(v.nights,0,30,"Nights"),h=money(v.hotel,"Group lodging per night"),t=money(v.transport,"Shared travel"),c=money(v.extra,"Contingency"),sum=p*ticket+n*h+t+c;if(!Number.isSafeInteger(sum))throw Error("Scenario too large");return {total:sum/100,perPerson:sum/p/100}};

// Official 2027 Suzuka programme identifies the days of the Sprint weekend,
// but lists individual start times as TBC. All times entered here are scenarios.
const sessionDays=Object.freeze({
  practice1:"2027-04-09",
  sprintQualifying:"2027-04-09",
  sprint:"2027-04-10",
  qualifying:"2027-04-10",
  race:"2027-04-11"
});
const sessionNames=Object.freeze({
  practice1:"Practice 1",
  sprintQualifying:"Sprint Qualifying",
  sprint:"Sprint",
  qualifying:"Grand Prix Qualifying",
  race:"Grand Prix Race"
});
const viewerZones=Object.freeze([
  "Europe/London","America/New_York","America/Los_Angeles",
  "Australia/Melbourne","Asia/Kathmandu","Asia/Singapore","UTC"
]);
export function sessionInstant(v){
  const key=String(v.session??"");
  if(!Object.hasOwn(sessionDays,key))throw Error("Select an official Suzuka session.");
  const s=String(v.local??"");
  if(!/^2027-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/.test(s))throw Error("Enter a 2027 Suzuka-local date and 24-hour clock time.");
  day(s.slice(0,10));
  if(s.slice(0,10)!==sessionDays[key])throw Error(sessionNames[key]+" is listed for "+sessionDays[key]+", not "+s.slice(0,10)+". Check the official 2027 programme.");
  const zone=String(v.zone??"");
  if(!viewerZones.includes(zone))throw Error("Select a supported viewer timezone.");
  const utcMs=Date.parse(s+":00Z")-9*3600000;
  if(!Number.isFinite(utcMs))throw Error("Invalid local time.");
  return {session:sessionNames[key],local:s,zone,utcIso:new Date(utcMs).toISOString()};
}
export function plan(v){
  const p=sessionInstant(v);
  const fmt=new Intl.DateTimeFormat("en-GB",{timeZone:p.zone,dateStyle:"full",timeStyle:"short"});
  return p.session+" — user-entered Suzuka time "+p.local.replace("T"," ")+" JST corresponds to "+fmt.format(new Date(p.utcIso))+" in "+p.zone+" (UTC "+p.utcIso.slice(0,16).replace("T"," ")+"). Individual 2027 session start times are TBC on the official F1 page; this is not an announced start, live broadcast listing or ticket entitlement.";
}
