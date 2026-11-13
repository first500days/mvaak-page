import Image from "next/image";
import { cn } from "@/components/ui/cn";

/**
 * Institutional logos ("We are backed by"). Files are the client-supplied originals, trimmed
 * and exported at high resolution (public/images/recognition/backer-*.png) — never recoloured
 * or stretched. `display` is the rendered height in rem, balanced by visual weight.
 * The exact relationship with each institution is tracked in docs/CONTENT-REVIEW.md §2a.
 */
export const backers = [
  { src: "/images/recognition/backer-iit-kanpur.png", alt: "Indian Institute of Technology Kanpur", w: 327, h: 320, display: 4.25 },
  {
    src: "/images/recognition/backer-siic-iitk.png",
    alt: "Startup Incubation and Innovation Centre, IIT Kanpur",
    w: 431,
    h: 320,
    display: 4,
  },
  { src: "/images/recognition/backer-startup-india.png", alt: "Startup India", w: 351, h: 93, display: 2 },
  { src: "/images/recognition/backer-indiaai.png", alt: "IndiaAI — a MeitY, NeGD and NASSCOM initiative", w: 698, h: 320, display: 3.75 },
  {
    src: "/images/recognition/backer-meity.png",
    alt: "Ministry of Electronics and Information Technology, Government of India",
    w: 253,
    h: 320,
    display: 4.5,
  },
];

function LogoTile({ b }: { b: (typeof backers)[number] }) {
  return (
    <div className="flex h-28 w-44 items-center justify-center rounded-card border border-line bg-white px-5 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-accent-line hover:shadow-[0_12px_28px_-18px_rgb(21_26_33/0.35)] sm:h-32 sm:w-52">
      <Image
        src={b.src}
        alt={b.alt}
        width={b.w}
        height={b.h}
        sizes="208px"
        // Small files; eager so logos sliding in from off-screen are never blank.
        loading="eager"
        style={{ height: `calc(${b.display}rem * var(--logo-scale, 1))` }}
        className="w-auto max-w-full object-contain [--logo-scale:0.85] sm:[--logo-scale:1]"
      />
    </div>
  );
}

/**
 * Continuous logo marquee. The track holds two identical halves (each two full sets, so one
 * half is always wider than the viewport) and slides by exactly -50% — the loop point lands on
 * an identical frame, so there is no jump. Pauses on hover/focus. Reduced-motion users get a
 * single static, centred row; the duplicate sets are hidden from assistive tech.
 */
export function BackedByMarquee({ className }: { className?: string }) {
  const sets = [0, 1, 2, 3];
  return (
    <div
      className={cn(
        "marquee relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <ul className="marquee-track flex w-max">
        {sets.map((set) =>
          backers.map((b) => (
            <li key={`${set}-${b.src}`} aria-hidden={set > 0 || undefined} className={cn("shrink-0 pr-4 sm:pr-6", set > 0 && "marquee-dup")}>
              <LogoTile b={set > 0 ? { ...b, alt: "" } : b} />
            </li>
          )),
        )}
      </ul>
    </div>
  );
}

/** Compact labelled variant (kept for inner pages that want a heading on the left). */
export function BackedBy({ className, title = "We are backed by" }: { className?: string; title?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <p className="font-mono text-xs tracking-[0.14em] text-faint uppercase">{title}</p>
      <BackedByMarquee />
    </div>
  );
}
