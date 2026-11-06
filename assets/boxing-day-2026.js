(() => {
'use strict';
const OPS_KEY='eventv:boxing-day-2026:operations:v1';
const $=id=>document.getElementById(id);
const num=id=>Math.max(0,Number($(id)?.value)||0);
const read=()=>{try{const v=JSON.parse(localStorage.getItem(OPS_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
const write=v=>{try{localStorage.setItem(OPS_KEY,JSON.stringify(v))}catch{}};
const uid=()=>String(Date.now())+'-'+Math.random().toString(16).slice(2);
const addDays=(iso,days)=>{if(!iso)return'';const d=new Date(iso+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+Number(days||0));return d.toISOString().slice(0,10)};
const diffDays=(a,b)=>{if(!a||!b)return NaN;return Math.round((new Date(b+'T12:00:00Z')-new Date(a+'T12:00:00Z'))/86400000)};
const fmtDate=iso=>iso?new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'}).format(new Date(iso+'T12:00:00Z')):'—';
const money=(s,v)=>s+(Number.isFinite(v)?v.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}):'—');
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e};
const metric=(label,value,detail)=>{const d=el('div');d.append(el('span',label),el('strong',value));if(detail)d.append(el('small',detail));return d};

const HOLIDAYS={
  UK:{actual:'2026-12-26',observed:'2026-12-28',label:'UK substitute bank holiday',scope:'GOV.UK lists Monday 28 Dec as the Boxing Day substitute bank holiday. This is a bank-holiday treatment, not proof that a specific shop or route is closed.'},
  'CA-FED':{actual:'2026-12-26',observed:'varies by scheduled work day',label:'Federally regulated employment',scope:'Canada Labour Code federal standards include Boxing Day as a general holiday. If it falls on a weekend non-work day, the paid holiday is on the scheduled work day immediately before or after. This applies only to federally regulated workplaces.'},
  'CA-ON':{actual:'2026-12-26',observed:'employment rules apply',label:'Ontario public holiday',scope:'Ontario lists Boxing Day as a public holiday. Its current province-wide mandatory retail-closure list does not include Boxing Day; municipal rules and retailer hours still require checking.'},
  'AU-NSW':{actual:'2026-12-26',observed:'2026-12-28 additional public holiday',label:'NSW',scope:'Fair Work lists Sat 26 Dec Boxing Day plus Mon 28 Dec additional public holiday.'},
  'AU-VIC':{actual:'2026-12-26',observed:'2026-12-28 additional public holiday',label:'Victoria',scope:'Fair Work lists Sat 26 Dec Boxing Day plus Mon 28 Dec additional public holiday.'},
  'AU-QLD':{actual:'2026-12-26',observed:'2026-12-28 additional public holiday',label:'Queensland',scope:'Fair Work lists Sat 26 Dec Boxing Day plus Mon 28 Dec additional public holiday.'},
  'AU-WA':{actual:'2026-12-26',observed:'2026-12-28 additional public holiday',label:'Western Australia',scope:'Fair Work lists Sat 26 Dec Boxing Day plus Mon 28 Dec additional public holiday.'},
  'AU-TAS':{actual:'2026-12-26',observed:'2026-12-28',label:'Tasmania',scope:'Fair Work lists Mon 28 Dec as Boxing Day in Tasmania for 2026 rather than the common Dec 26 + additional-holiday pattern.'},
  'AU-SA':{actual:'2026-12-26',observed:'2026-12-28 additional public holiday',label:'South Australia',scope:'Fair Work labels Sat 26 Dec Proclamation Day holiday and Mon 28 Dec an additional public holiday; do not relabel SA as if it used the same Boxing Day wording as other states.'},
  NZ:{actual:'2026-12-26',observed:'2026-12-28',label:'New Zealand observed day',scope:'NZ Government lists Boxing Day actual Sat 26 Dec and observed Mon 28 Dec. Employment New Zealand explains the observed day depends on whether the employee would otherwise work the weekend day.'}
};
const holidayForm=$('holiday-form');
if(holidayForm)holidayForm.addEventListener('submit',e=>{
  e.preventDefault();
  const key=$('holiday-market').value,use=$('holiday-use').value,h=HOLIDAYS[key],out=$('holiday-result');out.textContent='';
  const grid=el('div',undefined,'result-grid');
  grid.append(metric('Actual calendar date',fmtDate(h.actual),'Boxing Day itself'),
              metric('Observed / substitute',/^2026/.test(h.observed)?fmtDate(h.observed):h.observed,h.label),
              metric('Planning use',use,'requires separate operational evidence'));
  out.appendChild(grid);
  out.appendChild(el('p',h.scope,'legal-note'));
  out.appendChild(el('p','Do not infer store hours, delivery service or transit frequency from this holiday status alone.','legal-note'));
});

const returnForm=$('return-form');
if(returnForm)returnForm.addEventListener('submit',e=>{
  e.preventDefault();
  const market=$('return-market').value,channel=$('return-channel').value,purchase=$('return-purchase').value,delivery=$('return-delivery').value;
  const raw=$('return-policy-days').value.trim(),policyDays=raw===''?null:Math.max(0,Number(raw)||0);
  const policyFrom=$('return-policy-from').value==='delivery'?delivery:purchase,problem=$('return-problem').value,sale=$('return-sale').value==='yes';
  const out=$('return-result');out.textContent='';
  let statutory='No general change-of-mind period inserted',detail='';
  if(market==='UK'&&channel==='online'&&problem==='mind'){
    const notify=addDays(delivery,14);
    statutory='Notify by '+fmtDate(notify);
    detail='Many UK distance-sale buyers can notify cancellation within 14 days of receipt, then have another 14 days to return after notifying; exceptions apply.';
  }else if(market==='UK'&&problem==='fault'){
    statutory='Fault/remedy path applies';
    detail='UK guidance says sale items have the same rights to refunds for faults as full-price items. Exact remedy depends on the defect and timing.';
  }else if(market==='CA-ON'&&problem==='mind'){
    detail='Ontario guidance says there is no general legal right to return or exchange goods; the seller policy and specific contract/statutory circumstances control.';
  }else if(market==='AU'&&problem==='mind'){
    detail='Australian Consumer Law does not require a remedy merely for change of mind; a business that offers a change-of-mind policy must follow it.';
  }else if(market==='NZ'&&problem==='mind'){
    detail='New Zealand guidance says a business usually does not have to accept a change-of-mind return unless its policy allows it.';
  }else{
    statutory='Consumer-guarantee / fault path';
    detail=market==='CA-ON'?'Ontario-specific statutory remedies can apply in defined circumstances such as misrepresentation; this tool does not reduce those to a single return-day count.'
      :market==='AU'?'Australian consumer guarantees remain separate from voluntary change-of-mind policies.'
      :market==='NZ'?'New Zealand Consumer Guarantees Act remedies remain separate from voluntary change-of-mind policies.'
      :'Faulty/not-as-described rights are distinct from voluntary change-of-mind policies.';
  }
  const policyDeadline=policyDays===null?'Not entered':fmtDate(addDays(policyFrom,policyDays));
  const grid=el('div',undefined,'result-grid');
  grid.append(metric('Retailer policy deadline',policyDeadline,policyDays===null?'check seller terms':policyDays+' day(s) from '+$('return-policy-from').value),
              metric('Statutory baseline',statutory,market),
              metric('Sale-item flag',sale?'Sale / discounted':'Not marked sale',sale&&problem==='fault'?'sale status does not erase fault rights':'policy still needs checking'));
  out.appendChild(grid);out.appendChild(el('p',detail,'legal-note'));
  if(market==='UK'&&channel==='online'&&problem==='mind')out.appendChild(el('p','Simplified illustration: if notice is sent on the last baseline day, another 14 days would reach '+fmtDate(addDays(addDays(delivery,14),14))+'. Do not treat that as a universal deadline for excluded goods.','legal-note'));
});

const deliveryForm=$('delivery-form');
if(deliveryForm)deliveryForm.addEventListener('submit',e=>{
  e.preventDefault();
  const market=$('delivery-market').value,order=$('delivery-order').value,promised=$('delivery-promised').value,needed=$('delivery-needed').value,blackout=num('delivery-blackout'),seller=$('delivery-seller').value==='yes';
  const out=$('delivery-result');out.textContent='';
  const baselineDate=promised||(market==='UK'?addDays(order,30):'');
  const slack=baselineDate?diffDays(baselineDate,needed):NaN;
  const adjusted=Number.isFinite(slack)?slack-blackout:NaN;
  const grid=el('div',undefined,'result-grid');
  grid.append(metric('Delivery baseline',baselineDate?fmtDate(baselineDate):'No fixed date modeled',promised?'seller promise':'market-specific default/none'),
              metric('Calendar slack',Number.isFinite(slack)?slack+' day(s)':'—','baseline → needed-by'),
              metric('Slack after entered non-service days',Number.isFinite(adjusted)?adjusted+' day(s)':'—',blackout+' user-entered blackout day(s)'));
  out.appendChild(grid);
  let note='';
  if(market==='UK')note=promised?'An agreed delivery date can matter directly.':'UK Consumer Rights Act default used here: without an agreed time, delivery must be without undue delay and in any event within 30 days.';
  if(market==='CA-ON')note=promised?'Ontario guidance says if a product is not delivered within 30 days of the promised delivery date, the consumer can ask for a refund, subject to the cited provincial framework.':'No Ontario default delivery date is invented here; record the seller promise when one exists.';
  if(market==='NZ')note='For a business seller, New Zealand guidance says goods must arrive on time or within a reasonable time if no date was agreed; seller-arranged delivery remains the seller’s responsibility.';
  if(market==='AU')note='Australian online purchases retain normal consumer guarantees, but this hub does not invent one national statutory delivery-day number.';
  if(!seller)note+=' Because you arranged the carrier yourself, responsibility can differ from seller-arranged delivery; review the carrier contract.';
  out.appendChild(el('p',note,'legal-note'));
  if(Number.isFinite(adjusted)&&adjusted<0)out.appendChild(el('p','Your modeled delivery baseline is '+Math.abs(adjusted)+' day(s) beyond the needed-by date after the non-service days you entered.','legal-note'));
});

let ops=read();
function renderOps(){
  const out=$('ops-list');if(!out)return;out.textContent='';
  ops.slice().sort((a,b)=>(a.date+a.name).localeCompare(b.date+b.name)).forEach(item=>{
    const card=el('article',undefined,'ops-card'),head=el('header'),left=el('div');
    left.append(el('h3',item.name),el('small',item.type+' · '+item.market+' · '+fmtDate(item.date)));
    const rm=el('button','Remove','remove-btn');rm.type='button';rm.addEventListener('click',()=>{ops=ops.filter(x=>x.id!==item.id);write(ops);renderOps()});
    head.append(left,rm);card.appendChild(head);
    const meta=el('div',undefined,'meta');[item.status,item.start&&item.end?item.start+'–'+item.end:item.start?'from '+item.start:item.end?'until '+item.end:'hours not entered'].forEach(v=>meta.appendChild(el('span',v)));card.appendChild(meta);
    const p=el('p','Evidence: ','privacy-note');
    if(/^https?:\/\//i.test(item.source)){const a=el('a','Open official source');a.href=item.source;a.target='_blank';a.rel='noopener noreferrer';p.appendChild(a)} else p.append(document.createTextNode(item.source));
    card.appendChild(p);out.appendChild(card);
  });
  if(!ops.length)out.appendChild(el('p','No operational evidence saved yet.','empty'));
}
const opsForm=$('ops-form');
if(opsForm)opsForm.addEventListener('submit',e=>{
  e.preventDefault();
  ops.push({id:uid(),type:$('ops-type').value,market:$('ops-market').value,name:$('ops-name').value.trim(),date:$('ops-date').value,status:$('ops-status').value,start:$('ops-start').value,end:$('ops-end').value,source:$('ops-source').value.trim()});
  write(ops);opsForm.reset();$('ops-date').value='2026-12-26';renderOps();
});
if($('ops-clear'))$('ops-clear').addEventListener('click',()=>{ops=[];write(ops);renderOps()});

const channelForm=$('channel-form');
if(channelForm)channelForm.addEventListener('submit',e=>{
  e.preventDefault();
  const s=$('channel-currency').value||'',online=num('channel-online'),store=num('channel-store'),shipping=num('channel-shipping'),ret=num('channel-return'),travel=num('channel-travel'),hours=num('channel-hours'),time=num('channel-time-value'),same=$('channel-same').value==='yes';
  const onlineTotal=online+shipping+ret,storeTotal=store+travel+(hours*time),delta=storeTotal-onlineTotal,out=$('channel-result');out.textContent='';
  const grid=el('div',undefined,'result-grid');
  grid.append(metric('Online modeled total',money(s,onlineTotal),'item + shipping + return-postage exposure'),
              metric('Store modeled total',money(s,storeTotal),'item + travel/parking + time value'),
              metric('Store − online',(delta>=0?'+':'')+money(s,delta),delta>0?'online lower in this model':delta<0?'store lower in this model':'equal'));
  out.appendChild(grid);
  out.appendChild(el('p',same?'The arithmetic compares the same SKU/condition according to your input. Return rights, stock certainty and pickup risk are still separate.':'The SKU/condition is not confirmed identical, so the cost difference is not a valid like-for-like deal comparison.','legal-note'));
});

renderOps();
})();