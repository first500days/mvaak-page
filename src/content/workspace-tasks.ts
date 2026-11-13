/**
 * Interactive 3D capture workspace (homepage, first section) — task definitions.
 * The workspace is a simulation: objects, hands and the event log are generated in the
 * browser from the visitor's own interactions. Nothing here is presented as captured data.
 * Units: 1 scene unit = 10 cm. The table spans x −4…4, z −2.2…2.2.
 */

export type ObjectKind = "notebook" | "phone" | "mug" | "bottle" | "box" | "pen" | "headphones";

export const objectInfo: Record<ObjectKind, { label: string; /** footprint w (x), d (z), height */ size: [number, number, number]; radius: number }> = {
  notebook: { label: "Notebook", size: [1.5, 2.0, 0.16], radius: 1.0 },
  phone: { label: "Smartphone", size: [0.78, 1.6, 0.09], radius: 0.75 },
  mug: { label: "Coffee mug", size: [0.98, 0.74, 0.82], radius: 0.45 },
  bottle: { label: "Water bottle", size: [0.62, 0.62, 1.62], radius: 0.32 },
  box: { label: "Cardboard box", size: [1.3, 1.0, 0.9], radius: 0.72 },
  pen: { label: "Pen", size: [1.42, 0.14, 0.11], radius: 0.6 },
  headphones: { label: "Headphones", size: [1.62, 0.8, 0.26], radius: 0.8 },
};

export type Goal =
  | { type: "pickN"; n: number; text: string }
  | { type: "pickKind"; kind: ObjectKind; text: string }
  | { type: "rotate"; kind?: ObjectKind; text: string }
  | { type: "stackN"; n: number; text: string }
  | { type: "onto"; kind: ObjectKind; target: ObjectKind; text: string }
  | { type: "ontoCount"; target: ObjectKind; n: number; text: string }
  | { type: "tower"; kind: ObjectKind; n: number; text: string }
  | { type: "zone"; kinds: ObjectKind[]; zone: "left" | "right"; text: string }
  | { type: "near"; a: ObjectKind; b: ObjectKind; d: number; text: string };

export type Placement = { kind: ObjectKind; x: number; z: number; rot?: number };

export type WorkspaceTask = {
  id: string;
  label: string;
  activity: string;
  environment: string;
  objects: Placement[];
  goals: Goal[];
  /** Sorting zones drawn on the mat (x ranges). */
  zones?: { left: string; right: string };
};

export const ZONE_X = { left: [-3.9, -1.6], right: [1.6, 3.9] } as const;

export const workspaceTasks: WorkspaceTask[] = [
  {
    id: "manipulation",
    label: "Object Manipulation",
    activity: "Pick, place, rotate and stack",
    environment: "Desk workstation",
    objects: [
      { kind: "notebook", x: -2.5, z: -0.5, rot: 0.25 },
      { kind: "headphones", x: -2.4, z: 1.45, rot: -0.2 },
      { kind: "phone", x: -0.9, z: 0.8, rot: -0.35 },
      { kind: "pen", x: 0.35, z: 1.35, rot: 0.5 },
      { kind: "mug", x: 0.55, z: -0.8, rot: 0.6 },
      { kind: "bottle", x: 1.95, z: -0.9 },
      { kind: "box", x: 2.55, z: 0.95, rot: 0.15 },
    ],
    goals: [
      { type: "pickN", n: 3, text: "Pick up three different objects" },
      { type: "rotate", text: "Rotate an object" },
      { type: "stackN", n: 1, text: "Stack one object on another" },
    ],
  },
  {
    id: "household",
    label: "Household Activities",
    activity: "Tidying a desk",
    environment: "Home · living-room desk",
    objects: [
      { kind: "notebook", x: -1.6, z: 0.1, rot: -0.3 },
      { kind: "pen", x: 1.2, z: 1.2, rot: 1.1 },
      { kind: "headphones", x: 2.3, z: -0.6, rot: 0.4 },
      { kind: "mug", x: 0.3, z: -0.9, rot: 2.4 },
    ],
    goals: [
      { type: "onto", kind: "pen", target: "notebook", text: "Place the pen on the notebook" },
      { type: "pickKind", kind: "headphones", text: "Pick up the headphones" },
      { type: "rotate", kind: "mug", text: "Turn the mug" },
    ],
  },
  {
    id: "sorting",
    label: "Product Sorting",
    activity: "Sorting items by category",
    environment: "Retail back room",
    zones: { left: "Electronics", right: "Everyday items" },
    objects: [
      { kind: "phone", x: 0.2, z: -1.0, rot: 0.4 },
      { kind: "mug", x: -0.75, z: 0.2, rot: 1.2 },
      { kind: "headphones", x: 0.55, z: 1.2, rot: -0.3 },
      { kind: "pen", x: -0.6, z: -1.3, rot: -0.6 },
      { kind: "bottle", x: 0.85, z: 0.05 },
    ],
    goals: [
      { type: "zone", kinds: ["phone", "headphones"], zone: "left", text: "Move the electronics to the left zone" },
      { type: "zone", kinds: ["mug", "pen", "bottle"], zone: "right", text: "Move everyday items to the right zone" },
    ],
  },
  {
    id: "packaging",
    label: "Packaging",
    activity: "Staging items for packing",
    environment: "Fulfilment packing station",
    objects: [
      { kind: "box", x: 0.1, z: -0.1, rot: 0.1 },
      { kind: "phone", x: -2.4, z: 0.9, rot: 0.3 },
      { kind: "headphones", x: 2.5, z: 1.0, rot: -0.5 },
      { kind: "notebook", x: -2.4, z: -0.9, rot: -0.2 },
      { kind: "pen", x: 2.4, z: -1.2, rot: 0.8 },
    ],
    goals: [
      { type: "ontoCount", target: "box", n: 1, text: "Place an item on the box" },
      { type: "ontoCount", target: "box", n: 2, text: "Place a second item on the box" },
      { type: "rotate", kind: "box", text: "Rotate the box" },
    ],
  },
  {
    id: "kitchen",
    label: "Kitchen Activities",
    activity: "Setting out a drink",
    environment: "Home kitchen counter",
    objects: [
      { kind: "mug", x: -1.4, z: 0.4, rot: 0.9 },
      { kind: "bottle", x: 2.2, z: -0.7 },
      { kind: "box", x: -2.7, z: -0.8, rot: -0.2 },
      { kind: "notebook", x: 1.2, z: 1.1, rot: 0.35 },
    ],
    goals: [
      { type: "pickKind", kind: "bottle", text: "Pick up the water bottle" },
      { type: "near", a: "bottle", b: "mug", d: 1.4, text: "Set the bottle beside the mug" },
      { type: "rotate", kind: "mug", text: "Turn the mug handle" },
    ],
  },
  {
    id: "warehouse",
    label: "Warehouse Operations",
    activity: "Stacking cartons",
    environment: "Warehouse staging area",
    objects: [
      { kind: "box", x: -2.3, z: 0.3, rot: 0.2 },
      { kind: "box", x: 0.0, z: -0.8, rot: -0.15 },
      { kind: "box", x: 2.3, z: 0.6, rot: 0.35 },
      { kind: "phone", x: 0.3, z: 1.4, rot: -0.4 },
    ],
    goals: [
      { type: "tower", kind: "box", n: 2, text: "Stack two boxes" },
      { type: "tower", kind: "box", n: 3, text: "Stack all three boxes" },
      { type: "pickKind", kind: "phone", text: "Pick up the phone to scan" },
    ],
  },
];

/** What the workspace records — mirrors what a real Mvaak collection delivers. */
export const captureParameters: [string, string][] = [
  ["Capture", "Egocentric RGB · stereo"],
  ["Sensors", "IMU aligned to frames"],
  ["Labels", "Action segments · object pose"],
  ["Export", "LeRobot · RLDS · MCAP"],
];
