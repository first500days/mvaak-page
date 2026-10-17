import type { MetadataRoute } from "next";
import { indexable, site } from "@/config/site";

/**
 * Production: crawl everything except the form/API endpoints (they only accept POSTs and have
 * no content). CSS, JS, images and /_next assets stay crawlable so pages render for Googlebot.
 * Non-production builds (see `indexable`) block all crawling; pages also carry noindex.
 */
export default function robots(): MetadataRoute.Robots {
  if (!indexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
