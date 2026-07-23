function getLangKey() {
  if (typeof window !== "undefined" && window.NV_I18N && typeof window.NV_I18N.getCurrentLangKey === "function") {
    return window.NV_I18N.getCurrentLangKey();
  }

  return window.lang === "en" ? "en" : "pt";
}

function t(key, fallback) {
  if (typeof window !== "undefined" && window.NV_I18N && typeof window.NV_I18N.t === "function") {
    return window.NV_I18N.t(key, fallback);
  }

  const parts = String(key).split(".");
  const langKey = getLangKey();
  let node = window.TG_I18N?.[langKey] || window.TG_I18N?.pt;

  for (const p of parts) {
    if (!node || node[p] === undefined) return fallback || key;
    node = node[p];
  }
  return node;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { getLangKey, t };
}

window.t = t;
window.getLangKey = getLangKey;
