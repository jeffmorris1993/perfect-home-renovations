import Link from "next/link";
import { processSteps, site } from "@/lib/site";
import {
  categoryLabel,
  srcFor,
  srcSetFor,
  type PortfolioPhoto,
} from "@/lib/portfolio";
import { Reveal } from "@/components/ui/reveal";

/** Plain <img> from the pre-generated portfolio derivatives. */
export function Photo({
  photo,
  sizes,
  alt,
  eager = false,
  style,
}: {
  photo: PortfolioPhoto;
  sizes: string;
  alt?: string;
  eager?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <img
      src={srcFor(photo, 960)}
      srcSet={srcSetFor(photo)}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={alt ?? `${categoryLabel(photo.category)} renovation in Metro Detroit`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      style={{ background: photo.color, ...style }}
    />
  );
}

export function IxRail({ num, label }: { num: string; label: string }) {
  return (
    <div className="ix-rail">
      <span className="ix-num">{num}</span>
      <span className="ix-label">{label}</span>
    </div>
  );
}

export function ProcessSection({ num, tight }: { num: string; tight?: boolean }) {
  return (
    <section className={tight ? "section tight bg-ink" : "section bg-ink"}>
      <div className="container">
        <div className="ix">
          <IxRail num={num} label="A simple way to get started" />
          <Reveal>
            <h2 className="h1">A straightforward way to renovate.</h2>
          </Reveal>
        </div>
        <div className="cells cols-4 mt-l">
          {processSteps.map((s) => (
            <Reveal key={s.num} className="cell">
              <span className="cell-num">{s.num}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCta({
  eyebrow = "Start your project",
  title = (
    <>
      Let&apos;s build
      <br />
      something right.
    </>
  ),
  lead,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  lead: string;
}) {
  return (
    <section className="section bg-ink final-cta">
      <div className="container">
        <div className="eyebrow on-dark">{eyebrow}</div>
        <h2 className="display final-h">{title}</h2>
        <p className="lead mt-m">{lead}</p>
        <div className="btn-row mt-l">
          <Link className="btn btn-brass lg" href="/estimate">
            Request a Free Estimate <span className="arr">→</span>
          </Link>
          <a className="btn btn-outline-light lg" href={site.phoneHref}>
            Call {site.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
