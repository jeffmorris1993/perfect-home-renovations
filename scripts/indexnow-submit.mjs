// Submits the site's sitemap URLs to IndexNow (Bing, Yandex, and partners;
// Google does not use IndexNow). Run after a deploy that adds or meaningfully
// changes pages:  npm run indexnow
//
// The key is public by design; the matching key file lives at
// public/<key>.txt so the endpoint can verify domain ownership.

const HOST = "www.perfecthomereno.com";
const KEY = "ae61846a17b0fec0c5a37a35db0b63e7";

const sitemapXml = await fetch(`https://${HOST}/sitemap.xml`).then((r) => {
  if (!r.ok) throw new Error(`sitemap fetch failed: ${r.status}`);
  return r.text();
});
const urlList = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) throw new Error("no URLs found in sitemap");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
});

console.log(`IndexNow: submitted ${urlList.length} URLs, HTTP ${res.status}`);
if (!res.ok) console.error(await res.text());
