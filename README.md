# Blue Atlas

An original, static ocean-conservation research portal inspired by the immersive editorial structure of the reference site. The brand, writing, page layouts, and code are original. Ocean and reef photographs are stored locally in `assets/picture/` so page imagery does not depend on third-party image servers at runtime.

## Pages

- `index.html` — overview, research questions, study-region illustration, timeline, and field updates
- `science.html` — research approach, methods, systems framework, and working principles
- `research.html` — long-form research briefs, illustrative study regions, glossary, and learning resources
- `field-notes.html` — editorial field note, observation prompts, and partner-centered research practice
- `lab-portal/index.html` — standalone interactive lab with a coastal wave-concept model and local observation notebook
- `lab-portal/more-html/field-guide.html` — standalone coastal observation guide
- `lab-portal/css/lab.css` and `lab-portal/js/lab.js` — lab-only styles and interactive behavior

## Run locally

From this directory, serve the files with any static HTTP server, for example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to Vercel

Import this directory as a Vercel project. It is a static site and needs no build command or framework preset. `vercel.json` enables clean URLs and long-lived caching for local assets.

## Content and image notes

Blue Atlas is a fictional educational concept, not a real research institution, monitoring program, or dataset. Research briefs are original explanatory summaries and are not peer-reviewed findings or site-specific advice. Suggested citations are included in the portal for further reading. Photography is downloaded from Unsplash; see the [Unsplash License](https://unsplash.com/license). Images are local, while web fonts are loaded from Google Fonts.

## Local photography

- `assets/picture/open-ocean.jpg` — Unsplash photo `1518837695005-2083093ee35b`
- `assets/picture/coral-reef.jpg` — Unsplash photo `1546026423-cc4642628d2b`
- `assets/picture/diver-reef.jpg` — Unsplash photo `1544551763-46a013bb70d5`
- `assets/picture/tidal-water.jpg` — Unsplash photo `1500375592092-40eb2168fd21`
- `assets/picture/blue-coast.jpg` — Unsplash photo `1559827260-dc66d52bef19`
- `assets/picture/tropical-coast.jpg` — Unsplash photo `1505142468610-359e7d316be0`

The lab wave model is a simplified educational visualization, not a calibrated forecast or site-specific impact assessment. Notebook observations are stored in browser local storage and can be exported as CSV. Controls use the [Velore 1.0.0 liquid-glass CSS package](https://www.npmjs.com/package/velore) from a version-pinned [UNPKG CDN](https://unpkg.com/velore@1.0.0/velore.css), with Subresource Integrity and local CSS fallbacks for CDN failure and browsers without `backdrop-filter` support. Velore's MIT license permits this stylesheet-only use without its React components.
