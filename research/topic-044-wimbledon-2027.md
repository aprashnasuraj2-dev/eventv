# Topic #44 — Wimbledon 2027 primary-source research (WORK IN PROGRESS)
Checked: 2026-11-09. Owner: lane 4. This document is NOT publication approval.

## Confirmed
- The Championships: **28 June–11 July 2027**, per official [future dates](https://www.wimbledon.com/en_GB/the_championships/dates).
- The 2027 Public Ballot application window opened 1 September 2026 and closed 14 September 2026 at 23:59 BST, per [Wimbledon ticket FAQ](https://help.wimbledon.com/hc/en-gb/articles/15474338903452-Does-signing-up-for-a-myWimbledon-account-mean-that-I-have-entered-the-ballot). Account registration alone was **not** ballot entry.
- Official [ballot guidance](https://www.wimbledon.com/en_GB/tickets/ballot.html): no choice of court/day/seat in the ballot; one application per household/email/myWimbledon account. Unsuccessful entrants may access returns shop subject to official conditions.
- Official [wheelchair ballot FAQ](https://help.wimbledon.com/hc/en-gb/articles/10571045434012-How-do-I-enter-the-Wheelchair-Ballot): 2027 wheelchair ballot same 1–14 September 2026 window, overseas applicants included.

## Historical 2026 guidance — NOT confirmed 2027 operational policy
- [The Queue](https://www.wimbledon.com/en_GB/tickets/the_queue) 2026 guide: limited daily on-day Show Court/Grounds tickets, one per person, nontransferable; queue card does not guarantee admission; capacity and weather constrain entry; accessibility waiting area exists. **Do not copy 2026 opening hours, quotas, bag fees or app requirements into 2027 as confirmed facts.**
- [Ticket purchasing FAQ](https://help.wimbledon.com/hc/en-gb/articles/15474175030300-How-can-I-purchase-tickets-for-The-Championships): ballot, official hospitality and on-day Queue as channels; verify 2027 channel-specific conditions before advising.

## Pending / unannounced / not inferred
- 2027 daily order of play, draws, players, rain interruptions, queue operating hours and ticket allocations, ticket availability and prices, country-specific broadcasting and replay rights.
- The current Wimbledon schedule pages can display **2026 results beneath a 2027 header**. Never interpret that as a 2027 draw or fixture.
- Accessible seating inventory and 2027 travel disruption schedules need dated primary-source verification.

## Proposed original utility (not implemented yet)
A browser-local **Wimbledon attendance decision planner**: day-by-day 2027 date picker; separate ballot/Queue/official hospitality channels with verified eligibility warnings; queue arrival and transit buffers as user-entered *scenarios*, not promised entry; rain contingency and accessibility checklist; evidence-linked notes and localStorage export/reset. Tests: invalid dates, sold-out/no admission counterexample, one-person-one-queue-ticket rule, user timezone DST, escaping of note fields, export and persistence. No live availability claim.

## Release gate
Keep #44 noindex until original UI, deterministic tests, Node 22 build+validate+latest checks, exact-head CI, feature merge, separate docs-only latest reconciliation, and final-main audit. No deployment authorized.
