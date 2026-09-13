/**
 * Checklist Helper Functions
 * Checklist rendering and event binding
 */

function buildChecklistHtml(trackId, data, savedItems, lang, icons, escapeHtml, t) {
  const allDone = savedItems.length >= data.items.length;
  const itemsHtml = data.items
    .map((item, i) => {
      const checked = savedItems.includes(i);
      return `<label class="checklist-item ${checked ? "checked" : ""}">
      <input type="checkbox" class="checklist-check" data-track="${trackId}" data-idx="${i}" ${checked ? "checked" : ""}>
      <span>${escapeHtml(item)}</span>
    </label>`;
    })
    .join("");

  return `<div class="checklist-box" id="checklist-${trackId}">
    <div class="checklist-header">
      <h3>${escapeHtml(data.title)}</h3>
      <span class="checklist-progress" id="ck-progress-${trackId}">${savedItems.length}/${data.items.length} ${t("checklist.progress")}</span>
    </div>
    <div class="checklist-items">${itemsHtml}</div>
    ${allDone ? `<div class="checklist-complete">${icons ? icons.get('checkCircle','','16') + ' ' : ''}${lang === "en" ? "Project complete! Great work." : "Projeto concluído! Parabéns."}</div>` : ""}
  </div>`;
}

function bindChecklistHandlers(container, trackId, data, checklistState, t, onSave, onComplete) {
  if (!container || !trackId || !data) return;

  container
    .querySelectorAll(`.checklist-check[data-track="${trackId}"]`)
    .forEach((cb) => {
      cb.addEventListener("change", () => {
        const idx = parseInt(cb.dataset.idx, 10);
        if (!Number.isFinite(idx)) return;

        if (!checklistState[trackId]) checklistState[trackId] = [];
        if (cb.checked) {
          if (!checklistState[trackId].includes(idx)) checklistState[trackId].push(idx);
        } else {
          checklistState[trackId] = checklistState[trackId].filter((x) => x !== idx);
        }

        if (typeof onSave === "function") onSave(checklistState);

        const progressEl = container.querySelector(`#ck-progress-${trackId}`);
        if (progressEl) {
          progressEl.textContent = `${checklistState[trackId].length}/${data.items.length} ${t("checklist.progress")}`;
        }
        cb.closest(".checklist-item")?.classList.toggle("checked", cb.checked);

        const allDone = checklistState[trackId].length >= data.items.length;
        if (allDone && typeof onComplete === "function") onComplete(trackId);
      });
    });
}

module.exports = {
  buildChecklistHtml,
  bindChecklistHandlers,
};
