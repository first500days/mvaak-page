import { site } from "@/config/site";

/**
 * Shared JSON-LD identifiers so every page's structured data points at one Organization
 * and one WebSite node instead of repeating (and possibly contradicting) them.
 * Only facts visible on the site are used — no ratings, prices, addresses or awards.
 */
export const ORG_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;
export const FOUNDER_ID = `${site.url}/about#founder`;
export const LOGO_URL = `${site.url}/brand/mvaak-logo-512.png`;

export const orgRef = { "@id": ORG_ID };

export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: site.name,
        legalName: site.legalName,
        url: site.url,
        logo: { "@type": "ImageObject", url: LOGO_URL, width: 512, height: 512 },
        email: site.email,
        description: site.description,
        sameAs: site.social.map((s) => s.href.split("?")[0]),
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "en",
        publisher: orgRef,
      },
    ],
  };
}
