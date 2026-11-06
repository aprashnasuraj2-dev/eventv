(() => {
'use strict';
const CANCEL_KEY='eventv:cyber-monday-2026:subscriptions:v1';
const $=id=>document.getElementById(id);
const n=id=>Math.max(0,Number($(id)?.value)||0);
const money=(symbol,value)=>symbol+(Number.isFinite(value)?value.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}):'—');
const pct=value=>Number.isFinite(value)?value.toFixed(1)+'%':'—';
const read=()=>{try{const v=JSON.parse(localStorage.getItem(CANCEL_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
const write=v=>{try{localStorage.setItem(CANCEL_KEY,JSON.stringify(v))}catch{}};
const uid=()=>String(Date.now())+'-'+Math.random().toString(16).slice(2);
const addDays=(iso,days)=>{if(!iso)return'';const d=new Date(iso+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+Number(days||0));return d.toISOString().slice(0,10)};
const diffDays=(a,b)=>{if(!a||!b)return NaN;return Math.round((new Date(b+'T12:00:00Z')-new Date(a+'T12:00:00Z'))/86400000)};
const fmtDate=iso=>iso?new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'}).format(new Date(iso+'T12:00:00Z')):'—';
const el=(tag,text,cls)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
const metric=(label,value,detail)=>{const d=el('div');d.append(el('span',label),el('strong',value));if(detail)d.append(el('small',detail));return d};
function setVerdict(kind,title,body){
  const out=$('renewal-verdict');if(!out)return;
  out.className='verdict '+kind;out.textContent='';out.append(el('strong',title),el('p',body));
}

const renewalForm=$('renewal-form');
if(renewalForm)renewalForm.addEventListener('submit',e=>{
  e.preventDefault();
  const symbol=$('renewal-currency').value||'';
  const intro=n('renewal-intro'),introMonths=Math.max(1,n('renewal-intro-months')),next=n('renewal-next'),nextMonths=Math.max(1,n('renewal-next-months'));
  const seats=Math.max(1,n('renewal-seats')),setup=n('renewal-setup'),tax=n('renewal-tax'),fx=n('renewal-fx'),trial=n('renewal-trial');
  const introService=intro*seats,nextService=next*seats;
  const firstCash=introService+setup+tax+fx;
  const introMonthly=introService/introMonths,nextMonthly=nextService/nextMonths;
  const jump=introMonthly>0?((nextMonthly-introMonthly)/introMonthly)*100:NaN;
  const results=$('renewal-results');
  const vals=[money(symbol,firstCash),money(symbol,introMonthly),money(symbol,nextMonthly),pct(jump)];
  Array.from(results.children).forEach((box,i)=>box.querySelector('strong').textContent=vals[i]);
  const gaps=[];
  if(!$('renewal-source').value.trim())gaps.push('no cancellation/renewal evidence recorded');
  if(!$('renewal-date').value)gaps.push('renewal date not recorded');
  if(trial>0&&!$('renewal-date').value)gaps.push('trial exists but first paid/renewal date is not anchored');
  if(nextMonthly>introMonthly*1.25)gaps.push('normalized renewal rate is '+pct(jump)+' above the intro rate');
  if(setup+tax+fx>0)gaps.push('headline service price excludes '+money(symbol,setup+tax+fx)+' of entered setup/tax/FX cost');
  const body='Service-only intro equivalent is '+money(symbol,introMonthly)+'/month across '+introMonths+' month(s); service-only renewal equivalent is '+money(symbol,nextMonthly)+'/month across '+nextMonths+' month(s). First cash outlay includes the entered one-time/tax/FX amounts.';
  setVerdict(gaps.length?'warn':'good',gaps.length?'Review before checkout: '+gaps.join('; ')+'.':'Term arithmetic is internally consistent with your inputs.',body);
});

const annualForm=$('annual-form');
if(annualForm)annualForm.addEventListener('submit',e=>{
  e.preventDefault();
  const monthly=n('annual-monthly'),annual=n('annual-upfront'),use=Math.max(1,n('annual-use'));
  const mSetup=n('annual-monthly-setup'),aSetup=n('annual-year-setup'),mFees=n('annual-monthly-fees'),aFees=n('annual-year-fees');
  const prorate=$('annual-refund').value==='yes';
  const monthlyCost=monthly*use+mSetup+mFees;
  const annualService=prorate?annual*(use/12):annual*Math.ceil(use/12);
  const annualCost=annualService+aSetup+aFees;
  const delta=monthlyCost-annualCost;
  const out=$('annual-result');out.textContent='';
  const grid=el('div',undefined,'result-grid');
  grid.append(metric('Monthly path',money('',monthlyCost),use+' payment month(s)'),
              metric('Annual path',money('',annualCost),prorate?'unused time modeled prorated':'full prepaid term(s) modeled'),
              metric('Difference',(delta>=0?'+':'')+money('',delta),delta>0?'annual path lower in this model':delta<0?'monthly path lower in this model':'equal'));
  out.appendChild(grid);
  const perMonthAnnual=annual/12;
  const p=el('p',undefined,'legal-note');
  if(use<12&&!prorate&&annualCost>monthlyCost){
    p.textContent='The annual plan has a nominal monthly equivalent of '+money('',perMonthAnnual)+', yet your '+use+'-month expected-use model makes the monthly path '+money('',annualCost-monthlyCost)+' cheaper because unused annual time is not modeled as refundable.';
  }else{
    p.textContent='Nominal annual monthly equivalent: '+money('',perMonthAnnual)+'. This result depends on your expected-use horizon and refund assumption; it is not a recommendation.';
  }
  out.appendChild(p);
});

const checkoutForm=$('checkout-form');
if(checkoutForm)checkoutForm.addEventListener('submit',e=>{
  e.preventDefault();
  const symbol=$('checkout-currency').value||'';
  const market=$('checkout-market').value,base=n('checkout-base'),discount=Math.min(n('checkout-discount'),base),tax=n('checkout-tax'),fee=n('checkout-fee'),fx=n('checkout-fx');
  const seats=Math.max(1,n('checkout-seats')),months=Math.max(1,n('checkout-months')),display=n('checkout-display-monthly');
  const service=(base-discount)*seats,total=service+tax+fee+fx,effective=total/months;
  const out=$('checkout-result');out.textContent='';
  const grid=el('div',undefined,'result-grid');
  grid.append(metric('Service after discount',money(symbol,service),seats+' seat(s)'),
              metric('Exact entered checkout',money(symbol,total),'service + tax + fee + FX'),
              metric('Effective monthly cost',money(symbol,effective),months+'-month normalization'));
  out.appendChild(grid);
  const notes=[];
  if(display>0){
    const shownTotal=display*months*seats;
    const gap=total-shownTotal;
    notes.push('Displayed monthly equivalent implies '+money(symbol,shownTotal)+' across the term; your entered checkout total differs by '+money(symbol,gap)+'.');
  }
  const marketNote={
    US:'No universal U.S. digital-service sales-tax rate is assumed; use the actual checkout tax for your location and service.',
    UK:'HMRC says digital services supplied to UK consumers are liable to UK VAT; the standard rate is currently 20% for most goods/services, but product treatment can differ.',
    CA:'CRA says digital GST/HST depends on usual residence/province and supplier/platform status; do not replace checkout evidence with one Canada-wide percentage.',
    AU:'ATO applies GST rules to imported digital services/products and supplier registration matters; use the tax actually shown at checkout.',
    EU:'EU consumer VAT is destination-oriented and rates differ by member state; this tool intentionally does not hard-code a single EU rate.',
    OTHER:'Use the tax and mandatory fees actually shown for your billing location.'
  }[market];
  notes.push(marketNote);
  out.appendChild(el('p',notes.join(' '),'legal-note'));
});

let subs=read();
function renderSubs(){
  const out=$('cancel-list');if(!out)return;out.textContent='';
  const sorted=subs.slice().sort((a,b)=>a.renewal.localeCompare(b.renewal));
  sorted.forEach(item=>{
    const card=el('article',undefined,'sub-card'),head=el('header'),left=el('div');
    left.append(el('h3',item.name),el('small',item.market+' · renewal '+fmtDate(item.renewal)));
    const rm=el('button','Remove','remove-btn');rm.type='button';
    rm.addEventListener('click',()=>{subs=subs.filter(x=>x.id!==item.id);write(subs);renderSubs()});
    head.append(left,rm);card.appendChild(head);
    const m=el('div',undefined,'meta');
    const remind=addDays(item.renewal,-item.buffer);
    [item.method,'reminder target '+fmtDate(remind),item.trialEnd?'trial ends '+fmtDate(item.trialEnd):'no trial date entered'].forEach(v=>m.appendChild(el('span',v)));
    card.appendChild(m);
    if(item.url){
      const p=el('p','Cancellation evidence: ','privacy-note');
      if(/^https?:\/\//i.test(item.url)){const a=el('a','Open instructions');a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';p.appendChild(a)}
      else p.append(document.createTextNode(item.url));
      card.appendChild(p);
    }
    if(item.note)card.appendChild(el('p','Evidence note: '+item.note,'privacy-note'));
    out.appendChild(card);
  });
  if(!sorted.length)out.appendChild(el('p','No subscriptions saved on this device.','empty'));
}
const cancelForm=$('cancel-form');
if(cancelForm)cancelForm.addEventListener('submit',e=>{
  e.preventDefault();
  subs.push({id:uid(),name:$('cancel-name').value.trim(),market:$('cancel-market').value,trialEnd:$('cancel-trial-end').value,renewal:$('cancel-renewal').value,buffer:n('cancel-buffer'),method:$('cancel-method').value,url:$('cancel-url').value.trim(),note:$('cancel-note').value.trim()});
  write(subs);cancelForm.reset();$('cancel-buffer').value='7';renderSubs();
});
if($('cancel-clear'))$('cancel-clear').addEventListener('click',()=>{subs=[];write(subs);renderSubs()});

const matchForm=$('match-form');
if(matchForm)matchForm.addEventListener('submit',e=>{
  e.preventDefault();
  const buy=$('match-buy-date').value,lower=$('match-lower-date').value,window=Math.max(0,n('match-window'));
  const same=$('match-same').value==='yes',seller=$('match-seller').value==='yes',exclusion=$('match-exclusion').value,source=$('match-source').value.trim();
  const old=n('match-old'),later=n('match-new'),days=diffDays(buy,lower),difference=old-later;
  const within=Number.isFinite(days)&&days>=0&&days<=window;
  const checks=[
    ['Within entered policy window',within,Number.isFinite(days)?days+' day(s) after purchase':'date error'],
    ['Exact same plan/SKU/tier',same,same?'confirmed':'not confirmed'],
    ['Same seller/billing channel',seller,seller?'confirmed':'not confirmed'],
    ['Promotion exclusion checked',exclusion!=='unknown',exclusion==='yes'?'policy says excluded':exclusion==='no'?'no explicit exclusion entered':'unknown'],
    ['Written policy evidence',Boolean(source),source?'recorded':'missing']
  ];
  const out=$('match-result');out.textContent='';
  const grid=el('div',undefined,'result-grid');
  checks.slice(0,3).forEach(c=>grid.appendChild(metric(c[0],c[1]?'PASS':'FAIL',c[2])));
  out.appendChild(grid);
  let conclusion;
  if(difference<=0)conclusion='The later price is not lower than the original paid price.';
  else if(exclusion==='yes')conclusion='Your entered policy says this promotion/event is excluded; the modeled price difference is '+money('',difference)+', but the policy evidence does not support a match.';
  else if(checks.every(c=>c[1]))conclusion='The evidence you entered is internally consistent with asking for a price adjustment of '+money('',difference)+'. This is not a legal entitlement or approval.';
  else conclusion='A '+money('',Math.max(0,difference))+' price difference exists, but the policy evidence is incomplete or fails one or more conditions.';
  out.appendChild(el('p',conclusion,'legal-note'));
});

renderSubs();
})();