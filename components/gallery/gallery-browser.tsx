"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Lightbox, type LightboxItem } from "./lightbox";
import { BeforeAfter } from "./before-after";
import {
  baPairs,
  categoryLabel,
  srcFor,
  srcSetFor,
  type PortfolioCategory,
  type PortfolioPhoto,
} from "@/lib/portfolio";

const PER_PAGE = 48;
const PER_PAGE_BA = 8;
const BA_KEY = "ba";

// 4-col grid at desktop: container 1180 - gutters ≈ 1068 usable → ~260px cells.
const tileSizes = "(min-width: 1000px) 262px, (min-width: 660px) 33vw, 50vw";

type Filter = PortfolioCategory | "all" | typeof BA_KEY;

function GalleryBrowserInner({
  photos,
  categories,
}: {
  photos: PortfolioPhoto[];
  categories: { key: PortfolioCategory; label: string }[];
}) {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<Filter>(() => {
    const f = searchParams.get("f");
    if (f === BA_KEY) return BA_KEY;
    return categories.some((c) => c.key === f) ? (f as PortfolioCategory) : "all";
  });
  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const isBA = filter === BA_KEY;
  const per = isBA ? PER_PAGE_BA : PER_PAGE;

  const pool = useMemo(
    () =>
      isBA || filter === "all"
        ? photos
        : photos.filter((p) => p.category === filter),
    [photos, filter, isBA],
  );
  const count = isBA ? baPairs.length : pool.length;
  const pageCount = Math.max(1, Math.ceil(count / per));
  const start = (page - 1) * per;

  const scrollToBar = () => {
    const el = barRef.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const apply = (f: Filter) => {
    setFilter(f);
    setPage(1);
  };

  const go = (p: number) => {
    if (p < 1 || p > pageCount) return;
    setPage(p);
    scrollToBar();
  };

  // Page numbers: 1 … around-current … last, with ellipses.
  const pageList = useMemo(() => {
    const list = new Set<number>([1, pageCount]);
    for (let k = page - 1; k <= page + 1; k++) {
      if (k > 0 && k <= pageCount) list.add(k);
    }
    return [...list].sort((a, b) => a - b);
  }, [page, pageCount]);

  const lightboxItems: LightboxItem[] = useMemo(
    () =>
      pool.map((p, i) => ({
        src: srcFor(p, 960),
        srcSet: srcSetFor(p),
        alt: `${categoryLabel(p.category)} renovation in Metro Detroit`,
        width: p.width,
        height: p.height,
        caption: `${categoryLabel(p.category)} — ${i + 1} / ${pool.length}`,
      })),
    [pool],
  );

  const baCaption = (n: number) => `Project ${String(n).padStart(2, "0")}`;

  return (
    <>
      <div ref={barRef} className="gal-bar">
        <div className="filter-bar" role="group" aria-label="Filter photos">
          <button
            className={filter === "all" ? "filter-btn active" : "filter-btn"}
            onClick={() => apply("all")}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.key}
              className={filter === c.key ? "filter-btn active" : "filter-btn"}
              onClick={() => apply(c.key)}
            >
              {c.label}
            </button>
          ))}
          <button
            className={isBA ? "filter-btn active" : "filter-btn"}
            onClick={() => apply(BA_KEY)}
          >
            Before &amp; After
          </button>
        </div>
        <span className="gal-count">
          {count} {isBA ? (count === 1 ? "pair" : "pairs") : count === 1 ? "photo" : "photos"}
        </span>
      </div>

      {isBA ? (
        <div className="ba-grid">
          {baPairs.slice(start, start + per).map((pair) => (
            <BeforeAfter
              key={pair.pair}
              pair={pair}
              caption={baCaption(pair.pair)}
              sizes="(min-width: 760px) 46vw, 92vw"
            />
          ))}
        </div>
      ) : (
        <div className="gal-grid">
          {pool.slice(start, start + per).map((p, i) => (
            <button
              key={p.id}
              type="button"
              className="gt"
              aria-label={`View ${categoryLabel(p.category)} photo full size`}
              onClick={() => setLightbox(start + i)}
            >
              <img
                src={srcFor(p, 480)}
                srcSet={srcSetFor(p)}
                sizes={tileSizes}
                width={p.width}
                height={p.height}
                alt={`${categoryLabel(p.category)} renovation in Metro Detroit`}
                loading={page === 1 && i < 8 ? "eager" : "lazy"}
                decoding="async"
                style={{ background: p.color }}
              />
              <span className="gt-id">{categoryLabel(p.category)}</span>
            </button>
          ))}
        </div>
      )}

      {pageCount > 1 ? (
        <>
          <nav className="gal-pager" aria-label="Gallery pages">
            <button
              type="button"
              disabled={page === 1}
              aria-label="Previous page"
              onClick={() => go(page - 1)}
            >
              ←
            </button>
            {pageList.map((v, i) => (
              <span key={v} style={{ display: "contents" }}>
                {i > 0 && v - pageList[i - 1] > 1 ? (
                  <span className="dots">…</span>
                ) : null}
                <button
                  type="button"
                  className={v === page ? "on" : undefined}
                  aria-current={v === page ? "page" : undefined}
                  onClick={() => go(v)}
                >
                  {v}
                </button>
              </span>
            ))}
            <button
              type="button"
              disabled={page === pageCount}
              aria-label="Next page"
              onClick={() => go(page + 1)}
            >
              →
            </button>
          </nav>
          <p className="gal-page-note">
            Showing {start + 1} to {Math.min(start + per, count)} of {count}
          </p>
        </>
      ) : null}

      {lightbox !== null ? (
        <Lightbox
          items={lightboxItems}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNavigate={setLightbox}
        />
      ) : null}
    </>
  );
}

export function GalleryBrowser(props: {
  photos: PortfolioPhoto[];
  categories: { key: PortfolioCategory; label: string }[];
}) {
  // useSearchParams needs a Suspense boundary for static prerendering.
  return (
    <Suspense fallback={null}>
      <GalleryBrowserInner {...props} />
    </Suspense>
  );
}
