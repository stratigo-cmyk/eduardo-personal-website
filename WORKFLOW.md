# How I work on this site

One page. Four routines. Total cost: $0.

## 1 · Change text

All content lives in `data.js`. Each work is one line:

```js
{ brand: "Client name", title: "Project name", director: "Your role" },
```

- Edit the line (any editor, or tell Claude Code: *"change X to Y in data.js"*).
- Add or delete lines freely — numerals, plates and scroll length adjust on their own.
- Site-wide text (name, footer line, nav) lives in `index.html`.

## 2 · Add an image to a work

1. Export WebP, ~1600px wide, under ~200KB (use squoosh.app if needed).
2. Drop it into `images/`.
3. Add the field to that work's line in `data.js`:

```js
{ brand: "Client", title: "Project", director: "Role", media: "images/project.webp" },
```

No image? The work keeps its tonal plate. Pick imagery that reads clearly
light or dark — the text inverts over it automatically.

## 3 · See it locally

Open `index.html` in a browser, or ask Claude Code to start the preview
(server config is in `.claude/launch.json`, port 4173).

## 4 · Publish

The site auto-deploys from GitHub. After any change:

```sh
git add -A
git commit -m "Update archive"
git push
```

Live in about a minute. Or just tell Claude Code: *"publish"*.

---

**Rule of thumb:** content → `data.js` · look & motion → `styles.css` ·
behavior → `app.js`. When in doubt, describe the change to Claude Code in
one sentence and review the diff.
