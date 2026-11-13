"use client";

import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type ReactEventHandler } from "react";
import { Pause, Play } from "lucide-react";
import type { SampleMedia as Media } from "@/content/home";
import { cn } from "@/components/ui/cn";

/**
 * Reusable sample player. Shows the poster immediately; when video sources exist it plays a
 * muted, looping, inline preview only while ≥40% visible (IntersectionObserver), with
 * preload="none" so nothing downloads until it's near the viewport. `eager` is for the hero:
 * it starts at once. Reduced-motion users get the poster plus a play button (no autoplay).
 * If the video fails to load, the poster image is shown instead — never an empty frame.
 */
export type SampleMediaHandle = { video: HTMLVideoElement | null };

type Props = {
  media: Media;
  alt: string;
  sizes: string;
  eager?: boolean;
  controls?: boolean;
  className?: string;
  onTimeUpdate?: ReactEventHandler<HTMLVideoElement>;
};

export const SampleMedia = forwardRef<SampleMediaHandle, Props>(function SampleMedia(
  { media, alt, sizes, eager = false, controls = true, className, onTimeUpdate },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const hasVideo = !!(media.mp4 || media.webm) && !failed;
  useImperativeHandle(ref, () => ({ video: videoRef.current }), []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !reduce) v.play().catch(() => {});
        if (!e.isIntersecting && !v.paused) v.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [hasVideo]);

  if (!hasVideo) {
    return (
      <Image
        src={media.poster}
        alt={alt}
        width={media.posterWidth}
        height={media.posterHeight}
        sizes={sizes}
        className={cn("block h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      <video
        ref={videoRef}
        className="block h-full w-full object-cover"
        poster={media.poster}
        width={media.posterWidth}
        height={media.posterHeight}
        muted
        loop
        playsInline
        preload={eager ? "auto" : "none"}
        aria-label={alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
        onTimeUpdate={onTimeUpdate}
      >
        {media.mp4 && <source src={media.mp4} type="video/mp4" onError={(e) => !media.webm && setFailed(!!e)} />}
        {media.webm && <source src={media.webm} type="video/webm" onError={() => setFailed(true)} />}
      </video>
      {controls && (
        <button
          type="button"
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            if (v.paused) v.play().catch(() => {});
            else v.pause();
          }}
          aria-label={playing ? "Pause video" : "Play video"}
          className="absolute right-3 bottom-3 inline-flex size-10 items-center justify-center rounded-full bg-navy/75 text-white backdrop-blur-sm transition-colors hover:bg-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
        </button>
      )}
    </div>
  );
});
