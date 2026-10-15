**Purpose.** Give the learner a way to compare six parallel dimensions of a concept and read detail on each one without leaving the page.

**Layout.** A heading "Card-grid selector" with a one-line intro. Below it, six cards in a two-column grid (one column on narrow screens), each carrying a short name and a one-line question. Below the grid, a detail panel.

**Interaction.** Clicking a card shows its detail panel below the grid: an eyebrow label "DETAIL", the dimension name, a short explanation, and a worked example line. Keyboard: arrow keys move focus between cards (roving tabindex, wrapping), Enter or Space activates; Home and End jump to the first and last card. The grid is an ARIA tablist and the panels are tabpanels.

**States.** Six — one per card. Exactly one selected at a time; card one is the default. All six panels exist in the markup; only the selected one is shown. The selected card is filled and carries a tick badge as the non-colour cue.

**Content.** Placeholder throughout. Labels used: card names "Placeholder dimension one" … "Placeholder dimension six"; card questions "A one-line placeholder question about dimension one?" … six; panel eyebrow "DETAIL"; each panel has a short placeholder explanation and a "Worked example:" line.

**Slug.** `card-grid-selector`

**Target.** Practice — scratch page only.
