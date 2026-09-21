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
