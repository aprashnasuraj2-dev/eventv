# EventV — 50 event clusters and 1,000 SEO intent hypotheses

> **Resume work:** [`latest.md`](latest.md) is the sole maintained project checkpoint: verified status, blockers, next tasks and handoff procedure. Update it in the same commit as each meaningful project change.
**Research-stage static release candidate · 2026-11-05 · no deployed website**

## Scope and counts
- 50 non-eclipse topics in `data/events-50.json`, with source links, date confirmation flags, five topic-specific information jobs and estimated editorial scores.
- 1,000 **proposed** search-intent records in `research/search-intents-1000.csv` = 50 × 5 facets × 4 phases. These are editorial hypotheses, **not** measured search-volume keywords or verified impressions.
- 200 static event HTML pages = 50 overviews + 50 planning pages + 50 during-event verification pages + 50 after-event templates; plus root and event directory: **202 HTML files**.
- 200 canonical route mappings in `research/routes-200.csv`; 50 optional subdomain names in the JSON manifest.
- `scripts/build.mjs` regenerates HTML/CSS/CSVs. `scripts/validate.mjs` checks counts and safeguards.
- **197 event pages remain `noindex,follow`.** Three source-verified pilot hubs are marked `index,follow` in the repository: Steam Next Fest February 2027, Steam Winter Sale 2026, and Steam Next Fest June 2027. All include original browser-side utilities and still require deployment/route and SERP validation before live release. This is not a claim that 200 pages are SEO-ready.
- No real ads, false live content, forced interactions or impression-generation scripts.

## Routing
**Preferred canonical:** `https://aafnaipatro.com/events/rugby-world-cup-2027/`.
**Optional subdomain:** `https://rugby-world-cup-2027.aafnaipatro.com/`, but not both as indexable versions. User example `rugby-world-cup-aafnaipatro.com` is a separate domain, not a subdomain.
Subdomain use requires separate DNS/wildcard TLS, routing, 301 redirect strategy, crawl/analytics monitoring and canonical consistency. No SEO ranking boost is assumed.
**No DNS, Cloudflare, domain registration or live-site deployment was performed.**

## Run and verify
```bash
node scripts/build.mjs
node scripts/validate.mjs
```

## Editorial approval gates
1. Confirm official dates and local times. `unannounced`, `seasonal-window`, and `research-needed` must never be silently rendered as certain.
2. Audit 20 proposed intents per event in Google SERPs for US/UK/CA/AU and choose only capturable, distinct user jobs; consolidate overlapping intents into one excellent URL.
3. Replace scaffolds with original, sourced, useful information and functionality. Do not publish 200 near-duplicate pages merely to hit a number.
4. Review rights/licenses for event branding, data, fixtures, tickets, copyrighted media, vendor platforms, and advertiser requirements.
5. Check page quality, accessibility, responsive behavior, privacy, ad consent, performance and real ad formats where approved.
6. Only then remove noindex for individually approved URLs, generate a sitemap of approved URLs and deploy with canonical redirects.
7. Reconcile Search Console clicks, GA4 human engagement, and actual Adsterra paid impressions by country, device and format. Zero prior visibility is a plausible outcome; marketing scores are hypothetical.

## Source controls
- Dates marked `confirmed` have linked official or primary evidence from current research or earlier source-verified report, but must still be independently rechecked immediately before publication.
- `rule-derived` are computable holiday/DST dates, not verified store hours or organization-specific schedules.
- `research-needed` includes tentative dates from secondary calendars pending organizer confirmation.
- Topic score is editorial triage only, **not** estimated Google searches, rankings, CTR, revenue or CPM.
- Details and existing original checklist remain preserved at root and under `research/`.

## Deployment and static hosting
The generated site is compatible with GitHub Pages, Cloudflare Pages or another static asset host after editorial approvals and deployment-specific base URL adjustments. EventV must not modify unrelated AafnaiPatro Workers or deploy into existing patros' independent routes without explicit parity checks.
