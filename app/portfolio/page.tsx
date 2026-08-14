import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Brand } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { FinalCta, IxRail, Photo } from "@/components/sections/shared";
import { BeforeAfter } from "@/components/gallery/before-after";
import { ProjectGrid, type Project } from "@/components/gallery/project-grid";
import { baPairs, pick } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected kitchen, bathroom, basement, and full-home renovation projects across Metro Detroit, photographed on completion.",
};

// Featured before/after pairs with rooms identified from the shoots.
const featuredPairs = [
  { pair: baPairs[0], caption: "Exterior · Full rebuild" },
  { pair: baPairs[1], caption: "Main floor · Down to the studs" },
  { pair: baPairs[2], caption: "Basement · Unfinished to finished" },
  { pair: baPairs[12], caption: "Bathroom · Full gut" },
];

const projects: Project[] = [
  { cat: "full", tag: "Full Renovation", title: "The Pleasant Ridge Colonial", loc: "Pleasant Ridge, MI", photo: pick("exterior", 0) },
  { cat: "kitchen", tag: "Kitchen", title: "Warm Minimal Kitchen", loc: "Birmingham, MI", photo: pick("kitchens", 3) },
  { cat: "basement", tag: "Basement", title: "Lower-Level Lounge & Gym", loc: "Troy, MI", photo: pick("basements", 0) },
  { cat: "bath", tag: "Bathroom", title: "Black Tub Primary Bath", loc: "Royal Oak, MI", photo: pick("bathrooms", 0) },
  { cat: "full", tag: "Full Renovation", title: "Farmhouse Exterior Renovation", loc: "Metro Detroit", photo: pick("exterior", 2) },
  { cat: "full", tag: "Full Renovation", title: "Reworked Mid-Century Ranch", loc: "Huntington Woods, MI", photo: pick("exterior", 4) },
  { cat: "kitchen", tag: "Kitchen", title: "Opened Galley Kitchen", loc: "Ferndale, MI", photo: pick("kitchens", 7) },
  { cat: "bath", tag: "Bathroom", title: "Compact Guest Bath", loc: "Grosse Pointe, MI", photo: pick("bathrooms", 5) },
  { cat: "bath", tag: "Bathroom", title: "Double Vanity Suite Bath", loc: "Detroit, MI", photo: pick("bathrooms", 9) },
];

export default function PortfolioPage() {
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
                A closer look at individual projects: what changed, room by
                room. Looking for more photos? The{" "}
                <Link href="/gallery">full gallery</Link> has every finished
                space we have shot.
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
      <section className="section bg-white">
        <div className="container">
          <div className="ix">
            <IxRail num="01" label="A closer look" />
            <Reveal>
              <h2 className="h1">A closer look at the details.</h2>
              <p className="lead mt-m">
                Reworked main floors, new kitchens and baths, refinished
                floors, and rebuilt exteriors, photographed on completion.
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
          <div className="grid cols-3 pf-det-grid trio mt-l" style={{ "--g": "22px" } as React.CSSProperties}>
            <Reveal>
              <figure className="pf-det">
                <Photo
                  photo={pick("bathrooms", 2)}
                  sizes="(min-width: 900px) 373px, (min-width: 620px) 50vw, 92vw"
                  alt="Completed primary bathroom remodel"
                />
                <figcaption className="fw-sub">
                  Primary bath · Custom tile &amp; modern fixtures
                </figcaption>
              </figure>
            </Reveal>
            <Reveal>
              <figure className="pf-det">
                <Photo
                  photo={pick("stairs", 1)}
                  sizes="(min-width: 900px) 373px, (min-width: 620px) 50vw, 92vw"
                  alt="Rebuilt staircase with new railings"
                />
                <figcaption className="fw-sub">
                  Stairs · Rebuilt treads &amp; railings
                </figcaption>
              </figure>
            </Reveal>
            <Reveal>
              <figure className="pf-det">
                <Photo
                  photo={pick("exterior", 1)}
                  sizes="(min-width: 900px) 373px, (min-width: 620px) 50vw, 92vw"
                  alt="Renovated home exterior"
                />
                <figcaption className="fw-sub">
                  Exterior · Full facade renovation
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* BEFORE & AFTER */}
      <section className="section bg-ink">
        <div className="container">
          <div className="ix">
            <IxRail num="02" label="Before and after" />
            <Reveal>
              <h2 className="h1">The same room, twice.</h2>
              <p className="lead mt-m">
                Drag to see what these spaces looked like before we started. We
                only show pairs where we photographed the room going in.
              </p>
            </Reveal>
          </div>
          <div className="grid cols-2 ba-featured mt-l" style={{ "--g": "26px" } as React.CSSProperties}>
            {featuredPairs.map((f) => (
              <Reveal key={f.caption}>
                <BeforeAfter pair={f.pair} caption={f.caption} dark />
              </Reveal>
            ))}
          </div>
          <Reveal className="btn-row mt-l">
            <Link className="btn btn-outline-light" href="/gallery?f=ba">
              See all before and after pairs <span className="arr">&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* PROJECT GRID */}
      <section className="section bg-paper">
        <div className="container">
          <div className="ix">
            <IxRail num="03" label="Projects" />
            <Reveal>
              <h2 className="h1">Projects by room.</h2>
            </Reveal>
          </div>
          <ProjectGrid projects={projects} />
        </div>
      </section>

      <FinalCta
        eyebrow="Your project next"
        lead="Free estimate. Honest timeline. Tell us what you're picturing and we'll walk your space."
      />
    </>
  );
}
