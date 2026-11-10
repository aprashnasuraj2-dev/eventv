// Topic 42 — user-entered scenarios only. No official fixtures or live prices.
export const DOHA_OFFSET_MINUTES = 180;
export function parseDohaLocal(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw Error('Enter a Doha date and time');
  const [date,time]=value.split('T'), [y,m,d]=date.split('-').map(Number), [h,min]=time.split(':').map(Number);
  const utc=Date.UTC(y,m-1,d,h-3,min);
  const check=new Date(utc+DOHA_OFFSET_MINUTES*60000);
  if(check.getUTCFullYear()!==y||check.getUTCMonth()!==m-1||check.getUTCDate()!==d||check.getUTCHours()!==h||check.getUTCMinutes()!==min) throw Error('Invalid Doha date/time');
  return utc;
}
export function formatInZone(instant,zone) {
  if(!Number.isFinite(instant)) throw Error('Invalid instant');
  return new Intl.DateTimeFormat('en-GB',{timeZone:zone,dateStyle:'medium',timeStyle:'short',hourCycle:'h23'}).format(new Date(instant));
}
export function parseMoney(value) {
  if(typeof value!=='string' && typeof value!=='number') throw Error('Invalid QAR amount');
  const s=String(value).trim();
  if(!/^(?:\d+)(?:\.\d{1,2})?$/.test(s)) throw Error('Invalid QAR amount');
  const cents=Math.round(Number(s)*100);
  if(!Number.isSafeInteger(cents)) throw Error('QAR amount too large');
  return cents;
}
export function budgetQar(parts) {
  const cents=parts.reduce((sum,part)=>sum+parseMoney(part),0);
  if(!Number.isSafeInteger(cents)) throw Error('Budget overflow');
  return (cents/100).toFixed(2);
}
export function analyzeGames(games,bufferMinutes=0) {
  if(!Array.isArray(games)) throw Error('Invalid game list');
  if(!Number.isInteger(bufferMinutes)||bufferMinutes<0||bufferMinutes>1440) throw Error('Invalid transfer buffer');
  const ids=new Set();
  const sorted=games.map(g=>{
    if(!g||typeof g.id!=='string'||!g.id.trim()||ids.has(g.id)) throw Error('Missing or duplicate game ID');
    ids.add(g.id);
    if(!Number.isInteger(g.durationMinutes)||g.durationMinutes<=0||g.durationMinutes>600) throw Error('Invalid duration');
    const start=parseDohaLocal(g.dohaStart);
    return {...g,start,end:start+g.durationMinutes*60000};
  }).sort((a,b)=>a.start-b.start);
  const conflicts=[];
  for(let i=0;i<sorted.length;i++) for(let j=i+1;j<sorted.length;j++){
    const gap=(sorted[j].start-sorted[i].end)/60000;
    if(gap<bufferMinutes) conflicts.push({first:sorted[i].id,second:sorted[j].id,gapMinutes:gap,kind:gap<0?'OVERLAP':'TRANSFER_BUFFER'});
  }
  return {games:sorted,conflicts};
}
export function passCoverage(pass,game) {
  if(!game||!['group','final'].includes(game.phase)) return 'UNKNOWN';
  if(pass==='lusail-series') return game.venue==='Lusail'?'POTENTIALLY_COVERED':'UNKNOWN';
  if(pass==='final-phase') return game.phase==='final'?'POTENTIALLY_COVERED':'NOT_COVERED';
  if(pass==='follow-qatar') return game.phase==='group'&&game.team==='Qatar'?'POTENTIALLY_COVERED':'NOT_COVERED';
  return 'UNKNOWN';
}
// POTENTIALLY_COVERED is not a seat, valid ticket, or admission guarantee.
