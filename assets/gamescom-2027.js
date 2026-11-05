(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const DAYS={
    '2027-08-25':{label:'Wed · Aug 25',open:'13:00',close:'19:00',minutes:360,wildcard:true},
    '2027-08-26':{label:'Thu · Aug 26',open:'10:00',close:'20:00',minutes:600},
    '2027-08-27':{label:'Fri · Aug 27',open:'10:00',close:'20:00',minutes:600},
    '2027-08-28':{label:'Sat · Aug 28',open:'09:00',close:'20:00',minutes:660},
    '2027-08-29':{label:'Sun · Aug 29',open:'09:00',close:'20:00',minutes:660}
  };
  const KEY='eventv-gamescom-2027-itinerary-v1',SETTINGS='eventv-gamescom-2027-day-v1';
  let stops=[];try{stops=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(_){stops=[]}if(!Array.isArray(stops))stops=[];
  let filter='All';
  try{const s=JSON.parse(localStorage.getItem(SETTINGS)||'{}');if(s.day&&DAYS[s.day])$('visit-day').value=s.day;if(s.buffer!=null)$('buffer-minutes').value=s.buffer}catch(_){}
  const clean=s=>String(s).slice(0,100);
  const rank=p=>p==='Must do'?0:p==='Want'?1:2;
  const dotClass=p=>p==='Must do'?'must':p==='Want'?'want':'iftime';
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(stops));localStorage.setItem(SETTINGS,JSON.stringify({day:$('visit-day').value,buffer:$('buffer-minutes').value}));return true}catch(_){return false}};
  const formatMinutes=m=>m>=60?((m/60)%1?(m/60).toFixed(1):(m/60).toFixed(0))+'h':Math.round(m)+'m';
  function renderPlanner(){
    const day=DAYS[$('visit-day').value]||DAYS['2027-08-28'];
    const buffer=Math.max(0,Math.min(day.minutes,Number($('buffer-minutes').value)||0));
    const available=Math.max(0,day.minutes-buffer);
    $('day-hours').textContent=formatMinutes(day.minutes);$('day-window').textContent=day.open+'–'+day.close;
    $('buffer-hours').textContent=formatMinutes(buffer);$('available-hours').textContent=formatMinutes(available);$('available-note').textContent=available+' minutes'+(day.wildcard?' · Wildcard access':'');
    const total=stops.reduce((a,x)=>a+(Number(x.minutes)||0),0),remain=available-total;
    $('stop-count').textContent=stops.length;$('scheduled-time').textContent=formatMinutes(total);
    $('capacity-status').textContent=remain>=0?'Fits':'Over capacity';
    $('capacity-detail').textContent=remain>=0?formatMinutes(remain)+' unscheduled':formatMinutes(Math.abs(remain))+' over';
    const list=$('itinerary-list');list.querySelectorAll('.itinerary-item').forEach(n=>n.remove());
    const shown=stops.filter(x=>filter==='All'||x.priority===filter).sort((a,b)=>rank(a.priority)-rank(b.priority));
    $('itinerary-empty').hidden=shown.length>0;
    shown.forEach(item=>{
      const idx=stops.indexOf(item),row=document.createElement('div');row.className='itinerary-item';
      const dot=document.createElement('i');dot.className=dotClass(item.priority);dot.setAttribute('aria-hidden','true');
      const name=document.createElement('strong');name.textContent=clean(item.name);
      const pri=document.createElement('span');pri.textContent=item.priority;
      const mins=document.createElement('span');mins.className='mins';mins.textContent=Number(item.minutes)+'m';
      const dayLabel=document.createElement('span');dayLabel.textContent=day.label;
      const rm=document.createElement('button');rm.type='button';rm.textContent='×';rm.setAttribute('aria-label','Remove '+clean(item.name));rm.addEventListener('click',()=>{stops.splice(idx,1);save();renderPlanner();});
      row.append(dot,name,pri,mins,dayLabel,rm);list.appendChild(row);
    });
  }
  $('visit-day')?.addEventListener('change',()=>{save();renderPlanner()});$('buffer-minutes')?.addEventListener('input',()=>{save();renderPlanner()});
  $('itinerary-form')?.addEventListener('submit',e=>{e.preventDefault();const name=$('stop-name').value.trim(),minutes=Math.max(10,Math.min(600,Number($('stop-minutes').value)||60)),priority=$('stop-priority').value;if(!name)return;stops.push({name:clean(name),minutes,priority:['Must do','Want','If time'].includes(priority)?priority:'Want'});stops=stops.slice(0,120);save();renderPlanner();$('itinerary-form').reset();$('stop-minutes').value='60';$('stop-name').focus();});
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderPlanner()}));
  $('clear-plan')?.addEventListener('click',()=>{if(stops.length&&confirm('Clear your Gamescom 2027 itinerary from this browser?')){stops=[];save();renderPlanner()}});
  $('copy-plan')?.addEventListener('click',async()=>{const b=$('copy-plan');if(!stops.length){b.textContent='Nothing to copy';setTimeout(()=>b.textContent='Copy plan',1300);return;}const day=DAYS[$('visit-day').value],text=[day.label+' · '+day.open+'–'+day.close,...[...stops].sort((a,b)=>rank(a.priority)-rank(b.priority)).map((x,i)=>(i+1)+'. '+x.name+' — '+x.priority+' · '+x.minutes+'m')].join('\n');try{await navigator.clipboard.writeText(text);b.textContent='Copied'}catch(_){b.textContent='Copy unavailable'}setTimeout(()=>b.textContent='Copy plan',1300)});
  renderPlanner();

  function renderBudget(){
    const curr=$('trip-currency').value,ticket=Math.max(0,Number($('cost-ticket').value)||0),travel=Math.max(0,Number($('cost-travel').value)||0),hotel=Math.max(0,Number($('cost-hotel').value)||0),nights=Math.max(0,Number($('hotel-nights').value)||0),food=Math.max(0,Number($('cost-food').value)||0),days=Math.max(1,Number($('trip-days').value)||1),other=Math.max(0,Number($('cost-other').value)||0);
    const hotelTotal=hotel*nights,foodTotal=food*days,total=ticket+travel+hotelTotal+foodTotal+other;
    $('trip-total').textContent=curr+total.toFixed(2);$('hotel-total').textContent=curr+hotelTotal.toFixed(2);$('food-total').textContent=curr+foodTotal.toFixed(2);
  }
  ['trip-currency','cost-ticket','cost-travel','cost-hotel','hotel-nights','cost-food','trip-days','cost-other'].forEach(id=>$(id)?.addEventListener('input',renderBudget));renderBudget();
})();