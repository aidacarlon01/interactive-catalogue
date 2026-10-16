#!/usr/bin/env python3
"""Build the sample course pages.

Each page body lives in src/<name>.html (authored exactly as it would be pasted
into the Canvas RCE). This script wraps every body in the Canvas-like shell and
writes <name>.html next to this file. Run: python3 sample-course/build.py
"""
from pathlib import Path
from html import escape

HERE = Path(__file__).resolve().parent
COURSE = "SAMPLE_101: Course Style Guide"
CODE = "SAMPLE_101"

# (file, page title, course-nav key)
PAGES = [
    ("index", "Welcome to the sample course", "home"),
    ("reading-content", "1. Starting point and standard", "p1"),
    ("callouts-navigation", "2. Colour and typography", "p2"),
    ("media", "3. Accessibility and structure", "p3"),
    ("interactive-activities", "4. The theme script", "p4"),
    ("about", "About this build", "about"),
]
FLOW = ["index", "reading-content", "callouts-navigation", "media", "interactive-activities"]

ICONS = {
    "account": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    "dashboard": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 15a8 8 0 1 1 16 0"/><path d="M12 15l4-5"/><circle cx="12" cy="15" r="1.5" fill="currentColor"/></svg>',
    "courses": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 5h11a3 3 0 0 1 3 3v12H7a3 3 0 0 1-3-3z"/><path d="M4 17a3 3 0 0 1 3-3h11"/></svg>',
    "calendar": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    "inbox": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/></svg>',
    "help": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"/><circle cx="12" cy="17" r=".8" fill="currentColor"/></svg>',
}
MENU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'

TEMPLATE = """<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · {course}</title>
<meta name="description" content="A sample Canvas course built on a custom WCAG 2.2 AA theme, built as a portfolio piece.">
<link rel="stylesheet" href="assets/css/theme.css">
<link rel="stylesheet" href="assets/css/shell.css">
</head>
<body class="pages show">
<a class="skip-link" href="#content">Skip to content</a>
<div class="portfolio-strip">
  <span>Portfolio piece: a sample Canvas course built on a custom theme I designed and coded (WCAG 2.2 AA).</span>
  <a href="about.html">About this build</a>
</div>
<div id="application">
  <nav class="global-nav" aria-label="Global navigation (illustration)">
    <span class="global-nav__logo" aria-hidden="true">LMS</span>
{global_items}
  </nav>
  <div class="app-main">
    <header class="app-header">
      <button class="nav-toggle" type="button" aria-controls="course-nav" aria-expanded="true" aria-label="Course navigation menu">{menu}</button>
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><a href="index.html">{code}</a></li>
          {crumb_mid}
          <li><span aria-current="page">{title}</span></li>
        </ol>
      </nav>
    </header>
    <div class="app-body">
      <nav class="course-nav" id="course-nav" aria-label="Course navigation">
        <p class="course-nav__code">{code}</p>
        <ul>
{course_items}
        </ul>
      </nav>
      <div class="content-wrap">
        <main id="content" class="ic-Layout-contentMain" tabindex="-1">
          <h1 class="page-title">{title}</h1>
          <div class="show-content user_content">
{body}
          </div>
        </main>
{footer}
      </div>
    </div>
  </div>
</div>
<script src="assets/js/theme.js"></script>
<script src="assets/js/shell.js"></script>
</body>
</html>
"""


def global_items():
    out = []
    for key, label in [("account", "Account"), ("dashboard", "Dashboard"), ("courses", "Courses"),
                       ("calendar", "Calendar"), ("inbox", "Inbox"), ("help", "Help")]:
        out.append(f'    <span class="global-nav__item" aria-hidden="true">{ICONS[key]}<span>{label}</span></span>')
    return "\n".join(out)


def course_items(active):
    items = [("home", "index.html", "Home"), ("p1", "reading-content.html", "Page 1"),
             ("p2", "callouts-navigation.html", "Page 2"), ("p3", "media.html", "Page 3"),
             ("p4", "interactive-activities.html", "Page 4"),
             None, ("about", "about.html", "About this build")]
    out = []
    for it in items:
        if it is None:
            out.append('          <li aria-hidden="true"><hr class="course-nav__sep"></li>')
            continue
        key, href, label = it
        cur = ' aria-current="page"' if key == active else ""
        out.append(f'          <li><a href="{href}"{cur}>{label}</a></li>')
    return "\n".join(out)


def footer(name):
    if name not in FLOW:
        return ""
    titles = {f: t for f, t, _ in PAGES}
    i = FLOW.index(name)
    prev_link = (f'<a href="{FLOW[i-1]}.html" aria-label="Previous: {escape(titles[FLOW[i-1]])}">&#8592; Previous</a>'
                 if i > 0 else '<span class="spacer"></span>')
    next_link = (f'<a href="{FLOW[i+1]}.html" aria-label="Next: {escape(titles[FLOW[i+1]])}">Next &#8594;</a>'
                 if i < len(FLOW) - 1 else '<span class="spacer"></span>')
    return f'        <nav class="module-footer" aria-label="Module navigation">{prev_link}{next_link}</nav>'


def main():
    for name, title, nav in PAGES:
        body = (HERE / "src" / f"{name}.html").read_text(encoding="utf-8")
        crumb_mid = ""
        html = TEMPLATE.format(
            title=escape(title), course=escape(COURSE), code=CODE,
            global_items=global_items(), menu=MENU, crumb_mid=crumb_mid,
            course_items=course_items(nav), body=body.rstrip(), footer=footer(name),
        )
        (HERE / f"{name}.html").write_text(html, encoding="utf-8")
        print("wrote", f"{name}.html")


if __name__ == "__main__":
    main()
