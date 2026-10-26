**Interaction name:** `tabs-stepper`

**Purpose.** Walk the learner through the stages of a cyclical process in order, while letting them jump to any stage directly.

**Content** — complete each slot with your material. The interaction's built-in labels and prompts stay as they are.

Title: …
Body copy (intro): …

Stage 1 tab label: …
Stage 1 heading: …
Stage 1 body paragraph: …
Stage 1 detail points (one per line, up to 3): …

Stage 2 tab label: …
Stage 2 heading: …
Stage 2 body paragraph: …
Stage 2 detail points (one per line, up to 3): …

(repeat the block for each stage)

You can place 2–5 stages using this interaction.

When the content is complete: copy and paste the whole brief into the SB and assign a CU ticket.

---

**Technical details for the LT** — don't update unless you want the interaction to behave differently.

**Layout.** The title with the body copy beneath. Below, the numbered stage tabs in a row (two-by-two on narrow screens), each with a numbered circle and its label. Below the tabs, one stage panel carrying an eyebrow, the stage heading, the body paragraph, and the bulleted detail list. Under the panel, Previous and Next buttons with a loop-back note alongside.

**Interaction.** Clicking a tab shows its stage panel. Next advances one stage and, from the last stage, loops back to stage one (the note explains the cycle repeats); Previous steps back one stage and is disabled on stage one. Keyboard: the tabs follow the ARIA tab pattern with roving tabindex — arrow keys move and select (wrapping), Home and End jump to the ends, Enter or Space activates.

**States.** One per stage. Exactly one panel visible at a time; stage one is the default. All panels exist in the markup. The selected tab is filled and carries a tick marker as the non-colour cue; Previous has an enabled and a disabled state.
