"use client";

import { useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/ui/reveal";

export type ReviewCard = {
  key: string;
  stars: string;
  starsLabel?: string;
  quote: string;
  name: string;
  meta: string;
};

// Uniform card grid: long quotes are line-clamped by CSS and the full review
// opens in a native <dialog> (same pattern as the gallery lightbox — focus
// trap + Escape for free).
export function ReviewCards({ cards }: { cards: ReviewCard[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = openIndex !== null ? cards[openIndex] : null;

  useEffect(() => {
    const d = dialogRef.current;
    if (!open || !d) return;
    if (!d.open) d.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="grid cols-3 trio mt-l" style={{ "--g": "20px" } as React.CSSProperties}>
        {cards.map((c, i) => (
          <Reveal key={c.key} className="quote-cell">
            <figure
              className="quote quote-card"
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-label={`Read full review by ${c.name}`}
              onClick={() => setOpenIndex(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpenIndex(i);
                }
              }}
            >
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
      {open && (
        <dialog
          ref={dialogRef}
          className="review-modal"
          onClose={() => setOpenIndex(null)}
          onClick={(e) => {
            if (e.target === dialogRef.current) dialogRef.current.close();
          }}
        >
          <figure className="quote review-modal-quote">
            <div className="quote-stars" aria-label={open.starsLabel}>
              {open.stars}
            </div>
            <blockquote>{open.quote}</blockquote>
            <figcaption>
              <strong>{open.name}</strong>
              <span className="mono">{open.meta}</span>
            </figcaption>
          </figure>
          <button
            className="review-modal-close"
            aria-label="Close"
            onClick={() => dialogRef.current?.close()}
          >
            ✕
          </button>
        </dialog>
      )}
    </>
  );
}
