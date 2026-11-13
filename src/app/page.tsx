import { Hero } from "@/components/home/hero";
import { CaptureWorkspace } from "@/components/home/capture-workspace";
import {
  CapabilitiesSection,
  CaptureMethods,
  EnvironmentsGrid,
  HomeFaq,
  RegionsSection,
  SampleGallery,
  ServicesGrid,
  StatsStrip,
} from "@/components/home/home-sections";
import { AwardsRecognition } from "@/components/home/awards-recognition";
import { PartnershipPreview } from "@/components/home/partnership-preview";
import { ContactCta } from "@/components/shared/contact-cta";
import { BackedByMarquee } from "@/components/shared/backed-by";
import { Section, SectionHeader } from "@/components/ui/section";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Mvaak — AI Training Data & Egocentric Video Collection",
  absoluteTitle: true,
  description:
    "Mvaak collects, annotates and quality-checks real-world data for AI teams: egocentric video for robotics and Physical AI, plus audio, video and text annotation.",
  path: "/",
});

/*
 * Homepage journey — what we collect → proof → how → where → services → coverage → depth → trust → FAQ → contact.
 * All copy and figures come from src/content/home.ts (see the source notes there).
 */
export default function HomePage() {
  return (
    <>
      <CaptureWorkspace />
      <Hero />
      <StatsStrip />
      <SampleGallery />
      <CaptureMethods />
      <EnvironmentsGrid />
      <ServicesGrid />
      <RegionsSection />
      <CapabilitiesSection />
      <Section id="backed-by" tone="canvas" bordered labelledBy="backed-by-title">
        <SectionHeader id="backed-by-title" eyebrow="Institutional support" title="We are backed by" align="center" className="mx-auto" />
        <BackedByMarquee className="mt-10" />
      </Section>
      <AwardsRecognition />
      <PartnershipPreview />
      <HomeFaq />
      <ContactCta
        title="Tell us what your robot needs to learn."
        body="AI labs, robotics companies and research teams: describe the task and where it happens — we’ll help shape the dataset to train on."
        cta="Discuss Your Project"
        trackAs="home_final_cta"
      />
    </>
  );
}
