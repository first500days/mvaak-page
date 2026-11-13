/**
 * Interactive hero ("capture console") data.
 *
 * Every clip is real Mvaak egocentric footage (see clips in ./home.ts and CONTENT-REVIEW §15).
 * The annotations are a DEMONSTRATION, placed by hand by the website team after viewing the
 * footage frame by frame — they are not model output and not a client deliverable:
 *  - `actions`: coarse action segments, read from the clip at 1 s resolution.
 *  - `boxes`:   object boxes drawn on the clip's first frame only (the "inspect" keyframe),
 *               in percent of the 16:9 frame. They are never shown over moving video.
 * The UI labels them accordingly. Keep it that way if you edit this file.
 */
import { clips, type SampleMedia } from "./home";

export type HeroAction = { start: number; end: number; verb: string; object: string };

export type HeroBox = {
  id: string;
  /** Snake-case class name, as it would appear in an export. */
  cls: string;
  x: number;
  y: number;
  w: number;
  h: number;
  attrs: [string, string][];
};

export type HeroTask = {
  id: string;
  label: string;
  environment: string;
  media: SampleMedia;
  alt: string;
  /** Where the 8 s excerpt starts in the original 3-minute recording (seconds). */
  sourceOffset: number;
  actions: HeroAction[];
  boxes: HeroBox[];
};

export const heroClipLength = 8;

export const heroTasks: HeroTask[] = [
  {
    id: "object-handling",
    label: "Object handling",
    environment: "Metal fabrication plant",
    media: clips.sheetHandling,
    alt: "First-person video: gloved hands and a co-worker handling a large steel sheet beside a machine on a factory floor.",
    sourceOffset: 132,
    actions: [
      { start: 0, end: 1.5, verb: "reach", object: "sheet_stack" },
      { start: 1.5, end: 4, verb: "grasp", object: "steel_sheet" },
      { start: 4, end: 6.5, verb: "lift", object: "steel_sheet" },
      { start: 6.5, end: 8, verb: "hand over", object: "steel_sheet" },
    ],
    boxes: [
      { id: "sheet", cls: "steel_sheet", x: 40, y: 14, w: 38, h: 66, attrs: [["State", "Held at both ends"], ["Material", "Sheet metal"], ["Contact", "Two hands + co-worker"]] },
      { id: "hands", cls: "hands · wearer", x: 46, y: 77, w: 17, h: 23, attrs: [["Hands", "Left + right"], ["Gloved", "Yes"], ["Grip", "Edge pinch"]] },
      { id: "coworker", cls: "person · co-worker", x: 17, y: 0, w: 33, h: 58, attrs: [["Role", "Second handler"], ["Visible", "Torso, arms, hands"]] },
      { id: "cover", cls: "plastic_cover", x: 0, y: 60, w: 10, h: 40, attrs: [["State", "Static"], ["Colour", "Red"]] },
    ],
  },
  {
    id: "kitchen",
    label: "Kitchen activities",
    environment: "Home kitchen",
    media: clips.household,
    alt: "First-person video of a home kitchen: one hand holds a plastic container while the other works near the stove.",
    sourceOffset: 1,
    actions: [
      { start: 0, end: 3.5, verb: "hold", object: "container" },
      { start: 3.5, end: 5.5, verb: "lift", object: "container" },
      { start: 5.5, end: 8, verb: "handle", object: "container (two-hand)" },
    ],
    boxes: [
      { id: "container", cls: "plastic_container", x: 28.5, y: 52, w: 14.5, h: 28, attrs: [["State", "Held · left hand"], ["Material", "Transparent plastic"]] },
      { id: "plate", cls: "steel_plate", x: 44, y: 28, w: 15, h: 20, attrs: [["State", "On counter"], ["Material", "Steel"]] },
      { id: "griddle", cls: "griddle", x: 65, y: 22, w: 15, h: 23, attrs: [["State", "On stove"], ["Contents", "Flatbread"]] },
      { id: "hand", cls: "hand_right", x: 80, y: 48, w: 11, h: 44, attrs: [["Side", "Right"], ["Activity", "Working near stove"]] },
    ],
  },
  {
    id: "warehouse",
    label: "Warehouse operations",
    environment: "Industrial storage floor",
    media: clips.pallet,
    alt: "First-person video: walking to a yellow pallet jack between stacked red crates and blue containers, then pulling it.",
    sourceOffset: 152,
    actions: [
      { start: 0, end: 2, verb: "walk", object: "to pallet_jack" },
      { start: 2, end: 3.5, verb: "grasp", object: "jack_handle" },
      { start: 3.5, end: 8, verb: "pull", object: "pallet_jack" },
    ],
    boxes: [
      { id: "crates", cls: "crate_stack", x: 24, y: 0, w: 25, h: 40, attrs: [["Count", "3+ crates"], ["Colour", "Red"]] },
      { id: "cans", cls: "jerrycan_group", x: 4, y: 9, w: 26, h: 71, attrs: [["Colour", "Blue"], ["State", "Stacked"]] },
      { id: "hand", cls: "hand_right", x: 62, y: 35, w: 8, h: 17, attrs: [["Side", "Right"], ["State", "Free · swinging"]] },
      { id: "jack", cls: "pallet_jack", x: 19, y: 84, w: 12, h: 16, attrs: [["Visible", "Forks"], ["Next", "Grasped at 00:02"]] },
    ],
  },
  {
    id: "garment",
    label: "Garment work",
    environment: "Garment factory",
    media: clips.sewing,
    alt: "First-person video: two hands gathering and folding light-blue fabric at an industrial sewing machine.",
    sourceOffset: 22,
    actions: [
      { start: 0, end: 2, verb: "grasp", object: "fabric" },
      { start: 2, end: 5, verb: "fold", object: "fabric" },
      { start: 5, end: 8, verb: "smooth", object: "fabric" },
    ],
    boxes: [
      { id: "fabric", cls: "fabric_panel", x: 6, y: 0, w: 51, h: 76, attrs: [["Object type", "Deformable"], ["Colour", "Light blue"]] },
      { id: "left", cls: "hand_left", x: 9, y: 7, w: 11, h: 31, attrs: [["Side", "Left"], ["Grip", "Pinch · fabric edge"]] },
      { id: "right", cls: "hand_right", x: 50, y: 67, w: 18, h: 20, attrs: [["Side", "Right"], ["Grip", "Open palm"]] },
      { id: "machine", cls: "sewing_machine", x: 56, y: 0, w: 40, h: 40, attrs: [["State", "Idle"], ["Type", "Industrial"]] },
      { id: "bin", cls: "trolley_bin", x: 66, y: 52, w: 19, h: 21, attrs: [["State", "Static"]] },
    ],
  },
  {
    id: "machine-tending",
    label: "Machine tending",
    environment: "Metal fabrication · spot-welding station",
    media: clips.metalWork,
    alt: "First-person video: a co-worker passes a metal panel, and gloved hands position it under the electrode of a green spot-welding machine.",
    sourceOffset: 33,
    actions: [
      { start: 0, end: 1.5, verb: "receive", object: "metal_panel" },
      { start: 1.5, end: 3, verb: "move", object: "panel to welder" },
      { start: 3, end: 8, verb: "hold", object: "panel at electrode" },
    ],
    boxes: [
      { id: "stack", cls: "panel_stack", x: 0, y: 5, w: 38, h: 85, attrs: [["Contents", "Finished panels"], ["State", "Stacked"]] },
      { id: "coworker", cls: "person · co-worker", x: 50, y: 0, w: 20, h: 64, attrs: [["Role", "Passes panel"], ["Visible", "Torso, arms"]] },
      { id: "panel", cls: "metal_panel", x: 51, y: 52, w: 18, h: 40, attrs: [["State", "Being handed over"], ["Note", "Motion-blurred"]] },
      { id: "welder", cls: "spot_welder", x: 78, y: 0, w: 22, h: 64, attrs: [["Colour", "Green"], ["State", "Idle"]] },
      { id: "electrode", cls: "electrode", x: 68, y: 15, w: 7, h: 50, attrs: [["Material", "Copper"], ["Next", "Panel placed at 00:03"]] },
    ],
  },
  {
    id: "construction",
    label: "Construction",
    environment: "Building site · scaffolding",
    media: clips.construction,
    alt: "First-person video from scaffolding on a building site: the seated wearer reaches up to work a concrete column.",
    sourceOffset: 22,
    actions: [
      { start: 0, end: 4, verb: "settle", object: "on scaffold" },
      { start: 4, end: 5.5, verb: "reach", object: "column" },
      { start: 5.5, end: 8, verb: "work", object: "column surface" },
    ],
    boxes: [
      { id: "column", cls: "concrete_column", x: 0, y: 0, w: 61, h: 36, attrs: [["Surface", "Rough concrete"], ["Next", "Worked from 00:05"]] },
      { id: "legs", cls: "legs · wearer", x: 36, y: 37, w: 23, h: 44, attrs: [["Posture", "Seated on scaffold"], ["Note", "Wearer’s own body in frame"]] },
      { id: "hand", cls: "hand_right", x: 67, y: 46, w: 9, h: 32, attrs: [["Side", "Right"]] },
      { id: "pan", cls: "mortar_pan", x: 79, y: 41, w: 12, h: 38, attrs: [["Material", "Metal"], ["State", "On scaffold"]] },
    ],
  },
];
