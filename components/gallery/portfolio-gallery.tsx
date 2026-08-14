"use client";

import { useEffect, useRef, useState } from "react";
import { Lightbox, type LightboxItem } from "./lightbox";

// Client shell around the server-rendered category sections. Filtering only
// toggles `hidden` on section wrappers, so the 430 <img> nodes are rendered
// exactly once. Clicking any gallery image opens the lightbox over the
// currently visible photos, read straight from the DOM.
export function PortfolioGallery({
  categories,
  counts,
  sections,
}: {
  categories: { key: string; label: string }[];
  counts: Record<string, number>;
  sections: React.ReactNode[];
}) {
  const [filter, setFilter] = useState<string>("all");
  const [lightbox, setLightbox] = useState<{
    items: LightboxItem[];
    index: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Deep links: /portfolio#bathrooms pre-selects a category.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && categories.some((c) => c.key === hash)) setFilter(hash);
  }, [categories]);

  const openLightbox = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const img = target.closest<HTMLElement>(".gallery-item")?.querySelector("img");
    if (!img || !rootRef.current) return;
    const visible = Array.from(
      rootRef.current.querySelectorAll<HTMLImageElement>(
        "div:not([hidden]) .gallery-item img",
      ),
    );
    const index = visible.indexOf(img);
    if (index === -1) return;
    setLightbox({
      items: visible.map((el) => ({
        src: el.currentSrc || el.src,
        srcSet: el.getAttribute("srcset") ?? "",
        alt: el.alt,
        width: Number(el.getAttribute("width")) || 1600,
        height: Number(el.getAttribute("height")) || 1200,
        caption: el.dataset.caption ?? "",
      })),
      index,
    });
  };

  return (
    <>
      <div className="container">
        <div
          className="filter-bar mt-m"
          role="group"
          aria-label="Filter projects"
        >
          <button
            className={filter === "all" ? "filter-btn active" : "filter-btn"}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.key}
              className={filter === c.key ? "filter-btn active" : "filter-btn"}
              onClick={() => setFilter(c.key)}
            >
              {c.label} ({counts[c.key]})
            </button>
          ))}
        </div>
      </div>
      <div ref={rootRef} onClick={openLightbox}>
        {categories.map((c, i) => (
          <div key={c.key} hidden={filter !== "all" && filter !== c.key}>
            {sections[i]}
          </div>
        ))}
      </div>
      {lightbox ? (
        <Lightbox
          items={lightbox.items}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onNavigate={(index) => setLightbox({ ...lightbox, index })}
        />
      ) : null}
    </>
  );
}
