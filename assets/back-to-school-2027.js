(()=>{'use strict';
const $=id=>document.getElementById(id);
const clean=(s,n=300)=>String(s??'').slice(0,n);
const n=id=>Math.max(0,Number($(id)?.value)||0);
const val=id=>String($(id)?.value??'').trim();
const day=86400000;
const d=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)?new Date(v+'T12:00:00Z'):null;
const fd=x=>x?new Intl.DateTimeFormat('en-US',{timeZone:'UTC',weekday:'short',year:'numeric',month:'short',day:'numeric'}).format(x):'—';
const money=(cur,x)=>String(cur||'')+Number(x).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
const uid=()=>String(Date.now())+'-'+Math.random().toString(16).slice(2);
const read=k=>{try{const x=JSON.parse(localStorage.getItem(k)||'[]');return Array.isArray(x)?x:[]}catch{return[]}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const el=(tag,text,cls)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x};
const metric=(label,value,detail)=>{const x=el('div');x.append(el('span',label),el('strong',value));if(detail)x.append(el('small',detail));return x};
const addDays=(iso,days)=>{const x=d(iso);if(!x)return'';x.setUTCDate(x.getUTCDate()+Number(days||0));return x.toISOString().slice(0,10)};

// 01 — school-calendar evidence + purchase buffer
const CAL_KEY='eventv:bts-2027:calendar-evidence:v2';
const presets={
  portsmouth:{date:'2027-09-01',name:'Portsmouth maintained schools',source:'https://www.portsmouth.gov.uk/services/schools-and-learning/schools/school-term-dates'},
  oxfordshire:{date:'2027-09-06',name:'Oxfordshire County Council',source:'https://www.oxfordshire.gov.uk/schools/term-dates-and-holidays'},
  leicestershire:{date:'2027-08-25',name:'Leicestershire County Council',source:'https://www.leicestershire.gov.uk/education-and-children/schools-colleges-and-academies/school-term-dates'},
  nsw:{date:'2027-07-20',name:'NSW Term 3 student start',source:'https://education.nsw.gov.au/schooling/calendars/2027'},
  qld:{date:'2027-07-12',name:'Queensland Term 3',source:'https://education.qld.gov.au/about-us/calendar/future-dates'}
};
let calendars=read(CAL_KEY).slice(0,100);
$('calendar-preset')?.addEventListener('change',()=>{
  const p=presets[val('calendar-preset')];
  if(p){$('school-date').value=p.date;$('calendar-name').value=p.name;$('calendar-source').value=p.source}
  else{$('school-date').value='';$('calendar-name').value='';$('calendar-source').value=''}
});
function renderCalendars(){
  const list=$('calendar-list');if(!list)return;list.textContent='';
  calendars.slice().sort((a,b)=>b.saved.localeCompare(a.saved)).forEach(item=>{
    const card=el('article',undefined,'entry-card'),head=el('div',undefined,'entry-head');
    head.append(el('h3',item.name),(()=>{const b=el('button','Remove');b.type='button';b.addEventListener('click',()=>{calendars=calendars.filter(x=>x.id!==item.id);write(CAL_KEY,calendars);renderCalendars()});return b})());
    const tags=el('div',undefined,'entry-tags');
    [item.date,item.complete,item.buffer+' day buffer'].forEach(t=>tags.append(el('span',t)));
    card.append(head,tags,el('p','Source: '+item.source));
    list.append(card);
  });
}
$('calendar-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const school=d(val('school-date')),complete=d(val('complete-date')),name=val('calendar-name'),source=val('calendar-source');
  if(!school||!complete||!name||!source)return;
  const buffer=Math.round((school-complete)/day);
  let out='School / term date: '+fd(school)+'. Shopping-complete target: '+fd(complete)+'. ';
  out+=buffer>0?buffer+' calendar day'+(buffer===1?'':'s')+' of buffer.':buffer===0?'No date buffer.':Math.abs(buffer)+' day'+(Math.abs(buffer)===1?'':'s')+' late relative to the school/term date.';
  out+=' Recheck the actual school or board source before purchase.';
  $('calendar-result').textContent=out;
  calendars.unshift({id:uid(),name:clean(name,160),source:clean(source,500),date:val('school-date'),complete:val('complete-date'),buffer,saved:new Date().toISOString()});
  calendars=calendars.slice(0,100);write(CAL_KEY,calendars);renderCalendars();
});
$('calendar-clear')?.addEventListener('click',()=>{calendars=[];write(CAL_KEY,calendars);renderCalendars()});
renderCalendars();

// 02 — supply budget, multi-currency safe
const SUP_KEY='eventv:bts-2027:supplies:v2';
let supplies=read(SUP_KEY).slice(0,250);
function totalsByCurrency(field){
  const m=new Map();
  supplies.forEach(x=>{
    if(field==='reuse'&&x.plan!=='reuse')return;
    if(field==='buy'&&x.plan!=='buy')return;
    const v=x.qty*x.price;m.set(x.cur,(m.get(x.cur)||0)+v);
  });
  return [...m.entries()].map(([c,v])=>money(c,v)).join(' | ')||'0.00';
}
function saveS(){write(SUP_KEY,supplies)}
function renderS(){
  const list=$('supply-list');if(!list)return;list.replaceChildren();
  supplies.forEach((x,i)=>{
    const card=el('article',undefined,'entry-card'),head=el('div',undefined,'entry-head');
    head.append(el('h3',x.name),(()=>{const b=el('button','Remove');b.type='button';b.addEventListener('click',()=>{supplies.splice(i,1);saveS();renderS()});return b})());
    const tags=el('div',undefined,'entry-tags');
    [x.category,x.required,x.plan,'qty '+x.qty,money(x.cur,x.qty*x.price)].forEach(v=>tags.append(el('span',v)));
    card.append(head,tags);if(x.note)card.append(el('p',x.note));list.append(card);
  });
  $('supply-count').textContent=supplies.length;
  $('supply-gross').textContent=totalsByCurrency('all');
  $('supply-reuse').textContent=totalsByCurrency('reuse');
  $('supply-buy').textContent=totalsByCurrency('buy');
  $('supply-empty').hidden=supplies.length>0;
}
$('supply-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const name=val('supply-name'),qty=Math.max(1,Math.floor(n('supply-qty'))),price=n('supply-price'),cur=clean(val('supply-cur')||'$',8);
  if(!name)return;
  supplies.unshift({name:clean(name,130),cur,category:clean(val('supply-category'),80),required:clean(val('supply-required'),20),plan:clean(val('supply-plan'),20),qty:Math.min(100,qty),price:Math.min(100000,price),note:clean(val('supply-note'),300)});
  supplies=supplies.slice(0,250);saveS();renderS();$('supply-form').reset();$('supply-cur').value='$';$('supply-qty').value='1';$('supply-price').value='0';
});
$('supply-clear')?.addEventListener('click',()=>{supplies=[];saveS();renderS()});
renderS();

// 03 — exact-series price history
const PRICE_KEY='eventv:bts-2027:prices:v2';
let prices=read(PRICE_KEY).slice(0,300),focusKey=null;
const priceKey=x=>[x.item.toLowerCase(),x.seller.toLowerCase(),x.condition,x.cur].join('|');
if(prices.length)focusKey=priceKey(prices[prices.length-1]);
function saveP(){write(PRICE_KEY,prices)}
function renderP(){
  const list=$('price-list');if(!list)return;list.replaceChildren();
  [...prices].sort((a,b)=>b.date.localeCompare(a.date)).forEach(x=>{
    const card=el('article',undefined,'entry-card'),head=el('div',undefined,'entry-head');
    head.append(el('h3',x.item),(()=>{const b=el('button','Remove');b.type='button';b.addEventListener('click',()=>{prices=prices.filter(y=>y.id!==x.id);saveP();if(!prices.some(y=>priceKey(y)===focusKey))focusKey=prices.length?priceKey(prices[prices.length-1]):null;renderP()});return b})());
    const tags=el('div',undefined,'entry-tags');[x.seller,x.condition,x.date,money(x.cur,x.base+x.extra)].forEach(v=>tags.append(el('span',v)));
    card.append(head,tags,el('p','Item '+money(x.cur,x.base)+' + shipping/mandatory fees '+money(x.cur,x.extra)));list.append(card);
  });
  const series=focusKey?prices.filter(x=>priceKey(x)===focusKey):[];
  const totals=series.map(x=>x.base+x.extra),low=totals.length?Math.min(...totals):null,latest=series.length?[...series].sort((a,b)=>b.date.localeCompare(a.date))[0]:null,cur=series[0]?.cur||'';
  $('price-count').textContent=series.length;
  $('price-low').textContent=low==null?'—':money(cur,low);
  $('price-latest').textContent=latest?money(cur,latest.base+latest.extra):'—';
  $('price-delta').textContent=latest&&low!=null?((latest.base+latest.extra-low)<=0?'At low':'+'+money(cur,latest.base+latest.extra-low)):'—';
  $('price-empty').hidden=prices.length>0;
}
$('price-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const item=val('price-item'),seller=val('price-seller'),date=val('price-date'),base=n('price-base'),extra=n('price-extra'),cur=clean(val('price-cur')||'$',8),condition=clean(val('price-condition'),40);
  if(!item||!seller||!date)return;
  const row={id:uid(),item:clean(item,150),seller:clean(seller,100),date,base:Math.min(1e6,base),extra:Math.min(1e5,extra),condition,cur};
  prices.unshift(row);focusKey=priceKey(row);prices=prices.slice(0,300);saveP();renderP();$('price-form').reset();$('price-cur').value='$';$('price-extra').value='0';
});
$('price-clear')?.addEventListener('click',()=>{prices=[];focusKey=null;saveP();renderP()});
renderP();

// 04 — Texas tax holiday
$('tax-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const date=val('tax-date'),cat=val('tax-category'),price=n('tax-price'),ship=n('tax-shipping'),context=val('tax-context'),total=price+ship;
  const inWindow=date>='2027-08-06'&&date<='2027-08-08',eligible=['clothing','school','backpack'].includes(cat);
  let out='Texas 2027 baseline: item sales price including entered seller delivery/handling = '+money('$',total)+'. ';
  if(!inWindow)out+='Purchase date is outside Aug 6–8, 2027.';
  else if(!eligible){const reason={computer:'computers are listed as nonqualifying',software:'software is listed as nonqualifying',textbook:'textbooks are listed as nonqualifying',bag:'this bag category is listed as nonqualifying',unknown:'this category is not verified by the preset'}[cat];out+='Date is inside the holiday, but '+reason+'.';}
  else if(total>=100)out+='The entered item sales price is not under $100 after allocated delivery/handling, so it fails the published threshold.';
  else out+='The entered date/category/price are consistent with the published Texas baseline; verify the exact item on the Comptroller list.';
  if(context==='business')out+=' Business-account school-supply purchases can require an exemption certificate.';
  $('tax-result').textContent=out;
});

// 05 — workload + lifecycle fit
$('device-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const rmin=n('device-ram-min'),rhave=n('device-ram-have'),smin=n('device-storage-min'),shave=n('device-storage-have'),os=val('device-os'),ok=val('device-os-check'),source=val('device-source'),workload=val('device-workload'),use=d(val('device-use-through')),support=d(val('device-support-end')),battery=val('device-battery'),condition=val('device-condition');
  const ram=rhave>=rmin,storage=shave>=smin,supportKnown=!!support,supportOk=!supportKnown||!use||support>=use;
  const out=$('device-result');out.textContent='';
  const grid=el('div',undefined,'result-grid');
  grid.append(metric('RAM',ram?'MEETS':'FAILS',rhave+' GB vs '+rmin+' GB'),metric('Storage',storage?'MEETS':'FAILS',shave+' GB vs '+smin+' GB'),metric('Support horizon',supportKnown?(supportOk?'COVERS USE':'EXPIRES EARLY'):'UNKNOWN',supportKnown?fd(support):'enter official support end if applicable'));
  out.append(grid);
  let p='Workload: '+workload+'. Required OS/app wording: '+os+'. ';
  p+=ok==='yes'?'OS/application compatibility marked manually verified. ':'OS/application compatibility is still unverified. ';
  if(!supportKnown)p+='Remaining software/security support is not documented; do not treat hardware specs as full lifecycle fit. ';
  if(condition!=='New'&&battery==='no')p+='Battery condition/replacement exposure is still unknown. ';
  if(source)p+='Requirement source: '+source+'.';
  out.append(el('p',p,'fine-print'));
});

// 06 — refurb vs new lifecycle cost
$('refurb-run')?.addEventListener('click',()=>{
  const years=Math.max(.25,n('ref-years')||4),use=d(val('ref-use-through'));
  const np=n('new-price'),nr=n('new-repair'),nw=n('new-warranty'),ns=d(val('new-support'));
  const rp=n('ref-price'),rr=n('ref-repair'),rw=n('ref-warranty'),rs=d(val('ref-support'));
  const nt=np+nr,rt=rp+rr,nSupport=!use||!ns||ns>=use,rSupport=!use||!rs||rs>=use;
  const out=$('refurb-result');out.textContent='';
  const grid=el('div',undefined,'result-grid');
  grid.append(metric('New modeled cost',money('',nt),money('',nt/years)+'/year · '+nw+' mo warranty'),metric('Refurb modeled cost',money('',rt),money('',rt/years)+'/year · '+rw+' mo warranty'),metric('Refurb − new',(rt-nt>=0?'+':'')+money('',rt-nt),'cash over entered horizon'));
  out.append(grid);
  let p='Support horizon: new '+(ns?(nSupport?'covers':'expires before'):'unknown for')+' intended use; refurb '+(rs?(rSupport?'covers':'expires before'):'unknown for')+' intended use. ';
  if(!rSupport)p+='A cheaper refurbished option that loses official software/security support before the school-use horizon is not lifecycle-equivalent. ';
  p+='Expected repair/battery costs are user-entered estimates, not failure predictions.';
  out.append(el('p',p,'fine-print'));
});

// 07 — education discount evidence
$('discount-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const vendor=val('disc-vendor'),country=val('disc-country'),role=val('disc-role'),eligible=val('disc-eligible')==='yes',regular=n('disc-regular'),edu=n('disc-edu'),bonus=n('disc-bonus'),date=val('disc-date'),source=val('disc-source');
  if(!vendor||!country||!date||!source)return;
  const grossSave=Math.max(0,regular-edu),usableValue=grossSave+bonus,out=$('discount-result');out.textContent='';
  const grid=el('div',undefined,'result-grid');
  grid.append(metric('Price reduction',money('',grossSave),'regular − education gross price'),metric('Usable bonus',money('',bonus),'only count value you will actually use'),metric('Entered total value',money('',usableValue),eligible?'eligibility marked verified':'NOT YET ELIGIBILITY-VERIFIED'));
  out.append(grid);
  out.append(el('p',vendor+' · '+country+' · '+role+'. Checked '+date+'. '+(eligible?'Eligibility was marked verified against current terms. ':'Do not treat the entered education price as obtainable until eligibility is verified. ')+'Source: '+source+'. Promotion timing and eligibility must be rechecked for 2027.','fine-print'));
});

// Consumer checklist
const checks=[...document.querySelectorAll('#buy-checklist input[type="checkbox"]')];
function progress(){const n=checks.filter(x=>x.checked).length;if($('buy-progress'))$('buy-progress').textContent=n+' of '+checks.length+' checks complete'+(n===checks.length?' — recheck live school/vendor sources immediately before purchase.':'.')}
checks.forEach(x=>x.addEventListener('change',progress));progress();

// Defaults
if($('price-date')&&!$('price-date').value)$('price-date').value='2026-11-07';
if($('disc-date')&&!$('disc-date').value)$('disc-date').value='2026-11-07';
})();