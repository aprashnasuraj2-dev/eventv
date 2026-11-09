# Topic #43 — ICC Men's Cricket World Cup 2027 — evidence ledger (draft)
Checked: 2026-11-09. Lane 3 only. **Research only; NOT editorial approval or deployment.**

## CONFIRMED (ICC primary publications)
- Tournament: 2 October–21 November 2027, South Africa/Zimbabwe/Namibia; 14 teams, 57 matches, 12 venues. Source: https://www.icc-cricket.com/tournaments/icc-cricket-world-cup-2027/news/fixture-schedule-announced-for-icc-men-s-cricket-world-cup-2027 (published 2026-10-01).
- Super Series in Windhoek 2, 4, 6 October; group-stage opener India v Australia in Cape Town 7 October; India v Pakistan in Johannesburg 10 October. Source: ICC fixture announcement above. Match schedules may subsequently be amended; recheck before publication.
- Two six-team groups, top three in each plus better fourth-place finisher progress to Super 7. No points carry over. Super 7 is 25 October–14 November. Semi-finals: Cape Town 17 November, Tshwane 18 November; final Johannesburg 21 November, reserve day 22 November. Sources: fixture announcement and https://www.icc-cricket.com/tournaments/icc-cricket-world-cup-2027/news/when-does-the-2027-cricket-world-cup-start-key-details-ahead-of-tournament (2026-10-02).
- Knockout start times: 10:00 local time per ICC venue announcement https://www.icc-cricket.com/tournaments/icc-cricket-world-cup-2027/news/icc-men-s-cricket-world-cup-final-and-semi-final-venues-revealed (2026-10-01). Verify timezone and changes before displaying any localized instant.
- Ballot: free, not first-come-first-served; one entry per person per match, up to four tickets requested per match; deadline 21 November 2026 23:59 CAT. Entry does NOT guarantee purchase. https://www.icc-cricket.com/media-releases/icc-receives-120-million-ticket-requests-for-men-s-cricket-world-cup-2027 (checked 2026-11-09); https://www.icc-cricket.com/tournaments/icc-cricket-world-cup-2027/news/ticket-ballot-to-go-live-for-men-s-cricket-world-cup-2027 (2026-09-30).
- ICC published indicative ticket price endpoints R158–R514 in fixture announcement; NOT a promise of availability, per-match price, final checkout cost or exchange rate.

## CONDITIONAL / PENDING
- Super 7 labels A1/A2/A3/AB4/B1/B2/B3 are **pre-seeded slots, not guaranteed teams**. ICC explicitly says Bangladesh may replace Sri Lanka in B3 if Bangladesh qualify and Sri Lanka do not. A tool must display slots first, optional scenario teams separately, and never claim a pre-seeded fixture is certain.
- Qualifier A/B and Super Series final entrant unresolved until actual qualification. Never prefill winners or bracket.
- Ballot success, ticket availability, resale eligibility, travel visas, border-entry rules, transfers, accessibility and transport depend on traveler/date/venue; no verified universal rule.
- ICC schedule-launch broadcast list is for the **2026 schedule-launch show**, not a 2027 tournament-rights confirmation. Do not repurpose its licensee table as tournament viewing availability.
- Cross-border travel duration, traffic, hotels and exchange rates are user-entered assumptions, not live estimates.

## Functional hub specification (NOT IMPLEMENTED)
Browser-local fixture shortlist with explicit official/conditional labels; user-selected timezone using Intl; invalid/missing start-time guard (date-only display rather than fabricated kickoff); match-to-match transfer buffer calculator using user-entered durations, city/country changes and calendar rollover; accessible localStorage save/reset/JSON export; HTML escaping and deterministic tests for slot substitution, DST transitions, impossible travel, missing times and empty input.

## Release guard
Current registry #43 and all four routes remain unapproved/noindex. Do not edit approval, route CSV, sitemap or latest.md before feature implementation + tests + exact-head CI. The source and date ledger is preparatory evidence, not a complete hub.
