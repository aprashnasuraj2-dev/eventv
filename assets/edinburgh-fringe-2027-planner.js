const int=(v,min,max,label)=>{const s=String(v??"").trim();if(!/^(0|[1-9]\d*)$/.test(s)||Number(s)<min||Number(s)>max)throw Error(label+" must be a whole number from "+min+" to "+max);return Number(s)};
const money=(v,label)=>{const s=String(v??"").trim();if(!/^\d+(?:\.\d{1,2})?$/.test(s))throw Error(label+" requires a nonnegative value, at most two decimal places");const c=Math.round(Number(s)*100);if(!Number.isSafeInteger(c)||c>100000000)throw Error(label+" outside supported range");return c};
const time=s=>{if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(s??""))throw Error("Enter times in HH:MM");return Number(s.slice(0,2))*60+Number(s.slice(3))};
const date=s=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s??""))throw Error("Enter a valid date");const d=new Date(s+"T00:00:00Z");if(!Number.isFinite(d.getTime())||d.toISOString().slice(0,10)!==s)throw Error("Invalid calendar date");return d};
export function budget(v){const p=int(v.people,1,50,"People"),ticket=money(v.ticket,"Ticket"),n=int(v.nights,0,30,"Nights"),hotel=money(v.hotel,"Group lodging per night"),travel=money(v.travel,"Shared travel"),other=money(v.other,"Shared contingency"),c=p*ticket+n*hotel+travel+other;if(!Number.isSafeInteger(c))throw Error("Scenario exceeds supported range");return {total:c/100,perVisitor:c/p/100}}
export function plan(v){const a=time(v.end),b=time(v.start),walk=int(v.walk,0,240,"Transfer"),q=int(v.queue,0,180,"Queue");if(b<=a)throw Error("Second show must begin later on the same date");const spare=b-a-walk-q;return spare>=0?"Hypothetical itinerary has "+spare+" minutes spare. Verify venue door times, accessibility and programme changes.":"Conflict: "+(-spare)+" minutes short after assumed transfer and queue; choose another performance.";}

/** Three self-entered Fringe performances; all times Edinburgh-local, same day. */
export function showChain(v){
 const endA=time(v.endA),startB=time(v.startB),endB=time(v.endB),startC=time(v.startC);
 if(endB<=startB)throw Error("Second performance must have a positive duration on the selected day.");
 const walkAB=int(v.walkAB,0,240,"A-to-B transfer"),queueB=int(v.queueB,0,180,"B entrance"),
       walkBC=int(v.walkBC,0,240,"B-to-C transfer"),queueC=int(v.queueC,0,180,"C entrance");
 const marginAB=startB-endA-walkAB-queueB,marginBC=startC-endB-walkBC-queueC;
 const status=x=>x<0?"CONFLICT "+(-x)+" min short":x<15?"TIGHT "+x+" min":"BUFFERED "+x+" min";
 return {ab:marginAB,bc:marginBC,message:"Show A → B: "+status(marginAB)+". Show B → C: "+status(marginBC)+". Both transfers use your own assumptions. Venue access, actual show duration and late entry remain unverified."};
}
