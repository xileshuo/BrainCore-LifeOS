const LIFEOS_UI_STYLE_ID = "lifeos-ui-shared-styles-v14";
const LIFEOS_MOBILE_TOP_INSET_PX = 41;
const LIFEOS_RELEASE = "2026.08.25";

/** 样式表注册：按 id/version 复用，refCount 在插件卸载时再移除。 */
function registerLifeOsStyle(id, css, version) {
  const ver = String(version || "1");
  let el = document.getElementById(id);
  if (el) {
    const count = Number(el.dataset.refCount || "1") + 1;
    el.dataset.refCount = String(count);
    if (el.dataset.version !== ver || el.textContent !== css) {
      el.textContent = css;
      el.dataset.version = ver;
    }
    return el;
  }
  el = document.createElement("style");
  el.id = id;
  el.dataset.version = ver;
  el.dataset.refCount = "1";
  el.textContent = css;
  document.head.appendChild(el);
  return el;
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

function getLifeOsEditionDisplayName() {
  // 共享层专用；成品里以 main.source 的 getEditionDisplayName 为准，避免同名函数覆盖。
  if (typeof isTrialEdition === "function" && isTrialEdition()) return "体验版";
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
  registerLifeOsStyle(LIFEOS_UI_STYLE_ID, `
:root {
  --lifeos-accent: #b48246;
  --lifeos-accent-soft: rgba(180, 130, 70, 0.12);
  --lifeos-accent-border: rgba(180, 130, 70, 0.28);
  --lifeos-on-accent: #fff;
  --lifeos-error: var(--text-error, #c44);
  --lifeos-mobile-top-inset: ${LIFEOS_MOBILE_TOP_INSET_PX}px;
  --lifeos-sidebar-inset: 10px;
  /* 套件动效阶梯：快 120（点按反馈）/ 标准 180（状态切换）/ 展开 240（尺寸变化） */
  --lifeos-motion-fast: 120ms;
  --lifeos-motion-med: 180ms;
  --lifeos-motion-expand: 240ms;
  --lifeos-ease: cubic-bezier(.25, .8, .25, 1);
  --lifeos-hit-target: 44px;
  --lifeos-z-overlay: 1000100;
  --lifeos-bp-narrow: 480px;
}
.theme-dark {
  --lifeos-accent: #d4a574;
  --lifeos-accent-soft: rgba(212, 165, 116, 0.14);
  --lifeos-accent-border: rgba(212, 165, 116, 0.32);
  --lifeos-on-accent: #1a1510;
}
.lifeos-act-primary-btn,
.lifeos-suite-cta,
.lifeos-update-cta {
  color: var(--lifeos-on-accent, #fff);
}
.theme-dark .lifeos-act-primary-btn,
.theme-dark .lifeos-suite-cta,
.theme-dark .lifeos-update-cta {
  color: var(--lifeos-on-accent, #1a1510);
}
.lifeos-overlay,
.plg-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000000;
}
.lifeos-overlay-panel,
.plg-overlay-panel {
  width: min(520px, calc(100vw - 24px));
  max-height: min(860px, calc(100vh - 32px));
  max-height: min(860px, calc(100dvh - 32px));
  border-radius: 16px;
  overflow: hidden;
  background: var(--background-primary);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.22);
}
.lifeos-overlay-panel.wide,
.plg-overlay-panel.wide { width: min(680px, calc(100vw - 24px)); }
.lifeos-overlay-head,
.plg-overlay-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: none; /* 沉浸：标题与内容用间距区分，不用分割线 */
}
.lifeos-overlay-head h2,
.plg-overlay-head h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
}
.lifeos-overlay-close,
.plg-overlay-close {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
}
.lifeos-overlay-close:hover,
.plg-overlay-close:hover {
  color: var(--text-normal);
  background: var(--background-modifier-hover);
}
.lifeos-overlay-body,
.plg-overlay-body {
  padding: 12px 16px 16px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
@media (max-width: 700px) {
  .lifeos-overlay,
  .plg-overlay {
    align-items: center;
    padding: max(10px, env(safe-area-inset-top, 0px)) 12px max(12px, env(safe-area-inset-bottom, 0px));
    box-sizing: border-box;
  }
  .lifeos-overlay-panel,
  .plg-overlay-panel {
    width: min(520px, calc(100vw - 24px));
    max-height: calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 20px);
    margin: 0 auto;
  }
  .lifeos-overlay-close,
  .plg-overlay-close {
    top: 8px;
    right: 8px;
    width: var(--lifeos-hit-target);
    height: var(--lifeos-hit-target);
  }
  .lifeos-act-input { font-size:16px !important; min-height:44px; }
  .lifeos-act-btn, .lifeos-act-nav-btn, .lifeos-empty-cta { min-height:44px; font-size:14px; }
  .lifeos-about-link-row button,
  .lifeos-about-work-actions button { min-height:28px; height:28px; font-size:12px; }
  .modal-container.bc-update-modal-host,
  .modal-container.lifeos-update-modal-host {
    align-items: center !important;
    justify-content: center !important;
    padding: max(8px, env(safe-area-inset-top, 0px)) 8px max(8px, env(safe-area-inset-bottom, 0px)) !important;
    box-sizing: border-box !important;
  }
  .lifeos-modal.modal,
  .bc-update-modal.modal {
    height: auto;
    max-height: calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 16px);
  }
  .lifeos-modal .modal-close-button,
  .bc-update-modal .modal-close-button {
    top: 8px !important;
    right: 8px !important;
  }
}
.lifeos-mobile-top-spacer,
.plg-mobile-top-spacer,
.jnr-mobile-top-spacer,
.bc-mobile-top-spacer {
  display: block;
  flex-shrink: 0;
  height: var(--lifeos-mobile-top-inset);
  min-height: var(--lifeos-mobile-top-inset);
  pointer-events: none;
}
.lifeos-modal.modal,
.plg-update-modal.modal,
.jnr-update-modal.modal,
.bc-update-modal.modal,
.plg-trial-modal.modal {
  width: min(680px, calc(100vw - 32px));
  max-width: 680px;
  max-height: calc(100vh - 40px);
  max-height: calc(100dvh - 40px);
}
.lifeos-modal .modal-content,
.plg-update-modal .modal-content,
.jnr-update-modal .modal-content,
.bc-update-modal .modal-content {
  border-radius: 16px;
  overflow: hidden;
}
.lifeos-modal .lifeos-modal-primary,
.plg-update-btn,
.jnr-update-btn,
.bc-update-btn {
  border-radius: 10px;
  font-weight: 700;
  background: var(--lifeos-accent) !important;
  color: var(--lifeos-on-accent, #fff) !important;
  border: none !important;
}
.lifeos-philosophy-intro,
.plg-update-subtitle,
.plg-settings-intro,
.jnr-settings-intro,
.jnr-update-subtitle,
.bc-update-subtitle,
.bc-settings-intro {
  text-indent: 2em;
}
.lifeos-error,
.plg-activation-status.error,
.jnr-activation-status.error,
.bc-activation-status.error {
  color: var(--lifeos-error) !important;
}
.plg-activation-preview,
.jnr-activation-preview,
.bc-activation-preview {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--lifeos-accent-soft);
  border: 1px solid var(--lifeos-accent-border);
}
.plg-activation-preview-row,
.jnr-activation-preview-row,
.bc-activation-preview-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--text-muted);
}
.plg-activation-preview-row strong,
.jnr-activation-preview-row strong,
.bc-activation-preview-row strong {
  font-size: 14px;
  color: var(--lifeos-accent);
  font-weight: 800;
}
.plg-activation-preview-note,
.jnr-activation-preview-note,
.bc-activation-preview-note {
  margin: 2px 0 0;
  font-size: 10px;
  line-height: 1.4;
  color: var(--text-faint);
  text-align: center;
}
.plg-ledger-root {
  --plg-accent: var(--lifeos-accent);
}
/* __LIFEOS_SIDEBAR_INSET_CSS__ */
.lifeos-trial-banner,
.bc-trial-banner {
  margin: 0 0 8px;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.45;
  text-indent: 2em;
  background: var(--lifeos-accent-soft);
  border: 1px solid var(--lifeos-accent-border);
  color: var(--text-normal);
  cursor: pointer;
  box-sizing: border-box;
  width: auto;
  align-self: auto;
}
.lifeos-trial-banner strong,
.bc-trial-banner strong {
  color: var(--lifeos-accent, var(--text-accent));
}
.lifeos-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 16px;
  text-align: center;
  border-radius: 12px;
  border: 1px dashed var(--background-modifier-border);
  background: var(--background-secondary);
}
.lifeos-empty-icon { font-size: 28px; line-height: 1; opacity: 0.85; }
.lifeos-empty-msg { margin: 0; font-size: 13px; line-height: 1.5; color: var(--text-muted); }
.lifeos-empty-cta {
  margin-top: 4px;
  border: none;
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  background: var(--lifeos-accent, var(--interactive-accent)) !important;
  color: var(--lifeos-on-accent, #fff) !important;
}
.lifeos-first-run-card {
  margin: 0 0 10px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--lifeos-accent-border);
  background: var(--lifeos-accent-soft);
}
.lifeos-first-run-title { margin: 0 0 8px; font-size: 13px; font-weight: 800; color: var(--text-normal); }
.lifeos-first-run-list { margin: 0 0 10px; padding-left: 1.2em; font-size: 12px; line-height: 1.55; color: var(--text-muted); }
.lifeos-first-run-actions { display: flex; gap: 8px; }
.lifeos-first-run-actions button {
  flex: 1;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid var(--background-modifier-border);
  background: var(--background-primary);
  color: var(--text-normal);
}
.lifeos-first-run-actions button.lifeos-first-run-primary {
  background: var(--lifeos-accent, var(--interactive-accent)) !important;
  color: var(--lifeos-on-accent, #fff) !important;
  border: none !important;
}
@media (min-width: 520px) {
  .lifeos-first-run-card {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 20px;
    padding: 14px 16px;
  }
  .lifeos-first-run-title {
    flex: 1 1 100%;
    margin: 0;
  }
  .lifeos-first-run-list {
    flex: 1 1 240px;
    margin: 0;
    min-width: 0;
  }
  .lifeos-first-run-actions {
    flex: 0 0 auto;
    margin-left: auto;
    white-space: nowrap;
  }
}
.lifeos-suite-badge {
  margin: 0 0 10px;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  color: var(--lifeos-accent, var(--text-accent));
  background: var(--lifeos-accent-soft);
  border: 1px solid var(--lifeos-accent-border);
}
.lifeos-about-work-item {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--background-modifier-border);
  background: var(--background-secondary);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.bc-tag-suggest-new {
  border-left: 3px solid var(--lifeos-accent, var(--text-accent));
  background: var(--lifeos-accent-soft);
  padding-left: 8px !important;
  border-radius: 6px;
}
.bc-tag-suggest-new .suggestion-title {
  color: var(--lifeos-accent, var(--text-accent));
  font-weight: 700;
}
.bc-tag-suggest-new .suggestion-note {
  color: var(--text-muted);
  font-size: 11px;
}
.bc-tag-browser-tip {
  margin-bottom: 8px;
}
.bc-tag-browser-filter {
  width: 100%;
  box-sizing: border-box;
  margin: 0 0 10px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--background-modifier-border);
  background: var(--background-primary);
  font-size: 13px;
}
.bc-tag-browser-filter:focus {
  outline: none;
  border-color: var(--lifeos-accent-border, var(--interactive-accent));
  box-shadow: 0 0 0 2px var(--lifeos-accent-soft);
}
.bc-tag-browser-list {
  max-height: 60vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.bc-tag-browser-empty.hidden {
  display: none;
}
.bc-tag-browser-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid var(--background-modifier-border);
  font-size: 12px;
  background: var(--background-primary);
  transition: background 120ms ease, border-color 120ms ease;
}
.bc-tag-browser-item:hover {
  background: var(--lifeos-accent-soft);
  border-color: var(--lifeos-accent-border);
}
.bc-tag-browser-name {
  font-weight: 600;
  color: var(--text-normal);
}
.bc-tag-browser-count {
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}
.lifeos-about-works {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
}
.lifeos-settings-version {
  margin: -6px 0 12px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-muted);
}
.lifeos-about-work-actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: 10px;
  flex-wrap: wrap;
  align-items: center;
  min-height: 28px;
}
.lifeos-about-work-actions button {
  border-radius: 8px;
  padding: 5px 12px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--background-modifier-border);
  background: var(--background-modifier-hover);
  color: var(--text-muted);
  min-height: 28px;
  height: 28px;
  line-height: 1;
  box-sizing: border-box;
}
.lifeos-about-work-actions button.is-self { opacity: 0.55; cursor: default; }
.lifeos-mobile-topbar-unified {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px 6px;
  flex-shrink: 0;
}
.lifeos-mobile-topbar-unified .lifeos-mobile-top-title {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 16px;
  font-weight: 800;
  color: var(--text-normal);
}
.lifeos-mobile-topbar-unified .lifeos-mobile-top-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.lifeos-mobile-topbar-unified button.clickable-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
}
.sb-task-list .lifeos-empty-state,
.sb-container .lifeos-empty-state {
  padding: 14px 10px;
  gap: 6px;
}
@media (prefers-reduced-motion: reduce) {
  .sb-btn-box,
  .sb-btn-box:active,
  .sb-box,
  .sb-box:active,
  .sb-stat-item-wrap,
  .sb-stat-item-wrap:hover,
  .sb-stat-item-wrap:active,
  .sb-task-item,
  .sb-task-item:hover,
  .sb-task-checkbox,
  .sb-pixel-bar-fill,
  .bcq-habit-box,
  .bcq-habit-box:active,
  .bc-row-item,
  .bc-row-item:active,
  .bc-capsule-pulse,
  .bc-capsule-send-btn,
  .bc-capsule-send-btn:active {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
  .bc-capsule-pulse {
    box-shadow: none !important;
  }
  :root {
    --lifeos-motion-fast: 1ms;
    --lifeos-motion-med: 1ms;
    --lifeos-motion-expand: 1ms;
  }
  .memos-share-generation-progress progress,
  .memos-share-style-button,
  .memos-share-card,
  .sb-quote-wrap,
  .sb-quote-wrap.is-cycling .sb-quote-content,
  .sb-quote-wrap.is-cycling .sb-quote-src,
  .memoria-root textarea.memoria-input,
  .memoria-input-card,
  .memoria-input-toolbar,
  .memoria-root button.memoria-submit-btn,
  .memoria-list,
  .memoria-memo-card {
    animation: none !important;
    transition: none !important;
  }
}
`, "10");
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
