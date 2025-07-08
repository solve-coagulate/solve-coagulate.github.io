# Guidance for Repository Agents

- Keep this AGENTS.md file up to date.
- Record anything surprising or noteworthy for future agents.
- Microeconomics topics have individual HTML pages linked from the index (2025-06).
- The `docs/webapps/` folder holds small apps. The diet tracker may include separate JS and CSS files and is linked from the site index (2025-06). The diet tracker currently uses `app.js` and `style.css` (2025-07).
- Basic unit tests for the diet tracker live under
  `docs/webapps/diet-tracker/tests/` and can be run with `npm test` (2025-07).
- `scaleEntry` in the diet tracker parses the last numeric value from the unit
  string to handle cases like `"1 cup (250g)"` (2025-07).

