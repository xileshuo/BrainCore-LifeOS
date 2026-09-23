const LIFEOS_UI_STYLE_ID = "lifeos-ui-shared-styles-v14";
const LIFEOS_MOBILE_TOP_INSET_PX = 41;
const LIFEOS_RELEASE = "2026.09.21";

/** styles.css is loaded by Obsidian; keep API for callers / release-check. */
function registerLifeOsStyle(id, css, version) {
  return null;
}

function releaseLifeOsStyle(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const count = Math.max(0, Number(el.dataset.refCount || "1") - 1);
  if (count <= 0) el.remove();
  else el.dataset.refCount = String(count);
}

/** iOS WebKit rejects space-joined class strings; split tokens for addClass. */
function addClasses(el, ...classes) {
  if (!el) return;
  classes.filter(Boolean).forEach((c) => {
    String(c).trim().split(/\s+/).filter(Boolean).forEach((token) => {
      try { el.addClass(token); } catch (_) { /* one token per addClass on iOS */ }
    });
  });
}

function getLifeOsReleaseLabel() {
  return LIFEOS_RELEASE;
}

function getLifeOsEditionDisplayName(settings) {
  // 共享层专用；成品里以 main.source 的 getEditionDisplayName 为准，避免同名函数覆盖。
  if (typeof isTrialEdition === "function" && isTrialEdition()) {
    if (settings && settings.licenseActivated) return "公版";
    const h = typeof getTrialHoursLabel === "function" ? getTrialHoursLabel() : "";
    return h ? `${h}体验版` : "体验版";
  }
  if (typeof PLUGIN_WEEKLY_PROFILE === "string" && PLUGIN_WEEKLY_PROFILE === "commercial") return "公版";
  if (typeof PLUGIN_EDITION === "string" && PLUGIN_EDITION === "public") return "公版";
  if (typeof PLUGIN_WEEKLY_PROFILE === "string" && PLUGIN_WEEKLY_PROFILE === "personal") return "个人版";
  if (typeof PLUGIN_EDITION === "string" && PLUGIN_EDITION === "personal") return "个人版";
  return "";
}

function resolveEditionDisplayName() {
  if (typeof getEditionDisplayName === "function") return getEditionDisplayName();
  return getLifeOsEditionDisplayName();
}

function formatLifeOsVersionLine(version, editionLabel) {
  const v = String(version || "").trim() || "0.0.0";
  const ed = editionLabel ? ` · ${editionLabel}` : "";
  return `LifeOS ${LIFEOS_RELEASE} · v${v}${ed}`;
}

function formatPluginSettingsTitle(baseTitle, editionLabel) {
  const edition = editionLabel ? ` · ${editionLabel}` : "";
  const v = typeof PLUGIN_VERSION === "string" ? PLUGIN_VERSION.trim() : "";
  return v ? `${baseTitle}${edition} v${v}` : `${baseTitle}${edition}`;
}

function getPluginVersionDisplayLine() {
  const v = typeof PLUGIN_VERSION === "string" ? PLUGIN_VERSION : "0.0.0";
  return formatLifeOsVersionLine(v, resolveEditionDisplayName());
}

function injectLifeOsSharedStyles() {
  /* CSS lives in styles.css (community plugin: no runtime <style> injection). */
}

function renderLifeOsEmptyState(parent, options = {}) {
  injectLifeOsSharedStyles();
  parent.empty();
  const wrap = parent.createDiv({ cls: "lifeos-empty-state" });
  if (options.icon) wrap.createDiv({ cls: "lifeos-empty-icon", text: options.icon });
  wrap.createEl("p", { cls: "lifeos-empty-msg", text: options.message || "暂无内容" });
  if (options.ctaLabel && typeof options.onCta === "function") {
    const btn = wrap.createEl("button", { cls: "lifeos-empty-cta", text: options.ctaLabel, type: "button" });
    btn.onclick = () => void options.onCta();
  }
  return wrap;
}

function showLifeOsFirstRunCard(container, app, storageKey, options = {}) {
  injectLifeOsSharedStyles();
  try {
    if (localStorage.getItem(storageKey) === "1") return null;
  } catch { /* ignore */ }
  const card = container.createDiv({ cls: "lifeos-first-run-card" });
  card.createEl("p", { cls: "lifeos-first-run-title", text: options.title || "欢迎使用 LifeOS" });
  const list = card.createEl("ul", { cls: "lifeos-first-run-list" });
  (options.bullets || []).forEach((line) => list.createEl("li", { text: line }));
  const actions = card.createDiv({ cls: "lifeos-first-run-actions" });
  const dismiss = () => {
    try { localStorage.setItem(storageKey, "1"); } catch { /* ignore */ }
    card.remove();
  };
  if (options.primaryLabel) {
    const primary = actions.createEl("button", {
      cls: "lifeos-first-run-primary",
      text: options.primaryLabel,
      type: "button",
    });
    primary.onclick = () => {
      dismiss();
      if (typeof options.onPrimary === "function") void options.onPrimary();
    };
  }
  if (options.secondaryLabel) {
    const secondary = actions.createEl("button", { text: options.secondaryLabel, type: "button" });
    secondary.onclick = () => {
      dismiss();
      if (typeof options.onSecondary === "function") void options.onSecondary();
    };
  }
  const later = actions.createEl("button", { text: options.laterLabel || "知道了", type: "button" });
  later.onclick = dismiss;
  return card;
}

function renderLifeOsActivationPreview(card, rows, note) {
  injectLifeOsSharedStyles();
  const preview = card.createDiv({ cls: "plg-activation-preview lifeos-activation-preview" });
  (rows || []).forEach((row) => {
    const line = preview.createDiv({ cls: "plg-activation-preview-row" });
    line.createSpan({ text: row.label });
    line.createEl("strong", { text: row.value });
  });
  if (note) preview.createEl("p", { cls: "plg-activation-preview-note", text: note });
  return preview;
}

function openLifeOsPluginSettings(app, pluginId) {
  if (!app?.setting) return;
  const openTab = () => {
    try {
      if (typeof app.setting.openTabById === "function") {
        app.setting.openTabById(pluginId);
        return true;
      }
      const tab = app.setting.pluginTabs?.find?.((t) => t.id === pluginId);
      if (tab && typeof app.setting.openTab === "function") {
        app.setting.openTab(tab);
        return true;
      }
    } catch { /* ignore */ }
    return false;
  };
  try { app.setting.open(); } catch { /* ignore */ }
  if (openTab()) return;
  window.setTimeout(() => {
    if (!openTab()) new Notice(`无法打开插件设置，请手动进入 设置 → 第三方插件`);
  }, 80);
}
