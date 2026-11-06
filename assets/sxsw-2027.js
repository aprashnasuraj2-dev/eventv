(() => {
  'use strict';

  const PLAN_KEY = 'eventv:sxsw-2027:plan:v1';
  const SHORTLIST_KEY = 'eventv:sxsw-2027:shortlist:v1';

  const $ = (id) => document.getElementById(id);
  const read = (key) => {
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  };
  const uid = () => String(Date.now()) + '-' + Math.random().toString(16).slice(2);
  const mins = (time) => {
    const parts = String(time || '').split(':').map(Number);
    return parts.length === 2 && parts.every(Number.isFinite) ? parts[0] * 60 + parts[1] : NaN;
  };
  const fmtDuration = (m) => {
    if (!Number.isFinite(m)) return '—';
    if (m < 60) return m + ' min';
    const h = Math.floor(m / 60);
    const r = m % 60;
    return r ? h + 'h ' + r + 'm' : h + 'h';
  };
  const niceDate = (iso) => {
    if (!iso) return 'Date missing';
    const d = new Date(iso + 'T12:00:00-05:00');
    return new Intl.DateTimeFormat('en-US', {weekday:'short', month:'short', day:'numeric'}).format(d);
  };
  const addText = (parent, tag, text, className) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = text;
    parent.appendChild(el);
    return el;
  };
  const chip = (parent, text) => addText(parent, 'span', text);

  let plan = read(PLAN_KEY);
  let shortlist = read(SHORTLIST_KEY);

  function sortPlan(items) {
    return items.slice().sort((a,b) => {
      const ka = a.date + 'T' + a.start;
      const kb = b.date + 'T' + b.start;
      return ka.localeCompare(kb);
    });
  }

  function riskFor(items, index) {
    if (index === 0) return {kind:'ok', text:'First item of this day — no prior transfer comparison.'};
    const current = items[index];
    const prev = items[index - 1];
    if (current.date !== prev.date) return {kind:'ok', text:'First item of this day — no prior transfer comparison.'};
    const gap = mins(current.start) - mins(prev.end);
    const required = Number(current.buffer) || 0;
    if (gap < 0) return {kind:'bad', text:'Direct time conflict: overlaps previous item by ' + Math.abs(gap) + ' min.'};
    if (gap < required) return {kind:'warn', text:'Transfer risk: ' + gap + ' min gap vs your ' + required + ' min minimum buffer.'};
    return {kind:'ok', text:'Gap check: ' + gap + ' min available vs your ' + required + ' min minimum buffer.'};
  }

  function renderPlan() {
    const list = $('plan-list');
    const summary = $('plan-summary');
    if (!list || !summary) return;
    list.textContent = '';
    const sorted = sortPlan(plan);
    let conflicts = 0;
    let risks = 0;
    const days = new Set(sorted.map(x => x.date));
    sorted.forEach((item, index) => {
      const risk = riskFor(sorted, index);
      if (risk.kind === 'bad') conflicts += 1;
      if (risk.kind === 'warn') risks += 1;

      const card = document.createElement('article');
      card.className = 'plan-card';
      const head = document.createElement('header');
      const titleWrap = document.createElement('div');
      addText(titleWrap, 'h3', item.title);
      addText(titleWrap, 'small', niceDate(item.date) + ' · ' + item.start + '–' + item.end + ' · Austin local');
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove-btn';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => {
        plan = plan.filter(x => x.id !== item.id);
        write(PLAN_KEY, plan);
        renderPlan();
      });
      head.append(titleWrap, remove);
      card.appendChild(head);

      const meta = document.createElement('div');
      meta.className = 'meta';
      chip(meta, item.type);
      chip(meta, item.venue);
      chip(meta, item.access);
      chip(meta, 'transfer ≥ ' + item.buffer + ' min');
      card.appendChild(meta);

      const riskEl = addText(card, 'div', risk.text, 'risk ' + risk.kind);
      riskEl.setAttribute('role', 'status');

      if (item.source) {
        const p = addText(card, 'p', 'Evidence: ');
        p.className = 'tool-note';
        if (/^https?:\/\//i.test(item.source)) {
          const a = document.createElement('a');
          a.href = item.source;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = item.source;
          p.appendChild(a);
        } else {
          p.appendChild(document.createTextNode(item.source));
        }
      }
      list.appendChild(card);
    });
    if (!sorted.length) addText(list, 'p', 'No private itinerary items saved yet.', 'empty');

    const values = [
      [sorted.length, 'Saved items'],
      [conflicts, 'Direct conflicts'],
      [risks, 'Transfer-risk gaps'],
      [days.size, 'Days used']
    ];
    Array.from(summary.children).forEach((box, i) => {
      const strong = box.querySelector('strong');
      const span = box.querySelector('span');
      if (strong) strong.textContent = String(values[i][0]);
      if (span) span.textContent = values[i][1];
    });
  }

  const planForm = $('plan-form');
  if (planForm) {
    planForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const start = $('plan-start').value;
      const end = $('plan-end').value;
      if (!Number.isFinite(mins(start)) || !Number.isFinite(mins(end)) || mins(end) <= mins(start)) {
        $('plan-end').setCustomValidity('End time must be later than start time for this planner.');
        $('plan-end').reportValidity();
        return;
      }
      $('plan-end').setCustomValidity('');
      plan.push({
        id: uid(),
        title: $('plan-title').value.trim(),
        type: $('plan-type').value,
        date: $('plan-date').value,
        start,
        end,
        venue: $('plan-venue').value.trim(),
        access: $('plan-access').value,
        buffer: Math.max(0, Number($('plan-buffer').value) || 0),
        source: $('plan-source').value.trim()
      });
      write(PLAN_KEY, plan);
      planForm.reset();
      $('plan-buffer').value = '30';
      renderPlan();
    });
  }
  if ($('plan-clear')) $('plan-clear').addEventListener('click', () => {
    plan = [];
    write(PLAN_KEY, plan);
    renderPlan();
  });

  const BADGES = [
    {name:'Platinum', price:1495, reservations:3, covers:['innovation','film','music'], note:'All Innovation, Film & TV, and Music Conference/Festival scope listed in the current cart.'},
    {name:'Innovation', price:995, reservations:2, covers:['innovation'], note:'Innovation Conference scope listed in the current cart.'},
    {name:'Film & TV', price:850, reservations:2, covers:['film'], note:'Film & TV Festival + Conference scope listed in the current cart.'},
    {name:'Music', price:625, reservations:2, covers:['music'], note:'Music Festival + Conference scope listed in the current cart.'}
  ];

  function renderBadgeResults(goals, budget) {
    const out = $('badge-results');
    if (!out) return;
    out.textContent = '';
    const selected = goals.length;
    const rows = BADGES.map(b => {
      const matched = goals.filter(g => b.covers.includes(g)).length;
      const ratio = selected ? matched / selected : 0;
      return {...b, matched, ratio};
    }).sort((a,b) => b.ratio - a.ratio || a.price - b.price);

    rows.forEach(b => {
      const card = document.createElement('article');
      const over = Number.isFinite(budget) && b.price > budget;
      card.className = 'badge-card' + (selected && b.matched === selected ? ' good' : '') + (over ? ' over' : '');
      addText(card, 'h3', b.name + ' · $' + b.price.toLocaleString('en-US'));
      const score = selected ? b.matched + '/' + selected + ' requested verticals explicitly covered' : 'Select at least one vertical to calculate coverage';
      addText(card, 'div', score, 'score');
      if (selected && b.matched > 0) {
        addText(card, 'small', 'Arithmetic only: $' + Math.round(b.price / b.matched).toLocaleString('en-US') + ' per matched requested vertical.');
      }
      addText(card, 'small', b.reservations + ' reservations/day in the current 2027 rules. ' + b.note);
      if (over) addText(card, 'small', 'Above your entered budget ceiling.');
      if (selected && b.matched < selected) addText(card, 'small', 'Unmatched verticals are not counted as explicitly included by the current cart; event-specific access may differ, so verify the individual event.');
      out.appendChild(card);
    });
  }

  const badgeForm = $('badge-form');
  if (badgeForm) badgeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const goals = Array.from(badgeForm.querySelectorAll('input[name="goal"]:checked')).map(x => x.value);
    const raw = $('badge-budget').value;
    const budget = raw === '' ? NaN : Number(raw);
    renderBadgeResults(goals, budget);
  });
  renderBadgeResults([], NaN);

  const dayForm = $('day-form');
  if (dayForm) dayForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const day = $('day-date').value;
    const start = mins($('day-start').value);
    const end = mins($('day-end').value);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
      $('day-end').setCustomValidity('Day end must be later than day start.');
      $('day-end').reportValidity();
      return;
    }
    $('day-end').setCustomValidity('');
    const items = sortPlan(plan.filter(x => x.date === day));
    const programmed = items.reduce((sum, x) => sum + Math.max(0, mins(x.end) - mins(x.start)), 0);
    const transfer = items.slice(1).reduce((sum, x) => sum + (Number(x.buffer) || 0), 0);
    const queuePer = Math.max(0, Number($('day-queue').value) || 0);
    const queue = queuePer * items.length;
    const rest = Math.max(0, Number($('day-rest').value) || 0);
    const available = end - start;
    const unallocated = available - programmed - transfer - queue - rest;
    const vals = [programmed, transfer, queue, rest, unallocated];
    Array.from($('day-results').children).forEach((box, i) => {
      const strong = box.querySelector('strong');
      if (strong) strong.textContent = fmtDuration(vals[i]);
    });
    const message = $('day-message');
    if (!items.length) message.textContent = 'No saved itinerary items exist for ' + niceDate(day) + '. Add verified items in the conflict planner first.';
    else if (unallocated < 0) message.textContent = 'Overloaded by ' + fmtDuration(Math.abs(unallocated)) + ' before real-world delays. Remove a commitment, shrink only buffers you can justify, or expand the usable window.';
    else message.textContent = fmtDuration(unallocated) + ' remains unallocated after your programmed time, transfer buffers, queue buffers and protected rest. This is not a guarantee that the itinerary is feasible.';
  });

  function renderShortlist() {
    const out = $('shortlist-list');
    if (!out) return;
    out.textContent = '';
    shortlist.slice().sort((a,b) => Number(b.interest) - Number(a.interest)).forEach(item => {
      const card = document.createElement('article');
      card.className = 'evidence-card';
      const head = document.createElement('header');
      const wrap = document.createElement('div');
      addText(wrap, 'h3', item.name);
      addText(wrap, 'small', item.type + ' · interest ' + item.interest + '/5');
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove-btn';
      remove.textContent = 'Remove';
      remove.addEventListener('click', () => {
        shortlist = shortlist.filter(x => x.id !== item.id);
        write(SHORTLIST_KEY, shortlist);
        renderShortlist();
      });
      head.append(wrap, remove);
      card.appendChild(head);
      const meta = document.createElement('div');
      meta.className = 'meta';
      chip(meta, item.status);
      card.appendChild(meta);
      if (item.note) addText(card, 'p', item.note);
      if (item.url && /^https?:\/\//i.test(item.url)) {
        const p = document.createElement('p');
        p.className = 'tool-note';
        const a = document.createElement('a');
        a.href = item.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Open saved evidence source';
        p.appendChild(a);
        card.appendChild(p);
      }
      out.appendChild(card);
    });
    if (!shortlist.length) addText(out, 'p', 'No evidence items saved yet.', 'empty');
  }

  const shortlistForm = $('shortlist-form');
  if (shortlistForm) shortlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    shortlist.push({
      id: uid(),
      type: $('shortlist-type').value,
      status: $('shortlist-status').value,
      name: $('shortlist-name').value.trim(),
      interest: Math.min(5, Math.max(1, Number($('shortlist-interest').value) || 3)),
      url: $('shortlist-url').value.trim(),
      note: $('shortlist-note').value.trim()
    });
    write(SHORTLIST_KEY, shortlist);
    shortlistForm.reset();
    $('shortlist-interest').value = '3';
    renderShortlist();
  });
  if ($('shortlist-clear')) $('shortlist-clear').addEventListener('click', () => {
    shortlist = [];
    write(SHORTLIST_KEY, shortlist);
    renderShortlist();
  });

  renderPlan();
  renderShortlist();
})();