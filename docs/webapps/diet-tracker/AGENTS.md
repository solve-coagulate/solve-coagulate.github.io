# Diet Tracker Folder
- JS and CSS may be split out of `index.html` to aid testing and maintenance. The current files are `app.js` and `style.css` (2025-07).
- Update `use-cases.md` when major features change.
- Unit tests for this app live in the `tests/` subfolder and run with `npm test`.
- Helper functions are exported from `app.js` using `module.exports`; tests require this module directly.
- `scaleEntry` relies on a helper called `parseUnitNumber` to extract the first
  numeric value from a food's unit string. This keeps amounts like `"1 cup (250g)"`
  scaled using the cup measure, not the grams.
