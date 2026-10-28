# Prakhar Kaushik — Research Website

This repository contains a static, GitHub Pages–compatible personal research website.
The site is mostly plain HTML + a single shared stylesheet, with a small amount of
JavaScript for a light/dark theme toggle and publication BibTeX viewer.

The research profile brings principles from **cognitive science and cognitive
computing** into **3D computer vision, computer graphics, and interpretable AI**.
**3D part-based understanding** is the signature specialization. Continual
learning, interpretable/explainable AI, and physics of AI support the goals of
efficiency, robustness, and interpretability. Analysis by synthesis is one
approach within this broader program. Keep this framing consistent in the
homepage, Research page, publication summaries, and page metadata.
The homepage biography should demonstrate this specialization through concrete
contributions and project links, rather than listing fields of expertise alone.
Keep the tone understated: show the distinctive connection through the work,
without declarations such as “I lead research” or unverified comparisons with
other researchers.

## Structure

- `index.html` — Home page (hero, featured work, visibility, news, etc.).
- `research/index.html` — Research stack + ideas.
- `publications/index.html` — Publications with thematic/chronological toggle + BibTeX modal.
- `misc/index.html` — Talks, leadership, and press in one consolidated page.
- `contact/index.html` — Contact information.
- `roadmap/index.html`, `talks/index.html`, `leadership/index.html`, and
  `press/index.html` — Compatibility routes to the consolidated sections.
- `assets/css/research.css` — Main stylesheet for all updated pages.
- `assets/js/theme-toggle.js` — Light/dark theme toggle logic.
- `assets/js/site-news.js` — Renders homepage news from JSON with a static fallback.
- `assets/data/news.json` — Easy-to-edit homepage news/update feed.
- `assets/bibliography/your_paper.bib` — BibTeX source for publications.
- `assets/img/` — Images (headshot + publication thumbnails).
- `assets/grain.svg` — Subtle texture overlay used by the theme.

Note: `news/index.html` is a legacy page from the old theme. The homepage news
list is now maintained in `assets/data/news.json`, with a static fallback in
`index.html` for offline/file preview.

## Local Preview

The site is static. You can open `index.html` directly, or run a local server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Editing Guide

### 1) Add News

Home page news is defined in `assets/data/news.json`.

Steps:
1) Add a new object at the top or anywhere in the array:
   ```json
   {
     "date": "2026-05-29",
     "displayDate": "May 29, 2026",
     "tag": "Market",
     "title": "Faculty-market profile updated",
     "summary": "Short one-sentence update.",
     "url": "/cv/",
     "links": [
       {
         "label": "Related project",
         "url": "https://example.com/"
       }
     ]
   }
   ```
2) `links` is optional; use it for extra related project/paper links on the same news item.
3) Use absolute `https://...` URLs for external links. The renderer automatically adds safe external-link attributes.
4) Keep `date` in `YYYY-MM-DD` form so the feed sorts correctly.
5) If you want the full legacy list updated, also edit `news/index.html` (old theme).

The renderer lives in `assets/js/site-news.js`. If JavaScript is unavailable or
the page is opened directly from `file://`, the fallback news items in
`index.html` remain visible.

### 2) Add Publications

Publications use the chronological cards in `publications/index.html` as their
canonical authoring records. Thematic copies are also kept in the HTML so the
page works in direct-file and no-script previews. Each canonical card carries
explicit paper-theme probabilities in `data-pub-theme-scores`. The BibTeX modal pulls entries from
`assets/bibliography/your_paper.bib`; missing thematic-copy generation,
probability sorting, search/filter behavior, and quick abstract injection live in
`assets/js/publication-filters.js`.

Steps:
1) Add a BibTeX entry to `assets/bibliography/your_paper.bib`.
   The BibTeX key (e.g., `kaushik2025universalweightsubspacehypothesis`)
   must match the `data-bibtex-key` used in the HTML.

2) Add one publication card to the chronological section under the correct
   year. Assign every relevant theme a 1–100 editorial relevance score:
   ```html
   <article class="pub-item"
            data-pub-theme-scores="efficient:98 explainable-ai:88">
   ```
   Available theme keys are `efficient`, `3d`, `perception`,
   `domain-adaptation`, `explainable-ai`, `robustness`, `generative`, and
   `security`. Scores should reflect the paper's title, abstract, method, and
   main contribution. Thematic cards are sorted from highest to lowest score
   and display their section-specific match. Keep static thematic copies for
   direct-file previews; when served with JavaScript, missing copies are filled
   and re-sorted automatically.

3) For each card:
   - Use the full paper title in the `<h3>`.
   - If published, add a venue line:
     ```html
     <p class="pub-meta"><span class="pub-venue">ICCV 2025</span></p>
     ```
   - If the paper was an oral, include:
     ```html
     <span class="pub-oral">Oral</span>
     ```
   - Use arXiv/HTML/website links if available:
     ```html
     <div><a href="https://arxiv.org/abs/..." target="_blank" rel="external noopener">arXiv</a></div>
     <div><a href="https://project-site.example" target="_blank" rel="external noopener">Website</a></div>
     ```
   - Add the BibTeX button:
     ```html
     <a class="btn btn-secondary btn-small pub-bibtex-button"
        href="/assets/bibliography/your_paper.bib"
        data-bibtex-key="your-bibtex-key">BibTeX</a>
     ```

4) Optional thumbnail image:
   - Add an image to `assets/img/publications/`.
   - Add a `<figure class="pub-media">` block in the card:
     ```html
     <figure class="pub-media">
       <a class="pub-media-link" href="/assets/img/publications/your_image.png">
         <img src="/assets/img/publications/your_image.png" alt="Preview image for ..." loading="lazy">
       </a>
     </figure>
     ```

The BibTeX modal logic lives inside `publications/index.html`. It reads
`your_paper.bib`, so keep keys consistent.

5) Optional abstract/search polish:
   - Add or update the matching title rule in `assets/js/publication-filters.js`
     so the expanded card shows a concise abstract.
   - Keep theme membership and match scores explicit in
     `data-pub-theme-scores`; do not infer them from title keywords at runtime.

### Publication videos

The homepage highlights Honeycomb-Surfels, FurE, and Can These Views Be One
Scene? with locally served videos. Previews have playback controls; the
homepage and publication lists leave playback to the reader. Use `muted`, `playsinline`, and
`preload="metadata"`, plus a descriptive `aria-label` and a poster when available.
Keep canonical and static thematic publication copies consistent.

- `assets/video/honeycomb-surfels-preview.mp4` (4,194,320 bytes): the kitchen
  novel-view render from the [Honeycomb-Surfels project](https://honeycomb-surfels.github.io/).
  Its source is the public media bucket configured in the project's
  `static/js/config.js`, key `nvs/mipnerf360/kitchen/ours.mp4`, media version 2.
- `assets/img/publications/honeycomb-surfels-preview.jpg` (168,655 bytes):
  the corresponding 1078×720 project poster.
- `assets/video/fure-preview.mp4`: the existing compressed copy of the fox
  wind animation shown on the [FurE project](https://toshi2k2.github.io/fure/#motion).
  Reuse this web preview instead of embedding the 301 MB original.
- `assets/img/publications/fure-preview.webp` (248,026 bytes): the project's
  1920×1080 fox-wind poster, from `assets/images/fox-wind-poster.webp`.
- `assets/video/can-these-views-gaussian-noise.mp4`: the existing multiview
  consistency example; keep its current project and paper links.

### Invited talks

The complete selected list lives at `misc/index.html#talks`; the homepage
summarizes 2026 university and industry hosts. The newly supplied MIT, Brown,
Apple, Honda Research, Amazon Prime Video, Samsung Research, and Amazon AGI
entries use the speaker-confirmed year. MIT and Apple each represent two talks.
Add exact dates or titles only when verified; keep email addresses, calendar
event links, and private invitation details out of the public page.

### 3) Change the Photo

The headshot is in the hero sidebar on the home page:

```html
<img src="/assets/img/prof_pic.jpg" alt="Prakhar Kaushik portrait">
```

To update:
1) Replace `assets/img/prof_pic.jpg` with a new image (same filename), or
2) Update the `src` in `index.html` to a new file.

For best results, use a portrait‑friendly crop (roughly 4:5 or 1:1).

### 4) Add/Change Social Media Links

Social links are repeated in the header of each page inside:

```html
<div class="utility-links" aria-label="Secondary">...</div>
```

Pages to update:
- `index.html`
- `research/index.html`
- `publications/index.html`
- `misc/index.html`
- `contact/index.html`

Example:
```html
<a href="https://www.linkedin.com/in/your-handle"
   rel="external noopener" target="_blank">LinkedIn</a>
```

Keep the theme toggle button in this same block, ideally at the far right:

```html
<button class="theme-toggle" type="button" data-theme-toggle aria-label="Toggle theme">
  <span class="theme-toggle-label" data-theme-label>Light</span>
</button>
```

## Theme Toggle (Light/Dark)

The theme toggle uses `assets/js/theme-toggle.js` and sets:

```html
<html data-theme="light"> ... </html>
```

Dark theme variables are defined in `assets/css/research.css` under:

```css
html[data-theme="dark"] { ... }
```

## Adding a New Page

1) Create a folder with an `index.html`, e.g., `newpage/index.html`.
2) Copy the header/footer from an existing page.
3) Add the new page to the nav list in every page header.

## Notes

- The site uses a single shared stylesheet: `assets/css/research.css`.
- The “news” legacy page (`news/index.html`) still uses the older theme; update
  or restyle it if you want consistency across the site.
