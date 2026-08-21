import { Fragment } from "react";
import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { Faq } from "@/components/home/faq";
import { Brand } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { BeforeAfter } from "@/components/gallery/before-after";
import {
  FinalCta,
  IxRail,
  ProcessSection,
} from "@/components/sections/shared";
import {
  areas,
  marqueeItems,
  services,
  site,
  testimonials,
  whyUs,
} from "@/lib/site";
import { baPairs } from "@/lib/portfolio";

// Featured pairs — deliberately different from the portfolio page's picks
// so the two pages don't repeat each other.
const featuredPairs = [
  { pair: baPairs[4], caption: "Kitchen · Down to drywall and back" },
  { pair: baPairs[5], caption: "Staircase · Taken back to the studs" },
  { pair: baPairs[21], caption: "Bathroom · Gutted to spa bath" },
  { pair: baPairs[10], caption: "Exterior · Brought back to life" },
];

// One run of the marquee. The track holds two identical runs and animates
// translateX(-50%), so the run's children must be a flat word/slash sequence
// for the loop to be seamless.
function MarqueeRun() {
  return (
    <span>
      {marqueeItems.map((item) => (
        <Fragment key={item}>
          <span>{item}</span>
          <span className="dot">/</span>
        </Fragment>
      ))}
    </span>
  );
}

export default function Home() {
  return (
    <>
      <Hero brand={<Brand className="brand film-brand-inner" />} />

      {/* MARQUEE */}
      <div className="strip" aria-hidden="true">
        <div className="strip-track">
          <MarqueeRun />
          <MarqueeRun />
        </div>
      </div>

      {/* BRAND PROMISE + STATS */}
      <section className="section bg-paper">
        <div className="container">
          <div className="ix">
            <IxRail num="01" label="The Promise" />
            <Reveal>
              <h2 className="h1">Built on quality. Known for dependability.</h2>
              <p className="lead mt-m">
                Perfect Home Renovation is built around a simple idea: do good
                work, communicate honestly, and follow through on what we say
                we&apos;re going to do.
              </p>
              <p className="lead mt-s">
                From kitchens and bathrooms to basements and full-home
                renovations, every project gets the same focus on
                craftsmanship, dependable service, and a finished result you
                can feel good about.
              </p>
              <div className="btn-row mt-m">
                <Link className="link-arrow" href="/services">
                  Explore our services →
                </Link>
              </div>
            </Reveal>
          </div>
          <Reveal className="stats mt-xl">
            <div className="stat">
              <div className="stat-num">
                250<span className="u">+</span>
              </div>
              <div className="stat-label">Projects Completed Since 2019</div>
            </div>
            <div className="stat">
              <div className="stat-num word">Free</div>
              <div className="stat-label">On-Site Estimates</div>
            </div>
            <div className="stat">
              <div className="stat-num word">Insured</div>
              <div className="stat-label">For Your Peace of Mind</div>
            </div>
            <div className="stat">
              <div className="stat-num word sm">Metro Detroit</div>
              <div className="stat-label">Residential Renovation</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* BEFORE & AFTER */}
      <section className="section bg-ink">
        <div className="container">
          <div className="ix">
            <IxRail num="02" label="Proof, not promises" />
            <Reveal>
              <h2 className="h1">See the difference.</h2>
              <p className="lead mt-m">
                Drag the handle to see what these Metro Detroit spaces looked
                like the day we started. Same room, same angle — just
                finished.
              </p>
            </Reveal>
          </div>
          <div
            className="grid cols-2 ba-featured mt-l"
            style={{ "--g": "26px" } as React.CSSProperties}
          >
            {featuredPairs.map((f) => (
              <Reveal key={f.caption}>
                <BeforeAfter pair={f.pair} caption={f.caption} dark />
              </Reveal>
            ))}
          </div>
          <Reveal className="btn-row mt-l">
            <Link className="btn btn-outline-light" href="/gallery?f=ba">
              See all before &amp; after pairs <span className="arr">&rarr;</span>
            </Link>
            <Link className="btn btn-outline-light" href="/portfolio">
              See featured projects <span className="arr">&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section bg-paper">
        <div className="container">
          <div className="ix">
            <IxRail num="03" label="What we do" />
            <Reveal>
              <h2 className="h1">Services built around your whole home.</h2>
            </Reveal>
          </div>
          <div className="svc-list mt-l">
            {services.map((s) => (
              <Reveal key={s.num} className="svc-row">
                <span className="svc-num">{s.num}</span>
                <span className="svc-name">{s.name}</span>
                <span className="svc-desc">{s.desc}</span>
                <Link className="btn btn-ghost sm" href="/services">
                  View <span className="arr">&rarr;</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="btn-row mt-l">
            <Link className="btn" href="/services">
              View All Services <span className="arr">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <ProcessSection num="04" />

      {/* WHY US */}
      <section className="section bg-paper">
        <div className="container">
          <div className="ix">
            <IxRail num="05" label="Why Perfect Home" />
            <Reveal>
              <h2 className="h1">
                Built right, and built like we&apos;ll see you again.
              </h2>
            </Reveal>
          </div>
          <div className="cells cols-3 mt-l">
            {whyUs.map((w) => (
              <Reveal key={w.title} className="cell">
                <div className="cell-mark">◆</div>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="section bg-white">
        <div className="container">
          <div className="ix">
            <IxRail num="06" label="Where we work" />
            <Reveal>
              <h2 className="h1">Serving Metro Detroit.</h2>
              <p className="lead mt-m">
                From historic Detroit neighborhoods to the suburbs, we build
                across the metro area. Each community has its own housing
                stock, permitting, and character, and we design for it.
              </p>
              <div className="area-grid mt-m">
                {areas.map((a) => (
                  <Link key={a} href="/estimate" className="area">
                    {a}
                  </Link>
                ))}
              </div>
              <div className="btn-row mt-m">
                <Link className="link-arrow" href="/estimate">
                  Check your area →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section bg-paper">
        <div className="container">
          <div className="ix">
            <IxRail num="07" label="In their words" />
            <Reveal>
              <h2 className="h1">Homeowners who&apos;d hire us again.</h2>
            </Reveal>
          </div>
          <div className="grid cols-3 trio mt-l" style={{ "--g": "20px" } as React.CSSProperties}>
            {testimonials.map((t) => (
              <Reveal key={t.name}>
                <figure className="quote">
                  <div className="quote-stars">★★★★★</div>
                  <blockquote>{t.quote}</blockquote>
                  <figcaption>
                    <strong>{t.name}</strong>
                    <span className="mono">{t.meta}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-white">
        <div className="container">
          <div className="ix">
            <IxRail num="08" label="Good questions" />
            <Reveal>
              <h2 className="h1">Before you reach out.</h2>
              <p className="lead mt-s">
                Don&apos;t see your question? Call us at{" "}
                <a className="brass mono" href={site.phoneHref}>
                  {site.phoneDisplay}
                </a>{" "}
                for real answers, no pressure.
              </p>
              <Faq />
            </Reveal>
          </div>
        </div>
      </section>

      <FinalCta lead="Free estimate. Honest timeline. A team that treats your home like it's ours. Tell us what you're picturing." />
    </>
  );
}
