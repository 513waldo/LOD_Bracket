const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (!env?.BRACKET_STATE) {
    return jsonResponse({ error: "Missing BRACKET_STATE binding" }, 500);
  }

  const code = normalizeLodCode(params?.code);
  if (!code) {
    return jsonResponse({ error: "Missing LOD code" }, 400);
  }

  const key = snapshotKey(code);

  if (method === "GET") {
    const snapshot = await env.BRACKET_STATE.get(key, { type: "json" });
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

    await env.BRACKET_STATE.put(key, JSON.stringify(snapshot));
    return jsonResponse(snapshot);
  }

  if (method === "DELETE") {
    await env.BRACKET_STATE.delete(key);
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ error: "Method not allowed" }, 405);
}

function snapshotKey(code) {
  return `lod-${code}`;
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
