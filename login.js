const SESSION_STORAGE_KEY = "lodBracketSession:v1";
const API_BASE_URL = String(window.LOD_AUTH_API_BASE_URL || window.BRACKET_API_BASE_URL || "").replace(/\/$/, "");
const signInForm = document.querySelector("#signInForm");
const loginMessage = document.querySelector("#loginMessage");

function setMessage(message, kind = "") {
  loginMessage.textContent = message;
  loginMessage.className = `login-message${kind ? ` ${kind}` : ""}`;
}

async function callAuth(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || "The account service is unavailable.");
    error.payload = payload;
    throw error;
  }
  return payload;
}

function saveSession(payload) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
    token: payload.sessionToken,
    username: payload.username,
    barName: payload.barName,
    verified: true,
    signedInAt: new Date().toISOString(),
  }));
}

const query = new URLSearchParams(window.location.search);
if (query.get("verified") === "1") {
  setMessage("Your account is verified. You can sign in now.", "success");
}
if (query.get("verified") === "0") {
  setMessage("That verification link is invalid or expired.", "error");
}

signInForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("Signing in…");

  try {
    const payload = await callAuth("/api/auth/login", {
      username: document.querySelector("#signInUsername").value,
      password: document.querySelector("#signInPassword").value,
    });
    saveSession(payload);
    window.location.href = query.get("next") || "bracket.html";
  } catch (error) {
    if (error.payload?.verificationRequired) {
      window.location.href = `verify.html?username=${encodeURIComponent(document.querySelector("#signInUsername").value)}`;
      return;
    }
    setMessage(error.message, "error");
  }
});
