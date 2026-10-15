**Purpose.** Make the learner commit to a prediction before seeing a result, so the reveal confirms or corrects a genuine guess instead of being passively read.

**Layout.** A heading "Predict, then reveal" and a one-sentence intro. Three stacked sections: "1. Source tables" — two small side-by-side placeholder tables of 4 data rows each (Table A: id 1–4 with value_a; Table B: id 2–5 with value_b); "2. Predict" — the question line "How many rows will the placeholder operation return?", five numeric answer chips (3, 4, 5, 6, 7) and a "Reveal result" button, disabled at rest; "3. Result" — hidden at rest. Below everything, a progress line: one dot and the text "0 of 1 completed".

**Interaction.** Clicking a chip selects it (pressed state with a tick icon) and enables "Reveal result". Clicking reveal shows the result section: a 5-row result table, a verdict line with icon — a tick icon and "Correct — your prediction of N rows matched the result." on a match, a cross icon and "Not quite — you predicted N rows, but the result has 5." otherwise — a one-line explanation, and a "Restart" button. After reveal the chips lock and the progress line becomes a filled dot with "1 of 1 completed". Restart clears the selection, hides the result, disables reveal, resets progress and moves focus to the first chip. All buttons are native and keyboard operable; every change re-reports the document height.

**States.** Three — unanswered (default: no chip pressed, reveal disabled, result hidden), predicted (one chip pressed, reveal enabled), revealed (result shown with matched or not-matched verdict, chips locked, progress 1 of 1). Exactly one chip can be pressed. The correct answer is 5. The result section exists in the markup and uses the `hidden` attribute; verdict is carried by text plus icon, not colour alone.

**Content.** Placeholder throughout. Placeholder labels used: "Table A (placeholder)" and "Table B (placeholder)" with values alpha–hotel, "Result table (placeholder)", question "How many rows will the placeholder operation return?", chips "3"–"7", buttons "Reveal result" and "Restart", explanation "The placeholder operation keeps one row per distinct id across both tables — ids 2, 3 and 4 appear in both, so 8 input rows become 5 result rows.", progress "0 of 1 completed" / "1 of 1 completed".

**Slug.** `predict-reveal`

**Target.** Practice — scratch page only.
