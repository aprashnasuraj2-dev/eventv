(() => {
'use strict';
const HISTORY_KEY='eventv:black-friday-2026:price-history:v1';
const $=id=>document.getElementById(id);
const num=id=>Math.max(0,Number($(id)?.value)||0);
const money=n=>Number.isFinite(n)?n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}):'—';
const pct=n=>Number.isFinite(n)?n.toFixed(1)+'%':'—';
const read=key=>{try{const x=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
const write=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val))}catch{}};
const uid=()=>String(Date.now())+'-'+Math.random().toString(16).slice(2);
const addDays=(iso,days)=>{if(!iso)return'';const d=new Date(iso+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+Number(days||0));return d.toISOString().slice(0,10)};
const fmtDate=iso=>{if(!iso)return'—';return new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'}).format(new Date(iso+'T12:00:00Z'))};
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const meta=(parent,text)=>parent.appendChild(el('span',text));
const setVerdict=(kind,title,body)=>{
  const out=$('deal-verdict');if(!out)return;out.className='verdict '+kind;out.textContent='';
  out.append(el('strong',title),el('p',body));
};

const dealForm=$('deal-form');
if(dealForm){
  dealForm.addEventListener('submit',e=>{
    e.preventDefault();
    const reference=num('deal-reference'), current=num('deal-current'), baseline=num('deal-baseline');
    const coupon=Math.min(current,num('deal-coupon')), shipping=num('deal-shipping'), fees=num('deal-fees'), tax=num('deal-tax');
    const netItem=Math.max(0,current-coupon), landed=netItem+shipping+fees+tax;
    const advertised=reference>0?((reference-current)/reference)*100:NaN;
    const verified=baseline>0?((baseline-netItem)/baseline)*100:NaN;
    const delta=baseline-landed;
    const boxes=Array.from($('deal-results').children);
    const vals=[pct(advertised),pct(verified),money(landed),(delta>=0?'+':'')+money(delta)];
    boxes.forEach((box,i)=>box.querySelector('strong').textContent=vals[i]);
    const source=$('deal-source').value.trim();
    const market=$('deal-market').value;
    const baselineType=$('deal-baseline-type').value;
    const warnings=[];
    if(!source)warnings.push('no baseline evidence URL/note recorded');
    if(reference<=0)warnings.push('no advertised reference price entered');
    if(reference>0&&baseline>0&&advertised-verified>=10)warnings.push('headline discount exceeds your verified discount by '+(advertised-verified).toFixed(1)+' percentage points');
    if(landed>baseline)warnings.push('your landed cost is '+money(landed-baseline)+' above the item-price baseline');
    if(market==='DE'&&baselineType!=='Lowest observed in last 30 days')warnings.push('Germany/EU announced-reduction checks may require the legally relevant prior-price reference; your selected baseline is not labelled a 30-day low');
    if(netItem>baseline)warnings.push('the post-coupon item price is above your verified baseline');
    const regionNote={
      US:'U.S. federal guidance rejects fictitious former-price comparisons; this arithmetic cannot prove whether the seller’s former price was bona fide.',
      UK:'UK pricing guidance focuses on clear, complete consumer prices; this arithmetic does not determine compliance or statutory rights.',
      CA:'Canada’s ordinary-selling-price rules use legal volume/time tests; your personal baseline is evidence for shopping, not a Competition Act finding.',
      AU:'Australian guidance rejects misleading comparison prices and incomplete total pricing; this calculator does not determine ACL compliance.',
      DE:'EU price-reduction rules use a specific prior-price concept for announced reductions; this tool does not make a legal compliance finding.',
      OTHER:'Local pricing and return law may differ; treat this as arithmetic only.'
    }[market];
    if(warnings.length){
      setVerdict(warnings.some(x=>x.includes('above'))?'bad':'warn','Evidence gaps / adverse arithmetic: '+warnings.join('; ')+'.',regionNote);
    }else{
      setVerdict('good','The arithmetic is internally consistent with the values you entered.',regionNote+' Keep the dated source because the quality of the conclusion depends on the quality of the baseline.');
    }
  });
  dealForm.addEventListener('reset',()=>setTimeout(()=>{
    Array.from($('deal-results').children).forEach(b=>b.querySelector('strong').textContent='—');
    setVerdict('neutral','Enter a deal to separate marketing math from your evidence.','No recommendation is generated; the tool reports arithmetic and missing evidence.');
  },0));
}

let history=read(HISTORY_KEY);
const seriesKey=x=>[x.product.trim().toLowerCase(),x.seller.trim().toLowerCase(),x.market,x.condition].join('|');
let focusKey=history.length?seriesKey(history[history.length-1]):null;

function renderHistory(){
  const list=$('history-list'),summary=$('history-summary');if(!list||!summary)return;
  list.textContent='';
  const sorted=history.slice().sort((a,b)=>(b.date+a.product).localeCompare(a.date+b.product));
  sorted.forEach(item=>{
    const card=el('article',undefined,'snapshot-card');
    const head=el('header'),left=el('div');
    left.append(el('h3',item.product),el('small',item.seller+' · '+fmtDate(item.date)));
    const rm=el('button','Remove','remove-btn');rm.type='button';
    rm.addEventListener('click',()=>{
      history=history.filter(x=>x.id!==item.id);write(HISTORY_KEY,history);
      if(!history.some(x=>seriesKey(x)===focusKey))focusKey=history.length?seriesKey(history[history.length-1]):null;
      renderHistory();
    });
    head.append(left,rm);card.appendChild(head);
    const m=el('div',undefined,'meta');
    [item.market,item.condition,item.checkpoint,'item '+money(item.price),'landed '+money(item.price+item.extra)].forEach(v=>meta(m,v));
    card.appendChild(m);
    if(item.source){
      const p=el('p','Evidence: ','privacy-note');
      if(/^https?:\/\//i.test(item.source)){const a=el('a','Open source');a.href=item.source;a.target='_blank';a.rel='noopener noreferrer';p.appendChild(a)}
      else p.append(document.createTextNode(item.source));
      card.appendChild(p);
    }
    list.appendChild(card);
  });
  if(!sorted.length)list.appendChild(el('p','No price snapshots saved on this device.','empty'));

  const series=focusKey?history.filter(x=>seriesKey(x)===focusKey):[];
  const landed=series.map(x=>x.price+x.extra);
  const low=landed.length?Math.min(...landed):NaN;
  const bf=series.filter(x=>x.checkpoint==='Black Friday — Nov 27').sort((a,b)=>b.date.localeCompare(a.date))[0];
  const cm=series.filter(x=>x.checkpoint==='Cyber Monday — Nov 30').sort((a,b)=>b.date.localeCompare(a.date))[0];
  const vals=[series.length,Number.isFinite(low)?money(low):'—',bf?money(bf.price+bf.extra):'—',cm?money(cm.price+cm.extra):'—'];
  Array.from(summary.children).forEach((box,i)=>box.querySelector('strong').textContent=String(vals[i]));
  summary.title=series.length?'Focused series: '+series[0].product+' · '+series[0].seller+' · '+series[0].market+' · '+series[0].condition:'No focused price series';
}
const historyForm=$('history-form');
if(historyForm){
  const date=$('history-date');
  if(date&&!date.value){
    const now=new Date();const y=now.getFullYear(),m=String(now.getMonth()+1).padStart(2,'0'),d=String(now.getDate()).padStart(2,'0');
    const local=y+'-'+m+'-'+d;if(local>='2026-10-01'&&local<='2026-12-31')date.value=local;
  }
  historyForm.addEventListener('submit',e=>{
    e.preventDefault();
    const item={
      id:uid(),product:$('history-product').value.trim(),seller:$('history-seller').value.trim(),
      market:$('history-market').value,condition:$('history-condition').value,date:$('history-date').value,
      checkpoint:$('history-checkpoint').value,price:num('history-price'),extra:num('history-extra'),source:$('history-source').value.trim()
    };
    history.push(item);focusKey=seriesKey(item);write(HISTORY_KEY,history);
    historyForm.reset();$('history-extra').value='0';renderHistory();
  });
}
if($('history-clear'))$('history-clear').addEventListener('click',()=>{history=[];focusKey=null;write(HISTORY_KEY,history);renderHistory()});

const returnForm=$('return-form');
if(returnForm)returnForm.addEventListener('submit',e=>{
  e.preventDefault();
  const market=$('return-market').value,channel=$('return-channel').value,delivery=$('return-date').value;
  const daysRaw=$('return-days').value.trim(),policyDays=daysRaw===''?null:Math.max(0,Number(daysRaw)||0);
  const purchase=$('return-purchase').value,from=$('return-from').value;
  const base=from==='purchase'?(purchase||delivery):delivery;
  const retailerDeadline=policyDays===null?'Not entered':fmtDate(addDays(base,policyDays));
  const out=$('return-result');out.textContent='';
  let statutory='No general baseline inserted';
  let second='';
  let note='';
  if(channel==='online'&&(market==='UK'||market==='DE')){
    const cancel=addDays(delivery,14);
    statutory=fmtDate(cancel);
    second='If notice/withdrawal is made on that last baseline day, +14 days gives '+fmtDate(addDays(cancel,14))+' as a simplified latest-send-back illustration.';
    note=market==='UK'?'GOV.UK states many distance-sale buyers can notify cancellation within 14 days of receipt and then have another 14 days to return. Exceptions apply.':'EU rules generally give 14 days from delivery to withdraw from a distance sale, subject to exceptions; return obligations then follow.';
  }else if(market==='AU'){
    note='ACCC says businesses generally do not have to provide a remedy merely because a customer changed their mind, unless the business has such a policy. Faulty-goods consumer guarantees are separate.';
  }else if(market==='US'){
    note='FTC shopping guidance tells buyers to check the seller’s refund policy, including return days, shipping and restocking fees. This tool does not invent a federal change-of-mind deadline.';
  }else if(market==='CA'){
    note='Canadian federal shopping guidance says to review the seller’s shipping, complaints, return and exchange terms; provincial or territorial rules can matter.';
  }else{
    note='Check the seller contract and applicable local consumer law.';
  }
  const grid=el('div',undefined,'return-grid');
  [['Retailer policy deadline',retailerDeadline],['General online cancellation/withdrawal baseline',statutory],['Receipt date',fmtDate(delivery)]].forEach(([a,b])=>{
    const d=el('div');d.append(el('span',a),el('strong',b));grid.appendChild(d);
  });
  out.appendChild(grid);
  if(second)out.appendChild(el('p',second,'legal-note'));
  out.appendChild(el('p',note,'legal-note'));
});

const conditionForm=$('condition-form');
if(conditionForm)conditionForm.addEventListener('submit',e=>{
  e.preventDefault();
  const n=num('condition-new'),r=num('condition-refurb'),nw=num('condition-new-warranty'),rw=num('condition-refurb-warranty');
  const seller=$('condition-seller').value,parts=$('condition-parts').value,same=$('condition-model').value==='yes';
  const returnDays=$('condition-return').value.trim()===''?null:num('condition-return');
  const saving=((n-r)/n)*100,wdelta=rw-nw;
  const gaps=[];
  if(!same)gaps.push('exact model/capacity is not confirmed');
  if(parts==='unknown')gaps.push('battery/wear-parts status is unknown');
  if(parts==='partial')gaps.push('battery/wear-parts evidence is partial');
  if(rw<nw)gaps.push('refurb warranty is '+Math.abs(wdelta)+' months shorter');
  if(returnDays===null||returnDays===0)gaps.push('no meaningful refurb return window was entered');
  if(seller==='third')gaps.push('independent third-party refurbisher: verify who provides warranty and returns');
  if(seller==='private')gaps.push('private seller: consumer-law coverage can differ materially from professional-trader sales');
  const out=$('condition-result');out.textContent='';
  const grid=el('div',undefined,'condition-grid');
  [['Refurb price delta',pct(saving)],['Warranty delta',(wdelta>=0?'+':'')+wdelta+' mo'],['Evidence gaps',String(gaps.length)]].forEach(([a,b])=>{
    const d=el('div');d.append(el('span',a),el('strong',b));grid.appendChild(d);
  });
  out.appendChild(grid);
  out.appendChild(el('p',gaps.length?'Check before comparing: '+gaps.join('; ')+'.':'No configured evidence gap was triggered. That still does not prove equal condition, durability or seller quality.','legal-note'));
});

const thresholdForm=$('threshold-form');
if(thresholdForm)thresholdForm.addEventListener('submit',e=>{
  e.preventDefault();
  const target=num('threshold-target'),current=num('threshold-current'),minW=num('threshold-warranty'),curW=num('threshold-current-warranty'),hasReturn=$('threshold-return').value==='yes';
  const checks=[
    {name:'Landed-cost threshold',ok:current<=target,detail:current<=target?money(target-current)+' below/equal to your ceiling':money(current-target)+' above your ceiling'},
    {name:'Warranty threshold',ok:curW>=minW,detail:curW+' months current vs '+minW+' months minimum'},
    {name:'Return-policy evidence',ok:hasReturn,detail:hasReturn?'recorded':'missing / unclear'}
  ];
  const out=$('threshold-result');out.textContent='';
  const grid=el('div',undefined,'threshold-grid');
  checks.forEach(c=>{const d=el('div');d.append(el('span',c.name),el('strong',c.ok?'PASS':'FAIL'),el('small',c.detail));grid.appendChild(d)});
  out.appendChild(grid);
  const passed=checks.filter(c=>c.ok).length;
  out.appendChild(el('p',passed+'/3 of your preset conditions are satisfied. This is a threshold check, not a recommendation to buy or wait.','legal-note'));
});

renderHistory();
})();