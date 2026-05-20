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

  const bracketState = getBracketStateBinding(env);
  if (!bracketState) {
    return jsonResponse({ error: "Missing BRACKET_STATE binding" }, 500);
  }

  const code = normalizeLodCode(params?.code);
  if (!code) {
    return jsonResponse({ error: "Missing LOD code" }, 400);
  }

  const key = snapshotKey(code);

  if (method === "GET") {
    const snapshot = await bracketState.get(key, { type: "json" });
    if (!snapshot) {
      return jsonResponse({ error: "Snapshot not found" }, 404);
    }

    if (isExpiredSnapshot(snapshot)) {
      await bracketState.delete(key);
      await updateRegistry(bracketState, code, false);
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

    await bracketState.put(key, JSON.stringify(snapshot));
    await updateRegistry(bracketState, snapshot.lodCode || code);
    return jsonResponse(snapshot);
  }

  if (method === "DELETE") {
    await bracketState.delete(key);
    await updateRegistry(bracketState, code, false);
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ error: "Method not allowed" }, 405);
}

function getBracketStateBinding(env) {
  return env?.BRACKET_STATE || env?.lod_bracket_state || env?.lodBracketState || null;
}

function snapshotKey(code) {
  return `lod-${code}`;
}

async function updateRegistry(bracketState, code, add = true) {
  const normalized = normalizeLodCode(code);
  if (!normalized) {
    return;
  }

  const registry = await readRegistry(bracketState);
  const existing = new Set(registry.codes || []);

  if (add) {
    existing.add(normalized);
  } else {
    existing.delete(normalized);
  }

  const updatedRegistry = {
    version: 1,
    updatedAt: new Date().toISOString(),
    codes: Array.from(existing).sort(),
  };

  await bracketState.put(registryKey(), JSON.stringify(updatedRegistry));
}

async function readRegistry(bracketState) {
  const registry = await bracketState.get(registryKey(), { type: "json" });
  if (registry && typeof registry === "object") {
    return {
      version: Number(registry.version || 1),
      updatedAt: registry.updatedAt || "",
      codes: Array.isArray(registry.codes) ? registry.codes.map(normalizeLodCode).filter(Boolean) : [],
    };
  }

  return {
    version: 1,
    updatedAt: "",
    codes: [],
  };
}

function registryKey() {
  return "lod-index";
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
