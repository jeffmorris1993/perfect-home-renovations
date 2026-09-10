import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Brand } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { Faq } from "@/components/home/faq";
import { FinalCta, Photo, ProcessSection } from "@/components/sections/shared";
import { site } from "@/lib/site";
import { categoryLabel, pick } from "@/lib/portfolio";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  getService,
  jsonLd,
  seoCities,
  seoServices,
  serviceJsonLd,
} from "@/lib/seo";

export function generateStaticParams() {
  return seoServices.map((s) => ({ service: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/services/[service]">): Promise<Metadata> {
  const { service } = await params;
  const svc = getService(service);
  if (!svc) return {};
  return {
    title: `${svc.name} in Metro Detroit`,
    description: svc.metaDescription,
  };
}

const mediaSizes = "(min-width: 900px) 420px, 92vw";

export default async function ServicePage({
  params,
}: PageProps<"/services/[service]">) {
  const { service } = await params;
  const svc = getService(service);
  if (!svc) notFound();

  const photos = [0, 1, 2].map((n) => pick(svc.photoCategory, n));

  return (
    <>
      <Header brand={<Brand />} />

      <section className="page-hero bg-paper">
        <div className="container">
          <nav className="crumb">
            <Link href="/">Home</Link> <span>/</span>{" "}
            <Link href="/services">Services</Link> <span>/</span>{" "}
            <span>{svc.name}</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <div className="eyebrow">{svc.name}</div>
              <h1 className="display" style={{ marginTop: 20 }}>
                {svc.name} in Metro Detroit.
              </h1>
            </div>
            <div>
              <p className="lead">{svc.intro[0]}</p>
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
            <Reveal>
              <article className="sd">
                <div className="sd-rail">
                  <span className="ix-num">01</span>
                </div>
                <div className="sd-body">
                  <h2 className="h2">Done right, behind the walls first.</h2>
                  {svc.intro.slice(1).map((p) => (
                    <p className="lead mt-s" key={p.slice(0, 24)}>
                      {p}
                    </p>
                  ))}
                  <ul className="sd-list">
                    {svc.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <div className="btn-row">
                    <Link className="link-arrow" href="/estimate">
                      {svc.cta} →
                    </Link>
                    {svc.galleryFilter ? (
                      <Link
                        className="link-arrow"
                        href={`/gallery?f=${svc.galleryFilter}`}
                      >
                        See {categoryLabel(svc.galleryFilter)} photos →
                      </Link>
                    ) : null}
                  </div>
                </div>
                <div className="sd-media">
                  <Photo
                    photo={photos[0]}
                    sizes={mediaSizes}
                    alt={`${svc.name}, completed Metro Detroit project`}
                    eager
                  />
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {svc.cityCopy ? (
        <section className="section tight bg-paper">
          <div className="container">
            <div className="eyebrow">Where we work</div>
            <h2 className="h1 mt-s">
              {svc.name} across Metro Detroit.
            </h2>
            <p className="lead mt-m">
              We serve homeowners throughout the Metro Detroit area. See what a{" "}
              {svc.phrase} looks like where you live:
            </p>
            <div className="btn-row mt-l" style={{ flexWrap: "wrap" }}>
              {seoCities
                .filter((c) => svc.cityCopy?.[c.slug])
                .map((c) => (
                  <Link
                    key={c.slug}
                    className="link-arrow"
                    href={`/services/${svc.slug}/${c.slug}`}
                  >
                    {c.name} →
                  </Link>
                ))}
            </div>
          </div>
        </section>
      ) : null}

      <ProcessSection num="02" tight />

      <section className="section bg-white">
        <div className="container">
          <div className="eyebrow">Common questions</div>
          <h2 className="h1 mt-s">
            {svc.name}, answered straight.
          </h2>
          <Faq items={svc.faqs} />
        </div>
      </section>

      <FinalCta
        lead={`Tell us about your ${svc.phrase}. We'll take a look in person and give you a free, no-obligation estimate. Or call ${site.phoneDisplay}.`}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(serviceJsonLd(svc)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(faqJsonLd(svc.faqs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: svc.name, path: `/services/${svc.slug}` },
            ]),
          ),
        }}
      />
    </>
  );
}
