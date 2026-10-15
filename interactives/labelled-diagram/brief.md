**Purpose.** Let the learner explore a diagram part by part — pointing at, tapping, or keyboarding to each numbered marker to read what that part represents, without leaving the diagram.

**Layout.** A heading "Labelled diagram" and the intro "Hover, tap, or focus each part to see what it represents." Below, a bordered figure panel containing a generic abstract chart drawn as inline SVG — a vertical axis, four bars, a trend line, a peak data point, and a legend box — with five numbered circular markers (1–5) overlaid on those five parts. Under the figure, a detail panel showing the active part's numbered name and a short explanation.

**Interaction.** The markers are real buttons. Hovering, focusing, clicking, or tapping a marker reveals that part's name and placeholder explanation in the panel below, and the matching SVG part gains a thicker dashed outline. Keyboard: roving tabindex across the five markers; left/right/up/down arrows (plus Home/End) move and activate, Enter or Space activates the focused marker. The panel is a polite live region.

**States.** Five parts, exactly one active at a time; part one is active by default. The active marker is filled with an outer ring (ring = the non-colour cue) and carries `aria-pressed="true"`; all five explanation blocks exist in the markup, with the inactive ones `hidden`.

**Content.** Placeholder throughout. Labels used: "Labelled diagram" (h1); part names "Placeholder part one/two/three/four/five" mapped to the axis, bars, trend line, peak data point, and legend; each explanation "Placeholder explanation of part N — what the [part] represents…"; legend text "Placeholder series" and "Placeholder trend".

**Slug.** `labelled-diagram`

**Target.** Practice — scratch page only.
