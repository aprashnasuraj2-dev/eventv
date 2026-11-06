(() => {
  'use strict';
  const AGENDA_KEY='eventv:web-summit-2027:agenda:v1';
  const NETWORK_KEY='eventv:web-summit-2027:network:v1';
  const $=id=>document.getElementById(id);
  const read=key=>{try{const v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[]}catch{return[]}};
  const write=(key,v)=>{try{localStorage.setItem(key,JSON.stringify(v))}catch{}};
  const uid=()=>String(Date.now())+'-'+Math.random().toString(16).slice(2);
  const minutes=t=>{const p=String(t||'').split(':').map(Number);return p.length===2&&p.every(Number.isFinite)?p[0]*60+p[1]:NaN};
  const niceDate=iso=>{if(!iso)return'—';return new Intl.DateTimeFormat('en-GB',{weekday:'short',day:'numeric',month:'short'}).format(new Date(iso+'T12:00:00Z'))};
  const text=(parent,tag,value,cls)=>{const e=document.createElement(tag);if(cls)e.className=cls;e.textContent=value;parent.appendChild(e);return e};
  const chip=(p,v)=>text(p,'span',v);
  let agenda=read(AGENDA_KEY),network=read(NETWORK_KEY);

  const sortedAgenda=()=>agenda.slice().sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start));
  function gapRisk(items,i){
    if(i===0||items[i-1].date!==items[i].date)return{kind:'ok',msg:'First saved item of this day — no prior gap comparison.'};
    const prev=items[i-1],cur=items[i];
    const gap=minutes(cur.start)-minutes(prev.end),need=Number(cur.buffer)||0;
    if(gap<0)return{kind:'bad',msg:'Direct overlap: '+Math.abs(gap)+' min with the previous item.'};
    if(gap<need)return{kind:'warn',msg:'Buffer risk: '+gap+' min available vs your '+need+' min minimum.'};
    return{kind:'ok',msg:'Gap passes your input: '+gap+' min available vs '+need+' min minimum.'};
  }

  function renderAgenda(){
    const out=$('schedule-list'),summary=$('schedule-summary');if(!out||!summary)return;
    out.textContent='';
    const items=sortedAgenda();let overlaps=0,risks=0,official=0;
    items.forEach((item,i)=>{
      const risk=gapRisk(items,i);
      if(risk.kind==='bad')overlaps++;
      if(risk.kind==='warn')risks++;
      if(item.evidence==='Official 2027 source')official++;
      const card=document.createElement('article');card.className='agenda-card';
      const head=document.createElement('header'),left=document.createElement('div');
      text(left,'h3',item.title);text(left,'small',niceDate(item.date)+' · '+item.start+'–'+item.end+' · Lisbon local');
      const remove=document.createElement('button');remove.type='button';remove.className='remove-btn';remove.textContent='Remove';
      remove.addEventListener('click',()=>{agenda=agenda.filter(x=>x.id!==item.id);write(AGENDA_KEY,agenda);renderAgenda()});
      head.append(left,remove);card.appendChild(head);
      const meta=document.createElement('div');meta.className='meta';
      [item.type,item.venue,item.evidence,'buffer ≥ '+item.buffer+' min'].forEach(v=>chip(meta,v));card.appendChild(meta);
      text(card,'div',risk.msg,'risk '+risk.kind);
      if(item.source){
        const p=text(card,'p','Evidence: ','tool-note');
        if(/^https?:\/\//i.test(item.source)){const a=document.createElement('a');a.href=item.source;a.target='_blank';a.rel='noopener noreferrer';a.textContent=item.source;p.appendChild(a)}
        else p.appendChild(document.createTextNode(item.source));
      }
      out.appendChild(card);
    });
    if(!items.length)text(out,'p','No private agenda items saved yet.','empty');
    const vals=[items.length,overlaps,risks,official];
    Array.from(summary.children).forEach((box,i)=>{box.querySelector('strong').textContent=String(vals[i])});
  }

  const scheduleForm=$('schedule-form');
  if(scheduleForm)scheduleForm.addEventListener('submit',e=>{
    e.preventDefault();
    const s=$('schedule-start').value,en=$('schedule-end').value;
    if(!Number.isFinite(minutes(s))||!Number.isFinite(minutes(en))||minutes(en)<=minutes(s)){
      $('schedule-end').setCustomValidity('End time must be later than start time.');$('schedule-end').reportValidity();return;
    }
    $('schedule-end').setCustomValidity('');
    agenda.push({
      id:uid(),title:$('schedule-title').value.trim(),type:$('schedule-type').value,date:$('schedule-date').value,start:s,end:en,
      venue:$('schedule-venue').value.trim(),buffer:Math.max(0,Number($('schedule-buffer').value)||0),
      evidence:$('schedule-evidence').value,source:$('schedule-source').value.trim()
    });
    write(AGENDA_KEY,agenda);scheduleForm.reset();$('schedule-buffer').value='25';renderAgenda();
  });
  if($('schedule-clear'))$('schedule-clear').addEventListener('click',()=>{agenda=[];write(AGENDA_KEY,agenda);renderAgenda()});

  const PATHS=[
    {name:'General attendee',status:'confirmed',covers:['content','network'],headline:'Confirmed 2027 ticket path',detail:'Dedicated 2027 page confirms all 17 tracks + Centre Stage, masterclasses, roundtables, meetups, exhibition, Night Summit, perks and app access. Current 2-for-1 offer is €950 for two tickets.'},
    {name:'Startup programme',status:'review',covers:['content','startup','pitch','investors','network'],headline:'2027 applications open',detail:'Current programme says successful applicants get three tickets and startup activations, but acceptance is selective and exact 2027 package pricing/deadlines remain unverified.'},
    {name:'Investor accreditation',status:'pending',covers:['investors','network'],headline:'Current policy exists; 2027 ticket state pending',detail:'Accreditation is for active startup/venture investors and requires evidence. Lisbon 2027 investor ticket price, availability and deadline were not verified.'}
  ];
  function renderPaths(goals){
    const out=$('access-results');if(!out)return;out.textContent='';
    PATHS.map(p=>({...p,matched:goals.filter(g=>p.covers.includes(g)).length})).sort((a,b)=>b.matched-a.matched).forEach(p=>{
      const c=document.createElement('article');c.className='path-card '+(p.status==='confirmed'?'good':'pending');
      text(c,'h3',p.name);text(c,'strong',goals.length?p.matched+'/'+goals.length+' selected goals matched':'Select goals to compare');
      text(c,'small',p.headline);text(c,'small',p.detail);out.appendChild(c);
    });
  }
  const accessForm=$('access-form');
  if(accessForm)accessForm.addEventListener('submit',e=>{e.preventDefault();renderPaths(Array.from(accessForm.querySelectorAll('input[name="goal"]:checked')).map(x=>x.value))});
  renderPaths([]);

  const startupForm=$('startup-form');
  if(startupForm)startupForm.addEventListener('submit',e=>{
    e.preventDefault();
    const funding=Math.max(0,Number($('startup-funding').value)||0),stage=$('startup-stage').value;
    const prototype=$('startup-prototype').value==='yes',users=$('startup-users').value==='yes';
    const rel=$('startup-relevance').value.trim(),eng=$('startup-engagement').value.trim();
    let bucket='ALPHA-like under current framework';
    if(stage==='growth'||funding>3000000)bucket='GROWTH-like under current framework';
    else if(stage==='launched')bucket='BETA-like under current framework';
    const evidence=[prototype,users,rel.length>=35,eng.length>=35],score=evidence.filter(Boolean).length;
    const out=$('startup-result');out.textContent='';
    text(out,'h3',bucket);
    text(out,'p','This is a framework comparison, not a 2027 eligibility or acceptance decision. Funding and stage are only part of Web Summit’s current scoring process.');
    const grid=document.createElement('div');grid.className='score-grid';
    [['Prototype',prototype?'present':'missing'],['Users',users?'present':'missing'],['Attendee relevance',rel.length>=35?'described':'thin / missing'],['Engagement plan',eng.length>=35?'described':'thin / missing']].forEach(([a,b])=>{
      const d=document.createElement('div');text(d,'span',a);text(d,'strong',b);grid.appendChild(d);
    });
    out.appendChild(grid);
    text(out,'p','Evidence-preparation score: '+score+'/4. Web Summit also assesses market growth potential, impact/relevance, product and team, and pitch quality; selection remains discretionary.','tool-note');
  });

  const transitForm=$('transit-form');
  if(transitForm){
    $('transit-mode').addEventListener('change',()=>{if($('transit-mode').value==='airport')$('transit-base').value='6'});
    transitForm.addEventListener('submit',e=>{
      e.preventDefault();
      const arrival=minutes($('transit-arrive').value),base=Math.max(0,Number($('transit-base').value)||0),walk=Math.max(0,Number($('transit-walk').value)||0),entry=Math.max(0,Number($('transit-entry').value)||0),total=base+walk+entry;
      if(!Number.isFinite(arrival))return;
      let leave=arrival-total;while(leave<0)leave+=1440;
      const hh=String(Math.floor(leave/60)%24).padStart(2,'0'),mm=String(leave%60).padStart(2,'0');
      const out=$('transit-result');out.querySelector('strong').textContent='Leave by '+hh+':'+mm;
      out.querySelector('span').textContent='Your model uses '+base+' min travel + '+walk+' min platform/walk + '+entry+' min registration/security = '+total+' min total buffer. Re-check actual 2027 service and entry rules.';
    });
  }

  function renderNetwork(){
    const out=$('network-list');if(!out)return;out.textContent='';
    network.slice().sort((a,b)=>b.priority-a.priority).forEach(item=>{
      const card=document.createElement('article');card.className='target-card';
      const head=document.createElement('header'),left=document.createElement('div');
      text(left,'h3',item.name);text(left,'small',item.type+' · priority '+item.priority+'/5');
      const remove=document.createElement('button');remove.type='button';remove.className='remove-btn';remove.textContent='Remove';
      remove.addEventListener('click',()=>{network=network.filter(x=>x.id!==item.id);write(NETWORK_KEY,network);renderNetwork()});
      head.append(left,remove);card.appendChild(head);
      const meta=document.createElement('div');meta.className='meta';chip(meta,'ASK: '+item.ask);chip(meta,'NEXT: '+item.next);card.appendChild(meta);
      text(card,'p',item.fit);
      if(item.source){
        const p=text(card,'p','Evidence: ','tool-note');
        if(/^https?:\/\//i.test(item.source)){const a=document.createElement('a');a.href=item.source;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Open source';p.appendChild(a)}
        else p.appendChild(document.createTextNode(item.source));
      }
      out.appendChild(card);
    });
    if(!network.length)text(out,'p','No networking targets saved yet.','empty');
  }
  const networkForm=$('network-form');
  if(networkForm)networkForm.addEventListener('submit',e=>{
    e.preventDefault();
    network.push({id:uid(),type:$('network-type').value,priority:Math.min(5,Math.max(1,Number($('network-priority').value)||3)),name:$('network-name').value.trim(),fit:$('network-fit').value.trim(),source:$('network-source').value.trim(),ask:$('network-ask').value.trim(),next:$('network-next').value.trim()});
    write(NETWORK_KEY,network);networkForm.reset();$('network-priority').value='3';renderNetwork();
  });
  if($('network-clear'))$('network-clear').addEventListener('click',()=>{network=[];write(NETWORK_KEY,network);renderNetwork()});
  renderAgenda();renderNetwork();
})();