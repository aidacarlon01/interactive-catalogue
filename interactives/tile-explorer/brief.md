**Purpose.** Encourage the learner to explore all six facets of a topic, rewarding full coverage with a completion panel, rather than letting them read only one.

**Layout.** A heading "Tile explorer" with a one-line intro. Below it, a filled feature strip carrying a headline, then a progress row (an "x of 6 explored" count, a progress bar, and a reset button). Below that, two columns on desktop: a two-by-three grid of tiles on the left (each tile has an icon, a label, and an Explore/Explored status line), and an insight panel on the right. On mobile the insight panel stacks below the tiles. At the bottom, a completion panel, hidden at rest.

**Interaction.** Clicking a tile marks it explored (status changes to "Explored" with a tick icon — the non-colour cue) and shows that tile's insight in the panel: an eyebrow, a big stat that counts up from zero (instant when reduced motion is preferred), two labelled info blocks, and a reflection block. Exploring all six reveals the completion panel with a reflection list. Reset clears all exploration and returns the insight panel to its starting prompt. Tiles are ordinary buttons in tab order; the progress count is announced via a live region.

**States.** Eight in the insight panel — a starting prompt plus one per tile, exactly one visible at a time; the starting prompt is the default. Each tile is independently unexplored or explored (explored persists until reset). The completion panel has two states, hidden until all six are explored. All panels exist in the markup.

**Content.** Placeholder throughout. Labels used: strip "Placeholder headline strip" (eyebrow "FEATURE"); progress "0 of 6 explored" and "Reset"; tiles "Placeholder tile one" … "Placeholder tile six" with statuses "Explore"/"Explored"; insight eyebrows "INSIGHT — TILE ONE" … six; placeholder stats 64, 38, 81, 27, 92, 55 (all %); info blocks "Placeholder label A" and "Placeholder label B"; reflection block "REFLECT"; completion heading "All six explored" with three placeholder reflection points.

**Slug.** `tile-explorer`

**Target.** Practice — scratch page only.
