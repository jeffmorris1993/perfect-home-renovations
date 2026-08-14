"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";

// Sticky dark film-style nav used on inner pages, per the design's site.js
// (nav-film variant). The home page hero renders its own transparent bar.
export function Header({ brand }: { brand: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className="nav nav-film">
        <div className="container nav-inner">
          <Link className="brand" href="/" aria-label="Perfect Home Renovation home">
            {brand}
          </Link>
          <nav className="nav-links film">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={pathname === n.href ? "active" : undefined}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="nav-right">
            <Link className="nav-pill-cta" href="/estimate">
              Get a Free Estimate
            </Link>
            <button
              className="nav-toggle"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      <div className={open ? "mobile-panel open" : "mobile-panel"}>
        <Link href="/">Home</Link>
        {nav.map((n) => (
          <Link key={n.href} href={n.href}>
            {n.label}
          </Link>
        ))}
        <Link className="btn" href="/estimate">
          Request a Free Estimate <span className="arr">&rarr;</span>
        </Link>
        <a className="mp-phone" href={site.phoneHref}>
          {site.phoneDisplay}
        </a>
      </div>
    </>
  );
}
