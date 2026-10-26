**Interaction name:** `labelled-diagram`

**Purpose.** Let the learner explore a diagram part by part — pointing at, tapping, or keyboarding to each numbered marker to read what that part represents, without leaving the diagram.

**Content** — complete each slot with your material. The interaction's built-in labels and prompts stay as they are.

Title: …
Body copy (intro): …

Diagram (what to draw — the figure the markers sit on): …

Part 1 name: …
Part 1 explanation: …

Part 2 name: …
Part 2 explanation: …

(repeat for each part)

You can place 2–8 numbered markers using this interaction.

When the content is complete: copy and paste the whole brief into the SB and assign a CU ticket.

---

**Technical details for the LT** — don't update unless you want the interaction to behave differently.

**Layout.** The title with the body copy beneath. Below, a bordered figure panel containing the diagram drawn as inline SVG, with numbered circular markers overlaid on its parts. Under the figure, a detail panel showing the active part's numbered name and its explanation.

**Interaction.** The markers are real buttons. Hovering, focusing, clicking, or tapping a marker reveals that part's name and explanation in the panel below, and the matching SVG part gains a thicker dashed outline. Keyboard: roving tabindex across the markers; left/right/up/down arrows (plus Home/End) move and activate, Enter or Space activates the focused marker. The panel is a polite live region.

**States.** Exactly one part active at a time; part one is active by default. The active marker is filled with an outer ring (ring = the non-colour cue) and carries `aria-pressed="true"`; all explanation blocks exist in the markup, with the inactive ones `hidden`.
