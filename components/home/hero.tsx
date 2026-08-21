"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import heroMedia from "@/lib/hero-media-manifest.json";

type NetInfo = { saveData?: boolean; effectiveType?: string };

// Cinematic full-viewport film hero with its own transparent header bar,
// per the design (the home page does not use the standard sticky nav).
// The poster <img> is the always-present LCP layer; the video cross-fades
// in once it can play. Renditions come from lib/hero-media-manifest.json
// (built by npm run video): portrait phones get a true portrait encode,
// slow connections and small screens get the lighter tier, and data-saver /
// reduced-motion users get the poster only. The slow-motion effect is baked
// into the files, so playbackRate is never touched (iOS resets it anyway).
export function Hero({ brand }: { brand: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as { connection?: NetInfo }).connection;
    if (conn?.saveData) return;

    const cleanups: (() => void)[] = [];
    const on = (
      target: EventTarget,
      event: string,
      handler: () => void,
      opts?: AddEventListenerOptions,
    ) => {
      target.addEventListener(event, handler, opts);
      cleanups.push(() => target.removeEventListener(event, handler));
    };

    let attempts = 0;
    let retriesArmed = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    // Autoplay can be denied (iOS Low Power Mode, browser policy). Retry
    // when the tab regains focus or on the user's first interaction.
    const armRetries = () => {
      if (retriesArmed) return;
      retriesArmed = true;
      on(document, "visibilitychange", () => {
        if (!document.hidden) tryPlay();
      });
      on(window, "pointerdown", tryPlay, { once: true });
      on(window, "keydown", tryPlay, { once: true });
      on(window, "touchstart", tryPlay, { once: true });
    };
    const tryPlay = () => {
      v.play().catch(armRetries);
    };

    // Network errors get two delayed reload attempts; after that the poster
    // simply stays (by design — never a broken player).
    const handleError = () => {
      if (attempts >= 2) return;
      attempts++;
      retryTimer = setTimeout(
        () => {
          if (!v.paused) return;
          v.load();
          tryPlay();
        },
        attempts * 3000 + 1000,
      );
    };

    // Picked once at attach; a mid-session loop restart on rotation would be
    // more jarring than a slightly soft crop.
    const pickRendition = () => {
      const portraitScreen = window.matchMedia("(orientation: portrait)").matches;
      const set =
        portraitScreen && heroMedia.portrait
          ? heroMedia.portrait
          : heroMedia.landscape;
      const slow = /(^|-)(2g|3g)$/.test(conn?.effectiveType ?? "");
      const dense =
        Math.min(window.screen.width, window.screen.height) *
          window.devicePixelRatio >=
        900;
      return slow || !dense ? set.lo : set.hi;
    };

    const start = () => {
      v.preload = "auto";
      v.src = pickRendition().src;
      on(v, "canplay", tryPlay);
      on(v, "error", handleError);
      v.load();
      tryPlay();
    };

    // Attach right after first paint settles — not after window.load, which
    // could delay the film indefinitely behind every image on the page.
    let idleId: number | undefined;
    let startTimer: ReturnType<typeof setTimeout> | undefined;
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(start, { timeout: 1500 });
    } else {
      startTimer = setTimeout(start, 200);
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      clearTimeout(startTimer);
      clearTimeout(retryTimer);
      for (const c of cleanups) c();
    };
  }, []);

  return (
    <section className="film">
      <div className="film-media">
        <img
          className="film-poster"
          src={heroMedia.poster.src}
          srcSet={heroMedia.poster.srcSet}
          sizes="100vw"
          alt=""
          width={heroMedia.poster.width}
          height={heroMedia.poster.height}
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
          <Link href="/gallery">Gallery</Link>
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
        <Link href="/gallery">Gallery</Link>
        <Link href="/estimate">Free Estimate</Link>
        <a href={site.phoneHref}>{site.phoneDisplay}</a>
      </nav>
      <div className="film-copy">
        <h1 className="film-title">
          <img
            className="fl film-lockup"
            src="/img/hero-lockup.webp"
            alt="Quality Renovations Done Right!"
            width={1327}
            height={314}
          />
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
