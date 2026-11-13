"use client";

import { useRef, useState, type FormEvent } from "react";
import { AlertTriangle, CheckCircle2, CircleX, Loader2, Mail } from "lucide-react";
import { DELETION_REQUEST_MODE, PRIVACY_EMAIL, consentStatements, deletionTimelines, reasonOptions } from "@/content/account-deletion";
import { deletionFields } from "@/lib/forms/deletion-schema";
import { buttonClass } from "@/components/ui/button";
import { ConsentCheckbox, Honeypot, SelectField, TextAreaField, TextField } from "./fields";

type ConsentKey = keyof typeof consentStatements;
type Values = { email: string; phone: string; reason: string; details: string; website: string };

/**
 * Request states, kept deliberately distinct — this form never claims an account was deleted:
 *   submitting → received (server stored + notified; email verification pending)
 *              → already_pending (a request for this email is already awaiting verification)
 *              → mailto (visitor's email app opened; NOT sent until they press send)
 *              → error
 */
type Status =
  | { s: "idle" }
  | { s: "submitting" }
  | { s: "received"; email: string }
  | { s: "already_pending"; email: string }
  | { s: "mailto" }
  | { s: "error"; offerEmail: boolean };

const without = (o: Record<string, string>, key: string) => Object.fromEntries(Object.entries(o).filter(([k]) => k !== key));

const EMPTY: Values = { email: "", phone: "", reason: "", details: "", website: "" };
const NO_CONSENT: Record<ConsentKey, boolean> = { permanent: false, deletion_and_retention: false, account_owner: false };

function mailtoHref(v: Values, consentedAt: string) {
  const reason = reasonOptions.find((r) => r.id === v.reason)?.label ?? "";
  const body = [
    "Please delete my Mvaak account and the personal data linked to it.",
    "",
    `Email registered with my account: ${v.email}`,
    `Phone number on the account: ${v.phone || "—"}`,
    `Reason for leaving: ${reason || "—"}`,
    `Anything else: ${v.details || "—"}`,
    "",
    "Consent:",
    `[x] ${consentStatements.permanent}`,
    `[x] ${consentStatements.deletion_and_retention}`,
    `[x] ${consentStatements.account_owner}`,
    `Consented at: ${consentedAt}`,
    "Source: web",
  ].join("\n");
  return `mailto:${PRIVACY_EMAIL}?subject=${encodeURIComponent("Account deletion request")}&body=${encodeURIComponent(body)}`;
}

export function DeleteAccountForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [consent, setConsent] = useState(NO_CONSENT);
  const [consentedAt, setConsentedAt] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ s: "idle" });
  const submissionId = useRef<string | null>(null);
  const inFlight = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);

  const emailValid = deletionFields.shape.email.safeParse(values.email).success;
  const allConsented = consent.permanent && consent.deletion_and_retention && consent.account_owner;
  const done = status.s === "received" || status.s === "already_pending";
  const submitting = status.s === "submitting";
  const canSubmit = emailValid && allConsented && !submitting && !done;

  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    setValues((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => without(e, k));
  };
  const setConsentKey = (k: ConsentKey, v: boolean) => {
    const next = { ...consent, [k]: v };
    setConsent(next);
    // Consent time = the moment the last of the three boxes was ticked; cleared if any is unticked.
    setConsentedAt(next.permanent && next.deletion_and_retention && next.account_owner ? new Date().toISOString() : null);
    if (errors[`consent.${k}`]) setErrors((e) => without(e, `consent.${k}`));
  };
  const focusStatus = () => requestAnimationFrame(() => statusRef.current?.focus());

  function openEmail() {
    window.location.assign(mailtoHref(values, consentedAt ?? new Date().toISOString()));
    setStatus({ s: "mailto" });
    focusStatus();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || inFlight.current) return;
    const parsed = deletionFields.safeParse({ ...values, consent });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    if (DELETION_REQUEST_MODE === "mailto") return openEmail();

    inFlight.current = true;
    submissionId.current ??= crypto.randomUUID();
    setStatus({ s: "submitting" });
    let next: Status;
    try {
      const res = await fetch("/api/delete-account-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          phone: values.phone,
          reason: values.reason,
          details: values.details,
          consent,
          consented_at: consentedAt ?? new Date().toISOString(),
          source: "web",
          website: values.website,
          submissionId: submissionId.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; status?: string; error?: string; fieldErrors?: Record<string, string> };
      if (res.ok && data.ok) {
        next = data.status === "already_pending" ? { s: "already_pending", email: values.email.trim() } : { s: "received", email: values.email.trim() };
      } else {
        if (data.error === "validation" && data.fieldErrors) setErrors(data.fieldErrors);
        // No delivery channel configured on this server: the request was not stored, so offer email.
        next = { s: "error", offerEmail: data.error === "not_configured" };
      }
    } catch {
      next = { s: "error", offerEmail: false };
    }
    inFlight.current = false;
    setStatus(next);
    focusStatus();
  }

  return (
    <form noValidate onSubmit={onSubmit} aria-labelledby="request-title" className="rounded-card border border-line bg-surface p-5 sm:p-8">
      <fieldset disabled={done || submitting} className="min-w-0 space-y-5 disabled:opacity-80">
        <legend className="sr-only">Account deletion request</legend>
        <p className="text-sm text-muted">
          Fields marked <span className="text-danger">*</span> are required.
        </p>
        <TextField
          name="email"
          label="Email registered with your account"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={(v) => set("email", v)}
          error={errors.email}
        />
        <TextField
          name="phone"
          label="Phone number on the account"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          hint="Helps us find your account if you signed up with your phone."
          value={values.phone}
          onChange={(v) => set("phone", v)}
          error={errors.phone}
        />
        <SelectField
          name="reason"
          label="Reason for leaving"
          placeholder="Select a reason (optional)"
          options={reasonOptions}
          value={values.reason}
          onChange={(v) => set("reason", v)}
          error={errors.reason}
        />
        <TextAreaField name="details" label="Anything else?" rows={4} maxLength={2000} value={values.details} onChange={(v) => set("details", v)} error={errors.details} />

        <div role="note" className="flex gap-3 rounded-xl border border-danger/25 bg-danger-soft p-4 text-[0.9375rem] leading-relaxed">
          <AlertTriangle aria-hidden className="mt-0.5 size-5 shrink-0 text-danger" />
          <p className="font-medium text-ink">
            This will permanently delete your Mvaak account. You will lose access to your profile, history and any unsubmitted work.
          </p>
        </div>

        <fieldset className="space-y-3">
          <legend className="sr-only">Confirmations (all required)</legend>
          {(Object.keys(consentStatements) as ConsentKey[]).map((k) => (
            <ConsentCheckbox key={k} name={`consent-${k}`} checked={consent[k]} onChange={(v) => setConsentKey(k, v)} error={errors[`consent.${k}`]}>
              {consentStatements[k]}
            </ConsentCheckbox>
          ))}
        </fieldset>

        <Honeypot value={values.website} onChange={(v) => set("website", v)} />

        <div className="border-t border-line pt-5">
          <button type="submit" disabled={!canSubmit} aria-describedby="submit-requirements" className={buttonClass("primary", "lg", "w-full sm:w-auto")}>
            {submitting ? (
              <>
                <Loader2 aria-hidden className="size-4 animate-spin" /> Sending request...
              </>
            ) : (
              "Request account deletion"
            )}
          </button>
          {!done && (
            <p id="submit-requirements" className="mt-3 text-sm text-muted">
              {canSubmit || submitting
                ? "This sends a deletion request. Nothing is deleted until you confirm the verification email."
                : "Enter a valid email and tick all three confirmations to continue."}
            </p>
          )}
        </div>
      </fieldset>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" role="status" className="outline-none empty:hidden mt-5">
        {status.s === "received" && (
          <div className="flex gap-3 rounded-xl border border-accent-line bg-accent-soft p-4 text-[0.9375rem] leading-relaxed">
            <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <p className="font-semibold text-ink">
                Request received. Check <span className="break-all">{status.email}</span> for a verification email within{" "}
                {deletionTimelines.verificationEmailHours} hours.
              </p>
              <p className="mt-1 text-ink-2">Your account has not been deleted yet — it stays active until you confirm.</p>
            </div>
          </div>
        )}
        {status.s === "already_pending" && (
          <div className="flex gap-3 rounded-xl border border-accent-line bg-accent-soft p-4 text-[0.9375rem] leading-relaxed">
            <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-accent" />
            <p className="font-semibold text-ink">
              A deletion request for <span className="break-all">{status.email}</span> is already pending verification. Check that inbox for our
              verification email.
            </p>
          </div>
        )}
        {status.s === "mailto" && (
          <div className="flex gap-3 rounded-xl border border-line-strong bg-subtle p-4 text-[0.9375rem] leading-relaxed">
            <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-accent" />
            <p className="font-medium text-ink">
              Your email application will open with your deletion request. Please send the email to complete your request.
            </p>
          </div>
        )}
        {status.s === "error" && (
          <div className="flex gap-3 rounded-xl border border-danger/25 bg-danger-soft p-4 text-[0.9375rem] leading-relaxed">
            <CircleX aria-hidden className="mt-0.5 size-5 shrink-0 text-danger" />
            <div>
              <p className="font-medium text-ink">
                Something went wrong. Please try again or email{" "}
                <a href={`mailto:${PRIVACY_EMAIL}`} className="text-accent underline underline-offset-2">
                  {PRIVACY_EMAIL}
                </a>
                .
              </p>
              {status.offerEmail && (
                <button type="button" onClick={openEmail} className={buttonClass("secondary", "md", "mt-3")}>
                  <Mail aria-hidden className="size-4" /> Send this request by email instead
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
