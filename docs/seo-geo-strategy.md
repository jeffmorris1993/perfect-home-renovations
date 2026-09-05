# SEO + GEO Strategy — Perfect Home Renovations (Metro Detroit)

*Deep-research report, 2026-09-04. 23 sources fetched, 110 claims extracted, top 25 adversarially verified (20 confirmed, 5 refuted). Free-tools-only constraint.*

---

## TL;DR

To reach page 1–2 for Metro Detroit renovation keywords with zero tool spend, attack three layers at once:

1. **Google Business Profile (GBP)** — the dominant driver of map-pack visibility. Category, reviews, and profile completeness are the highest-leverage free actions.
2. **A per-service × per-city landing page network** — the #1 verified factor for *organic* local rankings, and exactly what the top Metro Detroit competitors already run (Marblecast, Detroit Build, MKD Kitchen & Bath).
3. **GEO is mostly off-site** — 60–77% of AI-engine citations point to third-party platforms (Houzz, Yelp, Thumbtack, Reddit, "best of" lists), not the business's own site. The on-site GEO play is informational/cost-guide content, which triggers AI Overviews at 92–97% rates vs. only ~15% for pure "remodeler near me" queries.

The automation layer can be built entirely free with Claude Code + open-source MCP servers backed by free Google APIs.

---

## 1. What actually drives rankings (verified, Whitespark 2026 survey)

**Local pack / map results** — top factors (47-expert survey, Nov 2025):
1. Primary GBP category (227 pts)
2. Proximity to searcher (225) — not a lever
3. Keywords in business title (223) — *note: stuffing extra keywords into the GBP name violates Google guidelines; "Perfect Home Renovations" already contains "Home Renovations" naturally*
4. Physical address in the search city (213) — not a lever
5. Open at time of search (189)

Review signals (~20% of local pack weight) and behavioral signals are rising in 2026. Classic bulk directory citations have fallen to ~7% weight — **don't waste time on mass directory submissions**.

**Local organic rankings** (the "page 1–2" goal):
1. **Dedicated page for each service (210 pts)** ← #1 factor
2. Geographic (city/neighborhood) keyword relevance of content (190)
3. Quality/authority of inbound links (187)
4. Keywords in landing page title (179)
5. Industry-relevant domain links (175)

This directly validates a `/services/kitchen-remodeling/troy-mi`-style page architecture — as long as pages have real, differentiated content (not thin doorway pages).

*Caveat: these are aggregated expert-survey scores, not Google-confirmed weights. Treat as consensus, not causation.*

---

## 2. Metro Detroit competitor landscape (live-verified 2026-09-04)

### Verified city-page networks (the playbook to replicate)

| Competitor | Strategy |
|---|---|
| **Marblecast of Michigan** | 10 ZIP-in-slug city pages (`/local/mi/troy-kitchen-bath-remodeling-48083/` plus Warren 48092, Livonia 48150, Sterling Heights 48310, Southfield, Dearborn, Canton, Northville, Farmington Hills, West Bloomfield), ~1,000–1,200 words each, interlinked via a sitewide "Locations We Serve" footer block. |
| **Detroit Build** (Royal Oak showroom, founded 2001) | `/michigan/` path pages like `home-remodeling-troy-mi.html`, `Kitchen-Remodeling-Troy-MI.html`, even `203k-Loan-Detroit-MI`. Their service list — kitchen, bathroom, basement finishing, whole house — overlaps PHR's exactly. |
| **MKD Kitchen & Bath** | `/service-area/troy` plus `/troy-kitchen-remodeling/` city pages. |
| **Royal City Renovations** (Royal Oak) | Areas-we-serve coverage of 12 Metro Detroit cities with city-tailored copy (verified, though tailoring is thin — roughly a line per city). |

**Do not** assume competitors lack schema/FAQ markup — a claimed "Marblecast has no schema" gap was refuted 0-3 in verification.

### Houzz benchmark (the review-volume gap)

The Detroit kitchen-and-bath Houzz directory holds **833 professionals**. Winners combine review volume with platform trust signals:

- **MainStreet Design Build** (Birmingham): 5/5, 66 reviews, 89 Detroit-area projects
- **The Cabinet Finishers**: 5/5, 47 reviews, "Best of Houzz" badge, 3 Verified Hires
- Top listings show "Responds Quickly" labels, hire counts, verified-hire counts

Encouragingly, some featured pros rank with only 5–9 reviews — **entry is possible before parity**. Target: dozens of reviews, large photo portfolio (the photo pipeline already exists via `npm run photos`), fast response times.

---

## 3. GEO / AI search visibility (Google AI Overviews, ChatGPT, Perplexity, Gemini)

Three verified facts reshape the usual advice:

1. **AI citations are mostly off-site.** 3 of the top 5 AI-search visibility factors in Whitespark 2026 are *citation* factors — presence on expert-curated "best of" lists (#1), prominence on industry domains, unstructured mentions in newspapers/blogs. For plumber-type queries, 60% of AI Overview citations pointed to third-party publishers (Yelp, Thumbtack, HomeGuide, Reddit, Quora) vs. 40% to business sites. Omniscient Digital's Jan 2026 study: only ~23% of AI citations come from owned content.
   → **Strategy: earn spots on "best remodelers in [city]" lists, maintain strong Houzz/Yelp/Thumbtack/Google profiles, pursue local press mentions.**

2. **AI Overviews depend sharply on query intent.** Only ~15% of pure local-intent queries ("kitchen remodeler near me") trigger AI Overviews, versus 92% of informational and 97% of hybrid-intent queries. Cost/price queries trigger them >80% of the time.
   → **The on-site GEO play is cost-guide and informational content**: "kitchen remodel cost Metro Detroit 2026", "basement finishing cost Michigan", permit guides, how-to explainers — not the transactional service pages.

3. **llms.txt has no verified effect.** An SE Ranking study of ~300k domains found no relationship between having llms.txt and citation frequency. Cheap to add, but don't count it as strategy.

*Refuted claim to ignore if you see it elsewhere: "AI Overviews appear in 68% of local searches, beating local packs" — voted down 0-3; only the intent-segmented numbers are reliable.*

---

## 4. Technical SEO on the Next.js site (all free)

The site already has `sitemap.ts` and `robots.ts`. The build-out:

- **Per-service × per-city routes** — e.g. `app/services/[service]/[city]/page.tsx` with `generateStaticParams` over a services × cities matrix. Each page needs `generateMetadata` (unique title/description with city + service), a canonical URL, and genuinely differentiated content (local project photos, city-specific details, testimonials from that city) to avoid doorway-page treatment.
- **JSON-LD schema** — `HomeAndConstructionBusiness` (LocalBusiness subtype) sitewide with NAP, service area, hours; `Service` + `FAQPage` schema on service/city pages; `Review`/`AggregateRating` where real reviews exist. Injected as a `<script type="application/ld+json">` in server components.
- **Extend `sitemap.ts`** to enumerate all generated city/service pages.
- **Core Web Vitals** — already strong footing on Vercel + next/image; monitor free via PageSpeed Insights / CrUX (automatable, see below).
- **Cost-guide content section** — e.g. `/guides/kitchen-remodel-cost-metro-detroit` — the AI Overview magnet layer.

---

## 5. Free automation stack with Claude Code (verified repos)

| Tool | What it gives you | Cost |
|---|---|---|
| **mcp-gsc** ([github.com/AminForou/mcp-gsc](https://github.com/AminForou/mcp-gsc), MIT, ~1.3–1.5k stars) | 20 Google Search Console tools: `get_search_analytics`, `compare_search_periods`, `inspect_url_enhanced`, `batch_url_inspection`, `check_indexing_issues`, `manage_sitemaps` — rank/visibility monitoring | Free self-hosted (author sells optional $12/mo hosted version — skip it) |
| **google-seo-mcp-claude-code** ([github.com/mario-hernandez/google-seo-mcp-claude-code](https://github.com/mario-hernandez/google-seo-mcp-claude-code), MIT, pipx-installable) | 100 tools across 14 categories: GSC quick-wins / traffic-drop / keyword-cannibalization detection, 5 Lighthouse/PageSpeed tools, 3 CrUX tools, 3 schema/JSON-LD validation tools | Free, **except** its SERP module (paid DataForSEO — skip). Young repo (11 stars) — runtime quality unproven |
| Google Search Console, GA4, PageSpeed/Lighthouse API, CrUX API | The underlying data | Free (needs a free Google Cloud project + OAuth/service-account creds; GA4 has 200k tokens/day quota) |
| Google Keyword Planner, Bing Webmaster Tools | Keyword volume + secondary index | Free |
| claude-in-chrome (already connected) | Browser automation for anything without a free API — GBP posting, review responses, Houzz profile upkeep | Free |

**Automatable flows once wired up:** weekly rank/impression reports from GSC, indexing checks on new city pages, keyword-cannibalization sweeps, Core Web Vitals regression alerts, schema validation on every deploy, and programmatic generation of new city/service pages from GSC query data (Claude Code writes the pages; verified real content keeps them from being doorway spam).

**GBP API caveat:** the Google Business Profile API requires an approval process not verified in this research — assume GBP posting/review responses stay manual or browser-automated for now.

---

## 6. 90-day action plan

**Weeks 1–2 — Foundation & baseline**
- [ ] Audit/claim GBP: correct primary category ("Remodeler" or "Kitchen remodeler"), full service list, hours, photos, service area
- [ ] Verify GSC + Bing Webmaster Tools; connect mcp-gsc to Claude Code; pull baseline rankings/impressions
- [ ] Create/claim free profiles: Houzz, Yelp, Thumbtack, Angi, Nextdoor — consistent NAP, full photo portfolios
- [ ] Add `HomeAndConstructionBusiness` JSON-LD sitewide
- [ ] Start a systematic review-request habit with every completed job (Google first, Houzz second)

**Weeks 3–6 — City/service page network**
- [ ] Build `[service]/[city]` route matrix — start with 4 services × 6 cities (Troy, Royal Oak, Novi, Livonia, Sterling Heights, Warren), real differentiated content per page
- [ ] Per-page `generateMetadata`, canonicals, `Service` + `FAQPage` schema
- [ ] Extend `sitemap.ts`; submit; automate indexing checks via mcp-gsc

**Weeks 7–10 — GEO content layer**
- [ ] Publish 3–5 cost guides ("kitchen remodel cost Metro Detroit 2026", "basement finishing cost Michigan", "bathroom remodel cost by city") with real price ranges, FAQ schema
- [ ] Pitch local "best of" list inclusion + one local press mention (the #1 AI-visibility factor)
- [ ] Add llms.txt (cheap, unproven — 10 minutes, no expectations)

**Weeks 11–13 — Automate & iterate**
- [ ] Wire google-seo-mcp-claude-code: weekly quick-wins + cannibalization + CWV report as a scheduled Claude Code routine
- [ ] Use GSC query data to pick the next city/service pages to build
- [ ] Re-benchmark vs. competitors; measure review-count gap closure

---

## Implementation status (2026-09-04)

**Done in this repo:**
- `lib/seo.ts` — services × cities data layer with hand-written per-city copy, plus JSON-LD builders
- `/services/[service]` — 6 dedicated service pages (bathroom, kitchen, basement, full-home, flooring-tile, roofing) with long-form copy, FAQs, `Service` + `FAQPage` + `BreadcrumbList` schema
- `/services/[service]/[city]` — 36 city landing pages (4 core services × 9 actual service areas from `lib/site.ts`), each with city-specific housing-stock copy, matched testimonials, FAQ schema, and full cross-linking (other services in city, same service in other cities)
- `app/sitemap.ts` extended to all 42 new pages; `public/llms.txt` added
- Footer service-links block; services index links to dedicated pages
- claude-seo toolkit (v2.2.5) installed project-scoped in `.claude/` — 25 skills (`/seo audit`, `/seo local`, `/seo schema`, `/seo geo`, …) + 18 agents
- Production build verified: 55 static pages

**Needs your Google account (one-time, ~15 min):**
1. Verify the site in [Google Search Console](https://search.google.com/search-console) (domain property for perfecthomereno.com) and [Bing Webmaster Tools](https://www.bing.com/webmasters); submit `https://www.perfecthomereno.com/sitemap.xml`.
2. For mcp-gsc automation: create a free Google Cloud project → enable the Search Console API → create a service account, download its JSON key → in GSC, add the service account email as a (restricted) user. Then: `claude mcp add gsc -- uvx --from git+https://github.com/AminForou/mcp-gsc mcp-gsc` with `GSC_CREDENTIALS_PATH` pointing at the key file (see the repo README for exact env var name).
3. Google Business Profile, Houzz, Yelp, Thumbtack, Nextdoor profiles + the review-request habit — highest-leverage items no code can do.

## Open questions (not answered by verified evidence)

1. Actual search volumes/difficulty for target terms — check free via Google Keyword Planner once GSC has data.
2. Realistic timeline to page 1–2 for a new contractor site — no confirmed claim; expect months, not weeks, for competitive terms.
3. PHR's current baseline (GBP category, review counts, existing listings) vs. the 66-review MainStreet benchmark — needs a manual audit.
4. Whether GBP management can be API-automated on the free tier.

## Key sources

- [Whitespark 2026 Local Search Ranking Factors](https://whitespark.ca/local-search-ranking-factors/) (primary, 5 confirmed claims)
- [Whitespark AI Overviews prevalence case study](https://whitespark.ca/blog/case-study-the-prevalence-of-ai-overviews-in-local-search/) (540 queries; plumbers = closest home-service proxy; May 2025 — directional)
- [Omniscient Digital — how LLMs source brand info](https://beomniscient.com/blog/how-llms-source-brand-information/) (23%/77% owned-vs-off-page split; B2B/consumer sample, not contractors)
- [Houzz Detroit kitchen & bath directory](https://www.houzz.com/professionals/kitchen-and-bath-remodelers/detroit-mi-us-probr0-bo~t_11825~r_4990729) (live snapshot 2026-09-04)
- Competitor sites live-fetched 2026-09-04: marblecastofmichigan.com, detroitbuild.com, mkdkitchenandbath.com, royalcityrenovations.com
- [mcp-gsc](https://github.com/AminForou/mcp-gsc) · [google-seo-mcp-claude-code](https://github.com/mario-hernandez/google-seo-mcp-claude-code)
