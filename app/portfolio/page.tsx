import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Brand } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { FinalCta, IxRail, Photo } from "@/components/sections/shared";
import { PortfolioGallery } from "@/components/gallery/portfolio-gallery";
import {
  byCategory,
  categories,
  categoryLabel,
  pick,
  photos,
  srcFor,
  srcSetFor,
  type PortfolioPhoto,
} from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Hundreds of completed kitchen, bathroom, basement, stair, fireplace, and exterior renovation photos from Metro Detroit projects.",
};

// 3-col grid at desktop: (1180 - 2*22) / 3 ≈ 379px rendered width.
const gridSizes = "(min-width: 1000px) 379px, (min-width: 560px) 50vw, 96vw";

function GalleryImage({
  photo,
  eager,
  position,
  total,
}: {
  photo: PortfolioPhoto;
  eager: boolean;
  position: number;
  total: number;
}) {
  const label = categoryLabel(photo.category);
  return (
    <figure className="gallery-item">
      <img
        src={srcFor(photo, 480)}
        srcSet={srcSetFor(photo)}
        sizes={gridSizes}
        width={photo.width}
        height={photo.height}
        alt={`${label} renovation in Metro Detroit — completed project photo`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        data-caption={`${label} — ${position} / ${total}`}
        style={{ background: photo.color }}
      />
    </figure>
  );
}

function GallerySection({
  categoryKey,
  index,
}: {
  categoryKey: PortfolioPhoto["category"];
  index: number;
}) {
  const list = byCategory(categoryKey);
  return (
    <section className="gallery-section section tight" id={categoryKey}>
      <div className="container">
        <div className="ix">
          <IxRail
            num={String(index + 2).padStart(2, "0")}
            label={`${list.length} photos`}
          />
          <h2 className="h1">{categoryLabel(categoryKey)}</h2>
        </div>
        <div className="gallery-grid">
          {list.map((p, i) => (
            <GalleryImage
              key={p.id}
              photo={p}
              eager={index === 0 && i < 6}
              position={i + 1}
              total={list.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PortfolioPage() {
  const counts = Object.fromEntries(
    categories.map((c) => [c.key, byCategory(c.key).length]),
  );

  return (
    <>
      <Header brand={<Brand />} />

      <section className="page-hero bg-paper">
        <div className="container">
          <nav className="crumb">
            <Link href="/">Home</Link> <span>/</span> <span>Portfolio</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <div className="eyebrow">Selected work</div>
              <h1 className="display" style={{ marginTop: 20 }}>
                The work speaks first.
              </h1>
            </div>
            <div>
              <p className="lead">
                Kitchens, baths, basements, and whole-home renovations across
                Metro Detroit — {photos.length} completed-project photos,
                straight from our job sites. Every project below was built by
                our own team.
              </p>
              <div className="btn-row mt-m">
                <Link className="btn" href="/estimate">
                  Start Your Project <span className="arr">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="section tight bg-white">
        <div className="container">
          <div className="ix">
            <IxRail num="01" label="Recent work" />
            <Reveal>
              <h2 className="h1">Recent work, in detail.</h2>
              <p className="lead mt-m">
                A closer look at recently completed Metro Detroit work —
                reworked kitchens and baths, finished lower levels, rebuilt
                stairs and exteriors.
              </p>
            </Reveal>
          </div>
          <Reveal className="pf-hero">
            <figure>
              <Photo
                photo={pick("kitchens", 1)}
                sizes="(min-width: 1180px) 1080px, 96vw"
                alt="Completed kitchen renovation in Metro Detroit"
                eager
              />
              <figcaption>
                <span className="fw-cap">Recent completed work</span>
                <span className="fw-sub">Metro Detroit, MI</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ALL PHOTOS */}
      <section className="section tight bg-paper">
        <div className="container">
          <div className="ix">
            <IxRail num="02" label={`${photos.length} project photos`} />
            <div>
              <h2 className="h1">Every project. Every photo.</h2>
              <p className="lead mt-s">
                Browse the full archive by room. Tap any photo to view it
                full-screen.
              </p>
            </div>
          </div>
        </div>
        <PortfolioGallery
          categories={categories.map(({ key, label }) => ({ key, label }))}
          counts={counts}
          sections={categories.map((c, i) => (
            <GallerySection key={c.key} categoryKey={c.key} index={i} />
          ))}
        />
      </section>

      <FinalCta
        eyebrow="Your project next"
        lead="Free estimate. Honest timeline. Tell us what you're picturing and we'll walk your space."
      />
    </>
  );
}
