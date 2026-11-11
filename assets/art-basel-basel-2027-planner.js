export function day(v){let s=String(v.day??'');if(!/^2027-06-\d{2}$/.test(s))throw Error('Enter a valid June 2027 date.');let d=new Date(s+'T00:00:00Z');if(!Number.isFinite(d.valueOf())||d.toISOString().slice(0,10)!==s)throw Error('Enter a valid date.');if(s>='2027-06-15'&&s<='2027-06-16')return 'Preview date';if(s>='2027-06-17'&&s<='2027-06-20')return 'Published fair date';return 'Outside the cited preview and fair dates'}
function money(v,label){let s=String(v??'').trim();if(!/^\d+(?:\.\d{1,2})?$/.test(s))throw Error(`${label}: enter a non-negative amount with up to two decimals.`);let n=Math.round(Number(s)*100);if(!Number.isSafeInteger(n)||n>100000000)throw Error(`${label} exceeds the supported range.`);return n}
export function budget(v){let s=String(v.people??'').trim();if(!/^\d+$/.test(s)||Number(s)<1||Number(s)>50)throw Error('Enter 1–50 people.');let n=Number(s),admission=money(v.admission,'Admission'),tour=money(v.tour,'Tour'),shared=money(v.shared,'Shared costs'),total=n*(admission+tour)+shared;return {total:total/100,share:total/n/100}}

export function visitPlan(v){
 const integer=(input,label,min,max)=>{const s=String(input??'').trim();if(!/^\d+$/.test(s)||Number(s)<min||Number(s)>max)throw Error(label+' must be '+min+'–'+max+'.');return Number(s)};
 const people=integer(v.people,'Visitors',1,50),days=integer(v.days,'Fair admission days',1,4),tours=integer(v.tours,'Guided-tour sessions',0,4);
 const admission=money(v.admission,'Per-day admission'),tour=money(v.tour,'Per-tour'),shared=money(v.shared,'Shared costs');
 const cents=people*(days*admission+tours*tour)+shared;
 if(!Number.isSafeInteger(cents))throw Error('Scenario exceeds safe integer range.');
 return {total:cents/100,perVisitor:cents/people/100,admissionDays:people*days,tourPlaces:people*tours};
}
