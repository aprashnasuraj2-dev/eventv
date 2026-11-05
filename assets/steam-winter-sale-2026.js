(() => {
  'use strict';
  const START=new Date('2026-12-17T18:00:00Z');
  const END=new Date('2027-01-04T18:00:00Z');
  const $=id=>document.getElementById(id);
  const localStart=new Intl.DateTimeFormat(undefined,{weekday:'short',year:'numeric',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(START);
  if($('hero-local-time')) $('hero-local-time').textContent=localStart;
  if($('local-start-card')) $('local-start-card').textContent=new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(START);
  if($('local-zone-card')) $('local-zone-card').textContent=Intl.DateTimeFormat().resolvedOptions().timeZone||'Local time zone';
  if($('local-time-answer')) $('local-time-answer').textContent='In your time zone: '+localStart+'. Official source time: December 17 at 10:00 AM Pacific (18:00 UTC).';

  function countdown(){
    const now=new Date();
    let target=START, label='Steam Winter Sale 2026 starts in';
    if(now>=START && now<END){target=END;label='Steam Winter Sale 2026 is live · ends in';}
    if(now>=END){$('countdown').innerHTML='<div><strong>Ended</strong><span>Jan 4, 2027</span></div>';$('countdown-title').textContent='Steam Winter Sale 2026 has ended';return;}
    const d=Math.max(0,target-now);
    $('cd-days').textContent=Math.floor(d/86400000);
    $('cd-hours').textContent=String(Math.floor((d%86400000)/3600000)).padStart(2,'0');
    $('cd-mins').textContent=String(Math.floor((d%3600000)/60000)).padStart(2,'0');
    $('cd-secs').textContent=String(Math.floor((d%60000)/1000)).padStart(2,'0');
    $('countdown-title').textContent=label;
  }
  countdown();setInterval(countdown,1000);

  function calc(){
    const base=Math.max(0,Number($('base-price').value)||0);
    const disc=Math.min(95,Math.max(0,Number($('discount-percent').value)||0));
    const curr=$('currency').value;
    const sale=base*(1-disc/100), save=base-sale;
    $('sale-price').textContent=curr+sale.toFixed(2);
    $('save-amount').textContent=curr+save.toFixed(2);
    $('pay-percent').textContent=(100-disc).toFixed(disc%1?1:0)+'%';
  }
  ['base-price','discount-percent','currency'].forEach(id=>$(id)?.addEventListener('input',calc));
  document.querySelectorAll('[data-discount]').forEach(b=>b.addEventListener('click',()=>{$('discount-percent').value=b.dataset.discount;calc();}));
  calc();

  const KEY='eventv-steam-winter-2026-budget-v1', BUDGET_KEY='eventv-steam-winter-2026-limit-v1', CURR_KEY='eventv-steam-winter-2026-currency-v1';
  let items=[];try{items=JSON.parse(localStorage.getItem(KEY)||'[]');}catch(_){items=[]}if(!Array.isArray(items))items=[];
  try{const v=localStorage.getItem(BUDGET_KEY);if(v!==null)$('budget-limit').value=v;const c=localStorage.getItem(CURR_KEY);if(c)$('budget-currency').value=c;}catch(_){}
  const safeSave=()=>{try{localStorage.setItem(KEY,JSON.stringify(items));localStorage.setItem(BUDGET_KEY,$('budget-limit').value);localStorage.setItem(CURR_KEY,$('budget-currency').value);return true}catch(_){return false}};
  const esc=s=>String(s).slice(0,100);
  const salePrice=x=>Math.max(0,Number(x.price)||0)*(1-Math.min(95,Math.max(0,Number(x.discount)||0))/100);
  function renderBudget(){
    const list=$('budget-list');list.querySelectorAll('.budget-item').forEach(n=>n.remove());
    $('budget-empty').hidden=items.length>0;
    $('budget-count').textContent=items.length+(items.length===1?' item':' items');
    const curr=$('budget-currency').value, limit=Math.max(0,Number($('budget-limit').value)||0);
    const spend=items.reduce((a,x)=>a+salePrice(x),0);
    $('planned-spend').textContent=curr+spend.toFixed(2);
    const remaining=limit-spend;
    $('remaining-budget').textContent=remaining>=0?curr+remaining.toFixed(2)+' remaining':curr+Math.abs(remaining).toFixed(2)+' over budget';
    items.forEach((x,i)=>{
      const row=document.createElement('div');row.className='budget-item';
      const name=document.createElement('strong');name.textContent=esc(x.name);
      const base=document.createElement('span');base.textContent=curr+Number(x.price).toFixed(2)+' · '+Number(x.discount)+'% off';
      const sale=document.createElement('span');sale.className='sale';sale.textContent=curr+salePrice(x).toFixed(2);
      const rm=document.createElement('button');rm.type='button';rm.textContent='×';rm.setAttribute('aria-label','Remove '+esc(x.name));rm.addEventListener('click',()=>{items.splice(i,1);safeSave();renderBudget();});
      row.append(name,base,sale,rm);list.appendChild(row);
    });
  }
  $('budget-form')?.addEventListener('submit',e=>{e.preventDefault();const name=$('item-name').value.trim(),price=Number($('item-price').value),discount=Number($('item-discount').value);if(!name||!Number.isFinite(price)||price<0)return;items.unshift({name:esc(name),price,discount:Math.min(95,Math.max(0,discount||0))});items=items.slice(0,100);safeSave();renderBudget();$('budget-form').reset();$('item-discount').value='25';$('item-name').focus();});
  ['budget-limit','budget-currency'].forEach(id=>$(id)?.addEventListener('input',()=>{safeSave();renderBudget();}));
  $('clear-budget')?.addEventListener('click',()=>{if(items.length&&confirm('Clear this sale budget from your browser?')){items=[];safeSave();renderBudget();}});
  $('copy-budget')?.addEventListener('click',async()=>{const b=$('copy-budget');if(!items.length){b.textContent='Nothing to copy';setTimeout(()=>b.textContent='Copy plan',1300);return;}const curr=$('budget-currency').value;const text=items.map((x,i)=>(i+1)+'. '+x.name+' — '+Number(x.discount)+'% off → '+curr+salePrice(x).toFixed(2)).join('\n');try{await navigator.clipboard.writeText(text);b.textContent='Copied'}catch(_){b.textContent='Copy unavailable'}setTimeout(()=>b.textContent='Copy plan',1300);});
  renderBudget();
})();