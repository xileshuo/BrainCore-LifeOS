const UPDATE_NOTICE_STYLE_ID = "bc-update-notice-styles";

function getPluginVersionLabel() {
  const v = typeof PLUGIN_VERSION === "string" ? PLUGIN_VERSION : "0.0.0";
  const ed = typeof getEditionDisplayName === "function" ? getEditionDisplayName() : "";
  if (typeof formatLifeOsVersionLine === "function") return formatLifeOsVersionLine(v, ed);
  return `v${v}`;
}

function getPluginVersionSemver() {
  return typeof PLUGIN_VERSION === "string" ? PLUGIN_VERSION : "0.0.0";
}

function getChangelog() {
  return typeof PLUGIN_CHANGELOG !== "undefined" && PLUGIN_CHANGELOG ? PLUGIN_CHANGELOG : {};
}

function getUpdateHowto(version) {
  const map = typeof PLUGIN_UPDATE_HOWTO !== "undefined" && PLUGIN_UPDATE_HOWTO ? PLUGIN_UPDATE_HOWTO : {};
  const items = map[version];
  return Array.isArray(items) ? items.filter(Boolean) : [];
}

function compareVersions(a, b) {
  const pa = String(a).split(".").map((x) => parseInt(x, 10) || 0);
  const pb = String(b).split(".").map((x) => parseInt(x, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function getPhilosophySubtitle() {
  return typeof PLUGIN_PHILOSOPHY_SUBTITLE === "string" && PLUGIN_PHILOSOPHY_SUBTITLE
    ? PLUGIN_PHILOSOPHY_SUBTITLE
    : "";
}

function getUpdateNoticeTitle() {
  const name = typeof PLUGIN_DISPLAY_NAME === "string" && PLUGIN_DISPLAY_NAME
    ? PLUGIN_DISPLAY_NAME
    : "";
  return name ? `${name} 更新日志` : "更新日志";
}

function renderUpdateNoticeHero(hero) {
  const version = getPluginVersionLabel();
  hero.createDiv({ cls: "bc-update-badge", text: version });
  hero.createEl("h2", { cls: "bc-update-title", text: getUpdateNoticeTitle() });
  const intro = typeof PLUGIN_INTRO === "string" ? PLUGIN_INTRO.trim() : "";
  if (intro) {
    const introEl = hero.createEl("p", { text: intro });
    addClasses(introEl, "bc-update-subtitle", "lifeos-philosophy-intro");
  }
  const philosophy = getPhilosophySubtitle();
  if (philosophy) {
    const subEl = hero.createEl("p", { text: philosophy });
    addClasses(subEl, "bc-update-subtitle", "lifeos-philosophy-intro");
  }
}

function injectUpdateNoticeStyles() {
  injectLifeOsSharedStyles();
  registerLifeOsStyle(UPDATE_NOTICE_STYLE_ID, `
.modal-container.bc-update-modal-host,
.modal-bg.bc-update-modal-bg {
  z-index: 1000100 !important;
}
.bc-update-modal.modal {
  width: min(680px, calc(100vw - 32px));
  max-width: 680px;
  max-height: calc(100vh - 40px);
  max-height: calc(100dvh - 40px);
  margin: 0 auto !important;
}
.bc-update-modal .modal-close-button { top: 8px; right: 8px; z-index: 2; }
.bc-update-modal .modal-content {
  padding: 0;
  overflow: hidden;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: calc(100vh - 40px);
  max-height: calc(100dvh - 40px);
}
.bc-update-wrap {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  max-height: calc(100vh - 40px);
  max-height: calc(100dvh - 40px);
}
.bc-update-hero {
  flex: 0 0 auto;
  padding: 28px 28px 22px;
  background: linear-gradient(135deg, var(--lifeos-accent-soft), rgba(180, 130, 70, 0.06));
  border-bottom: 1px solid var(--background-modifier-border);
}
.bc-update-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--lifeos-accent-soft);
  color: var(--lifeos-accent, #b48246);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.4px;
  margin-bottom: 10px;
}
.bc-update-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-normal);
  line-height: 1.25;
  text-shadow: none;
  -webkit-text-stroke: 0;
}
.bc-update-subtitle {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
  text-indent: 2em;
}
.bc-update-body {
  flex: 1 1 auto;
  min-height: 0;
  padding: 18px var(--lifeos-sidebar-inset, 10px) 8px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  touch-action: pan-y;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.bc-update-body::-webkit-scrollbar { display: none; width: 0; height: 0; }
.bc-update-version {
  border: 1px solid var(--background-modifier-border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--background-primary);
  flex-shrink: 0;
}
.bc-update-version-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  font-size: 13px;
  font-weight: 800;
  color: var(--lifeos-accent, #b48246);
  background: var(--lifeos-accent-soft);
  border-bottom: 1px solid transparent;
  user-select: none;
}
.bc-update-version.is-open .bc-update-version-head {
  border-bottom-color: var(--background-modifier-border);
}
.bc-update-version.is-latest .bc-update-version-head {
  color: var(--lifeos-accent, #b48246);
  background: var(--lifeos-accent-soft);
}
.bc-update-version:not(.is-latest) .bc-update-version-head {
  cursor: pointer;
}
.bc-update-version:not(.is-latest) .bc-update-version-head:hover {
  background: var(--lifeos-accent-soft);
}
.bc-update-version-chevron {
  flex: 0 0 auto;
  font-size: 16px;
  line-height: 1;
  color: var(--text-muted);
  transition: transform 0.18s ease;
}
.bc-update-version.is-open .bc-update-version-chevron {
  transform: rotate(90deg);
}
.bc-update-version.is-latest .bc-update-version-chevron {
  display: none;
}
.bc-update-version-body {
  display: none;
}
.bc-update-version.is-open .bc-update-version-body {
  display: block;
}
.bc-update-list { list-style: none; margin: 0; padding: 8px 0; }
.bc-update-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px 14px;
  border-top: 1px solid var(--background-modifier-border);
  font-size: 14px;
  line-height: 1.55;
  color: var(--text-normal);
  word-break: break-word;
}
.bc-update-item:first-child { border-top: none; }
.bc-update-num {
  flex: 0 0 22px;
  height: 22px;
  border-radius: 7px;
  background: var(--lifeos-accent-soft);
  color: var(--lifeos-accent, #b48246);
  font-size: 12px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}
.bc-update-foot {
  flex: 0 0 auto;
  padding: 16px 24px 22px;
  padding-bottom: max(22px, env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--background-modifier-border);
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
  background: var(--background-primary);
}
.bc-update-more {
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
}
.bc-update-btn {
  border: none;
  border-radius: 10px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  background: var(--lifeos-accent, #b48246);
  color: var(--lifeos-on-accent, #fff);
  box-shadow: 0 6px 18px color-mix(in srgb, var(--lifeos-accent, #b48246) 22%, transparent);
}
.bc-update-btn:hover { filter: brightness(1.05); }
@media (max-width: 768px) {
  .modal-container.bc-update-modal-host {
    align-items: center;
    padding: max(8px, env(safe-area-inset-top, 0px)) 8px max(8px, env(safe-area-inset-bottom, 0px));
    box-sizing: border-box;
  }
  .bc-update-modal.modal {
    width: calc(100vw - 16px);
    height: auto;
    max-height: calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 16px);
  }
  .bc-update-modal .modal-close-button {
    top: 8px !important;
    right: 8px !important;
    width: 36px;
    height: 36px;
  }
  .bc-update-modal .modal-content,
  .bc-update-wrap {
    max-height: calc(100dvh - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px) - 16px);
  }
  .bc-update-hero { padding: 20px 16px 14px; }
  .bc-update-title { font-size: 20px; }
  .bc-update-subtitle { font-size: 13px; }
  .bc-update-body { padding: 12px var(--lifeos-sidebar-inset, 10px) 6px; }
  .bc-update-item { font-size: 13px; padding: 9px 12px; }
  .bc-update-foot { padding: 12px 14px max(14px, env(safe-area-inset-bottom, 14px)); }
  .bc-update-btn { width: 100%; text-align: center; padding: 12px 16px; }
}
.bc-update-howto .bc-update-version-head {
  cursor: default;
  border-bottom-color: var(--background-modifier-border);
}
.bc-update-howto .bc-update-version-head:hover {
  background: var(--lifeos-accent-soft);
}
.bc-update-full-log { margin: 10px 0 0; }
.bc-update-full-log summary {
  cursor: pointer;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 0;
}
`, "v2");
}

function renderUpdateHowto(body, currentVersion) {
  const howto = getUpdateHowto(currentVersion);
  if (!howto.length) return;
  const block = body.createDiv({ cls: "bc-update-version bc-update-howto is-open" });
  const head = block.createDiv({ cls: "bc-update-version-head" });
  head.createSpan({ text: "🚀 这版怎么用" });
  const content = block.createDiv({ cls: "bc-update-version-body" });
  const list = content.createEl("ul", { cls: "bc-update-list" });
  howto.forEach((note, idx) => {
    const item = list.createEl("li", { cls: "bc-update-item" });
    item.createSpan({ cls: "bc-update-num", text: String(idx + 1) });
    item.createSpan({ text: note });
  });
}

function renderChangelogBody(body, currentVersion) {
  renderUpdateHowto(body, currentVersion);
  const changelog = getChangelog();
  const versions = Object.keys(changelog)
    .filter((v) => changelog[v]?.length)
    .sort((a, b) => compareVersions(b, a));

  if (!versions.length) {
    body.createEl("p", { text: "暂无更新记录。", cls: "bc-update-subtitle" });
    return;
  }

  for (const ver of versions) {
    const items = changelog[ver];
    if (!items?.length) continue;
    const isLatest = ver === currentVersion;
    const highlightsMap = typeof PLUGIN_CHANGELOG_HIGHLIGHTS !== "undefined" && PLUGIN_CHANGELOG_HIGHLIGHTS
      ? PLUGIN_CHANGELOG_HIGHLIGHTS
      : {};
    const highlightItems = isLatest && highlightsMap[ver]?.length ? highlightsMap[ver] : items;
    const block = body.createDiv({
      cls: `bc-update-version${isLatest ? " is-open is-latest" : ""}`,
    });
    const head = block.createDiv({ cls: "bc-update-version-head" });
    head.createSpan({
      text: isLatest ? `✨ 本次更新 · v${ver}` : `v${ver}`,
    });
    head.createSpan({ cls: "bc-update-version-chevron", text: "›" });
    const content = block.createDiv({ cls: "bc-update-version-body" });
    const list = content.createEl("ul", { cls: "bc-update-list" });
    highlightItems.forEach((note, idx) => {
      const item = list.createEl("li", { cls: "bc-update-item" });
      item.createSpan({ cls: "bc-update-num", text: String(idx + 1) });
      item.createSpan({ text: note });
    });
    if (isLatest && items.length > highlightItems.length) {
      const more = content.createEl("details", { cls: "bc-update-full-log" });
      more.createEl("summary", { text: "完整更新记录" });
      const fullList = more.createEl("ul", { cls: "bc-update-list" });
      items.forEach((note, idx) => {
        const item = fullList.createEl("li", { cls: "bc-update-item" });
        item.createSpan({ cls: "bc-update-num", text: String(idx + 1) });
        item.createSpan({ text: note });
      });
    }
    if (!isLatest) {
      head.onclick = () => {
        block.toggleClass("is-open", !block.hasClass("is-open"));
      };
    }
  }
}

function getTopOverlayZIndex() {
  let max = 999999;
  document.querySelectorAll(".plg-overlay").forEach((el) => {
    const raw = el.style.zIndex || window.getComputedStyle(el).zIndex || "0";
    const z = parseInt(raw, 10);
    if (!Number.isNaN(z) && z > max) max = z;
  });
  return max + 30;
}

/** 更新日志 / 使用说明弹窗必须叠在 BrainCore 设置 overlay 之上 */
function elevateUpdateModalLayer(modal) {
  requestAnimationFrame(() => {
    const z = String(getTopOverlayZIndex());
    const container = modal.modalEl.closest(".modal-container");
    const bg = modal.modalEl.closest(".modal-bg");
    if (container) {
      container.addClass("bc-update-modal-host");
      container.style.zIndex = z;
    }
    if (bg) {
      bg.addClass("bc-update-modal-bg");
      bg.style.zIndex = z;
    }
  });
}

function needsUpdateNotice(lastSeen, current) {
  const seen = String(lastSeen || "").trim();
  const cur = String(current || "").trim();
  if (!cur) return false;
  if (!seen) return true;
  return compareVersions(seen, cur) < 0;
}

function showUpdateNoticeModal(app, plugin, options = {}) {
  try {
    const versionSemver = getPluginVersionSemver();
    if (!options.force && !needsUpdateNotice(plugin.settings.lastSeenVersion, versionSemver)) return;

    injectUpdateNoticeStyles();

    const modal = new Modal(app);
    addClasses(modal.modalEl, "lifeos-modal", "bc-update-modal");
    modal.titleEl.hide();
    modal.contentEl.empty();

    const wrap = modal.contentEl.createDiv({ cls: "bc-update-wrap" });
    const hero = wrap.createDiv({ cls: "bc-update-hero" });
    renderUpdateNoticeHero(hero);

    const body = wrap.createDiv({ cls: "bc-update-body" });
    renderChangelogBody(body, versionSemver);

    const foot = wrap.createDiv({ cls: "bc-update-foot" });
    const btn = foot.createEl("button", { text: "知道了，开始使用" });
    addClasses(btn, "lifeos-modal-primary", "bc-update-btn");
    btn.onclick = () => {
      plugin.settings.lastSeenVersion = versionSemver;
      void plugin.saveSettings();
      modal.close();
      if (typeof options.onDismiss === "function") options.onDismiss();
    };

    modal.open();
    elevateLifeOsUpdateModal(modal);
    if (typeof elevateUpdateModalLayer === "function") elevateUpdateModalLayer(modal);
  } catch (err) {
    console.error("[LifeOS] showUpdateNoticeModal failed", err);
    try { new Notice("无法打开更新日志，请重试或重启 Obsidian"); } catch (_) { /* ignore */ }
  }
}
