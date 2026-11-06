(()=>{'use strict';
const CANCEL_KEY='eventv:cyber-monday-2027:cancellation-evidence:v2';
const $=id=>document.getElementById(id);
const val=id=>String($(id)?.value??'').trim();
const num=id=>Math.max(0,Number($(id)?.value)||0);
const clean=(s,n=300)=>String(s??'').slice(0,n);
const money=(s,n)=>s+Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
const el=(tag,text,cls)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
const metric=(label,value,detail)=>{const d=el('div');d.append(el('span',label),el('strong',value));if(detail)d.append(el('small',detail));return d};
const parseDate=v=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return null;return new Date(v+'T12:00:00Z')};
const addDays=(v,n)=>{const d=parseDate(v);if(!d)return'';d.setUTCDate(d.getUTCDate()+Number(n||0));return d.toISOString().slice(0,10)};
const fmtDate=v=>{const d=parseDate(v);return d?new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'}).format(d):'—'};
const uid=()=>String(Date.now())+'-'+Math.random().toString(16).slice(2);

// 01 Exact plan fingerprint
$('delta-run')?.addEventListener('click',()=>{
  const specs=[
    ['Plan / tier','plan','text'],['Seats / users','seats','number'],['Billing term','term','number'],
    ['Storage / usage','usage','text'],['Support level','support','text'],['AI/API credits','credits','text'],
    ['Commercial rights','rights','text'],['Version / edition','edition','text'],['Seller / billing channel','channel','text']
  ];
  const mismatches=[],missing=[];
  for(const [label,key,type] of specs){
    const a=val('bf-'+key),b=val('cm-'+key);
    if(!a||!b){missing.push(label);continue}
    const same=type==='number'?Number(a)===Number(b):a.toLowerCase()===b.toLowerCase();
    if(!same)mismatches.push(label+': '+a+' vs '+b);
  }
  const bf=num('bf-price'),cm=num('cm-price'),out=$('delta-result');out.textContent='';
  const grid=el('div',undefined,'result-grid');
  grid.append(
    metric('Plan mismatches',String(mismatches.length),mismatches.length?'not like-for-like':'none among completed fields'),
    metric('Missing fields',String(missing.length),missing.length?'comparison evidence incomplete':'all configured fields present'),
    metric('First-term price delta',(bf>0&&cm>0)?money('',cm-bf):'—',(bf>0&&cm>0)?'Cyber Monday − Black Friday':'enter both gross prices')
  );
  out.appendChild(grid);
  let msg;
  if(mismatches.length)msg='Non-like-for-like comparison: '+mismatches.join('; ')+'. Do not convert the price difference into a better-deal verdict.';
  else if(missing.length)msg='No mismatch detected in completed fields, but evidence is incomplete: '+missing.join(', ')+'.';
  else if(bf>0&&cm>0)msg=cm<bf?'Plan fingerprint matches and Cyber Monday is '+money('',bf-cm)+' lower for the first term only. Renewal and regional-cost checks are still separate.':cm>bf?'Plan fingerprint matches and Cyber Monday is '+money('',cm-bf)+' higher for the first term.':'Plan fingerprint matches and first-term gross prices are equal.';
  else msg='Plan fingerprint matches, but enter both first-term gross prices to compare cash.';
  out.appendChild(el('p',msg,'fine-print'));
});

// Shared subscription cost helper
function subscriptionCost(horizon,firstPrice,firstMonths,renewPrice,renewMonths){
  let total=firstPrice,renewals=0;
  const remaining=Math.max(0,horizon-firstMonths);
  if(remaining>0){renewals=Math.ceil(remaining/renewMonths);total+=renewals*renewPrice}
  return {total,renewals,effective:total/horizon};
}

// 02 Trial -> paid -> renewal
$('trial-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const cur=clean(val('trial-currency'),8),start=val('trial-start'),trialDays=num('trial-days'),first=num('trial-first-price'),firstMonths=Math.max(1,num('trial-first-months')),renew=num('trial-renew-price'),renewMonths=Math.max(1,num('trial-renew-months')),buffer=num('trial-buffer'),horizon=Math.max(1,num('trial-horizon')),note=val('trial-cancel-note');
  const firstCharge=addDays(start,trialDays),cancelTarget=addDays(firstCharge,-buffer);
  const c=subscriptionCost(horizon,first,firstMonths,renew,renewMonths);
  const renewalStart=addDays(firstCharge,Math.round(firstMonths*30.4375));
  const out=$('trial-result');out.textContent='';
  const grid=el('div',undefined,'result-grid');
  grid.append(
    metric('First charge',fmtDate(firstCharge),trialDays+' trial day(s) from entered start'),
    metric('Cancel target',fmtDate(cancelTarget),buffer+' day buffer before first charge'),
    metric('Modeled '+horizon+'-month cash',money(cur,c.total),c.renewals+' renewal term(s) after first paid term')
  );
  out.appendChild(grid);
  let p='First modeled renewal boundary is approximately '+fmtDate(renewalStart)+'. Effective paid-horizon cost is '+money(cur,c.effective)+'/month.';
  if(!note)p+=' Cancellation method/evidence is still missing.';
  p+=' Dates after the first charge use average-month arithmetic for planning; verify the vendor’s actual renewal date in the contract.';
  out.appendChild(el('p',p,'fine-print'));
});

// 03 Subscription vs perpetual/lifetime
$('license-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const cur=clean(val('license-currency'),8),h=Math.max(1,num('license-horizon')),sf=num('license-sub-first'),sfm=Math.max(1,num('license-sub-first-months')),sr=num('license-sub-renew'),srm=Math.max(1,num('license-sub-renew-months')),life=num('license-life'),upgradeMonths=num('license-upgrade-months'),upgradeCost=num('license-upgrade-cost'),maint=num('license-maint'),scope=val('license-scope');
  const sub=subscriptionCost(h,sf,sfm,sr,srm);
  const upgrades=upgradeMonths>0?Math.floor((h-1)/upgradeMonths):0;
  const maintenanceYears=Math.ceil(h/12);
  const lifeTotal=life+upgrades*upgradeCost+maintenanceYears*maint;
  const delta=sub.total-lifeTotal;
  const out=$('license-result');out.textContent='';
  const grid=el('div',undefined,'result-grid');
  grid.append(
    metric('Subscription cash',money(cur,sub.total),sub.renewals+' renewal term(s)'),
    metric('Perpetual/lifetime path',money(cur,lifeTotal),upgrades+' paid upgrade(s) + '+maintenanceYears+' maintenance year(s)'),
    metric('Subscription − license',(delta>=0?'+':'')+money(cur,delta),delta>0?'license path lower cash':delta<0?'subscription path lower cash':'equal cash')
  );
  out.appendChild(grid);
  let msg='This comparison covers '+h+' months only. It does not predict vendor survival, OS compatibility, future mandatory upgrades, cloud availability or feature parity.';
  if(!scope)msg+=' The “lifetime/perpetual” scope is not documented yet.';
  out.appendChild(el('p',msg,'fine-print'));
});

// 04 Regional checkout normalizer
$('regional-run')?.addEventListener('click',()=>{
  const readOffer=p=>{
    const base=num('reg-'+p+'-base'),tax=num('reg-'+p+'-tax'),fee=num('reg-'+p+'-fee'),fx=Math.max(0.000001,Number(val('reg-'+p+'-fx'))||1),card=num('reg-'+p+'-card');
    const local=base+tax+fee+card;
    return {market:val('reg-'+p+'-market'),cur:val('reg-'+p+'-cur'),base,tax,fee,fx,card,local,normalized:local*fx};
  };
  const a=readOffer('a'),b=readOffer('b'),out=$('regional-result');out.textContent='';
  const grid=el('div',undefined,'result-grid');
  grid.append(
    metric('Offer A normalized',money('',a.normalized),a.market+' · '+a.cur+money('',a.local)+' local gross'),
    metric('Offer B normalized',money('',b.normalized),b.market+' · '+b.cur+money('',b.local)+' local gross'),
    metric('B − A',(b.normalized-a.normalized>=0?'+':'')+money('',b.normalized-a.normalized),'comparison-currency units')
  );
  out.appendChild(grid);
  out.appendChild(el('p','FX multipliers and card fees are user-entered. This tool does not fetch exchange rates or determine whether the tax shown by a vendor is legally correct.','fine-print'));
});

// 05 Cancellation evidence ledger
const readLedger=()=>{try{const v=JSON.parse(localStorage.getItem(CANCEL_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
const writeLedger=v=>{try{localStorage.setItem(CANCEL_KEY,JSON.stringify(v))}catch{}};
let cancelLedger=readLedger();
function renderCancel(){
  const out=$('cancel-list');if(!out)return;out.textContent='';
  cancelLedger.slice().sort((a,b)=>a.date.localeCompare(b.date)).forEach(item=>{
    const card=el('article',undefined,'ledger-card'),head=el('header'),left=el('div');
    left.append(el('h3',item.plan),el('small',item.market+' · next charge '+fmtDate(item.date)));
    const rm=el('button','Remove','remove-btn');rm.type='button';rm.addEventListener('click',()=>{cancelLedger=cancelLedger.filter(x=>x.id!==item.id);writeLedger(cancelLedger);renderCancel()});
    head.append(left,rm);card.appendChild(head);
    const meta=el('div',undefined,'meta');
    [item.method,item.by?'target '+fmtDate(item.by):'no cancel-by date',item.amount>0?'renewal '+money('',item.amount):'amount not entered'].forEach(t=>meta.appendChild(el('span',t)));
    card.appendChild(meta);
    const p=el('p','Evidence: ','fine-print');
    if(/^https?:\/\//i.test(item.source)){const a=el('a','Open instructions/source');a.href=item.source;a.target='_blank';a.rel='noopener noreferrer';p.appendChild(a)}
    else p.append(document.createTextNode(item.source));
    card.appendChild(p);out.appendChild(card);
  });
  if(!cancelLedger.length)out.appendChild(el('p','No cancellation evidence saved.','empty-state'));
}
$('cancel-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const item={id:uid(),plan:val('cancel-plan'),market:val('cancel-market'),date:val('cancel-date'),by:val('cancel-by'),method:val('cancel-method'),amount:num('cancel-amount'),source:clean(val('cancel-source'),500)};
  if(!item.plan||!item.date||!item.source)return;
  cancelLedger.push(item);writeLedger(cancelLedger);$('cancel-form').reset();renderCancel();
});
$('cancel-clear')?.addEventListener('click',()=>{cancelLedger=[];writeLedger(cancelLedger);renderCancel()});

// 06 Legal revalidation gate
const legalChecks=[...document.querySelectorAll('#legal-checklist input[type="checkbox"]')];
function legalProgress(){const n=legalChecks.filter(x=>x.checked).length;if($('legal-progress'))$('legal-progress').textContent=n+' of '+legalChecks.length+' revalidation checks complete'+(n===legalChecks.length?' — editorial freshness gate satisfied for this review session.':'.')}
legalChecks.forEach(x=>x.addEventListener('change',legalProgress));
legalProgress();
renderCancel();
})();