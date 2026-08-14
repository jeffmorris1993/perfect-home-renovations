import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Brand } from "@/components/ui/logo";
import { GalleryBrowser } from "@/components/gallery/gallery-browser";
import { categories, photos } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Completed renovation photography from Perfect Home Renovation: kitchens, bathrooms, basements, stairs, fireplaces, and exteriors across Metro Detroit.",
};

export default function GalleryPage() {
  return (
    <>
      <Header brand={<Brand />} />

      <section className="page-hero bg-paper">
        <div className="container">
          <nav className="crumb">
            <Link href="/">Home</Link> <span>/</span> <span>Gallery</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <div className="eyebrow">Completed work</div>
              <h1 className="display mt-s">The gallery.</h1>
            </div>
            <p className="lead">
              Every finished space we have photographed. Filter by room or jump
              to the before and after pairs, then tap any photo to see it full
              size.
            </p>
          </div>
        </div>
      </section>

      <section className="section tight bg-paper" style={{ paddingTop: 0 }}>
        <div className="container">
          <GalleryBrowser
            photos={photos}
            categories={categories.map(({ key, label }) => ({ key, label }))}
          />
        </div>
      </section>

      <section className="section bg-ink">
        <div className="container">
          <div className="eyebrow on-dark">Your project next</div>
          <h2 className="display mt-s">
            Let&apos;s talk about
            <br />
            your space.
          </h2>
          <div className="btn-row mt-l">
            <Link className="btn btn-light" href="/estimate">
              Get a Free Estimate <span className="arr">&rarr;</span>
            </Link>
            <Link className="btn btn-outline-light" href="/portfolio">
              See featured projects <span className="arr">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
