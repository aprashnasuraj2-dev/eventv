(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const VIBES={
    opening:{title:'Stage 1 · Edinburgh → Carlisle',copy:'It opens the 2027 Tour, brings the race to Scotland for the first time and awards the first Yellow Jersey in Carlisle.'},
    scenery:{title:'Stage 2 · Keswick → Liverpool',copy:'The route leaves Keswick through the Lake District, passes multiple lakes, reaches the Morecambe Bay coast and then turns toward the Lancashire fells.'},
    climbs:{title:'Stage 3 · Welshpool → Cardiff',copy:'The Welsh stage concentrates difficult climbing late in the route, including Côte de Rhigos and Côte de Caerffili before Cardiff.'},
    city:{title:'Stage 2 · Keswick → Liverpool',copy:'The Strand finish in Liverpool gives a major-city finale. Stage 1 Carlisle and Stage 3 Cardiff are also strong finish-city options.'},
    sprint:{title:'Choose by sprint town',copy:'Stage 1: Newcastleton · Stage 2: Morecambe · Stage 3: Llandrindod Wells. All three are officially confirmed intermediate sprint locations.'}
  };
  function renderFinder(v){
    const x=VIBES[v]||VIBES.opening,box=$('finder-result');if(!box)return;
    box.innerHTML='<span>BEST MATCH</span><strong>'+x.title+'</strong><p>'+x.copy+'</p>';
  }
  document.querySelectorAll('[data-vibe]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-vibe]').forEach(x=>x.classList.toggle('active',x===b));renderFinder(b.dataset.vibe)}));
  renderFinder('opening');

  const PLAN_KEY='eventv-tdf-gb-2027-roadside-v1';
  let plans=[];try{plans=JSON.parse(localStorage.getItem(PLAN_KEY)||'[]')}catch(_){plans=[]}if(!Array.isArray(plans))plans=[];
  const clean=s=>String(s).slice(0,120);
  const savePlans=()=>{try{localStorage.setItem(PLAN_KEY,JSON.stringify(plans));return true}catch(_){return false}};
  function stageNumber(s){return Number((s.match(/\d+/)||['0'])[0])}
  function renderPlans(){
    const list=$('roadside-list');list.querySelectorAll('.roadside-item').forEach(n=>n.remove());
    $('roadside-empty').hidden=plans.length>0;$('plan-count').textContent=plans.length;
    $('stages-covered').textContent=new Set(plans.map(x=>x.stage)).size+' / 3';
    [...plans].sort((a,b)=>stageNumber(a.stage)-stageNumber(b.stage)).forEach(item=>{
      const idx=plans.indexOf(item),row=document.createElement('div');row.className='roadside-item';
      const n=document.createElement('i');n.textContent=stageNumber(item.stage);
      const loc=document.createElement('strong');loc.textContent=item.location;
      const stage=document.createElement('span');stage.textContent=item.stage;
      const type=document.createElement('span');type.textContent=item.type;
      const rm=document.createElement('button');rm.type='button';rm.textContent='×';rm.setAttribute('aria-label','Remove '+item.location);rm.addEventListener('click',()=>{plans.splice(idx,1);savePlans();renderPlans()});
      row.append(n,loc,stage,type,rm);list.appendChild(row);
    });
  }
  $('roadside-form')?.addEventListener('submit',e=>{e.preventDefault();const stage=$('plan-stage').value,type=$('plan-type').value,location=$('plan-location').value.trim();if(!location)return;const existing=plans.findIndex(x=>x.stage===stage);const item={stage,type,location:clean(location)};if(existing>=0)plans.splice(existing,1,item);else plans.push(item);plans=plans.slice(0,3);savePlans();renderPlans();$('plan-location').value='';$('plan-location').focus()});
  $('clear-roadside')?.addEventListener('click',()=>{if(plans.length&&confirm('Clear your Tour de France UK 2027 roadside plan?')){plans=[];savePlans();renderPlans()}});
  $('copy-roadside')?.addEventListener('click',async()=>{const b=$('copy-roadside');if(!plans.length){b.textContent='Nothing to copy';setTimeout(()=>b.textContent='Copy plan',1300);return;}const text=[...plans].sort((a,b)=>stageNumber(a.stage)-stageNumber(b.stage)).map(x=>x.stage+' — '+x.location+' ('+x.type+')').join('\n');try{await navigator.clipboard.writeText(text);b.textContent='Copied'}catch(_){b.textContent='Copy unavailable'}setTimeout(()=>b.textContent='Copy plan',1300)});
  renderPlans();

  function renderArrival(){
    const raw=$('pass-time').value,buffer=Math.max(0,Number($('arrival-buffer').value)||0),box=$('arrival-result');if(!raw){box.innerHTML='<span>PERSONAL ARRIVAL TARGET</span><strong>Enter a rider pass time</strong><p>Use the official local timetable when it is published for your exact route point.</p>';return;}
    const [h,m]=raw.split(':').map(Number),total=h*60+m-buffer,normalized=((total%1440)+1440)%1440,hh=String(Math.floor(normalized/60)).padStart(2,'0'),mm=String(normalized%60).padStart(2,'0'),dayShift=total<0?' on the previous day':'';
    box.innerHTML='<span>PERSONAL ARRIVAL TARGET</span><strong>'+hh+':'+mm+dayShift+'</strong><p>This is only your '+buffer+'-minute personal buffer. If the official road closure/access requirement is earlier, use the earlier official time.</p>';
  }
  $('pass-time')?.addEventListener('input',renderArrival);$('arrival-buffer')?.addEventListener('input',renderArrival);renderArrival();

  const CLOSE_KEY='eventv-tdf-gb-2027-closure-check-v1';
  let closeState={};try{closeState=JSON.parse(localStorage.getItem(CLOSE_KEY)||'{}')}catch(_){closeState={}};
  const checks=[...document.querySelectorAll('[data-closure]')];
  checks.forEach(c=>{c.checked=Boolean(closeState[c.dataset.closure]);c.addEventListener('change',()=>{closeState[c.dataset.closure]=c.checked;saveClose();renderClose()})});
  function saveClose(){try{localStorage.setItem(CLOSE_KEY,JSON.stringify(closeState));return true}catch(_){return false}}
  function renderClose(){$('closure-score').textContent=checks.filter(x=>x.checked).length+' / '+checks.length}
  $('reset-closures')?.addEventListener('click',()=>{checks.forEach(x=>x.checked=false);closeState={};saveClose();renderClose()});renderClose();
})();