import { TextLink } from "@/components/ui/button";
import { ArticleCard } from "@/components/shared/article-card";
import { articleBySlug, type Article } from "@/content/articles";

/**
 * Topic-matched articles for service and solution pages. Links each service to the
 * existing writing on the same subject (internal linking), using real article slugs only.
 */
export const relatedBySection: Record<string, string[]> = {
  "/services": ["how-to-scope-a-first-dataset", "what-makes-training-data-usable", "annotation-guidelines-are-the-real-deliverable"],
  "/services/egocentric-video-data": ["why-first-person-video-is-different", "how-to-scope-a-first-dataset", "what-makes-training-data-usable"],
  "/services/audio-annotated-data": ["transcription-conventions-decide-the-ceiling", "inter-annotator-agreement-what-it-tells-you", "annotation-guidelines-are-the-real-deliverable"],
  "/services/video-annotated-data": ["the-occlusion-problem-in-video-annotation", "annotation-guidelines-are-the-real-deliverable", "inter-annotator-agreement-what-it-tells-you"],
  "/services/text-annotated-data": ["when-annotators-disagree-the-schema-is-wrong", "inter-annotator-agreement-what-it-tells-you", "synthetic-data-is-a-complement"],
  "/solutions/physical-ai": ["why-first-person-video-is-different", "synthetic-data-is-a-complement", "what-makes-training-data-usable"],
};

export function RelatedReading({ path, title = "Related reading" }: { path: string; title?: string }) {
  const items = (relatedBySection[path] ?? []).map(articleBySlug).filter((a): a is Article => !!a);
  if (!items.length) return null;
  const id = `related-${path.replace(/\W+/g, "-")}`;
  return (
    <section aria-labelledby={id} className="border-t border-line bg-surface">
      <div className="container-page py-16 lg:py-20">
        <div className="flex items-end justify-between gap-6">
          <h2 id={id} className="text-h3 font-semibold text-ink">
            {title}
          </h2>
          <TextLink href="/blog" trackAs={`related_all_articles${path.replace(/\W+/g, "_")}`}>
            All articles
          </TextLink>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
