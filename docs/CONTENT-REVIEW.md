# Content review before launch

Everything on the site comes from one of two sources: the live mvaak.com site (October 2026) or the brochure *Mvaak AI Data Services*. Nothing was invented. The items below come from the brochure, or are commercial and legal statements. Each needs sign-off from someone at Mvaak before the site is public.

For each item: confirm it, edit it, or remove it. The **Where** column gives the file to change.

## 1. Partnership programme terms (must decide)

None of these terms has been decided. The site shows **"Confirmed during evaluation"** for each one until a value is set.

| Term | Current state | Where |
|---|---|---|
| Initial project / onboarding fee: amount, purpose, when payable | Not set. The site says it *may* apply, is disclosed in writing before any payment, and is never collected online | `src/config/partnership.ts` (`fee`) |
| Minimum dedicated working hours | Not set. The FAQ says hours are agreed per project | `partnership.ts` (`hours`) |
| Equipment provision, ownership, care, return | Not set. The site says "where agreed and available" | `partnership.ts` (`equipment`) |
| Training format and duration | Not set | `partnership.ts` (`training`) |
| Compensation / commercial structure | Not set. Applicants state a preference only | `partnership.ts` (`commercial`) |
| Eligibility criteria | Not set. The site says eligibility depends on each project | `partnership.ts` (`eligibility`) |
| Payment terms | Not set | `partnership.ts` (`payment`) |

When you set a value, it appears in the "Programme terms" table. Fee, hours, equipment, training and commercial values also replace the matching FAQ answer. Write each value as a plain statement of fact: what it is, what it covers, and when it applies.

These policies are already stated on the site. Confirm Mvaak is comfortable committing to them:
- Applying is free.
- No payment is collected through the website.
- A fee, if any, is tied to a defined project and disclosed in writing before payment.
- Submitting an application does not guarantee acceptance, a project, equipment or income.

## 2. Institutional names

The brochure lists these under **"Backed by"**: IIT Kanpur · MeitY, Government of India · Startup India · MIT · NTU Singapore · SMU.

On the site they appear under a neutral heading, **"Institutional support & associations"**. They are shown as names only, with no logos, because permission to use the logos has not been confirmed.

- Confirm the exact relationship with each one (for example incubated at, a grant from, recognised under, a research collaboration).
- Set the wording in `src/config/site.ts` (`institutions[].relationship`), or hide an entry with `show: false`.
- Add official logos only after written permission.

### 2a. "We are backed by" logo strip (homepage, and `/about#recognition`), must confirm

The client supplied a screenshot showing six logos: IIT Kanpur · IIT Kanpur Incubation & Innovation · Startup India · IndiaAI · MeitY · JSS AHER Mysuru. JSS was removed at the client’s request, so five logos now appear on the site, in `src/components/shared/backed-by.tsx`, with the image files in `public/images/recognition/backer-*.png`. Since November 2026 they appear as a moving logo strip (a marquee).

- **Logo files (Nov 2026).** The old screenshot crops have been deleted. The current files are the higher-resolution originals the client supplied, trimmed and exported without recolouring or stretching. For the incubation centre, only the middle mark was cut from its official three-part logo, because the IIT Kanpur seal already has its own tile. These files were not downloaded from the organisations’ own brand pages. Confirm they are the current official versions, or supply files from the official sources.
- **What the evidence on file supports:**
  - **IndiaAI:** the award photos (IndiaAI Innovation Challenge, cheque made out to Narottam Innovations) and Mvaak’s own YouTube video about the IndiaAI grant.
  - **IIT Kanpur, MeitY and Startup India:** listed under “Backed by” in the brochure.
  - **Incubation centre:** Startup Incubation and Innovation Centre (SIIC), IIT Kanpur, appears only in the client’s screenshot, with no other evidence on file.
- **The two sources list different backers.** The brochure lists MIT, NTU Singapore and SMU; the screenshot adds IndiaAI and JSS. Confirm which list is current.
- **Confirm Mvaak's relationship with each organisation, and its permission to use the logo.** If any one cannot be confirmed, remove it from `backers`.

### 2b. Recognition photos (homepage `#recognition`, and `/about#recognition`), must confirm

The client supplied two photos, now in `public/images/recognition/award-ceremony.jpg` and `award-cheque.jpg`.

- **What the photos show:** the slide reads *IndiaAI Application Development Pillar · IndiaAI Innovation Challenge · Narottam Innovations Pvt Ltd · Adaptive Learning and Detection for SLDs* and carries the **mvaak AI** logo. The cheque is made out to **Narottam Innovations Pvt Ltd**.
- **How the site describes it:** the copy says the award went to Narottam Innovations Pvt Ltd and was presented with the mvaak AI name. It does not say that Mvaak itself received the award.
- **To confirm:** Narottam Innovations Pvt Ltd's relationship to Mvaak (for example, the legal entity behind it), and whether the award can be presented as Mvaak's. If so, the copy can be strengthened in `src/components/shared/recognition.tsx`. If not, remove the section.
- **Not published:** the India News screenshot. It covers TaknikAI and its founder Shivam Pal, not Mvaak, so it is not used anywhere. It can be added only if the TaknikAI–Mvaak link is confirmed and the coverage concerns Mvaak.

### 2c. Video (homepage "Awards & Recognitions", `#recognition`)

The site embeds YouTube video `sygn0mAgeZU`, using the privacy-enhanced `youtube-nocookie.com` player, which loads lazily. The video is titled "IndiaAI Grant Support for Mvaak, Coverage by NewsStation" on the Mvaak channel, and it now sits beside the award photos in the "Awards & Recognitions" section. Confirm that the grant wording is accurate, which ties in with 2b.

### 2d. Founder profile (`/about#founder`), must confirm

The client asked for Shivam Pal, Founder & Managing Director, to be featured. The profile is in `src/components/about/founder-profile.tsx`.

- **The photo is cropped from a screenshot of another website's founder card, so it is low resolution.** The baked-in "Founder" label was blended out. Replace `public/images/about/founder-shivam-pal.jpg` with the original high-resolution portrait, square or close to it.
- **There is no approved biography.** The section shows only the name, the title and one line of Mvaak's own published positioning. Supply an approved bio to replace that line.
- **The reference statistics are deliberately left out:** 8+ years, 100+ founders mentored, $10M+ fundraising, $5M+ revenue. The sector chips (AI, SaaS, EdTech and so on) are left out too. They come from a different website and are not verified Mvaak facts; add them only with written approval and a source. The chips shown instead are Mvaak's own services.
- **The India News / TaknikAI coverage (2b) is still unpublished.**

### 2e. Homepage egocentric photos

The homepage's illustrated egocentric frames have been replaced with realistic photos, cropped from the client-supplied reference composite. The image files are in `public/images/egocentric/`:

| File | Where it is used |
|---|---|
| `ego-cup.jpg` | Hero |
| `ego-screwdriver.jpg` | What We Do › Egocentric Data card, and the Industrial tab on `/services/egocentric-video-data` |
| `ego-drawer.jpg` and `ego-package.jpg` | Egocentric section |

- **The site labels them "Illustrative".** They carry baked-in overlays, including a session ID "MVA-0087". Confirm that they are licensed for use, and confirm whether any of them is real Mvaak footage. If one is, the "Illustrative" label can be dropped from that image.
- **Replace them with higher-resolution originals if available.** The crops are 765–879 px wide.
- **The inner pages still use the SVG illustration system**, as requested: `/solutions/physical-ai` and `/services/egocentric-video-data`.

## 3. Company and capacity claims (from the brochure)

| Claim | Where it appears | Where to change it |
|---|---|---|
| Operating since 2023; 100+ client engagements across India, UAE, Singapore | Home "Why Mvaak", About | `src/config/site.ts` (`credentials`) |
| Own AI/ML team, including government-funded deep-tech work | Home, About | `site.ts` (`credentials`) |
| Capacity as of August 2026: 6 → 18 states, 250 trained collectors, 40+ environment types, 12+ languages | About "The network behind the hours" | `site.ts` (`capacity`); set `showOnSite: false` to hide the whole block |
| Offices in New Delhi, Ajman (UAE), Singapore; address Moti Nagar, New Delhi 110015 | Footer, About, Contact | `site.ts` |

Brochure figures left off the site on purpose: 800–1,200 accepted hours a month (scaling past 5,000), the "2,000+ collectors within 90 days" ramp, market price ranges, and third-party statistics (the NVIDIA +50% result, "~50% of footage rejected", "billions of hours"). Add any of them only with a source.

## 4. Quality and commercial commitments (from the brochure)

| Statement | Where |
|---|---|
| 15–25% of captured hours budgeted to fail QA and **never invoiced** | Home: quality section |
| Target acceptance ≥ 85%, defined contractually per programme | Home: quality section |
| Rejected hours are not invoiced; priced per accepted hour by tier and annotation depth | Home: engagement models |
| Batches below the agreed threshold are re-collected | Egocentric page: quality checks (`src/content/egocentric-collection.ts` → `qualityChecks`) |
| Pilot Sprint: 30 days, 100–250 accepted hours, governance pack included | Home, Egocentric page |
| "Send us one task": we return a capture brief, object matrix, rubric and costed pilot before you commit. The brochure's promises of "within five working days" and "no fee" were left off | Contact page |
| Stereo + IMU capture runs about 50–120 GB per hour | Egocentric page |

## 5. Governance statements (from the brochure)

The egocentric page shows a shortened version (consent, permissions, secure handling, retention and transfer) in `src/content/egocentric-collection.ts` → `governanceItems`. Confirm each one matches what Mvaak actually does today:

- Worker-level consent, signed directly with the camera wearer in their own language, revocable
- A bystander and household protocol; no capture of minors without guardian consent; a right to stop recording at any time
- Face and identifier redaction on request; deletion on revocation carried through to delivered batches
- **Fair-wage policy**: a pay floor above prevailing local rates. The brochure calls this a *published* charter. The site says "policy" because no published document was supplied.
- **DPDP Act 2023**: the site says consent processes are *designed around* the Act's standard. It does not claim compliance or certification. Have counsel confirm this wording.
- Chain of title and a defined commercial licence. The brochure also promises an *indemnity*; that was left off the site.

## 6. Privacy notice

`src/app/privacy/page.tsx` describes only how the website forms handle data. Before launch:
- Add a retention period for inquiries and applications.
- Name the processors you use, such as your email and CRM providers.
- Have counsel review it.

## 7. Imagery

Every visual on the site is a technical illustration made for it: first-person capture frames with hand-keypoint skeletons, synchronised streams, and pipelines. There are no stock photos, no customer logos and no product screenshots. You can swap in real photographs from Mvaak's own field operations, taken with consent, by replacing the illustrated frames in `src/components/egocentric/environment-explorer.tsx` and the hero.

## 8. Illustrative sample data

The site shows sample data so visitors can see what the work produces. Every example is labelled on the page as illustrative, and none of it describes an actual Mvaak dataset, client or result. Confirm the examples reflect how Mvaak actually structures its data.

| Example | Where | Label shown |
|---|---|---|
| "Pick up a cup" episode record (task, actions, timestamp, object, status) | Home hero (`src/components/visuals/demo-record.tsx`) | "Illustrative example — not an actual Mvaak dataset." |
| Raw / annotated / structured views of the same recording, including a JSON task record | Home pipeline → Annotation (`src/components/home/annotation-compare.tsx`) | "Illustrative example" |
| Capture brief (task, include, consent) | Home pipeline → Human Demonstration (`src/components/visuals/pipeline-visuals.tsx`) | "Illustrative example of the human demonstration stage." |
| Batch review with four quality checks, one flagged | Home "Quality that matters" (`src/components/home/quality-checks.tsx`) | "Illustrative example" |
| Deliverable examples: file list, IDs, metadata record, annotation layers, quality report | Egocentric page → deliverables explorer (`src/components/egocentric/deliverables-explorer.tsx`) | "Illustrative example" |
| Quality-check walkthroughs (what is reviewed, example issue, handling) | Egocentric page → quality (`src/content/egocentric-collection.ts` → `qualityChecks`) | "Illustrative example" |
| Partner field team and capture kit | Home Partnerships section (`src/components/visuals/team-kit.tsx`) | "Illustration: a partner field team and its capture kit." |

**Photography.** The current visuals are custom illustrations. Unsplash blocks automated downloads, so licensed stock photos could not be added here. If Mvaak has its own consented field photography (smart glasses, capture sessions, real environments), ask a developer to swap it into the hero or the environment selector.

## 9. Egocentric Data Collection page — capability labels

The page separates what Mvaak’s brochure describes from what still needs confirming:

- **Environments.** Household, Commercial, Warehouse and Agricultural are labelled “In Mvaak’s scope” (from the brochure). **Industrial** is labelled “Confirm in scoping” and shows a placeholder visual. Confirm or change both in `environmentOptions`.
- **Standard deliverables.** This list comes from the brochure’s “What arrives with every episode”. Confirm it is truly standard for every project, or move items into **Optional extras**.
- **Capture categories.** Each category ends with “Confirm during project scoping.” No camera models, frame rates, durations or capacity figures are stated.
- **Samples.** “Request a Sample” never promises one. The page and FAQ say availability depends on the data and requirements. Decide what can actually be shared as a sample.

## 10. Navigation and footer update (header, footer, homepage), to confirm

- **Header:** Home · Solutions ▾ · Resources ▾ · About Us · Partner Us, followed by the Contact Us button. Services is no longer a top-level item.
  - `/services` and `/services/egocentric-video-data` still exist and are still linked from the homepage, `/solutions/physical-ai`, the contact form and the 404 page.
  - Neither page is in the header or footer any more. Confirm this is intended.
- **Addresses differ across the site.** The footer shows the two supplied addresses (Sector 62, Noida, and Diksharth Center, Kanpur). The Contact page now shows only the email address, and the About page's "Where we are" section (New Delhi, Ajman and Singapore) has been removed. The Privacy notice and the structured data (`site.address`) still show Moti Nagar, New Delhi. Confirm which address is current.
- **Legal entity.** The footer now reads "© 2026 Mvaak | All rights reserved | Narottam Innovations Pvt Ltd", which indicates that Narottam Innovations is Mvaak's legal entity. If so, the recognition wording in 2b can be strengthened, once confirmed.
- **Privacy Policy.** The footer links to the existing `/privacy` page, which is a website privacy notice drafted from the brochure (see section 6). It still needs legal review and approval as the official Privacy Policy.
- **"Start Here" column.** It shows only the supplied text, "Good to go".
- **MeitY logo.** Resolved in Nov 2026: replaced with a clean, high-resolution file (`backer-meity.png`).

## 11. Partnership application form, approval needed

The six-step application has been replaced with a single-page form. It has the seven approved fields: Full Name / Business Name, Email, Phone Number, City, Country, LinkedIn Profile (optional) and Looking For (Acquiring Data / Selling Data).

- **Backend.** The endpoint (`/api/partnership`) and the delivery channels (Resend, webhook and the local store) are unchanged. What changed is the payload and the lead email layout (`src/lib/forms/partnership-schema.ts`, `src/app/api/partnership/route.ts`).
  - Any external automation that reads the webhook's `data` object and expects the old fields (team size, capabilities, commercial readiness and so on) needs updating.
  - New records contain `fullName`, `email`, `phone`, `city`, `country`, `linkedin` and `lookingFor` (`acquiring-data` / `selling-data`).
- **Acknowledgements.** The four checkbox acknowledgements were removed with the multi-step flow. In their place is a single line above the submit button: "By submitting, you agree that Mvaak may contact you about this application", with a link to the Privacy Policy. Confirm this is acceptable.
- **Wording.** The "Looking For" options read as data buyers and sellers. The rest of the Partnerships page still describes field-team collaborations, so confirm the page copy and the form's purpose match.

## 12. Contact form → Google Sheets, action required before it works live

The Contact Us form now sends each lead to the "Contact Leads" Apps Script, through the site's server at `/api/inquiry` (`src/lib/server/contact-sheet.ts`). The visitor sees success only when the script confirms the write. Two things are needed on the Apps Script side:

1. **Deployment access.** The supplied URL (originally `/a/macros/first500days.com/…/exec`, now `/macros/s/AKfycbyenula…/exec`, which is public) is restricted to first500days.com accounts. Anonymous requests are redirected to Google sign-in, so website submissions cannot reach the script. Redeploy the web app with *Execute as: Me* and *Who has access: Anyone*. If that produces a new `/exec` URL, set it in `CONTACT_SHEETS_URL`.
2. **Confirmation response.** `doPost` must return a success reply after `appendRow`, for example `ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON)`. Any other reply, such as an error page or no output, is treated as a failure.
3. **Spreadsheet binding.** `SpreadsheetApp.getActiveSpreadsheet()` works only if the script is bound to the Contact Leads sheet (created from Extensions → Apps Script inside that sheet). If it is a standalone script, use `SpreadsheetApp.openById("<Contact Leads sheet ID>")` and select the tab by name.

**Field mapping**

| Script property | Contact form field |
|---|---|
| name | Name |
| email | Work email |
| company | Company |
| jobTitle | Job title (optional) |
| inquiryType | Request type and project type, e.g. "Discuss a project — Egocentric video & human-demonstration data" |
| projectDetails | The description, followed by every other answered field ("Engagement model: …", "Environments: …" and so on), then the reference number and the page the lead was submitted from |

## 13. Delete Account page (`/delete-account`), confirm before publishing

The page was built for the Google Play and App Store account-deletion requirement. All of its copy lives in `src/content/account-deletion.ts`. The following items were supplied in the brief and are **not verified** against the app or company policy:

1. **Timelines:** a verification email within 48 hours; deactivation after verification; deletion from active systems within 30 days; deletion from backups within 90 days; pending payouts settled before closure.
2. **In-app steps:** Profile → Settings → Account → Delete account, a one-time code, and "Permanently delete" with a confirmation email. These must match the shipped app exactly, because store reviewers check them.
3. **Data categories:** the "Deleted" and "Kept, where required" lists, including payouts, invoices and contributor agreements, must match what the app actually stores.
4. **privacy@mvaak.com:** this mailbox must exist and be monitored.
5. **Delivery:** requests are emailed through Resend, so `RESEND_API_KEY` and a verified sending domain are needed. Until those are set, the form tells visitors the request could not be sent and offers a pre-filled email instead. It never shows a false success message.
6. **Duplicate check:** the one-pending-request-per-email check is held in server memory, so it resets when the server restarts.

## 14. Homepage redesign: assets and confirmations needed

All homepage copy lives in `src/content/home.ts`. Unconfirmed items are either hidden or labelled on the page.

**Assets to supply** (add the paths in `home.ts`; nothing else needs to change):
- **Real Mvaak sample clips** (MP4 + WebM, short, muted, with a poster frame). Every gallery card currently shows an *illustrative* still. Categories still without any asset, which are hidden until supplied: kitchen tasks, retail operations, warehouse operations, food preparation, agriculture, and cleaning & maintenance.
- **Photos or clips of the capture rigs**: egocentric head-mount, stereo setup, mono-RGB third-person, and IMU/wearable. The capture cards are text-only until these arrive.
- **Environment photos**: optional, since the environment cards currently use icons.
- **Higher-resolution backer logos**: supplied and in use since Nov 2026 (see 2a).
- **App Store and Google Play listing URLs**: none exist anywhere in the project, so no store badges are shown.

**Figures and claims to confirm:**
- **Stats** come from the brochure ("capacity position as of August 2026"): 6 → 18 states, 250 trained collectors, 40+ environment types and 12+ languages. Hours delivered, daily capacity and tasks captured are hidden until real figures exist.
- **Regions**: India (operations base); the UAE and Singapore (labelled "client engagements delivered", from the brochure's 100+ engagements); and the Philippines, the US, the UK, China, Latin America and other parts of Asia (labelled "target region — confirmed per project"). Confirm each one before any "we operate in" wording is used.
- **Environments**: offices, industrial and project-specific sites are marked "confirmed during scoping". Retail and kitchens rely on the brochure's "shops and food-service lines".
- **Capabilities not shown** because they don't appear in Mvaak's materials: blur and motion checks, occlusion checks, and duplicate detection. Add them only if they are part of the actual QA workflow.

## 15. Video-first homepage: footage used and footage still needed

**Integrated (`public/videos/capture/`, about 1 MB per clip as 960×540 MP4 + WebM, 8 s each, with poster frames):**
- **Source:** eight recordings in `Downloads`, each a real first-person capture lasting 3 minutes (1920×1080, 30 fps, HEVC, wide-angle wearable camera):
  - `metal-plant-2.mp4`, `sewing-2.mp4`, `Handloom.mp4`, `metal-work-2.mp4`
  - `household work.mp4`, `construction-work.mp4`, `tiles-work-2.mp4`, `battery-2.mp4`
- **Gallery clips** (one per recording): `metal-plant` (44 s), `sewing` (22 s), `handloom` (44 s), `metal-work` (33 s), `household` (1 s), `construction` (22 s), `tiles` (88 s), `battery` (152 s). The number in brackets is where the excerpt starts in the source.
- **Hero, capture demos and services** use separate segments from the same recordings. The hero and the "Robotics & Physical AI" service card share `demo-machine`; the metal-work and handloom service cards reuse their gallery clips.
  - `demo-machine` from the metal plant at 132 s
  - `demo-sewing` at 110 s
  - `demo-trowel` from the construction site at 88 s
  - `demo-warehouse` from the battery recording at 66 s
- **Confirm before publishing:**
  1. The footage is Mvaak's own and cleared for public use.
  2. Every person visible on camera, including co-workers and passers-by, consented to appear on the website.
  3. The workplaces (metal plant, garment factory, handloom workshop, spot-welding station, building sites, storage floor) agree to being shown.
  4. The task descriptions are accurate. They were written from viewing the footage: for example, the battery clip is described only as "Moving a pallet jack" on an "Industrial storage floor".
- **Locations:** the clips carry no location tags because none were supplied. Flambra-style city pins can be added once the location of each recording is confirmed.
- **Removed:** the agriculture footage and its annotated overlay (`public/videos/egocentric/agri-*`), and with it the homepage "Annotated sample" section. The new recordings have no annotation overlay, and adding one would be fabricated.
- **Thumbnail:** `public/images/services/yt-zshr2sYCAxk.jpg`, from Mvaak's own YouTube video "Audio To Text Transcription Tool by Mvaak".
- **Not used:** the AI-generated Veo and Pika clips in `Downloads`.

**Still needed from Mvaak** (add each to `src/content/home.ts` and it appears automatically):
- **Egocentric clips, 6–10 s, muted:** retail and product handling, food preparation, cleaning and maintenance. These categories are hidden until footage exists.
- **Mono-RGB third-person clips.** All eight new recordings are first-person, so the mono-RGB gallery stays hidden.
- **A real annotated export** (labels, segments or hand/object tracks from the annotation tool), to bring back an annotated-sample section honestly.
- **Stereo-rig and wearable/IMU capture footage**, if these are offered.

## 16. Interactive hero, brand colour, logo strip and nine new articles (Nov 2026)

**Interactive hero** (`src/components/home/hero-console.tsx`, data in `src/content/hero-demo.ts`):
- **Footage:** six real 8-second clips from the November recordings (section 15). Each one is shown under a task name: object handling, kitchen, warehouse, garment work, fine handwork, construction.
- **Annotations are a demonstration.** The website team placed them by hand after viewing the footage: action segments at 1-second resolution, and object boxes on each clip’s first frame only. They are badged “Demo labels · hand-placed”, and a caption under the console says they are not model output. Replace them with real exports from Mvaak’s annotation tool when available.
- **Tasks without footage:** product sorting and packaging, which the brief asked for. They are not offered until real clips exist.
- **Timecode:** the REC timecode is the real position within each 3-minute source recording.

**Brand colour and logo:**
- **Logo shape is unchanged.** The supplied logo has the same bar geometry as the existing mark (five bars, with heights in the ratio 40:56:72).
- **Colour:** the blue sampled from the logo is `#558AC4`. It is now `--color-brand`, used for the mark, the favicon, the Apple touch icon and the 512px structured-data logo.
- **Text and buttons:** `#558AC4` gives only 3.6:1 contrast against white, so blue text and white-on-blue buttons use a deeper shade of the same hue, `#3A6EA8` (5.3:1, which passes WCAG AA).
- **Wordmark:** unchanged, because only the symbol was supplied.

**Nine new articles** (`src/content/articles.json`, dated 13 Nov 2026):
- **Images:** featured images are Mvaak’s own capture posters. The annotation article uses the illustrative screwdriver frame, which is labelled as illustrative in its alt text.
- **Claims:** no statistics are given. The only claims about Mvaak are services already described on the site.
- **Before publishing:** confirm the publication date and that Mvaak is credited as the author.

**Stats:** “1 lakh+” now reads “100,000+”.

**Build note:** a Turbopack build once served stale CSS from `.next/cache`. If a style change does not appear after `npm run build`, delete `.next/cache` and build again.

## 17. Data explorer above the hero, and the Beedi footage removed (Nov 2026)

- **Removed:** all Beedi footage, at the client’s request. The files are deleted and no reference remains in code, content or page HTML. The gallery card, the service-02 visual, the hero’s fifth task (now “Machine tending”) and the featured image of the raw-video blog post now use `metal-work-2.mp4` from 33 s.
- **New section:** a data explorer at the top of the homepage, directly below the navigation (`src/components/home/data-explorer.tsx`, data in `src/content/explorer-demo.ts`, clips in `public/videos/explorer/`). The existing hero sits unchanged below it.
- **Explorer clips:**
  - Object handling: `metal-plant-2` from 88 s
  - Kitchen activities: `household work` from 66 s
  - Household tasks: `Wipe Dining Table.mov` from 160 s
  - Machine tending: `metal-work-2` from 0 s
  - Warehouse operations: `battery-2` from 110 s
- **Not shown, because no footage exists:** Product sorting and Packaging. A `metal-work-2` segment that showed parts being carried past a stack was not used for “Product stacking”, because it does not show stacking.
- **Annotations:** action segments and object boxes on two exact keyframes per clip (0 s and 4 s). They were placed by hand as a demonstration and are labelled as such.
- **Confirm before publishing:** consent and provenance for `Wipe Dining Table.mov` and `metal-work-2.mp4`, the same as section 15.
- **Duplicate file:** `battery-2 (1).mp4` in Downloads is a byte-identical copy of `battery-2.mp4`.
