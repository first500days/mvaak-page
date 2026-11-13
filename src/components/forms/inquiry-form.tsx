"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { inquiryFields, lookingForFromParam, lookingForOptions } from "@/lib/forms/inquiry-schema";
import { track } from "@/lib/analytics";
import { site } from "@/config/site";
import { buttonClass } from "@/components/ui/button";
import { Honeypot, SelectField, TextAreaField, TextField } from "./fields";
import { FormSubmitError } from "./form-alerts";
import { useSubmission } from "./use-submission";

type FormValues = {
  name: string;
  email: string;
  company: string;
  lookingFor: string;
  description: string;
  phone: string;
  website: string;
};

function initialValues(params: URLSearchParams): FormValues {
  return {
    name: "",
    email: "",
    company: "",
    lookingFor: lookingForFromParam[params.get("type") ?? ""] ?? "",
    description: "",
    phone: "",
    website: "",
  };
}

/**
 * Contact Us form — five required fields plus an optional phone. Submits to /api/inquiry, which
 * writes to the Contact Leads sheet and reports success only once the sheet confirms the write.
 */
export function InquiryForm() {
  const params = useSearchParams();
  const isSample = params.get("intent") === "sample";
  const [values, setValues] = useState<FormValues>(() => initialValues(params));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { state, submit } = useSubmission("/api/inquiry");
  const submitting = state.status === "submitting";

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key])
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
  };

  const onFirstInteraction = () => {
    if (started.current) return;
    started.current = true;
    track("project_inquiry_started", { looking_for: values.lookingFor || "unset" });
  };

  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status !== "success") return;
    successRef.current?.scrollIntoView({ block: "center" });
    successRef.current?.focus({ preventScroll: true });
  }, [state.status]);

  function showErrors(next: Record<string, string>) {
    setErrors(next);
    const first = formRef.current?.querySelector<HTMLElement>(`#f-${Object.keys(next)[0]}`);
    first?.focus();
    first?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    const parsed = inquiryFields.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!next[key]) next[key] = issue.message;
      }
      return showErrors(next);
    }
    setErrors({});
    const result = await submit({
      ...values,
      requestType: isSample ? "sample" : "project",
      source: window.location.pathname + window.location.search,
    });
    if (result.status === "success") {
      track("project_inquiry_submitted", { looking_for: values.lookingFor, request: isSample ? "sample" : "project" });
      setValues(initialValues(params));
    } else if (result.status === "error") {
      track("form_submission_failed", { form: "inquiry", reason: result.kind });
      if (process.env.NODE_ENV !== "production") console.warn("[contact form] submission failed:", result.kind);
      if (result.kind === "validation" && result.fieldErrors) showErrors(result.fieldErrors);
    }
  }

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="scroll-mt-28 rounded-card border border-accent-line bg-accent-soft p-6 outline-none sm:p-10"
      >
        <CheckCircle2 aria-hidden className="size-10 text-accent" />
        <p className="mt-5 max-w-xl text-xl leading-snug font-semibold text-pretty text-ink sm:text-2xl">
          Thank you for contacting Mvaak! Your form has been submitted successfully. Our team will review your enquiry.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      onFocusCapture={onFirstInteraction}
      aria-labelledby="inquiry-form-title"
      aria-describedby="inquiry-required-note"
      className="relative overflow-hidden rounded-card border border-line bg-surface shadow-[0_1px_2px_rgb(21_26_33/0.04),0_24px_48px_-32px_rgb(21_26_33/0.25)]"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1 border-b border-line bg-subtle px-5 py-5 sm:px-8">
        <h2 id="inquiry-form-title" className="text-lg font-semibold text-ink">
          {isSample ? "Request a sample" : "Project enquiry"}
        </h2>
        <p id="inquiry-required-note" className="text-sm text-muted">
          About 1 minute · <span className="text-danger" aria-hidden>*</span> required
        </p>
      </div>

      <div className="grid gap-5 px-5 py-7 sm:grid-cols-2 sm:px-8">
        <TextField name="name" label="Full Name" required autoComplete="name" value={values.name} onChange={(v) => set("name", v)} error={errors.name} />
        <TextField
          name="email"
          label="Work Email"
          type="email"
          inputMode="email"
          required
          autoComplete="email"
          value={values.email}
          onChange={(v) => set("email", v)}
          error={errors.email}
        />
        <TextField
          name="company"
          label="Company / Organisation"
          required
          autoComplete="organization"
          value={values.company}
          onChange={(v) => set("company", v)}
          error={errors.company}
        />
        <TextField
          name="phone"
          label="Phone Number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          value={values.phone}
          onChange={(v) => set("phone", v)}
          error={errors.phone}
        />
        <SelectField
          name="lookingFor"
          label="What are you looking for?"
          required
          placeholder="Select an option"
          options={lookingForOptions}
          value={values.lookingFor}
          onChange={(v) => set("lookingFor", v)}
          error={errors.lookingFor}
          className="sm:col-span-2"
        />
        <TextAreaField
          name="description"
          label="Brief Project Description"
          required
          rows={5}
          maxLength={4000}
          placeholder="What should the model learn, and where would the data come from?"
          value={values.description}
          onChange={(v) => set("description", v)}
          error={errors.description}
          className="sm:col-span-2"
        />
      </div>

      <div className="space-y-5 border-t border-line bg-subtle px-5 py-7 sm:px-8">
        <Honeypot value={values.website} onChange={(v) => set("website", v)} />
        <FormSubmitError state={state} noun="enquiry" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" disabled={submitting} className={buttonClass("primary", "lg", "w-full sm:w-auto sm:shrink-0 sm:whitespace-nowrap")}>
            {submitting ? (
              <>
                <Loader2 aria-hidden className="size-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                Submit Form <Send aria-hidden className="size-4" />
              </>
            )}
          </button>
          <p className="text-sm text-muted sm:text-right">
            Prefer email?{" "}
            <a href={`mailto:${site.email}`} className="text-accent underline underline-offset-2">
              {site.email}
            </a>
          </p>
        </div>
        <p className="text-xs leading-relaxed text-muted">
          We use these details only to respond to your enquiry — see our{" "}
          <Link href="/privacy" className="text-accent underline underline-offset-2">
            privacy notice
          </Link>
          .
        </p>
        <p aria-live="polite" className="sr-only">
          {submitting ? "Submitting your enquiry" : ""}
        </p>
      </div>
    </form>
  );
}
