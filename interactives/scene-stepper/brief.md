**Interaction name:** `scene-stepper`

**Purpose.** Let the learner step through a short visual sequence one scene at a time — in their own order or via a guided tour — and see at a glance which scenes they have already viewed.

**Content** — complete each slot with your material. The interaction's built-in labels and prompts stay as they are.

Title: …
Body copy (intro): …

Scene 1 heading: …
Scene 1 diagram (the boxes, arrows and labels to draw): …
Scene 1 takeaway: …

Scene 2 heading: …
Scene 2 diagram (the boxes, arrows and labels to draw): …
Scene 2 takeaway: …

(repeat the block for each scene)

You can place 2–6 scenes using this interaction.

When the content is complete: copy and paste the whole brief into the SB and assign a CU ticket.

---

**Technical details for the LT** — don't update unless you want the interaction to behave differently.

**Layout.** The title with the body copy beneath. Below, a control row: numbered circular scene chips on the left, and "Guided tour" and "Reset view" buttons on the right. Under the controls, a progress line ("x of N scenes viewed"). Below that, a bordered stage panel showing one scene at a time: the scene heading, its diagram of labelled boxes and arrows drawn as inline SVG, and a "Takeaway" callout strip.

**Interaction.** Clicking a chip shows that scene; the chips are an ARIA tablist, so left/right arrow keys (plus Home/End) move between scenes and Enter or Space activates. "Guided tour" steps through all scenes automatically at a fixed interval, relabelling itself "Stop tour" while running; clicking it again, clicking a chip, or "Reset view" stops it. "Reset view" returns to scene one and clears all viewed marks. Each viewed scene's chip gains a tick badge (a non-colour mark) and the progress line updates via a live region. A short opacity transition plays between scenes, disabled under prefers-reduced-motion. Every scene change re-reports the document height.

**States.** Exactly one scene visible at a time; scene one is the default and counts as viewed on load. Each chip is unviewed or viewed (tick badge); the tour button is idle or running (`aria-pressed`). All scene panels exist in the markup; hidden ones are `hidden`.
