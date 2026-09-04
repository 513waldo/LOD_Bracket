import { sendResendEmail } from "./email.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Attendance-Root-Password",
};
const ALLOWED_CORS_ORIGINS = new Set([
  "https://ocheoperations.com",
  "https://www.ocheoperations.com",
]);

export class BracketRoom {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const method = request.method.toUpperCase();
    const pathname = new URL(request.url).pathname;

    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeadersForRequest(request) });
    }

    if (pathname.startsWith("/api/auth/")) {
      return handleAuthRequest(request, this.state.storage, this.env);
    }

    if (isAttendanceSeriesRequest(pathname)) {
      return handleAttendanceSeriesRequest(request, this.state.storage, this.env);
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

      if (isPublicLodRequest(pathname)) {
        return jsonResponse(normalizePublicSnapshot(snapshot));
      }

      const account = await authenticateAccountRequest(request, this.env);
      if (!account) {
        return jsonResponse({ error: "Authentication required." }, 401);
      }

      const owner = await this.state.storage.get("owner");
      if (!owner || owner.username !== account.username) {
        return jsonResponse({ error: "You are not authorized to view this tournament." }, 403);
      }

      return jsonResponse(snapshot);
    }

    if (method === "PUT" || method === "PATCH") {
      try {
        if (isPublicLodRequest(pathname)) {
          return jsonResponse({ error: "The public portal is read-only." }, 405);
        }

        const account = await authenticateAccountRequest(request, this.env);
        if (!account) {
          return jsonResponse({ error: "Authentication required." }, 401);
        }

        const payload = await request.json().catch(() => null);
        const snapshot = normalizeSnapshot(payload);

        if (!snapshot) {
          return jsonResponse({ error: "Invalid snapshot" }, 400);
        }

        const existingSnapshot = await this.state.storage.get("snapshot");
        const owner = await this.state.storage.get("owner");
        if (owner && owner.username !== account.username) {
          return jsonResponse({ error: "This tournament belongs to another account." }, 403);
        }
        if (existingSnapshot && !owner) {
          return jsonResponse({ error: "This tournament has no assigned owner." }, 403);
        }

        if (existingSnapshot?.state?.champion) {
          return jsonResponse({ error: "TOURNAMENT_COMPLETED", locked: true }, 409);
        }

        if (existingSnapshot?.state && hasImmutablePlayerListChanged(existingSnapshot, snapshot)) {
          return jsonResponse({ error: "PLAYER_LIST_LOCKED", locked: true }, 409);
        }

        if (!owner) {
          await this.state.storage.put("owner", {
            username: account.username,
            barName: account.barName,
            claimedAt: new Date().toISOString(),
          });
        }
        await this.state.storage.put("snapshot", snapshot);
        return jsonResponse(snapshot);
      } catch (error) {
        return jsonResponse({ error: "Tournament save failed." }, 500);
      }
    }

    if (method === "DELETE") {
      if (isPublicLodRequest(pathname)) {
        return jsonResponse({ error: "The public portal is read-only." }, 405);
      }
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
      return new Response(null, { status: 204, headers: corsHeadersForRequest(request) });
    }

    if (url.pathname.startsWith("/api/auth/")) {
      const authStub = env.BRACKET_ROOMS.get(env.BRACKET_ROOMS.idFromName("__auth__"));
      const targetUrl = new URL(request.url);
      targetUrl.pathname = url.pathname;
      return withCors(await authStub.fetch(new Request(targetUrl, request)), request);
    }

    if (isAttendanceSeriesRequest(url.pathname)) {
      const account = await authenticateAccountRequest(request, env);
      if (!account) {
        return withCors(jsonResponse({ error: "Authentication required." }, 401), request);
      }

      const seriesStub = env.BRACKET_ROOMS.get(env.BRACKET_ROOMS.idFromName("__attendance_series__"));
      const targetUrl = new URL(request.url);
      targetUrl.pathname = url.pathname;
      const headers = new Headers(request.headers);
      headers.set("x-authenticated-username", account.username);
      headers.set("x-authenticated-bar-name", account.barName || "");
      return withCors(await seriesStub.fetch(new Request(targetUrl, {
        method,
        headers,
        body: ["POST", "PATCH"].includes(method) ? await request.clone().text() : undefined,
      })), request);
    }

    if (url.pathname === "/api/admin/attendance-codes" && (method === "GET" || method === "DELETE")) {
      const account = await authenticateAccountRequest(request, env);
      const expectedPassword = String(env.ATTENDANCE_ROOT_PASSWORD || "").trim();
      const suppliedPassword = String(request.headers.get("x-attendance-root-password") || "").trim();
      if (!expectedPassword || suppliedPassword !== expectedPassword || (method === "GET" && !account)) {
        return withCors(jsonResponse({ error: "Root access required." }, 403), request);
      }
      const seriesStub = env.BRACKET_ROOMS.get(env.BRACKET_ROOMS.idFromName("__attendance_series__"));
      if (method === "DELETE") {
        const input = await request.json().catch(() => null);
        const codes = Array.isArray(input?.codes) ? input.codes : [];
        const response = await seriesStub.fetch(new Request("https://series/api/attendance/series", {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            "x-root-authorized": "1",
          },
          body: JSON.stringify({ codes }),
        }));
        return withCors(response, request);
      }
      const index = await seriesStub.fetch(new Request("https://series/api/attendance/series", {
        method: "GET",
        headers: {
          "x-authenticated-username": account.username,
          "x-authenticated-bar-name": account.barName || "",
        },
      }));
      const seriesPayload = await index.json().catch(() => ({ series: [] }));
      return withCors(jsonResponse({
        attendanceSeries: (Array.isArray(seriesPayload.series) ? seriesPayload.series : []).map((series) => ({
          code: series.code || "",
          name: series.name || "",
          description: series.description || "",
        })),
      }), request);
    }

    if (url.pathname === "/api/test-email") {
      if (method !== "POST") {
        return withCors(jsonResponse({ error: "Method not allowed" }, 405), request);
      }

      const testToken = String(env.EMAIL_TEST_TOKEN || "").trim();
      if (!testToken || request.headers.get("x-email-test-token") !== testToken) {
        return withCors(jsonResponse({ error: "Unauthorized" }, 401), request);
      }

      try {
        const result = await sendResendEmail(env, {
          to: "dartwaldo513@gmail.com",
          subject: "LOD Bracket email test",
          html: "<p>Congrats on sending your <strong>first LOD Bracket email</strong>!</p>",
        });
        return withCors(jsonResponse({ ok: true, id: result?.id || "" }), request);
      } catch (error) {
        return withCors(jsonResponse({ error: error.message || "Email send failed" }, 502), request);
      }
    }

    if (isRegistryRequest(url.pathname)) {
      const registryStub = getRegistryStub(env);
      if (method === "GET") {
        const response = await registryStub.fetch(
          new Request("https://registry/api/lod/index", { method: "GET" }),
        );
        return response.status === 404
          ? withCors(jsonResponse({ version: 1, updatedAt: "", codes: [] }), request)
          : withCors(response, request);
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
        return withCors(clearResponse, request);
      }

      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    if (isNameBackupsRequest(url.pathname)) {
      const nameBackupsStub = getNameBackupsStub(env);
      if (method === "GET" || method === "PUT" || method === "PATCH" || method === "DELETE") {
        const targetUrl = new URL(request.url);
        targetUrl.pathname = "/api/name-backups";
        const response = await nameBackupsStub.fetch(new Request(targetUrl, request));
      return withCors(response, request);
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
    targetUrl.pathname = isPublicLodRequest(url.pathname)
      ? `/api/public/lod/${code}`
      : `/api/lod/${code}`;
    const payload = method === "PUT" || method === "PATCH"
      ? await request.clone().json().catch(() => null)
      : null;

    const response = await stub.fetch(new Request(targetUrl, request));

    if (method === "GET" && response.status === 410) {
      await updateRegistry(env, code, false);
    }

    if ((method === "PUT" || method === "PATCH") && response.ok) {
      const snapshot = normalizeSnapshot(payload);
      if (snapshot) {
        await updateRegistry(env, snapshot.lodCode || code, true);
      }
    } else if (method === "DELETE") {
      await updateRegistry(env, code, false);
    }

    return withCors(response, request);
  },
};

async function authenticateAccountRequest(request, env) {
  const authorization = String(request.headers.get("authorization") || "").trim();
  if (!authorization) {
    return null;
  }

  const authStub = env?.BRACKET_ROOMS?.get(env.BRACKET_ROOMS.idFromName("__auth__"));
  if (!authStub) {
    return null;
  }

  const response = await authStub.fetch(new Request("https://auth/api/auth/session", {
    method: "GET",
    headers: { authorization },
  }));
  if (!response.ok) {
    return null;
  }

  const account = await response.json().catch(() => null);
  return account?.username && account?.verified ? account : null;
}

function hasImmutablePlayerListChanged(previousSnapshot, nextSnapshot) {
  return getImmutablePlayerListSignature(previousSnapshot) !== getImmutablePlayerListSignature(nextSnapshot);
}

function getImmutablePlayerListSignature(snapshot) {
  const statePlayers = Array.isArray(snapshot?.state?.originalPlayers)
    ? snapshot.state.originalPlayers.map((player) => String(player || ""))
    : null;
  return JSON.stringify({
    totalPlayers: Number(snapshot?.totalPlayers || 0),
    playerList: String(snapshot?.playerList || ""),
    nameMap: snapshot?.nameMap && typeof snapshot.nameMap === "object" ? snapshot.nameMap : {},
    currentTeams: Array.isArray(snapshot?.currentTeams) ? snapshot.currentTeams : [],
    statePlayers,
  });
}

async function handleAuthRequest(request, storage, env) {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();

  if (url.pathname === "/api/auth/register" && method === "POST") {
    const input = await request.json().catch(() => null);
    const username = normalizeUsername(input?.username);
    const barName = String(input?.barName || "").trim().slice(0, 120);
    const email = String(input?.email || "").trim().toLowerCase();
    const password = String(input?.password || "");

    if (!username || !isEmail(email) || password.length < 8) {
      return jsonResponse({ error: "Enter a valid email, username, and password of at least 8 characters." }, 400);
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
    const verificationUrl = `${appBaseUrl}/verify.html?token=${encodeURIComponent(verificationToken)}`;

    try {
      await sendResendEmail(env, {
        to: email,
        subject: "Verify your LOD Bracket account",
        html: `<p>Thanks for creating your Oche Operations account${barName ? ` for <strong>${escapeHtmlForEmail(barName)}</strong>` : ""}.</p><p><a href="${verificationUrl}">Confirm your account</a></p><p>This link expires in 24 hours.</p>`,
      });
    } catch (error) {
      await storage.delete(accountKey);
      await storage.delete(`verify:${verificationToken}`);
      return jsonResponse({ error: error.message || "Could not send the verification email." }, 502);
    }

    return jsonResponse({ ok: true, verified: false, email });
  }

  if (url.pathname === "/api/auth/dev-create" && method === "POST") {
    if (!isLocalAuthRequest(request)) {
      return jsonResponse({ error: "Local account creation is unavailable here." }, 404);
    }

    const input = await request.json().catch(() => null);
    const username = normalizeUsername(input?.username);
    const barName = String(input?.barName || "Local Lab").trim().slice(0, 120) || "Local Lab";
    const password = String(input?.password || "");

    if (!username || password.length < 8) {
      return jsonResponse({ error: "Enter a username and a password of at least 8 characters." }, 400);
    }

    const accountKey = `account:${username}`;
    if (await storage.get(accountKey)) {
      return jsonResponse({ error: "That username is already in use." }, 409);
    }

    const passwordRecord = await hashPassword(password);
    await storage.put(accountKey, {
      version: 1,
      username,
      barName,
      email: "",
      passwordHash: passwordRecord.hash,
      passwordSalt: passwordRecord.salt,
      verified: true,
      verificationToken: "",
      createdAt: new Date().toISOString(),
      localOnly: true,
    });

    return jsonResponse({ ok: true, username, barName, verified: true, localOnly: true });
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

  if (url.pathname === "/api/auth/forgot-username" && method === "POST") {
    const input = await request.json().catch(() => null);
    const email = String(input?.email || "").trim().toLowerCase();
    const accounts = isEmail(email) ? await findAccountsByEmail(storage, email) : [];

    if (accounts.length) {
      await sendResendEmail(env, {
        to: email,
        subject: "Your Oche Operations username",
        html: `<p>We found ${accounts.length === 1 ? "your username" : "your usernames"} for Oche Operations:</p><p><strong>${accounts.map((account) => escapeHtmlForEmail(account.username)).join("<br>")}</strong></p>`,
      });
    }

    return jsonResponse({ ok: true, message: "If an account matches that email, we sent the username reminder." });
  }

  if (url.pathname === "/api/auth/forgot-password" && method === "POST") {
    const input = await request.json().catch(() => null);
    const email = String(input?.email || "").trim().toLowerCase();
    const username = normalizeUsername(input?.username);
    const account = isEmail(email) ? await storage.get(`account:${username}`) : null;

    if (account && account.email === email) {
      const resetToken = randomToken();
      await storage.put(`reset:${resetToken}`, username, { expirationTtl: 3600 });
      const appBaseUrl = String(env?.APP_BASE_URL || "https://lod-bracket.pages.dev").replace(/\/$/, "");
      await sendResendEmail(env, {
        to: email,
        subject: "Reset your Oche Operations password",
        html: `<p>We received a request to reset the password for <strong>${escapeHtmlForEmail(account.username)}</strong>.</p><p><a href="${appBaseUrl}/reset-password.html?token=${encodeURIComponent(resetToken)}">Reset your password</a></p><p>This link expires in one hour. If you did not request this, you can ignore this email.</p>`,
      });
    }

    return jsonResponse({ ok: true, message: "If the account details match, we sent a password-reset link." });
  }

  if (url.pathname === "/api/auth/reset-password" && method === "POST") {
    const input = await request.json().catch(() => null);
    const token = String(input?.token || "").trim();
    const password = String(input?.password || "");
    if (!token || password.length < 8) {
      return jsonResponse({ error: "Enter a valid reset link and a password of at least 8 characters." }, 400);
    }

    const username = await storage.get(`reset:${token}`);
    const account = username ? await storage.get(`account:${username}`) : null;
    if (!account) {
      return jsonResponse({ error: "This password-reset link is invalid or expired." }, 400);
    }

    const passwordRecord = await hashPassword(password);
    account.passwordHash = passwordRecord.hash;
    account.passwordSalt = passwordRecord.salt;
    await storage.put(`account:${username}`, account);
    await storage.delete(`reset:${token}`);

    const sessions = await storage.list({ prefix: "session:" });
    const sessionsToDelete = Array.from(sessions.entries())
      .filter(([, session]) => session?.username === username)
      .map(([key]) => key);
    if (sessionsToDelete.length) {
      await storage.delete(sessionsToDelete);
    }

    return jsonResponse({ ok: true, username });
  }

  if (url.pathname === "/api/auth/session" && method === "GET") {
    const token = String(request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim();
    const session = token ? await storage.get(`session:${token}`) : null;
    return session ? jsonResponse({ ok: true, ...session }) : jsonResponse({ error: "Not signed in" }, 401);
  }

  return jsonResponse({ error: "Not found" }, 404);
}

async function findAccountsByEmail(storage, email) {
  const entries = await storage.list({ prefix: "account:" });
  return Array.from(entries.values()).filter((account) => account?.email === email);
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "").slice(0, 48);
}

function isLocalAuthRequest(request) {
  const hostname = new URL(request.url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
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

function isPublicLodRequest(pathname) {
  return /^\/api\/public\/lod\/[A-Z0-9]+$/i.test(String(pathname || ""));
}

function isNameBackupsRequest(pathname) {
  return pathname === "/api/name-backups" || pathname === "/api/name-backups/";
}

function isAttendanceSeriesRequest(pathname) {
  return /^\/api\/attendance\/series(?:\/[^/]+(?:\/merge)?)?\/?$/i.test(String(pathname || ""));
}

async function handleAttendanceSeriesRequest(request, storage, env) {
  const method = request.method.toUpperCase();
  const pathname = new URL(request.url).pathname;
  const username = String(request.headers.get("x-authenticated-username") || "").trim();
  const venueName = String(request.headers.get("x-authenticated-bar-name") || "").trim();
  const accountVenueKey = normalizeVenueKey(venueName || username);

  if (!username && request.headers.get("x-root-authorized") !== "1") {
    return jsonResponse({ error: "An authenticated account is required." }, 403);
  }

  const mergeMatch = pathname.match(/^\/api\/attendance\/series\/([^/]+)\/merge\/?$/i);
  if (mergeMatch) {
    if (method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const code = normalizeAttendanceSeriesCode(decodeURIComponent(mergeMatch[1]));
    const series = await storage.get(`attendanceSeries:${code}`);
    if (!series || series.venueKey !== accountVenueKey) {
      return jsonResponse({ error: "Attendance series not found." }, 404);
    }

    const input = await request.json().catch(() => null);
    const sessionId = String(input?.sessionId || "").trim();
    const lodCode = normalizeLodCode(input?.lodCode);
    const manualNames = Array.isArray(input?.names)
      ? input.names.map((name) => String(name || "").trim()).filter(Boolean)
      : [];
    const session = Array.isArray(series.schedule?.sessions)
      ? series.schedule.sessions.find((entry) => String(entry.id || "") === sessionId)
      : null;
    if (!sessionId || !session) {
      return jsonResponse({ error: "Select an attendance week." }, 400);
    }
    let names = manualNames;
    if (lodCode) {
      const authorization = request.headers.get("authorization") || "";
      const lodStub = env?.BRACKET_ROOMS?.get(env.BRACKET_ROOMS.idFromName(lodCode));
      if (!lodStub) {
        return jsonResponse({ error: "LOD service is unavailable." }, 503);
      }
      const lodResponse = await lodStub.fetch(new Request(`https://lod/api/lod/${lodCode}`, {
        method: "GET",
        headers: { authorization },
      }));
      if (!lodResponse.ok) {
        return jsonResponse({ error: lodResponse.status === 404 ? "LOD not found." : "Unable to read that LOD." }, lodResponse.status === 404 ? 404 : 502);
      }
      const snapshot = await lodResponse.json().catch(() => null);
      names = getAttendanceRosterNames(snapshot);
    }
    if (!names.length) {
      return jsonResponse({ error: lodCode ? "That LOD has no player roster." : "Enter at least one player name." }, 400);
    }

    const attendance = normalizeAttendanceRecord(series.attendance);
    const sourceKey = lodCode || `manual:${names.map(normalizeAttendancePlayerKey).sort().join("|")}`;
    const mergeKey = `${sessionId}:${sourceKey}`;
    const existingMerge = attendance.merges.find((entry) => entry.key === mergeKey);
    if (existingMerge) {
      return jsonResponse({ series, attendance, alreadyApplied: true });
    }

    const mergedAt = new Date().toISOString();
    const playerMap = new Map(attendance.players.map((player) => [player.key, player]));
    for (const name of names) {
      const key = normalizeAttendancePlayerKey(name);
      if (!key) continue;
      const player = playerMap.get(key) || {
        key,
        name: String(name).trim(),
        weeks: {},
        count: 0,
      };
      if (!player.weeks[sessionId]) {
        player.weeks[sessionId] = {
          sessionId,
          date: String(session.date || ""),
          lodCode: lodCode || "",
          checkedAt: mergedAt,
        };
      }
      player.count = Object.keys(player.weeks).length;
      playerMap.set(key, player);
    }

    attendance.players = Array.from(playerMap.values()).sort((left, right) => left.name.localeCompare(right.name));
    attendance.merges.push({ key: mergeKey, sessionId, lodCode, mergedAt, playerCount: names.length });
    series.attendance = attendance;
    series.updatedAt = mergedAt;
    await storage.put(`attendanceSeries:${code}`, series);
    return jsonResponse({ series, attendance, alreadyApplied: false });
  }

  if (method === "GET") {
    const index = await storage.get("attendanceSeriesIndex") || [];
    const series = [];
    for (const code of Array.isArray(index) ? index : []) {
      const record = await storage.get(`attendanceSeries:${code}`);
      if (record && record.venueKey === accountVenueKey) {
        series.push(record);
      }
    }
    return jsonResponse({ series });
  }

  if (method === "DELETE") {
    if (request.headers.get("x-root-authorized") !== "1") {
      return jsonResponse({ error: "Root access required." }, 403);
    }

    const input = await request.json().catch(() => null);
    const requestedCodes = Array.isArray(input?.codes)
      ? input.codes.map(normalizeAttendanceSeriesCode).filter(Boolean)
      : [];
    const codeSet = new Set(requestedCodes);
    const currentIndex = Array.isArray(await storage.get("attendanceSeriesIndex"))
      ? await storage.get("attendanceSeriesIndex")
      : [];
    const deletedCodes = [];
    for (const code of currentIndex) {
      const normalizedCode = normalizeAttendanceSeriesCode(code);
      if (!codeSet.has(normalizedCode)) continue;
      const record = await storage.get(`attendanceSeries:${normalizedCode}`);
      if (record) {
        await storage.delete(`attendanceSeries:${normalizedCode}`);
        deletedCodes.push(normalizedCode);
      }
    }
    const remainingCodes = currentIndex
      .map(normalizeAttendanceSeriesCode)
      .filter((code) => code && !deletedCodes.includes(code));
    await storage.put("attendanceSeriesIndex", remainingCodes);
    return jsonResponse({ ok: true, deletedCodes, remainingCount: remainingCodes.length });
  }

  if (method === "POST") {
    const input = await request.json().catch(() => null);
    const name = String(input?.name || "").trim().slice(0, 120);
    const description = String(input?.description || "").trim().slice(0, 500);
    const supportedCadences = new Set(["weekly", "bi-weekly", "monthly", "quarterly", "bi-yearly", "yearly"]);
    const requestedCadence = String(input?.schedule?.cadence || "weekly").trim().toLowerCase();
    const cadence = supportedCadences.has(requestedCadence) ? requestedCadence : "weekly";
    const startDate = String(input?.schedule?.startDate || "").trim().slice(0, 10);
    const totalSessions = Math.min(52, Math.max(2, Math.trunc(Number(input?.schedule?.totalSessions || input?.schedule?.plannedWeeks) || 2)));
    const scheduledSessions = totalSessions - 1;
    if (!name) {
      return jsonResponse({ error: "Enter a series name." }, 400);
    }

    const index = Array.isArray(await storage.get("attendanceSeriesIndex"))
      ? await storage.get("attendanceSeriesIndex")
      : [];
    let code = "";
    do {
      code = `ATT-${randomToken().slice(0, 10).toUpperCase()}`;
    } while (await storage.get(`attendanceSeries:${code}`));

    const record = {
      version: 1,
      code,
      name,
      description,
      venueName,
      venueKey: accountVenueKey,
      createdBy: username,
      createdAt: new Date().toISOString(),
      status: "active",
      schedule: {
        cadence,
        startDate,
        plannedWeeks: scheduledSessions,
        scheduledSessions,
        bufferWeeks: 1,
        totalWeeks: totalSessions,
        sessions: buildAttendanceSessions(startDate, cadence, totalSessions),
      },
    };
    await storage.put(`attendanceSeries:${code}`, record);
    await storage.put("attendanceSeriesIndex", [...index, code]);
    return jsonResponse(record, 201);
  }

  return jsonResponse({ error: "Method not allowed" }, 405);
}

function normalizeAttendanceSeriesCode(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 32);
}

function normalizeAttendancePlayerKey(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function normalizeAttendanceRecord(value) {
  return {
    version: 1,
    players: Array.isArray(value?.players) ? value.players.map((player) => ({
      key: normalizeAttendancePlayerKey(player?.key || player?.name),
      name: String(player?.name || "").trim(),
      weeks: player?.weeks && typeof player.weeks === "object" ? player.weeks : {},
      count: Math.max(0, Number(player?.count) || 0),
    })).filter((player) => player.key && player.name) : [],
    merges: Array.isArray(value?.merges) ? value.merges : [],
  };
}

function getAttendanceRosterNames(snapshot) {
  const stateNames = Array.isArray(snapshot?.state?.originalPlayers) ? snapshot.state.originalPlayers : [];
  if (stateNames.length) {
    return stateNames.map((name) => String(name || "").trim()).filter(Boolean);
  }
  return String(snapshot?.playerList || "")
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function normalizeVenueKey(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function buildAttendanceSessions(startDate, cadence, totalWeeks) {
  const firstDate = /^\d{4}-\d{2}-\d{2}$/.test(startDate) ? startDate : "";
  return Array.from({ length: totalWeeks }, (_, index) => ({
    id: `session-${index + 1}`,
    number: index + 1,
    date: firstDate ? addScheduleInterval(firstDate, cadence, index) : "",
    buffer: index === totalWeeks - 1,
  }));
}

function addScheduleInterval(startDate, cadence, index) {
  const [year, month, day] = startDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (cadence === "bi-weekly") {
    date.setUTCDate(date.getUTCDate() + (index * 14));
  } else if (cadence === "monthly") {
    date.setUTCMonth(date.getUTCMonth() + index);
  } else if (cadence === "quarterly") {
    date.setUTCMonth(date.getUTCMonth() + (index * 3));
  } else if (cadence === "bi-yearly") {
    date.setUTCMonth(date.getUTCMonth() + (index * 6));
  } else if (cadence === "yearly") {
    date.setUTCFullYear(date.getUTCFullYear() + index);
  } else {
    date.setUTCDate(date.getUTCDate() + (index * 7));
  }
  return date.toISOString().slice(0, 10);
}

function extractLodCode(pathname, queryCode) {
  const fromPath = pathname.match(/^\/api\/(?:public\/)?lod\/([A-Z0-9]+)$/i)?.[1];
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

function normalizeDateInputValue(value) {
  const text = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
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
      totalPlayers: Math.max(0, Math.floor(Number(data.totalPlayers) || 0)),
      playersPerGroup: Math.max(0, Math.floor(Number(data.playersPerGroup) || 0)),
      barName: String(data.barName || ""),
      description: String(data.description || ""),
      eventType: String(data.eventType || "normal-lod"),
      eventName: String(data.eventName || ""),
      eventDate: normalizeDateInputValue(data.eventDate || ""),
      playerList: String(data.playerList || ""),
      nameMap: data.nameMap && typeof data.nameMap === "object" ? data.nameMap : {},
      currentTeams: Array.isArray(data.currentTeams) ? data.currentTeams : [],
      hasGeneratedTeams: Boolean(data.hasGeneratedTeams),
      blockedGenerateCount: Math.max(0, Math.floor(Number(data.blockedGenerateCount) || 0)),
      outShots: Array.isArray(data.outShots) ? data.outShots : [],
      mysteryOut: data.mysteryOut || "",
    };
  }

  return {
    version: Number(data.version || 1),
    exportedAt: data.exportedAt || new Date().toISOString(),
    lodCode: normalizeLodCode(data.lodCode),
    expiresAt: Number(data.expiresAt || 0) || 0,
    barName: String(data.barName || ""),
    description: String(data.description || ""),
    eventType: String(data.eventType || "normal-lod"),
    eventName: String(data.eventName || ""),
    eventDate: normalizeDateInputValue(data.eventDate || ""),
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

function normalizePublicSnapshot(snapshot) {
  return {
    version: Number(snapshot?.version || 1),
    exportedAt: String(snapshot?.exportedAt || ""),
    lodCode: normalizeLodCode(snapshot?.lodCode),
    expiresAt: Number(snapshot?.expiresAt || 0) || 0,
    barName: String(snapshot?.barName || ""),
    description: String(snapshot?.description || ""),
    eventType: String(snapshot?.eventType || "normal-lod"),
    eventName: String(snapshot?.eventName || ""),
    eventDate: normalizeDateInputValue(snapshot?.eventDate || ""),
    portalNotice: String(snapshot?.portalNotice || ""),
    portalNoticeAt: String(snapshot?.portalNoticeAt || ""),
    portalAutoNotice: String(snapshot?.portalAutoNotice || ""),
    portalAutoNoticeAt: String(snapshot?.portalAutoNoticeAt || ""),
    portalBullshootNotice: String(snapshot?.portalBullshootNotice || ""),
    portalBullshootNoticeAt: String(snapshot?.portalBullshootNoticeAt || ""),
    state: normalizePublicState(snapshot?.state),
  };
}

function normalizePublicState(state) {
  if (!state || typeof state !== "object") {
    return null;
  }

  return {
    mode: String(state.mode || ""),
    champion: String(state.champion || ""),
    originalPlayers: Array.isArray(state.originalPlayers)
      ? state.originalPlayers.map((player) => String(player || ""))
      : [],
    size: Number(state.size || 0) || 0,
    matches: normalizePublicMatches(state.matches),
    winnerRounds: normalizePublicRounds(state.winnerRounds),
    loserRounds: normalizePublicRounds(state.loserRounds),
    rounds: state.rounds && typeof state.rounds === "object"
      ? {
          winner: normalizePublicRounds(state.rounds.winner),
          loser: normalizePublicRounds(state.rounds.loser),
        }
      : { winner: [], loser: [] },
    final: normalizePublicMatch(state.final),
    resetFinal: normalizePublicMatch(state.resetFinal),
  };
}

function normalizePublicRounds(rounds) {
  if (!Array.isArray(rounds)) {
    return [];
  }

  return rounds.map((round) => ({
    title: String(round?.title || ""),
    matches: normalizePublicMatches(round?.matches || round),
  }));
}

function normalizePublicMatches(matches) {
  if (!Array.isArray(matches)) {
    return [];
  }

  return matches.map(normalizePublicMatch).filter(Boolean);
}

function normalizePublicMatch(match) {
  if (!match || typeof match !== "object") {
    return null;
  }

  return {
    id: String(match.id ?? ""),
    title: String(match.title || ""),
    type: String(match.type || ""),
    gameNumber: Number(match.gameNumber || 0) || 0,
    isPlayIn: Boolean(match.isPlayIn),
    players: Array.isArray(match.players) ? match.players.map((player) => String(player || "")) : [],
    slotSources: Array.isArray(match.slotSources) ? match.slotSources.map((source) => String(source || "")) : [],
    winner: String(match.winner || ""),
    loser: String(match.loser || ""),
    autoAdvanced: Boolean(match.autoAdvanced),
    boardAssignment: Number(match.boardAssignment || 0) || null,
    winnerTo: normalizePublicRoute(match.winnerTo),
    loserTo: normalizePublicRoute(match.loserTo),
  };
}

function normalizePublicRoute(route) {
  if (!route || typeof route !== "object") {
    return null;
  }

  return { matchId: String(route.matchId ?? "") };
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

function corsHeadersForRequest(request) {
  const origin = String(request?.headers?.get("Origin") || "").trim();
  return {
    ...CORS_HEADERS,
    "Access-Control-Allow-Origin": ALLOWED_CORS_ORIGINS.has(origin) ? origin : "*",
    Vary: "Origin",
  };
}

async function withCors(response, request) {
  const headers = new Headers(response.headers);
  Object.entries(corsHeadersForRequest(request)).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
