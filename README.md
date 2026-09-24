# Lymm Counselling

Static single-page website for Lymm Counselling Ltd (Cherry Baguneid, person-centred counsellor and psychotherapist), served by GitHub Pages at [lymmcounselling.org.uk](https://lymmcounselling.org.uk) via the CNAME file.

## Structure

- `index.html` — the entire site. There is no template system or component framework; edit this file directly for any content or markup change.
- `src/input.css` — Tailwind CSS v4 source (CSS-first `@theme` config: brand colours, fonts, etc).
- `assets/css/site.css` — compiled, minified CSS built from `src/input.css`. This file is committed to the repo and is what the live site actually loads, so it must be rebuilt and committed whenever `src/input.css` or the Tailwind classes in `index.html` change.
- `js/site.js` — small vanilla JS file (mobile nav toggle, header scroll state, scroll reveal, footer year, and the contact form). No jQuery, no Bootstrap, no build step needed for this file. The FAQ accordion uses native `<details>`/`<summary>` and needs no JS.
- Icons are [Lucide](https://lucide.dev) SVGs copied inline directly into `index.html` (no icon runtime JS, no icon CDN at runtime). To add a new icon, copy the markup from `node_modules/lucide-static/icons/<icon-name>.svg` into `index.html` and adjust its `class`/size as needed.
- `assets/img/` — images. Originals are kept alongside the sizes actually used on the page as source material for future edits.
- `documents/` — downloadable PDFs (GDPR policy, counselling contract).
- `_config.yml` — Jekyll config (theme only; the site itself is plain static HTML, not a Jekyll layout). `exclude:` keeps `src/`, `package.json`, `package-lock.json`, `node_modules/` and `.superpowers/` out of the published site.

## Editing the site

1. Edit `index.html` directly for content and markup.
2. If you change Tailwind classes in `index.html` or edit `src/input.css`, rebuild the compiled CSS:

   ```bash
   npm install
   npm run build
   ```

   (or `npm run dev` to rebuild automatically on save while you work).
3. Commit the updated `assets/css/site.css` along with your other changes — it must stay in sync with `index.html`/`src/input.css` since it's what gets deployed.

## Deploying

Deployment is just pushing to `main` — GitHub Pages serves directly from the branch, no build step runs on GitHub's side. Make sure `assets/css/site.css` is rebuilt and committed before pushing.
