(()=>{'use strict';
const HIST_KEY='eventv:amazon-prime-day-2027:price-history:v1';
const ANN_KEY='eventv:amazon-prime-day-2027:announcement-evidence:v1';
const $=id=>document.getElementById(id);
const val=id=>String($(id)?.value??'').trim();
const num=id=>Math.max(0,Number($(id)?.value)||0);
const clean=(s,n=300)=>String(s??'').slice(0,n);
const money=(s,n)=>s+Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
const parse=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)?new Date(v+'T12:00:00Z'):null;
const addDays=(v,n)=>{const d=parse(v);if(!d)return'';d.setUTCDate(d.getUTCDate()+Number(n||0));return d.toISOString().slice(0,10)};
const fmt=v=>{const d=parse(v);return d?new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'}).format(d):'—'};
const el=(tag,text,cls)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
const metric=(l,v,d)=>{const x=el('div');x.append(el('span',l),el('strong',v));if(d)x.append(el('small',d));return x};
const median=xs=>{if(!xs.length)return NaN;const a=xs.slice().sort((a,b)=>a-b),m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2};
const uid=()=>String(Date.now())+'-'+Math.random().toString(16).slice(2);
const read=(k)=>{try{const v=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};

// Membership break-even
$('membership-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const cur=clean(val('mem-cur'),8),membership=num('mem-cost'),itemSave=num('mem-item-save'),shipSave=num('mem-ship-save'),otherSave=num('mem-other-save'),alt=num('mem-alt-cost'),prime=num('mem-prime-cost'),sunk=val('mem-sunk')==='yes';
  const verified=itemSave+shipSave+otherSave;
  const incremental=sunk?0:membership;
  const net=verified-incremental;
  const pathDelta=(prime+incremental)-alt;
  const out=$('membership-result');out.textContent='';
  const grid=el('div',undefined,'result-grid');
  grid.append(metric('Verified benefit value',money(cur,verified),'item + delivery + benefits you would buy anyway'),metric('Incremental membership cost',money(cur,incremental),sunk?'treated as sunk cost':'allocated to this decision period'),metric('Benefit − membership',(net>=0?'+':'')+money(cur,net),net>=0?'break-even reached on entered benefits':'not yet recovered'));
  out.appendChild(grid);
  if(alt>0||prime>0)out.appendChild(el('p','Entered Prime shopping path including allocated membership is '+money(cur,prime+incremental)+' vs alternative '+money(cur,alt)+'. Difference: '+(pathDelta>=0?'+':'')+money(cur,pathDelta)+'.','fine-print'));
  out.appendChild(el('p','Do not count entertainment, shipping or other Prime benefits as savings unless you would otherwise have paid for a comparable benefit during the same period.','fine-print'));
});

// Price history ledger
let hist=read(HIST_KEY),focus=null;
const seriesKey=x=>[x.sku.toLowerCase(),x.market,x.seller.toLowerCase(),x.condition,x.cur].join('|');
const landed=x=>Number(x.price)+Number(x.ship)+Number(x.fees);
if(hist.length)focus=seriesKey(hist[hist.length-1]);
function renderHist(){
  const list=$('history-list'),analysis=$('history-analysis');if(!list||!analysis)return;list.textContent='';
  hist.slice().sort((a,b)=>(b.date+b.sku).localeCompare(a.date+a.sku)).forEach(item=>{
    const card=el('article',undefined,'ledger-card'),head=el('header'),left=el('div');
    left.append(el('h3',item.sku),el('small',item.market+' · '+item.seller+' · '+item.condition+' · '+fmt(item.date)));
    const rm=el('button','Remove','remove-btn');rm.type='button';rm.addEventListener('click',()=>{hist=hist.filter(x=>x.id!==item.id);write(HIST_KEY,hist);if(!hist.some(x=>seriesKey(x)===focus))focus=hist.length?seriesKey(hist[hist.length-1]):null;renderHist()});
    head.append(left,rm);card.appendChild(head);
    const meta=el('div',undefined,'meta');[item.cur+money('',item.price),'landed '+item.cur+money('',landed(item)),'Prime-only: '+item.prime].forEach(t=>meta.appendChild(el('span',t)));card.appendChild(meta);
    if(item.source)card.appendChild(el('p','Evidence: '+item.source,'fine-print'));
    list.appendChild(card);
  });
  if(!hist.length)list.appendChild(el('p','No price observations saved on this device.','fine-print'));
  const s=focus?hist.filter(x=>seriesKey(x)===focus):[];
  const today='2027-12-31';
  const low365=s.length?Math.min(...s.map(landed)):NaN;
  const cutoff=new Date(today+'T12:00:00Z');cutoff.setUTCDate(cutoff.getUTCDate()-30);const cut=cutoff.toISOString().slice(0,10);
  const s30=s.filter(x=>x.date>=cut&&x.date<=today);
  const low30=s30.length?Math.min(...s30.map(landed)):NaN;
  const med=s.length?median(s.map(landed)):NaN;
  const cur=s[0]?.cur||'';
  [['hist-count',String(s.length)],['hist-low365',Number.isFinite(low365)?cur+money('',low365):'—'],['hist-low30',Number.isFinite(low30)?cur+money('',low30):'—'],['hist-median',Number.isFinite(med)?cur+money('',med):'—']].forEach(([id,v])=>{if($(id))$(id).textContent=v});
  analysis.textContent=s.length?'Focused series: '+s[0].sku+' · '+s[0].market+' · '+s[0].seller+' · '+s[0].condition+'. '+s.length+' observation(s). Sparse personal observations are not a continuous marketplace price history or legal-compliance finding.':'No exact-series evidence saved.';
}
$('history-form')?.addEventListener('submit',e=>{
 e.preventDefault();const item={id:uid(),sku:val('hist-sku'),market:val('hist-market'),seller:val('hist-seller'),condition:val('hist-condition'),cur:clean(val('hist-cur'),8),date:val('hist-date'),price:num('hist-price'),ship:num('hist-ship'),fees:num('hist-fees'),prime:val('hist-prime'),source:clean(val('hist-source'),500)};
 if(!item.sku||!item.seller||!item.date||item.price<=0)return;hist.push(item);focus=seriesKey(item);write(HIST_KEY,hist);$('history-form').reset();$('hist-cur').value='$';$('hist-ship').value='0';$('hist-fees').value='0';renderHist();
});
$('hist-clear')?.addEventListener('click',()=>{hist=[];focus=null;write(HIST_KEY,hist);renderHist()});

// Landed cost
$('cost-run')?.addEventListener('click',()=>{
 const total=p=>num(p+'-item')+num(p+'-member')+num(p+'-ship')+num(p+'-fees')+num(p+'-return');
 const a=total('a'),b=total('b'),d=a-b,out=$('cost-result');out.textContent='';
 const grid=el('div',undefined,'result-grid');grid.append(metric('Prime/Amazon path',money('',a),'all entered costs'),metric('Alternative path',money('',b),'all entered costs'),metric('Prime − alternative',(d>=0?'+':'')+money('',d),d>0?'alternative lower entered cost':d<0?'Prime path lower entered cost':'equal'));out.appendChild(grid);
 out.appendChild(el('p','This arithmetic does not score delivery reliability, warranty, counterfeit risk, return convenience, card rewards or product equivalence.','fine-print'));
});

// Returns
$('return-form')?.addEventListener('submit',e=>{
 e.preventDefault();const market=val('ret-market'),seller=val('ret-seller'),delivery=val('ret-delivery'),days=num('ret-days'),cost=num('ret-cost'),exception=val('ret-exception'),source=val('ret-source'),out=$('return-result');out.textContent='';
 if(!seller||!delivery||!source)return;
 const last=addDays(delivery,days);const grid=el('div',undefined,'result-grid');grid.append(metric('Policy deadline',fmt(last),days+' day(s) from entered delivery'),metric('Return shipping',money('',cost),'entered exposure'),metric('Marketplace',market,seller));out.appendChild(grid);
 let p='Policy source/evidence: '+source+'.';if(exception)p+=' Exception note: '+exception+'.';p+=' This is voluntary-policy arithmetic only; statutory rights and eligibility can override or differ.';
 out.appendChild(el('p',p,'fine-print'));
});

// Announcement gate
let anns=read(ANN_KEY);
function renderAnn(){
 const list=$('announce-list'),result=$('announce-result');if(!list||!result)return;list.textContent='';
 let verified=0;
 anns.forEach(item=>{
   const valid=item.status==='announced'&&/^https?:\/\//i.test(item.source)&&item.start&&item.end;
   if(valid)verified++;
   const card=el('article',undefined,'ledger-card');const head=el('header'),left=el('div');left.append(el('h3',item.market),el('small',(valid?'PUBLISHABLE EVIDENCE':'NOT PUBLISHABLE')+' · checked '+(item.checked?fmt(item.checked):'—')));
   const rm=el('button','Remove','remove-btn');rm.type='button';rm.addEventListener('click',()=>{anns=anns.filter(x=>x.id!==item.id);write(ANN_KEY,anns);renderAnn()});head.append(left,rm);card.appendChild(head);
   const meta=el('div',undefined,'meta');[item.status,item.start&&item.end?fmt(item.start)+' → '+fmt(item.end):'no verified date',item.source||'no source'].forEach(t=>meta.appendChild(el('span',t)));card.appendChild(meta);list.appendChild(card);
 });
 if(!anns.length)list.appendChild(el('p','No 2027 Amazon-owned announcement evidence saved.','fine-print'));
 result.textContent=verified+' marketplace announcement record(s) currently satisfy the local publication gate. This does not update EventV automatically.';
}
$('announce-form')?.addEventListener('submit',e=>{
 e.preventDefault();const item={id:uid(),market:val('ann-market'),status:val('ann-status'),start:val('ann-start'),end:val('ann-end'),source:clean(val('ann-source'),500),checked:val('ann-checked')};
 if(item.status==='unannounced'){item.start='';item.end='';}
 if(item.status==='announced'&&(!item.start||!item.end||!/^https?:\/\//i.test(item.source))){$('announce-result').textContent='Official-announcement status requires explicit start/end dates and an Amazon-owned announcement URL.';return}
 anns.push(item);write(ANN_KEY,anns);$('announce-form').reset();renderAnn();
});
$('ann-clear')?.addEventListener('click',()=>{anns=[];write(ANN_KEY,anns);renderAnn()});

if($('hist-date')&&!$('hist-date').value)$('hist-date').value='2026-11-07';
if($('ann-checked')&&!$('ann-checked').value)$('ann-checked').value='2026-11-07';
renderHist();renderAnn();
})();