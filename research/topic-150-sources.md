# Singapore Grand Prix 2027 — official research evidence checked 2026-11-12

- Official Singapore 2027 page: https://www.formula1.com/en/racing/2027/singapore
- Official ticket and promoter navigation: https://tickets.formula1.com/en

## Confirmed and caveats
- Formula 1's 2027 race calendar schedules the Singapore Grand Prix weekend for 8–10 October 2027.
- F1 shows Friday 8 October Practice 1 and Practice 2, Saturday 9 October Practice 3 and Qualifying, Sunday 10 October Race; every clock time remains TBC.
- Singapore Standard Time stays UTC+8. A late finishing session can cross midnight in a spectator's transfer calculation.
- Transport departure times, gate exit restrictions and road closures must come from transport authorities; the calculator intentionally contains no real departure feed.

## Counterexample
A ticket valid for Sunday racing cannot guarantee that a user-entered last metro departure exists after a delayed end or a 45-minute exit queue.

## Not established
Exact 2027 session clock time, personal ticket or track-zone entitlement, queue/transport and international broadcasting remain unverified. User-entered calculations are hypothetical; noindex, no editorial sign-off, no release.

## Modeling edge cases
- The planner requires complete Singapore-local calendar dates for both a hypothetical session end and a separately verified last departure; it supports a following-day departure after midnight.
- It rejects impossible session/day combinations and departures before the session end, and caps the last-departure scenario gap at 12 hours.
- A sensitivity output tests a further 15-minute delay. None of these inputs constitutes actual transit or race scheduling data.
