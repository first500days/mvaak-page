import { ButtonLink } from "@/components/ui/button";
import { preload } from "react-dom";
import { SampleMedia } from "./sample-media";
import { clips } from "@/content/home";

export function Hero() {
  // The poster is the first visible frame (LCP candidate) — fetch it early.
  preload(clips.sheetHandling.poster, { as: "image", fetchPriority: "high" });
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-navy text-on-navy">
      <div aria-hidden className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_75%_40%,black,transparent_75%)]" />
      <div className="container-page relative grid items-center gap-12 pt-14 pb-16 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:pt-20 lg:pb-24">
        <div className="max-w-xl">
          <p className="font-mono text-xs tracking-[0.14em] text-brand-light uppercase">Egocentric data · Robotics · Physical AI</p>
          <h1 id="hero-title" className="mt-5 text-display font-semibold text-balance text-white">
            Real-World Data for the Next Generation of AI.
          </h1>
          <p className="mt-6 max-w-lg text-lead text-pretty text-on-navy-muted">
            First-person video of real human tasks, with synchronised sensor data — captured by trained collectors in real environments,
            annotated, quality-checked and delivered training-ready.
          </p>
          <ul aria-label="What every dataset includes" className="mt-6 flex flex-wrap gap-2">
            {["Egocentric RGB · stereo", "IMU aligned to frames", "Sub-action segmentation", "LeRobot · RLDS · MCAP"].map((t) => (
              <li key={t} className="rounded-full border border-navy-line-strong bg-white/5 px-3 py-1 font-mono text-[0.6875rem] tracking-wide text-on-navy">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/contact" size="lg" arrow trackAs="hero_discuss_project">
              Discuss Your Project
            </ButtonLink>
            <ButtonLink href="#samples" size="lg" variant="outline-light" trackAs="hero_explore_data">
              Explore Our Data
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm text-on-navy-muted">
            For robotics &amp; Physical AI · computer vision · speech &amp; voice AI · NLP &amp; LLM data
          </p>
        </div>

        <div className="relative">
          <figure className="relative aspect-video overflow-hidden rounded-[1.25rem] border border-navy-line-strong bg-navy-3 shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)]">
            <SampleMedia
              media={clips.sheetHandling}
              eager
              alt="Real first-person video: gloved hands handling a metal sheet on a factory floor, recorded on a wide-angle wearable camera."
              sizes="(min-width: 1280px) 40rem, (min-width: 1024px) 52vw, 100vw"
            />
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-navy/75 px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.12em] text-on-navy uppercase backdrop-blur-sm">
              <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-success" /> Live sample
            </span>
          </figure>
          <p className="mt-3 flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.12em] text-on-navy-muted uppercase">
            <span aria-hidden className="size-1.5 rounded-full bg-brand-light" />
            Real egocentric capture · metal fabrication plant · wearable camera
          </p>
        </div>
      </div>
    </section>
  );
}
