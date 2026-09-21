const USAGE_GUIDE_PATH = "BrainCore LifeOS 插件使用说明.md";
const USAGE_GUIDE_BASENAME = "BrainCore LifeOS 插件使用说明";
const USAGE_GUIDE_FOLDER = "使用说明（看完可删）";
const USAGE_GUIDE_VERSION = "2026-09-15-braincore-guide-v25";
const GUIDE_VERSION_RE = /<!--\s*bc-guide-version:([^>]+)\s*-->/;
const SHORTCUTS_GUIDE_PATH = "BrainCore快捷指令使用指南.md";
const SHORTCUTS_GUIDE_CANDIDATES = [
  SHORTCUTS_GUIDE_PATH,
  "Just do it/OB相关/BrainCore快捷指令使用指南.md",
  "Just do it/插件/BrainCore快捷指令使用指南.md",
];

/** @type {string} injected by scripts/build.mjs */
const USAGE_GUIDE_RAW = __USAGE_GUIDE_BODY__;
/** @type {string} injected by scripts/build.mjs */
const SHORTCUTS_GUIDE_RAW = __SHORTCUTS_GUIDE_BODY__;

function buildBrainCoreGuideContent() {
  return `${wrapUsageGuideContent(USAGE_GUIDE_RAW).trim()}\n\n<!-- bc-guide-version:${USAGE_GUIDE_VERSION} -->`;
}

function findMarkdownByBasename(app, basename) {
  const files = app.vault.getMarkdownFiles?.() || [];
  const hits = files.filter((f) => f.basename === basename);
  if (!hits.length) return null;
  return hits.find((f) => String(f.path || "").startsWith(`${USAGE_GUIDE_FOLDER}/`)) || hits[0];
}

function findBrainCoreUsageGuideFile(app) {
  return findMarkdownByBasename(app, USAGE_GUIDE_BASENAME)
    || app.vault.getAbstractFileByPath(`${USAGE_GUIDE_FOLDER}/${USAGE_GUIDE_PATH}`)
    || app.vault.getAbstractFileByPath(USAGE_GUIDE_PATH);
}

function usageGuideCreatePath(app) {
  const folder = app.vault.getAbstractFileByPath(USAGE_GUIDE_FOLDER);
  if (folder) return `${USAGE_GUIDE_FOLDER}/${USAGE_GUIDE_PATH}`;
  return USAGE_GUIDE_PATH;
}

async function ensureBrainCoreUsageGuide(app, forceUpdate = false) {
  const content = buildBrainCoreGuideContent();
  try {
    let guideFile = findBrainCoreUsageGuideFile(app);
    if (!guideFile) {
      guideFile = await app.vault.create(usageGuideCreatePath(app), content);
    } else {
      const old = await app.vault.read(guideFile);
      const ver = old.match(GUIDE_VERSION_RE)?.[1]?.trim();
      if (forceUpdate || ver !== USAGE_GUIDE_VERSION || old.trim() !== content.trim()) {
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
  const { forceOpen = false, rewrite = false } = options || {};
  if (!forceOpen) return;
  const existing = findBrainCoreUsageGuideFile(plugin.app);
  if (!existing) {
    await ensureBrainCoreUsageGuide(plugin.app, false);
  } else if (rewrite) {
    await ensureBrainCoreUsageGuide(plugin.app, true);
  }
  try {
    const file = findBrainCoreUsageGuideFile(plugin.app);
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
