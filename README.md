# Interactive pattern catalogue

A static catalogue of the interaction patterns used in the Monash MON_DA Canvas
courses. Each card on the front page is one pattern, shown as a **placeholder
interactive** (generic content, built to the Monash interactive rules) beside the
**example brief** a colleague can copy, fill with real content, and hand to the
build process.

Live site: https://aidacarlon01.github.io/interactive-catalogue/

## Structure

- `index.html` — the card front page
- `<slug>/index.html` — one detail page per pattern: the placeholder iframed next to its brief
- `interactives/<slug>/` — the placeholder itself: `index.html` (self-contained), `brief.md`
  (seven-heading brief), `meta.json` (title, one-liner, measured heights)
- `data/patterns.json` — which real course interactives each pattern was catalogued from
- `scripts/build.py` — regenerates the front page, detail pages and thumbnails

## Adding a pattern

1. Build the placeholder to the Monash interactive rules (single self-contained HTML file).
2. Put `index.html`, `brief.md` and `meta.json` in `interactives/<new-slug>/`, plus a 1019px-wide `shot.jpg` (kept local, not committed) for the thumbnail.
3. Add the slug to `ORDER` in `scripts/build.py` and, if it maps to course examples, to `data/patterns.json`.
4. Run `python3 scripts/build.py` and commit everything.

## House rules

The placeholders follow the Monash interactive rules (fixed palette led by
Monash Blue #006DAE, Roboto/Roboto Condensed, single inline script, no external
dependencies beyond Google Fonts, content-driven height with postMessage
reporting, WCAG 2.2 AA keyboard and non-colour state cues, no Monash logo).
Briefs follow the seven-heading shape: Purpose, Layout, Interaction, States,
Content, Slug, Target.
