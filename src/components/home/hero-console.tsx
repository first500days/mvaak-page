"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Eye, EyeOff, Play, ScanSearch } from "lucide-react";
import {
  heroClipLength,
  heroTasks,
  type HeroAction,
  type HeroTask,
} from "@/content/hero-demo";
import { cn } from "@/components/ui/cn";

/* ───────── helpers ───────── */
const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");
const tenth = (s: number) => Math.floor((s % 1) * 10);
/** Source timecode HH:MM:SS.d */
const timecode = (s: number) =>
  `${pad(s / 3600)}:${pad((s % 3600) / 60)}:${pad(s % 60)}.${tenth(s)}`;
/** Clip time SS.d */
const clipTime = (s: number) => `00:${pad(s)}.${tenth(s)}`;

const RM = "(prefers-reduced-motion: reduce)";
const noop = () => () => {};
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(RM);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(RM).matches,
    () => false,
  );
}

type Mode = "auto" | "play" | "inspect";

/**
 * Interactive capture console for the homepage hero.
 * - Six tasks, each a real 8 s egocentric clip; only the selected clip is ever downloaded.
 * - While playing: a source timecode and a hand-placed action log that follows the video.
 * - "Inspect frame" pauses on the clip's first frame and shows hand-placed object boxes;
 *   hover / tap / focus a box to read its attributes. Boxes never float over moving video.
 * - Pauses off-screen; reduced-motion visitors start on the inspected keyframe (no autoplay);
 *   if the video fails, the poster frame is shown and the boxes still work.
 */
export function HeroConsole({
  tasks = heroTasks,
}: { tasks?: HeroTask[] } = {}) {
  const reduce = useReducedMotion();
  // Sources are attached only after hydration, so a load failure can never fire before
  // React is listening (the poster is server-rendered and preloaded, so first paint is unchanged).
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const [ti, setTi] = useState(0);
  const task = tasks[ti];
  const [mode, setMode] = useState<Mode>("auto");
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [annotations, setAnnotations] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  const inspecting =
    failed || mode === "inspect" || (mode === "auto" && reduce);
  const wantsPlay = !inspecting && (mode === "play" || !reduce);

  const sync = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (wantsPlay && visible.current) v.play().catch(() => {});
    else if (!v.paused) v.pause();
  }, [wantsPlay]);
  const syncRef = useRef(sync);
  useEffect(() => {
    syncRef.current = sync;
  }, [sync]);

  // Mode / task changes: inspecting snaps to the annotated keyframe (t = 0).
  useEffect(() => {
    const v = videoRef.current;
    if (v && inspecting) {
      v.pause();
      if (v.currentTime > 0.02) v.currentTime = 0;
    }
    sync();
  }, [inspecting, sync, task.id]);

  // Only play while the console is on screen.
  useEffect(() => {
    const el = frameRef.current;
    if (!el || !("IntersectionObserver" in window)) {
      visible.current = true;
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        syncRef.current();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Smooth timecode while playing.
  useEffect(() => {
    if (!playing) return;
    let id = 0;
    const loop = () => {
      const v = videoRef.current;
      if (v) setT(v.currentTime);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [playing]);

  const chooseTask = (i: number) => {
    if (i === ti) return;
    setTi(i);
    setT(0);
    setSelected(null);
    setFailed(false);
    setPlaying(false);
  };

  const toggleInspect = () => {
    setSelected(null);
    setMode(inspecting ? "play" : "inspect");
  };

  const jumpTo = (a: HeroAction) => {
    const v = videoRef.current;
    if (!v || failed) return;
    v.currentTime = a.start + 0.02;
    setT(a.start);
    setSelected(null);
    setMode("play");
  };

  const current =
    task.actions.find((a) => t >= a.start && t < a.end) ??
    task.actions[task.actions.length - 1];
  const box = task.boxes.find((b) => b.id === selected);
  const showBoxes = inspecting && annotations;

  return (
    <div className="overflow-hidden rounded-[1.25rem] border border-navy-line-strong bg-navy-3/90 shadow-[0_30px_70px_-35px_rgb(0_0_0/0.75)] backdrop-blur">
      {/* Status bar */}
      <div className="flex items-center justify-between gap-3 border-b border-navy-line px-4 py-2.5 font-mono text-[0.6875rem] tracking-[0.08em] uppercase">
        <span className="inline-flex items-center gap-2 text-on-navy">
          <span
            aria-hidden
            className={cn(
              "size-2 rounded-full",
              inspecting ? "bg-on-navy-muted" : "animate-pulse bg-[#ef4444]",
            )}
          />
          {inspecting ? "Paused · keyframe" : "Rec"}
          <span
            className="text-on-navy-muted tabular-nums"
            aria-label="Source timecode"
          >
            {timecode(task.sourceOffset + t)}
          </span>
        </span>
        <span className="hidden text-on-navy-muted sm:inline">
          Ego-cam · 1080p30 · wide-angle
        </span>
      </div>

      {/* Task selector */}
      {tasks.length > 1 && (
        <div
          role="group"
          aria-label="Sample task"
          className="flex gap-1.5 overflow-x-auto border-b border-navy-line px-3 py-2.5 [scrollbar-width:none]"
        >
          {tasks.map((tk, i) => (
            <button
              key={tk.id}
              type="button"
              aria-pressed={i === ti}
              onClick={() => chooseTask(i)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                i === ti
                  ? "border-brand bg-brand text-navy"
                  : "border-navy-line-strong text-on-navy hover:border-brand-light/60 hover:text-white",
              )}
            >
              {tk.label}
            </button>
          ))}
        </div>
      )}

      {/* Frame */}
      <div ref={frameRef} className="relative aspect-video bg-navy">
        {failed ? (
          <Image
            src={task.media.poster}
            alt={task.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <video
            key={task.id}
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster={task.media.poster}
            muted
            loop
            playsInline
            preload={ti === 0 ? "auto" : "metadata"}
            aria-label={task.alt}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onSeeked={(e) => setT(e.currentTarget.currentTime)}
            onLoadedData={() => syncRef.current()}
            onError={() => setFailed(true)}
          >
            {hydrated && task.media.mp4 && (
              <source
                src={task.media.mp4}
                type="video/mp4"
                onError={() => !task.media.webm && setFailed(true)}
              />
            )}
            {hydrated && task.media.webm && (
              <source
                src={task.media.webm}
                type="video/webm"
                onError={() => setFailed(true)}
              />
            )}
          </video>
        )}

        {/* Click-to-inspect surface (sits under the boxes) */}
        {!failed && (
          <button
            type="button"
            onClick={toggleInspect}
            aria-label={
              inspecting ? "Resume video" : "Pause and inspect this frame"
            }
            className="absolute inset-0 cursor-crosshair focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
          />
        )}

        {/* Object boxes — keyframe only */}
        {showBoxes &&
          task.boxes.map((b) => (
            <button
              key={b.id}
              type="button"
              onMouseEnter={() => setSelected(b.id)}
              onFocus={() => setSelected(b.id)}
              onClick={() => setSelected(b.id)}
              aria-label={`Object: ${b.cls}`}
              aria-pressed={selected === b.id}
              className={cn(
                "absolute rounded-[3px] border-[1.5px] transition-colors focus-visible:outline-none",
                selected === b.id
                  ? "z-10 border-white bg-white/10"
                  : "border-brand-light/90 bg-brand/10 hover:border-white",
              )}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.w}%`,
                height: `${b.h}%`,
              }}
            >
              <span
                className={cn(
                  "absolute left-[-1.5px] max-w-[14rem] truncate rounded-[3px] px-1.5 py-0.5 text-left font-mono text-[0.625rem] leading-tight",
                  b.y < 8 ? "top-[-1.5px]" : "-top-[1.15rem]",
                  selected === b.id
                    ? "bg-white text-navy"
                    : "bg-navy/85 text-on-navy",
                )}
              >
                {b.cls}
              </span>
            </button>
          ))}

        {/* Overlays */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-2">
          {annotations && !inspecting && current ? (
            <span className="rounded-md bg-navy/80 px-2 py-1 font-mono text-[0.6875rem] text-on-navy backdrop-blur-sm">
              <span className="text-brand-light">action</span> {current.verb} ·{" "}
              {current.object}
            </span>
          ) : showBoxes ? (
            <span className="rounded-md bg-navy/80 px-2 py-1 font-mono text-[0.625rem] tracking-wide text-on-navy uppercase backdrop-blur-sm">
              Demo labels · hand-placed
            </span>
          ) : (
            <span />
          )}
        </div>

        {/* Controls */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            type="button"
            onClick={() => setAnnotations((a) => !a)}
            aria-pressed={annotations}
            className="inline-flex items-center gap-1.5 rounded-full bg-navy/80 px-2.5 py-1.5 font-mono text-[0.625rem] tracking-wide text-on-navy uppercase backdrop-blur-sm hover:bg-navy focus-visible:outline-2 focus-visible:outline-white"
          >
            {annotations ? (
              <Eye aria-hidden className="size-3.5" />
            ) : (
              <EyeOff aria-hidden className="size-3.5" />
            )}
            Labels
          </button>
          {!failed && (
            <button
              type="button"
              onClick={toggleInspect}
              className="inline-flex items-center gap-1.5 rounded-full bg-navy/80 px-2.5 py-1.5 font-mono text-[0.625rem] tracking-wide text-on-navy uppercase backdrop-blur-sm hover:bg-navy focus-visible:outline-2 focus-visible:outline-white"
            >
              {inspecting ? (
                <Play aria-hidden className="size-3.5" />
              ) : (
                <ScanSearch aria-hidden className="size-3.5" />
              )}
              {inspecting ? "Play" : "Inspect"}
            </button>
          )}
        </div>
      </div>

      {/* Data panels */}
      <div className="grid border-t border-navy-line sm:grid-cols-2">
        <div className="border-navy-line p-4 sm:border-r">
          <p className="flex items-center justify-between font-mono text-[0.625rem] tracking-[0.12em] text-brand-light uppercase">
            Action log <span className="text-on-navy-muted">demo</span>
          </p>
          <ol className="mt-2.5 space-y-1">
            {task.actions.map((a) => {
              const state = inspecting
                ? a.start === 0
                  ? "active"
                  : "next"
                : t >= a.end
                  ? "done"
                  : t >= a.start
                    ? "active"
                    : "next";
              return (
                <li key={a.start}>
                  <button
                    type="button"
                    onClick={() => jumpTo(a)}
                    aria-current={state === "active" ? "true" : undefined}
                    className={cn(
                      "flex w-full items-baseline gap-3 rounded px-1.5 py-1 text-left font-mono text-[0.6875rem] transition-colors hover:bg-white/5",
                      state === "active"
                        ? "bg-white/10 text-white"
                        : state === "done"
                          ? "text-on-navy"
                          : "text-on-navy-muted",
                    )}
                  >
                    <span className="shrink-0 tabular-nums">
                      {clipTime(a.start)}
                    </span>
                    <span className="truncate">
                      {a.verb} · {a.object}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {/* Playhead */}
          <div
            className="relative mt-3 h-1 overflow-hidden rounded-full bg-navy"
            aria-hidden
          >
            <span
              className="absolute inset-y-0 left-0 bg-brand"
              style={{ width: `${Math.min(100, (t / heroClipLength) * 100)}%` }}
            />
          </div>
        </div>

        <div
          className="border-t border-navy-line p-4 sm:border-t-0"
          aria-live="polite"
        >
          {box ? (
            <>
              <p className="font-mono text-[0.625rem] tracking-[0.12em] text-brand-light uppercase">
                Selected object
              </p>
              <p className="mt-2 font-mono text-sm text-white">{box.cls}</p>
              <dl className="mt-2 space-y-1 text-xs">
                {box.attrs.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-2">
                    <dt className="text-on-navy-muted">{k}</dt>
                    <dd className="text-on-navy">{v}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[6.5rem_1fr] gap-2">
                  <dt className="text-on-navy-muted">Box (x,y,w,h)</dt>
                  <dd className="font-mono text-on-navy tabular-nums">
                    {box.x},{box.y},{box.w},{box.h} %
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <>
              <p className="font-mono text-[0.625rem] tracking-[0.12em] text-brand-light uppercase">
                Sample metadata
              </p>
              <dl className="mt-2 space-y-1 text-xs">
                {[
                  ["Task", task.label],
                  ["Environment", task.environment],
                  ["Capture", "Egocentric · wearable"],
                  ["Source", "1920×1080 · 30 fps"],
                  [
                    "Layers",
                    inspecting ? "Object boxes (keyframe)" : "Action segments",
                  ],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-2">
                    <dt className="text-on-navy-muted">{k}</dt>
                    <dd className="text-on-navy">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-2 text-[0.6875rem] text-on-navy-muted">
                {inspecting
                  ? "Hover or tap a box to read its labels."
                  : "Tap the frame to inspect objects."}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
