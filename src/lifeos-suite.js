const LIFEOS_PLUGIN_CATALOG = [
  {
    id: "plain-ledger",
    name: "PlainLedger",
    intro: "专为 Obsidian 开发的记账软件",
    philosophy: "记账不必离开笔记——PlainLedger 把账单、分类、订阅规则保存在 Obsidian 库内，随 iCloud / Git 同步，和日记、复盘同屏共存",
    price: "¥39.9",
    repoUrl: "https://github.com/xileshuo/plain-ledger-obsidian",
  },
  {
    id: "jinianri",
    name: "纪念日",
    intro: "专为 Obsidian 开发的纪念日管理软件",
    philosophy: "记录生日、恋爱、婚姻等重要日期，自动计算「已过时长」与「距离下次还有几天」，支持三档提醒与 iCal 导出",
    price: "¥29.9",
    repoUrl: "https://github.com/xileshuo/jinianri",
  },
  {
    id: "braincore-lifeos",
    name: "BrainCore LifeOS",
    intro: "专为 Obsidian 开发的生活管理控制台",
    philosophy: "Obsidian 知识库的「核心呼吸机」，它由 7 大模块组成，涵盖了时间感知、极速收集、工作流转、习惯养成与知识内化。一切信息从这里输入，最终也会在这里沉淀",
    price: "¥49.9",
    repoUrl: "https://github.com/xileshuo/BrainCore-LifeOS",
  },
];

const LIFEOS_AUTHOR_NAME = "囍樂";
const LIFEOS_COPYRIGHT = "所有版权©囍樂說。保留所有权利。";
const LIFEOS_AUTHOR_HOMEPAGE = "https://xhslink.com/m/3uOoUHv2rI1";

function getLifeOsVaultKey(app, suffix) {
  const vaultName = app.vault?.getName?.() || "UnknownVault";
  return `lifeos:${vaultName}:${suffix}`;
}

function getEnabledLifeOsPlugins(app) {
  const plugins = app.plugins?.plugins || {};
  return LIFEOS_PLUGIN_CATALOG.filter((p) => {
    const inst =
      plugins[p.id] ||
      (p.id === "braincore-lifeos"
        ? plugins["braincore-lifeos-personal"] || plugins["braincore-dashboard"]
        : null);
    return inst && inst._loaded !== false;
  });
}

function getLifeOsPeerNames(app, selfId) {
  const braincoreFamily = new Set(["braincore-lifeos", "braincore-lifeos-personal", "braincore-dashboard"]);
  return getEnabledLifeOsPlugins(app)
    .filter((p) => {
      if (p.id === selfId) return false;
      if (braincoreFamily.has(selfId) && p.id === "braincore-lifeos") return false;
      return true;
    })
    .map((p) => p.name);
}

function maybeShowLifeOsSuitePrompt(app, selfId, selfName) {
  const peers = getLifeOsPeerNames(app, selfId);
  if (peers.length === 0) return;
  const storageKey = getLifeOsVaultKey(app, "suitePromptSeen");
  try {
    if (localStorage.getItem(storageKey) === "1") return;
  } catch { /* ignore */ }
  const peerText = peers.join("、");
  window.setTimeout(() => {
    try {
      if (localStorage.getItem(storageKey) === "1") return;
    } catch { /* ignore */ }
    const markSeen = () => {
      try { localStorage.setItem(storageKey, "1"); } catch { /* ignore */ }
    };
    try {
      const modal = new Modal(app);
      modal.setTitle("LifeOS 套装");
      modal.contentEl.createEl("p", {
        text: `${selfName} 可与 ${peerText} 并排使用，数据均保存在同一 Obsidian 库内。`,
      });
      const row = modal.contentEl.createDiv({ cls: "modal-button-container" });
      const btn = row.createEl("button", { text: "知道了", cls: "mod-cta", type: "button" });
      btn.onclick = () => {
        markSeen();
        modal.close();
      };
      modal.open();
    } catch (_) {
      new Notice(`${selfName} 可与 ${peerText} 并排使用，数据均保存在同一 Obsidian 库内。`, 8000);
      markSeen();
    }
  }, 2200);
}

function openLifeOsExternalUrl(url) {
  if (!url) return;
  try {
    window.open(url, "_blank");
  } catch (err) {
    console.warn("[LifeOS] open external url", err);
    try { new Notice("无法打开链接"); } catch { /* ignore */ }
  }
}

function injectLifeOsActivationStyles() {
  injectLifeOsSharedStyles();
}

function renderLifeOsActivationPanel(container, config) {
  injectLifeOsActivationStyles();
  container.empty();
  container.addClass("lifeos-act-panel");
  if (config.extraPanelClass) container.addClass(config.extraPanelClass);

  const wrap = container.createDiv({ cls: "lifeos-act-wrap" });
  const card = wrap.createDiv({ cls: "lifeos-act-card" });

  card.createEl("h2", { cls: "lifeos-act-title", text: config.pluginName || "LifeOS" });

  const statusText = typeof config.getStatusText === "function" ? config.getStatusText() : "";
  if (statusText) {
    card.createEl("p", { cls: "lifeos-act-status", text: statusText });
  }

  if (config.philosophy) {
    const phil = card.createEl("p", { cls: "lifeos-act-philosophy lifeos-philosophy-intro", text: config.philosophy });
    phil.addClass("lifeos-philosophy-intro");
  }

  if (config.activationPreviewRows?.length) {
    renderLifeOsActivationPreview(card, config.activationPreviewRows, config.activationPreviewNote);
  }

  if (config.showTrialButton && typeof config.onTrialStart === "function") {
    const trialBtn = card.createEl("button", {
      cls: "lifeos-act-trial-btn mod-cta",
      text: config.trialButtonLabel || "开启试用",
      type: "button",
    });
    trialBtn.onclick = () => void config.onTrialStart();
  }
  if (config.firstRunHint) {
    card.createEl("p", {
      cls: "lifeos-act-philosophy",
      text: config.firstRunHint,
    });
  }

  const fp = typeof config.getFingerprint === "function" ? config.getFingerprint() : "";
  const fpRow = card.createDiv({ cls: "lifeos-act-row" });
  const fpInput = fpRow.createEl("input", {
    type: "text",
    cls: "lifeos-act-input lifeos-act-fp",
    attr: { readonly: "readonly", value: fp, "aria-label": "设备指纹" },
  });
  fpInput.onclick = () => fpInput.select();
  const copyBtn = fpRow.createEl("button", {
    cls: "lifeos-act-btn",
    text: "复制",
    type: "button",
  });
  copyBtn.onclick = () => {
    if (typeof config.onCopyFingerprint === "function") void config.onCopyFingerprint(fp);
  };

  const keyRow = card.createDiv({ cls: "lifeos-act-row" });
  const keyInput = keyRow.createEl("input", {
    type: "text",
    cls: "lifeos-act-input lifeos-act-key",
    attr: { placeholder: "输入激活码", "aria-label": "激活码" },
  });
  if (config.licenseKey) keyInput.value = config.licenseKey;
  const activateBtn = keyRow.createEl("button", {
    cls: "lifeos-act-btn lifeos-act-btn-primary",
    text: config.activateShortLabel || "激活",
    type: "button",
  });

  const msgEl = card.createDiv({ cls: "lifeos-act-msg" });

  const nav = card.createDiv({ cls: "lifeos-act-nav" });
  const row1 = nav.createDiv({ cls: "lifeos-act-nav-row" });
  const row2 = nav.createDiv({ cls: "lifeos-act-nav-row" });
  const mkNav = (parent, label, onClick) => {
    const btn = parent.createEl("button", { cls: "lifeos-act-nav-btn", text: label, type: "button" });
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      void onClick();
    };
  };
  mkNav(row1, "使用说明", () => config.openUsageGuide?.());
  mkNav(row1, "更新日志", () => openLifeOsUpdateNoticeFromPlugin(config.updateNoticeTarget));
  mkNav(row2, "配置", () => config.openSettings?.());

  const activate = () => {
    const key = keyInput.value.trim();
    if (typeof config.onActivate === "function") void config.onActivate(key, msgEl, keyInput);
  };
  activateBtn.onclick = activate;
  keyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") activate();
  });

  return { keyInput, msgEl, fpInput };
}

function injectLifeOsSettingsSharedStyles() {
  injectLifeOsSharedStyles();
}

function injectLifeOsAboutStyles() {
  injectLifeOsSettingsSharedStyles();
}

/** 设置 → 快捷指令 Tab */
function renderBrainCoreShortcutsSettingsPanel(panel, plugin, options = {}) {
  injectLifeOsSettingsSharedStyles();
  panel.empty();
  const wrap = panel.createDiv({ cls: "lifeos-about-panel lifeos-settings-grid" });
  const block = wrap.createDiv({ cls: "lifeos-settings-block" });
  new Setting(block).setName("快捷指令（iOS）").setHeading();
  block.createEl("p", {
    cls: "lifeos-settings-desc",
    text: "部署：在你的 iPhone 上打开「快捷指令」App：新建→「打开 URL」→粘贴链接→添加到主屏幕（具体可见使用指南）",
  });
  block.createEl("p", {
    cls: "lifeos-settings-desc",
    text: "使用：点击快捷指令，可快速打开捕捉面板；当然你也可以在 iPhone 里配置：设置→无障碍→触控→轻点背面→该快捷指令",
  });

  const helpRows = block.createDiv();
  const guideRow = helpRows.createDiv({ cls: "lifeos-about-link-row" });
  guideRow.createSpan({ text: "快捷指令使用说明" });
  const guideBtn = guideRow.createEl("button", { cls: "lifeos-act-btn", text: "打开", type: "button" });
  guideBtn.onclick = () => {
    if (typeof options.openShortcutsGuide === "function") void options.openShortcutsGuide();
  };

  const copyShortcutUrl = async (url) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        new Notice("链接已复制");
        return;
      }
    } catch (_) { /* fall through */ }
    new Notice("请手动全选复制链接");
  };
  const quickUrl = "obsidian://braincore?action=quick";
  block.createEl("p", { cls: "lifeos-about-meta", text: "快速面板链接" });
  const row = block.createDiv({ cls: "lifeos-act-row" });
  const input = row.createEl("input", {
    type: "text",
    cls: "lifeos-act-input",
    attr: { readonly: "readonly", value: quickUrl, "aria-label": "快速面板链接" },
  });
  input.onclick = () => input.select();
  const btn = row.createEl("button", { cls: "lifeos-act-btn", text: "复制", type: "button" });
  btn.onclick = () => void copyShortcutUrl(quickUrl);
  // 手机端强制输入与复制同高对齐
  [input, btn].forEach((el) => {
    el.style.setProperty("height", "36px", "important");
    el.style.setProperty("min-height", "36px", "important");
    el.style.setProperty("max-height", "36px", "important");
    el.style.setProperty("line-height", "36px", "important");
    el.style.setProperty("box-sizing", "border-box", "important");
  });
  input.style.setProperty("padding", "0 10px", "important");
  row.style.setProperty("align-items", "center", "important");
}

const LIFEOS_SUITE_INTRO_BASENAME = "BrainCore LifeOS三款插件介绍、使用说明";

async function openLifeOsSuiteIntroNote(plugin) {
  try {
    const files = plugin.app?.vault?.getMarkdownFiles?.() || [];
    const hits = files.filter((f) => f.basename === LIFEOS_SUITE_INTRO_BASENAME);
    const file = hits.find((f) => String(f.path || "").startsWith("使用说明（看完可删）/"))
      || hits[0]
      || plugin.app.vault.getAbstractFileByPath(`使用说明（看完可删）/${LIFEOS_SUITE_INTRO_BASENAME}.md`)
      || plugin.app.vault.getAbstractFileByPath(`${LIFEOS_SUITE_INTRO_BASENAME}.md`);
    if (!file) {
      new Notice("库内未找到《BrainCore LifeOS三款插件介绍、使用说明》");
      return;
    }
    const leaf = plugin.app.workspace.getLeaf("tab");
    await leaf.openFile(file);
    plugin.app.workspace.revealLeaf(leaf);
  } catch (_) {
    try { new Notice("无法打开三款插件总介绍"); } catch (e) { /* ignore */ }
  }
}

function renderLifeOsAboutPanel(panel, plugin, options = {}) {
  injectLifeOsAboutStyles();
  panel.empty();
  const wrap = panel.createDiv({ cls: "lifeos-about-panel lifeos-settings-grid" });

  const versionBlock = wrap.createDiv({ cls: "lifeos-settings-block" });
  new Setting(versionBlock).setName("版本").setHeading();
  const versionText = typeof formatLifeOsVersionLine === "function"
    ? formatLifeOsVersionLine(plugin?.manifest?.version || (typeof PLUGIN_VERSION === "string" ? PLUGIN_VERSION : ""), typeof getEditionDisplayName === "function" ? getEditionDisplayName() : "")
    : `v${plugin?.manifest?.version || ""}`;
  versionBlock.createEl("p", { cls: "lifeos-about-meta", text: versionText });

  const helpBlock = wrap.createDiv({ cls: "lifeos-settings-block" });
  new Setting(helpBlock).setName("文档").setHeading();
  const helpRows = helpBlock.createDiv();
  const addLinkRow = (parent, label, onClick) => {
    const row = parent.createDiv({ cls: "lifeos-about-link-row" });
    row.createSpan({ text: label });
    const btn = row.createEl("button", { text: "打开", type: "button" });
    btn.onclick = () => void onClick();
  };
  addLinkRow(helpRows, "使用说明", () => {
    if (typeof options.openUsageGuide === "function") void options.openUsageGuide();
  });
  addLinkRow(helpRows, "三款插件总介绍", () => void openLifeOsSuiteIntroNote(plugin));
  addLinkRow(helpRows, "更新日志", () => openLifeOsUpdateNoticeFromPlugin(plugin));

  const retired = Array.isArray(options.retiredFeatures) ? options.retiredFeatures.filter(Boolean) : [];
  if (retired.length) {
    const retiredBlock = wrap.createDiv({ cls: "lifeos-settings-block" });
    new Setting(retiredBlock).setName("已下线功能").setHeading();
    retiredBlock.createEl("p", {
      cls: "lifeos-about-meta",
      text: options.retiredNote || "以下能力已从插件里移除，不用再找入口；已有笔记文件不受影响。",
    });
    const list = retiredBlock.createEl("ul", { cls: "lifeos-about-retired" });
    retired.forEach((line) => list.createEl("li", { text: line }));
  }

  const authorBlock = wrap.createDiv({ cls: "lifeos-settings-block" });
  new Setting(authorBlock).setName("作者").setHeading();
  authorBlock.createEl("p", { cls: "lifeos-about-meta", text: `作者：${LIFEOS_AUTHOR_NAME}` });
  authorBlock.createEl("p", { cls: "lifeos-about-meta", text: `版权信息：${LIFEOS_COPYRIGHT}` });
  const homeRow = authorBlock.createDiv({ cls: "lifeos-about-home-row" });
  homeRow.createSpan({ text: "主页：" });
  const homeLink = homeRow.createEl("a", {
    cls: "lifeos-about-home-link",
    text: LIFEOS_AUTHOR_HOMEPAGE,
    href: LIFEOS_AUTHOR_HOMEPAGE,
  });
  homeLink.onclick = (e) => {
    e.preventDefault();
    openLifeOsExternalUrl(LIFEOS_AUTHOR_HOMEPAGE);
  };

  const worksBlock = wrap.createDiv({ cls: "lifeos-settings-block" });
  new Setting(worksBlock).setName("所有作品").setHeading();
  const enabled = getEnabledLifeOsPlugins(plugin.app);
  const selfId = plugin?.manifest?.id || options.selfId || "";
  worksBlock.createEl("p", {
    cls: "lifeos-suite-badge",
    text: `LifeOS 套装已安装 ${enabled.length}/3`,
  });
  const works = worksBlock.createDiv({ cls: "lifeos-about-works" });
  const braincoreFamily = new Set(["braincore-lifeos", "braincore-lifeos-personal", "braincore-dashboard"]);
  LIFEOS_PLUGIN_CATALOG.forEach((item) => {
    const itemEl = works.createDiv({ cls: "lifeos-about-work-item" });
    itemEl.createEl("p", { cls: "lifeos-about-work-name", text: item.name });
    itemEl.createEl("p", { cls: "lifeos-about-work-intro", text: item.intro });
    if (item.price) {
      itemEl.createEl("p", {
        cls: "lifeos-about-work-price",
        text: `48 小时试用 · ${item.price} 永久激活`,
      });
    }
    if (item.philosophy) {
      itemEl.createEl("p", { cls: "lifeos-about-work-philosophy", text: item.philosophy });
    }
    const actions = itemEl.createDiv({ cls: "lifeos-about-work-actions" });
    const plugins = plugin.app?.plugins?.plugins || {};
    const installed = !!(
      plugins[item.id] ||
      (item.id === "braincore-lifeos" &&
        (plugins["braincore-lifeos-personal"] || plugins["braincore-dashboard"]))
    );
    const isSelf =
      item.id === selfId || (braincoreFamily.has(selfId) && item.id === "braincore-lifeos");
    if (isSelf) {
      actions.createEl("button", { text: "当前插件", type: "button", cls: "is-self" });
    } else if (installed) {
      const targetId =
        item.id === "braincore-lifeos" && plugins["braincore-lifeos-personal"]
          ? "braincore-lifeos-personal"
          : item.id;
      const btn = actions.createEl("button", { text: "打开设置", type: "button" });
      btn.onclick = () => openLifeOsPluginSettings(plugin.app, targetId);
    } else {
      const btn = actions.createEl("button", { text: "去了解", type: "button" });
      btn.onclick = () => {
        if (item.repoUrl) openLifeOsExternalUrl(item.repoUrl);
        else new Notice(`请先在 Obsidian 设置 → 第三方插件 中启用 ${item.name}`);
      };
    }
  });
}

function renderLifeOsLicenseSettingsPanel(panel, config) {
  injectLifeOsSettingsSharedStyles();
  panel.empty();
  const grid = panel.createDiv({ cls: "lifeos-settings-grid" });
  const card = grid.createDiv({ cls: "lifeos-settings-block" });
  new Setting(card).setName("授权激活").setHeading();
  if (config.desc) card.createEl("p", { cls: "lifeos-settings-desc", text: config.desc });
  if (config.trialHint) card.createEl("p", { cls: "lifeos-license-trial-hint", text: config.trialHint });

  const fp = config.getFingerprint?.() || "";
  const fpRow = card.createDiv({ cls: "lifeos-act-row" });
  const fpInput = fpRow.createEl("input", {
    type: "text",
    cls: "lifeos-act-input lifeos-act-fp",
    attr: { readonly: "readonly", value: fp, "aria-label": "设备指纹" },
  });
  fpInput.onclick = () => fpInput.select();
  const copyBtn = fpRow.createEl("button", { cls: "lifeos-act-btn", text: "复制", type: "button" });
  copyBtn.onclick = () => void config.onCopyFingerprint?.(fp);

  let keyValue = config.licenseKey || "";
  const keyRow = card.createDiv({ cls: "lifeos-act-row" });
  const keyInput = keyRow.createEl("input", {
    type: "text",
    cls: "lifeos-act-input lifeos-act-key",
    attr: { placeholder: "输入激活码", "aria-label": "激活码" },
  });
  keyInput.value = keyValue;
  keyInput.addEventListener("input", () => { keyValue = keyInput.value.trim(); });
  const activateBtn = keyRow.createEl("button", {
    cls: "lifeos-act-btn lifeos-act-btn-primary",
    text: "激活",
    type: "button",
  });
  activateBtn.onclick = () => void config.onActivate?.(keyValue.trim());
  keyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") void config.onActivate?.(keyValue.trim());
  });

  if (config.activated) {
    card.createEl("p", { cls: "lifeos-license-status", text: "已激活，永久有效" });
  }
}

function getLifeOsMaxOverlayZIndex() {
  let max = 100000;
  document.querySelectorAll(".modal-container, .modal-bg, .vertical-tab-content, .vertical-tab-header").forEach((el) => {
    const raw = el.style.zIndex || window.getComputedStyle(el).zIndex || "0";
    const z = parseInt(raw, 10);
    if (!Number.isNaN(z) && z > max) max = z;
  });
  return max + 200;
}

function isObsidianSettingsOpen(app) {
  try {
    const setting = app?.setting;
    if (!setting) return false;
    if (setting.activeTab) return true;
    const el = setting.containerEl;
    if (el?.isConnected && el.offsetParent !== null) return true;
  } catch (_) { /* ignore */ }
  for (const c of document.querySelectorAll(".modal-container")) {
    if (c.querySelector(".vertical-tab-content, .vertical-tab-header")) return true;
  }
  return false;
}

function runLifeOsUpdateNotice(plugin) {
  if (!plugin) return false;
  try {
    if (typeof plugin.showUpdateNoticeForce === "function") {
      plugin.showUpdateNoticeForce();
      return true;
    }
    if (typeof plugin.showUpdateNotice === "function") {
      plugin.showUpdateNotice(true);
      return true;
    }
    if (typeof plugin.maybeShowUpdateNotice === "function") {
      plugin.maybeShowUpdateNotice(undefined, true);
      return true;
    }
  } catch (err) {
    console.error("[LifeOS] Failed to open update notice", err);
    try { new Notice("无法打开更新日志，请重试或重启 Obsidian"); } catch (_) { /* ignore */ }
  }
  return false;
}

function openLifeOsUpdateNoticeFromPlugin(plugin) {
  if (!plugin) return;
  const app = plugin.app;
  const open = () => runLifeOsUpdateNotice(plugin);
  if (app && isObsidianSettingsOpen(app)) {
    try { app.setting.close(); } catch (_) { /* ignore */ }
    let tries = 0;
    const poll = () => {
      tries += 1;
      if (!isObsidianSettingsOpen(app) || tries >= 30) {
        open();
        return;
      }
      window.setTimeout(poll, 80);
    };
    window.setTimeout(poll, 80);
    return;
  }
  open();
}

function elevateLifeOsUpdateModal(modal) {
  const apply = () => {
    if (!modal?.modalEl) return;
    const z = String(getLifeOsMaxOverlayZIndex());
    const container = modal.modalEl.closest(".modal-container");
    if (!container) return;
    container.addClass("lifeos-update-modal-host");
    container.style.setProperty("z-index", z, "important");
    const bg = container.querySelector(".modal-bg");
    if (bg) {
      bg.addClass("lifeos-update-modal-bg");
      bg.style.setProperty("z-index", z, "important");
    }
    modal.modalEl.style.setProperty("z-index", z, "important");
  };
  requestAnimationFrame(() => {
    apply();
    requestAnimationFrame(apply);
  });
  window.setTimeout(apply, 50);
  window.setTimeout(apply, 180);
}
