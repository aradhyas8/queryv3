---
name: QueryIO
description: Read-only database access for AI agents, drawn as the path a query takes through a visible boundary.
colors:
  paper: "oklch(0.978 0.004 150)"
  paper-2: "oklch(0.955 0.007 155)"
  ink: "oklch(0.2 0.02 165)"
  ink-2: "oklch(0.44 0.02 165)"
  ink-3: "oklch(0.53 0.015 165)"
  rule: "oklch(0.89 0.01 160)"
  green: "oklch(0.38 0.075 162)"
  green-hover: "oklch(0.32 0.07 162)"
  green-deep: "oklch(0.26 0.045 165)"
  green-tint: "oklch(0.945 0.03 160)"
  on-green: "oklch(0.97 0.01 160)"
  on-green-2: "oklch(0.83 0.03 160)"
  refuse: "oklch(0.53 0.18 30)"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 4.6vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.4
  body-lg:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  code:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  control: "6px"
spacing:
  gutter: "16px"
  gutter-sm: "24px"
  section: "96px"
  section-md: "128px"
  container: "1152px"
  rail-column: "24px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.on-green}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.green-hover}"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "48px"
  tabs:
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
  boundary-band:
    backgroundColor: "{colors.green-tint}"
    textColor: "{colors.ink}"
  code-block:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
---

# Design System: QueryIO

## Overview

**North star: "The path through the boundary."**

QueryIO's product is one idea: an agent's query travels toward your data and crosses a boundary QueryIO controls. The visual system draws exactly that. A thin vertical rail is the path. Nodes on the rail are stops (the agent, each check, the replica). The QueryIO boundary is the only filled band on the rail, edged top and bottom by 2px green rules. Everything else is ink on paper.

No metaphor, no terminal costume, no cards. Structure comes from type scale, whitespace, hairline rules and two near-identical paper tones.

## Colors

Color is semantic, not decorative. There are three meanings and nothing else gets color.

- **Ink on paper** (ink, ink-2, ink-3 on paper / paper-2): everything that is not QueryIO and not a refusal.
- **Green means QueryIO.** The boundary band and its edges, passed-check nodes, the primary button, the security rail, the closing band (green-deep). Never used for decoration or for generic links.
- **Vermilion means refused.** The failed-check node, its detail text, and the "Refused before the database" sentence. Never a CTA or accent.
- **ink-3** is the dimmest text allowed (≈4.6:1 on paper); use it for skipped checks and captions only.

## Typography

Schibsted Grotesk for everything a person reads; Geist Mono only for literal machine text (SQL, results, config, tool names, identifiers). Display 700 at up to 4rem with -0.035em tracking; headlines 700, clamp(1.9rem, 3.2vw, 2.75rem). Body 17px, ledes 18px at max 36rem. Labels 14px sentence case. No uppercase, no eyebrows, no tracked labels.

Fonts load through next/font with their variables on `<html>`, and the theme maps them in a plain `@theme` block so `font-sans` / `font-mono` resolve at `:root`.

## Layout

One 1152px container. Hero: copy column (1fr) beside the path diagram (30rem), vertically centered. Argument sections use a 5/7 split (headline + lede left, evidence right) with a 64-80px gap; the tool contract runs full width as a three-column ledger. Bands alternate paper and paper-2 only; the closing waitlist band is green-deep.

Lists of claims are ledgers (hairline rules, 24-28px rows) or, when they describe where enforcement happens, a rail with green nodes.

## Components

### The path (signature)
Rail column 24px, rail 2px at x=11px. Agent node: hollow ink ring. Check nodes: 20px circles, green with a check (passed), vermilion with an x (refused), tint with a minus and ink-3 label (not reached). The rail stops at a refused check. Replica node: solid ink when reached, hollow and dim when not. The boundary band extends 16px past the rail on both sides. The diagram keeps a fixed height across write/read so the hero never jumps.

### Tabs
Text tabs on a hairline; active tab ink with a 2px ink underline. Arrow keys move selection; tabs carry `aria-controls` to a `tabpanel`.

### Buttons and inputs
Primary: solid green, on-green text, 48px tall, 6px radius. On green-deep, the button inverts to paper. Inputs: paper fill, 20% ink border, green on focus. Focus ring everywhere: 2px green, 3px offset.

### Motion
One authored moment: when the example changes, the stops resolve top to bottom at 110ms intervals (340ms, ease-out from 20% opacity), and the result table reveals with a clip-path wipe. Everything collapses under `prefers-reduced-motion`.

## Do's and Don'ts

- **Do** give every color a meaning: green = QueryIO, vermilion = refused, ink = everything else.
- **Do** show mechanisms (the path, the checks) instead of naming them with metaphors.
- **Do** keep machine text in Geist Mono and nowhere else.
- **Don't** add cards, badges, glows, gradients, terminal chrome or status indicators.
- **Don't** add a second filled band to the path or reuse the band as decoration.
- **Don't** use uppercase labels or eyebrows above headings.
