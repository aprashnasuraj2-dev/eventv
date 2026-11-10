// British GP 2027: user-entered travel scenarios, not official shuttle timetables.
export const RACE_DAYS=['2027-07-02','2027-07-03','2027-07-04'];
export const STATIONS=['Northampton','Milton Keynes','Coventry'];
export function minutes(t){if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(t||''))throw Error('Enter a valid 24-hour clock time');const [h,m]=t.split(':').map(Number);return h*60+m}
export function clock(n){return String(Math.floor(n/60)%24).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
export function plan(input){
 const day=String(input.day||'');if(!RACE_DAYS.includes(day))throw Error('Choose an official race-weekend date');
 const mode=String(input.mode||'');if(!['shuttle','car','camping'].includes(mode))throw Error('Choose a travel mode');
 if(mode==='shuttle'&&!STATIONS.includes(input.station))throw Error('Choose an advertised shuttle origin');
 const departure=minutes(input.departure),duration=Number(input.duration),walk=Number(input.walk),queue=Number(input.queue),buffer=Number(input.buffer);
 for(const [name,value] of Object.entries({duration,walk,queue,buffer})){if(!Number.isInteger(value)||value<0||value>720)throw Error(name+' must be a whole number from 0 to 720')}
 const arrival=departure+duration+walk+queue;
 if(arrival>=1440)throw Error('Scenario crosses midnight: split it into separate calendar days');
 const target=input.target?minutes(input.target):null;
 const slack=target===null?null:target-arrival-buffer;
 return {day,mode,station:mode==='shuttle'?input.station:null,arrival:clock(arrival),slack,ready:slack===null?null:slack>=0,assumptionMinutes:duration+walk+queue+buffer};
}
export function compare(a,b){const x=plan(a),y=plan(b);if(x.day!==y.day)throw Error('Compare plans for the same day');return {a:x,b:y,better:x.slack===null||y.slack===null?null:x.slack>=y.slack?'a':'b'}}
if(typeof document!=='undefined'){
 const form=document.getElementById('gp-plan'),out=document.getElementById('gp-result');
 if(form&&out){form.addEventListener('submit',event=>{event.preventDefault();try{const data=Object.fromEntries(new FormData(form));const p=plan(data);out.textContent='Estimated arrival '+p.arrival+' UK local time. '+(p.slack===null?'No target time supplied.':p.ready?'Scenario margin after your buffer: '+p.slack+' min.':'Scenario misses your target after buffer by '+Math.abs(p.slack)+' min.')+' These are your assumptions, not organizer schedules.'}catch(error){out.textContent=error.message}});
 form.addEventListener('reset',()=>{out.textContent='Enter your own journey assumptions. No live transport feed.'});
 }
}
