import { z } from "zod";

/** Shared by the Contact Us form and the /api/inquiry route. */

export const lookingForOptions = [
  { id: "egocentric-video", label: "Egocentric Video Data" },
  { id: "physical-ai", label: "Robotics & Physical AI" },
  { id: "computer-vision", label: "Computer Vision Data" },
  { id: "speech-voice", label: "Speech & Voice AI" },
  { id: "nlp-llm", label: "NLP & LLM Data" },
  { id: "annotation", label: "Data Annotation" },
  { id: "other", label: "Other" },
] as const;

export type LookingForId = (typeof lookingForOptions)[number]["id"];

/**
 * Existing links pre-select the dropdown with `?type=` (older project-type ids are kept so
 * service-page, footer and egocentric-page links continue to work).
 */
export const lookingForFromParam: Record<string, LookingForId> = {
  "egocentric-video": "egocentric-video",
  "physical-ai": "physical-ai",
  "data-collection": "physical-ai",
  "video-annotation": "computer-vision",
  "computer-vision": "computer-vision",
  "audio-annotation": "speech-voice",
  "speech-voice": "speech-voice",
  "text-annotation": "nlp-llm",
  "nlp-llm": "nlp-llm",
  "quality-assurance": "annotation",
  "annotation-rescue": "annotation",
  annotation: "annotation",
  other: "other",
};

export const requestTypes = [
  { id: "project", label: "Project enquiry" },
  { id: "sample", label: "Sample request" },
] as const;

const ids = <T extends readonly { id: string }[]>(list: T) =>
  list.map((x) => x.id) as unknown as [T[number]["id"], ...T[number]["id"][]];

/** The visible fields (validated in the browser and again on the server). */
export const inquiryFields = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.string().trim().email("Enter a valid work email address.").max(200),
  company: z.string().trim().min(1, "Please enter your company or organisation.").max(160),
  lookingFor: z.enum(ids(lookingForOptions), { error: "Choose what you are looking for." }),
  description: z
    .string()
    .trim()
    .min(10, "A sentence or two helps us respond usefully.")
    .max(4000, "Please keep this under 4,000 characters."),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => v === "" || (/^\+?[\d\s()-]{7,20}$/.test(v) && v.replace(/\D/g, "").length >= 7), "Enter a valid phone number, e.g. +91 98765 43210.")
    .optional()
    .default(""),
});

export const inquirySchema = inquiryFields.extend({
  /** "sample" when the visitor arrived from a "Request a sample" link. */
  requestType: z.enum(ids(requestTypes)).default("project"),
  /** Honeypot — any value is silently discarded by the API. */
  website: z.string().max(500).optional(),
  submissionId: z.string().min(8).max(64),
  source: z.string().max(200).optional(),
});

export type Inquiry = z.output<typeof inquirySchema>;

export const labelFor = <T extends readonly { id: string; label: string }[]>(list: T, id?: string) =>
  list.find((x) => x.id === id)?.label ?? id ?? "";
