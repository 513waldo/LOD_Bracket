const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendResendEmail(env, { to, subject, html }) {
  const apiKey = String(env?.RESEND_API_KEY || "").trim();
  const from = String(env?.RESEND_FROM || "onboarding@resend.dev").trim();

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || `Resend request failed with ${response.status}`);
  }

  return payload;
}
