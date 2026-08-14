import manifest from "./portfolio-manifest.json";

export type PortfolioCategory =
  | "kitchens"
  | "bathrooms"
  | "basements"
  | "stairs"
  | "fireplace"
  | "exterior";

export interface PortfolioPhoto {
  id: string;
  category: PortfolioCategory;
  /** Post-rotation dimensions of the largest derivative. */
  width: number;
  height: number;
  aspect: number;
  /** Widths emitted by scripts/build-portfolio.mjs. */
  widths: number[];
  /** Dominant color, used as the loading placeholder. */
  color: string;
}

export const photos = manifest as PortfolioPhoto[];

export const categories: { key: PortfolioCategory; label: string }[] = [
  { key: "kitchens", label: "Kitchens" },
  { key: "bathrooms", label: "Bathrooms" },
  { key: "basements", label: "Basements" },
  { key: "stairs", label: "Stairs & Railings" },
  { key: "fireplace", label: "Fireplaces" },
  { key: "exterior", label: "Exteriors" },
];

export function byCategory(c: PortfolioCategory): PortfolioPhoto[] {
  return photos.filter((p) => p.category === c);
}

export function categoryLabel(c: PortfolioCategory): string {
  return categories.find((e) => e.key === c)?.label ?? c;
}

export function srcFor(p: PortfolioPhoto, w: number): string {
  return `/img/portfolio/${p.category}/${p.id}-w${w}.webp`;
}

export function srcSetFor(p: PortfolioPhoto): string {
  return p.widths.map((w) => `${srcFor(p, w)} ${w}w`).join(", ");
}

/** Stable curated pick: nth photo of a category (wraps around). */
export function pick(c: PortfolioCategory, n: number): PortfolioPhoto {
  const list = byCategory(c);
  return list[n % list.length];
}
