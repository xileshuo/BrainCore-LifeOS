// ─── BrainCore settings tab layout (align with 纪念日 / BrainCore) ─────────

const BC_SETTINGS_STYLE_ID = "bc-settings-compact-styles-v13";
const BC_MOBILE_TOP_INSET_PX = 41;
const BC_MOBILE_TOP_SPACER_CLASS = "bc-mobile-top-spacer";

function getBcEditionLabel(settings) {
  if (typeof getEditionDisplayName === "function") {
    const n = getEditionDisplayName(settings);
    if (n) return n;
  }
  if (typeof isTrialEdition === "function" && isTrialEdition()) {
    if (settings && settings.licenseActivated) return "公版";
    return "体验版";
  }
  if (typeof PLUGIN_WEEKLY_PROFILE === "string" && PLUGIN_WEEKLY_PROFILE === "commercial") return "公版";
  if (typeof PLUGIN_EDITION === "string" && PLUGIN_EDITION === "public") return "公版";
  return "个人版";
}

function resolveBcSettingsTabFromFocus(focusOpts) {
  if (!focusOpts?.section) return null;
  const map = {
    categories: "categories",
    appearance: "appearance",
    pendingDues: "rules",
    subscription: "rules",
    recurring: "rules",
    globalKeywords: "rules",
  };
  return map[focusOpts.section] || "common";
}

function injectBcSettingsCompactStyles() {
  /* CSS lives in styles.css */
}

function appendBcMobileTopSpacer(containerEl) {
  containerEl.createDiv({ cls: BC_MOBILE_TOP_SPACER_CLASS });
}

function applyBcMobileSettingsLayout(containerEl, app) {
  document.querySelectorAll(".bc-settings-mobile-host").forEach((el) => {
    el.removeClass("bc-settings-mobile-host");
  });
  const isMobile = app?.isMobile || Platform.isMobileApp;
  if (!isMobile) return;
  injectBcSettingsCompactStyles();
  const host = containerEl.closest(".vertical-tab-content")
    || containerEl.closest(".vertical-tab-content-container")
    || containerEl.parentElement;
  host?.addClass("bc-settings-mobile-host");
  appendBcMobileTopSpacer(containerEl);
}

function createBcSettingsBlock(parent, title, desc) {
  const block = parent.createDiv({ cls: "bc-settings-block" });
  new Setting(block).setName(title).setHeading();
  if (desc) {
    block.createEl("p", { cls: "setting-item-description", text: desc });
  }
  return block;
}

function addBcSubgroupTitle(block, title) {
  new Setting(block).setName(title).setHeading().setClass("bc-settings-subgroup");
}

function createBcCollapsibleBlock(parent, plugin, sectionId, title, desc, buildBody, opts = {}) {
  const uiSections = plugin.settings.uiState?.settingsSections || {};
  let expanded = uiSections[sectionId];
  if (expanded === undefined) expanded = opts.defaultExpanded !== false;
  if (opts.forceOpen) expanded = true;

  const block = parent.createDiv({
    cls: "bc-settings-block bc-settings-rich-block bc-settings-block-collapsible" + (expanded ? " open" : ""),
  });
  block.setAttr("data-settings-section", sectionId);

  const head = block.createDiv({ cls: "bc-settings-block-head clickable" });
  head.setAttr("role", "button");
  head.setAttr("tabindex", "0");
  head.setAttr("aria-expanded", expanded ? "true" : "false");

  const titleRow = head.createDiv({ cls: "bc-settings-block-title-row" });
  new Setting(titleRow).setName(title).setHeading();
  if (desc) head.createEl("p", { cls: "setting-item-description", text: desc });

  const body = block.createDiv({
    cls: "bc-settings-block-body" + (expanded ? "" : " hidden"),
  });
  buildBody(body);

  const sync = (open) => {
    expanded = open;
    block.toggleClass("open", open);
    body.toggleClass("hidden", !open);
    head.setAttr("aria-expanded", open ? "true" : "false");
  };

  const toggle = () => {
    sync(!expanded);
    plugin.settings.uiState = plugin.settings.uiState || {};
    plugin.settings.uiState.settingsSections = plugin.settings.uiState.settingsSections || {};
    plugin.settings.uiState.settingsSections[sectionId] = expanded;
    plugin.saveSettings();
  };
  head.addEventListener("click", toggle);
  head.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });

  return block;
}

function bindBcSettingsTabKeyboard(tabBar, showTab) {
  const buttons = () => Array.from(tabBar.querySelectorAll('[role="tab"]'));
  const syncTabIndex = (id) => {
    buttons().forEach((btn) => {
      btn.tabIndex = btn.dataset.tab === id ? 0 : -1;
    });
  };
  const wrappedShow = (id) => {
    showTab(id);
    syncTabIndex(id);
  };
  tabBar.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    const list = buttons();
    if (!list.length) return;
    const current = Math.max(0, list.findIndex((btn) => btn.tabIndex === 0));
    let next = current;
    if (e.key === "ArrowRight") next = (current + 1) % list.length;
    if (e.key === "ArrowLeft") next = (current - 1 + list.length) % list.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = list.length - 1;
    e.preventDefault();
    const id = list[next].dataset.tab;
    wrappedShow(id);
    list[next].focus();
  });
  return { showTab: wrappedShow, syncTabIndex };
}

function buildBcSettingsTabs(container, plugin, tabDefs, initialTabId) {
  const tabBar = container.createDiv({ cls: "bc-settings-tab-bar" });
  if (tabDefs.length >= 5) tabBar.addClass("is-many-tabs");
  tabBar.setAttr("role", "tablist");
  tabBar.setAttr("aria-label", "BrainCore 设置");

  const panelsWrap = container.createDiv({ cls: "bc-settings-panels" });
  const panels = {};
  tabDefs.forEach((t) => {
    panels[t.id] = panelsWrap.createDiv({
      cls: "bc-settings-panel",
      attr: {
        role: "tabpanel",
        id: `bc-panel-${t.id}`,
        "aria-labelledby": `bc-tab-${t.id}`,
      },
    });
    panels[t.id].setCssStyles({ display: "none" });
  });

  const showTab = (id) => {
    tabDefs.forEach((t) => {
      panels[t.id].setCssStyles({ display: t.id === id ? "block" : "none" });
    });
    tabBar.querySelectorAll("button").forEach((btn) => {
      const active = btn.dataset.tab === id;
      btn.toggleClass("mod-cta", active);
      btn.setAttr("aria-selected", active ? "true" : "false");
    });
  };

  const keyboard = bindBcSettingsTabKeyboard(tabBar, showTab);

  tabDefs.forEach((t) => {
    const btn = tabBar.createEl("button", { text: t.label, type: "button" });
    btn.dataset.tab = t.id;
    btn.setAttr("role", "tab");
    btn.setAttr("id", `bc-tab-${t.id}`);
    btn.setAttr("aria-controls", `bc-panel-${t.id}`);
    btn.setAttr("aria-selected", "false");
    btn.addEventListener("click", () => keyboard.showTab(t.id));
  });

  const startId = initialTabId && tabDefs.some((t) => t.id === initialTabId)
    ? initialTabId
    : tabDefs[0]?.id;
  if (startId) keyboard.showTab(startId);

  return { tabBar, panels, showTab: keyboard.showTab };
}
