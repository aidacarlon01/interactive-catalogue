# Sample course

A five-page sample Canvas course that shows the custom theme working the way learners
meet it: a welcome page plus four content pages linked by cards. All copy is style
guide copy; no real course content is used.

Live: https://aidacarlon01.github.io/interactive-catalogue/sample-course/

- `src/*.html` — page bodies, authored exactly as they'd be pasted into the Canvas RCE
- `assets/css/theme.css`, `assets/js/theme.js` — the production theme (JS module 1 swapped
  from the H5P resizer to a resizer for the embedded catalogue interactives)
- `assets/css/shell.css`, `assets/js/shell.js` — the Canvas-like frame for the static site
- `build.py` — wraps each body in the shell: `python3 sample-course/build.py`
