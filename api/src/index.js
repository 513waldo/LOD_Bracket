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

      if (isExpiredSnapshot(snapshot)) {
        await this.state.storage.delete("snapshot");
        return jsonResponse({ error: "EXPIRED CODE" }, 410);
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

    if (isRegistryRequest(url.pathname)) {
      if (request.method.toUpperCase() !== "GET") {
        return jsonResponse({ error: "Method not allowed" }, 405);
      }

      const response = await getRegistryStub(env).fetch(
        new Request("https://registry/api/lod/index", { method: "GET" }),
      );
      return withCors(response);
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
    const method = request.method.toUpperCase();
    const payload = method === "PUT" || method === "PATCH"
      ? await request.clone().json().catch(() => null)
      : null;

    const response = await stub.fetch(new Request(targetUrl, request));

    if (method === "GET" && response.status === 410) {
      await updateRegistry(env, code, false);
    }

    if (method === "PUT" || method === "PATCH") {
      const snapshot = normalizeSnapshot(payload);
      if (snapshot) {
        await updateRegistry(env, snapshot.lodCode || code, true);
      }
    } else if (method === "DELETE") {
      await updateRegistry(env, code, false);
    }

    return withCors(response);
  },
};

function isRegistryRequest(pathname) {
  return pathname === "/api/lod" || pathname === "/api/lod/" || pathname === "/api/lod/index";
}

function extractLodCode(pathname, queryCode) {
  const fromPath = pathname.match(/^\/api\/lod\/([A-Z0-9]+)$/i)?.[1];
  const normalized = normalizeLodCode(fromPath || queryCode);
  return normalized;
}

function getRegistryStub(env) {
  const roomId = env.BRACKET_ROOMS.idFromName("__registry__");
  return env.BRACKET_ROOMS.get(roomId);
}

async function readRegistry(env) {
  const response = await getRegistryStub(env).fetch(
    new Request("https://registry/api/lod/index", { method: "GET" }),
  );

  if (!response.ok) {
    return { version: 1, updatedAt: "", codes: [] };
  }

  const registry = await response.json().catch(() => null);
  if (!registry || typeof registry !== "object") {
    return { version: 1, updatedAt: "", codes: [] };
  }

  return {
    version: Number(registry.version || 1),
    updatedAt: registry.updatedAt || "",
    codes: Array.isArray(registry.codes) ? registry.codes.map(normalizeLodCode).filter(Boolean) : [],
  };
}

async function updateRegistry(env, code, add = true) {
  const normalized = normalizeLodCode(code);
  if (!normalized) {
    return;
  }

  const registry = await readRegistry(env);
  const codes = new Set(registry.codes || []);
  if (add) {
    codes.add(normalized);
  } else {
    codes.delete(normalized);
  }

  const updatedRegistry = {
    version: 1,
    updatedAt: new Date().toISOString(),
    codes: Array.from(codes).sort(),
  };

  await getRegistryStub(env).fetch(
    new Request("https://registry/api/lod/index", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(updatedRegistry),
    }),
  );
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
      expiresAt: Number(data.expiresAt || 0) || 0,
      portalNotice: String(data.portalNotice || ""),
      portalNoticeAt: String(data.portalNoticeAt || ""),
      portalAutoNotice: String(data.portalAutoNotice || ""),
      portalAutoNoticeAt: String(data.portalAutoNoticeAt || ""),
      portalBullshootNotice: String(data.portalBullshootNotice || ""),
      portalBullshootNoticeAt: String(data.portalBullshootNoticeAt || ""),
      state: data.state && typeof data.state === "object" ? data.state : null,
      outShots: Array.isArray(data.outShots) ? data.outShots : [],
      mysteryOut: data.mysteryOut || "",
    };
  }

  return {
    version: Number(data.version || 1),
    exportedAt: data.exportedAt || new Date().toISOString(),
    lodCode: normalizeLodCode(data.lodCode),
    expiresAt: Number(data.expiresAt || 0) || 0,
    portalNotice: String(data.portalNotice || ""),
    portalNoticeAt: String(data.portalNoticeAt || ""),
    portalAutoNotice: String(data.portalAutoNotice || ""),
    portalAutoNoticeAt: String(data.portalAutoNoticeAt || ""),
    portalBullshootNotice: String(data.portalBullshootNotice || ""),
    portalBullshootNoticeAt: String(data.portalBullshootNoticeAt || ""),
    state: data,
    outShots: Array.isArray(data.outShots) ? data.outShots : [],
    mysteryOut: data.mysteryOut || "",
  };
}

function isExpiredSnapshot(snapshot) {
  const expiresAt = Number(snapshot?.expiresAt || 0);
  return Number.isFinite(expiresAt) && expiresAt > 0 && expiresAt <= Date.now();
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
