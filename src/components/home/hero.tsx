import { ButtonLink } from "@/components/ui/button";
import { preload } from "react-dom";
import { HeroConsole } from "./hero-console";
import { heroTasks } from "@/content/hero-demo";

export function Hero() {
  // The first task's poster is the first visible frame (LCP candidate) — fetch it early.
  preload(heroTasks[0].media.poster, { as: "image", fetchPriority: "high" });
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-navy text-on-navy">
      <div aria-hidden className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_at_70%_35%,black,transparent_75%)]" />
      <div className="container-page relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 pt-12 pb-14 sm:pt-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-12 lg:pt-16 lg:pb-20">
        <div className="max-w-xl">
          <p className="font-mono text-xs tracking-[0.14em] text-brand-light uppercase">Egocentric data · Robotics · Physical AI</p>
          <h1 id="hero-title" className="mt-5 text-display font-semibold text-balance text-white">
            Real-World Data for the Next Generation of AI
          </h1>
          <p className="mt-6 max-w-lg text-lead text-pretty text-on-navy-muted">
            From egocentric video capture to structured, annotated datasets, Mvaak helps power robotics, computer vision, and Physical
            AI with real-world human activity data.
          </p>
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

        <div className="min-w-0">
          <HeroConsole tasks={heroTasks.slice(0, 1)} />
          <p className="mt-3 text-xs leading-relaxed text-on-navy-muted">
            Real Mvaak egocentric capture. The action log and object boxes are demonstration labels placed by hand on this footage —
            not model output or a client deliverable.
          </p>
        </div>
      </div>
    </section>
  );
}
