# LOD Bracket

Tournament bracket builder, player portal, out shots, and tools.

## GitHub Pages

This folder is set up to deploy as a GitHub Pages site through GitHub Actions.

1. Push the repo to GitHub.
2. In the repo settings, open `Pages`.
3. Set `Build and deployment` to `GitHub Actions`.
4. Push to `main` or run the workflow manually.

The public site opens the player portal by default. The admin builder is at `bracket.html`.

Each tournament gets its own LOD code. The player portal uses:

`portal.html?lod=ABC123`

The admin page shows the code, a copyable portal link, and a QR code for that same URL.

To publish bracket updates, download the code-specific snapshot from the admin page. The file name will be `lod-ABC123.json`, and the portal will load that file for the matching code.

For live updates, the repo also includes a small Cloudflare Worker API in [`api/`](api/). Deploy it with Wrangler, set `window.BRACKET_API_BASE_URL` in [`config.js`](config.js), and the admin page will publish bracket changes while the portal polls and refreshes automatically.

## Live updates

GitHub Pages only hosts the front end. To make the QR-linked portal update live, deploy the Worker in `api/` to Cloudflare and then set `window.BRACKET_API_BASE_URL` in `config.js` to the deployed Worker URL, for example:

```js
window.BRACKET_API_BASE_URL = "https://bracket-api.your-subdomain.workers.dev";
window.BRACKET_API_POLL_MS = 5000;
```

Then:

1. Deploy the Worker with `npx wrangler deploy` from `api/`.
2. Paste the Worker URL into `config.js`.
3. Commit and push the repo to GitHub.
4. Keep using the same QR code; the portal URL stays `portal.html?lod=ABC123`.

The admin page will publish bracket state to the Worker automatically, and the portal will poll for changes.
