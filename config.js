const isLocalLodDevelopment = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
window.BRACKET_API_BASE_URLS = isLocalLodDevelopment
  ? [
      "http://127.0.0.1:8788",
      "https://lod-bracket-api.lod-bracket.workers.dev",
      "https://lod-bracket.pages.dev",
    ]
  : [
      "https://lod-bracket-api.lod-bracket.workers.dev",
      "https://lod-bracket.pages.dev",
    ];
window.BRACKET_API_BASE_URL = window.BRACKET_API_BASE_URLS[0];
window.LOD_AUTH_API_BASE_URL = window.BRACKET_API_BASE_URL;
window.BRACKET_API_POLL_MS = 10000;
