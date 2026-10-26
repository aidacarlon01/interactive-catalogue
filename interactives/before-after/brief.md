**Interaction name:** `before-after`

**Purpose.** Let the learner compare a poor version and an improved version of the same thing in place, so the specific issues and the fixes that address them are seen side by side rather than described in the abstract.

**Content** — complete each slot with your material. The interaction's built-in labels and prompts stay as they are.

Title: …
Body copy (intro): …

Before view — what the poor-example mock shows: …
Before view — issue notes (one per line, up to 5): …

After view — what the improved mock shows: …
After view — fix notes (one per line, up to 5): …

This interaction is fixed at two views — before and after.

When the content is complete: copy and paste the whole brief into the SB and assign a CU ticket.

---

**Technical details for the LT** — don't update unless you want the interaction to behave differently.

**Layout.** The title with the body copy beneath. Below, a segmented toggle with two options: "1 Before — poor example" and "2 After — improved example". Below the toggle, one panel. The before panel holds a text tag "POOR EXAMPLE", the poor-example mock built from placeholder boxes, and the list of issue notes, each with a cross icon. The after panel holds a text tag "IMPROVED", the improved mock, and the list of fix notes, each with a tick icon.

**Interaction.** Clicking a toggle option shows its panel and hides the other. Keyboard: the toggle is an ARIA tablist with roving tabindex — Left/Right (and Up/Down, Home, End) arrow keys move and select, Tab leaves the group. A tick icon appears on the selected option. Each switch re-reports the document height.

**States.** Two — before and after. Exactly one visible at a time; before is the default. Both panels exist in the markup; the hidden one uses the `hidden` attribute. State is carried by the text tags ("POOR EXAMPLE" / "IMPROVED") and the toggle tick, not by colour alone.
