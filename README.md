# Astro Engineers — GitHub Pages Site (Starter)

This is a static, GitHub Pages-friendly website starter for **Astro Engineers**.

## What’s included
- Multi-page static site: `index.html`, `manifesto.html`, `catalog.html`, `services.html`, `contact.html`
- Shared styling: `assets/css/site.css` (ported from your manifesto page)
- Shared navigation JS: `assets/js/site.js` (highlights the active page)
- JSON-driven catalog: `assets/data/catalog.json` + `assets/js/catalog.js`
- Placeholder emblem: `assets/img/emblem.svg` (replace with your real image)

## Quick start (local)
Because `catalog.html` fetches JSON, you should run a small local server:

### Option A: VS Code Live Server
- Install **Live Server** extension
- Right-click `index.html` → “Open with Live Server”

### Option B: Python (if installed)
From the repo folder:
```bash
python -m http.server 5173
```
Then open: http://localhost:5173

## Deploy to GitHub Pages
1. Push this repo to GitHub.
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch**
4. Branch: `main` and folder `/ (root)`
5. Save

## Customize
- Update global colors and spacing in: `assets/css/site.css`
- Replace the emblem:
  - Put your image into `assets/img/` (e.g. `emblem.jpg`)
  - In `assets/css/site.css`, update `.hero` background-image:
    - `background-image: url("assets/img/emblem.jpg");`
- Update catalog items in `assets/data/catalog.json`

## Notes
- If you don’t want the catalog to be JSON-driven, you can replace the catalog content with static HTML cards.
