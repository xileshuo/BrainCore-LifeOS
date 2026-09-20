/**
 * BrainCore Moments 桥接层
 * — 视图/存储逻辑来自 src/moments-core.bundle.js（由 Memoria MIT 源码适配，目录默认 读&写/Moments/）
 * — 本文件负责：注入样式、注册视图、捕捉写入、历史迁移
 */
const VIEW_TYPE_MOMENTS = "braincore-moments-view";
const VIEW_TYPE_MOMENTS_STATS = "braincore-moments-stats-view";
const VIEW_TYPE_MOMENTS_YEAR = "braincore-moments-year-view";
const MOMENTS_STYLE_ID = "bc-moments-styles-v8";
const DEFAULT_MOMENTS_FOLDER = "读&写/Moments";
const LEGACY_MOMENTS_FOLDER = "Moments";
const LEGACY_MEMORIA_FOLDER = "Memoria";
const DEFAULT_SUISUI_FOLDER = "读&写/碎碎念";
const ARCHIVED_SUISUI_FOLDER = "读&写/碎碎念_已迁入Moments";
const MOMENTS_MIGRATION_BACKUP_ROOT = ".braincore-backups/moments-v3";

function getMomentsCore() {
    if (typeof BCMomentsCore === "undefined" || !BCMomentsCore) {
        throw new Error("BCMomentsCore 未加载：请重新构建 BrainCore");
    }
    return BCMomentsCore;
}

function reportMomentsAsync(label, promise, options = {}) {
    return Promise.resolve(promise).catch((error) => {
        console.error(`[BrainCore Moments] ${label}`, error);
        if (options.notice !== false) new Notice(`${label}失败，请稍后重试`, 6000);
        return null;
    });
}

function injectMomentsStyles() {
    const css = (typeof BCM_MOMENTS_CSS === "string" && BCM_MOMENTS_CSS) ? BCM_MOMENTS_CSS : "";
    if (typeof registerLifeOsStyle === "function") {
        registerLifeOsStyle(MOMENTS_STYLE_ID, css, "v8");
        return;
    }
    let el = document.getElementById(MOMENTS_STYLE_ID);
    if (el) el.remove();
    el = document.createElement("style");
    el.id = MOMENTS_STYLE_ID;
    el.textContent = css;
    document.head.appendChild(el);
}

function resolveMomentsFolder(plugin) {
    const raw = String(plugin?.settings?.pathMoments || DEFAULT_MOMENTS_FOLDER).trim().replace(/\/$/, "");
    // 历史根目录统一到读&写/Moments/YYYY.md。
    if (!raw || raw === LEGACY_MOMENTS_FOLDER || raw === LEGACY_MEMORIA_FOLDER) return DEFAULT_MOMENTS_FOLDER;
    return raw;
}

/** v4.0.0：删除即从年文件移除，不再写 _trash.md。一次性关掉老库的 useTrash。 */
function ensureMomentsTrashDefault(plugin, saved) {
    if (plugin.settings.momentsHardDeleteV4) return saved;
    saved.useTrash = false;
    plugin.settings.momentsHardDeleteV4 = true;
    plugin.settings.momentsSettings = saved;
    void plugin.saveSettings();
    return saved;
}

function ensureMomentsRuntime(plugin) {
    if (plugin._momentsRuntime) {
        // 保持 folder 与设置同步
        const folder = resolveMomentsFolder(plugin);
        plugin._momentsRuntime.settings.folder = folder;
        plugin._momentsRuntime.settings.attachmentFolder = "Boxes/图片";
        plugin._momentsRuntime.settings.showSidebarTags = true;
        return plugin._momentsRuntime;
    }
    const core = getMomentsCore();
    const folder = resolveMomentsFolder(plugin);
    const saved = ensureMomentsTrashDefault(plugin, (plugin.settings && plugin.settings.momentsSettings) || {});
    const settings = Object.assign({}, core.DEFAULT_SETTINGS, saved, {
        folder,
        // 图片与附件统一进仓库 Boxes，不在 Moments 下制造空目录。
        attachmentFolder: "Boxes/图片",
        // Moments 对齐 memos-view：侧栏始终显示「全部标签」
        showSidebarTags: true,
    });
    try { core.initLocale(settings.language || "auto"); } catch (error) { console.warn("[BrainCore Moments] 语言初始化失败，使用默认语言", error); }
    const store = new core.MemoStore(plugin.app, settings);
    const host = {
        app: plugin.app,
        settings,
        store,
        async saveSettings() {
            plugin.settings.momentsSettings = Object.assign({}, settings);
            plugin.settings.pathMoments = settings.folder;
            await plugin.saveSettings();
        },
    };
    plugin._momentsRuntime = host;
    store.onChange(() => {
        try {
            const n = store.getAll().filter((m) => !m?.isDeleted).length;
            if (plugin._statsCache && typeof plugin._statsCache === "object") {
                plugin._statsCache.ideas = n;
                plugin._statsCache.moments = n;
                try { sessionStorage.setItem("sb-stats-cache-f", JSON.stringify(plugin._statsCache)); } catch (_) { /* ignore */ }
            }
            plugin.notifyDataChanged?.("stats");
            const dashType = typeof VIEW_TYPE_DASHBOARD !== "undefined" ? VIEW_TYPE_DASHBOARD : "braincore-dashboard-view";
            for (const leaf of plugin.app.workspace.getLeavesOfType(dashType)) {
                leaf.view?.queueRefresh?.("stats");
            }
        } catch (e) {
            console.warn("[BrainCore] Moments 数量同步到侧栏失败:", e);
        }
    });
    return host;
}

/** 设置页读值：默认值 + data.json 里已保存的覆盖值（不强制初始化 runtime） */
function getMomentsSettingsSnapshot(plugin) {
    let defaults = {};
    try { defaults = getMomentsCore().DEFAULT_SETTINGS || {}; } catch (_) { /* 核心未加载时退回已存值 */ }
    const saved = (plugin.settings && plugin.settings.momentsSettings) || {};
    return Object.assign({}, defaults, saved);
}

/** 设置页写值：同时更新已打开视图的 runtime、data.json，并按需重开视图 */
async function updateMomentsSetting(plugin, key, value) {
    const saved = (plugin.settings.momentsSettings = plugin.settings.momentsSettings || {});
    saved[key] = value;
    const runtime = plugin._momentsRuntime;
    if (runtime?.settings) runtime.settings[key] = value;
    await plugin.saveSettings();
}

/** 改完设置后让已打开的 Moments 视图按新值重绘（store.notifyChange 会触发视图 renderAll） */
function refreshOpenMomentsViews(plugin) {
    const store = plugin._momentsRuntime?.store;
    if (typeof store?.notifyChange !== "function") return;
    try { store.notifyChange(); } catch (error) { console.warn("[BrainCore Moments] 刷新视图失败", error); }
}

function registerMomentsViews(plugin) {
    const core = getMomentsCore();
    const typeMain = core.VIEW_TYPE_MOMENTS || VIEW_TYPE_MOMENTS;
    const typeStats = core.VIEW_TYPE_MOMENTS_STATS || VIEW_TYPE_MOMENTS_STATS;
    const typeYear = core.VIEW_TYPE_MOMENTS_YEAR || VIEW_TYPE_MOMENTS_YEAR;

    plugin.registerView(typeMain, (leaf) => {
        const rt = ensureMomentsRuntime(plugin);
        return new core.MomentsView(leaf, rt.store, rt.settings, rt);
    });
    plugin.registerView(typeStats, (leaf) => {
        const rt = ensureMomentsRuntime(plugin);
        return new core.MomentsStatsView(leaf, rt.store);
    });
    plugin.registerView(typeYear, (leaf) => {
        const rt = ensureMomentsRuntime(plugin);
        return new core.MomentsYearView(leaf, rt.store);
    });

    // 产品化迁移入口：先只扫描并预览，不会直接搬动 Tasks / Ideas / 草稿，避免误迁项目笔记。
    if (!plugin._momentsMigrationPreviewCommand) {
        plugin._momentsMigrationPreviewCommand = true;
        plugin.addCommand({
            id: "braincore-moments-preview-migration",
            name: "Moments：预览 Tasks / Ideas / 草稿迁移（仅扫描）",
            callback: () => {
                const roots = ["Tasks", "Ideas", "草稿"];
                const candidates = plugin.app.vault.getMarkdownFiles().filter((file) =>
                    roots.some((root) => file.path === `${root}.md` || file.path.startsWith(`${root}/`))
                );
                const examples = candidates.slice(0, 5).map((file) => file.basename).join("、");
                new Notice(candidates.length
                    ? `发现 ${candidates.length} 条候选：${examples}${candidates.length > 5 ? " 等" : ""}。预览仅扫描，不会移动文件。`
                    : "Tasks、Ideas、草稿中暂未发现可迁移的 Markdown 记录。", 7000);
            },
        });
        plugin.addCommand({
            id: "braincore-moments-retry-migration",
            name: "Moments：重试数据迁移",
            callback: () => {
                void migrateSuisuiAndIdeasToMoments(plugin, { force: true }).then((r) => {
                    if (r?.skipped) new Notice("Moments 目录已对齐，无需再迁", 4000);
                    else if (r && !r.skipped) new Notice(`Moments 迁移完成${r.imported ? `（导入 ${r.imported} 条）` : ""}`, 5000);
                });
            },
        });
    }

    if (!plugin._momentsVaultEventsRegistered) {
        plugin._momentsVaultEventsRegistered = true;
        plugin.registerEvent(plugin.app.vault.on("modify", (f) => {
            const rt = plugin._momentsRuntime;
            if (!rt || !(f instanceof TFile)) return;
            if (rt.store.isInFolder(f)) void reportMomentsAsync("刷新 Moments 文件", rt.store.reloadFile(f), { notice: false });
        }));
        plugin.registerEvent(plugin.app.vault.on("create", (f) => {
            const rt = plugin._momentsRuntime;
            if (!rt || !(f instanceof TFile)) return;
            if (rt.store.isInFolder(f)) void reportMomentsAsync("载入 Moments 文件", rt.store.reloadFile(f), { notice: false });
        }));
        plugin.registerEvent(plugin.app.vault.on("delete", (f) => {
            const rt = plugin._momentsRuntime;
            if (!rt || !(f instanceof TFile)) return;
            rt.store.removeFile(f.path);
        }));
        plugin.registerEvent(plugin.app.vault.on("rename", (f, oldPath) => {
            const rt = plugin._momentsRuntime;
            if (!rt) return;
            rt.store.removeFile(oldPath);
            if (f instanceof TFile && rt.store.isInFolder(f)) void reportMomentsAsync("重命名后刷新 Moments 文件", rt.store.reloadFile(f), { notice: false });
        }));
    }
}

// 年文件格式不存来源字段，所以这里不接收 source：收下一个永远不落盘的参数只会误导调用方。
async function createMomentEntry(app, plugin, { body, title, tags, date, pinned, starred } = {}) {
    await migrateVaultIntoMomentsFolder(plugin);
    const rt = ensureMomentsRuntime(plugin);
    let text = String(body || "").trim();
    if (title) text = `${title}\n${text}`.trim();
    if (tags?.length) {
        text = `${text}\n${tags.map((t) => `#${String(t).replace(/^#/, "")}`).join(" ")}`.trim();
    }
    if (pinned) text = `${text}\n#置顶`.trim();
    if (starred) text = `${text}\n#收藏`.trim();
    if (!text) text = "（空）";
    const when = date && window.moment(date).isValid() ? window.moment(date).toDate() : new Date();
    await rt.store.addMemo(text, when);
    return app.vault.getAbstractFileByPath(`${rt.settings.folder}/${when.getFullYear()}.md`);
}

async function saveMomentBinary(app, plugin, arrayBuffer, extension = "png") {
    const rt = ensureMomentsRuntime(plugin);
    const folder = rt.settings.attachmentFolder || "Boxes/图片";
    await ensureFolderByPath(app.vault, folder + "/.keep");
    const name = `IMG-${window.moment().format("YYYYMMDDHHmmssSSS")}-${Math.random().toString(36).slice(2, 6)}.${String(extension).replace(/^\./, "")}`;
    let path = joinVaultPath(folder, name);
    path = makeUniqueVaultPath(app.vault, path);
    await app.vault.createBinary(path, arrayBuffer);
    return path;
}

function parseMomentFrontmatter(content) {
    const text = String(content || "");
    if (!text.startsWith("---")) return { meta: {}, body: text };
    const end = text.indexOf("\n---", 3);
    if (end === -1) return { meta: {}, body: text };
    const yaml = text.slice(3, end).replace(/^\n/, "");
    const body = text.slice(end + 4).replace(/^\n/, "");
    const meta = {};
    for (const line of yaml.split("\n")) {
        const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
        if (!m) continue;
        const key = m[1];
        let val = m[2].trim();
        if (val.startsWith("[") && val.endsWith("]")) {
            meta[key] = val.slice(1, -1).split(",").map((x) => x.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
        } else if (val === "true" || val === "false") {
            meta[key] = val === "true";
        } else {
            meta[key] = val.replace(/^["']|["']$/g, "");
        }
    }
    return { meta, body };
}

function parseChineseMomentDate(raw) {
    const s = String(raw || "").trim();
    if (!s) return null;
    const cn = s.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
    if (cn) {
        const iso = `${cn[1]}-${String(cn[2]).padStart(2, "0")}-${String(cn[3]).padStart(2, "0")}T${String(cn[4] || "12").padStart(2, "0")}:${String(cn[5] || "00").padStart(2, "0")}:${String(cn[6] || "00").padStart(2, "0")}`;
        const m = window.moment(iso);
        return m.isValid() ? m : null;
    }
    const m2 = window.moment(s);
    return m2.isValid() ? m2 : null;
}

function contentFingerprint(text) {
    return String(text || "").replace(/\s+/g, " ").trim().slice(0, 240);
}

function countMomentEntries(content) {
    return (String(content || "").match(/^-\s+\d{2}:\d{2}(?:\s|$)/gm) || []).length;
}

function migrationStamp() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}-${String(d.getMilliseconds()).padStart(3, "0")}`;
}

function collectMigrationFiles(app) {
    const roots = [DEFAULT_MOMENTS_FOLDER, LEGACY_MOMENTS_FOLDER, LEGACY_MEMORIA_FOLDER, DEFAULT_SUISUI_FOLDER, ARCHIVED_SUISUI_FOLDER];
    return app.vault.getFiles().filter((file) => roots.some((root) => file.path === root || file.path.startsWith(`${root}/`)));
}

async function createMomentsMigrationBackup(app, files) {
    const backupFolder = `${MOMENTS_MIGRATION_BACKUP_ROOT}/${migrationStamp()}`;
    const manifest = [];
    for (const file of files) {
        const backupPath = `${backupFolder}/${file.path}.bak`;
        await ensureFolderByPath(app.vault, backupPath);
        const data = await app.vault.readBinary(file);
        await app.vault.createBinary(backupPath, data);
        manifest.push({ path: file.path, backup: backupPath, bytes: file.stat?.size || data.byteLength || 0 });
    }
    const manifestPath = `${backupFolder}/manifest.json`;
    await ensureFolderByPath(app.vault, manifestPath);
    await app.vault.create(manifestPath, JSON.stringify({ createdAt: new Date().toISOString(), files: manifest }, null, 2));
    return { backupFolder, manifestPath, files: manifest };
}

async function countYearlyMoments(app, folder) {
    let count = 0;
    for (const file of app.vault.getMarkdownFiles()) {
        if (file.path.startsWith(`${folder}/`) && /^\d{4}\.md$/.test(file.name)) {
            count += countMomentEntries(await app.vault.read(file));
        }
    }
    return count;
}

async function copyVaultFile(app, srcPath, destPath) {
    const src = app.vault.getAbstractFileByPath(srcPath);
    if (!src) return false;
    if (app.vault.getAbstractFileByPath(destPath)) return false;
    await ensureFolderByPath(app.vault, destPath);
    const data = await app.vault.readBinary(src);
    await app.vault.createBinary(destPath, data);
    return true;
}

async function mergeYearMarkdown(app, destPath, srcContent) {
    const existing = app.vault.getAbstractFileByPath(destPath);
    if (!existing) {
        await ensureFolderByPath(app.vault, destPath);
        await app.vault.create(destPath, srcContent);
        return { created: true };
    }
    const cur = await app.vault.read(existing);
    if (cur.includes(srcContent.trim()) || srcContent.trim().length < 20) return { skipped: true };
    // 简单合并：把源文件里每个 ## 日块追加（去重指纹）
    const dayBlocks = String(srcContent).split(/^## /m).slice(1);
    let next = cur;
    let added = 0;
    for (const block of dayBlocks) {
        const full = `## ${block}`.trim();
        const fp = contentFingerprint(full);
        if (fp && next.includes(fp.slice(0, 80))) continue;
        next = next.replace(/\s*$/, "\n\n") + full + "\n";
        added++;
    }
    if (added) await app.vault.modify(existing, next);
    return { merged: added };
}

async function importSingleNoteFilesIntoYearly(plugin, folderPath, existingFingerprints) {
    const app = plugin.app;
    const rt = ensureMomentsRuntime(plugin);
    const root = app.vault.getAbstractFileByPath(folderPath);
    if (!root?.children) return 0;
    const files = [];
    const walk = (af) => {
        if (!af) return;
        if (af.children) { af.children.forEach(walk); return; }
        if (af.extension === "md" && !String(af.path).includes("/attachments/") && !/^\d{4}\.md$/.test(af.name) && !af.name.startsWith("_") && !af.name.startsWith("Moments导出")) {
            files.push(af);
        }
    };
    walk(root);
    let imported = 0;
    for (const file of files) {
        try {
            const raw = await app.vault.read(file);
            const { meta, body } = parseMomentFrontmatter(raw);
            let dateMom = meta.date ? window.moment(meta.date) : null;
            if (!dateMom || !dateMom.isValid()) {
                // 碎碎念常见：创建日期 / 文件名
                const m = String(raw).match(/创建日期[:：]\s*(.+)/);
                if (m) dateMom = parseChineseMomentDate(m[1]);
            }
            if (!dateMom || !dateMom.isValid()) dateMom = window.moment(file.stat?.ctime || Date.now());
            let text = String(body || "").trim();
            if (!text && !meta.title) {
                // 无 frontmatter：整篇正文
                text = String(raw || "").trim();
                if (text.startsWith("---")) {
                    const p = parseMomentFrontmatter(text);
                    text = p.body;
                }
            }
            if (meta.title && !text.startsWith(meta.title)) text = `${meta.title}\n${text}`.trim();
            if (Array.isArray(meta.tags) && meta.tags.length) {
                text = `${text}\n${meta.tags.map((t) => `#${t}`).join(" ")}`.trim();
            }
            const fp = contentFingerprint(text);
            if (fp && existingFingerprints.has(fp)) continue;
            if (!text) continue;
            await rt.store.addMemo(text, dateMom.toDate());
            existingFingerprints.add(fp);
            imported++;
        } catch (e) {
            const error = new Error(`Moments 单篇导入失败：${file.path}`);
            error.cause = e;
            throw error;
        }
    }
    return imported;
}

/** 把历史目录统一迁入读&写/Moments/YYYY.md */
async function migrateVaultIntoMomentsFolder(plugin) {
    if (plugin.settings.momentsReadWriteMigrationV3) return { skipped: true };
    // 旧版已迁过：只补标记，不再弹 Notice
    if (
        plugin.settings.momentsMigrated
        || plugin.settings.momentsYearlyMigratedV2
        || plugin.settings.momentsImportedToMemoria
    ) {
        plugin.settings.momentsReadWriteMigrationV3 = true;
        await plugin.saveSettings();
        return { skipped: true };
    }
    const app = plugin.app;
    const destFolder = DEFAULT_MOMENTS_FOLDER;
    const sourceFiles = collectMigrationFiles(app);
    const beforeCount = await countYearlyMoments(app, destFolder);

    // 新库 / 无旧 Ideas·碎碎念·Moments：无需迁移，静默标记完成（避免反复 Notice）
    if (!sourceFiles.length && beforeCount === 0) {
        plugin.settings.pathMoments = destFolder;
        plugin.settings.momentsYearlyMigratedV2 = true;
        plugin.settings.momentsReadWriteMigrationV3 = true;
        plugin.settings.momentsImportedToMemoria = true;
        plugin.settings.momentsMigrated = true;
        await plugin.saveSettings();
        return { skipped: true, empty: true };
    }

    const backup = await createMomentsMigrationBackup(app, sourceFiles);
    console.info("[BrainCore Moments] 迁移预检", { files: sourceFiles.length, beforeCount, backup: backup.backupFolder });
    await ensureFolderByPath(app.vault, destFolder + "/.keep");
    const attachmentTarget = "Boxes/图片";
    await ensureFolderByPath(app.vault, `${attachmentTarget}/.keep`);

    // 1) 合并历史根目录与 Memoria 年文件、附件。
    for (const sourceFolder of [LEGACY_MOMENTS_FOLDER, LEGACY_MEMORIA_FOLDER]) {
        const sourceRoot = app.vault.getAbstractFileByPath(sourceFolder);
        if (!sourceRoot?.children) continue;
        for (const child of sourceRoot.children) {
            if (child.extension === "md" && /^\d{4}\.md$/.test(child.name)) {
                const raw = await app.vault.read(child);
                await mergeYearMarkdown(app, `${destFolder}/${child.name}`, raw);
            }
        }
        const sourceAtt = app.vault.getAbstractFileByPath(`${sourceFolder}/attachments`);
        if (sourceAtt?.children) for (const f of sourceAtt.children) {
            if (!f.children) await copyVaultFile(app, f.path, `${attachmentTarget}/${f.name}`);
        }
    }

    // 2) 收集已有指纹，避免碎碎念重复导入
    const fps = new Set();
    const destRoot = app.vault.getAbstractFileByPath(destFolder);
    if (destRoot?.children) {
        for (const child of destRoot.children) {
            if (child.extension === "md" && /^\d{4}\.md$/.test(child.name)) {
                const raw = await app.vault.cachedRead(child);
                // 粗粒度：每条 - HH:mm 块正文
                const parts = String(raw).split(/^-\s+\d{2}:\d{2}/m);
                for (const p of parts.slice(1)) fps.add(contentFingerprint(p));
            }
        }
    }

    // 3) 导入单篇：读&写/Moments、碎碎念、碎碎念归档
    let imported = 0;
    for (const folder of [DEFAULT_MOMENTS_FOLDER, LEGACY_MOMENTS_FOLDER, DEFAULT_SUISUI_FOLDER, ARCHIVED_SUISUI_FOLDER]) {
        imported += await importSingleNoteFilesIntoYearly(plugin, folder, fps);
    }

    const afterCount = await countYearlyMoments(app, destFolder);
    if (afterCount < beforeCount || afterCount < beforeCount + imported) {
        throw new Error(`Moments 迁移校验失败：迁移前 ${beforeCount} 条，导入 ${imported} 条，迁移后仅 ${afterCount} 条。备份：${backup.backupFolder}`);
    }

    plugin.settings.pathMoments = destFolder;
    plugin.settings.momentsYearlyMigratedV2 = true;
    plugin.settings.momentsReadWriteMigrationV3 = true;
    plugin.settings.momentsImportedToMemoria = true;
    plugin.settings.momentsMigrated = true;
    await plugin.saveSettings();

    // 重置 runtime，指向新目录
    plugin._momentsRuntime = null;
    ensureMomentsRuntime(plugin);

    return { imported, beforeCount, afterCount, backup: backup.backupFolder };
}

/** 兼容旧名：碎碎念 + Ideas → Moments */
async function migrateSuisuiAndIdeasToMoments(plugin, opts = {}) {
    try {
        if (opts.force) {
            plugin.settings.momentsReadWriteMigrationV3 = false;
            await plugin.saveSettings();
        }
        return await migrateVaultIntoMomentsFolder(plugin);
    } catch (e) {
        console.error("[BrainCore] Moments 迁移失败，未写入完成标记：", e);
        const msg = String(e?.message || e || "");
        // 文件夹已存在等多半是并发/同步噪声：标记完成并静默，避免每次启动刷屏
        if (/already exists/i.test(msg)) {
            plugin.settings.pathMoments = plugin.settings.pathMoments || DEFAULT_MOMENTS_FOLDER;
            plugin.settings.momentsYearlyMigratedV2 = true;
            plugin.settings.momentsReadWriteMigrationV3 = true;
            plugin.settings.momentsImportedToMemoria = true;
            plugin.settings.momentsMigrated = true;
            await plugin.saveSettings();
            return { skipped: true, soft: true };
        }
        const last = Number(plugin.settings.momentsMigrationNoticeAt) || 0;
        const now = Date.now();
        const WEEK = 7 * 24 * 60 * 60 * 1000;
        if (opts.force || now - last > WEEK) {
            new Notice(`Moments 迁移未完成：${msg}。可命令面板运行「Moments：重试数据迁移」。`, 8000);
            plugin.settings.momentsMigrationNoticeAt = now;
            await plugin.saveSettings();
        }
        return null;
    }
}

async function importMomentsFolderIntoMemoria(plugin) {
    return migrateVaultIntoMomentsFolder(plugin);
}

// 兼容旧 MomentsView 符号：主视图由 BCMomentsCore.MomentsView 提供
class MomentsView {
    constructor(leaf, plugin) {
        const rt = ensureMomentsRuntime(plugin);
        const core = getMomentsCore();
        return new core.MomentsView(leaf, rt.store, rt.settings, rt);
    }
}
