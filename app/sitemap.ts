import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { cityPageServices, seoCities, seoServices } from "@/lib/seo";

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
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.8,
  }));

  const servicePaths = seoServices.map((s) => ({
    url: `${site.url}/services/${s.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const cityPaths = cityPageServices.flatMap((s) =>
    seoCities.map((c) => ({
      url: `${site.url}/services/${s.slug}/${c.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  );

  return [...staticPaths, ...servicePaths, ...cityPaths];
}
