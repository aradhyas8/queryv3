import assert from "node:assert/strict";

// Run through the native Codex browser, passing a tab on a freshly loaded homepage.
export async function checkAgentPicker(tab) {
  const generic = "npx -y queryio setup";
  const cases = [
    { name: "Claude Code Anthropic’s CLI coding agent", flag: "--claude", client: "Claude Code" },
    { name: "Codex OpenAI’s coding agent", flag: "--codex", client: "Codex" },
    { name: "Cursor AI code editor", flag: "--cursor", client: "Cursor" },
  ];
  const results = [];
  const setup = tab.playwright.locator("#setup");

  async function checkCommand(expected) {
    assert.equal(await setup.locator("code").textContent(), expected);
    const copy = setup.getByRole("button");
    await tab.clipboard.writeText("QueryIO copy regression sentinel");
    await copy.press("Enter");
    // Clipboard writes are async; seed it so an old successful copy cannot make this pass.
    let copied;
    for (let attempt = 0; attempt < 10; attempt++) {
      copied = await tab.clipboard.readText();
      if (copied === expected) break;
    }
    assert.equal(copied, expected, "copies the currently displayed command");
    assert.equal(await tab.playwright.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "command fits the viewport");
  }

  await checkCommand(generic);
  assert.equal(await tab.playwright.locator('[aria-pressed="true"]').count(), 0);
  results.push("initial generic command and copy");

  for (const { name, flag, client } of cases) {
    const card = tab.playwright.getByRole("button", { name, exact: true });
    await card.press("Space");
    await checkCommand(`${generic} ${flag}`);
    assert.equal(await card.getAttribute("aria-pressed"), "true");
    assert.equal(await card.getAttribute("aria-expanded"), "true");
    assert.equal(await tab.playwright.locator('[aria-pressed="true"]').count(), 1);
    assert.equal(await tab.playwright.getByRole("region", { name: `${client} setup details`, exact: true }).count(), 1);
    const panel = await card.getAttribute("aria-controls");
    assert.equal(await tab.playwright.locator(`[id="${panel}"]`).getAttribute("aria-live"), "polite");
    assert.match(await card.getAttribute("class"), /\bborder-fg\b/);
    assert.equal(await card.locator(".opacity-100").count(), 1, "selected checkmark is visible");
    results.push(`${client}: command, copy, selected outline/checkmark and ARIA`);

    await card.press("Space");
    await checkCommand(generic);
    assert.equal(await card.getAttribute("aria-pressed"), "false");
    assert.equal(await card.getAttribute("aria-expanded"), "false");
    assert.equal(await tab.playwright.locator('[aria-pressed="true"]').count(), 0);
    assert.equal(await tab.playwright.getByRole("region", { name: `${client} setup details`, exact: true }).count(), 0);
    results.push(`${client}: deselection returns to generic command and copy`);
  }

  // Switch directly between agents using the keyboard, without an intermediate deselection.
  for (const { name, flag } of cases) {
    await tab.playwright.getByRole("button", { name, exact: true }).press("Enter");
    await checkCommand(`${generic} ${flag}`);
    assert.equal(await tab.playwright.locator('[aria-pressed="true"]').count(), 1);
  }
  await tab.playwright.getByRole("button", { name: cases[2].name, exact: true }).press("Enter");
  await checkCommand(generic);
  results.push("keyboard switching and deselection");
  assert.equal(await tab.playwright.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "no horizontal overflow");
  results.push("no horizontal overflow");
  return results;
}
