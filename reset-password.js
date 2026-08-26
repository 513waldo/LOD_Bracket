const API_BASE_URL = String(window.LOD_AUTH_API_BASE_URL || window.BRACKET_API_BASE_URL || "").replace(/\/$/, "");
const resetToken = new URLSearchParams(window.location.search).get("token") || "";
const resetForm = document.querySelector("#passwordResetForm");
const resetMessage = document.querySelector("#resetMessage");

function setMessage(message, kind = "") {
  resetMessage.textContent = message;
  resetMessage.className = `login-message${kind ? ` ${kind}` : ""}`;
}

resetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const password = document.querySelector("#newPassword").value;
  const confirmation = document.querySelector("#confirmPassword").value;
  if (!resetToken) {
    setMessage("This password-reset link is invalid or expired.", "error");
    return;
  }
  if (password !== confirmation) {
    setMessage("The passwords do not match.", "error");
    return;
  }

  setMessage("Updating your password…");
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: resetToken, password }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || "The account service is unavailable.");
    }
    resetForm.hidden = true;
    setMessage("Your password was changed. You can sign in now.", "success");
  } catch (error) {
    setMessage(error.message, "error");
  }
});
