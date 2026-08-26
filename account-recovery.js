const API_BASE_URL = String(window.LOD_AUTH_API_BASE_URL || window.BRACKET_API_BASE_URL || "").replace(/\/$/, "");
const usernameRecoveryForm = document.querySelector("#usernameRecoveryForm");
const passwordRecoveryForm = document.querySelector("#passwordRecoveryForm");
const recoveryMessage = document.querySelector("#recoveryMessage");

function setMessage(message, kind = "") {
  recoveryMessage.textContent = message;
  recoveryMessage.className = `login-message${kind ? ` ${kind}` : ""}`;
}

async function submitRecovery(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "The account service is unavailable.");
  }
  return payload;
}

usernameRecoveryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("Checking your account email…");
  try {
    const payload = await submitRecovery("/api/auth/forgot-username", {
      email: document.querySelector("#recoveryEmail").value,
    });
    setMessage(payload.message, "success");
  } catch (error) {
    setMessage(error.message, "error");
  }
});

passwordRecoveryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("Sending password-reset instructions…");
  try {
    const payload = await submitRecovery("/api/auth/forgot-password", {
      username: document.querySelector("#recoveryUsername").value,
      email: document.querySelector("#passwordRecoveryEmail").value,
    });
    setMessage(payload.message, "success");
  } catch (error) {
    setMessage(error.message, "error");
  }
});
