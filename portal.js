const LOCAL_SNAPSHOT_KEY_PREFIX = "dartsTournamentPortalSnapshot:";
const DEFAULT_SNAPSHOT_FILE = "bracket-state.json";
const API_BASE_URLS = getApiBaseUrls();
const API_REFRESH_MS = Number(window.BRACKET_API_POLL_MS || 5000);
const portalBracket = document.querySelector("#portalBracket");
const portalMessage = document.querySelector("#portalMessage");
const publishedAt = document.querySelector("#publishedAt");
const lodCodeText = document.querySelector("#lodCodeText");
const copyPortalLinkButton = document.querySelector("#copyPortalLink");
const lodCodeInput = document.querySelector("#lodCodeInput");
const loadLodCodeButton = document.querySelector("#loadLodCode");
const clearLodCodeButton = document.querySelector("#clearLodCode");
const championText = document.querySelector("#championText");
const teamCountText = document.querySelector("#teamCountText");
const bracketSubtitle = document.querySelector("#bracketSubtitle");
const snapshotFile = document.querySelector("#snapshotFile");
const portalLodCodeStorageKey = "dartsTournamentPortalLodCode";
const portalLodCodeClearedValue = "__CLEARED__";
const portalSessionExpiryStorageKey = "dartsTournamentPortalExpiry";
const portalSessionDurationMs = 60 * 60 * 1000;

let activeSnapshot = null;
const storedLodCode = getStoredPortalLodCode();
const requestedLodCode = getRequestedLodCode();
let activeLodCode = requestedLodCode || (storedLodCode !== null ? storedLodCode : "");
let refreshTimer = null;
let portalExpiryTimer = null;
let autoFocusAppliedForCode = "";

loadLodCodeButton?.addEventListener("click", () => {
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

copyPortalLinkButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    setMessage("Portal link copied.");
  } catch {
    setMessage("Could not copy the portal link.");
  }
});

snapshotFile?.addEventListener("change", async () => {
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
  let preferredSnapshot = localSnapshot;

  updateUrlForCode(normalizedCode);

  if (localSnapshot && (!activeSnapshot || !areSnapshotsEqual(localSnapshot, activeSnapshot))) {
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

      if (preferredSnapshot && !shouldPreferSnapshot(snapshot, preferredSnapshot)) {
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
      preferredSnapshot = snapshot;
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
      portalNoticeAt: String(data.portalNoticeAt || ""),
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
    portalNoticeAt: String(data.portalNoticeAt || ""),
    state: data,
    outShots: Array.isArray(data.outShots) ? data.outShots : [],
    mysteryOut: data.mysteryOut || "",
  };
}

function areSnapshotsEqual(left, right) {
  if (!left || !right) {
    return false;
  }

  try {
    return JSON.stringify(left) === JSON.stringify(right);
  } catch {
    return false;
  }
}

function shouldPreferSnapshot(candidate, current) {
  if (!candidate || !current) {
    return Boolean(candidate);
  }

  const candidateNotice = String(candidate.portalNotice || "").trim();
  const currentNotice = String(current.portalNotice || "").trim();
  const candidateStamp = Number(new Date(candidate.portalNoticeAt || candidate.exportedAt || 0));
  const currentStamp = Number(new Date(current.portalNoticeAt || current.exportedAt || 0));

  if (candidateNotice && !currentNotice) {
    return true;
  }

  if (!candidateNotice && currentNotice) {
    return false;
  }

  if (Number.isFinite(candidateStamp) && Number.isFinite(currentStamp)) {
    return candidateStamp >= currentStamp;
  }

  return true;
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
  setMessage(formatPortalCall(snapshot.portalNotice, snapshot.portalNoticeAt));

  if (!state) {
    portalBracket.className = "bracket empty";
    portalBracket.textContent = "No bracket data is available in this snapshot.";
    return;
  }

  portalBracket.className = "bracket";
  portalBracket.innerHTML = renderBracket(state);
  focusActiveMatch(state);
  updateUrlForCode(activeLodCode);
  updatePortalExpiryFromSnapshot(activeLodCode, snapshot.expiresAt, state);
}

function renderEmptyPortal() {
  portalBracket.className = "bracket empty";
  portalBracket.textContent = "No bracket snapshot available.";
  publishedAt.textContent = "No snapshot loaded";
  lodCodeText.textContent = "Not set";
  championText.textContent = "Pending";
  teamCountText.textContent = "-";
  bracketSubtitle.textContent = "Waiting for a published snapshot.";
  setMessage("");
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
    sections.push(renderPdfVisualBracket(state));
    return sections.join("");
  }

  sections.push(renderStandardSection("Winners bracket", state.winnerRounds || []));
  sections.push(renderStandardSection("Losers bracket", state.loserRounds || []));
  sections.push(renderFinalSection(state));
  return sections.join("");
}

function renderPdfVisualBracket(state) {
  const doubleDipFinal = state.resetFinal && state.resetFinal.winner && state.resetFinal.winner !== state.resetFinal.players[0]
    ? ensureDoubleDipFinal(state, state.resetFinal, state.resetFinal.players[0], state.resetFinal.players[1])
    : state.doubleDipFinal;
  const finalMatches = [state.final, state.resetFinal, doubleDipFinal].filter(Boolean);
  const maxColumns = Math.max(state.rounds?.winner?.length || 0, state.rounds?.loser?.length || 0, finalMatches.length ? 1 : 0);

  return `
    <section class="bracket-section pdf-visual-section">
      <div class="pdf-visual-heading">
        <div>
          <h3>PDF bracket</h3>
          <p>${escapeHtml((state.originalPlayers || []).length)} teams - printed game layout</p>
        </div>
        <span>${escapeHtml(state.originalPlayers?.length ? `LOD ${activeLodCode || "N/A"}` : "Generated bracket")}</span>
      </div>
      <div class="pdf-visual-scroll">
        <div class="pdf-visual-grid" style="--pdf-columns: ${maxColumns};">
          ${renderPdfVisualBand("Winners bracket", state.rounds?.winner || [], "winner", state)}
          ${renderPdfVisualBand("Losers bracket", state.rounds?.loser || [], "loser", state)}
          <div class="pdf-visual-band final-band">
            <p class="pdf-band-title">Final</p>
            <div class="pdf-visual-columns">
              <div class="pdf-visual-column final-column">
                ${finalMatches.map((match) => renderFinalMatchBlock(match, match.title)).join("")}
                ${renderChampionBox(state)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderPdfVisualBand(title, rounds, type, state) {
  const hasPlayIn = type === "winner" && Array.isArray(state?.matches) && state.matches.some((match) => match.type === "winner" && isPlayInMatch(match));
  const greyColumnIndex = type === "winner" ? (hasPlayIn ? 2 : 1) : -1;

  return `
    <div class="pdf-visual-band ${type}-band">
      <p class="pdf-band-title">${escapeHtml(title)}</p>
      <div class="pdf-visual-columns">
        ${rounds.map((round, index) => `
          <div class="pdf-visual-column ${type}-column ${index === greyColumnIndex ? "grey-column" : ""}" style="--column-index: ${index};">
            <p class="round-title">${escapeHtml(type === "winner" ? "Winners" : "Losers")} R${index + 1}</p>
            <div class="pdf-column-matches" style="--match-count: ${Math.max(round.matches?.length || round.length || 0, 1)};">
              ${(round.matches || round || []).map(renderMatch).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderFinalMatchBlock(match, title) {
  if (!match) {
    return "";
  }

  return `
    <div class="final-match-block">
      <p class="round-title">${escapeHtml(title || match.title || "Final")}</p>
      <article class="match ${match.winner ? "complete" : "pending"}${isCurrentMatch(match) ? " current" : ""}">
        <div class="match-header">
          <p class="match-title">${escapeHtml(match.title || "Final")}</p>
        </div>
        ${renderMatchMeta(match, "graph")}
        <div class="slots">
          ${(match.players || []).map((player, slotIndex) => renderSlot(match, player, (match.slotSources || [])[slotIndex], slotIndex)).join("")}
        </div>
      </article>
    </div>
  `;
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

function isPlayInMatch(match) {
  return Boolean(match?.isPlayIn);
}

function ensureDoubleDipFinal(bracketState, sourceMatch, winnersSidePlayer, losersSidePlayer) {
  if (!bracketState || !sourceMatch) {
    return null;
  }

  if (bracketState.doubleDipFinal) {
    return bracketState.doubleDipFinal;
  }

  if (!winnersSidePlayer || !losersSidePlayer) {
    return null;
  }

  return {
    id: `double-dip-${sourceMatch.id}`,
    type: "doubleDipFinal",
    title: "Game 14 - Double Dip Final",
    players: [winnersSidePlayer, losersSidePlayer],
    slotSources: [
      "Winner of Game 13",
      "Loser of Game 13",
    ],
    winner: "",
    loser: "",
    winnerTo: null,
    loserTo: null,
    autoAdvanced: false,
    isPlayIn: false,
    gameNumber: 14,
  };
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
  const value = String(text || "").trim();
  portalMessage.textContent = value;
  portalMessage.hidden = !value;
}

function formatPortalCall(message, stamp) {
  const text = String(message || "").trim();
  if (!text) {
    return "";
  }

  const time = formatBoardCallTime(stamp);
  return time ? `${text} • ${time}` : text;
}

function formatBoardCallTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
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
