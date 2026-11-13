import type { MetadataRoute } from "next";
import { indexable, site } from "@/config/site";
import { articles } from "@/content/articles";
import { dataTypePages } from "@/content/data-types";

/**
 * Generated at build time from the same content the routes use, so new articles and service
 * pages are included automatically. Only canonical, indexable 200 URLs — no redirects, API
 * routes or 404s. `lastModified` is set only where a real date exists (article publish dates).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexable) return [];

  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly") => ({
    url: `${site.url}${path}`,
    changeFrequency,
    priority,
  });
  // Articles are sorted newest first; the blog index changes when a new one is published.
  const newestArticle = articles[0]?.date;

  return [
    page("", 1, "weekly"),
    page("/services", 0.9),
    page("/services/egocentric-video-data", 0.9),
    ...dataTypePages.map((p) => page(`/services/${p.slug}`, 0.7)),
    page("/solutions/physical-ai", 0.8),
    page("/partnerships", 0.8),
    page("/about", 0.6),
    page("/contact", 0.7),
    { ...page("/blog", 0.7, "weekly"), ...(newestArticle ? { lastModified: newestArticle } : {}) },
    ...articles.map((a) => ({ ...page(`/blog/${a.slug}`, 0.5, "yearly"), lastModified: a.date })),
    page("/privacy", 0.2, "yearly"),
    // Required by Google Play / App Store reviewers — must stay public and indexable.
    page("/delete-account", 0.3, "yearly"),
  ];
}
