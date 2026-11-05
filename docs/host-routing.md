# Canonical route and optional subdomain plan

## Strong default — one domain
Use `https://aafnaipatro.com/events/steam-next-fest-february-2027/`. The site keeps common navigation, site search, analytics and editorial maintenance. Index individual pages only when published with meaningful unique content.

## Optional custom host per event
`https://steam-next-fest-february-2027.aafnaipatro.com/` can point to an EventV static asset origin, **after** DNS, SSL and routing configuration. Keep one canonical representation. Do not serve both host and subdirectory as indexable duplicates. 301 redirects are preferred for permanent migration. Change canonical, sitemap, internal links, reporting and robots as one coordinated release.

`rugby-world-cup-aafnaipatro.com` is a separate registrable domain. It is **not** a subdomain. The correct subdomain form is `rugby-world-cup-2027.aafnaipatro.com`.

## Why 50 subdomains are not the first implementation
- No inherent ranking bonus from keywords in a hostname.
- Splits operational surface area into 50 host configurations, certificates, cache/redirect paths, and possible property reporting distinctions.
- Content authority must still be earned; new subdomains don't magically inherit rankings.
- Use subdomains only if a cluster becomes a standalone product with unique identity and sustained traffic.
- Avoid collision with existing AafnaiPatro Cloudflare Workers or static routes; inventory routes and preserve existing custom deployments before changing DNS.

## Preconditions
1. Check DNS wildcard behavior and Cloudflare SSL support; avoid taking over existing specific hosts.
2. Confirm full public URL routing and redirects against the production environment.
3. Verify Search Console site/URL inspection, canonical resolution and sitemap content.
4. Verify old paths remain reachable with clean redirects.
5. Launch only editorially approved pages; noindex remains for staging.
6. Do not confuse server responses, Google SERP impressions or scripts loaded with Adsterra billable impressions.
