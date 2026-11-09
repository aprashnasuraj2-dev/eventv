// Topic 43: deterministic, browser-safe planning primitives. No fixtures or results are inferred.
export const VENUE_ZONE='Africa/Johannesburg'; // 2027 host cities use UTC+02, verify rule before publication.
export const SLOT_RE=/^(A[1-3]|B[1-3]|AB4)$/;
export function resolveSlot(slot, scenarios={}){
 if(typeof slot!=='string'||!SLOT_RE.test(slot)) throw new RangeError('Unknown tournament slot');
 const selected=scenarios[slot];
 return {slot,team:typeof selected==='string'&&selected.trim()?selected.trim():null,conditional:true};
}
export function parseDuration(value){
 if(value===''||value===null||value===undefined) return null;
 const n=Number(value);
 if(!Number.isFinite(n)||n<0||n>10080) throw new RangeError('Minutes must be between 0 and 10080');
 return n;
}
export function planTransfer(previous,next,{travelMinutes,arrivalBufferMinutes=60}={}){
 if(!previous?.iso||!next?.iso) return {status:'unknown-time',message:'Both verified match start times are required'};
 const a=Date.parse(previous.iso),b=Date.parse(next.iso);
 if(!Number.isFinite(a)||!Number.isFinite(b)) return {status:'invalid-time',message:'Invalid timestamp'};
 const travel=parseDuration(travelMinutes),buffer=parseDuration(arrivalBufferMinutes);
 if(travel===null||buffer===null)return {status:'unknown-travel',message:'Enter a travel estimate and arrival buffer'};
 const available=(b-a)/60000;
 const margin=available-travel-buffer;
 return {status:margin<0?'conflict':'possible',availableMinutes:available,requiredMinutes:travel+buffer,marginMinutes:margin,assumption:'Travel and buffer are user estimates, not a route forecast'};
}
export function formatInstant(iso,zone='UTC'){
 const ms=Date.parse(iso);
 if(!Number.isFinite(ms)) throw new RangeError('Invalid timestamp');
 try {return new Intl.DateTimeFormat('en-GB',{timeZone:zone,dateStyle:'medium',timeStyle:'short',hourCycle:'h23'}).format(ms);}
 catch {throw new RangeError('Invalid IANA timezone');}
}
export function normalizeShortlist(entries){
 if(!Array.isArray(entries))throw new TypeError('Shortlist must be an array');
 return entries.slice(0,100).map((entry)=>{
  if(!entry||typeof entry!=='object')throw new TypeError('Invalid entry');
  const note=String(entry.note??'').slice(0,1000);
  const id=String(entry.id??'').slice(0,100);
  if(!id)throw new RangeError('Missing match identifier');
  return {id,note,status:entry.status==='confirmed'?'confirmed':'conditional'};
 });
}
export function escapeText(value){
 return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
