import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { cityPageServices, seoServices } from "@/lib/seo";

// Bump when page copy meaningfully changes; drives <lastmod>. A real date
// beats new Date() here: build-time stamps would claim every page changed
// on every deploy, which teaches crawlers to ignore the signal.
const CONTENT_UPDATED = new Date("2026-09-09");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/services",
    "/portfolio",
    "/gallery",
    "/estimate",
    "/privacy",
  ].map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const servicePaths = seoServices.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Only city pages with hand-written copy exist; not every service covers
  // every city (see lib/seo.ts cityCopy).
  const cityPaths = cityPageServices.flatMap((s) =>
    Object.keys(s.cityCopy ?? {}).map((citySlug) => ({
      url: `${site.url}/services/${s.slug}/${citySlug}`,
      lastModified: CONTENT_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [...staticPaths, ...servicePaths, ...cityPaths];
}
