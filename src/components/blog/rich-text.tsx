import Link from "next/link";
import { Fragment } from "react";

const LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

/**
 * Renders article text with inline internal links written as [label](/path).
 * Only site-relative paths are linked; anything else is left as plain text.
 */
export function RichText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    const i = m.index ?? 0;
    if (i > last) parts.push(text.slice(last, i));
    parts.push(
      <Link key={i} href={m[2]} className="font-medium text-accent underline decoration-accent-line underline-offset-4 hover:text-accent-strong hover:decoration-accent">
        {m[1]}
      </Link>,
    );
    last = i + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts.map((p, i) => (typeof p === "string" ? <Fragment key={`t${i}`}>{p}</Fragment> : p))}</>;
}

/** Plain-text version (for descriptions, search and structured data). */
export const stripLinks = (text: string) => text.replace(LINK, "$1");
