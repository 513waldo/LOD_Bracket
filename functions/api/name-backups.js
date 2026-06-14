const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const bracketState = getBracketStateBinding(env);
  if (!bracketState) {
    return jsonResponse({ error: "Missing BRACKET_STATE binding" }, 500);
  }

  if (method === "GET") {
    const record = await bracketState.get(nameBackupsKey(), { type: "json" });
    return jsonResponse(normalizeGlobalNameBackupsRecord(record));
  }

  if (method === "PUT" || method === "PATCH") {
    const payload = await request.json().catch(() => null);
    const record = {
      version: 1,
      updatedAt: String(payload?.updatedAt || new Date().toISOString()),
      backups: normalizeNameBackupsPayload(payload),
    };
    await bracketState.put(nameBackupsKey(), JSON.stringify(record));
    return jsonResponse(record);
  }

  if (method === "DELETE") {
    await bracketState.delete(nameBackupsKey());
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ error: "Method not allowed" }, 405);
}

function getBracketStateBinding(env) {
  return env?.BRACKET_STATE || env?.lod_bracket_state || env?.lodBracketState || null;
}

function nameBackupsKey() {
  return "shared-name-backups";
}

function normalizeGlobalNameBackupsRecord(record) {
  if (!record || typeof record !== "object") {
    return {
      version: 1,
      updatedAt: "",
      backups: [],
    };
  }

  return {
    version: Number(record.version || 1),
    updatedAt: record.updatedAt || "",
    backups: normalizeNameBackupsPayload(record.backups),
  };
}

function normalizeNameBackupsPayload(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry) => {
    if (!entry || typeof entry !== "object" || !entry.id) {
      return null;
    }

    const names = entry.names && typeof entry.names === "object" ? entry.names : {};

    return {
      id: String(entry.id),
      createdAt: String(entry.createdAt || new Date().toISOString()),
      playerCount: Math.max(0, Math.floor(Number(entry.playerCount) || 0)),
      barName: String(entry.barName || ""),
      names,
    };
  }).filter(Boolean);
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
