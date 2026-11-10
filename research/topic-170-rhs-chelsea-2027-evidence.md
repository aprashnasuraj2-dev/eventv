# Topic #170 · RHS Chelsea Flower Show 2027 — evidence ledger
Checked 2026-11-10 (Europe/London source timezone). Independent, non-affiliated visitor utility. Status: draft; noindex,follow; not deployed.
## Official primary sources
- https://www.rhs.org.uk/shows-events/rhs-chelsea-flower-show — CONFIRMED: 18–22 May 2027, London Gate at Royal Hospital Chelsea, member days Tue/Wed 08:00–20:00, public Thu–Sat, Saturday closes 17:30, Friday Chelsea Late 17:30–22:00, Saturday plant sell-off 16:00–17:30. Ticket advertisements: member *from* £48; public *from* £61; no inventory guarantee.
- https://www.rhs.org.uk/shows-events/misc-shows/show-faqs — CONFIRMED published policy: RHS members can buy up to four member-rate tickets including three non-member guests, member-rate eligibility must exist at purchase and at event, inventory not guaranteed. Companion/access booking requires RHS/AXS coordination. Rules may change: reconfirm before purchase.
- https://www.rhs.org.uk/shows-events/rhs-chelsea-flower-show/top-tips — RHS visitor advice suggests 5–7 hours for main gardens, Great Pavilion and floral displays; this is a planning heuristic, not a compulsory visit duration.
- https://www.rhs.org.uk/shows-events/rhs-chelsea-flower-show/gardens/2027 — 2027 garden list is evolving; do not infer all gardens from 2026.
## Boundaries / counterexamples
- Public-day visitor holding only public admission cannot assume access to Tue/Wed member-only dates.
- A non-member may accompany a member with an appropriately issued guest ticket, so blanket “non-members prohibited on member days” is false.
- Friday Chelsea Late is distinct from the daytime show; planner deliberately warns at 17:30 and later.
- Advertised “from” price is NOT a quote; membership savings cannot be inferred without comparable date/entry products and eligible ticket count.
- Early accessibility entry, companion eligibility and transport conditions require direct official confirmation.
- Saturday closes 17:30, not 20:00. No promise of garden lineup, sell-off stock, tickets, visa, rail services, or actual crowd times.
## Duplicate review
On current main 2026-11-10: `data/events-50.json` 50 entries and `data/events-extra.json` zero entries contain no Chelsea/RHS candidate; `data/index-approved.json` has no Chelsea/RHS approval. New slug `rhs-chelsea-flower-show-2027` and canonical `https://aafnaipatro.com/events/rhs-chelsea-flower-show-2027/` are distinct from reviewed entries. Sparse independent manifests may be merged concurrently; CI catalog duplicate gate is final authority.
## QA scope
Node 22 topic tests cover member/nonmember, guests, Saturday, Friday Late, invalid date/time, budget boundaries, break-even, noindex and DOM text safety. Browser mobile/keyboard execution remains an explicit independent release gate.
