import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");

test("legacy plugin migration quarantines instead of deleting unverified dirs", () => {
  const source = read("main.source.js");
  assert.equal(/adapter\.rmdir\(legacyDir,\s*true\)/.test(source), false);
  assert.match(source, /quarantineDir/);
  assert.match(source, /appendMigrationLog/);
  assert.match(source, /README-braincore-migration/);
});

test("reloadAll coalesces overlapping scans", () => {
  const store = read("src/moments-memoria/store.ts");
  assert.match(store, /reloadAllPending/);
  assert.match(store, /do \{/);
  assert.match(store, /while \(this\.reloadAllPending\)/);
});

test("attachment cleanup checks metadata cache and non-markdown files", () => {
  const store = read("src/moments-memoria/store.ts");
  assert.match(store, /metadataCache\.getFileCache/);
  assert.match(store, /canvas/);
  assert.match(store, /excalidraw/);
});

test("share preview click does not copy, and user ellipsis is kept", () => {
  const share = read("src/moments-memoria/share.ts");
  assert.match(share, /previewWrapEl\.addEventListener\("click", \(\) => \{\s*void this\.previewImage\(\);/s);
  assert.equal(share.includes("replace(/\\n[ \\t]*(?:\\.{3,}|…{2,})"), false);
  assert.match(share, /waitForShareImage/);
  assert.match(share, /MULTI_SHARE_PAGE_SIZE/);
  assert.match(share, /preferenceKey/);
  assert.match(share, /styleId: this\.selectedStyle\.id \}\)/);
});

test("weather IP locate is opt-in and changelog popup has highlights", () => {
  const source = read("main.source.js");
  const changelog = read("src/update-sections.js");
  const notice = read("src/update-notice.js");
  assert.match(source, /weatherAutoLocate/);
  assert.match(source, /if \(!settings\.weatherAutoLocate\) return null;/);
  assert.match(changelog, /PLUGIN_CHANGELOG_HIGHLIGHTS/);
  assert.match(notice, /完整更新记录/);
  assert.equal(read("docs/usage-guide-body.md").includes("Ideas 闪念"), false);
});

test("mobile capture Moments uses Obsidian sparkles icon, not unsized inline SVG", () => {
  const source = read("main.source.js");
  assert.match(source, /iconName:\s*"sparkles"/);
  assert.match(source, /if \(item\.iconName\) \{\s*setIcon\(icon, item\.iconName\);/s);
  assert.match(source, /async function countMoments/);
  assert.match(source, /\.bc-row-icon svg\{width:/);
});

test("plugin data polling is gated on visible dashboard or habits module", () => {
  const source = read("main.source.js");
  assert.match(source, /shouldPollPluginData\(reason = "interval"\)/);
  assert.match(source, /if \(!this\.isHabitsModuleEnabled\(\)\) return false;/);
  assert.match(source, /if \(!this\.shouldPollPluginData\("interval"\)\) return;/);
  assert.match(source, /if \(!this\.shouldPollPluginData\(reason\)\) return false;/);
  assert.match(source, /reason === "window-focus" \|\| reason === "wake" \|\| reason === "focus"/);
});

test("capture modal hugs content between status bar and keyboard", () => {
  const source = read("main.source.js");
  assert.match(source, /bc-capture-modal-styles-v274/);
  assert.match(source, /height:fit-content!important;min-height:0!important;flex:0 0 auto!important;margin:48px auto 8px!important/);
  assert.match(source, /align-items:flex-start!important;justify-content:center!important;padding-top:0!important;padding-bottom:max\(8px,var\(--bc-kb-inset/);
  assert.match(source, /this\.injectStyles\(\);\s*if \(this\.app\.isMobile\)/s);
});

test("moments bundle ships the lightbox frame, not overlay-side actions", () => {
  const bundle = read("src/moments-core.bundle.js");
  assert.match(bundle, /memos-share-lightbox-frame/);
  assert.match(bundle, /attachLightboxChrome\(layer, frame,/);
  assert.equal(bundle.includes("const actions = layer.createDiv({ cls: \"memos-share-lightbox-actions\" })"), false);
});

test("habit day labels and boxes share one five-column track", () => {
  const source = read("main.source.js");
  assert.match(source, /grid-template-columns:42px repeat\(5,minmax\(0,1fr\)\) 5ch/);
  assert.match(source, /\.sb-habit-grid\{display:contents/);
  assert.match(source, /\.sb-habit-streak\{[^}]*width:5ch/);
  assert.match(source, /\.sb-box\{[^}]*aspect-ratio:1/);
  assert.match(source, /\.sb-habit-day-txt\{[^}]*aspect-ratio:1/);
  assert.equal(source.includes("grid-template-columns:repeat(5,minmax(0,1fr))"), false);
});

test("mobile Moments sort button is circular and FAB composer fills search-to-keyboard", () => {
  const ui = read("src/moments-memoria/ui-contract.css");
  const css = read("src/moments-memoria/styles.css");
  const view = read("src/moments-memoria/view.ts");
  const extra = read("scripts/build.mjs");
  assert.match(ui, /button\.memoria-sort-btn/);
  assert.match(ui, /border-radius:50%/);
  assert.match(ui, /max-width:148px/);
  assert.match(css, /--memoria-composer-top/);
  assert.match(css, /--memoria-composer-left/);
  assert.match(view, /syncComposerFrame/);
  assert.match(view, /--memoria-composer-height/);
  assert.match(view, /measureKeyboardInset/);
  assert.match(view, /--bc-kb-inset/);
  assert.match(view, /focused && !layoutAlreadyShrunk \? 18 : 0/);
  assert.match(view, /bottom: auto|composer-bottom", "auto"/);
  assert.match(css, /bottom:\s*auto;/);
  assert.match(css, /--memoria-composer-height/);
  assert.match(view, /this\.inputEl\?\.focus\(\{ preventScroll: true \}\)/);
  assert.equal(view.includes("is-fab-settling"), false);
  assert.match(view, /toolbar\.yearPanorama/);
  assert.match(view, /topbar\.getBoundingClientRect\(\)/);
  assert.match(view, /visualViewport/);
  assert.match(css, /flex: 1 1 auto;/);
  assert.match(view, /hasClass\("is-fab-expanded"\)/);
  assert.match(extra, /memoria-sort-btn,\.memoria-quick-filter/);
  assert.equal(extra.includes("padding:2px 6px!important;min-width:28px"), false);
  assert.match(view, /composerForceReserve/);
  assert.match(view, /composerBaselineH/);
  assert.match(view, /layoutAlreadyShrunk/);
  assert.equal(view.includes("innerHeight * 0.42"), false);
});

test("v4 Moments hard-deletes and settings stay user-controllable", () => {
  const types = read("src/moments-memoria/types.ts");
  const bridge = read("src/moments.js");
  const source = read("main.source.js");
  assert.match(types, /useTrash:\s*false/);
  assert.match(bridge, /function ensureMomentsTrashDefault/);
  assert.match(bridge, /momentsHardDeleteV4/);
  assert.match(bridge, /function updateMomentsSetting/);
  assert.match(source, /renderBrainCoreMomentsSettingsPanel/);
  assert.match(source, /id: "moments", label: "Moments"/);
  assert.equal(source.includes("删除先进回收站"), false);
  assert.equal(source.includes('id: "diagnostics"'), false);
  assert.equal(source.includes("撤销上一次打卡排序"), false);
  assert.equal(read("src/bc-settings-tab-layout.js").includes('cls: "bc-settings-block-chevron"'), false);
  assert.match(source, /bc-settings-avatar-row/);
  assert.match(read("src/moments-memoria/view.ts"), /registerDomEvent\(window, "keydown"/);
  assert.match(read("src/moments-memoria/view.ts"), /isVimTypingTarget/);
  for (const key of ["sendHotkey", "mobileInputStyle", "dailyGoal", "pageSize"]) {
    assert.ok(source.includes(key), `Moments 设置面板缺少 ${key}`);
  }
});

test("capture submits to the highlighted category and keeps drafts on a separate hotkey", () => {
  const source = read("main.source.js");
  assert.match(source, /submitActiveCategory/);
  assert.match(source, /if \(e\.shiftKey\) \{ void this\.processSave\(\{ isDraft: true \}\); return; \}/);
  assert.match(source, /⌘\/Ctrl\+Shift\+Enter 存草稿/);
  assert.match(source, /lastCaptureCategory/);
  assert.match(source, /row\.createEl\("button", \{\s*cls: "bc-row-item"/s);
  assert.match(source, /"aria-pressed"/);
});

test("update notice renders the how-to block and first run card mentions Moments", () => {
  const notice = read("src/update-notice.js");
  const sections = read("src/update-sections.js");
  const source = read("main.source.js");
  assert.match(notice, /PLUGIN_UPDATE_HOWTO|getUpdateHowto/);
  assert.match(notice, /bc-update-howto/);
  assert.match(sections, /const PLUGIN_UPDATE_HOWTO = \{\s*"4\.\d+\./s);
  assert.match(source, /打开 Moments 写第一条/);
});

test("storage is explained as a table without a diagnostics tab", () => {
  const source = read("main.source.js");
  assert.match(source, /function renderBrainCoreStorageTable/);
  assert.match(source, /内容类型/);
  assert.match(source, /function revealVaultFileInFileManager/);
  assert.equal(source.includes("Moments 回收站"), false);
  assert.equal(source.includes("renderBrainCoreDiagnosticsPanel"), false);
});

test("new vaults skip the retired 闪念 skeleton and modules share one name", () => {
  const source = read("main.source.js");
  assert.equal(/create\((?:[^)]*)Inbox\/Ideas\.md/.test(source), false);
  assert.match(source, /name: '待办总览'/);
  assert.match(source, /name: '时间进度'/);
  assert.equal(read("docs/usage-guide-body.md").includes("⋯ 更多** 展开"), false);
});

test("motion ladder is shared and Moments expansion no longer runs 0.7s", () => {
  const shared = read("src/css/lifeos-ui-shared.css");
  const css = read("src/moments-memoria/styles.css");
  assert.match(shared, /--lifeos-motion-fast: 120ms/);
  assert.match(shared, /--lifeos-motion-med: 180ms/);
  assert.match(shared, /--lifeos-motion-expand: 240ms/);
  assert.equal(/min-height 0\.7s/.test(css), false);
  assert.match(css, /--lifeos-motion-expand, 240ms/);
});

test("Mac write contract is documented in both the architecture doc and the guide", () => {
  const arch = read("docs/MOMENTS-ARCHITECTURE.md");
  const guide = read("docs/usage-guide-body.md");
  assert.match(arch, /## Mac App 写入规范/);
  assert.match(arch, /### 2026-08-25 周二/);
  assert.match(arch, /### 禁止项/);
  assert.match(arch, /habitData/);
  assert.match(guide, /Mac App 写入规范/);
  assert.match(guide, /### 2026-08-25 周二/);
});

test("dashboard Moments count matches memo lines, not day headings", () => {
  const source = read("main.source.js");
  const start = source.indexOf("async function countMoments");
  const end = source.indexOf("function listVaultTags");
  assert.ok(start >= 0 && end > start);
  const fn = source.slice(start, end);
  assert.equal(fn.includes(String.raw`/^-\s+\d{2}:\d{2}(?:\s|$)/gm`), true);
  assert.equal(/#{2,3}/.test(fn), false);
  assert.match(fn, /memos\.length > 0/);
  assert.match(source, /statsOnly[\s\S]*?fleetingNotes = await countMoments/s);
});

test("today delta refreshes on any entity create/delete, not only Work notes", () => {
  const source = read("main.source.js");
  assert.match(source, /function isIgnoredStatPath/);
  assert.match(source, /日切只用「上次快照」/);
  const start = source.indexOf("const refreshForFile = ");
  const end = source.indexOf("this.registerEvent(this.app.vault.on('modify'");
  assert.ok(start >= 0 && end > start);
  const fn = source.slice(start, end);
  assert.match(fn, /kind === "modify"/);
  assert.match(fn, /isQuoteSrc \? "full" : "stats"/);
});

test("calendar day rollover forces today-delta refresh without restart", () => {
  const source = read("main.source.js");
  assert.match(source, /requestCalendarDayRollover/);
  assert.match(source, /startDailyDashboardWatch/);
  assert.match(source, /armDailyRolloverTimer/);
  assert.match(source, /bcLocalDayKey/);
  assert.match(source, /跨日强刷/);
  assert.match(source, /_forceStatsDayCut/);
  assert.match(source, /ctime 早于今天/);
});

test("quote index is incremental and covers all weread + essays", () => {
  const source = read("main.source.js");
  const quoteIndex = read("src/quote-index.js");
  assert.match(quoteIndex, /BC_QUOTE_INDEX_PATH/);
  assert.match(quoteIndex, /bcPickQuoteAvoidRepeat/);
  assert.match(quoteIndex, /bcExtractEssayQuotesFromContent/);
  assert.match(source, /ensureQuoteIndexReady/);
  assert.match(source, /scheduleQuoteIndexSync/);
  assert.match(source, /pickHourlyQuote/);
  assert.match(source, /braincore-quote-index\.json/);
  assert.equal(source.includes("Math.min(wereadFiles.length, 80)"), false);
});

test("style registry and view helpers exist", () => {
  const shared = read("src/lifeos-ui-shared.js");
  const source = read("main.source.js");
  assert.match(shared, /function registerLifeOsStyle/);
  assert.match(shared, /function getLifeOsEditionDisplayName/);
  assert.match(source, /momentsYearlyMigratedV2/);
  assert.equal(fs.existsSync(path.join(root, "src/moments-memoria/view-helpers.ts")), true);
  assert.equal(fs.existsSync(path.join(root, "THIRD-PARTY-NOTICES.md")), true);
  assert.equal(fs.existsSync(path.join(root, ".github/workflows/verify.yml")), true);
});
