"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, Hand, RotateCcw, RotateCw, Undo2 } from "lucide-react";
import { captureParameters, objectInfo, workspaceTasks } from "@/content/workspace-tasks";
import type { CaptureEvent, ItemInfo, Telemetry, WorkspaceApi } from "./workspace/workspace-scene";
import { cn } from "@/components/ui/cn";

// Three.js is loaded only in the browser, after the page is interactive.
const WorkspaceScene = dynamic(() => import("./workspace/workspace-scene"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center">
      <p className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-faint uppercase">
        <span aria-hidden className="size-2 animate-pulse rounded-full bg-brand" /> Loading 3D workspace
      </p>
    </div>
  ),
});

const RM = "(prefers-reduced-motion: reduce)";
const useReducedMotion = () =>
  useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(RM);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(RM).matches,
    () => false,
  );

const ts = (t: number) => `${String(Math.floor(t / 60)).padStart(2, "0")}:${(t % 60).toFixed(1).padStart(4, "0")}`;
const cm = (v: number) => `${v >= 0 ? "" : "−"}${Math.abs(v).toFixed(1)}`;

/**
 * Homepage opening section: an interactive 3D capture workspace. Two virtual hands follow the
 * cursor (or finger); visitors pick up, drag, rotate, stack and release everyday objects.
 * The panel shows the task, live object pose, task progress and the event log generated from
 * the visitor's own interactions. It is a simulation and is labelled as one.
 */
export function CaptureWorkspace() {
  const reduce = useReducedMotion();
  const [ti, setTi] = useState(0);
  const task = workspaceTasks[ti];
  const api = useRef<WorkspaceApi | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);
  const [tel, setTel] = useState<Telemetry>({ status: "Move the cursor over the table", selected: null });
  const [events, setEvents] = useState<CaptureEvent[]>([]);
  const [goals, setGoals] = useState<boolean[]>([]);
  const [items, setItems] = useState<ItemInfo[]>([]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onTelemetry = useCallback((t: Telemetry) => setTel(t), []);
  const onEvent = useCallback((e: CaptureEvent) => setEvents((list) => [e, ...list].slice(0, 6)), []);
  const onGoals = useCallback((g: boolean[]) => setGoals(g), []);
  const onItems = useCallback((i: ItemInfo[]) => setItems(i), []);

  const chooseTask = (i: number) => {
    if (i === ti) return;
    setTi(i);
    setEvents([]);
  };

  const rotateLeft = () => api.current?.rotate(-1);
  const rotateRight = () => api.current?.rotate(1);
  const resetWorkspace = () => {
    api.current?.reset();
    setEvents([]);
  };

  const done = goals.filter(Boolean).length;
  const sel = tel.selected;

  return (
    <section aria-labelledby="workspace-title" className="relative overflow-hidden border-b border-line bg-[linear-gradient(180deg,var(--color-canvas),var(--color-accent-soft))]">
      <div aria-hidden className="bg-grid absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
      <div className="container-page relative pt-10 pb-12 sm:pt-12 lg:pt-14 lg:pb-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-accent uppercase">
            <Hand aria-hidden className="size-3.5" /> Interactive capture workspace
          </p>
          <h2 id="workspace-title" className="mt-4 text-h1 font-semibold text-balance text-ink">
            Pick it up. That’s training data.
          </h2>
          <p className="mt-4 max-w-2xl text-lead text-pretty text-muted">
            Move, pick, rotate and arrange objects to explore how real-world human interactions become training data for AI.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* Workspace */}
          <div className="min-w-0 overflow-hidden rounded-[1.5rem] border border-line bg-surface shadow-[0_30px_60px_-35px_rgb(16_29_58/0.45)]">
            <div ref={stageRef} className="relative h-[420px] sm:h-[480px] lg:h-[560px]" data-testid="workspace-stage">
              <WorkspaceScene
                task={task}
                apiRef={api}
                labelRef={labelRef}
                stageRef={stageRef}
                reduceMotion={reduce}
                active={active}
                onTelemetry={onTelemetry}
                onEvent={onEvent}
                onGoals={onGoals}
                onItems={onItems}
              />
              <div
                ref={labelRef}
                aria-hidden
                className="pointer-events-none absolute top-0 left-0 rounded-md bg-navy/85 px-2 py-1 font-mono text-[0.6875rem] whitespace-nowrap text-white opacity-0 shadow-sm transition-opacity"
              />
              <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.08em] text-ink-2 uppercase shadow-sm backdrop-blur">
                  <span aria-hidden className="size-2 animate-pulse rounded-full bg-[#ef4444]" /> Recording session · {events.length ? `${events.length}+ events` : "ready"}
                </span>
              </div>
              <span className="pointer-events-none absolute top-3 right-3 hidden rounded-full bg-white/90 px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.08em] text-faint uppercase shadow-sm sm:inline">
                Simulated workspace
              </span>
              <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-2">
                <p className="pointer-events-none hidden rounded-full bg-white/90 px-3 py-1.5 text-xs text-ink-2 shadow-sm md:block">
                  Drag to move · drop on another object to stack · scroll or Q / E to rotate while holding
                </p>
                <div className="ml-auto flex gap-1.5">
                  <ToolButton label="Rotate left" onClick={rotateLeft} disabled={!sel}>
                    <RotateCcw aria-hidden className="size-4" />
                  </ToolButton>
                  <ToolButton label="Rotate right" onClick={rotateRight} disabled={!sel}>
                    <RotateCw aria-hidden className="size-4" />
                  </ToolButton>
                  <ToolButton label="Reset workspace" onClick={resetWorkspace}>
                    <Undo2 aria-hidden className="size-4" />
                  </ToolButton>
                </div>
              </div>
            </div>
          </div>

          {/* Task & parameter panel */}
          <aside aria-label="Task and capture parameters" className="min-w-0 rounded-[1.5rem] border border-line bg-surface p-5 shadow-[0_20px_40px_-30px_rgb(21_26_33/0.35)]">
            <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-faint uppercase">Task</p>
            <div role="group" aria-label="Choose a task" className="mt-2 grid grid-cols-2 gap-1.5">
              {workspaceTasks.map((tk, i) => (
                <button
                  key={tk.id}
                  type="button"
                  aria-pressed={i === ti}
                  onClick={() => chooseTask(i)}
                  className={cn(
                    "rounded-lg border px-2.5 py-2 text-left text-xs leading-snug font-medium transition-colors",
                    i === ti ? "border-accent bg-accent text-white" : "border-line bg-canvas text-ink-2 hover:border-accent-line",
                  )}
                >
                  {tk.label}
                </button>
              ))}
            </div>

            <dl className="mt-4 space-y-1.5 text-sm">
              {[
                ["Activity", task.activity],
                ["Environment", task.environment],
                ["Capture type", "Egocentric · two-hand"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-2">
                  <dt className="text-faint">{k}</dt>
                  <dd className="text-ink-2">{v}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[6.5rem_1fr] gap-2">
                <dt className="text-faint">Status</dt>
                <dd className="font-medium text-ink" aria-live="polite" data-testid="ws-status">
                  {tel.status}
                </dd>
              </div>
            </dl>

            <p className="mt-4 font-mono text-[0.6875rem] tracking-[0.12em] text-faint uppercase">Objects</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {items.map((it) => (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => api.current?.select(it.id)}
                    aria-pressed={sel?.id === it.id}
                    title={objectInfo[it.kind].label}
                    className={cn(
                      "rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] transition-colors",
                      sel?.id === it.id ? "border-accent bg-accent-soft text-accent-strong" : "border-line bg-canvas text-ink-2 hover:border-accent-line",
                    )}
                  >
                    {it.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-3 rounded-xl bg-subtle p-3 font-mono text-xs" data-testid="ws-pose">
              {sel ? (
                <>
                  <p className="flex justify-between text-ink">
                    <span>{sel.name}</span>
                    <span className={sel.held ? "text-accent" : "text-faint"}>{sel.held ? "held" : `on ${sel.on}`}</span>
                  </p>
                  <p className="mt-1.5 text-ink-2 tabular-nums">
                    pos (cm) x {cm(sel.x)} · y {cm(sel.y)} · z {cm(sel.z)}
                  </p>
                  <p className="text-ink-2 tabular-nums">rot yaw {sel.yaw.toFixed(0)}°</p>
                </>
              ) : (
                <p className="text-faint">Pick or select an object to see its pose.</p>
              )}
            </div>

            <div className="mt-4">
              <p className="flex items-center justify-between font-mono text-[0.6875rem] tracking-[0.12em] text-faint uppercase">
                Task progress
                <span className="text-accent">
                  {done}/{task.goals.length}
                </span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-subtle" aria-hidden>
                <span className="block h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(done / task.goals.length) * 100}%` }} />
              </div>
              <ul className="mt-2.5 space-y-1.5" data-testid="ws-goals">
                {task.goals.map((g, i) => (
                  <li key={g.text} className={cn("flex items-start gap-2 text-sm", goals[i] ? "text-ink" : "text-muted")}>
                    <span
                      aria-hidden
                      className={cn("mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border", goals[i] ? "border-success bg-success text-white" : "border-line-strong")}
                    >
                      {goals[i] && <Check className="size-3" />}
                    </span>
                    <span>
                      {g.text}
                      <span className="sr-only">{goals[i] ? " — done" : " — not yet"}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 border-t border-line pt-4">
              <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-faint uppercase">Data collection parameters</p>
              <dl className="mt-2 space-y-1 text-xs">
                {captureParameters.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-2">
                    <dt className="text-faint">{k}</dt>
                    <dd className="text-ink-2">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-4 border-t border-line pt-4">
              <p className="font-mono text-[0.6875rem] tracking-[0.12em] text-faint uppercase">Captured events</p>
              <ol className="mt-2 min-h-[4.5rem] space-y-0.5 font-mono text-[0.6875rem]" data-testid="ws-events">
                {events.length ? (
                  events.map((e, i) => (
                    <li key={e.id} className={i === 0 ? "text-ink" : "text-faint"}>
                      <span className="tabular-nums">{ts(e.t)}</span> {e.verb}({e.object}
                      {e.detail ? `, ${e.detail}` : ""})
                    </li>
                  ))
                ) : (
                  <li className="text-faint">Your interactions will appear here.</li>
                )}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function ToolButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink-2 shadow-sm transition-colors hover:border-accent-line hover:text-accent disabled:opacity-40"
    >
      {children}
    </button>
  );
}
