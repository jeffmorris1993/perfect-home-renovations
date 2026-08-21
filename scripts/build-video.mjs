/**
 * Hero video pipeline.
 *
 * Takes a raw master clip (gitignored, never deployed) and emits optimized,
 * content-hashed MP4 renditions plus matching poster JPEGs into
 * public/media/, and a manifest consumed by components/home/hero.tsx.
 *
 * All renditions: audio stripped, metadata stripped, 0.8x slow-down baked in
 * (so the player never touches playbackRate — iOS resets it on metadata
 * load), H.264 High yuv420p, faststart for progressive playback.
 *
 * Portrait renditions are derived from a 9:16 center-crop of the landscape
 * master when no --portrait source is given — the same slice object-fit:
 * cover would display on a phone, but encoded at full quality.
 *
 * Filenames are hashed from (source bytes + encode settings) because
 * /media/* is served with an immutable 1-year Cache-Control header: a new
 * source means new URLs, never a stale cached video, while re-running on an
 * unchanged source keeps the URLs stable and skips the encode entirely.
 * (Output-based hashing doesn't work: x264 output is not byte-reproducible
 * across runs.) Files in public/media/ matching hero-* that the new
 * manifest doesn't reference are pruned.
 *
 * Run with: npm run video -- --landscape ./hero-source.mp4 [--portrait <src>]
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFile, mkdir, mkdtemp, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "public/media");
const MANIFEST = path.join(ROOT, "lib/hero-media-manifest.json");

// ---- args ---------------------------------------------------------------
const args = process.argv.slice(2);
function argValue(flag) {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? path.resolve(ROOT, args[i + 1]) : null;
}
const landscapeSrc = argValue("--landscape");
const portraitSrc = argValue("--portrait");

if (!landscapeSrc) {
  console.error(
    "Usage: npm run video -- --landscape <master.mp4> [--portrait <master.mp4>]",
  );
  process.exit(1);
}
for (const src of [landscapeSrc, portraitSrc].filter(Boolean)) {
  if (!existsSync(src)) {
    console.error(`Source not found: ${src}`);
    process.exit(1);
  }
}

function run(cmd, cmdArgs) {
  try {
    return execFileSync(cmd, cmdArgs, { encoding: "utf8" });
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`${cmd} not found on PATH. Install it: brew install ffmpeg`);
      process.exit(1);
    }
    throw err;
  }
}

function probe(src) {
  const json = JSON.parse(
    run("ffprobe", [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=width,height",
      "-of", "json",
      src,
    ]),
  );
  const { width, height } = json.streams[0];
  return { width, height };
}

// ---- rendition ladder ---------------------------------------------------
// setpts=1.25*PTS bakes the 0.8x slow-motion into the file itself.
const SLOW = "setpts=1.25*PTS";
// 9:16 center crop (width forced even for yuv420p).
const CROP = "crop=trunc(ih*9/16/2)*2:ih";

const LANDSCAPE_TIERS = [
  { name: "land-1080", tier: "hi", height: 1080, crf: 21, maxrate: "4200k" },
  { name: "land-720", tier: "lo", height: 720, crf: 22, maxrate: "2000k" },
];
const PORTRAIT_TIERS = [
  { name: "port-1440", tier: "hi", height: 1440, crf: 21, maxrate: "3600k" },
  { name: "port-1280", tier: "lo", height: 1280, crf: 22, maxrate: "1800k" },
];

function encode(src, tmpOut, { filters, crf, maxrate }) {
  const bufsize = `${parseInt(maxrate, 10) * 2}k`;
  run("ffmpeg", [
    "-y", "-i", src,
    "-an",
    "-map_metadata", "-1",
    "-vf", filters.join(","),
    "-r", "24",
    "-c:v", "libx264",
    "-profile:v", "high",
    "-level", "4.0",
    "-preset", "slow",
    "-crf", String(crf),
    "-maxrate", maxrate,
    "-bufsize", bufsize,
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-fflags", "+bitexact", "-flags", "+bitexact",
    tmpOut,
  ]);
}

// Hash of (source bytes + recipe): deterministic, so an unchanged source
// keeps its URLs and lets us skip already-encoded files.
const srcHashes = new Map();
async function sourceHash(src) {
  if (!srcHashes.has(src)) {
    srcHashes.set(
      src,
      createHash("sha1").update(await readFile(src)).digest("hex"),
    );
  }
  return srcHashes.get(src);
}
function recipeHash(srcHash, recipe) {
  return createHash("sha1")
    .update(srcHash + JSON.stringify(recipe))
    .digest("hex")
    .slice(0, 10);
}

const tmp = await mkdtemp(path.join(tmpdir(), "phr-video-"));
await mkdir(OUT, { recursive: true });
const keep = new Set();

async function buildSet(src, tiers, deriveByCrop) {
  const { height: srcH } = probe(src);
  const srcHash = await sourceHash(src);
  const set = {};
  for (const t of tiers) {
    // Never upscale past the source (small tolerance for rounding).
    if (t.height > srcH * 1.05) {
      console.log(`  skip ${t.name} (source is only ${srcH}p)`);
      continue;
    }
    const filters = [SLOW];
    if (deriveByCrop) filters.push(CROP);
    filters.push(`scale=-2:${t.height}`);
    const name = `hero-${t.name}-${recipeHash(srcHash, { ...t, filters })}.mp4`;
    const outFile = path.join(OUT, name);
    if (existsSync(outFile)) {
      console.log(`  ${t.name} up to date (${name})`);
    } else {
      console.log(`  encoding ${t.name}...`);
      const tmpOut = path.join(tmp, `${t.name}.mp4`);
      encode(src, tmpOut, { filters, crf: t.crf, maxrate: t.maxrate });
      await copyFile(tmpOut, outFile);
    }
    const { width, height } = probe(outFile);
    const { size } = await stat(outFile);
    keep.add(name);
    set[t.tier] = { src: `/media/${name}`, width, height };
    console.log(`    → ${name} (${width}x${height}, ${(size / 1e6).toFixed(2)} MB)`);
  }
  // A short ladder (low-res source) may only emit one tier — reuse it.
  set.hi ??= set.lo;
  set.lo ??= set.hi;
  return set.hi ? set : null;
}

console.log("Landscape renditions:");
const landscape = await buildSet(landscapeSrc, LANDSCAPE_TIERS, false);
console.log(portraitSrc ? "Portrait renditions:" : "Portrait renditions (center-cropped from landscape master):");
const portrait = await buildSet(portraitSrc ?? landscapeSrc, PORTRAIT_TIERS, !portraitSrc);

if (!landscape) {
  console.error("No landscape rendition could be produced.");
  process.exit(1);
}

// ---- poster from the hi landscape rendition's first frame ---------------
console.log("Poster:");
const posterVariants = [];
for (const w of [1920, 960]) {
  const heroFile = path.basename(landscape.hi.src);
  const name = `hero-poster-${w}-${recipeHash(heroFile, { w, q: 3 })}.jpg`;
  const outFile = path.join(OUT, name);
  if (!existsSync(outFile)) {
    const tmpOut = path.join(tmp, `poster-${w}.jpg`);
    run("ffmpeg", [
      "-y", "-i", path.join(OUT, heroFile),
      "-vf", `scale=${w}:-2`,
      "-frames:v", "1",
      "-update", "1",
      "-q:v", "3",
      "-fflags", "+bitexact",
      tmpOut,
    ]);
    await copyFile(tmpOut, outFile);
  }
  const { width, height } = probe(outFile);
  const { size } = await stat(outFile);
  keep.add(name);
  posterVariants.push({ src: `/media/${name}`, width, height });
  console.log(`    → ${name} (${width}x${height}, ${Math.round(size / 1e3)} KB)`);
}
const posterHi = posterVariants[0];
const poster = {
  src: posterHi.src,
  srcSet: posterVariants
    .map((p) => `${p.src} ${p.width}w`)
    .reverse()
    .join(", "),
  width: posterHi.width,
  height: posterHi.height,
};

// ---- manifest + prune ---------------------------------------------------
await writeFile(
  MANIFEST,
  JSON.stringify({ poster, landscape, portrait }, null, 2),
);
console.log("Manifest written:", path.relative(ROOT, MANIFEST));

for (const f of await readdir(OUT)) {
  if (/^hero[-_]/.test(f) && !keep.has(f)) {
    await rm(path.join(OUT, f));
    console.log("Pruned stale:", f);
  }
}

await rm(tmp, { recursive: true, force: true });
console.log("Done.");
