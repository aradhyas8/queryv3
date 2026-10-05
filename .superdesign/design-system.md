# QueryIO Design System — "Ledger dark"

Structure borrowed from Firecrawl's landing page (grid, type scale, chapter rhythm, code panels, card density). Branding, color, copy, and decoration are QueryIO's own. Strictly black and white.

## Product context

QueryIO is an open-source MCP stdio server for PostgreSQL. It gives coding agents (Claude Code, Codex, Cursor) four bounded, read-oriented tools — `inspect_row`, `describe_tables`, `list_tables`, `query` — instead of raw database access. MIT licensed. npm package `queryio` (v0.1.0). Repo: https://github.com/aradhyas8/queryio-mcp.

Audience: engineers who use coding agents and want the agent to inspect real Postgres state while debugging; plus the lead who approves that access.
Page goal: copy the install command, open the GitHub repo.

## Factual guardrails (hard)

- Only these commands exist: `npx -y queryio check`; `npx -y queryio` (stdio server); `claude mcp add queryio -e QUERYIO_DATABASE_URL="postgres://..." -- npx -y queryio`; `codex mcp add queryio --env QUERYIO_DATABASE_URL="postgres://..." -- npx -y queryio`. Credentials only via `QUERYIO_DATABASE_URL` env var.
- Only four tools. No hosted service, no replica, no waitlist, no pricing, no dashboard, no login.
- No testimonials, customer logos, star counts, usage numbers, or SOC2 badges.
- Benchmark numbers only as published in BENCHMARK.md, and state that the pre-declared win condition was NOT met.
- Security language must match README "Security Posture (Stated Honestly)": QueryIO is the safe default path, not a sandbox.

## Colors (light-first, with dark developer surfaces)

Page tokens (`:root`): bg `#FFFFFF`, surface `#FAFAFA`, surface-2 `#F4F4F5`, line `#E8E8E8`, line-strong `#D4D4D4`, fg `#0A0A0A`, fg-2 `#525252`, fg-3 `#6B6B6B`.

Light theme throughout: every surface, including code and terminal panels, uses bg `#FFFFFF` or surface `#F7F7F7`, border `#E5E5E5`.


No dark surfaces or sections. Black only for text, borders, and primary buttons. No hue, gradients, glow, glassmorphism, or blur. One soft shadow under the investigation panel. Primary button = fg fill, bg text.

## Typography

- Sans: Geist (500 for display/headings, 400 body). Mono: Geist Mono.
- display: 64px / 1.04, weight 500, tracking -0.035em (mobile 40px)
- h2: 44px / 1.08, weight 500, tracking -0.03em (mobile 32px)
- h3: 18px / 1.35, weight 500
- body-lg: 18px / 1.55, text-2
- body: 15px / 1.6, text-2
- label-mono: 12px / 1.4, Geist Mono, uppercase, tracking 0.06em, text-3 — section indices like `[ 03 / 10 ]`, column headers, eyebrows
- code: 13px / 1.65, Geist Mono
- Signature move (borrowed rhythm, own treatment): one clause of each section headline in text-2 gray, rest in white.
- Mono only for code, commands, tool names, data, and index labels. Never body copy.

## Layout

- Every section is full viewport width; only inner content is constrained to 1240px with 32px side padding (20px mobile). No outer page shell or vertical edge rules.
- Sections separated by full-width 1px horizontal rules. Hero is min(100svh - nav, 960px) tall, content vertically centered. No dotted grid textures, no crosshair stars.
- Section padding: 112px vertical desktop, 72px mobile. Chapter header (index label + h2 + 1-line subhead) then content 56px below.
- Grids: 12-col; prefer wide full-width panels and 2-up splits (1fr 1fr, 16px gap) over bento. 3-up only for short benefit cells, separated by shared 1px borders (table-like, no gaps), not floating cards.
- Spacing scale 4/8/12/16/24/32/48/56/72/112.
- Radius: 0 for nav, section frames, tables, benefit cells; 6px for buttons/inputs/code panels/chips. Nothing above 8px.

## Components

- **Navbar**: sticky, full width, 64px, white bg with bottom 1px line. Left: wordmark "QueryIO" (text, weight 600, plus a small square mono glyph `[q]` drawn as text — no invented logo art). Center: Docs/How it works/Benchmark/Security/FAQ anchor links (text-2, 14px). Right: "GitHub" ghost button (1px line border) + "Get started" primary (black fill, white text, 32px height, 6px radius).
- **Buttons**: primary = black fill, white text, 40px height, 6px radius, weight 500, no shadow. Secondary = transparent, 1px line-strong border, white text. Hover: primary → `#262626`; secondary → surface-2 bg. Transition 150ms ease.
- **Command bar** (copyable): surface bg, 1px line border, 6px radius, 48px tall, Geist Mono 13px. Leading `$` in text-3, command in text, trailing copy icon button (lucide `Copy` → `Check` on copy, "Copied" label). Tabs above it as small mono chips: `Claude Code` / `Codex` / `Preflight`. Horizontal scroll on overflow, never wrap mid-token.
- **Terminal / code panel**: surface bg, 1px line border, 6px radius. 36px header row with 1px bottom border: left mono label (e.g. `agent session · claude code`), right mono meta in text-3. No traffic-light dots. Body padding 20px. Optional line numbers in text-3.
- **Data table**: 0 radius, 1px line borders, header row in label-mono, rows 44px, mono for values. Highlight row: surface-2 bg + white text + 2px white left border.
- **Benefit cell**: part of a bordered grid; 32px padding; lucide icon 18px in text; h3; 2-line body.
- **Comparison table**: 3 data columns (raw psql / generic Postgres MCP / QueryIO), QueryIO column has surface bg and white header. Cells use short text, not checkmark-only.
- **Stat block**: big number 48px weight 500 white, label-mono caption, 1-line footnote text-3.
- **FAQ**: bordered list rows, question 16px white, `+`/`−` mono toggle, answer text-2.
- **Footer**: wordmark + one-line descriptor, link columns (Product / Resources / Project), MIT License + GitHub link, no badges.

## Motion

Utilitarian only: 150–200ms color/border transitions; terminal lines may fade in sequentially (opacity only, 80ms stagger) once on scroll; blinking block caret in terminal. Respect prefers-reduced-motion.
