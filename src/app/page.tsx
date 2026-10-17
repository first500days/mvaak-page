import { Hero } from "@/components/home/hero";
import { SolutionsOverview } from "@/components/home/solutions-overview";
import { EgocentricHighlight } from "@/components/home/egocentric-highlight";
import { AwardsRecognition } from "@/components/home/awards-recognition";
import { PartnershipPreview } from "@/components/home/partnership-preview";
import { ContactCta } from "@/components/shared/contact-cta";
import { BackedBy } from "@/components/shared/backed-by";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Mvaak — AI Training Data & Egocentric Video Collection",
  absoluteTitle: true,
  description:
    "Mvaak collects, annotates and quality-checks real-world data for AI teams: egocentric video for robotics and Physical AI, plus audio, video and text annotation.",
  path: "/",
});

/*
 * Homepage — the essentials, with detail one click away via the header menus:
 * hero → institutional backing → solutions → egocentric data → awards & recognitions
 * (video + award photos) → partnerships → contact. The pipeline, data example and
 * quality detail live on /solutions/physical-ai; engagement models on /services.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <section aria-label="Institutional support" className="border-b border-line bg-surface">
        <div className="container-page py-10">
          <BackedBy />
        </div>
      </section>
      <SolutionsOverview />
      <EgocentricHighlight />
      <AwardsRecognition />
      <PartnershipPreview />
      <ContactCta />
    </>
  );
}
