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
import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises";
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

// Before/after shoots: files pair up sequentially (odd = before, even = after).
const BA_DIR = "wetransfer_before-and-after_2026-08-13_1436";
const BA_MANIFEST = path.join(ROOT, "lib/ba-manifest.json");

const WIDTHS = [480, 640, 960, 1600];
// 640 exists for DPR-3 phone tiles (~585 device px) that would otherwise
// jump straight to the 960 file.
const qualityFor = (w) => (w <= 480 ? 72 : w <= 640 ? 74 : 78);
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
let screenshots = 0;

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

    // Reuse only when every *currently targeted* width exists on disk, not
    // the widths recorded at the time the entry was built — otherwise adding
    // a tier to WIDTHS would never backfill already-processed photos.
    const existing = priorById.get(id);
    if (
      existing &&
      WIDTHS.every((w) =>
        existsSync(path.join(OUT, category, `${id}-w${w}.webp`)),
      )
    ) {
      // Phone screenshots (~9:19.5, aspect ≈2.16) don't belong in the
      // gallery; 9:16 verticals (1.78) are real photos and stay.
      if (existing.height / existing.width > 2) {
        screenshots++;
        for (const w of existing.widths) {
          await rm(path.join(OUT, category, `${id}-w${w}.webp`), {
            force: true,
          });
        }
        continue;
      }
      entries.push({ ...existing, widths: [...WIDTHS] });
      skipped++;
      continue;
    }

    {
      const meta = await sharp(buf).rotate().metadata();
      if (meta.height / meta.width > 2) {
        screenshots++;
        continue;
      }
    }

    // .rotate() with no args applies EXIF orientation; output has no EXIF.
    const base = sharp(buf).rotate();

    let largest = null;
    const emitted = [];
    for (const w of WIDTHS) {
      const info = await base
        .clone()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: qualityFor(w) })
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
// ---- Before/after pairs -------------------------------------------------
{
  const abs = path.join(ROOT, BA_DIR);
  const outDir = path.join(OUT, "before-after");
  const pairs = [];
  if (existsSync(abs)) {
    await mkdir(outDir, { recursive: true });
    const files = (await readdir(abs))
      .filter((f) => /\.(jpe?g|png)$/i.test(f))
      .sort();

    async function processBA(file, role, pairNum) {
      const buf = await readFile(path.join(abs, file));
      const id = `ba${String(pairNum).padStart(2, "0")}-${role}`;
      let base = sharp(buf).rotate();
      // Phone/IG screenshots arrive letterboxed — trim uniform borders so
      // the slider isn't full of black bars. Real photos (≤4:3-ish) skip it.
      const meta = await sharp(await base.clone().toBuffer()).metadata();
      if (meta.height / meta.width > 1.6) {
        base = base.trim({ threshold: 40 });
      }
      let largest = null;
      const emitted = [];
      for (const w of WIDTHS) {
        const info = await base
          .clone()
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: qualityFor(w) })
          .toFile(path.join(outDir, `${id}-w${w}.webp`));
        emitted.push(w);
        if (!largest || info.width > largest.width) largest = info;
      }
      return {
        id,
        width: largest.width,
        height: largest.height,
        widths: emitted,
      };
    }

    for (let p = 0; p * 2 + 1 < files.length; p++) {
      const before = await processBA(files[p * 2], "before", p + 1);
      const after = await processBA(files[p * 2 + 1], "after", p + 1);
      pairs.push({ pair: p + 1, before, after });
    }
    await writeFile(BA_MANIFEST, JSON.stringify(pairs, null, 1));
    console.log(`Before/after: ${pairs.length} pairs written`);
  } else {
    console.warn(`!! missing before/after folder: ${BA_DIR}`);
  }
}

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
  `Total: ${entries.length} (processed ${processed}, reused ${skipped}, exact duplicates skipped ${duplicates}, screenshots excluded ${screenshots})`,
);
