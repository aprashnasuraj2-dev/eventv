export const windows = Object.freeze({
"2027-05-18":{label:"Tuesday · members",start:480,end:1200,member:true},
"2027-05-19":{label:"Wednesday · members",start:480,end:1200,member:true},
"2027-05-20":{label:"Thursday · public",start:480,end:1200,member:false},
"2027-05-21":{label:"Friday · public",start:480,end:1200,member:false},
"2027-05-22":{label:"Saturday · public",start:480,end:1050,member:false}
});
export const minutes = s => {if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(s))throw Error("Enter a valid 24-hour time."); const [h,m]=s.split(":").map(Number);return h*60+m};
export const clock = n => {if(!Number.isInteger(n)||n<0)throw Error("Invalid clock minutes.");const day=Math.floor(n/1440);const time=String(Math.floor(n%1440/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0");return time+(day?" (next day)":"");};
export function assess({date,arrival,minutesInside,buffer=30,membership="public",ticket="public",guestCount=0}){
 const w=windows[date];if(!w)throw Error("Choose a published 2027 show date.");
 const start=minutes(arrival),duration=Number(minutesInside),margin=Number(buffer),guests=Number(guestCount);
 if(!Number.isInteger(duration)||duration<15||duration>900)throw Error("Visit duration must be 15–900 minutes.");
 if(!Number.isInteger(margin)||margin<0||margin>240)throw Error("Buffer must be 0–240 minutes.");
 if(!Number.isInteger(guests)||guests<0||guests>30)throw Error("Guest count must be 0–30.");
 if(!["member","public"].includes(membership)||!["member","public"].includes(ticket))throw Error("Invalid ticket or membership category.");
 const warnings=[];
 if(w.member && membership!=="member")warnings.push("Member days require a qualifying RHS member to purchase member-day tickets; a public ticket alone is insufficient.");
 if(w.member && ticket!=="member")warnings.push("A member-day ticket is required; verify each guest's issued ticket.");
 if(ticket==="member" && membership!=="member")warnings.push("Member-rate ticket requires qualifying membership at purchase and at the show.");
 if(ticket==="member" && guests>3)warnings.push("RHS member rate is limited to four tickets per member, including the member: verify additional bookings separately.");
 if(start<w.start)warnings.push("Arrival is before standard opening; accessibility early entry requires a separately verified booking.");
 if(start>=w.end)warnings.push("Arrival is at or after closing.");
 if(start+duration+margin>w.end)warnings.push("Planned visit plus buffer exceeds published closing time.");
 if(date==="2027-05-21" && start+duration>1050)warnings.push("Your visit overlaps Chelsea Late, a separate Friday 17:30–22:00 offering: daytime admission must not be assumed to cover the evening.");
 return {label:w.label,window:clock(w.start)+"–"+clock(w.end),end:clock(start+duration),remaining:w.end-start-duration-margin,warnings,feasible:warnings.length===0};
}
export function budget({people,perTicket,memberFee=0,travel=0,food=0,extras=0}){
 const a=[people,perTicket,memberFee,travel,food,extras].map(Number);
 if(a.some(x=>!Number.isFinite(x)||x<0)||!Number.isInteger(a[0])||a[0]<1||a[0]>50||a.slice(1).some(x=>x>100000))throw Error("Enter a valid party (1–50) and nonnegative GBP amounts.");
 const [n,t,m,r,f,e]=a;return {total:Math.round((n*t+m+r+f+e)*100)/100,admission:Math.round(n*t*100)/100,other:Math.round((m+r+f+e)*100)/100};
}
export function breakEven({memberPrice,publicPrice,membershipFee,eligibleTickets}){
 const a=[memberPrice,publicPrice,membershipFee,eligibleTickets].map(Number);
 if(a.some(x=>!Number.isFinite(x)||x<0)||!Number.isInteger(a[3])||a[3]<1||a[3]>4)throw Error("Enter nonnegative prices and 1–4 eligible member-rate tickets.");
 const saving=(a[1]-a[0])*a[3]-a[2];
 return {difference:Math.round(saving*100)/100,worthIt:saving>0};
}
