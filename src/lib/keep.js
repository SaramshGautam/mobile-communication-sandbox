// Keeps the participant's progress when the page is reloaded.
// sessionStorage lives as long as the browser tab, so a reload (or pull-to-refresh)
// brings everything back; closing the tab or "End session" starts clean.
// Every call is wrapped: storage can be full or blocked, and the app must still work.

export const keep = {
  get(key) {
    try { return JSON.parse(sessionStorage.getItem(key) ?? "null"); } catch { return null; }
  },
  set(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* full or blocked */ }
  },
  remove(key) {
    try { sessionStorage.removeItem(key); } catch { /* ignore */ }
  },
  // Remove every saved world except the current one.
  pruneWorlds(prefix, current) {
    try {
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const k = sessionStorage.key(i);
        if (k?.startsWith(prefix) && k !== current) sessionStorage.removeItem(k);
      }
    } catch { /* ignore */ }
  },
};

// True when this page load was a reload of the same tab.
export const wasReload = () => {
  try { return performance.getEntriesByType("navigation")[0]?.type === "reload"; } catch { return false; }
};
