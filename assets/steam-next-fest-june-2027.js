(() => {
  'use strict';
  const START=new Date('2027-06-14T17:00:00Z');
  const END=new Date('2027-06-21T17:00:00Z');
  const $=id=>document.getElementById(id);
  const localStart=new Intl.DateTimeFormat(undefined,{weekday:'short',year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(START);
  if($('hero-local-time')) $('hero-local-time').textContent=localStart;
  if($('local-start-card')) $('local-start-card').textContent=new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(START);
  if($('local-zone-card')) $('local-zone-card').textContent=Intl.DateTimeFormat().resolvedOptions().timeZone||'Local time zone';
  if($('local-time-answer')) $('local-time-answer').textContent='In your time zone: '+localStart+'. Official source time: June 14 at 10:00 AM PDT (17:00 UTC).';

  function renderCountdown(){
    const now=new Date();let target=START,label='Steam Next Fest June 2027 starts in';
    if(now>=START&&now<END){target=END;label='Steam Next Fest June 2027 is live · ends in';}
    if(now>=END){$('countdown').innerHTML='<div><strong>Ended</strong><span>Jun 21, 2027</span></div>';$('countdown-title').textContent='Steam Next Fest June 2027 has ended';return;}
    const d=Math.max(0,target-now);
    $('cd-days').textContent=Math.floor(d/86400000);
    $('cd-hours').textContent=String(Math.floor((d%86400000)/3600000)).padStart(2,'0');
    $('cd-mins').textContent=String(Math.floor((d%3600000)/60000)).padStart(2,'0');
    $('cd-secs').textContent=String(Math.floor((d%60000)/1000)).padStart(2,'0');
    $('countdown-title').textContent=label;
  }
  renderCountdown();setInterval(renderCountdown,1000);

  let capacityMinutes=0;
  function calcCapacity(){
    const hours=Math.max(0,Math.min(168,Number($('hours-available').value)||0));
    const demo=Math.max(5,Math.min(300,Number($('demo-minutes').value)||45));
    const buffer=Math.max(0,Math.min(80,Number($('buffer-percent').value)||0));
    const total=hours*60, usable=total*(1-buffer/100), demos=Math.floor(usable/demo);
    capacityMinutes=usable;
    $('demo-capacity').textContent=demos;
    $('usable-hours').textContent=(usable/60).toFixed(usable%60?1:0)+'h';
    $('daily-minutes').textContent=Math.round(usable/7)+'m';
    $('capacity-tip').textContent='A '+buffer+'% buffer protects roughly '+Math.round(total-usable)+' minutes for downloads, settings, deciding and breaks.';
    renderSprint();
  }
  ['hours-available','demo-minutes','buffer-percent'].forEach(id=>$(id)?.addEventListener('input',calcCapacity));

  const KEY='eventv-nextfest-june-2027-sprint-v1';
  let items=[];try{items=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(_){items=[]}if(!Array.isArray(items))items=[];
  let activeFilter='All';
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(items));return true}catch(_){return false}};
  const clean=s=>String(s).slice(0,100);
  const weight=p=>p==='Must try'?0:p==='Curious'?1:2;
  function priorityClass(p){return p==='Must try'?'must':p==='Curious'?'curious':'maybe';}
  function renderSprint(){
    const list=$('sprint-list');if(!list)return;
    list.querySelectorAll('.sprint-item').forEach(n=>n.remove());
    const shown=items.filter(x=>activeFilter==='All'||x.priority===activeFilter).sort((a,b)=>weight(a.priority)-weight(b.priority));
    $('sprint-empty').hidden=shown.length>0;
    $('queue-count').textContent=items.length+(items.length===1?' demo':' demos');
    const total=items.reduce((a,x)=>a+(Number(x.minutes)||0),0);
    $('queue-time').textContent=total>=60?(total/60).toFixed(total%60?1:0)+'h':total+'m';
    const remaining=capacityMinutes-total;
    $('capacity-fit').textContent=remaining>=0?Math.round(remaining)+'m spare':Math.abs(Math.round(remaining))+'m over';
    shown.forEach(item=>{
      const idx=items.indexOf(item), row=document.createElement('div');row.className='sprint-item';
      const dot=document.createElement('i');dot.className='priority-dot '+priorityClass(item.priority);dot.setAttribute('aria-hidden','true');
      const name=document.createElement('strong');name.textContent=clean(item.name);
      const priority=document.createElement('span');priority.textContent=item.priority;
      const mins=document.createElement('span');mins.className='mins';mins.textContent=Number(item.minutes)+'m';
      const rm=document.createElement('button');rm.type='button';rm.textContent='×';rm.setAttribute('aria-label','Remove '+clean(item.name));rm.addEventListener('click',()=>{items.splice(idx,1);save();renderSprint();});
      row.append(dot,name,priority,mins,rm);list.appendChild(row);
    });
  }
  $('sprint-form')?.addEventListener('submit',e=>{e.preventDefault();const name=$('game-name').value.trim(),minutes=Math.max(5,Math.min(300,Number($('game-minutes').value)||45)),priority=$('game-priority').value;if(!name)return;items.unshift({name:clean(name),minutes,priority:['Must try','Curious','Maybe'].includes(priority)?priority:'Curious'});items=items.slice(0,120);save();renderSprint();$('sprint-form').reset();$('game-minutes').value='45';$('game-name').focus();});
  document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderSprint();}));
  $('clear-sprint')?.addEventListener('click',()=>{if(items.length&&confirm('Clear your June Next Fest demo sprint from this browser?')){items=[];save();renderSprint();}});
  $('copy-sprint')?.addEventListener('click',async()=>{const b=$('copy-sprint');if(!items.length){b.textContent='Nothing to copy';setTimeout(()=>b.textContent='Copy plan',1300);return;}const ordered=[...items].sort((a,b)=>weight(a.priority)-weight(b.priority));const text=ordered.map((x,i)=>(i+1)+'. '+x.name+' — '+x.priority+' · '+x.minutes+'m').join('\n');try{await navigator.clipboard.writeText(text);b.textContent='Copied'}catch(_){b.textContent='Copy unavailable'}setTimeout(()=>b.textContent='Copy plan',1300);});
  calcCapacity();
})();