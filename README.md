# QueryIO website

Next.js App Router website for [QueryIO](https://queryiomcp.vercel.app/), the PostgreSQL database investigation MCP server. Package source and documentation live in the [separate MCP repository](https://github.com/aradhyas8/queryio-mcp).

## Local development and checks

```sh
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
```

The HTTP tests expect the website on port 3000. To test a production build, run `npm run start -- --port 3001` and set `TEST_BASE_URL=http://localhost:3001` and `TEST_PRODUCTION=1` before `npm test`. Tests check installation HTML, headings, metadata, canonical URLs, social-image dimensions, JSON-LD, crawler resources, and internal links. Browser checks are still needed for agent selection, copy behavior, keyboard access, and responsive layout. Building requires access to Google Fonts for the existing Inter and JetBrains Mono fonts.

## Installation commands

QueryIO 0.2.1 supports `setup --claude`, `setup --codex`, and `setup --cursor`. Selecting a homepage card appends its flag to `npx -y queryio setup` in every environment. Selecting it again restores the generic command, and copy always uses the displayed command. The flags preselect an agent in the interactive wizard; scope selection, database checks, warnings, and write confirmations still apply.

Interactive regressions live in `tests/agent-picker.browser.mjs`. Run `checkAgentPicker(tab)` with a native Codex browser tab on the homepage, including against the production build. The checks cover initial state, all three commands, switching, deselection, copying, selected styling, and accessibility attributes. They need browser interaction and are separate from the HTTP-only `npm test` checks.

## Search and sharing

- `app/seo.ts` defines the production origin and shared metadata. If a custom domain replaces the Vercel hostname, update this origin and the website links in `public/llms.txt` together.
- `/` and `/install` have distinct canonical URLs and metadata. Vercel preview builds are marked `noindex, nofollow`, disallow crawling, and return an empty sitemap. Production allows indexing.
- `/opengraph-image` renders a 1200 × 630 sharing image using the existing QueryIO logo and current product headline.
- `/robots.txt` and `/sitemap.xml` use Next.js metadata routes. No artificial modification dates or keyword pages are added.
- `/llms.txt` summarizes verified product facts and links to official sources. It does not guarantee discovery or recommendations by AI systems. Keep it in sync with published tools, defaults, and setup behavior.
- Homepage JSON-LD describes the MIT-licensed software and source repository without ratings, review claims, or usage statistics.

After deployment, verify the canonical host and sharing image, check that the production response has no `X-Robots-Tag: noindex` header, and submit `/sitemap.xml` through Google Search Console and Bing Webmaster Tools. Use their inspection tools to request indexing for `/` and `/install`. Revalidate social previews after sharing metadata changes. No search-engine accounts or deployments are managed by this repository.
