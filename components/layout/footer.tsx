import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Brand } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link href="/" aria-label="Perfect Home Renovation home">
              <Brand />
            </Link>
            <p className="footer-cta">Build it right. The first time.</p>
            <a className="footer-phone" href={site.phoneHref}>
              {site.phoneDisplay}
            </a>
          </div>
          <div className="footer-nav">
            <Link href="/">Home</Link>
            {nav.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
            <Link href="/estimate">Free Estimate</Link>
          </div>
          <div>
            <Link className="btn btn-light" href="/estimate">
              Start Your Project <span className="arr">&rarr;</span>
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Perfect Home Renovation &middot; {site.region}</span>
          <span>Licensed &amp; Insured &middot; Free on-site consultations</span>
          <span>
            Built by{" "}
            <a
              className="footer-credit"
              href="https://sirromstudios.com"
              rel="noopener"
            >
              Sirrom Studios
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
