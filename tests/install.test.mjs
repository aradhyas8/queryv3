import assert from "node:assert/strict";
import { test } from "node:test";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";

// Run against the website on port 3000 (npm run dev or npm run start).
async function page(path) {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200);
  const main = (await response.text()).match(/<main\b[\s\S]*?<\/main>/)?.[0];
  assert.ok(main, "page renders its main content");
  return main.replace(/<!--.*?-->/g, "");
}

test("install is a supporting reference with environment and release guidance", async () => {
  const html = await page("/install");
  assert.match(html, /<h1[^>]*>Setup reference\.<\/h1>/);
  assert.match(html, /href="\/#setup"[^>]*>[\s\S]*?Back to homepage setup/);
  assert.match(html, /<code[^>]*>npx -y queryio setup<\/code>/);
  assert.match(html, /aria-label="Copy to clipboard"/);
  assert.match(html, /Node\.js 20\+ required · PostgreSQL only/);
  assert.match(html, /QUERYIO_DATABASE_URL/);
  assert.match(html, /environment that starts your agent/);
  assert.match(html, /never requests, collects, or stores connection strings/);
  assert.doesNotMatch(html, /<(?:input|textarea|form)\b/);
  assert.match(html, /README\.md#manual-configuration/);
  assert.match(html, /npx -y queryio@0\.2\.1 setup/);
  assert.doesNotMatch(html, /aria-pressed|Pick your agent/);
});

test("homepage leads with one command and branded agent choices before the demo", async () => {
  const html = await page("/");
  const hero = html.slice(html.indexOf('id="top"'), html.indexOf('id="demo"'));
  assert.match(hero, /Debug database issues with your AI coding agent\./);
  assert.match(hero, /Currently supports PostgreSQL only\./);
  assert.equal(hero.match(/<code[^>]*>([\s\S]*?)<\/code>/)?.[1].replace(/<[^>]+>/g, ""), "npx -y queryio setup");
  assert.match(hero, /Pick your agent/);
  // Before a choice the command is the published one; agent flags appear only after selecting a card.
  assert.doesNotMatch(hero, /queryio setup --(?:claude|codex|cursor)/);
  assert.match(hero, /Prefer manual setup\?[\s\S]*?Read the docs/);
  assert.match(hero, /README\.md#manual-configuration/);
  assert.match(hero, /aria-label="Copy to clipboard"/);
  assert.equal((hero.match(/aria-pressed="false"/g) ?? []).length, 3);
  assert.equal((hero.match(/aria-expanded="false"/g) ?? []).length, 3);
  assert.doesNotMatch(hero, /aria-pressed="true"|setup details"|Get started/);
  for (const agent of ["Claude Code", "Codex", "Cursor"]) assert.ok(html.includes(agent));
  for (const icon of ["claude", "codex", "cursor"]) assert.ok(hero.includes(`/agents/${icon}.svg`));
  const panelId = hero.match(/aria-controls="([^"]+)"/)?.[1];
  assert.ok(panelId);
  assert.ok(hero.includes(`id="${panelId}" aria-live="polite"`));
  assert.match(hero, /QUERYIO_DATABASE_URL/);
  assert.doesNotMatch(html, /<(?:input|textarea|form)\b/);
});

test("homepage keeps setup navigation local and preserves the investigation story", async () => {
  const html = await page("/");
  assert.match(html, /href="#setup"[^>]*>Set up QueryIO/);
  assert.equal((html.match(/id="setup"/g) ?? []).length, 1);
  assert.equal((html.match(/href="\/#setup"/g) ?? []).length, 2);
  assert.match(html, /Set up QueryIO<\/h3>/);
  assert.match(html, /Inspect a record<\/h3>/);
  assert.match(html, /Verify with targeted SQL<\/h3>/);
  assert.doesNotMatch(html, /npm i queryio|claude mcp add|role="tabpanel"|export QUERYIO_DATABASE_URL|Quick start/);
  assert.match(html, /<video[^>]*src="\/queryio-film-web\.mp4"/);
  assert.match(html, /foreign-key relationships, in both directions/);
  assert.match(html, /QueryIO is not a sandbox/);
  assert.match(html, /32 KiB result budget/);
  assert.match(html, /https:\/\/www.npmjs.com\/package\/queryio/);
  assert.match(html, /https:\/\/github.com\/aradhyas8\/queryio-mcp/);
});

test("all agent marks are served locally as SVGs", async () => {
  for (const name of ["claude", "codex", "cursor"]) {
    const response = await fetch(`${base}/agents/${name}.svg`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /image\/svg\+xml/);
    assert.match(await response.text(), /<svg[^>]+viewBox="0 0 24 24"/);
  }
});
