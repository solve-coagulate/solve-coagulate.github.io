# Guidance for Repository Agents

- Keep this AGENTS.md file up to date.
- Record anything surprising or noteworthy for future agents.
- Microeconomics topics have individual HTML pages linked from the index (2025-06).
- The `docs/webapps/` folder holds small apps. The diet tracker may include separate JS and CSS files and is linked from the site index (2025-06). The diet tracker currently uses `app.js` and `style.css` (2025-07).
- The `exercise-tracker` app lives under `docs/webapps/exercise-tracker/` as a standalone HTML page (2025-07).
- Basic unit tests for the diet tracker live under
  `docs/webapps/diet-tracker/tests/` and can be run with `npm test` (2025-07).

- A GitHub workflow `Diet Tracker Manual Tests` lets you trigger these
  tests from the Actions tab; they don't run automatically on merge yet (2025-07).

- Network access allowed; npm packages like jsdom can be installed (2025-07).
  DOM-based tests now use jsdom to load the diet tracker page (2025-07).
- `package-lock.json` is tracked again. Use `npm ci` to install from the lock
  file. Run `npm install` when adding packages to update the lock file (2025-07).
- README explains how to install dependencies and run tests using the committed
  lock file (2025-07).
