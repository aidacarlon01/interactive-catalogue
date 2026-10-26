**Interaction name:** `drag-drop-classifier`

**Purpose.** Give the learner a way to practise classifying items by sorting scenario cards into labelled category zones and getting per-card feedback on where each one belongs.

**Content** — complete each slot with your material. The interaction's built-in labels and prompts stay as they are.

Title: …
Body copy (intro): …

Zone 1 name: …
Zone 1 one-line definition: …

Zone 2 name: …
Zone 2 one-line definition: …

(repeat for each zone)

Card 1 title: …
Card 1 text (one line): …
Card 1 correct zone: …

Card 2 title: …
Card 2 text (one line): …
Card 2 correct zone: …

(repeat for each card)

You can place 2–4 zones and up to 8 cards using this interaction.

When the content is complete: copy and paste the whole brief into the SB and assign a CU ticket.

---

**Technical details for the LT** — don't update unless you want the interaction to behave differently.

**Layout.** The title with the body copy beneath. Below, a dashed tray holding the scenario cards in a two-column grid, each card showing its title, one line of text, and a visible "Assign to zone" select menu. Below the tray, a grid of the labelled drop zones, each with its one-line definition and a dashed drop area. Under the grid, two buttons — "Check my answers" and "Return to tray / Restart" — and a status line. At narrow widths the tray and the zone grid each collapse to one column.

**Interaction.** The learner drags a card from the tray into any zone's drop area (HTML5 drag events); the target shows a thicker solid border while a drag hovers it. Every card also carries a visible "Assign to zone" select that moves the card to the chosen zone or back to the tray — the mandatory keyboard and touch path. "Check my answers" reveals a feedback line inside each card: a tick or cross icon plus text naming the zone the card belongs in (never colour alone), and the status line announces the score. Moving a card or changing its select clears that card's feedback. "Return to tray / Restart" sends all cards back to the tray and clears all feedback. A polite live region announces each move.

**States.** Each card is in exactly one container — the tray or one of the zones — all cards in the tray by default. Each card's feedback is hidden, correct (tick), or incorrect/not-placed (cross); all hidden by default. Checking can happen at any time, including with cards still in the tray.
