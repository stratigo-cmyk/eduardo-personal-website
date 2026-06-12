# Eduardo Mitelman — Archive

Personal portfolio: a scroll-driven visual index of selected work.
The design system (paper palette, editorial serif/sans pairing, scroll-lens
index, HAUS craft rules) was developed through a design study of an archive
page; all branding and content here are © Eduardo Mitelman.

Static, zero dependencies.

## Run

Open `index.html` in a browser, or use the configured preview server
(`.claude/launch.json`, port 4173). Nothing to install.

## Files

| File | Role |
|------|------|
| `index.html` | Structure: stage, header, index, focus, footer, cookies, intro, cursor |
| `styles.css` | Tokens + all styling (paper palette, serif/sans pair, motion) |
| `data.js`    | The work index (client / project / role) + tonal plate palette — **edit this to change content** |
| `app.js`     | Scroll-lens engine, plate crossfade, cursor, menu, cookies |
| `WORKFLOW.md`| How to edit, add images, and publish |

## How it works

- **Scroll lens.** A virtual runway (`.scroll-space`) maps scroll position to a
  focus value. The centered work renders as the large italic serif title with
  its Roman numeral pinned left and client pinned right; neighboring rows part
  around it and fade with distance. A magnetic detent eases the focus toward
  whole items — the "heavy magazine page" feel. The engine takes any number of
  items; numerals and scroll length adjust automatically.
- **Plates.** Each work shows a full-bleed plate behind the title. With a
  `media` field it's your image (cover-fit, flat ink veil for legibility);
  without one it's a tonal plate (flat color + ghost numeral + film grain).
  The tonal color doubles as the loading placeholder, so images appear on a
  paper-matched surface.
- **Legibility by construction.** The index layer uses
  `mix-blend-mode: difference` with text color `#DFDEDC`: soft charcoal over
  paper, warm off-white over ink plates. Tonal plates are curated light/deep
  only — no mid grays — so contrast always holds.

## Craft rules applied (HAUS)

- 4px spacing grid throughout (`62.5%` root, `.4rem` steps)
- Flat elevation — no shadows, no gradients, no blur
- Easing tokens (`--ease-out-quint`, `--ease-out-soft`, …) and the
  duration scale (150 / 300 / 500 / 900 / 2000 ms)
- Z-index scale: 0 / 1 / 999 / 1000 / 10000
- Enter from bottom, exit to top (veil, menu, line-mask reveals)
- `prefers-reduced-motion` honored everywhere (intro skipped, lerp disabled)

## Images

Drop optimized files into `images/` (WebP, ~1600px wide, ≤200KB) and add
`media: "images/<file>.webp"` to the matching item in `data.js`.
See `WORKFLOW.md` for the full routine.

## Notes

- Fonts: Bodoni Moda (display serif) + Inter (UI sans), Google Fonts.
- No-JS fallback: the index renders as a static list.
- Cookie choice persists in `localStorage` (`em-cookies`).
