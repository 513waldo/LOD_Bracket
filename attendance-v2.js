const ATTENDANCE_V2_SESSION_KEY = "lodBracketSession:v1";
const ATTENDANCE_V2_API_BASE_URL = String(window.LOD_AUTH_API_BASE_URL || window.BRACKET_API_BASE_URL || "").replace(/\/$/, "");
const seriesSelect = document.querySelector("#attendanceSeriesSelect");
const seriesName = document.querySelector("#attendanceSeriesName");
const seriesDescription = document.querySelector("#attendanceSeriesDescription");
const seriesCadence = document.querySelector("#attendanceSeriesCadence");
const seriesWeeks = document.querySelector("#attendanceSeriesWeeks");
const seriesStartDate = document.querySelector("#attendanceSeriesStartDate");
const seriesStatus = document.querySelector("#attendanceSeriesStatus");
const seriesCodePanel = document.querySelector("#attendanceSeriesCodePanel");
const seriesCodeInput = document.querySelector("#attendanceSeriesCode");
const copySeriesCodeButton = document.querySelector("#copyAttendanceSeriesCode");
const seriesEndDate = document.querySelector("#attendanceSeriesEndDate");
const saveAttendanceScheduleButton = document.querySelector("#saveAttendanceSchedule");
const attendanceAuthenticationCodeInput = document.querySelector("#attendanceAuthenticationCode");
const authenticateAttendanceCodeButton = document.querySelector("#authenticateAttendanceCode");
const attendanceAuthenticationStatus = document.querySelector("#attendanceAuthenticationStatus");
const weeklyTournamentCodeInput = document.querySelector("#weeklyTournamentCode");
const attendanceWeekList = document.querySelector("#attendanceWeekList");
const weeklyLodCodeInput = document.querySelector("#weeklyLodCode");
const manualRosterNames = document.querySelector("#manualRosterNames");
const mergeLodRosterButton = document.querySelector("#mergeLodRoster");
const createManualRosterButton = document.querySelector("#createManualRoster");
const attendanceRoster = document.querySelector("#attendanceRoster");
let attendanceSeries = [];
let selectedAttendanceSessionId = "";

function getAttendanceV2Session() {
  try {
    return JSON.parse(localStorage.getItem(ATTENDANCE_V2_SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function setSeriesStatus(message, kind = "") {
  seriesStatus.textContent = message;
  seriesStatus.className = `gate-message${kind ? ` ${kind}` : ""}`;
}

function setAttendanceAuthenticationStatus(message, kind = "") {
  attendanceAuthenticationStatus.textContent = message;
  attendanceAuthenticationStatus.className = `gate-message${kind ? ` ${kind}` : ""}`;
}

async function attendanceRequest(path, method = "GET", body) {
  const session = getAttendanceV2Session();
  const headers = { authorization: `Bearer ${session?.token || ""}` };
  if (body) {
    headers["content-type"] = "application/json";
  }
  const response = await fetch(`${ATTENDANCE_V2_API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "The attendance series service is unavailable.");
  }
  return payload;
}

async function attendanceSeriesRequest(method = "GET", body) {
  return attendanceRequest("/api/attendance/series", method, body);
}

function renderSeries(series = []) {
  attendanceSeries = series;
  seriesSelect.innerHTML = series.length
    ? series.map((record) => `<option value="${record.code}">${record.name} · ${record.code}</option>`).join("")
    : "<option value=\"\">No series created yet</option>";
  renderSelectedSeries();
}

function renderSelectedSeries() {
  const selected = attendanceSeries.find((record) => record.code === seriesSelect.value);
  if (!selected) {
    seriesCodePanel.hidden = true;
    weeklyTournamentCodeInput.value = "";
    weeklyLodCodeInput.disabled = true;
    manualRosterNames.disabled = true;
    mergeLodRosterButton.disabled = true;
    createManualRosterButton.disabled = true;
    selectedAttendanceSessionId = "";
    attendanceWeekList.innerHTML = "<p class=\"section-note\">Select a series first.</p>";
    attendanceRoster.textContent = "No attendance roster loaded yet.";
    return;
  }
  seriesName.value = selected.name || "";
  seriesDescription.value = selected.description || "";
  seriesCadence.value = selected.schedule?.cadence || "weekly";
  seriesWeeks.value = String(selected.schedule?.totalWeeks || selected.schedule?.plannedWeeks || 1);
  seriesStartDate.value = selected.schedule?.startDate || "";
  seriesCodeInput.value = selected.code || "";
  weeklyTournamentCodeInput.value = selected.code || "";
  seriesCodePanel.hidden = false;
  const plannedWeeks = Math.max(1, Number(selected.schedule?.plannedWeeks || 1));
  const totalWeeks = Math.max(1, Number(selected.schedule?.totalWeeks || plannedWeeks));
  const cadence = formatCadence(selected.schedule?.cadence);
  const sessions = Array.isArray(selected.schedule?.sessions) && selected.schedule.sessions.length
    ? selected.schedule.sessions
    : buildScheduleSessions(selected.schedule?.startDate || "", selected.schedule?.cadence || "weekly", totalWeeks);
  const scheduledEndIndex = Math.max(0, sessions.length - 1);
  const scheduledEnd = sessions[scheduledEndIndex]?.date || "";
  seriesEndDate.textContent = scheduledEnd
    ? `Scheduled end date: ${formatScheduleDate(scheduledEnd)}`
    : "Scheduled end date will appear after a start date is set.";
  selectedAttendanceSessionId = selectedAttendanceSessionId && sessions.some((session) => session.id === selectedAttendanceSessionId)
    ? selectedAttendanceSessionId
    : getCurrentAttendanceSessionId(sessions);
  attendanceWeekList.innerHTML = sessions.map((session, index) => {
    const sessionNumber = Number(session.number || index + 1);
    const date = session.date ? formatScheduleDate(session.date) : "Date not set";
    const sessionId = session.id || `session-${sessionNumber}`;
    const selectedClass = sessionId === selectedAttendanceSessionId ? " selected" : "";
    const dateParts = date === "Date not set" ? { day: "--", month: "Date", weekday: "not set" } : getDateThumbnailParts(session.date);
    return `<button type="button" class="attendance-week-option${selectedClass}" data-session-id="${escapeHtml(sessionId)}"><span class="attendance-week-thumb"><span class="attendance-week-thumb-month">${escapeHtml(dateParts.month)}</span><strong>${escapeHtml(dateParts.day)}</strong><span class="attendance-week-thumb-weekday">${escapeHtml(dateParts.weekday)}</span></span><span class="attendance-week-copy"><strong>Session ${sessionNumber}</strong><span>${escapeHtml(date)}</span></span></button>`;
  }).join("");
  weeklyLodCodeInput.disabled = false;
  manualRosterNames.disabled = false;
  mergeLodRosterButton.disabled = false;
  createManualRosterButton.disabled = false;
  renderAttendanceRoster(selected.attendance);
}

function getCurrentAttendanceSessionId(sessions) {
  const today = new Date();
  const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const elapsedSessions = sessions.filter((session) => session.date && session.date <= todayValue);
  return elapsedSessions.at(-1)?.id || sessions[0]?.id || "";
}

async function saveAttendanceSchedule() {
  const code = seriesSelect.value.trim();
  if (!code) {
    setSeriesStatus("Authenticate with a Tournament Code first.", "error");
    return;
  }
  const startDate = seriesStartDate.value.trim();
  if (!startDate) {
    setSeriesStatus("Choose an attendance start date.", "error");
    return;
  }
  saveAttendanceScheduleButton.disabled = true;
  setSeriesStatus("Saving attendance schedule…");
  try {
    const payload = await attendanceRequest(`/api/attendance/series/${encodeURIComponent(code)}`, "PATCH", {
      schedule: {
        startDate,
        cadence: seriesCadence.value,
        totalSessions: seriesWeeks.value,
      },
    });
    const index = attendanceSeries.findIndex((record) => record.code === code);
    if (index >= 0 && payload.series) attendanceSeries[index] = payload.series;
    selectedAttendanceSessionId = "";
    renderSelectedSeries();
    setSeriesStatus("Attendance schedule saved.", "success");
  } catch (error) {
    setSeriesStatus(error.message, "error");
  } finally {
    saveAttendanceScheduleButton.disabled = false;
  }
}

function getDateThumbnailParts(value) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return { day: "--", month: "Date", weekday: "not set" };
  }
  return {
    day: String(date.getUTCDate()),
    month: date.toLocaleDateString(undefined, { month: "short", timeZone: "UTC" }),
    weekday: date.toLocaleDateString(undefined, { weekday: "short", timeZone: "UTC" }),
  };
}

function renderAttendanceRoster(attendance = {}) {
  const selected = attendanceSeries.find((record) => record.code === seriesSelect.value);
  const sessions = Array.isArray(selected?.schedule?.sessions) ? selected.schedule.sessions : [];
  const storedPlayers = Array.isArray(attendance?.players) ? attendance.players : [];
  const currentRoster = getCurrentAdminRoster();
  const playerMap = new Map();
  currentRoster.forEach((name) => {
    const key = String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (key) playerMap.set(key, { name: String(name).trim(), weeks: {}, count: 0 });
  });
  storedPlayers.forEach((player) => {
    const key = String(player?.key || player?.name || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (key) playerMap.set(key, player);
  });
  const players = Array.from(playerMap.values()).sort((left, right) => String(left.name).localeCompare(String(right.name)));

  if (!players.length || !sessions.length) {
    attendanceRoster.className = "backup-preview-list empty";
    attendanceRoster.textContent = sessions.length ? "No attendance roster loaded yet." : "Load an attendance series to display its dates.";
    return;
  }

  attendanceRoster.className = "attendance-matrix-wrap";
  attendanceRoster.innerHTML = `
    <div class="attendance-matrix-scroll">
      <table class="attendance-matrix">
        <thead>
          <tr>
            <th scope="col">Player</th>
            ${sessions.map((session, index) => `<th scope="col"><span>Session ${Number(session.number || index + 1)}</span><strong>${escapeHtml(session.date ? formatScheduleDate(session.date) : "Date not set")}</strong></th>`).join("")}
            <th scope="col">Count</th>
          </tr>
        </thead>
        <tbody>
          ${players.map((player) => `<tr>
            <th scope="row">${escapeHtml(player.name)}</th>
            ${sessions.map((session) => `<td><input type="checkbox" data-attendance-player="${escapeHtml(player.name)}" data-attendance-session="${escapeHtml(session.id)}" aria-label="${escapeHtml(`${player.name} attended ${session.date || "this session"}`)}" ${hasAttendanceForSession(player, session) ? "checked" : ""}></td>`).join("")}
            <td class="attendance-matrix-count">${Number(player.count || Object.keys(player.weeks || {}).length || 0)}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function hasAttendanceForSession(player, session) {
  const weeks = player?.weeks;
  if (Array.isArray(weeks)) {
    return weeks.some((entry) => String(entry?.sessionId || entry?.date || "") === String(session.id || session.date || ""));
  }
  if (!weeks || typeof weeks !== "object") return false;
  return Boolean(weeks[session.id] || weeks[String(session.number)] || (session.date && weeks[session.date]));
}

function getCurrentAdminRoster() {
  const session = getAttendanceV2Session();
  const username = String(session?.username || "anonymous")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "_")
    .slice(0, 48) || "anonymous";
  try {
    const draft = JSON.parse(localStorage.getItem(`dartsTournamentBracketDraft:${username}`) || "null");
    const nameMap = draft?.nameMap && typeof draft.nameMap === "object" ? draft.nameMap : {};
    const mappedNames = Object.keys(nameMap)
      .sort((left, right) => Number(left) - Number(right))
      .map((key) => String(nameMap[key] || "").trim())
      .filter(Boolean);
    if (mappedNames.length) return mappedNames;
    return String(draft?.playerList || "").split(/\r?\n/).map((name) => name.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildScheduleSessions(startDate, cadence, totalSessions) {
  return Array.from({ length: totalSessions }, (_, index) => ({
    id: `session-${index + 1}`,
    number: index + 1,
    date: addScheduleInterval(startDate, cadence, index),
    buffer: index === totalSessions - 1,
  }));
}

function addScheduleInterval(startDate, cadence, index) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    return "";
  }
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

function formatCadence(cadence) {
  return {
    "bi-weekly": "Bi-weekly",
    monthly: "Monthly",
    quarterly: "Quarterly",
    "bi-yearly": "Bi-yearly",
    yearly: "Yearly",
  }[cadence] || "Weekly";
}

function formatScheduleDate(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

async function loadAttendanceSeries() {
  try {
    const payload = await attendanceSeriesRequest();
    renderSeries(payload.series || []);
  } catch (error) {
    setSeriesStatus(error.message, "error");
  }
}

async function authenticateAttendanceSeries() {
  const code = String(attendanceAuthenticationCodeInput.value || "").trim().toUpperCase();
  if (!code) {
    setAttendanceAuthenticationStatus("Enter the Tournament Code generated in the Admin Portal.", "error");
    attendanceAuthenticationCodeInput.focus();
    return;
  }

  authenticateAttendanceCodeButton.disabled = true;
  setAttendanceAuthenticationStatus("Loading attendance series…");
  try {
    const payload = await attendanceSeriesRequest();
    const selected = (payload.series || []).find((record) => String(record.code || "").toUpperCase() === code);
    if (!selected) {
      throw new Error("That Tournament Code was not found for this account or venue.");
    }
    renderSeries([selected]);
    seriesSelect.value = selected.code;
    renderSelectedSeries();
    setAttendanceAuthenticationStatus(`Authenticated to ${selected.name} · ${selected.code}.`, "success");
    setSeriesStatus(`Loaded ${selected.name}.`, "success");
  } catch (error) {
    setAttendanceAuthenticationStatus(error.message, "error");
  } finally {
    authenticateAttendanceCodeButton.disabled = false;
  }
}

seriesSelect.addEventListener("change", renderSelectedSeries);
authenticateAttendanceCodeButton.addEventListener("click", authenticateAttendanceSeries);
attendanceAuthenticationCodeInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    void authenticateAttendanceSeries();
  }
});
attendanceWeekList.addEventListener("click", (event) => {
  const option = event.target.closest("[data-session-id]");
  if (!option) return;
  selectedAttendanceSessionId = option.dataset.sessionId || "";
  attendanceWeekList.querySelectorAll("[data-session-id]").forEach((candidate) => {
    candidate.classList.toggle("selected", candidate === option);
  });
});
attendanceRoster.addEventListener("change", async (event) => {
  const checkbox = event.target.closest("input[data-attendance-player][data-attendance-session]");
  if (!checkbox) return;
  if (!checkbox.checked) {
    const selected = attendanceSeries.find((record) => record.code === seriesSelect.value);
    renderAttendanceRoster(selected?.attendance);
    setSeriesStatus("Attendance checks cannot be removed yet.", "error");
    return;
  }

  const seriesCode = seriesSelect.value.trim();
  const sessionId = checkbox.dataset.attendanceSession;
  const playerName = checkbox.dataset.attendancePlayer;
  checkbox.disabled = true;
  setSeriesStatus(`Saving ${playerName} for this attendance date…`);
  try {
    const payload = await attendanceRequest(`/api/attendance/series/${encodeURIComponent(seriesCode)}/merge`, "POST", { sessionId, names: [playerName] });
    const index = attendanceSeries.findIndex((record) => record.code === seriesCode);
    if (index >= 0 && payload.series) attendanceSeries[index] = payload.series;
    renderAttendanceRoster(payload.attendance);
    setSeriesStatus(`${playerName} marked present.`, "success");
  } catch (error) {
    checkbox.checked = false;
    checkbox.disabled = false;
    setSeriesStatus(error.message, "error");
  }
});
weeklyLodCodeInput.addEventListener("input", () => {
  mergeLodRosterButton.disabled = !seriesSelect.value || !selectedAttendanceSessionId;
});

createManualRosterButton.addEventListener("click", async () => {
  const seriesCode = seriesSelect.value.trim();
  const sessionId = selectedAttendanceSessionId;
  const names = manualRosterNames.value.split(/\r?\n/).map((name) => name.trim()).filter(Boolean);
  if (!seriesCode || !sessionId || !names.length) {
    setSeriesStatus("Select an attendance week and enter at least one player name.", "error");
    return;
  }
  createManualRosterButton.disabled = true;
  setSeriesStatus("Saving the manual attendance roster…");
  try {
    const payload = await attendanceRequest(`/api/attendance/series/${encodeURIComponent(seriesCode)}/merge`, "POST", { sessionId, names });
    const index = attendanceSeries.findIndex((record) => record.code === seriesCode);
    if (index >= 0 && payload.series) attendanceSeries[index] = payload.series;
    renderAttendanceRoster(payload.attendance);
    setSeriesStatus(`Saved ${names.length} players for the attendance week.`, "success");
    manualRosterNames.value = "";
  } catch (error) {
    setSeriesStatus(error.message, "error");
  } finally {
    createManualRosterButton.disabled = false;
  }
});

mergeLodRosterButton.addEventListener("click", async () => {
  const seriesCode = seriesSelect.value.trim();
  const sessionId = selectedAttendanceSessionId;
  const lodCode = weeklyLodCodeInput.value.trim();
  const names = lodCode ? undefined : getCurrentAdminRoster();
  if (!seriesCode || !sessionId) {
    setSeriesStatus("Authenticate with a Tournament Code and select an attendance week.", "error");
    return;
  }
  if (!lodCode && !names.length) {
    setSeriesStatus("Enter a weekly LOD code or generate teams with player names in the Admin Portal.", "error");
    return;
  }

  mergeLodRosterButton.disabled = true;
  setSeriesStatus("Merging the LOD roster…");
  try {
    const payload = await attendanceRequest(`/api/attendance/series/${encodeURIComponent(seriesCode)}/merge`, "POST", { sessionId, lodCode, names });
    const index = attendanceSeries.findIndex((record) => record.code === seriesCode);
    if (index >= 0 && payload.series) {
      attendanceSeries[index] = payload.series;
    }
    renderAttendanceRoster(payload.attendance);
    setSeriesStatus(payload.alreadyApplied
      ? "That LOD was already merged for this attendance week."
      : `Merged ${payload.attendance?.merges?.at(-1)?.playerCount || 0} players into the attendance week${lodCode ? "" : " from the Admin Portal roster"}.`, "success");
  } catch (error) {
    setSeriesStatus(error.message, "error");
  } finally {
    mergeLodRosterButton.disabled = !seriesSelect.value || !selectedAttendanceSessionId;
  }
});

copySeriesCodeButton.addEventListener("click", async () => {
  const code = seriesCodeInput.value.trim();
  if (!code) {
    return;
  }
  try {
    await navigator.clipboard.writeText(code);
    setSeriesStatus("Tournament Code copied.", "success");
  } catch {
    seriesCodeInput.focus();
    seriesCodeInput.select();
    setSeriesStatus("Select the code and copy it manually.");
  }
});

saveAttendanceScheduleButton.addEventListener("click", saveAttendanceSchedule);

// Attendance V2 is code-gated. Do not enumerate or load a series until the
// user authenticates with the Tournament Code from the Admin Portal.
renderSeries([]);
window.addEventListener("storage", (event) => {
  if (event.key?.startsWith("dartsTournamentBracketDraft:")) {
    const selected = attendanceSeries.find((record) => record.code === seriesSelect.value);
    renderAttendanceRoster(selected?.attendance);
  }
});
