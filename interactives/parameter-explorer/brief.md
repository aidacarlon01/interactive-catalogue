**Purpose.** Let the learner feel how a single parameter changes an outcome by moving a control and watching a chart respond immediately, rather than reading about the relationship.

**Layout.** A heading "Parameter explorer" and a one-sentence intro. Below, a controls panel holding one labelled range slider ("Placeholder parameter (smoothing window, 1–10)") and two number-chip presets ("2" and "8") behind a "Presets:" label. Below the controls, a hand-drawn inline SVG chart: 12 fixed placeholder data points drawn as light grey bars, with a blue moving-average line and dots drawn over them, plus axes, three gridlines and axis labels. Below the chart, a live readout line: "Value: N — placeholder consequence text…" followed by a text alternative sentence stating the smoothed line's current range.

**Interaction.** Dragging the slider (or using arrow keys on it — it is a native range input with a visible focus ring) recomputes the moving-average line for the chosen window and redraws it; the bars never change. Clicking a preset chip sets the slider to that value; the chip shows a pressed state with a tick icon while the slider matches its value. Every change updates the readout (aria-live polite) and re-reports the document height.

**States.** Ten — one per slider value, 1 to 10. Default is 3. The chart is `aria-hidden`; the readout line is the accessible equivalent and changes with every state. No state is terminal; the learner can move freely.

**Content.** Placeholder throughout. Placeholder labels used: "Placeholder parameter (smoothing window, 1–10)", "Presets:", preset chips "2" and "8", fixed data series 3 5 4 7 6 8 5 9 7 10 8 6, axis caption "Placeholder data point", readout "Value: N — placeholder consequence text…" with three canned consequence sentences (small / moderate / large window), and the range sentence "The smoothed line over the 12 fixed placeholder points now ranges from X to Y."

**Slug.** `parameter-explorer`

**Target.** Practice — scratch page only.
