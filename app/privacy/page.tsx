import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Brand } from "@/components/ui/logo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Perfect Home Renovation collects, uses, and protects the information you share when requesting an estimate.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="privacy-section">
      <h2 className="h3">{title}</h2>
      {children}
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <Header brand={<Brand />} />

      <section className="page-hero bg-paper">
        <div className="container">
          <nav className="crumb">
            <Link href="/">Home</Link> <span>/</span> <span>Privacy Policy</span>
          </nav>
          <div className="eyebrow">Effective August 14, 2026</div>
          <h1 className="display mt-s">Privacy policy.</h1>
        </div>
      </section>

      <section className="section tight bg-white">
        <div className="container privacy-body">
          <p className="lead">
            Perfect Home Renovation (&ldquo;we,&rdquo; &ldquo;us&rdquo;) is a
            residential renovation company serving {site.region}. This policy
            explains what information we collect through this website, why we
            collect it, and the choices you have. The short version: we only
            collect what you choose to send us through the estimate form, we
            use it solely to respond to your project inquiry, and we never
            sell it.
          </p>

          <Section title="Information you give us">
            <p>
              When you submit the free-estimate form, we receive the details
              you enter: your name, phone number, email address, the project
              address or city, the project type, and any budget, timeline,
              preferences, or project description you choose to include. You
              may also attach photos of your space; those photos are sent to
              us along with your request.
            </p>
            <p>
              Browsing the rest of the site requires no account and asks for
              no personal information.
            </p>
          </Section>

          <Section title="How we use it">
            <p>
              Estimate requests are delivered to our business inbox by email
              and used for one purpose: contacting you about your project and
              preparing your estimate. We do not use your information for
              advertising, add you to marketing lists, or sell or rent it to
              anyone.
            </p>
          </Section>

          <Section title="Service providers">
            <p>
              Like most websites, we rely on a small number of service
              providers to operate: our website is hosted on Vercel, and
              estimate requests are delivered by Resend, an email delivery
              service. Your form submission passes through these providers
              solely to reach us, and standard server logs (such as IP
              addresses) may be processed by them to run and protect the
              service. We do not share your information with anyone else
              unless required by law.
            </p>
          </Section>

          <Section title="Cookies and analytics">
            <p>
              This site does not use advertising trackers, analytics
              cookies, or third-party scripts. There is nothing to opt out
              of and no cookie banner because there are no tracking cookies.
            </p>
          </Section>

          <Section title="Project photos on this site">
            <p>
              The photos in our gallery and portfolio are of completed
              projects. Before publishing, we strip embedded photo metadata
              (including location data) from every image.
            </p>
          </Section>

          <Section title="Retention and your choices">
            <p>
              Estimate emails are kept in our business inbox so we can follow
              up on your project. If you would like the information you sent
              us corrected or deleted, contact us and we will take care of it:
              call{" "}
              <a className="brass mono" href={site.phoneHref}>
                {site.phoneDisplay}
              </a>{" "}
              or reply to any email from us.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If we change how this site handles your information, we will
              update this page and its effective date.
            </p>
          </Section>

          <div className="btn-row mt-l">
            <Link className="btn" href="/estimate">
              Request a Free Estimate <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
