> **SUPERSEDED OWNERSHIP (2026-11-10):** The modulo-five topic assignment below is historical. Read `docs/worker-lanes-v2.md` and `data/worker-lanes-v2.json` for the five current non-overlapping contiguous partitions. The source, tool, tests, CI, safety and final-main audit requirements remain effective.

# EventV hourly production contract — Topics #41–200 (v1)
**Owner target:** 200 genuinely useful, original event-topic hubs, not 200 auto-generated low-value pages.
**Repository:** aprashnasuraj2-dev/eventv `main`; **checkpoint:** `latest.md`.
**Scope:** Topic IDs 41–200 inclusive (160 topic slots). The existing 50-topic, 200-route architecture is *not* evidence of 200 completed topic hubs. Topics 51–200 are not yet selected or verified.
**Schedule:** Five independent hourly ChatGPT work tasks, staggered Asia/Kathmandu :01, :13, :27, :39 and :52. A task runs for as long as the available run permits; never claim asynchronous continuation outside that run.

## 1. Immutable lane allocation
| Worker | NPT minute | Exactly owned IDs | Initial topic |
|---|---:|---|---|
| 1 | :01 | 41,46,51,...,196 | FIFA Women's World Cup 2027 |
| 2 | :13 | 42,47,52,...,197 | FIBA Basketball World Cup 2027 |
| 3 | :27 | 43,48,53,...,198 | ICC Cricket World Cup 2027 |
| 4 | :39 | 44,49,54,...,199 | Wimbledon 2027 |
| 5 | :52 | 45,50,55,...,200 | Boston Marathon 2027 |

**Selection:** On every invocation re-read the remote `main` HEAD, `latest.md`, `data/index-approved.json`, topic catalog(s), route CSV, CI state and open PRs. In own lane select the first incomplete ID; do not select a later ID while an earlier one is incomplete, blocked or has an open PR. `index-approved` is not sufficient by itself: confirm meaningful tool, source accuracy, route parity and static output. Do not duplicate previously complete work. A different lane's IDs are strictly off-limits.

**No overlap:** Use one topic-specific feature branch/PR per topic, such as `eventv/topic-041-lane-1`; never edit another lane's topic files. Before a new attempt, inspect existing branch/PR for the same ID and recover it rather than opening a duplicate. Never force-push, overwrite a newer `main`, or rebase blindly. On retry re-check the PR's exact head SHA, CI and main state. If merge conflicts or another runner updates shared files, stop/rebase carefully on freshly fetched main and rerun the full gates. Use GitHub SHA/CAS guards for all guarded operations where available. The shared `latest.md` is updated only *after* feature-merge main re-read, as a separate docs-only PR, to reduce contention.

## 2. Catalog growth / infrastructure gate
- #41–50: take exact identities from `data/events-50.json`; reconcile their approval and scaffold status before editing. Do not assert that an existing #47–50 hub is absent without checking.
- #51–200: **not in the current registry**. Establish a versioned, authoritative expandable catalog and unique-ID/slug/source validation before building any >50 topic. Worker 1 owns the initial **infrastructure-only** PR to adapt build, validators, routes, sitemap and counts without downgrading or changing the existing 200 routes, 35 approvals or unapproved noindex safeguards. Block >50 releases until that PR is merged with exact-head CI and final-main audit. Other workers may work only #41–50 or prepare nonpublishing research while this gate is unmet.
- Select each #51–200 candidate from evidenced event-demand and a real differentiated user job, not numbering pressure. Check prior topics, slug/canonical collisions, organizer identity, repeat-year collisions, search-intent cannibalization, accessibility/licensing, plausible Tier-1 audience and practicality of a browser-native original tool. Official/organizer/government sources preferred. Propose an ID-specific researched candidate with evidence; merge candidate into canonical catalog using exact-head PR and duplicate validation before marking the topic approved. If no defensible candidate exists, mark `DISCOVERY_REQUIRED`, do not invent events or dates.
- Do **not** equate 200 unique topic hubs with 800 automatically released routes. The existing 50 × 4 route architecture must be preserved, while each new hub is original; additional planning/during/after spokes are optional and remain `noindex,follow` until each separately earns editorial approval.

## 3. One deep topic's mandatory work
1. **Preflight:** match topic ID to official record; audit `content/pilots/`, `events/<slug>/`, approval registry, source ledger, manifest, routes, assets, stale/duplicate URL and any open PR. Record source checked-at date, status: `CONFIRMED / PENDING / HISTORICAL / CONFLICTED / UNANNOUNCED`.
2. **Research:** verify event dates, time zones, site/venue, tickets, registration, eligibility, access, broadcast/stream availability, rules, geography and dates *only* if an authoritative current source supports them. Separate 2026 history from 2027 facts; no fake live schedules, prices, bracket fixtures or country rules. Keep uncertainties and at least one practical counterexample. Name gaps and source conflict visibly.
3. **Original utility:** create a premium, topic-specific, genuinely functioning browser-side tool; e.g. conflict planner, evidence notebook, eligibility decision tree, time-zone comparator, real input budget, lineup/fixture evidence tracker, accessibility planning or localStorage shortlist. Tools must handle empty/invalid input, reset, escaped text, DST/currency/jurisdiction boundaries, exports where valuable, and no backend/paid API claims without verification. No empty interactive mockup, duplicate theme swapped from another event, fictional data or opaque calculators.
4. **Editorial and design:** concise and useful sourced answer above fold, deep FAQs with individual answers, source-linked citations and as-of dates, strong mobile UX, accessible keyboard/focus/contrast, tested SEO metadata, canonical, and structured data *only* consistent with visible official facts. Distinguish official source → fact → user-entered scenario → inference. Create distinctive safe original visuals only when worthwhile.
5. **Evidence and tests:** add deterministic utility tests for real/edge/counterexample cases; assert content-to-source, canonical/registry/route parity, missing data safeguards, no unsafe innerHTML/XSS, broken links where testable, schema, locale formatting and mobile build stability. Run Node 22 `node scripts/build.mjs`, `node scripts/validate.mjs`, `node scripts/check-latest.mjs` where applicable and any topic-specific tests; fix every required gate, do not weaken tests to pass.
6. **SEO gate:** only source-supported, unique, editorially approved hub may become `index,follow` and enter approved sitemap. Unfinished spokes stay `noindex,follow`; unapproved hubs also noindex. Avoid duplicate canonicals, thin pages and keyword cannibalization. Verify output HTML equals approved source where required.
7. **Git lifecycle:** fresh feature branch → implementation → local/CI validators → PR → CI on *exact immutable PR head SHA* → merge only if passing and head unchanged → re-fetch `main` → independent docs-only `latest.md` reconciliation PR → exact-head CI → merge → final `main` registry/source/output/robots/count audit. Failed CI heads and important bugs belong in the handoff log; do not falsely claim a merge from passing CI alone.
8. **Handoff:** report topic ID/name, sources date and uncertainty, real tool capabilities, test evidence, feature PR/head/run, final main SHA, indexability, what remains and the next lane ID. If interrupted, preserve branch/PR evidence and resume that **same** topic next hour. Never mark complete on mere draft/PR/CI or publish to production without a separate verified deployment authorization.

## 4. Safety / operational constraints
- Respect `latest.md` and `docs/editorial-publication-qa.md`; preserve Cloudflare, blogs, Panchang, atlas, library, tools and all unrelated production assets. No implicit live deployment, no invented DNS/Cloudflare access.
- No hidden/fake ads, auto-impressions, auto-clicks, artificial engagement, unauthorized scraping/feeds, trademark imagery reuse, or false official affiliation.
- A topic may legitimately take multiple hourly invocations; quality is the gate. Do not trade evidence or functioning tools for a 1-topic/hour headline.
- If blocked by authorization, inaccessible primary sources, missing repo access, CI failure or context/compute limits, record the exact blocker and stop that topic safely rather than promoting it.
- Stop selecting new IDs after #200 and report an evidence-based terminal audit: total validated deep hubs; unapproved/blocked; broken gates; live deployment status separated from merged code.

## 5. Acceptance proof
Topic COMPLETE requires: merged **final main** with original tool and primary-source verification, audited canonical/robots parity, all required CI passing on exact-head and post-merge audit, and `latest.md` reconciliation. Keep separate counts for *discovered*, *researched*, *in PR*, *merged*, *index-approved*, *deployed* and *measured traffic*. No completion claim solely from a generated file or scheduled-task success.

## 6. Enabled task registry (2026-11-09 NPT)
Task automation creation and enabled flags were verified, but no hourly run has yet proved code execution, CI or publication. All run every hour with Asia/Kathmandu timezone; next-run estimates were not returned by the scheduler.

| Worker | Minute (NPT) | Automation ID |
|---|---|---|
| 1 | :01 | `6af1c5bc67d08191a3ff609d0af2582f` |
| 2 | :13 | `6af1c5bf7628819188c122426fc9edee` |
| 3 | :27 | `6af1c5c40be881918d8970d70235902c` |
| 4 | :39 | `6af1c5c888008191a354b0d4d2b467d7` |
| 5 | :52 | `6af1c5ccaab48191bb60d7bdc2b0534e` |

When a lane finishes all 32 owned topics, pause its own automation; no other lanes should keep reworking completed IDs. Check each actual run's PR and main evidence independently; task enabled is not topic completion.
