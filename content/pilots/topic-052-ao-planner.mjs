// Topic #52 Australian Open 2027 — nonpublishing pure planning primitives.
// Visitor scenarios only. Never infer actual ticket inventory or match assignments.
export const EVENT_DATES = Object.freeze({kickoff:"2027-01-10",openingStart:"2027-01-11",mainStart:"2027-01-17",end:"2027-01-31"});
const DATE_RE=/^2027-01-(0[1-9]|[12][0-9]|3[01])$/;
const TIME_RE=/^([01]\d|2[0-3]):[0-5]\d$/;
export function classifyDate(date){
  if(typeof date!=="string"||!DATE_RE.test(date)) return "outside";
  if(date===EVENT_DATES.kickoff) return "kids-day";
  if(date<EVENT_DATES.openingStart) return "outside";
  if(date<EVENT_DATES.mainStart) return "opening-week";
  return "main-draw-window";
}
// AEDT is UTC+11 throughout January in Melbourne. No browser-local timezone assumptions.
export function aedtToUtc(date,time){
  if(classifyDate(date)==="outside"||typeof time!=="string"||!TIME_RE.test(time)) return null;
  const [h,m]=time.split(":").map(Number);
  const stamp=Date.UTC(2027,0,Number(date.slice(-2)),h-11,m);
  return new Date(stamp).toISOString();
}
export function ticketGuidance(kind,area){
  const k=String(kind||"").toLowerCase(), a=String(area||"").toLowerCase();
  if(!["ground","rod-laver","margaret-court","separate-event"].includes(k)) return {status:"unknown",reason:"Check the actual ticket and official conditions."};
  if(a==="rod-laver"&&k!=="rod-laver") return {status:"not-included",reason:"Do not assume Rod Laver Arena reserved entry from this ticket."};
  if(a==="margaret-court"&&k!=="margaret-court") return {status:"not-included",reason:"Do not assume Margaret Court Arena reserved entry from this ticket."};
  if(a==="separate-event"&&k!=="separate-event") return {status:"not-included",reason:"A separately ticketed event requires its own admission."};
  if(a==="ground"||a===k) return {status:"conditional",reason:"Verify the date, session, ticket terms, venue capacity and accessible entry with the organizer."};
  return {status:"unknown",reason:"Ticket entitlement is not established by these inputs."};
}
function minutes(t){if(typeof t!=="string"||!TIME_RE.test(t))return null;const [h,m]=t.split(":").map(Number);return h*60+m;}
export function assessSessions(raw,buffer=20){
  if(!Array.isArray(raw)||!Number.isInteger(buffer)||buffer<0||buffer>240) return {valid:[],errors:["Invalid sessions or buffer"],conflicts:[]};
  const valid=[],errors=[],seen=new Set();
  for(const [i,s] of raw.entries()){
    if(!s||typeof s!=="object"||typeof s.id!=="string"||!s.id.trim()||seen.has(s.id)||classifyDate(s.date)==="outside"||minutes(s.start)===null||minutes(s.end)===null||minutes(s.end)<=minutes(s.start)||typeof s.venue!=="string"||!s.venue.trim()){
      errors.push("Invalid session at position "+(i+1));continue;
    }
    seen.add(s.id);valid.push({id:s.id,date:s.date,start:s.start,end:s.end,venue:s.venue});
  }
  const conflicts=[];
  for(let i=0;i<valid.length;i++)for(let j=i+1;j<valid.length;j++){
    const a=valid[i],b=valid[j];if(a.date!==b.date)continue;
    const gap=a.start<=b.start?minutes(b.start)-minutes(a.end):minutes(a.start)-minutes(b.end);
    const needed=a.venue===b.venue?0:buffer;
    if(gap<needed) conflicts.push({first:a.id,second:b.id,reason:gap<0?"overlap":"insufficient-transfer-buffer",gapMinutes:gap,requiredMinutes:needed});
  }
  return {valid,errors,conflicts};
}
export function estimateAud({tickets,unitPrice,fees=0,transport=0,accommodation=0}={}){
  const nums=[tickets,unitPrice,fees,transport,accommodation];
  if(nums.some(v=>typeof v!=="number"||!Number.isFinite(v)||v<0)||!Number.isInteger(tickets)||tickets>100) return null;
  const total=tickets*(unitPrice+fees)+transport+accommodation;
  return Number.isFinite(total)&&total<=1e9?Math.round(total*100)/100:null;
}
