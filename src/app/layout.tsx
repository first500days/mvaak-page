import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { JsonLd } from "@/components/ui/json-ld";
import { indexable, site } from "@/config/site";
import { shareImage } from "@/lib/metadata";
import { siteGraph } from "@/lib/schema";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

/** Search Console HTML-tag verification token, if provided at build time (not a secret). */
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

// Defaults only. Every page sets its own title, description and self-referencing canonical
// (src/lib/metadata.ts); no canonical is set here so a page can never inherit the homepage's.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Mvaak — Egocentric Data & AI Training Data Services",
    template: "%s · Mvaak",
  },
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: { url: "/brand/apple-touch-icon.png", sizes: "180x180" },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    title: "Mvaak — Real-world demonstrations. Training-ready data.",
    description: site.description,
    images: [shareImage],
  },
  twitter: { card: "summary_large_image", images: [shareImage] },
  robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#151a21",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <AnalyticsScripts />
        <JsonLd data={siteGraph()} />
      </body>
    </html>
  );
}
