import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Factory,
  Home,
  MapPin,
  Plus,
  Sprout,
  Store,
  UtensilsCrossed,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { FaqList, faqJsonLd } from "@/components/ui/faq";
import { JsonLd } from "@/components/ui/json-ld";
import { SampleMedia } from "./sample-media";
import {
  capabilities,
  captureDemos,
  captureMethods,
  monoRgbSamples,
  environments,
  homeFaqs,
  regionStatusLabel,
  regions,
  samples,
  services,
  stats,
  statsSource,
  type Environment,
  type Region,
  type Sample,
  type ServiceVisual,
} from "@/content/home";
import { cn } from "@/components/ui/cn";

/* Homepage sections. All copy comes from src/content/home.ts. */

const pill = "rounded-full border border-line bg-canvas px-2.5 py-1 font-mono text-[0.6875rem] tracking-wide text-ink-2";

/* ───────────── 2. Data at a glance ───────────── */
export function StatsStrip() {
  const shown = stats.filter((s) => s.show && s.value);
  if (!shown.length) return null;
  return (
    <section aria-labelledby="stats-title" className="border-b border-line bg-surface">
      <div className="container-page py-12 sm:py-14">
        <h2 id="stats-title" className="font-mono text-xs tracking-[0.14em] text-faint uppercase">
          Data at a glance
        </h2>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-3">
          {shown.map((s) => (
            <div key={s.label} className="border-l-2 border-accent pl-4 sm:pl-5">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{s.value}</dd>
              <dd className="mt-2 font-medium text-ink">{s.label}</dd>
              {s.note && <dd className="mt-1 text-sm leading-relaxed text-muted">{s.note}</dd>}
            </div>
          ))}
        </dl>
        <p className="mt-8 text-xs text-faint">{statsSource}</p>
      </div>
    </section>
  );
}

/* ───────────── 3. Real-world samples (video gallery) ───────────── */
const sourceBadge = "rounded-full px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.12em] uppercase backdrop-blur-sm";

function SampleCard({ s, sizes }: { s: Sample; sizes: string }) {
  const isVideo = !!(s.media?.mp4 || s.media?.webm);
  return (
    <li data-reveal className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface">
      <div className="relative aspect-video bg-navy">
        <SampleMedia media={s.media!} alt={s.alt} sizes={sizes} />
        <span className={cn("absolute bottom-3 left-3", sourceBadge, s.illustrative ? "bg-navy/75 text-on-navy" : "bg-accent text-white")}>
          {s.illustrative ? "Illustrative frame" : isVideo ? "Real capture · video" : "Real capture"}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.12em] uppercase">
          <span className="text-accent">{s.category}</span>
          <span className="inline-flex items-center gap-1 text-faint">
            <MapPin aria-hidden className="size-3" /> {s.environment}
          </span>
        </p>
        <h3 className="mt-1.5 font-semibold text-ink">{s.task}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.description}</p>
        <p className="mt-auto pt-4">
          <span className={pill}>{s.capture}</span>
        </p>
      </div>
    </li>
  );
}

export function SampleGallery() {
  const shown = samples.filter((s) => s.media);
  return (
    <Section id="samples" tone="canvas" labelledBy="samples-title">
      <SectionHeader
        id="samples-title"
        eyebrow="Egocentric samples"
        title="Real-world tasks, seen from the first person."
        lead="Real work in factories, workshops, building sites and homes — recorded from the viewpoint of the person doing it."
      />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
        {shown.map((s) => (
          <SampleCard key={s.id} s={s} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Every clip is an 8-second excerpt of real first-person capture, shown muted and unannotated. Full episodes and labelled samples are shared on request.
        </p>
        <Link href="/contact?type=egocentric-video&intent=sample#inquiry" className="inline-flex shrink-0 items-center gap-1.5 font-medium text-accent hover:text-accent-strong">
          Request a sample <ArrowRight aria-hidden className="size-4" />
        </Link>
      </div>
    </Section>
  );
}

/* ───────────── 4. Capture methods ───────────── */
export function CaptureMethods() {
  return (
    <Section id="capture" tone="navy" labelledBy="capture-title" className="overflow-hidden">
      <div aria-hidden className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="relative">
        <SectionHeader
          dark
          id="capture-title"
          eyebrow="How it is captured"
          title="Four ways we record the real world."
          lead="The rig is chosen per task. Every stream is calibrated and aligned to one timeline before it reaches you."
        />

        {/* Egocentric Data Capture — real looping first-person demonstrations */}
        <div className="mt-10 lg:mt-12">
          <h3 className="flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-brand-light uppercase">
            <span aria-hidden className="size-2 animate-pulse rounded-full bg-success" /> Egocentric Data Capture
          </h3>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {captureDemos.map((d) => (
              <li key={d.id} data-reveal className="overflow-hidden rounded-card border border-navy-line-strong bg-navy-3">
                <div className="relative aspect-video">
                  <SampleMedia media={d.media} alt={d.alt} sizes="(min-width: 768px) 30vw, 100vw" />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-white">{d.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-on-navy-muted">
                    <span className="text-on-navy">Captured: </span>
                    {d.captured}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-on-navy-muted">Real first-person footage from a garment factory, a building site and a storage floor — wide-angle wearable camera.</p>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-12">
          {captureMethods.map((m) => (
            <li key={m.id} data-reveal className="flex flex-col overflow-hidden rounded-card border border-navy-line-strong bg-navy-3">
              {m.image && (
                <div className="relative aspect-[16/7] border-b border-navy-line">
                  <Image src={m.image.src} alt={m.image.alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span aria-hidden className="inline-flex size-8 items-center justify-center rounded-lg bg-accent font-mono text-sm font-semibold text-white">
                    {m.code}
                  </span>
                  <h3 className="text-lg font-semibold text-white">{m.title}</h3>
                </div>
                <p className="mt-3 leading-relaxed text-on-navy">{m.provides}</p>
                <ul className="mt-4 space-y-1.5">
                  {m.specs.map((s) => (
                    <li key={s} className="flex gap-2 text-sm text-on-navy-muted">
                      <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-brand-light" />
                      {s}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-5 font-mono text-[0.6875rem] tracking-[0.1em] text-brand-light uppercase">{m.source}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Mono-RGB capture — third-person RGB samples (rendered once real footage exists) */}
        {monoRgbSamples.length > 0 && (
          <div className="mt-12">
            <h3 className="font-mono text-xs tracking-[0.14em] text-brand-light uppercase">Mono-RGB capture — third-person view</h3>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {monoRgbSamples.map((s) => (
                <SampleCard key={s.id} s={s} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
}

/* ───────────── 5. Environments ───────────── */
const envIcons: Record<Environment["icon"], LucideIcon> = {
  home: Home,
  store: Store,
  utensils: UtensilsCrossed,
  warehouse: Warehouse,
  factory: Factory,
  sprout: Sprout,
  building: Building2,
  plus: Plus,
};

export function EnvironmentsGrid() {
  return (
    <Section id="environments" tone="surface" bordered labelledBy="env-title">
      <SectionHeader
        id="env-title"
        eyebrow="Supported environments"
        title="Collected where the work actually happens."
        lead="Real homes, shops, kitchens, warehouses and farms — with site permissions and consent arranged before recording."
      />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
        {environments.map((e) => {
          const Icon = envIcons[e.icon];
          return (
            <li key={e.id} data-reveal className="flex flex-col rounded-card border border-line bg-canvas p-5">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold text-ink">{e.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{e.description}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`Example activities in ${e.title}`}>
                {e.examples.map((x) => (
                  <li key={x} className="rounded-full bg-subtle px-2.5 py-1 text-xs text-ink-2">
                    {x}
                  </li>
                ))}
              </ul>
              <p className={cn("mt-auto pt-4 text-xs font-medium", e.status === "materials" ? "text-success" : "text-warning")}>
                {e.status === "materials" ? "In Mvaak’s scope" : "Confirmed during scoping"}
              </p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/* ───────────── 6. Services ───────────── */
/** Small coded illustration of span/entity labelling for the NLP card (a UI illustration, not data). */
function TextAnnotationVisual() {
  const ent = (text: string, tag: string) => (
    <span className="rounded bg-accent/25 px-1 py-0.5 text-white ring-1 ring-brand-light/50">
      {text}
      <sup className="ml-1 font-mono text-[0.5625rem] tracking-wide text-brand-light uppercase">{tag}</sup>
    </span>
  );
  return (
    <div className="flex h-full flex-col justify-center gap-3 bg-navy p-5 text-[0.8125rem] leading-loose text-on-navy">
      <p>
        Book {ent("a table for two", "qty")} at {ent("7 pm", "time")} near {ent("Indiranagar", "loc")}.
      </p>
      <p className="flex flex-wrap gap-1.5 font-mono text-[0.625rem]">
        <span className="rounded-full border border-navy-line-strong px-2 py-0.5">intent: book_table</span>
        <span className="rounded-full border border-navy-line-strong px-2 py-0.5">sentiment: neutral</span>
      </p>
    </div>
  );
}

function ServiceMedia({ v }: { v: ServiceVisual }) {
  if (v.kind === "text-annotation")
    return (
      <>
        <TextAnnotationVisual />
        <span className={cn("absolute bottom-3 left-3 bg-navy/75 text-on-navy", sourceBadge)}>Illustration</span>
      </>
    );
  if (v.kind === "video")
    return (
      <>
        <SampleMedia media={v.media} alt={v.alt} sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" controls={false} />
        <span className={cn("absolute bottom-3 left-3 bg-accent text-white", sourceBadge)}>{v.label}</span>
      </>
    );
  return (
    <>
      <Image src={v.src} alt={v.alt} fill sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw" className="object-cover" style={v.position ? { objectPosition: v.position } : undefined} />
      <span className={cn("absolute bottom-3 left-3 bg-navy/75 text-on-navy", sourceBadge)}>{v.label}</span>
    </>
  );
}

export function ServicesGrid() {
  return (
    <Section id="solutions" tone="navy" labelledBy="solutions-title" className="overflow-hidden">
      <div aria-hidden className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]" />
      <div className="relative">
        <SectionHeader
          dark
          id="solutions-title"
          eyebrow="Services"
          title="Services built for model teams."
          lead="From first-person capture to reviewed, training-ready datasets."
        />
        <ul className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-2">
          {services.map((svc) => (
            <li key={svc.n} data-reveal>
              <article className="group relative grid h-full overflow-hidden rounded-[1.25rem] border border-navy-line-strong bg-navy-3 transition-[border-color,box-shadow] duration-200 hover:border-brand-light/50 hover:shadow-[0_24px_60px_-30px_rgb(49_91_234/0.6)] sm:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
                <div className="flex flex-col p-6 sm:p-7">
                  <span className="font-mono text-sm font-semibold text-brand-light">{svc.n}</span>
                  <h3 className="mt-3 text-2xl leading-tight font-semibold tracking-tight text-white">{svc.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-on-navy-muted">{svc.body}</p>
                  <p className="mt-4 flex flex-wrap gap-1.5">
                    {svc.tags.map((t) => (
                      <span key={t} className="rounded-full border border-navy-line-strong px-2.5 py-1 font-mono text-[0.6875rem] text-on-navy">
                        {t}
                      </span>
                    ))}
                  </p>
                  <Link
                    href={svc.href}
                    className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-brand-light after:absolute after:inset-0 hover:text-white"
                  >
                    Explore <span className="sr-only">{svc.title}</span>
                    <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
                <div className="relative aspect-video min-h-full border-t border-navy-line sm:aspect-auto sm:border-t-0 sm:border-l">
                  <ServiceMedia v={svc.visual} />
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ───────────── 7. Regions ───────────── */
const regionStyles: Record<Region["status"], string> = {
  base: "border-accent bg-accent text-white",
  engagements: "border-accent-line bg-accent-soft text-ink",
  target: "border-line bg-surface text-ink-2",
};

export function RegionsSection() {
  const groups = (["base", "engagements", "target"] as const).map((status) => ({ status, items: regions.filter((r) => r.status === status) }));
  return (
    <Section id="regions" tone="subtle" bordered labelledBy="regions-title">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <SectionHeader
          id="regions-title"
          eyebrow="Collection regions"
          title="Based in India. Scoping projects across regions."
          lead="Field operations run from India. Collection elsewhere is scoped project by project — we confirm coverage before anything is promised."
        />
        <div data-reveal className="space-y-6">
          {groups.map((g) => (
            <div key={g.status}>
              <h3 className="flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-faint uppercase">
                <span aria-hidden className={cn("size-2.5 rounded-full border", regionStyles[g.status])} />
                {regionStatusLabel[g.status]}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {g.items.map((r) => (
                  <li key={r.name} className={cn("inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm", regionStyles[g.status])}>
                    <MapPin aria-hidden className="size-3.5" />
                    {r.name}
                    {r.kind === "region" && <span className="sr-only"> (region)</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ───────────── 8. Technical capabilities ───────────── */
export function CapabilitiesSection() {
  return (
    <Section id="capabilities" tone="surface" bordered labelledBy="cap-title">
      <SectionHeader
        id="cap-title"
        eyebrow="Technical capabilities"
        title="From capture to a training-ready dataset."
        lead="What is captured, labelled, checked and delivered — agreed per project in a written capture brief."
      />
      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
        {capabilities.map((c, i) => (
          <li key={c.title} data-reveal className="relative rounded-card border border-line bg-canvas p-5">
            <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 font-semibold text-ink">{c.title}</h3>
            <ul className="mt-4 space-y-2">
              {c.items.map((x) => (
                <li key={x} className="flex gap-2 text-sm leading-relaxed text-ink-2">
                  <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                  {x}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ───────────── 10. FAQ ───────────── */
export function HomeFaq() {
  return (
    <Section id="faq" tone="canvas" bordered labelledBy="home-faq-title">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <SectionHeader
          id="home-faq-title"
          eyebrow="FAQ"
          title="Questions AI teams ask us."
          lead={
            <>
              Something else? <Link href="/contact" className="text-accent underline underline-offset-2">Ask us directly</Link>.
            </>
          }
        />
        <div data-reveal>
          <FaqList items={homeFaqs} />
        </div>
      </div>
      <JsonLd data={faqJsonLd(homeFaqs)} />
    </Section>
  );
}
