**Purpose.** Let the learner step through a short visual sequence one scene at a time — in their own order or via a guided tour — and see at a glance which scenes they have already viewed.

**Layout.** A heading "Scene stepper" and a one-sentence intro. Below, a control row: four numbered circular scene chips on the left, and "Guided tour" and "Reset view" buttons on the right. Under the controls, a progress line ("1 of 4 scenes viewed"). Below that, a bordered stage panel showing one scene at a time: a scene heading, a placeholder diagram of labelled boxes and arrows drawn as inline SVG, and a "Takeaway" callout strip.

**Interaction.** Clicking a chip shows that scene; the chips are an ARIA tablist, so left/right arrow keys (plus Home/End) move between scenes and Enter or Space activates. "Guided tour" steps through all four scenes automatically at a fixed interval, relabelling itself "Stop tour" while running; clicking it again, clicking a chip, or "Reset view" stops it. "Reset view" returns to scene one and clears all viewed marks. Each viewed scene's chip gains a tick badge (a non-colour mark) and the progress line updates via a live region. A short opacity transition plays between scenes, disabled under prefers-reduced-motion. Every scene change re-reports the document height.

**States.** Four scenes, exactly one visible at a time; scene one is the default and counts as viewed on load. Each chip is unviewed or viewed (tick badge); the tour button is idle or running (`aria-pressed`). All four scene panels exist in the markup; hidden ones are `hidden`.

**Content.** Placeholder throughout. Labels used: "Scene stepper" (h1); scene headings "Placeholder scene one/two/three/four"; diagram box labels "Input A", "Input B", "Placeholder process", "Stage two", "Outcome one", "Outcome two", "Review", "Outcomes", "feedback loop"; callout label "Takeaway" with "Placeholder takeaway for scene N…"; buttons "Guided tour" / "Stop tour" and "Reset view"; progress "N of 4 scenes viewed".

**Slug.** `scene-stepper`

**Target.** Practice — scratch page only.
