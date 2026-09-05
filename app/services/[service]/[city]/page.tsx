import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Brand } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { FinalCta, Photo } from "@/components/sections/shared";
import { site } from "@/lib/site";
import { categoryLabel, pick } from "@/lib/portfolio";
import {
  breadcrumbJsonLd,
  cityPageServices,
  getCity,
  getService,
  jsonLd,
  seoCities,
  serviceJsonLd,
} from "@/lib/seo";

export function generateStaticParams() {
  return cityPageServices.flatMap((s) =>
    seoCities.map((c) => ({ service: s.slug, city: c.slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/services/[service]/[city]">): Promise<Metadata> {
  const { service, city } = await params;
  const svc = getService(service);
  const town = getCity(city);
  const copy = svc?.cityCopy?.[city];
  if (!svc || !town || !copy) return {};
  return {
    title: `${svc.name} in ${town.name}, MI`,
    description: `${copy.lead} Licensed and insured, free on-site estimates. Call ${site.phoneDisplay}.`,
  };
}

const mediaSizes = "(min-width: 900px) 420px, 92vw";

export default async function ServiceCityPage({
  params,
}: PageProps<"/services/[service]/[city]">) {
  const { service, city } = await params;
  const svc = getService(service);
  const town = getCity(city);
  const copy = svc?.cityCopy?.[city];
  if (!svc || !town || !copy) notFound();

  // Each city shows a different slice of the service's photo set.
  const cityIndex = seoCities.findIndex((c) => c.slug === town.slug);
  const photo = pick(svc.photoCategory, cityIndex * 3 + 2);

  const otherCities = seoCities.filter((c) => c.slug !== town.slug);
  const otherServices = cityPageServices.filter((s) => s.slug !== svc.slug);

  return (
    <>
      <Header brand={<Brand />} />

      <section className="page-hero bg-paper">
        <div className="container">
          <nav className="crumb">
            <Link href="/">Home</Link> <span>/</span>{" "}
            <Link href="/services">Services</Link> <span>/</span>{" "}
            <Link href={`/services/${svc.slug}`}>{svc.name}</Link>{" "}
            <span>/</span> <span>{town.name}</span>
          </nav>
          <div className="page-hero-grid">
            <div>
              <div className="eyebrow">
                {town.name} · {town.county}
              </div>
              <h1 className="display" style={{ marginTop: 20 }}>
                {svc.name} in {town.name}, MI.
              </h1>
            </div>
            <div>
              <p className="lead">{copy.lead}</p>
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
                  <h2 className="h2">
                    How we approach {town.name} projects.
                  </h2>
                  {copy.body.map((p) => (
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
                    photo={photo}
                    sizes={mediaSizes}
                    alt={`${svc.name}, completed Metro Detroit project`}
                  />
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section tight bg-paper">
        <div className="container">
          <h2 className="h2">More in {town.name}</h2>
          <div className="btn-row mt-m" style={{ flexWrap: "wrap" }}>
            {otherServices.map((s) => (
              <Link
                key={s.slug}
                className="link-arrow"
                href={`/services/${s.slug}/${town.slug}`}
              >
                {s.name} in {town.name} →
              </Link>
            ))}
          </div>
          <h2 className="h2 mt-l">{svc.name} nearby</h2>
          <div className="btn-row mt-m" style={{ flexWrap: "wrap" }}>
            {otherCities.map((c) => (
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

      <FinalCta
        lead={`Planning a ${svc.phrase} in ${town.name}? We'll come take a look and give you a free, no-obligation estimate. Or call ${site.phoneDisplay}.`}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(serviceJsonLd(svc, town)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: svc.name, path: `/services/${svc.slug}` },
              { name: town.name, path: `/services/${svc.slug}/${town.slug}` },
            ]),
          ),
        }}
      />
    </>
  );
}
