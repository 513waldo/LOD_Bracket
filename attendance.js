const STORAGE_KEY = "dartsTournamentAttendanceSheet:v1";
const BRACKET_DRAFT_STORAGE_KEY = "dartsTournamentBracketDraft";
const PORTAL_SNAPSHOT_STORAGE_KEY = "dartsTournamentPortalSnapshot";
const LOD_CODE_STORAGE_KEY = "dartsTournamentLodCode";
const ATTENDANCE_ACCESS_SESSION_STORAGE_KEY = "dartsTournamentAttendanceAccessSession";
const DEMO = {
  venueName: "Bullseye Taproom",
  eventName: "Appreciation Tournament",
  totalWeeks: 12,
  requiredWeeks: 6,
  startSaturday: "",
  players: [
    { id: "p1", name: "Jason R.", weeks: [true, true, true, true, false, true, false, true, false, false, false, true] },
    { id: "p2", name: "Alyssa D.", weeks: [true, true, false, true, true, true, false, false, true, false, false, true] },
    { id: "p3", name: "Chris B.", weeks: [false, true, false, false, true, false, false, true, true, false, true, false] },
    { id: "p4", name: "Dana K.", weeks: [true, true, true, true, true, true, true, true, true, true, true, true] },
  ],
};

const venueName = document.querySelector("#venueName");
const eventName = document.querySelector("#eventName");
const totalWeeks = document.querySelector("#totalWeeks");
const requiredWeeks = document.querySelector("#requiredWeeks");
const startSaturday = document.querySelector("#startSaturday");
const weekDateEditor = document.querySelector("#weekDateEditor");
const syncBracketPlayersButton = document.querySelector("#syncBracketPlayersButton");
const syncBracketGamesButton = document.querySelector("#syncBracketGamesButton");
const clearDemoButton = document.querySelector("#clearDemoButton");
const statusMessage = document.querySelector("#statusMessage");
const attendanceUsernameInput = document.querySelector("#attendanceUsernameInput");
const venueAccessUsername = document.querySelector("#venueAccessUsername");
const venueAccessPassword = document.querySelector("#venueAccessPassword");
const venueAccessPasswordConfirm = document.querySelector("#venueAccessPasswordConfirm");
const saveVenueAccessCredentialsButton = document.querySelector("#saveVenueAccessCredentials");
const clearVenueAccessCredentialsButton = document.querySelector("#clearVenueAccessCredentials");
const venueAccessStatus = document.querySelector("#venueAccessStatus");
const attendanceApp = document.querySelector("#attendanceApp");
const attendanceGate = document.querySelector("#attendanceGate");
const gateMessage = document.querySelector("#gateMessage");
const attendancePasswordInput = document.querySelector("#attendancePasswordInput");
const unlockAttendanceButton = document.querySelector("#unlockAttendanceButton");
const attendanceTable = document.querySelector("#attendanceTable");
const manualPlayerName = document.querySelector("#manualPlayerName");
const addManualPlayerButton = document.querySelector("#addManualPlayerButton");
const rosterMeta = document.querySelector("#rosterMeta");
const gameTracker = document.querySelector("#gameTracker");
const gameHistory = document.querySelector("#gameHistory");
const facebookPost = document.querySelector("#facebookPost");
const copyPostButton = document.querySelector("#copyPostButton");
const openFacebookButton = document.querySelector("#openFacebookButton");
const downloadJsonButton = document.querySelector("#downloadJsonButton");
const shareModeInputs = Array.from(document.querySelectorAll('input[name="shareMode"]'));

const DEFAULT_EVENT_TRACKER = [
  { id: "mysteryOut", label: "Mystery Out", date: "", result: "", picked: "", note: "" },
  { id: "bullshoot", label: "Bullshoot", date: "", result: "", picked: "", note: "" },
];
const DEFAULT_EVENT_HISTORY = [];

let sheet = loadSheet();
clearAttendanceAccessSession();
clearAttendanceRootSessionPassword();
syncVenueNameFromBracketDraft();
syncRosterFromBracketDraft(true);
syncEventTrackerFromBracketDraft(true);

if (unlockAttendanceButton) {
  unlockAttendanceButton.addEventListener("click", unlockAttendanceSheet);
}

attendancePasswordInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    unlockAttendanceSheet();
  }
});

attendanceUsernameInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    unlockAttendanceSheet();
  }
});

if (hasAttendanceAccess()) {
  showAttendanceApp();
} else {
  showAttendanceGate();
}

function loadSheet() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return cloneSheet(DEMO);
    }

    const parsed = JSON.parse(raw);
    return normalizeSheet(parsed);
  } catch {
    return cloneSheet(DEMO);
  }
}

function syncVenueNameFromBracketDraft(saveChanges = false) {
  try {
    const raw = localStorage.getItem(BRACKET_DRAFT_STORAGE_KEY);
    if (!raw) {
      return false;
    }

    const draft = JSON.parse(raw);
    const barName = String(draft?.barName || "").trim();
    let changed = false;

    if (barName && sheet.venueName !== barName) {
      sheet.venueName = barName;
      changed = true;
    }

    if (typeof draft?.eventDate === "string") {
      const nextEventDate = normalizeAnyDateInput(draft.eventDate);
      if (sheet.eventDate !== nextEventDate) {
        sheet.eventDate = nextEventDate;
        changed = true;
      }
    }

    if (changed && saveChanges) {
      saveSheet();
    }
    return changed;
  } catch {
    return false;
  }
}

function showAttendanceApp() {
  if (attendanceGate) {
    attendanceGate.hidden = true;
  }
  if (attendanceApp) {
    attendanceApp.hidden = false;
  }
}

function showAttendanceGate(message) {
  if (gateMessage) {
    gateMessage.textContent = message || getAttendanceGateMessage();
  }

  if (attendanceApp) {
    attendanceApp.hidden = true;
  }
  if (attendanceGate) {
    attendanceGate.hidden = false;
  }
}

function getAttendanceGateMessage() {
  if (sheet.authUsername && sheet.authPassword) {
    return `Enter the root password or the ${sheet.authUsername} login to unlock the director-only attendance sheet.`;
  }

  return "Enter the root password or bar login to unlock the director-only attendance sheet.";
}

function normalizeSheet(value) {
  const total = clampWeekCount(value?.totalWeeks, DEMO.totalWeeks);
  const required = clampWeekCount(value?.requiredWeeks, DEMO.requiredWeeks, total);
  const players = Array.isArray(value?.players) ? value.players.map((player, index) => normalizePlayer(player, total, index)) : [];

  return {
    venueName: String(value?.venueName || DEMO.venueName),
    eventName: String(value?.eventName || DEMO.eventName),
    eventDate: String(value?.eventDate || ""),
    totalWeeks: total,
    requiredWeeks: required,
    startSaturday: normalizeSaturdayInput(value?.startSaturday) || getDefaultSaturdayInput(),
    weekDates: normalizeWeekDates(value?.weekDates, total, normalizeSaturdayInput(value?.startSaturday) || getDefaultSaturdayInput()),
    authUsername: String(value?.authUsername || ""),
    authPassword: String(value?.authPassword || ""),
    eventTracker: normalizeEventTracker(value?.eventTracker),
    eventHistory: normalizeEventHistory(value?.eventHistory),
    players,
  };
}

function normalizePlayer(player, weekCount, index) {
  const weeks = Array.isArray(player?.weeks)
    ? player.weeks.slice(0, weekCount).map(Boolean)
    : [];

  while (weeks.length < weekCount) {
    weeks.push(false);
  }

  return {
    id: String(player?.id || `p-${Date.now()}-${index}`),
    name: String(player?.name || ""),
    weeks,
  };
}

function cloneSheet(value) {
  return normalizeSheet(JSON.parse(JSON.stringify(value)));
}

function clampWeekCount(value, fallback, max = 52) {
  const num = Math.floor(Number(value));
  if (!Number.isFinite(num) || num < 1) {
    return Math.max(1, Math.min(max, fallback));
  }
  return Math.max(1, Math.min(max, num));
}

function saveSheet() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sheet));
}

function normalizeEventTracker(value) {
  const sourceRows = Array.isArray(value) ? value : [];
  return DEFAULT_EVENT_TRACKER.map((fallbackRow) => {
    const row = sourceRows.find((entry) => String(entry?.id || "") === fallbackRow.id) || {};
    return {
      id: fallbackRow.id,
      label: fallbackRow.label,
      date: normalizeAnyDateInput(row.date || ""),
      result: String(row.result || ""),
      picked: String(row.picked || ""),
      note: String(row.note || ""),
    };
  });
}

function normalizeEventHistory(value) {
  const sourceRows = Array.isArray(value) ? value : DEFAULT_EVENT_HISTORY;
  return sourceRows
    .map((row) => normalizeTrackerHistoryRow(row))
    .filter(Boolean);
}

function normalizeTrackerHistoryRow(row) {
  if (!row || typeof row !== "object") {
    return null;
  }

  const label = String(row.label || row.game || "").trim();
  const date = normalizeAnyDateInput(row.date || "");
  const result = String(row.result || "");
  const picked = String(row.picked || "");
  const note = String(row.note || "");
  const recordedAt = normalizeIsoDateTimeInput(row.recordedAt || row.createdAt || row.stamp || "");
  const id = String(row.id || row.eventId || `${label}-${date || recordedAt || Date.now()}`).trim();

  if (!label && !date && !result && !picked && !note) {
    return null;
  }

  return {
    id,
    label,
    date,
    result,
    picked,
    note,
    recordedAt,
  };
}

function normalizeWeekDates(value, weekCount, fallbackStart) {
  const dates = Array.isArray(value) ? value.slice(0, weekCount).map(normalizeSaturdayInput) : [];

  while (dates.length < weekCount) {
    dates.push("");
  }

  const start = parseDateInputValue(fallbackStart) || parseDateInputValue(getDefaultSaturdayInput());
  if (!dates.some(Boolean) && start) {
    return Array.from({ length: weekCount }, (_, index) => {
      const date = new Date(start);
      date.setDate(date.getDate() + (index * 7));
      return formatDateInputValue(date);
    });
  }

  return dates;
}

function normalizeSaturdayInput(value) {
  const text = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : "";
}

function getDefaultSaturdayInput() {
  const today = new Date();
  const offset = (6 - today.getDay() + 7) % 7;
  return formatDateInputValue(new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset, 12, 0, 0, 0));
}

function formatDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInputValue(value) {
  const text = normalizeSaturdayInput(value);
  if (!text) {
    return null;
  }

  const [year, month, day] = text.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getWeekDates() {
  const customDates = Array.isArray(sheet.weekDates) ? sheet.weekDates : [];
  const start = parseDateInputValue(sheet.startSaturday) || parseDateInputValue(getDefaultSaturdayInput());
  if (!start && !customDates.some(Boolean)) {
    return [];
  }

  return Array.from({ length: sheet.totalWeeks }, (_, index) => {
    const custom = parseDateInputValue(customDates[index]);
    if (custom) {
      return custom;
    }

    const date = new Date(start || parseDateInputValue(getDefaultSaturdayInput()));
    date.setDate(date.getDate() + (index * 7));
    return date;
  });
}

function formatWeekDateLabel(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
  }).format(date);
}

function formatWeekDayLabel(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(date);
}

function readAttendanceAccessSession() {
  try {
    const raw = sessionStorage.getItem(ATTENDANCE_ACCESS_SESSION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      kind: String(parsed.kind || ""),
      username: normalizeAttendanceRootPassword(parsed.username || ""),
      password: normalizeAttendanceRootPassword(parsed.password || ""),
    };
  } catch {
    return null;
  }
}

function saveAttendanceAccessSession(session) {
  try {
    sessionStorage.setItem(ATTENDANCE_ACCESS_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage failures.
  }
}

function clearAttendanceAccessSession() {
  try {
    sessionStorage.removeItem(ATTENDANCE_ACCESS_SESSION_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

function getStoredSheetAdminPassword() {
  return normalizeAttendanceRootPassword(sheet.authPassword || "");
}

function hasAttendanceAccess() {
  const rootPassword = getStoredAttendanceRootPassword();
  const rootSessionPassword = normalizeAttendanceRootPassword(getAttendanceRootSessionPassword());
  if (rootSessionPassword && rootSessionPassword === rootPassword) {
    return true;
  }

  const session = readAttendanceAccessSession();
  if (!session) {
    return false;
  }

  if (session.kind === "root" && session.password === rootPassword) {
    return true;
  }

  if (session.kind === "bar") {
    return session.username === normalizeAttendanceRootPassword(sheet.authUsername || "")
      && session.password === getStoredSheetAdminPassword();
  }

  return false;
}

function unlockAttendanceSheet() {
  const storedPassword = getStoredAttendanceRootPassword();
  const enteredUsername = normalizeAttendanceRootPassword(attendanceUsernameInput?.value || "");
  const enteredPassword = normalizeAttendanceRootPassword(attendancePasswordInput?.value || "");
  const venueUsername = normalizeAttendanceRootPassword(sheet.authUsername || "");
  const venuePassword = getStoredSheetAdminPassword();
  const isRootLogin = !enteredUsername || enteredUsername.toLowerCase() === "root";

  if (!enteredPassword) {
    showAttendanceGate("Enter the root password or bar login to unlock the attendance sheet.");
    return;
  }

  if (isRootLogin) {
    if (enteredPassword !== storedPassword) {
      showAttendanceGate("Incorrect root password.");
      return;
    }

    saveAttendanceRootSessionPassword(enteredPassword);
    saveAttendanceAccessSession({ kind: "root", password: enteredPassword });
  } else {
    if (!venueUsername || !venuePassword || enteredUsername !== venueUsername || enteredPassword !== venuePassword) {
      showAttendanceGate(sheet.authUsername
        ? `Incorrect login for ${sheet.authUsername}.`
        : "Incorrect bar login.");
      return;
    }

    saveAttendanceAccessSession({
      kind: "bar",
      username: enteredUsername,
      password: enteredPassword,
    });
  }

  if (attendancePasswordInput) {
    attendancePasswordInput.value = "";
  }
  if (attendanceUsernameInput) {
    attendanceUsernameInput.value = "";
  }
  showAttendanceApp();
  render();
}

function render() {
  venueName.value = sheet.venueName;
  eventName.value = sheet.eventName;
  totalWeeks.value = String(sheet.totalWeeks);
  requiredWeeks.value = String(sheet.requiredWeeks);
  if (startSaturday) {
    startSaturday.value = sheet.startSaturday;
  }
  requiredWeeks.max = String(sheet.totalWeeks);

  updateDerivedOutputs();
  renderWeekDateEditor();
  attendanceTable.style.setProperty("--week-count", String(sheet.totalWeeks));
  attendanceTable.innerHTML = renderTable();
  renderGameTracker();
  renderGameHistory();
}

function renderWeekDateEditor() {
  if (!weekDateEditor) {
    return;
  }

  const weekDates = getWeekDates();
  weekDateEditor.innerHTML = weekDates.map((date, index) => `
    <label class="week-date-field">
      <span>Week ${index + 1}</span>
      <input
        type="date"
        data-week-date-index="${index}"
        value="${escapeHtml(formatDateInputValue(date))}"
      >
    </label>
  `).join("");
}

function updateDerivedOutputs() {
  const weekDates = getWeekDates();
  const firstDate = weekDates[0] ? formatWeekDateLabel(weekDates[0]) : "";
  const lastDate = weekDates[weekDates.length - 1] ? formatWeekDateLabel(weekDates[weekDates.length - 1]) : "";
  const dateSpan = firstDate && lastDate ? `${firstDate} to ${lastDate}` : firstDate || lastDate || "Dates not set";
  const eventDateText = sheet.eventDate ? formatDateDisplay(sheet.eventDate) : "";
  const eligibleCount = getEligiblePlayers().length;
  const playerCount = sheet.players.length;
  rosterMeta.textContent = `${eligibleCount} of ${playerCount} players currently meet the requirement of ${sheet.requiredWeeks} of ${sheet.totalWeeks} weeks. Dates: ${dateSpan}.${eventDateText ? ` Tournament date: ${eventDateText}.` : ""}`;
  facebookPost.value = buildFacebookPost();
  updateVenueAccessStatus();
}

function renderGameTracker() {
  if (!gameTracker) {
    return;
  }

  const rows = Array.isArray(sheet.eventTracker) ? sheet.eventTracker : normalizeEventTracker();
  gameTracker.innerHTML = `
    <div class="tracker-head">
      <div class="tracker-head-cell">Game</div>
      <div class="tracker-head-cell">Date</div>
      <div class="tracker-head-cell">Result</div>
      <div class="tracker-head-cell">Picked</div>
      <div class="tracker-head-cell">Notes</div>
    </div>
    ${rows.map((row) => `
      <article class="tracker-row" data-tracker-id="${escapeHtml(row.id)}">
        <div class="tracker-cell">
          <div class="tracker-label">Game</div>
          <div class="tracker-name">${escapeHtml(row.label)}</div>
        </div>
        <label class="tracker-cell">
          <span class="tracker-label">Date</span>
          <input class="tracker-input" type="date" data-tracker-field="date" data-tracker-id="${escapeHtml(row.id)}" value="${escapeHtml(normalizeAnyDateInput(row.date || ""))}">
        </label>
        <label class="tracker-cell">
          <span class="tracker-label">Result</span>
          <input class="tracker-input" type="text" data-tracker-field="result" data-tracker-id="${escapeHtml(row.id)}" value="${escapeHtml(row.result)}" placeholder="Score or ticket">
        </label>
        <label class="tracker-cell">
          <span class="tracker-label">Picked</span>
          <input class="tracker-input" type="text" data-tracker-field="picked" data-tracker-id="${escapeHtml(row.id)}" value="${escapeHtml(row.picked)}" placeholder="Player name">
        </label>
        <label class="tracker-cell">
          <span class="tracker-label">Notes</span>
          <input class="tracker-input" type="text" data-tracker-field="note" data-tracker-id="${escapeHtml(row.id)}" value="${escapeHtml(row.note)}" placeholder="Optional notes">
        </label>
      </article>
    `).join("")}
  `;
}

function renderGameHistory() {
  if (!gameHistory) {
    return;
  }

  const rows = Array.isArray(sheet.eventHistory) ? [...sheet.eventHistory].reverse() : normalizeEventHistory().reverse();
  if (!rows.length) {
    gameHistory.innerHTML = `<p class="empty-state">No draw history yet.</p>`;
    return;
  }

  gameHistory.innerHTML = `
    <div class="tracker-head">
      <div class="tracker-head-cell">Game</div>
      <div class="tracker-head-cell">Date</div>
      <div class="tracker-head-cell">Result</div>
      <div class="tracker-head-cell">Picked</div>
      <div class="tracker-head-cell">Notes</div>
    </div>
    ${rows.map((row) => `
      <article class="tracker-row tracker-history-row">
        <div class="tracker-cell">
          <div class="tracker-label">Game</div>
          <div class="tracker-name">${escapeHtml(row.label)}</div>
        </div>
        <div class="tracker-cell">
          <div class="tracker-label">Date</div>
          <div class="tracker-history-value">${escapeHtml(formatDateDisplay(row.date || row.recordedAt))}</div>
        </div>
        <div class="tracker-cell">
          <div class="tracker-label">Result</div>
          <div class="tracker-history-value">${escapeHtml(row.result || "")}</div>
        </div>
        <div class="tracker-cell">
          <div class="tracker-label">Picked</div>
          <div class="tracker-history-value">${escapeHtml(row.picked || "")}</div>
        </div>
        <div class="tracker-cell">
          <div class="tracker-label">Notes</div>
          <div class="tracker-history-value">${escapeHtml(row.note || "")}</div>
        </div>
      </article>
    `).join("")}
  `;
}

function renderTable() {
  const weekDates = getWeekDates();
  const head = `
    <div class="table-head">
      <div class="head-cell">Player</div>
      <div class="head-cell">Status</div>
      ${weekDates.map((date, index) => {
        const day = formatWeekDayLabel(date) || `W${index + 1}`;
        const dateLabel = formatWeekDateLabel(date) || "";
        const title = date.toDateString();
        return `
          <div class="head-cell week-head" title="${escapeHtml(title)}">
            <span class="week-head-day">${escapeHtml(day)}</span>
            <span class="week-head-date">${escapeHtml(dateLabel)}</span>
          </div>
        `;
      }).join("")}
      <div class="head-cell"></div>
    </div>
  `;

  if (!sheet.players.length) {
    return `${head}<p class="empty-state">No players added yet.</p>`;
  }

  const rows = sheet.players.map((player, rowIndex) => {
    const presentCount = player.weeks.filter(Boolean).length;
    const isEligible = presentCount >= sheet.requiredWeeks;
    const statusClass = isEligible ? "status-pill" : presentCount === 0 ? "status-pill pending" : "status-pill ineligible";
    const statusText = presentCount === 0
      ? "No attendance yet"
      : isEligible
        ? "Eligible"
        : `${sheet.requiredWeeks - presentCount} more needed`;

    return `
      <div class="player-row" data-player-index="${rowIndex}">
        <div class="player-cell player-name">
          <input data-player-name type="text" value="${escapeHtml(player.name)}" placeholder="Player name">
        </div>
        <div class="player-cell">
          <span class="${statusClass}">${escapeHtml(`${presentCount}/${sheet.totalWeeks}`)}</span>
          <div class="status-text">${escapeHtml(statusText)}</div>
        </div>
        ${player.weeks.map((present, weekIndex) => `
          <div class="player-cell">
            <button
              type="button"
              class="week-toggle${present ? " attended" : ""}"
              data-toggle-week="${weekIndex}"
              aria-label="Mark ${formatWeekDayLabel(weekDates[weekIndex]) || `week ${weekIndex + 1}`} ${formatWeekDateLabel(weekDates[weekIndex]) || ""} for ${escapeHtml(player.name || "player")}"
              title="${escapeHtml(`${formatWeekDayLabel(weekDates[weekIndex]) || `Week ${weekIndex + 1}`} ${formatWeekDateLabel(weekDates[weekIndex]) || ""}`.trim())}"
            >${present ? "✓" : ""}</button>
          </div>
        `).join("")}
        <div class="player-cell player-remove">
          <button type="button" class="secondary" data-remove-player="${rowIndex}">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  return `${head}${rows}`;
}

function buildFacebookPost(mode = getShareMode()) {
  const lines = [];
  lines.push(`${sheet.eventName || "Appreciation Tournament"}`);
  if (sheet.venueName) {
    lines.push(`Venue: ${sheet.venueName}`);
  }
  if (sheet.eventDate) {
    lines.push(`Tournament date: ${formatDateDisplay(sheet.eventDate)}`);
  }
  lines.push(`Attendance rule: ${sheet.requiredWeeks} of ${sheet.totalWeeks} weeks`);
  const weekDates = getWeekDates();
  if (weekDates.length) {
    const firstDate = formatWeekDateLabel(weekDates[0]);
    const lastDate = formatWeekDateLabel(weekDates[weekDates.length - 1]);
    if (firstDate && lastDate) {
      lines.push(`Dates: ${firstDate} to ${lastDate}`);
    }
  }
  lines.push("");

  if (mode === "eligible") {
    lines.push("Eligible players:");
    const eligible = getEligiblePlayers();
    if (!eligible.length) {
      lines.push("None yet");
    } else {
      eligible.forEach((player) => {
        lines.push(`- ${player.name} (${player.presentCount}/${sheet.totalWeeks})`);
      });
    }
  } else {
    lines.push("Full roster:");
    if (!sheet.players.length) {
      lines.push("No players added yet.");
    } else {
      sheet.players.forEach((player) => {
        const presentCount = player.weeks.filter(Boolean).length;
        const status = presentCount >= sheet.requiredWeeks ? "eligible" : "not yet eligible";
        lines.push(`- ${player.name} (${presentCount}/${sheet.totalWeeks}) - ${status}`);
      });
    }
  }

  return lines.join("\n");
}

function getEligiblePlayers() {
  return sheet.players
    .map((player) => ({
      ...player,
      presentCount: player.weeks.filter(Boolean).length,
    }))
    .filter((player) => player.presentCount >= sheet.requiredWeeks);
}

function getShareMode() {
  return shareModeInputs.find((input) => input.checked)?.value || "eligible";
}

function syncFromInputs() {
  sheet.venueName = venueName.value.trim();
  sheet.eventName = eventName.value.trim();
  sheet.startSaturday = normalizeSaturdayInput(startSaturday?.value || "") || getDefaultSaturdayInput();
  sheet.weekDates = normalizeWeekDates(sheet.weekDates, sheet.totalWeeks, sheet.startSaturday);
  sheet.eventTracker = normalizeEventTracker(sheet.eventTracker);
  saveSheet();
  updateDerivedOutputs();
}

function addManualPlayerFromInput() {
  const name = normalizeRosterName(manualPlayerName?.value || "");
  if (!name) {
    setStatus("Enter a player name first.");
    return;
  }

  const key = normalizeRosterKey(name);
  const exists = sheet.players.some((player) => normalizeRosterKey(player.name) === key);
  if (exists) {
    setStatus(`${name} is already on the sheet.`);
    if (manualPlayerName) {
      manualPlayerName.value = "";
      manualPlayerName.focus();
    }
    return;
  }

  sheet.players.push(normalizePlayer({
    id: `p-${Date.now()}-${sheet.players.length}`,
    name,
    weeks: Array.from({ length: sheet.totalWeeks }, () => false),
  }, sheet.totalWeeks, sheet.players.length));
  saveSheet();
  render();

  if (manualPlayerName) {
    manualPlayerName.value = "";
    manualPlayerName.focus();
  }
  setStatus(`Added ${name} to the attendance sheet.`);
}

venueName.addEventListener("input", syncFromInputs);
eventName.addEventListener("input", syncFromInputs);
startSaturday?.addEventListener("change", () => {
  syncFromInputs();
  render();
});
totalWeeks.addEventListener("change", () => {
  sheet.totalWeeks = clampWeekCount(totalWeeks.value, sheet.totalWeeks);
  if (sheet.requiredWeeks > sheet.totalWeeks) {
    sheet.requiredWeeks = sheet.totalWeeks;
  }
  sheet.players = sheet.players.map((player, index) => normalizePlayer(player, sheet.totalWeeks, index));
  sheet.weekDates = normalizeWeekDates(sheet.weekDates, sheet.totalWeeks, sheet.startSaturday);
  sheet.eventTracker = normalizeEventTracker(sheet.eventTracker);
  saveSheet();
  render();
});
requiredWeeks.addEventListener("change", () => {
  sheet.requiredWeeks = clampWeekCount(requiredWeeks.value, sheet.requiredWeeks, sheet.totalWeeks);
  saveSheet();
  render();
});

if (syncBracketPlayersButton) {
  syncBracketPlayersButton.addEventListener("click", () => {
    const syncedCount = syncRosterFromBracketDraft(true);
    const syncMessage = syncedCount
      ? `Synced ${syncedCount} player${syncedCount === 1 ? "" : "s"} from the bracket roster.`
      : "Bracket roster already matches the sheet.";
    setStatus(syncMessage);
    render();
  });
}

addManualPlayerButton?.addEventListener("click", addManualPlayerFromInput);
manualPlayerName?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addManualPlayerFromInput();
  }
});

syncBracketGamesButton?.addEventListener("click", () => {
  const synced = syncEventTrackerFromBracketDraft(true);
  const markedCount = synced ? markAttendanceForBracketEventDate(sheet.eventDate) : 0;
  setStatus(synced
    ? `Synced mystery out and bullshoot from the bracket portal.${markedCount ? ` Marked ${markedCount} player${markedCount === 1 ? "" : "s"} present for the tournament date.` : ""}`
    : "No mystery out or bullshoot data found to sync.");
  render();
});

saveVenueAccessCredentialsButton?.addEventListener("click", saveVenueAccessCredentials);
clearVenueAccessCredentialsButton?.addEventListener("click", clearVenueAccessCredentials);

attendanceTable.addEventListener("click", (event) => {
  const toggleButton = event.target.closest("[data-toggle-week]");
  const removeButton = event.target.closest("[data-remove-player]");
  const row = event.target.closest("[data-player-index]");
  const rowIndex = row ? Number(row.dataset.playerIndex) : -1;

  if (toggleButton && rowIndex >= 0) {
    const weekIndex = Number(toggleButton.dataset.toggleWeek);
    const player = sheet.players[rowIndex];
    if (!player) {
      return;
    }

    player.weeks[weekIndex] = !player.weeks[weekIndex];
    saveSheet();
    render();
    return;
  }

  if (removeButton) {
    const index = Number(removeButton.dataset.removePlayer);
    sheet.players.splice(index, 1);
    saveSheet();
    render();
  }
});

attendanceTable.addEventListener("input", (event) => {
  const row = event.target.closest("[data-player-index]");
  if (!row) {
    return;
  }

  const index = Number(row.dataset.playerIndex);
  const player = sheet.players[index];
  if (!player) {
    return;
  }

  if (event.target.matches("[data-player-name]")) {
    player.name = event.target.value;
  }

  saveSheet();
  updateDerivedOutputs();
});

gameTracker?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-tracker-field]");
  if (!input) {
    return;
  }

  const trackerId = String(input.dataset.trackerId || "");
  const field = String(input.dataset.trackerField || "");
  if (!trackerId || !field) {
    return;
  }

  const rows = Array.isArray(sheet.eventTracker) ? sheet.eventTracker : normalizeEventTracker();
  const row = rows.find((entry) => entry.id === trackerId);
  if (!row) {
    return;
  }

  row[field] = input.value;
  sheet.eventTracker = rows;
  saveSheet();
  updateDerivedOutputs();
});

weekDateEditor?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-week-date-index]");
  if (!input) {
    return;
  }

  const index = Number(input.dataset.weekDateIndex);
  if (!Number.isInteger(index) || index < 0 || index >= sheet.totalWeeks) {
    return;
  }

  if (!Array.isArray(sheet.weekDates)) {
    sheet.weekDates = [];
  }

  while (sheet.weekDates.length < sheet.totalWeeks) {
    sheet.weekDates.push("");
  }

  sheet.weekDates[index] = normalizeSaturdayInput(input.value);
  saveSheet();
  updateDerivedOutputs();
});

clearDemoButton.addEventListener("click", () => {
  sheet = cloneSheet(DEMO);
  saveSheet();
  render();
  setStatus("Demo attendance restored.");
});

copyPostButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(facebookPost.value);
    setStatus("Facebook post text copied.");
  } catch {
    setStatus("Could not copy to clipboard.");
  }
});

openFacebookButton.addEventListener("click", () => {
  const shareUrl = new URL("https://www.facebook.com/sharer/sharer.php");
  shareUrl.searchParams.set("u", window.location.href);
  window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
  setStatus("Opened Facebook share dialog. Paste the copied post text there.");
});

downloadJsonButton.addEventListener("click", () => {
  const blob = new Blob([`${JSON.stringify(sheet, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "attendance-sheet.json";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

shareModeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    facebookPost.value = buildFacebookPost();
  });
});

window.addEventListener("storage", (event) => {
  if (event.key === ATTENDANCE_ROOT_PASSWORD_STORAGE_KEY || event.key === ATTENDANCE_ROOT_SESSION_STORAGE_KEY) {
    if (hasAttendanceAccess()) {
      showAttendanceApp();
      render();
    } else {
      showAttendanceGate();
    }
  }
  if (event.key === ATTENDANCE_ACCESS_SESSION_STORAGE_KEY) {
    if (hasAttendanceAccess()) {
      showAttendanceApp();
      render();
    } else {
      showAttendanceGate();
    }
  }
  if (event.key === BRACKET_DRAFT_STORAGE_KEY) {
    syncVenueNameFromBracketDraft(true);
    syncRosterFromBracketDraft(true);
    syncEventTrackerFromBracketDraft(true);
    if (hasAttendanceAccess()) {
      showAttendanceApp();
      render();
    }
  }
  if (event.key === STORAGE_KEY) {
    sheet = loadSheet();
    if (hasAttendanceAccess()) {
      showAttendanceApp();
      render();
    } else {
      showAttendanceGate();
    }
  }
});

function setStatus(text) {
  statusMessage.textContent = text;
}

function updateVenueAccessStatus() {
  if (!venueAccessStatus) {
    return;
  }

  if (sheet.authUsername && sheet.authPassword) {
    venueAccessStatus.textContent = `Login set for ${sheet.authUsername}. Root access still works.`;
  } else {
    venueAccessStatus.textContent = "No bar login set. Root access still works.";
  }
}

function saveVenueAccessCredentials() {
  const nextUsername = normalizeAttendanceRootPassword(venueAccessUsername?.value || "");
  const nextPassword = normalizeAttendanceRootPassword(venueAccessPassword?.value || "");
  const confirmPassword = normalizeAttendanceRootPassword(venueAccessPasswordConfirm?.value || "");

  if (!nextUsername) {
    setStatus("Enter a bar username first.");
    return;
  }

  if (!nextPassword) {
    setStatus("Enter a bar password first.");
    return;
  }

  if (nextPassword !== confirmPassword) {
    setStatus("Bar passwords do not match.");
    return;
  }

  sheet.authUsername = nextUsername;
  sheet.authPassword = nextPassword;
  saveSheet();
  if (venueAccessUsername) {
    venueAccessUsername.value = "";
  }
  if (venueAccessPassword) {
    venueAccessPassword.value = "";
  }
  if (venueAccessPasswordConfirm) {
    venueAccessPasswordConfirm.value = "";
  }
  updateVenueAccessStatus();
  const importedNames = getBracketRosterNames();
  const syncedCount = importedNames.length ? syncRosterFromBracketDraft(true) : 0;
  if (importedNames.length) {
    render();
    setStatus(`Saved the bar login and synced ${syncedCount} player${syncedCount === 1 ? "" : "s"} from the bracket roster for ${sheet.venueName || "this venue"}.`);
    return;
  }

  setStatus(`Saved the bar login for ${sheet.venueName || "this venue"}.`);
}

function clearVenueAccessCredentials() {
  if (!sheet.authUsername && !sheet.authPassword) {
    setStatus("No bar login is currently set.");
    return;
  }

  sheet.authUsername = "";
  sheet.authPassword = "";
  saveSheet();
  if (venueAccessUsername) {
    venueAccessUsername.value = "";
  }
  if (venueAccessPassword) {
    venueAccessPassword.value = "";
  }
  if (venueAccessPasswordConfirm) {
    venueAccessPasswordConfirm.value = "";
  }
  updateVenueAccessStatus();
  setStatus("Bar login cleared.");
}

function syncRosterFromBracketDraft(overwriteExisting = false) {
  const importedNames = getBracketRosterNames();
  if (!importedNames.length) {
    return 0;
  }

  syncVenueNameFromBracketDraft(false);

  const existing = new Map();
  sheet.players.forEach((player) => {
    const key = normalizeRosterKey(player.name);
    if (key && !existing.has(key)) {
      existing.set(key, player);
    }
  });

  const nextPlayers = [];
  const seen = new Set();
  let addedCount = 0;

  importedNames.forEach((name, index) => {
    const key = normalizeRosterKey(name);
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);

    const match = existing.get(key);
    if (match) {
      nextPlayers.push(normalizePlayer({ ...match, name }, sheet.totalWeeks, nextPlayers.length));
      return;
    }

    addedCount += 1;
    nextPlayers.push(normalizePlayer({
      id: `p-${Date.now()}-${index}`,
      name,
      weeks: Array.from({ length: sheet.totalWeeks }, () => false),
    }, sheet.totalWeeks, nextPlayers.length));
  });

  if (!overwriteExisting) {
    sheet.players.forEach((player, index) => {
      const key = normalizeRosterKey(player.name);
      if (!key || seen.has(key)) {
        return;
      }

      seen.add(key);
      nextPlayers.push(normalizePlayer(player, sheet.totalWeeks, nextPlayers.length + index));
    });
  }

  sheet.players = nextPlayers;
  sheet.weekDates = normalizeWeekDates(sheet.weekDates, sheet.totalWeeks, sheet.startSaturday);
  saveSheet();
  return addedCount;
}

function markAttendanceForBracketEventDate(eventDateValue = sheet.eventDate) {
  const eventDate = normalizeAnyDateInput(eventDateValue || "");
  if (!eventDate) {
    return 0;
  }

  const weekDates = getWeekDates();
  const matchingWeekIndex = weekDates.findIndex((weekDate) => normalizeAnyDateInput(formatDateInputValue(weekDate)) === eventDate);
  if (matchingWeekIndex < 0) {
    return 0;
  }

  let changedCount = 0;
  sheet.players.forEach((player) => {
    if (!Array.isArray(player.weeks) || matchingWeekIndex >= player.weeks.length) {
      return;
    }

    if (!player.weeks[matchingWeekIndex]) {
      player.weeks[matchingWeekIndex] = true;
      changedCount += 1;
    }
  });

  if (changedCount) {
    saveSheet();
  }

  return changedCount;
}

function syncEventTrackerFromBracketDraft(saveChanges = false) {
  try {
    const raw = localStorage.getItem(BRACKET_DRAFT_STORAGE_KEY);
    if (!raw) {
      return false;
    }

    const draft = JSON.parse(raw);
    if (!draft || typeof draft !== "object") {
      return false;
    }

    const portalSnapshot = readPortalSnapshotForDraft(draft);
    const eventSource = portalSnapshot || draft;
    const eventDate = normalizeAnyDateInput(eventSource?.eventDate || "");
    const nextRows = normalizeEventTracker(sheet.eventTracker);

    const historyEntries = [];
    let changed = false;

    if (eventDate && sheet.eventDate !== eventDate) {
      sheet.eventDate = eventDate;
      changed = true;
    }

    const mysteryOutRow = nextRows.find((row) => row.id === "mysteryOut");
    if (mysteryOutRow) {
      const mysteryOutValue = eventSource?.mysteryOut && typeof eventSource.mysteryOut === "object" ? eventSource.mysteryOut : null;
      mysteryOutRow.result = String(mysteryOutValue ? mysteryOutValue.score || "" : eventSource?.mysteryOut || "");
      mysteryOutRow.picked = getMysteryOutPickedName(eventSource);
      mysteryOutRow.date = normalizeAnyDateInput(mysteryOutValue?.drawnAt || eventSource?.eventDate || mysteryOutRow.date);
      mysteryOutRow.note = getMysteryOutNote(eventSource);
      pushTrackerHistoryEntry(historyEntries, mysteryOutRow);
    }

    const bullshootRow = nextRows.find((row) => row.id === "bullshoot");
    if (bullshootRow) {
      const winner = eventSource?.bullseyeShoot?.winner && typeof eventSource.bullseyeShoot.winner === "object" ? eventSource.bullseyeShoot.winner : null;
      bullshootRow.result = getBullshootRollText(eventSource);
      bullshootRow.picked = winner?.name || "";
      bullshootRow.date = normalizeAnyDateInput(winner?.drawnAt || eventSource?.eventDate || bullshootRow.date);
      bullshootRow.note = winner?.ticketLabel ? `Ticket ${winner.ticketLabel}` : "";
      pushTrackerHistoryEntry(historyEntries, bullshootRow);
    }

    sheet.eventTracker = nextRows;
    if (historyEntries.length) {
      appendTrackerHistory(historyEntries);
    }
    if (saveChanges && (historyEntries.length || changed)) {
      saveSheet();
    }
    return true;
  } catch {
    return false;
  }
}

function getMysteryOutPickedName(draft) {
  const target = Number(draft?.mysteryOut && typeof draft.mysteryOut === "object" ? draft.mysteryOut.score : draft?.mysteryOut);
  if (!Number.isFinite(target)) {
    return "";
  }

  const rows = Array.isArray(draft?.outShots) ? draft.outShots : [];
  const winners = rows
    .filter((row) => Number(row?.number || row?.score) === target)
    .map((row) => String(row?.player || "").trim())
    .filter(Boolean);

  if (!winners.length) {
    return "";
  }

  return Array.from(new Set(winners)).join(", ");
}

function getMysteryOutNote(draft) {
  const mode = String(draft?.mysteryOut?.mode || "");
  if (!mode) {
    return "";
  }
  return `Mode: ${mode}`;
}

function readPortalSnapshotForDraft(draft) {
  try {
    const draftCode = normalizeLodCodeForAttendance(draft?.lodCode || "");
    const storedCode = getStoredLodCodeForAttendance();
    const preferredCodes = [draftCode, storedCode].filter(Boolean);

    for (const code of preferredCodes) {
      const raw = localStorage.getItem(`${PORTAL_SNAPSHOT_STORAGE_KEY}:${code}`);
      const snapshot = parsePortalSnapshot(raw);
      if (snapshot) {
        return snapshot;
      }
    }

    const snapshots = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index) || "";
      if (!key.startsWith(`${PORTAL_SNAPSHOT_STORAGE_KEY}:`)) {
        continue;
      }

      const snapshot = parsePortalSnapshot(localStorage.getItem(key));
      if (!snapshot) {
        continue;
      }

      if (draftCode && normalizeLodCodeForAttendance(snapshot.lodCode) === draftCode) {
        return snapshot;
      }
      if (storedCode && normalizeLodCodeForAttendance(snapshot.lodCode) === storedCode) {
        return snapshot;
      }
      snapshots.push(snapshot);
    }

    if (snapshots.length === 1) {
      return snapshots[0];
    }

    snapshots.sort((left, right) => String(right.exportedAt || "").localeCompare(String(left.exportedAt || "")));
    return snapshots[0] || null;
  } catch {
    return null;
  }
}

function parsePortalSnapshot(raw) {
  if (!raw) {
    return null;
  }

  try {
    const snapshot = JSON.parse(raw);
    if (!snapshot || typeof snapshot !== "object") {
      return null;
    }
    return snapshot;
  } catch {
    return null;
  }
}

function getStoredLodCodeForAttendance() {
  try {
    const raw = localStorage.getItem(LOD_CODE_STORAGE_KEY);
    if (raw === null) {
      return "";
    }
    return normalizeLodCodeForAttendance(raw);
  } catch {
    return "";
  }
}

function normalizeLodCodeForAttendance(value) {
  return String(value || "")
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase()
    .slice(0, 12);
}

function getBullshootRollText(source) {
  const triple = Number(Array.isArray(source?.diceValues) ? source.diceValues[0] : NaN);
  const double = Number(Array.isArray(source?.diceValues) ? source.diceValues[1] : NaN);

  if (Number.isFinite(triple) && Number.isFinite(double)) {
    return `T ${triple} / D ${double}`;
  }

  const message = String(source?.portalBullshootNotice || "");
  const match = message.match(/Triple\s+(\d+),\s+Double\s+(\d+)/i);
  if (match) {
    return `T ${match[1]} / D ${match[2]}`;
  }

  return "";
}

function pushTrackerHistoryEntry(target, row) {
  if (!row) {
    return;
  }

  const date = normalizeAnyDateInput(row.date || "");
  const result = String(row.result || "").trim();
  const picked = String(row.picked || "").trim();
  const note = String(row.note || "").trim();
  if (!date && !result && !picked && !note) {
    return;
  }

  target.push({
    id: `${row.id || row.label || "entry"}-${date || Date.now()}`,
    label: String(row.label || row.id || "Tracker"),
    date,
    result,
    picked,
    note,
    recordedAt: new Date().toISOString(),
  });
}

function appendTrackerHistory(entries) {
  const history = Array.isArray(sheet.eventHistory) ? sheet.eventHistory.slice() : [];
  entries.forEach((entry) => {
    const normalized = normalizeTrackerHistoryRow(entry);
    if (!normalized) {
      return;
    }

    const key = getTrackerHistorySignature(normalized);
    const lastEntry = [...history].reverse().find((row) => row.label === normalized.label);
    if (lastEntry && getTrackerHistorySignature(lastEntry) === key) {
      return;
    }

    history.push(normalized);
  });

  sheet.eventHistory = history;
}

function formatTrackDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDateDisplay(value) {
  const text = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const date = parseDateInputValue(text);
    return date ? new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    }).format(date) : "";
  }

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function normalizeAnyDateInput(value) {
  const text = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? "" : formatDateInputValue(date);
}

function normalizeIsoDateTimeInput(value) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function getTrackerHistorySignature(row) {
  return [
    String(row.label || ""),
    String(row.date || ""),
    String(row.result || ""),
    String(row.picked || ""),
    String(row.note || ""),
  ].join("|");
}

function normalizeRosterName(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function normalizeRosterKey(value) {
  return normalizeRosterName(value).toLowerCase();
}

function getBracketRosterNames() {
  try {
    const raw = localStorage.getItem(BRACKET_DRAFT_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const draft = JSON.parse(raw);
    if (!draft || typeof draft !== "object") {
      return [];
    }

    const names = [];
    const seen = new Set();
    const addName = (value) => {
      const name = normalizeRosterName(value);
      if (!name) {
        return;
      }

      const key = getExactRosterKey(name);
      if (seen.has(key)) {
        return;
      }

      seen.add(key);
      names.push(name);
    };

    if (typeof draft.playerList === "string" && draft.playerList.trim()) {
      draft.playerList.split(/\r?\n/).forEach((line) => {
        extractRosterNamesFromLine(line).forEach(addName);
      });
    }

    if (!names.length && draft.nameMap && typeof draft.nameMap === "object") {
      Object.keys(draft.nameMap)
        .sort((left, right) => Number(left) - Number(right))
        .forEach((key) => addName(draft.nameMap[key]));
    }

    if (!names.length && Array.isArray(draft.currentTeams)) {
      draft.currentTeams.flat(Infinity).forEach((entry) => addName(draft.nameMap?.[String(entry)] || entry));
    }

    return names;
  } catch {
    return [];
  }
}

function extractRosterNamesFromLine(line) {
  return String(line || "")
    .split("/")
    .map((part) => part
      .replace(/^\s*(?:\d+[\.\)]\s*|[-*•]\s*)/, "")
      .replace(/\s*\(#\d+\)\s*$/, "")
      .replace(/\s*#\d+\s*$/, "")
      .trim())
    .filter(Boolean);
}

function normalizeRosterName(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function normalizeRosterKey(value) {
  return getExactRosterKey(value);
}

function getExactRosterKey(value) {
  return normalizeRosterName(value).toLowerCase();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

render();
