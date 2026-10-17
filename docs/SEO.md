# SEO — implementation notes and inventory (Oct 2026)

Canonical production domain: **https://mvaak.com** (non-www, HTTPS). This was verified against the live site: `http://` returns a 301 to `https://`, and `www.mvaak.com` currently has **no DNS record**.

## What is implemented in code

| Area | Where |
|---|---|
| Per-page title, description, self-canonical, robots, Open Graph and Twitter tags, including the share image | `src/lib/metadata.ts` (`pageMetadata`) |
| Site defaults: icons (SVG, ICO, Apple), optional Search Console tag, no inherited canonical | `src/app/layout.tsx` |
| Indexable only on mvaak.com, or when `SITE_NOINDEX=true` | `src/config/site.ts` (`indexable`) |
| robots.txt: allow all except `/api/`, plus the sitemap; block everything on non-production builds | `src/app/robots.ts` |
| sitemap.xml, generated from content; `lastmod` only from real article dates | `src/app/sitemap.ts` |
| JSON-LD: one Organization + WebSite graph; Service, Article, Person (founder), BreadcrumbList, FAQPage | `src/lib/schema.ts`, the page files |
| Topic-matched internal links (Related reading) on service and solution pages | `src/components/shared/related-reading.tsx` |
| 404s return a real 404 with `noindex`; unknown slugs are rejected before rendering | `src/app/not-found.tsx`, `src/proxy.ts` |

## Content inventory

Keyword topics are **hypotheses**: no keyword-volume data was available.

| URL | Type / intent | Primary topic (hypothesis) | Title (new) | H1 | Internal-link notes / gaps |
|---|---|---|---|---|---|
| / | Home · navigational/commercial | AI training data, egocentric video | Mvaak — AI Training Data & Egocentric Video Collection | Real-World Data for the Next Generation of AI. | Links to all solutions; fine |
| /services | Hub · commercial | AI training data services | AI Training Data Services: Collection & Annotation · Mvaak | The data your AI needs… | Not in header nav (only linked in-page); Related reading added |
| /services/egocentric-video-data | Service · commercial | egocentric video data, robotics data | Egocentric Video Data for Robotics & Physical AI · Mvaak | First-person human demonstrations… | Related reading added |
| /services/audio-annotated-data | Service · commercial | audio annotation, speech data | Audio Annotation & Speech Data Services · Mvaak | Audio Annotated Data | Generic H1, kept from the live site; consider "Audio annotation for speech AI" |
| /services/video-annotated-data | Service · commercial | video annotation for computer vision | Video Annotation Services for Computer Vision · Mvaak | Video Annotated Data | Same as above |
| /services/text-annotated-data | Service · commercial | text annotation, NLP/LLM data | Text Annotation Services for NLP & LLM Data · Mvaak | Text Annotated Data | Same as above |
| /solutions/physical-ai | Solution · commercial/informational | robotics / Physical AI training data | Robotics & Physical AI Training Data · Mvaak | From real-world action to AI data. | Related reading and Service schema added |
| /partnerships | Programme · transactional | AI data collection partner programme | Partner Programme for AI Data Collection Teams · Mvaak | Your team. Our infrastructure… | — |
| /about | Company · navigational | Mvaak company | About Mvaak — AI Training Data Company | Building the data layer… | Person schema for the founder |
| /contact | Conversion | contact Mvaak | Contact Mvaak — Discuss an AI Data Project | Tell us what your AI needs to learn. | — |
| /blog | Hub · informational | AI training data insights | AI Training Data Insights & Articles · Mvaak | Thinking about AI data. | — |
| /blog/* (9) | Article · informational | dataset quality, annotation, etc. | Article headline · Mvaak | = headline | Two titles are 61–65 characters and one description is 166 (the published text); optionally shorten |
| /privacy | Legal | — | Privacy Notice · Mvaak | Privacy notice | Pending legal review |

## External steps (not done; they need account access)

1. **Search Console:** add a *Domain* property for `mvaak.com` (verified by a DNS TXT record), or a URL-prefix property using the HTML tag. For the HTML tag, set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the token's `content` value, rebuild and deploy. Then submit `https://mvaak.com/sitemap.xml`.
2. **GA4:** create a web data stream, set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-…`, rebuild and deploy. Mark `project_inquiry_submitted` and `partnership_application_submitted` as key events. Enhanced measurement already handles page views on client-side navigation. If EU/UK visitors matter, add a consent banner first.
3. **DNS:** add a `www` record that redirects to `https://mvaak.com`.
4. **After deploy:** run the Rich Results Test and PageSpeed Insights on `/`, a service page and an article, and check live robots.txt and sitemap.xml.
