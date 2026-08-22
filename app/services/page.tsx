import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Brand } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import {
  FinalCta,
  Photo,
  ProcessSection,
} from "@/components/sections/shared";
import { services, site } from "@/lib/site";
import { categoryLabel, pick, type PortfolioCategory } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Bathroom and kitchen remodeling, basement finishing, full home renovations, flooring and tile, roofing, and custom homes across Metro Detroit.",
};

const mediaSizes = "(min-width: 900px) 340px, 92vw";

export default function ServicesPage() {
  return (
    <>
      <Header brand={<Brand />} />

      <section className="page-hero bg-paper">
        <div className="container">
          <nav className="crumb">
            <Link href="/">Home</Link> <span>/</span> <span>Services</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <div className="eyebrow">What we do</div>
              <h1 className="display" style={{ marginTop: 20 }}>
                Everything from one accountable team.
              </h1>
            </div>
            <div>
              <p className="lead">
                Renovations, remodels, roofing, and ground-up custom homes. One
                point of contact, one standard of craft, across your whole
                home.
              </p>
              <div className="btn-row mt-m">
                <Link className="btn" href="/estimate">
                  Request a Free Estimate <span className="arr">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="svc-detail">
            {services.map((s) => {
              const filter =
                "galleryFilter" in s
                  ? (s.galleryFilter as PortfolioCategory)
                  : null;
              const photo = (
                <Photo
                  photo={pick(
                    s.photoCategory as PortfolioCategory,
                    s.photoNum - 1,
                  )}
                  sizes={mediaSizes}
                  alt={filter ? "" : `${s.name} — completed Metro Detroit project`}
                />
              );
              return (
                <Reveal key={s.num}>
                  <article className="sd">
                    <div className="sd-rail">
                      <span className="ix-num">{s.num}</span>
                      {"tag" in s && s.tag ? (
                        <span className={"tagBrass" in s && s.tagBrass ? "tag brass" : "tag"}>
                          {s.tag}
                        </span>
                      ) : null}
                    </div>
                    <div className="sd-body">
                      <h2 className="h2">{s.name}</h2>
                      <p className="lead mt-s">{s.detail}</p>
                      <ul className="sd-list">
                        {s.bullets.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                      <div className="btn-row">
                        <Link className="link-arrow" href="/estimate">
                          {s.cta} →
                        </Link>
                        {filter ? (
                          <Link
                            className="link-arrow"
                            href={`/gallery?f=${filter}`}
                          >
                            See {categoryLabel(filter)} photos →
                          </Link>
                        ) : null}
                      </div>
                    </div>
                    {filter ? (
                      <Link
                        className="sd-media"
                        href={`/gallery?f=${filter}`}
                        aria-label={`See ${categoryLabel(filter)} photos in the gallery`}
                      >
                        {photo}
                      </Link>
                    ) : (
                      <div className="sd-media">{photo}</div>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <ProcessSection num="08" tight />

      <section className="section bg-paper">
        <div className="container">
          <h2 className="display">Not sure where to start?</h2>
          <p className="lead mt-m">
            Tell us about your home. We&apos;ll point you to the right service,
            plus a free estimate.
          </p>
          <div className="btn-row mt-l">
            <Link className="btn lg" href="/estimate">
              Request a Free Estimate <span className="arr">→</span>
            </Link>
            <a className="btn btn-ghost lg" href={site.phoneHref}>
              Call {site.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
