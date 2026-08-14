/**
 * Portfolio photo pipeline.
 *
 * Reads the original wetransfer_* folders (gitignored, never deployed),
 * EXIF-autorotates, strips metadata (incl. GPS), and emits WebP derivatives
 * at several widths into public/img/portfolio/<category>/, plus a manifest
 * consumed by lib/portfolio.ts.
 *
 * Idempotent: photos are identified by content hash, so re-runs only process
 * new files. Run with: npm run photos
 */
import sharp from "sharp";
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

// Folder → category. Array order = display order within each category.
const SOURCES = [
  { dir: "wetransfer_kitchen_2026-08-12_1647", category: "kitchens" },
  { dir: "wetransfer_bathroom_2026-08-12_1641", category: "bathrooms" },
  { dir: "wetransfer_image00001-jpeg_2026-08-08_0024", category: "bathrooms" },
  { dir: "wetransfer_image00001-jpeg_2026-08-08_0044", category: "bathrooms" },
  { dir: "wetransfer_basement_2026-08-12_1951", category: "basements" },
  { dir: "wetransfer_stairs_2026-08-11_1519", category: "stairs" },
  { dir: "wetransfer_fireplace_2026-08-09_1927", category: "fireplace" },
  { dir: "wetransfer_exterior-home_2026-08-12_1634", category: "exterior" },
];

const WIDTHS = [480, 960, 1600];
const OUT = path.join(ROOT, "public/img/portfolio");
const MANIFEST = path.join(ROOT, "lib/portfolio-manifest.json");

const prior = existsSync(MANIFEST)
  ? JSON.parse(await readFile(MANIFEST, "utf8"))
  : [];
const priorById = new Map(prior.map((p) => [p.id, p]));

const entries = [];
const seenIds = new Set();
let processed = 0;
let skipped = 0;
let duplicates = 0;

for (const { dir, category } of SOURCES) {
  const abs = path.join(ROOT, dir);
  if (!existsSync(abs)) {
    console.warn(`!! missing source folder: ${dir}`);
    continue;
  }
  const files = (await readdir(abs))
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort();
  await mkdir(path.join(OUT, category), { recursive: true });

  for (const file of files) {
    const buf = await readFile(path.join(abs, file));
    const id = `${category}-${createHash("sha1").update(buf).digest("hex").slice(0, 10)}`;

    // The wetransfer batches overlap — same photo, multiple folders.
    if (seenIds.has(id)) {
      duplicates++;
      continue;
    }
    seenIds.add(id);

    const existing = priorById.get(id);
    if (
      existing &&
      existing.widths.every((w) =>
        existsSync(path.join(OUT, category, `${id}-w${w}.webp`)),
      )
    ) {
      entries.push(existing);
      skipped++;
      continue;
    }

    // .rotate() with no args applies EXIF orientation; output has no EXIF.
    const base = sharp(buf).rotate();

    let largest = null;
    const emitted = [];
    for (const w of WIDTHS) {
      const info = await base
        .clone()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: w === 480 ? 72 : 78 })
        .toFile(path.join(OUT, category, `${id}-w${w}.webp`));
      // withoutEnlargement can emit the same size twice for small sources —
      // keep each emitted width once, keyed by requested width for stable URLs.
      emitted.push(w);
      if (!largest || info.width > largest.width) largest = info;
    }

    // Dominant color from the rotated image (1×1 average).
    const px = await base.clone().resize(1, 1).raw().toBuffer();
    const color = `#${[px[0], px[1], px[2]].map((c) => c.toString(16).padStart(2, "0")).join("")}`;

    // Dims of the largest derivative, read from post-rotation output
    // (metadata() on EXIF-rotated sources reports swapped w/h).
    entries.push({
      id,
      category,
      width: largest.width,
      height: largest.height,
      aspect: +(largest.width / largest.height).toFixed(4),
      widths: emitted,
      color,
    });
    processed++;
    if (processed % 50 === 0) console.log(`  ...${processed} processed`);
  }
}

// Stable order: category display order, then id (content order within a
// folder isn't meaningful — these are batch phone uploads).
const categoryOrder = [...new Set(SOURCES.map((s) => s.category))];
entries.sort(
  (a, b) =>
    categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category) ||
    a.id.localeCompare(b.id),
);

await mkdir(path.dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(entries, null, 1));

const counts = {};
for (const e of entries) counts[e.category] = (counts[e.category] ?? 0) + 1;
console.log("\nManifest written:", path.relative(ROOT, MANIFEST));
console.log("Per-category counts:", counts);
console.log(
  `Total: ${entries.length} (processed ${processed}, reused ${skipped}, exact duplicates skipped ${duplicates})`,
);
