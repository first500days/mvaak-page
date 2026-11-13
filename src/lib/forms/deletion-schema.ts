import { z } from "zod";
import { reasonOptions } from "@/content/account-deletion";

/** Shared by the /delete-account form and POST /api/delete-account-request. */

const ids = reasonOptions.map((r) => r.id) as unknown as [string, ...string[]];

/** Trims and strips control characters (keeps newlines/tabs in free text). */
const clean = (max: number) =>
  z
    .string()
    .max(max * 2)
    .transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim())
    .pipe(z.string().max(max, `Please keep this under ${max.toLocaleString("en-US")} characters.`));

const mustAccept = (message: string) => z.literal(true, { error: message });

export const deletionFields = z.object({
  email: z.string().trim().toLowerCase().email("Enter the email address registered with your account.").max(200),
  phone: clean(30)
    .refine((v) => v === "" || (/^\+?[\d\s()-]{7,20}$/.test(v) && v.replace(/\D/g, "").length >= 7), "Enter a valid phone number, e.g. +91 98765 43210.")
    .optional()
    .default(""),
  reason: z.union([z.enum(ids), z.literal("")]).optional().default(""),
  details: clean(2000).optional().default(""),
  consent: z.object({
    permanent: mustAccept("Please confirm you understand deletion is permanent."),
    deletion_and_retention: mustAccept("Please consent to the deletion and the records the law requires us to keep."),
    account_owner: mustAccept("Please confirm you own this account."),
  }),
});

export const deletionRequestSchema = deletionFields.extend({
  /** When the visitor ticked the boxes (client clock). The server records its own time as well. */
  consented_at: z.iso.datetime({ offset: true, error: "Missing consent timestamp." }),
  source: z.literal("web"),
  /** Honeypot — must stay empty. */
  website: z.string().max(500).optional(),
  submissionId: z.string().min(8).max(64),
});

export type DeletionRequest = z.output<typeof deletionRequestSchema>;
