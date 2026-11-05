# EventV — latest status and resume point

> **Single source of truth for current project progress and the next work.**
> Read this file first whenever resuming EventV. Update it **in the same commit/PR** as every meaningful repository change. Historical research files remain references, not the live project status.
>
> **Last reviewed:** 2026-11-05 (Asia/Kathmandu)  
> **Checkpoint:** Third editorial pilot built — Steam Next Fest June 2027 hub  
> **Status:** **3 SOURCE-VERIFIED INDEX-READY PILOT HUBS IN REPO; LIVE DEPLOYMENT NOT PERFORMED**

## 1. Current verified state

| Area | Status | Verified detail |
|---|---|---|
| GitHub repo | **Working** | [`aprashnasuraj2-dev/eventv`](https://github.com/aprashnasuraj2-dev/eventv), default branch `main` |
| Most recent feature change | **Merged** | [PR #3](https://github.com/aprashnasuraj2-dev/eventv/pull/3), squash commit [`1ff5d54`](https://github.com/aprashnasuraj2-dev/eventv/commit/1ff5d54fe05f0b826ec6440d049414c29f2edc9e) — Steam Winter Sale 2026 pilot |
| CI at feature checkpoint | **Passed** | [GitHub Actions run 42006505833](https://github.com/aprashnasuraj2-dev/eventv/actions/runs/42006505833) on merged second-pilot commit |
| Candidate event topics | **50 defined** | [`data/events-50.json`](data/events-50.json), [ranked topics](TOP_50_TOPICS.md); eclipses excluded |
| Search intents | **1,000 generated hypotheses** | [`research/search-intents-1000.csv`](research/search-intents-1000.csv); **not** verified keyword volumes, demand or attainable rankings |
| Canonical event routes | **200 mapped** | [`research/routes-200.csv`](research/routes-200.csv) |
| Generated static pages | **202 HTML files** | 50 event hubs + 50 planning + 50 during + 50 after = **200** event pages; 2 index/navigation pages |
| Build and validation | **Passing at feature checkpoint** | `node scripts/build.mjs`, `node scripts/validate.mjs` on Node 22 |
| Individual SEO-ready event pages | **3 pilot hubs approved in repo** | Steam Next Fest Feb 2027 + Steam Winter Sale 2026 + Steam Next Fest June 2027 are source-verified, visually designed, interactive, structured, reference-backed and `index,follow`; **not deployed live** |
| Subdomains | **Proposed only** | 50 optional names in manifest; **no** DNS/TLS/host routing configured |
| Website deployment | **Not performed** | No deployment to aafnaipatro.com, Cloudflare, Pages, or standalone event host verified |
| Adsterra monetization | **Not implemented in EventV** | No event ad scripts, verified paid impressions or realized CPM measured by this repo |
| Live GSC/GA4/Adsterra traffic measurements | **Unavailable** | Do not interpret the scores or 1,000 intent ideas as measured traffic or SEO wins |

**Evidence rule:** A successful CI build validates file counts and static-safety constraints; it does **not** prove editorial quality, Google indexing, organic traffic or deployment.

## 2. Fixed product/SEO decisions

1. **Goal:** legitimate high-opportunity, Tier-1 organic traffic from evergreen + date-specific event utilities and sourced editorial, with lawful Adsterra monetization after real users visit. Focus US/UK/Canada/Australia/Western Europe.
2. **Exclude all eclipse / astronomy event proposals.** Do not restore eclipse to the current top-50 shortlist; old archived research is not an instruction to pursue it.
3. **One primary domain:** preferred canonical `https://aafnaipatro.com/events/<event-slug>/`. An optional subdomain has the form `<event-slug>.aafnaipatro.com`, **not** `<event-slug>-aafnaipatro.com` (the latter is another registrable domain). Do not publish both hosts as separately indexable copies.
4. **50 clusters / 1,000 intents / 200 event routes is the architecture**, not a directive to release 200 low-value pages. Consolidate overlapping queries when one useful URL serves them better.
5. **All generated event HTML remains `noindex` until independently approved, original, useful content and its source validation exist.** No fabricated live updates, hidden ads, forced clicks, synthetic impressions, ad refresh loops or misleading markup.
6. **Protect existing aafnaipatro.com deployments.** Before any live release, inventory Cloudflare route ownership/static assets and preserve unrelated Workers, Panchang, library, blogs, date pages, atlas and branded tools. This repository has no authorization to overwrite them blindly.
7. Rankings, opportunities, scores, CTR and monetization amounts are **analytical hypotheses** until supported by GSC and real account evidence.

## 3. Immediate next work (ordered; incomplete)

| Priority | Task | Acceptance evidence | Status |
|---|---|---|---|
| **P0** | **Revalidate candidate dates and pick 3–5 pilot clusters** against official organizers and current US/UK/CA/AU Google SERPs | Source/date ledger with checked date; query-level SERP competitors, features and clickability; reasons to choose or drop | **TODO** |
| **P0** | **Build actual original utility for first pilot** | Steam Next Fest February 2027 hub now includes browser-local countdown/time conversion and private demo shortlist; source references and accessibility included | **DONE IN REPO; NOT DEPLOYED** |
| **P0** | Replace first 4–8 pilot HTML scaffolds with independently sourced, edited pages; deduplicate intents | Source-supported content, editorial reviewer, targeted keyword-to-URL plan; per-URL quality and legal review | **TODO** |
| **P0** | Audit existing AafnaiPatro Cloudflare and static route parity before release | Written path inventory, collision test and rollback plan; existing production routes preserved | **TODO** |
| **P1** | Establish SEO and analytics baseline | GSC verified property, current target-country organic queries/clicks; GA4 session definitions; measured ad metrics where authorized | **TODO** |
| **P1** | Define deployment and canonical strategy | Chosen Cloudflare Pages/static host, TLS/DNS, path redirects, correctly generated approved-only sitemap and robots behavior | **TODO** |
| **P1** | Launch **only approved URLs** after staging QA | HTTP checks, user-visible functionality, metadata/schema/source checks, production click tests, no regressions, smoke-test log | **TODO** |
| **P2** | Repeat for more event clusters based on observed performance | Actual GSC impressions/clicks, engaged visits, verified paid ads and content-hours ROI; stop low-value clusters | **TODO** |

**Next action to execute:** Complete query-level SERP validation for all three approved Steam pilots (US/UK/CA/AU desktop + mobile), then verify production AafnaiPatro/Cloudflare route parity before deployment. Keep the other 197 event pages `noindex` until individually approved.

## 4. Implementation files and run commands

- [Research and ranking](TOP_50_TOPICS.md) · [Event metadata](data/events-50.json) · [1,000 search intents](research/search-intents-1000.csv) · [200 static-route ownership records](research/routes-200.csv)
- [Build script](scripts/build.mjs) · [Validation script](scripts/validate.mjs) · [Site source](events/) · [Existing quarterly checklist](CHECKLIST.md)
- [Canonical/subdomain design](docs/host-routing.md) · [Publication gates](docs/editorial-publication-qa.md) · [Staging snapshot](https://github.com/aprashnasuraj2-dev/eventv/tree/release/v0.1.0-static-staging)

```bash
git clone https://github.com/aprashnasuraj2-dev/eventv.git
cd eventv
git switch main
node --version   # use Node.js 22+
node scripts/build.mjs
node scripts/validate.mjs
```

For any new feature, create a branch from current `main`, make the change, update **this file** with the new measured result and remaining work, run the tests, and merge only after passing CI. Do not mistake generated HTML content for audited production output.

## 5. How to update this file after every work session

1. Verify GitHub's **actual** current `main` head and check results. Do not claim tests or deployment passed without output.
2. Update the date, checkpoint and state table; distinguish **done / in progress / blocked / not started**.
3. Record new commits, PRs, Actions links, deployed URLs and first-party metrics **only when verified**. If unavailable, write **unverified**.
4. Mark finished tasks, add specific next actions and owner/blocker, and keep this document concise enough to resume quickly.
5. Use one canonical `latest.md`; **do not create `latest-v2.md`, status copies or conflicting handoff documents**. Preserve historical decisions in Git history.
6. Commit the updated `latest.md` together with the corresponding source changes. CI checks changed-file coverage on PRs and pushes; if direct pushes bypass protection, reviewers must still enforce the rule.
7. **Start future sessions by reading `latest.md` before making changes**, then confirm its claims against repository HEAD and CI. Treat this document as a living ledger, not as proof by itself.

## 6. Last completed work log

| Date | Change | Verified evidence |
|---|---|---|
| 2026-11-05 | Generated 50 active (non-eclipse) event clusters, 1,000 intent hypotheses, 200 event HTML plus 2 navigation HTML | [Merged PR #1](https://github.com/aprashnasuraj2-dev/eventv/pull/1); [passing main validation](https://github.com/aprashnasuraj2-dev/eventv/actions/runs/42001822022) |
| 2026-11-05 | Added canonical `latest.md` resume-point ledger and CI enforcement requiring status updates alongside code changes | Passed GitHub Actions on main | 
| 2026-11-05 | Built first real pilot: Steam Next Fest February 2027 source-verified hub, responsive visual design, time-zone/countdown utility, local demo shortlist, SEO metadata/Article+Breadcrumb structured data, compact bottom references; only this route is index-ready in source | [PR #2](https://github.com/aprashnasuraj2-dev/eventv/pull/2) merged as `ee59e68`; [main CI passed](https://github.com/aprashnasuraj2-dev/eventv/actions/runs/42005528032); no live deployment |
| 2026-11-05 | Built second pilot: Steam Winter Sale 2026 source-verified hub with local time/countdown, discount calculator, private budget planner, Steam seasonal-sale mechanics, Steam Awards placeholder discipline, SEO metadata and compact bottom references | [PR #3](https://github.com/aprashnasuraj2-dev/eventv/pull/3) merged as `1ff5d54`; [main CI passed](https://github.com/aprashnasuraj2-dev/eventv/actions/runs/42006505833); no live deployment |

| 2026-11-05 | Built third pilot: Steam Next Fest June 2027 source-verified hub with local clock/countdown, June-vs-February comparison, demo-capacity calculator, persistent seven-day priority sprint planner, developer workback, SEO metadata and compact bottom references | Feature PR/CI to be verified before merge; no live deployment |
