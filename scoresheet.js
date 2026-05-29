const STORAGE_KEY = "docTabletScoresheetState";
const ROSTER_SLOT_MODE_VERSION = 2;

const leaguePlayerPool = [
  "Shellie Hudson",
  "Kelli Rinear",
  "Doree Gardner",
  "Neal Yates",
  "Amber Lane",
  "Ernie Elliot",
  "Kirk Schreiber",
  "Sherry Wright",
  "Jay Moretti",
  "Mike Knight",
  "Geoff Schwein",
  "Eric Frantz",
  "Cindy Stine",
  "Garry Horn",
  "Dave Matlack",
  "Marc Bennett",
  "Kristi Wagers",
  "Julie Wendt",
  "Steve Statman",
  "Jenn Florian",
  "John Heckler",
  "Stacy McMath",
  "Cody Lawton",
  "Angie Taylor",
  "Pam Statman",
  "Craig Slade",
  "Bob Slade",
  "AJ Riley",
  "Mike Madsen",
];

const leagueTeams = {
  "Damn Those Darts": [
    "Shellie Hudson",
    "Doree Gardner",
    "Amber Lane",
    "Kirk Schreiber",
  ],
  "Fire & Ice": [
    "Shellie Hudson",
    "Kelli Rinear",
    "Neal Yates",
    "Ernie Elliot",
    "Sherry Wright",
  ],
  "Men & Women of Steel": [
    "Jay Moretti",
    "Geoff Schwein",
    "Cindy Stine",
    "Dave Matlack",
    "Kristi Wagers",
  ],
  "Hit Squad": [
    "Mike Knight",
    "Eric Frantz",
    "Garry Horn",
    "Marc Bennett",
    "Waldo",
  ],
  "Mean Girls": [
    "Julie Wendt",
    "Jenn Florian",
    "Stacy McMath",
    "Angie Taylor",
  ],
  "Pavlov's Dogs": [
    "Steve Statman",
    "John Heckler",
    "Cody Lawton",
    "Pam Statman",
  ],
  "The Nature Boys": [
    "Craig Slade",
    "Bob Slade",
    "AJ Riley",
    "Mike Madsen",
  ],
  "Smells Like Bulls Hit": ["Waldo", "Eric", "Garry", "Knightert"],
};

const leagueTeamNames = Object.keys(leagueTeams);
const leagueTeamLookup = new Map(leagueTeamNames.map((teamName) => [teamNameKey(teamName), teamName]));

const slotNumbers = ["1", "2", "3", "4"];
const rosterRowCount = 4;

const matchTemplates = [
  { kind: "match", section: "501", code: "D-501", label: "Doubles 501", homeLine: "1* & 2", awayLine: "1* & 2", homeSlots: [0, 1], awaySlots: [0, 1] },
  { kind: "match", section: "501", code: "S-501", label: "Singles 501", homeLine: "3", awayLine: "3", homeSlots: [2], awaySlots: [2] },
  { kind: "match", section: "501", code: "D-501", label: "Doubles 501", homeLine: "1 & 3*", awayLine: "1 & 3*", homeSlots: [0, 2], awaySlots: [0, 2] },
  { kind: "match", section: "501", code: "S-501", label: "Singles 501", homeLine: "2", awayLine: "2", homeSlots: [1], awaySlots: [1] },
  { kind: "match", section: "501", code: "D-501", label: "Doubles 501", homeLine: "2* & 3", awayLine: "2* & 3", homeSlots: [1, 2], awaySlots: [1, 2] },
  { kind: "match", section: "501", code: "S-501", label: "Singles 501", homeLine: "1*", awayLine: "1*", homeSlots: [0], awaySlots: [0] },
  { kind: "break", label: "---------- ---------------------------- ----- ----- --------------------------------- ---------" },
  { kind: "match", section: "CRKT", code: "D-CRKT", label: "Doubles Cricket", homeLine: "1 & 2*", awayLine: "1 & 3*", homeSlots: [0, 1], awaySlots: [0, 2] },
  { kind: "match", section: "CRKT", code: "S-CRKT", label: "Singles Cricket", homeLine: "3", awayLine: "2*", homeSlots: [2], awaySlots: [1] },
  { kind: "match", section: "CRKT", code: "D-CRKT", label: "Doubles Cricket", homeLine: "1* & 3", awayLine: "2* & 3", homeSlots: [0, 2], awaySlots: [1, 2] },
  { kind: "match", section: "CRKT", code: "S-CRKT", label: "Singles Cricket", homeLine: "2*", awayLine: "1", homeSlots: [1], awaySlots: [0] },
  { kind: "match", section: "CRKT", code: "D-CRKT", label: "Doubles Cricket", homeLine: "2 & 3*", awayLine: "1* & 2", homeSlots: [1, 2], awaySlots: [0, 1] },
  { kind: "match", section: "CRKT", code: "S-CRKT", label: "Singles Cricket", homeLine: "1", awayLine: "3", homeSlots: [0], awaySlots: [2] },
  { kind: "break", label: "-------- ------------------------------ --- --- ---------------------------- ----------" },
  { kind: "match", section: "CHICAGO", code: "CHICAGO", label: "Chicago", homeLine: "1-2-3", awayLine: "1-2-3", homeSlots: [0, 1, 2], awaySlots: [0, 1, 2], formatNote: "Best 2 of 3 - Each win is worth one point" },
];

const defaultState = {
  rosterSlotModeVersion: ROSTER_SLOT_MODE_VERSION,
  meta: {
    date: "",
    division: "",
    format: "team",
    captainSign: "",
    sheetNotes: "",
  },
  teams: {
    home: {
      name: "",
      team: "",
      roster: ["", "", "", ""],
    },
    away: {
      name: "",
      team: "",
      roster: ["", "", "", ""],
    },
  },
  matches: matchTemplates.map((entry) => ({
    kind: entry.kind,
    code: entry.code || "",
    label: entry.label || "",
    homeLine: entry.homeLine || "",
    awayLine: entry.awayLine || "",
    homeSlots: entry.homeSlots || [],
    awaySlots: entry.awaySlots || [],
    formatNote: entry.formatNote || "",
    homeScore: "",
    awayScore: "",
    awardShot: "",
    notes: "",
  })),
};

const matchDate = document.querySelector("#matchDate");
const division = document.querySelector("#division");
const matchFormat = document.querySelector("#matchFormat");
const homeTeamSelect = document.querySelector("#homeTeamSelect");
const awayTeamSelect = document.querySelector("#awayTeamSelect");
const homeRosterBank = document.querySelector("#homeRosterBank");
const awayRosterBank = document.querySelector("#awayRosterBank");
const ledgerBody = document.querySelector("#ledgerBody");
const captainSign = document.querySelector("#captainSign");
const sheetNotes = document.querySelector("#sheetNotes");
const matchTotal = document.querySelector("#matchTotal");
const homeScoreTotal = document.querySelector("#homeScoreTotal");
const awayScoreTotal = document.querySelector("#awayScoreTotal");
const saveSheet = document.querySelector("#saveSheet");
const resetSheet = document.querySelector("#resetSheet");

let state = loadState();

renderAll();

matchDate.addEventListener("change", updateMeta);
division.addEventListener("input", updateMeta);
matchFormat.addEventListener("change", updateMeta);
if (homeTeamSelect) {
  homeTeamSelect.addEventListener("change", () => {
    applyAndRefreshTeamSide("home", homeTeamSelect.value);
  });
}
if (awayTeamSelect) {
  awayTeamSelect.addEventListener("change", () => {
    applyAndRefreshTeamSide("away", awayTeamSelect.value);
  });
}
captainSign.addEventListener("input", updateMeta);
sheetNotes.addEventListener("input", updateMeta);
saveSheet.addEventListener("click", () => {
  persist();
  saveSheet.textContent = "Saved";
  window.setTimeout(() => {
    saveSheet.textContent = "Save sheet";
  }, 1000);
});
resetSheet.addEventListener("click", () => {
  state = structuredClone(defaultState);
  persist();
  renderAll();
});

function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return structuredClone(defaultState);
    }

    return mergeState(JSON.parse(raw));
  } catch {
    return structuredClone(defaultState);
  }
}

function mergeState(saved) {
  const next = structuredClone(defaultState);
  if (!saved || typeof saved !== "object") {
    return next;
  }

  const shouldClearSavedRosters = saved.rosterSlotModeVersion !== ROSTER_SLOT_MODE_VERSION;

  if (saved.meta && typeof saved.meta === "object") {
    Object.assign(next.meta, saved.meta);
  }

  if (saved.teams && typeof saved.teams === "object") {
    for (const side of ["home", "away"]) {
      const savedTeam = saved.teams[side];
      if (!savedTeam || typeof savedTeam !== "object") {
        continue;
      }

      if (shouldClearSavedRosters) {
        continue;
      }

      if (typeof savedTeam.team === "string") {
        next.teams[side].team = savedTeam.team;
      }

      if (typeof savedTeam.name === "string") {
        next.teams[side].name = savedTeam.name;
      }

      const canonicalTeam = canonicalTeamName(next.teams[side].team || next.teams[side].name);
      const mappedRoster = rosterForTeam(canonicalTeam);
      if (mappedRoster.length) {
        next.teams[side].team = canonicalTeam;
        next.teams[side].name = canonicalTeam;
        next.teams[side].roster = blankRoster();
      }

      if (Array.isArray(savedTeam.roster)) {
        const savedRoster = normalizeRosterSlots(savedTeam.roster);
        next.teams[side].roster = shouldClearSavedRosters
          || (mappedRoster.length && isDefaultTeamRoster(savedRoster, mappedRoster))
          ? blankRoster()
          : savedRoster;
      }
    }
  }

  if (Array.isArray(saved.matches) && saved.matches.length) {
    next.matches = defaultState.matches.map((template, index) => {
      const savedMatch = saved.matches[index] || {};
      return {
        ...template,
        homeScore: String(savedMatch.homeScore || ""),
        awayScore: String(savedMatch.awayScore || ""),
        awardShot: String(savedMatch.awardShot || ""),
        notes: String(savedMatch.notes || ""),
      };
    });
  }

  return next;
}

function persist() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  syncTeamSelectionDisplay();
  syncMatchTotal();
}

function renderAll() {
  matchDate.value = state.meta.date || "";
  division.value = state.meta.division || "";
  matchFormat.value = state.meta.format || "team";
  renderTeamSelect("home");
  renderTeamSelect("away");
  captainSign.value = state.meta.captainSign || "";
  sheetNotes.value = state.meta.sheetNotes || "";

  normalizeTeamSide("home");
  normalizeTeamSide("away");
  renderRosterBank("home", state.teams.home.team);
  renderRosterBank("away", state.teams.away.team);
  renderLedger();
  syncTeamSelectionDisplay();
  syncMatchTotal();
}

function updateMeta() {
  state.meta.date = matchDate.value;
  state.meta.division = division.value.trim();
  state.meta.format = matchFormat.value;
  state.meta.captainSign = captainSign.value.trim();
  state.meta.sheetNotes = sheetNotes.value.trim();
  persist();
}

function renderRosterBank(side, teamName = "") {
  const container = side === "home" ? homeRosterBank : awayRosterBank;
  const selectedTeam = String(
    teamName
      || state.teams[side].team
      || (side === "home" ? homeTeamSelect?.value : awayTeamSelect?.value)
      || ""
  ).trim();
  const canonicalTeam = canonicalTeamName(selectedTeam);
  const teamPool = rosterForTeam(canonicalTeam);
  const storedRoster = Array.isArray(state.teams[side].roster)
    ? state.teams[side].roster.map((value) => String(value || ""))
    : [];
  const selectedRoster = normalizeRosterSlots(storedRoster);
  const rosterOptions = teamPool.length ? teamPool : storedRoster.filter(Boolean);

  container.innerHTML = Array.from({ length: rosterRowCount }, (_, index) => {
    const slot = String(index + 1);
    const slotLabel = index === 3 ? "*" : `${slot})`;
    const currentValue = selectedRoster[index] || "";
    const slotOptions = currentValue && !rosterOptions.includes(currentValue)
      ? [currentValue, ...rosterOptions]
      : rosterOptions;
    return `
    <label data-player-label="${escapeAttribute(slotLabel)}">
      Player ${slot}
      <select data-side="${side}" data-roster-index="${index}">
        <option value="" ${!currentValue ? "selected" : ""}>Blank</option>
        ${slotOptions.map((player) => `<option value="${escapeAttribute(player)}" ${player === currentValue ? "selected" : ""}>${escapeHtml(player)}</option>`).join("")}
      </select>
    </label>
  `;
  }).join("");

  container.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", () => {
      const sideName = select.dataset.side;
      const rosterIndex = Number(select.dataset.rosterIndex);
      state.teams[sideName].roster = normalizeRosterSlots(state.teams[sideName].roster);
      state.teams[sideName].roster[rosterIndex] = select.value;
      renderLedger();
      persist();
    });
  });
}

function renderTeamSelect(side) {
  const select = side === "home" ? homeTeamSelect : awayTeamSelect;
  if (!select) {
    return;
  }
  select.innerHTML = [`<option value="">Blank</option>`, ...leagueTeamNames.map((teamName) => `
    <option value="${escapeAttribute(teamName)}">${escapeHtml(teamName)}</option>
  `)].join("");
}

function renderLedger() {
  ledgerBody.innerHTML = state.matches.map((match, index) => {
    if (match.kind === "break") {
      return `
        <tr class="section-break">
          <td colspan="7">${escapeHtml(match.label)}</td>
        </tr>
      `;
    }

    const homeNames = match.homeSlots.map((slotIndex) => playerForSlot("home", slotIndex));
    const awayNames = match.awaySlots.map((slotIndex) => playerForSlot("away", slotIndex));

    return `
      <tr data-match-index="${index}">
        <td>
          <strong>${escapeHtml(match.code)}</strong>
          <span class="player-label">${escapeHtml(match.label)}</span>
          ${match.formatNote ? `<span class="player-label">${escapeHtml(match.formatNote)}</span>` : ""}
        </td>
        <td>
          <span class="slot-pill">${escapeHtml(match.homeLine)}</span>
        </td>
        <td>
          ${renderPlayerNames(homeNames)}
        </td>
        <td class="ledger-field">
          ${renderScoreSelect("homeScore", match.homeScore)}
        </td>
        <td class="ledger-field">
          ${renderScoreSelect("awayScore", match.awayScore)}
        </td>
        <td>
          ${renderPlayerNames(awayNames)}
        </td>
        <td>
          <span class="slot-pill">${escapeHtml(match.awayLine)}</span>
        </td>
      </tr>
    `;
  }).join("");

  ledgerBody.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("input", handleMatchFieldUpdate);
    input.addEventListener("change", handleMatchFieldUpdate);
  });
}

function syncTeamRoster(side, teamName = "") {
  const selectedTeam = canonicalTeamName(teamName || state.teams[side].team || "");
  const pool = rosterForTeam(selectedTeam);
  if (pool.length) {
    state.teams[side].team = selectedTeam;
    state.teams[side].name = selectedTeam;
  }
  state.teams[side].roster = blankRoster();
  renderRosterBank(side, selectedTeam);
}

function applyTeamSelection(side, teamName) {
  const normalized = canonicalTeamName(teamName);
  state.teams[side].team = normalized;
  state.teams[side].name = normalized;
  state.teams[side].roster = blankRoster();
}

function applyAndRefreshTeamSide(side, teamName) {
  applyTeamSelection(side, teamName);
  renderTeamSelect(side);
  if (side === "home") {
    if (homeTeamSelect) {
      homeTeamSelect.value = state.teams.home.team || "";
    }
  } else {
    if (awayTeamSelect) {
      awayTeamSelect.value = state.teams.away.team || "";
    }
  }
  syncTeamRoster(side, teamName);
  renderRosterBank(side, teamName);
  renderLedger();
  syncTeamSelectionDisplay();
  persist();
}

function handleMatchFieldUpdate(event) {
  const row = event.target.closest("tr[data-match-index]");
  if (!row) {
    return;
  }

  const matchIndex = Number(row.dataset.matchIndex);
  const field = event.target.dataset.field;
  const value = event.target.value;
  const match = state.matches[matchIndex];
  if (!match || match.kind !== "match") {
    return;
  }

  if (["homeScore", "awayScore"].includes(field)) {
    match[field] = value;
    persist();
  }
}

function playerForSlot(side, slotIndex) {
  if (!Number.isInteger(slotIndex) || slotIndex < 0) {
    return "";
  }

  return state.teams[side].roster[slotIndex] || "";
}

function syncTeamSelectionDisplay() {
  const homeLabel = state.teams.home.name || state.teams.home.team || "";
  const awayLabel = state.teams.away.name || state.teams.away.team || "";
  const homeSelection = homeTeamSelect ? homeTeamSelect.value : state.teams.home.team || "";
  const awaySelection = awayTeamSelect ? awayTeamSelect.value : state.teams.away.team || "";

  if (homeTeamSelect) {
    homeTeamSelect.value = state.teams.home.team || "";
  }
  if (awayTeamSelect) {
    awayTeamSelect.value = state.teams.away.team || "";
  }

  const homeHeading = document.querySelector(".team-panel[data-side=\"home\"] h2");
  const awayHeading = document.querySelector(".team-panel[data-side=\"away\"] h2");
  if (homeHeading) {
    homeHeading.textContent = homeLabel || "Home team";
  }
  if (awayHeading) {
    awayHeading.textContent = awayLabel || "Away team";
  }

  renderRosterBank("home", homeSelection);
  renderRosterBank("away", awaySelection);
}

function syncMatchTotal() {
  const totals = state.matches.reduce((next, match) => {
    if (match.kind !== "match") {
      return next;
    }

    const home = scorePointValue(match.homeScore);
    const away = scorePointValue(match.awayScore);
    if (Number.isFinite(home)) {
      next.home += home;
    }
    if (Number.isFinite(away)) {
      next.away += away;
    }
    return next;
  }, { home: 0, away: 0 });

  if (homeScoreTotal) {
    homeScoreTotal.value = String(totals.home);
  }
  if (awayScoreTotal) {
    awayScoreTotal.value = String(totals.away);
  }
  matchTotal.value = `${totals.home} - ${totals.away}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}

function renderPlayerName(value) {
  const text = String(value || "").trim();
  return text ? `<span class="player-name">${escapeHtml(text)}</span>` : "";
}

function renderPlayerNames(values) {
  return (Array.isArray(values) ? values : [])
    .map((value) => renderPlayerName(value))
    .filter(Boolean)
    .join(" ");
}

function renderScoreSelect(field, value) {
  const selectedValue = String(value || "").trim().toUpperCase() === "X" ? "X" : "";
  return `
    <select class="ledger-input ledger-score-select" data-field="${field}">
      <option value="" ${!selectedValue ? "selected" : ""}>Blank</option>
      <option value="X" ${selectedValue === "X" ? "selected" : ""}>X</option>
    </select>
  `;
}

function scorePointValue(value) {
  const normalized = String(value || "").trim().toUpperCase();
  if (normalized === "X") {
    return 1;
  }
  if (!normalized) {
    return Number.NaN;
  }
  return Number(normalized);
}

function teamNameKey(value) {
  return String(value || "")
    .replaceAll("&amp;", "&")
    .replaceAll("&apos;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", '"')
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function canonicalTeamName(teamName) {
  const trimmed = String(teamName || "").trim();
  return leagueTeamLookup.get(teamNameKey(trimmed)) || trimmed;
}

function rosterForTeam(teamName) {
  const canonicalTeam = canonicalTeamName(teamName);
  return Object.prototype.hasOwnProperty.call(leagueTeams, canonicalTeam)
    ? leagueTeams[canonicalTeam].slice()
    : [];
}

function blankRoster() {
  return Array.from({ length: rosterRowCount }, () => "");
}

function normalizeRosterSlots(roster) {
  const values = Array.isArray(roster)
    ? roster.slice(0, rosterRowCount).map((value) => String(value || ""))
    : [];
  while (values.length < rosterRowCount) {
    values.push("");
  }
  return values;
}

function normalizeTeamSide(side) {
  const canonicalTeam = canonicalTeamName(state.teams[side].team || state.teams[side].name);
  if (rosterForTeam(canonicalTeam).length) {
    state.teams[side].team = canonicalTeam;
    state.teams[side].name = canonicalTeam;
  }
  state.teams[side].roster = normalizeRosterSlots(state.teams[side].roster);
}

function isDefaultTeamRoster(roster, mappedRoster) {
  return roster.some(Boolean) && roster.every((value, index) => value === String(mappedRoster[index] || ""));
}
