const LIFEOS_UI_STYLE_ID = "lifeos-ui-shared-styles-v9";
const LIFEOS_MOBILE_TOP_INSET_PX = 41;
const LIFEOS_RELEASE = "2026.08.13";

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

function getEditionDisplayName() {
  // 界面只保留三档：体验版 / 公版 / 个人版（公版含需激活与免激活）
  if (typeof isTrialEdition === "function" && isTrialEdition()) return "体验版";
  if (typeof PLUGIN_WEEKLY_PROFILE === "string" && PLUGIN_WEEKLY_PROFILE === "commercial") return "公版";
  if (typeof PLUGIN_EDITION === "string" && PLUGIN_EDITION === "public") return "公版";
  if (typeof PLUGIN_WEEKLY_PROFILE === "string" && PLUGIN_WEEKLY_PROFILE === "personal") return "个人版";
  if (typeof PLUGIN_EDITION === "string" && PLUGIN_EDITION === "personal") return "个人版";
  return "";
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
  return formatLifeOsVersionLine(v, getEditionDisplayName());
}

function injectLifeOsSharedStyles() {
  if (document.getElementById(LIFEOS_UI_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = LIFEOS_UI_STYLE_ID;
  style.textContent = `
:root {
  --lifeos-accent: #b48246;
  --lifeos-accent-soft: rgba(180, 130, 70, 0.12);
  --lifeos-accent-border: rgba(180, 130, 70, 0.28);
  --lifeos-on-accent: #fff;
  --lifeos-error: var(--text-error, #c44);
  --lifeos-mobile-top-inset: ${LIFEOS_MOBILE_TOP_INSET_PX}px;
  --lifeos-sidebar-inset: 10px;
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
  width: 32px;
  height: 32px;
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
/* LifeOS sidebar inset — shared PlainLedger / 纪念日 / BrainCore (build-injected) */
.lifeos-sidebar-inset {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  padding: var(--lifeos-sidebar-inset, 10px) var(--lifeos-sidebar-inset, 10px) 0;
}
.lifeos-sidebar-inset > .plg-page-split,
.lifeos-sidebar-inset > .jnr-card-list,
.lifeos-sidebar-inset .jnr-card-list {
  flex: 1;
  min-height: 0;
  width: 100%;
  margin: 0;
  padding: 0 0 28px;
  box-sizing: border-box;
}
.lifeos-sidebar-inset > .jnr-card-list,
.lifeos-sidebar-inset .jnr-dashboard-content {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.lifeos-sidebar-inset .jnr-dashboard-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.lifeos-sidebar-inset .jnr-dashboard-content > .jnr-card-list,
.lifeos-sidebar-inset .jnr-dashboard-content > .jnr-timeline,
.lifeos-sidebar-inset .jnr-dashboard-content > .jnr-calendar-view {
  overflow: visible;
  flex: 0 0 auto;
  padding-bottom: 0;
}
.lifeos-sidebar-inset > .jnr-card-list::-webkit-scrollbar,
.lifeos-sidebar-inset .jnr-dashboard-content::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
.sb-container.lifeos-sidebar-inset {
  padding: var(--lifeos-sidebar-inset, 10px) var(--lifeos-sidebar-inset, 10px) 28px;
}
.lifeos-sidebar-inset button,
.lifeos-sidebar-inset .clickable-icon,
.lifeos-sidebar-inset .lifeos-act-nav-btn,
.lifeos-sidebar-inset .lifeos-act-nav-row button {
  transition: background-color 150ms ease, color 150ms ease, opacity 150ms ease, border-color 150ms ease;
}
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
@media (min-width: 640px) {
  .lifeos-about-works {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    align-items: stretch;
  }
  .lifeos-about-work-item { height: 100%; box-sizing: border-box; }
}
.lifeos-settings-version {
  margin: -6px 0 12px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-muted);
}
.lifeos-about-work-actions { display: flex; gap: 8px; margin-top: 6px; flex-wrap: wrap; }
.lifeos-about-work-actions button {
  border-radius: 8px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--background-modifier-border);
  background: var(--background-modifier-hover);
  color: var(--text-muted);
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
}
`;
  document.head.appendChild(style);
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

/** BrainCore 更新日志（按版本） */
const PLUGIN_CHANGELOG = {
    "3.2.4": [
        "省电：侧栏不可见 / 系统休眠时停定时器；收窄文件监听；进度条慢刷、统计快刷（分路防抖）",
        "安装目录统一为 plugins/braincore-lifeos（manifest.id 同步；自动迁移旧目录设置/激活）",
        "周工作：打开控制台时确保本周 Work 文件存在；跨周无遗留待办也会自动创建空周模板",
        "设置：Tab「习惯」改名为「打卡」；打卡图标输入格加宽至 70px",
        "设置：新增「快捷指令」Tab（部署/使用说明 + 复制 quick 链接 + 打开使用指南）",
        "快捷指令：支持主屏幕入口与 iPhone「轻点背面」绑定同一快捷指令",
        "快捷指令：协议尽早注册；快速面板先渲染捕捉区，待办/打卡异步补齐",
        "文档：快捷指令使用指南去重标题，补充部署/使用与背面轻点步骤",
    ],
    "3.2.3": [
        "iOS：主屏推荐单一入口打开快速面板（obsidian://braincore?action=quick）",
        "快捷指令：用「打开 URL」即可，不必再套「打开 App → Obsidian」",
        "设置 → 关于：新增快捷指令布置区，一键复制 deep link",
        "文档：使用说明补充 iOS 快捷指令；库内增加《BrainCore快捷指令使用指南》",
    ],
    "3.2.2": [
        "控制台：问候/天气、年月周日进度与每日金句合并为顶部沉浸式 Hero（去底去边）",
        "金句：点击 Hero 区域切换下一条；每小时仍按种子自动轮换",
        "界面：模块间距收紧；去掉「轻触切换」提示文案",
        "体验版试用时长改为 48 小时",
        "新增公版（免激活）安装包",
    ],
    "3.2.1": [
        "剪藏：保存前弹出确认面板（对齐素材）——改名、分类、标签、可选感悟",
        "剪藏：默认分类 科技/人文/娱乐/AI/学习，支持增补并写入设置",
        "剪藏：标签写入 frontmatter tags；感悟另存读&写/剪藏感悟 并双向链接",
        "设置：新增剪藏感悟路径与分类列表管理",
        "剪藏/素材确认面板：疏朗间距；素材日志标题输入移到说明下方；去掉「未分类」",
        "统计：今日累计弹窗按「新增 / 删除」分区展示（有增有删不再只显示一侧）",
        "设置：Tab 选中态统一 accent 36% 填充（对齐 PlainLedger 总年月周）",
        "空状态：待办/习惯改用 lifeos-empty-state（平静文案 + CTA）；主 CTA 字色 --lifeos-on-accent",
        "微交互：设置按压缩放 + 控制台/习惯格/捕捉/闪念脉冲尊重 prefers-reduced-motion",
        "剪藏：分类 chip 选中态改为 accent 36%（与设置 Tab 一致）",
        "周工作：标题与导航字色改用主题变量（暗色不再硬编码 #555 / #6b5b4d）",
        "文案：设置标题徽章统一为「体验版」（个人版 / 公版 / 体验版）",
    ],
    "3.2.0": [
        "控制台：待办勾选立刻从列表移除，再异步写入；找不到任务时刷新恢复",
        "控制台：习惯打卡恢复 HABIT 表头与下午三点前格距/天数列布局",
        "控制台：打卡「今天」日期与格子玫瑰色描边反馈（对齐 Mac）",
        "LifeOS：控制台强调色统一 --lifeos-accent；模块间点线改为间距分区（sb-module-gap）",
        "控制台：问候/天气/进度字/快捷字/金句等恢复上一版棕灰 #6b5b4d（进度条与勾选仍跟主题 text-accent）",
        "控制台：四键底/勾选框/Total 数字配色恢复 v3.1.0；待办勾选按正文模糊匹配，减少「找不到该任务」",
        "手机捕捉：分类键最小高度 30px（字号 11px）",
        "手机捕捉：软键盘抬起时压缩输入区并露出分类/发送；关闭钮 44px 命中区；分类键加大",
        "手机设置：Tab 自动换行（约每行 3 个），避免解锁后挤成一团",
        "手机素材弹窗：对齐捕捉顶栏布局（bc-mobile-force-top）",
        "手机捕捉：在避开状态栏安全区前提下收紧顶栏与关闭钮；七分类两行（4+3）",
        "首次见面：一键建库（Inbox / Work / Boxes / 读&写 / 归档）并可选播种默认习惯",
        "设置：openBrainCoreSettings({ tab }) 深链直达习惯 / 路径 / 模块 / 数据 / 关于 / 授权",
        "捕捉：默认展示工作 / 生活 / 闪念，「更多」展开随笔 / 剪藏 / 素材 / 草稿",
        "LifeOS：作者主页 authorUrl 三插件统一为同一链接",
        "习惯空状态：CTA 直达设置「习惯」页",
        "暗色模式：控制台问候/快捷/金句等棕色字改为跟随主题；强调按钮字色对比可读",
        "设置：未激活时改为「授权 · 数据 · 关于」，与 PlainLedger / 纪念日一致；数据页可看更新日志与 data.json 路径",
        "进度条：悬停展示已过比例 / 剩余时间 / 起止区间；Total 大数字恢复悬停构成比例提示",
        "Dashboard：标签点击与侧边栏对齐（打开库内标签列表，不再空搜 tag:#）",
        "统计：Total 大数字恢复右侧对齐（与 Total 同行）；去掉假可点样式（仅「今日累计」可点）",
        "反馈：残留 ❌✅📤💡⚠️ Notice 前缀清理为 bcNotice* 纯文案",
        "文案：试用欢迎弹窗统一为「体验版」",
        "统计：标签列表改为仅弹窗（带过滤），不再与系统标签面板双开；点击仍搜 tag:#具体名",
        "捕捉：标签「新建」项套用 lifeos-accent 品牌样式",
        "统计：点击「标签」改为打开库内标签列表（并可唤起系统标签面板）；修复原先搜索 tag:# 恒为空结果、看起来像无响应",
        "捕捉：标签选择器首项为「新建」，其后为库内系统标签；与 Obsidian metadataCache 同源",
        "LifeOS：三插件视觉/交互全面对齐——强调色统一改用 --lifeos-accent（Tab 选中、状态行、关于页链接）",
        "设置：未激活时锁定「路径/模块/习惯」三个 Tab，仅保留「授权」「数据」「关于」，与 PlainLedger / 纪念日一致",
        "设置：Tab 超过 4 个自动换行（is-many-tabs），锁定提示补齐 2em 缩进",
        "修复：更新弹窗品牌残留（曾误用 PlainLedger 命名与样式前缀 plg-update-*，现改为 bc-update-*）",
        "版本：显示名统一为「公版」「24 小时体验版」，不再使用「商业版」「试用版」",
        "试用横幅：点击行为统一跳转到「授权」设置页（原为刷新控制台，行为不一致）",
        "反馈：Notice 提示音统一去除表情符号前缀，与 PlainLedger / 纪念日文案口吻一致",
        "微交互：设置页按钮补齐按压态反馈（轻微缩放）",
        "空状态：任务/习惯空状态去除斜体低透明度样式，视觉权重与其余两插件对齐",
        "入口：Ribbon 图标文案改为「打开 BrainCore」",
        "清理：移除 main.source.js 中已由构建流程替换的更新弹窗死代码",
    ],
    "3.1.0": [
        "LifeOS：manifest 与 PLUGIN_VERSION 统一为 v3.1.0；出包日期随构建时间更新",
        "LifeOS：侧栏 inset 规则抽取为共享 CSS，三插件构建时注入",
        "设置：Tab 布局抽取 bc-settings-tab-layout，对齐 PlainLedger 层级与 76px 标签宽",
        "清理：移除内联 bc-settings-compact-styles-v259，改构建注入；移除 LifeOS 插件族页脚",
        "文档：使用说明补充版本包命名说明",
    ],
    "3.0.8": [
        "剪藏：文件名改为原始标题（去掉日期时间前缀）",
        "剪藏：优先按原网页正文保存；微信公众号强化 #js_content / data-src 提取，减少误用 Link Embed 卡片",
    ],
    "3.0.7": [
        "修复：素材捕捉不再写入文件墙.md（避免打乱 DataviewJS 看板）；可选备注改写 Boxes/素材日志.md",
    ],
    "3.0.6": [
        "修复：设置 → About → 更新日志「打开」无反应（addClasses 未打包进 BrainCore 构建）",
    ],
    "3.0.5": [
        "修复：插件加载失败（USAGE_GUIDE 重复声明）",
        "设置：版本号并入标题行；首次见面卡桌面横向布局",
        "LifeOS：About「打开设置」跳转修复",
        "文档：使用说明库内 .md 模式",
    ],
    "3.0.4": [
        "LifeOS：About 套装、使用说明库内 .md",
        "首次见面卡、习惯空状态",
    ],
    "3.0.3": [
        "LifeOS：首次见面卡、习惯空状态、About 套装 X/3、试用 welcome 首次开控制台",
        "无障碍：设置 Tab ARIA；天气区 aria-live",
        "文档：README / Design Tokens 同步至 3.0.3",
    ],
    "3.0.2": [
        "LifeOS：三插件版本统一至 3.0.2",
    ],
    "3.0.1": [
        "关于：所有作品理念行与简介同字号同色，去掉句末句号",
    ],
    "3.0.0": [
        "LifeOS 3.0 统一发布：修复侧边栏卡在「正在刷新」；分级 refresh（light / tasks / stats / full）",
        "性能：周迁移改为后台执行不阻塞首屏；stats/tasks 增量 DOM 补丁；moment 降级兜底",
        "关于：所有作品展示简介 + 理念双行；移除底部插件互链",
    ],
    "2.3.0": [
        "LifeOS 2026.07.16 统一发布：性能优化（金句缓存短路、待办统计去重、库文件列表缓存）",
        "启动：移除自动弹窗，仅保留试用到期提醒",
        "文档：使用说明对齐捕捉/文件/闪念/归档四键；天气 open-meteo / wttr.in 双接口策略",
    ],
    "2.2.77": [
        "天气：open-meteo 失败时自动降级 wttr.in；定位改 ipwho / ipinfo / geolocation-db 三源轮询",
        "修复：失败状态不再写入缓存，避免长期显示「天气暂不可用」",
    ],
    "2.2.76": [
        "修复：天气失败不再写入 1 小时缓存，避免长期显示「天气暂不可用」",
        "修复：天气/定位请求改用 Obsidian requestUrl，超时放宽至 6 秒",
    ],
    "2.2.75": [
        "API：BrainCoreAPI.getStats / runStatAction，Dashboard 统计六格可映射侧边栏缓存",
        "性能：侧边栏 renderDashboard 写入 sb-stats-cache-f，待办数刷新时同步更新 tasks",
    ],
    "2.2.74": [
        "天气：打开时先用默认经纬度显示，不再长时间停在「定位中」",
        "天气：ipapi 网络定位改为每 4 小时最多一次，失败继续用默认坐标",
        "天气：结果缓存 1 小时；设置 / 使用说明文案与上述逻辑同步",
    ],
    "2.2.73": [
        "修复：回退 v2.2.71/72 周工作列表布局覆盖，恢复与 v2.2.64 一致的阅读/编辑排布（兼容 Minimal 主题）",
        "保留：阅读视图待办/有序列表文字颜色修正；捕捉优先填充模板空待办行",
    ],
    "2.2.72": [
        "修复：周工作阅读视图待办/有序列表与色块标题左缘对齐（10px）",
        "优化：捕捉写入工作待办时优先填充模板空待办行，填满后再追加",
    ],
    "2.2.71": [
        "修复：周工作「本周待办」在阅读视图待办文字不可见（Minimal 等主题兼容）",
        "恢复：侧边栏第二按钮「文件」一键打开文件墙（v2.2.64 改动回并源码）",
    ],
    "2.2.70": [
        "三插件统一 .lifeos-sidebar-inset 单层 10px 留白",
    ],
    "2.2.69": [
        "修复：试用提示条边距独立设置，不影响控制台主布局",
    ],
    "2.2.68": [
        "侧边栏：主界面与试用提示统一上/左/右 10px 留白；提示文案首行缩进",
    ],
    "2.2.67": [
        "架构：更新日志 / 激活页 / 关于页与 PlainLedger、纪念日统一为独立 LifeOS 模块（业务逻辑不变）",
    ],
    "2.2.66": [
        "修复：设置页 / 侧边栏点击「更新日志」无反应（关闭设置层 + 动态 z-index 置顶）",
    ],
    "2.2.65": [
        "修复：侧边栏激活页「更新日志」点击无响应（弹窗 z-index 1000100 + 统一入口）",
        "激活页：底部导航改为两行（使用说明·更新日志 / 配置）",
        "设置：授权 Tab 统一 UI（指纹/激活同行）；关于页字体层级与「主页：」对齐",
    ],
    "2.2.64": [
        "修复：侧边栏激活页点击更新日志无响应（弹窗层级）",
        "激活页 UI 统一：移除示意预览与返回控制台；指纹/激活同行、三链一行",
        "关于页：所有作品展示简介；作者主页合并至作者栏",
    ],
    "2.2.63": [
        "体验版：侧边栏激活页增加「开启试用」；统一使用说明 / 更新日志入口，取消启动弹窗",
        "设置：新增「关于」Tab（作者、版权、其他作品、作者主页）；更新日志标题补充插件名",
    ],
    "2.2.62": [
        "修复：升级后更新日志弹窗 semver 比对；首次安装使用说明链不再被 lastSeenVersion 阻断",
    ],
    "2.2.61": [
        "移动端设置页去掉重复标题；Obsidian 顶栏统一显示 BrainCore LifeOS（不含版本后缀）",
    ],
    "2.2.60": [
        "体验版：试用弹窗统一 lifeos-modal 样式；恢复首次安装链式打开使用说明",
        "激活页增加 7 大模块价值预览；设置页底部增加 LifeOS 插件族标识",
        "安装第二个 LifeOS 插件时轻提示可并排使用；清理废弃侧边栏抢占代码",
        "统一顶栏 41px 与 LifeOS 主色；更新日志修正过时侧边栏描述",
    ],
    "2.2.59": [
        "捕捉/闪念：桌面弹窗加宽加高且尺寸一致",
        "捕捉：移动端隐藏引用来源，工具栏下移右对齐；闪念移动端同尺寸",
        "设置：移动端顶部下移 39px"
    ],
    "2.2.58": [
        "设置：移动端隐藏重复标题；Tab 三等分/四等分；顶部展示插件理念简介"
    ],
    "2.2.57": [
        "设置：移动端整体下移 38px，避免顶栏与系统状态栏重叠"
    ],
    "2.2.56": [
        "设置：模块/习惯 Tab 字体字号与路径页层级统一"
    ],
    "2.2.55": [
        "设置：卡片标题/分组/行标签统一左对齐，强化字号层级"
    ],
    "2.2.54": [
        "闪念：去掉重复关闭按钮，与捕捉界面共用 Obsidian 默认 × 样式",
        "闪念：移动端顶栏收紧、拖拽逻辑与捕捉一致"
    ],
    "2.2.53": [
        "闪念：关闭按钮移入标题栏与文字对齐，移动端可正常点击",
        "闪念：桌面整行标题栏可拖（右上角关闭区除外），修复拖拽跳动",
        "设置：恢复「跟随 AM」说明；移动端内容区适配安全区"
    ],
    "2.2.52": [
        "闪念：桌面关闭按钮与拖拽分离，点击 X 不再漂移",
        "设置：路径/周模板/天气统一左标签右控件，输入框加底色，去掉冗余提示"
    ],
    "2.2.51": [
        "设置：去掉每行椭圆外框，改为扁平分隔线列表",
        "闪念：恢复桌面尺寸、修复关闭按钮；移动端顶对齐（同捕捉）"
    ],
    "2.2.50": [
        "修复：闪念胶囊独立样式，解决移动端空白弹窗",
        "移动端：设置路径/周模板/模块单行对齐，标签精简，色块改小圆"
    ],
    "2.2.49": [
        "移动端：闪念胶囊顶部留白收紧，发送按钮恢复全宽细长条",
        "移动端：设置页路径/模块对齐修正；习惯打卡格子间距加大"
    ],
    "2.2.48": [
        "设置：习惯行右侧拖拽 + 垃圾桶删除，输入框去嵌套边框",
        "设置：导入/导出独立分区、双列按钮间距与视觉层级优化"
    ],
    "2.2.47": [
        "设置：习惯打卡改为扁平单行布局，拖拽排序 + 文字删除，图标框精简"
    ],
    "2.2.46": [
        "设置：习惯打卡「图标」输入框加宽，避免占位文字被截断"
    ],
    "2.2.45": [
        "捕捉：移动端七大分类恢复单行 7 列布局，减少被键盘遮挡"
    ],
    "2.2.44": [
        "产品：个人版免激活；三版 manifest 名称与包内版本说明区分",
        "引导：首次安装精简链路，激活/试用后再提示打开使用说明",
        "试用：开始试用确认弹窗、到期/剩余 2h/30min 提醒、到期数据安全说明",
        "交互：激活页预填激活码、试用横幅/iOS 面板可内嵌激活、设置页 Tab 化",
        "体验：Notice 分级、授权 Notice 30s 防抖、捕捉分类移动端两行布局与提示"
    ],
    "2.2.43": [
        "引导：使用说明改在主编辑区新标签页打开，不再嵌在设置页内"
    ],
    "2.2.42": [
        "捕捉：移动端工具栏在上、引用来源在下，避免底部重叠",
        "捕捉：修复移动端伸缩按钮无效（改用 class 控制高度）"
    ],
    "2.2.41": [
        "捕捉：修复移动端「引用来源」与工具栏重叠，输入区加高并分两行排布",
        "公版试用：支持 24 小时免费试用 build（到期须激活）"
    ],
    "2.2.40": [
        "引导：升级或初次安装弹出「更新日志」（仅弹窗，不写入库内文件）",
        "引导：初次安装关闭更新日志后，链式打开《使用说明》Markdown",
        "引导：使用说明已展示或 md 被删除后，启动不再自动生成",
        "文案：「操作指南」统一改为「使用说明」"
    ],
    "2.2.39": [
        "统计：Total 标签恢复英文展示（逻辑不变，仍为笔记+图·表+附件）",
        "引导：移除首次使用说明弹窗；启动时不再自动在库根目录生成使用说明文件",
        "引导：「打开操作指南」仍可手动打开完整文档"
    ],
    "2.2.38": [
        "更新日志：标题改为「更新日志」，顶部展示插件理念介绍",
        "更新日志：默认仅展示本次更新，历史版本按版本号折叠，点击可展开"
    ],
    "2.2.37": [
        "捕捉：移动端隐藏 ⌘/Ctrl+Enter 提示；桌面端分类区与提示间距压缩",
        "捕捉：移动端支持「引用来源」归因，与桌面端一致",
        "闪念胶囊：Enter 换行，⌘/Ctrl+Enter 或按钮发送，减少误触",
        "习惯导入：加强 JSON 结构校验，合并写入而非整表覆盖",
        "清理：移除未使用的 startupOpenVersion 与重复方法定义"
    ],
    "2.2.36": [
        "修复：快速面板 / API / Deep Link 授权门禁统一，未激活不可写库",
        "修复：捕捉附件失败时不再写入正文，避免重复条目",
        "修复：跨库周迁移 localStorage 按 vault 隔离",
        "修复：移动端捕捉「草稿历史」菜单无法弹出",
        "修复：闪念胶囊素材与捕捉规则一致；剪藏成功不再双 Notice",
        "体验：更新说明关闭后链式弹出欢迎引导",
        "体验：归档支持最近打开/任意 pane 中的 Markdown 笔记",
        "体验：Work 文件懒创建；跨周迁移仅在确有遗留待办时建文件",
        "体验：闪念胶囊模糊路由需二次 Enter 确认",
        "设置：周工作模板色块行标题与自定义区块名联动显示"
    ],
    "2.2.35": [
        "设置：卡片内文字左缩进、描述换行完整展示，不再贴边或被裁切",
        "商业版周模板：去掉重复的「周工作记录」大标题行",
        "控制台：整页上下无痕滚动，长金句不再遮挡底部统计"
    ],
    "2.2.34": [
        "设置：区块间距恢复 18px，卡片内边距与表单项对齐优化",
        "控制台：习惯区去掉顶部标题行，累计改为紧凑「Xd」格式",
        "激活页：内容垂直居中，「操作指南 / 高级配置」改为两行按钮",
        "控制台：待办总览 ⓘ 图标增强可见性与点击提示",
        "商业版周模板：恢复有序列表结构（目标/每日/复盘/下周计划），去掉提示框"
    ],
    "2.2.33": [
        "设置：周工作模板区块名与色块合并为同一配置区；整体间距与输入框高度压缩",
        "控制台：待办总览改为 ⓘ 悬停/点击提示，去掉副标题行",
        "激活页：统一卡片布局与全宽对齐，修复按钮错位"
    ],
    "2.2.32": [
        "体验：统一激活文案与「复制指纹」按钮；设置页路径分组、激活码失焦校验",
        "体验：Dataview 未开启时控制台部分可用，不再整页阻断",
        "体验：空保存/无 URL 剪藏/未激活入口补反馈；启动弹窗互斥；更新说明默认只看本次",
        "体验：待办总览、闪念胶囊、草稿图标、习惯累计天数等 UI 文案优化",
        "新增：周工作模板四区块名称可在设置中自定义重命名"
    ],
    "2.2.31": [
        "修复：使用说明弹窗仅在点击「知道了」后记为已读",
        "修复：商业版启动同步温和模式，不再 detach 已 pin 的侧边栏插件",
        "修复：个人版补全首次启动使用说明弹窗逻辑"
    ],
    "2.2.30": [
        "启动：仅展开右侧栏并显示 BrainCore，不再关闭其他已 pin 的侧边栏插件",
        "授权：激活码绑定 appId，一次激活永久有效（兼容旧版库名激活码）",
        "引导：首次启动弹出简要使用说明，点击「知道了」后不再自动弹出"
    ],
    "2.2.29": [
        "iOS：braincore 协议支持 capture/capsule/archive/recent/tasks 独立入口",
        "iOS：提供 Scriptable 桌面待办小组件与快捷指令配置方案"
    ],
    "2.2.28": [
        "待办：iOS 快速面板与统计悬停提示统一树形展示子任务",
        "待办：修复快速面板层级排序，子任务正确挂在父任务下"
    ],
    "2.2.27": [
        "待办：修复侧边栏树形缩进被 CSS 覆盖，子任务正确嵌套显示"
    ],
    "2.2.26": [
        "待办：侧边栏按父子树形展示，子任务缩进挂在父任务下方",
        "待办：统计数量仅计顶层，与树形列表口径一致"
    ],
    "2.2.25": [
        "待办：修复子层级任务解析，侧边栏不再显示 - [ ] 原文",
        "待办：子任务按缩进层级展示，勾选支持 Tab/空格缩进"
    ],
    "2.2.24": [
        "统计：移动后立刻改名也能识别，不再误计为删除+新增",
        "统计：rename 事件链式合并，配合 ctime/扩展名启发式兜底"
    ],
    "2.2.23": [
        "统计：今日净新增排除移动/重命名文件，展开列表与数字一致",
        "统计：仅移动时提示 →0，不再误列新建文档"
    ],
    "2.2.22": [
        "金句：仅提取 Weread「高亮划线」「读书笔记」章节，排除内容简介/全书评论",
        "金句：随笔 callout 抽取逻辑保持不变"
    ],
    "2.2.21": [
        "授权：激活绑定库名称而非 appId，解决每次打开 Obsidian 都要重新激活",
        "授权：兼容旧版 appId 激活码，已激活用户无感升级"
    ],
    "2.2.20": [
        "周工作：个人版/商业版设置页色块名称与各自模板区块一一对应",
        "周工作：修复个人版「部门会议」「周例会」不着色问题",
        "周工作：编辑模式按标题 Markdown 格式精确匹配色块"
    ],
    "2.2.19": [
        "更新说明：整合 2.0.2 至今全部改动，按模块分组清晰罗列",
        "更新说明：去除版本差异用语，统一面向所有用户展示",
        "更新说明：手机与电脑均支持中部列表无痕惯性滚动"
    ],
    "2.2.18": [
        "捕捉：「草稿」分类改为有序列表（1. 2. 3.）保存，不再转为待办 - [ ]",
        "草稿历史引用：同步支持读取有序列表条目"
    ],
    "2.2.17": [
        "更新说明弹窗：修复手机/电脑内容展示不全，列表区域支持流畅惯性滑动（移动端隐藏滚动条）",
        "更新说明弹窗：头部与底部按钮固定，中间更新条目可完整滚动浏览"
    ],
    "2.2.16": [
        "修复：附件部分失败时保留未成功项、不关闭捕捉框，并提示「N 个失败 / M 个已成功」",
        "修复：更新说明仅在点击「知道了，开始使用」后才标记为已读",
        "【2.2.14–2.2.15 汇总】捕捉：七大分类 + 素材重命名弹窗 + 文件墙索引",
        "修复：移除未使用的启动代码，合并重复的 onLayoutReady 回调",
        "素材：扩展名-日期或原文件名，保存后提示路径，AM 自动分类",
        "iOS：7 列分类按钮、仅附件可保存、与桌面捕捉行为一致",
        "同名文件自动重命名并提示；素材/保存失败保留 pending",
        "SmartCapsule 素材关键词路由、样式 ID 分离",
        "BrainCoreAPI 待办统计与控制台/iOS 一致",
        "激活页「打开操作指南」修复；多处空 catch 改进",
        "商业版：启动时固定右侧控制台并打开《插件使用说明》（个人版不启用）",
        "个人版：周工作模板保留部门会议 / 周例会结构（与商业版本周目标/复盘区分）"
    ],
    "2.2.15": [
        "修复：未激活控制台「打开操作指南」按钮无效",
        "修复：素材保存失败时不再清空待上传文件、不关闭捕捉框",
        "修复：删除附件链接后保存仍写入全部 pending 文件，避免静默丢失",
        "修复：SmartCapsule 与 Capture 样式 ID 冲突，胶囊专用样式正常加载",
        "修复：iOS 快捷面板支持仅上传附件保存（与桌面捕捉一致）",
        "素材/捕捉：同名文件已存在时自动重命名并提示",
        "闪念胶囊：新增「素材」关键词路由，文字备注写入文件墙",
        "BrainCoreAPI：待办统计与 iOS/控制台一致（生活待办 + 本周待办段）",
        "iOS 快捷面板：捕捉分类按钮改为 7 列网格",
        "稳定性：多处空 catch 改为 bcNoticeError / console.warn 便于排查",
        "素材：默认文件名改为「扩展名-日期」或保留原文件名（延续 2.2.14）",
        "素材：保存成功后提示具体路径（延续 2.2.14）",
        "捕捉：上传待保存文件的临时命名与素材规则一致（延续 2.2.14）"
    ],
    "2.2.14": [
        "素材：默认文件名改为「扩展名-日期」或保留原文件名，不再对 xlsx/zip 等非图片误用 IMG- 前缀",
        "素材：保存成功后提示具体路径，便于在 Boxes/附件 中定位",
        "捕捉：上传待保存文件的临时命名与素材规则一致"
    ],
    "2.2.13": [
        "捕捉：引用来源过长时自动截断显示",
        "捕捉：素材分类禁止附带文字，仅支持图片/文档/音视频文件",
        "捕捉：未安装 Attachment Management 时提示建议安装，素材统一存 Boxes/附件",
        "使用说明：更新捕捉七大分类、素材规则与 AM 插件说明"
    ],
    "2.2.12": [
        "捕捉：新增「素材」分类（文件/照片），保存前可修改文件名",
        "素材：已匹配 Attachment Management 扩展名规则的类型按 AM 分类，其余统一保存到 Boxes/附件",
        "素材：含文字说明时写入文件墙索引；纯文字素材可保存为 Boxes/附件 下的 Markdown"
    ],
    "2.2.11": [
        "捕捉：若已安装 Attachment Management，保存附件时自动按其扩展名规则分类（如图片→Boxes/图片、PDF→Boxes/PDF）",
        "捕捉：保存时按目标笔记（工作/生活/闪念等）套用 AM 的路径覆盖规则"
    ],
    "2.2.10": [
        "捕捉：图片/附件默认目录改为 Boxes/附件（可在设置中调整）",
        "捕捉：保存带图内容时不再触发侧边栏连续屏闪，捕捉框可正常继续使用",
        "启动：右侧栏清理改为增量模式，避免反复 detach 控制台视图"
    ],
    "2.2.9": [
        "验证码：授权门禁、剪藏 Defuddle、iOS 待办对齐、习惯累计等",
        "启动：主编辑区自动打开《插件使用说明》",
        "启动：右侧栏强制仅保留 BrainCore 控制台并 pin，清理日历等其它插件视图（含布局恢复后重试）",
        "启动：自动关闭误弹的设置页，不再遮挡工作区",
        "激活引导：仅在右侧控制台内完成，不自动跳转第三方插件设置页",
        "授权：捕捉、剪藏、归档、BrainCoreAPI 等入口统一校验激活状态",
        "iOS 快捷面板：工作周报待办与控制台一致，仅扫 ## 本周待办 段落",
        "随笔：修复年/月/周标题精确插入，避免重复或错位",
        "习惯打卡：恢复累计天数，勾选后从 habitData 重新统计",
        "剪藏：桌面端 Defuddle 引擎、移动端基础解析、失败时 Link Embed 卡片",
        "剪藏：修复备用解析器崩溃、同名文件自动加后缀、嵌套目录创建",
        "授权：修复手动改 data.json 中 licenseActivated 可绕过的问题"
    ],
    "2.2.8": [
        "商业版启动：自动关闭误弹的设置页，不再遮挡工作区",
        "商业版启动：右侧栏只保留 BrainCore 控制台，清理日历等无关插件标签",
        "商业版启动：主区打开《插件使用说明》，右侧固定 BrainCore 控制台",
        "更新说明弹窗：更大更清晰，并汇总展示今日 2.2.5–2.2.8 全部改动",
        "激活引导：仅在右侧控制台内完成，不再自动跳转第三方插件设置页"
    ],
    "2.2.7": [
        "修复：启动时右侧栏默认聚焦 BrainCore 控制台，不再跳到日历等无关标签",
        "修复：未激活时不再自动弹出设置页遮挡桌面，仅在控制台内引导激活"
    ],
    "2.2.6": [
        "更新说明：更大更清晰的分组弹窗，重点条目一目了然",
        "商业版：打开库时自动展开并固定右侧 BrainCore 控制台",
        "商业版：主编辑区自动打开《插件使用说明》"
    ],
    "2.2.5": [
        "授权：捕捉、剪藏、归档、BrainCoreAPI 等入口统一校验激活状态",
        "iOS 快捷面板：工作周报待办与控制台一致，仅扫 ## 本周待办 段落",
        "随笔：修复年/月/周标题精确插入，避免重复或错位",
        "商业版：保留本周目标 / 每日追踪 / 本周复盘周工作模板"
    ],
    "2.2.4": [
        "习惯打卡：恢复累计天数，勾选后从 data.json 的 habitData 重新统计"
    ],
    "2.2.3": [
        "剪藏：修复备用解析器加粗/斜体无限递归崩溃",
        "剪藏：正文抓不到时自动生成 Link Embed 卡片",
        "剪藏：同名文件自动加后缀，支持嵌套目录创建",
        "授权：修复手动改 data.json 中 licenseActivated 可绕过的问题",
        "升级后首次启动弹出更新说明（maybeShowUpdateNotice）",
        "捕捉/胶囊：提取共享保存函数，减少重复逻辑",
        "空 catch 改为 bcNoticeError 便于排查"
    ],
    "2.2.2": [
        "剪藏：桌面端接入 Defuddle 引擎（与 Obsidian Web Clipper 同系）",
        "剪藏：移动端跳过 Defuddle，使用基础解析并提示",
        "剪藏：抓取失败时保存 Link Embed 卡片（需 Link Embed 插件）",
        "剪藏：frontmatter 增加 clip_mode: embed|article"
    ],
    "2.2.1": [
        "修复插件加载失败：Defuddle 改为懒加载，移动端不再启动时 require 大文件"
    ],
    "2.2.0": [
        "剪藏升级方案 A：集成 Defuddle 全文提取引擎"
    ]
};

const LIFEOS_PLUGIN_CATALOG = [
  {
    id: "plain-ledger",
    name: "PlainLedger",
    intro: "专为 Obsidian 开发的记账软件",
    philosophy: "记账不必离开笔记——PlainLedger 把账单、分类、订阅规则保存在 Obsidian 库内，随 iCloud / Git 同步，和日记、复盘同屏共存",
  },
  {
    id: "jinianri",
    name: "纪念日",
    intro: "专为 Obsidian 开发的纪念日管理软件",
    philosophy: "记录生日、恋爱、婚姻等重要日期，自动计算「已过时长」与「距离下次还有几天」，支持三档提醒与 iCal 导出",
  },
  {
    id: "braincore-lifeos",
    name: "BrainCore LifeOS",
    intro: "专为 Obsidian 开发的生活管理控制台",
    philosophy: "Obsidian 知识库的「核心呼吸机」，它由 7 大模块组成，涵盖了时间感知、极速收集、工作流转、习惯养成与知识内化。一切信息从这里输入，最终也会在这里沉淀",
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
    const inst = plugins[p.id];
    return inst && inst._loaded !== false;
  });
}

function getLifeOsPeerNames(app, selfId) {
  return getEnabledLifeOsPlugins(app)
    .filter((p) => p.id !== selfId)
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
    new Notice(`${selfName} 可与 ${peerText} 并排使用，数据均保存在同一 Obsidian 库内。`, 8000);
    try { localStorage.setItem(storageKey, "1"); } catch { /* ignore */ }
  }, 2200);
}

function openLifeOsExternalUrl(url) {
  if (!url) return;
  try {
    window.open(url, "_blank");
  } catch (err) {
    console.warn("[LifeOS] open external url", err);
  }
}

function injectLifeOsActivationStyles() {
  const id = "lifeos-activation-panel-styles-v3";
  if (document.getElementById(id)) return;
  injectLifeOsSharedStyles();
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
.lifeos-act-panel {
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  min-height: 0;
  overflow-y: auto;
  padding: var(--lifeos-sidebar-inset, 10px) var(--lifeos-sidebar-inset, 10px) 18px;
  box-sizing: border-box;
  align-items: flex-start;
  justify-content: center;
  background: transparent;
}
.lifeos-act-wrap {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  box-sizing: border-box;
}
.lifeos-act-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.lifeos-act-title {
  margin: 0;
  text-align: center;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.3;
  color: var(--text-normal);
  letter-spacing: 0.01em;
}
.lifeos-act-status {
  margin: 0;
  text-align: center;
  font-size: 11px;
  line-height: 1.45;
  color: var(--lifeos-accent, var(--text-accent));
  font-weight: 600;
}
.lifeos-act-philosophy {
  margin: 0;
  font-size: 11px;
  line-height: 1.55;
  color: var(--text-muted);
  text-indent: 2em;
}
.lifeos-act-trial-btn {
  width: 100%;
  border: none;
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 700;
  background: var(--lifeos-accent, var(--interactive-accent)) !important;
  color: var(--lifeos-on-accent, #fff) !important;
  cursor: pointer;
}
.lifeos-act-row {
  display: flex;
  align-items: stretch;
  gap: 6px;
  width: 100%;
}
.lifeos-act-input {
  flex: 1 1 auto;
  min-width: 0;
  box-sizing: border-box;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  color: var(--text-normal);
}
.lifeos-act-input.lifeos-act-fp {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-weight: 700;
  color: var(--lifeos-accent, var(--text-accent));
  border-style: dashed;
  text-align: center;
}
.lifeos-act-input.lifeos-act-key {
  font-weight: 500;
}
.lifeos-act-btn {
  flex: 0 0 auto;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid var(--background-modifier-border);
  background: var(--background-modifier-hover);
  color: var(--text-normal);
}
.lifeos-act-btn-primary {
  background: var(--lifeos-accent, var(--interactive-accent)) !important;
  color: var(--lifeos-on-accent, #fff) !important;
  border: none !important;
}
.lifeos-act-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 2px;
  border-top: 1px solid var(--background-modifier-border);
  padding-top: 8px;
}
.lifeos-act-nav-row {
  display: flex;
  align-items: stretch;
  gap: 6px;
}
.lifeos-act-nav-btn {
  flex: 1 1 0;
  min-width: 0;
  border: none;
  border-radius: 8px;
  background: var(--background-modifier-hover);
  padding: 7px 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  text-align: center;
}
.lifeos-act-nav-btn:hover {
  color: var(--text-normal);
  background: var(--background-modifier-border);
}
.lifeos-act-btn:active,
.lifeos-act-nav-btn:active,
.lifeos-act-trial-btn:active,
.lifeos-about-link-row button:active {
  transform: scale(0.97);
  transition: transform 80ms ease;
}
.modal-container.lifeos-update-modal-host,
.modal-bg.lifeos-update-modal-bg {
  z-index: 1000100 !important;
}
.lifeos-act-msg {
  min-height: 16px;
  text-align: center;
  font-size: 11px;
  color: var(--text-muted);
}
.lifeos-act-msg.error {
  color: var(--text-error, #c44);
}
`;
  document.head.appendChild(style);
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
  } else if (config.firstRunHint) {
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
    text: config.activateShortLabel || "验证并激活",
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
  const id = "lifeos-settings-shared-styles-v1";
  if (document.getElementById(id)) return;
  injectLifeOsSharedStyles();
  injectLifeOsActivationStyles();
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
.lifeos-settings-grid { display: flex; flex-direction: column; gap: 14px; margin-top: 0; padding-bottom: 20px; }
.lifeos-settings-block {
  margin: 0;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid var(--background-modifier-border);
  box-sizing: border-box;
}
.lifeos-settings-block h3 {
  margin: 0 0 4px;
  padding: 0;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--text-normal);
}
.lifeos-settings-block > p.setting-item-description,
.lifeos-settings-block > p.lifeos-settings-desc {
  margin: 0 0 10px;
  padding: 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-muted);
}
.lifeos-settings-block .lifeos-act-row { margin-bottom: 8px; }
.lifeos-settings-block .lifeos-act-row:last-of-type { margin-bottom: 0; }
.lifeos-license-status {
  margin: 8px 0 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--lifeos-accent, var(--text-accent));
}
.lifeos-license-trial-hint {
  margin: 0 0 8px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--lifeos-accent, var(--text-accent));
}
.lifeos-about-panel.lifeos-settings-grid { padding-bottom: 20px; }
.lifeos-about-link-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid var(--background-modifier-border);
}
.lifeos-about-link-row:last-child { border-bottom: none; padding-bottom: 0; }
.lifeos-about-link-row span { font-size: 14px; font-weight: 500; color: var(--text-normal); }
.lifeos-about-link-row button { flex-shrink: 0; padding: 5px 14px; font-size: 12px; border-radius: 8px; }
.lifeos-about-meta { margin: 0 0 6px; font-size: 12px; line-height: 1.5; color: var(--text-muted); }
.lifeos-about-meta:last-child { margin-bottom: 0; }
.lifeos-about-works { display: flex; flex-direction: column; gap: 12px; margin-top: 4px; }
.lifeos-about-work-name { margin: 0 0 2px; font-size: 14px; font-weight: 600; color: var(--text-normal); }
.lifeos-about-work-intro { margin: 0 0 2px; font-size: 12px; line-height: 1.5; color: var(--text-muted); }
.lifeos-about-work-philosophy { margin: 0; font-size: 12px; line-height: 1.5; color: var(--text-muted); }
.lifeos-about-home-row { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px; margin: 6px 0 0; font-size: 12px; color: var(--text-muted); }
.lifeos-about-home-link { color: var(--lifeos-accent, var(--text-accent)); text-decoration: underline; word-break: break-all; cursor: pointer; }
`;
  document.head.appendChild(style);
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
  block.createEl("h3", { text: "快捷指令（iOS）" });
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
  const guideBtn = guideRow.createEl("button", { text: "打开", type: "button" });
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
}

function renderLifeOsAboutPanel(panel, plugin, options = {}) {
  injectLifeOsAboutStyles();
  panel.empty();
  const wrap = panel.createDiv({ cls: "lifeos-about-panel lifeos-settings-grid" });

  const helpBlock = wrap.createDiv({ cls: "lifeos-settings-block" });
  helpBlock.createEl("h3", { text: "文档" });
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
  addLinkRow(helpRows, "更新日志", () => openLifeOsUpdateNoticeFromPlugin(plugin));

  const authorBlock = wrap.createDiv({ cls: "lifeos-settings-block" });
  authorBlock.createEl("h3", { text: "作者" });
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
  worksBlock.createEl("h3", { text: "所有作品" });
  const enabled = getEnabledLifeOsPlugins(plugin.app);
  const selfId = plugin?.manifest?.id || options.selfId || "";
  worksBlock.createEl("p", {
    cls: "lifeos-suite-badge",
    text: `LifeOS 套装已安装 ${enabled.length}/3`,
  });
  const works = worksBlock.createDiv({ cls: "lifeos-about-works" });
  LIFEOS_PLUGIN_CATALOG.forEach((item) => {
    const itemEl = works.createDiv({ cls: "lifeos-about-work-item" });
    itemEl.createEl("p", { cls: "lifeos-about-work-name", text: item.name });
    itemEl.createEl("p", { cls: "lifeos-about-work-intro", text: item.intro });
    if (item.philosophy) {
      itemEl.createEl("p", { cls: "lifeos-about-work-philosophy", text: item.philosophy });
    }
    const actions = itemEl.createDiv({ cls: "lifeos-about-work-actions" });
    const installed = !!plugin.app?.plugins?.plugins?.[item.id];
    if (item.id === selfId) {
      actions.createEl("button", { text: "当前插件", type: "button", cls: "is-self" });
    } else if (installed) {
      const btn = actions.createEl("button", { text: "打开设置", type: "button" });
      btn.onclick = () => openLifeOsPluginSettings(plugin.app, item.id);
    } else {
      const btn = actions.createEl("button", { text: "未安装", type: "button", cls: "is-self" });
      btn.onclick = () => new Notice(`请先在 Obsidian 设置 → 第三方插件 中启用 ${item.name}`);
    }
  });
}

function renderLifeOsLicenseSettingsPanel(panel, config) {
  injectLifeOsSettingsSharedStyles();
  panel.empty();
  const grid = panel.createDiv({ cls: "lifeos-settings-grid" });
  const card = grid.createDiv({ cls: "lifeos-settings-block" });
  card.createEl("h3", { text: "授权激活" });
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
    text: "验证并激活",
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
  const old = document.getElementById(UPDATE_NOTICE_STYLE_ID);
  if (old) old.remove();
  const style = document.createElement("style");
  style.id = UPDATE_NOTICE_STYLE_ID;
  style.textContent = `
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
.bc-update-modal .modal-close-button { top: 14px; right: 14px; z-index: 2; }
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
  font-weight: 900;
  color: var(--text-normal);
  line-height: 1.25;
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
  justify-content: flex-end;
  background: var(--background-primary);
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
  .bc-update-modal.modal {
    width: calc(100vw - 16px);
    max-height: calc(100dvh - 12px);
  }
  .bc-update-modal .modal-content,
  .bc-update-wrap {
    max-height: calc(100dvh - 12px);
  }
  .bc-update-hero { padding: 20px 16px 14px; }
  .bc-update-title { font-size: 20px; }
  .bc-update-subtitle { font-size: 13px; }
  .bc-update-body { padding: 12px var(--lifeos-sidebar-inset, 10px) 6px; }
  .bc-update-item { font-size: 13px; padding: 9px 12px; }
  .bc-update-foot { padding: 12px 14px max(14px, env(safe-area-inset-bottom, 14px)); }
  .bc-update-btn { width: 100%; text-align: center; padding: 12px 16px; }
}
`;
  document.head.appendChild(style);
}

function renderChangelogBody(body, currentVersion) {
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
    items.forEach((note, idx) => {
      const item = list.createEl("li", { cls: "bc-update-item" });
      item.createSpan({ cls: "bc-update-num", text: String(idx + 1) });
      item.createSpan({ text: note });
    });
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
    const versionLabel = getPluginVersionLabel();
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

const USAGE_GUIDE_PATH = "BrainCore LifeOS 插件使用说明.md";
const USAGE_GUIDE_VERSION = "2026-08-12-braincore-guide-v16";
const GUIDE_VERSION_RE = /<!--\s*bc-guide-version:([^>]+)\s*-->/;
const SHORTCUTS_GUIDE_PATH = "BrainCore快捷指令使用指南.md";
const SHORTCUTS_GUIDE_CANDIDATES = [
  SHORTCUTS_GUIDE_PATH,
  "Just do it/OB相关/BrainCore快捷指令使用指南.md",
  "Just do it/插件/BrainCore快捷指令使用指南.md",
];

/** @type {string} injected by scripts/build.mjs */
const USAGE_GUIDE_RAW = "BrainCore LifeOS 是一套运行在 Obsidian 中的侧边栏控制台插件。\n\n它不是单纯的美化插件，也不是一个独立的待办工具，而是围绕 **捕捉、待办、周工作、习惯、金句、统计、归档** 构建的日常工作与知识管理中枢。\n\n简单来说：\n\n```text\nObsidian 是你的知识库\nBrainCore LifeOS 是你的控制台\n```\n\n它的目标不是让 Obsidian 变复杂，而是让你的知识库真正开始每天持续运转。\n\n---\n\n## 目录\n\n- [[#一、BrainCore LifeOS 是什么]]\n- [[#二、安装前准备]]\n- [[#三、如何安装插件]]\n- [[#四、如何打开控制台]]\n- [[#五、首次使用与激活]]\n- [[#六、控制台七大模块总览]]\n- [[#七、七大模块详细使用说明]]\n- [[#八、插件配置页面说明]]\n- [[#九、周工作系统说明]]\n- [[#十、推荐日常使用流程]]\n- [[#十一、注意事项]]\n- [[#十二、常见问题]]\n- [[#十三、推荐搭配插件]]\n- [[#十四、iOS 快捷指令（主屏入口）]]\n- [[#十五、一句话总结]]\n\n---\n\n## 一、BrainCore LifeOS 是什么\n\nBrainCore LifeOS 是配合 Obsidian 知识库使用的侧边栏控制台。\n\n它会把你每天最常用的操作集中到一个固定入口中，让你不需要反复翻文件夹、找模板、找入口。\n\n你可以用它完成：\n\n- 快速记录想法\n- 快速添加待办\n- 管理本周工作\n- 查看每日时间进度\n- 追踪习惯打卡\n- 展示每日金句\n- 查看知识库数据变化\n- 推动任务进入归档和复盘\n\n它更像一个日常启动面板。\n\n你每天打开 Obsidian 后，不需要先想“我该打开哪个文件”，而是可以先进入 BrainCore LifeOS 控制台，从控制台开始当天的工作。\n\n推荐理解方式：\n\n```text\nInbox 负责接收\nWork 负责推进\nBoxes 负责存放资料\n读&写负责沉淀\n归档负责收束\nBrainCore LifeOS 负责把这些入口连接起来\n```\n\n---\n\n## 二、安装前准备\n\n### 1. 必须安装的软件\n\n你需要先安装：\n\n```text\nObsidian\n```\n\n### 2. 必须安装的插件\n\nBrainCore LifeOS 的核心依赖是：\n\n```text\nDataview\n```\n\n这是唯一必须配合使用的插件。\n\n### 3. 建议开启 DataviewJS\n\n请进入：\n\n```text\n设置\n→ 第三方插件\n→ Dataview\n→ 开启 Dataview\n→ 开启 JavaScript Queries / DataviewJS\n```\n\n如果没有安装或开启 Dataview，以下功能可能无法正常显示：\n\n- 本周待办聚合\n- 标签统计\n- 数据统计\n- Dashboard 首页部分内容\n- 周工作任务联动\n\n### 4. 其他插件是否必须？\n\n不必须。\n\nBrainCore LifeOS 的目标就是尽量减少额外依赖。\n\n最简环境是：\n\n```text\nObsidian\n+\nDataview\n+\nBrainCore LifeOS\n```\n\nQuickAdd、Templater、Tasks 都不是必须依赖。\n\n---\n\n## 三、如何安装插件\n\n下载 BrainCore LifeOS 插件压缩包后，先解压。\n\n解压后通常会看到：\n\n```text\nmain.js\nmanifest.json\nREADME.md\n```\n\n其中真正影响插件运行的是：\n\n```text\nmain.js\nmanifest.json\n```\n\n如果有 README.md，它主要是说明文档，不影响插件运行。\n\n请把这些文件放到当前 Obsidian 库的插件目录中。\n\n推荐目录：\n\n```text\n.obsidian/plugins/braincore-lifeos/\n```\n\n完整结构类似：\n\n```text\n你的Obsidian库/\n└── .obsidian/\n    └── plugins/\n        └── braincore-lifeos/\n            ├── main.js\n            ├── manifest.json\n            └── README.md\n```\n\n放好后：\n\n```text\n重启 Obsidian\n→ 设置\n→ 第三方插件\n→ 找到 BrainCore LifeOS\n→ 开启插件\n```\n\n如果看不到插件，请确认：\n\n- 文件夹是否放在 `.obsidian/plugins/` 下面\n- `main.js` 和 `manifest.json` 是否在同一级目录\n- 是否已经重启 Obsidian\n- 第三方插件安全模式是否已关闭\n\n> **版本包命名**：分发常见四类——**个人版**（免激活）/ **公版（商）**（需激活）/ **公版（免激活）** / **体验版（48 小时）**。界面徽章「公版」与下载文件夹「公版（商）」通常指同一需激活公版；「个人版」同理。\n\n---\n\n## 四、如何打开控制台\n\n插件开启后，Obsidian 左侧 Ribbon 工具栏会出现一个：\n\n```text\n☁️ 云朵图标\n```\n\n点击左侧边栏的 **☁️ 云朵图标**，即可打开 BrainCore LifeOS 控制台。\n\n这是 BrainCore LifeOS 的日常主入口。\n\n日常使用时，你不需要去插件设置里找入口，也不需要打开某个固定文件。只需要点击左侧工具栏的云朵图标，就可以打开控制台。\n\n如果没有看到云朵图标，可以尝试：\n\n```text\n重启 Obsidian\n→ 确认插件已开启\n→ 查看左侧 Ribbon 工具栏\n```\n\n---\n\n## 五、首次使用与激活\n\n按安装包版本不同，首次进入方式略有差异：\n\n| 版本 | 首次怎么用 |\n|------|------------|\n| **个人版** | 免激活，点 ☁️ 即可进入控制台 |\n| **公版（商）** | 需激活码，无试用 |\n| **公版（免激活）** | 无需输入激活码即可使用 |\n| **体验版（48 小时）** | 侧边栏点「开启试用」开始 48 小时全功能体验，到期须激活 |\n\n公版（商）或体验版到期后，第一次打开 BrainCore 控制台时会进入初始化引导页面。\n\n页面中会显示：\n\n```text\n设备专属指纹\n```\n\n请按照下面步骤操作。\n\n### 1. 复制设备指纹\n\n复制页面中显示的设备专属指纹。\n\n### 2. 发送给作者\n\n将设备专属指纹发送给作者，用于生成你的专属激活码。\n\n### 3. 输入激活码\n\n拿到激活码后，直接在初始化页面输入激活码。\n\n### 4. 完成激活\n\n点击：\n\n```text\n验证并激活\n```\n\n激活成功后即可正常进入控制台。\n\n激活成功后，当前设备会保持有效。一般情况下不需要每次重复激活。\n\n如果后续更换设备、重新安装系统或更换 Obsidian 库路径，设备指纹可能发生变化，需要重新获取激活码。\n\n---\n\n## 六、控制台七大模块总览\n\nBrainCore LifeOS 控制台主要包含七个模块（设置里仍可单独开关 / 排序）：\n\n```text\n1. 问候语与天气\n2. 时间进度\n3. 快捷工具按钮\n4. 本周待办\n5. 习惯打卡\n6. 每日金句\n7. 数据统计\n```\n\n视觉上，**问候语与天气 + 年月周日进度 + 每日金句** 会合成顶部一块沉浸式 **Hero**（无背景、无边框），一眼完成「今天是谁 / 时间走到哪 / 一句提醒」。下方仍是快捷按钮、待办、习惯与统计。\n\n推荐每天打开 Obsidian 后，先点击左侧 **☁️ 云朵图标** 打开控制台，从 Hero 进入状态，再推进待办与习惯。\n\n---\n\n## 七、七大模块详细使用说明\n\n---\n\n## 模块一｜问候语与天气\n\n### 功能作用\n\n显示当前日期、时间段问候语和天气信息，并与时间进度、每日金句同处顶部 Hero。\n\n它的作用不是单纯装饰，而是给你一个轻量的启动入口。\n\n每天打开控制台，Hero 顶部你会先看到：\n\n- 当前日期\n- 今日问候\n- 天气情况\n- 温度信息\n\n### 适合场景\n\n- 每天早上打开 Obsidian\n- 开始工作前进入状态\n- 查看今日天气和时间氛围\n\n### 使用建议\n\n建议每天第一次打开 Obsidian 时，先看一眼这个区域。\n\n它可以帮助你从“打开软件”自然过渡到“进入今天的工作状态”。\n\n如果天气暂时没有显示，通常是 open-meteo 接口或网络问题。控制台会**先用默认经纬度**快速显示，不会长时间停在「定位中」。可在 **设置 → 路径 → 天气定位** 检查经纬度。\n\n---\n\n## 模块二｜时间进度\n\n### 功能作用\n\n时间进度嵌在顶部 Hero 中，展示当前时间在不同尺度下的进展：\n\n```text\n今年进度\n本月进度\n本周进度\n今日进度\n```\n\n### 它解决什么问题？\n\n很多时候我们不是没有计划，而是缺少对时间的感知。\n\n这个模块可以让你直观看到：\n\n- 今年已经过去多少\n- 本月还剩多少\n- 本周推进到哪一天\n- 今天已经过去多少\n\n### 适合场景\n\n- 每天启动时看当天节奏\n- 每周中段看本周进度\n- 月底或年底做复盘\n- 给自己一点时间压力和提醒\n\n### 使用建议\n\n如果你看到今日进度已经过半，但关键任务还没有开始，就可以立刻回到“本周待办”模块，选择最重要的一项开始推进。\n\n进度条悬停可查看已过比例、剩余时间与起止区间（桌面端）。\n\n---\n\n## 模块三｜快捷工具按钮\n\n### 功能作用\n\n快捷工具按钮是整个插件中使用频率最高的区域。\n\n它把高频操作集中到一个地方，让你不需要再去翻目录、找文件、找模板。\n\n### 四个快捷按钮\n\n控制台快捷工具区固定为四个按钮：\n\n```text\n捕捉｜文件｜闪念｜归档\n```\n\n| 按钮 | 作用 |\n|------|------|\n| 捕捉 | 打开捕捉面板（工作/生活/闪念/随笔/剪藏/素材/草稿七大分类） |\n| 文件 | 打开文件墙，浏览 Boxes 中的图片/PDF/音视频/附件 |\n| 闪念 | 打开闪念胶囊，按关键词智能分发到 Ideas 等位置 |\n| 归档 | 归档当前或最近打开的 Markdown 中已完成的待办 |\n\n### 使用逻辑\n\n当你脑子里出现一个想法时：\n\n```text\n点击捕捉\n→ 选择分类\n→ 输入内容\n→ 保存到对应位置\n```\n\n当你想快速记一条闪念时：\n\n```text\n点击闪念\n→ 输入关键词或内容\n→ 保存到 Ideas 等路径\n```\n\n当你需要整理已完成任务时：\n\n```text\n点击归档\n→ 将当前笔记中已勾选的待办移入归档\n```\n\n### 核心价值\n\n快捷工具区解决的是“记录成本太高”的问题。\n\n它的目标是让你：\n\n```text\n想到就记\n有事就收\n处理完再归档\n```\n\n不要一开始就追求整理完美。先捕捉，再处理，最后归档。\n\n---\n\n### 捕捉面板七大分类\n\n点击「捕捉」后，底部为七个分类（桌面单行；窄屏/移动端可点 **⋯ 更多** 展开其余分类）：\n\n```text\n常用：工作｜生活｜闪念\n更多：随笔｜剪藏｜素材｜草稿\n```\n\n| 分类 | 写入位置 / 用途 |\n|------|----------------|\n| 工作 | 本周工作文件 → ## 本周待办 |\n| 生活 | Inbox/Tasks.md |\n| 闪念 | Inbox/Ideas.md（闪念记录） |\n| 随笔 | 读&写/随笔.md（年/月/周结构） |\n| 剪藏 | 抓取网页 URL，保存为 Markdown |\n| 素材 | 仅保存图片、文档、音视频等**文件** |\n| 草稿 | Inbox/草稿.md |\n\n#### 素材分类说明（v2.2.13+）\n\n- **仅针对文件**：素材分类只接收图片、PDF、文档、音视频等附件。\n- **不可附带文字**：输入框中有额外文字时无法保存（粘贴/上传自动生成的 `![[...]]` 链接除外）。\n- **保存前可改文件名**：点击「素材」后弹出对话框，可修改每个文件的名称。\n- **自动分类存放**：\n  - 已安装 **Attachment Management** 且配置了扩展名规则时，按 AM 分类（如 png→Boxes/图片、pdf→Boxes/PDF）。\n  - 未安装 AM，或某类型未配置规则时，统一保存到 **Boxes/附件**。\n- **素材日志（可选）**：填写标题时写入 `Boxes/素材日志.md`；留空则只保存文件。文件墙为 DataviewJS 看板，**不再写入索引**。\n\n#### 剪藏说明\n\n- 在捕捉框输入 URL，点击「剪藏」即可抓取网页正文。\n- 桌面端优先使用 Defuddle 全文引擎；失败时降级为 Link Embed 卡片。\n- 剪藏文件默认保存到 Inbox/Clippings（可在设置中修改）。\n\n---\n\n## 模块四｜本周待办\n\n### 功能作用\n\n本周待办模块用于聚合当前真正需要推进的任务。\n\n它不是简单显示一个待办列表，而是把日常待办和当前周工作事项集中到一起。\n\n### 主要读取来源\n\nBrainCore LifeOS 的本周待办主要读取：\n\n```text\nInbox/Tasks.md\n+\n当前周 Work 文件\n```\n\n### 它的意义\n\n你每天打开控制台时，可以直接看到：\n\n```text\n这周还有哪些事情没完成\n```\n\n不需要再分别打开多个文件检查。\n\n### 适合管理的内容\n\n- 本周工作任务\n- 临时待办事项\n- 未完成事项\n- 需要持续推进的项目\n\n### 标准待办格式\n\n建议使用 Obsidian 原生 Markdown 任务格式：\n\n```markdown\n- [ ] 这是一条未完成任务\n- [x] 这是一条已完成任务\n```\n\n如果任务不显示，优先检查是否写成了标准格式。\n\n### 使用建议\n\n每天打开 Obsidian 后，可以按这个流程：\n\n```text\n点击 ☁️ 打开控制台\n→ 查看本周待办\n→ 选择今天最重要的 1-3 件事\n→ 推进并勾选\n```\n\n---\n\n## 模块五｜习惯打卡\n\n### 功能作用\n\n习惯打卡模块用于记录那些需要长期坚持的事情。\n\n它和待办不同。\n\n```text\n待办：一次性完成的事情\n习惯：需要长期重复的事情\n```\n\n### 常见习惯示例\n\n你可以用它记录：\n\n- 阅读\n- 写作\n- 运动\n- 早睡\n- 冥想\n- 复盘\n- 输出内容\n- 学习英语\n- 健康管理\n\n### 它的意义\n\nBrainCore LifeOS 不只是管理工作，也可以管理个人成长。\n\n习惯模块可以让你看到自己是否在持续做那些“长期重要但不紧急”的事。\n\n### 使用建议\n\n建议把习惯打卡放在每天晚上使用。\n\n例如：\n\n```text\n晚上收尾\n→ 打开控制台\n→ 完成习惯打卡\n→ 简单复盘今天\n```\n\n习惯项目可以在插件配置页面中自定义，包括图标、名称、新增、删除，也可以导出或导入打卡数据。\n\n---\n\n## 模块六｜每日金句\n\n### 功能作用\n\n每日金句展示一句提醒、摘录或启发性内容，视觉上落在顶部 Hero 底部（与问候、时间进度同一块）。\n\n来源可以是微信读书划线、随笔 callout，或你配置的读书笔记路径。\n\n### 如何切换\n\n- **点击** Hero 任意区域（问候 / 进度 / 金句）→ 立刻换下一条金句\n- **每小时**仍按当日种子自动轮换（不用手动点也会换）\n- 界面不再显示「轻触切换」类提示，悬停时标题会提示「点击切换金句」\n\n### 它的意义\n\n每日金句不是简单的装饰，也不是为了制造“鸡汤感”。\n\n它更像一个轻量提醒器：\n\n- 提醒你保持节奏\n- 唤醒过去读过的内容\n- 给写作提供灵感\n- 让知识库里的旧内容重新出现\n\n### 适合场景\n\n- 每天第一次打开控制台\n- 写作前寻找状态\n- 复盘时获得提醒\n- 需要一点精神提示的时候\n\n### 使用建议\n\n如果某一句金句对你有启发，可以顺手延伸成一条随笔、闪念或写作草稿。\n\n这样知识库就会从“存内容”慢慢变成“产生内容”。\n\n每日金句读取位置可以在插件配置页面中设置。如果留空，通常会按默认规则读取对应目录。建议搭配社区 **Weread（微信读书）** 插件同步划线。\n\n---\n\n## 模块七｜数据统计\n\n### 功能作用\n\n数据统计模块用于展示当前知识库的核心数据变化。\n\n它可以帮助你知道自己的知识库到底在发生什么变化，而不是只凭感觉判断。\n\n### 当前统计维度\n\n主要统计：\n\n```text\n📝 笔记\n🖼️ 图·表\n📎 附件\n🏷️ 标签\n⏳ 待办\n⚡ 闪念\n```\n\n### 统计口径说明\n\n#### 1. 笔记\n\n统计库中独立存在的 Markdown 笔记文件。\n\n一般指：\n\n```text\n.md 文件\n```\n\n部分特殊目录，例如模板目录，可能会被排除。\n\n#### 2. 图·表\n\n统计独立存在的图片、表格和画布类文件，例如：\n\n```text\npng\njpg\njpeg\ngif\nwebp\nsvg\nxlsx\ncsv\ncanvas\n```\n\n#### 3. 附件\n\n统计除 Markdown、图片、表格、画布之外的其他文件，例如：\n\n```text\npdf\ndoc\ndocx\nppt\npptx\nzip\nmp3\nm4a\njs\n其他附件\n```\n\n#### 4. 标签\n\n统计当前知识库中使用过的标签。\n\n例如：\n\n```text\n#flash\n#todo\n#project\n#reading\n```\n\n#### 5. 待办\n\n待办统计主要来自：\n\n```text\nInbox/Tasks.md\n+\n当前周 Work 文件中的未完成任务\n```\n\n也就是你当前真正还需要推进的任务数量。\n\n#### 6. 闪念\n\n闪念统计主要用于统计你通过闪念入口或 Ideas 系统记录的内容。\n\n### 今日累计说明\n\n数据统计中可能会出现类似：\n\n```text\n↑ 3\n→ 0\n↓ 1\n```\n\n含义是：\n\n```text\n↑ N：今天新增后仍然存在的净增量\n→ 0：今天无净变化\n↓ N：今天净减少\n```\n\n### 这个模块的价值\n\n它让你的知识库变得可以被观察。\n\n你可以知道：\n\n- 今天新增了多少内容\n- 文件是否真的在增长\n- 待办是否越来越多\n- 闪念是否持续输入\n- 附件和图表是否越来越多\n\n### 使用建议\n\n不要把统计当成压力，而是把它当作仪表盘。\n\n你只需要偶尔看一眼，知道系统是否在正常运转。\n\n### 刷新节奏与省电（v3.2.4+）\n\n控制台打开且可见时才会定时刷新；**侧栏收起、窗口不可见或电脑休眠时会停定时器**，重新打开后再补刷，避免后台空转耗电。\n\n- **进度条**（年月周日）：约每 3 分钟轻量更新  \n- **数据统计**：文件增删或相关笔记变动后较快更新（约 0.3 秒合并）；侧栏打开时也会定期刷统计  \n- **全量重绘**：间隔更长，主要用于整体同步  \n\n附件类文件只在「新建 / 删除 / 重命名」时驱动统计刷新（忽略单纯的同步触摸），减少 iCloud 抖动带来的无效刷新。\n\n---\n\n## 八、插件配置页面说明\n\nBrainCore LifeOS 除了左侧控制台外，还有一个配置页面。\n\n进入路径：\n\n```text\n设置\n→ 第三方插件\n→ BrainCore LifeOS\n```\n\n配置页面用于调整插件的授权、路径、天气、模块顺序、配色和打卡等内容。桌面端标题格式为 **BrainCore 配置 · 个人版 v3.2.4**（版本号在标题末尾）。\n\n常见 Tab：\n\n```text\n路径 · 模块 · 打卡 · 数据 · 快捷指令 · 关于\n```\n\n（需激活的安装包还会多一个「授权」Tab。）\n\n---\n\n### 1. 授权激活\n\n配置页面顶部通常会显示授权激活区域。\n\n这里会展示：\n\n```text\n设备库特征指纹\n```\n\n如果插件还没有激活，可以复制这个指纹发送给作者获取激活码。\n\n拿到激活码后，可以在这里输入激活码完成授权。\n\n如果你已经通过控制台初始化页面完成激活，这里一般不需要重复操作。\n\n---\n\n### 2. 路径映射配置\n\n路径映射配置决定了插件把不同类型内容写入或读取到哪里。\n\n常见配置包括：\n\n```text\n工作存放\n生活存放\n闪念存放\n随笔存放\n剪藏存放\n草稿存放\n附件存放\n素材日志\n文件墙\n跟随 Attachment Management\n读书笔记\n```\n\n这些路径会影响快捷捕捉、素材分类、金句读取、待办聚合和内容归档等功能。\n\n例如：\n\n```text\n闪念存放 → 决定闪念记录写入哪里\n草稿存放 → 决定草稿内容写入哪里\n工作存放 → 决定周工作系统读取和生成的位置\n剪藏存放 → 决定网页剪藏保存位置\n附件存放 → 未匹配 AM 规则时的默认附件目录（默认 Boxes/附件）\n文件墙 → 打开文件墙看板的路径（纯展示，素材不会写入此文件）\n素材日志 → 素材捕捉可选备注（默认 Boxes/素材日志.md；留空标题则不写）\n读书笔记 → 决定每日金句优先从哪里提取内容\n```\n\n如果你使用默认库结构，通常不需要修改。\n\n如果你自己调整过文件夹名称，就需要在这里同步修改路径。\n\n建议不要随意改路径。修改前先确认目标文件或文件夹真实存在，避免捕捉内容写入失败或统计读取不到。\n\n---\n\n### 3. 天气定位配置（位于 **路径** Tab 内）\n\n天气定位配置用于设置默认经纬度。\n\n常见字段包括：\n\n```text\n默认纬度 Latitude\n默认经度 Longitude\n```\n\n打开控制台时**先用此处默认经纬度**拉取天气；若 4 小时内已有成功的网络定位（ipwho / ipinfo / geolocation-db），则优先使用该坐标。后台每 **4 小时** 最多尝试一次定位；失败则继续用默认经纬度。天气先用 open-meteo，失败自动切换 wttr.in；结果缓存 **1 小时**。\n\n使用说明与更新日志可在激活页或设置 → 关于 中手动打开，**启动时不会自动弹出**。\n\n你可以通过地图坐标拾取工具查询所在地经纬度。\n\n例如：\n\n```text\n纬度：31.2304\n经度：121.4737\n```\n\n如果你不确定怎么填写，可以暂时保持默认值。\n\n---\n\n### 4. 模块自由组合\n\n模块自由组合用于控制侧边栏控制台显示哪些模块，以及这些模块的排列顺序。\n\n你可以在这里：\n\n- 开启模块\n- 关闭模块\n- 拖拽调整模块顺序\n- 根据自己的习惯定制控制台布局\n\n例如，如果你暂时不想显示每日金句，可以关闭每日金句模块。\n\n如果你更重视本周待办，可以把本周待办模块拖到更靠前的位置。\n\n模块调整后，控制台会自动刷新或在重新打开后生效。\n\n推荐新用户先使用默认顺序，熟悉后再调整。\n\n---\n\n### 5. 模板色块配置\n\n模板色块配置用于调整周工作模板中不同区域的颜色。\n\n常见配置包括：\n\n```text\n本周待办\n本周目标\n本周复盘\n每日追踪\n```\n\n这些颜色会影响周工作文件中的视觉区块，让你更容易区分不同内容。\n\n例如：\n\n```text\n本周待办：适合使用醒目的颜色\n本周目标：适合使用稳定的颜色\n本周复盘：适合使用柔和的颜色\n每日追踪：适合使用清晰但不刺眼的颜色\n```\n\n如果你不想折腾配色，保持默认即可。\n\n---\n\n### 6. 打卡配置\n\n「打卡」Tab（原「习惯」）用于自定义控制台里的打卡项目。\n\n你可以在这里：\n\n- 修改名称\n- 修改图标（左侧图标格约 70px，占位「图标」两字完整显示）\n- 新增打卡项\n- 删除不需要的项\n- 导出 / 导入打卡数据\n\n每个项目通常由两个部分组成：\n\n```text\n图标\n名称\n```\n\n例如：\n\n```text\n📖 阅读\n🏃 运动\n✍️ 写作\n🌙 早睡\n🧘 冥想\n```\n\n如果你更换设备，或想备份自己的打卡记录，可以使用导出数据功能。\n\n如果你重新安装插件，或迁移到另一个库，可以使用导入数据功能恢复打卡记录。\n\n---\n\n### 7. 配置页面使用建议\n\n新用户建议先保持默认配置，只做三件事：\n\n```text\n1. 完成授权激活\n2. 确认 Dataview 已开启\n3. 根据需要修改打卡项目\n```\n\n等熟悉插件后，再逐步调整：\n\n```text\n路径映射\n模块顺序\n模板配色\n天气经纬度\n快捷指令主屏入口\n```\n\n不要一开始就大幅修改路径，否则容易造成内容写入位置和统计读取位置不一致。\n\n---\n\n### 8. 快捷指令\n\n设置 → **快捷指令** 中可复制链接，并打开《快捷指令使用说明》。\n\n**部署**：在 iPhone 打开「快捷指令」App：新建→「打开 URL」→粘贴链接→添加到主屏幕（详见使用指南）。\n\n**使用**：点击快捷指令可快速打开捕捉面板；也可在 iPhone：**设置 → 无障碍 → 触控 → 轻点背面** → 绑定该快捷指令。\n\n链接：\n\n```text\nobsidian://braincore?action=quick\n```\n\n不必再套「打开 App → Obsidian」。主屏一般只放一个入口。\n\n---\n\n## 九、周工作系统说明\n\nBrainCore LifeOS 一个重要特点是：\n\n```text\n完整的周工作模板系统\n```\n\n它不是简单生成一个周文件，而是围绕每周工作推进做了结构化设计。\n\n---\n\n### 1. 自动生成周工作文件\n\n插件会围绕当前周自动生成周工作文件。打开 BrainCore 控制台时，若本周 Work 文件不存在会立刻创建；跨周时即便上周没有未完成待办，也会生成本周空模板。\n\n文件通常会按年份、月份、周次组织。\n\n示例结构：\n\n```text\nWork/\n└── 2026/\n    └── 6月/\n        ├── WK24 06月08日-06月14日.md\n        ├── WK25 06月15日-06月21日.md\n        └── WK26 06月22日-06月28日.md\n```\n\n### 好处\n\n- 不用手动建周文件\n- 不用手动分年份和月份\n- 不用自己计算周次\n- 更适合长期工作记录\n\n---\n\n### 2. 上周 / 本周 / 次周联动\n\n周工作文件之间会形成连续关系：\n\n```text\n上周 ← 本周 → 次周\n```\n\n这样你可以很自然地回看过去，也可以推进到下一周。\n\n### 使用场景\n\n- 查看上周遗留任务\n- 记录本周重点\n- 提前安排下周事项\n- 每周复盘时快速跳转\n\n---\n\n### 3. 未完成待办迁移\n\n周工作系统会围绕未完成待办做流转设计。\n\n简单理解：\n\n```text\n上周没做完的事\n→ 会进入后续工作视野\n→ 继续在本周推进\n```\n\n### 解决的问题\n\n很多人每周都会重新写计划，但上周没完成的任务容易被遗忘。\n\n周工作系统就是为了减少这种遗忘，让任务可以连续推进。\n\n---\n\n### 4. 和侧边栏本周待办联动\n\n周工作文件不是孤立存在的。\n\n它会和控制台中的“本周待办”模块形成联动。\n\n你在 Work 中写下的任务，可以在控制台里被聚合看到。\n\n这意味着：\n\n```text\nWork 是任务的结构化承载\n控制台是任务的每日入口\n```\n\n---\n\n## 十、推荐日常使用流程\n\n---\n\n### 1. 每天早上：启动\n\n推荐流程：\n\n```text\n打开 Obsidian\n→ 点击左侧 ☁️ 云朵图标\n→ 打开 BrainCore 控制台\n→ 看一眼顶部 Hero（问候 / 天气 / 年月周日进度 / 金句；可点击换句）\n→ 查看本周待办\n→ 选择今天要推进的重点\n```\n\n目标是让你每天一打开 Obsidian，就知道今天该从哪里开始。\n\n---\n\n### 2. 白天工作：捕捉和推进\n\n当你工作过程中出现想法、任务、资料时，可以这样处理：\n\n```text\n有想法\n→ 用快捷捕捉记录\n\n有任务\n→ 记录到待办\n\n有草稿\n→ 放入草稿区\n\n有资料\n→ 放入 Boxes 或对应目录\n```\n\n原则是：不要一开始就追求整理完美。\n\n先把东西收进系统，再统一处理。\n\n---\n\n### 3. 晚上收尾：打卡和整理\n\n晚上可以这样使用：\n\n```text\n打开控制台\n→ 勾选已完成任务\n→ 完成习惯打卡\n→ 处理 Inbox 中的临时内容\n→ 需要归档的内容进行归档\n```\n\n目标是每天都让系统稍微变干净一点。\n\n---\n\n### 4. 每周复盘：查看 Work\n\n每周结束时，可以打开当前周 Work 文件。\n\n建议检查：\n\n- 本周完成了什么\n- 哪些任务没有完成\n- 哪些任务需要延续到下周\n- 本周有哪些重要记录\n- 下周需要提前安排什么\n\n推荐节奏：\n\n```text\n周日晚上\n或\n周一早上\n```\n\n进行一次简单周复盘即可。\n\n---\n\n## 十一、注意事项\n\n---\n\n### 1. Dataview 必须开启\n\nBrainCore LifeOS 很多功能都依赖 Dataview。\n\n如果你看到控制台或 Dashboard 有内容不显示，请优先检查 Dataview 是否开启。\n\n---\n\n### 2. 请通过左侧 ☁️ 图标打开控制台\n\nBrainCore 控制台的日常入口是：\n\n```text\n左侧 Ribbon 工具栏 → ☁️ 云朵图标\n```\n\n不要每次都去插件设置页找入口。\n\n---\n\n### 3. 不要随意删除核心目录\n\n请尽量保留以下目录：\n\n```text\nInbox\nWork\nBoxes\nLife\n读&写\n归档\nScripts\n```\n\n这些目录和插件的数据统计、工作流、归档逻辑可能有关。\n\n---\n\n### 4. 不要随意删除统计文件\n\n插件可能会生成：\n\n```text\nScripts/braincore-stats-history.json\n```\n\n这个文件用于记录统计基线和今日累计变化。\n\n不建议随意删除这个文件。如果删除，今日累计等统计数据可能会重新建立基线。\n\n---\n\n### 5. iCloud / OneDrive 同步需要等待\n\n如果你使用 iCloud、OneDrive 或其他同步工具，可能会出现短暂不同步。\n\n常见情况：\n\n- 电脑和手机统计数量不一致\n- 文件名出现了，但内容还没下载\n- 图片或附件还在等待同步\n\n通常等待同步完成即可。\n\n---\n\n### 6. 插件文件不要改名\n\n插件目录中的核心文件不要随意改名：\n\n```text\nmain.js\nmanifest.json\n```\n\n如果改名，Obsidian 可能无法识别插件。\n\n---\n\n### 7. 旧脚本不是必须\n\nBrainCore LifeOS 已经内置很多功能，例如：\n\n- 捕捉\n- 闪念\n- 待办\n- 周工作\n- 习惯\n- 统计\n- 归档\n\n所以旧的 QuickAdd、Templater 捕捉脚本不是必须依赖。\n\n可以根据实际情况逐步移除。\n\n---\n\n## 十二、常见问题\n\n---\n\n### Q1：为什么打开后提示 Dataview？\n\n因为 Dataview 没有安装、没有开启，或者 Obsidian 还没有加载完成。\n\n处理方式：\n\n```text\n设置\n→ 第三方插件\n→ Dataview\n→ 开启\n```\n\n并确认 DataviewJS 已开启。\n\n---\n\n### Q2：为什么左侧没有 ☁️ 云朵图标？\n\n请检查：\n\n```text\n插件是否开启\nmain.js 是否存在\nmanifest.json 是否存在\n插件目录是否正确\n是否重启过 Obsidian\n```\n\n如果都正确，重启 Obsidian 后一般会出现。\n\n---\n\n### Q3：为什么本周待办没有显示？\n\n请检查：\n\n```text\nInbox/Tasks.md 是否存在\n当前周 Work 文件是否存在\n任务是否使用 - [ ] 格式\nDataview 是否开启\n```\n\n标准待办格式是：\n\n```markdown\n- [ ] 这是一条未完成任务\n- [x] 这是一条已完成任务\n```\n\n---\n\n### Q4：为什么统计数量和 Finder / 文件管理器看到的不一样？\n\n可能原因包括：\n\n- 文件还在同步\n- 某些文件被系统隐藏\n- 模板目录被排除\n- iCloud 文件还未下载到本机\n- Obsidian 尚未完成索引\n\n一般等待同步完成，或重启 Obsidian 后会恢复。\n\n---\n\n### Q5：能不能不装 QuickAdd / Templater / Tasks？\n\n可以。\n\nBrainCore LifeOS 的目标就是尽量减少额外依赖。\n\n最简环境是：\n\n```text\nObsidian\n+\nDataview\n+\nBrainCore LifeOS\n```\n\nQuickAdd、Templater、Tasks 都不是必须。\n\n---\n\n### Q6：手机端可以用吗？\n\n可以，但手机端首次加载可能稍慢。\n\n如果你使用 iCloud 或其他同步方式，请确保文件已经同步到手机本地。\n\n---\n\n### Q7：README.md 可以不放吗？\n\n可以。\n\n插件真正运行需要的是：\n\n```text\nmain.js\nmanifest.json\n```\n\nREADME.md 只是说明文档，不影响插件运行。\n\n但为了方便用户理解安装和使用，交付时建议保留。\n\n---\n\n### Q8：配置页面改错了怎么办？\n\n如果只是路径、颜色、模块顺序改错，一般可以重新进入插件配置页面改回来。\n\n如果因为路径修改导致捕捉或统计异常，建议先恢复默认路径结构，再重新打开控制台。\n\n推荐先确认这些核心路径：\n\n```text\nInbox\nWork\nBoxes\nLife\n读&写\n归档\nScripts\n```\n\n---\n\n## 十三、推荐搭配插件\n\n### 必装\n\n```text\nDataview\n```\n\n### 建议开启\n\n```text\nDataviewJS\n```\n\n### 建议安装（素材分类增强）\n\n```text\nAttachment Management\n```\n\n用于按扩展名自动分类附件（图片、PDF、录音等）。\n\nBrainCore 会读取 AM 的扩展名覆盖规则；**未安装 AM 时**，素材仍可用，但会统一保存到 **Boxes/附件**。\n\n首次使用「素材」分类且未检测到 AM 时，插件会提示建议安装。\n\n### 可选\n\n```text\nExcalidraw：用于白板、流程图、视觉化思考\nLink Embed：剪藏降级为卡片预览时需要\nBRAT：用于后续从 GitHub 更新插件\n```\n\n### 不必安装\n\n```text\nQuickAdd\nTemplater\nTasks\nAdmonition\n```\n\nObsidian 已经原生支持 Callout，所以一般不需要额外安装 Admonition。\n\n---\n\n### Q9：素材分类为什么保存不了？\n\n素材分类**仅针对文件**（图片、PDF、文档、音视频等），不支持附带文字说明。\n\n如果输入框里除了自动生成的 `![[...]]` 链接外还有其他文字，请先删除文字再点「素材」。\n\n如需同时记录说明，请先用「素材」保存文件，再到「闪念」或「随笔」中补充文字。\n\n---\n\n### Q10：iOS 主屏快捷指令怎么配？\n\n推荐只做一个入口，URL 填：\n\n```text\nobsidian://braincore?action=quick\n```\n\n**部署**：快捷指令 App → 新建 → 打开 URL → 粘贴 → 加到主屏幕。  \n**使用**：点图标打开捕捉面板；也可 **设置 → 无障碍 → 触控 → 轻点背面** 绑定同一快捷指令。\n\n链接在设置 → **快捷指令** 可复制；说明笔记可点「快捷指令使用说明」打开。\n\n---\n\n## 十四、iOS 快捷指令（主屏入口）\n\nBrainCore 支持通过 `obsidian://braincore` 从 iPhone 主屏幕或背面轻点一键进入。\n\n### 部署\n\n在 iPhone 打开「快捷指令」App：新建→「打开 URL」→粘贴：\n\n```text\nobsidian://braincore?action=quick\n```\n\n→ 添加到主屏幕（也可在设置 → **快捷指令** 复制链接）。不必再套「打开 App」。\n\n### 使用\n\n- 点主屏幕图标：打开快速面板（优先显示捕捉区）  \n- **轻点背面**：设置 → 无障碍 → 触控 → 轻点背面 → 选中该快捷指令  \n\n快速面板内已有捕捉 / 最近 / 闪念 / 归档，多数场景一个入口就够。\n\n（兼容：`action=tasks` 与 `quick` 相同，可忽略。）\n\n---\n\n## 十五、一句话总结\n\nBrainCore LifeOS 是《日拱一卒》Obsidian 知识库的侧边栏控制台。\n\n它把：\n\n```text\n时间进度\n快捷捕捉\n本周待办\n习惯打卡\n每日金句\n数据统计\n周工作模板\n插件配置\n```\n\n集中到一个固定入口中。\n\n你每天只需要：\n\n```text\n打开 Obsidian\n→ 点击左侧 ☁️ 云朵图标\n→ 进入 BrainCore 控制台\n→ 开始记录、推进和复盘\n```\n\n它的目标不是让 Obsidian 变复杂，而是让你的知识库真正开始每天持续运转。";
/** @type {string} injected by scripts/build.mjs */
const SHORTCUTS_GUIDE_RAW = "用 iOS「快捷指令」从主屏幕或背面轻点一键打开 BrainCore 快速面板（含捕捉），无需先翻找侧栏。\n\n当前插件版本：**3.2.4**\n\n链接（复制到「打开 URL」）：\n\n```text\nobsidian://braincore?action=quick\n```\n\n---\n\n## 一、部署（装到主屏幕）\n\n在 iPhone 上打开「快捷指令」App：\n\n1. 新建快捷指令  \n2. 添加操作 **打开 URL**  \n3. 粘贴上面的链接  \n4. （可选）名称改成「BrainCore」  \n5. **分享 → 添加到主屏幕**\n\n只需「打开 URL」，不必再套「打开 App → Obsidian」。\n\n链接也可在 Obsidian → 设置 → BrainCore → **快捷指令** 一键复制。\n\n---\n\n## 二、使用\n\n- **主屏幕图标**：点快捷指令，即可打开快速面板（优先显示捕捉区）。  \n- **背面轻点**（免找图标，更快）：  \n  1. iPhone **设置 → 无障碍 → 触控 → 轻点背面**  \n  2. 选择 **轻点两下** 或 **轻点三下**  \n  3. 选中刚建好的「BrainCore」快捷指令  \n\n之后轻点手机背面即可唤起同一面板。\n\n快速面板内已有捕捉 / 最近 / 闪念 / 归档，主屏一般只放 **一个** 入口即可。\n\n---\n\n## 三、常见问题\n\n**要不要四个主屏幕按钮？**  \n不要。一个 `quick` 入口就够。\n\n**为什么还是会先打开 Obsidian？**  \n系统必须先唤起 Obsidian；插件侧会尽快弹出面板，并优先画出捕捉区。\n\n**`action=tasks`？**  \n与 `quick` 相同，可忽略。\n";

function buildBrainCoreGuideContent() {
  return `${wrapUsageGuideContent(USAGE_GUIDE_RAW).trim()}\n\n<!-- bc-guide-version:${USAGE_GUIDE_VERSION} -->`;
}

async function ensureBrainCoreUsageGuide(app, forceUpdate = false) {
  const content = buildBrainCoreGuideContent();
  try {
    let guideFile = app.vault.getAbstractFileByPath(USAGE_GUIDE_PATH);
    if (!guideFile) {
      guideFile = await app.vault.create(USAGE_GUIDE_PATH, content);
    } else if (forceUpdate) {
      const old = await app.vault.read(guideFile);
      const ver = old.match(GUIDE_VERSION_RE)?.[1]?.trim();
      if (ver !== USAGE_GUIDE_VERSION || old.trim() !== content.trim()) {
        await app.vault.modify(guideFile, content);
      }
    }
    return guideFile;
  } catch (e) {
    console.warn("BrainCore 使用说明写入失败：", e);
    return null;
  }
}

async function openBrainCoreUsageGuide(plugin, options = {}) {
  const { forceOpen = false } = options || {};
  if (!forceOpen) return;
  await ensureBrainCoreUsageGuide(plugin.app, true);
  try {
    const file = plugin.app.vault.getAbstractFileByPath(USAGE_GUIDE_PATH);
    if (file && typeof plugin.openMarkdownInMainTab === "function") {
      await plugin.openMarkdownInMainTab(file);
    }
  } catch (e) {
    console.warn("BrainCore 使用说明打开失败：", e);
  }
}

async function openBrainCoreShortcutsGuide(plugin, options = {}) {
  const { forceOpen = false } = options || {};
  if (!forceOpen) return;
  const app = plugin.app;
  try {
    const body = String(SHORTCUTS_GUIDE_RAW || "").trim() || "见设置 → 快捷指令。\n";
    const content = body.endsWith("\n") ? body : body + "\n";
    let file = null;
    for (const p of SHORTCUTS_GUIDE_CANDIDATES) {
      const hit = app.vault.getAbstractFileByPath(p);
      if (hit) { file = hit; break; }
    }
    if (!file) {
      const byName = (app.vault.getMarkdownFiles?.() || []).find((f) => f.basename === "BrainCore快捷指令使用指南");
      if (byName) file = byName;
    }
    if (!file) {
      file = await app.vault.create(SHORTCUTS_GUIDE_PATH, content);
    } else {
      const old = await app.vault.read(file);
      if (old.trim() !== content.trim()) {
        await app.vault.modify(file, content);
      }
    }
    if (file && typeof plugin.openMarkdownInMainTab === "function") {
      await plugin.openMarkdownInMainTab(file);
    }
  } catch (e) {
    console.warn("BrainCore 快捷指令说明打开失败：", e);
    new Notice("无法打开快捷指令使用说明");
  }
}

// ─── BrainCore settings tab layout (align with 纪念日 / BrainCore) ─────────

const BC_SETTINGS_STYLE_ID = "bc-settings-compact-styles-v6";
const BC_MOBILE_TOP_INSET_PX = 41;
const BC_MOBILE_TOP_SPACER_CLASS = "bc-mobile-top-spacer";

function getBcEditionLabel() {
  if (typeof getEditionDisplayName === "function") {
    const n = getEditionDisplayName();
    if (n) return n;
  }
  if (typeof isTrialEdition === "function" && isTrialEdition()) return "体验版";
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
  document.querySelectorAll('[id^="bc-settings-compact-styles"]').forEach((el) => el.remove());
  const st = document.createElement("style");
  st.id = BC_SETTINGS_STYLE_ID;
  st.textContent = `
.bc-settings-compact h2.bc-settings-page-title {
  margin: 0 0 14px !important;
  padding: 0 !important;
  text-align: left !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  line-height: 1.35 !important;
}
.bc-settings-mobile .bc-settings-page-title { display: none !important; }
.bc-settings-intro {
  margin: 0 0 12px !important;
  padding: 0 !important;
  font-size: 12px !important;
  line-height: 1.55 !important;
  color: var(--text-muted) !important;
  opacity: 1 !important;
  text-indent: 2em !important;
}
.bc-settings-compact .bc-settings-block h3 {
  margin: 0 0 4px !important;
  padding: 0 !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  line-height: 1.35 !important;
  color: var(--text-normal) !important;
}
.bc-settings-compact .bc-settings-block > h4 {
  margin: 0 0 8px !important;
  padding: 12px 0 0 !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  line-height: 1.3 !important;
  letter-spacing: 0.04em !important;
  color: var(--text-muted) !important;
  opacity: 1 !important;
  border-top: 1px solid var(--background-modifier-border) !important;
}
.bc-settings-compact .bc-settings-block > p.setting-item-description + h4,
.bc-settings-compact .bc-settings-block > h3 + h4 {
  margin-top: 6px !important;
  padding-top: 0 !important;
  border-top: none !important;
}
.bc-settings-compact .bc-settings-tab-bar {
  display: flex !important;
  flex-wrap: nowrap !important;
  gap: 6px !important;
  width: 100% !important;
  margin: 0 0 14px !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  justify-content: stretch !important;
}
.bc-settings-compact .bc-settings-tab-bar.is-many-tabs {
  flex-wrap: wrap !important;
}
.bc-settings-compact .bc-settings-tab-bar button {
  flex: 1 1 0 !important;
  min-width: 0 !important;
  width: auto !important;
  text-align: center !important;
  padding: 8px 6px !important;
  border-radius: 8px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  box-sizing: border-box !important;
  white-space: nowrap !important;
  color: var(--text-normal) !important;
  background: var(--background-secondary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  box-shadow: none !important;
}
.bc-settings-compact .bc-settings-tab-bar button:not(.mod-cta) {
  background: var(--background-secondary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  color: var(--text-normal) !important;
}
.bc-settings-compact .bc-settings-tab-bar button.mod-cta {
  font-weight: 700 !important;
  background: color-mix(in srgb, var(--lifeos-accent, #b48246) 36%, var(--background-primary)) !important;
  border: 1px solid transparent !important;
  color: #6b4f3a !important;
}
.theme-dark .bc-settings-compact .bc-settings-tab-bar button.mod-cta {
  background: color-mix(in srgb, var(--lifeos-accent, #d4a574) 42%, var(--background-primary)) !important;
  color: #f4e6d8 !important;
}
.bc-settings-compact .bc-settings-tab-bar.is-many-tabs button {
  font-size: 12px !important;
  padding: 8px 3px !important;
}
.bc-settings-compact button:active:not(:disabled),
.bc-settings-compact .clickable-icon:active {
  transform: scale(0.97);
  transition: transform 80ms ease;
}
@media (prefers-reduced-motion: reduce) {
  .bc-settings-compact button:active:not(:disabled),
  .bc-settings-compact .clickable-icon:active {
    transform: none;
    transition: none;
  }
}
.bc-settings-compact .bc-settings-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 0;
  padding-bottom: 20px;
}
.bc-settings-compact .bc-settings-block {
  margin: 0;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid var(--background-modifier-border);
  box-sizing: border-box;
  overflow: visible;
}
.bc-settings-compact .bc-settings-block > p.setting-item-description {
  margin: 0 0 10px !important;
  padding: 0 !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  color: var(--text-muted) !important;
  opacity: 1 !important;
}
.bc-settings-compact .bc-settings-section-hint {
  display: block !important;
  margin: 0 0 8px !important;
  padding: 0 !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  color: var(--text-muted) !important;
  opacity: 1 !important;
  white-space: pre-wrap;
  word-break: break-word;
  text-indent: 2em !important;
}
.bc-settings-compact .bc-settings-locked-hint {
  margin: -6px 0 12px !important;
  padding: 0 !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  color: var(--text-muted) !important;
  text-indent: 2em !important;
}
.bc-settings-compact .bc-settings-status-line {
  margin: 8px 0 0 !important;
  padding: 0 !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  color: var(--lifeos-accent) !important;
}
.bc-settings-compact .bc-license-fp-row {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
  margin: 6px 0 8px;
}
.bc-settings-compact .bc-license-fp-input {
  flex: 1;
  min-width: 160px;
  font-family: monospace;
  font-size: 11px;
  padding: 5px 8px;
  border-radius: 6px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  color: var(--text-normal);
}
.bc-settings-compact .bc-settings-inline-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.bc-settings-compact .bc-settings-inline-actions button {
  padding: 5px 14px;
}
.bc-settings-compact .bc-settings-foot {
  margin: 4px 0 0;
  padding: 0 0 8px;
}
.bc-settings-compact .bc-settings-foot p {
  margin: 0 0 4px !important;
  font-size: 12px !important;
  line-height: 1.45 !important;
  color: var(--text-muted) !important;
}
.bc-settings-compact .bc-settings-danger-block .setting-item-name {
  color: var(--text-error) !important;
}
.bc-settings-compact .setting-item {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 12px !important;
  padding: 9px 0 !important;
  margin: 0 !important;
  width: 100%;
  box-sizing: border-box;
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  border-bottom: 1px solid var(--background-modifier-border) !important;
}
.bc-settings-compact .bc-settings-block .setting-item:last-child {
  border-bottom: none !important;
}
.bc-settings-compact .setting-item-info {
  flex: 0 0 88px !important;
  width: 88px !important;
  min-width: 88px !important;
  max-width: 88px !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  align-self: center !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  overflow: visible !important;
}
.bc-settings-compact .setting-item-name {
  font-size: 14px !important;
  font-weight: 500 !important;
  line-height: 1.3 !important;
  padding: 0 !important;
  white-space: nowrap !important;
  overflow: visible !important;
  text-overflow: clip !important;
  color: var(--text-normal) !important;
}
.bc-settings-compact .setting-item .setting-item-description {
  display: none !important;
}
.bc-settings-compact .bc-settings-rich-block .setting-item .setting-item-description {
  display: block !important;
  font-size: 11px !important;
  margin-top: 2px !important;
  color: var(--text-muted) !important;
}
.bc-settings-compact .bc-settings-rich-block .setting-item-info {
  flex: 1 1 auto !important;
  width: auto !important;
  min-width: 0 !important;
  max-width: none !important;
}
.bc-settings-compact .setting-item-control {
  flex: 1 1 auto !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-end !important;
  gap: 8px !important;
  margin: 0 !important;
  padding: 0 !important;
  width: auto !important;
  min-width: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  align-self: center !important;
}
.bc-settings-compact .setting-item-control input[type="text"],
.bc-settings-compact .setting-item-control input[type="number"] {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  min-height: 34px !important;
  padding: 7px 10px !important;
  box-sizing: border-box !important;
  background: var(--background-secondary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 8px !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
  font-size: 14px !important;
}
.bc-settings-compact .setting-item-control .checkbox-container {
  flex-shrink: 0 !important;
  margin: 0 !important;
}
.bc-settings-compact .setting-item-control textarea,
.bc-settings-compact .bc-settings-textarea-row .setting-item-control textarea {
  flex: 1 1 auto !important;
  width: 100% !important;
  min-width: 0 !important;
  min-height: 72px !important;
  padding: 8px 10px !important;
  box-sizing: border-box !important;
  background: var(--background-secondary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 8px !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
  font-size: 14px !important;
  line-height: 1.45 !important;
  resize: vertical !important;
}
.bc-settings-compact .bc-settings-textarea-row,
.bc-settings-compact .setting-item:has(textarea) {
  align-items: center !important;
}
.bc-settings-compact .bc-settings-textarea-row .setting-item-info,
.bc-settings-compact .setting-item:has(textarea) .setting-item-info,
.bc-settings-compact .bc-settings-textarea-row .setting-item-control,
.bc-settings-compact .setting-item:has(textarea) .setting-item-control {
  align-self: center !important;
}
.bc-settings-compact .bc-settings-action-only {
  justify-content: flex-end !important;
  gap: 0 !important;
  padding-top: 4px !important;
  padding-bottom: 10px !important;
}
.bc-settings-compact .bc-settings-action-only .setting-item-info {
  display: none !important;
}
.bc-settings-compact .bc-settings-action-only .setting-item-control {
  flex: 1 1 auto !important;
  width: 100% !important;
  justify-content: flex-end !important;
}
.bc-settings-compact .bc-settings-action-only button {
  min-height: 34px !important;
  padding: 7px 14px !important;
  border-radius: 8px !important;
}
.bc-settings-mobile {
  padding-top: 0 !important;
  padding-inline: max(12px, env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px)) !important;
  padding-bottom: max(16px, env(safe-area-inset-bottom, 0px)) !important;
  box-sizing: border-box !important;
}
.${BC_MOBILE_TOP_SPACER_CLASS} {
  display: block;
  flex-shrink: 0;
  width: 100%;
  height: ${BC_MOBILE_TOP_INSET_PX}px;
  min-height: ${BC_MOBILE_TOP_INSET_PX}px;
  pointer-events: none;
}
.bc-settings-mobile .${BC_MOBILE_TOP_SPACER_CLASS} {
  margin-bottom: 0;
}
.is-mobile .vertical-tab-content.bc-settings-mobile-host,
.is-mobile .vertical-tab-content-container.bc-settings-mobile-host {
  padding-top: env(safe-area-inset-top, 0px) !important;
  box-sizing: border-box !important;
}
.bc-settings-mobile .bc-settings-tab-bar {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 6px !important;
  width: 100% !important;
  margin-top: 8px !important;
  margin-bottom: 14px !important;
  justify-content: stretch !important;
  overflow: visible !important;
}
.bc-settings-mobile .bc-settings-tab-bar button {
  flex: 1 1 calc(33.333% - 6px) !important;
  min-width: 72px !important;
  width: auto !important;
  text-align: center !important;
  padding: 8px 4px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  white-space: nowrap !important;
}
.bc-settings-mobile .bc-settings-tab-bar button.mod-cta {
  font-weight: 700 !important;
  background: color-mix(in srgb, var(--lifeos-accent, #b48246) 36%, var(--background-primary)) !important;
  border: 1px solid transparent !important;
  color: #6b4f3a !important;
}
.theme-dark .bc-settings-mobile .bc-settings-tab-bar button.mod-cta {
  background: color-mix(in srgb, var(--lifeos-accent, #d4a574) 42%, var(--background-primary)) !important;
  color: #f4e6d8 !important;
}
.bc-settings-mobile .bc-settings-tab-bar.is-many-tabs button {
  flex: 1 1 calc(33.333% - 6px) !important;
  font-size: 12px !important;
  padding: 8px 4px !important;
}
.bc-settings-compact .bc-settings-block-collapsible {
  padding: 0 !important;
  overflow: hidden;
}
.bc-settings-compact .bc-settings-block-collapsible .bc-settings-block-head {
  padding: 14px 16px 12px;
  cursor: pointer;
  user-select: none;
}
.bc-settings-compact .bc-settings-block-collapsible .bc-settings-block-head:hover {
  background: var(--background-modifier-hover);
}
.bc-settings-compact .bc-settings-block-collapsible .bc-settings-block-head h3 {
  margin: 0 !important;
  display: inline;
  font-size: 16px !important;
}
.bc-settings-compact .bc-settings-block-collapsible .bc-settings-block-head > p.setting-item-description {
  margin: 4px 0 0 !important;
  padding-left: 18px;
}
.bc-settings-compact .bc-settings-block-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.bc-settings-compact .bc-settings-block-chevron {
  flex-shrink: 0;
  width: 14px;
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1;
}
.bc-settings-compact .bc-settings-block-collapsible .bc-settings-block-body {
  padding: 0 16px 14px;
}
.bc-settings-compact .bc-settings-block-collapsible .bc-settings-block-body.hidden {
  display: none !important;
}
.bc-settings-compact .bc-settings-block-collapsible:not(.open) .bc-settings-block-head > p.setting-item-description {
  display: none !important;
}
.bc-settings-compact .bc-settings-locked-hint {
  margin: -6px 0 12px !important;
  padding: 0 !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  color: var(--text-muted) !important;
  text-indent: 2em !important;
}
.bc-settings-compact .bc-am-section-hint {
  display: block !important;
  margin: 0 0 8px !important;
  padding: 0 !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  color: var(--text-muted) !important;
  text-indent: 2em !important;
}
.bc-settings-compact .bc-habits-config { margin-top: 4px; display: flex; flex-direction: column; gap: 0; }
.bc-settings-compact .bc-habit-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--background-modifier-border); }
.bc-settings-compact .bc-habit-fields { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
.bc-settings-compact .bc-habit-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; margin-left: auto; }
.bc-settings-compact .bc-habit-drag { cursor: grab; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; color: var(--text-muted); touch-action: none; }
.bc-settings-compact .bc-habit-icon-input {
  width: 70px !important;
  min-width: 70px !important;
  box-sizing: border-box !important;
  text-align: center;
  font-size: 14px !important;
  line-height: 1.2 !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 8px !important;
  background: var(--background-secondary) !important;
  padding: 6px 4px !important;
}
.bc-settings-compact .bc-habit-name-input { flex: 1; min-width: 0; border: none !important; background: transparent !important; font-size: 14px !important; font-weight: 500 !important; }
.bc-settings-compact .bc-habit-del-btn { width: 32px; height: 32px; border: none !important; background: transparent !important; color: var(--text-muted) !important; cursor: pointer; border-radius: 6px; }
.bc-settings-compact .bc-habit-add-row { display: flex; align-items: center; justify-content: center; border: 1.5px dashed var(--background-modifier-border); border-radius: 8px; padding: 10px; margin-top: 12px; cursor: pointer; color: var(--text-muted) !important; font-size: 12px !important; font-weight: 600; }
.bc-settings-compact .bc-habit-io-section { margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--background-modifier-border); }
.bc-settings-compact .bc-habit-io-label { margin: 0 0 10px !important; font-size: 11px !important; font-weight: 700 !important; color: var(--text-muted) !important; }
.bc-settings-compact .bc-habit-io-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.bc-settings-compact .bc-habit-io-btn { min-height: 40px; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--background-modifier-border); background: var(--background-secondary); font-size: 14px !important; cursor: pointer; width: 100%; box-sizing: border-box; }
.bc-settings-compact .bc-sortable-list .setting-item-info { flex: 1 1 auto !important; width: auto !important; min-width: 0 !important; max-width: none !important; }
.bc-settings-compact .bc-module-drag { cursor: grab; color: var(--text-muted); touch-action: none; padding: 4px; }
.bc-settings-mobile .bc-habit-io-row { grid-template-columns: 1fr; gap: 10px; }
`;
  document.head.appendChild(st);
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
  block.createEl("h3", { text: title });
  if (desc) {
    block.createEl("p", { cls: "setting-item-description", text: desc });
  }
  return block;
}

function addBcSubgroupTitle(block, title) {
  block.createEl("h4", { text: title });
}

function createBcCollapsibleBlock(parent, plugin, sectionId, title, desc, buildBody, opts = {}) {
  const uiSections = plugin.settings.uiState?.settingsSections || {};
  let expanded = uiSections[sectionId];
  if (expanded === undefined) expanded = opts.defaultExpanded !== false;
  if (opts.forceOpen) expanded = true;

  const block = parent.createDiv({
    cls: "bc-settings-block bc-settings-block-collapsible" + (expanded ? " open" : ""),
  });
  block.setAttr("data-settings-section", sectionId);

  const head = block.createDiv({ cls: "bc-settings-block-head clickable" });
  head.setAttr("role", "button");
  head.setAttr("tabindex", "0");
  head.setAttr("aria-expanded", expanded ? "true" : "false");

  const titleRow = head.createDiv({ cls: "bc-settings-block-title-row" });
  titleRow.createSpan({ cls: "bc-settings-block-chevron", text: expanded ? "▾" : "▸" });
  titleRow.createEl("h3", { text: title });
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
    const chev = head.querySelector(".bc-settings-block-chevron");
    if (chev) chev.setText(open ? "▾" : "▸");
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
    panels[t.id].style.display = "none";
  });

  const showTab = (id) => {
    tabDefs.forEach((t) => {
      panels[t.id].style.display = t.id === id ? "block" : "none";
    });
    tabBar.querySelectorAll("button").forEach((btn) => {
      const active = btn.dataset.tab === id;
      btn.toggleClass("mod-cta", active);
      btn.setAttr("aria-selected", active ? "true" : "false");
    });
  };

  tabDefs.forEach((t) => {
    const btn = tabBar.createEl("button", { text: t.label });
    btn.dataset.tab = t.id;
    btn.setAttr("role", "tab");
    btn.setAttr("id", `bc-tab-${t.id}`);
    btn.setAttr("aria-controls", `bc-panel-${t.id}`);
    btn.setAttr("aria-selected", "false");
    btn.addEventListener("click", () => showTab(t.id));
  });

  const startId = initialTabId && tabDefs.some((t) => t.id === initialTabId)
    ? initialTabId
    : tabDefs[0]?.id;
  if (startId) showTab(startId);

  return { tabBar, panels, showTab };
}

const { Plugin, ItemView, WorkspaceLeaf, Modal, Notice, Menu, debounce, PluginSettingTab, Setting, requestUrl, Platform, TFile, normalizePath, FuzzySuggestModal } = require('obsidian');

const PLUGIN_VERSION = "3.2.4";
const PLUGIN_WEEKLY_PROFILE = "commercial";
const PLUGIN_TRIAL_HOURS = 0;
const PLUGIN_LICENSE_REQUIRED = true;
const PLUGIN_DISPLAY_NAME = "BrainCore LifeOS";
const PLUGIN_INTRO = "这是一个专为 Obsidian 开发的生活管理控制台。";
const PLUGIN_PHILOSOPHY_SUBTITLE = "Obsidian 知识库的「核心呼吸机」，它由 7 大模块组成，涵盖了时间感知、极速收集、工作流转、习惯养成与知识内化。一切信息从这里输入，最终也会在这里沉淀。";
const LICENSE_FINGERPRINT_LABEL = "设备指纹";
const LICENSE_FINGERPRINT_HINT = "基于 Obsidian appId，本设备一次激活永久有效（兼容旧版库名激活码）";

function getLifeOsVaultKey(app, suffix) {
    const vaultName = app.vault?.getName?.() || "UnknownVault";
    return `lifeos:${vaultName}:${suffix}`;
}

function maybeShowLifeOsSuitePrompt(app, selfId, selfName) {
    const catalog = [
        { id: "plain-ledger", name: "PlainLedger" },
        { id: "jinianri", name: "纪念日" },
        { id: "braincore-lifeos", name: "BrainCore LifeOS" },
    ];
    const plugins = app.plugins?.plugins || {};
    const peers = catalog.filter((p) => p.id !== selfId && plugins[p.id]).map((p) => p.name);
    if (!peers.length) return;
    const storageKey = getLifeOsVaultKey(app, "suitePromptSeen");
    try { if (localStorage.getItem(storageKey) === "1") return; } catch (e) { /* ignore */ }
    window.setTimeout(() => {
        new Notice(`${selfName} 可与 ${peers.join("、")} 并排使用，数据均保存在同一 Obsidian 库内。`, 8000);
        try { localStorage.setItem(storageKey, "1"); } catch (e) { /* ignore */ }
    }, 2200);
}

function appendLifeOsSettingsFamilyFoot(container) {
    /* 已迁移至「关于」Tab，见 renderLifeOsFamilyFoot */
}

const BC_REFRESH_SCOPE_RANK = { light: 0, stats: 1, tasks: 2, full: 3 };

function bcMoment(input) {
    const m = window.moment;
    if (m) return input !== undefined ? m(input) : m();
    const d = input ? new Date(input) : new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const isoWeek = () => {
        const t = new Date(d.getTime());
        t.setHours(0, 0, 0, 0);
        t.setDate(t.getDate() + 3 - (t.getDay() + 6) % 7);
        const week1 = new Date(t.getFullYear(), 0, 4);
        return 1 + Math.round(((t - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    };
    const api = {
        _d: d,
        format(pat) {
            if (pat === "YYYY-MM-DD") return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
            if (pat === "MM-DD") return `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
            if (pat === "YYYYMMDDHH") return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}`;
            if (pat === "dd") return ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][d.getDay()];
            return d.toISOString();
        },
        isoWeek,
        startOf() { return api; },
        subtract() { return api; },
        clone() { return bcMoment(d); },
    };
    return api;
}

function getDefaultWeeklySectionNames() {
    if (PLUGIN_WEEKLY_PROFILE === "personal") {
        return { todo: "本周待办", meeting: "部门会议", weekly: "周例会", daily: "每日追踪" };
    }
    return { todo: "本周待办", meeting: "本周目标", weekly: "本周复盘", daily: "每日追踪" };
}

function getWeeklySectionNames(settings) {
    const defs = getDefaultWeeklySectionNames();
    return {
        todo: String(settings?.weeklySectionTodo || defs.todo).trim() || defs.todo,
        meeting: String(settings?.weeklySectionMeeting || defs.meeting).trim() || defs.meeting,
        weekly: String(settings?.weeklySectionWeekly || defs.weekly).trim() || defs.weekly,
        daily: String(settings?.weeklySectionDaily || defs.daily).trim() || defs.daily
    };
}

function escapeRegex(str) {
    return String(str || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getWeeklyTodoHeadingRegex(sectionTodo) {
    const name = escapeRegex(sectionTodo || "本周待办");
    return new RegExp(`^(?:##\\s*${name}|##\\s*周待办)`);
}

function getWeeklyColorFields(settings) {
    const s = getWeeklySectionNames(settings || {});
    return [
        { key: "colorTodo", label: s.todo },
        { key: "colorMeeting", label: s.meeting },
        { key: "colorWeekly", label: s.weekly },
        { key: "colorDaily", label: s.daily }
    ];
}

async function copyTextToClipboard(text) {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(String(text || ""));
            return true;
        }
    } catch (e) { /* ignore */ }
    return false;
}

function isLinkEmbedAvailable(app) {
    return !!(app?.plugins?.plugins?.["link-embed"] || app?.plugins?.plugins?.["obsidian-link-embed"]);
}

function countVaultTags(app) {
    try {
        const tagMap = app.metadataCache?.getTags?.();
        if (tagMap && typeof tagMap === "object") return Object.keys(tagMap).length;
    } catch (e) { /* ignore */ }
    return 0;
}

/** 读取库内 Obsidian 系统标签（与 metadataCache / 标签面板同源） */
function listVaultTags(app) {
    try {
        const tagMap = app.metadataCache?.getTags?.() || {};
        return Object.entries(tagMap)
            .map(([key, count]) => ({
                tag: String(key || "").replace(/^#/, "").trim(),
                count: Number(count) || 0,
            }))
            .filter((x) => x.tag)
            .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh"));
    } catch (e) {
        return [];
    }
}

function openGlobalSearchQuery(app, query) {
    try {
        const searchPlugin = app.internalPlugins.getPluginById("global-search");
        if (searchPlugin?.instance?.openGlobalSearch) {
            searchPlugin.instance.openGlobalSearch(query);
            return true;
        }
    } catch (e) { /* ignore */ }
    try {
        app.commands.executeCommandById("global-search:open");
    } catch (e2) { /* ignore */ }
    return false;
}

async function revealObsidianTagPane(app) {
    try {
        const existing = app.workspace.getLeavesOfType("tag");
        if (existing?.length) {
            app.workspace.revealLeaf(existing[0]);
            return true;
        }
        const leaf = app.workspace.getRightLeaf(false) || app.workspace.getLeftLeaf(false);
        if (leaf?.setViewState) {
            await leaf.setViewState({ type: "tag", active: true });
            return true;
        }
    } catch (e) { /* ignore */ }
    return false;
}

function openVaultTagsBrowser(app) {
    const entries = listVaultTags(app);
    // 仅用自定义 Modal（带过滤），不再同时唤起系统标签面板，避免双开干扰
    const modal = new Modal(app);
    modal.titleEl.setText(`库内标签（${entries.length}）`);
    modal.containerEl.addClass("bc-tag-browser-modal");
    const tip = modal.contentEl.createDiv({ cls: "setting-item-description bc-tag-browser-tip" });
    tip.setText("与 Obsidian 系统标签同源。可过滤；点击某一标签在全局搜索中查看引用。");
    const filter = modal.contentEl.createEl("input", {
        type: "search",
        cls: "bc-tag-browser-filter",
        attr: {
            placeholder: "过滤标签…",
            "aria-label": "过滤标签",
            autocomplete: "off",
        },
    });
    const wrap = modal.contentEl.createDiv({ cls: "bc-tag-browser-list" });
    const emptyEl = wrap.createDiv({
        text: "暂无标签。在笔记中写入 #标签名 后会出现在这里。",
        cls: "setting-item-description bc-tag-browser-empty",
    });
    emptyEl.toggleClass("hidden", entries.length > 0);

    const renderList = (query) => {
        const q = String(query || "").replace(/^#+/, "").trim().toLowerCase();
        wrap.querySelectorAll(".bc-tag-browser-item").forEach((el) => el.remove());
        const matched = q
            ? entries.filter((x) => x.tag.toLowerCase().includes(q))
            : entries;
        emptyEl.setText(
            entries.length
                ? (matched.length ? "" : "没有匹配的标签")
                : "暂无标签。在笔记中写入 #标签名 后会出现在这里。"
        );
        emptyEl.toggleClass("hidden", matched.length > 0);
        matched.forEach(({ tag, count }) => {
            const item = wrap.createDiv({ cls: "bc-tag-browser-item" });
            item.createSpan({ text: `#${tag}`, cls: "bc-tag-browser-name" });
            item.createSpan({ text: String(count), cls: "bc-tag-browser-count" });
            item.onclick = () => {
                openGlobalSearchQuery(app, `tag:#${tag}`);
                modal.close();
            };
        });
    };

    filter.addEventListener("input", () => renderList(filter.value));
    renderList("");
    modal.open();
    window.setTimeout(() => filter.focus(), 40);
}

class VaultTagSuggestModal extends FuzzySuggestModal {
    constructor(app, onChoose) {
        super(app);
        this._onChoose = onChoose;
        this.setPlaceholder("输入新建标签，或搜索库内标签…");
        this.limit = 80;
    }

    normalizeQuery(query) {
        return String(query || "").replace(/^#+/, "").trim();
    }

    getItems() {
        return listVaultTags(this.app);
    }

    getItemText(item) {
        if (item?.isNew) {
            return item.tag ? `新建 #${item.tag}` : "新建标签…（先在上方输入名称）";
        }
        return `#${item.tag}  · ${item.count}`;
    }

    getSuggestions(query) {
        const q = this.normalizeQuery(query);
        const lower = q.toLowerCase();
        const existing = listVaultTags(this.app);
        const matched = (q
            ? existing.filter((x) => x.tag.toLowerCase().includes(lower))
            : existing
        ).map((item) => ({ item, match: { score: 0, matches: [] } }));

        // 第一项始终是「新建」；已有同名则提示选用库内项
        const exactExists = q && existing.some((x) => x.tag.toLowerCase() === lower);
        const createItem = {
            item: {
                tag: q,
                count: 0,
                isNew: true,
                exactExists: !!exactExists,
            },
            match: { score: -1e9, matches: [] },
        };
        return [createItem, ...matched];
    }

    renderSuggestion(value, el) {
        el.empty();
        const item = value?.item;
        if (!item) return;
        if (item.isNew) {
            el.addClass("bc-tag-suggest-new");
            const title = item.tag
                ? (item.exactExists ? `使用已有 #${item.tag}` : `新建 #${item.tag}`)
                : "新建标签…（先在上方输入名称）";
            el.createDiv({ text: title, cls: "suggestion-title" });
            el.createDiv({
                text: item.tag
                    ? (item.exactExists ? "库内已有同名标签，将直接插入" : "写入笔记后即成为 Obsidian 系统标签")
                    : "输入名称后回车即可新建",
                cls: "suggestion-note",
            });
            return;
        }
        el.createDiv({ text: `#${item.tag}`, cls: "suggestion-title" });
        el.createDiv({ text: `引用 ${item.count} 次`, cls: "suggestion-note" });
    }

    selectSuggestion(value, evt) {
        const item = value?.item;
        if (item?.isNew && !item.tag) {
            new Notice("请先输入要新建的标签名");
            this.inputEl?.focus();
            return;
        }
        super.selectSuggestion(value, evt);
    }

    onChooseItem(item) {
        if (!item) return;
        if (item.isNew) {
            if (!item.tag) return;
            this._onChoose?.(item.tag);
            return;
        }
        if (item.tag) this._onChoose?.(item.tag);
    }
}

function pickVaultTag(app, onChoose) {
    new VaultTagSuggestModal(app, onChoose).open();
}

function buildWeeklyTemplateStyleBlock(colors, sections) {
    const { colorTodo, colorMeeting, colorWeekly, colorDaily } = colors;
    const s = sections || getDefaultWeeklySectionNames();
    const meetingSelector = `h2[data-heading*="${s.meeting.replace(/"/g, '\\"')}"]`;
    const weeklySelector = `h2[data-heading*="${s.weekly.replace(/"/g, '\\"')}"]`;
    const todoSelector = `h2[data-heading*="${s.todo.replace(/"/g, '\\"')}"]`;
    const dailySelector = `h2[data-heading*="${s.daily.replace(/"/g, '\\"')}"]`;
    return `
        .braincore-weekly .metadata-container { display: none !important; }
        .braincore-weekly .metadata-content { display: none !important; }
        .braincore-weekly .cm-line.HyperMD-header-2, .braincore-weekly .cm-line.HyperMD-header-3 {padding:0.8em 10px 5px 10px;border-radius:4px;margin-top:0 !important;display:block;color:var(--text-normal);width:100%;box-sizing:border-box;}
        .braincore-weekly .cm-line.HyperMD-header-2 .cm-strong {font-weight:inherit;}
        .braincore-weekly .cm-line.HyperMD-header-2 .cm-em {font-style:normal;}
        .braincore-weekly .cm-line.HyperMD-header-2 { position: relative !important; z-index: 1; background-color: transparent !important; }
        .braincore-weekly .cm-line.HyperMD-header-2:not(:has(.cm-strong)):not(:has(.cm-em))::before { content: ""; position: absolute; top: 0.8em; left: 0; right: 0; bottom: 0; background-color: ${colorTodo} !important; border-radius: 4px; z-index: -1; }
        .braincore-weekly .cm-line.HyperMD-header-2:has(.cm-strong):not(:has(.cm-em))::before { content: ""; position: absolute; top: 0.8em; left: 0; right: 0; bottom: 0; background-color: ${colorMeeting} !important; border-radius: 4px; z-index: -1; }
        .braincore-weekly .cm-line.HyperMD-header-2:has(.cm-em):not(:has(.cm-strong))::before { content: ""; position: absolute; top: 0.8em; left: 0; right: 0; bottom: 0; background-color: ${colorDaily} !important; border-radius: 4px; z-index: -1; }
        .braincore-weekly .cm-line.HyperMD-header-2:has(.cm-strong):has(.cm-em)::before { content: ""; position: absolute; top: 0.8em; left: 0; right: 0; bottom: 0; background-color: ${colorWeekly} !important; border-radius: 4px; z-index: -1; }
        .braincore-weekly h2 {padding:5px 10px;margin-top:1em;margin-bottom:.5em;border-radius:4px;color:var(--text-normal);width:100%;display:block}
        .braincore-weekly h2 strong, .braincore-weekly h2 em {font-weight:inherit;font-style:normal;}
        .braincore-weekly ${todoSelector} {background-color:${colorTodo}}
        .braincore-weekly ${meetingSelector} {background-color:${colorMeeting}}
        .braincore-weekly ${weeklySelector} {background-color:${colorWeekly}}
        .braincore-weekly ${dailySelector} {background-color:${colorDaily}}
        .braincore-weekly h3[data-heading="周一"], .braincore-weekly h3[data-heading="周二"], .braincore-weekly h3[data-heading="周三"],
        .braincore-weekly h3[data-heading="周四"], .braincore-weekly h3[data-heading="周五"], .braincore-weekly h3[data-heading="周六"], .braincore-weekly h3[data-heading="周日"],
        .braincore-weekly .cm-line.HyperMD-header-3 {
            background-color: transparent !important;
            border-left: none !important;
            padding-left: 0 !important;
            font-size: 1.1em !important;
            font-weight: bold !important;
            color: var(--text-normal) !important;
            padding-top: 0.8em !important;
            margin-top: 0 !important;
        }
        .braincore-weekly .bc-weekly-nav-wrapper { display: flex !important; justify-content: center !important; align-items: center !important; width: 100% !important; margin: 18px 0 28px 0 !important; padding: 0 !important; }
        .braincore-weekly .bc-weekly-nav-container { border: none !important; background: transparent !important; width: 520px !important; max-width: 90% !important; min-height: 54px !important; display: flex !important; justify-content: center !important; align-items: center !important; gap: 48px !important; box-sizing: border-box !important; padding: 10px 16px !important; flex-wrap: nowrap !important; }
        .braincore-weekly .bc-weekly-nav-container a.internal-link, .braincore-weekly .bc-weekly-nav-container strong, .braincore-weekly .bc-weekly-nav-container span { white-space: nowrap !important; display: inline-block !important; }
        .braincore-weekly .bc-weekly-nav-container a.internal-link { text-decoration: none !important; color: var(--text-muted) !important; font-size: 15px !important; font-weight: 500 !important; }
        .braincore-weekly .bc-weekly-nav-container strong { color: #d65d4e !important; font-weight: bold !important; font-size: 16px !important; letter-spacing: 2px !important; }
        .braincore-weekly .bc-weekly-nav-container span { color: var(--text-muted) !important; opacity: 0.55 !important; font-weight: bold !important; font-size: 14px !important; }
        .braincore-weekly.markdown-preview-view ul.contains-task-list > li.task-list-item,
        .braincore-weekly.markdown-reading-view ul.contains-task-list > li.task-list-item,
        .braincore-weekly.markdown-rendered ul.contains-task-list > li.task-list-item,
        .braincore-weekly.is-live-preview .HyperMD-task-line {
            color: var(--text-normal) !important;
            -webkit-text-fill-color: var(--text-normal) !important;
        }
        .braincore-weekly.markdown-preview-view ol > li,
        .braincore-weekly.markdown-reading-view ol > li,
        .braincore-weekly.markdown-rendered ol > li {
            color: var(--text-normal) !important;
        }
    `;
}
/** @deprecated 已由 PLUGIN_CHANGELOG 按版本展示，保留仅供归档参考 */
const PLUGIN_UPDATE_SECTIONS = [
    {
        title: "一、基础修复与控制台性能",
        items: [
            "修复：删除 CaptureModal 内重复定义的 makeImageName / ensureFolderByPath 方法",
            "修复：周工作模板色块设置生效，从设置页读取颜色并动态注入 CSS",
            "修复：统一周序号计算，控制台问候语与随笔写入均使用 isoWeek",
            "修复：待办列表 HTML 转义，含 <、引号等特殊字符的任务正常显示与点击",
            "优化：收窄 metadataCache 监听，仅在待办/工作/闪念/随笔/草稿/金句相关路径变化时刷新控制台",
            "优化：金句模块 HTML 转义，避免特殊字符破坏侧边栏 DOM",
            "优化：统计历史文件按需写入，数据无变化时不写盘，减少 iCloud 同步",
            "优化：去掉 vault 事件二次延迟刷新，大库侧边栏更流畅"
        ]
    },
    {
        title: "二、网页剪藏",
        items: [
            "新增：捕捉面板「剪藏」支持粘贴 URL，自动抓取网页正文并转为 Markdown 保存",
            "新增：桌面端接入 Defuddle 全文提取引擎（与 Obsidian Web Clipper 同系）",
            "修复：Defuddle 改为懒加载，解决移动端启动时加载大文件导致插件失败",
            "优化：移动端剪藏使用基础解析器；桌面端按需加载 Defuddle，失败自动回退",
            "新增：正文抓取失败时自动生成 Link Embed 卡片（需安装 Link Embed 插件）",
            "修复：备用解析器加粗/斜体无限递归崩溃",
            "优化：剪藏同名文件自动加后缀，支持嵌套目录创建",
            "优化：frontmatter 增加 clip_mode: embed|article 标识"
        ]
    },
    {
        title: "三、授权与激活体验",
        items: [
            "修复：手动修改 data.json 中 licenseActivated 可绕过授权的问题",
            "优化：捕捉、剪藏、归档、BrainCoreAPI 等入口统一校验激活状态",
            "优化：激活引导仅在右侧控制台内完成，不再自动跳转第三方插件设置页",
            "优化：未激活时不再自动弹出设置页遮挡工作区"
        ]
    },
    {
        title: "四、启动与工作区",
        items: [
            "优化：启动时自动关闭误弹的设置页，不再遮挡主编辑区",
            "优化：右侧栏默认聚焦 BrainCore 控制台，清理日历等无关插件标签",
            "优化：打开库时可自动展开并固定右侧 BrainCore 控制台",
            "优化：首次启动可在主编辑区打开《插件使用说明》",
            "优化：右侧栏清理改为增量模式，避免反复 detach 控制台视图"
        ]
    },
    {
        title: "五、捕捉与素材",
        items: [
            "优化：图片/附件默认目录改为 Boxes/附件（可在设置中调整）",
            "修复：保存带图内容时不再触发侧边栏连续屏闪，捕捉框可继续使用",
            "新增：「素材」分类，支持文件/照片，保存前可修改文件名",
            "新增：捕捉七大分类完整支持（工作/生活/闪念/随笔/草稿/素材/剪藏）",
            "新增：已安装 Attachment Management 时，附件按扩展名规则自动分类",
            "新增：保存时按目标笔记（工作/生活/闪念等）套用 AM 路径覆盖规则",
            "优化：素材默认文件名改为「扩展名-日期」或保留原文件名，不再误用 IMG- 前缀",
            "优化：素材保存成功后提示具体路径；含文字说明时写入文件墙索引",
            "优化：引用来源过长时自动截断显示；素材分类仅支持文件，禁止附带文字",
            "优化：未安装 Attachment Management 时提示建议安装，素材统一存 Boxes/附件",
            "修复：素材/附件保存失败时保留待上传文件、不关闭捕捉框",
            "修复：附件部分失败时保留未成功项，并提示「N 个失败 / M 个已成功」",
            "修复：删除附件链接后保存不再静默丢失其余 pending 文件",
            "优化：同名文件已存在时自动重命名并提示",
            "优化：「草稿」分类改为有序列表（1. 2. 3.）保存，不再转为待办 - [ ]",
            "优化：草稿历史引用同步支持有序列表与旧版待办格式"
        ]
    },
    {
        title: "六、iOS 快捷面板与 API",
        items: [
            "优化：iOS 工作周报待办与控制台一致，仅扫描 ## 本周待办 段落",
            "优化：iOS 捕捉分类按钮改为 7 列网格布局",
            "优化：iOS 支持仅上传附件保存，与桌面捕捉行为一致",
            "优化：BrainCoreAPI 待办统计与控制台/iOS 一致（生活待办 + 本周待办段）"
        ]
    },
    {
        title: "七、习惯、随笔与其他模块",
        items: [
            "修复：习惯打卡恢复累计天数，勾选后从 habitData 重新统计",
            "修复：随笔年/月/周标题精确插入，避免重复或错位",
            "修复：未激活控制台「打开操作指南」按钮无效",
            "修复：金句仅读取 Weread「高亮划线」「读书笔记」章节，不再误读「内容简介」",
            "优化：闪念胶囊新增「素材」关键词路由，文字备注写入文件墙",
            "优化：SmartCapsule 与 Capture 样式 ID 分离，胶囊专用样式正常加载",
            "优化：捕捉/胶囊提取共享保存函数，减少重复逻辑",
            "优化：多处空 catch 改为 bcNoticeError / console.warn，便于排查问题"
        ]
    },
    {
        title: "八、更新说明弹窗",
        items: [
            "新增：升级后首次启动弹出更新说明",
            "优化：分组展示全部更新要点，头部标题与底部按钮固定",
            "优化：内容过长时，手机与电脑均可在中部列表区域无痕惯性滑动查看"
        ]
    },
    {
        title: "九、周工作模板校准",
        items: [
            "修复：个人版设置页色块选项与模板一致（本周待办 / 部门会议 / 周例会 / 每日追踪）",
            "修复：商业版设置页色块选项与模板一致（本周待办 / 本周目标 / 每日追踪 / 本周复盘）",
            "修复：部门会议、周例会在编辑与阅读模式下正确着色",
            "优化：二级标题按 Markdown 格式（普通 / 加粗 / 斜体 / 加粗斜体）自动匹配对应色块"
        ]
    },
    {
        title: "十、授权与激活持久化",
        items: [
            "授权：激活码绑定 appId，本设备一次激活永久有效",
            "兼容：仍接受旧版按库名生成的激活码",
            "优化：启动时自动校验已保存激活码，验证通过直接进入控制台"
        ]
    },
    {
        title: "十一、今日文件统计",
        items: [
            "修复：今日累计点击展开时，移动/重命名文件不再误显示为「新建」",
            "修复：移动后立刻改名也能识别，不再算作删除+新增",
            "优化：监听 vault rename 事件并链式合并 A→B→C 重命名",
            "优化：按文件名配对识别移动，列表仅展示净新增/净删除文件",
            "优化：若今日仅发生文件移动，提示「净变化 →0」并说明不计入新增"
        ]
    },
    {
        title: "十二、本周待办层级",
        items: [
            "修复：子层级待办（缩进/Tab）不再显示原始 - [ ] 语法",
            "修复：侧边栏按父子节点树形展示，子任务缩进挂在父任务下",
            "优化：待办统计仅计顶层任务，子任务不再重复计入数量",
            "优化：侧边栏与 iOS 面板按层级缩进展示子任务",
            "修复：侧边栏树形缩进被 CSS 覆盖，子任务现正确挂在父任务下",
            "优化：iOS 快速面板待办同步树形展示，统计悬停提示含子级缩进"
        ]
    },
    {
        title: "十三、iOS 桌面入口",
        items: [
            "新增：obsidian://braincore 独立动作 capture / capsule / archive / recent / tasks",
            "推荐：主屏只放一个入口（action=quick 快速面板）；快捷指令用「打开 URL」即可",
            "新增：Scriptable 桌面待办小组件方案，不打开 Obsidian 即可读库内待办"
        ]
    },
    {
        title: "十四、启动与授权",
        items: [
            "启动：仅展开右侧栏并显示 BrainCore，不再关闭其他已 pin 的侧边栏插件",
            "授权：激活码绑定 appId，一次激活永久有效（兼容旧版库名激活码）",
            "引导：首次启动弹出简要使用说明，点击「知道了」后不再自动弹出"
        ]
    }
];

function extractQuotesFromWereadContent(content, basename, cleanQuoteText, shouldKeepQuote) {
    const quotes = [];
    const lines = String(content || "").split("\n");
    const hasQuoteSections = lines.some((line) => /^##\s*(高亮划线|读书笔记)/.test(line.trim()));
    let inQuoteSection = !hasQuoteSections;

    for (const line of lines) {
        const trimmed = line.trim();
        if (/^##\s+/.test(trimmed)) {
            const title = trimmed.replace(/^##\s+/, "").trim();
            if (/高亮划线|读书笔记/.test(title)) inQuoteSection = true;
            else if (/内容简介|全书评论|书籍简介/.test(title)) inQuoteSection = false;
            else if (hasQuoteSections) inQuoteSection = false;
            continue;
        }
        if (!inQuoteSection || !trimmed.startsWith(">")) continue;
        if (/>\s*\[!INFO\]/i.test(trimmed)) continue;
        if (/书籍简介/.test(trimmed)) continue;

        const qText = cleanQuoteText(line);
        if (shouldKeepQuote(qText)) quotes.push({ t: qText, s: basename });
    }
    return quotes;
}

const VIEW_TYPE_DASHBOARD = "braincore-dashboard-view";
const CLIP_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
let defuddleModule;

function getDefuddleModule() {
    if (defuddleModule !== undefined) return defuddleModule;
    if (Platform.isMobileApp) {
        defuddleModule = null;
        return null;
    }
    try {
        defuddleModule = require('./defuddle.full.js');
    } catch (e) {
        console.error('[BrainCore] Defuddle 加载失败:', e);
        defuddleModule = null;
    }
    return defuddleModule;
}

// 🔐 离线授权：绑定 appId（同设备永久有效），兼容旧版库名激活码
function hashStringToHex(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash).toString(16).toUpperCase();
}

function getDeviceFingerprint(app) {
    if (app?.appId) return "BC-" + hashStringToHex(String(app.appId));
    const vaultName = app.vault?.getName?.() || "UnknownVault";
    return "BC-" + hashStringToHex(String(vaultName));
}

function getVaultID(app) {
    return getDeviceFingerprint(app);
}

function getVaultScopedStorageKey(app, key) {
    return `${key}::${hashStringToHex(String(app.vault?.getName?.() || "default"))}`;
}

function hasExplicitCapsuleRoutePrefix(text) {
    return /^(本周工作待办|工作待办|工作|生活待办|生活|闪念|随笔|剪藏|素材|草稿|客诉|项目|会议|客户|汇报|日记|记得|临时|记一下|文件墙|附件|资源|品牌)[:：\s]/i.test(String(text || "").trim());
}

function isAmbiguousCapsuleRoute(routeType, text) {
    if (routeType === "idea" || routeType === "work") return false;
    if (hasExplicitCapsuleRoutePrefix(text)) return false;
    if (/https?:\/\//.test(text) && routeType === "clipper") return false;
    return true;
}

function isValidHabitData(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
    const entries = Object.entries(obj);
    if (!entries.length) return false;
    return entries.every(([date, day]) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
        if (!day || typeof day !== "object" || Array.isArray(day)) return false;
        const dayEntries = Object.entries(day);
        if (!dayEntries.length) return false;
        return dayEntries.every(([habitId, checked]) => {
            return typeof habitId === "string" && habitId.length > 0 && typeof checked === "boolean";
        });
    });
}

function getCaptureContextFile(app) {
    const active = app.workspace.getActiveFile();
    if (active?.extension === "md") return active;
    for (const leaf of app.workspace.getLeavesOfType("markdown")) {
        const f = leaf.view?.file;
        if (f?.extension === "md") return f;
    }
    const recent = app.workspace.getLastOpenFiles?.() || [];
    for (const p of recent) {
        if (!String(p).endsWith(".md")) continue;
        const f = app.vault.getAbstractFileByPath(p);
        if (f) return f;
    }
    return null;
}

function computeExpectedLicenseKeyFromFingerprint(fp) {
    let hash = 0;
    for (let i = 0; i < fp.length; i++) {
        hash = (hash << 5) - hash + fp.charCodeAt(i);
        hash |= 0;
    }
    return "KEY-" + Math.abs(hash ^ 0x8899).toString(16).toUpperCase();
}

function getExpectedLicenseKeys(app) {
    const keys = new Set();
    keys.add(computeExpectedLicenseKeyFromFingerprint(getDeviceFingerprint(app)));
    const vaultName = app.vault?.getName?.() || "UnknownVault";
    keys.add(computeExpectedLicenseKeyFromFingerprint("BC-" + hashStringToHex(String(vaultName))));
    return keys;
}

function computeExpectedLicenseKey(app) {
    return computeExpectedLicenseKeyFromFingerprint(getVaultID(app));
}

function isLicenseValid(app, key) {
    if (!key || !String(key).trim()) return false;
    const normalized = String(key).trim().toUpperCase();
    for (const expected of getExpectedLicenseKeys(app)) {
        if (normalized === expected) return true;
    }
    return false;
}

/** 旧目录 braincore-dashboard / BrainCore LifeOS → 统一 braincore-lifeos */
async function migrateLegacyBrainCoreInstall(plugin) {
    const NEW_ID = "braincore-lifeos";
    if ((plugin.manifest?.id || NEW_ID) !== NEW_ID) return false;
    const adapter = plugin.app?.vault?.adapter;
    const configDir = plugin.app?.vault?.configDir;
    if (!adapter || !configDir) return false;

    const pluginsDir = `${configDir}/plugins`;
    const newDir = `${pluginsDir}/${NEW_ID}`;
    const newDataPath = `${newDir}/data.json`;
    const legacyDirs = ["braincore-dashboard", "BrainCore LifeOS"];
    let changed = false;

    const dataLooksSparse = (raw) => {
        try {
            const obj = JSON.parse(raw || "{}");
            if (!obj || typeof obj !== "object") return true;
            if (obj.licenseKey || obj.habitData || obj.habitsConfig || obj.pathWork || obj.pathTasks) return false;
            return Object.keys(obj).length < 5;
        } catch (_) {
            return true;
        }
    };

    let shouldCopy = !(await adapter.exists(newDataPath));
    if (!shouldCopy) {
        try {
            shouldCopy = dataLooksSparse(await adapter.read(newDataPath));
        } catch (_) {
            shouldCopy = true;
        }
    }
    if (shouldCopy) {
        for (const legacy of legacyDirs) {
            const legacyData = `${pluginsDir}/${legacy}/data.json`;
            if (!(await adapter.exists(legacyData))) continue;
            try {
                const raw = await adapter.read(legacyData);
                await adapter.write(newDataPath, raw);
                changed = true;
                break;
            } catch (e) {
                console.warn("BrainCore 迁移 data.json 失败:", e);
            }
        }
    }

    const cpPath = `${configDir}/community-plugins.json`;
    if (await adapter.exists(cpPath)) {
        try {
            const list = JSON.parse(await adapter.read(cpPath));
            if (Array.isArray(list)) {
                const next = list.filter((id) => id !== "braincore-dashboard" && id !== "BrainCore LifeOS");
                if (!next.includes(NEW_ID)) next.push(NEW_ID);
                if (JSON.stringify(list) !== JSON.stringify(next)) {
                    await adapter.write(cpPath, JSON.stringify(next, null, 2) + "\n");
                    changed = true;
                }
            }
        } catch (e) {
            console.warn("BrainCore 迁移 community-plugins 失败:", e);
        }
    }

    for (const legacy of legacyDirs) {
        const legacyDir = `${pluginsDir}/${legacy}`;
        if (!(await adapter.exists(legacyDir))) continue;
        try {
            if (typeof adapter.rmdir === "function") {
                await adapter.rmdir(legacyDir, true);
                changed = true;
            }
        } catch (e) {
            console.warn("BrainCore 无法自动删除旧目录", legacy, e);
        }
    }

    return changed;
}

function syncLicenseState(app, settings) {
    const ok = isLicenseValid(app, settings.licenseKey);
    settings.licenseActivated = ok;
    return ok;
}

function isLicenseRequired() {
    return !!PLUGIN_LICENSE_REQUIRED;
}

function isTrialEdition() {
    return PLUGIN_TRIAL_HOURS > 0 && PLUGIN_WEEKLY_PROFILE === "commercial";
}

function getTrialHoursLabel() {
    const h = Number(PLUGIN_TRIAL_HOURS) || 0;
    return h > 0 ? `${h} 小时` : "";
}

function getEditionDisplayName() {
    // 界面三档：体验版 / 公版 / 个人版（公版含需激活与免激活，均按 commercial 显示）
    if (isTrialEdition()) return "体验版";
    if (PLUGIN_WEEKLY_PROFILE === "commercial") return "公版";
    return "个人版";
}

function isCommercialWeeklyProfile() {
    return PLUGIN_WEEKLY_PROFILE === "commercial";
}

function getUsageGuideSummarySection() {
    if (isTrialEdition()) {
        return `## 十四、一句话总结

BrainCore LifeOS 体验版提供 ${getTrialHoursLabel()} 全功能体验，到期激活后永久使用。

它把 **时间进度、快捷捕捉、本周待办、习惯打卡、每日金句、数据统计、周工作模板** 集中到一个固定入口，帮助你的知识库每天持续运转。`;
    }
    if (isCommercialWeeklyProfile()) {
        return `## 十四、一句话总结

BrainCore LifeOS 公版是面向《日拱一卒》等工作库的 Obsidian 侧边栏控制台，${isLicenseRequired() ? "激活后永久使用" : "免激活即可使用"}。

它把 **时间进度、快捷捕捉、本周待办、习惯打卡、每日金句、数据统计、周工作模板** 集中到一个固定入口，帮助你的知识库每天持续运转。`;
    }
    return `## 十四、一句话总结

BrainCore LifeOS 个人版是你的 Obsidian 侧边栏控制台，免激活即可使用。

它把 **时间进度、快捷捕捉、本周待办、习惯打卡、每日金句、数据统计、周工作模板** 集中到一个固定入口，帮助你的知识库每天持续运转。`;
}

function wrapUsageGuideContent(raw) {
    let content = String(raw || "");
    let header;
    if (isTrialEdition()) {
        header = `> **版本：体验版**（${getTrialHoursLabel()} 全功能试用，到期须激活）\n\n`;
    } else if (isCommercialWeeklyProfile()) {
        header = isLicenseRequired()
            ? `> **版本：公版**（需激活后使用，无试用）\n\n`
            : `> **版本：公版**（免激活，周模板为公版工作流）\n\n`;
    } else {
        header = `> **版本：个人版**（免激活，周模板为个人工作流）\n\n`;
    }
    content = header + content;
    content = content.replace(/激活并进入 BrainCore/g, "验证并激活");
    content = content.replace(/立即激活/g, "验证并激活");
    if (!isLicenseRequired()) {
        const editionNoun = isCommercialWeeklyProfile() ? "公版" : "个人版";
        content = content.replace(
            /## 五、首次使用与激活[\s\S]*?(?=\n---\n\n## 六、控制台七大模块总览)/,
            `## 五、首次使用

${editionNoun}**无需激活**。点击左侧 ☁️ 打开 BrainCore 控制台即可开始使用。

---

`
        );
    }
    const marker = "## 十四、一句话总结";
    const idx = content.indexOf(marker);
    if (idx >= 0) content = content.slice(0, idx) + getUsageGuideSummarySection();
    return content;
}

function bcNoticeInfo(msg, duration = 4000) {
    new Notice(String(msg || ""), duration);
}

function bcNoticeSuccess(msg, duration = 4000) {
    new Notice(String(msg || ""), duration);
}

function bcNoticeWarn(msg, duration = 5000) {
    new Notice(String(msg || ""), duration);
}

async function startTrialFromActivationPanel(plugin) {
    if (!isTrialEdition() || plugin.settings.licenseActivated || plugin.settings.trialWelcomeSeen) return;
    plugin.settings.trialWelcomeSeen = true;
    ensureTrialStarted(plugin.app, plugin.settings, true);
    await plugin.saveSettings();
    bcNoticeSuccess(`已开始 ${getTrialHoursLabel()} 试用`);
    plugin.app.workspace.trigger("braincore:refresh");
}

function ensureTrialStarted(app, settings, force = false) {
    if (!isTrialEdition() || syncLicenseState(app, settings)) return;
    if (!force && !settings.trialWelcomeSeen) return;
    const storageKey = getVaultScopedStorageKey(app, "bcTrialStartedAt");
    let started = settings.trialStartedAt || "";
    if (!started) {
        try { started = localStorage.getItem(storageKey) || ""; } catch (e) { /* ignore */ }
    }
    if (!started) {
        started = new Date().toISOString();
        try { localStorage.setItem(storageKey, started); } catch (e) { /* ignore */ }
    }
    if (settings.trialStartedAt !== started) settings.trialStartedAt = started;
}

function getTrialRemainingMs(app, settings) {
    if (!isTrialEdition() || syncLicenseState(app, settings)) return 0;
    ensureTrialStarted(app, settings);
    const started = settings.trialStartedAt;
    if (!started) return 0;
    const elapsed = Date.now() - new Date(started).getTime();
    const total = PLUGIN_TRIAL_HOURS * 60 * 60 * 1000;
    return Math.max(0, total - elapsed);
}

function isTrialActive(app, settings) {
    return isTrialEdition() && getTrialRemainingMs(app, settings) > 0;
}

function isAccessAllowed(app, settings) {
    if (!isLicenseRequired()) return true;
    if (syncLicenseState(app, settings)) return true;
    return isTrialActive(app, settings);
}

function getActivationSuccessMessage() {
    return "激活成功，之后将永久有效";
}

function injectActivationPanelStyles() {
    injectLifeOsActivationStyles();
}

function getBcActivationStatusText(app, settings) {
    if (isTrialEdition() && isTrialActive(app, settings)) {
        return `试用中 · 剩余 ${formatTrialRemaining(getTrialRemainingMs(app, settings))}`;
    }
    if (isTrialEdition() && settings.trialWelcomeSeen && getTrialRemainingMs(app, settings) <= 0) {
        return `${getTrialHoursLabel()}试用已到期，请输入激活码`;
    }
    return "";
}

function mountActivationPanel(container, plugin, options = {}) {
    const { onActivated } = options || {};
    const app = plugin.app;
    const settings = plugin.settings;
    renderLifeOsActivationPanel(container, {
        extraPanelClass: options.compact ? "bcq-activate-shell" : "bc-activate-mode",
        pluginName: PLUGIN_DISPLAY_NAME,
        philosophy: PLUGIN_PHILOSOPHY_SUBTITLE,
        getStatusText: () => getBcActivationStatusText(app, settings),
        showTrialButton: isTrialEdition() && !settings.trialWelcomeSeen && !settings.licenseActivated,
        trialButtonLabel: `开启 ${getTrialHoursLabel()} 试用`,
        firstRunHint: (!isTrialEdition() && typeof PLUGIN_EDITION === "string" && PLUGIN_EDITION === "public" && !settings.licenseActivated)
            ? "第一步：复制下方设备指纹发给作者获取激活码 → 粘贴激活码 → 点「激活」。激活后即可使用。"
            : undefined,
        onTrialStart: () => startTrialFromActivationPanel(plugin),
        getFingerprint: () => getVaultID(app),
        licenseKey: settings.licenseKey,
        activateShortLabel: "验证并激活",
        onCopyFingerprint: async (fp) => {
            const ok = await copyTextToClipboard(fp);
            bcNoticeSuccess(ok ? "设备指纹已复制" : "请手动全选复制指纹");
        },
        onActivate: async (key, msgEl) => {
            if (!key) {
                msgEl.textContent = "请输入激活码";
                msgEl.addClass("error");
                return;
            }
            msgEl.removeClass("error");
            settings.licenseKey = key;
            syncLicenseState(app, settings);
            if (settings.licenseActivated) {
                await plugin.saveSettings();
                bcNoticeSuccess(getActivationSuccessMessage());
                app.workspace.trigger("braincore:refresh");
                if (typeof onActivated === "function") await onActivated();
            } else {
                settings.licenseActivated = false;
                await plugin.saveSettings();
                msgEl.textContent = "激活码不正确，请核对后再试";
                msgEl.addClass("error");
            }
        },
        openUsageGuide: () => plugin.openUsageGuideFile({ forceOpen: true }),
        updateNoticeTarget: plugin,
        openSettings: () => plugin.openBrainCoreSettings({ fromActivation: true }),
    });
}

function formatTrialRemaining(ms) {
    if (ms <= 0) return "已到期";
    const totalMin = Math.ceil(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    if (h > 0) return `${h} 小时 ${m} 分钟`;
    return `${m} 分钟`;
}

function getLicenseGateReason(app, settings) {
    if (syncLicenseState(app, settings)) return "";
    if (isTrialActive(app, settings)) return "trial";
    if (isTrialEdition() && settings.trialStartedAt) return "trial_expired";
    return "inactive";
}

function mergeTodayRenameRegistry(existing, incoming) {
    const merged = Array.isArray(existing) ? existing.map((r) => ({ ...r })) : [];
    for (const item of incoming || []) {
        if (!item?.from || !item?.to) continue;
        const chained = merged.find((r) => r.to === item.from);
        if (chained) chained.to = item.to;
        else merged.push({ from: item.from, to: item.to });
    }
    return merged;
}

function computeTodayFileDelta(basePaths, currentPaths, entityFiles, todayISO, moment, renameRegistry = []) {
    const basePathSet = new Set(basePaths || []);
    const currentPathSet = new Set(currentPaths || []);
    const addedPaths = (currentPaths || []).filter((p) => !basePathSet.has(p));
    const deletedPaths = (basePaths || []).filter((p) => !currentPathSet.has(p));

    const usedDeleted = new Set();
    const usedAdded = new Set();
    const movedPairs = [];

    const pairMove = (from, to, reason) => {
        if (!from || !to || usedDeleted.has(from) || usedAdded.has(to)) return false;
        if (!addedPaths.includes(to) || !deletedPaths.includes(from)) return false;
        usedDeleted.add(from);
        usedAdded.add(to);
        movedPairs.push({ from, to, reason });
        return true;
    };

    for (const added of addedPaths) {
        const baseName = added.split("/").pop();
        const match = deletedPaths.find((d) => !usedDeleted.has(d) && d.split("/").pop() === baseName);
        if (match) pairMove(match, added, "basename");
    }

    for (const { from, to } of renameRegistry || []) {
        pairMove(from, to, "rename-event");
    }

    for (const added of addedPaths) {
        if (usedAdded.has(added)) continue;
        const file = entityFiles.find((f) => f.path === added);
        if (!file?.stat?.ctime || !moment) continue;
        if (moment(file.stat.ctime).format("YYYY-MM-DD") === todayISO) continue;

        const ext = (file.extension || "").toLowerCase();
        const openDeleted = deletedPaths.filter((d) => !usedDeleted.has(d));
        const extDeleted = openDeleted.filter((d) => (d.split(".").pop() || "").toLowerCase() === ext);
        const openAdded = addedPaths.filter((p) => !usedAdded.has(p));

        if (extDeleted.length === 1) {
            pairMove(extDeleted[0], added, "heuristic-ext");
        } else if (openDeleted.length === 1 && openAdded.length === 1) {
            pairMove(openDeleted[0], added, "heuristic-singleton");
        }
    }

    const netAddedPaths = addedPaths.filter((p) => !usedAdded.has(p));
    const netDeletedPaths = deletedPaths.filter((p) => !usedDeleted.has(p));
    const pathDiff = addedPaths.length - deletedPaths.length;
    const displayDiff = netAddedPaths.length - netDeletedPaths.length;

    const netAddedFiles = netAddedPaths
        .map((p) => entityFiles.find((f) => f.path === p))
        .filter(Boolean)
        .sort((a, b) => (b.stat?.ctime || 0) - (a.stat?.ctime || 0));

    const netDeletedFiles = netDeletedPaths
        .map((p) => ({ path: p, extension: (p.split(".").pop() || "").toLowerCase() }))
        .sort((a, b) => a.path.localeCompare(b.path));

    return {
        pathDiff,
        displayDiff,
        addedPaths,
        deletedPaths,
        movedPairs,
        netAddedFiles,
        netDeletedFiles
    };
}

function getTaskIndentDepth(indent) {
    if (!indent) return 0;
    const normalized = String(indent).replace(/\t/g, "    ");
    const depth = Math.floor(normalized.length / 4);
    return depth > 0 ? depth : (normalized.length >= 2 ? 1 : 0);
}

function parsePendingTaskLine(line) {
    const raw = String(line || "");
    const match = raw.match(/^(\s*)(?:>\s*)?(?:-\s|\*\s)\[( )\]\s*(.*)$/);
    if (!match) return null;
    return {
        indent: match[1],
        depth: getTaskIndentDepth(match[1]),
        cleanText: match[3].replace(/<[^>]+>/g, "").trim(),
        text: raw
    };
}

function markTaskLineComplete(line, completed = true) {
    const mark = completed ? "x" : " ";
    return String(line || "").replace(/^(\s*(?:>\s*)?(?:-\s|\*\s))\[[ xX]\]/, `$1[${mark}]`);
}

function extractPendingTasksFromContent(content, filePath, { weeklySectionOnly = false, sectionTodo = "本周待办" } = {}) {
    const lines = String(content || "").split("\n");
    const tasks = [];
    let inSection = !weeklySectionOnly;
    const sectionRe = getWeeklyTodoHeadingRegex(sectionTodo);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.length > 2000) continue;

        if (weeklySectionOnly) {
            if (!inSection && sectionRe.test(line)) {
                inSection = true;
                continue;
            }
            if (inSection && line.match(/^(?:---|## )/)) break;
            if (!inSection) continue;
        }

        const parsed = parsePendingTaskLine(line);
        if (!parsed || !parsed.cleanText) continue;
        tasks.push({
            text: parsed.text,
            lineNum: i,
            lineIndex: i,
            cleanText: parsed.cleanText,
            depth: parsed.depth,
            path: filePath,
            completed: false
        });
    }
    return tasks;
}

function getTaskLineOrder(task) {
    return Number.isFinite(task?.lineNum) ? task.lineNum : (Number.isFinite(task?.lineIndex) ? task.lineIndex : 0);
}

function buildTaskHierarchy(flatTasks) {
    const sorted = [...flatTasks].sort((a, b) => getTaskLineOrder(a) - getTaskLineOrder(b));
    const roots = [];
    const stack = [];
    for (const task of sorted) {
        const depth = task.depth || 0;
        const node = { ...task, children: [] };
        while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
        if (stack.length === 0) roots.push(node);
        else stack[stack.length - 1].node.children.push(node);
        stack.push({ node, depth });
    }
    return roots;
}

function countRootPendingTasks(flatTasks) {
    return flatTasks.filter((t) => (t.depth || 0) === 0).length;
}

function groupTasksByFileOrder(flatTasks) {
    const orderedPaths = [];
    const groups = new Map();
    for (const t of flatTasks) {
        if (!groups.has(t.path)) {
            groups.set(t.path, []);
            orderedPaths.push(t.path);
        }
        groups.get(t.path).push(t);
    }
    return orderedPaths.map((path) => ({ path, tasks: groups.get(path) }));
}

function renderSidebarTaskNode(node) {
    const safePath = escapeJsString(node.path);
    let html = `<div class="sb-task-item"><div class="sb-task-checkbox" onclick="window.toggleWkTask(event, '${safePath}', ${node.lineNum}, '${encodeURIComponent(node.text)}')" title="点击完成"></div><div class="sb-task-text" onclick="app.workspace.openLinkText('${safePath}', '', false)" title="点击编辑">${escapeHtml(node.cleanText)}</div></div>`;
    if (node.children?.length) {
        html += `<div class="sb-task-children">${node.children.map((child) => renderSidebarTaskNode(child)).join("")}</div>`;
    }
    return html;
}

function renderSidebarTaskForest(flatTasks) {
    return groupTasksByFileOrder(flatTasks)
        .map(({ tasks }) => buildTaskHierarchy(tasks).map((n) => renderSidebarTaskNode(n)).join(""))
        .join("");
}

/** Empty state host: uses shared renderLifeOsEmptyState when bundled. */
function fillBcEmptyState(parent, options = {}) {
    if (!parent) return null;
    if (typeof renderLifeOsEmptyState === "function") {
        return renderLifeOsEmptyState(parent, options);
    }
    if (typeof injectLifeOsSharedStyles === "function") injectLifeOsSharedStyles();
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

function buildTaskForestFromFlat(flatTasks) {
    return groupTasksByFileOrder(flatTasks).flatMap(({ tasks }) => buildTaskHierarchy(tasks));
}

function formatTaskForestForTooltip(flatTasks, limit = 10) {
    const lines = [];
    let count = 0;
    const walk = (node, depth = 0) => {
        if (count >= limit) return;
        lines.push(`${depth ? "  ".repeat(depth) : ""}${node.cleanText || node.text || ""}`);
        count++;
        for (const child of node.children || []) walk(child, depth + 1);
    };
    for (const root of buildTaskForestFromFlat(flatTasks)) walk(root);
    return lines.join("\n");
}

async function collectPendingTasks(app, settings, workFile) {
    const tasks = [];
    const sectionTodo = getWeeklySectionNames(settings).todo;
    const inboxFile = app.vault.getAbstractFileByPath(settings.pathTasks);
    if (inboxFile) {
        try {
            tasks.push(...extractPendingTasksFromContent(await app.vault.read(inboxFile), inboxFile.path));
        } catch (e) {
            console.warn("[BrainCore] 生活待办读取失败:", e);
        }
    }
    if (workFile) {
        try {
            tasks.push(...extractPendingTasksFromContent(await app.vault.read(workFile), workFile.path, { weeklySectionOnly: true, sectionTodo }));
        } catch (e) {
            console.warn("[BrainCore] 工作待办读取失败:", e);
        }
    }
    return tasks;
}

async function ensureFolderByPath(vault, path) {
    if (!path) return;
    const folderPath = path.includes(".") ? path.substring(0, path.lastIndexOf("/")) : path;
    if (!folderPath) return;
    let current = "";
    for (const part of folderPath.split("/").filter(Boolean)) {
        current = current ? `${current}/${part}` : part;
        if (!vault.getAbstractFileByPath(current)) {
            await vault.createFolder(current);
        }
    }
}

function formatAsTask(text, suffix = "") {
    const lines = String(text || "").split('\n');
    const hasListPrefix = /^(\s*)(?:- |\d+\. |\* )/.test(lines[0] || "");
    if (hasListPrefix) {
        return lines.map(line => {
            const match = line.match(/^(\s*)(?:[-*] |\d+\. )(.*)/);
            if (match) {
                const indent = match[1];
                const content = match[2];
                if (!/^\[[ x]\] /.test(content)) return `${indent}- [ ] ${content}`;
                return `${indent}- ${content}`;
            }
            return line;
        }).join('\n') + suffix;
    }
    return lines.map((line, i) => i === 0 ? `- [ ] ${line}` : `    ${line}`).join('\n') + suffix;
}

function stripTaskPrefix(line) {
    return String(line || "").replace(/^(\s*)(?:-\s*\[[ xX]\]\s*|\d+\.\s*|[-*]\s*)/, "").trim();
}

function isEmptyTodoLine(line) {
    const match = String(line || "").match(/^(\s*)-\s*\[[ \/>?!]\]\s*(.*)$/);
    if (!match) return false;
    return match[2].trim() === "";
}

function getCaptureTaskLines(body, sourceSuffix = "") {
    const lines = String(body || "").split("\n").map((line) => stripTaskPrefix(line)).filter((line) => line.trim() !== "");
    if (!lines.length) return [];
    const suffix = String(sourceSuffix || "");
    if (suffix) lines[lines.length - 1] += suffix;
    return lines;
}

function formatAsOrderedList(text, suffix = "") {
    const lines = String(text || "").split('\n');
    let n = 1;
    const items = [];
    for (const line of lines) {
        const cleaned = line.replace(/^(\s*)(?:-\s*\[[ xX]\]\s*|\d+\.\s*|[-*]\s*)/, '').trim();
        if (!cleaned) continue;
        items.push(`${n}. ${cleaned}`);
        n++;
    }
    return items.join('\n') + suffix;
}

function isDraftListLine(line) {
    return /^\s*(?:-\s*\[[ xX]\]\s*|\d+\.\s+)/.test(String(line || ""));
}

function stripDraftLineContent(line) {
    return String(line || "").replace(/^\s*(?:-\s*\[[ xX]\]\s*|\d+\.\s*)/, "").split(" 📅")[0].trim();
}

async function saveWithYearMonth(app, filePath, titleHeader, bodyText, now, suffix = "") {
    await ensureFolderByPath(app.vault, filePath);
    let file = app.vault.getAbstractFileByPath(filePath);
    if (!file) file = await app.vault.create(filePath, titleHeader ? titleHeader + "\n\n" : "");
    let content = await app.vault.read(file);
    let lines = content.split("\n");
    const yearH = `# ${now.format("YYYY年")}`;
    const monthH = `## ${now.format("MM月")}`;
    let headerIdx = titleHeader ? lines.findIndex(l => l.includes(titleHeader.trim())) : -1;
    let startIdx = 0;
    if (headerIdx !== -1) startIdx = headerIdx + 1;
    else if (lines[0] === "---") {
        const yamlEnd = lines.indexOf("---", 1);
        if (yamlEnd !== -1) startIdx = yamlEnd + 1;
    }
    const yIdx = lines.findIndex(l => l.trim() === yearH);
    const bodyWithSuffix = bodyText + suffix;
    if (yIdx === -1) lines.splice(startIdx, 0, "", yearH, monthH, bodyWithSuffix);
    else {
        let mIdx = -1;
        for (let i = yIdx + 1; i < lines.length; i++) {
            if (lines[i].trim() === monthH) { mIdx = i; break; }
            if (lines[i].startsWith("# ")) break;
        }
        if (mIdx === -1) lines.splice(yIdx + 1, 0, monthH, bodyWithSuffix);
        else lines.splice(mIdx + 1, 0, bodyWithSuffix);
    }
    await app.vault.modify(file, lines.join("\n"));
}

async function saveEssayEntry(app, plugin, body, now, sourceSuffix = "") {
    const filePath = plugin.settings.pathEssays;
    await ensureFolderByPath(app.vault, filePath);
    let file = app.vault.getAbstractFileByPath(filePath);
    if (!file) file = await app.vault.create(filePath, "");
    let lines = (await app.vault.read(file)).split("\n");

    const yearH = `# ${now.format("YYYY年")}`;
    const monthH = `## ${now.format("MM月")}`;
    const weekStart = now.clone().startOf("isoWeek").format("MM月DD日");
    const weekEnd = now.clone().endOf("isoWeek").format("MM月DD日");
    const weekH = `### 第${now.isoWeek()}周 (${weekStart}-${weekEnd})`;
    const calloutBody = body.split("\n").map(line => `> ${line}`).join("\n");
    const formatted = `> [!NOTE] ${now.format("HH:mm")}\n${calloutBody}${sourceSuffix ? "\n> " + sourceSuffix : ""}\n\n`;

    let yIdx = lines.findIndex(l => l.trim() === yearH);
    if (yIdx === -1) {
        if (lines.length && lines[lines.length - 1].trim() !== "") lines.push("");
        lines.push(yearH, monthH, weekH, formatted);
    } else {
        let mIdx = -1;
        for (let i = yIdx + 1; i < lines.length; i++) {
            if (lines[i].trim() === monthH) { mIdx = i; break; }
            if (lines[i].startsWith("# ")) break;
        }
        if (mIdx === -1) {
            lines.splice(yIdx + 1, 0, monthH, weekH, formatted);
        } else {
            let wIdx = -1;
            for (let i = mIdx + 1; i < lines.length; i++) {
                if (lines[i].trim() === weekH) { wIdx = i; break; }
                if (lines[i].startsWith("# ")) break;
            }
            if (wIdx === -1) {
                lines.splice(mIdx + 1, 0, weekH, formatted);
            } else {
                lines.splice(wIdx + 1, 0, formatted);
            }
        }
    }
    await app.vault.modify(file, lines.join("\n"));
}

async function saveWorkTaskEntry(app, plugin, body, now, sourceSuffix = "") {
    const workFile = await plugin.getOrCreateWeeklyWorkFile(now);
    if (!workFile) throw new Error("无法创建本周工作文件");
    const content = await app.vault.read(workFile);
    const taskLines = getCaptureTaskLines(body, sourceSuffix);
    if (!taskLines.length) throw new Error("待办内容为空");
    const sectionTodo = getWeeklySectionNames(plugin.settings).todo;
    const sectionRe = getWeeklyTodoHeadingRegex(sectionTodo);
    const lines = content.split('\n');
    let inSection = false;
    let sectionStart = -1;
    let insertIdx = -1;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.length > 2000) continue;
        if (!inSection && sectionRe.test(line)) { inSection = true; sectionStart = i; continue; }
        if (inSection && (line.match(/^(?:---|## |$)/))) { insertIdx = i; break; }
    }
    if (!inSection) throw new Error(`未找到【${sectionTodo}】锚点！`);
    const sectionEnd = insertIdx !== -1 ? insertIdx : lines.length;
    const pending = [...taskLines];
    for (let i = sectionStart + 1; i < sectionEnd && pending.length; i++) {
        if (!isEmptyTodoLine(lines[i])) continue;
        const indent = (lines[i].match(/^(\s*)/) || ["", ""])[1];
        lines[i] = `${indent}- [ ] ${pending.shift()}`;
    }
    if (pending.length) {
        let at = insertIdx !== -1 ? insertIdx : lines.length;
        for (const text of pending) {
            lines.splice(at, 0, `- [ ] ${text}`);
            at++;
        }
    }
    await app.vault.modify(workFile, lines.join('\n'));
}

function countHabitTotal(habitData, habitId) {
    return Object.values(habitData || {}).filter(d => d && d[habitId] === true).length;
}

async function buildUniqueClipFilePath(vault, folder, fileName) {
    let path = `${folder}/${fileName}`;
    if (!vault.getAbstractFileByPath(path)) return path;
    const dot = fileName.lastIndexOf(".");
    const stem = dot > 0 ? fileName.slice(0, dot) : fileName;
    const ext = dot > 0 ? fileName.slice(dot) : ".md";
    for (let i = 2; i < 100; i++) {
        path = `${folder}/${stem}-${i}${ext}`;
        if (!vault.getAbstractFileByPath(path)) return path;
    }
    return `${folder}/${stem}-${Date.now()}${ext}`;
}

const DEFAULT_CLIP_CATEGORIES = ["科技", "人文", "娱乐", "AI", "学习"];

function getClipCategories(settings) {
    const raw = Array.isArray(settings?.clipCategories) ? settings.clipCategories : [];
    const list = raw
        .map((s) => String(s || "").trim())
        .filter(Boolean)
        .filter((s) => s !== "未分类");
    return list.length ? [...new Set(list)] : [...DEFAULT_CLIP_CATEGORIES];
}

function sanitizeClipCategoryName(name) {
    return String(name || "")
        .trim()
        .replace(/[\\/:*?"<>|#^[\]]/g, "-")
        .replace(/\s+/g, " ")
        .slice(0, 24);
}

function wikiLinkPath(path) {
    return String(path || "").replace(/\.md$/i, "");
}

function formatYamlTagList(tags) {
    const clean = [...new Set((tags || []).map((t) => String(t || "").replace(/^#/, "").trim()).filter(Boolean))];
    if (!clean.length) return null;
    return `[${clean.map((t) => `"${yamlQuote(t)}"`).join(", ")}]`;
}

function clipStemFromTitle(title) {
    return String(title || "Clipped")
        .replace(/[\\/:*?"<>|#^[\]]/g, "-")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/[. ]+$/g, "")
        .slice(0, 80) || "clip";
}

class ClippingConfirmModal extends Modal {
    constructor(app, plugin, options = {}) {
        super(app);
        this.plugin = plugin;
        this.defaultTitle = options.defaultTitle || "Clipped";
        this.url = options.url || "";
        this.categories = getClipCategories(plugin.settings);
        this.selectedCategory = options.defaultCategory || this.categories[0] || "科技";
        if (this.selectedCategory === "未分类") this.selectedCategory = this.categories[0] || "科技";
        if (!this.categories.includes(this.selectedCategory)) {
            this.categories = [...this.categories, this.selectedCategory];
        }
        this.tags = [];
        this._done = false;
        this._resolve = null;
        this._addedMobileTop = false;
        this.promise = new Promise((resolve) => { this._resolve = resolve; });
    }

    waitForSubmit() { return this.promise; }

    finish(result) {
        this._done = true;
        if (this._resolve) { this._resolve(result); this._resolve = null; }
        this.close();
    }

    onClose() {
        if (this._addedMobileTop) document.body.removeClass("bc-mobile-force-top");
        this._addedMobileTop = false;
        if (!this._done && this._resolve) { this._resolve(null); this._resolve = null; }
    }

    renderCategoryChips() {
        if (!this._chipRow) return;
        this._chipRow.empty();
        this.categories.forEach((name) => {
            const chip = this._chipRow.createEl("button", {
                type: "button",
                text: name,
                cls: "bc-clip-cat-chip" + (name === this.selectedCategory ? " is-active" : "")
            });
            chip.onclick = () => {
                this.selectedCategory = name;
                this.renderCategoryChips();
                this.updatePathHint();
            };
        });
    }

    mountCategoryAddRow(host) {
        if (!host || this._catAddMounted) return;
        this._catAddMounted = true;
        const wrap = host.createDiv({ cls: "bc-clip-cat-add-wrap" });
        const input = wrap.createEl("input", {
            type: "text",
            cls: "bc-clip-cat-add-input",
            attr: { placeholder: "新分类名，回车或点添加", maxlength: "24", autocomplete: "off" }
        });
        const okBtn = wrap.createEl("button", { type: "button", text: "添加", cls: "bc-clip-cat-add-ok" });
        this._catAddInput = input;

        const commit = async () => {
            const name = sanitizeClipCategoryName(input.value);
            if (!name) {
                input.focus();
                return;
            }
            if (!this.categories.includes(name)) {
                this.categories.push(name);
                this.plugin.settings.clipCategories = [...this.categories];
                await this.plugin.saveSettings();
            }
            this.selectedCategory = name;
            input.value = "";
            this.renderCategoryChips();
            this.updatePathHint();
            input.focus();
        };

        okBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            commit();
        };
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                commit();
            }
        });
    }

    updatePathHint() {
        if (!this._pathHint) return;
        const root = this.plugin.settings.pathClippings || "Inbox/Clippings";
        this._pathHint.setText(`→ ${root}/${this.selectedCategory}/`);
    }

    renderTagChips() {
        if (!this._tagRow) return;
        this._tagRow.empty();
        this.tags.forEach((tag, idx) => {
            const chip = this._tagRow.createSpan({ text: `#${tag}`, cls: "bc-clip-tag-chip" });
            chip.title = "点击移除";
            chip.onclick = () => {
                this.tags.splice(idx, 1);
                this.renderTagChips();
            };
        });
        const add = this._tagRow.createEl("button", { type: "button", text: "+ 标签", cls: "bc-clip-tag-add" });
        add.title = "搜索库内标签，或输入新建";
        add.onclick = () => {
            pickVaultTag(this.app, (tag) => {
                const clean = String(tag || "").replace(/^#/, "").trim();
                if (!clean) return;
                if (!this.tags.includes(clean)) this.tags.push(clean);
                this.renderTagChips();
            });
        };
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass("bc-material-modal");
        contentEl.addClass("bc-clip-confirm-modal");
        this.modalEl.addClass("bc-material-dialog");
        this.modalEl.addClass("bc-clip-confirm-dialog");
        if (this.app.isMobile && !document.body.hasClass("bc-mobile-force-top")) {
            document.body.addClass("bc-mobile-force-top");
            this._addedMobileTop = true;
        }
        const styleId = "bc-clip-confirm-styles-v5";
        document.getElementById("bc-clip-confirm-styles-v1")?.remove();
        document.getElementById("bc-clip-confirm-styles-v2")?.remove();
        document.getElementById("bc-clip-confirm-styles-v3")?.remove();
        document.getElementById("bc-clip-confirm-styles-v4")?.remove();
        document.getElementById(styleId)?.remove();
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
.bc-clip-confirm-dialog .modal-content{overflow:visible!important}
.bc-clip-confirm-modal{padding:22px 26px 28px;max-width:520px;box-sizing:border-box}
.bc-clip-confirm-modal .bc-material-title{margin:0 0 8px;font-size:18px;line-height:1.35}
.bc-clip-confirm-modal .bc-clip-intro{margin:0 0 18px;font-size:12px;line-height:1.55;color:var(--text-muted)}
.bc-clip-confirm-modal .bc-clip-name-row{display:flex;align-items:center;gap:10px;margin:0}
.bc-clip-confirm-modal .bc-material-ext-badge{font-size:11px;font-weight:700;color:var(--text-accent);background:var(--background-secondary);padding:2px 8px;border-radius:6px;flex-shrink:0}
.bc-clip-confirm-modal .bc-material-name-input{flex:1;min-width:140px;padding:8px 10px;border-radius:8px;border:1px solid var(--background-modifier-border);background:var(--background-primary);box-sizing:border-box}
.bc-clip-confirm-modal .bc-clip-path-hint{margin:8px 0 0;padding-left:46px;font-size:11px;line-height:1.4;color:var(--text-muted)}
.bc-clip-confirm-modal .bc-clip-section{margin-top:22px}
.bc-clip-confirm-modal .bc-clip-section-label{font-size:13px;font-weight:700;margin:0 0 6px;color:var(--text-normal)}
.bc-clip-confirm-modal .bc-clip-section-desc{font-size:11px;color:var(--text-muted);margin:0 0 12px;line-height:1.5}
.bc-clip-confirm-modal .bc-clip-cat-row,.bc-clip-confirm-modal .bc-clip-tag-row{display:flex;flex-wrap:wrap;gap:8px;margin:0;align-items:center}
.bc-clip-cat-chip,.bc-clip-tag-add{border:1px solid var(--background-modifier-border);background:var(--background-secondary);color:var(--text-normal);border-radius:999px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;line-height:1.2}
.bc-clip-cat-chip.is-active{background:color-mix(in srgb,var(--lifeos-accent,#b48246) 36%,transparent);border-color:color-mix(in srgb,var(--lifeos-accent,#b48246) 55%,transparent);color:var(--text-accent)}
.bc-clip-cat-add-wrap{display:flex;align-items:center;gap:12px;margin-top:12px;width:100%;box-sizing:border-box}
.bc-clip-cat-add-input{flex:1;min-width:0;width:auto;padding:8px 12px;border-radius:10px;border:1px solid var(--background-modifier-border);background:var(--background-primary);font-size:13px;line-height:1.3;box-sizing:border-box}
.bc-clip-cat-add-ok{flex-shrink:0;border:1px solid color-mix(in srgb,var(--lifeos-accent,#b48246) 45%,transparent);background:color-mix(in srgb,var(--lifeos-accent,#b48246) 18%,transparent);color:var(--text-accent);border-radius:999px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;line-height:1.2}
.bc-clip-tag-chip{display:inline-flex;align-items:center;gap:4px;padding:5px 12px;border-radius:999px;background:color-mix(in srgb,var(--lifeos-accent,#b48246) 14%,transparent);color:var(--text-accent);font-size:12px;font-weight:700;cursor:pointer}
.bc-clip-confirm-modal .bc-clip-reflect{width:100%;min-height:96px;padding:12px;border-radius:10px;border:1px solid var(--background-modifier-border);background:var(--background-primary);resize:vertical;box-sizing:border-box;font-size:14px;line-height:1.55;margin:0}
.bc-clip-confirm-modal .bc-material-foot{display:flex;justify-content:flex-end;gap:12px;margin-top:28px;padding-top:4px}
.bc-clip-confirm-modal .bc-material-foot button{min-height:36px;padding:0 16px}
@media (max-width:480px){
.bc-clip-confirm-modal{padding:16px 16px 20px}
.bc-clip-confirm-modal .bc-clip-path-hint{padding-left:0}
.bc-clip-confirm-modal .bc-clip-section{margin-top:18px}
.bc-clip-confirm-modal .bc-material-foot{margin-top:22px;gap:8px}
.bc-clip-confirm-modal .bc-material-foot button{flex:1;min-height:40px}
.bc-clip-cat-add-wrap{gap:10px}
}
`;
    document.head.appendChild(style);

        contentEl.createEl("h2", { text: "确认剪藏", cls: "bc-material-title" });
        contentEl.createEl("p", {
            text: "确认分类、文件名与可选标签；填写感悟将另建笔记并双向链接。",
            cls: "bc-clip-intro"
        });

        const nameRow = contentEl.createDiv({ cls: "bc-clip-name-row" });
        nameRow.createSpan({ text: "MD", cls: "bc-material-ext-badge" });
        this._nameInput = nameRow.createEl("input", {
            type: "text",
            value: this.defaultTitle,
            cls: "bc-material-name-input",
            attr: { placeholder: "剪藏文件名 / 标题" }
        });
        this._pathHint = contentEl.createDiv({ cls: "bc-clip-path-hint" });
        this.updatePathHint();

        const catSec = contentEl.createDiv({ cls: "bc-clip-section" });
        catSec.createDiv({ text: "分类", cls: "bc-clip-section-label" });
        catSec.createDiv({ text: "保存到 Inbox/Clippings/{分类}/；输入名称后点添加可新建分类", cls: "bc-clip-section-desc" });
        this._chipRow = catSec.createDiv({ cls: "bc-clip-cat-row" });
        this.renderCategoryChips();
        this.mountCategoryAddRow(catSec);

        const tagSec = contentEl.createDiv({ cls: "bc-clip-section" });
        tagSec.createDiv({ text: "标签（可选）", cls: "bc-clip-section-label" });
        tagSec.createDiv({ text: "点击 + 标签可搜索库内标签，也可直接输入新建", cls: "bc-clip-section-desc" });
        this._tagRow = tagSec.createDiv({ cls: "bc-clip-tag-row" });
        this.renderTagChips();

        const reflectSec = contentEl.createDiv({ cls: "bc-clip-section" });
        reflectSec.createDiv({ text: "我的感悟（可选）", cls: "bc-clip-section-label" });
        reflectSec.createDiv({
            text: `有内容时另存到「${this.plugin.settings.pathClipReflections || "读&写/剪藏感悟"}」并与剪藏双向链接`,
            cls: "bc-clip-section-desc"
        });
        this._reflectInput = reflectSec.createEl("textarea", {
            cls: "bc-clip-reflect",
            attr: { placeholder: "读完之后的想法、摘录点评…" }
        });

        const foot = contentEl.createDiv({ cls: "bc-material-foot" });
        foot.createEl("button", { text: "取消" }).onclick = () => this.close();
        const saveBtn = foot.createEl("button", { text: "保存剪藏", cls: "mod-cta bc-material-save-btn" });
        saveBtn.onclick = () => {
            const title = String(this._nameInput?.value || this.defaultTitle).trim() || this.defaultTitle;
            const category = sanitizeClipCategoryName(this.selectedCategory) || this.categories[0] || "科技";
            this.finish({
                title,
                category,
                tags: [...this.tags],
                reflection: String(this._reflectInput?.value || "").trim()
            });
        };
        this._nameInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") { e.preventDefault(); saveBtn.click(); }
        });
        window.setTimeout(() => this._nameInput?.focus(), 80);
    }
}


function bcNoticeError(context, err) {
    const msg = err?.message || String(err || "未知错误");
    console.error(`[BrainCore] ${context}:`, err);
    new Notice(`${context}：${msg}`);
}

function customDebounce(f, w) { let t; return function(...a) { clearTimeout(t); t = setTimeout(() => f.apply(this, a), w); }; }

function escapeHtml(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

async function bcFetchJsonWithTimeout(url, ms) {
    const res = await Promise.race([
        requestUrl({ url, method: "GET", throw: false }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))
    ]);
    if (res.status < 200 || res.status >= 300) throw new Error(`HTTP ${res.status}`);
    return JSON.parse(res.text);
}

const BC_WEATHER_CODE_MAP = {
    0:{i:'☀',t:'晴'},1:{i:'🌤️',t:'多云'},2:{i:'⛅',t:'阴'},3:{i:'☁️',t:'阴'},
    45:{i:'🌫️',t:'雾'},48:{i:'🌫️',t:'雾'},51:{i:'🌦️',t:'毛毛雨'},53:{i:'🌦️',t:'毛毛雨'},
    55:{i:'🌦️',t:'毛毛雨'},56:{i:'🌧️',t:'冻毛毛雨'},57:{i:'🌧️',t:'冻毛毛雨'},61:{i:'🌦️',t:'小雨'},
    63:{i:'🌧️',t:'中雨'},65:{i:'🌧️',t:'大雨'},66:{i:'🌧️',t:'冻雨'},67:{i:'🌧️',t:'冻雨'},
    71:{i:'🌨️',t:'小雪'},73:{i:'🌨️',t:'中雪'},75:{i:'🌨️',t:'大雪'},77:{i:'🌨️',t:'雪粒'},
    80:{i:'🌦️',t:'阵雨'},81:{i:'🌧️',t:'强阵雨'},82:{i:'🌧️',t:'暴雨'},85:{i:'🌨️',t:'阵雪'},
    86:{i:'🌨️',t:'阵雪'},95:{i:'⛈',t:'雷暴'},96:{i:'⛈',t:'雷暴'},99:{i:'⛈',t:'雷暴'}
};

function bcFormatOpenMeteoWeather(data) {
    if (!data?.current) throw new Error("open-meteo empty");
    const m = BC_WEATHER_CODE_MAP[data.current.weather_code] || { i:'☁️', t:'未知' };
    return `${m.i} ${m.t} ·${data.current.temperature_2m.toFixed(1)}°C · ${data.current.wind_speed_10m}km/h`;
}

function bcPickWttrIcon(desc) {
    const s = String(desc || "").toLowerCase();
    if (/thunder|storm|雷/.test(s)) return "⛈";
    if (/snow|blizzard|sleet|ice|雪/.test(s)) return "🌨️";
    if (/rain|shower|drizzle|雨/.test(s)) return "🌧️";
    if (/fog|mist|haze|雾/.test(s)) return "🌫️";
    if (/clear|sunny|晴/.test(s)) return "☀";
    if (/partly|partial|多云/.test(s)) return "⛅";
    if (/cloud|overcast|阴/.test(s)) return "☁️";
    return "🌤️";
}

const BC_WTTR_TEXT_ZH = {
    "sunny": "晴",
    "clear": "晴",
    "partly cloudy": "多云",
    "cloudy": "阴",
    "overcast": "阴",
    "mist": "雾",
    "fog": "雾",
    "freezing fog": "冻雾",
    "patchy rain possible": "可能有阵雨",
    "patchy snow possible": "可能有阵雪",
    "patchy sleet possible": "可能有雨夹雪",
    "patchy freezing drizzle possible": "可能有冻毛毛雨",
    "thundery outbreaks possible": "可能有雷暴",
    "blowing snow": "吹雪",
    "blizzard": "暴风雪",
    "fog patches": "局部有雾",
    "patchy light drizzle": "小毛毛雨",
    "light drizzle": "毛毛雨",
    "freezing drizzle": "冻毛毛雨",
    "heavy freezing drizzle": "大冻毛毛雨",
    "patchy light rain": "小雨",
    "light rain": "小雨",
    "moderate rain at times": "间歇中雨",
    "moderate rain": "中雨",
    "heavy rain at times": "间歇大雨",
    "heavy rain": "大雨",
    "light freezing rain": "小冻雨",
    "moderate or heavy freezing rain": "中到大冻雨",
    "light rain shower": "小阵雨",
    "moderate or heavy rain shower": "中到大阵雨",
    "torrential rain shower": "暴雨",
    "light sleet showers": "小雨夹雪",
    "moderate or heavy sleet showers": "中到大雨夹雪",
    "light snow showers": "小阵雪",
    "moderate or heavy snow showers": "中到大阵雪",
    "light showers of ice pellets": "小冰粒",
    "moderate or heavy showers of ice pellets": "中到大冰粒",
    "patchy light rain with thunder": "雷阵雨",
    "moderate or heavy rain with thunder": "强雷阵雨",
    "patchy light snow with thunder": "雷阵雪",
    "moderate or heavy snow with thunder": "强雷阵雪",
};

function bcWttrDescToZh(desc) {
    const raw = String(desc || "").trim();
    if (!raw) return "未知";
    if (/[\u4e00-\u9fff]/.test(raw)) return raw;
    const key = raw.toLowerCase().replace(/\s+/g, " ").trim();
    return BC_WTTR_TEXT_ZH[key] || raw;
}

function bcFormatWttrWeather(data) {
    const c = data?.current_condition?.[0];
    if (!c) throw new Error("wttr empty");
    const rawDesc = c.lang_zh?.[0]?.value || c.weatherDesc?.[0]?.value || "未知";
    const text = bcWttrDescToZh(rawDesc);
    const temp = c.temp_C ?? c.tempC;
    const wind = c.windspeedKmph ?? c.wind_speed_kmph;
    if (temp == null) throw new Error("wttr incomplete");
    return `${bcPickWttrIcon(text)} ${text} ·${temp}°C · ${wind ?? "—"}km/h`;
}

async function bcFetchWeatherAt(lat, lon) {
    const latN = Number(lat);
    const lonN = Number(lon);
    if (!Number.isFinite(latN) || !Number.isFinite(lonN)) throw new Error("invalid coords");
    const errors = [];
    try {
        const data = await bcFetchJsonWithTimeout(
            `https://api.open-meteo.com/v1/forecast?latitude=${latN}&longitude=${lonN}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`,
            6000
        );
        return bcFormatOpenMeteoWeather(data);
    } catch (e) {
        errors.push(`open-meteo: ${e.message || e}`);
    }
    try {
        const data = await bcFetchJsonWithTimeout(`https://wttr.in/${latN},${lonN}?format=j1&lang=zh`, 8000);
        return bcFormatWttrWeather(data);
    } catch (e) {
        errors.push(`wttr.in: ${e.message || e}`);
    }
    throw new Error(errors.join(" | "));
}

async function bcFetchGeoCoords() {
    const providers = [
        async () => {
            const d = await bcFetchJsonWithTimeout("https://ipwho.is/", 4000);
            if (!d?.success || !Number.isFinite(d.latitude) || !Number.isFinite(d.longitude)) throw new Error("ipwho.is invalid");
            return { lat: d.latitude, lon: d.longitude };
        },
        async () => {
            const d = await bcFetchJsonWithTimeout("https://ipinfo.io/json", 4000);
            const parts = String(d?.loc || "").split(",");
            if (parts.length !== 2) throw new Error("ipinfo.io invalid");
            const lat = parseFloat(parts[0]);
            const lon = parseFloat(parts[1]);
            if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error("ipinfo.io coords");
            return { lat, lon };
        },
        async () => {
            const d = await bcFetchJsonWithTimeout("https://geolocation-db.com/json/", 4000);
            if (!Number.isFinite(d?.latitude) || !Number.isFinite(d?.longitude)) throw new Error("geolocation-db invalid");
            return { lat: d.latitude, lon: d.longitude };
        },
    ];
    const errors = [];
    for (const run of providers) {
        try {
            return await run();
        } catch (e) {
            errors.push(e.message || String(e));
        }
    }
    throw new Error(errors.join(" | "));
}

function escapeJsString(text) {
    return String(text || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function extractFirstUrl(text) {
    const match = String(text || "").match(/https?:\/\/[^\s<>"']+/i);
    return match ? match[0].replace(/[)\].,，。；;!?！？]+$/, "") : null;
}

function resolveClipUrl(baseUrl, href) {
    if (!href) return "";
    let absolute = href;
    try { absolute = new URL(href, baseUrl).href; } catch (e) { /* keep href */ }
    let cleaned = String(absolute);
    // 虎嗅等 CDN 的 imageView2|imageMogr2 易触发 Obsidian 表格误解析；阅读视图中大图挤进段落会呈窄列
    if (/[?&].*(imageView2|imageMogr2|%7C|\|)/i.test(cleaned)) {
        cleaned = cleaned.split("?")[0];
    }
    return cleaned
        .replace(/\|/g, "%7C")
        .replace(/ /g, "%20")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29");
}

function normalizeClipMarkdown(markdown) {
    let text = String(markdown || "").replace(/\r\n/g, "\n");
    text = text.replace(/([^\n])[ \t]+(#{1,6}[ \t]+)/g, "$1\n\n$2");
    text = text.replace(/([^\n#])(#{1,6}[ \t]+\S)/g, "$1\n\n$2");
    text = text.replace(/(#{1,6}[^\n]{0,80}?[？?！!])[ \t]+(?=\S)/g, "$1\n\n");
    text = text.replace(/(#{1,6} \d+\.[^\n]{2,60}?)[ \t]+(?=[\u4e00-\u9fff]{2,})/g, "$1\n\n");
    text = text.replace(/[ \t]*(!\[[^\]]*\]\([^)]+\))[ \t]*/g, "\n\n$1\n\n");
    text = text.replace(/(\d{1,2}:\d{2})(# )/g, "$1\n\n$2");
    return text.replace(/\n{3,}/g, "\n\n").trim();
}

function clipInlineMarkdown(node, baseUrl) {
    if (!node) return "";
    if (node.nodeType === 3) return node.textContent || "";
    if (node.nodeType !== 1) return "";
    const tag = node.tagName.toLowerCase();
    if (tag === "br") return "\n";
    if (tag === "strong" || tag === "b") {
        const inner = Array.from(node.childNodes).map(c => clipInlineMarkdown(c, baseUrl)).join("");
        return inner ? `**${inner}**` : "";
    }
    if (tag === "em" || tag === "i") {
        const inner = Array.from(node.childNodes).map(c => clipInlineMarkdown(c, baseUrl)).join("");
        return inner ? `*${inner}*` : "";
    }
    if (tag === "code") return `\`${(node.textContent || "").trim()}\``;
    if (tag === "a") {
        const href = resolveClipUrl(baseUrl, node.getAttribute("href"));
        const label = Array.from(node.childNodes).map(c => clipInlineMarkdown(c, baseUrl)).join("").replace(/\s+/g, " ").trim();
        return href ? `[${label || href}](${href})` : label;
    }
    return Array.from(node.childNodes).map(c => clipInlineMarkdown(c, baseUrl)).join("");
}

function clipBlockMarkdown(el, baseUrl) {
    if (!el || el.nodeType !== 1) return [];
    const tag = el.tagName.toLowerCase();
    const skipTags = ["script", "style", "noscript", "iframe", "svg", "nav", "footer", "header", "aside", "form"];
    if (skipTags.includes(tag)) return [];

    if (/^h[1-6]$/.test(tag)) {
        const text = clipInlineMarkdown(el, baseUrl).replace(/\s+/g, " ").trim();
        return text ? [`${"#".repeat(Math.min(parseInt(tag[1], 10), 6))} ${text}`, ""] : [];
    }
    if (tag === "p") {
        const text = clipInlineMarkdown(el, baseUrl).replace(/\s+/g, " ").trim();
        return text ? [text, ""] : [];
    }
    if (tag === "blockquote") {
        const inner = clipHtmlToMarkdown(el, baseUrl).split("\n").map(line => line ? `> ${line}` : ">").join("\n");
        return inner.trim() ? [inner, ""] : [];
    }
    if (tag === "ul" || tag === "ol") {
        const lines = [];
        Array.from(el.children).filter(c => c.tagName && c.tagName.toLowerCase() === "li").forEach((li, i) => {
            const prefix = tag === "ol" ? `${i + 1}. ` : "- ";
            const text = clipListItemMarkdown(li, baseUrl);
            if (text) lines.push(`${prefix}${text}`);
        });
        if (lines.length) lines.push("");
        return lines;
    }
    if (tag === "pre") {
        const code = (el.textContent || "").replace(/\n+$/, "");
        return code.trim() ? ["```", code, "```", ""] : [];
    }
    if (tag === "img") {
        const src = getClipImageSrc(el, baseUrl);
        const alt = (el.getAttribute("alt") || "image").replace(/[\[\]]/g, "");
        return src ? [`![${alt}](${src})`, ""] : [];
    }
    if (tag === "hr") return ["---", ""];

    const lines = [];
    Array.from(el.childNodes).forEach(child => {
        if (child.nodeType === 1) lines.push(...clipBlockMarkdown(child, baseUrl));
        else if (child.nodeType === 3 && child.textContent.trim()) lines.push(child.textContent.trim(), "");
    });
    return lines;
}

function clipListItemMarkdown(li, baseUrl) {
    const parts = [];
    Array.from(li.childNodes).forEach(child => {
        if (child.nodeType === 1) {
            const t = child.tagName.toLowerCase();
            if (t === "ul" || t === "ol") {
                const nested = clipBlockMarkdown(child, baseUrl).filter(Boolean).map(line => (line.startsWith("- ") || /^\d+\.\s/.test(line)) ? `  ${line}` : line);
                parts.push(nested.join("\n"));
            } else {
                parts.push(clipInlineMarkdown(child, baseUrl).replace(/\s+/g, " ").trim());
            }
        } else if (child.nodeType === 3 && child.textContent.trim()) {
            parts.push(child.textContent.trim());
        }
    });
    return parts.filter(Boolean).join(" ").trim();
}

function clipHtmlToMarkdown(root, baseUrl) {
    const lines = clipBlockMarkdown(root, baseUrl);
    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function sanitizeClipFileName(title, now) {
    const base = String(title || "Clipped")
        .replace(/[\\/:*?"<>|#^[\]]/g, "-")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/[. ]+$/g, "")
        .slice(0, 80);
    return `${base || "clip"}.md`;
}

function isWeixinClipUrl(url) {
    try {
        const host = new URL(url).hostname.toLowerCase();
        return host === "mp.weixin.qq.com" || host.endsWith(".weixin.qq.com");
    } catch (_) {
        return /mp\.weixin\.qq\.com/i.test(String(url || ""));
    }
}

function getClipPageTitle(doc, url) {
    if (isWeixinClipUrl(url)) {
        const wxTitle = doc.querySelector("#activity-name, .rich_media_title, #js_title_inner, .js_title_inner")?.textContent?.trim();
        if (wxTitle) return wxTitle.replace(/\s+/g, " ").trim();
    }
    const og = doc.querySelector('meta[property="og:title"], meta[name="og:title"]')?.content;
    if (og && og.trim()) return og.trim();
    const title = doc.querySelector("title")?.textContent?.trim();
    if (title) return title;
    try { return new URL(url).hostname; } catch (e) { return "Clipped"; }
}

function pickClipMainContent(doc, url = "") {
    const weixinFirst = [
        "#js_content",
        ".rich_media_content",
        "#img-content",
        ".rich_media_area_primary"
    ];
    const generic = [
        "article", "main", '[role="main"]', ".article", ".post", ".post-content",
        ".entry-content", ".markdown-body", ".rich_media_content", "#js_content",
        ".content", "#content", ".article-content"
    ];
    const selectors = isWeixinClipUrl(url)
        ? [...weixinFirst, ...generic.filter((s) => !weixinFirst.includes(s))]
        : generic;

    for (const sel of selectors) {
        const el = doc.querySelector(sel);
        const textLen = (el?.textContent || "").replace(/\s+/g, " ").trim().length;
        if (el && textLen > 80) return el;
    }
    const body = doc.body;
    if (!body) return doc.documentElement;
    const clone = body.cloneNode(true);
    clone.querySelectorAll("script, style, noscript, nav, footer, header, aside, iframe, .sidebar, .comment, .comments, .ad, .ads, .advertisement").forEach(n => n.remove());
    return clone;
}

function getClipImageSrc(el, baseUrl) {
    const raw = el.getAttribute("data-src")
        || el.getAttribute("data-original")
        || el.getAttribute("data-actualsrc")
        || el.getAttribute("src")
        || "";
    const src = String(raw).trim();
    if (!src || src.startsWith("data:")) return "";
    return resolveClipUrl(baseUrl, src);
}

function yamlQuote(value) {
    return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function createDefuddleFetch() {
    return async (fetchUrl, init = {}) => {
        const response = await requestUrl({
            url: fetchUrl,
            method: String(init.method || "GET").toUpperCase(),
            headers: {
                "User-Agent": CLIP_UA,
                ...(init.headers || {})
            },
            body: init.body
        });
        return {
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            text: async () => response.text,
            json: async () => JSON.parse(response.text)
        };
    };
}

function isLikelyHtmlContent(text) {
    const sample = String(text || "").trim().slice(0, 500);
    return /^Partial conversion completed with errors/i.test(sample) || /<(?:article|p|div|h[1-6]|section|main)\b/i.test(sample);
}

function clipWithFallbackParser(doc, url) {
    const title = getClipPageTitle(doc, url);
    const root = pickClipMainContent(doc, url);
    const markdown = normalizeClipMarkdown(clipHtmlToMarkdown(root, url));
    if (!markdown || markdown.length < 20) throw new Error("未能提取正文，可能需登录或页面为纯动态渲染");
    return { title, markdown, url };
}

function isThinClipMarkdown(markdown, url) {
    const text = String(markdown || "").trim();
    if (!text) return true;
    // 公众号等长文：有实质正文就保留文章模式，避免误退化为 Link Embed
    if (isWeixinClipUrl(url) && text.length >= 120) return false;
    if (text.length < 80) return true;
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const withoutUrl = text.replace(new RegExp(escapedUrl, "g"), "");
    const withoutLinks = withoutUrl.replace(/!\[[^\]]*\]\([^)]+\)/g, "").replace(/\[[^\]]*\]\([^)]+\)/g, "");
    return withoutLinks.replace(/[#>*_\-\s`]/g, "").length < 40;
}

function getMetaContent(doc, selectors) {
    for (const sel of selectors) {
        const value = doc.querySelector(sel)?.content?.trim();
        if (value) return value;
    }
    return "";
}

function getHostnameLabel(url) {
    try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return "Clipped"; }
}

function extractClipMetadata(doc, url, extras = {}) {
    const title = extras.title || getMetaContent(doc, [
        'meta[property="og:title"]', 'meta[name="og:title"]', 'meta[name="twitter:title"]'
    ]) || getClipPageTitle(doc, url);
    const description = extras.description || getMetaContent(doc, [
        'meta[property="og:description"]', 'meta[name="description"]', 'meta[name="twitter:description"]'
    ]);
    const image = resolveClipUrl(url, extras.image || getMetaContent(doc, [
        'meta[property="og:image"]', 'meta[name="twitter:image"]', 'meta[name="twitter:image:src"]'
    ]));
    let favicon = "";
    const iconEl = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
    if (iconEl) favicon = resolveClipUrl(url, iconEl.getAttribute("href"));
    if (!favicon) {
        try { favicon = new URL("/favicon.ico", url).href; } catch (e) { /* ignore */ }
    }
    let site = extras.site || "";
    if (!site) site = getHostnameLabel(url);
    return { title, description, image, favicon, url, site };
}

function clipMetadataFromUrl(url) {
    let favicon = "";
    try { favicon = new URL("/favicon.ico", url).href; } catch (e) { /* ignore */ }
    const site = getHostnameLabel(url);
    return { title: site, url, description: "", image: "", favicon, site };
}

function embedFieldQuote(value) {
    const text = String(value || "").replace(/\r/g, "").trim();
    if (!text) return '""';
    return `"${text.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ")}"`;
}

function buildLinkEmbedBlock(meta, reason = "") {
    const lines = ["```embed"];
    lines.push(`title: ${embedFieldQuote(meta.title || meta.site || "Link")}`);
    lines.push(`url: ${embedFieldQuote(meta.url)}`);
    if (meta.image) lines.push(`image: ${embedFieldQuote(meta.image)}`);
    if (meta.description) lines.push(`description: ${embedFieldQuote(meta.description)}`);
    if (meta.favicon) lines.push(`favicon: ${embedFieldQuote(meta.favicon)}`);
    lines.push(`metadata: ${embedFieldQuote(reason || "BrainCore 剪藏")}`);
    lines.push("```");
    return lines.join("\n");
}

async function fetchClipPageHtml(url) {
    const res = await Promise.race([
        requestUrl({
            url,
            method: "GET",
            headers: {
                "User-Agent": CLIP_UA,
                "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
                ...(isWeixinClipUrl(url) ? {
                    "Referer": "https://mp.weixin.qq.com/",
                    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8"
                } : {})
            }
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error("请求超时")), 20000))
    ]);
    let html = res.text;
    if (!html || html.length < 50) throw new Error("页面内容为空");
    // 微信等页面常夹带超大脚本，先剥离再解析，避免 DOMParser / Defuddle 失败
    if (html.length > 800000 || isWeixinClipUrl(url)) {
        html = html
            .replace(/<script\b[\s\S]*?<\/script>/gi, "")
            .replace(/<style\b[\s\S]*?<\/style>/gi, "");
    }
    const doc = new DOMParser().parseFromString(html, "text/html");
    return { html, doc };
}

async function tryExtractArticle(doc, url) {
    // 微信公众号优先用站点专用 DOM 提取（#js_content），Defuddle 对超大页面容易失败
    if (isWeixinClipUrl(url)) {
        try {
            return clipWithFallbackParser(doc, url);
        } catch (e) {
            console.warn("[BrainCore] 微信正文提取失败:", e);
        }
    }

    const Defuddle = getDefuddleModule();
    if (Defuddle) {
        try {
            const defuddle = new Defuddle(doc, {
                url,
                markdown: true,
                fetch: createDefuddleFetch()
            });
            const result = await defuddle.parseAsync();
            const markdown = String(result.content || "").trim();
            const title = result.title || getClipPageTitle(doc, url);
            if (markdown && markdown.length >= 20 && result.wordCount >= 5 && !isLikelyHtmlContent(markdown)) {
                return {
                    title,
                    markdown,
                    url,
                    author: result.author,
                    published: result.published,
                    description: result.description,
                    site: result.site,
                    image: result.image
                };
            }
        } catch (e) {
            console.warn("[BrainCore] Defuddle 解析失败，使用备用解析器:", e);
        }
    }
    return clipWithFallbackParser(doc, url);
}

function getAttachmentFolder(settings) {
    return String(settings?.pathAttachments || "Boxes/附件").replace(/\/+$/, "");
}

function getAttachmentMgmtSettings(app) {
    const plugin = app.plugins?.plugins?.["attachment-management"];
    if (!plugin?.settings?.attachPath) return null;
    return plugin.settings;
}

function matchAmExtension(extension, pattern) {
    if (!pattern) return false;
    try {
        return new RegExp(pattern).test(String(extension || "").replace(/^\./, ""));
    } catch (e) {
        return false;
    }
}

function getAmExtensionOverrideSetting(attachPathSetting, extension) {
    const ext = String(extension || "").replace(/^\./, "");
    for (const item of attachPathSetting?.extensionOverride || []) {
        if (matchAmExtension(ext, item?.extension)) return item;
    }
    return null;
}

function getAmNotePathParts(notePath) {
    const safe = String(notePath || "BrainCore/Capture.md");
    const idx = safe.lastIndexOf("/");
    const name = idx >= 0 ? safe.slice(idx + 1) : safe;
    const parentPath = idx >= 0 ? safe.slice(0, idx) : "";
    const parentName = parentPath ? parentPath.split("/").pop() : "";
    const dot = name.lastIndexOf(".");
    const basename = dot > 0 ? name.slice(0, dot) : name;
    return { parentPath, parentName, basename, name };
}

function joinVaultPath(...parts) {
    return parts
        .filter(Boolean)
        .join("/")
        .replace(/\\/g, "/")
        .replace(/\/+/g, "/")
        .replace(/^\/+/, "");
}

function getAmEffectiveAttachSetting(amSettings, notePath) {
    const overridePath = amSettings.overridePath || {};
    const keys = Object.keys(overridePath);
    if (!keys.length || !notePath) return amSettings.attachPath;
    let best = "";
    let bestSetting = amSettings.attachPath;
    for (const key of keys) {
        const setting = overridePath[key];
        if (!setting) continue;
        if (notePath === key || notePath.startsWith(key + "/")) {
            if (key.length > best.length) {
                best = key;
                bestSetting = setting;
            }
        }
    }
    return bestSetting;
}

function getAmAttachmentDirectory(app, amSettings, notePath, extension) {
    const setting = getAmEffectiveAttachSetting(amSettings, notePath);
    const extSetting = getAmExtensionOverrideSetting(setting, extension);
    const useSetting = extSetting || setting;
    const { parentPath, parentName, basename } = getAmNotePathParts(notePath);
    const obsMediaDir = app.vault.getConfig("attachmentFolderPath");
    let root = "";
    switch (useSetting?.saveAttE) {
        case "inFolderBelow":
            root = useSetting.attachmentRoot || "";
            break;
        case "nextToNote":
            root = joinVaultPath(parentPath, String(useSetting.attachmentRoot || "").replace(/^\.\//, ""));
            break;
        default:
            if (obsMediaDir === "/" || obsMediaDir === "./") root = parentPath;
            else if (/^\.\/.+/.test(String(obsMediaDir || ""))) root = joinVaultPath(parentPath, obsMediaDir.replace(/^\.\//, ""));
            else root = obsMediaDir || parentPath;
    }
    if (root === "/") root = "";
    const rel = String(useSetting?.attachmentPath || "./")
        .replace(/\$\{notepath\}/g, parentPath)
        .replace(/\$\{notename\}/g, basename)
        .replace(/\$\{parent\}/g, parentName)
        .replace(/^\.\//, "");
    if (!rel || rel === ".") return joinVaultPath(root);
    return joinVaultPath(root, rel);
}

function sanitizeAmFileStem(value) {
    return String(value || "附件")
        .replace(/[\\/:*?"<>|]/g, "-")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 140) || "附件";
}

function isImageExtension(ext) {
    return ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "heic", "heif", "tiff", "tif"].includes(
        String(ext || "").replace(/^\./, "").toLowerCase()
    );
}

function isAutoGeneratedAttachmentStem(stem) {
    const s = String(stem || "").trim();
    return /^IMG-\d{6,}/i.test(s) || /^[A-Z0-9]{2,8}-\d{6,}/i.test(s);
}

function buildMaterialDefaultStem(extension, originalBaseName, dateFormat) {
    const ext = String(extension || "bin").replace(/^\./, "").toLowerCase();
    const date = window.moment().format(dateFormat || "YYYYMMDD");
    const base = sanitizeAmFileStem(originalBaseName || "");
    if (base && !isAutoGeneratedAttachmentStem(base) && !/^附件-\d/.test(base)) return base;
    if (isImageExtension(ext)) return `IMG-${date}`;
    return `${ext.toUpperCase()}-${date}`;
}

function getMaterialDefaultStem(img, dateFormat) {
    const ext = img?.extension || (img?.name?.includes(".") ? img.name.split(".").pop() : "bin");
    const fromName = (img?.name || "").replace(/\.[^.]+$/, "");
    const original = img?.originalBaseName || fromName;
    const stemSource = (isAutoGeneratedAttachmentStem(fromName) && img?.originalBaseName) ? img.originalBaseName : original;
    return buildMaterialDefaultStem(ext, stemSource, dateFormat);
}

function buildAmAttachmentFileName(amSettings, attachSetting, extension, originalBaseName, notePath) {
    const ext = String(extension || "bin").replace(/^\./, "");
    const extSetting = getAmExtensionOverrideSetting(attachSetting, ext);
    const format = String(extSetting?.attachFormat || attachSetting?.attachFormat || "IMG-${date}").trim();
    const dateFormat = amSettings.dateFormat || "YYYYMMDD";
    const { basename } = getAmNotePathParts(notePath);
    const stem = sanitizeAmFileStem(
        format
            .replace(/\$\{date\}/g, window.moment().format(dateFormat))
            .replace(/\$\{notename\}/g, basename)
            .replace(/\$\{originalname\}/g, sanitizeAmFileStem(originalBaseName))
            .replace(/\$\{md5\}/g, "")
    );
    return `${stem}.${ext}`;
}

function resolveCaptureAttachmentPath(app, bcSettings, fileInfo, notePath) {
    const ext = String(fileInfo?.extension || "bin").replace(/^\./, "").toLowerCase();
    const originalBaseName = fileInfo?.originalBaseName || fileInfo?.baseName || "附件";
    const am = bcSettings?.followAttachmentManagement !== false ? getAttachmentMgmtSettings(app) : null;
    if (am) {
        const attachSetting = getAmEffectiveAttachSetting(am, notePath);
        const extSetting = getAmExtensionOverrideSetting(attachSetting, ext);
        const folder = getAmAttachmentDirectory(app, am, notePath, ext);
        const fileName = extSetting
            ? buildAmAttachmentFileName(am, attachSetting, ext, originalBaseName, notePath)
            : `${buildMaterialDefaultStem(ext, originalBaseName, am.dateFormat || "YYYYMMDD")}.${ext}`;
        return joinVaultPath(folder, fileName);
    }
    const folder = getAttachmentFolder(bcSettings);
    if (fileInfo?.preferredName) return joinVaultPath(folder, fileInfo.preferredName);
    return joinVaultPath(folder, `${sanitizeAmFileStem(originalBaseName)}.${ext}`);
}

function resolveMaterialAttachmentPath(app, bcSettings, fileInfo, notePath, customBaseName) {
    const ext = String(fileInfo?.extension || "bin").replace(/^\./, "").toLowerCase();
    const baseName = sanitizeAmFileStem(customBaseName || fileInfo?.originalBaseName || "素材");
    const fileName = `${baseName}.${ext}`;
    const am = bcSettings?.followAttachmentManagement !== false ? getAttachmentMgmtSettings(app) : null;
    if (am) {
        const attachSetting = getAmEffectiveAttachSetting(am, notePath);
        const extSetting = getAmExtensionOverrideSetting(attachSetting, ext);
        if (extSetting) {
            const folder = getAmAttachmentDirectory(app, am, notePath, ext);
            return joinVaultPath(folder, fileName);
        }
    }
    return joinVaultPath(getAttachmentFolder(bcSettings), fileName);
}

function getMaterialTargetFolderLabel(app, bcSettings, extension, notePath) {
    const ext = String(extension || "bin").replace(/^\./, "").toLowerCase();
    const am = bcSettings?.followAttachmentManagement !== false ? getAttachmentMgmtSettings(app) : null;
    if (am) {
        const attachSetting = getAmEffectiveAttachSetting(am, notePath);
        if (getAmExtensionOverrideSetting(attachSetting, ext)) {
            return getAmAttachmentDirectory(app, am, notePath, ext);
        }
    }
    return getAttachmentFolder(bcSettings);
}

async function saveMaterialCatalogEntry(app, plugin, body, savedPaths, now, title = "") {
    // 文件墙是 DataviewJS 纯展示看板，禁止往里写索引，否则会打乱布局。
    // 仅当用户填写了标题/备注时，写入独立的「素材日志」。
    const titleText = String(title || "").trim();
    const bodyText = String(body || "").trim();
    if (!titleText && !bodyText) return;

    const wallPath = normalizePath(plugin.settings.pathMaterials || "Boxes/文件墙.md");
    let filePath = normalizePath(plugin.settings.pathMaterialLog || "Boxes/素材日志.md");
    if (filePath === wallPath || /(^|\/)文件墙\.md$/i.test(filePath)) {
        filePath = "Boxes/素材日志.md";
    }

    await ensureFolderByPath(app.vault, filePath);
    let file = app.vault.getAbstractFileByPath(filePath);
    if (!file) file = await app.vault.create(filePath, "# 素材日志\n\n> 素材捕捉可选备注。文件本体在 Boxes 子目录，由文件墙自动展示。\n\n");
    const timeTag = now.format("YYYY-MM-DD HH:mm");
    const heading = titleText ? `### ${titleText} · ${timeTag}` : `### ${timeTag}`;
    const blocks = [heading];
    (savedPaths || []).forEach(p => {
        const name = p.split("/").pop();
        const ext = (name.split(".").pop() || "").toLowerCase();
        const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "heic"].includes(ext);
        blocks.push(isImage ? `![[${p}]]` : `- [[${p}|${name}]]`);
    });
    if (bodyText) blocks.push("", bodyText);
    const content = await app.vault.read(file);
    await app.vault.modify(file, content.replace(/\s*$/, "") + "\n\n" + blocks.join("\n") + "\n");
}

async function saveMaterialTextFile(app, plugin, body, fileName, now) {
    const folder = getAttachmentFolder(plugin.settings);
    const base = sanitizeAmFileStem(fileName || `素材-${now.format("YYYYMMDD-HHmm")}`);
    const desired = joinVaultPath(folder, `${base}.md`);
    const path = makeUniqueVaultPath(app.vault, desired);
    await ensureFolderByPath(app.vault, path);
    const timeTag = now.format("YYYY-MM-DD HH:mm");
    await app.vault.create(path, `---\ncreated: ${timeTag}\ntype: material\n---\n\n${body.trim()}\n`);
    return path;
}

function makeUniqueVaultPath(vault, desiredPath, usedPaths = new Set()) {
    if (!vault.getAbstractFileByPath(desiredPath) && !usedPaths.has(desiredPath)) {
        usedPaths.add(desiredPath);
        return desiredPath;
    }
    const parts = desiredPath.split("/");
    const fileName = parts.pop();
    const folder = parts.join("/");
    const dot = fileName.lastIndexOf(".");
    const base = dot > 0 ? fileName.slice(0, dot) : fileName;
    const ext = dot > 0 ? fileName.slice(dot) : "";
    const stamp = window.moment().format("YYYYMMDDHHmmss");
    let i = 1;
    let path = desiredPath;
    do {
        path = `${folder}/${base}-${stamp}-${i}${ext}`;
        i++;
    } while (vault.getAbstractFileByPath(path) || usedPaths.has(path));
    usedPaths.add(path);
    return path;
}

function parseFileInfoFromUpload(file, fallbackExt = "bin") {
    const originalName = file?.name || "附件";
    const dot = originalName.lastIndexOf(".");
    const base = dot > 0 ? originalName.slice(0, dot) : originalName;
    const extFromName = dot > 0 ? originalName.slice(dot + 1).toLowerCase() : "";
    let extension = extFromName || fallbackExt;
    const mime = String(file?.type || "").toLowerCase();
    if (!extFromName && mime.startsWith("image/")) {
        extension = (mime.split("/")[1] || "png").replace("jpeg", "jpg");
    }
    if (extension === "jpeg") extension = "jpg";
    return {
        extension,
        originalBaseName: base,
        preferredName: originalName.includes(".") ? originalName : undefined
    };
}

function rewriteBodyAttachmentLink(body, oldPath, newPath) {
    if (!body || !oldPath || !newPath || oldPath === newPath) return body;
    let next = body.split(oldPath).join(newPath);
    const oldName = oldPath.split("/").pop();
    const newName = newPath.split("/").pop();
    if (oldName && newName && oldName !== newName) next = next.split(oldName).join(newName);
    return next;
}

function getCaptureTextExcludingPendingLinks(body, pendingImages) {
    let text = String(body || "");
    for (const img of pendingImages || []) {
        for (const token of [img?.path, img?.name].filter(Boolean)) {
            const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            text = text.replace(new RegExp(`!\\[\\[${escaped}(?:\\|[^\\]]*)?\\]\\]`, "g"), "");
            text = text.replace(new RegExp(`\\[\\[${escaped}(?:\\|[^\\]]*)?\\]\\]`, "g"), "");
        }
    }
    text = text.replace(/!\[\[[^\]]+\]\]/g, "").replace(/\[\[[^\]]+\]\]/g, "");
    return text.replace(/\s+/g, " ").trim();
}

function truncateDisplayText(text, maxLen = 16) {
    const raw = String(text || "").trim();
    if (raw.length <= maxLen) return raw;
    return raw.slice(0, Math.max(4, maxLen - 1)) + "…";
}

const DEFAULT_SETTINGS = {
    licenseKey: "", licenseActivated: false, trialStartedAt: "", trialWelcomeSeen: false, trialReminder2hSeen: false, trialReminder30mSeen: false,
    lastSeenVersion: "", welcomeGuideVersion: "", attachmentMgmtHintSeen: false, basicStructureReady: false, captureCategoryHintSeen: false,
    weeklySectionTodo: "", weeklySectionMeeting: "", weeklySectionWeekly: "", weeklySectionDaily: "",
    pathIdeas: "Inbox/Ideas.md", pathTasks: "Inbox/Tasks.md", pathEssays: "读&写/随笔.md", pathWork: "Work", pathClippings: "Inbox/Clippings", pathClipReflections: "读&写/剪藏感悟", clipCategories: ["科技", "人文", "娱乐", "AI", "学习"], pathDrafts: "Inbox/草稿.md", pathAttachments: "Boxes/附件", pathMaterials: "Boxes/文件墙.md", followAttachmentManagement: true, pathQuotes: "Weread", habitData: {}, statsHistory: {}, 
    defaultLat: "31.81", defaultLon: "119.97",
    weatherCoordsCustom: false,
    habitsConfig: [ { id: "fitness", n: "健身", i: "🏋️" }, { id: "reading", n: "阅读", i: "📖" }, { id: "nosmoking", n: "戒烟", i: "🚭" } ],
    colorTodo: "#FAF9DE", colorMeeting: "#E3EDCD", colorWeekly: "#DCE2F1", colorDaily: "#FDE6E0",
    modules: [ { id: 'greeting', name: '问候语与天气', enabled: true }, { id: 'progress', name: '时间进度条', enabled: true }, { id: 'buttons', name: '快捷工具按钮', enabled: true }, { id: 'tasks', name: '待办总览', enabled: true }, { id: 'habits', name: '习惯打卡', enabled: true }, { id: 'quote', name: '每日金句', enabled: true }, { id: 'stats', name: '数据统计', enabled: true } ]
};

const ICONS = { zap:`<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`, clock:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`, mic:`<svg viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`, archive:`<svg viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`, expand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`, upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`, tag:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/></svg>`, uList:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></svg>`, oList:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`, time:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`, flag:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`, doc:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`, temp:`<svg viewBox="0 0 24 24"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>`, wind:`<svg viewBox="0 0 24 24"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 2H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg>` };

/** Mobile soft-keyboard: shrink input + keep actions above keyboard via visualViewport. */
function bindBcMobileKeyboardGuard(host, opts = {}) {
    if (!host?.app?.isMobile) return () => {};
    const modalEl = host.modalEl;
    const getScrollTarget = opts.getScrollTarget || (() => null);
    const getTextArea = opts.getTextArea || (() => null);
    let raf = 0;
    const apply = () => {
        const vv = window.visualViewport;
        const kb = vv ? Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)) : 0;
        document.body.style.setProperty("--bc-kb-inset", `${kb}px`);
        if (kb > 60) {
            modalEl?.addClass("bc-kb-open");
            const target = getScrollTarget();
            if (target) {
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    try { target.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (_) {}
                });
            }
        } else {
            modalEl?.removeClass("bc-kb-open");
        }
    };
    const onFocus = () => { apply(); window.setTimeout(apply, 280); };
    const onBlur = () => { window.setTimeout(apply, 120); };
    const textArea = getTextArea();
    textArea?.addEventListener("focus", onFocus);
    textArea?.addEventListener("blur", onBlur);
    window.visualViewport?.addEventListener("resize", apply);
    window.visualViewport?.addEventListener("scroll", apply);
    apply();
    return () => {
        cancelAnimationFrame(raf);
        textArea?.removeEventListener("focus", onFocus);
        textArea?.removeEventListener("blur", onBlur);
        window.visualViewport?.removeEventListener("resize", apply);
        window.visualViewport?.removeEventListener("scroll", apply);
        modalEl?.removeClass("bc-kb-open");
        document.body.style.removeProperty("--bc-kb-inset");
    };
}

class MaterialSaveModal extends Modal {
    constructor(app, plugin, options = {}) {
        super(app);
        this.plugin = plugin;
        this.pendingImages = options.pendingImages || [];
        this._done = false;
        this._resolve = null;
        this._addedMobileTop = false;
        this.promise = new Promise((resolve) => { this._resolve = resolve; });
    }

    waitForSubmit() { return this.promise; }

    finish(result) {
        this._done = true;
        if (this._resolve) { this._resolve(result); this._resolve = null; }
        this.close();
    }

    onClose() {
        if (this._addedMobileTop) document.body.removeClass("bc-mobile-force-top");
        this._addedMobileTop = false;
        if (!this._done && this._resolve) { this._resolve(null); this._resolve = null; }
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.addClass("bc-material-modal");
        this.modalEl.addClass("bc-material-dialog");
        if (this.app.isMobile && !document.body.hasClass("bc-mobile-force-top")) {
            document.body.addClass("bc-mobile-force-top");
            this._addedMobileTop = true;
        }
        ["bc-material-modal-styles", "bc-material-modal-styles-v2", "bc-material-modal-styles-v3", "bc-material-modal-styles-v4"].forEach((id) => {
            const prev = document.getElementById(id);
            if (prev) prev.remove();
        });
        {
            const style = document.createElement("style");
            style.id = "bc-material-modal-styles-v4";
            style.textContent = `.bc-material-dialog .modal-content{overflow:visible!important}.bc-material-modal{padding:22px 26px 28px;max-width:520px;box-sizing:border-box}.bc-material-title{margin:0 0 8px;font-size:18px;line-height:1.35}.bc-material-modal>.setting-item-description{margin:0 0 16px;line-height:1.55}.bc-material-row{display:flex;align-items:center;gap:10px;margin:0 0 14px;flex-wrap:wrap}.bc-material-ext-badge{font-size:11px;font-weight:700;color:var(--text-accent);background:var(--background-secondary);padding:2px 8px;border-radius:6px;flex-shrink:0}.bc-material-name-input{flex:1;min-width:140px;padding:8px 10px;border-radius:8px;border:1px solid var(--background-modifier-border);background:var(--background-primary);box-sizing:border-box}.bc-material-target{width:100%;font-size:11px;color:var(--text-muted);padding-left:46px;margin-top:-6px;margin-bottom:4px;line-height:1.4}.bc-material-catalog{margin-top:8px}.bc-material-catalog-label{font-size:13px;font-weight:700;margin:0 0 6px;color:var(--text-normal)}.bc-material-catalog-desc{font-size:11px;color:var(--text-muted);margin:0 0 12px;line-height:1.55}.bc-material-catalog-input{width:100%;flex:none;min-width:0;display:block}.bc-material-foot{display:flex;justify-content:flex-end;gap:12px;margin-top:28px;padding-top:4px}.bc-material-foot button{min-height:36px;padding:0 16px}
            .bc-mobile-force-top .modal-container{align-items:flex-start!important;justify-content:center!important;padding-top:0!important;padding-bottom:0!important}
            .bc-mobile-force-top .bc-material-dialog,.bc-material-dialog.bc-mobile-adapted{width:96%!important;max-width:96%!important;margin:48px auto 0!important;box-sizing:border-box!important;left:auto!important;right:auto!important;max-height:calc(100vh - 52px)!important;max-height:calc(100dvh - 52px)!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important}
            .bc-mobile-force-top .bc-material-modal{padding:16px 16px 20px;max-width:none}
            .bc-mobile-force-top .bc-material-title{font-size:16px;margin-bottom:6px}
            .bc-mobile-force-top .bc-material-row{margin:0 0 12px;gap:8px}
            .bc-mobile-force-top .bc-material-name-input{min-width:0;font-size:16px;padding:10px}
            .bc-mobile-force-top .bc-material-target{padding-left:0;font-size:11px}
            .bc-mobile-force-top .bc-material-catalog{margin-top:6px}
            .bc-mobile-force-top .bc-material-foot{margin-top:22px;gap:8px}
            .bc-mobile-force-top .bc-material-foot button{flex:1;min-height:40px}
            .bc-mobile-force-top .bc-material-dialog .modal-close-button{width:44px!important;height:44px!important;transform:scale(.72)!important;top:0!important;right:0!important;opacity:.65!important;display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important}
            @media (max-width:480px){.bc-material-dialog{width:96%!important;max-width:96%!important;margin:48px auto 0!important;max-height:calc(100vh - 52px)!important;max-height:calc(100dvh - 52px)!important;overflow-y:auto!important}.bc-material-modal{padding:16px 16px 20px}.bc-material-name-input{font-size:16px;min-width:0}.bc-material-target{padding-left:0}.bc-material-foot button{min-height:40px}}`;
            document.head.appendChild(style);
        }
        contentEl.createEl("h2", { text: "保存素材", cls: "bc-material-title" });
        const hasAm = !!getAttachmentMgmtSettings(this.app);
        contentEl.createEl("p", {
            text: hasAm
                ? "已检测到 Attachment Management：匹配扩展名规则的类型将自动分类，其余保存到 Boxes/附件。"
                : "未检测到 Attachment Management：所有素材将统一保存到 Boxes/附件。建议安装 AM 插件以实现图片/PDF/录音自动分类。",
            cls: "setting-item-description"
        });

        this.nameInputs = [];
        this._catalogInput = null;
        const notePath = this.plugin.settings.pathMaterials || "Boxes/文件墙.md";

        const am = getAttachmentMgmtSettings(this.app);
        const dateFormat = am?.dateFormat || "YYYYMMDD";
        this.pendingImages.forEach((img, i) => {
            const ext = String(img.extension || (img.name?.includes(".") ? img.name.split(".").pop() : "bin")).replace(/^\./, "");
            const defaultStem = getMaterialDefaultStem(img, dateFormat);
            const targetFolder = getMaterialTargetFolderLabel(this.app, this.plugin.settings, ext, notePath);
            const row = contentEl.createDiv({ cls: "bc-material-row" });
            row.createSpan({ text: `${ext.toUpperCase()}`, cls: "bc-material-ext-badge" });
            const input = row.createEl("input", { type: "text", value: defaultStem, cls: "bc-material-name-input" });
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") { e.preventDefault(); contentEl.querySelector(".bc-material-save-btn")?.click(); }
            });
            contentEl.createDiv({ text: `→ ${targetFolder}`, cls: "bc-material-target" });
            this.nameInputs[i] = input;
        });

        const catalogBlock = contentEl.createDiv({ cls: "bc-material-catalog" });
        catalogBlock.createDiv({ text: "素材日志标题（可选）", cls: "bc-material-catalog-label" });
        catalogBlock.createDiv({
            text: "选填。写入 Boxes/素材日志.md；文件墙会自动展示 Boxes 里的文件，无需索引",
            cls: "bc-material-catalog-desc"
        });
        const catalogInputEl = catalogBlock.createEl("input", {
            type: "text",
            cls: "bc-material-name-input bc-material-catalog-input",
            attr: { placeholder: "例如：参考图 / 品牌素材" }
        });
        this._catalogInput = () => ({ getValue: () => catalogInputEl.value });

        const foot = contentEl.createDiv({ cls: "bc-material-foot" });
        foot.createEl("button", { text: "取消" }).onclick = () => this.close();
        const saveBtn = foot.createEl("button", { text: "保存", cls: "mod-cta bc-material-save-btn" });
        saveBtn.onclick = () => {
            const fileNames = this.pendingImages.map((img, i) => ({
                index: i,
                baseName: sanitizeAmFileStem(this.nameInputs[i]?.value || img.originalBaseName || "素材")
            }));
            this.finish({
                fileNames,
                catalogTitle: this._catalogInput?.()?.getValue?.() || ""
            });
        };
        if (this.nameInputs[0]) window.setTimeout(() => this.nameInputs[0].focus(), 80);
    }
}

function mountCaptureCategoryRow(container, btnRow, items, options = {}) {
    const { getTip, onCategoryClick, withTipMenu, app } = options;

    const mountItem = (row, item) => {
        const tip = typeof getTip === "function" ? getTip(item) : (item.tip || item.label);
        const btn = row.createDiv({ cls: "bc-row-item", attr: { title: tip } });
        btn.createDiv({ cls: "bc-row-icon", text: item.icon });
        btn.createSpan({ text: item.label });
        btn.onclick = () => onCategoryClick(item);
        if (withTipMenu && app) {
            const showTipMenu = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const menu = new Menu();
                menu.addItem(m => m.setTitle(tip).setIcon("info"));
                if (app.isMobile) menu.showAtPosition({ x: e.clientX || 120, y: e.clientY || 280 });
                else menu.showAtMouseEvent(e);
            };
            btn.addEventListener("contextmenu", showTipMenu);
            let pressTimer = null;
            btn.addEventListener("touchstart", () => {
                pressTimer = window.setTimeout(showTipMenu, 480);
            }, { passive: true });
            btn.addEventListener("touchend", () => { if (pressTimer) window.clearTimeout(pressTimer); });
            btn.addEventListener("touchmove", () => { if (pressTimer) window.clearTimeout(pressTimer); });
        }
        return btn;
    };

    // 七分类直接展示：桌面单行；移动端 CSS 网格一行 4、二行 3
    items.forEach(item => mountItem(btnRow, item));
}

class CaptureModal extends Modal {
    constructor(app, plugin) { super(app); this.plugin = plugin; this.pendingImages = []; this.useSource = false; this.isExpanded = false; }

    makeImageName() {
        return `IMG-${window.moment().format("YYYYMMDDHHmmssSSS")}-${Math.random().toString(36).slice(2, 6)}.png`;
    }

    async ensureFolderByPath(path) {
        return ensureFolderByPath(this.app.vault, path);
    }

    makeDraggable(handleEl) {
        if (this.app.isMobile || window.innerWidth <= 768) return; 
        handleEl.style.cursor = 'grab';
        this.dragMouseMove = (e) => {
            if (!this.isDragging) return;
            this.modalEl.style.left = (e.clientX - this.dragOffsetX) + 'px';
            this.modalEl.style.top = (e.clientY - this.dragOffsetY) + 'px';
        };
        this.dragMouseUp = () => {
            if (this.isDragging) {
                this.isDragging = false; handleEl.style.cursor = 'grab'; document.body.style.userSelect = '';
            }
        };
        handleEl.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || ['A', 'BUTTON', 'INPUT', 'TEXTAREA'].includes(e.target.tagName)) return; 
            this.isDragging = true; handleEl.style.cursor = 'grabbing';
            const rect = this.modalEl.getBoundingClientRect();
            if (this.modalEl.style.position !== 'absolute') {
                this.modalEl.style.position = 'absolute'; this.modalEl.style.margin = '0';
                this.modalEl.style.bottom = 'auto'; this.modalEl.style.right = 'auto';
                this.modalEl.style.left = rect.left + 'px'; this.modalEl.style.top = rect.top + 'px';
            }
            this.dragOffsetX = e.clientX - rect.left; this.dragOffsetY = e.clientY - rect.top;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', this.dragMouseMove); document.addEventListener('mouseup', this.dragMouseUp);
    }

    async onOpen() {
        const { contentEl } = this; contentEl.empty(); contentEl.style.padding = "0"; contentEl.style.display = "block"; if (this.app.isMobile) document.body.addClass("bc-mobile-force-top"); this.modalEl.addClass("bc-modal-container"); this.injectStyles();
        const activeFile = getCaptureContextFile(this.app);
        const sourceName = activeFile ? activeFile.basename : "无来源";
        const navRow = contentEl.createDiv({ cls: "bc-nav-row" }); navRow.createSpan({ text: "最近文件: ", cls: "bc-nav-label" }); const navWrapper = navRow.createDiv({ cls: "bc-nav-links-wrapper" });
        this.app.workspace.getLastOpenFiles().slice(0, 3).forEach(p => { const name = p.split("/").pop().replace(".md", ""); const link = navWrapper.createEl("a", { cls: "bc-nav-link", text: name }); link.onclick = () => { this.app.workspace.openLinkText(p, "", false); this.close(); }; });
        
        this.makeDraggable(navRow); 

        const inputBox = contentEl.createDiv({ cls: "bc-input-container" }); this.inputBox = inputBox; this.textArea = inputBox.createEl("textarea", { cls: "bc-textarea", attr: { placeholder: "记录些什么..." } });
        const sourceDisplay = truncateDisplayText(sourceName, 16);
        const sourceToggle = inputBox.createDiv({ cls: "bc-source-indicator" });
        this.sourceStatus = sourceToggle.createDiv({ cls: `bc-source-dot ${this.useSource ? 'active' : ''}` });
        const sourceText = sourceToggle.createSpan({ cls: "bc-source-text" });
        sourceText.setText(`🔗 引用来源: ${sourceDisplay}`);
        if (activeFile?.path) sourceText.setAttr("title", activeFile.path);
        else if (sourceName) sourceText.setAttr("title", sourceName);
        sourceToggle.onclick = () => { this.useSource = !this.useSource; this.sourceStatus.toggleClass("active", this.useSource); };
        
        let enterHandled = false;
        this.textArea.addEventListener("keydown", (e) => { 
            if ((e.key === "Enter" || e.keyCode === 13) && !e.metaKey && !e.ctrlKey) { 
                const el = this.textArea; 
                const start = el.selectionStart; 
                const textBefore = el.value.substring(0, start); 
                const lastLine = textBefore.split('\n').pop(); 
                
                const listMatch = lastLine.match(/^([ \t\u00A0]*)([-*]|\d+\.)[ \t\u00A0]+(.*)/); 
                if (listMatch) { 
                    e.preventDefault(); 
                    enterHandled = true;
                    setTimeout(() => { enterHandled = false; }, 50); 
                    
                    const indent = listMatch[1]; 
                    const marker = listMatch[2]; 
                    const content = listMatch[3]; 
                    
                    if (!content.trim()) { 
                        el.value = el.value.substring(0, start - lastLine.length) + "\n" + el.value.substring(start); 
                        el.setSelectionRange(start - lastLine.length + 1, start - lastLine.length + 1); 
                        return; 
                    } 
                    
                    let newMarker = marker;
                    const numMatch = marker.match(/^(\d+)\./);
                    if (numMatch) newMarker = `${parseInt(numMatch[1], 10) + 1}.`; 
                    
                    this.insertAtCursor("\n" + indent + newMarker + " "); 
                } 
            } 
            if ((e.metaKey || e.ctrlKey) && (e.key === "Enter" || e.keyCode === 13)) { 
                e.preventDefault(); 
                this.processSave({ isDraft: true }); 
            } 
        });

        this.textArea.addEventListener("input", (e) => {
            if (enterHandled) return;
            const el = this.textArea;
            const start = el.selectionStart;
            if (start > 0 && el.value[start - 1] === '\n') {
                if (e.inputType === "deleteContentBackward" || e.inputType === "deleteWordBackward") return;
                
                const textBefore = el.value.substring(0, start - 1);
                const lastLine = textBefore.split('\n').pop();
                
                const listMatch = lastLine.match(/^([ \t\u00A0]*)([-*]|\d+\.)[ \t\u00A0]+(.*)/);
                if (listMatch) {
                    const indent = listMatch[1];
                    const marker = listMatch[2];
                    const content = listMatch[3];
                    
                    if (!content.trim()) {
                        el.value = el.value.substring(0, start - lastLine.length - 1) + "\n" + el.value.substring(start);
                        el.setSelectionRange(start - lastLine.length, start - lastLine.length);
                        return;
                    }
                    
                    let newMarker = marker;
                    const numMatch = marker.match(/^(\d+)\./);
                    if (numMatch) newMarker = `${parseInt(numMatch[1], 10) + 1}.`; 
                    
                    this.insertAtCursor(indent + newMarker + " ");
                }
            }
        });

        this.textArea.addEventListener("paste", async (e) => {
            const cd = e.clipboardData || e.originalEvent?.clipboardData;
            if (!cd) return;
            // 有纯文本（含网址）时优先走系统粘贴，避免被剪贴板里的预览图拦截导致卡顿/丢字
            const plain = String(cd.getData("text/plain") || "").trim();
            if (plain) return;

            const items = cd.items || [];
            let handledImage = false;
            for (const item of items) {
                if (!item?.type || item.type.indexOf("image") === -1) continue;
                if (!handledImage) {
            e.preventDefault();
                    handledImage = true;
                }
            const file = item.getAsFile();
            if (!file) continue;
            const notePath = this.plugin.getCaptureNotePathForPending();
            const info = parseFileInfoFromUpload(file, "png");
            const usedPaths = new Set((this.pendingImages || []).map(x => x.path).filter(Boolean));
            const path = makeUniqueVaultPath(
                this.app.vault,
                resolveCaptureAttachmentPath(this.app, this.plugin.settings, info, notePath),
                usedPaths
            );
            const name = path.split("/").pop();
            this.pendingImages.push({ name, path, data: await file.arrayBuffer(), extension: info.extension, originalBaseName: info.originalBaseName, mime: file.type || "", isImage: true });
            this.insertAtCursor(`![[${path}]]`);
    }
});
        
        const toolbar = inputBox.createDiv({ cls: "bc-editor-toolbar" }); 
        this.addTool(toolbar, ICONS.expand, () => this.toggleSize()); 
        this.addTool(toolbar, ICONS.upload, () => this.triggerUpload()); 
        this.addTool(toolbar, ICONS.tag, () => this.pickAndInsertTag()); 
        this.addTool(toolbar, ICONS.uList, () => this.insertAtCursor("- ")); 
        this.addTool(toolbar, ICONS.oList, () => this.insertAtCursor("1. ")); 
        
        const timeBtn = this.addTool(toolbar, ICONS.time, (e) => this.insertSmartDateTime(e)); 
        timeBtn.addClass("bc-desktop-only");

        this.addTool(toolbar, ICONS.flag, (e) => this.showPriorityMenu(e)); 
        this.addTool(toolbar, ICONS.doc, (e) => this.showDraftHistory(e));
        
        if (!this.app.isMobile) {
            const hint = contentEl.createDiv({ cls: "bc-capture-hint", text: "提示：⌘/Ctrl+Enter 可快速存草稿" });
            hint.style.cssText = "font-size:11px;color:var(--text-muted);text-align:center;margin:0 0 4px;opacity:0.85;";
        } else {
            const mobileHint = contentEl.createDiv({ cls: "bc-capture-mobile-hint", text: "素材仅文件 · 剪藏需 URL · 长按分类看说明" });
            mobileHint.style.cssText = "font-size:11px;color:var(--text-muted);text-align:center;margin:0 8px 6px;opacity:0.9;line-height:1.4;";
            if (!this.plugin.settings.captureCategoryHintSeen) {
                this.plugin.settings.captureCategoryHintSeen = true;
                this.plugin.saveSettings();
                window.setTimeout(() => bcNoticeInfo("捕捉提示：素材仅文件；剪藏需在输入框粘贴 http(s) 链接", 7000), 400);
            }
        }
        const btnRow = contentEl.createDiv({ cls: "bc-button-row" });
        const items = [
            { label: "工作", icon: "💼", isWork: true, tip: "写入本周工作文件的待办区块" },
            { label: "生活", icon: "🏠", isLife: true, tip: "写入 Inbox/Tasks.md 生活待办" },
            { label: "闪念", icon: "🧠", isIdea: true, tip: "写入闪念笔记" },
            { label: "随笔", icon: "📝", isEssay: true, tip: "写入随笔（年/月/周结构）" },
            { label: "剪藏", icon: "🔖", isClipper: true, tip: "需在输入框粘贴 http(s):// 网页链接" },
            { label: "素材", icon: "🎨", isMaterial: true, tip: "仅保存图片/PDF/音视频等文件，不可附带文字" },
            { label: "草稿", icon: "📋", isDraft: true, tip: "写入草稿区（有序列表）" }
        ];
        mountCaptureCategoryRow(contentEl, btnRow, items, {
            getTip: (item) => item.tip,
            onCategoryClick: (item) => item.isMaterial ? this.processMaterialSave() : this.processSave(item),
            withTipMenu: true,
            app: this.app
        });
        if (this.app.isMobile) {
            this._kbGuardCleanup = bindBcMobileKeyboardGuard(this, {
                getTextArea: () => this.textArea,
                getScrollTarget: () => btnRow
            });
        }
        setTimeout(() => this.textArea.focus(), 250);
    }

    async processMaterialSave() {
        if (this._saving) return false;
        if (!this.plugin.requireLicense()) return false;
        const body = String(this.textArea?.value || "");
        const pending = this.pendingImages || [];
        if (!pending.length) {
            new Notice("请先上传或粘贴图片、文档、音视频等文件");
            return false;
        }
        const extraText = getCaptureTextExcludingPendingLinks(body, pending);
        if (extraText) {
            new Notice("请重新选择：素材分类仅针对图片、文档、音视频文件有效，请清空输入框中的文字后再保存", 6000);
            return false;
        }
        this.plugin.maybeSuggestAttachmentManagement();
        const modal = new MaterialSaveModal(this.app, this.plugin, { pendingImages: pending });
        modal.open();
        const result = await modal.waitForSubmit();
        if (!result) return false;
        return await this.processSave({
            isMaterial: true,
            materialNames: result.fileNames,
            catalogTitle: result.catalogTitle
        });
    }

    async processSave(item) {
        if (this._saving) return false;
        if (!this.plugin.requireLicense()) return false;
        let body = this.textArea.value.trim();
        if (!body && !(this.pendingImages && this.pendingImages.length)) {
            new Notice("请输入内容或上传文件");
            return false;
        }
        if (item?.isClipper && !extractFirstUrl(body)) {
            new Notice("请在输入框粘贴网页链接（http:// 或 https://）");
            return false;
        }
        body = body.replace(/[。\.]$/, '');
        const ctxFile = getCaptureContextFile(this.app);
        const sourceLink = (ctxFile && this.useSource) ? ` (来自: [[${ctxFile.basename}]])` : "";
        const s = sourceLink;
        const now = window.moment(); const timeTag = now.format("YYYY-MM-DD HH:mm");
        this._saving = true;
        this.plugin._suppressDashboardRefresh = true;
        let success = true;
        try {
            const savedAssetPaths = [];
            const renamedNotices = [];
            const failedPending = [];
            const pendingCount = this.pendingImages.length;
            if (pendingCount > 0) {
                const targetNotePath = item.isMaterial
                    ? (this.plugin.settings.pathMaterials || "Boxes/文件墙.md")
                    : await this.plugin.resolveCaptureTargetNotePath(item, now);
                const usedPaths = new Set();
                for (let i = 0; i < pendingCount; i++) {
                    const img = this.pendingImages[i];
                    const ext = img.extension || (img.name?.includes(".") ? img.name.split(".").pop() : "bin");
                    const customBase = item.isMaterial
                        ? (item.materialNames?.find(m => m.index === i)?.baseName || img.originalBaseName || "素材")
                        : undefined;
                    const info = {
                        extension: ext,
                        originalBaseName: customBase || img.originalBaseName || img.name?.replace(/\.[^.]+$/, "") || "IMG",
                        preferredName: img.preferredName
                    };
                    const oldPath = img.path;
                    const desiredPath = item.isMaterial
                        ? resolveMaterialAttachmentPath(this.app, this.plugin.settings, info, targetNotePath, customBase)
                        : resolveCaptureAttachmentPath(this.app, this.plugin.settings, info, targetNotePath);
                    const newPath = makeUniqueVaultPath(this.app.vault, desiredPath, usedPaths);
                    if (newPath !== desiredPath) {
                        renamedNotices.push(`${desiredPath.split("/").pop()} → ${newPath.split("/").pop()}`);
                    }
                    body = rewriteBodyAttachmentLink(body, oldPath, newPath);
                    img.path = newPath;
                    img.name = newPath.split("/").pop();
                    const folder = newPath.includes("/") ? newPath.substring(0, newPath.lastIndexOf("/")) : "";
                    if (folder) await this.ensureFolderByPath(folder);
                    try {
                        await this.app.vault.createBinary(newPath, img.data);
                        savedAssetPaths.push(newPath);
                    } catch (err) {
                        bcNoticeError("附件保存失败", err);
                        failedPending.push(img);
                    }
                }
                if (renamedNotices.length) {
                    new Notice(`同名文件已自动重命名：${renamedNotices.join("；")}`, 6000);
                }
            }
            const attachmentFailCount = failedPending.length;
            if (attachmentFailCount > 0) {
                this.pendingImages = failedPending;
                new Notice(
                    `⚠️ ${attachmentFailCount} 个附件保存失败${savedAssetPaths.length ? `（${savedAssetPaths.length} 个已成功）` : ""}，请检查后重试`,
                    8000
                );
                return false;
            }
            if (item.isMaterial) {
                if (savedAssetPaths.length) {
                    await saveMaterialCatalogEntry(this.app, this.plugin, "", savedAssetPaths, now, item.catalogTitle);
                    const pathHint = savedAssetPaths.length === 1
                        ? savedAssetPaths[0]
                        : `${savedAssetPaths[0]} 等 ${savedAssetPaths.length} 个`;
                    new Notice(`已保存至 ${pathHint}`, 6000);
                } else {
                    bcNoticeWarn("未能保存任何素材文件");
                    success = false;
                }
            } else if (item.isEssay) {
                await saveEssayEntry(this.app, this.plugin, body, now, s);
            } else if (item.isIdea) {
                await saveWithYearMonth(this.app, this.plugin.settings.pathIdeas, "## 💡 闪念记录", formatAsTask(body), now, s);
            } else if (item.isDraft) {
                await saveWithYearMonth(this.app, this.plugin.settings.pathDrafts || "Inbox/草稿.md", "## ✍️ 随手草稿", formatAsOrderedList(body), now, s);
            } else if (item.isLife) {
                await saveWithYearMonth(this.app, this.plugin.settings.pathTasks, "", formatAsTask(body), now, s);
            } else if (item.isWork) {
                await saveWorkTaskEntry(this.app, this.plugin, body, now, s);
            } else if (item.isClipper || (!item.isMaterial && body.includes("![["))) {
                if (item.isClipper) {
                    const clipPath = await this.plugin.saveClipping(body, s);
                    if (clipPath) new Notice(`剪藏已保存至 ${clipPath}`, 6000);
                    else success = false;
                } else {
                    const imgFolder = getAttachmentFolder(this.plugin.settings);
                    const filePath = joinVaultPath(imgFolder, "图片库.md");
                    let file = this.app.vault.getAbstractFileByPath(filePath) || await this.app.vault.create(filePath, "## 🖼️ 图片库\n\n");
                    const content = await this.app.vault.read(file);
                    await this.app.vault.modify(file, content + `\n### ${timeTag}\n${body}${s}\n`);
                }
            }
            if (!success) return false;
            if (!item.isMaterial) bcNoticeSuccess("已保存");
            await this.plugin.ensureBasicStructureDeferred();
            this.pendingImages = [];
            if (this.textArea) this.textArea.value = "";
            this.close();
            return true;
        } catch (e) { bcNoticeWarn("错误: " + e.message); return false; }
        finally {
            this._saving = false;
            this.plugin._suppressDashboardRefresh = false;
            window.setTimeout(() => this.app.workspace.trigger("braincore:refresh"), 500);
        }
    }
    
    insertAtCursor(text) { 
        const el = this.textArea; 
        el.focus();
        let success = false;
        try { success = document.execCommand("insertText", false, text); } catch(e) {}
        if (!success) {
            const start = el.selectionStart; const end = el.selectionEnd; 
            el.value = el.value.substring(0, start) + text + el.value.substring(end); 
            el.setSelectionRange(start + text.length, start + text.length); 
        }
    }

    pickAndInsertTag() {
        pickVaultTag(this.app, (tag) => {
            if (!tag) this.insertAtCursor("#");
            else this.insertAtCursor(`#${tag} `);
        });
    }
    
    showPriorityMenu(e) { const menu = new Menu(); [{l:"⏫ 极高",v:"⏫"}, {l:"🔼 高",v:"🔼"}, {l:"🔽 低",v:"🔽"}, {l:"❌ 清除",v:""}].forEach(p => { menu.addItem(i => i.setTitle(p.l).onClick(() => { if(p.v) this.insertAtCursor(p.v); })); }); if (this.app.isMobile) menu.showAtPosition({ x: e.clientX, y: e.clientY }); else menu.showAtMouseEvent(e); }
    isUploadImageFile(file) {
        const name = (file?.name || "").toLowerCase();
        const type = (file?.type || "").toLowerCase();
        return type.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg|bmp|heic|heif|tiff?)$/i.test(name);
    }

    sanitizeUploadAttachmentName(name) {
        const raw = String(name || "附件").trim();
        const cleaned = raw
            .replace(/[\\/:*?"<>|#^[\]]/g, "-")
            .replace(/\s+/g, " ")
            .replace(/^\.+/, "")
            .slice(0, 140);
        return cleaned || `附件-${window.moment().format("YYYYMMDDHHmmss")}`;
    }

    makeUniqueUploadAttachmentPath(file, usedPaths = new Set()) {
        const info = parseFileInfoFromUpload(file);
        const cleaned = this.sanitizeUploadAttachmentName(file.name || "附件");
        const cleanedBase = cleaned.replace(/\.[^.]+$/, "") || info.originalBaseName;
        info.originalBaseName = cleanedBase;
        const notePath = this.plugin.getCaptureNotePathForPending();
        const desired = resolveCaptureAttachmentPath(this.app, this.plugin.settings, info, notePath);
        return makeUniqueVaultPath(this.app.vault, desired, usedPaths);
    }

    async handleCaptureSelectedFiles(fileList) {
        const files = Array.from(fileList || []);
        if (!files.length) return;

        const usedPaths = new Set((this.pendingImages || []).map(x => x.path).filter(Boolean));
        const links = [];

        for (const file of files) {
            const path = this.makeUniqueUploadAttachmentPath(file, usedPaths);
            const name = path.split("/").pop();
            const info = parseFileInfoFromUpload(file);
            const isImage = this.isUploadImageFile(file);

            this.pendingImages.push({
                name,
                path,
                data: await file.arrayBuffer(),
                mime: file.type || "",
                extension: info.extension,
                originalBaseName: info.originalBaseName,
                isImage,
                isAttachment: !isImage
            });

            links.push(isImage ? `![[${path}]]` : `[[${path}]]`);
        }

        this.insertAtCursor((this.textArea.value && !this.textArea.value.endsWith("\n") ? "\n" : "") + links.join("\n") + "\n");
        new Notice(`已添加 ${files.length} 个文件，点击保存后写入库内`);
    }

    openCaptureFileInput(options = {}) {
        const input = this.contentEl.createEl("input", {
            type: "file",
            cls: "bc-hidden-picker"
        });
        input.multiple = true;
        input.setAttribute("multiple", "multiple");

        if (options.accept) {
            input.setAttribute("accept", options.accept);
        }

        input.onchange = async (e) => {
            try {
                await this.handleCaptureSelectedFiles(e.target.files);
            } finally {
                input.remove();
            }
        };

        input.click();
    }

    async triggerUpload() {
        if (this.app.isMobile) {
            const menu = new Menu();
            menu.addItem(item => item
                .setTitle("选择照片 / 视频")
                .setIcon("image")
                .onClick(() => this.openCaptureFileInput({ accept: "image/*,video/*" }))
            );
            menu.addItem(item => item
                .setTitle("选择文件 / 附件")
                .setIcon("paperclip")
                .onClick(() => this.openCaptureFileInput())
            );
            menu.addItem(item => item
                .setTitle("取消")
                .onClick(() => {})
            );
            menu.showAtPosition({
                x: Math.round((window.innerWidth || 360) / 2),
                y: 260
            });
            return;
        }

        this.openCaptureFileInput();
    }
    insertSmartDateTime() { 
        const oldPicker = document.getElementById('bc-temp-picker'); 
        if (oldPicker) oldPicker.remove(); 
        const picker = this.contentEl.createEl("input", { type: "datetime-local", cls: "bc-hidden-picker", attr: { id: 'bc-temp-picker' } }); 
        picker.onchange = (e) => { this.insertAtCursor(` 📅 ${e.target.value.replace("T", " ")}`); picker.remove(); }; 
        picker.addEventListener('blur', () => setTimeout(() => { if(document.body.contains(picker)) picker.remove(); }, 500)); 
        picker.showPicker ? picker.showPicker() : picker.click(); 
    }
    async showDraftHistory(e) {
        const file = this.app.vault.getAbstractFileByPath(this.plugin.settings.pathDrafts || "Inbox/草稿.md");
        if (!file) return;
        const content = await this.app.vault.read(file);
        const draftLines = content.split("\n").filter(isDraftListLine).slice(0, 5);
        const menu = new Menu();
        draftLines.forEach(line => {
            const preview = stripDraftLineContent(line).substring(0, 25);
            menu.addItem(i => i.setTitle(preview + "...").onClick(() => {
                this.textArea.value = stripDraftLineContent(line);
                this.textArea.focus();
            }));
        });
        if (this.app.isMobile) menu.showAtPosition({ x: e.clientX || 160, y: e.clientY || 300 });
        else menu.showAtMouseEvent(e);
    }
    
    toggleSize() { 
        this.isExpanded = !this.isExpanded; 
        if (this.app.isMobile) {
            const box = this.inputBox || this.textArea?.closest(".bc-input-container");
            if (box) box.toggleClass("bc-capture-expanded", this.isExpanded);
            if (this.textArea) this.textArea.toggleClass("bc-capture-expanded", this.isExpanded);
            this.modalEl.toggleClass("bc-capture-expanded", this.isExpanded);
        } else {
            this.modalEl.style.setProperty('width', this.isExpanded ? '900px' : '720px', 'important'); 
            this.textArea.style.height = this.isExpanded ? "420px" : "220px"; 
        }
    }
    
    addTool(parent, svg, cb) { const btn = parent.createEl("button", { cls: "bc-tool-btn" }); btn.innerHTML = svg; if (cb) btn.onclick = (e) => { e.preventDefault(); cb(e); }; return btn; }
    
    injectStyles() {
        const styleId = "bc-capture-modal-styles-v268";
        ["bc-capture-modal-styles", "bc-capture-modal-styles-v241", "bc-capture-modal-styles-v242", "bc-capture-modal-styles-v244", "bc-capture-modal-styles-v245", "bc-capture-modal-styles-v259", "bc-capture-modal-styles-v260", "bc-capture-modal-styles-v261", "bc-capture-modal-styles-v262", "bc-capture-modal-styles-v263", "bc-capture-modal-styles-v264", "bc-capture-modal-styles-v265", "bc-capture-modal-styles-v266", "bc-capture-modal-styles-v267"].forEach((id) => {
            const prev = document.getElementById(id);
            if (prev) prev.remove();
        });
        if (document.getElementById(styleId)) return;
        const style = document.createElement("style"); style.id = styleId;
        style.textContent = `.bc-modal-container{border-radius:24px!important;background:var(--background-primary)!important;width:864px!important;border:1px solid var(--background-modifier-border)!important;padding:0!important;max-width:92vw!important;overflow:hidden!important}.bc-modal-container .modal-content{padding:0!important;margin:0!important;overflow:visible!important;display:flex!important;flex-direction:column!important}.bc-nav-row{padding:18px 24px 0;display:flex;align-items:center;gap:8px;overflow:hidden}.bc-nav-label{font-size:11px;color:var(--text-muted);flex-shrink:0}.bc-nav-links-wrapper{display:flex;gap:6px;overflow:hidden;flex:1}.bc-nav-link{font-size:11px;color:var(--text-accent);background:transparent;padding:4px 10px;border-radius:6px;border:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px;text-decoration:none!important}.bc-input-container{position:relative;padding:18px;background:var(--background-primary);border-radius:18px;margin:12px 24px 20px;border:1.5px solid var(--background-modifier-border);min-height:260px}.bc-textarea{width:100%;border:none!important;background:0 0!important;resize:none;font-size:17px;padding-bottom:55px;outline:0!important;line-height:1.6;color:var(--text-normal);box-shadow:none!important;scrollbar-width:none!important;min-height:220px;height:220px;box-sizing:border-box!important}.bc-textarea::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}.bc-source-indicator{position:absolute;bottom:12px;left:18px;display:flex;align-items:center;gap:6px;background:var(--background-secondary);padding:4px 12px;border-radius:20px;cursor:pointer;border:1px solid var(--background-modifier-border);z-index:11;max-width:min(240px,calc(100% - 140px));overflow:hidden;min-width:0}.bc-source-dot{width:10px;height:10px;border-radius:50%;border:1.5px solid var(--text-muted);flex-shrink:0}.bc-source-dot.active{background:#4caf50;border-color:#4caf50}.bc-source-text{font-size:11px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex:1}.bc-editor-toolbar{position:absolute;bottom:12px;right:18px;display:flex;gap:6px;z-index:10}.bc-tool-btn{background:transparent!important;border:none!important;box-shadow:none!important;color:var(--text-muted);cursor:pointer;padding:6px!important;display:flex;border-radius:8px;height:auto!important;width:auto!important}.bc-tool-btn svg{width:20px;height:20px}.bc-button-row{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;padding:0 20px 8px}.bc-capture-hint{line-height:1.3;padding:0 24px}.bc-row-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;background:transparent;border-radius:10px;padding:4px 0;cursor:pointer;border:1px solid transparent;transition:opacity .15s ease,color .15s ease;min-width:0}.bc-row-item:hover{background:transparent;border-color:transparent;opacity:.82}.bc-row-icon{font-size:18px;line-height:1}.bc-row-item span{font-size:12px;margin-top:2px;font-weight:600;color:var(--text-normal);line-height:1.15}.bc-hidden-picker{position:absolute;opacity:0;width:0;height:0;pointer-events:none}.bc-desktop-only{display:flex}
        @media (min-width:481px){
.bc-modal-container{width:min(864px,92vw)!important}
.bc-nav-row{padding:22px 29px 0;gap:10px}
.bc-nav-label{font-size:13px}
.bc-nav-links-wrapper{gap:7px}
.bc-nav-link{font-size:13px;padding:5px 12px;border-radius:7px;max-width:144px}
.bc-input-container{padding:22px;border-radius:22px;margin:14px 29px 24px;min-height:312px}
.bc-textarea{font-size:20px;padding-bottom:66px;min-height:264px;height:264px}
.bc-source-indicator{bottom:14px;left:22px;gap:7px;padding:5px 14px;border-radius:24px;max-width:min(288px,calc(100% - 168px))}
.bc-source-dot{width:12px;height:12px}
.bc-source-text{font-size:13px}
.bc-editor-toolbar{bottom:14px;right:22px;gap:7px}
.bc-tool-btn{padding:7px!important;border-radius:10px}
.bc-tool-btn svg{width:24px;height:24px}
.bc-button-row{gap:5px;padding:0 24px 10px}
.bc-capture-hint{padding:0 29px}
.bc-row-item{border-radius:12px;padding:5px 0}
.bc-row-icon{font-size:22px}
.bc-row-item span{font-size:14px;margin-top:2px}
}@media (max-width:480px){
            .modal-close-button{width:44px!important;height:44px!important;transform:scale(.72)!important;top:0!important;right:0!important;opacity:.65!important;display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important}
            .bc-modal-container,.bc-capsule-modal{width:96%!important;max-width:96%!important;margin:48px auto 0!important;box-sizing:border-box!important;max-height:calc(100vh - 52px)!important;max-height:calc(100dvh - 52px)!important;padding-bottom:max(4px,var(--bc-kb-inset,0px))!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important}
            .bc-nav-row{padding:0 12px 0 12px!important;min-height:24px!important;margin-top:2px;padding-right:44px!important}
            .bc-nav-label{font-size:12px!important}
            .bc-nav-link{font-size:12px!important;padding:2px 6px!important}
            .bc-input-container{margin:2px 8px 6px!important;padding:0!important;border:none!important;position:relative!important;display:block!important;min-height:228px!important}
            .bc-textarea{font-size:16px;background:var(--background-primary)!important;border:1.5px solid var(--background-modifier-border)!important;border-radius:18px!important;padding:12px 12px 48px!important;width:100%!important;min-height:228px!important;height:228px!important;box-sizing:border-box!important}
            .bc-source-indicator{display:none!important}
            .bc-editor-toolbar{bottom:8px!important;left:auto!important;right:12px!important;width:auto!important;justify-content:flex-end!important;overflow-x:auto!important;padding-bottom:0!important;flex-wrap:nowrap!important}
            .bc-tool-btn { flex-shrink: 0 !important; }
            .bc-button-row{padding:0 6px 8px!important;gap:4px!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;align-items:stretch!important}
            .bc-row-item{padding:6px 0!important;border-radius:8px!important;min-height:30px!important;justify-content:center!important;display:flex!important;flex-direction:column!important;align-items:center!important;box-sizing:border-box!important}
            .bc-row-icon{font-size:18px!important;margin-bottom:0!important}
            .bc-row-item span{font-size:11px!important;margin-top:2px!important;line-height:1.15!important;font-weight:700!important}
            .bc-capture-mobile-hint{margin:0 8px 4px!important;padding:0!important;font-size:10px!important;line-height:1.25!important}
            .bc-desktop-only{display:none!important}
            .bc-input-container.bc-capture-expanded,.bc-modal-container.bc-capture-expanded .bc-input-container{min-height:0!important}
            .bc-textarea.bc-capture-expanded,.bc-input-container.bc-capture-expanded .bc-textarea{min-height:55vh!important;height:55vh!important}
            .bc-modal-container.bc-capture-expanded{max-height:calc(100vh - 36px)!important;max-height:calc(100dvh - 36px)!important}
            .bc-kb-open .bc-input-container{min-height:132px!important}
            .bc-kb-open .bc-textarea{min-height:132px!important;height:132px!important}
            .bc-kb-open .bc-capsule-input-box{min-height:148px!important}
            .bc-kb-open .bc-capsule-textarea{min-height:148px!important;height:148px!important}
        }
        /* 捕捉/闪念共用：强制顶对齐，禁止再叠 safe-area（否则会时高时低） */
        .bc-mobile-force-top .modal-container{align-items:flex-start!important;justify-content:center!important;padding-top:0!important;padding-bottom:0!important;padding-left:0!important;padding-right:0!important}
        .bc-mobile-force-top .bc-modal-container,
        .bc-mobile-force-top .bc-capsule-modal{width:96%!important;max-width:96%!important;margin:48px auto 0!important;box-sizing:border-box!important;left:auto!important;right:auto!important;max-height:calc(100vh - 52px)!important;max-height:calc(100dvh - 52px)!important;padding-bottom:max(4px,var(--bc-kb-inset,0px))!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important}
        .bc-mobile-force-top .bc-button-row{padding:0 6px 8px!important;gap:4px!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important}
        .bc-mobile-force-top .bc-row-item{padding:6px 0!important;border-radius:8px!important;min-height:30px!important;box-sizing:border-box!important}
        .bc-mobile-force-top .bc-row-icon{font-size:18px!important}
        .bc-mobile-force-top .bc-row-item span{font-size:11px!important;margin-top:2px!important}
        .bc-mobile-force-top .bc-input-container{min-height:228px!important}
        .bc-mobile-force-top .bc-textarea{min-height:228px!important;height:228px!important;padding-bottom:48px!important;box-sizing:border-box!important}
        .bc-mobile-force-top .bc-source-indicator{display:none!important}
        .bc-mobile-force-top .bc-editor-toolbar{bottom:8px!important;left:auto!important;right:12px!important;width:auto!important;justify-content:flex-end!important}
        .bc-mobile-force-top .bc-input-container.bc-capture-expanded{min-height:0!important}
        .bc-mobile-force-top .bc-textarea.bc-capture-expanded,.bc-mobile-force-top .bc-input-container.bc-capture-expanded .bc-textarea{min-height:55vh!important;height:55vh!important}
        .bc-mobile-force-top .bc-modal-container.bc-capture-expanded{max-height:calc(100vh - 36px)!important;max-height:calc(100dvh - 36px)!important}
        .bc-mobile-force-top .bc-capsule-input-box{margin:2px 8px 6px!important;min-height:300px!important}
        .bc-mobile-force-top .bc-capsule-textarea{min-height:300px!important;height:300px!important;padding:12px 12px 48px!important;box-sizing:border-box!important}
        .bc-mobile-force-top .bc-capsule-header{padding:0 12px!important;min-height:24px!important;margin-top:2px!important;padding-right:44px!important}
        .bc-mobile-force-top .bc-capsule-btn-row{padding:0 8px 10px!important}
        .bc-mobile-force-top .modal-close-button{width:44px!important;height:44px!important;transform:scale(.72)!important;top:0!important;right:0!important;opacity:.65!important;display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important}
        .bc-mobile-force-top .bc-kb-open .bc-input-container,.bc-mobile-force-top .bc-modal-container.bc-kb-open .bc-input-container{min-height:132px!important}
        .bc-mobile-force-top .bc-kb-open .bc-textarea,.bc-mobile-force-top .bc-modal-container.bc-kb-open .bc-textarea{min-height:132px!important;height:132px!important}
        .bc-mobile-force-top .bc-kb-open .bc-capsule-input-box,.bc-mobile-force-top .bc-capsule-modal.bc-kb-open .bc-capsule-input-box{min-height:148px!important}
        .bc-mobile-force-top .bc-kb-open .bc-capsule-textarea,.bc-mobile-force-top .bc-capsule-modal.bc-kb-open .bc-capsule-textarea{min-height:148px!important;height:148px!important}`;

        document.head.appendChild(style);
    }
    onClose() {
        if (this._kbGuardCleanup) { this._kbGuardCleanup(); this._kbGuardCleanup = null; }
        document.body.removeClass("bc-mobile-force-top");
        document.body.style.userSelect = '';
        if (!this.app.isMobile) {
            document.removeEventListener('mousemove', this.dragMouseMove);
            document.removeEventListener('mouseup', this.dragMouseUp);
        }
    }
}

class SmartCapsuleModal extends Modal {
    constructor(app, plugin) { super(app); this.plugin = plugin; }

    makeDraggable(handleEl) {
        if (this.app.isMobile || window.innerWidth <= 768) return;
        handleEl.style.cursor = 'grab';
        this.dragMouseMove = (e) => {
            if (!this.isDragging) return;
            this.modalEl.style.left = (e.clientX - this.dragOffsetX) + 'px';
            this.modalEl.style.top = (e.clientY - this.dragOffsetY) + 'px';
        };
        this.dragMouseUp = () => {
            if (this.isDragging) {
                this.isDragging = false;
                handleEl.style.cursor = 'grab';
                document.body.style.userSelect = '';
            }
        };
        handleEl.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || ['A', 'BUTTON', 'INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
            if (e.target.closest('.modal-close-button')) return;
            this.isDragging = true;
            handleEl.style.cursor = 'grabbing';
            const rect = this.modalEl.getBoundingClientRect();
            if (this.modalEl.style.position !== 'absolute') {
                this.modalEl.style.position = 'absolute';
                this.modalEl.style.margin = '0';
                this.modalEl.style.bottom = 'auto';
                this.modalEl.style.right = 'auto';
                this.modalEl.style.left = rect.left + 'px';
                this.modalEl.style.top = rect.top + 'px';
            }
            this.dragOffsetX = e.clientX - rect.left;
            this.dragOffsetY = e.clientY - rect.top;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', this.dragMouseMove);
        document.addEventListener('mouseup', this.dragMouseUp);
    }

    async onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        contentEl.style.padding = "0";
        contentEl.style.display = "block";
        if (this.app.isMobile) document.body.addClass("bc-mobile-force-top");
        this.modalEl.addClass("bc-capsule-modal");
        this.injectCapsuleStyles();

        const header = contentEl.createDiv({ cls: "bc-capsule-header" });
        header.createDiv({ cls: "bc-capsule-pulse" });
        header.createSpan({ text: "✨ 闪念胶囊", cls: "bc-capsule-title" });
        this.makeDraggable(header);

        const inputBox = contentEl.createDiv({ cls: "bc-capsule-input-box" });
        this.textArea = inputBox.createEl("textarea", {
            cls: "bc-capsule-textarea",
            attr: {
                placeholder: "输入内容，Enter 换行；⌘/Ctrl+Enter 或下方按钮发送\n建议带关键词，如「生活：买菜」"
            }
        });

        this._routeConfirmPending = null;
        const hintBar = inputBox.createDiv({ cls: "bc-capsule-route-hint" });
        this.routeStatus = hintBar.createSpan({ text: "🧠 等待输入分析中..." });
        this.textArea.addEventListener("input", () => {
            this._routeConfirmPending = null;
            const text = this.textArea.value.trim();
            const route = this.analyzeIntent(text);
            this.routeStatus.innerText = `🔜 将存入: [${route.name}]`;
            this.routeStatus.style.color = route.color;
        });
        this.textArea.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                this.executeSmartSave();
            }
        });
        const btnRow = contentEl.createDiv({ cls: "bc-capsule-btn-row" });
        const sendBtn = btnRow.createDiv({ cls: "bc-capsule-send-btn" });
        sendBtn.createSpan({ text: this.app.isMobile ? "🚀 智能发送" : "🚀 智能发送 (⌘/Ctrl+Enter)" });
        sendBtn.onclick = () => this.executeSmartSave();
        if (this.app.isMobile) {
            this._kbGuardCleanup = bindBcMobileKeyboardGuard(this, {
                getTextArea: () => this.textArea,
                getScrollTarget: () => btnRow
            });
        }
        setTimeout(() => this.textArea.focus(), 250);
    }
    analyzeIntent(text) {
        if (!text) return { name: "等待输入", color: "var(--text-muted)", type: "idea", clean: text };
        if (/工作|客诉|项目|会议|客户|汇报/.test(text)) return { name: "工作", color: "#e57373", type: "work", clean: text.replace(/^(本周工作待办|工作待办|工作|客诉|处理客诉)[:：\s]*/, '').trim() };
        if (/随笔|日记|记录|今天/.test(text)) return { name: "随笔", color: "#4caf50", type: "essay", clean: text.replace(/^(随笔|日记)[:：\s]*/, '').trim() };
        if (/待办|生活|买|要去|记得/.test(text)) return { name: "生活", color: "#64b5f6", type: "life", clean: text.replace(/^(生活待办|生活|待办|记得)[:：\s]*/, '').trim() };
        if (/剪藏|文章|资料|收藏|https?:\/\//.test(text)) return { name: "剪藏", color: "#ffa726", type: "clipper", clean: text.replace(/^(剪藏|文章|资料|收藏)[:：\s]*/, '').trim() };
        if (/素材|文件墙|附件|资源|品牌/.test(text)) return { name: "素材", color: "#ab47bc", type: "material", clean: text.replace(/^(素材|文件墙|附件|资源|品牌)[:：\s]*/, '').trim() };
        if (/草稿|临时|记一下/.test(text)) return { name: "草稿", color: "#9e9e9e", type: "draft", clean: text.replace(/^(草稿|临时|记一下)[:：\s]*/, '').trim() };
        return { name: "闪念", color: "var(--text-accent)", type: "idea", clean: text };
    }
    
    async executeSmartSave() {
        if (!this.plugin.requireLicense()) return;
        let body = this.textArea.value.trim();
        if (!body) { new Notice("请输入内容"); return; }
        const route = this.analyzeIntent(body);
        if (route.type === "clipper" && !extractFirstUrl(body)) {
            new Notice("请在输入框粘贴网页链接（http:// 或 https://）");
            return;
        }
        if (isAmbiguousCapsuleRoute(route.type, body)) {
            if (this._routeConfirmPending !== route.type) {
                this._routeConfirmPending = route.type;
                this.routeStatus.innerText = `⚠️ 将存入 [${route.name}]，再次发送确认`;
                this.routeStatus.style.color = "#d65d4e";
                new Notice(`将路由至「${route.name}」，请再次点击发送或按 ⌘/Ctrl+Enter 确认`, 3500);
                return;
            }
        }
        this._routeConfirmPending = null;
        const cleanText = route.clean.replace(/[。\.]$/, ''); const now = window.moment();
        try {
            if (route.type === "essay") {
                await saveEssayEntry(this.app, this.plugin, cleanText, now, "");
            } else if (route.type === "idea") {
                await saveWithYearMonth(this.app, this.plugin.settings.pathIdeas, "## 💡 闪念记录", formatAsTask(cleanText), now);
            } else if (route.type === "life") {
                await saveWithYearMonth(this.app, this.plugin.settings.pathTasks, "", formatAsTask(cleanText), now);
            } else if (route.type === "draft") {
                await saveWithYearMonth(this.app, this.plugin.settings.pathDrafts || "Inbox/草稿.md", "## ✍️ 随手草稿", formatAsOrderedList(cleanText), now);
            } else if (route.type === "clipper") {
                const clipPath = await this.plugin.saveClipping(cleanText, "");
                if (!clipPath) return;
                new Notice(`胶囊已送达 [剪藏] → ${clipPath}`, 6000);
                this.close();
                this.app.workspace.trigger("braincore:refresh");
                return;
            } else if (route.type === "material") {
                new Notice("素材分类仅支持文件，请使用捕捉面板上传附件", 6000);
                return;
            } else if (route.type === "work") {
                await saveWorkTaskEntry(this.app, this.plugin, cleanText, now, "");
            }
            new Notice(`胶囊已送达: ${route.name}`); this.close(); this.app.workspace.trigger("braincore:refresh");
        } catch (e) { bcNoticeWarn("错误: " + e.message); }
    }
    injectCapsuleStyles() {
        ["bc-capsule-extra-styles", "bc-capsule-extra-styles-v249", "bc-capsule-extra-styles-v250", "bc-capsule-extra-styles-v251", "bc-capsule-extra-styles-v252", "bc-capsule-extra-styles-v253", "bc-capsule-extra-styles-v254", "bc-capsule-extra-styles-v259", "bc-capsule-extra-styles-v260", "bc-capsule-extra-styles-v261"].forEach((id) => {
            const prev = document.getElementById(id);
            if (prev) prev.remove();
        });
        const styleId = "bc-capsule-extra-styles-v262";
        const existing = document.getElementById(styleId);
        if (existing) existing.remove();
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `.bc-capsule-modal{border-radius:24px!important;background:var(--background-primary)!important;width:864px!important;max-width:92vw!important;border:1px solid var(--background-modifier-border)!important;padding:0!important;overflow:hidden!important;box-sizing:border-box!important}.bc-capsule-modal .modal-content{padding:0!important;margin:0!important;overflow:visible!important;display:block!important}.bc-capsule-header{padding:18px 24px 0;display:flex;align-items:center;gap:10px;overflow:hidden;box-sizing:border-box;width:100%;cursor:grab}.bc-capsule-header:active{cursor:grabbing}.bc-capsule-pulse{width:10px;height:10px;background:var(--lifeos-accent, #b48246);border-radius:50%;box-shadow:0 0 0 0 color-mix(in srgb, var(--lifeos-accent, #b48246) 70%, transparent);animation:bcPulse 1.5s infinite;flex-shrink:0;pointer-events:none}@keyframes bcPulse{0%{transform:scale(.95);box-shadow:0 0 0 0 color-mix(in srgb, var(--lifeos-accent, #b48246) 70%, transparent)}70%{transform:scale(1);box-shadow:0 0 0 10px transparent}100%{transform:scale(.95);box-shadow:0 0 0 0 transparent}}.bc-capsule-title{font-size:14px;font-weight:800;color:var(--text-normal);letter-spacing:.5px;flex:1;min-width:0;pointer-events:none}.bc-capsule-input-box{position:relative;margin:12px 24px 20px;padding:0;border:1.5px solid var(--background-modifier-border);border-radius:18px;background:var(--background-primary);min-height:260px;box-sizing:border-box}.bc-capsule-textarea{width:100%;min-height:260px;height:260px;border:none!important;background:transparent!important;resize:none;font-size:17px;padding:16px 16px 48px;outline:0!important;line-height:1.6;color:var(--text-normal);box-shadow:none!important;box-sizing:border-box!important;border-radius:18px!important}.bc-capsule-route-hint{position:absolute;bottom:12px;left:16px;right:16px;font-size:12px;font-weight:700;font-family:monospace;pointer-events:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bc-capsule-btn-row{display:block;padding:0 24px 20px;box-sizing:border-box}.bc-capsule-send-btn{background:var(--text-accent);color:var(--background-primary);width:100%;text-align:center;padding:15px 0;border-radius:16px;font-weight:700;font-size:16px;cursor:pointer;transition:opacity .2s;box-shadow:0 4px 12px rgba(205,109,107,.3);box-sizing:border-box;white-space:nowrap}.bc-capsule-send-btn:active{opacity:.7;transform:scale(.98)}@media (min-width:481px){
.bc-capsule-modal{width:min(864px,92vw)!important}
.bc-capsule-header{padding:22px 29px 0;gap:12px}
.bc-capsule-pulse{width:12px;height:12px}
.bc-capsule-title{font-size:17px;letter-spacing:.6px}
.bc-capsule-input-box{margin:14px 29px 24px;border-radius:22px;min-height:312px}
.bc-capsule-textarea{min-height:312px;height:312px;font-size:20px;padding:19px 19px 58px;border-radius:22px}
.bc-capsule-route-hint{bottom:14px;left:19px;right:19px;font-size:14px}
.bc-capsule-btn-row{padding:0 29px 24px}
.bc-capsule-send-btn{padding:18px 0;border-radius:19px;font-size:19px}
}.bc-mobile-force-top .modal-container{align-items:flex-start!important;justify-content:center!important;padding-top:0!important;padding-left:0!important;padding-right:0!important}.bc-mobile-force-top .bc-capsule-modal{width:96%!important;max-width:96%!important;margin:48px auto 0!important;box-sizing:border-box!important;left:auto!important;right:auto!important;max-height:calc(100vh - 52px)!important;max-height:calc(100dvh - 52px)!important;padding-bottom:max(4px,var(--bc-kb-inset,0px))!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch!important}.bc-mobile-force-top .bc-capsule-input-box{margin:2px 8px 6px!important;min-height:300px!important}.bc-mobile-force-top .bc-capsule-textarea{min-height:300px!important;height:300px!important;padding:12px 12px 48px!important;box-sizing:border-box!important}@media(max-width:480px){.bc-capsule-modal .modal-close-button{width:44px!important;height:44px!important;transform:scale(.72)!important;top:0!important;right:0!important;opacity:.65!important;display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important}.bc-capsule-modal{width:96%!important;max-width:96%!important;margin:48px auto 0!important;box-sizing:border-box!important;max-height:calc(100vh - 52px)!important;max-height:calc(100dvh - 52px)!important;padding-bottom:max(4px,var(--bc-kb-inset,0px))!important;overflow-y:auto!important}.bc-capsule-header{padding:0 12px!important;min-height:24px!important;margin-top:2px!important;align-items:center!important;padding-right:44px!important}.bc-capsule-title{font-size:13px!important}.bc-capsule-input-box{margin:2px 8px 6px!important;min-height:300px!important;border-radius:18px!important}.bc-capsule-textarea{min-height:300px!important;height:300px!important;font-size:16px!important;padding:12px 12px 48px!important}.bc-capsule-btn-row{padding:0 8px 10px!important}.bc-capsule-send-btn{padding:13px 0;font-size:15px;border-radius:14px;min-height:44px}.bc-capsule-modal.bc-kb-open .bc-capsule-input-box{min-height:148px!important}.bc-capsule-modal.bc-kb-open .bc-capsule-textarea{min-height:148px!important;height:148px!important}}`;
        document.head.appendChild(style);
    }
    onClose() {
        if (this._kbGuardCleanup) { this._kbGuardCleanup(); this._kbGuardCleanup = null; }
        document.body.removeClass("bc-mobile-force-top");
        document.body.style.userSelect = '';
        if (!this.app.isMobile) {
            document.removeEventListener('mousemove', this.dragMouseMove);
            document.removeEventListener('mouseup', this.dragMouseUp);
        }
    }
}

class BrainCoreSettingsTab extends PluginSettingTab {
    constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
    
    display() {
        const { containerEl } = this; containerEl.empty(); 
        containerEl.addClass("bc-settings-compact");
        if (this.app.isMobile || Platform.isMobileApp) containerEl.addClass("bc-settings-mobile");
        const isMobileSettings = this.app.isMobile || Platform.isMobileApp;
        injectBcSettingsCompactStyles();
        if (isMobileSettings) applyBcMobileSettingsLayout(containerEl, this.app);
        
        if (!isMobileSettings) {
            containerEl.createEl('h2', {
                text: typeof formatPluginSettingsTitle === 'function'
                    ? formatPluginSettingsTitle('BrainCore 配置', getEditionDisplayName())
                    : `BrainCore 配置 · ${getEditionDisplayName()}`,
                cls: 'bc-settings-page-title',
            });
        }
        containerEl.createEl('p', { text: PLUGIN_PHILOSOPHY_SUBTITLE, cls: 'bc-settings-intro' });
        const locked = isLicenseRequired() && !this.plugin.settings.licenseActivated;
        if (locked) {
            containerEl.createEl('p', {
                cls: 'bc-settings-locked-hint',
                text: '未激活时仅可使用「授权」「数据」「快捷指令」「关于」；完成激活后解锁全部设置。',
            });
        }
        const tabDefs = [];
        if (isLicenseRequired()) tabDefs.push({ id: "license", label: "授权" });
        if (!locked) tabDefs.push({ id: "paths", label: "路径" }, { id: "modules", label: "模块" }, { id: "habits", label: "打卡" });
        tabDefs.push({ id: "data", label: "数据" });
        tabDefs.push({ id: "shortcuts", label: "快捷指令" });
        tabDefs.push({ id: "about", label: "关于" });
        const tabBar = containerEl.createDiv({ cls: "bc-settings-tab-bar" });
        tabBar.toggleClass("is-many-tabs", tabDefs.length >= 5);
        tabBar.setAttr("role", "tablist");
        tabBar.setAttr("aria-label", "BrainCore 设置");
        const panelsWrap = containerEl.createDiv({ cls: "bc-settings-panels" });
        const panels = {};
        tabDefs.forEach(t => {
            panels[t.id] = panelsWrap.createDiv({ cls: "bc-settings-panel", attr: { role: "tabpanel", id: `bc-panel-${t.id}` } });
            panels[t.id].style.display = "none";
        });
        const showTab = (id) => {
            tabDefs.forEach(t => { panels[t.id].style.display = t.id === id ? "block" : "none"; });
            tabBar.querySelectorAll("button").forEach(btn => {
                const active = btn.dataset.tab === id;
                btn.toggleClass("mod-cta", active);
                btn.setAttr("aria-selected", active ? "true" : "false");
            });
        };
        tabDefs.forEach(t => {
            const btn = tabBar.createEl("button", { text: t.label, cls: "bc-settings-tab-btn", type: "button" });
            btn.dataset.tab = t.id;
            btn.setAttr("role", "tab");
            btn.setAttr("id", `bc-tab-${t.id}`);
            btn.setAttr("aria-controls", `bc-panel-${t.id}`);
            btn.setAttr("aria-selected", "false");
            btn.onclick = () => showTab(t.id);
        });
        let focusTab = this.plugin._settingsFocusTab;
        this.plugin._settingsFocusTab = null;
        if (focusTab === "auth") focusTab = "license";
        const initialTab = tabDefs.some(t => t.id === focusTab) ? focusTab : tabDefs[0].id;
        showTab(initialTab);

        if (isLicenseRequired()) {
        let trialHint = "";
        if (isTrialEdition()) {
            ensureTrialStarted(this.app, this.plugin.settings);
            const remainMs = getTrialRemainingMs(this.app, this.plugin.settings);
            if (this.plugin.settings.licenseActivated) {
                trialHint = "已激活，永久有效";
            } else if (remainMs > 0) {
                trialHint = `试用中，剩余 ${formatTrialRemaining(remainMs)}（到期后须激活）`;
            } else if (this.plugin.settings.trialStartedAt) {
                trialHint = `${getTrialHoursLabel()}试用已到期，请输入激活码`;
            } else {
                trialHint = `在侧边栏点击「开启试用」开始 ${getTrialHoursLabel()} 免费试用`;
            }
        }
        renderLifeOsLicenseSettingsPanel(panels.license, {
            desc: isTrialEdition()
                ? `本安装包为体验版，首次确认后开始 ${getTrialHoursLabel()} 全功能试用，到期须激活。`
                : isLicenseRequired()
                    ? "本安装包为公版，需激活后使用（无试用）。"
                    : "本安装包为公版，免激活即可使用。",
            trialHint: trialHint || undefined,
            getFingerprint: () => getVaultID(this.app),
            licenseKey: this.plugin.settings.licenseKey,
            activated: this.plugin.settings.licenseActivated,
            onCopyFingerprint: async (fp) => {
                const ok = await copyTextToClipboard(fp);
                new Notice(ok ? "设备指纹已复制" : "请手动全选复制指纹");
            },
            onActivate: async (key) => {
                if (!key) {
                    bcNoticeWarn("请输入激活码");
                    return;
                }
                this.plugin.settings.licenseKey = key;
                syncLicenseState(this.app, this.plugin.settings);
                if (this.plugin.settings.licenseActivated) {
                    bcNoticeSuccess(getActivationSuccessMessage());
                    this.app.workspace.trigger("braincore:refresh");
                } else {
                    bcNoticeWarn("激活码无效，请核对后重试");
                }
                await this.plugin.saveSettings();
                this.display();
            },
        });
        }
            
        if (!locked) {
        const gridWrapper = panels.paths.createDiv();
        gridWrapper.className = "bc-settings-grid";
        const modulesGrid = panels.modules.createDiv();
        modulesGrid.className = "bc-settings-grid";
        const habitsGrid = panels.habits.createDiv();
        habitsGrid.className = "bc-settings-grid";

        const pathsCard = gridWrapper.createDiv();
        pathsCard.className = "bc-settings-block";
        pathsCard.createEl('h3', { text: '📂 路径映射' });
        pathsCard.createEl('p', { text: '决定捕捉、待办、金句等内容读写位置。', cls: 'setting-item-description' });
        pathsCard.createEl('h4', { text: '输入路径' });
        
        new Setting(pathsCard).setName('工作').addText(t => t.setValue(this.plugin.settings.pathWork).onChange(v => { this.plugin.settings.pathWork = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('生活').addText(t => t.setValue(this.plugin.settings.pathTasks).onChange(v => { this.plugin.settings.pathTasks = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('闪念').addText(t => t.setValue(this.plugin.settings.pathIdeas).onChange(v => { this.plugin.settings.pathIdeas = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('随笔').addText(t => t.setValue(this.plugin.settings.pathEssays).onChange(v => { this.plugin.settings.pathEssays = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('剪藏').addText(t => t.setValue(this.plugin.settings.pathClippings).onChange(v => { this.plugin.settings.pathClippings = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('剪藏感悟').setDesc('填写感悟时另存的目录；与剪藏笔记双向链接').addText(t => t.setValue(this.plugin.settings.pathClipReflections || "读&写/剪藏感悟").onChange(v => { this.plugin.settings.pathClipReflections = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('草稿').addText(t => t.setValue(this.plugin.settings.pathDrafts).onChange(v => { this.plugin.settings.pathDrafts = v; this.plugin.saveSettings(); }));
        pathsCard.createEl('h4', { text: '剪藏分类' });
        pathsCard.createEl('p', { text: '确认剪藏时可点选；输入框添加的分类会写入下方列表。用英文逗号或换行分隔。', cls: 'setting-item-description' });
        const clipCatsSetting = new Setting(pathsCard).setName('分类列表');
        clipCatsSetting.settingEl.addClass('bc-settings-textarea-row');
        clipCatsSetting.addTextArea(t => {
            t.setPlaceholder(DEFAULT_CLIP_CATEGORIES.join("，"));
            t.setValue(getClipCategories(this.plugin.settings).join("，"));
            t.inputEl.rows = 3;
            t.inputEl.style.width = "100%";
            t.onChange(v => {
                const parts = String(v || "").split(/[,，\n]/).map(sanitizeClipCategoryName).filter(Boolean);
                this.plugin.settings.clipCategories = parts.length ? [...new Set(parts)] : [...DEFAULT_CLIP_CATEGORIES];
                this.plugin.saveSettings();
            });
        });
        new Setting(pathsCard)
            .setClass('bc-settings-action-only')
            .addButton(b => b.setButtonText('恢复默认').onClick(async () => {
            this.plugin.settings.clipCategories = [...DEFAULT_CLIP_CATEGORIES];
            await this.plugin.saveSettings();
            bcNoticeSuccess("已恢复默认剪藏分类");
            this.display();
        }));
        pathsCard.createEl('h4', { text: '附件与索引' });
        new Setting(pathsCard).setName('附件').addText(t => t.setValue(this.plugin.settings.pathAttachments || "Boxes/附件").onChange(v => { this.plugin.settings.pathAttachments = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('文件墙').setDesc('打开文件墙的路径（纯展示看板，素材不会写入此文件）').addText(t => t.setValue(this.plugin.settings.pathMaterials || "Boxes/文件墙.md").onChange(v => { this.plugin.settings.pathMaterials = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('素材日志').setDesc('可选备注写入此文件；留空标题则不写日志').addText(t => t.setValue(this.plugin.settings.pathMaterialLog || "Boxes/素材日志.md").onChange(v => { this.plugin.settings.pathMaterialLog = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('读书笔记').addText(t => t.setValue(this.plugin.settings.pathQuotes).onChange(v => { this.plugin.settings.pathQuotes = v; this.plugin.saveSettings(); }));
        pathsCard.createEl('h4', { text: '第三方联动' });
        pathsCard.createEl('p', { text: '开启后，捕捉/素材中的附件将跟随 Attachment Management 插件的扩展名规则自动分类（如图片、PDF、录音等）', cls: 'bc-am-section-hint setting-item-description' });
        new Setting(pathsCard).setName('跟随 AM').addToggle(t => t.setValue(this.plugin.settings.followAttachmentManagement !== false).onChange(v => { this.plugin.settings.followAttachmentManagement = v; this.plugin.saveSettings(); }));

        const weeklyCard = gridWrapper.createDiv();
        weeklyCard.className = "bc-settings-block";
        weeklyCard.createEl('h3', { text: '📋 周工作模板' });
        weeklyCard.createEl('p', { text: '自定义周工作文件四个区块名称与色块颜色，留空名称则用默认值。', cls: 'setting-item-description' });
        const defs = getDefaultWeeklySectionNames();
        const weeklySettingRows = [];
        const refreshWeeklyLabels = () => {
            const sec = getWeeklySectionNames(this.plugin.settings);
            weeklySettingRows.forEach(({ setting, slot }) => {
                setting.setName(sec[slot]);
            });
        };
        [
            { nameKey: 'weeklySectionTodo', colorKey: 'colorTodo', slot: 'todo' },
            { nameKey: 'weeklySectionMeeting', colorKey: 'colorMeeting', slot: 'meeting' },
            { nameKey: 'weeklySectionWeekly', colorKey: 'colorWeekly', slot: 'weekly' },
            { nameKey: 'weeklySectionDaily', colorKey: 'colorDaily', slot: 'daily' }
        ].forEach(({ nameKey, colorKey, slot }) => {
            const sec = getWeeklySectionNames(this.plugin.settings);
            const setting = new Setting(weeklyCard)
                .setName(sec[slot])
                .addText(t => t.setPlaceholder(defs[slot]).setValue(this.plugin.settings[nameKey] || "").onChange(async v => {
                    this.plugin.settings[nameKey] = v.trim();
                    await this.plugin.saveSettings();
                    refreshWeeklyLabels();
                    this.plugin.injectDashboardStyles();
                }))
                .addColorPicker(c => c.setValue(this.plugin.settings[colorKey]).onChange(async v => {
                    this.plugin.settings[colorKey] = v;
                    await this.plugin.saveSettings();
                    this.plugin.injectDashboardStyles();
                }));
            weeklySettingRows.push({ setting, slot });
        });

        const weatherCard = gridWrapper.createDiv();
        weatherCard.className = "bc-settings-block";
        weatherCard.createEl('h3', { text: '🌤️ 天气定位' });
        weatherCard.createEl('p', { text: '天气始终按下方经纬度显示。每 4 小时后台尝试网络定位一次：若你尚未改过默认坐标，会自动写入此处；若已手动填写，则不会被覆盖。天气接口 open-meteo 不可用时自动切换 wttr.in（中文）。', cls: 'setting-item-description' });
        
        const markWeatherCoordsCustom = async () => {
            this.plugin.settings.weatherCoordsCustom = true;
            await this.plugin.saveSettings();
        };
        const clearWeatherCaches = () => {
            try {
                sessionStorage.removeItem("sb-weather-cache-f");
                sessionStorage.removeItem("sb-geo-cache-f");
            } catch (_) { /* ignore */ }
            this.app.workspace.trigger("braincore:refresh");
        };
        new Setting(weatherCard).setName('纬度').addText(t => t.setValue(this.plugin.settings.defaultLat).onChange(async v => {
            this.plugin.settings.defaultLat = v;
            await markWeatherCoordsCustom();
            await this.plugin.saveSettings();
            clearWeatherCaches();
        }));
        new Setting(weatherCard).setName('经度').addText(t => t.setValue(this.plugin.settings.defaultLon).onChange(async v => {
            this.plugin.settings.defaultLon = v;
            await markWeatherCoordsCustom();
            await this.plugin.saveSettings();
            clearWeatherCaches();
        }));

        const modulesCard = modulesGrid.createDiv();
        modulesCard.className = "bc-settings-block";
        modulesCard.createEl('h3', { text: '🧩 模块自由组合' });
        modulesCard.createEl('p', { text: '开关模块并拖拽排序。', cls: 'setting-item-description' });
        
        const sortContainer = modulesCard.createDiv('bc-sortable-list'); let draggedItem = null;
        this.plugin.settings.modules.forEach((mod) => {
            const settingItem = new Setting(sortContainer).setName(mod.name).addToggle(toggle => toggle.setValue(mod.enabled).onChange(async (v) => { mod.enabled = v; await this.plugin.saveSettings(); this.app.workspace.trigger("braincore:refresh"); }));
            const dragHandle = document.createElement('div');
            dragHandle.className = 'bc-module-drag';
            dragHandle.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
            settingItem.controlEl.appendChild(dragHandle); const el = settingItem.settingEl; el.draggable = true; el.dataset.id = mod.id;
           // 💻 保留电脑端原生鼠标拖拽
            el.addEventListener('dragstart', (e) => { draggedItem = el; e.dataTransfer.effectAllowed = 'move'; setTimeout(() => el.style.opacity = '0.4', 0); });
            el.addEventListener('dragend', async (e) => { el.style.opacity = '1'; draggedItem = null; const newOrderIds = Array.from(sortContainer.children).map(c => c.dataset.id); this.plugin.settings.modules = newOrderIds.map(id => this.plugin.settings.modules.find(m => m.id === id)); await this.plugin.saveSettings(); this.app.workspace.trigger("braincore:refresh"); });
            el.addEventListener('dragover', (e) => { e.preventDefault(); if (!draggedItem || draggedItem === el) return; const bounding = el.getBoundingClientRect(); const offset = bounding.y + (bounding.height / 2); if (e.clientY > offset) el.parentNode.insertBefore(draggedItem, el.nextSibling); else el.parentNode.insertBefore(draggedItem, el); });
            
            // 📱 核心修复：增加手机端专属的 Touch 触摸滑动监听
            dragHandle.addEventListener('touchstart', (e) => { draggedItem = el; setTimeout(() => el.style.opacity = '0.4', 0); }, {passive: true});
            dragHandle.addEventListener('touchmove', (e) => { 
                if (!draggedItem) return; 
                e.preventDefault(); // 拖拽时禁止屏幕上下滚动
                const touch = e.touches[0]; 
                const target = document.elementFromPoint(touch.clientX, touch.clientY); 
                const targetItem = target ? target.closest('.setting-item') : null; 
                if (targetItem && targetItem !== draggedItem && targetItem.parentNode === sortContainer) { 
                    const bounding = targetItem.getBoundingClientRect(); 
                    const offset = bounding.y + (bounding.height / 2); 
                    if (touch.clientY > offset) targetItem.parentNode.insertBefore(draggedItem, targetItem.nextSibling); 
                    else targetItem.parentNode.insertBefore(draggedItem, targetItem); 
                } 
            }, {passive: false});
            dragHandle.addEventListener('touchend', async (e) => { 
                if (!draggedItem) return; 
                el.style.opacity = '1'; draggedItem = null; 
                const newOrderIds = Array.from(sortContainer.children).map(c => c.dataset.id); 
                this.plugin.settings.modules = newOrderIds.map(id => this.plugin.settings.modules.find(m => m.id === id)); 
                await this.plugin.saveSettings(); 
                this.app.workspace.trigger("braincore:refresh"); 
            });
        });

        const habitsCard = habitsGrid.createDiv();
        habitsCard.className = "bc-settings-block";
        habitsCard.createEl('h3', { text: '📅 打卡' });
        habitsCard.createEl('p', { text: '右侧拖拽把手排序；点击图标或名称可编辑；下方可导出/导入 JSON 格式 habitData。', cls: 'setting-item-description' });
        
        const habitsContainer = habitsCard.createDiv('bc-habits-config');
        const HABIT_DRAG_SVG = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        const HABIT_TRASH_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
        let habitDragged = null;

        const saveHabitOrder = async () => {
            const ids = Array.from(habitsContainer.querySelectorAll('.bc-habit-row')).map(r => r.dataset.id);
            this.plugin.settings.habitsConfig = ids
                .map(id => this.plugin.settings.habitsConfig.find(h => h.id === id))
                .filter(Boolean);
            await this.plugin.saveSettings();
            this.app.workspace.trigger("braincore:refresh");
        };

        const attachHabitDrag = (row) => {
            const dragHandle = row.querySelector('.bc-habit-drag');
            row.draggable = true;
            row.addEventListener('dragstart', (e) => {
                habitDragged = row;
                e.dataTransfer.effectAllowed = 'move';
                setTimeout(() => { row.style.opacity = '0.45'; }, 0);
            });
            row.addEventListener('dragend', async () => {
                row.style.opacity = '1';
                habitDragged = null;
                await saveHabitOrder();
            });
            row.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!habitDragged || habitDragged === row) return;
                const bounding = row.getBoundingClientRect();
                const offset = bounding.y + bounding.height / 2;
                if (e.clientY > offset) row.parentNode.insertBefore(habitDragged, row.nextSibling);
                else row.parentNode.insertBefore(habitDragged, row);
            });
            if (dragHandle) {
                dragHandle.addEventListener('touchstart', () => {
                    habitDragged = row;
                    setTimeout(() => { row.style.opacity = '0.45'; }, 0);
                }, { passive: true });
                dragHandle.addEventListener('touchmove', (e) => {
                    if (!habitDragged) return;
                    e.preventDefault();
                    const touch = e.touches[0];
                    const target = document.elementFromPoint(touch.clientX, touch.clientY);
                    const targetRow = target ? target.closest('.bc-habit-row') : null;
                    if (targetRow && targetRow !== habitDragged && targetRow.parentNode === habitsContainer) {
                        const bounding = targetRow.getBoundingClientRect();
                        const offset = bounding.y + bounding.height / 2;
                        if (touch.clientY > offset) targetRow.parentNode.insertBefore(habitDragged, targetRow.nextSibling);
                        else targetRow.parentNode.insertBefore(habitDragged, targetRow);
                    }
                }, { passive: false });
                dragHandle.addEventListener('touchend', async () => {
                    if (!habitDragged) return;
                    row.style.opacity = '1';
                    habitDragged = null;
                    await saveHabitOrder();
                });
            }
        };

        const renderHabitsConfig = () => {
            habitsContainer.empty();
            this.plugin.settings.habitsConfig.forEach((habit) => {
                const row = habitsContainer.createDiv('bc-habit-row');
                row.dataset.id = habit.id;
                const fields = row.createDiv('bc-habit-fields');
                const iconInput = fields.createEl("input", { type: "text", value: habit.i, cls: "bc-habit-icon-input", attr: { placeholder: "图标" } });
                iconInput.onchange = async (e) => { habit.i = e.target.value; await this.plugin.saveSettings(); this.app.workspace.trigger("braincore:refresh"); };
                const nameInput = fields.createEl("input", { type: "text", value: habit.n, cls: "bc-habit-name-input", attr: { placeholder: "习惯名称" } });
                nameInput.onchange = async (e) => { habit.n = e.target.value; await this.plugin.saveSettings(); this.app.workspace.trigger("braincore:refresh"); };
                const actions = row.createDiv('bc-habit-actions');
                const dragHandle = actions.createDiv('bc-habit-drag');
                dragHandle.innerHTML = HABIT_DRAG_SVG;
                const delBtn = actions.createEl("button", { cls: "bc-habit-del-btn", attr: { type: "button", "aria-label": "删除" } });
                delBtn.innerHTML = HABIT_TRASH_SVG;
                delBtn.onclick = async (e) => {
                    e.stopPropagation();
                    const idx = this.plugin.settings.habitsConfig.findIndex(h => h.id === habit.id);
                    if (idx >= 0) this.plugin.settings.habitsConfig.splice(idx, 1);
                    await this.plugin.saveSettings();
                    renderHabitsConfig();
                    this.app.workspace.trigger("braincore:refresh");
                };
                attachHabitDrag(row);
            });
            
            const addCard = habitsContainer.createDiv('bc-habit-add-row');
            addCard.setText("➕ 新增打卡项");
            addCard.onclick = async () => {
                this.plugin.settings.habitsConfig.push({ id: "habit_" + Date.now(), n: "新习惯", i: "✨" });
                await this.plugin.saveSettings();
                renderHabitsConfig();
                this.app.workspace.trigger("braincore:refresh");
            };
        };
        renderHabitsConfig();

        const ioSection = habitsCard.createDiv('bc-habit-io-section');
        ioSection.createEl('p', { text: '备份与恢复打卡记录（JSON）', cls: 'bc-habit-io-label' });
        const ioRow = ioSection.createDiv('bc-habit-io-row');
        const exportBtn = ioRow.createEl("button", { text: "导出数据", cls: "bc-habit-io-btn", attr: { type: "button" } });
        exportBtn.onclick = () => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.plugin.settings.habitData));
            const dlAnchorElem = document.createElement('a');
            dlAnchorElem.setAttribute("href", dataStr);
            dlAnchorElem.setAttribute("download", `打卡数据备份_${window.moment().format("YYYYMMDD")}.json`);
            dlAnchorElem.click();
            bcNoticeSuccess("打卡数据已导出（JSON 格式）");
        };
        const importBtn = ioRow.createEl("button", { text: "导入数据", cls: "bc-habit-io-btn", attr: { type: "button" } });
        importBtn.onclick = () => {
            const input = document.createElement('input');
            input.type = 'file'; input.accept = '.json';
            input.onchange = e => {
                const file = e.target.files[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = async (re) => {
                    try {
                        const parsed = JSON.parse(re.target.result);
                        if (isValidHabitData(parsed)) {
                            this.plugin.settings.habitData = Object.assign({}, this.plugin.settings.habitData || {}, parsed);
                            await this.plugin.saveSettings();
                            new Notice("打卡数据已合并导入！");
                            this.app.workspace.trigger("braincore:refresh");
                        } else {
                            new Notice("格式应为 {\"YYYY-MM-DD\": {\"habit_id\": true}}，且不能为空");
                        }
                    } catch (err) { new Notice("导入失败：文件格式不正确"); }
                };
                reader.readAsText(file);
            };
            input.click();
        };
        }
        {
            const dataGrid = panels.data.createDiv({ cls: "bc-settings-grid" });
            const dataCard = dataGrid.createDiv({ cls: "bc-settings-block" });
            dataCard.createEl("h3", { text: "数据" });
            dataCard.createEl("p", {
                text: "更新日志与插件数据文件路径。",
                cls: "setting-item-description",
            });
            new Setting(dataCard)
                .setName("更新日志")
                .addButton((btn) =>
                    btn.setButtonText("查看").onClick(() => openLifeOsUpdateNoticeFromPlugin(this.plugin))
                );
            const dataPath = `.obsidian/plugins/${this.plugin.manifest.id}/data.json`;
            dataCard.createEl("p", {
                cls: "setting-item-description",
                text: `当前版本 ${PLUGIN_VERSION}。捕捉内容写在库内笔记路径（见「路径」）；插件设置保存在：\n${dataPath}`,
            });
            new Setting(dataCard)
                .setName("data.json")
                .setDesc(dataPath)
                .addButton((btn) =>
                    btn.setButtonText("打开").onClick(async () => {
                        const af = this.app.vault.adapter;
                        if (af && typeof af.getFullPath === "function") {
                            const full = af.getFullPath(dataPath);
                            if (full && typeof window.require === "function") {
                                try {
                                    window.require("electron").shell.showItemInFolder(full);
                                    return;
                                } catch (_) { /* fall through */ }
                            }
                        }
                        bcNoticeInfo(`插件数据路径：${dataPath}`);
                    })
                );
        }
        renderBrainCoreShortcutsSettingsPanel(panels.shortcuts, this.plugin, {
            openShortcutsGuide: () => this.plugin.openShortcutsGuideFile({ forceOpen: true }),
        });
        renderLifeOsAboutPanel(panels.about, this.plugin, {
            openUsageGuide: () => this.plugin.openUsageGuideFile({ forceOpen: true }),
        });
    }
}

class DashboardView extends ItemView {
    constructor(leaf, plugin) { 
        super(leaf); 
        this.plugin = plugin; 
        this._layoutReadyHooked = false;
        this._refreshScope = "full";
        this.refreshInterval = null;
        this._lightTickCount = 0;
        this._pendingWakeRefresh = false;
        this._powerModeActive = true;
        this._flushRefresh = () => {
            if (!this.isDashboardActive()) {
                this._pendingWakeRefresh = true;
                return;
            }
            const scope = this._refreshScope;
            this._refreshScope = "full";
            this.renderContent(scope);
        };
        // 统计/待办要快；全量刷新仍合并风暴省电
        this._debouncedStatsRefresh = customDebounce(() => this._flushRefresh(), 350);
        this._debouncedFullRefresh = customDebounce(() => this._flushRefresh(), 900);
        this.requestRefresh = () => this._debouncedFullRefresh();
    }
    queueRefresh(scope = "full") {
        const next = BC_REFRESH_SCOPE_RANK[scope] ?? BC_REFRESH_SCOPE_RANK.full;
        const cur = BC_REFRESH_SCOPE_RANK[this._refreshScope] ?? BC_REFRESH_SCOPE_RANK.full;
        if (next >= cur) this._refreshScope = scope;
        const effective = this._refreshScope;
        if (effective === "stats" || effective === "tasks") {
            this._debouncedStatsRefresh();
        } else {
            this._debouncedFullRefresh();
        }
    }
    /** 侧栏不可见 / 系统休眠或切后台时视为休眠，停定时器与即时重绘 */
    isDashboardActive() {
        try {
            if (typeof document !== "undefined" && document.hidden) return false;
            const leaf = this.leaf;
            if (!leaf) return false;
            if (typeof leaf.isVisible === "function" && !leaf.isVisible()) return false;
            const el = this.containerEl;
            if (!el || !el.isConnected) return false;
            if (el.clientWidth < 12 || el.clientHeight < 12) return false;
            return true;
        } catch (_) {
            return false;
        }
    }
    stopRefreshTimer() {
        if (this.refreshInterval) {
            window.clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
    startRefreshTimer() {
        this.stopRefreshTimer();
        if (!this.isDashboardActive()) return;
        this._lightTickCount = 0;
        // 进度条：3 分钟轻刷；统计：同间隔刷 stats（比全量轻）；全量约 30 分钟
        const lightMs = 3 * 60 * 1000;
        const fullEvery = this.app.isMobile ? 15 : 10;
        this.refreshInterval = window.setInterval(() => {
            if (!this.isDashboardActive()) {
                this.stopRefreshTimer();
                this._powerModeActive = false;
                return;
            }
            this.tickLightRefresh();
            this.queueRefresh("stats");
            this._lightTickCount += 1;
            if (this._lightTickCount >= fullEvery) {
                this._lightTickCount = 0;
                this.queueRefresh("full");
            }
        }, lightMs);
    }
    syncPowerMode() {
        const active = this.isDashboardActive();
        if (active === this._powerModeActive && (active ? !!this.refreshInterval : !this.refreshInterval)) {
            return;
        }
        this._powerModeActive = active;
        if (active) {
            this.startRefreshTimer();
            if (this._pendingWakeRefresh) {
                this._pendingWakeRefresh = false;
                this.queueRefresh("full");
            }
        } else {
            this.stopRefreshTimer();
        }
    }
    getViewType() { return VIEW_TYPE_DASHBOARD; } getDisplayText() { return "BrainCore"; } getIcon() { return "cloud"; }
    async onOpen() { 
        const viewContent = this.containerEl.children[1];
        if (viewContent) {
            viewContent.addClass("bc-dashboard-view-content");
            viewContent.style.overflowY = "auto";
            viewContent.style.overflowX = "hidden";
            viewContent.style.height = "100%";
            viewContent.style.webkitOverflowScrolling = "touch";
        }
        
        this.registerEvent(this.app.workspace.on("braincore:refresh", () => {
            if (this.plugin._suppressDashboardRefresh) return;
            if (!this.isDashboardActive()) {
                this._pendingWakeRefresh = true;
                return;
            }
            this.requestRefresh();
        })); 
        
        const shouldRefreshForMetadata = (file) => {
            if (!file || file.extension !== "md") return false;
            const s = this.plugin.settings;
            const directPaths = [s.pathTasks, s.pathIdeas, s.pathEssays, s.pathDrafts, s.pathClippings].filter(Boolean);
            if (directPaths.includes(file.path)) return true;
            const workBase = (s.pathWork || "Work").replace(/\/$/, "");
            if (file.path === workBase || file.path.startsWith(workBase + "/")) return true;
            const quoteFolder = (s.pathQuotes || "Weread").toLowerCase();
            if (quoteFolder && file.path.toLowerCase().includes(quoteFolder)) return true;
            return false;
        };
        this.registerEvent(this.app.metadataCache.on("resolved", (file) => {
            if (this.plugin._suppressDashboardRefresh) return;
            if (!this.isDashboardActive()) {
                if (shouldRefreshForMetadata(file)) this._pendingWakeRefresh = true;
                return;
            }
            if (shouldRefreshForMetadata(file)) this.queueRefresh("tasks");
        }));
        
        // 省电：只盯任务/周工作相关 md·canvas；附件仅 create/delete/rename 触发统计（忽略 modify，避免 iCloud 抖动）
        const attachExts = new Set(['png','jpg','jpeg','gif','webp','svg','xlsx','csv','pdf','doc','docx','ppt','pptx','txt','json','html','zip','rar','mp3','mp4','numbers','key','canvas']);
        const invalidateQuoteCacheForFile = (file) => {
            if (!file || file.extension !== 'md') return;
            const quotesPath = this.plugin.settings.pathQuotes;
            if (quotesPath && file.path.startsWith(quotesPath.replace(/\/$/, ''))) {
                sessionStorage.removeItem("sb-quote-cache-f");
            }
        };
        const isInternalStatsFile = (file) => {
            if (!file?.path) return true;
            if (file.path === "Scripts/braincore-stats-history.json") return true;
            if (file.path.endsWith("/braincore-stats-history.json")) return true;
            if (file.path === "Scripts/braincore-stats-cache.json") return true;
            if (file.path.endsWith("/braincore-stats-cache.json")) return true;
            return false;
        };
        const refreshForFile = (file, kind = "modify") => {
            if (this.plugin._suppressDashboardRefresh) return;
            if (!file || isInternalStatsFile(file)) return;
            const ext = file.extension;
            let scope = null;
            if (ext === "md") {
                if (!shouldRefreshForMetadata(file)) return;
                invalidateQuoteCacheForFile(file);
                scope = "full";
            } else if (ext === "canvas") {
                // 白板计入统计；内容修改不刷，仅增删改名
                if (kind === "modify") return;
                scope = "stats";
            } else if (attachExts.has(ext)) {
                if (kind === "modify") return;
                scope = "stats";
            } else {
                return;
            }
            this.plugin._vaultFilesCache = null;
            if (!this.isDashboardActive()) {
                this._pendingWakeRefresh = true;
                return;
            }
            this.queueRefresh(scope);
        };
        this.registerEvent(this.app.vault.on('modify', (f) => refreshForFile(f, "modify"))); 
        this.registerEvent(this.app.vault.on('create', (f) => refreshForFile(f, "create"))); 
        this.registerEvent(this.app.vault.on('delete', (f) => refreshForFile(f, "delete"))); 
        this.registerEvent(this.app.vault.on('rename', (f) => refreshForFile(f, "rename")));

        this.registerDomEvent(document, "visibilitychange", () => this.syncPowerMode());
        this.registerEvent(this.app.workspace.on("layout-change", () => this.syncPowerMode()));
        this.registerEvent(this.app.workspace.on("active-leaf-change", () => this.syncPowerMode()));
        this.registerEvent(this.app.workspace.on("resize", () => this.syncPowerMode()));

        await this.renderContent();
        this._powerModeActive = false;
        this.syncPowerMode();
    }
    async onClose() {
        this.stopRefreshTimer();
        this._powerModeActive = false;
    }

    tickLightRefresh() {
        const container = this.containerEl.children[1];
        if (!container || container.hasClass("bc-activate-mode")) return;
        const moment = window.moment || bcMoment;
        if (!moment) return;
        const now = new Date();
        const hour = now.getHours();
        const greeting = (hour < 6) ? '深夜好' : (hour < 12) ? '早上好' : (hour < 14) ? '中午好' : (hour < 18) ? '下午好' : (hour < 22) ? '晚上好' : '夜深了';
        const dayOfWeek = ['周日','周一','周二','周三','周四','周五','周六'][now.getDay()];
        const greetEl = container.querySelector('.sb-greet');
        if (greetEl) greetEl.textContent = greeting;
        const dateEl = container.querySelector('.sb-date');
        if (dateEl) dateEl.textContent = `${moment().format('MM-DD')} ${dayOfWeek} · WK${moment(now).isoWeek()}`;
        const year = now.getFullYear();
        const getP = (start, end) => Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
        const sY = new Date(year, 0, 1), eY = new Date(year + 1, 0, 1), yearP = getP(sY, eY), dLY = Math.ceil((eY - now) / 86400000);
        const sM = new Date(year, now.getMonth(), 1), eM = new Date(year, now.getMonth() + 1, 1), monthP = getP(sM, eM), dLM = Math.ceil((eM - now) / 86400000);
        const dowIdx = (now.getDay() === 0) ? 6 : now.getDay() - 1;
        const sW = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dowIdx);
        const eW = new Date(sW.getFullYear(), sW.getMonth(), sW.getDate() + 7);
        const weekP = getP(sW, eW), dLW = Math.ceil((eW - now) / 86400000);
        const sD = new Date(year, now.getMonth(), now.getDate());
        const eD = new Date(year, now.getMonth(), now.getDate() + 1);
        const dayP = getP(sD, eD), hLD = Math.ceil((eD - now) / 3600000);
        const progItems = container.querySelectorAll('.sb-prog-item');
        const progData = [
            { p: yearP, left: `余${dLY}d`, tip: `年进度 ${yearP.toFixed(1)}%\n已过比例 ${yearP.toFixed(1)}% · 剩余 ${dLY} 天\n${moment(sY).format("YYYY-MM-DD HH:mm")} → ${moment(eY).format("YYYY-MM-DD HH:mm")}` },
            { p: monthP, left: `余${dLM}d`, tip: `月进度 ${monthP.toFixed(1)}%\n已过比例 ${monthP.toFixed(1)}% · 剩余 ${dLM} 天\n${moment(sM).format("YYYY-MM-DD HH:mm")} → ${moment(eM).format("YYYY-MM-DD HH:mm")}` },
            { p: weekP, left: `余${dLW}d`, tip: `周进度 ${weekP.toFixed(1)}%\n已过比例 ${weekP.toFixed(1)}% · 剩余 ${dLW} 天\n${moment(sW).format("YYYY-MM-DD HH:mm")} → ${moment(eW).format("YYYY-MM-DD HH:mm")}` },
            { p: dayP, left: `余${hLD}h`, tip: `日进度 ${dayP.toFixed(1)}%\n已过比例 ${dayP.toFixed(1)}% · 剩余 ${hLD} 小时\n${moment(sD).format("YYYY-MM-DD HH:mm")} → ${moment(eD).format("YYYY-MM-DD HH:mm")}` },
        ];
        progItems.forEach((item, idx) => {
            const d = progData[idx];
            if (!d) return;
            item.setAttribute("title", d.tip);
            const leftEl = item.querySelector('.sb-prog-left');
            if (leftEl) leftEl.textContent = `${d.p.toFixed(1)}% ${d.left}`;
            const fill = item.querySelector('.sb-pixel-bar-fill');
            if (fill) fill.style.width = `${d.p}%`;
        });
    }
    
    validateLicense(key) {
        if (!isLicenseRequired()) return true;
        if (this.plugin.settings.trialWelcomeSeen || !isTrialEdition()) {
            ensureTrialStarted(this.app, this.plugin.settings, !!this.plugin.settings.trialWelcomeSeen);
        }
        return isAccessAllowed(this.app, this.plugin.settings);
    }
    
    async renderContent(scope = "full") {
        const container = this.containerEl.children[1]; if (!container) return;
        
        if (!this.validateLicense(this.plugin.settings.licenseKey)) {
            mountActivationPanel(container, this.plugin, {
                onActivated: async () => { await this.renderContent(); }
            });
            return;
        }

        if (scope === "light") return;

        const renderNow = async () => {
            const dvAPI = this.app.plugins.plugins.dataview?.api;
            const dataviewMissing = !dvAPI;
            const hasShell = !!container.querySelector(".sb-container");

            try {
                container.removeClass("bc-activate-mode");
                container.querySelector(".bc-render-stuck")?.remove();

                if (scope === "stats" && hasShell) {
                    await this.renderDashboard(null, dvAPI, { dataviewMissing, statsOnly: true, statsContainer: container });
                    return;
                }
                if (scope === "tasks" && hasShell) {
                    await this.renderDashboard(null, dvAPI, { dataviewMissing, tasksOnly: true, tasksContainer: container });
                    return;
                }

                const temp = document.createElement("div");
                temp.addClass("bc-dashboard-view-content");
                await this.renderDashboard(temp, dvAPI, { dataviewMissing });
                if (container.innerHTML !== temp.innerHTML) {
                    container.replaceChildren(...Array.from(temp.childNodes));
                }
                this._renderRetryCount = 0;
            } catch (e) {
                console.error("[BrainCore] 渲染失败:", e);
                if (!container.querySelector(".sb-container")) {
                    container.empty();
                    container.createEl("div", {
                        cls: "bc-render-stuck",
                        text: "BrainCore 正在刷新，请稍候…",
                        style: "padding: 20px; color: var(--text-muted); text-align: center; margin-top: 50px;"
                    });
                    this._renderRetryCount = (this._renderRetryCount || 0) + 1;
                    const delay = Math.min(8000, 1500 + this._renderRetryCount * 500);
                    window.setTimeout(() => {
                        if (container.querySelector(".bc-render-stuck")) {
                            this._refreshScope = "full";
                            this.renderContent("full");
                        }
                    }, delay);
                }
            }
        };

        if (this.app.workspace.layoutReady) {
            await renderNow();
        } else if (!this._layoutReadyHooked) {
            this._layoutReadyHooked = true;
            this.app.workspace.onLayoutReady(renderNow);
        }
    }

    async renderDashboard(rootEl, dv, options = {}) {
        const { dataviewMissing = false, statsOnly = false, statsContainer = null, tasksOnly = false, tasksContainer = null } = options || {};
        const app = this.app; const moment = bcMoment; const settings = this.plugin.settings; const plugin = this.plugin;
        const now = new Date(); const year = now.getFullYear(); const hour = now.getHours(); const todayISO = moment().format('YYYY-MM-DD'); const dayOfWeek = ['周日','周一','周二','周三','周四','周五','周六'][now.getDay()]; const currentSeed = parseInt(moment().format("YYYYMMDDHH")); 
        const greeting = (hour < 6) ? '深夜好' : (hour < 12) ? '早上好' : (hour < 14) ? '中午好' : (hour < 18) ? '下午好' : (hour < 22) ? '晚上好' : '夜深了';
        const getP = (start, end) => Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
        const makeBar = (percent) => `<div class="sb-pixel-bar"><div class="sb-pixel-bar-fill" style="width: ${percent}%;"></div></div>`;
        const progTitle = (label, percent, remainText, rangeText) =>
            String(`${label}进度 ${percent.toFixed(1)}%\n已过比例 ${percent.toFixed(1)}% · ${remainText}\n${rangeText}`)
                .replace(/"/g, "&quot;")
                .replace(/\n/g, "&#10;");
        const sY = new Date(year, 0, 1), eY = new Date(year + 1, 0, 1), yearP = getP(sY, eY), dLY = Math.ceil((eY - now) / 86400000); const sM = new Date(year, now.getMonth(), 1), eM = new Date(year, now.getMonth() + 1, 1), monthP = getP(sM, eM), dLM = Math.ceil((eM - now) / 86400000); const dowIdx = (now.getDay() === 0) ? 6 : now.getDay() - 1; const sW = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dowIdx), eW = new Date(sW.getFullYear(), sW.getMonth(), sW.getDate() + 7), weekP = getP(sW, eW), dLW = Math.ceil((eW - now) / 86400000); const sD = new Date(year, now.getMonth(), now.getDate()), eD = new Date(year, now.getMonth(), now.getDate() + 1), dayP = getP(sD, eD), hLD = Math.ceil((eD - now) / 3600000);
        const fmtRange = (a, b) => `${moment(a).format("YYYY-MM-DD HH:mm")} → ${moment(b).format("YYYY-MM-DD HH:mm")}`;
        const yearTip = progTitle("年", yearP, `剩余 ${dLY} 天`, fmtRange(sY, eY));
        const monthTip = progTitle("月", monthP, `剩余 ${dLM} 天`, fmtRange(sM, eM));
        const weekTip = progTitle("周", weekP, `剩余 ${dLW} 天`, fmtRange(sW, eW));
        const dayTip = progTitle("日", dayP, `剩余 ${hLD} 小时`, fmtRange(sD, eD));
        
        // 🟢 提前计算 workFile 供统计模块和渲染模块公用
        const weekNum = moment(now).isoWeek(); const weekPad = weekNum.toString().padStart(2, '0'); const baseWorkPath = settings.pathWork.replace(/\/$/, '');
        const monday = moment(now).startOf('isoWeek'); let targetYear = monday.year(); let targetMonth = monday.month() + 1; if (weekPad === '01' && targetMonth === 12) { targetYear += 1; }
        const allFiles = this.plugin.getVaultFilesCached();
        const weekFileReg = new RegExp(`^WK${weekPad}(\\D|$)`);
let workFile = allFiles.find(f =>
    f.path.startsWith(baseWorkPath) &&
    f.path.includes(`/${targetYear}/`) &&
    weekFileReg.test(f.basename)
);

        // 🚀 系统真实时间跨越周一零点时：跨周迁移；无论有无遗留待办，都确保本周 Work 文件存在
        const currentYearWeek = `${targetYear}-WK${weekPad}`;
        const migrateKey = getVaultScopedStorageKey(app, "bc-migrated-wk-" + currentYearWeek);
        if (!statsOnly && !tasksOnly) {
            if (!localStorage.getItem(migrateKey)) {
                localStorage.setItem(migrateKey, "pending");
                try {
                    await this.plugin.autoMigrateWeeklyTasks(bcMoment(now));
                    localStorage.setItem(migrateKey, "true");
                } catch (e) {
                    localStorage.removeItem(migrateKey);
                    console.warn("[BrainCore] 周迁移失败:", e);
                }
            }
            if (!workFile) {
                try {
                    workFile = await this.plugin.getOrCreateWeeklyWorkFile(bcMoment(now));
                } catch (e) {
                    console.warn("[BrainCore] 本周 Work 文件创建失败:", e);
                    workFile = this.plugin.findWeeklyWorkFile(bcMoment(now));
                }
            }
        }

        let totalNotes = 0, totalTags = 0; 
        // ✅ 笔记统计使用 Obsidian 原生文件列表，不再依赖 Dataview 页面索引
        try { 
            totalNotes = allFiles.filter(f => f.extension === 'md' && !f.path.includes("Templates")).length; 
        } catch(e) { console.warn("[BrainCore] 笔记统计失败:", e); }
        const ideasPage = settings.pathIdeas; 
        let fleetingNotes = 0, fleetingDetails = "无未完成闪念"; 
        let totalTasks = 0, taskDetails = "无未完成待办";
        let pendingTasks = [];
        const workKey = workFile?.path || "";
        if (statsOnly) {
            const sc = this.plugin._statsCache || {};
            totalTags = sc.tags ?? 0;
            totalTasks = sc.tasks ?? 0;
            fleetingNotes = sc.ideas ?? 0;
        } else {
        // 标签：metadataCache，避免 dv.pages 全库扫描
        try { 
            totalTags = countVaultTags(app);
        } catch(e) { console.warn("[BrainCore] 标签统计失败:", e); }
        
        try {
            if (dv) {
                const fleetingTasks = dv.page(ideasPage)?.file?.tasks?.where(t => !t.completed);
                fleetingNotes = fleetingTasks ? fleetingTasks.length : 0;
                if (fleetingTasks && typeof fleetingTasks.limit === 'function') fleetingDetails = fleetingTasks.limit(10).text?.join("\n") || "无未完成闪念";
            } else {
                const ideasFile = app.vault.getAbstractFileByPath(ideasPage);
                if (ideasFile) {
                    const ideaTasks = extractPendingTasksFromContent(await app.vault.cachedRead(ideasFile), ideasPage);
                    fleetingNotes = ideaTasks.length;
                    fleetingDetails = formatTaskForestForTooltip(ideaTasks, 10) || "无未完成闪念";
                }
            }
        } catch(e) { console.warn("[BrainCore] 闪念统计失败:", e); }
        
        // 🟢 合并 Inbox 与 周待办 的统计（仅计顶层，子任务归入父节点）
        try {
            const taskBundle = this.plugin._pendingTasksBundle;
            if (taskBundle && taskBundle.workKey === workKey && Date.now() - taskBundle.ts < 5000) {
                pendingTasks = taskBundle.tasks;
            } else {
                pendingTasks = await collectPendingTasks(app, settings, workFile);
                this.plugin._pendingTasksBundle = { workKey, tasks: pendingTasks, ts: Date.now() };
            }
            totalTasks = countRootPendingTasks(pendingTasks);
            this.plugin._pendingTasksCountCache = totalTasks;
            taskDetails = formatTaskForestForTooltip(pendingTasks, 10) || "无未完成待办";
        } catch (e) { console.warn("[BrainCore] 待办统计失败:", e); }
        }
        
        
        let imageCount = 0, attachmentCount = 0; 
        let entityFiles = [], imageTableFiles = [], attachmentFiles = [];
        try { 
            // 图·表只统计“独立文件”，不统计笔记正文里嵌入的图片/表格文本
            const imageTableExts = ['png','jpg','jpeg','gif','webp','svg','xlsx','csv','canvas'];
            const noteFiles = allFiles.filter(f => 
                f.extension === 'md' && 
                !f.path.includes("Templates")
            );
            imageTableFiles = allFiles.filter(f => 
                imageTableExts.includes(f.extension) && 
                !f.path.includes("Templates")
            );
            attachmentFiles = allFiles.filter(f => 
                f.extension !== 'md' && 
                !imageTableExts.includes(f.extension) &&
                !f.path.includes("Templates")
            );

            imageCount = imageTableFiles.length; 
            attachmentCount = attachmentFiles.length;
            entityFiles = [...noteFiles, ...imageTableFiles, ...attachmentFiles];
        } catch(e) { console.warn("[BrainCore] 实体文件统计失败:", e); }

        // ✅ Total 不额外抓全库，直接由实体三项相加
        // Total = 笔记 + 图·表 + 附件
        const fileSum = totalNotes + imageCount + attachmentCount;
        const totalSum = fileSum;

        const taskSearchQuery = statsOnly && this.plugin._statsCache?.taskSearchQuery
            ? this.plugin._statsCache.taskSearchQuery
            : (workFile
            ? `(path:"${settings.pathTasks}" OR path:"${workFile.path}") -[x]`
            : `path:"${settings.pathTasks}" -[x]`);
        const statsCachePayload = {
            ts: Date.now(),
            notes: totalNotes,
            imageTable: imageCount,
            attachment: attachmentCount,
            tags: totalTags,
            tasks: totalTasks,
            ideas: fleetingNotes,
            taskSearchQuery,
            ideasPath: settings.pathIdeas || "Inbox/Ideas.md",
        };
        try {
            sessionStorage.setItem("sb-stats-cache-f", JSON.stringify(statsCachePayload));
        } catch (e) { /* ignore */ }
        this.plugin._statsCache = statsCachePayload;
        this.plugin.notifyDataChanged("stats");

        const getPercent = (val) => totalSum > 0 ? ((val / totalSum) * 100).toFixed(1) + "%" : "0%";
        const compositionTip = `实体文件构成：
笔记: ${getPercent(totalNotes)}
图·表: ${getPercent(imageCount)}
附件: ${getPercent(attachmentCount)}

其他数据：
标签: ${totalTags}
待办: ${totalTasks}
闪念: ${fleetingNotes}`;
        // 🌟 v21 最终修复：库内共享统计文件 + 今日净变化
        // 共享文件位置：Scripts/braincore-stats-history.json
        // 今日累计：↑N 净新增；→0 无净变化；↓N 今日删除。移动/重命名不计入新增列表。
        const statsHistoryPath = "Scripts/braincore-stats-history.json";
        const currentEntityPaths = entityFiles.map(f => f.path).sort();

        const ensureStatsFolder = async () => {
            const folder = "Scripts";
            if (!this.app.vault.getAbstractFileByPath(folder)) {
                try { await this.app.vault.createFolder(folder); } catch(e) { console.warn("[BrainCore] 统计目录创建失败:", e); }
            }
        };

        const readStatsHistory = async () => {
            try {
                const file = this.app.vault.getAbstractFileByPath(statsHistoryPath);
                if (!file) return null;
                const raw = await this.app.vault.cachedRead(file);
                const parsed = JSON.parse(raw || "{}");
                return parsed && typeof parsed === "object" ? parsed : null;
            } catch(e) {
                console.warn("[BrainCore] 统计历史读取失败:", e);
                return null;
            }
        };

        const saveStatsHistory = async (historyObj) => {
            try {
                await ensureStatsFolder();
                const payload = JSON.stringify(historyObj, null, 2);
                const file = this.app.vault.getAbstractFileByPath(statsHistoryPath);
                if (file) {
                    const oldPayload = await this.app.vault.cachedRead(file);
                    if (oldPayload !== payload) await this.app.vault.modify(file, payload);
                } else {
                    await this.app.vault.create(statsHistoryPath, payload);
                }
            } catch(e) {
                console.warn("[BrainCore] 统计历史写入失败，回退到 settings:", e);
                this.plugin.settings.statsHistory = historyObj;
                try { await this.plugin.saveSettings(); } catch(err) { console.warn("[BrainCore] settings 回退保存失败:", err); }
            }
        };

        let history = await readStatsHistory();
        if (!history) {
            const oldHistory = (this.plugin.settings.statsHistory && typeof this.plugin.settings.statsHistory === "object")
                ? this.plugin.settings.statsHistory
                : {};
            history = { ...oldHistory };
        }
        if (!history || typeof history !== "object") history = {};
        history.version = "bc-stats-net-v21-shared-daily-delta";

        const snapshotStats = (h) => JSON.stringify({
            date: h.date,
            baseFileSum: h.baseFileSum,
            baseFilePaths: h.baseFilePaths,
            lastFileTotal: h.lastFileTotal,
            lastFilePaths: h.lastFilePaths,
            todayRenames: h.todayRenames
        });

        const isStatsReady = totalSum > 0;
        if (isStatsReady) {
            const statsBefore = snapshotStats(history);
            if (history.date !== todayISO) {
                history.date = todayISO;
                history.baseFileSum = Number.isFinite(history.lastFileTotal) ? history.lastFileTotal : fileSum;
                history.baseFilePaths = Array.isArray(history.lastFilePaths) ? history.lastFilePaths : currentEntityPaths;
                history.todayRenames = [];
            }
            if (!Array.isArray(history.baseFilePaths)) history.baseFilePaths = currentEntityPaths;
            history.lastFileTotal = fileSum;
            history.lastFilePaths = currentEntityPaths;
            history.todayRenames = mergeTodayRenameRegistry(
                history.date === todayISO ? history.todayRenames : [],
                this.plugin.getTodayRenames()
            );
            if (statsBefore !== snapshotStats(history)) {
                history.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
                await saveStatsHistory(history);
            }
        }

        const basePathSet = new Set(Array.isArray(history.baseFilePaths) ? history.baseFilePaths : []);
        const currentPathSet = new Set(currentEntityPaths);
        const renameRegistry = mergeTodayRenameRegistry(
            history.date === todayISO ? history.todayRenames : [],
            this.plugin.getTodayRenames()
        );
        const deltaInfo = computeTodayFileDelta(history.baseFilePaths, currentEntityPaths, entityFiles, todayISO, moment, renameRegistry);
        const { pathDiff, displayDiff, movedPairs, netAddedFiles, netDeletedFiles } = deltaInfo;

        try {
            await ensureStatsFolder();
            const statsSnapshotPath = "Scripts/braincore-stats-cache.json";
            const snapshotPayload = JSON.stringify({
                version: "bc-stats-cache-v1",
                ts: Date.now(),
                notes: totalNotes,
                imageTable: imageCount,
                attachment: attachmentCount,
                tags: totalTags,
                tasks: totalTasks,
                ideas: fleetingNotes,
                displayDiff,
                entityPaths: currentEntityPaths,
                taskSearchQuery,
                ideasPath: settings.pathIdeas || "Inbox/Ideas.md",
            }, null, 2);
            const statsCacheBodyEqual = (a, b) => {
                const stripTs = (raw) => {
                    try {
                        const obj = JSON.parse(raw || "{}");
                        if (obj && typeof obj === "object") delete obj.ts;
                        return JSON.stringify(obj);
                    } catch (e) {
                        return String(raw || "");
                    }
                };
                return stripTs(a) === stripTs(b);
            };
            const snapFile = this.app.vault.getAbstractFileByPath(statsSnapshotPath);
            if (snapFile) {
                const oldPayload = await this.app.vault.cachedRead(snapFile);
                if (!statsCacheBodyEqual(oldPayload, snapshotPayload)) await this.app.vault.modify(snapFile, snapshotPayload);
            } else {
                await this.app.vault.create(statsSnapshotPath, snapshotPayload);
            }
        } catch (e) {
            console.warn("[BrainCore] Mac 统计缓存写入失败:", e);
        }

        window.BrainCoreTodayDeltaFiles = {
            diff: displayDiff,
            pathDiff,
            moved: movedPairs,
            added: netAddedFiles.map((f) => ({ path: f.path, extension: f.extension || "", ctime: f.stat?.ctime || 0 })),
            deleted: netDeletedFiles
        };

        const diffMark = displayDiff > 0 ? `↑${displayDiff}` : (displayDiff < 0 ? `↓${Math.abs(displayDiff)}` : "→0");
        const diffColor = displayDiff > 0 ? "#ff5252" : (displayDiff < 0 ? "#4caf50" : "var(--text-muted)");
        const todayDeltaAttr = `style="font-size:12px; font-weight:800; color:${diffColor}; cursor:pointer; pointer-events:auto;" onclick="event.stopPropagation(); window.statAction('todayDelta', '')" title="点击查看今日文件变化"`;
        const statCell = (i, n, v, tooltip, actionType, query) => {
            const safeTooltip = String(tooltip || "").replace(/"/g, '&quot;').replace(/\n/g, '&#10;');
            return `<td class="sb-stat-cell"><div class="sb-stat-item-wrap" title="${safeTooltip}" onclick="window.statAction('${actionType}', '${query}')"><span style="font-size:14px; color:var(--text-muted); pointer-events:none;">${i}${n}</span><span class="sb-stat-val">${v}</span></div></td>`;
        };
        const safeTaskQuery = taskSearchQuery.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const statsInnerHtml = `<div class="sb-stat-total-row sb-stat-item-wrap"><div style="display:flex; flex-direction:column;"><span style="font-size:20px; font-weight:900; pointer-events:none;">Total</span><span ${todayDeltaAttr} title="↑净增 ↓净减 →无变化，点击查看详情">今日累计 ${diffMark}</span></div><span title="${String(compositionTip).replace(/\n/g, '&#10;').replace(/"/g, '&quot;')}" style="font-size:34px; font-weight:900; color:var(--text-accent); line-height:0.8; cursor:help;">${totalSum}</span></div><table class="sb-stat-table"><tr>${statCell("📝", "笔记", totalNotes, "共检索到 "+totalNotes+" 篇笔记", "search", "file:.md")}${statCell("🏷️", "标签", totalTags, "库中 " + totalTags + " 个独立标签（与 Obsidian 标签面板同源）；点击查看列表", "tags", "")}</tr><tr>${statCell("🖼️", "图·表", imageCount, "独立图片 / 表格 / 白板文件共 "+imageCount+" 个", "listGroup", "imageTable")}${statCell("⏳", "待办", totalTasks, taskDetails, "search", safeTaskQuery)}</tr><tr>${statCell("📎", "附件", attachmentCount, "除笔记、图·表文件外的其他独立附件共 "+attachmentCount+" 个", "listGroup", "attachment")}${statCell("⚡", "闪念", fleetingNotes, fleetingDetails, "file", settings.pathIdeas)}</tr></table>`;

        if (statsOnly && statsContainer) {
            let statsHost = statsContainer.querySelector('[data-bc-block="stats"]');
            if (!statsHost) {
                statsHost = statsContainer.querySelector('.sb-stat-table')?.parentElement || null;
                if (statsHost && !statsHost.hasAttribute('data-bc-block')) {
                    statsHost.setAttribute('data-bc-block', 'stats');
                }
            }
            if (statsHost) statsHost.innerHTML = statsInnerHtml;
            return;
        }

        let wkTasksHtml = '';
        try {
            if (!pendingTasks.length) {
                pendingTasks = await collectPendingTasks(app, settings, workFile);
            }
            if (pendingTasks.length > 0) {
                wkTasksHtml = renderSidebarTaskForest(pendingTasks);
            } else {
                wkTasksHtml = "";
            }
            this.plugin._pendingTasksCountCache = countRootPendingTasks(pendingTasks);
        } catch (e) { bcNoticeError("待办提取失败", e); }

        const openAddTask = () => {
            try { new CaptureModal(app, this.plugin).open(); } catch (e) { bcNoticeError("打开捕捉失败", e); }
        };
        const mountTasksEmpty = (listEl) => {
            fillBcEmptyState(listEl, {
                message: "暂无未完成待办",
                ctaLabel: "添加待办",
                onCta: openAddTask,
            });
        };

        if (tasksOnly && tasksContainer) {
            let taskList = tasksContainer.querySelector('[data-bc-block="tasks"] .sb-task-list');
            if (!taskList) taskList = tasksContainer.querySelector('.sb-task-list');
            if (taskList) {
                if (wkTasksHtml) taskList.innerHTML = wkTasksHtml;
                else mountTasksEmpty(taskList);
            }
            try {
                if (this.plugin._statsCache && typeof this.plugin._statsCache === "object") {
                    this.plugin._statsCache.tasks = this.plugin._pendingTasksCountCache;
                    sessionStorage.setItem("sb-stats-cache-f", JSON.stringify(this.plugin._statsCache));
                }
            } catch (e) { /* ignore */ }
            this.plugin.notifyDataChanged("stats");
            return;
        }

        if (!rootEl) return;

        window.toggleWkTask = async (evOrPath, pathOrLine, lineOrEnc, encMaybe) => {
            // 兼容旧签名 (path,line,enc) 与新签名 (event,path,line,enc)
            let ev = null, path = evOrPath, line = pathOrLine, encText = lineOrEnc;
            if (evOrPath && typeof evOrPath === "object" && (evOrPath.target || evOrPath.currentTarget)) {
                ev = evOrPath; path = pathOrLine; line = lineOrEnc; encText = encMaybe;
            }
            const itemEl = ev?.currentTarget?.closest?.(".sb-task-item") || ev?.target?.closest?.(".sb-task-item");
            const listEl = itemEl?.closest?.(".sb-task-list");
            if (itemEl) {
                itemEl.remove(); // 立刻从 UI 消失
                if (listEl && !listEl.querySelector(".sb-task-item")) {
                    mountTasksEmpty(listEl);
                }
            }
            try {
                const file = app.vault.getAbstractFileByPath(path);
                if (!(file instanceof TFile)) { bcNoticeWarn("找不到任务文件"); app.workspace.trigger("braincore:refresh"); return; }
                const expectedText = decodeURIComponent(encText || "").trim();
                const expectedParsed = parsePendingTaskLine(expectedText);
                const expectedClean = (expectedParsed?.cleanText || expectedText.replace(/^\s*(?:>\s*)?(?:-\s|\*\s)\[[ xX]\]\s*/, "").trim()).toLowerCase();
                const content = await app.vault.cachedRead(file);
                const lines = content.split('\n');
                const isMatch = (idx) => {
                    if (idx < 0 || idx >= lines.length) return false;
                    const raw = lines[idx];
                    if (!parsePendingTaskLine(raw)) return false;
                    if (raw.trim() === expectedText) return true;
                    const p = parsePendingTaskLine(raw);
                    return !!(p && expectedClean && p.cleanText.toLowerCase() === expectedClean);
                };
                let targetLine = Number.isInteger(line) ? line : -1;
                if (!isMatch(targetLine)) targetLine = lines.findIndex((_, i) => isMatch(i));
                if (targetLine === -1 && expectedClean) {
                    targetLine = lines.findIndex((l) => {
                        const p = parsePendingTaskLine(l);
                        return p && p.cleanText.toLowerCase().includes(expectedClean);
                    });
                }
                if (targetLine === -1 || !parsePendingTaskLine(lines[targetLine])) {
                    bcNoticeWarn("找不到该任务，文档可能已被修改");
                    app.workspace.trigger("braincore:refresh");
                    return;
                }
                lines[targetLine] = markTaskLineComplete(lines[targetLine], true);
                await app.vault.modify(file, lines.join('\n'));
                bcNoticeSuccess("任务已完成");
                app.workspace.trigger("braincore:refresh");
            } catch (e) {
                bcNoticeError("任务勾选失败", e);
                app.workspace.trigger("braincore:refresh");
            }
        };
        window.statAction = (type, query) => { 
            try { 
                if (type === 'file') app.workspace.openLinkText(query, "/", false); 
                else if (type === 'tags') {
                    openVaultTagsBrowser(app);
                } else if (type === 'search') { 
                    openGlobalSearchQuery(app, query);
                } else if (type === 'explorer') {
                    app.commands.executeCommandById('file-explorer:open'); 
                } else if (type === 'listGroup' || type === 'todayDelta') {
                    const imageTableExts = ['png','jpg','jpeg','gif','webp','svg','xlsx','csv','canvas'];
                    let files = [];
                    let title = "文件列表";
                    let isDeletedList = false;

                    if (type === 'todayDelta') {
                        const delta = window.BrainCoreTodayDeltaFiles || { diff: 0, added: [], deleted: [], moved: [] };
                        const added = delta.added || [];
                        const deleted = delta.deleted || [];
                        const moved = delta.moved || [];
                        if (!added.length && !deleted.length && !moved.length) {
                            new Notice("今日无文件增减");
                            return;
                        }

                        const modal = new Modal(app);
                        modal.titleEl.setText("今日文件变化");
                        modal.modalEl.addClass("bc-today-delta-dialog");
                        const wrap = modal.contentEl.createDiv({ cls: "bc-today-delta-wrap" });
                        wrap.style.cssText = "max-height:60vh; overflow:auto; display:flex; flex-direction:column; gap:16px; padding:2px 0 8px;";

                        const styleId = "bc-today-delta-styles-v1";
                        if (!document.getElementById(styleId)) {
                            const st = document.createElement("style");
                            st.id = styleId;
                            st.textContent = `
.bc-today-delta-wrap .bc-today-sec-title{font-size:13px;font-weight:800;margin:0 0 8px;color:var(--text-normal)}
.bc-today-delta-wrap .bc-today-sec-meta{font-size:11px;font-weight:600;color:var(--text-muted);margin-left:6px}
.bc-today-delta-wrap .bc-today-item{padding:8px 10px;border-radius:8px;border:1px solid var(--background-modifier-border);font-size:12px;line-height:1.4;margin:0 0 6px}
.bc-today-delta-wrap .bc-today-item.is-clickable{cursor:pointer}
.bc-today-delta-wrap .bc-today-item.is-clickable:hover{background:var(--background-modifier-hover)}
.bc-today-delta-wrap .bc-today-item.is-deleted{opacity:.72;cursor:default}
.bc-today-delta-wrap .bc-today-item.is-moved{opacity:.85;cursor:default;font-size:11px}
.bc-today-delta-wrap .bc-today-empty{font-size:12px;color:var(--text-muted);margin:0 0 4px}
`;
                            document.head.appendChild(st);
                        }

                        const renderSection = (label, items, mode) => {
                            if (!items.length) return;
                            const sec = wrap.createDiv({ cls: "bc-today-sec" });
                            const head = sec.createDiv({ cls: "bc-today-sec-title" });
                            head.createSpan({ text: label });
                            head.createSpan({ text: String(items.length), cls: "bc-today-sec-meta" });
                            items.forEach((x) => {
                                let path = "";
                                let ext = "";
                                let sub = "";
                                if (mode === "moved") {
                                    path = x.to || x.from || "";
                                    sub = x.from && x.to ? `${x.from} → ${x.to}` : path;
                                    ext = (path.split(".").pop() || "").toLowerCase();
                        } else {
                                    path = x.path || String(x);
                                    ext = (x.extension || path.split(".").pop() || "").toLowerCase();
                                    sub = path;
                                }
                                const icon = ext === "md" ? "📝" : (imageTableExts.includes(ext) ? "🖼️" : "📎");
                                const item = sec.createDiv({
                                    cls: "bc-today-item" + (mode === "added" ? " is-clickable" : (mode === "deleted" ? " is-deleted" : " is-moved"))
                                });
                                item.setText(`${icon} ${sub}`);
                                if (mode === "added" && path) {
                                    item.onclick = () => {
                                        app.workspace.openLinkText(path, "/", false);
                                        modal.close();
                                    };
                                }
                            });
                        };

                        renderSection("今日新增", added, "added");
                        renderSection("今日删除", deleted, "deleted");
                        renderSection("移动 / 重命名（不计入净增）", moved, "moved");

                        if (!wrap.childElementCount) {
                            wrap.createEl("div", { text: "暂无文件。", cls: "bc-today-empty" });
                        }
                        modal.open();
                        return;
                    } else if (query === 'imageTable') {
                        files = app.vault.getFiles()
                            .filter(f => imageTableExts.includes(f.extension) && !f.path.includes("Templates"))
                            .sort((a,b) => a.path.localeCompare(b.path));
                        title = `图·表独立文件（${files.length}）`;
                    } else if (query === 'attachment') {
                        files = app.vault.getFiles()
                            .filter(f => f.extension !== 'md' && !imageTableExts.includes(f.extension) && !f.path.includes("Templates"))
                            .sort((a,b) => a.path.localeCompare(b.path));
                        title = `附件独立文件（${files.length}）`;
                    }

                    const modal = new Modal(app);
                    modal.titleEl.setText(title);
                    const wrap = modal.contentEl.createDiv();
                    wrap.style.cssText = "max-height:60vh; overflow:auto; display:flex; flex-direction:column; gap:6px;";
                    if (!files.length) {
                        wrap.createEl("div", { text: "暂无文件。", cls: "setting-item-description" });
                    } else {
                        files.forEach(x => {
                            const path = x.path || String(x);
                            const ext = (x.extension || path.split('.').pop() || "").toLowerCase();
                            const icon = ext === "md" ? "📝" : (imageTableExts.includes(ext) ? "🖼️" : "📎");
                            const item = wrap.createDiv();
                            item.style.cssText = "padding:8px 10px; border-radius:8px; cursor:pointer; border:1px solid var(--background-modifier-border); font-size:12px;";
                            item.setText(`${icon} ${path}`);
                            if (!isDeletedList) item.onclick = () => { app.workspace.openLinkText(path, "/", false); modal.close(); };
                            else item.style.opacity = "0.72";
                        });
                    }
                    modal.open();
                } 
            } catch (e) {
                bcNoticeError("统计操作失败", e);
            }
        };

const runCommand = async (cmd) => { 
            try { 
                if (cmd === "run-bc-task") new CaptureModal(app, this.plugin).open(); 
                else if (cmd === "run-capsule") new SmartCapsuleModal(app, this.plugin).open(); 
                else if (cmd === "run-file-wall") await this.plugin.openFileWall();
                else if (cmd === "switcher:open") app.commands.executeCommandById("switcher:open"); 
                else if (cmd === "global-search:open") app.commands.executeCommandById("global-search:open"); 
                else if (cmd === "run-archive") { 
                    await this.plugin.archiveTasks(); 
                } 
            } catch (e) {
                bcNoticeError("快捷操作失败", e);
            }
        };

        const container = rootEl.createEl("div", { cls: "sb-container lifeos-sidebar-inset" }); const weatherId = `w-${Math.random().toString(36).slice(2, 6)}`;
        if (typeof showLifeOsFirstRunCard === "function") {
            showLifeOsFirstRunCard(container, this.app, getLifeOsVaultKey(this.app, "bc-first-run"), {
                title: "欢迎使用 BrainCore LifeOS",
                bullets: [
                    "点左侧 ☁️ 图标随时打开控制台",
                    "建议安装并开启 Dataview 插件",
                    "一键创建默认目录（Inbox / Work / Boxes）",
                ],
                primaryLabel: "一键创建默认结构",
                onPrimary: async () => {
                    await this.plugin.ensureDefaultVaultStructure();
                    this.app.workspace.trigger("braincore:refresh");
                },
            });
        }
        if (isTrialActive(app, settings)) {
            injectLifeOsSharedStyles();
            const banner = container.createDiv({ cls: "lifeos-trial-banner" });
            banner.setText(`试用中，剩余 ${formatTrialRemaining(getTrialRemainingMs(app, settings))} · 点此激活永久使用`);
            banner.onclick = () => this.plugin.openBrainCoreSettings();
        }
        
        let initWeatherHtml = "🌤️ 天气加载中"; const cachedW = sessionStorage.getItem("sb-weather-cache-f"); 
        if (cachedW) { 
            try { 
                const wData = JSON.parse(cachedW); 
                if (wData?.html && !String(wData.html).includes("定位中") && !String(wData.html).includes("天气加载中") && !String(wData.html).includes("天气暂不可用") && Date.now() - (wData.ts || 0) < 3600000) { 
                    initWeatherHtml = wData.html; 
                } 
            } catch(e){} 
        }

        const blocks = {};
        blocks['greeting'] = document.createElement('div'); blocks['greeting'].innerHTML = `<div class="sb-header"><div class="sb-greet">${greeting}</div><div class="sb-date">${moment().format('MM-DD')} ${dayOfWeek} · WK${moment(now).isoWeek()}</div><div id="${weatherId}" class="sb-weather-box" aria-live="polite" aria-atomic="true">${initWeatherHtml}</div></div>`;
        
        blocks['progress'] = document.createElement('div'); blocks['progress'].innerHTML = `<div class="sb-prog-grid"><div class="sb-prog-item" title="${yearTip}"><div class="sb-item-inner"><div class="sb-prog-txt"><span class="sb-prog-label">年</span><span class="sb-prog-left">${yearP.toFixed(1)}% 余${dLY}d</span></div>${makeBar(yearP)}</div></div><div class="sb-prog-item" title="${monthTip}"><div class="sb-item-inner"><div class="sb-prog-txt"><span class="sb-prog-label">月</span><span class="sb-prog-left">${monthP.toFixed(1)}% 余${dLM}d</span></div>${makeBar(monthP)}</div></div><div class="sb-prog-item" title="${weekTip}"><div class="sb-item-inner"><div class="sb-prog-txt"><span class="sb-prog-label">周</span><span class="sb-prog-left">${weekP.toFixed(1)}% 余${dLW}d</span></div>${makeBar(weekP)}</div></div><div class="sb-prog-item" title="${dayTip}"><div class="sb-item-inner"><div class="sb-prog-txt"><span class="sb-prog-label">日</span><span class="sb-prog-left">${dayP.toFixed(1)}% 余${hLD}h</span></div>${makeBar(dayP)}</div></div></div>`;
        
        blocks['buttons'] = document.createElement('div'); const btnBox = blocks['buttons'].createEl("div", { cls: "sb-btn-wrapper" });
        const btns = [
            { n: "捕捉", i: "zap", c: "run-bc-task", tip: "打开捕捉面板" },
            { n: "文件", i: "doc", c: "run-file-wall", tip: "打开文件墙，浏览 Boxes 中的图片/PDF/音视频/附件" },
            { n: "闪念", i: "mic", c: "run-capsule", tip: "闪念胶囊：按关键词智能分发" },
            { n: "归档", i: "archive", c: "run-archive", tip: "归档当前或最近打开的 Markdown 笔记中已完成的待办" }
        ];
        btns.forEach(b => { const btn = btnBox.createEl("div", { cls: "sb-btn", attr: { title: b.tip } }); btn.createEl("div", { cls: "sb-btn-box" }).innerHTML = ICONS[b.i]; btn.createEl("div", { cls: "sb-btn-name", text: b.n }); btn.onclick = () => runCommand(b.c); });
        blocks['tasks'] = document.createElement('div');
        blocks['tasks'].setAttribute('data-bc-block', 'tasks');
        const tasksTip = "聚合生活待办（Inbox/Tasks.md）与当前周 Work 文件中的待办";
        {
            const titleRow = blocks['tasks'].createDiv({ cls: "sb-sec-title-row" });
            titleRow.createSpan({ cls: "sb-sec-title", text: "🎯 待办总览" });
            titleRow.createSpan({ cls: "sb-tip-icon", text: "ⓘ", attr: { title: tasksTip } });
            const taskList = blocks['tasks'].createDiv({ cls: "sb-task-list" });
            if (wkTasksHtml) taskList.innerHTML = wkTasksHtml;
            else mountTasksEmpty(taskList);
        }
        
        blocks['habits'] = document.createElement('div'); const habitData = settings.habitData || {}; 
        const types = settings.habitsConfig || []; 
        const dates = []; for (let i = 4; i >= 0; i--) dates.push(moment().subtract(i, 'days'));
        const hHeader = blocks['habits'].createEl("div", { cls: "sb-habit-row sb-habit-dayhead", style: "margin-bottom: 2px;" });
        hHeader.createEl("div", { cls: "sb-habit-label", text: "HABIT" });
        const hGrid = hHeader.createEl("div", { cls: "sb-habit-grid" });
        dates.forEach(m => {
            const isToday = m.isSame(moment(), "day");
            hGrid.createEl("div", { cls: `sb-habit-day-txt${isToday ? " is-today" : ""}`, text: m.format('dd').charAt(0) });
        });
        hHeader.createEl("div", { cls: "sb-habit-streak", text: "" });
        if (!types.length) {
            const emptyHost = blocks['habits'].createDiv();
            fillBcEmptyState(emptyHost, {
                message: "还没有习惯",
                ctaLabel: "去设置添加",
                onCta: () => this.plugin.openBrainCoreSettings({ tab: "habits" }),
            });
        } else types.forEach(h => {
            const row = blocks['habits'].createEl("div", { cls: "sb-habit-row" });
            row.createEl("div", { cls: "sb-habit-label", text: `${h.i}${h.n}` });
            const grid = row.createEl("div", { cls: "sb-habit-grid" });
            const total = countHabitTotal(habitData, h.id);
            dates.forEach(m => {
                const dStr = m.format('YYYY-MM-DD');
                const isToday = m.isSame(moment(), "day");
                const isChecked = habitData[dStr] && habitData[dStr][h.id];
                const box = grid.createEl("div", { cls: `sb-box${isChecked ? " checked" : ""}${isToday ? " is-today" : ""}` });
                box.onclick = async () => {
                    const nowChecked = box.classList.toggle('checked');
                    if (!habitData[dStr]) habitData[dStr] = {};
                    habitData[dStr][h.id] = nowChecked;
                    this.plugin.settings.habitData = habitData;
                    await this.plugin.saveSettings();
                    const streakEl = row.querySelector('.sb-habit-streak');
                    if (streakEl) streakEl.innerText = `${countHabitTotal(habitData, h.id)}d`;
                };
            });
            row.createEl("div", { cls: "sb-habit-streak", text: `${total}d`, attr: { title: `累计打卡 ${total} 天` } });
        });
        
        blocks['quote'] = document.createElement('div'); const qBox = blocks['quote'].createEl("div", { cls: "sb-quote-container" });
        const scrubQuoteHintHtml = (html) => String(html || "")
            .replace(/<div class="sb-quote-hint"[^>]*>[\s\S]*?<\/div>/gi, "")
            .replace(/轻触切换/g, "");
        const cachedQ = sessionStorage.getItem("sb-quote-cache-f");
        if (cachedQ) { 
            try { 
                const qData = JSON.parse(cachedQ); 
                if (qData.seed === currentSeed) {
                    const cleanHtml = scrubQuoteHintHtml(qData.html);
                    qBox.innerHTML = cleanHtml;
                    if (cleanHtml !== qData.html) {
                        qData.html = cleanHtml;
                        sessionStorage.setItem("sb-quote-cache-f", JSON.stringify(qData));
                    }
                }
            } catch (e) {
                console.warn("[BrainCore] 金句缓存读取失败:", e);
            }
        } else { 
            qBox.innerHTML = `<div class="sb-quote-wrap" style="border-left-color: #4caf50;"><div class="sb-quote-content" style="font-size: 0.95em;">💡 <b>开启金句轮播</b><br><span style="font-size: 0.9em; opacity: 0.8;">读书笔记或随笔中暂无可轮播摘录。<br><a href="#" class="bc-open-quotes-settings" style="color:var(--text-accent);">去设置读书笔记路径 →</a></span></div></div>`;
        }

        blocks['stats'] = document.createElement('div');
        blocks['stats'].setAttribute('data-bc-block', 'stats');
        blocks['stats'].innerHTML = statsInnerHtml;
        // 问候 + 进度 + 金句合成同一视觉块（点击切换金句，小时刷新种子不变）
        const heroIds = new Set(['greeting', 'progress', 'quote']);
        const enabledMods = this.plugin.settings.modules.filter(m => m.enabled && blocks[m.id]);
        const heroMods = enabledMods.filter(m => heroIds.has(m.id));
        let heroEmitted = false;
        const appendGap = () => container.insertAdjacentHTML('beforeend', `<div class="sb-module-gap" aria-hidden="true"></div>`);
        enabledMods.forEach(m => {
            if (heroIds.has(m.id)) {
                if (heroEmitted) return;
                heroEmitted = true;
                const heroCanCycle = heroMods.some(hm => hm.id === 'quote');
                const hero = container.createDiv({ cls: "sb-hero-block" });
                if (heroCanCycle) {
                    hero.setAttribute("title", "点击切换金句");
                    hero.setAttribute("role", "button");
                    hero.setAttribute("tabindex", "0");
                    hero.setAttribute("aria-label", "问候、时间进度与金句，点击切换金句");
                }
                heroMods.forEach(hm => {
                    while (blocks[hm.id].firstChild) hero.appendChild(blocks[hm.id].firstChild);
                });
                appendGap();
                return;
            }
            while (blocks[m.id].firstChild) container.appendChild(blocks[m.id].firstChild);
            appendGap();
        });
        if (container.lastChild && container.lastChild.classList.contains('sb-module-gap')) { container.removeChild(container.lastChild); }

        if (dataviewMissing) {
            const banner = container.createDiv({ cls: "bc-dv-banner" });
            banner.style.cssText = "margin:0 0 12px;padding:10px 12px;border-radius:10px;background:var(--background-secondary);font-size:12px;line-height:1.5;color:var(--text-muted);border:1px solid var(--background-modifier-border);";
            banner.createSpan({ text: "⚠️ 未检测到 Dataview：控制台已降级运行。请安装并开启 " });
            const link = banner.createEl("a", { text: "Dataview 插件", href: "#" });
            link.style.color = "var(--text-accent)";
            link.onclick = (e) => {
                e.preventDefault();
                try {
                    this.app.setting.open();
                    window.setTimeout(() => {
                        try { this.app.setting.openTabById("community-plugins"); } catch (err) { /* ignore */ }
                    }, 0);
                } catch (err) {
                    bcNoticeWarn("请手动打开：设置 → 第三方插件 → 浏览");
                }
            };
            banner.createSpan({ text: " 后重启 Obsidian。" });
            container.prepend(banner);
        }

        const quoteSettingsLink = container.querySelector(".bc-open-quotes-settings");
        if (quoteSettingsLink) {
            quoteSettingsLink.onclick = (e) => { e.preventDefault(); this.plugin.openBrainCoreSettings(); };
        }
        const taskTipEl = container.querySelector(".sb-tip-icon");
        if (taskTipEl) {
            taskTipEl.setAttribute("role", "button");
            taskTipEl.setAttribute("tabindex", "0");
            taskTipEl.setAttribute("aria-label", tasksTip);
            const showTaskTip = (e) => {
                e.stopPropagation();
                new Notice(tasksTip, 5000);
            };
            taskTipEl.onclick = showTaskTip;
            taskTipEl.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") showTaskTip(e); };
        }

        if (settings.modules.find(m => m.id === 'quote' && m.enabled)) { 
            const renderQuoteHtml = (quote) =>
                `<div class="sb-quote-wrap"><div class="sb-quote-content">"${escapeHtml(quote.t)}"</div><div class="sb-quote-src">—— 《${escapeHtml(quote.s)}》</div></div>`;
            const persistQuoteCache = (html, index, pool) => {
                try {
                    const slimPool = Array.isArray(pool)
                        ? pool.slice(0, 200).map(q => ({ t: String(q.t || ""), s: String(q.s || "") }))
                        : undefined;
                    sessionStorage.setItem("sb-quote-cache-f", JSON.stringify({
                        seed: currentSeed,
                        html,
                        index,
                        pool: slimPool,
                    }));
                } catch (e) {
                    sessionStorage.setItem("sb-quote-cache-f", JSON.stringify({ seed: currentSeed, html, index }));
                }
            };
            const applyQuoteAt = (index) => {
                const pool = this._quotePool;
                if (!pool?.length) return false;
                const idx = ((index % pool.length) + pool.length) % pool.length;
                this._quoteIndex = idx;
                const finalHtml = renderQuoteHtml(pool[idx]);
                const liveBox = container.querySelector(".sb-quote-container") || qBox;
                if (liveBox) {
                    liveBox.innerHTML = finalHtml;
                    const wrap = liveBox.querySelector(".sb-quote-wrap");
                    if (wrap) {
                        wrap.classList.add("is-cycling");
                        window.setTimeout(() => wrap.classList.remove("is-cycling"), 120);
                    }
                }
                persistQuoteCache(finalHtml, idx, pool);
                plugin.notifyDataChanged("quote");
                return true;
            };
            const bindHeroQuoteCycle = () => {
                const hero = container.querySelector(".sb-hero-block");
                if (!hero || hero.dataset.bcQuoteBound === "1") return;
                hero.dataset.bcQuoteBound = "1";
                const cycle = (e) => {
                    if (e?.target?.closest?.("a, button, input, textarea, .bc-open-quotes-settings")) return;
                    const sel = window.getSelection?.();
                    if (sel && !sel.isCollapsed && hero.contains(sel.anchorNode)) return;
                    e?.preventDefault?.();
                    if (!this._quotePool?.length) return;
                    applyQuoteAt((this._quoteIndex ?? 0) + 1);
                };
                hero.addEventListener("click", cycle);
                hero.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        cycle(e);
                    }
                });
            };

            (async () => { 
                try {
                    const cachedQ = sessionStorage.getItem("sb-quote-cache-f");
                    let needScan = true;
                    if (cachedQ) {
                        try {
                        const qData = JSON.parse(cachedQ);
                            if (qData.seed === currentSeed && qData.html) {
                                if (Array.isArray(qData.pool) && qData.pool.length) {
                                    this._quotePool = qData.pool;
                                    this._quoteIndex = Number.isInteger(qData.index)
                                        ? qData.index
                                        : (currentSeed % qData.pool.length);
                                    needScan = false;
                                }
                            }
                        } catch (e) { /* fall through */ }
                    }
                    if (!needScan) {
                        const liveBox = container.querySelector(".sb-quote-container") || qBox;
                        liveBox?.querySelectorAll?.(".sb-quote-hint")?.forEach((el) => el.remove());
                        if (liveBox && /轻触切换/.test(liveBox.innerHTML || "")) {
                            liveBox.innerHTML = scrubQuoteHintHtml(liveBox.innerHTML);
                        }
                        bindHeroQuoteCycle();
                        return;
                    }

                    const quoteFolder = settings.pathQuotes || "Weread";
                    const essayPath = settings.pathEssays || "读&写/随笔.md";
                    const cleanQuoteText = (text) => String(text || "")
                        .replace(/^[>\s]+(?:\[![a-zA-Z]+\])?\s*/g, '')
                        .replace(/^(?:📌|💡|🔖|📝|📖|🚩)?\s*(?:笔记|随记|章节总结)?\s*/g, '')
                        .replace(/<[^>]+>/g, '')
                        .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1')
                        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                        .replace(/[*_`~#]/g, '')
                        .trim();
                    const shouldKeepQuote = (text) => {
                        if (!text || text.length <= 10 || text.length > 220) return false;
                        if (text.match(/^\d{4}[-\/]\d{2}[-\/]\d{2}/)) return false;
                        if (text.match(/^\d{1,2}:\d{2}$/)) return false;
                        if (text.startsWith('💭') || text.startsWith('[!')) return false;
                        if (/书籍简介/.test(text)) return false;
                        return true;
                    };

                    // 读书笔记：仅抽取「高亮划线」「读书笔记」章节；随笔另走下方逻辑。
                    const wereadFiles = app.vault.getMarkdownFiles()
                        .filter(f => f.path.toLowerCase().includes(quoteFolder.toLowerCase()) && f.basename !== "Weread-Book")
                        .sort((a, b) => b.stat.mtime - a.stat.mtime); 
                    let allQuotes = []; 
                    let essayQuotes = [];
                    for (let i = 0; i < Math.min(wereadFiles.length, 80); i++) { 
                        const content = await app.vault.cachedRead(wereadFiles[i]); 
                        if (content.length > 50000) continue; 
                        allQuotes.push(...extractQuotesFromWereadContent(content, wereadFiles[i].basename, cleanQuoteText, shouldKeepQuote));
                    }

                    // 随笔：兼容按 年/月/周 保存的 callout 结构，只抽取正文，不把标题和时间当金句。
                    const essayFile = app.vault.getAbstractFileByPath(essayPath);
                    if (essayFile && essayFile.extension === "md") {
                        const essayContent = await app.vault.cachedRead(essayFile);
                        if (essayContent.length <= 120000) {
                            const essayLines = essayContent.split('\n');
                            let currentBlock = [];
                            const flushEssayBlock = () => {
                                const qText = cleanQuoteText(currentBlock.join(' ')).replace(/\s+/g, ' ').trim();
                                if (shouldKeepQuote(qText)) {
                                    const essayQuote = { t: qText, s: "随笔" };
                                    allQuotes.push(essayQuote);
                                    essayQuotes.push(essayQuote);
                                }
                                currentBlock = [];
                            };

                            essayLines.forEach(line => {
                                const trimmed = line.trim();
                                if (/^>\s*\[!/.test(trimmed)) {
                                    flushEssayBlock();
                                    return;
                                }
                                if (trimmed.startsWith(">")) {
                                    const qText = cleanQuoteText(trimmed);
                                    if (qText && !qText.match(/^\d{1,2}:\d{2}$/) && !qText.startsWith('[!') && !qText.startsWith('💭')) currentBlock.push(qText);
                                    return;
                                }
                                flushEssayBlock();
                            });
                            flushEssayBlock();
                        }
                    }
                    if (allQuotes.length > 0) { 
                        const quotePool = (essayQuotes.length > 0 && currentSeed % 4 === 0) ? essayQuotes : allQuotes;
                        this._quotePool = quotePool;
                        const idx = currentSeed % quotePool.length;
                        applyQuoteAt(idx);
                    }
                    bindHeroQuoteCycle();
                } catch (e) {
                    console.warn("[BrainCore] 金句加载失败:", e);
                }
            })(); 
        }
        
        if (settings.modules.find(m => m.id === 'greeting' && m.enabled)) {
            (async () => {
                const WEATHER_TTL_MS = 3600000;
                const GEO_TTL_MS = 4 * 3600000; // 网络定位每 4 小时最多请求一次
                const GEO_CACHE_KEY = "sb-geo-cache-f";
                const WEATHER_FAIL_HTML = "🌤️ 天气暂不可用";
                const WEATHER_PENDING_MARKERS = ["定位中", "天气加载中", "天气暂不可用"];
                const defLat = parseFloat(settings.defaultLat) || 31.81;
                const defLon = parseFloat(settings.defaultLon) || 119.97;

                const isWeatherCacheHit = (html, ts) => {
                    if (!html || !ts) return false;
                    const s = String(html);
                    if (WEATHER_PENDING_MARKERS.some(m => s.includes(m))) return false;
                    return Date.now() - ts < WEATHER_TTL_MS;
                };

                const writeWeather = (html, persist = true) => {
                    const wEl = container.querySelector('#' + weatherId);
                    if (wEl) wEl.innerHTML = html;
                    if (persist && !String(html).includes("天气暂不可用")) {
                        sessionStorage.setItem("sb-weather-cache-f", JSON.stringify({ ts: Date.now(), html }));
                        plugin.notifyDataChanged("weather");
                    }
                };

                const readGeoCache = () => {
                    try {
                        const raw = sessionStorage.getItem(GEO_CACHE_KEY);
                        return raw ? JSON.parse(raw) : null;
                    } catch (e) { return null; }
                };

                // 始终以设置里的经纬度为准（不再被 session 里的 IP 定位覆盖）
                const resolveCoordsNow = () => ({ lat: defLat, lon: defLon, source: "settings" });

                const persistGeoToSettings = async (lat, lon) => {
                    if (settings.weatherCoordsCustom) return false;
                    const latStr = lat.toFixed(2);
                    const lonStr = lon.toFixed(2);
                    if (settings.defaultLat === latStr && settings.defaultLon === lonStr) return false;
                    settings.defaultLat = latStr;
                    settings.defaultLon = lonStr;
                    await plugin.saveSettings();
                    return true;
                };

                // 后台：满 4 小时才请求一次网络定位；未手动改过坐标时写入设置
                const refreshGeoInBackground = async () => {
                    const geo = readGeoCache();
                    if (geo && Date.now() - (geo.ts || 0) < GEO_TTL_MS) return null;
                    try {
                        const { lat, lon } = await bcFetchGeoCoords();
                        const next = { ts: Date.now(), ok: true, lat, lon };
                        sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(next));
                        await persistGeoToSettings(lat, lon);
                        return next;
                    } catch (e) {
                        console.warn("[BrainCore] 定位失败，继续使用设置经纬度:", e);
                        sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ ts: Date.now(), ok: false }));
                        return null;
                    }
                };

                try {
                    // 1 小时内天气缓存有效则跳过，但仍检查是否需要后台刷新定位
                    let weatherFresh = false;
                    try {
                        const cachedRaw = sessionStorage.getItem("sb-weather-cache-f");
                        if (cachedRaw) {
                            const cached = JSON.parse(cachedRaw);
                            if (isWeatherCacheHit(cached?.html, cached?.ts)) {
                                weatherFresh = true;
                            }
                        }
                    } catch (e) {}

                    if (!weatherFresh) {
                        const coords = resolveCoordsNow();
                        writeWeather(await bcFetchWeatherAt(coords.lat, coords.lon));
                    }

                    const geoUpdated = await refreshGeoInBackground();
                    if (geoUpdated?.ok) {
                        const latNow = parseFloat(settings.defaultLat) || defLat;
                        const lonNow = parseFloat(settings.defaultLon) || defLon;
                        try {
                            writeWeather(await bcFetchWeatherAt(latNow, lonNow));
                        } catch (e) {
                            console.warn("[BrainCore] 网络定位后天气刷新失败:", e);
                        }
                    }
                } catch (e) {
                    console.warn("[BrainCore] 天气加载失败:", e);
                    writeWeather(WEATHER_FAIL_HTML, false);
                    void refreshGeoInBackground();
                }
            })();
        }
    }
}




class BrainCoreIOSQuickModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.quickTextArea = null;
        this.pendingImages = [];
        this.isQuickExpanded = false;
    }

    onOpen() {
        this.modalEl.addClass("bc-ios-quick-modal");
        this.titleEl.setText("BrainCore 快速面板");
        this.render();
    }

    makeImageName() {
        return `IMG-${window.moment().format("YYYYMMDDHHmmssSSS")}-${Math.random().toString(36).slice(2, 6)}.png`;
    }

    injectQuickStyle() {
        // 勿 new CaptureModal：构造成本高；样式已注入则跳过
        if (!document.getElementById("bc-capture-modal-styles-v268")) {
            CaptureModal.prototype.injectStyles.call({ app: this.app, plugin: this.plugin });
        }
        if (document.getElementById("bc-ios-quick-style-v3")) return;

        const style = document.createElement("style");
        style.id = "bc-ios-quick-style-v3";
        style.textContent = `
            .bc-ios-quick-modal .modal {
                width: min(760px, 94vw) !important;
                max-width: 94vw !important;
                max-height: 88vh !important;
                border-radius: 24px !important;
            }
            .bc-ios-quick-modal .modal-content {
                padding: 0 !important;
                overflow-y: auto !important;
            }
            .bcq-wrap {
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding: 0 10px 10px;
            }
            .bcq-capture-shell {
                border: 1px solid var(--background-modifier-border);
                border-radius: 18px;
                background: var(--background-primary);
                overflow: hidden;
            }
            .bcq-capture-shell .bc-nav-row {
                padding: 10px 12px 0 !important;
            }
            .bcq-capture-shell .bc-nav-links-wrapper {
                gap: 6px !important;
                overflow-x: auto !important;
                white-space: nowrap !important;
            }
            .bcq-capture-shell .bc-nav-link {
                padding: 4px 8px !important;
                font-size: 12px !important;
                max-width: 118px !important;
                background: transparent !important;
                border: none !important;
            }
            .bcq-capture-shell .bc-input-container {
                margin: 8px 12px 8px !important;
                min-height: 198px !important;
                padding: 0 !important;
                position: relative !important;
            }
            .bcq-capture-shell .bc-textarea {
                min-height: 196px !important;
                height: 196px !important;
                padding: 18px 18px 64px 18px !important;
                box-sizing: border-box !important;
            }
            .bcq-capture-shell .bc-source-indicator {
                display: none !important;
            }
            .bcq-capture-shell .bc-editor-toolbar {
                position: absolute !important;
                left: 18px !important;
                right: 18px !important;
                bottom: 14px !important;
                padding: 0 !important;
                gap: 10px !important;
                flex-wrap: nowrap !important;
                align-items: center !important;
                justify-content: center !important;
                background: transparent !important;
                border: none !important;
            }
            .bcq-capture-shell .bc-tool-btn {
                padding: 4px !important;
            }
            .bcq-capture-shell .bc-tool-btn svg {
                width: 18px !important;
                height: 18px !important;
            }
            .bcq-capture-shell .bc-button-row {
                padding: 2px 12px 10px !important;
                display: grid !important;
                grid-template-columns: repeat(4, 1fr) !important;
                column-gap: 6px !important;
                row-gap: 6px !important;
                align-items: stretch !important;
                justify-items: stretch !important;
            }
            .bcq-capture-shell .bc-row-item {
                min-width: 0 !important;
                padding: 2px 0 !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                background: transparent !important;
                border-radius: 8px !important;
                border: none !important;
            }
            .bcq-capture-shell .bc-row-item:hover {
                background: transparent !important;
                border-color: transparent !important;
                opacity: 0.82 !important;
            }
            .bcq-capture-shell .bc-row-icon {
                font-size: 16px !important;
                margin-bottom: 0 !important;
            }
            .bcq-capture-shell .bc-row-item span {
                font-size: 12px !important;
                line-height: 1.15 !important;
                margin-top: 2px !important;
                font-weight: 700 !important;
            }
            .bcq-card {
                border: 1px solid var(--background-modifier-border);
                border-radius: 16px;
                padding: 10px 12px;
                background: var(--background-primary);
            }
            .bcq-title {
                font-weight: 800;
                font-size: 16px;
                margin-bottom: 0;
                color: var(--text-normal);
            }
            .bcq-title-row {
                display: flex;
                align-items: center;
                gap: 4px;
                margin-bottom: 6px;
            }
            .bcq-tip-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                font-size: 11px;
                font-weight: 800;
                color: var(--text-muted);
                background: color-mix(in srgb, var(--lifeos-accent, #b48246) 10%, transparent);
                cursor: help;
                flex-shrink: 0;
            }
            .bcq-muted {
                font-size: 11px;
                color: var(--text-muted);
                margin-top: 6px;
                line-height: 1.45;
            }
            .bcq-task {
                display: flex;
                gap: 8px;
                align-items: flex-start;
                padding: 6px 0;
                border-bottom: none;
            }
            .bcq-task:last-child {
                border-bottom: none;
            }
            .bcq-task input[type="checkbox"] {
                width: 18px;
                height: 18px;
                margin-top: 1px;
            }
            .bcq-task-text {
                flex: 1;
                line-height: 1.35;
                font-size: 13px;
            }
            .bcq-task-children {
                margin: 0 0 2px 0;
                padding: 0 0 0 18px;
                border-left: 1.5px solid color-mix(in srgb, var(--lifeos-accent, #b48246) 18%, transparent);
            }
            .bcq-task-children .bcq-task-text {
                font-size: 12px;
                opacity: 0.92;
            }
            .bcq-task-children .bcq-task-children .bcq-task-text {
                font-size: 11px;
                opacity: 0.88;
            }
            .bcq-habit-table {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .bcq-habit-row {
                display: grid;
                grid-template-columns: 64px minmax(170px, 1fr) 52px;
                align-items: center;
                gap: 8px;
            }
            .bcq-habit-label {
                font-size: 13px;
                font-weight: 800;
                color: var(--text-normal);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .bcq-habit-grid {
                display: grid;
                grid-template-columns: repeat(5, 28px);
                gap: 8px;
                align-items: center;
                justify-content: center;
            }
            .bcq-habit-day {
                font-size: 12px;
                color: var(--text-muted);
                text-align: center;
                font-weight: 800;
            }
            .bcq-habit-box {
                width: 24px;
                height: 24px;
                border-radius: 7px;
                border: 1px solid var(--background-modifier-border);
                background: var(--background-secondary);
                cursor: pointer;
                box-sizing: border-box;
                transition: transform .12s ease, background .12s ease;
            }
            .bcq-habit-box:active {
                transform: scale(.94);
            }
            .bcq-habit-box.checked {
                background: var(--interactive-accent);
                border-color: var(--interactive-accent);
            }
            .bcq-habit-day.is-today {
                color: #d67272;
                font-weight: 900;
            }
            .bcq-habit-box.is-today {
                border: 1.5px solid rgba(214,114,114,.55);
                box-shadow: 0 0 0 1px rgba(214,114,114,.12);
            }
            .bcq-habit-box.is-today.checked {
                border-color: var(--interactive-accent);
                box-shadow: none;
            }
            .bcq-habit-streak {
                font-size: 12px;
                color: var(--text-muted);
                font-weight: 800;
                text-align: right;
            }

            @media (max-width: 520px) {
                .bc-ios-quick-modal .modal {
                    width: 94vw !important;
                }
                .bcq-wrap {
                    padding: 0 6px 8px;
                    gap: 8px;
                }
                .bcq-capture-shell .bc-nav-row {
                    padding: 8px 10px 0 !important;
                }
                .bcq-capture-shell .bc-nav-label,
                .bcq-capture-shell .bc-nav-link {
                    font-size: 11px !important;
                }
                .bcq-capture-shell .bc-input-container {
                    margin: 6px 8px 6px !important;
                    min-height: 182px !important;
                    padding: 0 !important;
                    position: relative !important;
                }
                .bcq-capture-shell .bc-textarea {
                    min-height: 176px !important;
                    height: 176px !important;
                    font-size: 16px !important;
                    padding: 16px 16px 60px 16px !important;
                }
                .bcq-capture-shell .bc-editor-toolbar {
                    left: 12px !important;
                    right: 12px !important;
                    bottom: 12px !important;
                    gap: 8px !important;
                    justify-content: center !important;
                }
                .bcq-capture-shell .bc-tool-btn svg {
                    width: 17px !important;
                    height: 17px !important;
                }
                .bcq-capture-shell .bc-button-row {
                    padding: 2px 8px 8px !important;
                    display: grid !important;
                    grid-template-columns: repeat(4, 1fr);
                    row-gap: 4px !important;
                    column-gap: 4px !important;
                }
                .bcq-capture-shell .bc-row-item {
                    padding: 2px 0 !important;
                    border-radius: 10px !important;
                }
                .bcq-capture-shell .bc-row-icon {
                    font-size: 16px !important;
                    margin-bottom: 0 !important;
                }
                .bcq-capture-shell .bc-row-item span {
                    font-size: 11px !important;
                }
                .bcq-card {
                    padding: 9px 10px;
                    border-radius: 15px;
                }
                .bcq-title {
                    font-size: 15px;
                    margin-bottom: 5px;
                }
                .bcq-task-text {
                    font-size: 12px;
                }
                .bcq-habit-row {
                    grid-template-columns: 56px minmax(148px, 1fr) 34px;
                    gap: 6px;
                }
                .bcq-habit-grid {
                    grid-template-columns: repeat(5, 24px);
                    gap: 7px;
                    justify-content: center;
                }
                .bcq-habit-box {
                    width: 24px;
                    height: 24px;
                    border-radius: 7px;
                }
                .bcq-habit-label, .bcq-habit-streak, .bcq-habit-day {
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    insertAtCursor(text) {
        const el = this.quickTextArea;
        if (!el) return;
        el.focus();
        let success = false;
        try { success = document.execCommand("insertText", false, text); } catch(e) {}
        if (!success) {
            const start = el.selectionStart || 0;
            const end = el.selectionEnd || 0;
            el.value = el.value.substring(0, start) + text + el.value.substring(end);
            el.setSelectionRange(start + text.length, start + text.length);
        }
    }

    pickAndInsertTag() {
        pickVaultTag(this.app, (tag) => {
            if (!tag) this.insertAtCursor("#");
            else this.insertAtCursor(`#${tag} `);
        });
    }

    bindListContinuation() {
        const el = this.quickTextArea;
        if (!el) return;

        let enterHandled = false;

        el.addEventListener("keydown", (e) => {
            if ((e.key === "Enter" || e.keyCode === 13) && !e.metaKey && !e.ctrlKey) {
                const start = el.selectionStart;
                const textBefore = el.value.substring(0, start);
                const lastLine = textBefore.split("\n").pop();

                const listMatch = lastLine.match(/^([ \t\u00A0]*)([-*]|\d+\.)[ \t\u00A0]+(.*)/);
                if (listMatch) {
                    e.preventDefault();
                    enterHandled = true;
                    setTimeout(() => { enterHandled = false; }, 50);

                    const indent = listMatch[1];
                    const marker = listMatch[2];
                    const content = listMatch[3];

                    if (!content.trim()) {
                        el.value = el.value.substring(0, start - lastLine.length) + "\n" + el.value.substring(start);
                        el.setSelectionRange(start - lastLine.length + 1, start - lastLine.length + 1);
                        return;
                    }

                    let newMarker = marker;
                    const numMatch = marker.match(/^(\d+)\./);
                    if (numMatch) newMarker = `${parseInt(numMatch[1], 10) + 1}.`;

                    this.insertAtCursor("\n" + indent + newMarker + " ");
                }
            }

            if ((e.metaKey || e.ctrlKey) && (e.key === "Enter" || e.keyCode === 13)) {
                e.preventDefault();
                this.saveByCaptureLogic({ label: "草稿", icon: "📋", isDraft: true });
            }
        });

        el.addEventListener("input", (e) => {
            if (enterHandled) return;
            const start = el.selectionStart;
            if (start > 0 && el.value[start - 1] === "\n") {
                if (e.inputType === "deleteContentBackward" || e.inputType === "deleteWordBackward") return;

                const textBefore = el.value.substring(0, start - 1);
                const lastLine = textBefore.split("\n").pop();
                const listMatch = lastLine.match(/^([ \t\u00A0]*)([-*]|\d+\.)[ \t\u00A0]+(.*)/);
                if (listMatch) {
                    const indent = listMatch[1];
                    const marker = listMatch[2];
                    const content = listMatch[3];

                    if (!content.trim()) {
                        el.value = el.value.substring(0, start - lastLine.length - 1) + "\n" + el.value.substring(start);
                        el.setSelectionRange(start - lastLine.length, start - lastLine.length);
                        return;
                    }

                    let newMarker = marker;
                    const numMatch = marker.match(/^(\d+)\./);
                    if (numMatch) newMarker = `${parseInt(numMatch[1], 10) + 1}.`;

                    this.insertAtCursor(indent + newMarker + " ");
                }
            }
        });

        el.addEventListener("paste", async (e) => {
            const cd = e.clipboardData || e.originalEvent?.clipboardData;
            if (!cd) return;
            const plain = String(cd.getData("text/plain") || "").trim();
            if (plain) return;

            const items = cd.items || [];
            let handledImage = false;
            for (const item of items) {
                if (!item?.type || item.type.indexOf("image") === -1) continue;
                if (!handledImage) {
                    e.preventDefault();
                    handledImage = true;
                }
                    const file = item.getAsFile();
                    if (!file) continue;
                    const notePath = this.plugin.getCaptureNotePathForPending();
                    const info = parseFileInfoFromUpload(file, "png");
                    const usedPaths = new Set((this.pendingImages || []).map(x => x.path).filter(Boolean));
                    const path = makeUniqueVaultPath(
                        this.app.vault,
                        resolveCaptureAttachmentPath(this.app, this.plugin.settings, info, notePath),
                        usedPaths
                    );
                    const name = path.split("/").pop();
                    this.pendingImages.push({ name, path, data: await file.arrayBuffer(), extension: info.extension, originalBaseName: info.originalBaseName, mime: file.type || "", isImage: true });
                    this.insertAtCursor(`![[${path}]]`);
            }
        });
    }

    toggleQuickSize() {
        this.isQuickExpanded = !this.isQuickExpanded;
        const h = this.isQuickExpanded ? "52vh" : (this.app.isMobile ? "130px" : "150px");
        this.quickTextArea.style.setProperty("height", h, "important");
        this.quickTextArea.style.setProperty("min-height", h, "important");
    }

    showPriorityMenu(e) {
        const menu = new Menu();
        [{l:"⏫ 极高",v:"⏫"}, {l:"🔼 高",v:"🔼"}, {l:"🔽 低",v:"🔽"}, {l:"❌ 清除",v:""}].forEach(p => {
            menu.addItem(i => i.setTitle(p.l).onClick(() => {
                if (p.v) this.insertAtCursor(p.v);
            }));
        });
        if (this.app.isMobile) menu.showAtPosition({ x: e.clientX || 160, y: e.clientY || 300 });
        else menu.showAtMouseEvent(e);
    }

    async showDraftHistory(e) {
        const file = this.app.vault.getAbstractFileByPath(this.plugin.settings.pathDrafts || "Inbox/草稿.md");
        if (!file) {
            new Notice("暂无草稿文件");
            return;
        }

        const content = await this.app.vault.read(file);
        const draftLines = content.split("\n").filter(isDraftListLine).slice(0, 8);

        if (!draftLines.length) {
            new Notice("暂无可引用草稿");
            return;
        }

        const menu = new Menu();
        draftLines.forEach(line => {
            const preview = stripDraftLineContent(line).substring(0, 28);
            menu.addItem(i => i.setTitle(preview + (preview.length >= 28 ? "..." : "")).onClick(() => {
                this.quickTextArea.value = stripDraftLineContent(line);
                this.quickTextArea.focus();
            }));
        });
        if (this.app.isMobile) menu.showAtPosition({ x: e.clientX || 160, y: e.clientY || 300 });
        else menu.showAtMouseEvent(e);
    }

    isImageFile(file) {
        const name = (file?.name || "").toLowerCase();
        const type = (file?.type || "").toLowerCase();
        return type.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg|bmp|heic|heif|tiff?)$/i.test(name);
    }

    sanitizeAttachmentName(name) {
        const raw = String(name || "附件").trim();
        const cleaned = raw
            .replace(/[\\/:*?"<>|#^[\]]/g, "-")
            .replace(/\s+/g, " ")
            .replace(/^\.+/, "")
            .slice(0, 140);
        return cleaned || `附件-${window.moment().format("YYYYMMDDHHmmss")}`;
    }

    makeUniqueAttachmentPath(file, usedPaths = new Set()) {
        const info = parseFileInfoFromUpload(file);
        const cleaned = this.sanitizeAttachmentName(file.name || "附件");
        info.originalBaseName = cleaned.replace(/\.[^.]+$/, "") || info.originalBaseName;
        const notePath = this.plugin.getCaptureNotePathForPending();
        const desired = resolveCaptureAttachmentPath(this.app, this.plugin.settings, info, notePath);
        return makeUniqueVaultPath(this.app.vault, desired, usedPaths);
    }

    insertAttachmentLinksNoFocus(links) {
        if (!links || !links.length || !this.quickTextArea) return;

        const el = this.quickTextArea;
        const wasFocused = document.activeElement === el;
        const text = (el.value && !el.value.endsWith("\n") ? "\n" : "") + links.join("\n") + "\n";

        if (wasFocused && typeof el.selectionStart === "number") {
            const start = el.selectionStart || 0;
            const end = el.selectionEnd || start;
            el.value = el.value.substring(0, start) + text + el.value.substring(end);
            try {
                el.setSelectionRange(start + text.length, start + text.length);
            } catch(e) {}
        } else {
            el.value = (el.value || "") + text;
        }
    }

    async handleSelectedFiles(fileList) {
        const files = Array.from(fileList || []);
        if (!files.length) return;

        const usedPaths = new Set((this.pendingImages || []).map(x => x.path).filter(Boolean));
        const links = [];

        for (const file of files) {
            const path = this.makeUniqueAttachmentPath(file, usedPaths);
            const name = path.split("/").pop();
            const info = parseFileInfoFromUpload(file);
            const isImage = this.isImageFile(file);

            this.pendingImages.push({
                name,
                path,
                data: await file.arrayBuffer(),
                mime: file.type || "",
                extension: info.extension,
                originalBaseName: info.originalBaseName,
                isImage,
                isAttachment: !isImage
            });

            // 严格按你的规则：
            // 图片插入 ![[...]]
            // PDF / Word / Excel / TXT / ZIP / 视频等普通文件插入 [[...]]
            links.push(isImage ? `![[${path}]]` : `[[${path}]]`);
        }

        this.insertAttachmentLinksNoFocus(links);
        new Notice(`已添加 ${files.length} 个文件，点击保存后写入库内`);
    }

    openQuickFileInput(options = {}) {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.setAttribute("multiple", "multiple");

        // 只有移动端选择“照片 / 视频”时才设置 accept。
        // 桌面端、移动端“文件 / 附件”都不设置 accept，确保 PDF / Word / Excel / TXT / ZIP / 视频不被灰掉。
        if (options.accept) {
            input.setAttribute("accept", options.accept);
        }

        input.style.position = "fixed";
        input.style.left = "-9999px";
        input.style.top = "-9999px";
        input.style.width = "1px";
        input.style.height = "1px";
        input.style.opacity = "0";
        input.style.pointerEvents = "none";

        input.addEventListener("change", async (e) => {
            try {
                await this.handleSelectedFiles(e.target.files);
            } finally {
                input.remove();
            }
        });

        document.body.appendChild(input);
        input.click();
    }

    async triggerQuickUpload(e) {
        if (this.app.isMobile) {
            // 移动端单独处理：
            // 1. 照片 / 视频：走系统相册入口
            // 2. 文件 / 附件：走通用文件入口，不做类型限制
            const menu = new Menu();

            menu.addItem(item => item
                .setTitle("选择照片 / 视频")
                .setIcon("image")
                .onClick(() => this.openQuickFileInput({ accept: "image/*,video/*" }))
            );

            menu.addItem(item => item
                .setTitle("选择文件 / 附件")
                .setIcon("paperclip")
                .onClick(() => this.openQuickFileInput())
            );

            menu.addItem(item => item
                .setTitle("取消")
                .onClick(() => {})
            );

            menu.showAtPosition({
                x: Math.round((window.innerWidth || 360) / 2),
                y: 260
            });
            return;
        }

        // 桌面端单独处理：直接打开完整文件选择器，不限制类型。
        this.openQuickFileInput();
    }


    async saveByMaterialLogic() {
        if (!(this.pendingImages && this.pendingImages.length)) {
            new Notice("请先上传或粘贴图片、文档、音视频等文件");
            return;
        }

        const cap = new CaptureModal(this.app, this.plugin);
        cap.textArea = this.quickTextArea;
        cap.pendingImages = this.pendingImages || [];
        cap.useSource = false;
        cap.close = () => {};
        const ok = await cap.processMaterialSave();
        if (ok === false) return;

        this.quickTextArea.value = "";
        this.pendingImages = [];
        await this.render();
    }

    async saveByCaptureLogic(item) {
        const body = String(this.quickTextArea?.value || "").trim();
        const pending = this.pendingImages || [];
        if (!body && !pending.length) {
            new Notice("请输入内容或上传文件");
            this.quickTextArea?.focus();
            return;
        }

        const cap = new CaptureModal(this.app, this.plugin);
        cap.textArea = this.quickTextArea;
        cap.pendingImages = pending;
        cap.useSource = false;
        cap.close = () => {};
        const ok = await cap.processSave(item);
        if (ok === false) return;

        this.quickTextArea.value = "";
        this.pendingImages = [];
        await this.render();
    }

    getWeekTaskFiles() {
        const files = [];
        const seen = new Set();

        const addPath = (path) => {
            if (!path || seen.has(path)) return;
            const f = this.app.vault.getAbstractFileByPath(path);
            if (f && f.extension === "md") {
                files.push(f);
                seen.add(path);
            }
        };

        addPath(this.plugin.settings.pathTasks);

        const weekPad = window.moment().isoWeek().toString().padStart(2, "0");
        const workPath = (this.plugin.settings.pathWork || "Work").replace(/\/$/, "");
        const allMd = this.app.vault.getMarkdownFiles ? this.app.vault.getMarkdownFiles() : [];
        allMd.forEach(f => {
            if (seen.has(f.path)) return;
            if (!f.path.startsWith(workPath + "/") && f.path !== workPath) return;
            if (f.basename && f.basename.includes(`WK${weekPad}`)) {
                files.push(f);
                seen.add(f.path);
            }
        });

        return files;
    }

    async loadTasks() {
        const result = [];
        const files = this.getWeekTaskFiles();
        const pathTasks = this.plugin.settings.pathTasks;

        for (const file of files) {
            let content = "";
            try { content = await this.app.vault.read(file); } catch (e) { continue; }
            const weeklyOnly = file.path !== pathTasks;
            const sectionTodo = getWeeklySectionNames(this.plugin.settings).todo;
            const extracted = extractPendingTasksFromContent(content, file.path, { weeklySectionOnly: weeklyOnly, sectionTodo });
            extracted.forEach(t => {
                result.push({
                    file,
                    lineIndex: t.lineIndex,
                    lineNum: t.lineNum,
                    completed: false,
                    text: t.text,
                    cleanText: t.cleanText,
                    depth: t.depth || 0,
                    path: t.path,
                    source: file.basename || file.name
                });
            });
        }

        this.plugin._pendingTasksCountCache = countRootPendingTasks(result);
        return result;
    }

    renderQuickTaskNode(parentEl, task) {
        const row = parentEl.createDiv({ cls: "bcq-task" });
        const cb = row.createEl("input");
        cb.type = "checkbox";
        cb.checked = false;
        const body = row.createDiv({ cls: "bcq-task-text" });
        body.createDiv({ text: task.cleanText || task.text });
        cb.onchange = async () => {
            await this.toggleTask(task, cb.checked);
        };
        if (task.children?.length) {
            const childWrap = parentEl.createDiv({ cls: "bcq-task-children" });
            for (const child of task.children) {
                this.renderQuickTaskNode(childWrap, child);
            }
        }
    }

    async toggleTask(task, checked) {
        if (!this.plugin.requireLicense()) return;
        const content = await this.app.vault.read(task.file);
        const lines = content.split("\n");
        const line = lines[task.lineIndex];
        if (!line || !parsePendingTaskLine(line)) {
            new Notice("任务位置已变化，请刷新后再试");
            return;
        }

        lines[task.lineIndex] = markTaskLineComplete(line, checked);
        await this.app.vault.modify(task.file, lines.join("\n"));
        this.app.workspace.trigger("braincore:refresh");
        new Notice(checked ? "✅ 已完成" : "↩️ 已恢复未完成");
        await this.render();
    }

    async toggleHabit(habitId, date, checked) {
        if (!this.plugin.requireLicense()) return;
        const data = this.plugin.settings.habitData || {};
        if (!data[date]) data[date] = {};
        data[date][habitId] = checked;
        this.plugin.settings.habitData = data;
        await this.plugin.saveSettings();
        this.app.workspace.trigger("braincore:refresh");
        await this.render();
    }

    renderCaptureBlock(wrap) {
        const shell = wrap.createDiv({ cls: "bcq-capture-shell" });

        const navRow = shell.createDiv({ cls: "bc-nav-row" });
        navRow.createSpan({ text: "最近文件: ", cls: "bc-nav-label" });
        const navWrapper = navRow.createDiv({ cls: "bc-nav-links-wrapper" });
        const recent = this.app.workspace.getLastOpenFiles ? this.app.workspace.getLastOpenFiles().slice(0, 2) : [];
        recent.forEach(p => {
            const name = p.split("/").pop().replace(".md", "");
            const link = navWrapper.createEl("a", { cls: "bc-nav-link", text: name });
            link.onclick = () => { this.app.workspace.openLinkText(p, "", false); this.close(); };
        });

        const inputBox = shell.createDiv({ cls: "bc-input-container" });
        this.quickTextArea = inputBox.createEl("textarea", {
            cls: "bc-textarea",
            attr: { placeholder: "记录些什么..." }
        });
        this.bindListContinuation();

        const toolbar = inputBox.createDiv({ cls: "bc-editor-toolbar" });
        const addTool = (svg, cb) => {
            const btn = toolbar.createEl("button", { cls: "bc-tool-btn" });
            btn.innerHTML = svg;
            btn.onclick = (e) => { e.preventDefault(); cb(e); };
            return btn;
        };
        addTool(ICONS.expand, () => this.toggleQuickSize());
        addTool(ICONS.upload, () => this.triggerQuickUpload());
        addTool(ICONS.tag, () => this.pickAndInsertTag());
        addTool(ICONS.uList, () => this.insertAtCursor("- "));
        addTool(ICONS.oList, () => this.insertAtCursor("1. "));
        addTool(ICONS.time, () => this.insertAtCursor(` 📅 ${window.moment().format("YYYY-MM-DD HH:mm")}`));
        addTool(ICONS.flag, (e) => this.showPriorityMenu(e));
        addTool(ICONS.doc, (e) => this.showDraftHistory(e));

        const btnRow = shell.createDiv({ cls: "bc-button-row" });
        const items = [
            { label: "工作", icon: "💼", isWork: true },
            { label: "生活", icon: "🏠", isLife: true },
            { label: "闪念", icon: "🧠", isIdea: true },
            { label: "随笔", icon: "📝", isEssay: true },
            { label: "剪藏", icon: "🔖", isClipper: true },
            { label: "素材", icon: "🎨", isMaterial: true },
            { label: "草稿", icon: "📋", isDraft: true }
        ];
        const tips = { 工作: "写入周工作待办", 生活: "写入生活待办", 闪念: "写入闪念", 随笔: "写入随笔", 剪藏: "需粘贴 URL", 素材: "仅文件", 草稿: "写入草稿" };
        mountCaptureCategoryRow(shell, btnRow, items, {
            getTip: (item) => tips[item.label] || item.label,
            onCategoryClick: (item) => item.isMaterial ? this.saveByMaterialLogic() : this.saveByCaptureLogic(item)
        });
    }

    async renderTasksBlock(wrap) {
        const tasksCard = wrap.createDiv({ cls: "bcq-card" });
        const titleRow = tasksCard.createDiv({ cls: "bcq-title-row" });
        titleRow.createDiv({ cls: "bcq-title", text: "🎯 待办总览" });
        const tip = titleRow.createSpan({ cls: "bcq-tip-icon", text: "ⓘ" });
        tip.title = "聚合生活待办（Inbox/Tasks.md）与当前周 Work 文件中的待办";
        tip.onclick = (e) => { e.stopPropagation(); new Notice(tip.title, 5000); };

        const tasks = await this.loadTasks();
        const allRoots = buildTaskForestFromFlat(tasks);
        const displayRoots = allRoots.slice(0, 4);

        if (displayRoots.length === 0) {
            const emptyHost = tasksCard.createDiv();
            fillBcEmptyState(emptyHost, {
                message: "暂无未完成待办",
                ctaLabel: "添加待办",
                onCta: () => this.quickTextArea?.focus(),
            });
            return;
        }

        displayRoots.forEach((root) => this.renderQuickTaskNode(tasksCard, root));
        if (allRoots.length > 4) {
            const more = tasksCard.createEl("button", { text: `查看全部 ${allRoots.length} 项待办 →`, cls: "bcq-view-all-tasks" });
            more.style.cssText = "width:100%;margin-top:8px;padding:8px;border-radius:8px;border:1px dashed var(--background-modifier-border);background:transparent;font-size:12px;cursor:pointer;color:var(--text-accent);";
            more.onclick = async () => {
                await this.plugin.activateView();
                this.close();
            };
        }
    }

    renderHabitsBlock(wrap) {
        const habitCard = wrap.createDiv({ cls: "bcq-card" });
        habitCard.createDiv({ cls: "bcq-title", text: "习惯打卡" });

        const habits = this.plugin.settings.habitsConfig || [];
        if (!habits.length) {
            const emptyHost = habitCard.createDiv();
            fillBcEmptyState(emptyHost, {
                message: "还没有习惯",
                ctaLabel: "去设置添加",
                onCta: () => this.plugin.openBrainCoreSettings({ tab: "habits" }),
            });
            return;
        }

        const table = habitCard.createDiv({ cls: "bcq-habit-table" });
        const dates = [];
        for (let i = 4; i >= 0; i--) dates.push(window.moment().subtract(i, "days"));

        const header = table.createDiv({ cls: "bcq-habit-row" });
        header.createDiv({ cls: "bcq-habit-label", text: "" });
        const hGrid = header.createDiv({ cls: "bcq-habit-grid" });
        dates.forEach(m => {
            const isToday = m.isSame(window.moment(), "day");
            hGrid.createDiv({ cls: "bcq-habit-day" + (isToday ? " is-today" : ""), text: m.format("dd").charAt(0) });
        });
        header.createDiv({ cls: "bcq-habit-streak" });

        const habitData = this.plugin.settings.habitData || {};
        habits.forEach(h => {
            const row = table.createDiv({ cls: "bcq-habit-row" });
            row.createDiv({ cls: "bcq-habit-label", text: `${h.i || ""}${h.n || h.id}` });

            const grid = row.createDiv({ cls: "bcq-habit-grid" });
            const total = countHabitTotal(habitData, h.id);

            dates.forEach(m => {
                const dStr = m.format("YYYY-MM-DD");
                const isToday = m.isSame(window.moment(), "day");
                const checked = !!(habitData[dStr] && habitData[dStr][h.id]);
                const box = grid.createDiv({ cls: "bcq-habit-box" + (checked ? " checked" : "") + (isToday ? " is-today" : "") });
                box.onclick = async () => {
                    await this.toggleHabit(h.id, dStr, !checked);
                };
            });

            row.createDiv({ cls: "bcq-habit-streak", text: `${total}d` });
        });
    }

    async render() {
        this.injectQuickStyle();
        const { contentEl } = this;
        contentEl.empty();
        if (!this.plugin.requireLicense()) {
            mountActivationPanel(contentEl, this.plugin, {
                compact: true,
                onActivated: async () => { await this.render(); }
            });
            return;
        }

        const wrap = contentEl.createDiv({ cls: "bcq-wrap" });
        // 先出捕捉区，待办/打卡异步补齐，缩短快捷指令唤起后的首屏等待
        this.renderCaptureBlock(wrap);
        try { this.quickTextArea?.focus?.({ preventScroll: true }); } catch (_) { /* ignore */ }
        const tasksHost = wrap.createDiv({ cls: "bcq-async-slot" });
        const habitsHost = wrap.createDiv({ cls: "bcq-async-slot" });
        const paint = typeof requestAnimationFrame === "function"
            ? (fn) => requestAnimationFrame(() => void fn())
            : (fn) => setTimeout(fn, 0);
        paint(async () => {
            if (!this.modalEl?.isConnected) return;
            await this.renderTasksBlock(tasksHost);
            if (!this.modalEl?.isConnected) return;
            this.renderHabitsBlock(habitsHost);
        });
    }
}


class BrainCorePlugin extends Plugin {
    async onload() {
        // 1. 同步兜底设置，防崩溃
        this.settings = Object.assign({}, DEFAULT_SETTINGS);
        this._deepLinkReady = false;
        this._pendingDeepLink = null;

        // 2. 第一时间注册视图，绝不阻塞！
        this.registerView(VIEW_TYPE_DASHBOARD, (leaf) => new DashboardView(leaf, this));

        // 协议尽早挂上：Obsidian 冷启动时 deep link 可能先于 loadSettings 到达
        this.registerObsidianProtocolHandler("braincore", async (params) => {
            const action = String(params?.action || params?.a || "quick").toLowerCase();
            if (!this._deepLinkReady) {
                this._pendingDeepLink = action;
                return;
            }
            await this.handleBrainCoreDeepLink(action);
        });

        // 旧目录 → braincore-lifeos（须在 loadSettings 前拷 data.json）
        try {
            const migrated = await migrateLegacyBrainCoreInstall(this);
            if (migrated) {
                window.setTimeout(() => {
                    new Notice("BrainCore 已统一到 plugins/braincore-lifeos（设置/激活已保留）。若异常请重启 Obsidian。", 8000);
                }, 1200);
            }
        } catch (e) {
            console.warn("BrainCore 目录迁移失败:", e);
        }

        // 3. 异步加载真实配置；设置一到手就放行 deep link（别等试用写入 / 路径迁移）
        await this.loadSettings();
        syncLicenseState(this.app, this.settings);
        this._deepLinkReady = true;
        if (this._pendingDeepLink) {
            const pending = this._pendingDeepLink;
            this._pendingDeepLink = null;
            void this.handleBrainCoreDeepLink(pending);
        }

        this.initTodayRenameRegistry();
        if (isTrialEdition() && this.settings.trialWelcomeSeen) {
            ensureTrialStarted(this.app, this.settings, true);
        }
        if ((this.settings.trialStartedAt && !this.settings.licenseActivated) || (isTrialEdition() && this.settings.trialWelcomeSeen)) {
            await this.saveSettings();
        }
        if (this.settings.pathWork === "Work/房车") { this.settings.pathWork = "Work"; await this.saveSettings(); }

        this.addSettingTab(new BrainCoreSettingsTab(this.app, this));

        // iOS 快捷指令入口：obsidian://braincore?action=quick
        this.addCommand({
            id: "open-ios-quick-panel",
            name: "打开 BrainCore 快速面板",
            callback: () => { if (this.requireLicense()) new BrainCoreIOSQuickModal(this.app, this).open(); }
        });
        this.addCommand({ id: "open-capture", name: "打开 BrainCore 捕捉", callback: () => { if (this.requireLicense()) new CaptureModal(this.app, this).open(); } });
        this.addCommand({ id: "open-capsule", name: "打开 BrainCore 闪念胶囊", callback: () => { if (this.requireLicense()) new SmartCapsuleModal(this.app, this).open(); } });
        this.addCommand({ id: "run-archive", name: "BrainCore 归档当前笔记待办", callback: () => { if (this.requireLicense()) this.archiveTasks(); } });
        this.addCommand({ id: "open-file-wall", name: "打开文件墙", callback: () => { if (this.requireLicense()) void this.openFileWall(); } });

        // 4. 暴露全局 API
        window.BrainCoreAPI = {
            openCapture: () => { if (this.requireLicense()) new CaptureModal(this.app, this).open(); },
            openCapsule: () => { if (this.requireLicense()) new SmartCapsuleModal(this.app, this).open(); },
            openQuickPanel: () => { if (this.requireLicense()) new BrainCoreIOSQuickModal(this.app, this).open(); },
            archive: () => { if (this.requireLicense()) this.archiveTasks(); },
            openFileWall: () => { if (this.requireLicense()) void this.openFileWall(); },
            getPendingTasksCount: (dv) => {
                if (typeof this._pendingTasksCountCache === "number") {
                    return this._pendingTasksCountCache;
                }
                return this.countPendingTasksFallback(dv);
            },
            // 🟢 映射：直读侧边栏最新的天气缓存
            getWeather: () => {
                try {
                    const cached = sessionStorage.getItem("sb-weather-cache-f");
                    if (cached) {
                        const data = JSON.parse(cached);
                        const html = data?.html;
                        if (html && !html.includes("定位中") && !html.includes("天气加载中") && !html.includes("天气暂不可用") && Date.now() - (data.ts || 0) < 3600000) {
                            return html;
                        }
                    }
                } catch(e) { console.warn("[BrainCore] 天气缓存读取失败:", e); }
                return "🌤️ 天气加载中";
            },
            // 🟢 映射：直读侧边栏抽取的金句并提取文本
            getQuoteObj: () => {
                try {
                    const cached = sessionStorage.getItem("sb-quote-cache-f");
                    if (cached) {
                        const data = JSON.parse(cached);
                        const tMatch = data.html.match(/class="sb-quote-content">"([^"]+)"<\/div>/);
                        const sMatch = data.html.match(/class="sb-quote-src">—— 《([^》]+)》<\/div>/);
                        if (tMatch && sMatch) return { text: tMatch[1], source: sMatch[1] };
                    }
                } catch(e) { console.warn("[BrainCore] 金句缓存读取失败:", e); }
                return null;
            },
            getStats: () => {
                try {
                    if (this._statsCache && typeof this._statsCache === "object") {
                        return { ...this._statsCache };
                    }
                    const raw = sessionStorage.getItem("sb-stats-cache-f");
                    if (raw) return JSON.parse(raw);
                } catch (e) { console.warn("[BrainCore] 统计缓存读取失败:", e); }
                return null;
            },
            runStatAction: (type, query) => {
                const stat = typeof window.statAction === "function" ? window.statAction : null;
                if (!stat) return false;
                try {
                    if (type === "tags" || (type === "search" && String(query || "").replace(/\s/g, "") === "tag:#")) {
                        stat("tags", "");
                        return true;
                    }
                    if (type === "listGroup" && query === "notes") {
                        stat("search", "file:.md");
                        return true;
                    }
                    if (type === "tasks") {
                        let q = this._statsCache?.taskSearchQuery;
                        if (!q) {
                            try {
                                const raw = sessionStorage.getItem("sb-stats-cache-f");
                                if (raw) q = JSON.parse(raw).taskSearchQuery;
                            } catch (e) { /* ignore */ }
                        }
                        stat("search", q || `path:"${this.settings.pathTasks}" -[x]`);
                        return true;
                    }
                    if (type === "ideas") {
                        const p = this._statsCache?.ideasPath || this.settings.pathIdeas || "Inbox/Ideas.md";
                        stat("file", p);
                        return true;
                    }
                    stat(type, query);
                    return true;
                } catch (e) {
                    console.warn("[BrainCore] runStatAction 失败:", e);
                    return false;
                }
            },
        };
        
        this.registerEvent(this.app.vault.on('create', async (file) => {
            if (file.extension !== 'md') return; const basePath = this.settings.pathWork.replace(/\/$/, '');
            if (!file.path.startsWith(basePath) || !file.name.match(/^WK\d{2}/)) return;
            setTimeout(async () => { if (!this.app.vault.getAbstractFileByPath(file.path)) return; const content = await this.app.vault.read(file); if (content.trim() === "") await this.populateWeeklyFile(file); }, 500);
        }));

        this.injectDashboardStyles();
        this.addRibbonIcon('cloud', '打开 BrainCore', () => { this.activateView(); });

        // 加载完成后：仅检查试用到期提醒（不自动弹使用说明/更新日志）
        this.app.workspace.onLayoutReady(async () => {
            await this.migrateOldHabitData();
            await this.refreshPendingTasksCountCache();
            this.checkTrialExpiryReminders();
            maybeShowLifeOsSuitePrompt(this.app, this.manifest.id, this.manifest.name);
            this.app.workspace.trigger("braincore:refresh");
        });
    }

    async runVaultStartup() {
        this.checkTrialExpiryReminders();
    }

    maybeShowTrialWelcomeModal(onDone) {
        if (!isTrialEdition() || this.settings.trialWelcomeSeen || this.settings.licenseActivated) {
            if (typeof onDone === "function") onDone();
            return;
        }
        openLifeOsTrialModal(this.app, {
            title: "开始免费试用",
            paragraphs: [
                `您正在使用 BrainCore LifeOS ${getTrialHoursLabel()}体验版。确认后将开始全功能试用，到期须激活才能继续写入。`,
                "试用期间可随时在控制台输入激活码永久绑定本设备。",
            ],
            buttons: [
                {
                    text: "开始试用",
                    primary: true,
                    onClick: async (modal) => {
                        this.settings.trialWelcomeSeen = true;
                        ensureTrialStarted(this.app, this.settings, true);
                        await this.saveSettings();
                        bcNoticeSuccess(`已开始 ${getTrialHoursLabel()} 试用`);
                        this.app.workspace.trigger("braincore:refresh");
                        modal.close();
                        if (typeof onDone === "function") onDone();
                    },
                },
                {
                    text: "稍后再说",
                    onClick: (modal) => {
                        modal.close();
                        if (typeof onDone === "function") onDone();
                    },
                },
            ],
        });
    }

    checkTrialExpiryReminders() {
        if (!isTrialEdition() || this.settings.licenseActivated) return;
        if (this.settings.trialWelcomeSeen) ensureTrialStarted(this.app, this.settings, true);
        const remain = getTrialRemainingMs(this.app, this.settings);
        if (remain <= 0 && this.settings.trialStartedAt && this.settings.trialWelcomeSeen) {
            this.maybeShowTrialExpiredModal();
            return;
        }
        if (remain <= 0) return;
        const twoHours = 2 * 60 * 60 * 1000;
        const thirtyMin = 30 * 60 * 1000;
        if (remain <= twoHours && !this.settings.trialReminder2hSeen) {
            this.settings.trialReminder2hSeen = true;
            this.saveSettings();
            this.maybeShowTrialRenewModal(remain, "2h");
        } else if (remain <= thirtyMin && !this.settings.trialReminder30mSeen) {
            this.settings.trialReminder30mSeen = true;
            this.saveSettings();
            this.maybeShowTrialRenewModal(remain, "30m");
        }
    }

    maybeShowTrialRenewModal(remainMs, kind) {
        openLifeOsTrialModal(this.app, {
            title: kind === "30m" ? "试用即将结束" : "试用剩余不足 2 小时",
            paragraphs: [
                `试用剩余 ${formatTrialRemaining(remainMs)}。到期后捕捉、归档等功能将暂停，但库内笔记数据不会丢失。`,
            ],
            buttons: [
                {
                    text: "去激活",
                    primary: true,
                    onClick: async (modal) => {
                        modal.close();
                        await this.activateView();
                        this.app.workspace.trigger("braincore:refresh");
                    },
                },
                { text: "知道了", onClick: (modal) => modal.close() },
            ],
        });
    }

    maybeShowTrialExpiredModal() {
        if (this._trialExpiredModalShown) return;
        if (!isTrialEdition() || isAccessAllowed(this.app, this.settings)) return;
        this._trialExpiredModalShown = true;
        openLifeOsTrialModal(this.app, {
            title: "试用已到期",
            paragraphs: [
                `${getTrialHoursLabel()}免费试用已结束。您的笔记、待办与附件均保留在库中，激活后即可继续写入。`,
            ],
            buttons: [
                {
                    text: "立即激活",
                    primary: true,
                    onClick: async (modal) => {
                        modal.close();
                        await this.activateView();
                    },
                },
                { text: "稍后", onClick: (modal) => modal.close() },
            ],
        });
    }

    async ensureBasicStructureDeferred() {
        if (this.settings.basicStructureReady) return;
        await this.ensureBasicStructure({ quiet: true });
        this.settings.basicStructureReady = true;
        await this.saveSettings();
    }

    isFirstInstall() {
        return !String(this.settings.lastSeenVersion || "").trim();
    }

    isUsageGuideDone() {
        return this.settings.welcomeGuideVersion === USAGE_GUIDE_VERSION;
    }

    closeAppSettingsIfOpen() {
        try {
            if (this.app.setting?.containerEl?.isShown?.()) {
                this.app.setting.close();
            }
        } catch (e) { /* ignore */ }
    }

    async openMarkdownInMainTab(file) {
        if (!file) return null;
        this.closeAppSettingsIfOpen();
        await new Promise((resolve) => window.setTimeout(resolve, 80));
        const { workspace } = this.app;
        const mainLeaf = workspace.getLeavesOfType("markdown").find((leaf) => !this.isLeafInRightSplit(leaf));
        if (mainLeaf) workspace.setActiveLeaf(mainLeaf, { focus: false });
        let leaf = null;
        try {
            leaf = workspace.getLeaf("tab");
        } catch (e) {
            leaf = workspace.getLeaf(false);
        }
        if (!leaf) leaf = workspace.getLeaf(false);
        await leaf.openFile(file);
        workspace.setActiveLeaf(leaf, { focus: true });
        return leaf;
    }

    openBrainCoreSettings(options = {}) {
        this._openSettingsFromActivation = !!options?.fromActivation;
        const tab = options?.tab || (options?.fromActivation ? "auth" : null);
        if (tab) this._settingsFocusTab = tab;
        try {
            const pluginId = this.manifest?.id || "braincore-lifeos";
            this.app.setting.open();
            window.setTimeout(() => {
                try { this.app.setting.openTabById(pluginId); } catch (e) { /* ignore */ }
            }, 0);
        } catch (e) {
            new Notice("请手动打开：设置 → 第三方插件 → BrainCore LifeOS");
        }
    }

    collectRightSplitLeaves() {
        const leaves = [];
        const rightSplit = this.app.workspace.rightSplit;
        if (!rightSplit) return leaves;
        const stack = [rightSplit];
        while (stack.length) {
            const node = stack.pop();
            if (!node) continue;
            if (node instanceof WorkspaceLeaf) {
                leaves.push(node);
                continue;
            }
            const children = node.children;
            if (Array.isArray(children)) {
                for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);
            }
        }
        return leaves;
    }


    async revealBrainCoreSidebar() {
        const { workspace } = this.app;
        const rightSplit = workspace.rightSplit;
        if (!rightSplit) return null;
        if (rightSplit.collapsed) rightSplit.expand();

        let dashboardLeaf = workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD)[0];
        if (!dashboardLeaf) {
            for (const leaf of this.collectRightSplitLeaves()) {
                if (leaf.getViewState()?.type === VIEW_TYPE_DASHBOARD) {
                    dashboardLeaf = leaf;
                    break;
                }
            }
        }
        if (!dashboardLeaf) {
            dashboardLeaf = workspace.getRightLeaf(false);
            await dashboardLeaf.setViewState({ type: VIEW_TYPE_DASHBOARD, active: true });
        } else {
            const state = dashboardLeaf.getViewState();
            if (state.type !== VIEW_TYPE_DASHBOARD) {
                await dashboardLeaf.setViewState({ type: VIEW_TYPE_DASHBOARD, active: true });
            }
        }

        await workspace.revealLeaf(dashboardLeaf);
        workspace.setActiveLeaf(dashboardLeaf, { focus: false });
        return dashboardLeaf;
    }

    async forceExclusiveBrainCoreSidebar() {
        return this.revealBrainCoreSidebar();
    }

    isLeafInRightSplit(leaf) {
        if (!leaf) return false;
        const rightSplit = this.app.workspace.rightSplit;
        if (!rightSplit) return false;
        let node = leaf.parent;
        while (node) {
            if (node === rightSplit) return true;
            node = node.parent;
        }
        return false;
    }

    pinDashboardLeaf(leaf) {
        if (!leaf) return;
        try {
            if (typeof leaf.pin === "function") leaf.pin();
            else if ("pinned" in leaf) leaf.pinned = true;
        } catch (e) { /* ignore */ }
    }

    async openUsageGuideFile(options = {}) {
        await openBrainCoreUsageGuide(this, options);
    }

    async openShortcutsGuideFile(options = {}) {
        await openBrainCoreShortcutsGuide(this, options);
    }

    getCaptureNotePathForPending() {
        return this.app.workspace.getActiveFile()?.path || "";
    }

    maybeSuggestAttachmentManagement() {
        if (this.settings.followAttachmentManagement === false) return;
        if (getAttachmentMgmtSettings(this.app)) return;
        if (this.settings.attachmentMgmtHintSeen) return;
        bcNoticeInfo("建议安装 Attachment Management 插件，可自动按图片/PDF/录音分类存放素材。未安装时素材将统一保存到 Boxes/附件。", 12000);
        this.settings.attachmentMgmtHintSeen = true;
        this.saveSettings();
    }

    async resolveCaptureTargetNotePath(item, now) {
        if (item?.isWork) {
            const workFile = await this.getOrCreateWeeklyWorkFile(now);
            return workFile?.path || this.settings.pathWork || "Work";
        }
        if (item?.isLife) return this.settings.pathTasks || "Inbox/Tasks.md";
        if (item?.isIdea) return this.settings.pathIdeas || "Inbox/Ideas.md";
        if (item?.isEssay) return this.settings.pathEssays || "读&写/随笔.md";
        if (item?.isDraft) return this.settings.pathDrafts || "Inbox/草稿.md";
        if (item?.isClipper) return this.settings.pathClippings || "Inbox/Clippings";
        if (item?.isMaterial) return this.settings.pathMaterials || "Boxes/文件墙.md";
        return this.getCaptureNotePathForPending();
    }

    countPendingTasksFallback(dv) {
        this.refreshPendingTasksCountCache();
        let count = 0;
        try {
            const taskPage = dv?.page?.(this.settings.pathTasks);
            if (taskPage?.file?.tasks) {
                count += taskPage.file.tasks.where(t => !t.completed).length;
            }
        } catch (e) {
            console.warn("[BrainCore] 待办统计 fallback 失败:", e);
        }
        return count;
    }

    notifyDataChanged(kind = "all") {
        try {
            this.app.workspace.trigger("braincore:data-changed", { kind, ts: Date.now() });
        } catch (_) { /* ignore */ }
    }

    async refreshPendingTasksCountCache() {
        try {
            const workFile = this.findWeeklyWorkFile(window.moment());
            const workKey = workFile?.path || "";
            let pendingTasks;
            const bundle = this._pendingTasksBundle;
            if (bundle && bundle.workKey === workKey && Date.now() - bundle.ts < 5000) {
                pendingTasks = bundle.tasks;
            } else {
                pendingTasks = await collectPendingTasks(this.app, this.settings, workFile);
                this._pendingTasksBundle = { workKey, tasks: pendingTasks, ts: Date.now() };
            }
            this._pendingTasksCountCache = countRootPendingTasks(pendingTasks);
            if (this._statsCache && typeof this._statsCache === "object") {
                this._statsCache.tasks = this._pendingTasksCountCache;
                try {
                    sessionStorage.setItem("sb-stats-cache-f", JSON.stringify(this._statsCache));
                } catch (e) { /* ignore */ }
            }
            this.notifyDataChanged("stats");
        } catch (e) {
            console.warn("[BrainCore] 待办统计缓存刷新失败:", e);
        }
    }

    requireLicense() {
        if (!isLicenseRequired()) return true;
        if (this.settings.trialWelcomeSeen || !isTrialEdition()) {
            ensureTrialStarted(this.app, this.settings, !!this.settings.trialWelcomeSeen);
        }
        syncLicenseState(this.app, this.settings);
        if (isAccessAllowed(this.app, this.settings)) return true;
        this.revealBrainCoreSidebar().catch(() => {});
        const now = Date.now();
        if (!this._lastLicenseNoticeAt || now - this._lastLicenseNoticeAt > 30000) {
            this._lastLicenseNoticeAt = now;
            const gate = getLicenseGateReason(this.app, this.settings);
            if (gate === "trial_expired") {
                bcNoticeWarn(`${getTrialHoursLabel()}试用已到期，请在 BrainCore 控制台输入激活码`);
            } else if (isTrialEdition() && !this.settings.trialWelcomeSeen) {
                bcNoticeInfo("请先点击「开始试用」或输入激活码");
            } else {
                bcNoticeWarn("请在右侧 BrainCore 控制台输入激活码");
            }
        }
        return false;
    }

    async promptActivateInConsole() {
        await this.revealBrainCoreSidebar();
        new Notice("请在右侧 BrainCore 控制台完成激活", 6000);
    }

    async handleBrainCoreDeepLink(action) {
        const a = String(action || "quick").toLowerCase();
        if (a === "open") {
            await this.activateView();
            return;
        }
        if (a === "capture") {
            if (!this.requireLicense()) return;
            new CaptureModal(this.app, this).open();
            return;
        }
        if (a === "capsule" || a === "voice" || a === "mic") {
            if (!this.requireLicense()) return;
            new SmartCapsuleModal(this.app, this).open();
            return;
        }
        if (a === "archive") {
            if (!this.requireLicense()) return;
            await this.archiveTasks();
            return;
        }
        if (a === "file-wall" || a === "filewall" || a === "recent" || a === "switcher") {
            await this.openFileWall();
            return;
        }
        // quick / tasks / default：立刻出快速面板（捕捉区优先渲染）
        if (!this.requireLicense()) return;
        new BrainCoreIOSQuickModal(this.app, this).open();
    }

    async clipUrlToMarkdown(url) {
        new Notice("🌐 正在抓取网页…");
        if (Platform.isMobileApp && !getDefuddleModule()) {
            new Notice("📱 移动端使用基础剪藏解析（无 Defuddle 全文引擎）", 6000);
        }
        let doc;

        try {
            ({ doc } = await fetchClipPageHtml(url));
        } catch (e) {
            const useEmbed = isLinkEmbedAvailable(this.app);
            new Notice(useEmbed ? "📎 抓取失败，已保存为 Link Embed 卡片" : "📎 抓取失败，已保存为 Markdown 摘要（建议安装 Link Embed 插件）", 7000);
            const meta = clipMetadataFromUrl(url);
            return {
                mode: useEmbed ? "embed" : "article",
                title: meta.title,
                markdown: useEmbed ? buildLinkEmbedBlock(meta, `正文抓取失败：${e.message || "网络错误"}`) : `# ${meta.title}\n\n> 原文：[${url}](${url})\n\n抓取失败：${e.message || "网络错误"}`,
                url,
                ...meta,
                clipError: e.message
            };
        }

        let article = null;
        try {
            article = await tryExtractArticle(doc, url);
        } catch (e) {
            console.warn("[BrainCore] 正文提取失败:", e);
        }

        // 优先保存为可读正文；仅在几乎无正文时才退化为 Link Embed 卡片
        if (article?.markdown && !isThinClipMarkdown(article.markdown, url)) {
            return { mode: "article", ...article, markdown: normalizeClipMarkdown(article.markdown) };
        }
        if (article?.markdown && article.markdown.trim().length >= 20) {
            bcNoticeWarn("正文较短，仍按原文结构保存", 5000);
            return { mode: "article", ...article, markdown: normalizeClipMarkdown(article.markdown) };
        }

        const meta = extractClipMetadata(doc, url, article || {});
        const reason = article ? "正文过短，已保存为 Link Embed 卡片" : "未能提取正文，已保存为 Link Embed 卡片";
        const useEmbed = isLinkEmbedAvailable(this.app);
        new Notice(useEmbed ? "📎 正文不可用，已保存为 Link Embed 卡片" : "📎 正文不可用，已保存为 Markdown 摘要", 7000);
        return {
            mode: useEmbed ? "embed" : "article",
            title: meta.title,
            markdown: useEmbed ? buildLinkEmbedBlock(meta, reason) : `# ${meta.title}\n\n> 原文：[${url}](${url})\n\n${reason}`,
            url,
            ...meta
        };
    }

    buildClippingFileContent(clipped, url, timeTag, userNote, sourceSuffix, options = {}) {
        const title = options.title || clipped.title;
        const category = options.category || "";
        const tags = options.tags || [];
        const reflectionPath = options.reflectionPath || "";
        const safeTitle = yamlQuote(title);
        const frontmatter = [
            `title: "${safeTitle}"`,
            `created: ${timeTag}`,
            `source: "${url}"`,
            "clipped: true",
            `clip_mode: ${clipped.mode || "article"}`
        ];
        if (category) frontmatter.push(`category: "${yamlQuote(category)}"`);
        const tagYaml = formatYamlTagList(tags);
        if (tagYaml) frontmatter.push(`tags: ${tagYaml}`);
        if (reflectionPath) frontmatter.push(`reflection: "[[${wikiLinkPath(reflectionPath)}]]"`);
        if (clipped.author) frontmatter.push(`author: "${yamlQuote(clipped.author)}"`);
        if (clipped.published) frontmatter.push(`published: "${yamlQuote(clipped.published)}"`);
        if (clipped.description) frontmatter.push(`description: "${yamlQuote(clipped.description)}"`);
        if (clipped.site) frontmatter.push(`site: "${yamlQuote(clipped.site)}"`);

        const blocks = [];
        if (clipped.mode === "embed") {
            blocks.push(clipped.markdown);
        } else {
            blocks.push(`# ${title}`, "", `> 原文：[${url}](${url})`, "", clipped.markdown);
        }
        if (userNote) blocks.push("", "---", "", "## 备注", "", userNote);
        if (reflectionPath) {
            blocks.push("", "---", "", "## 我的感悟", "", `→ [[${wikiLinkPath(reflectionPath)}]]`);
        }
        if (sourceSuffix && sourceSuffix.trim()) blocks.push("", sourceSuffix.trim());
        return `---\n${frontmatter.join("\n")}\n---\n\n${blocks.join("\n")}`;
    }

    buildClipReflectionContent(title, clipPath, reflectionText, timeTag, tags = []) {
        const frontmatter = [
            `title: "${yamlQuote(title + " · 感悟")}"`,
            `created: ${timeTag}`,
            `clip: "[[${wikiLinkPath(clipPath)}]]"`
        ];
        const tagYaml = formatYamlTagList(tags);
        if (tagYaml) frontmatter.push(`tags: ${tagYaml}`);
        return `---\n${frontmatter.join("\n")}\n---\n\n# ${title} · 感悟\n\n来自剪藏：[[${wikiLinkPath(clipPath)}]]\n\n${reflectionText}\n`;
    }

    async saveClipping(body, sourceSuffix = "") {
        if (!this.requireLicense()) return null;
        const url = extractFirstUrl(body);
        if (!url) {
            new Notice("请在输入框粘贴网页链接（http:// 或 https://）");
            return null;
        }
        const now = window.moment();
        const timeTag = now.format("YYYY-MM-DD HH:mm");
        const rootFolder = this.settings.pathClippings || "Inbox/Clippings";
        await ensureFolderByPath(this.app.vault, rootFolder);

        const userNote = String(body).replace(url, "").trim();
        const clipped = await this.clipUrlToMarkdown(url);

        const modal = new ClippingConfirmModal(this.app, this, {
            defaultTitle: clipped.title || "Clipped",
            url,
            defaultCategory: getClipCategories(this.settings)[0] || "科技"
        });
        modal.open();
        const confirm = await modal.waitForSubmit();
        if (!confirm) return null;

        const category = sanitizeClipCategoryName(confirm.category) || getClipCategories(this.settings)[0] || "科技";
        const title = String(confirm.title || clipped.title || "Clipped").trim() || "Clipped";
        const tags = Array.isArray(confirm.tags) ? confirm.tags : [];
        const reflectionText = String(confirm.reflection || "").trim();

        // 记住分类顺序：选中项置顶
        const cats = getClipCategories(this.settings).filter((c) => c !== category);
        this.settings.clipCategories = [category, ...cats];
        await this.saveSettings();

        const folder = `${rootFolder}/${category}`;
        await ensureFolderByPath(this.app.vault, folder);
        const fileName = `${clipStemFromTitle(title)}.md`;
        const filePath = await buildUniqueClipFilePath(this.app.vault, folder, fileName);

        let reflectionPath = "";
        if (reflectionText) {
            const reflectRoot = this.settings.pathClipReflections || "读&写/剪藏感悟";
            await ensureFolderByPath(this.app.vault, reflectRoot);
            const reflectName = `${clipStemFromTitle(title)}-感悟.md`;
            reflectionPath = await buildUniqueClipFilePath(this.app.vault, reflectRoot, reflectName);
        }

        const fileContent = this.buildClippingFileContent(clipped, url, timeTag, userNote, sourceSuffix, {
            title,
            category,
            tags,
            reflectionPath
        });
        await this.app.vault.create(filePath, fileContent);

        if (reflectionPath && reflectionText) {
            const reflectContent = this.buildClipReflectionContent(title, filePath, reflectionText, timeTag, tags);
            await this.app.vault.create(reflectionPath, reflectContent);
        }
        return filePath;
    }


    maybeShowUpdateNotice(onDismiss, force = false) {
        showUpdateNoticeModal(this.app, this, { force, onDismiss });
    }

    showUpdateNotice(force = false) {
        showUpdateNoticeModal(this.app, this, { force });
    }

    showUpdateNoticeForce() {
        this.showUpdateNotice(true);
    }

    async ensurePluginFolderByPath(path) {
        return ensureFolderByPath(this.app.vault, path);
    }

    resolveArchiveTargetFile() {
        const active = this.app.workspace.getActiveFile();
        if (active?.extension === "md") return active;
        const recent = this.app.workspace.getLastOpenFiles?.() || [];
        for (const p of recent) {
            if (!String(p).endsWith(".md")) continue;
            const f = this.app.vault.getAbstractFileByPath(p);
            if (f) return f;
        }
        for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
            const f = leaf.view?.file;
            if (f?.extension === "md") return f;
        }
        return null;
    }

    async openFileWall() {
        const wallPath = normalizePath(this.settings.pathMaterials || "Boxes/文件墙.md");
        const file = this.app.vault.getAbstractFileByPath(wallPath);
        if (file instanceof TFile) {
            await this.app.workspace.getLeaf(false).openFile(file);
            return;
        }
        new Notice(`未找到文件墙：${wallPath}`);
    }

    async archiveTasks() {
        if (!this.requireLicense()) return;
        const activeFile = this.resolveArchiveTargetFile();
        if (!activeFile || activeFile.extension !== 'md') {
            bcNoticeWarn("请先在任意编辑窗格打开包含待办的 Markdown 笔记", 8000);
            return;
        }

        const content = await this.app.vault.read(activeFile);
        const lines = content.replace(/\r\n/g, '\n').split('\n');
        
        const getIndent = (str) => {
            const match = str.match(/^(\s*)/);
            return match ? match[1].replace(/\t/g, '    ').length : 0;
        };

        let remainingLines = [];
        let archivedBlocks = [];
        let currentBlock = [];
        let capturing = false;
        let captureIndent = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const indent = getIndent(line);
            const isEmpty = line.trim() === '';

            if (capturing) {
                if (isEmpty) {
                    let hasChild = false;
                    for(let j = i + 1; j < lines.length; j++){
                        if(lines[j].trim() !== '') {
                            if(getIndent(lines[j]) > captureIndent) hasChild = true;
                            break;
                        }
                    }
                    if (hasChild) {
                        currentBlock.push(line);
                        continue;
                    } else {
                        archivedBlocks.push(currentBlock.join('\n'));
                        currentBlock = [];
                        capturing = false;
                        remainingLines.push(line);
                        continue;
                    }
                }

                if (indent > captureIndent) {
                    currentBlock.push(line);
                    continue;
                } else {
                        archivedBlocks.push(currentBlock.join('\n'));
                        currentBlock = [];
                        capturing = false;
                }
            }

            const taskMatch = line.match(/^(\s*)(?:[-*] |\d+\. )\[[xX]\] /);
            if (taskMatch) {
                capturing = true;
                captureIndent = getIndent(taskMatch[1]);
                currentBlock.push(line);
            } else {
                remainingLines.push(line);
            }
        }
        if (capturing) {
            archivedBlocks.push(currentBlock.join('\n'));
        }

        if (archivedBlocks.length === 0) {
            new Notice("📭 没找到已完成的待办任务 (- [x])");
            return;
        }

        await this.app.vault.modify(activeFile, remainingLines.join('\n'));

        let archivePath = "归档/待办归档.md"; 
        if (activeFile.path === this.settings.pathIdeas || activeFile.basename === "Ideas") {
            archivePath = "归档/闪念归档.md";
        } else if (activeFile.path === this.settings.pathDrafts || activeFile.basename === "草稿") {
            archivePath = "归档/草稿归档.md";
        } else if (activeFile.path === this.settings.pathTasks || activeFile.basename === "Tasks") {
            archivePath = "归档/待办归档.md";
        }

        const folderPath = archivePath.substring(0, archivePath.lastIndexOf('/'));
        if (folderPath) {
            const folders = folderPath.split('/');
            let currentPath = '';
            for(let f of folders) {
                currentPath += (currentPath === '' ? f : '/' + f);
                if (!this.app.vault.getAbstractFileByPath(currentPath)) {
                    await this.app.vault.createFolder(currentPath);
                }
            }
        }
        
        let archiveFile = this.app.vault.getAbstractFileByPath(archivePath);
        if (!archiveFile) archiveFile = await this.app.vault.create(archivePath, "");
        
        let archContent = await this.app.vault.read(archiveFile);
        let aLines = archContent.replace(/\r\n/g, '\n').split('\n');
        
        const now = window.moment();
        const yearH = `# ${now.format("YYYY年")}`;
        const monthH = `## ${now.format("MM月")}`;
        const weekStart = now.clone().startOf('isoWeek').format("M月D日");
        const weekEnd = now.clone().endOf('isoWeek').format("M月D日");
        const weekH = `### 第${now.isoWeek()}周 (${weekStart}-${weekEnd})`;

        const blocksStr = archivedBlocks.join('\n');
        
        let yIdx = aLines.findIndex(l => l.trim() === yearH);
        if (yIdx === -1) {
            aLines.push("", yearH, monthH, weekH, blocksStr);
        } else {
            let mIdx = -1;
            for (let i = yIdx + 1; i < aLines.length; i++) {
                if (aLines[i].trim() === monthH) { mIdx = i; break; }
                if (aLines[i].startsWith("# ")) break;
            }
            if (mIdx === -1) {
                aLines.splice(yIdx + 1, 0, monthH, weekH, blocksStr);
            } else {
                let wIdx = -1;
                for (let i = mIdx + 1; i < aLines.length; i++) {
                    if (aLines[i].trim() === weekH) { wIdx = i; break; }
                    if (aLines[i].startsWith("## ")) break;
                }
                if (wIdx === -1) {
                    aLines.splice(mIdx + 1, 0, weekH, blocksStr);
                } else {
                    let insertIdx = wIdx + 1;
                    while(insertIdx < aLines.length && !aLines[insertIdx].startsWith('#')) {
                        insertIdx++;
                    }
                    aLines.splice(insertIdx, 0, blocksStr);
                }
            }
        }
        
        await this.app.vault.modify(archiveFile, aLines.join('\n'));
        new Notice(`完美归档：成功流转 ${archivedBlocks.length} 项主任务及关联子节点！\n归档位置: ${archivePath.split('/').pop()}`);
        
        this.app.workspace.trigger("braincore:refresh");
    }

    async ensureDefaultVaultStructure(quiet = false) {
        const s = this.settings;
        const archivePaths = ["归档/待办归档.md", "归档/闪念归档.md", "归档/草稿归档.md"];
        const filePaths = [s.pathIdeas, s.pathTasks, s.pathDrafts, s.pathEssays, ...archivePaths].filter(Boolean);
        const folderList = [
            "Inbox", "Work", "Boxes", "Boxes/附件", "读&写", "归档",
            s.pathWork, s.pathClippings, s.pathClipReflections || "读&写/剪藏感悟", s.pathAttachments || "Boxes/附件",
            ...filePaths.map(p => p.substring(0, p.lastIndexOf("/"))).filter(f => f.length > 0),
        ];
        const folders = [...new Set(folderList.filter(Boolean))];

            if (!quiet) bcNoticeInfo("初始化基础目录与文件树...");
            
        const ensureFolder = async (folder) => {
            const parts = String(folder).split("/").filter(Boolean);
            let cur = "";
            for (const part of parts) {
                cur += (cur === "" ? part : "/" + part);
                    if (!this.app.vault.getAbstractFileByPath(cur)) { 
                    try { await this.app.vault.createFolder(cur); } catch (e) { /* exists / race */ }
                    }
                }
        };
        for (const folder of folders) await ensureFolder(folder);
            
            const createIfMissing = async (path, content) => {
                if (path && !this.app.vault.getAbstractFileByPath(path)) {
                    await this.app.vault.create(path, content);
                }
            };

        await createIfMissing(s.pathIdeas, "## 💡 闪念记录\n\n");
        await createIfMissing(s.pathTasks, "## ✅ 待办\n\n");
        await createIfMissing(s.pathDrafts, "## ✍️ 随手草稿\n\n");
        await createIfMissing(s.pathEssays, "## 📝 随笔\n\n");
            await createIfMissing("归档/待办归档.md", "## 📦 归档记录\n\n");
            await createIfMissing("归档/闪念归档.md", "## 📦 归档记录\n\n");
            await createIfMissing("归档/草稿归档.md", "## 📦 归档记录\n\n");
            
        if (!s.habitsConfig || s.habitsConfig.length === 0) {
            s.habitsConfig = [
                { id: "reading", n: "阅读", i: "📖" },
                { id: "fitness", n: "健身", i: "🏋️" },
                { id: "sleep", n: "早睡", i: "😴" },
            ];
        }

        await this.saveSettings();
        if (!quiet) bcNoticeSuccess("环境已就绪！Inbox、Work、Boxes 等默认结构已创建。");
    }

    async ensureBasicStructure(options = {}) {
        const { quiet = false } = options || {};
        await this.ensureDefaultVaultStructure(quiet);
    }

    async migrateOldHabitData() {
        const oldPath = "Scripts/habit-data.json";
        if (this.app.vault.getAbstractFileByPath(oldPath)) {
            try {
                const oldContent = await this.app.vault.adapter.read(oldPath);
                const oldData = JSON.parse(oldContent);
                this.settings.habitData = Object.assign({}, oldData, this.settings.habitData);
                await this.saveSettings();
                await this.app.vault.adapter.rename(oldPath, "Scripts/habit-data.bak.json");
                new Notice("历史打卡已迁移！");
            } catch (e) {
                bcNoticeError("历史打卡迁移失败", e);
            }
        }
    }

    // 🟢 周工作模板（区块名可在设置中自定义）
    async generateWeeklyContentStr(mondayObj) {
        const baseWorkPath = this.settings.pathWork.replace(/\/$/, '');
        const sec = getWeeklySectionNames(this.settings);
        let taskOutput = "- [ ] \n- [ ] ";
        const getWeekInfo = (m) => { let y = m.year(); let mon = m.month()+1; const w = m.isoWeek().toString().padStart(2, '0'); if (w === '01' && mon === 12) { y += 1; mon = 1; } const fn = `WK${w} ${m.format('M月D日')} – ${m.clone().add(6, 'days').format('M月D日')}`; return { dir: `${baseWorkPath}/${y}/${mon}月`, fn: fn }; };
        const p = getWeekInfo(mondayObj.clone().subtract(7, 'days')); const n = getWeekInfo(mondayObj.clone().add(7, 'days'));
        let content = `---\ncssclasses: braincore-weekly\n---\n\n<div class="bc-weekly-nav-wrapper"><div class="bc-weekly-nav-container"><a class="internal-link" href="${p.dir}/${p.fn}">&lt; 上周</a><span>·</span><strong>本周</strong><span>·</span><a class="internal-link" href="${n.dir}/${n.fn}">次周 &gt;</a></div></div>\n\n`;
        if (PLUGIN_WEEKLY_PROFILE === "commercial") {
            content += `## ${sec.todo}\n${taskOutput}\n\n---\n## **${sec.meeting}**\n1. \n2. \n\n---\n## *${sec.daily}*\n`;
            const dayNames = ['周一','周二','周三','周四','周五','周六','周日'];
            for(let i=0; i<7; i++) { content += `### @${mondayObj.clone().add(i, 'days').format('YYYY/MM/DD')} ${dayNames[i]}\n1. \n2. \n\n`; }
            content += `---\n## ***${sec.weekly}***\n### 高光时刻\n1. \n\n### 反思与改进\n1. \n\n### 下周计划\n1. \n\n`;
        } else {
            content += `## ${sec.todo}\n${taskOutput}\n\n---\n## **${sec.meeting}**\n1. \n2. \n\n---\n## ***${sec.weekly}***\n### 总\n1. \n\n### 总部\n1. \n\n### 省区\n1. \n\n---\n## *${sec.daily}*\n`;
            const dayNames = ['周一','周二','周三','周四','周五','周六','周日'];
            for(let i=0; i<7; i++) { content += `### @${mondayObj.clone().add(i, 'days').format('YYYY/MM/DD')} ${dayNames[i]}\n1. \n2. \n\n`; }
        }
        return content;
    }

    // 🚀 核心修改2：新增独立的时间流自动迁移机制，只在真实系统时间跨周时被唤醒触发
    async autoMigrateWeeklyTasks(nowObj) {
        const moment = window.moment;
        const thisMonday = nowObj.clone().startOf('isoWeek');
        const prevMonday = thisMonday.clone().subtract(7, 'days');
        const getWkFile = (m) => {
            const wk = m.isoWeek().toString().padStart(2, '0');
            let y = m.year(); let mon = m.month() + 1;
            if (wk === '01' && mon === 12) { y += 1; mon = 1; }
            const baseWorkPath = this.settings.pathWork.replace(/\/$/, '');
            const wkReg = new RegExp(`^WK${wk}(\\D|$)`);
return this.app.vault.getFiles().find(f =>
    f.path.startsWith(baseWorkPath) &&
    f.path.includes(`/${y}/`) &&
    wkReg.test(f.basename)
);
        };
        const prevFile = getWkFile(prevMonday);
        if (!prevFile) return;
        const oldContent = await this.app.vault.read(prevFile);
        const sectionTodo = getWeeklySectionNames(this.settings).todo;
        const todoRegex = new RegExp(`((?:##\\s*${escapeRegex(sectionTodo)})\\n)([\\s\\S]*?)(\\n---|## |$)`);
        const match = oldContent.match(todoRegex);
        let carriedTasks = [];
        if (!match) return;
        let lines = match[2].split('\n'); let remainingLines = [];
        for (let line of lines) {
            if (/^-\s*\[[ \/>?!]\]/.test(line)) {
                if (line.replace(/^-\s*\[[ \/>?!]\]\s*/, '').trim() !== "") { carriedTasks.push(line); }
                else { remainingLines.push(line); }
            } else { remainingLines.push(line); }
        }
        if (carriedTasks.length === 0) {
            // 无遗留待办也要生成本周模板（跨周可见空周文件，而不是只在导航里挂死链）
            if (!getWkFile(thisMonday)) await this.getOrCreateWeeklyWorkFile(nowObj);
            return;
        }
        let thisFile = getWkFile(thisMonday);
        if (!thisFile) thisFile = await this.getOrCreateWeeklyWorkFile(nowObj);
        if (!thisFile) return;
        await this.app.vault.modify(prevFile, oldContent.replace(todoRegex, `$1${remainingLines.join('\n')}\n`));
        const newContent = await this.app.vault.read(thisFile);
        const newMatch = newContent.match(todoRegex);
        if (newMatch) {
            let combined = carriedTasks.join('\n') + '\n' + newMatch[2];
            combined = combined.replace(/(-\s*\[ \]\s*\n)+/g, '- [ ] \n');
            await this.app.vault.modify(thisFile, newContent.replace(todoRegex, `$1${combined}\n$3`));
            new Notice(`跨周啦！已自动将上周 ${carriedTasks.length} 个未完成待办平移至本周。可在本周 Work 文件中查看。`, 8000);
        }
    }

    async populateWeeklyFile(file) {
        const match = file.name.match(/WK\d{2}\s(\d{1,2})月(\d{1,2})日/); if (!match) return;
        const pathParts = file.path.split('/'); let year = new Date().getFullYear();
        if (pathParts.length >= 3) { const possibleYear = parseInt(pathParts[pathParts.length - 3]); if (!isNaN(possibleYear)) year = possibleYear; }
        const targetMonday = window.moment([year, parseInt(match[1]) - 1, parseInt(match[2])]);
        await this.app.vault.modify(file, await this.generateWeeklyContentStr(targetMonday)); new Notice("✨ 已自动补全工作模板！");
    }

    findWeeklyWorkFile(nowObj) {
        const moment = window.moment;
        const monday = nowObj.clone().startOf('isoWeek');
        const sunday = nowObj.clone().endOf('isoWeek');
        const wk = nowObj.isoWeek().toString().padStart(2, '0');
        let targetDirYear = monday.year();
        let targetDirMonth = monday.month() + 1;
        if (wk === '01' && targetDirMonth === 12) { targetDirYear += 1; targetDirMonth = 1; }
        const baseWorkPath = this.settings.pathWork.replace(/\/$/, '');
        const folderPath = `${baseWorkPath}/${targetDirYear}/${targetDirMonth}月`;
        const fullPath = `${folderPath}/WK${wk} ${monday.format('M月D日')} – ${sunday.format('M月D日')}.md`;
        const direct = this.app.vault.getAbstractFileByPath(fullPath);
        if (direct) return direct;
        const weekFileReg = new RegExp(`^WK${wk}(\\D|$)`);
        return this.app.vault.getFiles().find(f =>
            f.path.startsWith(baseWorkPath) &&
            f.path.includes(`/${targetDirYear}/`) &&
            weekFileReg.test(f.basename)
        ) || null;
    }

    async getOrCreateWeeklyWorkFile(nowObj) {
        const existing = this.findWeeklyWorkFile(nowObj);
        if (existing) return existing;
        const moment = window.moment; const monday = nowObj.clone().startOf('isoWeek'); const sunday = nowObj.clone().endOf('isoWeek'); const wk = nowObj.isoWeek().toString().padStart(2, '0');
        let targetDirYear = monday.year(); let targetDirMonth = monday.month() + 1; if (wk === '01' && targetDirMonth === 12) { targetDirYear += 1; targetDirMonth = 1; }
        const baseWorkPath = this.settings.pathWork.replace(/\/$/, ''); const folderPath = `${baseWorkPath}/${targetDirYear}/${targetDirMonth}月`; const fullPath = `${folderPath}/WK${wk} ${monday.format('M月D日')} – ${sunday.format('M月D日')}.md`;
        const file = this.app.vault.getAbstractFileByPath(fullPath); if (file) return file;
        const folders = folderPath.split('/'); let currentPath = '';
        for(let f of folders) { currentPath += (currentPath === '' ? f : '/' + f); if (!this.app.vault.getAbstractFileByPath(currentPath)) await this.app.vault.createFolder(currentPath); }
        new Notice("✨ 正在自动生成模板并流转待办！"); return await this.app.vault.create(fullPath, await this.generateWeeklyContentStr(monday));
    }

    async loadSettings() { 
        const loaded = await this.loadData(); 
        this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded); 
        if (!this.settings.modules || this.settings.modules.length === 0) this.settings.modules = DEFAULT_SETTINGS.modules.map(m => ({...m})); 
        if (!this.settings.weatherCoordsCustom) {
            const lat = parseFloat(this.settings.defaultLat);
            const lon = parseFloat(this.settings.defaultLon);
            if (Number.isFinite(lat) && Number.isFinite(lon)
                && (Math.abs(lat - 31.81) > 0.01 || Math.abs(lon - 119.97) > 0.01)) {
                this.settings.weatherCoordsCustom = true;
            }
        }
        if (!this.settings.habitsConfig || this.settings.habitsConfig.length === 0) {
            this.settings.habitsConfig = DEFAULT_SETTINGS.habitsConfig.map(m => ({...m}));
        }
        if (!Array.isArray(this.settings.clipCategories) || !this.settings.clipCategories.length) {
            this.settings.clipCategories = [...DEFAULT_CLIP_CATEGORIES];
        } else {
            this.settings.clipCategories = getClipCategories(this.settings);
        }
        if (!this.settings.pathClipReflections) {
            this.settings.pathClipReflections = DEFAULT_SETTINGS.pathClipReflections;
        }
        if (this.settings.modules) {
            this.settings.modules.forEach(m => {
                if (m.id === "tasks" && m.name === "本周待办列表") m.name = "待办总览";
            });
        }
        if (isTrialEdition() && this.settings.trialStartedAt && !this.settings.trialWelcomeSeen) {
            this.settings.trialWelcomeSeen = true;
        }
        const wasActivated = !!this.settings.licenseActivated;
        const hadTrialStart = !!this.settings.trialStartedAt;
        if (isTrialEdition() && this.settings.trialWelcomeSeen) {
            ensureTrialStarted(this.app, this.settings, true);
        }
        syncLicenseState(this.app, this.settings);
        if ((this.settings.licenseActivated && !wasActivated) || (this.settings.trialStartedAt && !hadTrialStart) || (isTrialEdition() && this.settings.trialWelcomeSeen && !hadTrialStart)) {
            await this.saveSettings();
        }
    }
    
    async saveSettings() { await this.saveData(this.settings); }

    initTodayRenameRegistry() {
        const momentFn = window.moment;
        this._todayRenameDate = momentFn ? momentFn().format("YYYY-MM-DD") : new Date().toISOString().slice(0, 10);
        this._todayRenames = [];
        this.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
            const today = momentFn ? momentFn().format("YYYY-MM-DD") : new Date().toISOString().slice(0, 10);
            if (today !== this._todayRenameDate) {
                this._todayRenameDate = today;
                this._todayRenames = [];
            }
            if (!oldPath || !file?.path || oldPath === file.path) return;
            this._todayRenames.push({ from: oldPath, to: file.path });
        }));
    }

    getVaultFilesCached(maxAgeMs = 5000) {
        const cache = this._vaultFilesCache;
        if (cache && Array.isArray(cache.files) && Date.now() - (cache.ts || 0) < maxAgeMs) {
            return cache.files;
        }
        const files = this.app.vault.getFiles() || [];
        this._vaultFilesCache = { ts: Date.now(), files };
        return files;
    }

    getTodayRenames() {
        const momentFn = window.moment;
        const today = momentFn ? momentFn().format("YYYY-MM-DD") : new Date().toISOString().slice(0, 10);
        if (today !== this._todayRenameDate) {
            this._todayRenameDate = today;
            this._todayRenames = [];
        }
        return Array.isArray(this._todayRenames) ? this._todayRenames.slice() : [];
    }
    
    onunload() { 
        if (this._stopRightSidebarGuard) this._stopRightSidebarGuard();
        const style = document.getElementById("bc-styles-min"); if (style) style.remove(); 
        delete window.BrainCoreAPI;
        delete window.toggleWkTask;
        delete window.statAction;
        delete window.BrainCoreTodayDeltaFiles;
    }
    
    async activateView(options = {}) {
        const { pin = false, exclusive = false } = options || {};
        if (exclusive) {
            await this.forceExclusiveBrainCoreSidebar();
            return;
        }
        const { workspace } = this.app;
        const rightSplit = workspace.rightSplit;
        if (rightSplit?.collapsed) rightSplit.expand();

        let leaf = workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD)[0];
        if (!leaf) {
            leaf = workspace.getRightLeaf(false);
            await leaf.setViewState({ type: VIEW_TYPE_DASHBOARD, active: true });
        } else {
            const state = leaf.getViewState();
            if (state.type !== VIEW_TYPE_DASHBOARD) {
                await leaf.setViewState({ type: VIEW_TYPE_DASHBOARD, active: true });
            }
        }

        await workspace.revealLeaf(leaf);
        workspace.setActiveLeaf(leaf, { focus: false });
        if (pin) this.pinDashboardLeaf(leaf);
        if (isTrialEdition() && !this.settings.trialWelcomeSeen && !this.settings.licenseActivated) {
            this.maybeShowTrialWelcomeModal();
        }
    }

    injectDashboardStyles() {
        let styleEl = document.getElementById("bc-styles-min");
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "bc-styles-min";
            document.head.appendChild(styleEl);
        }
        const colorTodo = this.settings.colorTodo || DEFAULT_SETTINGS.colorTodo;
        const colorMeeting = this.settings.colorMeeting || DEFAULT_SETTINGS.colorMeeting;
        const colorWeekly = this.settings.colorWeekly || DEFAULT_SETTINGS.colorWeekly;
        const colorDaily = this.settings.colorDaily || DEFAULT_SETTINGS.colorDaily;

        styleEl.textContent = `.workspace-leaf-content[data-type="braincore-dashboard-view"] .view-content,.bc-dashboard-view-content{height:100%!important;max-height:100%!important;overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch!important;scrollbar-width:none!important;-ms-overflow-style:none!important;overscroll-behavior:contain}.workspace-leaf-content[data-type="braincore-dashboard-view"] .view-content::-webkit-scrollbar,.bc-dashboard-view-content::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}.bc-dashboard-view-content:not(.lifeos-act-panel){padding:0!important}.bc-dashboard-view-content.lifeos-act-panel{padding:var(--lifeos-sidebar-inset,10px) var(--lifeos-sidebar-inset,10px) 18px!important;box-sizing:border-box!important}.sb-container{display:flex;flex-direction:column;width:100%!important;padding:var(--lifeos-sidebar-inset,10px) var(--lifeos-sidebar-inset,10px) 28px!important;margin:0!important;box-sizing:border-box;overflow:visible!important;min-height:auto!important;-webkit-user-select:none;user-select:none;flex-shrink:0}.sb-quote-container{overflow:visible!important;flex-shrink:0;width:100%}.sb-module-gap{height:0!important;margin:7px 0!important;border:none!important;padding:0!important;background:transparent!important}.sb-divider{border:none!important;height:0!important;background:transparent!important;margin:10px 0!important;opacity:0;padding:0!important;flex-shrink:0}.sb-hero-block{display:flex;flex-direction:column;gap:8px;width:100%;padding:0!important;margin:0!important;border-radius:0;box-sizing:border-box;background:transparent!important;border:none!important;cursor:pointer}.sb-hero-block:hover{background:transparent!important;border:none!important}.sb-hero-block:focus-visible{outline:2px solid color-mix(in srgb,var(--lifeos-accent,#b48246) 45%,transparent);outline-offset:2px}.sb-hero-block .sb-header{padding:0!important;margin:0!important}.sb-hero-block .sb-prog-grid{margin-top:2px!important;margin-bottom:0!important}.sb-hero-block .sb-quote-container{margin:0!important}.sb-hero-block .sb-quote-wrap{margin:6px 2px 0!important}.sb-header{text-align:center;padding:0!important;margin:0!important}.sb-greet{font-size:1.5em;font-weight:900;color:#6b5b4d;margin-bottom:0!important}.sb-date{font-size:1em;color:var(--text-muted);margin-bottom:0!important}.sb-weather-box{font-size:.9em;color:#6b5b4d;opacity:.8;margin-bottom:0!important}.sb-prog-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:4px 14px!important;margin-top:5px!important;margin-bottom:2px!important;width:100%!important}.sb-prog-item{display:flex!important;justify-content:flex-start!important;width:100%!important;margin:0!important;padding:0!important;background:transparent;border:none;min-width:0;overflow:hidden!important}.sb-item-inner{width:100%;display:flex;flex-direction:column}.sb-prog-txt{display:flex!important;justify-content:space-between!important;align-items:baseline!important;width:100%!important;margin-bottom:4px!important;white-space:nowrap!important}.sb-prog-label{font-weight:900;color:#6b5b4d;font-size:1.05em!important}.sb-prog-left{color:var(--text-muted);font-weight:600;font-size:.82em!important}.sb-pixel-bar{width:100%;height:6px;background:repeating-linear-gradient(to right,rgba(107,91,77,0.15) 0,rgba(107,91,77,0.15) 5px,transparent 5px,transparent 7px)}.sb-pixel-bar-fill{height:100%;background:repeating-linear-gradient(to right,var(--text-accent) 0,var(--text-accent) 5px,transparent 5px,transparent 7px);transition:width 0.3s ease}.sb-btn-wrapper{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:6px!important;padding:0!important;margin:3px 0!important}.sb-btn{display:flex;flex-direction:column;align-items:center;cursor:pointer;margin:0!important}.sb-btn-box{width:100%;aspect-ratio:1/1;max-width:52px;background:rgba(107,91,77,.06);border:1px solid rgba(107,91,77,.13);border-radius:14px;display:flex;align-items:center;justify-content:center;transition:all .2s;margin:0!important}.sb-btn-box:active{transform:scale(.92);background:rgba(107,91,77,.12)}.sb-btn-box svg{width:22px;height:22px;stroke:#6b5b4d;stroke-width:2.2px;fill:none}.sb-btn-name{margin-top:2px!important;font-size:11px;color:#6b5b4d;font-weight:600}.sb-habit-row{display:flex;align-items:center;margin-bottom:3px!important;justify-content:space-between;padding:0 4px}.sb-habit-label{width:50px;font-size:13px!important;font-weight:700;margin:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.sb-habit-grid{display:flex;gap:6px;flex:1;justify-content:center;margin:0!important}.sb-habit-day-txt{width:22px;text-align:center;font-size:14px!important;color:var(--text-muted);font-weight:800;margin:0!important}.sb-habit-day-txt.is-today{color:#d67272!important;font-weight:900!important}.sb-box.is-today{border:1.5px solid rgba(214,114,114,.55)!important;box-shadow:0 0 0 1px rgba(214,114,114,.12)}.sb-box.is-today.checked{border:none!important;box-shadow:0 0 5px var(--text-accent)}.sb-box{transition:transform .12s ease;width:22px;height:22px;border-radius:6px;background:var(--background-modifier-border);cursor:pointer;border:1px solid rgba(0,0,0,.05);margin:0!important}.sb-box:active{transform:scale(.92)}.sb-box.checked{background:var(--text-accent);border:none;box-shadow:0 0 5px var(--text-accent)}.sb-habit-streak{width:auto;min-width:28px;font-size:11px!important;color:var(--text-muted);text-align:right;font-weight:800;margin:0!important;white-space:nowrap;flex-shrink:0}.sb-sec-title-row{display:flex;align-items:center;gap:6px;margin:3px 6px 2px!important;padding:0!important}.sb-sec-title{font-size:1.1em;font-weight:800;color:#6b5b4d;letter-spacing:.5px;margin:0!important;padding:0!important}.sb-tip-icon{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;font-size:12px;font-weight:800;color:var(--text-muted);background:color-mix(in srgb, var(--lifeos-accent, #b48246) 12%, transparent);cursor:pointer;flex-shrink:0;line-height:1;-webkit-tap-highlight-color:transparent}.sb-tip-icon:active{opacity:.7;background:color-mix(in srgb, var(--lifeos-accent, #b48246) 20%, transparent)}.bc-dashboard-view-content.bc-activate-mode{display:flex!important;align-items:center!important;justify-content:center!important;min-height:100%!important;box-sizing:border-box!important}.bc-activate-wrap{padding:16px 12px;display:flex;justify-content:center;align-items:center;width:100%;box-sizing:border-box}.bc-activate-card{width:100%;max-width:280px;display:flex;flex-direction:column;align-items:stretch;gap:10px;box-sizing:border-box}.bc-activate-title{margin:0;font-size:16px;font-weight:800;text-align:center;color:var(--text-normal);line-height:1.3}.bc-activate-hint,.bc-activate-sub{margin:0;font-size:11px;line-height:1.45;color:var(--text-muted);text-align:center}.bc-inline-fp-readonly,.bc-inline-license-input{width:100%;box-sizing:border-box;padding:8px 10px;border-radius:8px;font-size:13px;text-align:center;margin:0}.bc-inline-fp-readonly{font-family:monospace;font-weight:700;color:var(--text-accent);border:1px dashed var(--background-modifier-border);background:var(--background-primary)}.bc-inline-license-input{border:1px solid var(--background-modifier-border);background:var(--background-primary);font-weight:600;color:var(--text-normal)}.bc-inline-copy-fp-btn,.bc-inline-activate-btn{width:100%;padding:8px;border-radius:8px;font-weight:700;font-size:13px;margin:0}.bc-activate-actions{display:flex;flex-direction:column;align-items:stretch;gap:6px;margin-top:4px;width:100%}.bc-open-guide-btn,.bc-open-settings-btn{width:100%;font-size:12px;padding:8px 0;border:none;background:transparent;color:var(--text-muted);cursor:pointer;text-decoration:none;line-height:1.4;text-align:center;border-radius:6px}.bc-open-guide-btn{color:var(--text-accent);font-weight:600;background:color-mix(in srgb, var(--lifeos-accent, #b48246) 6%, transparent)}.bc-open-settings-btn{text-decoration:underline}.bc-inline-license-status{min-height:16px;font-size:11px;text-align:center;color:var(--text-muted)}.sb-task-list{display:flex!important;flex-direction:column!important;gap:2px!important;padding:0 6px 4px!important;margin:0!important;scroll-behavior:smooth;-webkit-overflow-scrolling:touch}.sb-task-list::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}.sb-task-item{display:flex!important;align-items:flex-start!important;padding:1px 0!important;margin:0!important;background:0 0!important;flex-shrink:0;transition:transform .2s ease,opacity .2s ease}@media (hover:hover){.sb-task-item:hover{transform:translateX(2px);opacity:.8}}.sb-task-item:active{opacity:.5}.sb-task-checkbox{width:15px!important;height:15px!important;border:1.5px solid rgba(107,91,77,.53)!important;border-radius:4px!important;margin-right:12px!important;margin-top:4px!important;margin-bottom:0!important;flex-shrink:0;cursor:pointer;transition:all .2s}@media (hover:hover){.sb-task-checkbox:hover{background:var(--text-accent)!important;border-color:var(--text-accent)!important;box-shadow:0 0 4px var(--text-accent)!important}}.sb-task-text{font-size:.95em!important;color:var(--text-normal)!important;font-weight:500!important;line-height:1.4!important;margin:0!important;padding:0!important;word-break:break-all;cursor:pointer;flex:1;opacity:.95}.sb-task-children{margin:0 0 2px 0!important;padding:0 0 0 20px!important;border-left:1.5px solid color-mix(in srgb, var(--lifeos-accent, #b48246) 18%, transparent)!important}
.sb-task-children .sb-task-text{font-size:.88em!important;opacity:.92}
.sb-task-children .sb-task-children .sb-task-text{font-size:.84em!important;opacity:.88}.sb-quote-wrap{padding:4px 0 2px 12px!important;background:0 0;border-left:3.5px solid color-mix(in srgb, var(--lifeos-accent, #b48246) 42%, transparent);margin:6px 2px 0!important;position:relative}.sb-quote-content{font-size:.92em;line-height:1.75;letter-spacing:.02em;color:#6b5b4d;font-weight:500;margin-bottom:2px!important;margin-top:0!important;text-align:justify;-webkit-user-select:text;user-select:text;transition:opacity .12s ease}.sb-quote-src{font-size:.78em;color:var(--text-muted);text-align:right;font-weight:600;opacity:.55;margin:0!important;letter-spacing:.01em}.sb-quote-wrap.is-cycling .sb-quote-content,.sb-quote-wrap.is-cycling .sb-quote-src{opacity:.35}.sb-empty-state{text-align:center;font-size:13px;color:var(--text-muted);margin:2px 0!important;padding:12px 8px}.sb-stat-item-wrap{display:flex;justify-content:space-between;align-items:center;padding:2px 8px;border-radius:6px;cursor:pointer;transition:all .2s cubic-bezier(.25,.8,.25,1)}@media (hover:hover){.sb-stat-item-wrap:hover{background:color-mix(in srgb, var(--lifeos-accent, #b48246) 8%, transparent);transform:translateY(-1px)}}.sb-stat-item-wrap:active{transform:scale(.95);background:color-mix(in srgb, var(--lifeos-accent, #b48246) 12%, transparent)}.sb-stat-total-row{align-items:flex-end;margin-bottom:0!important;margin-top:0!important}.sb-stat-table{width:100%!important;border-collapse:collapse;border:none;margin-bottom:2px!important;margin-top:0!important}.sb-stat-cell{border:none!important;padding:0!important}.sb-stat-val{color:var(--text-accent);font-weight:800;font-size:16px!important;pointer-events:none}.sb-stat-item-wrap span:first-child{font-size:14px!important;color:var(--text-muted);pointer-events:none}
        ${buildWeeklyTemplateStyleBlock({ colorTodo, colorMeeting, colorWeekly, colorDaily }, getWeeklySectionNames(this.settings))}
        @media (min-width:480px){.sb-module-gap{height:0!important;margin:7px 0!important;border:none!important;padding:0!important;background:transparent!important}.sb-divider{border:none!important;height:0!important;background:transparent!important;margin:6px 4px!important}.sb-prog-grid{margin-top:7px!important;margin-bottom:3px!important}.sb-btn-wrapper{margin:4px 0!important}.sb-sec-title{margin:4px 6px 2px!important}.sb-task-list{padding:0 6px 4px!important}.sb-quote-wrap{margin:6px 4px!important}}
        @media (max-width:479px){.sb-habit-row{padding:0 2px!important;margin-bottom:6px!important}.sb-habit-label{width:54px!important;font-size:13px!important}.sb-habit-grid{gap:10px!important}.sb-habit-day-txt{width:28px!important;font-size:15px!important}.sb-box{transition:transform .12s ease;width:28px!important;height:28px!important;border-radius:7px!important}.sb-habit-streak{min-width:34px!important;font-size:12px!important}}.theme-dark .sb-greet,.theme-dark .sb-weather-box,.theme-dark .sb-prog-label,.theme-dark .sb-btn-name,.theme-dark .sb-sec-title,.theme-dark .sb-quote-content,.theme-dark .sb-date{color:var(--text-normal)!important}.theme-dark .sb-btn-box svg{stroke:var(--text-muted)!important}.theme-dark .sb-btn-box,.theme-dark .sb-tip-icon,.theme-dark .sb-task-checkbox,.theme-dark .sb-quote-wrap,.theme-dark .sb-task-children,.theme-dark .bc-open-guide-btn{border-color:color-mix(in srgb,var(--lifeos-accent,#d4a574) 28%,transparent)!important}.theme-dark .sb-quote-wrap{border-left-color:color-mix(in srgb,var(--lifeos-accent,#d4a574) 45%,transparent)!important}.theme-dark .sb-hero-block{background:transparent!important;border:none!important}.theme-dark .sb-box{transition:transform .12s ease;border-color:var(--background-modifier-border)!important}.theme-dark .sb-stat-item-wrap:hover,.theme-dark .sb-stat-item-wrap:active{background:color-mix(in srgb,var(--lifeos-accent,#d4a574) 14%,transparent)!important}.theme-dark .braincore-weekly .bc-weekly-nav-container span{color:var(--text-muted)!important;opacity:1!important}.theme-dark .bcq-tip-icon,.theme-dark .bcq-task-children{border-color:var(--background-modifier-border)!important;color:var(--text-muted)!important}`;
    }
}

module.exports = BrainCorePlugin;
