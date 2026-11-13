import { deletionRequestSchema } from "@/lib/forms/deletion-schema";
import { labelFor } from "@/lib/forms/inquiry-schema";
import { consentStatements, reasonOptions } from "@/content/account-deletion";
import { handleSubmission } from "@/lib/server/submission";

/**
 * POST /api/delete-account-request — creates an account deletion REQUEST and notifies the privacy
 * inbox. It never deletes anything: ownership is verified by email and deletion is done by staff.
 *
 * Shared handling (lib/server/submission.ts): server-side Zod validation, honeypot, per-IP rate
 * limit, and idempotent retries of the same submission. Added here: one pending request per email
 * per 24 h (per server instance), and the server's own receipt time next to the consent time.
 * Nothing about the requester is logged; delivery errors log only the reference.
 */
const PENDING_MS = 24 * 60 * 60 * 1000;
const pendingByEmail = new Map<string, { at: number; reference: string }>();

export async function POST(request: Request) {
  const now = Date.now();
  const email = await request
    .clone()
    .json()
    .then((b: { email?: unknown }) => (typeof b?.email === "string" ? b.email.trim().toLowerCase() : ""))
    .catch(() => "");

  const pending = email ? pendingByEmail.get(email) : undefined;
  if (pending && now - pending.at < PENDING_MS) {
    // A request for this email is already waiting for verification — don't create (or email) another.
    return Response.json(
      { ok: true, reference: pending.reference, status: "already_pending" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const response = await handleSubmission(request, {
    kind: "deletion",
    prefix: "MVD",
    schema: deletionRequestSchema,
    toLead: (d, reference) => {
      const receivedAt = new Date().toISOString();
      const consentRow = (key: keyof typeof consentStatements) => [consentStatements[key], d.consent[key] ? "Yes" : "No"] as [string, string];
      return {
        kind: "deletion",
        id: reference,
        replyTo: d.email,
        subject: `Account deletion request — ${reference} (verify ownership before acting)`,
        sections: [
          {
            heading: "Request",
            rows: [
              ["Status", "Received — ownership NOT yet verified. Do not delete until the requester confirms."],
              ["Registered email", d.email],
              ["Phone on account", d.phone],
              ["Reason", d.reason ? labelFor(reasonOptions, d.reason) : ""],
              ["Anything else", d.details],
              ["Source", d.source],
            ],
          },
          {
            heading: "Consent",
            rows: [
              consentRow("permanent"),
              consentRow("deletion_and_retention"),
              consentRow("account_owner"),
              ["Consented at (requester's clock)", d.consented_at],
              ["Received at (server)", receivedAt],
            ],
          },
        ],
        data: { ...d, website: undefined, received_at: receivedAt, status: "pending_verification" },
        sheet: {
          reference,
          email: d.email,
          phone: d.phone,
          reason: d.reason ? labelFor(reasonOptions, d.reason) : "",
          details: d.details,
          consentPermanent: String(d.consent.permanent),
          consentDeletionAndRetention: String(d.consent.deletion_and_retention),
          consentAccountOwner: String(d.consent.account_owner),
          consentedAt: d.consented_at,
          receivedAt,
          source: d.source,
          status: "pending_verification",
        },
      };
    },
  });

  if (response.ok && email) {
    const body = (await response.clone().json().catch(() => ({}))) as { ok?: boolean; reference?: string };
    if (body.ok && body.reference) {
      pendingByEmail.set(email, { at: now, reference: body.reference });
      for (const [k, v] of pendingByEmail) if (now - v.at > PENDING_MS) pendingByEmail.delete(k);
      return Response.json({ ...body, status: "received" }, { headers: { "Cache-Control": "no-store" } });
    }
  }
  return response;
}
