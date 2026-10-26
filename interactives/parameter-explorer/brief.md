**Interaction name:** `parameter-explorer`

**Purpose.** Let the learner feel how a single parameter changes an outcome by moving a control and watching a chart respond immediately, rather than reading about the relationship.

**Content** — complete each slot with your material. The interaction's built-in labels and prompts stay as they are.

Title: …
Body copy (intro): …

Parameter label (name and range, e.g. "Smoothing window, 1–10"): …
Preset values (two): …
Fixed data series (the values the chart draws): …
Axis caption: …
Consequence text — low values: …
Consequence text — mid values: …
Consequence text — high values: …

This interaction takes one parameter; the data series can hold up to 20 points.

When the content is complete: copy and paste the whole brief into the SB and assign a CU ticket.

---

**Technical details for the LT** — don't update unless you want the interaction to behave differently.

**Layout.** The title with the body copy beneath. Below, a controls panel holding one labelled range slider and two number-chip presets behind a "Presets:" label. Below the controls, an inline SVG chart: the fixed data points drawn as light grey bars, with a blue computed line and dots drawn over them, plus axes, gridlines and axis labels. Below the chart, a live readout line: "Value: N — consequence text…" followed by a text alternative sentence stating the computed line's current range.

**Interaction.** Dragging the slider (or using arrow keys on it — it is a native range input with a visible focus ring) recomputes the line for the chosen value and redraws it; the bars never change. Clicking a preset chip sets the slider to that value; the chip shows a pressed state with a tick icon while the slider matches its value. Every change updates the readout (aria-live polite) and re-reports the document height.

**States.** One per slider value across the parameter's range. The chart is `aria-hidden`; the readout line is the accessible equivalent and changes with every state. No state is terminal; the learner can move freely.
