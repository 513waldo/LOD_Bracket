const STORAGE_KEY = "dartsTournamentAttendanceSheet:v1";
const BRACKET_DRAFT_STORAGE_KEY = "dartsTournamentBracketDraft";
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
const syncBracketPlayersButton = document.querySelector("#syncBracketPlayersButton");
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
const rosterMeta = document.querySelector("#rosterMeta");
const facebookPost = document.querySelector("#facebookPost");
const copyPostButton = document.querySelector("#copyPostButton");
const openFacebookButton = document.querySelector("#openFacebookButton");
const downloadJsonButton = document.querySelector("#downloadJsonButton");
const eligibleCount = document.querySelector("#eligibleCount");
const playerCount = document.querySelector("#playerCount");
const requiredWeeksText = document.querySelector("#requiredWeeksText");
const totalWeeksText = document.querySelector("#totalWeeksText");
const summaryNote = document.querySelector("#summaryNote");
const shareModeInputs = Array.from(document.querySelectorAll('input[name="shareMode"]'));

let sheet = loadSheet();
syncRosterFromBracketDraft(true);

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
    totalWeeks: total,
    requiredWeeks: required,
    startSaturday: normalizeSaturdayInput(value?.startSaturday) || getDefaultSaturdayInput(),
    authUsername: String(value?.authUsername || ""),
    authPassword: String(value?.authPassword || ""),
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
  const start = parseDateInputValue(sheet.startSaturday) || parseDateInputValue(getDefaultSaturdayInput());
  if (!start) {
    return [];
  }

  return Array.from({ length: sheet.totalWeeks }, (_, index) => {
    const date = new Date(start);
    date.setDate(date.getDate() + (index * 7));
    return date;
  });
}

function formatWeekDateLabel(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "numeric",
    day: "numeric",
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
  attendanceTable.style.setProperty("--week-count", String(sheet.totalWeeks));
  attendanceTable.innerHTML = renderTable();
}

function updateDerivedOutputs() {
  requiredWeeksText.textContent = String(sheet.requiredWeeks);
  totalWeeksText.textContent = String(sheet.totalWeeks);
  playerCount.textContent = String(sheet.players.length);
  eligibleCount.textContent = String(getEligiblePlayers().length);

  const eligible = getEligiblePlayers().length;
  summaryNote.textContent = sheet.players.length
    ? `${eligible} of ${sheet.players.length} players currently meet the requirement of ${sheet.requiredWeeks} of ${sheet.totalWeeks} weeks.`
    : "Add players to start tracking attendance.";

  const weekDates = getWeekDates();
  const firstDate = weekDates[0] ? formatWeekDateLabel(weekDates[0]) : "";
  const lastDate = weekDates[weekDates.length - 1] ? formatWeekDateLabel(weekDates[weekDates.length - 1]) : "";
  const dateSpan = firstDate && lastDate ? `${firstDate} to ${lastDate}` : firstDate || lastDate || "Dates not set";
  rosterMeta.textContent = `${sheet.venueName || "Venue"} · ${sheet.eventName || "Attendance Sheet"} · ${sheet.requiredWeeks} of ${sheet.totalWeeks} weeks required · ${dateSpan}`;
  facebookPost.value = buildFacebookPost();
  updateVenueAccessStatus();
}

function renderTable() {
  const weekDates = getWeekDates();
  const head = `
    <div class="table-head">
      <div class="head-cell">Player</div>
      <div class="head-cell">Status</div>
      ${weekDates.map((date, index) => `<div class="head-cell" title="${escapeHtml(date.toDateString())}">${escapeHtml(formatWeekDateLabel(date) || `W${index + 1}`)}</div>`).join("")}
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
              aria-label="Mark ${formatWeekDateLabel(weekDates[weekIndex]) || `week ${weekIndex + 1}`} for ${escapeHtml(player.name || "player")}"
              title="${escapeHtml(formatWeekDateLabel(weekDates[weekIndex]) || `Week ${weekIndex + 1}`)}"
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
  saveSheet();
  updateDerivedOutputs();
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
    setStatus(syncedCount
      ? `Synced ${syncedCount} player${syncedCount === 1 ? "" : "s"} from the bracket roster.`
      : "Bracket roster already matches the sheet.");
    render();
  });
}

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
    syncRosterFromBracketDraft(true);
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
  saveSheet();
  return addedCount;
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
