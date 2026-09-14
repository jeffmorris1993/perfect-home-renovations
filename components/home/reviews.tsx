import { IxRail } from "@/components/sections/shared";
import { Reveal } from "@/components/ui/reveal";
import { getGoogleReviews } from "@/lib/reviews";
import { testimonials } from "@/lib/site";

const GRID_SIZE = 3;

type Card = {
  key: string;
  stars: string;
  starsLabel?: string;
  quote: string;
  name: string;
  meta: string;
};

export async function ReviewsSection() {
  const data = await getGoogleReviews();

  // Google reviews lead; hardcoded testimonials fill the remaining cards.
  // The hardcoded set is copied from the same Google reviews, so drop any
  // whose author the API already returned.
  const fetchedAuthors = new Set(data?.reviews.map((r) => r.author) ?? []);
  const cards: Card[] = [
    ...(data?.reviews ?? []).map((r) => ({
      key: r.publishTime,
      stars: "★".repeat(r.rating),
      starsLabel: `${r.rating} out of 5 stars`,
      quote: `“${r.text}”`,
      name: r.author,
      meta: `Google review · ${r.relativeTime}`,
    })),
    ...testimonials
      .filter((t) => !fetchedAuthors.has(t.name))
      .map((t) => ({
        key: t.name,
        stars: "★★★★★",
        quote: t.quote,
        name: t.name,
        meta: t.meta,
      })),
  ].slice(0, GRID_SIZE);

  return (
    <section className="section bg-paper">
      <div className="container">
        <div className="ix">
          <IxRail num="07" label="In their words" />
          <Reveal>
            <h2 className="h1">Homeowners who&apos;d hire us again.</h2>
            {data && (
              <p className="reviews-badge mono">
                {data.rating.toFixed(1)} ★ on Google · {data.count}{" "}
                {data.count === 1 ? "review" : "reviews"}
              </p>
            )}
          </Reveal>
        </div>
        <div className="grid cols-3 trio mt-l" style={{ "--g": "20px" } as React.CSSProperties}>
          {cards.map((c) => (
            <Reveal key={c.key}>
              <figure className="quote">
                <div className="quote-stars" aria-label={c.starsLabel}>
                  {c.stars}
                </div>
                <blockquote>{c.quote}</blockquote>
                <figcaption>
                  <strong>{c.name}</strong>
                  <span className="mono">{c.meta}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        {data && (
          <p className="reviews-attribution mono mt-m">
            Reviews from Google ·{" "}
            <a href={data.mapsUri} target="_blank" rel="noopener noreferrer">
              See all on our Google profile →
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
