# Topic #55 — Edinburgh Festival Fringe 2027: candidate research (NOT catalog-approved)
Checked: 2026-11-10. Worker 5 only. Status: PREPUBLICATION / DISCOVERY COMPLETE, CATALOG BLOCKED.

## Canonical candidate
- Name: Edinburgh Festival Fringe 2027
- Slug: edinburgh-festival-fringe-2027
- Proposed dates: 2027-08-06 to 2027-08-30, **CONFIRMED** on the Edinburgh Festival Fringe Society homepage https://www.edfringe.com/
- Location: Edinburgh, Scotland, United Kingdom; citywide venues, not a single building.
- Organiser: Edinburgh Festival Fringe Society, https://www.edfringe.com/
- Proposed reader job: Build a feasible, accessible multi-show itinerary with *user-entered* times, performance durations, venue transfer buffers, booking status and ticket costs; flag overlapping shows and insufficient travel/access buffers; export private itinerary without inventing a 2027 programme.
- Candidate canonical: https://aafnaipatro.com/events/edinburgh-festival-fringe-2027/
- Candidate audience: UK and international visitors; travel planning is jurisdiction-specific.
- Distinct from existing 50 topic identities: no Edinburgh/Fringe event in legacy 50; must repeat full collision check at integration time.

## Evidence ledger
1. https://www.edfringe.com/ — CONFIRMED: festival dates 6–30 August 2027; venue geography citywide. Checked 2026-11-10.
2. https://www.edfringe.com/experience/plan-your-visit/fringe-programme/ — PENDING: 2027 programme pre-orders planned for spring; publication details not yet confirmed. Historical 2026 printed-programme dates are not 2027 dates. Checked 2026-11-10.
3. https://www.edfringe.com/experience/plan-your-visit/fringe-app/ — UNANNOUNCED release date: 2027 official app planned for summer, no confirmed launch day; app already offers an official show planner, so our tool must uniquely add conflict/transfer/accessibility buffer analysis rather than clone official booking. Checked 2026-11-10.
4. https://www.edfringe.com/experience/accessibility/ — CURRENT GUIDANCE (not a guarantee for any individual 2027 venue): access booking service, wheelchair booking limitations and per-performance access icons; verify venue and accessible performance before booking. Some schedules and lists refer explicitly to 2026 and must not be carried forward as 2027 facts. Checked 2026-11-10.
5. https://www.edfringe.com/experience/plan-your-visit/fringe-box-office/ — CURRENT GUIDANCE: official box office and booking channels; hours shown are 2026-specific and are **HISTORICAL**, not 2027. Checked 2026-11-10.
6. https://www.edfringe.com/take-part/artists/organise-a-show/registration — CONFIRMED organiser statement: 2027 artist registration opens 11 January (2027 context); requires venue agreement. Artist registration is **not** audience ticket availability. Checked 2026-11-10.

## Original utility acceptance criteria
- User-entered show title, local Edinburgh date/time, runtime, venue name, transfer minutes, queue/access buffer and GBP price. Never prepopulate fictional 2027 acts, prices or timetables.
- Stable sorting, conflict detection including transfer buffer, overnight boundary and non-overlap counterexample; reject invalid calendar dates, negative prices, impossible time or empty names.
- Save to localStorage with schema version and recover safely from corrupted data; allow JSON export and clear; render all user text via textContent (no unsanitized innerHTML).
- Distinguish candidate/confirmed/booked per user records; no implied official ticket reservation, schedule verification or guaranteed accessible route.
- Include keyboard labels, accessible error/status announcements, responsive layouts, official links and explicit as-of evidence.
- Test same-venue back-to-back with buffer, cross-venue overlap, midnight crossing, invalid DST transition in Europe/London, malformed JSON and XSS-like user text.
- Only after catalog IDs #51–54 have been merged in order: add this as ID #55 through schema-v2 duplicate validation, source-led editorial hub, approved registry and 4 route rows (three spokes noindex); Node 22 build, validator and exact-head CI; feature merge; separate docs-only latest.md reconciliation; final-main audit.

## Blocking prerequisite (not a reason to invent IDs)
As of main 36b692db1d47fd863abf7f676f94e620ffecdda9, data/events-extra.json has zero events. scripts/catalog.mjs enforces rank === index+1. Therefore #55 **cannot** be added to canonical catalog until workers 1–4 legitimately add and merge #51, #52, #53, #54. Do not fill those slots, bypass validator, approve the hub or merge a draft to main. This research branch is nonpublishing.
