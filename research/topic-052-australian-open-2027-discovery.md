# Topic #52 — Australian Open 2027: source and product discovery (NONPUBLISHING)

Checked: 2026-11-10. Owner: lane 2, ID 52. Status: DISCOVERY_RESEARCH_ONLY / CATALOG_BLOCKED. Do not index or treat this as approval.

## Catalog gate
As checked on main cb169ba3f24f44f69f4800030551caecda48d820, data/events-extra.json is empty. scripts/catalog.mjs enforces contiguous rank IDs, so rank 52 cannot be registered until an independently verified #51 has merged. Do not insert a placeholder #51 or bypass validation. This file is nonpublishing preparation only.

## Candidate
Name: Australian Open 2027
Slug proposal: australian-open-2027
Official organizer: Tennis Australia / Australian Open
Canonical proposal: https://aafnaipatro.com/events/australian-open-2027/
Audience: Australian attendees, and overseas fans planning sessions in Melbourne AEDT.
Distinct job: Build a *ticket entitlement and session feasibility planner*, not a generic draw/scores page. Let visitors input their actual session ticket category, arena, date, transfer buffer, group accessibility needs, costs and evidence; explain where their selected ticket does NOT grant entry, and distinguish official schedule from visitor hypotheses. This is distinct from existing Wimbledon #44 and US Open Tennis #49, whose organizer-specific ticket access cannot be imported.

## Primary-source fact ledger (checked 2026-11-10)
- CONFIRMED: AO organizer announced Melbourne Park 11–31 January 2027, Opening Week 11–16 January, main draw 17–31 January, singles finals 30–31 January. https://ausopen.com/articles/news/australian-open-2027-dates-announced (published 2026-03-23).
- CONFLICTED/UPDATE: Official current What's On page includes *Kids Tennis Day Sunday 10 January*, before the formally described 11–31 Jan event window. The organizer announced this move 2026-11-06. Treat Jan 10 as separately announced kickoff, not silently rewrite the tournament's main-draw dates. https://ausopen.com/whats-on and https://ausopen.com/articles/news/kids-tennis-day-presented-emirates-kick-ao-2027
- CONFIRMED: Official ticket page differentiates Rod Laver Arena reserved seating, Margaret Court Arena, Ground Pass and separately ticketed events; outdoor/unreserved access is subject to capacity. https://ausopen.com/ticket-info
- CONFIRMED: Organizer says tickets went on sale Aug 2026; some Ground Pass allocations capped on high-demand days; early-bird period through 30 Nov 2026. Do not extrapolate future inventory. https://ausopen.com/articles/news/australian-open-2027-tickets-on-sale-earlier-ever (published 2026-07-21).
- CONFIRMED: Official ticket FAQs warn unauthorized resale can result in denied entry; prices may fluctuate. AO Event Collectable is not entry ticket, and can be mailed only to Australian postal addresses. https://ausopen.com/ticket-faqs
- CONFIRMED: Official conditions apply to Melbourne Park and Birrarung Marr, with additional conditions potentially applying. https://ausopen.com/sites/default/files/2026-03/ao2027-ticket-conditions-of-sale-and-entry.pdf
- PENDING: Individual match opponents, daily court assignments, future live seat inventory, personalized visa eligibility, weather and travel times. No invented draw, prices, official API or live access.
- HISTORICAL: 2026 attendance figures in organizer releases are retrospective, not 2027 attendance forecasts.

## Proposed original browser-side utility
1. Ticket entitlement matrix: user-selected Ground Pass / reserved arena / separate event; display clear allowed, excluded and conditional venue access from dated official rules. Never infer entry from ticket label alone.
2. Session scenario board: visitor-entered date, AEDT clock, arena, start/end and transfer buffer; highlight overlap and impossible transfers; hypothetical sessions clearly labeled.
3. Total-cost comparison: user-entered AUD face price, per-ticket fees, transport, accommodation, accessibility needs; no live pricing or FX.
4. Calendar export / JSON backup and localStorage with schema validation, reset, no untrusted HTML injection; explicit AEDT (UTC+11) date window and visitor timezone display.
5. Source-backed change log and official schedule evidence slots; never present provisional schedule as fixed draw.

## Edge/counterexample tests
- Kids Tennis Day 10 Jan must not be erroneously described as main draw or as part of 11–31 ticket conditions without confirming applicable event rules.
- Ground Pass cannot be treated as guaranteed access to Rod Laver Arena or a separately ticketed concert.
- Two user-entered sessions at distinct venues with overlapping times and transfer buffer must flag conflict.
- Empty/invalid AEDT dates, DST conversions outside event window, malformed localStorage, negative costs, XSS-looking labels, duplicated session IDs, and export/reset round trips.
- Accessible seating must not be promised based solely on a generic arena ticket; route to official accessible ticket channel.
- No invented guaranteed seat price or match pairing.

## Duplicate/cannibalization assessment
Legacy 50 contains Wimbledon 2027 (#44), US Open Tennis 2027 (#49), not Australian Open 2027. AO-specific entry rules, Jan Melbourne summer and distinct Ground Pass/arena constraints support a separate organizer-specific user job. Demand volumes, search rankings and achievable traffic have NOT been measured. Do not call this demand-proven.

## Next gate
Wait for verified rank #51 to merge; re-read current main and repeat collision check before adding rank 52. Then register only with source-verified fields and run catalog validator. Implement original tool, source/output parity, approval and exact-head CI; separate docs-only latest.md checkpoint after feature merge. No deployment authorized.
