function getLangKey() {
  return window.lang === "en" ? "en" : "pt";
}

function t(key) {
  const parts = String(key).split(".");
  const langKey = getLangKey();
  let node = window.TG_I18N?.[langKey] || window.TG_I18N?.pt;
  for (const p of parts) {
    if (!node || node[p] === undefined) return key;
    node = node[p];
  }
  return node;
}

window.t = t;
window.getLangKey = getLangKey;
