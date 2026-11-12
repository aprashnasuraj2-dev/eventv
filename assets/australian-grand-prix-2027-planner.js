const int=(v,min,max,label)=>{const s=String(v??"").trim();if(!/^(0|[1-9]\d*)$/.test(s)||Number(s)<min||Number(s)>max)throw Error(label+" requires an integer between "+min+" and "+max);return Number(s)};
const money=(v,label)=>{const s=String(v??"").trim();if(!/^\d+(?:\.\d{1,2})?$/.test(s))throw Error(label+" requires a nonnegative number with at most 2 decimals");const n=Math.round(Number(s)*100);if(!Number.isSafeInteger(n)||n>1e8)throw Error(label+" exceeds supported range");return n};
const clock=s=>{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(s??""))throw Error("Enter HH:MM in 24-hour time");return Number(s.slice(0,2))*60+Number(s.slice(3))};
const hm=n=>{const a=((n%1440)+1440)%1440;return String(Math.floor(a/60)).padStart(2,"0")+":"+String(a%60).padStart(2,"0")};
export function budget(v){const p=int(v.people,1,50,"People"),t=money(v.ticket,"Ticket"),n=int(v.nights,0,30,"Nights"),h=money(v.hotel,"Group hotel per night"),tr=money(v.transport,"Transport"),b=money(v.extra,"Contingency"),sum=p*t+n*h+tr+b;if(!Number.isSafeInteger(sum))throw Error("Total exceeds supported range");return {total:sum/100,perPerson:sum/p/100}};
export function plan(v){const start=clock(v.start),a=int(v.travel,0,1440,"Travel"),b=int(v.queue,0,600,"Queue"),c=int(v.walk,0,240,"Gate walk"),m=int(v.margin,0,240,"Extra margin"),total=a+b+c+m,departure=start-total;return "For your assumed verified "+hm(start)+" start, leave at "+hm(departure)+(departure>=0?" on the same day":departure>-1440?" the previous day":" "+Math.ceil((-departure)/1440)+" days before")+". "+total+" minutes of user-supplied travel, security, walking and margin; not a transit or session feed.";}

/** Official 2027 Sprint weekend session DAY; the organiser's clock fields are TBC. */
export function sessionDay(v){
 const days={practice1:"2027-04-02",sprintQualifying:"2027-04-02",sprint:"2027-04-03",qualifying:"2027-04-03",race:"2027-04-04"};
 const s=String(v.session??""),d=String(v.date??"");
 if(!Object.hasOwn(days,s))throw Error("Choose a supported Australian GP 2027 session.");
 if(!/^2027-04-\d{2}$/.test(d))throw Error("Enter a valid 2027 session date.");
 const parsed=new Date(d+"T00:00:00Z");
 if(!Number.isFinite(parsed.valueOf())||parsed.toISOString().slice(0,10)!==d)throw Error("Invalid session date.");
 if(days[s]!==d)return "SESSION-DAY MISMATCH: The official 2027 programme lists "+s+" on "+days[s]+", not "+d+". Confirm your ticket day; no admission is inferred.";
 return "Your selected date matches the organiser's published day for "+s+". Exact session clock times remain TBC: enter only an independently verified time into the departure calculator.";
}
