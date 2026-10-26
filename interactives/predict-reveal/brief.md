**Interaction name:** `predict-reveal`

**Purpose.** Make the learner commit to a prediction before seeing a result, so the reveal confirms or corrects a genuine guess instead of being passively read.

**Content** — complete each slot with your material. The interaction's built-in labels and prompts stay as they are.

Title: …
Body copy (intro): …

Source material (the tables or figure the learner studies before predicting): …
Prediction question: …
Answer options (one per line, 3–6 chips): …
Correct answer: …
Result (the table or outcome revealed): …
Explanation (one line, shown after the reveal): …

This interaction holds one prediction per instance.

When the content is complete: copy and paste the whole brief into the SB and assign a CU ticket.

---

**Technical details for the LT** — don't update unless you want the interaction to behave differently.

**Layout.** The title with the body copy beneath. Three stacked sections: "1. Source" — the source material; "2. Predict" — the question line, the answer chips and a "Reveal result" button, disabled at rest; "3. Result" — hidden at rest. Below everything, a progress line: one dot and the text "0 of 1 completed".

**Interaction.** Clicking a chip selects it (pressed state with a tick icon) and enables "Reveal result". Clicking reveal shows the result section: the result content, a verdict line with icon — a tick icon and "Correct — your prediction matched the result." on a match, a cross icon and "Not quite — …" naming the correct answer otherwise — the one-line explanation, and a "Restart" button. After reveal the chips lock and the progress line becomes a filled dot with "1 of 1 completed". Restart clears the selection, hides the result, disables reveal, resets progress and moves focus to the first chip. All buttons are native and keyboard operable; every change re-reports the document height.

**States.** Three — unanswered (default: no chip pressed, reveal disabled, result hidden), predicted (one chip pressed, reveal enabled), revealed (result shown with matched or not-matched verdict, chips locked, progress 1 of 1). Exactly one chip can be pressed. The result section exists in the markup and uses the `hidden` attribute; verdict is carried by text plus icon, not colour alone.
