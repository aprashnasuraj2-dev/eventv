const integer=(v,min,max,label)=>{const s=String(v??"").trim();if(!/^(0|[1-9]\d*)$/.test(s)||Number(s)<min||Number(s)>max)throw Error(label+" must be a whole number in "+min+"–"+max);return Number(s)};
const money=(v,label)=>{const s=String(v??"").trim();if(!/^\d+(?:\.\d{1,2})?$/.test(s))throw Error(label+" requires a nonnegative value with up to two decimals");const n=Math.round(Number(s)*100);if(!Number.isSafeInteger(n)||n>100000000)throw Error(label+" exceeds range");return n};
const clock=s=>{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(s??""))throw Error("Enter valid 24-hour clock HH:MM");return Number(s.slice(0,2))*60+Number(s.slice(3))};
const day=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s??""))throw Error("Enter valid date");const d=new Date(s+"T00:00:00Z");if(!Number.isFinite(d.valueOf())||d.toISOString().slice(0,10)!==s)throw Error("Invalid date");return d};
export function budget(v){const p=integer(v.people,1,50,"People"),ticket=money(v.ticket,"Ticket"),n=integer(v.nights,0,30,"Nights"),h=money(v.hotel,"Group lodging per night"),t=money(v.transport,"Shared travel"),c=money(v.extra,"Contingency"),sum=p*ticket+n*h+t+c;if(!Number.isSafeInteger(sum))throw Error("Scenario too large");return {total:sum/100,perPerson:sum/p/100}};

// Official session DAYS only, not session hours. The 2027 F1 page lists TBC
// clock times. Inputs here are visitor estimates in Singapore Standard Time.
const dayOfSession=Object.freeze({
  practice1:"2027-10-08",
  practice2:"2027-10-08",
  practice3:"2027-10-09",
  qualifying:"2027-10-09",
  race:"2027-10-10"
});
const labels=Object.freeze({
  practice1:"Practice 1",practice2:"Practice 2",practice3:"Practice 3",
  qualifying:"Qualifying",race:"Grand Prix Race"
});
const datetime=s=>{
  if(!/^2027-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/.test(s??""))throw Error("Enter a valid 2027 Singapore-local date and time.");
  day(s.slice(0,10));
  return Date.parse(s+":00Z");
};
const display=s=>s.replace("T"," ")+" SGT";
export function feasibility(v){
  const category=String(v.session??"");
  if(!Object.hasOwn(dayOfSession,category))throw Error("Choose one of the published 2027 Singapore session days.");
  const end=String(v.end??""),last=String(v.last??"");
  const endMs=datetime(end),lastMs=datetime(last);
  const date=end.slice(0,10);
  if(date!==dayOfSession[category]&&date!==new Date(Date.parse(dayOfSession[category]+"T00:00:00Z")+86400000).toISOString().slice(0,10))throw Error(labels[category]+" is scheduled for "+dayOfSession[category]+"; session end must be on that date or the following day.");
  if(lastMs<endMs)throw Error("Your selected last departure occurs before the assumed session end. Enter the correct service date (including after midnight).");
  if(lastMs-endMs>12*3600000)throw Error("A gap above 12 hours is outside this last-departure model; verify the departure date.");
  const queue=integer(v.queue,0,300,"Exit queue"),walk=integer(v.walk,0,240,"Transfer"),delay=integer(v.delay,0,180,"Additional delay");
  const readyMs=endMs+(queue+walk+delay)*60000,spare=Math.round((lastMs-readyMs)/60000);
  return {session:labels[category],end,departure:last,ready:new Date(readyMs).toISOString().slice(0,16),spare,queue,walk,delay};
}
export function plan(v){
  const r=feasibility(v),status=r.spare<0?"MISSED":r.spare<15?"TIGHT":"BUFFERED";
  return r.session+" user-entered hypothetical end "+display(r.end)+". Ready at "+display(r.ready)+" after "+r.queue+" min exit, "+r.walk+" min transfer and "+r.delay+" min extra delay. Your separately verified last departure "+display(r.departure)+" leaves "+r.spare+" min spare ("+status+"). A further 15-minute disruption would leave "+(r.spare-15)+" min. No live rail timetable, traffic feed or official 2027 session clock is supplied.";
}
