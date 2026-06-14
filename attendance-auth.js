const ATTENDANCE_ROOT_PASSWORD_STORAGE_KEY = "dartsTournamentAttendanceRootPassword";
const ATTENDANCE_ROOT_SESSION_STORAGE_KEY = "dartsTournamentAttendanceRootSession";
const DEFAULT_ATTENDANCE_ROOT_PASSWORD_CODES = [53, 49, 51, 56, 53, 57, 68, 97, 114, 116, 115, 33];
const DEFAULT_ATTENDANCE_ROOT_PASSWORD = decodePasswordCodes(DEFAULT_ATTENDANCE_ROOT_PASSWORD_CODES);

function decodePasswordCodes(codes) {
  return Array.isArray(codes)
    ? String.fromCharCode(...codes.map((code) => Number(code) || 0))
    : "";
}

function normalizeAttendanceRootPassword(value) {
  return String(value || "").trim();
}

function canUseAttendanceLocalStorage() {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}

function canUseAttendanceSessionStorage() {
  try {
    return typeof sessionStorage !== "undefined";
  } catch {
    return false;
  }
}

function getStoredAttendanceRootPassword() {
  if (!canUseAttendanceLocalStorage()) {
    return DEFAULT_ATTENDANCE_ROOT_PASSWORD;
  }

  try {
    return localStorage.getItem(ATTENDANCE_ROOT_PASSWORD_STORAGE_KEY) || DEFAULT_ATTENDANCE_ROOT_PASSWORD;
  } catch {
    return DEFAULT_ATTENDANCE_ROOT_PASSWORD;
  }
}

function hasStoredAttendanceRootPassword() {
  if (!canUseAttendanceLocalStorage()) {
    return false;
  }

  try {
    return localStorage.getItem(ATTENDANCE_ROOT_PASSWORD_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function saveStoredAttendanceRootPassword(password) {
  if (!canUseAttendanceLocalStorage()) {
    return;
  }

  try {
    localStorage.setItem(ATTENDANCE_ROOT_PASSWORD_STORAGE_KEY, normalizeAttendanceRootPassword(password));
  } catch {
    // Ignore storage failures.
  }
}

function clearStoredAttendanceRootPassword() {
  if (!canUseAttendanceLocalStorage()) {
    return;
  }

  try {
    localStorage.removeItem(ATTENDANCE_ROOT_PASSWORD_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

function getAttendanceRootSessionPassword() {
  if (!canUseAttendanceSessionStorage()) {
    return "";
  }

  try {
    return sessionStorage.getItem(ATTENDANCE_ROOT_SESSION_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function saveAttendanceRootSessionPassword(password) {
  if (!canUseAttendanceSessionStorage()) {
    return;
  }

  try {
    sessionStorage.setItem(ATTENDANCE_ROOT_SESSION_STORAGE_KEY, normalizeAttendanceRootPassword(password));
  } catch {
    // Ignore storage failures.
  }
}

function clearAttendanceRootSessionPassword() {
  if (!canUseAttendanceSessionStorage()) {
    return;
  }

  try {
    sessionStorage.removeItem(ATTENDANCE_ROOT_SESSION_STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}

function hasAttendanceRootAccess() {
  const stored = getStoredAttendanceRootPassword();
  const session = getAttendanceRootSessionPassword();
  return Boolean(stored) && session === stored;
}
