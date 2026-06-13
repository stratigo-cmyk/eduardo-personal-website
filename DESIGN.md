---
version: alpha
name: Depo Luxe — Approach
description: >-
  Design tokens for the internal "Approach" page (the /about/ route, reached
  from the top-bar "Approach" link). Extracted from the Depo Luxe site:
  high-contrast black/white, single EB Garamond serif, flat hard-edged
  surfaces, JS-driven parallax scroll, palette inversion per section.
colors:
  primary: "#000000"
  secondary: "#ffffff"
  neutral: "#999999"
  accent-blue: "#0000fe"
  accent-red: "#ff4f23"
  aux-dark: "#7d7d7d"
  aux-mid: "#8e8e93"
  aux-light: "#aeaeb2"
  focus: "#ff00ff"
  error: "#ff0000"
  success: "#4dc247"
  palette-a-fg: "#ffffff"
  palette-a-bg: "#000000"
  palette-a-aux: "#7d7d7d"
  palette-b-fg: "#000000"
  palette-b-bg: "#ffffff"
  palette-b-aux: "#000000"
typography:
  display:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: -0.01em
  body-md:
    fontFamily: EB Garamond
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: -0.01em
  body-sm:
    fontFamily: EB Garamond
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: 0
  caption:
    fontFamily: EB Garamond
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: 0
spacing:
  xs: 12px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 128px
  gap: 12px
  columns: "12"
  header-height: 120px
  scrollbar-height: 40px
rounded:
  none: 0px
components:
  nav-link:
    typography: "{typography.body-md}"
    textColor: "{colors.primary}"
    padding: 12px
  nav-link-focus:
    textColor: "{colors.focus}"
  counter-roman:
    typography: "{typography.caption}"
    textColor: "{colors.neutral}"
  scrollbar-track:
    backgroundColor: "{colors.secondary}"
    height: 40px
  scrollbar-thumb:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.none}"
  section-inverted:
    backgroundColor: "{colors.palette-a-bg}"
    textColor: "{colors.palette-a-fg}"
  section-default:
    backgroundColor: "{colors.palette-b-bg}"
    textColor: "{colors.palette-b-fg}"
---

# Depo Luxe — Approach Page

## Overview

This file describes the **Approach** page — the `/about/` route, reached by
clicking **Approach** in the top menu bar. It is a single long-scroll editorial
page built from alternating **text blocks** and **title blocks** (4-image media
grids) that repeat across the studio's service areas: Consulting, Creative Idea,
Talents, Photography, Network, Events.

The aesthetic is **architectural and restrained** — a high-contrast monochrome
broadsheet. There is exactly one typeface (EB Garamond), one font weight (400),
no rounded corners, and no drop shadows. Visual interest comes from **scale,
whitespace, palette inversion, and motion**, not decoration. Each section
carries a `data-palette` attribute that swaps the entire color context between a
white-on-black ("palette-a") and black-on-white ("palette-b") scheme, so the
page reads as a sequence of inverting panels.

It is a production-company brand (Turkey-based, "Depo Film" rebranded to
"Depo Luxe", © 2026). Treat the look as premium, editorial, and confident —
never playful or ornamental.

## Colors

The system is rooted in pure black and pure white, with two rarely-used accents
and a ladder of Apple system greys for auxiliary text.

- **Primary (#000000):** Core ink — body text, headlines, and the scrollbar
  thumb on light sections. The root `--primary`.
- **Secondary (#ffffff):** Page ground on light sections; ink on dark sections.
  The root `--secondary`.
- **Neutral (#999999):** Mid grey for de-emphasized text such as Roman-numeral
  counters and metadata.
- **Accent Blue (#0000fe):** A single electric blue, used sparingly for
  emphasis or links. (Note: the codebase exposes this value under a misnamed
  `--yellow` variable as well as `--blue`; the value is blue, not yellow.)
- **Accent Red (#ff4f23):** A warm vermilion accent for highlights. Distinct
  from the system error red.
- **Aux greys (#7d7d7d, #8e8e93, #aeaeb2):** Apple system greys used for
  auxiliary and secondary text within the runtime palettes.
- **Focus (#ff00ff):** Magenta. This is a **developer placeholder**
  (`--assertive` / `--focus`), not a brand color. Replace it with a real focus
  treatment before shipping — never let magenta reach production.
- **Error (#ff0000) / Success (#4dc247):** Status colors only.

### Runtime palettes

Sections swap their color context at runtime via `data-palette`:

- **palette-a (inverted):** foreground `#ffffff`, background `#000000`,
  aux `#7d7d7d`. White-on-black panels.
- **palette-b (default):** foreground `#000000`, background `#ffffff`,
  aux `#000000`. Black-on-white panels.

Adjacent sections alternate between the two so the page inverts as it scrolls.

## Typography

A single serif carries the entire page: **EB Garamond**, weight **400**, with a
matching italic. Both faces are self-hosted woff2 (regular + italic,
`font-display: swap`) and preloaded — not served from a CDN. There is no true
bold; hierarchy is built from **size and space**, never weight.

- **Display (36px):** The largest level (`--font-size-l`), used for section
  titles. `.body` maps `--font-size-h1` to this value.
- **Body (16px):** The base reading size (`--font-size-base`), with a tightened
  `-0.01em` tracking inherited from `.body`.
- **Body Small (13px):** Secondary copy (`--font-size-s`).
- **Caption (12px):** The floor (`--min-font-size`), used for counters and fine
  print.

**Italic** uses the same family name with `font-style: italic` (a real italic
woff2 is loaded; there is no separate italic font stack).

**Fluid scaling:** sizes are fluid via
`clamp(12px, 1.1111vw * var(--zoom), 48px)`. The `1.1111vw` factor is `16/1440`,
i.e. the scale is tuned to a **1440px** design width, with a hard ceiling of
**48px** (`--max-font-size`) and floor of **12px**. A per-element `--zoom`
(default `1`, set to `2` inline on hero elements) multiplies the fluid size.
Line-height is a constant **1.375**.

Rendering: WebKit `subpixel-antialiased` → `antialiased`, Firefox `grayscale`,
`text-rendering: optimizeLegibility`.

## Layout

A **12-column fluid grid** with **12px gutters**. Column width is computed as
`calc((100vw - edge*2 - gap*(cols-1)) / cols)`. The edge padding uses
`--padding-xxs` per side.

The spacing scale is a coarse, opinionated ladder:

- **xs / sm (12px):** `--padding-s` / `--padding-xs` — the grid gutter and tight
  internal spacing. (`xs` and `sm` share the 12px value in the source.)
- **md (24px):** `--padding-m` — standard block padding; the mobile fallback
  padding.
- **lg (48px):** `--padding-l` — generous section separation.
- **xl (128px):** `--padding-xl` — major vertical rhythm between panels.

Fixed layout dimensions:

- **header-height (120px):** `--header-height`, the fixed top bar holding the
  "Approach" link.
- **scrollbar-height (40px):** `--scrollbar-height` for the custom horizontal
  scrollbar.

Two viewport-relative values live outside the token table because they use
units the token format doesn't carry (`vh`/`dvh`): the title-block scroll track
is **200vh** (`--height`, a 2× viewport scroll runway) and the visible stage is
**100dvh** (`--heightSecure`, dynamic viewport height). JS also computes a
`--vh` (1% of viewport) and a `--y` scroll offset at runtime.

**Responsive:** a single breakpoint at **max-width: 480px**. On mobile, title
blocks shrink their image size/height to `4rem`, padding drops to `--padding-m`
(24px), and the grid gap drops to `--padding-xxs`.

> Note: `--padding-xxs` is referenced (edge padding, mobile gap) but **not
> defined** anywhere in the extracted source. Resolve it before building —
> do not guess a value silently.

## Elevation & Depth

The design is **flat**. There are no drop shadows and no elevation ramp.
Hierarchy is conveyed three ways:

1. **Palette inversion** — alternating white-on-black / black-on-white panels
   (see Runtime palettes) act as tonal layers.
2. **Contrast and scale** — large EB Garamond display type against open
   whitespace.
3. **A WebGL/cursor layer** — a full-page `<canvas id="Interface__Canvas">`
   composites a custom cursor and interface effects above the content.

`box-sizing: border-box` is a global reset. No `z-index` ladder was captured;
introduce one only as needed and keep it shallow.

## Motion & Scroll

Motion is driven by a **custom JS scroll engine**, not CSS animation. Do not
reach for `@keyframes` or scroll-linked CSS for the primary effects.

- Sections carry `data-scroll-insider` with `data-speed` parallax multipliers
  and `data-axis="x|y"`. Observed speeds: `-1.1, -1, -0.9, -0.4, -0.2, 0.2,
  0.4, 1.1` (negative = moves against scroll).
- Transforms are GPU-composited via `translate3d` / `matrix3d`.
- Hidden state: `[aria-expanded='false'] { visibility: hidden; pointer-events: none; }`.
- A hand-built horizontal scrollbar (`#Scrollbar` with `.track` / `.thumb`,
  `data-axis-x`) replaces the native one.

**Easing** uses the full easings.net Penner set (18 curves: in/out/in-out ×
quad, cubic, quart, quint, expo, circ). This is a copied library, not a curated
choice — treat the curves as *available*, and prefer the `out-*` and
`in-out-*` variants for entrances. Animation **durations** are defined in the
JS bundle and were not captured here.

Honor `prefers-reduced-motion`: disable parallax and fall back to a static,
in-order layout.

## Shapes

**Hard-edged.** No border-radius token exists anywhere in the source, and the
aesthetic is rectilinear, so the corner radius is **0** across buttons, media,
and containers.

- **none (0px):** the only radius. Apply to everything.

> This 0px value is an inference from the visual language, not an extracted
> token. If a softer treatment is ever introduced, add it here explicitly.

## Components

- **Nav link:** the top-bar items including **Approach** (which routes to
  `/about/`). Body-size EB Garamond in primary ink, 12px hit padding, no
  underline by default.
- **Roman counter:** text blocks are numbered with Roman numerals
  (`.counter` with `--has-roman`), set in caption-size neutral grey.
- **Scrollbar:** a custom track + thumb pair; the thumb is solid primary with
  zero radius, the track is the section ground color.
- **Section panels:** `section-default` (black-on-white) and
  `section-inverted` (white-on-black) express the `data-palette` swap and should
  be applied alternately down the page.

Variants (e.g. `nav-link-focus`) are separate entries. The focus variant
currently points at the magenta placeholder — swap it for a real focus style.

## Do's and Don'ts

- **Do** alternate `section-default` and `section-inverted` panels so the page
  inverts as it scrolls.
- **Do** build hierarchy from EB Garamond's size scale and whitespace — never
  from font weight (there is only 400).
- **Do** keep every corner hard (0px radius) and every surface flat (no shadow).
- **Do** drive parallax and the scrollbar with the JS engine, and gate it behind
  `prefers-reduced-motion`.
- **Do** use Accent Blue (#0000fe) and Accent Red (#ff4f23) sparingly, as rare
  punctuation only.
- **Don't** ship the magenta `#ff00ff` focus/assertive placeholder — replace it
  with a real focus treatment.
- **Don't** trust the `--yellow` variable name; its value is blue (#0000fe).
- **Don't** introduce a second typeface, a bold weight, rounded corners, or drop
  shadows.
- **Don't** rely on `--padding-xxs` until it is given a real value.
