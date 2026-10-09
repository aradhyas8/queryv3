import assert from "node:assert/strict";
import { test } from "node:test";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const canonical = "https://queryiomcp.vercel.app";

async function get(path) {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200, path);
  return response;
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], match[2].replaceAll("&amp;", "&")]));
}

for (const path of ["/", "/install"]) {
  test(`${path} serves complete metadata and crawlable content`, async () => {
    const html = await (await get(path)).text();
    const head = html.match(/<head>[\s\S]*?<\/head>/)?.[0];
    assert.ok(head);
    const tags = [...head.matchAll(/<(?:meta|link)\b[^>]*>/g)].map(([tag]) => attributes(tag));
    const meta = (key) => tags.find((tag) => tag.name === key || tag.property === key)?.content;
    const url = canonical + (path === "/" ? "" : path);
    assert.equal(tags.filter((tag) => tag.rel === "canonical").length, 1);
    assert.equal(tags.find((tag) => tag.rel === "canonical").href.replace(/\/$/, ""), url);
    assert.match(head, /<title>[^<]*QueryIO[^<]*PostgreSQL[^<]*<\/title>/);
    assert.match(meta("description"), /PostgreSQL/);
    assert.ok(meta("description").length < 180);
    assert.equal(meta("og:url").replace(/\/$/, ""), url);
    assert.equal(meta("og:type"), "website");
    assert.equal(meta("og:site_name"), "QueryIO");
    assert.equal(meta("og:title"), meta("twitter:title"));
    assert.equal(meta("og:description"), meta("description"));
    assert.equal(meta("twitter:description"), meta("description"));
    assert.equal(meta("twitter:card"), "summary_large_image");
    assert.match(meta("robots"), /index, follow/);
    assert.doesNotMatch(meta("robots"), /noindex|nofollow/);
    for (const key of ["og:image", "twitter:image"]) {
      const image = new URL(meta(key));
      // Next.js uses the local origin for file-based OG images during development.
      if (process.env.TEST_PRODUCTION === "1") assert.equal(image.origin, canonical);
      else assert.ok([canonical, new URL(base).origin].includes(image.origin));
      const response = await get(image.pathname + image.search);
      assert.match(response.headers.get("content-type"), /image\/png/);
      const png = Buffer.from(await response.arrayBuffer());
      assert.equal(png.readUInt32BE(16), 1200);
      assert.equal(png.readUInt32BE(20), 630);
    }
    const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").replace(/<!--.*?-->/g, "");
    assert.equal((body.match(/<h1\b/g) || []).length, 1);
    let previous = 0;
    for (const [, level] of body.matchAll(/<h([1-6])\b/g)) {
      assert.ok(Number(level) <= previous + 1, `heading skips a level after h${previous}`);
      previous = Number(level);
    }
    for (const text of ["PostgreSQL", "Claude Code", "Codex", "Cursor", "npx -y queryio setup"]) {
      assert.ok(body.replace(/<[^>]+>/g, "").includes(text), `${text} is in HTML before JavaScript`);
    }
    assert.match(body, /href="#content"/);
    assert.match(body, /id="content"/);
    assert.match(body, /docs\/security\.md/);
  });
}

test("software JSON-LD contains factual software properties without invented metrics", async () => {
  const html = await (await get("/")).text();
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  const data = JSON.parse(scripts[0][1]);
  assert.equal(data["@context"], "https://schema.org");
  assert.deepEqual(data["@type"], ["SoftwareApplication", "SoftwareSourceCode"]);
  assert.equal(data.name, "QueryIO");
  assert.equal(data.url, canonical);
  assert.equal(data["@id"], `${canonical}/#software`);
  assert.equal(data.codeRepository, "https://github.com/aradhyas8/queryio-mcp");
  assert.equal(data.license, `${data.codeRepository}/blob/main/LICENSE`);
  assert.equal(data.runtimePlatform, "Node.js 20+");
  assert.equal(data.applicationCategory, "DeveloperApplication");
  assert.match(data.description, /PostgreSQL/);
  assert.ok(data.featureList.every((feature) => typeof feature === "string"));
  assert.ok(data.sameAs.includes("https://www.npmjs.com/package/queryio"));
  for (const field of ["aggregateRating", "review", "offers", "downloadCount", "operatingSystem"]) assert.equal(data[field], undefined);
});

test("robots, sitemap, and llms.txt expose the canonical public resources", async () => {
  const robots = await (await get("/robots.txt")).text();
  assert.match(robots, /User-Agent: \*/i);
  assert.match(robots, /Allow: \/\s/i);
  assert.doesNotMatch(robots, /Disallow: \/\s/i);
  assert.ok(robots.includes(`Sitemap: ${canonical}/sitemap.xml`));
  const sitemap = await (await get("/sitemap.xml")).text();
  assert.match(sitemap, /xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
  assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url.replace(/\/$/, "")), [canonical, `${canonical}/install`]);
  const response = await get("/llms.txt");
  assert.match(response.headers.get("content-type"), /text\/plain/);
  const llms = await response.text();
  for (const term of ["PostgreSQL", "Claude Code", "Codex", "Cursor", "inspect_row", "query", "list_tables", "describe_tables", "npx -y queryio setup", "QUERYIO_DATABASE_URL", "READ ONLY", "not a sandbox", "MIT"]) assert.ok(llms.includes(term), term);
  for (const agent of ["claude", "codex", "cursor"]) assert.ok(llms.includes(`npx -y queryio setup --${agent}`));
  assert.doesNotMatch(llms, /guarantee.*recommend/i);
});

test("internal links and fragment targets resolve on both pages", async () => {
  const pages = new Map();
  for (const path of ["/", "/install"]) pages.set(path, await (await get(path)).text());
  const checked = new Set();
  for (const [path, html] of pages) {
    for (const [tag] of html.matchAll(/<a\b[^>]*>/g)) {
      const href = attributes(tag).href;
      if (!href || (!href.startsWith("/") && !href.startsWith("#"))) continue;
      const url = new URL(href, `${base}${path}`);
      if (!checked.has(url.pathname)) {
        await get(url.pathname);
        checked.add(url.pathname);
      }
      if (url.hash) {
        const target = pages.get(url.pathname);
        assert.ok(target?.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), href);
      }
    }
  }
});
