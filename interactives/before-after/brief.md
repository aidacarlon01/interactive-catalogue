**Purpose.** Let the learner compare a poor version and an improved version of the same thing in place, so the specific issues and the fixes that address them are seen side by side rather than described in the abstract.

**Layout.** A heading "Before and after comparison" and a one-sentence intro. Below, a segmented toggle with two options: "1 Before — poor example" and "2 After — improved example". Below the toggle, one panel. The before panel holds a text tag "POOR EXAMPLE", a fake mini-dashboard mock built from grey placeholder boxes (a row of five labelled widget boxes, then three further rows of unlabelled boxes of mixed sizes — deliberately cluttered), and a list of three issue notes, each with a cross icon. The after panel holds a text tag "IMPROVED", a cleaned mock (one blue-outlined headline box plus four supporting boxes), and a list of three fix notes, each with a tick icon.

**Interaction.** Clicking a toggle option shows its panel and hides the other. Keyboard: the toggle is an ARIA tablist with roving tabindex — Left/Right (and Up/Down, Home, End) arrow keys move and select, Tab leaves the group. A tick icon appears on the selected option. Each switch re-reports the document height.

**States.** Two — before and after. Exactly one visible at a time; before is the default. Both panels exist in the markup; the hidden one uses the `hidden` attribute. State is carried by the text tags ("POOR EXAMPLE" / "IMPROVED") and the toggle tick, not by colour alone.

**Content.** Placeholder throughout. Placeholder labels used: "Placeholder widget A", "Widget B"–"Widget E", "Placeholder headline metric", "Supporting A"–"Supporting D", "Issue 1"–"Issue 3" ("placeholder note about…"), "Fix 1"–"Fix 3" ("placeholder note about…"), tags "POOR EXAMPLE" and "IMPROVED".

**Slug.** `before-after`

**Target.** Practice — scratch page only.
