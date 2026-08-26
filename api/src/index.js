import { sendResendEmail } from "./email.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export class BracketRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const method = request.method.toUpperCase();
    const pathname = new URL(request.url).pathname;

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (pathname === "/api/admin/storage-inventory" && isDataMaintenanceAuthorized(request, this.env)) {
      return jsonResponse(await listOwnStorageRecords(this.state.storage));
    }

    if (pathname === "/api/admin/storage-reset" && isDataMaintenanceAuthorized(request, this.env)) {
      const input = await request.json().catch(() => null);
      return jsonResponse({ deleted: await deleteOwnStorageRecords(this.state.storage, input?.records) });
    }

    if (pathname.startsWith("/api/auth/")) {
      return handleAuthRequest(request, this.state.storage, this.env);
    }

    if (isNameBackupsRequest(pathname)) {
      if (method === "GET") {
        return jsonResponse(await readGlobalNameBackups(this.state.storage));
      }

      if (method === "PUT" || method === "PATCH") {
        const payload = await request.json().catch(() => null);
        const backups = normalizeGlobalNameBackupsPayload(payload);
        const record = {
          version: 1,
          updatedAt: String(payload?.updatedAt || new Date().toISOString()),
          backups,
        };
        await this.state.storage.put("nameBackups", record);
        return jsonResponse(record);
      }

      if (method === "DELETE") {
        await this.state.storage.delete("nameBackups");
        return jsonResponse({ ok: true });
      }

      return jsonResponse({ error: "Method not allowed" }, 405);
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
    const method = request.method.toUpperCase();

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (url.pathname.startsWith("/api/auth/")) {
      const authStub = env.BRACKET_ROOMS.get(env.BRACKET_ROOMS.idFromName("__auth__"));
      const targetUrl = new URL(request.url);
      targetUrl.pathname = url.pathname;
      return withCors(await authStub.fetch(new Request(targetUrl, request)));
    }

    if (url.pathname === "/api/admin/data-inventory" || url.pathname === "/api/admin/data-reset") {
      return withCors(await handleDataMaintenanceRequest(request, env));
    }

    if (url.pathname === "/api/test-email") {
      if (method !== "POST") {
        return withCors(jsonResponse({ error: "Method not allowed" }, 405));
      }

      const testToken = String(env.EMAIL_TEST_TOKEN || "").trim();
      if (!testToken || request.headers.get("x-email-test-token") !== testToken) {
        return withCors(jsonResponse({ error: "Unauthorized" }, 401));
      }

      try {
        const result = await sendResendEmail(env, {
          to: "dartwaldo513@gmail.com",
          subject: "LOD Bracket email test",
          html: "<p>Congrats on sending your <strong>first LOD Bracket email</strong>!</p>",
        });
        return withCors(jsonResponse({ ok: true, id: result?.id || "" }));
      } catch (error) {
        return withCors(jsonResponse({ error: error.message || "Email send failed" }, 502));
      }
    }

    if (isRegistryRequest(url.pathname)) {
      const registryStub = getRegistryStub(env);
      if (method === "GET") {
        const response = await registryStub.fetch(
          new Request("https://registry/api/lod/index", { method: "GET" }),
        );
        return withCors(response);
      }

      if (method === "DELETE") {
        const registry = await readRegistry(env);
        const codes = Array.isArray(registry.codes) ? registry.codes : [];

        for (const code of codes) {
          const roomId = env.BRACKET_ROOMS.idFromName(code);
          const stub = env.BRACKET_ROOMS.get(roomId);
          await stub.fetch(new Request(`https://registry/api/lod/${code}`, { method: "DELETE" }));
        }

        const clearResponse = await registryStub.fetch(
          new Request("https://registry/api/lod/index", { method: "DELETE" }),
        );
        return withCors(clearResponse);
      }

      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    if (isNameBackupsRequest(url.pathname)) {
      const nameBackupsStub = getNameBackupsStub(env);
      if (method === "GET" || method === "PUT" || method === "PATCH" || method === "DELETE") {
        const targetUrl = new URL(request.url);
        targetUrl.pathname = "/api/name-backups";
        const response = await nameBackupsStub.fetch(new Request(targetUrl, request));
        return withCors(response);
      }

      return jsonResponse({ error: "Method not allowed" }, 405);
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

async function handleAuthRequest(request, storage, env) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  if (url.pathname === "/api/auth/register" && method === "POST") {
    const input = await request.json().catch(() => null);
    const username = normalizeUsername(input?.username);
    const barName = String(input?.barName || "").trim().slice(0, 120);
    const email = String(input?.email || "").trim().toLowerCase();
    const password = String(input?.password || "");

    if (!username || !barName || !isEmail(email) || password.length < 8) {
      return jsonResponse({ error: "Enter a bar name, valid email, username, and password of at least 8 characters." }, 400);
    }

    const accountKey = `account:${username}`;
    if (await storage.get(accountKey)) {
      return jsonResponse({ error: "That username is already in use." }, 409);
    }

    const passwordRecord = await hashPassword(password);
    const verificationToken = randomToken();
    const account = {
      version: 1,
      username,
      barName,
      email,
      passwordHash: passwordRecord.hash,
      passwordSalt: passwordRecord.salt,
      verified: false,
      verificationToken,
      createdAt: new Date().toISOString(),
    };

    await storage.put(accountKey, account);
    await storage.put(`verify:${verificationToken}`, username, { expirationTtl: 86400 });

    const appBaseUrl = String(env?.APP_BASE_URL || "https://lod-bracket.pages.dev").replace(/\/$/, "");
    const verificationUrl = `${url.origin}/api/auth/verify?token=${encodeURIComponent(verificationToken)}`;

    try {
      await sendResendEmail(env, {
        to: email,
        subject: "Verify your LOD Bracket account",
        html: `<p>Thanks for creating an account for <strong>${escapeHtmlForEmail(barName)}</strong>.</p><p><a href="${verificationUrl}">Confirm your account</a></p><p>This link expires in 24 hours.</p>`,
      });
    } catch (error) {
      await storage.delete(accountKey);
      await storage.delete(`verify:${verificationToken}`);
      return jsonResponse({ error: error.message || "Could not send the verification email." }, 502);
    }

    return jsonResponse({ ok: true, verified: false, email });
  }

  if (url.pathname === "/api/auth/verify" && (method === "GET" || method === "POST")) {
    const token = String(url.searchParams.get("token") || (await request.json().catch(() => null))?.token || "").trim();
    const username = await storage.get(`verify:${token}`);
    const appBaseUrl = String(env?.APP_BASE_URL || "https://lod-bracket.pages.dev").replace(/\/$/, "");
    if (!token || !username) {
      return method === "GET"
        ? Response.redirect(`${appBaseUrl}/login.html?verified=0`, 302)
        : jsonResponse({ error: "This verification link is invalid or expired." }, 400);
    }

    const accountKey = `account:${username}`;
    const account = await storage.get(accountKey);
    if (!account) {
      return jsonResponse({ error: "Account not found." }, 404);
    }

    account.verified = true;
    account.verificationToken = "";
    await storage.put(accountKey, account);
    await storage.delete(`verify:${token}`);

    return method === "GET"
      ? Response.redirect(`${appBaseUrl}/login.html?verified=1`, 302)
      : jsonResponse({ ok: true, verified: true });
  }

  if (url.pathname === "/api/auth/login" && method === "POST") {
    const input = await request.json().catch(() => null);
    const username = normalizeUsername(input?.username);
    const password = String(input?.password || "");
    const account = await storage.get(`account:${username}`);

    if (!account || !(await verifyPassword(password, account))) {
      return jsonResponse({ error: "That username or password is not recognized." }, 401);
    }
    if (!account.verified) {
      return jsonResponse({ error: "Verify your email before signing in.", verificationRequired: true, email: account.email }, 403);
    }

    const sessionToken = randomToken();
    await storage.put(`session:${sessionToken}`, {
      username: account.username,
      barName: account.barName,
      verified: true,
    }, { expirationTtl: 604800 });

    return jsonResponse({ ok: true, sessionToken, username: account.username, barName: account.barName, verified: true });
  }

  if (url.pathname === "/api/auth/session" && method === "GET") {
    const token = String(request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
    const session = token ? await storage.get(`session:${token}`) : null;
    return session ? jsonResponse({ ok: true, ...session }) : jsonResponse({ error: "Not signed in" }, 401);
  }

  return jsonResponse({ error: "Not found" }, 404);
}

async function handleDataMaintenanceRequest(request, env) {
  if (!isDataMaintenanceAuthorized(request, env)) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const authStub = env.BRACKET_ROOMS.get(env.BRACKET_ROOMS.idFromName("__auth__"));
  const registryStub = getRegistryStub(env);
  const nameBackupsStub = getNameBackupsStub(env);
  const maintenanceToken = String(request.headers.get("x-data-reset-token") || "").trim();
  const authInventory = await listStorageRecords(authStub, maintenanceToken);
  const registry = await readRegistry(env);
  const registryInventory = await listStorageRecords(registryStub, maintenanceToken);
  const nameBackupsInventory = await listStorageRecords(nameBackupsStub, maintenanceToken);
  const lodCodes = Array.isArray(registry.codes) ? registry.codes : [];
  const lodRecords = [];

  for (const code of lodCodes) {
    const stub = env.BRACKET_ROOMS.get(env.BRACKET_ROOMS.idFromName(code));
    const inventory = await listStorageRecords(stub, maintenanceToken);
    lodRecords.push({ code, ...inventory });
  }

  const inventory = {
    auth: authInventory,
    registry: {
      durableObject: "__registry__",
      records: registryInventory.records,
      activeLodCodes: lodCodes,
    },
    nameBackups: {
      durableObject: "__global_name_backups__",
      records: nameBackupsInventory.records,
    },
    lodRecords,
    resetScope: [
      "__auth__: account:<username>, verify:<token>, session:<token>",
      "__registry__: snapshot",
      "__global_name_backups__: nameBackups",
      "<each active LOD code Durable Object>: snapshot",
    ],
  };

  if (request.method.toUpperCase() === "GET") {
    return jsonResponse(inventory);
  }

  if (request.method.toUpperCase() !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const input = await request.json().catch(() => null);
  if (input?.confirmation !== "RESET_PRODUCTION_DATA") {
    return jsonResponse({ error: "Confirmation required." }, 400);
  }

  const deleted = {
    auth: await deleteStorageRecords(authStub, maintenanceToken, ["account:", "verify:", "session:"]),
    registry: await deleteStorageRecords(registryStub, maintenanceToken, ["snapshot"]),
    nameBackups: await deleteStorageRecords(nameBackupsStub, maintenanceToken, ["nameBackups"]),
    lod: [],
  };

  for (const code of lodCodes) {
    const stub = env.BRACKET_ROOMS.get(env.BRACKET_ROOMS.idFromName(code));
    deleted.lod.push({ code, deleted: await deleteStorageRecords(stub, maintenanceToken, ["snapshot"]) });
  }

  return jsonResponse({ ok: true, deleted });
}

function isDataMaintenanceAuthorized(request, env) {
  const configuredToken = String(env?.DATA_RESET_TOKEN || "").trim();
  const suppliedToken = String(request.headers.get("x-data-reset-token") || "").trim();
  return Boolean(configuredToken && suppliedToken && timingSafeEqual(configuredToken, suppliedToken));
}

async function listStorageRecords(stub, token) {
  const response = await stub.fetch(new Request("https://maintenance/api/admin/storage-inventory", {
    method: "GET",
    headers: { "x-data-reset-token": token },
  }));
  return response.ok
    ? response.json()
    : { records: [], recordCount: 0 };
}

async function deleteStorageRecords(stub, token, prefixes) {
  const response = await stub.fetch(new Request("https://maintenance/api/admin/storage-reset", {
    method: "POST",
    headers: { "content-type": "application/json", "x-data-reset-token": token },
    body: JSON.stringify({ records: prefixes }),
  }));
  const result = await response.json().catch(() => ({}));
  return Number(result.deleted || 0);
}

async function listOwnStorageRecords(storage) {
  const entries = await storage.list();
  const records = [];
  for (const [key, value] of entries) {
    const descriptor = { key };
    if (key === "account:" || key.startsWith("account:")) {
      descriptor.type = "account";
      descriptor.username = key.slice("account:".length);
    } else if (key.startsWith("verify:")) {
      descriptor.key = "verify:<redacted>";
      descriptor.type = "verificationToken";
    } else if (key.startsWith("session:")) {
      descriptor.key = "session:<redacted>";
      descriptor.type = "session";
    } else if (key === "nameBackups") {
      descriptor.type = "rosterBackups";
      descriptor.count = Array.isArray(value?.backups) ? value.backups.length : 0;
    } else if (key === "snapshot") {
      descriptor.type = "snapshot";
      descriptor.hasData = Boolean(value);
    } else {
      descriptor.type = "other";
    }
    records.push(descriptor);
  }
  return { records, recordCount: records.length };
}

async function deleteOwnStorageRecords(storage, prefixes = []) {
  const allowedPrefixes = Array.isArray(prefixes) ? prefixes.map(String) : [];
  const keys = Array.from((await storage.list()).keys()).filter((key) =>
    allowedPrefixes.some((prefix) => key === prefix || key.startsWith(prefix)));
  if (keys.length) {
    await storage.delete(keys);
  }
  return keys.length;
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 48);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password, salt = randomToken()) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: new TextEncoder().encode(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
  return { salt, hash: bytesToHex(new Uint8Array(bits)) };
}

async function verifyPassword(password, account) {
  const result = await hashPassword(password, account.passwordSalt);
  return timingSafeEqual(result.hash, account.passwordHash);
}

function timingSafeEqual(left, right) {
  const a = new TextEncoder().encode(String(left || ""));
  const b = new TextEncoder().encode(String(right || ""));
  const length = Math.max(a.length, b.length);
  let difference = a.length ^ b.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (a[index] || 0) ^ (b[index] || 0);
  }
  return difference === 0;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function escapeHtmlForEmail(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isRegistryRequest(pathname) {
  return pathname === "/api/lod" || pathname === "/api/lod/" || pathname === "/api/lod/index";
}

function isNameBackupsRequest(pathname) {
  return pathname === "/api/name-backups" || pathname === "/api/name-backups/";
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

function getNameBackupsStub(env) {
  const roomId = env.BRACKET_ROOMS.idFromName("__global_name_backups__");
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

async function readGlobalNameBackups(storage) {
  const record = await storage.get("nameBackups");
  return normalizeGlobalNameBackupsRecord(record);
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

  const portalSupportMessages = normalizePortalSupportMessages(data.portalSupportMessages);

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
      portalSupportMessages,
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
    portalSupportMessages,
    state: data,
    outShots: Array.isArray(data.outShots) ? data.outShots : [],
    mysteryOut: data.mysteryOut || "",
  };
}

function normalizePortalSupportMessages(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((entry) => {
    if (!entry || typeof entry !== "object") {
      return null;
    }

    const sender = /assistant|support/i.test(String(entry.sender || entry.author || ""))
      ? "Admin Support"
      : "Admin";
    const message = String(entry.message || entry.text || "").trim();
    if (!message) {
      return null;
    }

    const stampValue = String(entry.stamp || entry.timestamp || entry.createdAt || entry.sentAt || entry.at || "");
    const stamp = stampValue && !Number.isNaN(new Date(stampValue).getTime())
      ? new Date(stampValue).toISOString()
      : "";

    return { sender, message, stamp };
  }).filter(Boolean);
}

function normalizeNameBackups(value) {
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

function isExpiredSnapshot(snapshot) {
  const expiresAt = Number(snapshot?.expiresAt || 0);
  return Number.isFinite(expiresAt) && expiresAt > 0 && expiresAt <= Date.now();
}

function normalizeGlobalNameBackupsPayload(data) {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return normalizeNameBackups(data);
  }

  if (typeof data === "object" && Array.isArray(data.backups)) {
    return normalizeNameBackups(data.backups);
  }

  return [];
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
    backups: normalizeNameBackups(Array.isArray(record.backups) ? record.backups : []),
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
