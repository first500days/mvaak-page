"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { memo, useEffect, useImperativeHandle, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { objectInfo, ZONE_X, type Goal, type ObjectKind, type WorkspaceTask } from "@/content/workspace-tasks";

/* ───────────────────────── Types shared with the panel ───────────────────────── */

export type CaptureEvent = { id: number; t: number; verb: string; object: string; detail?: string };
export type Telemetry = {
  status: string;
  selected: null | { id: string; name: string; kind: ObjectKind; x: number; y: number; z: number; yaw: number; on: string; held: boolean };
};
export type WorkspaceApi = { rotate: (dir: 1 | -1) => void; select: (id: string) => void; reset: () => void };
export type ItemInfo = { id: string; name: string; kind: ObjectKind };

type Item = {
  id: string;
  kind: ObjectKind;
  name: string;
  x: number;
  z: number;
  y: number;
  ty: number;
  rot: number;
  trot: number;
  h: number;
  r: number;
  support: string | null;
  group: THREE.Group | null;
};

const BOUNDS = { x: 3.75, z: 1.95 };
const ROT_STEP = Math.PI / 12; // 15°
const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt));

/* ───────────────────────── Procedural objects ───────────────────────── */

function std(color: string, rough = 0.6, metal = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });
}

function Notebook() {
  const [w, d, h] = objectInfo.notebook.size;
  const m = useMemo(() => ({ cover: std("#3a6ea8", 0.55), pages: std("#f7f5ee", 0.9), band: std("#1d2a44", 0.5) }), []);
  return (
    <group>
      <mesh castShadow receiveShadow material={m.cover} position={[0, 0.02, 0]}>
        <boxGeometry args={[w, 0.04, d]} />
      </mesh>
      <mesh castShadow receiveShadow material={m.pages} position={[0.03, 0.08, 0]}>
        <boxGeometry args={[w - 0.1, 0.08, d - 0.08]} />
      </mesh>
      <mesh castShadow material={m.cover} position={[0, h - 0.02, 0]}>
        <boxGeometry args={[w, 0.04, d]} />
      </mesh>
      <mesh material={m.band} position={[w / 2 - 0.25, h / 2, 0]}>
        <boxGeometry args={[0.06, h + 0.02, d + 0.01]} />
      </mesh>
    </group>
  );
}

function Phone() {
  const [w, d, h] = objectInfo.phone.size;
  const m = useMemo(
    () => ({
      body: std("#22262d", 0.35, 0.4),
      screen: new THREE.MeshStandardMaterial({ color: "#16233b", roughness: 0.15, metalness: 0.2, emissive: "#2b4f86", emissiveIntensity: 0.35 }),
      lens: std("#0d0f12", 0.2, 0.6),
    }),
    [],
  );
  return (
    <group>
      <mesh castShadow receiveShadow material={m.body} position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      <mesh material={m.screen} position={[0, h + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w - 0.08, d - 0.1]} />
      </mesh>
      <mesh material={m.lens} position={[w / 2 - 0.16, h + 0.004, -d / 2 + 0.16]}>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 20]} />
      </mesh>
    </group>
  );
}

function Mug() {
  const m = useMemo(() => ({ cer: std("#fbfbf8", 0.35), coffee: std("#4a2c1d", 0.25), band: std("#3a6ea8", 0.4) }), []);
  const geo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.33, 0),
      new THREE.Vector2(0.36, 0.04),
      new THREE.Vector2(0.37, 0.8),
      new THREE.Vector2(0.33, 0.8),
      new THREE.Vector2(0.32, 0.12),
      new THREE.Vector2(0, 0.12),
    ];
    return new THREE.LatheGeometry(pts, 40);
  }, []);
  return (
    <group>
      <mesh castShadow receiveShadow geometry={geo} material={m.cer} />
      <mesh material={m.coffee} position={[0, 0.66, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.325, 32]} />
      </mesh>
      <mesh material={m.band} position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.372, 0.372, 0.08, 40, 1, true]} />
      </mesh>
      <mesh castShadow material={m.cer} position={[0.4, 0.42, 0]}>
        <torusGeometry args={[0.18, 0.045, 12, 24, Math.PI]} />
      </mesh>
    </group>
  );
}

function Bottle() {
  const m = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({ color: "#cfe3f4", roughness: 0.08, metalness: 0.05, transparent: true, opacity: 0.78 }),
      water: new THREE.MeshStandardMaterial({ color: "#8fb9e3", roughness: 0.1, transparent: true, opacity: 0.55 }),
      cap: std("#3a6ea8", 0.35),
      label: std("#ffffff", 0.6),
    }),
    [],
  );
  const geo = useMemo(() => {
    const pts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.28, 0),
      new THREE.Vector2(0.3, 0.06),
      new THREE.Vector2(0.3, 1.12),
      new THREE.Vector2(0.22, 1.3),
      new THREE.Vector2(0.13, 1.42),
      new THREE.Vector2(0.13, 1.48),
      new THREE.Vector2(0, 1.48),
    ];
    return new THREE.LatheGeometry(pts, 36);
  }, []);
  return (
    <group>
      <mesh castShadow receiveShadow geometry={geo} material={m.body} />
      <mesh material={m.water} position={[0, 0.48, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 0.9, 32]} />
      </mesh>
      <mesh material={m.label} position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.305, 0.305, 0.34, 36, 1, true]} />
      </mesh>
      <mesh castShadow material={m.cap} position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.15, 24]} />
      </mesh>
    </group>
  );
}

function Box() {
  const [w, d, h] = objectInfo.box.size;
  const m = useMemo(() => ({ kraft: std("#c9a27a", 0.85), tape: std("#e3cfa8", 0.4), label: std("#ffffff", 0.7), mark: std("#3a6ea8", 0.6) }), []);
  return (
    <group>
      <mesh castShadow receiveShadow material={m.kraft} position={[0, h / 2, 0]}>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      <mesh material={m.tape} position={[0, h + 0.003, 0]}>
        <boxGeometry args={[0.22, 0.006, d + 0.004]} />
      </mesh>
      <mesh material={m.label} position={[w / 4, h / 2, d / 2 + 0.004]}>
        <planeGeometry args={[0.38, 0.24]} />
      </mesh>
      <mesh material={m.mark} position={[w / 4, h / 2 + 0.05, d / 2 + 0.006]}>
        <planeGeometry args={[0.28, 0.04]} />
      </mesh>
    </group>
  );
}

function Pen() {
  const m = useMemo(() => ({ body: std("#1d2a44", 0.3, 0.2), tip: std("#c9ced6", 0.25, 0.8), clip: std("#c9ced6", 0.25, 0.8) }), []);
  return (
    <group position={[0, 0.055, 0]}>
      <mesh castShadow material={m.body} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 1.2, 16]} />
      </mesh>
      <mesh castShadow material={m.tip} position={[-0.68, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.055, 0.16, 16]} />
      </mesh>
      <mesh material={m.clip} position={[0.35, 0.06, 0]}>
        <boxGeometry args={[0.4, 0.015, 0.03]} />
      </mesh>
    </group>
  );
}

function Headphones() {
  const m = useMemo(() => ({ shell: std("#2a2f36", 0.45), pad: std("#16191d", 0.9), accent: std("#558ac4", 0.4) }), []);
  return (
    <group>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.58, 0, 0.08]}>
          <mesh castShadow receiveShadow material={m.shell} position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.28, 0.3, 0.2, 28]} />
          </mesh>
          <mesh material={m.pad} position={[0, 0.215, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.06, 10, 28]} />
          </mesh>
          <mesh material={m.accent} position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.24, 0.29, 28]} />
          </mesh>
        </group>
      ))}
      <mesh castShadow material={m.shell} position={[0, 0.1, 0.08]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.58, 0.05, 10, 40, Math.PI]} />
      </mesh>
    </group>
  );
}

const BUILDERS: Record<ObjectKind, () => React.JSX.Element> = {
  notebook: Notebook,
  phone: Phone,
  mug: Mug,
  bottle: Bottle,
  box: Box,
  pen: Pen,
  headphones: Headphones,
};

/* ───────────────────────── Hands ───────────────────────── */

const NO_RAYCAST_HAND = () => null;

type HandRig = { root: THREE.Group | null; fingers: THREE.Group[]; thumb: THREE.Group | null; arm: THREE.Mesh | null; cuff: THREE.Mesh | null; curl: number };

function Hand({ side, rigRef }: { side: 1 | -1; rigRef: RefObject<HandRig> }) {
  const m = useMemo(() => ({ glove: std("#f2f4f7", 0.75), seam: std("#dfe5ee", 0.8), cuff: std("#558ac4", 0.45), sleeve: std("#d8e0ea", 0.85) }), []);
  const finger = useMemo(() => new THREE.CapsuleGeometry(0.052, 0.24, 4, 10), []);
  const set = (i: number) => (g: THREE.Group | null) => {
    if (g) rigRef.current.fingers[i] = g;
  };
  return (
    <>
      <group ref={(g) => { rigRef.current.root = g; if (g) g.traverse((o) => ((o as THREE.Mesh).raycast = NO_RAYCAST_HAND)); }}>
        <group rotation={[0.28, 0, 0]}>
          <mesh castShadow material={m.glove} scale={[0.27, 0.085, 0.3]}>
            <sphereGeometry args={[1, 24, 16]} />
          </mesh>
          {[-0.15, -0.05, 0.05, 0.15].map((fx, i) => (
            <group key={fx} ref={set(i)} position={[fx * side, 0, -0.24]}>
              <mesh castShadow geometry={finger} material={m.glove} position={[0, 0, -0.16 - (i === 1 || i === 2 ? 0.02 : 0)]} rotation={[Math.PI / 2, 0, 0]} />
            </group>
          ))}
          <group ref={(g) => { rigRef.current.thumb = g; }} position={[-0.24 * side, -0.01, -0.05]} rotation={[0, 0.7 * side, 0]}>
            <mesh castShadow geometry={finger} material={m.glove} position={[0, 0, -0.14]} rotation={[Math.PI / 2, 0, 0]} scale={[1.08, 0.85, 1.08]} />
          </group>
          <mesh material={m.seam} position={[0, 0.07, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.07, 20]} />
          </mesh>
        </group>
      </group>
      <mesh ref={(c) => { rigRef.current.cuff = c; }} raycast={NO_RAYCAST_HAND} castShadow material={m.cuff}>
        <cylinderGeometry args={[0.2, 0.2, 0.18, 24]} />
      </mesh>
      <mesh ref={(a) => { rigRef.current.arm = a; }} raycast={NO_RAYCAST_HAND} castShadow material={m.sleeve}>
        <cylinderGeometry args={[0.19, 0.26, 1, 24]} />
      </mesh>
    </>
  );
}

const UP = new THREE.Vector3(0, 1, 0);
const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpQ = new THREE.Quaternion();

function poseHand(rig: HandRig, pos: THREE.Vector3, shoulder: THREE.Vector3, curl: number, dt: number) {
  if (!rig.root) return;
  rig.root.position.copy(pos);
  rig.curl = damp(rig.curl, curl, 14, dt);
  rig.fingers.forEach((f, i) => f && (f.rotation.x = -rig.curl * (1.15 + i * 0.05)));
  if (rig.thumb) rig.thumb.rotation.x = -rig.curl * 0.6;
  // Arm: from just behind the wrist up to the shoulder near the camera.
  const wrist = tmpA.set(pos.x, pos.y + 0.04, pos.z + 0.32);
  const dir = tmpB.copy(shoulder).sub(wrist);
  const len = dir.length();
  dir.normalize();
  tmpQ.setFromUnitVectors(UP, dir);
  if (rig.arm) {
    rig.arm.quaternion.copy(tmpQ);
    rig.arm.scale.set(1, len, 1);
    rig.arm.position.copy(wrist).addScaledVector(dir, len / 2);
  }
  if (rig.cuff) {
    rig.cuff.quaternion.copy(tmpQ);
    rig.cuff.position.copy(wrist).addScaledVector(dir, 0.06);
  }
}

/* ───────────────────────── Mat, zones, table ───────────────────────── */

function zoneTexture(text: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 96;
  const g = c.getContext("2d")!;
  g.fillStyle = "#3a6ea8";
  g.font = "600 44px ui-sans-serif, system-ui, sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(text.toUpperCase(), 256, 50);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}

function Table({ zones }: { zones?: WorkspaceTask["zones"] }) {
  const m = useMemo(() => ({ top: std("#fbfbf9", 0.9), edge: std("#e7e9e6", 0.8), mat: std("#eef3fa", 0.95), zone: new THREE.MeshStandardMaterial({ color: "#dbe7f5", roughness: 0.95 }) }), []);
  const labels = useMemo(() => (zones ? { l: zoneTexture(zones.left), r: zoneTexture(zones.right) } : null), [zones]);
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(8, 16, "#c5d8ee", "#dbe6f3");
    g.scale.set(1, 1, 4.4 / 8);
    g.position.y = 0.004;
    return g;
  }, []);
  return (
    <group>
      <mesh receiveShadow material={m.top} position={[0, -0.15, 0]}>
        <boxGeometry args={[11, 0.3, 6.4]} />
      </mesh>
      <mesh receiveShadow material={m.mat} position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8.2, 4.6]} />
      </mesh>
      <primitive object={grid} />
      {zones && labels && (
        <>
          {(["left", "right"] as const).map((z) => {
            const [a, b] = ZONE_X[z];
            return (
              <group key={z}>
                <mesh receiveShadow material={m.zone} position={[(a + b) / 2, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[b - a, 4.2]} />
                </mesh>
                <mesh position={[(a + b) / 2, 0.01, -1.85]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[2.2, 0.41]} />
                  <meshBasicMaterial map={z === "left" ? labels.l : labels.r} transparent toneMapped={false} />
                </mesh>
              </group>
            );
          })}
        </>
      )}
    </group>
  );
}

/* ───────────────────────── Goal checks ───────────────────────── */

function checkGoals(goals: Goal[], items: Item[], picked: Set<string>, rotated: Set<string>) {
  const byId = new Map(items.map((i) => [i.id, i]));
  const kindOf = (id: string | null) => (id ? byId.get(id)?.kind : undefined);
  const inZone = (i: Item, z: "left" | "right") => i.x >= ZONE_X[z][0] && i.x <= ZONE_X[z][1];
  const chain = (i: Item, kind: ObjectKind): number => (i.kind !== kind ? 0 : 1 + (i.support && kindOf(i.support) === kind ? chain(byId.get(i.support)!, kind) : 0));
  return goals.map((g) => {
    switch (g.type) {
      case "pickN":
        return picked.size >= g.n;
      case "pickKind":
        return [...picked].some((id) => kindOf(id) === g.kind);
      case "rotate":
        return [...rotated].some((id) => !g.kind || kindOf(id) === g.kind);
      case "stackN":
        return items.filter((i) => i.support).length >= g.n;
      case "onto":
        return items.some((i) => i.kind === g.kind && kindOf(i.support) === g.target);
      case "ontoCount":
        return items.filter((i) => kindOf(i.support) === g.target).length >= g.n;
      case "tower":
        return Math.max(0, ...items.map((i) => chain(i, g.kind))) >= g.n;
      case "zone":
        return items.filter((i) => g.kinds.includes(i.kind)).every((i) => inZone(i, g.zone));
      case "near":
        return items.some((a) => a.kind === g.a && items.some((b) => b.kind === g.b && Math.hypot(a.x - b.x, a.z - b.z) < g.d));
    }
  });
}

/* ───────────────────────── Scene ───────────────────────── */

type SceneProps = {
  task: WorkspaceTask;
  apiRef: RefObject<WorkspaceApi | null>;
  labelRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  reduceMotion: boolean;
  onTelemetry: (t: Telemetry) => void;
  onEvent: (e: CaptureEvent) => void;
  onGoals: (done: boolean[]) => void;
  onItems: (items: ItemInfo[]) => void;
};

/** Immutable description of an object in the task layout (render data). */
type Desc = { id: string; kind: ObjectKind; name: string; x: number; z: number; rot: number; h: number; r: number };

function describe(task: WorkspaceTask): Desc[] {
  const count: Partial<Record<ObjectKind, number>> = {};
  return task.objects.map((o) => {
    const n = (count[o.kind] = (count[o.kind] ?? 0) + 1);
    const info = objectInfo[o.kind];
    return { id: `${o.kind}_${n}`, kind: o.kind, name: `${o.kind}_${String(n).padStart(2, "0")}`, x: o.x, z: o.z, rot: o.rot ?? 0, h: info.size[2], r: info.radius };
  });
}

const overlaps = (a: Item, b: Item) => Math.hypot(a.x - b.x, a.z - b.z) < (a.r + b.r) * 0.55;

// Per-frame scratch values (one workspace per page).
const sHit = new THREE.Vector3();
const sHand = new THREE.Vector3();
const sLeft = new THREE.Vector3();
const sProj = new THREE.Vector3();
const PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const SHOULDER_R = new THREE.Vector3(2.4, 3.6, 6.4);
const SHOULDER_L = new THREE.Vector3(-2.4, 3.6, 6.4);
const OUTLINE = new THREE.LineBasicMaterial({ color: "#3a6ea8" });
const OUTLINE_SOFT = new THREE.LineBasicMaterial({ color: "#9dbfe6" });

/** Visual-only meshes (outlines, hands) must never intercept pointer events. */
const NO_RAYCAST = () => null;

const newRig = (): HandRig => ({ root: null, fingers: [], thumb: null, arm: null, cuff: null, curl: 0 });

function Scene({ task, apiRef, labelRef, stageRef, reduceMotion, onTelemetry, onEvent, onGoals, onItems }: SceneProps) {
  const { camera, size, raycaster, pointer } = useThree();
  const descs = useMemo(() => describe(task), [task]);

  // Mutable simulation state lives only in refs (never in React state).
  const sim = useRef(new Map<string, Item>());
  const s = useRef({
    held: null as string | null,
    selected: null as string | null,
    hovered: null as string | null,
    grab: { x: 0, z: 0 },
    point: new THREE.Vector3(1.2, 0, 0.6),
    handL: new THREE.Vector3(-2.6, 0.75, 1.5),
    picked: new Set<string>(),
    rotated: new Set<string>(),
    clock: 0,
    ev: 0,
    tel: 0,
    status: "Move the cursor over the table",
  });
  const right = useRef<HandRig>(newRig());
  const left = useRef<HandRig>(newRig());

  const list = (): Item[] =>
    descs.map((d) => {
      let it = sim.current.get(d.id);
      if (!it) {
        it = { id: d.id, kind: d.kind, name: d.name, x: d.x, z: d.z, y: 0, ty: 0, rot: d.rot, trot: d.rot, h: d.h, r: d.r, support: null, group: null };
        sim.current.set(d.id, it);
      }
      return it;
    });
  const byId = (id: string | null) => (id ? list().find((i) => i.id === id) : undefined);

  useEffect(() => {
    onItems(descs.map((d) => ({ id: d.id, name: d.name, kind: d.kind })));
    onGoals(task.goals.map(() => false));
  }, [descs, task.goals, onItems, onGoals]);

  const emit = (verb: string, item: Item, detail?: string) => onEvent({ id: ++s.current.ev, t: s.current.clock, verb, object: item.name, detail });
  const report = () => onGoals(checkGoals(task.goals, list(), s.current.picked, s.current.rotated));

  /** Rest every free object on the table or on whatever is under it, bottom-up. */
  const settle = () => {
    const free = list()
      .filter((i) => i.id !== s.current.held)
      .sort((a, b) => a.ty - b.ty);
    const placed: Item[] = [];
    for (const it of free) {
      let y = 0;
      let sup: Item | null = null;
      for (const p of placed) {
        if (overlaps(it, p) && p.ty + p.h > y) {
          y = p.ty + p.h;
          sup = p;
        }
      }
      it.ty = y;
      it.support = sup?.id ?? null;
      placed.push(it);
    }
  };

  const rotate = (dir: 1 | -1) => {
    const it = byId(s.current.held ?? s.current.selected);
    if (!it) return;
    it.trot += dir * ROT_STEP;
    s.current.rotated.add(it.id);
    emit("rotate", it, `${dir > 0 ? "+" : "−"}15°`);
    s.current.status = `Rotated ${it.name}`;
    report();
  };

  const drop = () => {
    const it = byId(s.current.held);
    if (!it) return;
    s.current.held = null;
    it.ty = it.y; // settle from where it hovers, so it lands on what is beneath
    settle();
    const on = byId(it.support);
    emit("place", it, on ? `on ${on.name}` : "on table");
    s.current.status = on ? `Stacked ${it.name} on ${on.name}` : `Placed ${it.name}`;
    report();
  };

  useImperativeHandle(apiRef, () => ({
    rotate,
    select: (id: string) => {
      const it = byId(id);
      if (!it) return;
      s.current.selected = id;
      s.current.status = `Selected ${it.name}`;
    },
    reset: () => {
      // Back to the task layout; meshes stay attached.
      for (const d of descs) {
        const it = sim.current.get(d.id);
        if (it) Object.assign(it, { x: d.x, z: d.z, ty: 0, rot: d.rot, trot: d.rot, support: null });
      }
      Object.assign(s.current, { held: null, selected: null, hovered: null, status: "Workspace reset" });
      s.current.picked.clear();
      s.current.rotated.clear();
      report();
    },
  }));

  // Release anywhere (covers touch end and the pointer leaving the canvas); wheel + Q/E rotate.
  useEffect(() => {
    const stage = stageRef.current;
    const up = () => s.current.held && drop();
    const wheel = (e: WheelEvent) => {
      if (!s.current.held) return; // only take over the wheel while holding
      e.preventDefault();
      rotate(e.deltaY > 0 ? 1 : -1);
    };
    const key = (e: KeyboardEvent) => {
      if (!stage?.matches(":hover")) return;
      if (e.key === "q" || e.key === "Q") rotate(-1);
      if (e.key === "e" || e.key === "E") rotate(1);
    };
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("keydown", key);
    stage?.addEventListener("wheel", wheel, { passive: false });
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("keydown", key);
      stage?.removeEventListener("wheel", wheel);
    };
  });

  const onDown = (id: string) => (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const it = byId(id);
    if (!it) return;
    // Touch has no hover, so take the table point from this press rather than the last move.
    if (e.ray.intersectPlane(PLANE, sHit)) s.current.point.set(sHit.x, 0, sHit.z);
    s.current.held = id;
    s.current.selected = id;
    s.current.grab = { x: it.x - s.current.point.x, z: it.z - s.current.point.z };
    s.current.picked.add(id);
    settle(); // whatever was resting on it falls
    emit("grasp", it);
    s.current.status = `Holding ${it.name}`;
    report();
  };

  // Fit the table to the canvas.
  useEffect(() => {
    const aspect = size.width / size.height;
    const dist = Math.min(15, Math.max(9.8, 12.8 / aspect));
    camera.position.set(0, dist * 0.74, dist * 0.68);
    camera.lookAt(0, 0, 0.25);
    camera.updateProjectionMatrix();
    // Shoulders sit between the table and the viewer, so arms keep their proportions at any distance.
    SHOULDER_R.set(2.3, camera.position.y * 0.5, camera.position.z * 0.85);
    SHOULDER_L.set(-2.3, camera.position.y * 0.5, camera.position.z * 0.85);
  }, [camera, size]);

  useFrame((_, dtRaw) => {
    const st = s.current;
    const dt = Math.min(dtRaw, 0.05);
    st.clock += dt;
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(PLANE, sHit))
      st.point.set(THREE.MathUtils.clamp(sHit.x, -BOUNDS.x, BOUNDS.x), 0, THREE.MathUtils.clamp(sHit.z, -BOUNDS.z, BOUNDS.z));

    const items = list();
    const h = byId(st.held);
    for (const it of items) {
      if (it === h) {
        const tx = THREE.MathUtils.clamp(st.point.x + st.grab.x, -BOUNDS.x, BOUNDS.x);
        const tz = THREE.MathUtils.clamp(st.point.z + st.grab.z, -BOUNDS.z, BOUNDS.z);
        it.x = damp(it.x, tx, 20, dt);
        it.z = damp(it.z, tz, 20, dt);
        let under = 0;
        for (const o of items) if (o !== it && overlaps(it, o)) under = Math.max(under, o.y + o.h);
        it.y = damp(it.y, under + 0.45, 14, dt);
      } else {
        // Falls with a little acceleration, rises (when lifted by the stack below) smoothly.
        it.y = it.y > it.ty ? Math.max(it.ty, it.y - (it.y - it.ty + 0.6) * dt * 9) : damp(it.y, it.ty, 16, dt);
      }
      it.rot = damp(it.rot, it.trot, 12, dt);
      const g = it.group;
      if (g) {
        g.position.set(it.x, it.y, it.z);
        g.rotation.y = it.rot;
        const lines = g.children.find((c) => c.userData.outline) as THREE.LineSegments | undefined;
        if (lines) {
          const on = it.id === st.selected || it.id === st.held;
          lines.visible = on || it.id === st.hovered;
          lines.material = on ? OUTLINE : OUTLINE_SOFT;
        }
      }
    }

    // Hands: the right follows the cursor (or grips the held object); the left supports large objects.
    const bob = reduceMotion ? 0 : Math.sin(st.clock * 1.6) * 0.03;
    if (h) sHand.set(h.x + 0.05, h.y + h.h + 0.16, h.z + 0.18);
    else sHand.set(st.point.x + 0.05, 0.8 + bob, st.point.z + 0.25);
    poseHand(right.current, sHand, SHOULDER_R, h ? 0.75 : 0.12, dt);
    const big = !!h && h.r > 0.6;
    if (h && big) sLeft.set(h.x - h.r * 0.95, h.y + h.h * 0.6 + 0.1, h.z + 0.1);
    else sLeft.set(-2.7 + st.point.x * 0.12, 0.78 - bob, 1.55);
    st.handL.set(damp(st.handL.x, sLeft.x, 8, dt), damp(st.handL.y, sLeft.y, 8, dt), damp(st.handL.z, sLeft.z, 8, dt));
    poseHand(left.current, st.handL, SHOULDER_L, big ? 0.55 : 0.1, dt);

    // Floating label for the active object.
    const focus = h ?? byId(st.selected) ?? byId(st.hovered);
    const el = labelRef.current;
    if (el) {
      if (focus) {
        sProj.set(focus.x, focus.y + focus.h + 0.25, focus.z).project(camera);
        el.style.opacity = "1";
        el.style.transform = `translate(${((sProj.x + 1) / 2) * size.width}px, ${((1 - sProj.y) / 2) * size.height}px) translate(-50%, -100%)`;
        const state = focus === h ? "grasp" : focus.support ? `on ${byId(focus.support)?.name}` : "resting";
        el.textContent = `${focus.name} · ${state}`;
      } else el.style.opacity = "0";
    }
    const stage = stageRef.current;
    if (stage) {
      stage.style.cursor = h ? "grabbing" : st.hovered ? "grab" : "default";
      stage.dataset.hover = st.hovered ?? "";
    }

    // Panel telemetry ~8 Hz.
    if (st.clock - st.tel > 0.12) {
      st.tel = st.clock;
      const sel = byId(st.held ?? st.selected);
      onTelemetry({
        status: st.status,
        selected: sel
          ? {
              id: sel.id,
              name: sel.name,
              kind: sel.kind,
              x: sel.x * 10,
              y: sel.y * 10,
              z: sel.z * 10,
              yaw: ((((sel.trot * 180) / Math.PI) % 360) + 360) % 360,
              on: sel.support ? (byId(sel.support)?.name ?? "") : "table",
              held: sel.id === st.held,
            }
          : null,
      });
    }
  });

  return (
    <>
      <hemisphereLight args={["#ffffff", "#dfe6ef", 0.95]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[3.5, 9, 4.5]}
        intensity={1.7}
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0004}
        shadow-radius={4}
      />
      <Table zones={task.zones} />
      {descs.map((d) => {
        const Body = BUILDERS[d.kind];
        const [w, dp, hgt] = objectInfo[d.kind].size;
        return (
          <group
            key={d.id}
            ref={(g) => {
              const it = sim.current.get(d.id);
              if (it) it.group = g;
              else if (g) {
                // First mount: create the simulation entry and attach the group.
                sim.current.set(d.id, { id: d.id, kind: d.kind, name: d.name, x: d.x, z: d.z, y: 0, ty: 0, rot: d.rot, trot: d.rot, h: d.h, r: d.r, support: null, group: g });
              }
            }}
            position={[d.x, 0, d.z]}
            rotation={[0, d.rot, 0]}
            onPointerDown={onDown(d.id)}
            onPointerOver={(e) => {
              e.stopPropagation();
              s.current.hovered = d.id;
              if (!s.current.held) s.current.status = `Hovering ${d.name}`;
            }}
            onPointerOut={() => {
              if (s.current.hovered === d.id) s.current.hovered = null;
            }}
          >
            <Body />
            <lineSegments userData={{ outline: true }} raycast={NO_RAYCAST} position={[0, hgt / 2, 0]} visible={false} material={OUTLINE_SOFT}>
              <edgesGeometry args={[new THREE.BoxGeometry(w + 0.12, hgt + 0.1, dp + 0.12)]} />
            </lineSegments>
          </group>
        );
      })}
      <Hand side={1} rigRef={right} />
      <Hand side={-1} rigRef={left} />
    </>
  );
}

/* ───────────────────────── Canvas wrapper ───────────────────────── */

type WorkspaceSceneProps = SceneProps & { active: boolean };

function WorkspaceSceneImpl({ active, ...props }: WorkspaceSceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 36, near: 0.1, far: 60, position: [0, 7, 6.5] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "none" }}
      aria-hidden
      fallback={<p className="p-6 text-sm text-muted">This interactive workspace needs WebGL, which is not available in this browser.</p>}
    >
      <Scene key={props.task.id} {...props} />
    </Canvas>
  );
}

export default memo(WorkspaceSceneImpl);
