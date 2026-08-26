(function () {
  const SESSION_STORAGE_KEY = "lodBracketSession:v1";
  const session = (() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  })();

  if (!session?.username || !session.verified) {
    const next = encodeURIComponent(`${window.location.pathname.split("/").pop()}${window.location.search}`);
    window.location.replace(`login.html?next=${next}`);
    return;
  }

  window.LOD_ACCOUNT_SESSION = session;
}());
