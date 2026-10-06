# Hideki Builder website

A small static developer/publisher website for Hideki Builder. HTML, CSS, and a small appearance switcher; no package install or build is required. GitHub Pages serves the root of main. No custom domain is configured.

## Pages

- / — brand and app cards
- /readorbit/ — overview, getting started, support, beta limitations
- /readorbit/privacy/ — privacy draft, marked for review
- /contact/ — contact availability and support direction
- /404.html — missing-page recovery

## Local preview and checks

Use an existing Node.js installation:

```sh
node scripts/check.mjs
node scripts/serve.mjs
```

Open the printed localhost address. Test mobile widths, light/dark appearance, keyboard focus, and reduced motion. Temporary screenshots/reports belong in ignored test-output.

## Adding an app

Add another article.app-card in index.html's app-grid. Reuse app-copy, app-top, status, feature-tags, and button-link. Create its own app directory and separate privacy/support content; never use an unavailable download link. Add the new public route to sitemap.xml and check internal links.

## Before releasing ReadOrbit

The product is Coming soon. Public issue reporting is not yet linked because the distribution repository is private. After it becomes public, verify https://github.com/hideki-builder/ReadOrbit/issues is accessible without authentication, then replace the Coming soon text on the home and app pages with an actual link. Do not change another repository's visibility from this website task.

Add a real public contact address and confidential security contact before public release. Review the privacy draft against the release build. It summarizes the existing distribution privacy draft, with current Local/BYOK and production credential boundaries clarified; it does not promise a future hosted AI service or a provider's retention policy.

## Hosting

Expected URL: https://hideki-builder.github.io/
Repository: hideki-builder/hideki-builder.github.io
GitHub Settings → Pages → Deploy from a branch → main → /(root). The .nojekyll file keeps this a plain static site. No CNAME or deployment secret is required.

The site uses no analytics, external font downloads, embeds, or contact forms. The only browser preference written by its JavaScript is the chosen appearance. GitHub hosting has its own privacy policy.
