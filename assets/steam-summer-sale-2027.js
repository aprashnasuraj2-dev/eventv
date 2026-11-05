(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));

  function calcCapacity(){
    const budget=Math.max(0,Number($('capacity-budget').value)||0);
    const hours=Math.max(0,Number($('capacity-hours').value)||0);
    const price=Math.max(.01,Number($('capacity-price').value)||.01);
    const gameHours=Math.max(.5,Number($('capacity-game-hours').value)||.5);
    const byBudget=Math.floor(budget/price), byTime=Math.floor(hours/gameHours), realistic=Math.min(byBudget,byTime);
    $('budget-games').textContent=byBudget;$('time-games').textContent=byTime;$('realistic-games').textContent=realistic;
    const reason=byBudget===byTime?'balanced':byBudget<byTime?'budget-limited':'time-limited';
    $('limit-reason').textContent=reason;
    $('capacity-note').textContent=reason==='balanced'
      ?'At these assumptions, money and available playtime allow the same number of purchases.'
      :reason==='budget-limited'
      ?'At these assumptions, your budget becomes the tighter constraint before your available gaming hours.'
      :'At these assumptions, buying more than '+realistic+' game'+(realistic===1?'':'s')+' creates planned playtime beyond the '+hours+' hours you entered.';
  }
  ['capacity-budget','capacity-hours','capacity-price','capacity-game-hours','capacity-currency'].forEach(id=>$(id)?.addEventListener('input',calcCapacity));
  calcCapacity();

  const CART_KEY='eventv-steam-summer-2027-cart-v1',LIMIT_KEY='eventv-steam-summer-2027-limits-v1';
  let cart=[];try{cart=JSON.parse(localStorage.getItem(CART_KEY)||'[]')}catch(_){cart=[]}if(!Array.isArray(cart))cart=[];
  try{const l=JSON.parse(localStorage.getItem(LIMIT_KEY)||'{}');if(l.budget!=null)$('cart-budget').value=l.budget;if(l.hours!=null)$('cart-hours-limit').value=l.hours;if(l.currency)$('cart-currency').value=l.currency}catch(_){}
  const clean=s=>String(s).slice(0,100);
  const sale=x=>Math.max(0,Number(x.price)||0)*(1-clamp(Number(x.discount)||0,0,95)/100);
  const saveCart=()=>{try{localStorage.setItem(CART_KEY,JSON.stringify(cart));localStorage.setItem(LIMIT_KEY,JSON.stringify({budget:$('cart-budget').value,hours:$('cart-hours-limit').value,currency:$('cart-currency').value}));return true}catch(_){return false}};
  function renderCart(){
    const list=$('cart-list');list.querySelectorAll('.cart-item').forEach(n=>n.remove());
    $('cart-empty').hidden=cart.length>0;
    const curr=$('cart-currency').value,budget=Math.max(0,Number($('cart-budget').value)||0),hoursLimit=Math.max(0,Number($('cart-hours-limit').value)||0);
    const spend=cart.reduce((a,x)=>a+sale(x),0),hours=cart.reduce((a,x)=>a+(Number(x.hours)||0),0);
    $('cart-spend').textContent=curr+spend.toFixed(2);$('cart-time').textContent=(Math.round(hours*10)/10)+'h';$('cart-count').textContent=cart.length;
    const remBudget=budget-spend,remHours=hoursLimit-hours;
    $('cart-budget-state').textContent=remBudget>=0?curr+remBudget.toFixed(2)+' remaining':curr+Math.abs(remBudget).toFixed(2)+' over budget';
    $('cart-time-state').textContent=remHours>=0?(Math.round(remHours*10)/10)+'h remaining':(Math.round(Math.abs(remHours)*10)/10)+'h over limit';
    $('cart-signal').textContent=remBudget>=0&&remHours>=0?'Cart is within both limits.':remBudget<0&&remHours<0?'Cart exceeds both money and playtime limits.':remBudget<0?'Cart exceeds the money limit.':'Cart exceeds the playtime limit.';
    cart.forEach((x,i)=>{
      const row=document.createElement('div');row.className='cart-item';
      const name=document.createElement('strong');name.textContent=clean(x.name);
      const regular=document.createElement('span');regular.textContent=curr+Number(x.price).toFixed(2)+' · '+Number(x.discount)+'% off';
      const price=document.createElement('span');price.className='price';price.textContent=curr+sale(x).toFixed(2);
      const time=document.createElement('span');time.textContent=Number(x.hours)+'h planned';
      const rm=document.createElement('button');rm.type='button';rm.textContent='×';rm.setAttribute('aria-label','Remove '+clean(x.name));rm.addEventListener('click',()=>{cart.splice(i,1);saveCart();renderCart();});
      row.append(name,regular,price,time,rm);list.appendChild(row);
    });
  }
  $('cart-form')?.addEventListener('submit',e=>{e.preventDefault();const name=$('cart-name').value.trim(),price=Number($('cart-price').value),discount=clamp(Number($('cart-discount').value)||0,0,95),hours=Math.max(.5,Number($('cart-hours').value)||.5);if(!name||!Number.isFinite(price)||price<0)return;cart.unshift({name:clean(name),price,discount,hours});cart=cart.slice(0,100);saveCart();renderCart();$('cart-form').reset();$('cart-discount').value='25';$('cart-hours').value='10';$('cart-name').focus();});
  ['cart-budget','cart-hours-limit','cart-currency'].forEach(id=>$(id)?.addEventListener('input',()=>{saveCart();renderCart();}));
  $('clear-cart')?.addEventListener('click',()=>{if(cart.length&&confirm('Clear your Summer Sale cart from this browser?')){cart=[];saveCart();renderCart();}});
  $('copy-cart')?.addEventListener('click',async()=>{const b=$('copy-cart');if(!cart.length){b.textContent='Nothing to copy';setTimeout(()=>b.textContent='Copy cart',1300);return;}const curr=$('cart-currency').value;const text=cart.map((x,i)=>(i+1)+'. '+x.name+' — '+x.discount+'% → '+curr+sale(x).toFixed(2)+' · '+x.hours+'h planned').join('\n');try{await navigator.clipboard.writeText(text);b.textContent='Copied'}catch(_){b.textContent='Copy unavailable'}setTimeout(()=>b.textContent='Copy cart',1300);});
  renderCart();

  function renderWish(){
    const d=Number($('wish-discount').value)||0,duration=Number($('wish-duration').value)||0,base=$('wish-base').checked;
    const ok=d>=20&&duration>8&&base;
    const missing=[];if(d<20)missing.push('discount is below 20%');if(duration<=8)missing.push('duration must be over 8 hours');if(!base)missing.push('lowest-priced package is not included');
    $('wish-result').innerHTML=ok
      ?'<span>DEVELOPER-SIDE THRESHOLD</span><strong>Conditions appear met</strong><p>Steamworks currently describes 20%+, longer than 8 hours, with the lowest-priced package included.</p>'
      :'<span>DEVELOPER-SIDE THRESHOLD</span><strong>One or more conditions are not met</strong><p>'+missing.join('; ')+'.</p>';
  }
  ['wish-discount','wish-duration','wish-base'].forEach(id=>$(id)?.addEventListener('input',renderWish));renderWish();

  function dateOnly(d){return d.toISOString().slice(0,10);}
  function formatDate(d){return new Intl.DateTimeFormat(undefined,{year:'numeric',month:'short',day:'numeric'}).format(d);}
  function refundCheck(){
    const raw=$('refund-date').value,play=Number($('refund-hours').value)||0;
    if(!raw){$('refund-result').innerHTML='<span>STANDARD POLICY PRECHECK</span><strong>Enter a purchase date</strong><p>We’ll compare the date and playtime against Steam’s standard 14-day / under-2-hours rule.</p>';$('refund-deadline').textContent='No deadline calculated yet.';return;}
    const purchase=new Date(raw+'T12:00:00'),today=new Date(),deadline=new Date(purchase);deadline.setDate(deadline.getDate()+14);
    const beforePurchase=today<purchase,within=today<=deadline,under=play<2;
    let title,copy;
    if(beforePurchase){title='Purchase date is in the future';copy='Choose the actual purchase date after you buy the game.';}
    else if(within&&under){title='Within the standard time/playtime thresholds';copy='That does not guarantee a refund; Steam Support makes the actual decision and exceptions can apply.';}
    else{const reasons=[];if(!within)reasons.push('more than 14 days have elapsed');if(!under)reasons.push('playtime is 2 hours or more');title='Outside at least one standard threshold';copy=reasons.join(' and ')+'. Steam says you may still request a refund for review.';}
    $('refund-result').innerHTML='<span>STANDARD POLICY PRECHECK</span><strong>'+title+'</strong><p>'+copy+'</p>';
    $('refund-deadline').textContent='14-day reference date: '+formatDate(deadline)+'. Standard game/software policy also requires playtime under 2 hours.';
  }
  $('refund-date')?.addEventListener('input',refundCheck);$('refund-hours')?.addEventListener('input',refundCheck);refundCheck();
})();