export const siteName = () =>
  window.location.hostname.includes("dbailey.dev")
    ? "DBKaraoke"
    : import.meta.env.VITE_SITE_NAME;

export const siteQotd = () =>
  window.location.hostname.includes("dbailey.dev")
    ? "Bring your own mic! 🎤"
    : import.meta.env.VITE_QOTD;
