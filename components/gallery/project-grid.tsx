"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useEagerNear } from "./use-eager-near";
import {
  categoryLabel,
  srcFor,
  srcSetFor,
  type PortfolioPhoto,
} from "@/lib/portfolio";

export interface Project {
  cat: "kitchen" | "bath" | "basement" | "full";
  tag: string;
  title: string;
  loc: string;
  photo: PortfolioPhoto;
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "kitchen", label: "Kitchens" },
  { key: "bath", label: "Bathrooms" },
  { key: "basement", label: "Basements" },
  { key: "full", label: "Full Renovations" },
] as const;

const cardSizes = "(min-width: 900px) 373px, (min-width: 620px) 50vw, 92vw";

// Curated project cards with the design's show/hide filter bar.
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>("all");
  const gridRef = useRef<HTMLDivElement>(null);
  const visible = projects.filter(
    (p) => filter === "all" || p.cat === filter,
  );

  useEagerNear(gridRef, [filter]);

  return (
    <>
      <div className="filter-bar mt-m" role="group" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={filter === f.key ? "filter-btn active" : "filter-btn"}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div
        ref={gridRef}
        className="grid cols-3 proj-grid mt-l"
        style={{ "--g": "22px" } as React.CSSProperties}
      >
        {visible.map((p) => (
          <Link key={p.title} className="proj" href="/gallery">
            <div className="proj-img">
              <img
                src={srcFor(p.photo, 480)}
                srcSet={srcSetFor(p.photo)}
                sizes={cardSizes}
                width={p.photo.width}
                height={p.photo.height}
                alt={`${p.title} — ${categoryLabel(p.photo.category)} project in ${p.loc}`}
                loading="lazy"
                decoding="async"
                style={{ background: p.photo.color }}
              />
            </div>
            <div className="proj-meta">
              <span className="tag">{p.tag}</span>
              <h3 className="proj-title">{p.title}</h3>
              <span className="proj-loc">{p.loc}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
