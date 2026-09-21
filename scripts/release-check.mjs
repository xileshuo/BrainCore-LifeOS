#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");
const json = (name) => JSON.parse(read(name));
const failures = [];
const manifest = json("manifest.json");
const pkg = json("package.json");
const lock = json("package-lock.json");
const version = manifest.version;
if (pkg.version !== version) failures.push(`package.json=${pkg.version}, manifest=${version}`);
if (lock.version !== version || lock.packages?.[""]?.version !== version) failures.push("package-lock.json 版本不一致");
{
  const readme = read("README.md");
  if (!readme.includes("BrainCore LifeOS")) failures.push("README 缺少产品名");
  if (!readme.includes("¥49.9") || !readme.includes("48")) failures.push("README 缺少试用/定价说明");
  if (readme.includes("版本包（桌面归档）")) failures.push("README 仍含桌面归档版本包说明");
}
const main = read("main.js");
const stylesCss = fs.existsSync(path.join(root, "styles.css")) ? read("styles.css") : "";
const mainSource = read("main.source.js");
const buildSource = read("scripts/build.mjs");
const updateSource = read("src/update-sections.js");
const usageSource = read("docs/usage-guide-body.md");
if (!main.includes(`const PLUGIN_VERSION = "${version}";`)) failures.push("main.js 插件版本未同步");
if (!main.includes("最近上传") || !main.includes("custom-lib-wrapper")) failures.push("main.js 未注入完整文件墙模板");
if (/dv\.table\(\s*\[\s*["']文件["']/.test(mainSource)) {
  failures.push("main.source.js 仍含简易文件墙 dv.table 占位");
}
if (!main.includes("var BCMomentsCore")) failures.push("main.js 缺少 Moments 核心");
if (main.includes('"3.8.13": [')) failures.push("main.js 仍包含高于当前版本的旧 Moments 日志");
if (main.includes("setName('闪念（旧）')")) failures.push("main.js 仍暴露已废弃的闪念路径设置");
if (!(stylesCss.includes("单图分享唯一排版契约") || main.includes("单图分享唯一排版契约"))) failures.push("styles.css/main.js 缺少单图分享排版规则");
if (!(stylesCss.includes("backdrop-filter:none !important") && stylesCss.includes("background:#111 !important") && stylesCss.includes("background:#fff !important"))
  && !(main.includes("backdrop-filter:none !important") && main.includes("background:#111 !important") && main.includes("background:#fff !important"))) {
  failures.push("styles.css/main.js 缺少单图分享纯黑/纯白水印契约");
}
if (main.includes("Moments · 导出作品") || main.includes("moments-reader-sheet")) failures.push("main.js 仍包含已移除的作品导出/阅读/画册代码");
for (const removed of ["src/moments-memoria/works.ts", "src/moments-memoria/export-contract.css", "src/moments-memoria/main.ts", "src/moments-memoria/settings.ts"]) {
  if (fs.existsSync(path.join(root, removed))) failures.push(`源码仍残留 ${removed}`);
}
if (fs.existsSync(path.join(root, "src/moments-memoria.css"))) failures.push("源码仍残留未使用的旧 Moments CSS");
const momentsViewSource = read("src/moments-memoria/view.ts");
const momentsStylesSource = read("src/moments-memoria/styles.css");
const momentsStoreSource = read("src/moments-memoria/store.ts");
const momentsExportSource = read("src/moments-memoria/export.ts");
if (/moments-reader|moments-export-|moments-work-v4|mw4-/.test(momentsViewSource + momentsStylesSource)) failures.push("源码仍残留七套导出/画册/阅读选择器或逻辑");
if (!main.includes("function applySharedCopyLayout")) failures.push("main.js 缺少共用文字排版引擎");
for (const stage of ["single-normal", "single-small", "columns-normal", "columns-small", "truncated"]) {
  if (!main.includes(stage)) failures.push(`main.js 缺少单图分享排版阶段 ${stage}`);
}
if (main.includes("v3.8.8 export-canvas reset")) failures.push("main.js 仍混入历史导出 CSS");
if (main.includes("function splitSentences")) failures.push("main.js 仍包含会拆散原文行的旧排版代码");
if (!main.includes("function publishBrainCoreGlobal")) failures.push("main.js 缺少全局 API 注册桥接");
if (/window\.(?:BrainCoreAPI|statAction|toggleWkTask|BrainCoreTodayDeltaFiles)\s*=(?!=)/.test(main)) failures.push("main.js 仍直接写入 BrainCore 全局 API");
if (main.includes("const PLUGIN_UPDATE_SECTIONS")) failures.push("main.js 仍包含废弃的静态更新说明数组");
if (mainSource.includes("const PLUGIN_UPDATE_SECTIONS") || mainSource.includes("const PLUGIN_CHANGELOG")) failures.push("main.source.js 仍包含旧更新日志副本");
if (mainSource.includes("const LIFEOS_PLUGIN_CATALOG")) failures.push("main.source.js 仍包含 LifeOS 公共模块副本");
if (mainSource.includes("const rawContent = `# BrainCore")) failures.push("main.source.js 仍包含内联使用说明副本");
if (/stripMainCore|patchOpenUsageGuideMethod|buildUpdateSections/.test(buildSource)) failures.push("构建仍依赖清理旧源码的补丁逻辑");
if ((main.match(/const LIFEOS_PLUGIN_CATALOG = \[/g) || []).length !== 1) failures.push("LifeOS 家族目录在成品中不是唯一实例");
if ((main.match(/const PLUGIN_CHANGELOG = \{/g) || []).length !== 1) failures.push("更新日志在成品中不是唯一实例");
if (updateSource.includes('"3.2.5": [')) failures.push("3.2.5 仍未整合进 3.3.0 更新日志");
if (momentsStylesSource.includes(".memoria-stats-modal")) failures.push("Moments CSS 仍包含废弃统计弹窗");
if (momentsStoreSource.includes("无法写入 Moments 回收站，已取消删除以保护原文")) failures.push("Moments 删除仍写入回收站");
if (!momentsStoreSource.includes("不再写 _trash.md")) failures.push("Moments 删除未改为硬删除");
if (!momentsStoreSource.includes("目标年份已写入，但原年份未能移除旧记录")) failures.push("Moments 跨年移动仍缺少防丢失保护");
if (/memoria-export|exported_by: Memoria|<title>Memoria/.test(momentsExportSource)) failures.push("Moments 导出仍暴露旧 Memoria 品牌");
if (main.includes('pathMoments: "Moments"')) failures.push("main.js 仍包含旧 Moments 默认目录");
if (!/name:\s*"Moments",\s*value:\s*fleetingNotes/.test(mainSource)) failures.push("Dashboard 统计仍未统一为 Moments");
if (!fs.existsSync(path.join(root, "styles.css"))) failures.push("缺少 styles.css（build 应写出，供 Obsidian / Scorecard 加载）");
if (!fs.existsSync(path.join(root, "src/css/lifeos-ui-shared.css"))) failures.push("缺少 src/css/lifeos-ui-shared.css");
for (const src of ["src/lifeos-suite.js", "src/lifeos-ui-shared.js", "src/moments.js"]) {
  if (read(src).includes('document.createElement("style")')) failures.push(`${src} 仍含 document.createElement("style")`);
}
if (!/const PLUGIN_WEEKLY_PROFILE = "commercial";/.test(main) || !/const PLUGIN_TRIAL_HOURS = 48;/.test(main)) {
  failures.push("main.js 默认构建未固定为 trial48h（应与社区 Release 一致）");
}
if (process.argv.includes("--dist")) {
  for (const profile of ["个人版", "公版（商）", "公版（免激活）", "48小时体验版"]) {
    const dir = path.join(root, "dist", `v${version}`, profile);
    for (const file of ["main.js", "manifest.json", "styles.css", "README.md", "安装说明.txt", "THIRD-PARTY-NOTICES.md"]) if (!fs.existsSync(path.join(dir, file))) failures.push(`缺少 ${profile}/${file}`);
    if (fs.existsSync(path.join(dir, "manifest.json")) && JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8")).version !== version) failures.push(`${profile} manifest 版本错误`);
    if (fs.existsSync(path.join(dir, "README.md"))) {
      const packedReadme = fs.readFileSync(path.join(dir, "README.md"), "utf8");
      if (!packedReadme.includes("BrainCore LifeOS") || !packedReadme.includes("¥49.9")) {
        failures.push(`${profile} README 缺少产品名或定价说明`);
      }
      if (!packedReadme.includes("## Installation") || !packedReadme.includes("## Usage")) {
        failures.push(`${profile} README 缺少英文 Installation/Usage`);
      }
    }
    if (profile === "48小时体验版" && fs.existsSync(path.join(dir, "main.js"))) {
      const packed = fs.readFileSync(path.join(dir, "main.js"), "utf8");
      const built = read("main.js");
      if (packed !== built) failures.push("48小时体验版 main.js 与 npm run build 输出不一致");
    }
  }
}
if (usageSource.includes("Ideas 闪念")) failures.push("使用说明仍写 Ideas 闪念");
if (usageSource.includes("一条一文件")) failures.push("使用说明仍写一条一文件");
if (usageSource.includes("闪念存放")) failures.push("使用说明仍写闪念存放");
if (/adapter\.rmdir\(legacyDir,\s*true\)/.test(mainSource)) failures.push("旧插件目录仍无验证直接删除");
if (!mainSource.includes("weatherAutoLocate")) failures.push("缺少天气自动定位开关");
if (!read("src/update-sections.js").includes("PLUGIN_CHANGELOG_HIGHLIGHTS")) failures.push("更新日志弹窗缺少用户向摘要");
if (!fs.existsSync(path.join(root, "src/moments-memoria/view-helpers.ts"))) failures.push("缺少 view-helpers 拆分");
if (!fs.existsSync(path.join(root, "THIRD-PARTY-NOTICES.md"))) failures.push("缺少 THIRD-PARTY-NOTICES");
if (!read("src/lifeos-ui-shared.js").includes("registerLifeOsStyle")) failures.push("缺少样式注册表");
if (!read("src/moments-memoria/share.ts").includes("waitForShareImage")) failures.push("分享图等待 DOM 仍无超时");
if (!read("src/moments-memoria/share.ts").includes("MULTI_SHARE_PAGE_SIZE")) failures.push("多条分享缺少分页/搜索");
if (!read("src/moments.js").includes("momentsHardDeleteV4")) failures.push("Moments 未一次性关掉回收站写入");
if (usageSource.includes("设置 → **诊断**")) failures.push("使用说明仍包含已移除的诊断 Tab");
if (usageSource.includes("v3.2.5") || usageSource.includes("日拱一卒")) failures.push("使用说明仍包含旧版本或旧库名");
for (const removedCopy of ["顶栏收束为「作品台」", "Moments 成品体系：七套作品", "分享底栏改为液态玻璃"]) {
  if (main.includes(removedCopy)) failures.push(`当前更新日志仍宣传已撤回能力：${removedCopy}`);
}
if (/data-type=\\?"memoria-(?:view|stats-view|year-view)/.test(main)) failures.push("main.js 仍包含独立 Memoria 视图选择器");
if (!usageSource.includes("Moments 完整使用说明")) failures.push("使用说明缺少 Moments 完整章节");
if (usageSource.includes("删除先进回收站")) failures.push("使用说明仍写 Moments 回收站");
const dashboardStart = mainSource.indexOf("    async renderDashboard(");
const dashboardEnd = mainSource.indexOf("class BrainCoreIOSQuickModal", dashboardStart);
const dashboardSource = dashboardStart >= 0 && dashboardEnd > dashboardStart ? mainSource.slice(dashboardStart, dashboardEnd) : "";
if (!dashboardSource) failures.push("无法定位 Dashboard 源码区间");
if (/\.innerHTML\s*=|insertAdjacentHTML|\.onclick\s*=/.test(dashboardSource)) failures.push("Dashboard 仍包含动态 HTML 或内联事件");
const globalBridgeSource = read("src/braincore-global-bridge.js");
if (/statAction|toggleWkTask|BrainCoreTodayDeltaFiles/.test(globalBridgeSource)) failures.push("全局桥接仍暴露按钮级历史 API");
if (mainSource.includes("renderBrainCoreDiagnosticsPanel")) failures.push("设置页仍保留 Moments/Boxes 诊断入口");
if (!read("src/moments-memoria/share.ts").includes("MULTI_SHARE_MAX_ESTIMATED_HEIGHT")) failures.push("多条分享缺少高度预算");
if (!fs.existsSync(path.join(root, "docs/MOMENTS-ARCHITECTURE.md"))) failures.push("缺少 Moments 架构与历史修复文档");
for (const baseline of ["share-themes-light-text.jpg", "share-themes-dark-text.jpg", "share-themes-light-image.jpg", "share-themes-dark-image.jpg", "share-themes-narrow.jpg", "share-alignment.jpg"]) {
  if (!fs.existsSync(path.join(root, "tests/visual/baselines", baseline))) failures.push(`缺少分享视觉回归基线：${baseline}`);
}
if (read("README.md").includes(".obsidian/plugins/BrainCore LifeOS/")) failures.push("README 仍使用旧安装目录");
if (!mainSource.includes("maybeShowUpdateNotice();")) failures.push("升级后未自动弹出更新说明");
if (mainSource.includes('pathMoments = v || "Moments"')) failures.push("设置页 Moments 空值仍回退到 Moments");
if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}
console.log(`Release check passed: BrainCore v${version}${process.argv.includes("--dist") ? " + 4 profiles" : ""}`);
