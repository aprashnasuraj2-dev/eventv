(() => {
  'use strict';
  const START = new Date('2027-02-22T18:00:00Z');
  const END = new Date('2027-03-01T18:00:00Z');
  const $ = (id) => document.getElementById(id);
  const fmtLocal = (date, options={}) => new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options
  }).format(date);

  const localFull = new Intl.DateTimeFormat(undefined, {
    weekday:'short', year:'numeric', month:'short', day:'numeric',
    hour:'numeric', minute:'2-digit', timeZoneName:'short'
  }).format(START);

  if ($('hero-local-time')) $('hero-local-time').textContent = localFull;
  if ($('local-start-card')) $('local-start-card').textContent = fmtLocal(START);
  if ($('local-zone-card')) {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Your local time zone';
    $('local-zone-card').textContent = zone;
  }
  if ($('local-time-answer')) {
    $('local-time-answer').textContent = 'In your time zone: ' + localFull + '. Official source time: February 22 at 10:00 AM PST (18:00 UTC).';
  }

  function renderCountdown(){
    const now = new Date();
    let target = START;
    let prefix = 'Starts in';
    if (now >= START && now < END){ target = END; prefix = 'Live now · ends in'; }
    if (now >= END){
      if ($('countdown')) $('countdown').innerHTML = '<div class="ended"><strong>Ended</strong><span>March 1, 2027</span></div>';
      return;
    }
    const delta = Math.max(0, target - now);
    const days = Math.floor(delta / 86400000);
    const hours = Math.floor((delta % 86400000) / 3600000);
    const mins = Math.floor((delta % 3600000) / 60000);
    const secs = Math.floor((delta % 60000) / 1000);
    if ($('cd-days')) $('cd-days').textContent = days;
    if ($('cd-hours')) $('cd-hours').textContent = String(hours).padStart(2,'0');
    if ($('cd-mins')) $('cd-mins').textContent = String(mins).padStart(2,'0');
    if ($('cd-secs')) $('cd-secs').textContent = String(secs).padStart(2,'0');
    if ($('countdown-title')) $('countdown-title').textContent = prefix + ' · Steam Next Fest February 2027';
  }
  renderCountdown();
  setInterval(renderCountdown, 1000);

  const KEY='eventv-nextfest-feb2027-shortlist-v1';
  let items=[];
  try { items=JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (_) { items=[]; }
  if (!Array.isArray(items)) items=[];

  const list=$('demo-list'), empty=$('empty-state'), count=$('planner-count');
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(items));return true;}catch(_){return false;}};
  const escapeText=(s)=>String(s).slice(0,100);

  function renderList(){
    if (!list) return;
    list.querySelectorAll('.saved-demo').forEach(n=>n.remove());
    if (empty) empty.hidden=items.length>0;
    if (count) count.textContent=items.length + (items.length===1?' demo saved':' demos saved');
    items.forEach((item,index)=>{
      const row=document.createElement('div');
      row.className='saved-demo';
      const name=document.createElement('strong'); name.textContent=escapeText(item.name);
      const status=document.createElement('span'); status.className='status'; status.textContent=item.status;
      const remove=document.createElement('button'); remove.type='button'; remove.setAttribute('aria-label','Remove '+escapeText(item.name)); remove.textContent='×';
      remove.addEventListener('click',()=>{items.splice(index,1);save();renderList();});
      row.append(name,status,remove);
      list.appendChild(row);
    });
  }

  const form=$('demo-form');
  if (form) form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const name=$('demo-name').value.trim();
    const status=$('demo-status').value;
    if (!name) return;
    items.unshift({name:escapeText(name),status:['Try','Played','Wishlist'].includes(status)?status:'Try'});
    items=items.slice(0,100);
    save(); renderList(); form.reset(); $('demo-name').focus();
  });

  const clear=$('clear-list');
  if (clear) clear.addEventListener('click',()=>{
    if (!items.length) return;
    if (confirm('Clear your saved Steam Next Fest shortlist from this browser?')){items=[];save();renderList();}
  });

  const copy=$('copy-list');
  if (copy) copy.addEventListener('click',async()=>{
    if (!items.length){copy.textContent='Nothing to copy';setTimeout(()=>copy.textContent='Copy list',1300);return;}
    const text=items.map((x,i)=>(i+1)+'. '+x.name+' — '+x.status).join('\n');
    try { await navigator.clipboard.writeText(text); copy.textContent='Copied'; }
    catch (_) { copy.textContent='Copy unavailable'; }
    setTimeout(()=>copy.textContent='Copy list',1300);
  });

  renderList();
})();