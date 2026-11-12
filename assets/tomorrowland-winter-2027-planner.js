const int=(v,min,max,label)=>{const s=String(v??"").trim();if(!/^(0|[1-9]\d*)$/.test(s)||Number(s)<min||Number(s)>max)throw Error(label+" requires an integer between "+min+" and "+max);return Number(s)};
const money=(v,label)=>{const s=String(v??"").trim();if(!/^\d+(?:\.\d{1,2})?$/.test(s))throw Error(label+" requires a nonnegative number with at most 2 decimals");const n=Math.round(Number(s)*100);if(!Number.isSafeInteger(n)||n>1e8)throw Error(label+" exceeds supported range");return n};
const clock=s=>{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(s??""))throw Error("Enter HH:MM in 24-hour time");return Number(s.slice(0,2))*60+Number(s.slice(3))};
const hm=n=>{const a=((n%1440)+1440)%1440;return String(Math.floor(a/60)).padStart(2,"0")+":"+String(a%60).padStart(2,"0")};
export function budget(v){const p=int(v.people,1,50,"People"),t=money(v.ticket,"Ticket"),n=int(v.nights,0,30,"Nights"),h=money(v.hotel,"Group hotel per night"),tr=money(v.transport,"Transport"),b=money(v.extra,"Contingency"),sum=p*t+n*h+tr+b;if(!Number.isSafeInteger(sum))throw Error("Total exceeds supported range");return {total:sum/100,perPerson:sum/p/100}};
export function plan(v){const p=int(v.people,1,50,"People"),ticket=money(v.ticket,"Festival ticket"),hotel=money(v.hotel,"Extra hotel"),travel=money(v.travel,"Extra transport"),lift=money(v.lift,"Extra lift pass"),all=p*(ticket+lift)+hotel+travel;return "Scenario total EUR "+(all/100).toFixed(2)+" for "+p+" visitors. Official festival tickets include a lift/ski pass; adding another lift pass may double-count it. Never add bundled lodging or transfer twice.";}

/** Official 2027 product WINDOWS; a 1-day purchase must still match its actual selected date. */
export function accessDay(v){
 const d=String(v.date??""),k=String(v.kind??"");
 const dayMatch=/^2027-03-\d{2}$/;
 if(!dayMatch.test(d)||d<"2027-03-01"||d>"2027-03-31")throw Error("Choose a valid March 2027 date.");
 const end=new Date(d+"T00:00:00Z");
 if(!Number.isFinite(end.valueOf())||end.toISOString().slice(0,10)!==d)throw Error("Invalid calendar date.");
 const types={seven:["2027-03-20","2027-03-26"],four:["2027-03-23","2027-03-26"],earlyOne:["2027-03-20","2027-03-22"],lateOne:["2027-03-23","2027-03-26"]};
 if(!Object.hasOwn(types,k))throw Error("Select one of the organiser-listed ticket windows.");
 if(d==="2027-03-27")return "27 March is listed as an accommodation checkout endpoint for many packages, not an additional festival-ticket day. The cited festival access runs through 26 March; verify your product.";
 const [min,max]=types[k],inWindow=d>=min&&d<=max;
 if(!inWindow)return "Potential mismatch: "+d+" falls outside the stated "+min+"–"+max+" window for that ticket category. Check the actual product date and terms.";
 return (d<="2027-03-22"?"MainStage is described as CLOSED on this early-week date.":"MainStage is described as OPEN in the official Tuesday–Friday window.")+" Selected date is in the published "+min+"–"+max+" category window. A one-day ticket still needs to be bought for this exact date; this tool cannot verify a pass or live stock.";
}
