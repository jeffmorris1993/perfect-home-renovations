import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Karla, IBM_Plex_Mono } from "next/font/google";
import { site, areas } from "@/lib/site";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Karla({
  subsets: ["latin"],
  variable: "--font-body",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Perfect Home Renovation | Renovations in Metro Detroit",
    template: "%s | Perfect Home Renovation",
  },
  description:
    "Perfect Home Renovation helps Metro Detroit homeowners renovate kitchens, bathrooms, basements, and full homes with quality craftsmanship and dependable service.",
  openGraph: {
    siteName: site.name,
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  // Per-page canonical on the real domain, so the *.vercel.app copies of
  // these pages never compete with it in search.
  alternates: { canonical: "./" },
};

export const viewport: Viewport = {
  themeColor: "#101112",
};

const businessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: site.name,
  telephone: site.phoneE164,
  url: site.url,
  image: `${site.url}/og.jpg`,
  areaServed: areas.map((name) => ({ "@type": "City", name })),
  address: { "@type": "PostalAddress", addressRegion: "MI" },
  priceRange: "$$",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        {children}
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
        />
      </body>
    </html>
  );
}
