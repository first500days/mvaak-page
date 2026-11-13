import Link from "next/link";
import { CheckCircle2, Trash2, Archive } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DeleteAccountForm } from "@/components/forms/delete-account-form";
import { pageMetadata } from "@/lib/metadata";
import { PRIVACY_EMAIL, appSteps, dataDeleted, dataKept, nextSteps, retentionNote } from "@/content/account-deletion";

// Public and indexable on purpose: Google Play and App Store reviewers must be able to open it.
export const metadata = pageMetadata({
  title: "Delete Your Account – Mvaak",
  absoluteTitle: true,
  description: "Request deletion of your Mvaak account and associated personal data.",
  path: "/delete-account",
});

const h2 = "text-h3 font-semibold tracking-tight text-ink";

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="mt-5 space-y-3">
      {items.map((s, i) => (
        <li key={s} className="flex gap-3 leading-relaxed text-ink-2">
          <span aria-hidden className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-xs text-white">
            {i + 1}
          </span>
          <span className="pt-0.5">{s}</span>
        </li>
      ))}
    </ol>
  );
}

export default function DeleteAccountPage() {
  return (
    <div className="container-page py-12 sm:py-16 lg:py-20">
      <Breadcrumbs items={[{ label: "Delete account" }]} />
      <div className="max-w-3xl">
        {/* 1 — Heading + intro */}
        <p className="eyebrow">Account &amp; data</p>
        <h1 className="mt-4 text-h1 font-semibold text-balance text-ink">Delete your Mvaak account</h1>
        <p className="mt-5 text-lead text-pretty text-ink-2">
          You can delete your Mvaak account and the personal data linked to it at any time, from the app or from this page. Deletion is
          permanent and can’t be undone.
        </p>

        {/* 2 — Option 1: in the app */}
        <section aria-labelledby="app-title" className="mt-12 rounded-card border border-line bg-surface p-5 sm:p-8">
          <p className="font-mono text-xs tracking-[0.14em] text-accent uppercase">Option 1</p>
          <h2 id="app-title" className={`mt-2 ${h2}`}>
            Delete from the Mvaak app
          </h2>
          <Steps items={appSteps} />
        </section>

        {/* 3 — What happens to your data */}
        <section aria-labelledby="data-title" className="mt-12">
          <h2 id="data-title" className={h2}>
            What happens to your data
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-card border border-line bg-surface p-5 sm:p-6">
              <h3 className="flex items-center gap-2 font-semibold text-ink">
                <Trash2 aria-hidden className="size-5 text-accent" /> Deleted
              </h3>
              <ul className="mt-4 space-y-2.5">
                {dataDeleted.map((d) => (
                  <li key={d} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
                    <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card border border-line bg-surface p-5 sm:p-6">
              <h3 className="flex items-center gap-2 font-semibold text-ink">
                <Archive aria-hidden className="size-5 text-steel" /> Kept, where required
              </h3>
              <ul className="mt-4 space-y-2.5">
                {dataKept.map((d) => (
                  <li key={d} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-steel" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 rounded-card border border-line bg-subtle p-4 text-[0.9375rem] leading-relaxed text-ink-2">{retentionNote}</p>
        </section>

        {/* 4 — Option 2: request here */}
        <section aria-labelledby="request-title" className="mt-12">
          <p className="font-mono text-xs tracking-[0.14em] text-accent uppercase">Option 2</p>
          <h2 id="request-title" className={`mt-2 ${h2}`}>
            Request deletion here
          </h2>
          <p className="mt-3 leading-relaxed text-ink-2">
            Can’t access the app? Submit a request below. We’ll verify that you own the account before deleting anything.
          </p>
          <div className="mt-6">
            <DeleteAccountForm />
          </div>
        </section>

        {/* 5 — What happens next */}
        <section aria-labelledby="next-title" className="mt-12">
          <h2 id="next-title" className={h2}>
            What happens next
          </h2>
          <Steps items={nextSteps} />
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
            Changed your mind? Reply to the verification email before confirming and we’ll cancel the request.
          </p>
        </section>

        {/* 6 — Contact */}
        <p className="mt-12 border-t border-line pt-6 leading-relaxed text-ink-2">
          Questions about your data? Email{" "}
          <a href={`mailto:${PRIVACY_EMAIL}`} className="text-accent underline underline-offset-2">
            {PRIVACY_EMAIL}
          </a>
          . See our{" "}
          <Link href="/privacy" className="text-accent underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
