const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export class BracketRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const method = request.method.toUpperCase();

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (method === "GET") {
      const snapshot = await this.state.storage.get("snapshot");

      if (!snapshot) {
        return jsonResponse({ error: "Snapshot not found" }, 404);
      }

      return jsonResponse(snapshot);
    }

    if (method === "PUT" || method === "PATCH") {
      const payload = await request.json().catch(() => null);
      const snapshot = normalizeSnapshot(payload);

      if (!snapshot) {
        return jsonResponse({ error: "Invalid snapshot" }, 400);
      }

      await this.state.storage.put("snapshot", snapshot);
      return jsonResponse(snapshot);
    }

    if (method === "DELETE") {
      await this.state.storage.delete("snapshot");
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ error: "Method not allowed" }, 405);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method.toUpperCase() === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const code = extractLodCode(url.pathname, url.searchParams.get("lod"));
    if (!code) {
      return jsonResponse(
        {
          error: "Missing LOD code",
          hint: "Use /api/lod/ABC123 or /api?lod=ABC123",
        },
        400,
      );
    }

    const roomId = env.BRACKET_ROOMS.idFromName(code);
    const stub = env.BRACKET_ROOMS.get(roomId);
    const targetUrl = new URL(request.url);
    targetUrl.pathname = `/api/lod/${code}`;

    const response = await stub.fetch(new Request(targetUrl, request));
    return withCors(response);
  },
};

function extractLodCode(pathname, queryCode) {
  const fromPath = pathname.match(/^\/api\/lod\/([A-Z0-9]+)$/i)?.[1];
  const normalized = normalizeLodCode(fromPath || queryCode);
  return normalized;
}

function normalizeLodCode(value) {
  return String(value || "")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 12);
}

function normalizeSnapshot(data) {
  if (!data || typeof data !== "object") {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(data, "state")) {
    return {
      version: Number(data.version || 1),
      exportedAt: data.exportedAt || new Date().toISOString(),
      lodCode: normalizeLodCode(data.lodCode),
      state: data.state && typeof data.state === "object" ? data.state : null,
      outShots: Array.isArray(data.outShots) ? data.outShots : [],
      mysteryOut: data.mysteryOut || "",
    };
  }

  return {
    version: Number(data.version || 1),
    exportedAt: data.exportedAt || new Date().toISOString(),
    lodCode: normalizeLodCode(data.lodCode),
    state: data,
    outShots: Array.isArray(data.outShots) ? data.outShots : [],
    mysteryOut: data.mysteryOut || "",
  };
}

function jsonResponse(data, status = 200) {
  return new Response(`${JSON.stringify(data, null, 2)}\n`, {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}

async function withCors(response) {
  const headers = new Headers(response.headers);
  Object.entries(CORS_HEADERS).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
