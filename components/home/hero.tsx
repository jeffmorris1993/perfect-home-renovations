"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

// Cinematic full-viewport film hero with its own transparent header bar,
// per the design (the home page does not use the standard sticky nav).
// The poster <img> is the always-present LCP layer; the video cross-fades
// in once it can play. Autoplay denial (Safari Low Power Mode) or a missing
// file simply leaves the poster showing.
export function Hero({ brand }: { brand: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  // The film is attached only after the page has loaded so its 2.5MB never
  // competes with the poster (the LCP) for bandwidth.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = () => {
      v.src = "/media/hero-film.mp4";
      v.playbackRate = 0.8;
      v.play().catch(() => {});
    };
    if (document.readyState === "complete") {
      start();
      return;
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  return (
    <section className="film">
      <div className="film-media">
        <img
          className="film-poster"
          src="/media/hero-poster.jpg"
          srcSet="/media/hero-poster-960.jpg 960w, /media/hero-poster.jpg 1920w"
          sizes="100vw"
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
        />
        <video
          ref={videoRef}
          className={playing ? "film-v playing" : "film-v"}
          muted
          playsInline
          loop
          preload="none"
          onPlaying={() => setPlaying(true)}
          onError={() => setPlaying(false)}
        />
      </div>
      <div className="film-scrim" />
      <div className="film-grad" aria-hidden="true" />
      <header className="film-bar">
        <Link
          className="film-brand"
          href="/"
          aria-label="Perfect Home Renovation home"
        >
          {brand}
        </Link>
        <nav className="film-nav">
          <Link href="/services">Services</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/portfolio">Projects</Link>
          <Link href="/">About</Link>
        </nav>
        <Link className="film-cta" href="/estimate">
          Get a Free Estimate
        </Link>
        <button
          className="film-burger"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>
      <nav className={menuOpen ? "film-mob open" : "film-mob"}>
        <Link href="/services">Services</Link>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/estimate">Free Estimate</Link>
        <a href={site.phoneHref}>{site.phoneDisplay}</a>
      </nav>
      <div className="film-copy">
        <h1 className="film-title">
          <span className="fl">Quality Renovations</span>
          <span className="fl fl-2">Done Right</span>
        </h1>
        <p className="film-sub">
          Kitchens · Bathrooms · Basements · Full-Home Renovations
        </p>
        <div className="film-actions">
          <Link className="film-btn" href="/estimate">
            Get a Free Estimate <span className="arr">→</span>
          </Link>
          <Link className="film-link" href="/portfolio">
            View Our Work
          </Link>
        </div>
      </div>
      <div className="film-foot">
        <span className="film-scroll">Scroll ↓</span>
        <span className="film-proof">250+ projects since 2019</span>
      </div>
    </section>
  );
}
