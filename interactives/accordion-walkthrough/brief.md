**Purpose.** Give the learner a sequence of steps they can work through one at a time, reading the detail and a short activity for each without the others competing for attention.

**Layout.** A heading "Accordion walkthrough" and a one-sentence intro. Below, a single bordered accordion of four numbered rows. Each row header carries a numbered circle badge, a bold title with a short dash-separated description ("1 Placeholder step one — short description of step one"), and a chevron at the right. The open row's body holds one short paragraph and a "Try it" callout strip (icon, "Try it" label, one-line activity prompt).

**Interaction.** Clicking a closed row header opens it and closes whichever row was open; clicking the open row's header closes it. The chevron flips when a row opens, and the open header inverts to the dominant brand colour. Keyboard: headers are native buttons, Enter or Space toggles, arrow up/down (plus Home/End) move focus between the four headers. Each toggle re-reports the document height.

**States.** Four rows; at most one open at a time, zero open is allowed. Row one is open by default. All four bodies exist in the markup; closed bodies are `hidden`. Open state is carried by `aria-expanded`, the flipped chevron, and the inverted header.

**Content.** Placeholder throughout. Labels used: "Accordion walkthrough" (h1); row titles "Placeholder step one/two/three/four — short description of step one/two/three/four"; each body a "Placeholder paragraph for step N…" sentence pair; callout label "Try it" with "Placeholder activity prompt for step N…".

**Slug.** `accordion-walkthrough`

**Target.** Practice — scratch page only.
