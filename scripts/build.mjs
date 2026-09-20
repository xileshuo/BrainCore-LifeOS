#!/usr/bin/env node
/**
 * Bundle BrainCore: shared LifeOS modules + main.source.js (core) → main.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { patchLifeOsReleaseInCode } from "./lifeos-release-date.mjs";
import { injectLifeOsSidebarInsetIntoShared } from "./lifeos-shared-sidebar.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function read(name) {
  return fs.readFileSync(path.join(root, name), "utf8");
}

function buildUsageGuideModule(usageBody, shortcutsBody) {
  const template = read("src/usage-guide.js");
  return template
    .replace("__USAGE_GUIDE_BODY__", JSON.stringify(usageBody))
    .replace("__SHORTCUTS_GUIDE_BODY__", JSON.stringify(shortcutsBody));
}

const manifest = JSON.parse(read("manifest.json"));
const core = read("main.source.js");

const guideBody = fs.readFileSync(path.join(root, "docs/usage-guide-body.md"), "utf8");
const shortcutsGuideBody = fs.readFileSync(path.join(root, "docs/BrainCore快捷指令使用指南.md"), "utf8");

let patchedCore = core.replace(
  /const PLUGIN_VERSION = "[^"]+";/,
  `const PLUGIN_VERSION = "${manifest.version}";`
);

const fileWallTemplatePath = path.join(root, "docs/templates/文件墙.md");
if (!fs.existsSync(fileWallTemplatePath)) {
  throw new Error("缺少文件墙模板: docs/templates/文件墙.md");
}
const fileWallTemplate = fs.readFileSync(fileWallTemplatePath, "utf8");
if (!fileWallTemplate.includes("最近上传") || !fileWallTemplate.includes("custom-lib-wrapper")) {
  throw new Error("文件墙模板不完整（缺少最近上传 / custom-lib-wrapper）");
}
if (!patchedCore.includes('const FILE_WALL_NOTE_TEMPLATE = "";')) {
  throw new Error("main.source.js 缺少 FILE_WALL_NOTE_TEMPLATE 占位");
}
patchedCore = patchedCore.replace(
  'const FILE_WALL_NOTE_TEMPLATE = "";',
  `const FILE_WALL_NOTE_TEMPLATE = ${JSON.stringify(fileWallTemplate)};`
);

const momentsBaseCss = read("src/moments-memoria/styles.css");
// v3.3 已从源码删除阅读、画册和七套导出，仅追加主界面与单图分享契约。
const momentsCssRaw = [
  momentsBaseCss.trimEnd(),
  read("src/moments-memoria/ui-contract.css"),
  read("src/moments-memoria/share-contract.css"),
].join("\n");
const momentsCssExtra = `
.workspace-leaf-content[data-type="braincore-moments-view"] .view-content{padding:0!important;overflow:hidden;display:flex;flex-direction:column}
.workspace-leaf-content[data-type="braincore-moments-year-view"] .view-content{padding:44px 36px 64px!important;overflow-y:auto!important;overflow-x:hidden!important;display:block!important}
.workspace-leaf-content[data-type="braincore-moments-stats-view"] .view-content{padding:48px 56px 64px!important;overflow-y:auto!important;overflow-x:hidden!important;display:block!important}
@media(max-width:520px){.workspace-leaf-content[data-type="braincore-moments-stats-view"] .view-content{padding:24px 16px 48px!important}}
.memoria-list-meta-left{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.memoria-sort-btn,.memoria-quick-filter{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;min-width:36px;min-height:36px;padding:0!important;border-radius:50%;box-sizing:border-box}
`;
const bcmMomentsCssConst = `const BCM_MOMENTS_CSS = ${JSON.stringify(momentsCssRaw + momentsCssExtra)};\n`;
const momentsCoreBundle = read("src/moments-core.bundle.js");
const momentsBridge = read("src/moments.js");

// Moments：Memoria 同源核心 + BrainCore 桥接（注入在 module.exports 之前）
// 注意：必须用函数替换。Memoria 源码含 `$&`，若用字符串替换会被 String.replace 特殊解释并毁掉语法。
if (patchedCore.includes("module.exports = BrainCorePlugin")) {
  const momentsInject = `${bcmMomentsCssConst}\n${momentsCoreBundle}\n${momentsBridge}\nmodule.exports = BrainCorePlugin;`;
  patchedCore = patchedCore.replace(
    "module.exports = BrainCorePlugin;",
    () => momentsInject
  );
} else {
  console.warn("warn: module.exports not found; appending moments modules");
  patchedCore += "\n" + bcmMomentsCssConst + momentsCoreBundle + momentsBridge;
}

const parts = [
  injectLifeOsSidebarInsetIntoShared(read("src/lifeos-ui-shared.js")),
  read("src/braincore-global-bridge.js"),
  read("src/update-sections.js"),
  read("src/lifeos-suite.js"),
  read("src/update-notice.js"),
  buildUsageGuideModule(guideBody, shortcutsGuideBody),
  read("src/bc-settings-tab-layout.js"),
  read("src/quote-index.js"),
  patchedCore,
];

fs.writeFileSync(path.join(root, "main.js"), patchLifeOsReleaseInCode(parts.join("\n")));
console.log("Built main.js", (parts.join("").length / 1024).toFixed(1), "KB");
