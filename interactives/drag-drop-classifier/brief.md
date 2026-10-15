**Purpose.** Give the learner a way to practise classifying items by sorting scenario cards into labelled category zones and getting per-card feedback on where each one belongs.

**Layout.** A heading and a one-paragraph intro. Below it, a dashed tray holding four scenario cards in a two-column grid, each card showing a title, one line of text, and a visible "Assign to zone" select menu. Below the tray, a 2×2 grid of labelled drop zones, each with a one-line definition and a dashed drop area. Under the grid, two buttons — "Check my answers" and "Return to tray / Restart" — and a status line. At narrow widths the tray and the zone grid each collapse to one column.

**Interaction.** The learner drags a card from the tray into any zone's drop area (HTML5 drag events); the target shows a thicker solid border while a drag hovers it. Every card also carries a visible "Assign to zone" select that moves the card to the chosen zone or back to the tray — the mandatory keyboard and touch path, mirroring the real course pattern. "Check my answers" reveals a feedback line inside each card: a tick or cross icon plus text naming the zone the card belongs in (never colour alone), and the status line announces the score. Moving a card or changing its select clears that card's feedback. "Return to tray / Restart" sends all cards back to the tray and clears all feedback. A polite live region announces each move.

**States.** Each of the four cards is in exactly one of five containers — the tray or one of the four zones — all cards in the tray by default. Each card's feedback is hidden, correct (tick), or incorrect/not-placed (cross); all hidden by default. Checking can happen at any time, including with cards still in the tray.

**Content.** Placeholder throughout. Labels used: heading "Drag-and-drop classifier"; cards "Placeholder scenario A/B/C/D", each with "One line of placeholder text describing scenario A/B/C/D."; zones "Placeholder zone one/two/three/four", each with "A one-line placeholder definition of zone one/two/three/four."; select options "Tray (not placed)" plus the four zone names; buttons "Check my answers" and "Return to tray / Restart". Correct mapping is A→one, B→two, C→three, D→four — swap the mapping with the real content.

**Slug.** `drag-drop-classifier`

**Target.** Practice — scratch page only.
