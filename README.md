# Blue Atlas

An original, static ocean-conservation research portal inspired by the immersive editorial structure of the reference site. The brand, writing, page layouts, and code are original; the photography is loaded from Unsplash URLs.

## Pages

- `index.html` — overview, research questions, study-region illustration, timeline, and field updates
- `science.html` — research approach, methods, systems framework, and working principles
- `research.html` — long-form research briefs, illustrative study regions, glossary, and learning resources
- `field-notes.html` — editorial field note, observation prompts, and partner-centered research practice

## Run locally

From this directory, serve the files with any static HTTP server, for example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to Vercel

Import this directory as a Vercel project. It is a static site and needs no build command or framework preset. `vercel.json` enables clean URLs and long-lived caching for local assets.

## Content and image notes

Blue Atlas is a fictional educational concept, not a real research institution, monitoring program, or dataset. Research briefs are original explanatory summaries and are not peer-reviewed findings or site-specific advice. Suggested citations are included in the portal for further reading. Images load from Unsplash and require an internet connection.
