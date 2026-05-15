const LOCAL_SNAPSHOT_KEY_PREFIX = "dartsTournamentPortalSnapshot:";
const DEFAULT_SNAPSHOT_FILE = "bracket-state.json";
const API_BASE_URLS = getApiBaseUrls();
const API_REFRESH_MS = Number(window.BRACKET_API_POLL_MS || 5000);
const portalBracket = document.querySelector("#portalBracket");
const portalNotice = document.querySelector("#portalNotice");
const portalMessage = document.querySelector("#portalMessage");
const publishedAt = document.querySelector("#publishedAt");
const lodCodeText = document.querySelector("#lodCodeText");
const lodCodeInput = document.querySelector("#lodCodeInput");
const loadLodCodeButton = document.querySelector("#loadLodCode");
const clearLodCodeButton = document.querySelector("#clearLodCode");
const championText = document.querySelector("#championText");
const teamCountText = document.querySelector("#teamCountText");
const bracketSubtitle = document.querySelector("#bracketSubtitle");
const snapshotFile = document.querySelector("#snapshotFile");
const reloadSnapshotButton = document.querySelector("#reloadSnapshot");
const portalLodCodeStorageKey = "dartsTournamentPortalLodCode";
const portalLodCodeClearedValue = "__CLEARED__";
const portalSessionExpiryStorageKey = "dartsTournamentPortalExpiry";
const portalSessionDurationMs = 60 * 60 * 1000;

let activeSnapshot = null;
const storedLodCode = getStoredPortalLodCode();
let activeLodCode = storedLodCode !== null ? storedLodCode : getRequestedLodCode();
let refreshTimer = null;
let portalExpiryTimer = null;
let autoFocusAppliedForCode = "";

reloadSnapshotButton.addEventListener("click", () => {
  loadPublishedSnapshot(activeLodCode, true);
});

loadLodCodeButton.addEventListener("click", () => {
  const code = normalizeLodCode(lodCodeInput.value);

  if (!code) {
    clearPortalCode();
    return;
  }

  activeLodCode = code;
  saveStoredPortalLodCode(code);
  clearPortalExpiry(code);
  updateUrlForCode(code);
  loadPublishedSnapshot(code, true);
});

lodCodeInput?.addEventListener("input", () => {
  if (!normalizeLodCode(lodCodeInput.value) && activeLodCode) {
    clearPortalCode();
  }
});

clearLodCodeButton?.addEventListener("click", () => {
  clearPortalCode();
});

snapshotFile.addEventListener("change", async () => {
  const file = snapshotFile.files && snapshotFile.files[0];

  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const snapshot = normalizeSnapshot(JSON.parse(text));
    if (!snapshot) {
      setMessage("That file does not contain a usable snapshot.");
      return;
    }

    activeLodCode = normalizeLodCode(snapshot.lodCode || activeLodCode);
    clearPortalExpiry(activeLodCode);
    renderSnapshot(snapshot, snapshot.lodCode ? `LOD ${snapshot.lodCode}` : "Uploaded snapshot");
    storeSnapshot(activeLodCode, snapshot);
    updateUrlForCode(activeLodCode);
    setMessage("Loaded snapshot from file.");
  } catch {
    setMessage("That file could not be read.");
  } finally {
    snapshotFile.value = "";
  }
});

boot();
startAutoRefresh();

async function boot() {
  syncPortalCodeInput();

  if (!activeLodCode) {
    renderEmptyPortal();
    setMessage("Enter a LOD code to load a published snapshot.");
    return;
  }

  const localSnapshot = readStoredSnapshot(activeLodCode);
  if (localSnapshot) {
    if (shouldExpirePortalSession(activeLodCode, localSnapshot)) {
      expirePortalSession(activeLodCode, "EXPIRED CODE");
      return;
    }

    renderSnapshot(localSnapshot, "Local snapshot");
  }

  await loadPublishedSnapshot(activeLodCode, false);

  if (!activeSnapshot) {
    setMessage(`No published snapshot found for LOD ${activeLodCode}.`);
  }
}

async function loadPublishedSnapshot(code, announceFailure) {
  const normalizedCode = normalizeLodCode(code);
  if (!normalizedCode) {
    if (announceFailure && !activeSnapshot) {
      setMessage("Enter a LOD code to load a published snapshot.");
    }
    return;
  }

  const localSnapshot = readStoredSnapshot(normalizedCode);

  updateUrlForCode(normalizedCode);

  if (localSnapshot && !activeSnapshot) {
    if (shouldExpirePortalSession(normalizedCode, localSnapshot)) {
      expirePortalSession(normalizedCode, "EXPIRED CODE");
      return;
    }

    renderSnapshot(localSnapshot, normalizedCode ? `Local LOD ${normalizedCode}` : "Local snapshot");
  }

  for (const baseUrl of getCandidateBaseUrls(normalizedCode)) {
    try {
      const response = await fetch(getSnapshotUrl(baseUrl, normalizedCode), { cache: "no-store" });

      if (response.status === 410) {
        expirePortalSession(normalizedCode, "EXPIRED CODE");
        return;
      }

      if (!response.ok) {
        continue;
      }

      const snapshot = normalizeSnapshot(await response.json());
      if (!snapshot) {
        continue;
      }

      if (shouldExpirePortalSession(normalizedCode, snapshot)) {
        expirePortalSession(normalizedCode, "EXPIRED CODE");
        return;
      }

      if (snapshot.lodCode && !normalizedCode) {
        activeLodCode = normalizeLodCode(snapshot.lodCode);
      } else if (normalizedCode) {
        activeLodCode = normalizedCode;
      }

      syncPortalCodeInput();
      saveStoredPortalLodCode(activeLodCode);
      renderSnapshot(snapshot, activeLodCode ? `LOD ${activeLodCode}` : "Published snapshot");
      storeSnapshot(activeLodCode, snapshot);
      return;
    } catch {
      // Try the next configured host.
    }
  }

  if (announceFailure && !activeSnapshot) {
    setMessage(normalizedCode
      ? `Unable to load the published snapshot for LOD ${normalizedCode}.`
      : "Unable to load the published snapshot.");
  }
}

function startAutoRefresh() {
  if (!API_BASE_URLS.length) {
    return;
  }

  refreshTimer = window.setInterval(() => {
    if (activeLodCode) {
      if (isPortalSessionExpired(activeLodCode)) {
        expirePortalSession(activeLodCode, "EXPIRED CODE");
        return;
      }
      loadPublishedSnapshot(activeLodCode, false);
    }
  }, Math.max(1000, API_REFRESH_MS));
}

function clearPortalCode() {
  const previousCode = activeLodCode;
  activeLodCode = "";
  activeSnapshot = null;
  clearPortalExpiry(previousCode);
  saveStoredPortalLodCode("");
  updateUrlForCode("");
  syncPortalCodeInput();
  renderEmptyPortal();
  setMessage("LOD code cleared.");
}

function normalizeSnapshot(data) {
  if (!data || typeof data !== "object") {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(data, "state")) {
    return {
      version: Number(data.version || 1),
      exportedAt: data.exportedAt || "",
      lodCode: normalizeLodCode(data.lodCode),
      expiresAt: Number(data.expiresAt || 0) || 0,
      portalNotice: String(data.portalNotice || ""),
      state: data.state && typeof data.state === "object" ? data.state : null,
      outShots: Array.isArray(data.outShots) ? data.outShots : [],
      mysteryOut: data.mysteryOut || "",
    };
  }

  return {
    version: 1,
    exportedAt: data.exportedAt || "",
    lodCode: normalizeLodCode(data.lodCode),
    expiresAt: Number(data.expiresAt || 0) || 0,
    portalNotice: String(data.portalNotice || ""),
    state: data,
    outShots: Array.isArray(data.outShots) ? data.outShots : [],
    mysteryOut: data.mysteryOut || "",
  };
}

function renderSnapshot(snapshot, sourceLabel) {
  activeSnapshot = snapshot;

  if (snapshot.lodCode) {
    activeLodCode = normalizeLodCode(snapshot.lodCode);
  }

  if (lodCodeInput) {
    lodCodeInput.value = activeLodCode || "";
  }

  const state = snapshot.state || null;
  publishedAt.textContent = snapshot.exportedAt ? formatDate(snapshot.exportedAt) : sourceLabel;
  lodCodeText.textContent = activeLodCode || "Not set";
  championText.textContent = state?.champion || "Pending";
  teamCountText.textContent = getTeamCount(state);
  bracketSubtitle.textContent = `${sourceLabel} loaded`;
  setPortalNotice(snapshot.portalNotice || "");

  if (!state) {
    portalBracket.className = "bracket empty";
    portalBracket.textContent = "No bracket data is available in this snapshot.";
    setMessage("");
    return;
  }

  portalBracket.className = "bracket";
  portalBracket.innerHTML = renderBracket(state);
  focusActiveMatch(state);
  updateUrlForCode(activeLodCode);
  updatePortalExpiryFromSnapshot(activeLodCode, snapshot.expiresAt, state);
  setMessage("");
}

function renderEmptyPortal() {
  portalBracket.className = "bracket empty";
  portalBracket.textContent = "No bracket snapshot available.";
  publishedAt.textContent = "No snapshot loaded";
  lodCodeText.textContent = "Not set";
  championText.textContent = "Pending";
  teamCountText.textContent = "-";
  bracketSubtitle.textContent = "Waiting for a published snapshot.";
  setPortalNotice("");
}

function focusActiveMatch(state) {
  const matchId = getActiveMatchId(state);
  const normalizedCode = normalizeLodCode(activeLodCode);

  if (!matchId || !normalizedCode) {
    autoFocusAppliedForCode = "";
    return;
  }

  const focusKey = `${normalizedCode}:${matchId}`;
  if (autoFocusAppliedForCode === focusKey) {
    return;
  }

  const target = document.querySelector(`.match[data-match-id="${String(matchId)}"]`);
  if (!target) {
    autoFocusAppliedForCode = focusKey;
    return;
  }

  window.requestAnimationFrame(() => {
    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  });

  autoFocusAppliedForCode = focusKey;
}

function getActiveMatchId(state) {
  if (!state || !Array.isArray(state.matches)) {
    return "";
  }

  const match = state.matches.find((entry) => isFocusCandidate(entry));
  return match ? String(match.id || "") : "";
}

function isFocusCandidate(match) {
  if (!match || typeof match !== "object") {
    return false;
  }

  const players = Array.isArray(match.players) ? match.players : [];
  const sources = Array.isArray(match.slotSources) ? match.slotSources : [];
  const hasContent = players.some((player) => player && player !== "BYE") || sources.some(Boolean);

  return hasContent && !match.winner;
}

function isCurrentMatch(match) {
  return String(match?.id || "") === getActiveMatchId(activeSnapshot?.state || null);
}

function renderBracket(state) {
  const sections = [];

  if (state.mode === "graph") {
    sections.push(renderGraphSection("Winners bracket", state.rounds?.winner || []));
    sections.push(renderGraphSection("Losers bracket", state.rounds?.loser || []));
    sections.push(renderFinalSection(state));
    return sections.join("");
  }

  sections.push(renderStandardSection("Winners bracket", state.winnerRounds || []));
  sections.push(renderStandardSection("Losers bracket", state.loserRounds || []));
  sections.push(renderFinalSection(state));
  return sections.join("");
}

function renderStandardSection(title, rounds) {
  const renderedRounds = rounds.map((round, index) => `
    <section class="round-card">
      <h3 class="round-title">${escapeHtml(round.title || `${title} R${index + 1}`)}</h3>
      ${renderMatches(round.matches || [], "standard")}
    </section>
  `).join("");

  return `
    <section class="bracket-section">
      <h3>${escapeHtml(title)}</h3>
      <div class="rounds">${renderedRounds}</div>
    </section>
  `;
}

function renderGraphSection(title, rounds) {
  const renderedRounds = rounds.map((round, index) => `
    <section class="round-card">
      <h3 class="round-title">${escapeHtml(`${title} R${index + 1}`)}</h3>
      ${renderMatches(round || [], "graph")}
    </section>
  `).join("");

  return `
    <section class="bracket-section">
      <h3>${escapeHtml(title)}</h3>
      <div class="rounds">${renderedRounds}</div>
    </section>
  `;
}

function renderFinalSection(state) {
  const matches = [
    state.final,
    state.resetFinal,
    state.doubleDipFinal,
  ].filter(Boolean);

  return `
    <section class="bracket-section">
      <h3>Final</h3>
      <div class="final-block">
        ${renderMatches(matches, "final")}
        ${renderChampionBox(state)}
      </div>
    </section>
  `;
}

function renderChampionBox(state) {
  const champion = state.champion || "Pending";
  const note = state.champion ? "Tournament champion" : "Waiting for the final result";

  return `
    <aside class="champion-box" aria-label="Tournament winner">
      <p class="champion-box-title">Winner</p>
      <div class="champion-box-name">${escapeHtml(champion)}</div>
      <p class="champion-box-note">${escapeHtml(note)}</p>
    </aside>
  `;
}

function renderMatches(matches, mode) {
  return matches.map((match) => renderMatch(match, mode)).join("");
}

function renderMatch(match, mode) {
  if (!match || !Array.isArray(match.players)) {
    return "";
  }

  const players = match.players || [];
  const sources = match.slotSources || [];
  const isComplete = Boolean(match.winner) || Boolean(match.autoAdvanced);
  const hasContent = players.some((player) => player && player !== "BYE") ||
    sources.some(Boolean) ||
    isComplete;

  if (!hasContent) {
    return "";
  }

  const status = match.winner
    ? "Complete"
    : match.autoAdvanced
      ? "Auto"
      : "Pending";

  return `
    <article class="match ${isComplete ? "complete" : "pending"}${isCurrentMatch(match) ? " current" : ""}" data-match-id="${escapeHtml(String(match.id || ""))}">
      <div class="match-header">
        <p class="match-title">${escapeHtml(match.title || (match.gameNumber ? `Game ${match.gameNumber}` : "Match"))}</p>
        <span class="match-status">${escapeHtml(status)}</span>
      </div>
      ${renderMatchMeta(match, mode)}
      <div class="slots">
        ${players.map((player, index) => renderSlot(match, player, sources[index], index)).join("")}
      </div>
    </article>
  `;
}

function renderMatchMeta(match, mode) {
  const labels = [];

  if (match.gameNumber) {
    labels.push(`Game ${match.gameNumber}`);
  }

  if (Number.isInteger(Number(match.boardAssignment)) && Number(match.boardAssignment) > 0) {
    labels.push(`Board ${Number(match.boardAssignment)}`);
  }

  if (mode === "graph" && match.type === "winner" && match.loserTo?.matchId) {
    labels.push(`Loser to Game ${match.loserTo.matchId}`);
  }

  if (mode === "graph" && match.winnerTo?.matchId) {
    labels.push(`Winner to Game ${match.winnerTo.matchId}`);
  }

  if (!labels.length) {
    return "";
  }

  return `<p class="match-meta">${escapeHtml(labels.join(" | "))}</p>`;
}

function renderSlot(match, player, source, index) {
  const label = player || source || "Waiting";
  const classes = [
    "slot",
    player === "BYE" ? "bye" : "",
    match.winner && player === match.winner ? "winner" : "",
    match.loser && player === match.loser ? "loser" : "",
  ].filter(Boolean).join(" ");

  return `
    <div class="${classes}">
      <div class="slot-label">${escapeHtml(label)}</div>
      ${source && !player ? `<div class="slot-source">${escapeHtml(source)}</div>` : ""}
    </div>
  `;
}

function getTeamCount(state) {
  if (!state) {
    return "-";
  }

  if (Array.isArray(state.originalPlayers)) {
    return String(state.originalPlayers.length);
  }

  if (typeof state.size === "number") {
    return String(state.size);
  }

  return "-";
}

function setMessage(text) {
  portalMessage.textContent = text;
}

function setPortalNotice(text) {
  if (!portalNotice) {
    return;
  }

  const value = String(text || "").trim();
  portalNotice.hidden = !value;
  portalNotice.textContent = value;
}

function getRequestedLodCode() {
  try {
    const params = new URLSearchParams(window.location.search);
    return normalizeLodCode(params.get("lod") || params.get("code") || "");
  } catch {
    return "";
  }
}

function normalizeLodCode(value) {
  return String(value || "")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 12);
}

function getSnapshotFileName(code) {
  const normalized = normalizeLodCode(code);
  return normalized ? `lod-${normalized}.json` : DEFAULT_SNAPSHOT_FILE;
}

function getCandidateBaseUrls(code) {
  const urls = API_BASE_URLS.length ? API_BASE_URLS : [""];
  return urls.filter(Boolean);
}

function getSnapshotUrl(baseUrl, code) {
  const normalized = normalizeLodCode(code);
  return normalized ? `${baseUrl}/api/lod/${encodeURIComponent(normalized)}` : DEFAULT_SNAPSHOT_FILE;
}

function getApiBaseUrls() {
  const configuredUrls = Array.isArray(window.BRACKET_API_BASE_URLS)
    ? window.BRACKET_API_BASE_URLS
    : [window.BRACKET_API_BASE_URL];

  return configuredUrls
    .map(normalizeApiBaseUrl)
    .filter(Boolean);
}

function normalizeApiBaseUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) {
    return "";
  }

  return trimmed.replace(/\/+$/, "");
}

function getLocalSnapshotKey(code) {
  const normalized = normalizeLodCode(code) || "default";
  return `${LOCAL_SNAPSHOT_KEY_PREFIX}${normalized}`;
}

function getPortalExpiryKey(code) {
  const normalized = normalizeLodCode(code) || "default";
  return `${portalSessionExpiryStorageKey}:${normalized}`;
}

function syncPortalCodeInput() {
  if (lodCodeInput) {
    lodCodeInput.value = activeLodCode || "";
  }
}

function updatePortalExpiryFromSnapshot(code, expiresAt, state) {
  const normalizedCode = normalizeLodCode(code);
  if (!normalizedCode) {
    return;
  }

  if (state && state.champion) {
    const parsedExpiry = Number(expiresAt || 0);
    const deadline = Number.isFinite(parsedExpiry) && parsedExpiry > 0
      ? parsedExpiry
      : (getStoredPortalExpiry(normalizedCode) || (Date.now() + portalSessionDurationMs));
    saveStoredPortalExpiry(normalizedCode, deadline);
    schedulePortalExpiryTimer(normalizedCode, deadline);
    return;
  }

  clearPortalExpiry(normalizedCode);
}

function shouldExpirePortalSession(code, snapshot) {
  const normalizedCode = normalizeLodCode(code);
  if (!normalizedCode) {
    return false;
  }

  const state = snapshot?.state || null;
  if (!state || !state.champion) {
    return false;
  }

  const parsedExpiry = Number(snapshot?.expiresAt || 0);
  const expiresAt = Number.isFinite(parsedExpiry) && parsedExpiry > 0
    ? parsedExpiry
    : (getStoredPortalExpiry(normalizedCode) || (Date.now() + portalSessionDurationMs));
  saveStoredPortalExpiry(normalizedCode, expiresAt);
  const remaining = expiresAt - Date.now();
  if (remaining <= 0) {
    return true;
  }

  schedulePortalExpiryTimer(normalizedCode, expiresAt);
  return false;
}

function schedulePortalExpiryTimer(code, expiresAt) {
  clearPortalExpiryTimer();
  const normalizedCode = normalizeLodCode(code);
  if (!normalizedCode) {
    return;
  }

  const remaining = Number(expiresAt) - Date.now();
  if (!Number.isFinite(remaining) || remaining <= 0) {
    expirePortalSession(normalizedCode);
    return;
  }

  portalExpiryTimer = window.setTimeout(() => {
    expirePortalSession(normalizedCode);
  }, remaining);
}

function expirePortalSession(code, messageText = "") {
  const normalizedCode = normalizeLodCode(code);
  if (!normalizedCode) {
    return;
  }

  clearPortalExpiryTimer();
  clearPortalExpiry(normalizedCode);

  if (activeLodCode === normalizedCode) {
    activeLodCode = "";
    activeSnapshot = null;
    saveStoredPortalLodCode("");
    updateUrlForCode("");
    syncPortalCodeInput();
    renderEmptyPortal();
    setMessage(messageText || `LOD ${normalizedCode} session ended.`);
  }
}

function clearPortalExpiry(code) {
  const normalizedCode = normalizeLodCode(code);
  if (!normalizedCode || !canUseLocalStorage()) {
    clearPortalExpiryTimer();
    return;
  }

  clearPortalExpiryTimer();
  try {
    localStorage.removeItem(getPortalExpiryKey(normalizedCode));
  } catch {
    // Ignore storage failures.
  }
}

function clearPortalExpiryTimer() {
  if (portalExpiryTimer) {
    window.clearTimeout(portalExpiryTimer);
    portalExpiryTimer = null;
  }
}

function getStoredPortalExpiry(code) {
  if (!canUseLocalStorage()) {
    return 0;
  }

  try {
    const raw = localStorage.getItem(getPortalExpiryKey(code));
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

function isPortalSessionExpired(code) {
  const normalizedCode = normalizeLodCode(code);
  if (!normalizedCode) {
    return false;
  }

  const expiresAt = getStoredPortalExpiry(normalizedCode);
  return Boolean(expiresAt) && expiresAt <= Date.now();
}

function saveStoredPortalExpiry(code, expiresAt) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    localStorage.setItem(getPortalExpiryKey(code), String(Number(expiresAt) || 0));
  } catch {
    // Ignore storage failures.
  }
}

function getStoredPortalLodCode() {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const raw = localStorage.getItem(portalLodCodeStorageKey);
    if (raw === null) {
      return null;
    }

    if (raw === portalLodCodeClearedValue) {
      return "";
    }

    return normalizeLodCode(raw);
  } catch {
    return null;
  }
}

function saveStoredPortalLodCode(code) {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    localStorage.setItem(portalLodCodeStorageKey, code ? normalizeLodCode(code) : portalLodCodeClearedValue);
  } catch {
    // Ignore storage failures.
  }
}

function updateUrlForCode(code) {
  const normalized = normalizeLodCode(code);

  try {
    const url = new URL(window.location.href);
    if (normalized) {
      url.searchParams.set("lod", normalized);
    } else {
      url.searchParams.delete("lod");
      url.searchParams.delete("code");
    }
    window.history.replaceState({}, "", url);
  } catch {
    // Ignore URL update failures.
  }
}

function readStoredSnapshot(code) {
  try {
    const raw = localStorage.getItem(getLocalSnapshotKey(code));
    if (!raw) {
      return null;
    }

    return normalizeSnapshot(JSON.parse(raw));
  } catch {
    return null;
  }
}

function storeSnapshot(code, snapshot) {
  try {
    localStorage.setItem(getLocalSnapshotKey(code), JSON.stringify(snapshot));
  } catch {
    // Ignore storage failures.
  }
}

function canUseLocalStorage() {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return date.toLocaleString();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
