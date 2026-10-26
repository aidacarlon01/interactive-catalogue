**Interaction name:** `accordion-walkthrough`

**Purpose.** Give the learner a sequence of steps they can work through one at a time, reading the detail and a short activity for each without the others competing for attention.

**Content** — complete each slot with your material. The interaction's built-in labels and prompts stay as they are.

Title: …
Body copy (intro): …

Step 1 title: …
Step 1 short description (shown next to the title): …
Step 1 body paragraph: …
Step 1 "Try it" activity prompt: …

Step 2 title: …
Step 2 short description (shown next to the title): …
Step 2 body paragraph: …
Step 2 "Try it" activity prompt: …

(repeat the block for each step)

You can place 2–8 steps using this interaction.

When the content is complete: copy and paste the whole brief into the SB and assign a CU ticket.

---

**Technical details for the LT** — don't update unless you want the interaction to behave differently.

**Layout.** The title with the body copy beneath. Below, a single bordered accordion of numbered rows. Each row header carries a numbered circle badge, the bold step title with its short dash-separated description, and a chevron at the right. The open row's body holds the body paragraph and a "Try it" callout strip (icon, "Try it" label, the activity prompt).

**Interaction.** Clicking a closed row header opens it and closes whichever row was open; clicking the open row's header closes it. The chevron flips when a row opens, and the open header inverts to the dominant brand colour. Keyboard: headers are native buttons, Enter or Space toggles, arrow up/down (plus Home/End) move focus between the headers. Each toggle re-reports the document height.

**States.** At most one row open at a time, zero open is allowed. Row one is open by default. All bodies exist in the markup; closed bodies are `hidden`. Open state is carried by `aria-expanded`, the flipped chevron, and the inverted header.
