const API_BASE_URL = String(window.LOD_AUTH_API_BASE_URL || window.BRACKET_API_BASE_URL || "").replace(/\/$/, "");
const form = document.querySelector("#localAccountForm");
const message = document.querySelector("#localAccountMessage");

function setMessage(text, kind = "") {
  message.textContent = text;
  message.className = `login-message${kind ? ` ${kind}` : ""}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = document.querySelector("#localPassword").value;
  const confirmation = document.querySelector("#localPasswordConfirm").value;
  if (password !== confirmation) {
    setMessage("The passwords do not match.", "error");
    return;
  }

  setMessage("Creating local account…");
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/dev-create`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: document.querySelector("#localUsername").value,
        password,
        barName: document.querySelector("#localBarName").value,
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || "The local account service is unavailable.");
    }
    form.hidden = true;
    setMessage(`Local account created for ${payload.barName}. You can sign in now.`, "success");
  } catch (error) {
    setMessage(error.message, "error");
  }
});
