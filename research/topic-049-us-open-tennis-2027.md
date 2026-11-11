# Topic #49 — US Open Tennis 2027 | Primary-source evidence ledger
Checked: 2026-11-10. Owner: Worker 4. Status: RESEARCH ONLY — NOT APPROVED, NOT DEPLOYED.

## Registry and publishing constraints
Canonical `data/events-50.json` entry #49: `us-open-tennis-2027`; start/end null, date_status `unannounced`. Current main approval registry has 39 hubs and no #49. Four route rows remain `noindex,follow`. Preserve these until substantive source, tool, test and CI gates pass. Do not infer dates from the 2026 tournament or calendar arithmetic.

## Verified organizer evidence (as of 2026-11-10)
- **CONFIRMED — venue / travel context:** Official 2026 US Open transportation guide identifies the USTA Billie Jean King National Tennis Center in Flushing Meadows–Corona Park, Mets-Willets Point on 7 subway / LIRR Port Washington Branch. It recommends transit rather than assuming parking. Source: https://www.usopen.org/amp/en_US/news/articles/2026-03-04/how_to_get_to_the_us_open.html . Reverify 2027 services and station accessibility before travel.
- **HISTORICAL (2026 only) — ticket access:** 2026 official ticket-type explainer distinguishes grounds admission (no Arthur Ashe), reserved Arthur Ashe, Louis Armstrong and Grandstand seating, and first-come access to some other courts. Source: https://www.usopen.org/amp/en_US/news/articles/2026-03-13/us_open_ticket_types_explained.html . This is not a 2027 ticket offer or access guarantee.
- **HISTORICAL (2026 only) — gate times and bags:** 2026 guide says day gates opened at 09:30 for specified 2026 dates and evening admission began at 18:00; bag limits and prohibited items apply. These are NOT 2027 opening hours or 2027 baggage policy. Source: https://www.usopen.org/en_US/news/articles/2026-09-04/2026_us_open_things_to_know_before_you_go.html .
- **CURRENT GUIDANCE, RECHECK FOR 2027 — accessible venue:** Organizer describes wheelchair-accessible seating subject to availability, ramps/elevators, companion limits and transit/drop-off considerations. No guaranteed seats or particular 2027 accessible parking availability. Source: https://www.usopen.org/en_US/visit/guests_with_disabilities.html .
- **PENDING — 2027 ticket inventory:** Organizer's individual-ticket page thanks 2026 visitors, invites registration for 2027 ticket alerts, and warns about unofficial resellers. This is not evidence of tickets being on sale. Source: https://www.usopen.org/en_US/tickets/individual_tickets/2026/day8 .
- **PENDING — stadium works:** Official FAQ says reimagined Arthur Ashe Stadium anticipated to debut fully by 2027, but 'anticipated' is not a completion guarantee. Source: https://www.usopen.org/en_US/tickets/tickets_faq.html .

## Explicit unknowns / counterexamples
- **UNANNOUNCED:** Verified 2027 tournament start/end, match-by-match draw, day/night session times, ticket inventory/prices, weather rescheduling terms, international broadcasting rights. No dates or tickets should be fabricated.
- Counterexample: a 2026 Grounds Admission holder could access outer courts but **not** Arthur Ashe; a 2027 visitor should not treat a grounds pass as a guaranteed Ashe seat. Likewise, transit route existence does not establish a particular train's 2027 operating time.
- Do not claim 2026 fan-week access or evening gate opening applies in 2027. Do not treat a stadium's expected renovation date as completed.

## Proposed original browser utility (not yet implemented)
Build an evidence-gated session and travel planner that accepts *user-entered* event date/time, admission type, origin, train/walk/security buffers, party size and actual ticket price; uses `America/New_York` DST-aware rendering; computes latest recommended departure and explicit admission-scope warnings; compares user-entered cost scenarios without inventing prices; supports offline localStorage, JSON export/reset, accessible validation and no innerHTML injection. Empty date/time must display **schedule unannounced** instead of a fabricated default. Test midnight/DST, zero/negative/NaN inputs, non-Ashe ticket for Ashe expectation, inaccessible route assumptions, XSS strings and storage failures.

## Publication acceptance
Complete 15KB+ original source where applicable, organizer-linked editorial FAQ, exact canonical and metadata, structured data only with supported facts, independent deterministic Node 22 tests, build/validate/check-latest, index approval and route parity, exact immutable-head CI, feature merge, separate docs-only checkpoint and final-main audit. Until then, keep hub and spokes `noindex,follow`.
