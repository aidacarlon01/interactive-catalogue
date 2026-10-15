**Purpose.** Walk the learner through a four-stage cyclical process in order, while letting them jump to any stage directly.

**Layout.** A heading "Tabs and stage stepper" with a one-line intro. Below it, four numbered stage tabs in a row (two-by-two on narrow screens), each with a numbered circle and a label. Below the tabs, one stage panel carrying an eyebrow, a step heading, a body paragraph, and a bulleted detail list. Under the panel, Previous and Next buttons with a loop-back note alongside.

**Interaction.** Clicking a tab shows its stage panel. Next advances one stage and, from stage four, loops back to stage one (the note explains the cycle repeats); Previous steps back one stage and is disabled on stage one. Keyboard: the tabs follow the ARIA tab pattern with roving tabindex — arrow keys move and select (wrapping), Home and End jump to the ends, Enter or Space activates.

**States.** Four — one per stage. Exactly one panel visible at a time; stage one is the default. All four panels exist in the markup. The selected tab is filled and carries a tick marker as the non-colour cue; Previous has an enabled and a disabled state.

**Content.** Placeholder throughout. Labels used: tabs "1 Placeholder stage one" … "4 Placeholder stage four"; panel eyebrows "STAGE ONE" … "STAGE FOUR"; headings "Placeholder step heading one" … four; each panel has one placeholder body paragraph and three placeholder detail points; buttons "Previous" and "Next"; loop-back note "After stage four, next loops back to stage one — the cycle repeats."

**Slug.** `tabs-stepper`

**Target.** Practice — scratch page only.
