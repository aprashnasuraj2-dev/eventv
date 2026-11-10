# Topic #42 — FIBA Basketball World Cup 2027 — primary-source evidence ledger

Checked 2026-11-09. **Research in progress; not editorial approval or release authorization.** Canonical registry: `data/events-50.json`, rank 42, slug `fiba-world-cup-2027`.

| Claim | Status | Evidence and editorial constraint |
|---|---|---|
| Tournament Aug 27–Sep 12, 2027, Doha, Qatar; 32 teams | CONFIRMED | [FIBA event guide](https://www.fiba.basketball/en/events/fiba-basketball-world-cup-2027/event-guide), [FIBA Aug 27 2026 release](https://www.fiba.basketball/en/events/fiba-basketball-world-cup-2027-americas-qualifiers/news/fiba-basketball-world-cup-2027-tickets-go-on-sale-as-one-year-to-go-milestone-arrives). |
| One-city hosting; venues described by FIBA as within 30 minutes | CONFIRMED as organizer claim, not a guaranteed journey time | [FIBA release](https://www.fiba.basketball/en/events/fiba-basketball-world-cup-2027-americas-qualifiers/news/fiba-basketball-world-cup-2027-tickets-go-on-sale-as-one-year-to-go-milestone-arrives). Crowd, venue access and traffic may extend actual transfers. |
| Ticket passes currently listed | CONFIRMED snapshot 2026-11-09, mutable | [Official ticket guide](https://www.fiba.basketball/en/events/fiba-basketball-world-cup-2027/event-guide/tickets): Lusail Series from QAR 5,710; Final Phase from QAR 4,700; Follow My Team Qatar from QAR 300. No inference of availability at future checkout, individual-game pricing or tax/fee inclusion. |
| Lusail Series coverage | CONFIRMED organizer description | [FIBA pass explainer](https://www.fiba.basketball/en/events/fiba-basketball-world-cup-2027-european-qualifiers/news/which-world-cup-ticketing-passes-will-be-launched-on-27-august): 32 games (20 group + 12 final); Final Phase 12; Follow My Team Qatar five group games (three first round, two second). Pass entitlement not proof of seat selection or transfer eligibility. |
| 20% early-bird promotion | HISTORICAL, EXPIRED | [FIBA Aug 29 2026 notice](https://about.fiba.basketball/en/news/last-day-to-save-20-on-your-world-cup-2027-tickets) gives Aug 30 cutoff; do not display as currently available. |
| Draw, team-specific fixtures, local tip-off times and country-specific broadcasters | PENDING / not yet verified in this ledger | Never invent a bracket, country qualification, timezone conversion from an unspecified fixture, or universal streaming rights. |
| Entry/visa, accessibility, refunds, ticket transfer, venue access | REVERIFY with primary Qatar government / FIBA terms | Country-specific eligibility and operator terms cannot be extrapolated from a general organizer release. |

## Original utility acceptance design

Build a **Doha multi-game decision planner** with (1) explicitly user-entered fixture times and venues, (2) Doha Asia/Qatar instant conversion to browser-selected IANA zones, (3) collision and user-specified transfer-buffer detection, (4) comparison of official *coverage* for three passes versus a user-selected set of games, and (5) QAR-only budget including user-entered fees, transport and lodging; persist and export user evidence with safe textContent, reset and malformed-input handling. Do not assert venue transfer times or generate fixtures. Pass coverage is categorical; unknown matches must remain UNKNOWN. Counterexample: two nominally distinct matches may still be infeasible even if FIBA describes venues as 30 minutes apart. Tests must include timezone date rollover, duplicate games, overlap, missing start, nonnumeric QAR, XSS string, empty reset and DST in the viewer's timezone.

## Publication hold

No hub approval, sitemap promotion, feature PR or merge until the original working utility, current official sources, editorial HTML, Node 22 build/validate/check-latest, exact PR head CI and post-merge checkpoint all pass. Three unfinished spokes remain noindex,follow. No live deployment.
