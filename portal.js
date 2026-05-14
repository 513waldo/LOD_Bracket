const LOCAL_SNAPSHOT_KEY_PREFIX = "dartsTournamentPortalSnapshot:";
const DEFAULT_SNAPSHOT_FILE = "bracket-state.json";
const portalBracket = document.querySelector("#portalBracket");
const portalMessage = document.querySelector("#portalMessage");
const publishedAt = document.querySelector("#publishedAt");
const lodCodeText = document.querySelector("#lodCodeText");
const lodCodeInput = document.querySelector("#lodCodeInput");
const loadLodCodeButton = document.querySelector("#loadLodCode");
const championText = document.querySelector("#championText");
const teamCountText = document.querySelector("#teamCountText");
const bracketSubtitle = document.querySelector("#bracketSubtitle");
const snapshotFile = document.querySelector("#snapshotFile");
const reloadSnapshotButton = document.querySelector("#reloadSnapshot");

let activeSnapshot = null;
let activeLodCode = getRequestedLodCode();

reloadSnapshotButton.addEventListener("click", () => {
  loadPublishedSnapshot(activeLodCode, true);
});

loadLodCodeButton.addEventListener("click", () => {
  const code = normalizeLodCode(lodCodeInput.value);

  if (!code) {
    setMessage("Enter a LOD code first.");
    return;
  }

  activeLodCode = code;
  updateUrlForCode(code);
  loadPublishedSnapshot(code, true);
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

async function boot() {
  if (activeLodCode) {
    lodCodeInput.value = activeLodCode;
  }

  const localSnapshot = readStoredSnapshot(activeLodCode);
  if (localSnapshot) {
    renderSnapshot(localSnapshot, "Local snapshot");
  }

  await loadPublishedSnapshot(activeLodCode, false);

  if (!activeSnapshot) {
    setMessage(activeLodCode
      ? `No published snapshot found for LOD ${activeLodCode}.`
      : "Enter a LOD code to load a published snapshot.");
  }
}

async function loadPublishedSnapshot(code, announceFailure) {
  const normalizedCode = normalizeLodCode(code);
  const localSnapshot = readStoredSnapshot(normalizedCode);

  updateUrlForCode(normalizedCode);

  if (localSnapshot && !activeSnapshot) {
    renderSnapshot(localSnapshot, normalizedCode ? `Local LOD ${normalizedCode}` : "Local snapshot");
  }

  try {
    const response = normalizedCode
      ? await fetch(`lod-${normalizedCode}.json`, { cache: "no-store" })
      : await fetch(DEFAULT_SNAPSHOT_FILE, { cache: "no-store" });

    if (!response.ok) {
      if (announceFailure && !activeSnapshot) {
        setMessage(normalizedCode
          ? `No published snapshot found for LOD ${normalizedCode}.`
          : "No published snapshot found.");
      }
      return;
    }

    const snapshot = normalizeSnapshot(await response.json());
    if (!snapshot) {
      if (announceFailure && !activeSnapshot) {
        setMessage(normalizedCode
          ? `The published snapshot for LOD ${normalizedCode} is not usable.`
          : "The published snapshot is not usable.");
      }
      return;
    }

    if (snapshot.lodCode && !normalizedCode) {
      activeLodCode = normalizeLodCode(snapshot.lodCode);
    } else if (normalizedCode) {
      activeLodCode = normalizedCode;
    }

    if (lodCodeInput) {
      lodCodeInput.value = activeLodCode || "";
    }

    renderSnapshot(snapshot, activeLodCode ? `LOD ${activeLodCode}` : "Published snapshot");
    storeSnapshot(activeLodCode, snapshot);
  } catch {
    if (announceFailure && !activeSnapshot) {
      setMessage(normalizedCode
        ? `Unable to load the published snapshot for LOD ${normalizedCode}.`
        : "Unable to load the published snapshot.");
    }
  }
}

function normalizeSnapshot(data) {
  if (!data || typeof data !== "object") {
    return null;
  }

  if (data.state && typeof data.state === "object") {
    return {
      version: Number(data.version || 1),
      exportedAt: data.exportedAt || "",
      lodCode: normalizeLodCode(data.lodCode),
      state: data.state,
      outShots: Array.isArray(data.outShots) ? data.outShots : [],
      mysteryOut: data.mysteryOut || "",
    };
  }

  return {
    version: 1,
    exportedAt: data.exportedAt || "",
    lodCode: normalizeLodCode(data.lodCode),
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

  if (!state) {
    portalBracket.className = "bracket empty";
    portalBracket.textContent = "No bracket data is available in this snapshot.";
    setMessage("");
    return;
  }

  portalBracket.className = "bracket";
  portalBracket.innerHTML = renderBracket(state);
  updateUrlForCode(activeLodCode);
  setMessage("");
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
    <article class="match ${isComplete ? "complete" : "pending"}">
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

function getLocalSnapshotKey(code) {
  const normalized = normalizeLodCode(code) || "default";
  return `${LOCAL_SNAPSHOT_KEY_PREFIX}${normalized}`;
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
