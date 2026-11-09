// Boston 2027: deterministic, pure eligibility screening. Never determines actual acceptance.
export const MEN=[175,180,185,195,200,210,230,245,260,275,290];
export const OTHER=[205,210,215,225,230,240,260,275,290,305,320];
export const AGES=[18,35,40,45,50,55,60,65,70,75,80];
export const CUTOFF=317;
export function clock(seconds){const n=Math.floor(seconds);return [Math.floor(n/3600),Math.floor(n%3600/60),n%60].map(x=>String(x).padStart(2,'0')).join(':')}
export function secondsOf(s){if(!/^\\d{1,2}:[0-5]\\d:[0-5]\\d$/.test(s))throw Error('Enter time as H:MM:SS');const [h,m,sec]=s.split(':').map(Number);if(h<1||h>12)throw Error('Enter a marathon finish between 1 and 12 hours');return h*3600+m*60+sec}
export function assess(x){
 const age=Number(x.age),drop=Number(x.drop);
 if(!Number.isInteger(age)||age<18||age>110)throw Error('Race-day age must be 18–110');
 if(!Number.isFinite(drop)||drop<0||drop>30000)throw Error('Net downhill must be 0–30,000 feet');
 if(!['men','women','nonbinary'].includes(x.category))throw Error('Choose an open-field category');
 const t=secondsOf(x.time), date=String(x.date||'');
 if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(date)||Number.isNaN(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date)throw Error('Enter a valid qualifying race date');
 const idx=AGES.reduce((n,a,i)=>age>=a?i:n,0),standard=(x.category==='men'?MEN:OTHER)[idx]*60;
 const adjustment=drop>=6000?null:drop>=3000?600:drop>=1500?300:0;
 const indexed=adjustment===null?null:t+adjustment;
 const validDate=date>='2025-09-13'&&date<='2026-09-18';
 const eligible=Boolean(x.certified)&&validDate&&adjustment!==null;
 const margin=indexed===null?null:standard-indexed;
 const meets=eligible&&margin>=0;
 const competitive=meets&&margin>=CUTOFF;
 const randomPossible=meets&&!competitive&&Boolean(x.applied);
 return {standard,adjustment,indexed,margin,validDate,eligible,meets,competitive,randomPossible,applied:Boolean(x.applied)};
}
