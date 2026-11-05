(() => {
  'use strict';
  const $=id=>document.getElementById(id);

  const READY_KEY='eventv-wwdc-2027-readiness-v1';
  const readiness=[...document.querySelectorAll('[data-readiness]')];
  let readyState={};try{readyState=JSON.parse(localStorage.getItem(READY_KEY)||'{}')}catch(_){readyState={}};
  readiness.forEach(box=>{box.checked=Boolean(readyState[box.dataset.readiness]);box.addEventListener('change',()=>{readyState[box.dataset.readiness]=box.checked;saveReady();renderReady();});});
  function saveReady(){try{localStorage.setItem(READY_KEY,JSON.stringify(readyState));return true}catch(_){return false}}
  function renderReady(){
    const n=readiness.filter(x=>x.checked).length, deg=n/6*360;
    $('score-number').textContent=n;
    $('score-ring').style.background='conic-gradient(#6bc6ff '+deg+'deg,#2a2d39 '+deg+'deg)';
    const label=n===0?'Not checked yet':n<=2?'Early preparation':n<=4?'Partly prepared':n===5?'Nearly prepared':'Checklist complete';
    $('score-label').textContent=label;
    $('score-copy').textContent=n===6?'All six planning checks are marked complete. Re-check Apple’s current beta instructions when new software is actually released.':'Review the remaining '+(6-n)+' item'+(6-n===1?'':'s')+' before choosing a future beta test path.';
  }
  $('reset-readiness')?.addEventListener('click',()=>{readiness.forEach(x=>x.checked=false);readyState={};saveReady();renderReady();});
  $('copy-readiness')?.addEventListener('click',async()=>{const b=$('copy-readiness');const lines=readiness.map(x=>(x.checked?'[x] ':'[ ] ')+x.parentElement.querySelector('strong').textContent).join('\n');try{await navigator.clipboard.writeText(lines);b.textContent='Copied'}catch(_){b.textContent='Copy unavailable'}setTimeout(()=>b.textContent='Copy checklist',1300);});
  renderReady();

  const WATCH_KEY='eventv-wwdc-2027-watchlist-v1';
  let watch=[];try{watch=JSON.parse(localStorage.getItem(WATCH_KEY)||'[]')}catch(_){watch=[]}if(!Array.isArray(watch))watch=[];
  const clean=s=>String(s).slice(0,100);
  const saveWatch=()=>{try{localStorage.setItem(WATCH_KEY,JSON.stringify(watch));return true}catch(_){return false}};
  const rank=p=>p==='Critical'?0:p==='Important'?1:2;
  const cls=p=>p==='Critical'?'critical':p==='Important'?'important':'explore';
  function addWatch(name,priority='Important'){
    const n=clean(name).trim();if(!n)return;
    const existing=watch.find(x=>x.name.toLowerCase()===n.toLowerCase());
    if(existing){existing.priority=priority;}else watch.push({name:n,priority});
    watch=watch.slice(0,100);saveWatch();renderWatch();
  }
  function renderWatch(){
    const list=$('watch-list');list.querySelectorAll('.watch-item').forEach(n=>n.remove());
    $('watch-empty').hidden=watch.length>0;$('watch-count').textContent=watch.length+(watch.length===1?' priority':' priorities');
    [...watch].sort((a,b)=>rank(a.priority)-rank(b.priority)||a.name.localeCompare(b.name)).forEach(item=>{
      const idx=watch.indexOf(item), row=document.createElement('div');row.className='watch-item';
      const dot=document.createElement('i');dot.className=cls(item.priority);dot.setAttribute('aria-hidden','true');
      const name=document.createElement('strong');name.textContent=item.name;
      const pri=document.createElement('span');pri.textContent=item.priority;
      const rm=document.createElement('button');rm.type='button';rm.textContent='×';rm.setAttribute('aria-label','Remove '+item.name);rm.addEventListener('click',()=>{watch.splice(idx,1);saveWatch();renderWatch();});
      row.append(dot,name,pri,rm);list.appendChild(row);
    });
  }
  document.querySelectorAll('[data-topic]').forEach(b=>b.addEventListener('click',()=>{addWatch(b.dataset.topic,'Important');b.textContent='✓ '+b.dataset.topic;setTimeout(()=>b.textContent=b.dataset.topic,1100);}));
  $('watch-form')?.addEventListener('submit',e=>{e.preventDefault();addWatch($('watch-name').value,$('watch-priority').value);$('watch-form').reset();$('watch-name').focus();});
  $('clear-watchlist')?.addEventListener('click',()=>{if(watch.length&&confirm('Clear your WWDC27 watchlist from this browser?')){watch=[];saveWatch();renderWatch();}});
  $('copy-watchlist')?.addEventListener('click',async()=>{const b=$('copy-watchlist');if(!watch.length){b.textContent='Nothing to copy';setTimeout(()=>b.textContent='Copy watchlist',1300);return;}const text=[...watch].sort((a,b)=>rank(a.priority)-rank(b.priority)).map((x,i)=>(i+1)+'. '+x.name+' — '+x.priority).join('\n');try{await navigator.clipboard.writeText(text);b.textContent='Copied'}catch(_){b.textContent='Copy unavailable'}setTimeout(()=>b.textContent='Copy watchlist',1300);});
  renderWatch();
})();