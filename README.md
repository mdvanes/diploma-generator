# Diploma Generator

A fully client-side web app for generating personalised PDF diplomas. Fill in a form, pick an award tier, and download a ready-to-print PDF — no server, no data leaves the browser.

![Static site](https://img.shields.io/badge/hosting-static-brightgreen) ![pdf-lib](https://img.shields.io/badge/pdf--lib-1.17.1-blue)

## How it works

On page load the app fetches the PDF template and image/font assets from the same static host. The [pdf-lib](https://pdf-lib.js.org/) library then composites the form values onto the template entirely in-browser and streams the result as a download.

## Repo structure

```
index.html
assets/
  template.pdf       # Base certificate layout (no dynamic text)
  Diploma.ttf        # Font used for name, years, and date text
  seal.png           # Organisation seal (bottom-left)
  star_bronze.png    # Award tier badges
  star_silver.png
  star_gold.png
```

## Deploying

This is a plain static site — no build step required.

**GitHub Pages** — push to a repo, enable Pages from *Settings → Pages*, set source to the root of your branch.

> **Local testing:** open via a local server, not `file://`. Assets are fetched with `fetch()` which browsers block on `file://` origins.
> ```bash
> npx serve .
> # or
> python3 -m http.server 8080
> ```

## Customising

### Swap assets
Replace any file in `assets/` with your own — keep the filenames the same, or update the `ASSETS` object at the top of the `<script>` block in `index.html`.

### Adjust text placement
The **Layout Configuration** accordion in the sidebar exposes X/Y/size controls for every dynamic element. PDF coordinates are in points (pt) from the bottom-left corner of the page. A4 landscape = 842 × 595 pt.

Default layout (matches the included `template.pdf`):

| Field | X | Y | Size |
|---|---|---|---|
| Recipient name | 421 | 450 | 42 |
| Years of service | 421 | 340 | 36 |
| Date | 421 | 252 | 16 |
| Star badge | 371 | 65 | 100 |
| Seal | 102 | 65 | 100 |

## Dependencies

| Library | Version | Purpose |
|---|---|---|
| [pdf-lib](https://pdf-lib.js.org/) | 1.17.1 | PDF manipulation in-browser |

Loaded from `unpkg.com` CDN — no npm install needed.

## Fonts

Make sure you have the appropriate licenses to use the fonts:

- Blank Script font: https://www.dafont.com/blank-script.font
- Diploma font: https://www.cufonfonts.com/font/diploma
