import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Brand } from "@/components/ui/logo";
import { EstimateForm } from "@/components/forms/estimate-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a Free Estimate",
  description:
    "Request a free renovation or custom home estimate from Perfect Home Renovation. Tell us about your project, or call 313-502-4555.",
};

export default function EstimatePage() {
  return (
    <>
      <Header brand={<Brand />} />

      <section className="est-wrap bg-paper">
        <div className="container">
          <nav className="crumb">
            <Link href="/">Home</Link> <span>/</span> <span>Free Estimate</span>
          </nav>
          <div className="est-grid">
            <aside className="est-side">
              <div className="eyebrow">Free estimate</div>
              <h1 className="display est-h">Start your project.</h1>
              <p className="lead mt-m">
                Tell us what you&apos;re picturing. We&apos;ll follow up to
                schedule a free on-site consultation and a clear, fixed-scope
                estimate, usually within one business day.
              </p>

              <div className="est-call">
                <span className="mono est-call-k">Prefer to talk now?</span>
                <a className="est-call-phone mono" href={site.phoneHref}>
                  {site.phoneDisplay}
                </a>
              </div>

              <ul className="est-trust">
                <li>Free on-site consultation</li>
                <li>Fixed-scope pricing, no vague ranges</li>
                <li>Licensed, insured &amp; permitted</li>
                <li>One accountable point of contact</li>
              </ul>

              <div className="est-steps">
                <div>
                  <span>01</span> Submit this form
                </div>
                <div>
                  <span>02</span> We call to schedule
                </div>
                <div>
                  <span>03</span> On-site visit &amp; estimate
                </div>
              </div>
            </aside>

            <div>
              <EstimateForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
