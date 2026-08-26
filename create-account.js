const API_BASE_URL = String(window.LOD_AUTH_API_BASE_URL || window.BRACKET_API_BASE_URL || "").replace(/\/$/, "");
const createAccountForm = document.querySelector("#createAccountForm");
const loginMessage = document.querySelector("#loginMessage");

function setMessage(message, kind = "") {
  loginMessage.textContent = message;
  loginMessage.className = `login-message${kind ? ` ${kind}` : ""}`;
}

createAccountForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = document.querySelector("#createPassword").value;
  const confirmation = document.querySelector("#createPasswordConfirm").value;

  if (password !== confirmation) {
    setMessage("The passwords do not match.", "error");
    return;
  }

  setMessage("Creating your account and sending the confirmation email…");
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        barName: document.querySelector("#createBarName").value,
        email: document.querySelector("#createEmail").value,
        username: document.querySelector("#createUsername").value,
        password,
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || "The account service is unavailable.");
    }
    window.location.href = `verify.html?username=${encodeURIComponent(document.querySelector("#createUsername").value)}&email=${encodeURIComponent(payload.email || document.querySelector("#createEmail").value)}`;
  } catch (error) {
    setMessage(error.message, "error");
  }
});
