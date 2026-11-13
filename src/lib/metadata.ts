import type { Metadata } from "next";
import { indexable, site } from "@/config/site";

/** Site-wide share image (src/app/opengraph-image.tsx), 1200×630. */
export const shareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Mvaak — real-world demonstrations, training-ready data for AI.",
};

/**
 * Per-page metadata: unique title + description, self-referencing canonical, robots,
 * and Open Graph / Twitter tags. Page-level `openGraph` replaces the root one in Next.js,
 * so the share image is set here explicitly — otherwise inner pages would share without one.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  absoluteTitle,
  noindex = false,
  image,
  keywords,
}: {
  /** Page title; the root template appends " · Mvaak". */
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  /** Use the title as-is, without the " · Mvaak" suffix. */
  absoluteTitle?: boolean;
  noindex?: boolean;
  /** Page-specific share image (defaults to the site-wide one). */
  image?: { url: string; width: number; height: number; alt: string };
  keywords?: string[];
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} · ${site.name}`;
  const images = [image ?? shareImage];
  return {
    ...(keywords?.length ? { keywords } : {}),
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: noindex || !indexable ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      type,
      siteName: site.name,
      locale: "en_IN",
      images,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
  };
}
