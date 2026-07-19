function t(key) {
  const parts = String(key).split(".");
  let node = window.TG_I18N?.[window.lang];
  for (const p of parts) {
    if (!node || node[p] === undefined) return key;
    node = node[p];
  }
  return node;
}

window.t = t;
