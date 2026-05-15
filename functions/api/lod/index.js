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

  if (method !== "GET") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const registry = await readRegistry(bracketState);
  return jsonResponse(registry);
}

function getBracketStateBinding(env) {
  return env?.BRACKET_STATE || env?.lod_bracket_state || env?.lodBracketState || null;
}

async function readRegistry(bracketState) {
  const codes = new Set();
  let updatedAt = "";

  if (typeof bracketState.list === "function") {
    const listing = await bracketState.list({ prefix: "lod-" }).catch(() => null);
    if (listing && Array.isArray(listing.keys)) {
      listing.keys.forEach((entry) => {
        const normalized = normalizeLodCode(entry?.name?.replace(/^lod-/, ""));
        if (normalized && normalized !== "INDEX") {
          codes.add(normalized);
        }
      });
      updatedAt = listing.list_complete ? "" : "";
    }
  }

  const registry = await bracketState.get(registryKey(), { type: "json" });
  if (registry && typeof registry === "object") {
    if (registry.updatedAt) {
      updatedAt = registry.updatedAt;
    }

    if (Array.isArray(registry.codes)) {
      registry.codes.map(normalizeLodCode).filter(Boolean).forEach((code) => {
        if (code !== "INDEX") {
          codes.add(code);
        }
      });
    }
  }

  return {
    version: 1,
    updatedAt,
    count: codes.size,
    codes: Array.from(codes).sort(),
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

function jsonResponse(data, status = 200) {
  return new Response(`${JSON.stringify(data, null, 2)}\n`, {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}
