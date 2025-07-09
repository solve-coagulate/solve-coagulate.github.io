# solve-coagulate.github.io

This repository hosts my GitHub Pages site. All of the HTML lives in the `docs/` folder so the main branch stays tidy.

The site is intentionally simple: a single HTML file with embedded CSS. It should serve as a good starting point for customizing your personal page.

To preview locally, open `docs/index.html` in a browser. Once pushed to GitHub with Pages enabled (under **Settings → Pages** with `docs/` as the source), it will be available at:

```
https://solve-coagulate.github.io/
```

Feel free to edit the HTML or styles to make the site your own!

Small web apps are kept in the `docs/webapps/` folder. The site currently includes a diet tracker and an exercise tracker.

## Installing dependencies and running tests

This repo commits `package-lock.json`. After cloning, install dependencies with

```bash
npm ci
```

which uses the lock file to get exact versions. If you add or update packages,
run

```bash
npm install
```

to update `package-lock.json` as needed.

To execute all unit tests for the diet tracker and the exercise tracker, run:

```bash
npm test
```
