# LOD Bracket

Tournament bracket builder, player portal, out shots, and tools.

For a high-level history of how the site evolved, see [REVISION_HISTORY.md](REVISION_HISTORY.md).

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

For live updates, the repo includes both a Cloudflare Worker API in [`api/`](api/) and a Cloudflare Pages Function API in [`functions/`](functions/). You can point the front end at one or both by setting `window.BRACKET_API_BASE_URLS` in [`config.js`](config.js), and the admin page will publish bracket changes while the portal polls and refreshes automatically.

## Live updates

GitHub Pages only hosts the front end. To make the QR-linked portal update live, deploy one or both Cloudflare backends and then set `window.BRACKET_API_BASE_URLS` in `config.js`, for example:

```js
window.BRACKET_API_BASE_URLS = [
  "https://lod-bracket.pages.dev",
  "https://lod-bracket.workers.dev"
];
window.BRACKET_API_BASE_URL = window.BRACKET_API_BASE_URLS[0];
window.BRACKET_API_POLL_MS = 5000;
```

Then:

1. Deploy the Worker with `npx wrangler deploy` from `api/` if you want the Worker fallback.
2. Create a Cloudflare Pages project for the repo if you want the Pages API.
3. Bind a KV namespace named `BRACKET_STATE` to the Pages project.
4. Put the Pages URL first in `window.BRACKET_API_BASE_URLS`, then keep the Worker URL as fallback.
5. Commit and push the repo to GitHub.
6. Keep using the same QR code; the portal URL stays `portal.html?lod=ABC123`.

The admin page will publish bracket state to every configured host, and the portal will poll until one of them responds.
