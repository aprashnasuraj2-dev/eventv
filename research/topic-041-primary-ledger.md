# Topic #41 — FIFA Women's World Cup Brazil 2027: primary-source evidence ledger
**Research checked:** 2026-11-09. **Status:** RESEARCH IN PROGRESS — NOT APPROVED, NOT INDEXABLE, NOT DEPLOYED.
**Catalog ID:** 41; slug `fifa-womens-world-cup-2027`; source of topic identity `data/events-50.json`.
**Audience job:** international supporters comparing host-city travel, match-date time zones, official ticket availability and lawful country-specific viewing.

## Confirmed (official FIFA)
1. FIFA host-city page: 24 June–25 July 2027, eight cities and named stadiums: Belo Horizonte / Mineirão; Brasília / Estádio Nacional; Fortaleza / Castelão; Porto Alegre / Beira-Rio; Recife / Arena de Pernambuco; Rio de Janeiro / Maracanã; Salvador / Fonte Nova; São Paulo / Itaquera. Source: https://www.fifa.com/en/tournaments/womens/womensworldcup/brazil-2027/host-cities
2. FIFA 20 August 2026 match-schedule announcement: 32 teams, 64 matches, at least seven matches per city and at least one knockout match per city. Brazil plays Rio (24 June), São Paulo (29 June), Brasília (4 July); Maracanã stages opening and final, São Paulo one semi-final and bronze final. These are **dated official schedule claims**, not a complete final team-versus-team fixture list. Source: https://tickets.fifa.com/organisation/media-releases/womens-world-cup-2027-brazil-maracana-match-schedule-unveiled
3. FIFA ticket FAQ currently lists stage-by-stage venue allocations; it explicitly warns details can change and applicable ticket terms prevail. Source: https://gpcustomersupportfwwc2027.tickets.fifa.com/hc/en-gb/articles/38860635656989-1-When-and-where-will-the-FIFA-Women-s-World-Cup-Brazil-2027-take-place
4. FIFA 10 December 2024 Council announcement confirms dates and 32-team slot allocation; direct qualification and intercontinental playoff are separate. Do not assert that any not-yet-qualified team has a match or draw position. Source: https://tickets.fifa.com/organisation/fifa-council/media-releases/fifa-womens-world-cup-brazil-2027-dates-confirmed

## Pending / not independently confirmed in this ledger
- **Ticket phases, on-sale clock, price, refund and transfer rules:** verify official FIFA ticketing page on publication day; an interest registration is not a ticket or sale.
- **2027 broadcasting rights by US/UK/Australia/Canada/Europe:** independently check FIFA rights holder announcements and the broadcaster's official country/territory terms; never assume 2023 rights roll forward.
- **Full team pairings, kickoffs and exact time zones:** a match-slot schedule exists, but draw and teams can change. Verify every fixture against official dated FIFA schedule; do not manufacture a full draw.
- **Local transit times, airfares, hotel prices, stadium entrance maps, match-day public transport:** no verified live data or official 2027 local operations captured; model user-entered estimates only.
- **Accessibility and visa/entry:** official stadium/organizer and Brazilian government guidance required, nationality-dependent; do not generalize.

## Deep product design / next implementation
A. **Eight-city match-slot evidence matrix:** show only official city/stadium and stage-count anchors; each user-added fixture is marked `USER INPUT — NOT OFFICIAL` until official reference recorded. Export evidence notebook as escaped JSON/CSV; localStorage with schema version and validation.
B. **Brazil-to-world kickoff time converter:** use IANA `America/Sao_Paulo` and user-chosen `Europe/London`, `America/New_York`, `America/Los_Angeles`, `Australia/Sydney`, `Europe/Berlin`; parse user-entered Brazil-local wall time into exact UTC with ambiguity/invalid checks, do not assume current offset holds for 2027.
C. **Intercity itinerary buffer calculator:** user-entered travel durations, city transfer, venue arrival, rest margin and risk buffers; label hypothetical scenarios, refuse negative/missing values, detect overlaps, no real-time route claims.
D. **Ticket and broadcaster evidence ledger:** official-source links, jurisdiction, last checked and state `CONFIRMED/PENDING/HISTORICAL/CONFLICTED`; never present unverified ticket inventory or broadcaster as live.
E. **Editorial:** strong mobile-first stadium table, 8-city travel matrix without invented distances, dated fact badges, deep FAQ, primary citations, accessible controls and explicit unofficial-site disclaimer.

## Required gates before promotion
- Build genuine working utilities and deterministic edge/counterexample tests (DST, date rollover, nonnumeric budget, itinerary conflict, CSV injection, localStorage corruption, unsafe HTML).
- `content/pilots/fifa-womens-world-cup-2027.html` must be original and >15 KB, with matching built output and accurate source anchors.
- Update `data/index-approved.json` only after editorial review and evidence parity; reconcile `research/routes-200.csv` via build. Spokes stay `noindex,follow`.
- PR exact-head CI → merge → final-main reread → docs-only `latest.md` reconciliation PR → exact-head CI → merge → final main audit.
