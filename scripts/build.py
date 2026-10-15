#!/usr/bin/env python3
"""Regenerate the catalogue: index.html, the per-pattern detail pages and thumbnails\nfrom interactives/<slug>/{index.html, brief.md, meta.json, shot.jpg}.\nRun: python3 scripts/build.py  (needs Pillow)."""
import json, os, re, html, shutil
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IDIR = os.path.join(ROOT, "interactives")

ORDER =["card-grid-selector","tile-explorer","tabs-stepper","accordion-walkthrough",
         "scene-stepper","before-after","parameter-explorer","drag-drop-classifier",
         "predict-reveal","code-lab","labelled-diagram"]

CSS = """
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:#fff;color:#000;font-family:'Roboto',Arial,sans-serif;font-size:16px;line-height:1.55}
.wrap{max-width:1180px;margin:0 auto;padding:28px 20px 48px}
h1,h2,h3{font-family:'Roboto Condensed',Arial,sans-serif;font-weight:700}
h1{color:#006DAE;font-size:34px;margin:0 0 8px}
a{color:#006DAE}
:focus-visible{outline:3px solid #005FCC;outline-offset:2px}
.eyebrow{font-family:'Roboto Condensed',Arial,sans-serif;text-transform:uppercase;letter-spacing:.14em;font-size:12px;font-weight:700;color:#006DAE;margin-bottom:10px}
.intro{color:#3F4041;max-width:72ch;margin:0 0 10px}
.howto{border:1px solid #E2E2E2;border-left:4px solid #006DAE;border-radius:6px;background:#F9F9F9;padding:14px 18px;margin:18px 0 30px;max-width:860px}
.howto b{color:#006DAE}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px}
.card{border:1px solid #E2E2E2;border-radius:6px;overflow:hidden;background:#fff;display:flex;flex-direction:column;text-decoration:none;color:#000;transition:box-shadow .15s ease,transform .15s ease}
.card:hover{box-shadow:0 6px 20px rgba(0,0,0,.10);transform:translateY(-2px)}
.card img{width:100%;height:auto;display:block;border-bottom:1px solid #ECECEC;background:#F9F9F9}
.card .pad{padding:14px 16px 16px}
.card h2{font-size:18px;margin:0 0 6px;color:#006DAE}
.card p{margin:0 0 10px;font-size:14px;color:#3F4041}
.badge{display:inline-block;font-family:'Roboto Condensed',Arial,sans-serif;text-transform:uppercase;letter-spacing:.06em;font-size:11.5px;font-weight:700;color:#3F4041;border:1px solid #E2E2E2;border-radius:20px;padding:3px 10px}
.back{display:inline-block;margin-bottom:14px;font-size:14px;text-decoration:none}
.cols{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:24px;align-items:start}
@media(max-width:900px){.cols{grid-template-columns:1fr}}
.frame{border:1px solid #E2E2E2;border-radius:6px;overflow:hidden}
.frame iframe{display:block;border:0;width:100%}
.framebar{display:flex;justify-content:space-between;align-items:center;background:#F5F5F5;border-bottom:1px solid #E2E2E2;padding:8px 12px;font-size:13px;color:#3F4041}
.brief{border:1px solid #E2E2E2;border-top:4px solid #006DAE;border-radius:6px;padding:18px 20px;background:#fff}
.brief h2{font-size:20px;margin:0 0 4px}
.brief .note{font-size:13px;color:#3F4041;margin:0 0 14px}
.brief p{font-size:14.5px;margin:0 0 12px}
.brief ul{margin:0 0 12px;padding-left:20px;font-size:14.5px}
.brief b.lead{color:#006DAE}
.copybtn{font-family:'Roboto Condensed',Arial,sans-serif;text-transform:uppercase;letter-spacing:.06em;font-size:13px;font-weight:700;color:#006DAE;background:#fff;border:1.5px solid #006DAE;border-radius:6px;padding:9px 16px;cursor:pointer}
.copybtn:hover{background:#006DAE;color:#fff}
.seen{border:1px solid #E2E2E2;border-radius:6px;background:#F9F9F9;padding:14px 18px;margin-top:18px;font-size:14px;color:#3F4041}
.seen b{color:#000}
footer{margin-top:40px;padding-top:16px;border-top:1px solid #E2E2E2;font-size:12.5px;color:#818181;max-width:76ch}
"""

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
<style>{css}</style>
</head>
<body>
"""

def brief_html(md):
    out = []
    lines = [l.rstrip() for l in md.strip().split("\n")]
    in_ul = False
    for l in lines:
        if not l.strip():
            if in_ul: out.append("</ul>"); in_ul = False
            continue
        if l.lstrip().startswith(("* ", "- ")):
            if not in_ul: out.append("<ul>"); in_ul = True
            out.append("<li>" + inline(l.lstrip()[2:]) + "</li>")
        else:
            if in_ul: out.append("</ul>"); in_ul = False
            out.append("<p>" + inline(l) + "</p>")
    if in_ul: out.append("</ul>")
    return "\n".join(out)

def inline(s):
    s = html.escape(s)
    s = re.sub(r"\*\*(Purpose|Layout|Interaction|States|Content|Slug|Target)\.\*\*",
               r'<b class="lead">\1.</b>', s)
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"`(.+?)`", r"<code>\1</code>", s)
    return s

cards = []
for slug in ORDER:
    meta = json.load(open(f"{IDIR}/{slug}/meta.json"))
    brief_md = open(f"{IDIR}/{slug}/brief.md").read()
    # thumbnail
    os.makedirs(f"{ROOT}/assets/thumbs", exist_ok=True)
    im = Image.open(f"{IDIR}/{slug}/shot.jpg"); im.thumbnail((640, 9999))
    im = im.crop((0, 0, im.width, min(im.height, 400)))
    im.save(f"{ROOT}/assets/thumbs/{slug}.jpg", optimize=True)

    cards.append(
      f'<a class="card" href="{slug}/">'
      f'<img src="assets/thumbs/{slug}.jpg" alt="Preview of the {html.escape(meta["title"])} placeholder interactive">'
      f'<div class="pad"><h2>{html.escape(meta["title"])}</h2>'
      f'<p>{html.escape(meta.get("oneliner",""))}</p></div></a>')

    # detail page
    os.makedirs(f"{ROOT}/{slug}", exist_ok=True)
    page = HEAD.format(title=f'{meta["title"]} — Interactive pattern catalogue', css=CSS)
    page += f"""<div class="wrap">
<a class="back" href="../">&larr; All patterns</a>
<div class="eyebrow">Interactive pattern</div>
<h1>{html.escape(meta["title"])}</h1>
<p class="intro">{html.escape(meta.get("oneliner",""))}</p>
<div class="cols">
  <div>
    <div class="frame">
      <div class="framebar"><span>Placeholder interactive — try it</span>
      <a href="../interactives/{slug}/index.html" target="_blank" rel="noopener">Open full page</a></div>
      <iframe src="../interactives/{slug}/index.html" title="{html.escape(meta["title"])} placeholder interactive" height="{meta.get("h1019", 700)}" loading="lazy"></iframe>
    </div>
  </div>
  <div class="brief">
    <h2>The brief</h2>
    <p class="note">This is the example brief for the placeholder above, in the seven-part shape a build needs. Copy it, swap the placeholder content for yours, keep the structure.</p>
    {brief_html(brief_md)}
    <button class="copybtn" id="copy">Copy brief as markdown</button>
    <script type="text/plain" id="raw">{html.escape(brief_md)}</script>
    <script>
    document.getElementById('copy').addEventListener('click', function () {{
      var raw = document.getElementById('raw').textContent;
      navigator.clipboard.writeText(raw).then(() => {{
        this.textContent = 'Copied'; setTimeout(() => this.textContent = 'Copy brief as markdown', 1600);
      }});
    }});
    </script>
  </div>
</div>
<footer>Placeholder interactive — all content is placeholder by design. Heights: {meta.get("h1019")}px at desktop width, {meta.get("h360")}px at phone width.</footer>
</div></body></html>"""
    open(f"{ROOT}/{slug}/index.html", "w").write(page)

# index page
idx = HEAD.format(title="Interactive pattern catalogue", css=CSS)
idx += f"""<div class="wrap">
<h1>Interactive pattern catalogue</h1>
<p class="intro">Each placeholder is a single self-contained HTML file using a specific programme branding style. The brief beside it is the complete specification to request the creation of one.</p>
<div class="howto"><b>How to use this:</b> <b>1.</b> Click a card and play with the placeholder. <b>2.</b> Copy its brief. <b>3.</b> Replace the placeholder content with yours &mdash; keep the seven headings, don&rsquo;t specify colours, fonts or layout mechanics. <b>4.</b> Hand the finished brief to the build process along with the name of your programme, so the relevant brand style guide is applied.</div>
<div class="grid">
{"".join(cards)}
</div>
</div></body></html>"""
open(f"{ROOT}/index.html", "w").write(idx)
print("site built:", len(cards), "cards")
