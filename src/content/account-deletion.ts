/**
 * Account deletion page content (/delete-account) — required by Google Play and the App Store.
 *
 * ⚠️ POLICY COMMITMENTS — confirm with Mvaak (operations + legal) before publishing.
 * The timelines and the in-app steps below were supplied in the page brief and are not yet
 * verified against the app or company policy. Change them here; the page reads only from this file.
 * See docs/CONTENT-REVIEW.md §13.
 */

/** Inbox that receives deletion requests and questions about personal data. */
export const PRIVACY_EMAIL = "privacy@mvaak.com";

/**
 * How the web form sends a request:
 *   "api"    → POST /api/delete-account-request (server validates, rate-limits, emails PRIVACY_EMAIL).
 *   "mailto" → opens a pre-filled email to PRIVACY_EMAIL instead (no backend involved).
 * The API mode also offers the email route automatically if the server has no delivery channel.
 */
export const DELETION_REQUEST_MODE: "api" | "mailto" = "api";

/** Unverified operational commitments (see the warning above). */
export const deletionTimelines = {
  verificationEmailHours: 48,
  activeSystemsDays: 30,
  backupsDays: 90,
} as const;

export const appSteps = [
  "Open the Mvaak app and sign in.",
  "Go to Profile → Settings → Account.",
  "Tap Delete account.",
  "Read the summary, tick the confirmation box, and verify with the one-time code sent to you.",
  "Tap Permanently delete. You’ll be signed out and receive a confirmation email.",
];

export const dataDeleted = [
  "Your profile (name, email, phone number, photo)",
  "Login credentials and linked sign-in accounts",
  "Device information and app usage data",
  "Recordings and uploads not yet processed or delivered",
  "Notification and preference settings",
];

export const dataKept = [
  "Payment, payout and invoice records, kept for the period required by tax and accounting law, then deleted",
  "Records needed to resolve disputes, prevent fraud or meet legal obligations",
  "Data you contributed that has already been de-identified and delivered under your contributor agreement, which can no longer be linked to you",
];

export const retentionNote = `Your account is deactivated immediately. Personal data is permanently removed from our active systems within ${deletionTimelines.activeSystemsDays} days and from backups within ${deletionTimelines.backupsDays} days. Any pending payouts are settled before the account is closed.`;

export const nextSteps = [
  `We email you within ${deletionTimelines.verificationEmailHours} hours to confirm the request came from you.`,
  "Once you confirm, your account is deactivated straight away.",
  `Your data is permanently deleted within ${deletionTimelines.activeSystemsDays} days, and we email you when it’s done.`,
];

export const reasonOptions = [
  { id: "prefer-not-to-say", label: "Prefer not to say" },
  { id: "no-longer-use", label: "I no longer use Mvaak" },
  { id: "privacy-concerns", label: "Privacy concerns" },
  { id: "another-account", label: "I have another account" },
  { id: "app-problems", label: "Problems with the app" },
  { id: "other", label: "Other" },
] as const;

export const consentStatements = {
  permanent: "I understand that deleting my account is permanent and cannot be undone.",
  deletion_and_retention:
    "I consent to Mvaak deleting my account and personal data as described above, including keeping records that the law requires.",
  account_owner: "I am the owner of this account.",
} as const;
