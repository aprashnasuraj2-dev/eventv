(()=>{'use strict';
const LEDGER_KEY='eventv:black-friday-2027:price-history:v2';
const $=id=>document.getElementById(id);
const num=id=>Math.max(0,Number($(id)?.value)||0);
const val=id=>String($(id)?.value??'').trim();
const clean=(s,n=200)=>String(s??'').slice(0,n);
const fmt=n=>Number.isFinite(n)?Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}):'—';
const pct=n=>Number.isFinite(n)?n.toFixed(1)+'%':'—';
const el=(tag,text,cls)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
const metric=(label,value,detail)=>{const d=el('div');d.append(el('span',label),el('strong',value));if(detail)d.append(el('small',detail));return d};
const read=()=>{try{const v=JSON.parse(localStorage.getItem(LEDGER_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
const write=v=>{try{localStorage.setItem(LEDGER_KEY,JSON.stringify(v))}catch{}};
const uid=()=>String(Date.now())+'-'+Math.random().toString(16).slice(2);
const fmtDate=iso=>iso?new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'}).format(new Date(iso+'T12:00:00Z')):'—';
const seriesKey=x=>[x.product.toLowerCase(),x.seller.toLowerCase(),x.market,x.condition,x.currency].join('|');
const median=xs=>{if(!xs.length)return NaN;const a=xs.slice().sort((a,b)=>a-b),m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2};
const between=(d,a,b)=>d>=a&&d<=b;

// Tool 01 — deal math
$('deal-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const former=num('deal-former'),current=num('deal-current'),observedRaw=val('deal-observed'),observed=num('deal-observed'),shipping=num('deal-shipping'),fees=num('deal-fees'),sym=clean(val('deal-symbol'),5);
  const out=$('deal-result');
  if(former<=0||current<0){out.textContent='Enter valid non-negative prices.';return}
  const displayed=((former-current)/former)*100;
  const landed=current+shipping+fees;
  const parts=[
    'Displayed reduction: '+pct(displayed)+' vs the entered former/reference price.',
    'Entered landed cost: '+sym+fmt(landed)+'.'
  ];
  if(observedRaw){
    if(observed<=0){parts.push('Your observed comparable price is invalid.')}
    else{
      const vsObserved=((observed-current)/observed)*100;
      parts.push('Reduction vs your dated comparable observation: '+pct(vsObserved)+'.');
      if(displayed-vsObserved>=10)parts.push('Evidence gap: the headline reduction exceeds the reduction vs your observation by '+(displayed-vsObserved).toFixed(1)+' percentage points.');
    }
  }else parts.push('No dated comparable observation entered; the headline percentage has no independent baseline here.');
  out.textContent=parts.join(' ');
});

// Tool 02 — landed-cost comparator
$('compare-run')?.addEventListener('click',()=>{
  const rows=['a','b','c'].map(k=>{
    const price=num(k+'-price'),ship=num(k+'-ship'),fees=num(k+'-fees'),qty=num(k+'-qty');
    return {name:val(k+'-name')||('Offer '+k.toUpperCase()),price,ship,fees,qty,total:price+ship+fees,unit:qty>0?(price+ship+fees)/qty:NaN};
  }).filter(x=>x.price>0&&x.qty>0);
  const out=$('compare-result');out.textContent='';
  if(rows.length<2){out.appendChild(el('p','Enter at least two valid offers.','empty-state'));return}
  rows.sort((a,b)=>a.unit-b.unit);
  const grid=el('div',undefined,'compare-table');
  rows.forEach((x,i)=>{
    const d=el('div',undefined,i===0?'winner':'');
    d.append(el('span',x.name),el('strong',fmt(x.total)),el('small',fmt(x.unit)+' per comparable unit'));
    grid.appendChild(d);
  });
  out.appendChild(grid);
  out.appendChild(el('p','Lowest entered unit cost: '+rows[0].name+'. This is arithmetic only; it does not prove equal SKU, warranty, condition, seller quality or return economics.','fine-print'));
});

// Tool 03 — exact-series 90/30-day ledger
let ledger=read();
let focusKey=ledger.length?seriesKey(ledger[ledger.length-1]):null;
function landed(x){return Number(x.price)+Number(x.shipping)+Number(x.fees)}
function renderLedger(){
  const list=$('ledger-list'),analysis=$('ledger-analysis');if(!list||!analysis)return;
  list.textContent='';
  const sorted=ledger.slice().sort((a,b)=>(b.date+b.product).localeCompare(a.date+a.product));
  sorted.forEach(item=>{
    const card=el('article',undefined,'ledger-card');
    const head=el('header'),left=el('div');
    left.append(el('h3',item.product),el('small',item.seller+' · '+item.market+' · '+item.condition+' · '+fmtDate(item.date)));
    const rm=el('button','Remove','remove-btn');rm.type='button';rm.addEventListener('click',()=>{
      ledger=ledger.filter(x=>x.id!==item.id);write(ledger);
      if(!ledger.some(x=>seriesKey(x)===focusKey))focusKey=ledger.length?seriesKey(ledger[ledger.length-1]):null;
      renderLedger();
    });
    head.append(left,rm);card.appendChild(head);
    const meta=el('div',undefined,'meta');
    [item.checkpoint,item.currency+fmt(item.price),'landed '+item.currency+fmt(landed(item))].forEach(t=>meta.appendChild(el('span',t)));
    card.appendChild(meta);
    if(item.source){
      const p=el('p','Evidence: ','fine-print');
      if(/^https?:\/\//i.test(item.source)){const a=el('a','Open source');a.href=item.source;a.target='_blank';a.rel='noopener noreferrer';p.appendChild(a)}
      else p.append(document.createTextNode(item.source));
      card.appendChild(p);
    }
    list.appendChild(card);
  });
  if(!sorted.length)list.appendChild(el('p','No observations saved on this device.','empty-state'));

  const series=focusKey?ledger.filter(x=>seriesKey(x)===focusKey):[];
  const pre90=series.filter(x=>between(x.date,'2027-08-28','2027-11-25'));
  const pre30=series.filter(x=>between(x.date,'2027-10-27','2027-11-25'));
  const low90=pre90.length?Math.min(...pre90.map(landed)):NaN;
  const low30=pre30.length?Math.min(...pre30.map(landed)):NaN;
  const med90=pre90.length?median(pre90.map(landed)):NaN;
  const bf=series.filter(x=>x.checkpoint==='Black Friday — Nov 26'||x.date==='2027-11-26').sort((a,b)=>b.date.localeCompare(a.date))[0];
  const cm=series.filter(x=>x.checkpoint==='Cyber Monday — Nov 29'||x.date==='2027-11-29').sort((a,b)=>b.date.localeCompare(a.date))[0];
  const currency=series[0]?.currency||'';
  const vals=[
    ['ledger-count',String(series.length)],
    ['ledger-low90',Number.isFinite(low90)?currency+fmt(low90):'—'],
    ['ledger-low30',Number.isFinite(low30)?currency+fmt(low30):'—'],
    ['ledger-median',Number.isFinite(med90)?currency+fmt(med90):'—'],
    ['ledger-bf',bf?currency+fmt(landed(bf)):'—'],
    ['ledger-cm',cm?currency+fmt(landed(cm)):'—']
  ];
  vals.forEach(([id,v])=>{if($(id))$(id).textContent=v});

  if(!series.length){analysis.textContent='No exact-series price evidence recorded yet.';return}
  const notes=['Focused series: '+series[0].product+' · '+series[0].seller+' · '+series[0].market+' · '+series[0].condition+' · '+series[0].currency+'.'];
  notes.push('Pre-Black-Friday 90-day window has '+pre90.length+' observation(s); the 30-day window has '+pre30.length+'. Sparse observations are not a continuous retailer price history.');
  if(bf&&Number.isFinite(low90))notes.push('Black Friday landed price is '+pct(((low90-landed(bf))/low90)*100)+' versus your observed 90-day low.');
  if(bf&&Number.isFinite(low30))notes.push('Black Friday landed price is '+pct(((low30-landed(bf))/low30)*100)+' versus your observed 30-day low. For Germany/EU this personal observed minimum is not itself a legal-compliance finding.');
  if(bf&&cm){
    const delta=landed(cm)-landed(bf);
    notes.push(delta===0?'Your BF and CM landed snapshots are equal.':delta<0?'Cyber Monday is '+currency+fmt(Math.abs(delta))+' lower than Black Friday in this exact series.':'Black Friday is '+currency+fmt(delta)+' lower than Cyber Monday in this exact series.');
  }
  analysis.textContent=notes.join(' ');
}
$('ledger-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const item={
    id:uid(),product:val('ledger-product'),seller:val('ledger-seller'),market:val('ledger-market'),condition:val('ledger-condition'),currency:clean(val('ledger-currency'),8)||'',
    date:val('ledger-date'),checkpoint:val('ledger-checkpoint'),price:num('ledger-price'),shipping:num('ledger-shipping'),fees:num('ledger-fees'),source:clean(val('ledger-url'),500)
  };
  if(!item.product||!item.seller||!item.date||item.price<=0)return;
  ledger.push(item);focusKey=seriesKey(item);write(ledger);$('ledger-form').reset();$('ledger-currency').value='$';$('ledger-shipping').value='0';$('ledger-fees').value='0';renderLedger();
});
$('ledger-clear')?.addEventListener('click',()=>{ledger=[];focusKey=null;write(ledger);renderLedger()});

// Tool 04 — gaming-laptop spec comparability
$('laptop-run')?.addEventListener('click',()=>{
  const fields=[
    ['SKU / model','sku','text'],['CPU','cpu','text'],['GPU','gpu','text'],['GPU power / TGP','tgp','number'],
    ['VRAM','vram','number'],['RAM','ram','number'],['Storage','storage','number'],['Display resolution','res','text'],
    ['Refresh rate','hz','number'],['Condition','condition','text'],['Warranty','warranty','number']
  ];
  const mismatches=[],missing=[];
  for(const [label,key,type] of fields){
    const a=val('lap-a-'+key),b=val('lap-b-'+key);
    if(!a||!b){missing.push(label);continue}
    const same=type==='number'?Number(a)===Number(b):a.toLowerCase()===b.toLowerCase();
    if(!same)mismatches.push(label+': '+a+' vs '+b);
  }
  const pa=num('lap-a-price'),pb=num('lap-b-price'),out=$('laptop-result');out.textContent='';
  const grid=el('div',undefined,'result-grid');
  grid.append(metric('Specification mismatches',String(mismatches.length),mismatches.length?'not like-for-like':'none detected in completed fields'),
              metric('Missing comparison fields',String(missing.length),missing.length?'evidence incomplete':'all configured fields present'),
              metric('Landed price delta',(pa>0&&pb>0)?fmt(pb-pa):'—',(pa>0&&pb>0)?'Offer B − Offer A':'enter both prices'));
  out.appendChild(grid);
  let msg;
  if(mismatches.length)msg='Not like-for-like: '+mismatches.join('; ')+'. A lower price cannot be interpreted as a better deal without normalizing these differences.';
  else if(missing.length)msg='No mismatch was detected among completed fields, but evidence is incomplete: '+missing.join(', ')+'. Matching labels alone do not prove equal performance.';
  else msg='Configured fields match. This supports price comparability, not equal real-world performance, thermals, noise, battery life, build quality or seller quality.';
  out.appendChild(el('p',msg,'fine-print'));
});

// Tool 05 — regional rights / price baseline
$('rights-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const market=val('rights-market'),channel=val('rights-channel'),problem=val('rights-problem'),daysRaw=val('rights-days'),days=daysRaw===''?null:Math.max(0,Number(daysRaw)||0),date=val('rights-date'),sale=val('rights-sale')==='yes';
  const out=$('rights-result');out.textContent='';
  let pricing='',returns='';
  if(market==='US'){
    pricing='FTC deceptive-pricing guidance rejects artificial former-price comparisons; compare exact model and total cost.';
    returns='No universal federal change-of-mind return period is inserted. Use the seller policy and applicable state law; FTC shopping guidance says check sale-item refund/return terms.';
  }else if(market==='UK'){
    pricing='CMA guidance requires the total price to include unavoidable fees, taxes and mandatory delivery/collection charges.';
    returns=channel==='online'?'Many distance purchases have a 14-day cancellation-notice baseline after receipt, then another 14 days to return, subject to exceptions.':'In-store change of mind normally depends on seller policy unless another statutory right applies.';
  }else if(market==='CA'){
    pricing='Competition Bureau ordinary-selling-price rules use legal volume/time tests; a made-up regular price can be misleading.';
    returns='Return and exchange law can vary by province/territory. No Canada-wide voluntary change-of-mind period is invented here.';
  }else if(market==='AU'){
    pricing='ACCC guidance requires clear total prices and warns against misleading former-price/RRP comparisons.';
    returns=problem==='fault'?'Consumer-guarantee remedies for faulty goods cannot be removed by a “no refunds on sale items” policy.':'Businesses generally do not have to remedy simple change of mind unless their policy says they will.';
  }else{
    pricing='For announced reductions, the EU prior-price reference is the lowest price applied in at least the previous 30 days; a 90-day research history does not replace that rule.';
    returns=channel==='online'?'Many online goods purchases have a 14-day withdrawal baseline, subject to exceptions.':'In-store change-of-mind rights are not inferred from the EU distance-sale baseline.';
  }
  const grid=el('div',undefined,'result-grid');
  grid.append(metric('Pricing baseline',market,pricing),metric('Return baseline',channel==='online'?'Distance':'In-store',returns),metric('Retailer policy deadline',days!==null&&date?fmtDate(new Date(new Date(date+'T12:00:00Z').getTime()+days*86400000).toISOString().slice(0,10)):'Not entered',days!==null?days+' day(s) from entered date':'record seller policy'));
  out.appendChild(grid);
  if(sale)out.appendChild(el('p','Sale/clearance status is recorded. It may affect a voluntary change-of-mind policy, but it does not automatically erase statutory fault/consumer-guarantee rights.','fine-print'));
});

// Date default for ledger if relevant
const ledgerDate=$('ledger-date');if(ledgerDate&&!ledgerDate.value)ledgerDate.value='2027-11-01';
renderLedger();
})();