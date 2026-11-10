# Topic #45 — Boston Marathon 2027 · primary-source decision ledger

Checked: 2026-11-09. Editorial status: RESEARCHED, NOT APPROVED. Scope: open qualifying field only; para/adaptive and wheelchair have distinct rules. Do not apply open-field time standards or cutoff to those divisions.

## Confirmed facts
- Race Monday April 19, 2027. B.A.A. September 14 release: https://www.baa.org/news/qualifier-registration-for-131st-boston-marathon-presented-by-bank-of-america-begins-today/
- Qualifier registration September 14–18, 2026, closed; qualifying window began September 13, 2025; official net/chip time on certified eligible outdoor full-marathon courses. Qualifying standard is an application threshold, not acceptance. https://www.baa.org/races/boston-marathon/qualify/
- Official 2027 open-field standards, ordered ages 18–34,35–39,40–44,45–49,50–54,55–59,60–64,65–69,70–74,75–79,80+: men's [2:55,3:00,3:05,3:15,3:20,3:30,3:50,4:05,4:20,4:35,4:50]; women's and nonbinary [3:25,3:30,3:35,3:45,3:50,4:00,4:20,4:35,4:50,5:05,5:20]. Age is race-day age, not qualifying-race age. https://www.baa.org/races/boston-marathon/qualify/
- Verified 2027 competitive acceptance cutoff **5:17** below applicable standard, announced September 29, 2026. This is an actual historical decision for 2027 applicants, NOT a prediction for 2028 and NOT proof an individual was accepted. https://www.baa.org/news/record-field-of-qualifiers-accepted-into-the-131st-boston-marathon-presented-by-bank-of-america/
- Net downhill measured from course start to finish: <1500 ft no adjustment; 1500–2999 ft +5:00; 3000–5999 ft +10:00; >=6000 ft ineligible. Confirm certification and B.A.A. verification. https://www.baa.org/races/boston-marathon/qualify/
- 2027 Boston Qualifier Selection adds a random opportunity for qualifying applicants not faster than competitive cutoff; approximately 1000 selections, NOT a guaranteed second acceptance. Only applicants in the closed registration process are eligible. https://www.baa.org/news/registration-updates-and-information-announced-for-2027-boston-marathon-presented-by-bank-of-america/
- The 2027 qualifier registration will not reopen. 2028 qualification window began September 19, 2026; future registration dates require new B.A.A. confirmation. https://www.baa.org/news/2027-boston-marathon-presented-by-bank-of-america-registration-update/
- 2027 accepted-qualifier entry fee $270 USD according to September 14 announcement; does not cover travel, accommodation, insurance or charity entry. https://www.baa.org/news/qualifier-registration-for-131st-boston-marathon-presented-by-bank-of-america-begins-today/

## Distinct divisions and counterexamples
- Para/adaptive program has separate standards and possible program-specific cutoff; open-field 5:17 must never be reused for it. https://www.baa.org/races/boston-marathon/info-for-para-adaptive-athletes/adaptive-program-for-runners/
- Wheelchair division has sport-class-specific standards; open-field calculator must explicitly exclude it. https://www.baa.org/races/boston-marathon/info-for-para-adaptive-athletes/boston-marathon-wheelchair-division/
- Runner at 3:24:00 with a 3:25:00 standard qualifies to APPLY but did not clear the 5:17 competitive threshold; a submitted qualifying application could be eligible for random selection.
- Runner at 2:50:00 against 2:55:00 standard misses competitive cutoff by 17 seconds, even though 5:00 faster than standard.
- Runner at 2:45:00 on a certified 3500-ft net-downhill course is indexed to 2:55:00; compare indexed time, not raw result.
- Runner at 2:30:00 on 6000-ft net-downhill course is not eligible, regardless of speed.
- A 17-year-old on race day, an uncertified course, a virtual race, an out-of-window result, or no timely registration invalidates any automated acceptance claim.

## Tool contract before publication
Input race-day age, B.A.A. category (men/women/nonbinary; separate program link), chip time hh:mm:ss, net elevation drop ft, certified eligible outdoor full-marathon checkbox, qualifying date, and application-submitted checkbox. Validate all ranges and exact boundary values; calculate indexed time in integer seconds and margin against published standard. Output three independent verdicts: **meets standard to apply**, **clears 2027 competitive cutoff (conditional on B.A.A. verification and actual application)**, **possible random-selection consideration**. Never output "accepted" from user-entered inputs. Explain unavailable eligibility when registration closed. Provide source anchors, accessible results and no personal data collection. Add deterministic boundary and adversarial tests before approval.

## Pending / not asserted
Individual acceptance or random-selection result, 2027 exact start waves, 2027 spectator transport schedules, final official athlete guides, live availability, 2028 cutoff, personal course certification. Require direct current B.A.A. evidence before adding.
