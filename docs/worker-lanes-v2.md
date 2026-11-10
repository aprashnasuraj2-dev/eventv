# EventV worker isolation and throughput contract (v2, 2026-11-10)

**This contract supersedes the lane-ID assignment in `docs/hourly-200-topics-v1.md`.** The old document still specifies source, research, accessibility, SEO, tests, CI and final-main safety gates. These are retained. The machine-readable authority for ownership is `data/worker-lanes-v2.json`.

## Exclusive partitions

| Worker | IDs inclusive | Count | Existing task | Nepal minute |
|---|---|---:|---|---:|
| A | 170–200 | 31 | `6af1c5bc67d08191a3ff609d0af2582f` | :01 |
| B | 131–169 | 39 | `6af1c5bf7628819188c122426fc9edee` | :13 |
| C | 100–130 | 31 | `6af1c5c40be881918d8970d70235902c` | :27 |
| D | 75–99 | 25 | `6af1c5c888008191a354b0d4d2b467d7` | :39 |
| E | 1–74 | 74 | `6af1c5ccaab48191bb60d7bdc2b0534e` | :52 |

All 200 IDs belong to exactly one lane. Topic #75 belongs to D; #131–140 belong to B to close the previously uncovered gap. Legacy #1–74 belong to E, including unfinished FIFA Women's World Cup 2027 #41 and existing PR #67. A must stop writing #41. Previously merged topics are **audited**, not rebuilt; branch names from the former lane scheme are historical evidence, not ownership authority. Never delete or force-reset them. New topic branch format: `eventv/topic-NNN-lane-X` where X is A/B/C/D/E. One existing feature PR per ID; no duplicates. Review live GitHub and the canonical registries before concluding that an ID is incomplete.

## Independent topic workspace

Each worker changes only its topic scope: `data/topics/NNN.json` for >50 candidates (official-source-verifiable metadata, no invented edition); `data/approvals/NNN.json` for editorial approval after evidence; `content/pilots/<slug>.html`, `events/<slug>/`, `assets/<slug>*`, `tests/topic-NNN*`, `scripts/topic-NNN*`, `research/topic-NNN*`. Do not edit any other lane's topic source or PR.

**Shared-write exclusion:** Do NOT edit `scripts/build.mjs`, `scripts/validate.mjs`, `scripts/catalog.mjs`, `data/events-extra.json`, `data/index-approved.json`, `research/routes-200.csv`, `research/search-intents-1000.csv`, `index.html`, `events/index.html`, `latest.md`, or CI/workflow files in a topic feature PR. Shared changes must go through a narrowly scoped serialized integration PR based on a fresh main head, guarded with exact-head CI, then a docs-only checkpoint. The candidate registry supports sparse IDs; absence of #51–169 is NOT a reason to invent those identities or block independent work on #170.

For >50, one independently researched, unique candidate is stored in its own per-ID manifest `data/topics/NNN.json`, not appended by competing workers to a common JSON array. The legacy 50 and original extension file remain intact. Approved manifests can be stored in separate `data/approvals/NNN.json` files. The Node 22 catalog reads entries sorted by numeric rank and rejects collisions; no sequential-ID assumption beyond original 1–50. New routes are not considered shipped until the generated route inventory, source/output and indexing gates pass. Unapproved hubs and all unfinished spokes remain `noindex,follow`.

## One topic, one commit, two-topic target

A scheduled run **targets two fully completed topics**, not two drafts, builds, or PRs. Quality, source confidence and exact-head CI override the numerical target; if only one passes, ship one, and if none passes report a precise blocker. Batch research, functional implementation, deterministic and browser tests, responsive/accessibility checks and source citations before opening PR. Use **one topic-specific PR, squash-merge to ONE atomic commit on main per completed topic** (intermediate corrections on the feature branch do not count as completed topics). A topic is complete only after latest.md docs-only checkpoint and final-main audit, not merely after a passing unit test.

### Serial release interface
1. Re-read live `main`, approval routes, all open PRs, catalog and prior completion proofs. If existing unfinished PR belongs to the newly assigned lane, recover its files (e.g. E handles legacy #67) onto a fresh safe branch without destroying original history.
2. Produce independently verified primary-source ledger, visible CONFIRMED/PENDING/HISTORICAL/UNANNOUNCED, counterexamples, functioning topic-specific offline browser utility, real error/edge tests and Node 22 build/validate. Avoid boilerplate or fabricated live data.
3. Topic PR contains exclusively owned topic paths. Run CI on exact immutable head. Squash-merge only unchanged passing head. Immediately re-read main.
4. Reconcile shared built inventories, generated page outputs and editorial approval in a narrowly scoped **serialized integration PR** when needed, based on latest main, with no rewrites of other topics. Retest all routes, SEO and authorization. No claiming completed topic before these are merged.
5. Complete docs-only `latest.md` checkpoint PR with exact-head CI and final-main audit. Re-read head before each merge; failures are preserved and corrected, never waived.
6. Proceed to second owned incomplete topic if first is complete and execution permits. Otherwise preserve exact branch/PR/head/CI/blocker. Do not start third unless first two satisfy gates.

## Why paths alone cannot guarantee complete parallel publishing
Per-ID isolation eliminates topic-file collisions, but a single site-wide sitemap, route CSV, and navigation index still require serialized reconciliation. A worker cannot claim a hub is index-ready just because a sparse catalog entry exists. This architecture deliberately separates parallel editorial production from guarded shared publication. No live deployment is authorized.

## Verifiable acceptance and stopping
Every run reports topic ID, source verification date, actual original utility and edge/browser tests, feature PR/head and exact-head CI, merge main SHA, shared integration/checkpoint SHA, current `index/noindex` and next owned ID. Distinguish **merged**, **index-approved**, **deployed** and **traffic**. Stop at #200. A worker pauses ONLY its own saved task when all IDs in its lane have passed final-main audit. No fake clicks, hidden ads, false throughput or invented fixture/ticket/broadcast data.
