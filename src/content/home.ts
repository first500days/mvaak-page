/**
 * Homepage content. Every claim here comes from existing site content
 * (src/content/egocentric-collection.ts, src/config/site.ts) or the "Mvaak AI Data Services"
 * brochure. Items that are not yet confirmed are flagged and either hidden or labelled on
 * the page. See docs/CONTENT-REVIEW.md §14 for what still needs confirmation.
 *
 * To update the homepage, edit this file only.
 */
import { capacity } from "@/config/site";

/* ───────────────────────────── Data at a glance ───────────────────────────── */

export type Stat = { value: string; label: string; note: string; show: boolean };

/**
 * Figures shown on the homepage. The first four come from the brochure's capacity position
 * (as of `capacity.asOf`). The rest are wanted but have no approved figure yet: they stay
 * hidden (`show: false`) until a real number is supplied — never fill them with estimates.
 */
export const stats: Stat[] = [
  // Supplied by Mvaak (November 2026).
  { value: "100,000+", label: "Data delivered", note: "", show: true },
  { value: "200+", label: "Partners", note: "", show: true },
  ...capacity.figures.map((f) => ({ ...f, show: capacity.showOnSite })),
  { value: "", label: "Hours of data delivered", note: "Awaiting an approved figure", show: false },
  { value: "", label: "Daily collection capacity", note: "Awaiting an approved figure", show: false },
  { value: "", label: "Tasks captured", note: "Awaiting an approved figure", show: false },
];
export const statsSource = `Figures provided by Mvaak; capacity position as of ${capacity.asOf}.`;

/* ───────────────────────────── Real-world samples ─────────────────────────── */

export type SampleMedia = {
  /** Poster / still frame (required — also the fallback if the video can't load). */
  poster: string;
  posterWidth: number;
  posterHeight: number;
  /** Video sources. Without them the card shows the still, with no play control. */
  mp4?: string;
  webm?: string;
};

/**
 * Web-encoded clips (960×540, 24 fps, no audio, 8 s, ~1 MB each; MP4/H.264 + WebM/VP9 + poster).
 * Source: real egocentric capture supplied by the Mvaak team — eight 3-minute recordings
 * (1920×1080 @ 30 fps, wide-angle body/head-mounted camera) from workplaces and a home.
 * Provenance and on-camera consent to be confirmed — CONTENT-REVIEW §15.
 */
const clip = (name: string): SampleMedia => ({
  poster: `/videos/capture/${name}.jpg`,
  posterWidth: 960,
  posterHeight: 540,
  mp4: `/videos/capture/${name}.mp4`,
  webm: `/videos/capture/${name}.webm`,
});

export const clips = {
  metalPlant: clip("metal-plant"),
  sewing: clip("sewing"),
  handloom: clip("handloom"),
  metalWork: clip("metal-work"),
  household: clip("household"),
  construction: clip("construction"),
  tiles: clip("tiles"),
  pallet: clip("battery"),
  // Separate segments used outside the gallery, so the page doesn't repeat the same loop.
  sheetHandling: clip("demo-machine"),
  moving: clip("demo-warehouse"),
  toolUse: clip("demo-trowel"),
  fabric: clip("demo-sewing"),
};

export type Sample = {
  id: string;
  task: string;
  category: string;
  environment: string;
  capture: string;
  description: string;
  alt: string;
  /** null = no approved asset yet; the card is not rendered (listed in CONTENT-REVIEW §15). */
  media: SampleMedia | null;
  /** True while the media is an illustrative frame rather than real captured footage. */
  illustrative: boolean;
};

const EGO = "Egocentric · wide-angle";

/** Homepage gallery — every slot is real first-person footage, grouped by kind of work. */
export const samples: Sample[] = [
  {
    id: "metal-sheets",
    task: "Handling metal sheets",
    category: "Manufacturing",
    environment: "Metal fabrication plant",
    capture: EGO,
    description: "Gloved hands lift and position large steel sheets beside a machine on a busy shop floor.",
    alt: "First-person video: gloved hands handling a large metal sheet on a factory floor.",
    media: clips.metalPlant,
    illustrative: false,
  },
  {
    id: "sewing",
    task: "Handling fabric at a sewing station",
    category: "Manufacturing",
    environment: "Garment factory",
    capture: EGO,
    description: "Both hands gather, fold and feed fabric at an industrial sewing machine — deformable-object handling.",
    alt: "First-person video: two hands folding light-blue fabric at an industrial sewing machine.",
    media: clips.sewing,
    illustrative: false,
  },
  {
    id: "handloom",
    task: "Weaving on a handloom",
    category: "Textiles & craft",
    environment: "Handloom workshop",
    capture: EGO,
    description: "Hands working the loom as the striped fabric builds up — repetitive, two-handed, rhythm-driven work.",
    alt: "First-person video looking down at hands working a handloom with purple and green striped fabric.",
    media: clips.handloom,
    illustrative: false,
  },
  {
    id: "machine-tending",
    task: "Machine tending at a spot welder",
    category: "Manufacturing",
    environment: "Metal fabrication unit",
    capture: EGO,
    description: "A co-worker passes a metal panel; gloved hands position it under the welding electrode — precise two-hand placement.",
    alt: "First-person video: gloved hands positioning a metal panel under the electrode of a green spot-welding machine.",
    media: clips.metalWork,
    illustrative: false,
  },
  {
    id: "household",
    task: "Cooking and kitchen work",
    category: "Household",
    environment: "Home kitchen",
    capture: EGO,
    description: "Reaching across the stove and counter, handling containers and utensils during everyday cooking.",
    alt: "First-person video of a home kitchen: hands handling a container beside a stove and utensils.",
    media: clips.household,
    illustrative: false,
  },
  {
    id: "construction",
    task: "Finishing work on site",
    category: "Construction",
    environment: "Building site · scaffolding",
    capture: EGO,
    description: "Hands working at a concrete column from the scaffold, with tools and materials within reach.",
    alt: "First-person video from scaffolding on a building site, hands working at a concrete column.",
    media: clips.construction,
    illustrative: false,
  },
  {
    id: "tiles",
    task: "Prep work at a tiling site",
    category: "Construction",
    environment: "Interior fit-out",
    capture: EGO,
    description: "Hands handle a thin line along the wall above an unfinished floor — precise work in a cluttered space.",
    alt: "First-person video: hands handling a thin line along a white wall above an unfinished floor.",
    media: clips.tiles,
    illustrative: false,
  },
  {
    id: "pallet",
    task: "Moving a pallet jack",
    category: "Warehouse & logistics",
    environment: "Industrial storage floor",
    capture: EGO,
    description: "Steering a pallet jack between stacked crates and containers — locomotion with a tool in hand.",
    alt: "First-person video: a hand pulling a yellow pallet jack across a concrete floor between blue containers and red crates.",
    media: clips.pallet,
    illustrative: false,
  },
  // Wanted but no asset yet (not rendered): retail & product handling, food preparation, cleaning.
  ...(["Retail & product handling", "Food preparation", "Cleaning & maintenance"] as const).map(
    (category): Sample => ({
      id: category.toLowerCase().replace(/\W+/g, "-"),
      task: category,
      category,
      environment: "",
      capture: "",
      description: "",
      alt: "",
      media: null,
      illustrative: true,
    }),
  ),
];

/* ───────────────────────────── Egocentric capture demos ───────────────────── */

/** Real looping first-person demonstrations (different segments from the gallery clips). */
export const captureDemos = [
  {
    id: "demo-hands",
    title: "Two-hand handling",
    captured: "Both hands and the object they hold, from the worker’s own viewpoint — grip, lift and placement.",
    media: clips.fabric,
    alt: "Looping first-person video of two hands handling fabric at a sewing machine.",
  },
  {
    id: "demo-tool",
    title: "Tool use in the real world",
    captured: "Hand, tool and work surface in one frame — on a live site, not a staged bench.",
    media: clips.toolUse,
    alt: "Looping first-person video of hands working a concrete surface from scaffolding.",
  },
  {
    id: "demo-move",
    title: "Moving between tasks",
    captured: "Body motion through the space between actions — the context a model needs to separate one task from the next.",
    media: clips.moving,
    alt: "Looping first-person video pulling a pallet jack through a storage area.",
  },
];

/* ───────────────────────────── Mono-RGB capture ───────────────────────────── */

/** Third-person mono-RGB samples. Empty until real footage is supplied (CONTENT-REVIEW §15). */
export const monoRgbSamples: Sample[] = [];

/* ───────────────────────────── Capture methods ────────────────────────────── */

export type CaptureMethod = {
  id: string;
  code: string;
  title: string;
  /** What the data gives a model. */
  provides: string;
  specs: string[];
  /** Where in Mvaak's materials this is described. */
  source: string;
  image?: { src: string; width: number; height: number; alt: string };
};

export const captureMethods: CaptureMethod[] = [
  {
    id: "egocentric",
    code: "A",
    title: "Egocentric / first-person",
    provides: "What the person sees while doing the task — hands, objects and the order of actions, from the robot’s own point of view.",
    specs: ["Head- or chest-level camera", "Action camera, smart glasses, XR headset or research glasses", "Resolution and frame rate agreed per task"],
    source: "Standard deliverable",
  },
  {
    id: "stereo",
    code: "B",
    title: "Stereo video",
    provides: "Two calibrated views of the same scene, so depth and 3D position can be recovered for spatial understanding and manipulation.",
    specs: ["Calibrated stereo pair", "Per-rig calibration results", "Depth or 3D hand pose where the rig supports it"],
    source: "Standard deliverable (RGB or stereo)",
  },
  {
    id: "mono-rgb",
    code: "C",
    title: "Mono-RGB video",
    provides: "Standard colour video of everyday activities — the base input for detection, tracking and activity recognition models.",
    specs: ["Calibrated RGB", "First-person, or paired fixed third-person views", "Temporal segmentation to sub-action"],
    source: "Standard deliverable; paired views optional",
  },
  {
    id: "imu",
    code: "D",
    title: "Wearable & sensor data",
    provides: "Motion signals that tell a model how the body and head moved between frames, aligned to the video timeline.",
    specs: ["IMU clock-aligned to video frames", "Synchronisation check per rig", "Optional gaze, depth or narration tracks"],
    source: "Standard deliverable; extras depend on the rig",
  },
];

/* ───────────────────────────── Environments ───────────────────────────────── */

export type Environment = {
  id: string;
  title: string;
  description: string;
  examples: string[];
  icon: "home" | "store" | "utensils" | "warehouse" | "factory" | "sprout" | "building" | "plus";
  /** "materials" = described in Mvaak's materials; "scoping" = confirmed per project. */
  status: "materials" | "scoping";
};

export const environments: Environment[] = [
  { id: "household", title: "Households & residential", description: "Everyday manipulation in real homes.", examples: ["Cooking and prep", "Opening a drawer", "Folding laundry"], icon: "home", status: "materials" },
  { id: "retail", title: "Retail stores", description: "Shop floors and stockrooms.", examples: ["Handling products", "Restocking shelves"], icon: "store", status: "materials" },
  { id: "kitchens", title: "Restaurants & commercial kitchens", description: "Food-service lines and prep areas.", examples: ["Preparing a workspace", "Sorting items"], icon: "utensils", status: "materials" },
  { id: "warehouse", title: "Warehouses & logistics", description: "Picking, packing and moving items at volume.", examples: ["Picking", "Sorting", "Packing"], icon: "warehouse", status: "materials" },
  { id: "agriculture", title: "Agricultural settings", description: "Manual field and post-harvest work.", examples: ["Transplanting", "Inspecting produce", "Sorting and grading"], icon: "sprout", status: "materials" },
  { id: "offices", title: "Offices & commercial spaces", description: "Shared workspaces and front-of-house areas.", examples: ["Organising items", "Item handling"], icon: "building", status: "scoping" },
  { id: "industrial", title: "Industrial workplaces", description: "Operational settings with equipment and multi-step procedures.", examples: ["Equipment interaction", "Tool handling"], icon: "factory", status: "scoping" },
  { id: "other", title: "Project-specific sites", description: "Other locations, agreed with you and the site owner.", examples: ["Defined in your capture brief"], icon: "plus", status: "scoping" },
];

/* ───────────────────────────── Services ───────────────────────────────────── */

export type ServiceVisual =
  | { kind: "video"; media: SampleMedia; alt: string; label: string }
  | { kind: "image"; src: string; width: number; height: number; alt: string; label: string; position?: string }
  | { kind: "text-annotation" };

export type ServiceCard = { n: string; title: string; body: string; href: string; tags: string[]; visual: ServiceVisual };

/** Each service has its own visual — real footage where it exists, a labelled frame otherwise. */
export const services: ServiceCard[] = [
  {
    n: "01",
    title: "Robotics & Physical AI data",
    body: "Human activity and interaction datasets for robotics and embodied AI — from task definition to training-ready episodes.",
    href: "/solutions/physical-ai",
    tags: ["Demonstrations", "Episodes"],
    visual: { kind: "video", media: clips.sheetHandling, alt: "Looping first-person video: gloved hands handling a metal sheet in a fabrication plant.", label: "Real capture" },
  },
  {
    n: "02",
    title: "Egocentric video collection",
    body: "First-person video of real tasks, captured on agreed rigs with synchronised sensor data.",
    href: "/services/egocentric-video-data",
    tags: ["RGB · stereo", "IMU"],
    visual: { kind: "video", media: clips.metalWork, alt: "Looping first-person video of gloved hands positioning a metal panel at a spot-welding machine.", label: "Real capture" },
  },
  {
    n: "03",
    title: "Computer vision data",
    body: "Video labelled for detection, tracking, activity and temporal segmentation.",
    href: "/services/video-annotated-data",
    tags: ["Boxes", "Tracks", "Segments"],
    visual: { kind: "image", src: "/images/egocentric/ego-screwdriver.jpg", width: 765, height: 476, alt: "Illustrative frame with a labelled bounding box around a screwdriver held in gloved hands.", label: "Illustrative frame", position: "62% 50%" },
  },
  {
    n: "04",
    title: "Speech & voice AI",
    body: "Transcription, timestamped segmentation, speaker diarisation and audio event labels.",
    href: "/services/audio-annotated-data",
    tags: ["Transcripts", "Diarisation"],
    visual: { kind: "image", src: "/images/services/yt-zshr2sYCAxk.jpg", width: 1280, height: 720, alt: "Screenshot of Mvaak’s audio-to-text transcription tool.", label: "Mvaak transcription tool", position: "8% 50%" },
  },
  {
    n: "05",
    title: "NLP & LLM data",
    body: "Text classification, entities, intent, sentiment and span relations, with agreement checks.",
    href: "/services/text-annotated-data",
    tags: ["Entities", "Intent"],
    visual: { kind: "text-annotation" },
  },
  {
    n: "06",
    title: "Annotation & quality assurance",
    body: "Labelling to a written guideline, multi-stage review and acceptance against agreed criteria.",
    href: "/services#annotation",
    tags: ["Guidelines", "Review"],
    visual: { kind: "video", media: clips.handloom, alt: "Looping first-person video of hands working a handloom.", label: "Real capture · unannotated" },
  },
];

/* ───────────────────────────── Regions ────────────────────────────────────── */

export type Region = {
  name: string;
  kind: "country" | "region";
  /**
   * base       — operations based here (footer addresses; field teams across Indian states).
   * engagements — Mvaak has delivered client engagements here (brochure); not a collection claim.
   * target     — a target region: collection is scoped and confirmed per project.
   */
  status: "base" | "engagements" | "target";
};

export const regions: Region[] = [
  { name: "India", kind: "country", status: "base" },
  { name: "United Arab Emirates", kind: "country", status: "engagements" },
  { name: "Singapore", kind: "country", status: "engagements" },
  { name: "Philippines", kind: "country", status: "target" },
  { name: "United States", kind: "country", status: "target" },
  { name: "United Kingdom", kind: "country", status: "target" },
  { name: "China", kind: "country", status: "target" },
  { name: "Latin America", kind: "region", status: "target" },
  { name: "Other parts of Asia", kind: "region", status: "target" },
];

export const regionStatusLabel: Record<Region["status"], string> = {
  base: "Operations base",
  engagements: "Client engagements delivered",
  target: "Target region — confirmed per project",
};

/* ───────────────────────────── Technical capabilities ─────────────────────── */

/** Only capabilities described in Mvaak's materials (see egocentric-collection.ts). */
export const capabilities = [
  {
    title: "Capture",
    items: ["First-person (egocentric) video", "Paired third-person views", "Calibrated RGB or stereo", "IMU clock-aligned to frames", "Multilingual audio & narration"],
  },
  {
    title: "Annotation",
    items: ["Temporal segmentation to sub-action", "Outcome markers", "Hand keypoints & object tracks", "Contact events", "Task, object & environment metadata"],
  },
  {
    title: "Quality assurance",
    items: ["File integrity", "Timestamp consistency", "Metadata & annotation completeness", "Task consistency", "Human review against your acceptance criteria"],
  },
  {
    title: "Delivery",
    items: ["LeRobot", "RLDS", "MCAP", "Raw + manifest", "Bespoke schema", "Consent & provenance manifest"],
  },
];

/* ───────────────────────────── FAQ ────────────────────────────────────────── */

export const homeFaqs = [
  {
    q: "What types of data does Mvaak collect?",
    a: "Real-world data for AI: egocentric (first-person) video of human tasks with synchronised sensor data, plus audio, video and text data with annotation and quality assurance.",
  },
  {
    q: "What is egocentric video data?",
    a: "Video recorded from a first-person perspective — typically a head- or chest-mounted camera — showing a task from the viewpoint of the person performing it.",
  },
  {
    q: "How does Mvaak support robotics and Physical AI?",
    a: "We turn a task your robot needs to learn into a capture brief, record real people performing it in real environments, segment and annotate the episodes, and deliver them in formats such as LeRobot, RLDS or MCAP.",
  },
  {
    q: "Which environments can be covered?",
    a: "Household, commercial and agricultural settings, including retail, food service, offices and warehouse work. Industrial and other sites are confirmed during project scoping.",
  },
  {
    q: "Does Mvaak support stereo and mono-RGB capture?",
    a: "Yes. Standard deliverables include calibrated RGB or stereo video at the agreed resolution and frame rate, with IMU aligned to the video. The rig is chosen per task.",
  },
  {
    q: "Can data be collected to custom task requirements?",
    a: "Yes. Tasks, environments, devices, annotation and delivery are defined in a written capture brief agreed with you before recording begins.",
  },
  {
    q: "Does Mvaak provide annotation and quality assurance?",
    a: "Yes. Annotation is done to a written guideline, and every delivery goes through integrity checks and human review against acceptance criteria agreed with you.",
  },
  {
    q: "Can Mvaak support large-scale collection projects?",
    a: "Mvaak runs a trained collector network across Indian states. Volume, timelines and staffing for a specific project are agreed during scoping — often starting with a small pilot.",
  },
  {
    q: "Which countries and regions can Mvaak support?",
    a: "Operations are based in India. Collection in other countries and regions is scoped and confirmed project by project.",
  },
  {
    q: "How can an organisation request a sample dataset?",
    a: "Use the contact form and choose what you are looking for. Whether a sample is available, and what it contains, depends on the data and your requirements — we confirm this when you get in touch.",
  },
];
