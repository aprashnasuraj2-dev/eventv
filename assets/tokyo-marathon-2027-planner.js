const int=(v,min,max,label)=>{const s=String(v??"").trim();if(!/^(0|[1-9]\d*)$/.test(s)||Number(s)<min||Number(s)>max)throw Error(label+" must be a whole number from "+min+" to "+max);return Number(s)};
const money=(v,label)=>{const s=String(v??"").trim();if(!/^\d+(?:\.\d{1,2})?$/.test(s))throw Error(label+" requires a nonnegative value, at most two decimal places");const c=Math.round(Number(s)*100);if(!Number.isSafeInteger(c)||c>100000000)throw Error(label+" outside supported range");return c};
const time=s=>{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(s??""))throw Error("Enter times in HH:MM");return Number(s.slice(0,2))*60+Number(s.slice(3))};
const date=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s??""))throw Error("Enter a valid date");const d=new Date(s+"T00:00:00Z");if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==s)throw Error("Invalid calendar date");return d};
export function budget(v){const p=int(v.people,1,50,"People"),ticket=money(v.ticket,"Ticket"),n=int(v.nights,0,30,"Nights"),hotel=money(v.hotel,"Group lodging per night"),travel=money(v.travel,"Shared travel"),other=money(v.other,"Shared contingency"),c=p*ticket+n*hotel+travel+other;if(!Number.isSafeInteger(c))throw Error("Scenario exceeds supported range");return {total:c/100,perVisitor:c/p/100}}
export function plan(v){const hours=int(v.h,2,12,"Hours"),minutes=int(v.m,0,59,"Minutes"),pace=(hours*3600+minutes*60)/42.195;const m=Math.floor(pace/60),s=Math.round(pace%60);return "Hypothetical constant pace "+(m+(s===60?1:0))+":"+String(s===60?0:s).padStart(2,"0")+" per km over 42.195 km. Not a race admission, fitness, course cutoff or personal finish prediction.";}

/** Tokyo Marathon 2027 packet pickup published by the organiser; JST local clock. */
export function packetPickup(v){
 const s=String(v.date??"");
 const hours={"2027-03-04":"20:30","2027-03-05":"20:30","2027-03-06":"17:30"};
 if(!Object.hasOwn(hours,s))throw Error("Runner packet pickup is only published for 4–6 March 2027; there is no race-day pickup.");
 const t=String(v.arrival??"");
 if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(t))throw Error("Enter a valid arrival clock time (JST).");
 const mins=Number(t.slice(0,2))*60+Number(t.slice(3));
 const close=Number(hours[s].slice(0,2))*60+Number(hours[s].slice(3));
 const queue=int(v.queue,0,180,"Queue allowance");
 const buffer=close-mins-queue;
 if(mins<600)return "Your assumed arrival is before the published 10:00 opening; do not assume early registration. Official closing is "+hours[s]+" JST.";
 return (buffer<0?"POTENTIAL MISS: "+(-buffer)+" minutes beyond your conservative queue allowance.":"Conservative arrival buffer: "+buffer+" minutes until the published closing, after the "+queue+"-minute queue allowance.")+" Check your actual assigned registration, travel, photo-ID and entry requirements; this model does not establish acceptance or guarantee service.";
}
