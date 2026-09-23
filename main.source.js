const { Plugin, ItemView, WorkspaceLeaf, Modal, Notice, Menu, debounce, PluginSettingTab, Setting, requestUrl, Platform, TFile, normalizePath, FuzzySuggestModal, setIcon } = require('obsidian');

const PLUGIN_VERSION = "4.0.7";
const PLUGIN_WEEKLY_PROFILE = "personal";
const PLUGIN_TRIAL_HOURS = 0;
/** 构建时注入 docs/templates/文件墙.md；勿手写简易 dv.table 占位 */
const FILE_WALL_NOTE_TEMPLATE = "";
const PLUGIN_LICENSE_REQUIRED = false;
const PLUGIN_EDITION = "personal";
const PLUGIN_DISPLAY_NAME = "BrainCore LifeOS";
const PLUGIN_INTRO = "这是一个专为 Obsidian 开发的生活管理控制台。";
const PLUGIN_PHILOSOPHY_SUBTITLE = "Obsidian 知识库的「核心呼吸机」，它由 7 大模块组成，涵盖了时间感知、极速收集、工作流转、习惯养成与知识内化。一切信息从这里输入，最终也会在这里沉淀。";
const LICENSE_FINGERPRINT_LABEL = "设备指纹";
const LICENSE_FINGERPRINT_HINT = "基于 Obsidian appId；每台设备激活一次即可。手机与电脑的激活码都会保留，同步后互不覆盖（兼容旧版库名激活码）";
function getLifeOsVaultKey(app, suffix) {
    const vaultName = app.vault?.getName?.() || "UnknownVault";
    return `lifeos:${vaultName}:${suffix}`;
}

function maybeShowLifeOsSuitePrompt(app, selfId, selfName) {
    const catalog = [
        { id: "plain-ledger", name: "PlainLedger" },
        { id: "jinianri", name: "纪念日" },
        { id: "braincore-lifeos", name: "BrainCore LifeOS", altIds: ["braincore-lifeos-personal", "braincore-dashboard"] },
    ];
    const plugins = app.plugins?.plugins || {};
    const peers = catalog
        .filter((p) => {
            if (p.id === selfId || (p.altIds || []).includes(selfId)) return false;
            return !!(plugins[p.id] || (p.altIds || []).some((id) => plugins[id]));
        })
        .map((p) => p.name);
    if (!peers.length) return;
    const storageKey = getLifeOsVaultKey(app, "suitePromptSeen");
    try { if (localStorage.getItem(storageKey) === "1") return; } catch (e) { /* ignore */ }
    window.setTimeout(() => {
        new Notice(`${selfName} 可与 ${peers.join("、")} 并排使用，数据均保存在同一 Obsidian 库内。`, 8000);
        try { localStorage.setItem(storageKey, "1"); } catch (e) { /* ignore */ }
    }, 2200);
}

const BC_REFRESH_SCOPE_RANK = { light: 0, habits: 1, stats: 2, tasks: 3, full: 4 };

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

/** 「今天是哪天」一律按本地日历日算；toISOString 会切到 UTC，东八区凌晨会算成昨天。 */
function bcLocalDayKey(date = new Date()) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
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

async function countMoments(app, settings) {
    try {
        const plugin = resolveBrainCorePluginInstance(app);
        const memos = plugin?._momentsRuntime?.store?.getAll?.();
        // 空数组不能当真：runtime 刚建好、年文件还没扫完时 getAll() 是 []
        if (Array.isArray(memos) && memos.length > 0) {
            return memos.filter((memo) => !memo?.isDeleted).length;
        }
        const folder = normalizePath(settings?.pathMoments || "读&写/Moments").replace(/\/$/, "");
        const files = app.vault.getMarkdownFiles().filter((file) => {
            if (file.name.startsWith("_")) return false;
            return file.path === `${folder}.md` || file.path.startsWith(`${folder}/`);
        });
        let total = 0;
        for (const file of files) {
            const raw = await app.vault.cachedRead(file);
            // 与 Moments 解析器 / countMomentEntries 对齐：一条 = 一行 `- HH:mm`，不是日期标题
            total += (String(raw || "").match(/^-\s+\d{2}:\d{2}(?:\s|$)/gm) || []).length;
        }
        return total;
    } catch (e) {
        console.warn("[BrainCore] Moments 计数失败:", e);
        return 0;
    }
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
    const esc = (x) => String(x || "").replace(/"/g, '\"');
    const meetingSelector = `h2[data-heading*="${esc(s.meeting)}"]`;
    const weeklySelector = `h2[data-heading*="${esc(s.weekly)}"]`;
    const todoSelector = `h2[data-heading*="${esc(s.todo)}"]`;
    const dailySelector = `h2[data-heading*="${esc(s.daily)}"]`;
    // Colors applied via CSS variables on .braincore-weekly; only section-name selectors stay dynamic.
    return `
        .braincore-weekly { --bc-weekly-todo: ${colorTodo}; --bc-weekly-meeting: ${colorMeeting}; --bc-weekly-weekly: ${colorWeekly}; --bc-weekly-daily: ${colorDaily}; }
        .braincore-weekly ${todoSelector} { background-color: var(--bc-weekly-todo); }
        .braincore-weekly ${meetingSelector} { background-color: var(--bc-weekly-meeting); }
        .braincore-weekly ${weeklySelector} { background-color: var(--bc-weekly-weekly); }
        .braincore-weekly ${dailySelector} { background-color: var(--bc-weekly-daily); }
    `;
}
/** 从微信读书导出文件的高亮/读书笔记章节中提取有效引用。 */
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
// VIEW_TYPE_MOMENTS defined in src/moments.js (injected before module.exports)
const CLIP_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
let defuddleModule;

function getDefuddleModule() {
    // 发行包不再内置 defuddle.full.js；剪藏走 clipWithFallbackParser。
    if (defuddleModule !== undefined) return defuddleModule;
        defuddleModule = null;
        return null;
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

function fnv1a32Hex(str) {
    let hash = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193);
    }
    return (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

function computeExpectedLicenseKeyFromFingerprint(fp) {
    let hash = 0;
    for (let i = 0; i < fp.length; i++) {
        hash = (hash << 5) - hash + fp.charCodeAt(i);
        hash |= 0;
    }
    return "KEY-" + Math.abs(hash ^ 0x8899).toString(16).toUpperCase();
}

function computeStrongLicenseKeyFromFingerprint(fp) {
    const a = fnv1a32Hex(`${fp}|BC1`);
    const b = fnv1a32Hex(`${fp.split("").reverse().join("")}|LIFEOS`);
    return `BC1-${a}-${b}`;
}

function getExpectedLicenseKeys(app) {
    const keys = new Set();
    const fingerprints = [getDeviceFingerprint(app)];
    const vaultName = app.vault?.getName?.() || "UnknownVault";
    fingerprints.push("BC-" + hashStringToHex(String(vaultName)));
    for (const fp of fingerprints) {
        keys.add(computeExpectedLicenseKeyFromFingerprint(fp));
        keys.add(computeStrongLicenseKeyFromFingerprint(fp));
    }
    return keys;
}

function isLicenseValid(app, key) {
    if (!key || !String(key).trim()) return false;
    const normalized = String(key).trim().toUpperCase();
    for (const expected of getExpectedLicenseKeys(app)) {
        if (normalized === expected) return true;
    }
    return false;
}

/** 规范化激活码（去空白、大写） */
function normalizeLicenseKey(key) {
    return String(key || "").trim().toUpperCase();
}

/** 收集已存激活码：licenseKeys 数组 + 旧字段 licenseKey */
function collectStoredLicenseKeys(settings) {
    const out = [];
    const seen = new Set();
    const add = (raw) => {
        const n = normalizeLicenseKey(raw);
        if (!n || seen.has(n)) return;
        seen.add(n);
        out.push(n);
    };
    if (Array.isArray(settings?.licenseKeys)) settings.licenseKeys.forEach(add);
    add(settings?.licenseKey);
    return out;
}

/** 写入一把有效激活码到数组（不覆盖其它设备已存的码） */
function rememberLicenseKey(settings, key) {
    const n = normalizeLicenseKey(key);
    if (!n || !settings) return;
    if (!Array.isArray(settings.licenseKeys)) settings.licenseKeys = [];
    const existing = settings.licenseKeys.map((k) => normalizeLicenseKey(k));
    if (!existing.includes(n)) settings.licenseKeys.push(n);
    settings.licenseKey = n;
}

/** 旧版单码 → 数组；保证 licenseKeys 始终为数组 */
function ensureLicenseKeysMigrated(settings) {
    if (!settings || typeof settings !== "object") return;
    if (!Array.isArray(settings.licenseKeys)) settings.licenseKeys = [];
    const legacy = normalizeLicenseKey(settings.licenseKey);
    if (!legacy) return;
    const existing = settings.licenseKeys.map((k) => normalizeLicenseKey(k));
    if (!existing.includes(legacy)) settings.licenseKeys.push(legacy);
}

const BRAINCORE_PUBLIC_ID = "braincore-lifeos";
const BRAINCORE_PERSONAL_ID = "braincore-lifeos-personal";

function resolveBrainCorePluginInstance(app) {
    const plugins = app?.plugins?.plugins || {};
    return plugins[BRAINCORE_PUBLIC_ID] || plugins[BRAINCORE_PERSONAL_ID] || plugins["braincore-dashboard"] || null;
}

/** 旧目录 braincore-dashboard / BrainCore LifeOS → 统一 braincore-lifeos */
async function ensureAdapterDir(adapter, dir) {
    const parts = String(dir || "").split("/").filter(Boolean);
    let current = "";
    for (const part of parts) {
        current = current ? `${current}/${part}` : part;
        if (!(await adapter.exists(current))) await adapter.mkdir(current);
    }
}

async function adapterCopyFile(adapter, from, to) {
    if (typeof adapter.readBinary === "function" && typeof adapter.writeBinary === "function") {
        await adapter.writeBinary(to, await adapter.readBinary(from));
        return;
    }
    await adapter.write(to, await adapter.read(from));
}

async function adapterCopyDir(adapter, from, to) {
    if (!(await adapter.exists(from))) return { files: 0 };
    await ensureAdapterDir(adapter, to);
    let files = 0;
    const listing = typeof adapter.list === "function" ? await adapter.list(from) : { files: [], folders: [] };
    for (const file of listing.files || []) {
        const name = String(file).split("/").pop();
        await adapterCopyFile(adapter, file, `${to}/${name}`);
        files += 1;
    }
    for (const folder of listing.folders || []) {
        const name = String(folder).split("/").pop();
        files += (await adapterCopyDir(adapter, folder, `${to}/${name}`)).files;
    }
    return { files };
}

async function appendMigrationLog(adapter, logPath, payload) {
    const line = `${JSON.stringify({ ts: new Date().toISOString(), ...payload })}\n`;
    let prev = "";
    if (await adapter.exists(logPath)) {
        try { prev = await adapter.read(logPath); } catch (_) { prev = ""; }
    }
    await adapter.write(logPath, prev + line);
}

/** 个人版独立 id：从社区 id 目录迁 data，并禁用社区 id，避免市场更新盖掉个人版 */
async function migratePublicIdToPersonalInstall(plugin) {
    if ((plugin.manifest?.id || "") !== BRAINCORE_PERSONAL_ID) return false;
    const adapter = plugin.app?.vault?.adapter;
    const configDir = plugin.app?.vault?.configDir;
    if (!adapter || !configDir) return false;

    const pluginsDir = `${configDir}/plugins`;
    const personalDir = `${pluginsDir}/${BRAINCORE_PERSONAL_ID}`;
    const personalData = `${personalDir}/data.json`;
    const publicData = `${pluginsDir}/${BRAINCORE_PUBLIC_ID}/data.json`;
    const backupRoot = `${configDir}/.braincore-backups`;
    const logPath = `${backupRoot}/migration-log.jsonl`;
    let changed = false;

    const dataLooksSparse = (raw) => {
        try {
            const obj = JSON.parse(raw || "{}");
            if (!obj || typeof obj !== "object") return true;
            if (obj.licenseKey || (Array.isArray(obj.licenseKeys) && obj.licenseKeys.length) || obj.habitData || obj.habitsConfig || obj.pathWork || obj.pathTasks) return false;
            return Object.keys(obj).length < 5;
        } catch (_) {
            return true;
        }
    };

    await ensureAdapterDir(adapter, personalDir);
    let shouldCopy = !(await adapter.exists(personalData));
    if (!shouldCopy) {
        try {
            shouldCopy = dataLooksSparse(await adapter.read(personalData));
        } catch (_) {
            shouldCopy = true;
        }
    }
    if (shouldCopy && (await adapter.exists(publicData))) {
        try {
            const raw = await adapter.read(publicData);
            JSON.parse(raw || "{}");
            await adapter.write(personalData, raw);
            changed = true;
            await appendMigrationLog(adapter, logPath, { action: "copy-data-to-personal", from: publicData, to: personalData, ok: true });
        } catch (e) {
            console.warn("BrainCore 个人版迁移 data.json 失败:", e);
            await appendMigrationLog(adapter, logPath, { action: "copy-data-to-personal", ok: false, error: String(e?.message || e) });
        }
    }

    const cpPath = `${configDir}/community-plugins.json`;
    if (await adapter.exists(cpPath)) {
        try {
            const list = JSON.parse(await adapter.read(cpPath));
            if (Array.isArray(list)) {
                const next = list.filter((id) => id !== BRAINCORE_PUBLIC_ID && id !== "braincore-dashboard" && id !== "BrainCore LifeOS");
                if (!next.includes(BRAINCORE_PERSONAL_ID)) next.push(BRAINCORE_PERSONAL_ID);
                if (JSON.stringify(list) !== JSON.stringify(next)) {
                    await adapter.write(cpPath, JSON.stringify(next, null, 2) + "\n");
                    changed = true;
                }
            }
        } catch (e) {
            console.warn("BrainCore 个人版迁移 community-plugins 失败:", e);
        }
    }

    return changed;
}

async function migrateLegacyBrainCoreInstall(plugin) {
    const NEW_ID = BRAINCORE_PUBLIC_ID;
    if ((plugin.manifest?.id || NEW_ID) !== NEW_ID) return false;
    const adapter = plugin.app?.vault?.adapter;
    const configDir = plugin.app?.vault?.configDir;
    if (!adapter || !configDir) return false;

    const pluginsDir = `${configDir}/plugins`;
    const newDir = `${pluginsDir}/${NEW_ID}`;
    const newDataPath = `${newDir}/data.json`;
    const legacyDirs = ["braincore-dashboard", "BrainCore LifeOS"];
    const backupRoot = `${configDir}/.braincore-backups`;
    const logPath = `${backupRoot}/migration-log.jsonl`;
    let changed = false;

    const dataLooksSparse = (raw) => {
        try {
            const obj = JSON.parse(raw || "{}");
            if (!obj || typeof obj !== "object") return true;
            if (obj.licenseKey || (Array.isArray(obj.licenseKeys) && obj.licenseKeys.length) || obj.habitData || obj.habitsConfig || obj.pathWork || obj.pathTasks) return false;
            return Object.keys(obj).length < 5;
        } catch (_) {
            return true;
        }
    };

    const parseDataJson = (raw) => {
        const obj = JSON.parse(raw || "{}");
        if (!obj || typeof obj !== "object" || Array.isArray(obj)) throw new Error("data.json 不是对象");
        return obj;
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
                parseDataJson(raw);
                await adapter.write(newDataPath, raw);
                const reread = await adapter.read(newDataPath);
                if (reread !== raw) throw new Error("回读 data.json 与源不一致");
                parseDataJson(reread);
                await appendMigrationLog(adapter, logPath, { action: "copy-data", from: legacyData, to: newDataPath, ok: true });
                changed = true;
                break;
            } catch (e) {
                console.warn("BrainCore 迁移 data.json 失败:", e);
                await appendMigrationLog(adapter, logPath, { action: "copy-data", from: legacyData, ok: false, error: String(e?.message || e) });
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
        const stamp = Date.now();
        const quarantineDir = `${backupRoot}/legacy-plugins/${encodeURIComponent(legacy)}-${stamp}`;
        try {
            await ensureAdapterDir(adapter, `${backupRoot}/legacy-plugins`);
            let quarantined = false;
            if (typeof adapter.rename === "function") {
                try {
                    await adapter.rename(legacyDir, quarantineDir);
                    quarantined = await adapter.exists(quarantineDir);
                } catch (_) {
                    quarantined = false;
                }
            }
            if (!quarantined) {
                const copied = await adapterCopyDir(adapter, legacyDir, quarantineDir);
                const sourceHadData = await adapter.exists(`${legacyDir}/data.json`);
                if (sourceHadData) {
                    const src = await adapter.read(`${legacyDir}/data.json`);
                    const dst = await adapter.read(`${quarantineDir}/data.json`);
                    if (src !== dst) throw new Error("隔离区 data.json 校验失败");
                } else if (copied.files === 0 && !(await adapter.exists(quarantineDir))) {
                    throw new Error("隔离区为空");
                }
                await adapter.write(
                    `${legacyDir}/README-braincore-migration.txt`,
                    `此目录已备份到 ${quarantineDir}。BrainCore 不会自动删除未校验的旧安装。确认无误后可手动删除本文件夹。\n`
                );
            }
            await appendMigrationLog(adapter, logPath, { action: "quarantine", from: legacyDir, to: quarantineDir, ok: true });
            changed = true;
        } catch (e) {
            console.warn("BrainCore 无法隔离旧目录", legacy, e);
            await appendMigrationLog(adapter, logPath, { action: "quarantine", from: legacyDir, ok: false, error: String(e?.message || e) });
        }
    }

    return changed;
}

function syncLicenseState(app, settings) {
    ensureLicenseKeysMigrated(settings);
    let matched = "";
    for (const key of collectStoredLicenseKeys(settings)) {
        if (isLicenseValid(app, key)) {
            matched = key;
            break;
        }
    }
    settings.licenseActivated = !!matched;
    // 当前设备匹配到的码写回 licenseKey，便于界面展示；其它设备码仍留在 licenseKeys
    if (matched) settings.licenseKey = matched;
    return settings.licenseActivated;
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

function getEditionDisplayName(settings) {
    // 界面三档：体验版 / 公版 / 个人版（公版含需激活与免激活，均按 commercial 显示）
    // 体验包激活后按「公版」展示，避免标题仍写「体验版」造成歧义
    if (isTrialEdition()) {
        if (settings && settings.licenseActivated) return "公版";
        const h = getTrialHoursLabel();
        return h ? `${h}体验版` : "体验版";
    }
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

它把 **时间进度、快捷捕捉、待办总览、习惯打卡、每日金句、数据统计、周工作模板** 集中到一个固定入口，帮助你的知识库每天持续运转。`;
    }
    if (isCommercialWeeklyProfile()) {
        return `## 十四、一句话总结

BrainCore LifeOS 公版是面向《日拱一卒》等工作库的 Obsidian 侧边栏控制台，${isLicenseRequired() ? "激活后永久使用" : "免激活即可使用"}。

它把 **时间进度、快捷捕捉、待办总览、习惯打卡、每日金句、数据统计、周工作模板** 集中到一个固定入口，帮助你的知识库每天持续运转。`;
    }
    return `## 十四、一句话总结

BrainCore LifeOS 个人版是你的 Obsidian 侧边栏控制台，免激活即可使用。

它把 **时间进度、快捷捕捉、待办总览、习惯打卡、每日金句、数据统计、周工作模板** 集中到一个固定入口，帮助你的知识库每天持续运转。`;
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
    content = content.replace(/激活并进入 BrainCore/g, "激活");
    content = content.replace(/立即激活/g, "激活");
    content = content.replace(/验证并激活/g, "激活");
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
    return "激活成功。本设备永久有效；手机/电脑请各激活一次，两把码都会保留、同步后互不覆盖。";
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
        firstRunHint: (isLicenseRequired() && !settings.licenseActivated)
            ? (isTrialEdition()
                ? "试用满意后 ¥49.9 永久激活：小红书联系作者下单付款 → 复制下方设备指纹换激活码 → 粘贴后点「激活」。手机与电脑请各激活一次。"
                : "第一步：复制下方设备指纹发给作者获取激活码 → 粘贴激活码 → 点「激活」。手机与电脑请各激活一次，激活码会分别保留。")
            : undefined,
        onTrialStart: () => startTrialFromActivationPanel(plugin),
        getFingerprint: () => getVaultID(app),
        licenseKey: settings.licenseKey,
        activateShortLabel: "激活",
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
            if (!isLicenseValid(app, key)) {
                msgEl.textContent = "激活码不正确，请核对后再试";
                msgEl.addClass("error");
                return;
            }
            rememberLicenseKey(settings, key);
            syncLicenseState(app, settings);
                await plugin.saveSettings();
                bcNoticeSuccess(getActivationSuccessMessage());
                app.workspace.trigger("braincore:refresh");
                if (typeof onActivated === "function") await onActivated();
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

function isIgnoredStatPath(path) {
    const p = String(path || "").replace(/\\/g, "/");
    if (!p) return true;
    if (p.includes("Templates")) return true;
    if (p === ".trash" || p.startsWith(".trash/")) return true;
    if (p.startsWith(".obsidian/")) return true;
    if (p === "Scripts/braincore-stats-history.json" || p.endsWith("/braincore-stats-history.json")) return true;
    if (p === "Scripts/braincore-stats-cache.json" || p.endsWith("/braincore-stats-cache.json")) return true;
    if (p === "Scripts/braincore-quote-index.json" || p.endsWith("/braincore-quote-index.json")) return true;
    return false;
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

function getPendingTaskDisplayText(value) {
    const text = String(value || "")
        .replace(/<[^>]+>/g, "")
        .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")
        .replace(/\u00A0/g, " ")
        .trim();
    if (!text) return "";
    // Obsidian 文件中偶尔会遗留只有占位符的待办；它们没有可读内容，不应生成空圆点/复选框。
    const readableText = text.replace(/[📅⏳➕🛫✅].*$/u, "").trim();
    return readableText.replace(/[\s\-–—_*·•⋅☐□○◯\[\](){}]+/gu, "") ? text : "";
}

function hasRenderablePendingTaskContent(task) {
    return !!getPendingTaskDisplayText(task?.cleanText ?? task?.text ?? "");
}

function parsePendingTaskLine(line) {
    const raw = String(line || "");
    const match = raw.match(/^(\s*)(?:>\s*)?(?:-\s|\*\s)\[( )\]\s*(.*)$/);
    if (!match) return null;
    const cleanText = getPendingTaskDisplayText(match[3]);
    if (!cleanText) return null;
    return {
        indent: match[1],
        depth: getTaskIndentDepth(match[1]),
        cleanText,
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
    return (flatTasks || []).filter((t) => hasRenderablePendingTaskContent(t) && (t.depth || 0) === 0).length;
}

function groupTasksByFileOrder(flatTasks) {
    const orderedPaths = [];
    const groups = new Map();
    for (const t of (flatTasks || []).filter(hasRenderablePendingTaskContent)) {
        if (!groups.has(t.path)) {
            groups.set(t.path, []);
            orderedPaths.push(t.path);
        }
        groups.get(t.path).push(t);
    }
    return orderedPaths.map((path) => ({ path, tasks: groups.get(path) }));
}

function mountSidebarTaskNode(parent, node) {
    const item = parent.createDiv({ cls: "sb-task-item" });
    const checkbox = item.createDiv({ cls: "sb-task-checkbox", attr: { title: "点击完成", role: "button", tabindex: "0" } });
    checkbox.dataset.bcAction = "complete-task";
    checkbox.dataset.taskPath = node.path;
    checkbox.dataset.taskLine = String(node.lineNum);
    checkbox.dataset.taskText = encodeURIComponent(node.text);
    const text = item.createDiv({ cls: "sb-task-text", text: node.cleanText, attr: { title: "点击编辑", role: "button", tabindex: "0" } });
    text.dataset.bcAction = "open-task-file";
    text.dataset.taskPath = node.path;
    if (node.children?.length) {
        const children = parent.createDiv({ cls: "sb-task-children" });
        node.children.forEach((child) => mountSidebarTaskNode(children, child));
    }
}

function mountSidebarTaskForest(parent, flatTasks) {
    parent.empty();
    groupTasksByFileOrder(flatTasks).forEach(({ tasks }) => {
        buildTaskHierarchy(tasks).forEach((node) => mountSidebarTaskNode(parent, node));
    });
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
        if (vault.getAbstractFileByPath(current)) continue;
        try {
            await vault.createFolder(current);
        } catch (e) {
            const msg = String(e?.message || e || "");
            // iCloud / 并发：目录其实已在，Obsidian 仍可能抛 Folder already exists
            if (/already exists/i.test(msg)) continue;
            throw e;
        }
    }
}

/** 文件墙笔记正文：完整卡片看板（最近上传 + 四分类）；路径随当前附件根注入 */
function applyFileWallRootsToTemplate(tpl, settings) {
    const roots = getBuiltinAttachmentRoots(settings || {});
    const sections = [
        "const SECTIONS = [",
        `    { title: "🖼️ 图片", folder: ${JSON.stringify(roots.images)}, mode: "image" },`,
        `    { title: "📑 PDF", folder: ${JSON.stringify(roots.pdf)}, mode: "pdf" },`,
        `    { title: "🎬 音视频", folder: ${JSON.stringify(roots.media)}, mode: "media" },`,
        `    { title: "📎 附件", folder: ${JSON.stringify(roots.files)}, mode: "file" },`,
        "];",
    ].join("\n");
    const text = String(tpl || "");
    if (/const SECTIONS = \[/.test(text)) {
        return text.replace(/const SECTIONS = \[[\s\S]*?\];/, sections);
    }
    return text;
}

function getFileWallNoteContent(settings) {
    const tpl = typeof FILE_WALL_NOTE_TEMPLATE === "string" ? FILE_WALL_NOTE_TEMPLATE.trim() : "";
    if (tpl) return `${applyFileWallRootsToTemplate(tpl, settings)}\n`;
    return [
        "```dataviewjs",
        "// 文件墙：请重装/更新 BrainCore，以恢复完整卡片看板模板。",
        'dv.paragraph("文件墙模板未注入。请更新 BrainCore 后删除本笔记再点「文件」重新生成。");',
        "```",
        "",
    ].join("\n");
}

/** 仅升级已知简易占位，不覆盖用户自定义 DataviewJS 看板 */
function isStubFileWallNote(content) {
    const text = String(content || "");
    if (!text.trim()) return true;
    if (/最近上传/.test(text) && /custom-lib-wrapper/.test(text)) return false;
    if (/需启用 Dataview/.test(text)) return true;
    if (/dv\.table\(\s*\[\s*["']文件["']/.test(text)) return true;
    return false;
}

function isFileWallOfficialBoard(content) {
    const text = String(content || "");
    return /最近上传/.test(text) && /custom-lib-wrapper/.test(text) && /const SECTIONS = \[/.test(text);
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
        document.body.removeClass("bc-mobile-force-top");
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
        /* clip confirm styles via styles.css */
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

function customDebounce(f, w) {
    let t;
    const wrapped = function (...a) {
        clearTimeout(t);
        t = setTimeout(() => f.apply(this, a), w);
    };
    wrapped.cancel = function () {
        clearTimeout(t);
        t = null;
    };
    return wrapped;
}

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

/** 无 Attachment Management 时按扩展名落到文件墙同款四目录（相对 pathAttachments 的父级） */
function getBuiltinAttachmentRoots(settings) {
    const files = getAttachmentFolder(settings);
    const parent = files.includes("/") ? files.substring(0, files.lastIndexOf("/")) : "Boxes";
    return {
        images: joinVaultPath(parent, "图片"),
        pdf: joinVaultPath(parent, "PDF"),
        media: joinVaultPath(parent, "音视频"),
        files,
    };
}

function getBuiltinAttachmentFolderByExt(settings, extension) {
    const ext = String(extension || "").replace(/^\./, "").toLowerCase();
    const roots = getBuiltinAttachmentRoots(settings);
    if (/^(png|jpe?g|gif|webp|svg|bmp|heic|heif|tiff?)$/i.test(ext)) return roots.images;
    if (ext === "pdf") return roots.pdf;
    if (/^(mp3|wav|m4a|aac|flac|ogg|opus|mp4|m4v|mov|webm|avi|mkv)$/i.test(ext)) return roots.media;
    return roots.files;
}

function getAttachmentMgmtSettings(app) {
    const plugin = app.plugins?.plugins?.["attachment-management"];
    if (!plugin?.settings?.attachPath) return null;
    return plugin.settings;
}

/** AM 根目录是否落在内置 Boxes 父级下（否则跟随会与文件墙脱节） */
function isAmAlignedWithBuiltinBoxes(amSettings, bcSettings) {
    if (!amSettings?.attachPath) return false;
    const roots = getBuiltinAttachmentRoots(bcSettings || {});
    const boxesParent = roots.files.includes("/")
        ? roots.files.substring(0, roots.files.lastIndexOf("/"))
        : "Boxes";
    const setting = amSettings.attachPath;
    const root = String(setting.attachmentRoot || "").replace(/^\/+|\/+$/g, "");
    const underBoxes = (p) => {
        const s = String(p || "").replace(/^\/+|\/+$/g, "");
        if (!s) return true;
        return s === boxesParent || s.startsWith(`${boxesParent}/`)
            || s === "图片" || s === "PDF" || s === "音视频" || s === "附件"
            || /\/(图片|PDF|音视频|附件)$/.test(s);
    };
    if (setting.saveAttE === "nextToNote") return false;
    if (setting.saveAttE === "inFolderBelow" || !setting.saveAttE) {
        if (!underBoxes(root)) return false;
        const overrides = setting.extensionOverride || [];
        if (!overrides.length) return underBoxes(root);
        return overrides.every((item) => underBoxes(item?.attachmentRoot || item?.attachPath || root));
    }
    return underBoxes(root);
}

/** 可跟随的 AM：已安装、设置允许跟随、且根目录对齐 Boxes */
function getFollowableAmSettings(app, bcSettings) {
    if (bcSettings?.followAttachmentManagement === false) return null;
    const am = getAttachmentMgmtSettings(app);
    if (!am) return null;
    if (!isAmAlignedWithBuiltinBoxes(am, bcSettings)) return null;
    return am;
}

function getDataviewRuntimeStatus(app) {
    const plugin = app?.plugins?.plugins?.dataview;
    if (!plugin) return { installed: false, jsEnabled: false, api: null };
    const s = plugin.settings || {};
    const jsEnabled = s.enableDataviewJs !== false && s.enableJavaScriptQueries !== false;
    return { installed: true, jsEnabled, api: plugin.api || null };
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
    // 已安装且可读到 AM 配置、且对齐 Boxes → 严格跟 AM；否则内置四分类
    const am = getFollowableAmSettings(app, bcSettings);
    if (am) {
        const attachSetting = getAmEffectiveAttachSetting(am, notePath);
        const extSetting = getAmExtensionOverrideSetting(attachSetting, ext);
        const folder = getAmAttachmentDirectory(app, am, notePath, ext);
        const fileName = extSetting
            ? buildAmAttachmentFileName(am, attachSetting, ext, originalBaseName, notePath)
            : `${buildMaterialDefaultStem(ext, originalBaseName, am.dateFormat || "YYYYMMDD")}.${ext}`;
        return joinVaultPath(folder, fileName);
    }
    const folder = getBuiltinAttachmentFolderByExt(bcSettings, ext);
    if (fileInfo?.preferredName) return joinVaultPath(folder, fileInfo.preferredName);
    return joinVaultPath(folder, `${sanitizeAmFileStem(originalBaseName)}.${ext}`);
}

function resolveMaterialAttachmentPath(app, bcSettings, fileInfo, notePath, customBaseName) {
    const ext = String(fileInfo?.extension || "bin").replace(/^\./, "").toLowerCase();
    const baseName = sanitizeAmFileStem(customBaseName || fileInfo?.originalBaseName || "素材");
    const fileName = `${baseName}.${ext}`;
    const am = getFollowableAmSettings(app, bcSettings);
    if (am) {
        const folder = getAmAttachmentDirectory(app, am, notePath, ext);
        return joinVaultPath(folder, fileName);
    }
    return joinVaultPath(getBuiltinAttachmentFolderByExt(bcSettings, ext), fileName);
}

function getMaterialTargetFolderLabel(app, bcSettings, extension, notePath) {
    const ext = String(extension || "bin").replace(/^\./, "").toLowerCase();
    const am = getFollowableAmSettings(app, bcSettings);
    if (am) return getAmAttachmentDirectory(app, am, notePath, ext);
    return getBuiltinAttachmentFolderByExt(bcSettings, ext);
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
    licenseKey: "", licenseKeys: [], licenseActivated: false, trialStartedAt: "", trialWelcomeSeen: false, trialReminder2hSeen: false, trialReminder30mSeen: false,
    lastSeenVersion: "", welcomeGuideVersion: "", usageGuideAutoShownForVersion: "", attachmentMgmtHintSeen: false, basicStructureReady: false, captureCategoryHintSeen: false,
    lastCaptureCategory: "moments", 
    weeklySectionTodo: "", weeklySectionMeeting: "", weeklySectionWeekly: "", weeklySectionDaily: "",
    pathIdeas: "Inbox/Ideas.md", pathMoments: "读&写/Moments", momentsMigrated: false, momentsImportedToMemoria: false, momentsYearlyMigratedV2: false, momentsReadWriteMigrationV3: false, momentsMigrationNoticeAt: 0, momentsSettings: null, pathTasks: "Inbox/Tasks.md", pathEssays: "读&写/随笔.md", pathWork: "Work", pathClippings: "Inbox/Clippings", pathClipReflections: "读&写/剪藏感悟", clipCategories: ["科技", "人文", "娱乐", "AI", "学习"], pathDrafts: "Inbox/草稿.md", pathAttachments: "Boxes/附件", pathMaterials: "Boxes/文件墙.md", followAttachmentManagement: true, pathQuotes: "Weread", habitData: {}, statsHistory: {}, 
    defaultLat: "31.81", defaultLon: "119.97",
    weatherCoordsCustom: false,
    weatherAutoLocate: false,
    habitsConfig: [ { id: "fitness", n: "健身", i: "🏋️" }, { id: "reading", n: "阅读", i: "📖" }, { id: "nosmoking", n: "戒烟", i: "🚭" } ],
    colorTodo: "#FAF9DE", colorMeeting: "#E3EDCD", colorWeekly: "#DCE2F1", colorDaily: "#FDE6E0",
    modules: [ { id: 'greeting', name: '问候+天气+进度+金句', enabled: true }, { id: 'progress', name: '时间进度', enabled: true }, { id: 'buttons', name: '快捷捕捉', enabled: true }, { id: 'tasks', name: '待办总览', enabled: true }, { id: 'habits', name: '习惯打卡', enabled: true }, { id: 'quote', name: '每日金句', enabled: true }, { id: 'stats', name: '数据统计', enabled: true } ]
};

const ICONS = { zap:`<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`, clock:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`, mic:`<svg viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>`, moments:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`, archive:`<svg viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`, expand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`, upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`, tag:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/></svg>`, uList:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></svg>`, oList:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`, time:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`, flag:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`, doc:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`, temp:`<svg viewBox="0 0 24 24"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path></svg>`, wind:`<svg viewBox="0 0 24 24"><path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.5 8a2.5 2.5 0 1 1 2 2H2"/><path d="M9.8 4.4A2 2 0 1 1 11 8H2"/></svg>` };

/** Mobile soft-keyboard: shrink input + keep actions above keyboard via visualViewport. */
function bindBcMobileKeyboardGuard(host, opts = {}) {
    if (!host?.app?.isMobile) return () => {};
    const modalEl = host.modalEl;
    const getScrollTarget = opts.getScrollTarget || (() => null);
    const getTextArea = opts.getTextArea || (() => null);
    let raf = 0;
    const apply = () => {
        const vv = window.visualViewport;
        const measured = vv ? Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)) : 0;
        const focused = document.activeElement && (document.activeElement.tagName === "TEXTAREA" || document.activeElement.tagName === "INPUT");
        // iOS 有时会收缩 layout viewport 导致测得 0，建议条仍会盖住底排分类，至少抬 18px
        const kb = Math.max(measured, focused ? 18 : 0);
        document.body.style.setProperty("--bc-kb-inset", `${kb}px`);
        if (kb > 8 || focused) {
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
        document.body.removeClass("bc-mobile-force-top");
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
        ["bc-material-modal-styles", "bc-material-modal-styles-v2", "bc-material-modal-styles-v3", "bc-material-modal-styles-v4", "bc-material-modal-styles-v5"].forEach((id) => {
            const prev = document.getElementById(id);
            if (prev) prev.remove();
        });
        /* material modal styles via styles.css */
        contentEl.createEl("h2", { text: "保存素材", cls: "bc-material-title" });
        const hasAm = !!getAttachmentMgmtSettings(this.app);
        contentEl.createEl("p", {
            text: hasAm
                ? "已检测到 Attachment Management：捕捉/素材将严格按 AM 规则存放（全库粘贴等也由 AM 接管）。"
                : "未安装 Attachment Management：捕捉/素材走 BrainCore 内置四分类（图片 / PDF / 音视频 / 附件）。全库其它笔记粘贴建议安装 AM。",
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

function getCaptureCategoryKey(item) {
    if (!item) return "";
    if (item.isWork) return "work";
    if (item.isLife) return "life";
    if (item.isIdea) return "moments";
    if (item.isEssay) return "essay";
    if (item.isClipper) return "clipper";
    if (item.isMaterial) return "material";
    if (item.isDraft) return "draft";
    return String(item.label || "");
}

function mountCaptureCategoryRow(container, btnRow, items, options = {}) {
    const { getTip, onCategoryClick, withTipMenu, app, activeKey, onActiveChange } = options;
    const buttons = new Map();
    let currentKey = "";

    const setActive = (key) => {
        currentKey = key;
        buttons.forEach((btn, btnKey) => {
            const active = btnKey === key;
            btn.toggleClass("is-active", active);
            btn.setAttr("aria-pressed", active ? "true" : "false");
        });
        if (typeof onActiveChange === "function") onActiveChange(key);
    };

    const mountItem = (row, item) => {
        const tip = typeof getTip === "function" ? getTip(item) : (item.tip || item.label);
        const key = getCaptureCategoryKey(item);
        const btn = row.createEl("button", {
            cls: "bc-row-item",
            attr: { type: "button", title: tip, "aria-label": `${item.label}：${tip}`, "aria-pressed": "false" },
        });
        buttons.set(key, btn);
        const icon = btn.createDiv({ cls: "bc-row-icon" });
        if (item.iconName) {
            setIcon(icon, item.iconName);
        } else if (typeof item.icon === "string" && item.icon.trim().startsWith("<svg")) {
            icon.empty();
            const svgHost = icon.createDiv({ cls: "bc-row-icon-svg" });
            svgHost.innerHTML = item.icon;
        } else {
            icon.setText(item.icon);
        }
        btn.createSpan({ text: item.label });
        btn.addEventListener("click", () => {
            setActive(key);
            onCategoryClick(item);
        });
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
    const initial = buttons.has(activeKey) ? activeKey : "";
    if (initial) setActive(initial);
    return {
        buttons,
        setActive,
        getActiveKey: () => currentKey,
        getItem: (key) => {
            const wanted = key === undefined ? currentKey : key;
            return items.find((item) => getCaptureCategoryKey(item) === wanted) || null;
        },
    };
}

class CaptureModal extends Modal {
    constructor(app, plugin) {
        super(app);
        this.plugin = plugin;
        this.pendingImages = [];
        this.useSource = false;
        this.isExpanded = false;
        this.injectStyles();
        if (this.app.isMobile) {
            document.body.addClass("bc-mobile-force-top");
            this.modalEl.addClass("bc-modal-container");
        }
    }

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
                // ⌘⇧↩ 单独留给草稿，⌘↩ 与 Moments「发布」同义：提交到当前高亮分类。
                if (e.shiftKey) { void this.processSave({ isDraft: true }); return; }
                void this.submitActiveCategory();
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
        this.addTool(toolbar, ICONS.expand, () => this.toggleSize(), "放大 / 还原输入框"); 
        this.addTool(toolbar, ICONS.upload, () => this.triggerUpload(), "上传文件"); 
        this.addTool(toolbar, ICONS.tag, () => this.pickAndInsertTag(), "插入标签"); 
        this.addTool(toolbar, ICONS.uList, () => this.insertAtCursor("- "), "插入无序列表"); 
        this.addTool(toolbar, ICONS.oList, () => this.insertAtCursor("1. "), "插入有序列表"); 
        
        const timeBtn = this.addTool(toolbar, ICONS.time, (e) => this.insertSmartDateTime(e), "插入日期时间"); 
        timeBtn.addClass("bc-desktop-only");

        this.addTool(toolbar, ICONS.flag, (e) => this.showPriorityMenu(e), "设置优先级"); 
        this.addTool(toolbar, ICONS.doc, (e) => this.showDraftHistory(e), "草稿历史");
        
        if (!this.app.isMobile) {
            this.hintEl = contentEl.createDiv({ cls: "bc-capture-hint" });
            this.hintEl.style.cssText = "font-size:11px;color:var(--text-muted);text-align:center;margin:0 0 4px;opacity:0.85;";
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
            { label: "Moments", iconName: "sparkles", isIdea: true, tip: "写入 Moments 年文件（读&写/Moments/YYYY.md）" },
            { label: "随笔", icon: "📝", isEssay: true, tip: "写入随笔（年/月/周结构）" },
            { label: "剪藏", icon: "🔖", isClipper: true, tip: "需在输入框粘贴 http(s):// 网页链接" },
            { label: "素材", icon: "🎨", isMaterial: true, tip: "仅保存图片/PDF/音视频等文件，不可附带文字" },
            { label: "草稿", icon: "📋", isDraft: true, tip: "写入草稿区（有序列表）" }
        ];
        this.categoryRow = mountCaptureCategoryRow(contentEl, btnRow, items, {
            getTip: (item) => item.tip,
            onCategoryClick: (item) => item.isMaterial ? this.processMaterialSave() : this.processSave(item),
            withTipMenu: true,
            app: this.app,
            activeKey: this.getRememberedCategoryKey(items),
            onActiveChange: (key) => this.rememberCategory(key),
        });
        this.syncCaptureHint();
        if (this.app.isMobile) {
            this._kbGuardCleanup = bindBcMobileKeyboardGuard(this, {
                getTextArea: () => this.textArea,
                getScrollTarget: () => btnRow
            });
        }
        setTimeout(() => this.textArea.focus(), 250);
    }

    getRememberedCategoryKey(items) {
        const remembered = String(this.plugin.settings.lastCaptureCategory || "");
        const known = items.some((item) => getCaptureCategoryKey(item) === remembered);
        // 没有记忆时默认落在 Moments：⌘↩ 与 Moments「发布」是同一套心智。
        return known ? remembered : "moments";
    }

    rememberCategory(key) {
        if (!key || this.plugin.settings.lastCaptureCategory === key) {
            this.syncCaptureHint();
            return;
        }
        this.plugin.settings.lastCaptureCategory = key;
        void this.plugin.saveSettings();
        this.syncCaptureHint();
    }

    syncCaptureHint() {
        if (!this.hintEl) return;
        const item = this.categoryRow?.getItem?.();
        const label = item?.label || "Moments";
        this.hintEl.setText(`⌘/Ctrl+Enter 提交到「${label}」（点分类可换） · ⌘/Ctrl+Shift+Enter 存草稿`);
    }

    async submitActiveCategory() {
        const item = this.categoryRow?.getItem?.();
        if (!item) {
            bcNoticeWarn("请先点一个分类，再用 ⌘/Ctrl+Enter 提交");
            return false;
        }
        return item.isMaterial ? this.processMaterialSave() : this.processSave(item);
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
                // 保存附件前先补齐 Boxes / 附件等目录，避免空库首次上传报错
                await this.plugin.ensureAttachmentFoldersReady();
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
                const momentBody = s ? `${body}${s}` : body;
                await createMomentEntry(this.app, this.plugin, { body: momentBody });
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
    
    addTool(parent, svg, cb, label = "") { const btn = parent.createEl("button", { cls: "bc-tool-btn", attr: { type: "button", "aria-label": label || "工具", title: label || "" } }); btn.innerHTML = svg; if (cb) btn.onclick = (e) => { e.preventDefault(); cb(e); }; return btn; }
    
    injectStyles() {
        // Styles ship via styles.css (bc-capture-modal.css). Only clean legacy injected tags.
        ["bc-capture-modal-styles", "bc-capture-modal-styles-v241", "bc-capture-modal-styles-v242", "bc-capture-modal-styles-v244", "bc-capture-modal-styles-v245", "bc-capture-modal-styles-v259", "bc-capture-modal-styles-v260", "bc-capture-modal-styles-v261", "bc-capture-modal-styles-v262", "bc-capture-modal-styles-v263", "bc-capture-modal-styles-v264", "bc-capture-modal-styles-v265", "bc-capture-modal-styles-v266", "bc-capture-modal-styles-v267", "bc-capture-modal-styles-v268", "bc-capture-modal-styles-v269", "bc-capture-modal-styles-v270", "bc-capture-modal-styles-v271", "bc-capture-modal-styles-v272", "bc-capture-modal-styles-v273", "bc-capture-modal-styles-v274"].forEach((id) => {
            const prev = document.getElementById(id);
            if (prev) prev.remove();
        });
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

/** 在系统文件管理器里定位库内文件；移动端或非 Electron 环境退化成提示路径。 */
function revealVaultFileInFileManager(app, vaultPath) {
    const adapter = app?.vault?.adapter;
    if (adapter && typeof adapter.getFullPath === "function" && typeof window.require === "function") {
        try {
            const full = adapter.getFullPath(vaultPath);
            if (full) {
                window.require("electron").shell.showItemInFolder(full);
                return true;
            }
        } catch (e) { /* 移动端或沙箱环境，走下面的提示 */ }
    }
    bcNoticeInfo(`当前平台无法直接打开文件管理器，路径：${vaultPath}`);
    return false;
}

function renderBrainCoreStorageTable(containerEl, dataPath) {
    const rows = [
        ["内容类型", "存放位置", "谁会写", "刷新策略"],
        ["笔记 / 待办 / 随笔 / 剪藏", "库内笔记路径（见「路径」Tab）", "你 + 插件", "Obsidian 保存即生效"],
        ["Moments 记录", "读&写/Moments/YYYY.md（普通 Markdown）", "插件 + Mac App", "文件变更后自动重读年文件"],
        ["打卡数据 / 插件设置 / Moments 设置", dataPath, "插件 + Mac App", "插件每隔几秒比对 mtime，外部改动会自动合并"],
    ];
    const table = containerEl.createDiv({ cls: "bc-storage-table" });
    rows.forEach((cells, index) => {
        const row = table.createDiv({ cls: index === 0 ? "bc-storage-row is-head" : "bc-storage-row" });
        cells.forEach((cell) => row.createSpan({ text: cell }));
    });
    containerEl.createEl("p", {
        cls: "setting-item-description",
        text: "一句话记住：能自己翻的都在库里，配置和打卡在 data.json。Mac App 只往年文件和 data.json 写，不动你别的笔记。",
    });
    return table;
}

function renderBrainCoreMomentsSettingsPanel(containerEl, plugin, tab) {
    const grid = containerEl.createDiv({ cls: "bc-settings-grid" });
    const read = () => (typeof getMomentsSettingsSnapshot === "function" ? getMomentsSettingsSnapshot(plugin) : (plugin.settings.momentsSettings || {}));
    const write = async (key, value) => {
        if (typeof updateMomentsSetting === "function") await updateMomentsSetting(plugin, key, value);
        else {
            const saved = (plugin.settings.momentsSettings = plugin.settings.momentsSettings || {});
            saved[key] = value;
            await plugin.saveSettings();
        }
        if (typeof refreshOpenMomentsViews === "function") refreshOpenMomentsViews(plugin);
    };

    const basicCard = grid.createDiv({ cls: "bc-settings-block bc-settings-rich-block" });
    new Setting(basicCard).setName('✨ Moments').setHeading();
    basicCard.createEl('p', {
        text: '速记本体的常用开关。记录写入年文件，设置本身保存在插件 data.json。',
        cls: 'setting-item-description',
    });

    new Setting(basicCard)
        .setName('年文件目录')
        .setDesc('Moments 按年写入此目录，例如 读&写/Moments/2026.md')
        .addText(t => t
            .setPlaceholder('读&写/Moments')
            .setValue(plugin.settings.pathMoments || '读&写/Moments')
            .onChange(v => {
                plugin.settings.pathMoments = (v || '').trim() || '读&写/Moments';
                plugin._momentsRuntime = null;
                plugin.saveSettings();
            }));

    new Setting(basicCard)
        .setName('发送快捷键')
        .setDesc('输入框的发布键。⌘/Ctrl+Enter 没反应时，多半被 Obsidian 占用，可改成 Enter。')
        .addDropdown(d => {
            d.addOption('ctrl-enter', '⌘/Ctrl+Enter 发布（Enter 换行）');
            d.addOption('enter', 'Enter 发布（Shift+Enter 换行）');
            d.setValue(read().sendHotkey === 'enter' ? 'enter' : 'ctrl-enter');
            d.onChange(async v => { await write('sendHotkey', v); });
        });

    new Setting(basicCard)
        .setName('移动端输入入口')
        .setDesc('仅手机 / 平板生效。浮动按钮模式下输入框先收起，点右下角 ➕ 才展开。')
        .addDropdown(d => {
            d.addOption('fab', '右下角浮动按钮（推荐）');
            d.addOption('always-visible', '输入框常驻底部');
            d.setValue(read().mobileInputStyle === 'always-visible' ? 'always-visible' : 'fab');
            d.onChange(async v => { await write('mobileInputStyle', v); });
        });

    new Setting(basicCard)
        .setName('每日目标')
        .setDesc('侧栏进度条的满值，按每天想写几条来定。')
        .addSlider(s => s
            .setLimits(1, 30, 1)
            .setValue(Number(read().dailyGoal) || 5)
            .setDynamicTooltip()
            .onChange(async v => { await write('dailyGoal', v); }));

    new Setting(basicCard)
        .setName('每页条数')
        .setDesc('瀑布流每次加载多少条，滚动到底自动续读。')
        .addDropdown(d => {
            ['20', '50', '100', '200'].forEach(v => d.addOption(v, `${v} 条`));
            d.setValue(String(Number(read().pageSize) || 50));
            d.onChange(async v => { await write('pageSize', parseInt(v, 10) || 50); });
        });

    createBcCollapsibleBlock(grid, plugin, 'momentsAdvanced', '阅读与浏览（进阶）', '折叠行数、密度、宽度等非必调项。', (body) => {
        new Setting(body)
            .setName('长笔记折叠')
            .setDesc('超过设定行数自动折叠，底部出现「继续读」。选「永不折叠」则全文展开。图片始终完整显示。')
            .addDropdown(d => {
                [['0', '永不折叠'], ['4', '4 行'], ['6', '6 行'], ['8', '8 行（推荐）'], ['12', '12 行'], ['20', '20 行']]
                    .forEach(([value, label]) => d.addOption(value, label));
                const current = read().collapseLineLimit;
                d.setValue(String(Number.isFinite(Number(current)) ? Number(current) : 8));
                d.onChange(async v => { await write('collapseLineLimit', parseInt(v, 10) || 0); });
            });
        new Setting(body)
            .setName('视图密度')
            .setDesc('紧凑会压短正文、缩小图片，适合一次扫很多条；宽松是默认卡片高度。')
            .addDropdown(d => {
                d.addOption('cozy', '宽松');
                d.addOption('compact', '紧凑');
                d.setValue(read().density === 'compact' ? 'compact' : 'cozy');
                d.onChange(async v => { await write('density', v); });
            });
        new Setting(body)
            .setName('内容宽度')
            .setDesc('面板拉宽后才看得出：专注更窄、均衡适中、宽阔铺满。侧栏很窄时三种看起来差不多。')
            .addDropdown(d => {
                d.addOption('focused', '专注');
                d.addOption('balanced', '均衡（推荐）');
                d.addOption('wide', '宽阔');
                d.setValue(['focused', 'wide'].includes(read().contentWidth) ? read().contentWidth : 'balanced');
                d.onChange(async v => { await write('contentWidth', v); });
            });
        new Setting(body)
            .setName('侧栏年份列表')
            .setDesc('记录跨度很长时年份列表会很长，可以关掉。')
            .addToggle(t => t
                .setValue(read().showSidebarYears !== false)
                .onChange(async v => { await write('showSidebarYears', !!v); }));
        new Setting(body)
            .setName('发送后清空输入框')
            .addToggle(t => t
                .setValue(read().clearAfterSave !== false)
                .onChange(async v => { await write('clearAfterSave', !!v); }));
        new Setting(body)
            .setName('智能抽选')
            .setDesc('点「随机抽一张」时，优先抽很久没打开过的记录；关掉则完全随机。')
            .addToggle(t => t
                .setValue(read().enableSmartReview !== false)
                .onChange(async v => { await write('enableSmartReview', !!v); }));
        new Setting(body)
            .setName('情感色彩')
            .setDesc('按开心、生气等关键词给卡片左边加一条明显色带，并带一层浅底。关键词会误判，默认关。')
            .addToggle(t => t
                .setValue(!!read().enableMoodColoring)
                .onChange(async v => { await write('enableMoodColoring', !!v); }));
        new Setting(body)
            .setName('Vim 快捷键')
            .setDesc('j/k 上下选卡片，Enter 编辑，/ 搜索，i 写新记录。打开 Moments 后直接按即可；正在输入框里打字时不会触发。默认关。')
            .addToggle(t => t
                .setValue(!!read().enableVimKeys)
                .onChange(async v => { await write('enableVimKeys', !!v); }));
        new Setting(body)
            .setName('启动时打开 Moments')
            .setDesc('Obsidian 恢复完工作区后自动切到 Moments。')
            .addToggle(t => t
                .setValue(!!read().openOnStartup)
                .onChange(async v => { await write('openOnStartup', !!v); }));
    }, { defaultExpanded: false });

    createBcCollapsibleBlock(grid, plugin, 'momentsShare', '分享水印', '分享图底栏：左侧标题（分享时可填，空则用附加文案），右侧头像、名称与日期。', (body) => {
        const msShare = (plugin.settings.momentsSettings = plugin.settings.momentsSettings || {});
        const syncMomentsShare = async () => {
            if (plugin._momentsRuntime?.settings) {
                plugin._momentsRuntime.settings.shareAuthorName = msShare.shareAuthorName || "";
                plugin._momentsRuntime.settings.shareAuthorBio = msShare.shareAuthorBio || "";
                plugin._momentsRuntime.settings.shareAvatar = msShare.shareAvatar || "";
            }
            await plugin.saveSettings();
        };
        new Setting(body).setName('作者名称').setDesc('水印右侧显示，如「囍樂」').addText(t => t
            .setPlaceholder('你的名字')
            .setValue(msShare.shareAuthorName || "")
            .onChange(async v => { msShare.shareAuthorName = v; await syncMomentsShare(); }));
        new Setting(body).setName('附加文案').setDesc('分享未填标题时，显示在水印左侧').addText(t => t
            .setPlaceholder('可选，如签名 / 一句话')
            .setValue(msShare.shareAuthorBio || "")
            .onChange(async v => { msShare.shareAuthorBio = v; await syncMomentsShare(); }));
        const avatarSetting = new Setting(body).setName('头像').setDesc('可从仓库选，或从本地/相册导入到 Boxes/图片');
        avatarSetting.settingEl.addClass('bc-settings-avatar-row');
        avatarSetting.addText(t => {
            t.setPlaceholder('Boxes/图片/share-avatar.png')
                .setValue(msShare.shareAvatar || "")
                .onChange(async v => { msShare.shareAvatar = v.trim(); await syncMomentsShare(); });
            tab._momentsAvatarInput = t;
        });
        avatarSetting.addButton(b => b.setButtonText('从仓库选择').onClick(() => {
            const input = tab._momentsAvatarInput;
            class MomentsAvatarSuggest extends FuzzySuggestModal {
                getItems() {
                    return this.app.vault.getFiles().filter(f => /^(png|jpe?g|gif|webp|svg)$/i.test(f.extension));
                }
                getItemText(file) { return file.path; }
                onChooseItem(file) {
                    msShare.shareAvatar = file.path;
                    if (input) input.setValue(file.path);
                    syncMomentsShare();
                    new Notice(`已选择头像：${file.path}`);
                }
            }
            new MomentsAvatarSuggest(plugin.app).open();
        }));
        avatarSetting.addButton(b => b.setButtonText('从本地/相册').onClick(() => {
            const picker = document.createElement('input');
            picker.type = 'file';
            picker.accept = 'image/*';
            picker.addEventListener('change', async () => {
                const file = picker.files && picker.files[0];
                if (!file) return;
                try {
                    const buf = await file.arrayBuffer();
                    const extRaw = (file.name.split('.').pop() || 'png').toLowerCase();
                    const ext = /^(png|jpe?g|gif|webp|svg)$/i.test(extRaw) ? extRaw.replace('jpeg', 'jpg') : 'png';
                    const folder = normalizePath('Boxes/图片');
                    await ensureFolderByPath(plugin.app.vault, `${folder}/.keep`);
                    const dest = normalizePath(`${folder}/share-avatar.${ext}`);
                    const existing = plugin.app.vault.getAbstractFileByPath(dest);
                    if (existing instanceof TFile) {
                        await plugin.app.vault.modifyBinary(existing, buf);
                    } else {
                        await plugin.app.vault.createBinary(dest, buf);
                    }
                    msShare.shareAvatar = dest;
                    if (tab._momentsAvatarInput) tab._momentsAvatarInput.setValue(dest);
                    await syncMomentsShare();
                    new Notice(`头像已导入：${dest}`);
                } catch (err) {
                    console.error(err);
                    new Notice('导入头像失败：' + (err && err.message ? err.message : String(err)));
                }
            });
            picker.click();
        }));
        avatarSetting.addButton(b => b.setButtonText('清除').setWarning().onClick(async () => {
            msShare.shareAvatar = "";
            if (tab._momentsAvatarInput) tab._momentsAvatarInput.setValue("");
            await syncMomentsShare();
        }));
    }, { defaultExpanded: false });

    const footCard = grid.createDiv({ cls: "bc-settings-block" });
    new Setting(footCard).setName('打开 Moments').setHeading();
    footCard.createEl('p', { text: '改完设置后回到 Moments 看效果；移动端入口切换需要重新打开视图。', cls: 'setting-item-description' });
    new Setting(footCard)
        .setClass('bc-settings-action-only')
        .addButton(b => b.setButtonText('打开 Moments').setCta().onClick(() => {
            plugin.app.setting?.close?.();
            void plugin.activateMomentsView();
        }));
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
                    ? formatPluginSettingsTitle('BrainCore 配置', getEditionDisplayName(this.plugin.settings))
                    : `BrainCore 配置 · ${getEditionDisplayName(this.plugin.settings)}`,
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
        if (!locked) tabDefs.push({ id: "paths", label: "路径" }, { id: "moments", label: "Moments" }, { id: "modules", label: "模块" }, { id: "habits", label: "打卡" });
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
            panels[t.id].setCssStyles({ display: "none" });
        });
        const showTab = (id) => {
            tabDefs.forEach(t => { panels[t.id].setCssStyles({ display: t.id === id ? "block" : "none" }); });
            tabBar.querySelectorAll("button").forEach(btn => {
                const active = btn.dataset.tab === id;
                btn.toggleClass("mod-cta", active);
                btn.setAttr("aria-selected", active ? "true" : "false");
            });
        };
        const keyboard = typeof bindBcSettingsTabKeyboard === "function"
            ? bindBcSettingsTabKeyboard(tabBar, showTab)
            : { showTab };
        tabDefs.forEach(t => {
            const btn = tabBar.createEl("button", { text: t.label, cls: "bc-settings-tab-btn", type: "button" });
            btn.dataset.tab = t.id;
            btn.setAttr("role", "tab");
            btn.setAttr("id", `bc-tab-${t.id}`);
            btn.setAttr("aria-controls", `bc-panel-${t.id}`);
            btn.setAttr("aria-selected", "false");
            btn.addEventListener("click", () => keyboard.showTab(t.id));
        });
        let focusTab = this.plugin._settingsFocusTab;
        this.plugin._settingsFocusTab = null;
        if (focusTab === "auth") focusTab = "license";
        const initialTab = tabDefs.some(t => t.id === focusTab) ? focusTab : tabDefs[0].id;
        keyboard.showTab(initialTab);

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
                if (!isLicenseValid(this.app, key)) {
                    bcNoticeWarn("激活码无效，请核对后重试");
                    return;
                }
                rememberLicenseKey(this.plugin.settings, key);
                syncLicenseState(this.app, this.plugin.settings);
                    bcNoticeSuccess(getActivationSuccessMessage());
                    this.app.workspace.trigger("braincore:refresh");
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
        new Setting(pathsCard).setName('📂 路径映射').setHeading();
        pathsCard.createEl('p', { text: '决定捕捉、待办、金句等内容读写位置。', cls: 'setting-item-description' });
        new Setting(pathsCard).setName('输入路径').setHeading().setClass('bc-settings-subgroup');
        
        new Setting(pathsCard).setName('工作').addText(t => t.setValue(this.plugin.settings.pathWork).onChange(v => { this.plugin.settings.pathWork = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('生活').addText(t => t.setValue(this.plugin.settings.pathTasks).onChange(v => { this.plugin.settings.pathTasks = v; this.plugin.saveSettings(); }));
        pathsCard.createEl('p', { text: 'Moments 年文件目录与分享水印在「Moments」Tab 里设置。', cls: 'setting-item-description' });
        new Setting(pathsCard).setName('随笔').addText(t => t.setValue(this.plugin.settings.pathEssays).onChange(v => { this.plugin.settings.pathEssays = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('剪藏').addText(t => t.setValue(this.plugin.settings.pathClippings).onChange(v => { this.plugin.settings.pathClippings = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('剪藏感悟').setDesc('填写感悟时另存的目录；与剪藏笔记双向链接').addText(t => t.setValue(this.plugin.settings.pathClipReflections || "读&写/剪藏感悟").onChange(v => { this.plugin.settings.pathClipReflections = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('草稿').addText(t => t.setValue(this.plugin.settings.pathDrafts).onChange(v => { this.plugin.settings.pathDrafts = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('剪藏分类').setHeading().setClass('bc-settings-subgroup');
        pathsCard.createEl('p', { text: '确认剪藏时可点选；输入框添加的分类会写入下方列表。用英文逗号或换行分隔。', cls: 'setting-item-description' });
        const clipCatsSetting = new Setting(pathsCard).setName('分类列表');
        clipCatsSetting.settingEl.addClass('bc-settings-textarea-row');
        clipCatsSetting.addTextArea(t => {
            t.setPlaceholder(DEFAULT_CLIP_CATEGORIES.join("，"));
            t.setValue(getClipCategories(this.plugin.settings).join("，"));
            t.inputEl.rows = 3;
            t.inputEl.setCssStyles({ width: "100%" });
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
        new Setting(pathsCard).setName('附件与索引').setHeading().setClass('bc-settings-subgroup');
        new Setting(pathsCard).setName('附件根目录').setDesc('未装 AM 时：图片→同级「图片」、PDF→「PDF」、音视频→「音视频」，其余进此目录。已装并配置 AM 后，捕捉也严格跟 AM。').addText(t => t.setValue(this.plugin.settings.pathAttachments || "Boxes/附件").onChange(v => { this.plugin.settings.pathAttachments = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('文件墙').setDesc('打开文件墙的路径（纯展示看板，素材不会写入此文件）').addText(t => t.setValue(this.plugin.settings.pathMaterials || "Boxes/文件墙.md").onChange(v => { this.plugin.settings.pathMaterials = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('素材日志').setDesc('可选备注写入此文件；留空标题则不写日志').addText(t => t.setValue(this.plugin.settings.pathMaterialLog || "Boxes/素材日志.md").onChange(v => { this.plugin.settings.pathMaterialLog = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('读书笔记').setDesc('金句轮播从此目录读取（默认 Weread）。建议安装社区插件 Weread 同步微信读书划线，路径需与插件输出目录一致。').addText(t => t.setValue(this.plugin.settings.pathQuotes).onChange(v => { this.plugin.settings.pathQuotes = v; this.plugin.saveSettings(); }));
        new Setting(pathsCard).setName('第三方联动（可选）').setHeading().setClass('bc-settings-subgroup');
        pathsCard.createEl('p', { text: '未安装 AM：捕捉用内置四分类。已安装且 AM 有配置：捕捉严格跟随 AM（与全库附件规则一致，避免两套目录冲突）。', cls: 'bc-am-section-hint setting-item-description' });
        new Setting(pathsCard).setName('跟随 Attachment Management').setDesc('开：仅当 AM 根目录对齐 Boxes 四栏时跟随；未对齐则用内置四分类。关：捕捉始终用内置四分类。').addToggle(t => t.setValue(this.plugin.settings.followAttachmentManagement !== false).onChange(v => { this.plugin.settings.followAttachmentManagement = v; this.plugin.saveSettings(); }));

        const weeklyCard = gridWrapper.createDiv();
        weeklyCard.className = "bc-settings-block";
        new Setting(weeklyCard).setName('📋 周工作模板').setHeading();
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
        new Setting(weatherCard).setName('🌤️ 天气定位').setHeading();
        weatherCard.createEl('p', { text: '天气按下方经纬度显示。默认不会用 IP 推测位置。若开启「自动网络定位」，每 4 小时会向第三方定位接口发送一次请求（ipwho.is / ipinfo.io / geolocation-db），用于填写坐标；你已手动改过经纬度时不会覆盖。天气接口 open-meteo 不可用时自动切换 wttr.in（中文）。', cls: 'setting-item-description' });
        
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
        new Setting(weatherCard).setName('自动网络定位').setDesc('关闭后仅使用下方坐标，不向 IP 定位接口发请求。').addToggle(toggle => toggle
            .setValue(!!this.plugin.settings.weatherAutoLocate)
            .onChange(async (v) => {
                this.plugin.settings.weatherAutoLocate = !!v;
                await this.plugin.saveSettings();
                clearWeatherCaches();
            }));
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
        new Setting(modulesCard).setName('🧩 模块自由组合').setHeading();
        modulesCard.createEl('p', { text: '开关模块，用上移/下移排序，或拖拽把手。误操作可撤销上一次排序。', cls: 'setting-item-description' });
        const modulesLive = modulesCard.createDiv({ cls: "bc-reorder-live", attr: { "aria-live": "polite" } });
        let modulesUndo = null;
        
        const sortContainer = modulesCard.createDiv('bc-sortable-list'); let draggedItem = null;
        const commitModuleOrder = async (announce) => {
            const visibleIds = Array.from(sortContainer.children).map(c => c.dataset.id).filter(Boolean);
            const byId = Object.fromEntries(this.plugin.settings.modules.map((m) => [m.id, m]));
            const next = [];
            const seen = new Set();
            for (const id of visibleIds) {
                const mod = byId[id];
                if (!mod || seen.has(id)) continue;
                next.push(mod);
                seen.add(id);
                if (id === "greeting") {
                    for (const hid of ["progress", "quote"]) {
                        if (byId[hid] && !seen.has(hid)) {
                            next.push(byId[hid]);
                            seen.add(hid);
                        }
                    }
                }
            }
            for (const m of this.plugin.settings.modules) {
                if (!seen.has(m.id)) next.push(m);
            }
            this.plugin.settings.modules = next;
            await this.plugin.saveSettings();
            this.app.workspace.trigger("braincore:refresh");
            if (announce) modulesLive.setText(announce);
        };
        const undoRow = modulesCard.createDiv({ cls: "bc-settings-action-only" });
        const undoModulesBtn = undoRow.createEl("button", { text: "撤销上一次模块排序", cls: "bc-undo-modules-btn", attr: { type: "button" } });
        undoModulesBtn.addEventListener("click", async () => {
            if (!modulesUndo) return;
            this.plugin.settings.modules = modulesUndo.map((mod) => ({ ...mod }));
            modulesUndo = null;
            await this.plugin.saveSettings();
            this.display();
            this.app.workspace.trigger("braincore:refresh");
            modulesLive.setText("已撤销模块排序");
        });
        this.plugin.settings.modules.forEach((mod) => {
            // 进度 / 金句已并入问候英雄块，设置里不再单独列出
            if (mod.id === "progress" || mod.id === "quote") return;
            const settingItem = new Setting(sortContainer)
                .addToggle(toggle => toggle.setValue(mod.enabled).onChange(async (v) => {
                    mod.enabled = v;
                    if (mod.id === "greeting") {
                        this.plugin.settings.modules.forEach((m) => {
                            if (m.id === "progress" || m.id === "quote") m.enabled = v;
                        });
                    }
                    await this.plugin.saveSettings();
                    this.app.workspace.trigger("braincore:refresh");
                }));
            if (mod.id === "greeting") {
                settingItem.setName("");
                settingItem.nameEl.empty();
                settingItem.nameEl.addClass("bc-module-name-multiline");
                settingItem.nameEl.createDiv({ text: "问候+天气+" });
                settingItem.nameEl.createDiv({ text: "进度+金句" });
                settingItem.settingEl.dataset.id = mod.id;
            } else {
                settingItem.setName(mod.name);
            }
            const upBtn = settingItem.controlEl.createEl("button", { text: "↑", cls: "bc-reorder-btn", attr: { type: "button", "aria-label": `上移${mod.name}` } });
            const downBtn = settingItem.controlEl.createEl("button", { text: "↓", cls: "bc-reorder-btn", attr: { type: "button", "aria-label": `下移${mod.name}` } });
            const dragHandle = document.createElement('div');
            dragHandle.className = 'bc-module-drag';
            dragHandle.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
            settingItem.controlEl.appendChild(dragHandle); const el = settingItem.settingEl; el.draggable = true; el.dataset.id = mod.id;
            const snapshotModules = () => this.plugin.settings.modules.map((item) => ({ ...item }));
            const moveRow = async (dir) => {
                const sibling = dir < 0 ? el.previousElementSibling : el.nextElementSibling;
                if (!sibling) return;
                modulesUndo = snapshotModules();
                if (dir < 0) sortContainer.insertBefore(el, sibling);
                else sortContainer.insertBefore(sibling, el);
                const pos = Array.from(sortContainer.children).indexOf(el) + 1;
                await commitModuleOrder(`已将${mod.name}移到第 ${pos} 位`);
            };
            upBtn.addEventListener("click", () => { void moveRow(-1); });
            downBtn.addEventListener("click", () => { void moveRow(1); });
           // 💻 保留电脑端原生鼠标拖拽
            el.addEventListener('dragstart', (e) => { draggedItem = el; modulesUndo = snapshotModules(); e.dataTransfer.effectAllowed = 'move'; setTimeout(() => el.style.opacity = '0.4', 0); });
            el.addEventListener('dragend', async (e) => { el.style.opacity = '1'; draggedItem = null; await commitModuleOrder("模块顺序已更新"); });
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
                await commitModuleOrder("模块顺序已更新");
            });
        });

        const habitsCard = habitsGrid.createDiv();
        habitsCard.className = "bc-settings-block";
        new Setting(habitsCard).setName('📅 打卡').setHeading();
        habitsCard.createEl('p', { text: '用上移/下移或右侧拖拽把手排序；点击图标或名称可编辑。下方可导出/导入 JSON 格式 habitData。', cls: 'setting-item-description' });
        const habitsLive = habitsCard.createDiv({ cls: "bc-reorder-live", attr: { "aria-live": "polite" } });
        
        const habitsContainer = habitsCard.createDiv('bc-habits-config');
        const HABIT_DRAG_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        const HABIT_TRASH_SVG = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;
        let habitDragged = null;

        const saveHabitOrder = async (announce) => {
            const ids = Array.from(habitsContainer.querySelectorAll('.bc-habit-row')).map(r => r.dataset.id);
            this.plugin.settings.habitsConfig = ids
                .map(id => this.plugin.settings.habitsConfig.find(h => h.id === id))
                .filter(Boolean);
            await this.plugin.saveSettings();
            this.app.workspace.trigger("braincore:refresh");
            if (announce) habitsLive.setText(announce);
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
                await saveHabitOrder("打卡顺序已更新");
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
                    await saveHabitOrder("打卡顺序已更新");
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
                const upBtn = actions.createEl("button", { text: "↑", cls: "bc-reorder-btn", attr: { type: "button", "aria-label": `上移${habit.n}` } });
                const downBtn = actions.createEl("button", { text: "↓", cls: "bc-reorder-btn", attr: { type: "button", "aria-label": `下移${habit.n}` } });
                const dragHandle = actions.createDiv('bc-habit-drag');
                dragHandle.innerHTML = HABIT_DRAG_SVG;
                const delBtn = actions.createEl("button", { cls: "bc-habit-del-btn", attr: { type: "button", "aria-label": "删除" } });
                delBtn.innerHTML = HABIT_TRASH_SVG;
                const moveHabit = async (dir) => {
                    const sibling = dir < 0 ? row.previousElementSibling : row.nextElementSibling;
                    if (!sibling || !sibling.classList.contains("bc-habit-row")) return;
                    if (dir < 0) habitsContainer.insertBefore(row, sibling);
                    else habitsContainer.insertBefore(sibling, row);
                    const pos = Array.from(habitsContainer.querySelectorAll(".bc-habit-row")).indexOf(row) + 1;
                    await saveHabitOrder(`已将${habit.n}移到第 ${pos} 位`);
                };
                upBtn.addEventListener("click", () => { void moveHabit(-1); });
                downBtn.addEventListener("click", () => { void moveHabit(1); });
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
            new Setting(dataCard).setName("数据").setHeading();
            dataCard.createEl("p", {
                text: "插件数据文件路径与存放对照。",
                cls: "setting-item-description",
            });
            const dataPath = `.obsidian/plugins/${this.plugin.manifest.id}/data.json`;
            dataCard.createEl("p", {
                cls: "setting-item-description",
                text: `${typeof formatLifeOsVersionLine === "function" ? formatLifeOsVersionLine(PLUGIN_VERSION, typeof getEditionDisplayName === "function" ? getEditionDisplayName() : "") : `当前版本 ${PLUGIN_VERSION}`}。你的东西分两处放，下面这张表说清楚了：`,
            });
            renderBrainCoreStorageTable(dataCard, dataPath);
            new Setting(dataCard)
                .setName("data.json")
                .setDesc(dataPath)
                .addButton((btn) =>
                    btn.setButtonText("打开").onClick(() => {
                        revealVaultFileInFileManager(this.app, dataPath);
                    })
                );
        }
        if (!locked) renderBrainCoreMomentsSettingsPanel(panels.moments, this.plugin, this);
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
        this._wakeLightTimer = null;
        this._wakeFullTimer = null;
        this._alsoHabits = false;
        this._calendarDayKey = "";
        this._forceStatsDayCut = false;
        this._flushRefresh = () => {
            if (!this.isDashboardActive()) {
                this._pendingWakeRefresh = true;
                return;
            }
            const scope = this._refreshScope;
            const alsoHabits = this._alsoHabits;
            this._refreshScope = "full";
            this._alsoHabits = false;
            const run = async () => {
                if (alsoHabits && scope !== "habits" && scope !== "full") {
                    await this.renderContent("habits");
                }
                await this.renderContent(scope);
            };
            void run();
        };
        // 打卡/统计/待办要快；全量刷新仍合并风暴省电
        this._debouncedStatsRefresh = customDebounce(() => this._flushRefresh(), 350);
        this._debouncedFullRefresh = customDebounce(() => this._flushRefresh(), 900);
        this.requestRefresh = () => this._debouncedFullRefresh();
    }
    queueRefresh(scope = "full") {
        if (scope === "habits") this._alsoHabits = true;
        const next = BC_REFRESH_SCOPE_RANK[scope] ?? BC_REFRESH_SCOPE_RANK.full;
        const cur = BC_REFRESH_SCOPE_RANK[this._refreshScope] ?? BC_REFRESH_SCOPE_RANK.full;
        if (next >= cur) this._refreshScope = scope;
        const effective = this._refreshScope;
        if (effective === "habits" || effective === "stats" || effective === "tasks") {
            this._debouncedStatsRefresh();
        } else {
            this._debouncedFullRefresh();
        }
    }
    clearWakeRefreshTimers() {
        if (this._wakeLightTimer) {
            window.clearTimeout(this._wakeLightTimer);
            this._wakeLightTimer = null;
        }
        if (this._wakeFullTimer) {
            window.clearTimeout(this._wakeFullTimer);
            this._wakeFullTimer = null;
        }
    }
    /** 从后台切回：先让 UI 可点，再轻量同步，全量延后，避免主线程长时间堵死 */
    scheduleWakeRefresh() {
        this.clearWakeRefreshTimers();
        this._wakeLightTimer = window.setTimeout(() => {
            this._wakeLightTimer = null;
            if (!this.isDashboardActive()) {
                this._pendingWakeRefresh = true;
                return;
            }
            void this.plugin.pollPluginDataFromDisk?.("wake");
            this.queueRefresh("habits");
            this.queueRefresh("stats");
        }, 500);
        this._wakeFullTimer = window.setTimeout(() => {
            this._wakeFullTimer = null;
            if (!this.isDashboardActive()) {
                this._pendingWakeRefresh = true;
                return;
            }
            this.queueRefresh("full");
        }, 3200);
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
    getCalendarDayKey() {
        return bcLocalDayKey();
    }
    /** 跨日强刷：今日累计 / 习惯「今日」高亮 / 问候语等依赖日历日的模块 */
    requestCalendarDayRollover(reason = "day") {
        const day = this.getCalendarDayKey();
        if (!day) return false;
        // 首次只记日戳，不当作跨日（避免每次打开多刷一遍）
        if (!this._calendarDayKey) {
            this._calendarDayKey = day;
            return false;
        }
        if (this._calendarDayKey === day) return false;
        this._calendarDayKey = day;
        this._forceStatsDayCut = true;
        this.tickLightRefresh();
        if (!this.isDashboardActive()) {
            this._pendingWakeRefresh = true;
            return true;
        }
        // 先立刻刷统计日切，再全量（金句种子、待办周文件等）
        this.queueRefresh("stats");
        this.queueRefresh("habits");
        this.queueRefresh("full");
        return true;
    }
    startRefreshTimer() {
        this.stopRefreshTimer();
        if (!this.isDashboardActive()) return;
        this._lightTickCount = 0;
        // 恢复前台时立刻核对日历日，避免等满 3 分钟仍显示昨日「今日累计」
        this.requestCalendarDayRollover("timer-start");
        this.tickLightRefresh();
        // 进度条：3 分钟轻刷；统计：同间隔刷 stats（比全量轻）；全量约 30 分钟
        const lightMs = 3 * 60 * 1000;
        const fullEvery = this.app.isMobile ? 15 : 10;
        this.refreshInterval = window.setInterval(() => {
            if (!this.isDashboardActive()) {
                this.stopRefreshTimer();
                this._powerModeActive = false;
                return;
            }
            if (this.requestCalendarDayRollover("timer")) return;
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
            // 同为前台时也要查跨日（例如定时器被系统挂起后用户回到侧栏）
            if (active) {
                if (this.requestCalendarDayRollover("focus-keep")) {
                    this._pendingWakeRefresh = false;
                    this.scheduleWakeRefresh();
                }
            }
            return;
        }
        this._powerModeActive = active;
        if (active) {
            const dayRolled = this.requestCalendarDayRollover("wake");
            this.startRefreshTimer();
            if (this._pendingWakeRefresh || dayRolled) {
                this._pendingWakeRefresh = false;
                this.scheduleWakeRefresh();
            } else {
                // 即使没有 vault 积压，切回时也核对 Mac/外部写入的 data.json
                void this.plugin.pollPluginDataFromDisk?.("focus");
            }
        } else {
            this.clearWakeRefreshTimers();
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
            const directPaths = [s.pathTasks, s.pathMoments, s.pathIdeas, s.pathEssays, s.pathDrafts, s.pathClippings].filter(Boolean);
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
        
        // 省电：正文 modify 只盯任务/周工作相关 md；增删改名刷新 Total / 今日累计
        const invalidateQuoteCacheForFile = (file) => {
            if (!file || file.extension !== "md") return;
            if (!bcIsQuoteSourcePath?.(this.plugin.settings, file.path)) return;
            try { sessionStorage.removeItem("sb-quote-cache-f"); } catch (e) { /* ignore */ }
            this.plugin.scheduleQuoteIndexSync?.("vault-change", file.path);
        };
        const isInternalStatsFile = (file) => {
            if (!file?.path) return true;
            if (file.path === "Scripts/braincore-stats-history.json") return true;
            if (file.path.endsWith("/braincore-stats-history.json")) return true;
            if (file.path === "Scripts/braincore-stats-cache.json") return true;
            if (file.path.endsWith("/braincore-stats-cache.json")) return true;
            if (file.path === "Scripts/braincore-quote-index.json") return true;
            if (file.path.endsWith("/braincore-quote-index.json")) return true;
            return false;
        };
        const refreshForFile = (file, kind = "modify") => {
            if (this.plugin._suppressDashboardRefresh) return;
            if (!file || isInternalStatsFile(file)) return;
            if (isIgnoredStatPath(file.path)) return;
            const ext = file.extension;
            let scope = null;
            const isQuoteSrc = bcIsQuoteSourcePath?.(this.plugin.settings, file.path);
            if (kind === "modify") {
                // 修改：只刷任务/周工作/金句相关 md，避免 iCloud 附件抖动
                if (ext !== "md") return;
                if (!shouldRefreshForMetadata(file) && !isQuoteSrc) return;
                invalidateQuoteCacheForFile(file);
                scope = "full";
            } else {
                // 增删改名：计入 Total / 今日累计；金句源文件同步刷新索引
                if (ext === "md") invalidateQuoteCacheForFile(file);
                scope = isQuoteSrc ? "full" : "stats";
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
        this.clearWakeRefreshTimers();
        this.stopRefreshTimer();
        this._powerModeActive = false;
        this._debouncedStatsRefresh?.cancel?.();
        this._debouncedFullRefresh?.cancel?.();
        if (this._renderRetryTimer) {
            window.clearTimeout(this._renderRetryTimer);
            this._renderRetryTimer = null;
        }
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

                if (scope === "habits" && hasShell) {
                    await this.renderDashboard(null, dvAPI, { dataviewMissing, habitsOnly: true, habitsContainer: container });
                    return;
                }
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
                    const scrollTop = container.scrollTop;
                    const active = document.activeElement;
                    const focusHint = (active instanceof HTMLElement && container.contains(active))
                        ? {
                            tag: active.tagName,
                            cls: active.className,
                            text: (active.textContent || "").slice(0, 48),
                            name: active.getAttribute("name"),
                        }
                        : null;
                    container.replaceChildren(...Array.from(temp.childNodes));
                    container.scrollTop = scrollTop;
                    if (focusHint) {
                        const candidates = Array.from(container.querySelectorAll(focusHint.tag.toLowerCase()));
                        const match = candidates.find((el) =>
                            el.className === focusHint.cls
                            && (el.textContent || "").slice(0, 48) === focusHint.text
                            && (el.getAttribute("name") || null) === focusHint.name
                        ) || candidates.find((el) => el.className === focusHint.cls);
                        match?.focus?.({ preventScroll: true });
                    }
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
                    if (this._renderRetryTimer) window.clearTimeout(this._renderRetryTimer);
                    this._renderRetryTimer = window.setTimeout(() => {
                        this._renderRetryTimer = null;
                        if (!this.containerEl?.isConnected) return;
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
        const { dataviewMissing = false, statsOnly = false, statsContainer = null, tasksOnly = false, tasksContainer = null, habitsOnly = false, habitsContainer = null } = options || {};
        const app = this.app; const moment = bcMoment; const settings = this.plugin.settings; const plugin = this.plugin;
        const now = new Date(); const year = now.getFullYear(); const hour = now.getHours(); const todayISO = moment().format('YYYY-MM-DD'); const dayOfWeek = ['周日','周一','周二','周三','周四','周五','周六'][now.getDay()]; const currentSeed = parseInt(moment().format("YYYYMMDDHH")); 
        const greeting = (hour < 6) ? '深夜好' : (hour < 12) ? '早上好' : (hour < 14) ? '中午好' : (hour < 18) ? '下午好' : (hour < 22) ? '晚上好' : '夜深了';
        const getP = (start, end) => Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
        const progTitle = (label, percent, remainText, rangeText) =>
            `${label}进度 ${percent.toFixed(1)}%\n已过比例 ${percent.toFixed(1)}% · ${remainText}\n${rangeText}`;
        const sY = new Date(year, 0, 1), eY = new Date(year + 1, 0, 1), yearP = getP(sY, eY), dLY = Math.ceil((eY - now) / 86400000); const sM = new Date(year, now.getMonth(), 1), eM = new Date(year, now.getMonth() + 1, 1), monthP = getP(sM, eM), dLM = Math.ceil((eM - now) / 86400000); const dowIdx = (now.getDay() === 0) ? 6 : now.getDay() - 1; const sW = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dowIdx), eW = new Date(sW.getFullYear(), sW.getMonth(), sW.getDate() + 7), weekP = getP(sW, eW), dLW = Math.ceil((eW - now) / 86400000); const sD = new Date(year, now.getMonth(), now.getDate()), eD = new Date(year, now.getMonth(), now.getDate() + 1), dayP = getP(sD, eD), hLD = Math.ceil((eD - now) / 3600000);
        const fmtRange = (a, b) => `${moment(a).format("YYYY-MM-DD HH:mm")} → ${moment(b).format("YYYY-MM-DD HH:mm")}`;
        const yearTip = progTitle("年", yearP, `剩余 ${dLY} 天`, fmtRange(sY, eY));
        const monthTip = progTitle("月", monthP, `剩余 ${dLM} 天`, fmtRange(sM, eM));
        const weekTip = progTitle("周", weekP, `剩余 ${dLW} 天`, fmtRange(sW, eW));
        const dayTip = progTitle("日", dayP, `剩余 ${hLD} 小时`, fmtRange(sD, eD));

        const mountHabitsInto = (host) => {
            if (!host) return;
            host.empty();
            const habitData = settings.habitData || {};
            const types = settings.habitsConfig || [];
            const dates = []; for (let i = 4; i >= 0; i--) dates.push(moment().subtract(i, 'days'));
            const hHeader = host.createEl("div", { cls: "sb-habit-row sb-habit-dayhead", style: "margin-bottom: 2px;" });
            hHeader.createEl("div", { cls: "sb-habit-label", text: "HABIT" });
            const hGrid = hHeader.createEl("div", { cls: "sb-habit-grid" });
            dates.forEach(m => {
                const isToday = m.isSame(moment(), "day");
                hGrid.createEl("div", { cls: `sb-habit-day-txt${isToday ? " is-today" : ""}`, text: m.format('dd').charAt(0) });
            });
            hHeader.createEl("div", { cls: "sb-habit-streak", text: "" });
            if (!types.length) {
                const emptyHost = host.createDiv();
                fillBcEmptyState(emptyHost, {
                    message: "还没有习惯",
                    ctaLabel: "去设置添加",
                    onCta: () => this.plugin.openBrainCoreSettings({ tab: "habits" }),
                });
            } else types.forEach(h => {
                const row = host.createEl("div", { cls: "sb-habit-row" });
                row.createEl("div", { cls: "sb-habit-label", text: `${h.i}${h.n}` });
                const grid = row.createEl("div", { cls: "sb-habit-grid" });
                const total = countHabitTotal(habitData, h.id);
                dates.forEach(m => {
                    const dStr = m.format('YYYY-MM-DD');
                    const isToday = m.isSame(moment(), "day");
                    const isChecked = habitData[dStr] && habitData[dStr][h.id];
                    const box = grid.createEl("button", { cls: `sb-box${isChecked ? " checked" : ""}${isToday ? " is-today" : ""}`, attr: { type: "button", "data-habit-id": h.id, "data-habit-date": dStr, "aria-label": `${h.n} ${dStr}` } });
                });
                row.createEl("div", { cls: "sb-habit-streak", text: `${total}d`, attr: { title: `累计打卡 ${total} 天` } });
            });
            if (host.dataset.bcHabitDelegated !== "true") {
                host.dataset.bcHabitDelegated = "true";
                host.addEventListener("click", async (event) => {
                    const box = event.target?.closest?.("[data-habit-id][data-habit-date]");
                    if (!box || !host.contains(box)) return;
                    const habitId = box.dataset.habitId;
                    const date = box.dataset.habitDate;
                    const nowChecked = box.classList.toggle("checked");
                    if (!habitData[date]) habitData[date] = {};
                    habitData[date][habitId] = nowChecked;
                    this.plugin.settings.habitData = habitData;
                    await this.plugin.saveSettings();
                    const streakEl = box.closest(".sb-habit-row")?.querySelector(".sb-habit-streak");
                    if (streakEl) streakEl.setText(`${countHabitTotal(habitData, habitId)}d`);
                });
            }
        };

        if (habitsOnly && habitsContainer) {
            let habitsHost = habitsContainer.querySelector('[data-bc-block="habits"]');
            if (!habitsHost) {
                const firstRow = habitsContainer.querySelector(".sb-habit-row");
                if (firstRow?.parentElement) {
                    habitsHost = firstRow.parentElement;
                    habitsHost.setAttribute("data-bc-block", "habits");
                }
            }
            if (habitsHost) mountHabitsInto(habitsHost);
            return;
        }
        
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
        if (!statsOnly && !tasksOnly) {
            await this.plugin.runWeeklyMigrateIfNeeded(bcMoment(now));
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
            totalNotes = allFiles.filter(f => f.extension === 'md' && !isIgnoredStatPath(f.path)).length; 
        } catch(e) { console.warn("[BrainCore] 笔记统计失败:", e); }
        const momentsFolder = settings.pathMoments || "读&写/Moments";
        let fleetingNotes = 0, fleetingDetails = "暂无 Moments";
        let totalTasks = 0, taskDetails = "无未完成待办";
        let pendingTasks = [];
        const workKey = workFile?.path || "";
        if (statsOnly) {
            const sc = this.plugin._statsCache || {};
            totalTags = sc.tags ?? 0;
            totalTasks = sc.tasks ?? 0;
        } else {
        // 标签：metadataCache，避免 dv.pages 全库扫描
        try { 
            totalTags = countVaultTags(app);
        } catch(e) { console.warn("[BrainCore] 标签统计失败:", e); }
        
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
        try {
            fleetingNotes = await countMoments(app, settings);
            fleetingDetails = fleetingNotes > 0
                ? `Moments ${fleetingNotes} 条 · ${momentsFolder}`
                : "暂无 Moments";
        } catch(e) { console.warn("[BrainCore] Moments 统计失败:", e); }
        
        
        let imageCount = 0, attachmentCount = 0; 
        let entityFiles = [], imageTableFiles = [], attachmentFiles = [];
        try { 
            // 图·表只统计“独立文件”，不统计笔记正文里嵌入的图片/表格文本
            const imageTableExts = ['png','jpg','jpeg','gif','webp','svg','xlsx','csv','canvas'];
            const noteFiles = allFiles.filter(f => 
                f.extension === 'md' && 
                !isIgnoredStatPath(f.path)
            );
            imageTableFiles = allFiles.filter(f => 
                imageTableExts.includes(f.extension) && 
                !isIgnoredStatPath(f.path)
            );
            attachmentFiles = allFiles.filter(f => 
                f.extension !== 'md' && 
                !imageTableExts.includes(f.extension) &&
                !isIgnoredStatPath(f.path)
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
            moments: fleetingNotes,
            taskSearchQuery,
            ideasPath: settings.pathMoments || "读&写/Moments",
            momentsPath: settings.pathMoments || "读&写/Moments",
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
Moments: ${fleetingNotes}`;
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
            const forceDayCut = !!this._forceStatsDayCut;
            if (forceDayCut) this._forceStatsDayCut = false;
            if (forceDayCut || history.date !== todayISO) {
                history.date = todayISO;
                if (forceDayCut) {
                    // 跨日强刷：以当前库快照为今日起点（后台过夜时 last 快照可能滞后）
                    history.baseFilePaths = currentEntityPaths.slice();
                    history.baseFileSum = fileSum;
                } else {
                    const prevPaths = Array.isArray(history.lastFilePaths)
                        ? history.lastFilePaths
                        : (Array.isArray(history.baseFilePaths) ? history.baseFilePaths : null);
                    history.baseFileSum = Number.isFinite(history.lastFileTotal) ? history.lastFileTotal : (prevPaths ? prevPaths.length : fileSum);
                    // 日切只用「上次快照」，避免把今天已经发生的增删写进基线后永远显示 →0
                    history.baseFilePaths = prevPaths || currentEntityPaths;
                }
                history.todayRenames = [];
            }
            if (!Array.isArray(history.baseFilePaths)) {
                history.baseFilePaths = Array.isArray(history.lastFilePaths) ? history.lastFilePaths : currentEntityPaths;
            }
            // 自愈：date 已是今天，但仍有「ctime 早于今天」的文件被算进今日累计（昨夜日切基线滞后）
            {
                const baseSet = new Set(history.baseFilePaths);
                let healed = false;
                for (const p of currentEntityPaths) {
                    if (baseSet.has(p)) continue;
                    const file = entityFiles.find((f) => f.path === p);
                    if (!file?.stat?.ctime || !moment) continue;
                    if (moment(file.stat.ctime).format("YYYY-MM-DD") === todayISO) continue;
                    history.baseFilePaths.push(p);
                    baseSet.add(p);
                    healed = true;
                }
                if (healed) history.baseFileSum = history.baseFilePaths.length;
            }
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
                moments: fleetingNotes,
                displayDiff,
                entityPaths: currentEntityPaths,
                taskSearchQuery,
                ideasPath: settings.pathMoments || "读&写/Moments",
                momentsPath: settings.pathMoments || "读&写/Moments",
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

        this.plugin._todayDeltaFiles = {
            diff: displayDiff,
            pathDiff,
            moved: movedPairs,
            added: netAddedFiles.map((f) => ({ path: f.path, extension: f.extension || "", ctime: f.stat?.ctime || 0 })),
            deleted: netDeletedFiles
        };

        const diffMark = displayDiff > 0 ? `↑${displayDiff}` : (displayDiff < 0 ? `↓${Math.abs(displayDiff)}` : "→0");
        const diffColor = displayDiff > 0 ? "#ff5252" : (displayDiff < 0 ? "#4caf50" : "var(--text-muted)");
        const statsRows = [
            [
                { icon: "📝", name: "笔记", value: totalNotes, tooltip: `共检索到 ${totalNotes} 篇笔记`, type: "search", query: "file:.md" },
                { icon: "🏷️", name: "标签", value: totalTags, tooltip: `库中 ${totalTags} 个独立标签（与 Obsidian 标签面板同源）；点击查看列表`, type: "tags", query: "" },
            ],
            [
                { icon: "🖼️", name: "图·表", value: imageCount, tooltip: `独立图片 / 表格 / 白板文件共 ${imageCount} 个`, type: "listGroup", query: "imageTable" },
                { icon: "⏳", name: "待办", value: totalTasks, tooltip: taskDetails, type: "search", query: taskSearchQuery },
            ],
            [
                { icon: "📎", name: "附件", value: attachmentCount, tooltip: `除笔记、图·表文件外的其他独立附件共 ${attachmentCount} 个`, type: "listGroup", query: "attachment" },
                { icon: "✨", name: "Moments", value: fleetingNotes, tooltip: fleetingDetails, type: "moments", query: "" },
            ],
        ];
        const mountStats = (host) => {
            host.empty();
            const total = host.createDiv({ cls: "sb-stat-total-row sb-stat-item-wrap" });
            const totalLabels = total.createDiv();
            totalLabels.style.cssText = "display:flex;flex-direction:column;";
            totalLabels.createSpan({ text: "Total", attr: { style: "font-size:20px;font-weight:900;pointer-events:none;" } });
            const delta = totalLabels.createSpan({ text: `今日累计 ${diffMark}`, attr: { title: "↑净增 ↓净减 →无变化，点击查看详情", role: "button", tabindex: "0" } });
            delta.style.cssText = `font-size:12px;font-weight:800;color:${diffColor};cursor:pointer;pointer-events:auto;`;
            delta.dataset.bcStatType = "todayDelta";
            delta.dataset.bcStatQuery = "";
            total.createSpan({ text: String(totalSum), attr: { title: compositionTip, style: "font-size:34px;font-weight:900;color:var(--text-accent);line-height:.8;cursor:help;" } });
            const table = host.createEl("table", { cls: "sb-stat-table" });
            statsRows.forEach((rowData) => {
                const row = table.createEl("tr");
                rowData.forEach((item) => {
                    const cell = row.createEl("td", { cls: "sb-stat-cell" });
                    const action = cell.createDiv({ cls: "sb-stat-item-wrap", attr: { title: item.tooltip, role: "button", tabindex: "0" } });
                    action.dataset.bcStatType = item.type;
                    action.dataset.bcStatQuery = item.query;
                    action.createSpan({ text: `${item.icon}${item.name}`, attr: { style: "font-size:14px;color:var(--text-muted);pointer-events:none;" } });
                    action.createSpan({ cls: "sb-stat-val", text: String(item.value) });
                });
            });
            if (!fleetingNotes) {
                const momentsEmpty = host.createDiv();
                fillBcEmptyState(momentsEmpty, {
                    icon: "✨",
                    message: "还没有 Moments 记录，写下第一条就会出现在这里。",
                    ctaLabel: "去写一条",
                    onCta: () => this.plugin.activateMomentsView(),
                });
            }
            const activate = (event) => {
                const trigger = event.target?.closest?.("[data-bc-stat-type]");
                if (!trigger || !host.contains(trigger)) return;
                if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                event.stopPropagation();
                void this.plugin._dashboardStatAction?.(trigger.dataset.bcStatType, trigger.dataset.bcStatQuery || "");
            };
            host.addEventListener("click", activate);
            host.addEventListener("keydown", activate);
        };

        if (statsOnly && statsContainer) {
            let statsHost = statsContainer.querySelector('[data-bc-block="stats"]');
            if (!statsHost) {
                statsHost = statsContainer.querySelector('.sb-stat-table')?.parentElement || null;
                if (statsHost && !statsHost.hasAttribute('data-bc-block')) {
                    statsHost.setAttribute('data-bc-block', 'stats');
                }
            }
            if (statsHost) mountStats(statsHost);
            return;
        }

        let hasPendingTasks = false;
        try {
            if (!pendingTasks.length) {
                pendingTasks = await collectPendingTasks(app, settings, workFile);
            }
            if (pendingTasks.length > 0) {
                hasPendingTasks = true;
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
        const mountTaskList = (listEl) => {
            if (hasPendingTasks) mountSidebarTaskForest(listEl, pendingTasks);
            else mountTasksEmpty(listEl);
            if (listEl.dataset.bcTaskDelegated === "true") return;
            listEl.dataset.bcTaskDelegated = "true";
            const activate = (event) => {
                const trigger = event.target?.closest?.("[data-bc-action]");
                if (!trigger || !listEl.contains(trigger)) return;
                if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                event.stopPropagation();
                if (trigger.dataset.bcAction === "open-task-file") {
                    void app.workspace.openLinkText(trigger.dataset.taskPath || "", "", false);
                    return;
                }
                if (trigger.dataset.bcAction === "complete-task") void this.plugin._dashboardCompleteTask?.(trigger);
            };
            listEl.addEventListener("click", activate);
            listEl.addEventListener("keydown", activate);
        };

        if (tasksOnly && tasksContainer) {
            let taskList = tasksContainer.querySelector('[data-bc-block="tasks"] .sb-task-list');
            if (!taskList) taskList = tasksContainer.querySelector('.sb-task-list');
            if (taskList) {
                mountTaskList(taskList);
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

        const completeDashboardTask = async (trigger) => {
            const path = trigger.dataset.taskPath || "";
            const line = Number.parseInt(trigger.dataset.taskLine || "-1", 10);
            const encText = trigger.dataset.taskText || "";
            const itemEl = trigger.closest?.(".sb-task-item");
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
        this.plugin._dashboardCompleteTask = completeDashboardTask;
        const statAction = (type, query) => {
            try { 
                if (type === 'moments') {
                    void this.plugin.activateMomentsView();
                    return;
                }
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
                        const delta = this.plugin._todayDeltaFiles || { diff: 0, added: [], deleted: [], moved: [] };
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

                        /* today-delta styles via styles.css */

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
                                if (mode === "added" && path) item.dataset.openPath = path;
                            });
                        };

                        renderSection("今日新增", added, "added");
                        renderSection("今日删除", deleted, "deleted");
                        renderSection("移动 / 重命名（不计入净增）", moved, "moved");

                        if (!wrap.childElementCount) {
                            wrap.createEl("div", { text: "暂无文件。", cls: "bc-today-empty" });
                        }
                        wrap.addEventListener("click", (event) => {
                            const item = event.target?.closest?.("[data-open-path]");
                            if (!item || !wrap.contains(item)) return;
                            void app.workspace.openLinkText(item.dataset.openPath || "", "/", false);
                            modal.close();
                        });
                        modal.open();
                        return;
                    } else if (query === 'imageTable') {
                        files = app.vault.getFiles()
                            .filter(f => imageTableExts.includes(f.extension) && !isIgnoredStatPath(f.path))
                            .sort((a,b) => a.path.localeCompare(b.path));
                        title = `图·表独立文件（${files.length}）`;
                    } else if (query === 'attachment') {
                        files = app.vault.getFiles()
                            .filter(f => f.extension !== 'md' && !imageTableExts.includes(f.extension) && !isIgnoredStatPath(f.path))
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
                            if (!isDeletedList) item.dataset.openPath = path;
                            else item.style.opacity = "0.72";
                        });
                        wrap.addEventListener("click", (event) => {
                            const item = event.target?.closest?.("[data-open-path]");
                            if (!item || !wrap.contains(item)) return;
                            void app.workspace.openLinkText(item.dataset.openPath || "", "/", false);
                            modal.close();
                        });
                    }
                    modal.open();
                } 
            } catch (e) {
                bcNoticeError("统计操作失败", e);
            }
        };
        this.plugin._dashboardStatAction = statAction;

const runCommand = async (cmd) => { 
            try { 
                if (cmd === "run-bc-task") new CaptureModal(app, this.plugin).open(); 
                else if (cmd === "run-moments" || cmd === "run-capsule") void this.plugin.activateMomentsView(); 
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
                title: "欢迎使用 BrainCore LifeOS 4.0",
                bullets: [
                    "点左侧 ☁️ 图标随时打开控制台",
                    "Moments 是新的碎片记录中心：内容按年存进「读&写/Moments/YYYY.md」，就是普通 Markdown，随时能自己翻",
                    "Moments 删除会直接从年文件移除；刚删完有几秒「撤销」可以捞回来",
                    "捕捉面板 ⌘/Ctrl+Enter 发到当前高亮分类，⌘/Ctrl+Shift+Enter 存草稿",
                    "建议安装 Dataview、Attachment Management、Weread（微信读书→金句）",
                ],
                primaryLabel: "一键创建默认结构",
                onPrimary: async () => {
                    await this.plugin.ensureDefaultVaultStructure();
                    this.app.workspace.trigger("braincore:refresh");
                },
                secondaryLabel: "打开 Moments 写第一条",
                onSecondary: async () => {
                    await this.plugin.activateMomentsView();
                },
            });
        }
        let trialBannerShown = false;
        if (isTrialActive(app, settings)) {
            injectLifeOsSharedStyles();
            const banner = container.createDiv({ cls: "lifeos-trial-banner" });
            banner.setText(`试用中，剩余 ${formatTrialRemaining(getTrialRemainingMs(app, settings))} · 点此激活永久使用`);
            banner.addEventListener("click", () => this.plugin.openBrainCoreSettings({ tab: "license" }));
            trialBannerShown = true;
        }

        const weatherTextOf = (value) => {
            if (!value) return "";
            const parsed = new DOMParser().parseFromString(String(value), "text/html");
            return String(parsed.body?.textContent || "").replace(/\s+/g, " ").trim();
        };
        let initWeatherText = "🌤️ 天气加载中"; const cachedW = sessionStorage.getItem("sb-weather-cache-f");
        if (cachedW) { 
            try { 
                const wData = JSON.parse(cachedW); 
                const cachedText = weatherTextOf(wData?.text || wData?.html);
                if (cachedText && !cachedText.includes("定位中") && !cachedText.includes("天气加载中") && !cachedText.includes("天气暂不可用") && Date.now() - (wData.ts || 0) < 3600000) {
                    initWeatherText = cachedText;
                } 
            } catch(e){} 
        }

        const blocks = {};
        blocks['greeting'] = document.createElement('div');
        {
            const header = blocks['greeting'].createDiv({ cls: "sb-header" });
            header.createDiv({ cls: "sb-greet", text: greeting });
            header.createDiv({ cls: "sb-date", text: `${moment().format('MM-DD')} ${dayOfWeek} · WK${moment(now).isoWeek()}` });
            const weatherEl = header.createDiv({ cls: "sb-weather-box", text: initWeatherText, attr: { id: weatherId, "aria-live": "polite", "aria-atomic": "true", role: "status" } });
            const openWeatherSettings = (e) => {
                if (!weatherEl.hasClass("is-error")) return;
                e.preventDefault();
                e.stopPropagation();
                this.plugin.openBrainCoreSettings({ tab: "paths" });
            };
            weatherEl.addEventListener("click", openWeatherSettings);
            weatherEl.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") openWeatherSettings(e);
            });
        }

        blocks['progress'] = document.createElement('div');
        {
            const grid = blocks['progress'].createDiv({ cls: "sb-prog-grid" });
            const progressItems = [
                { label: "年", percent: yearP, left: `余${dLY}d`, tip: yearTip },
                { label: "月", percent: monthP, left: `余${dLM}d`, tip: monthTip },
                { label: "周", percent: weekP, left: `余${dLW}d`, tip: weekTip },
                { label: "日", percent: dayP, left: `余${hLD}h`, tip: dayTip },
            ];
            progressItems.forEach((item) => {
                const cell = grid.createDiv({ cls: "sb-prog-item", attr: { title: item.tip } });
                const inner = cell.createDiv({ cls: "sb-item-inner" });
                const textRow = inner.createDiv({ cls: "sb-prog-txt" });
                textRow.createSpan({ cls: "sb-prog-label", text: item.label });
                textRow.createSpan({ cls: "sb-prog-left", text: `${item.percent.toFixed(1)}% ${item.left}` });
                const bar = inner.createDiv({ cls: "sb-pixel-bar" });
                const fill = bar.createDiv({ cls: "sb-pixel-bar-fill" });
                fill.style.width = `${item.percent}%`;
            });
        }
        
        blocks['buttons'] = document.createElement('div'); const btnBox = blocks['buttons'].createEl("div", { cls: "sb-btn-wrapper" });
        const btns = [
            { n: "捕捉", i: "zap", c: "run-bc-task", tip: "打开捕捉面板" },
            { n: "文件", i: "doc", c: "run-file-wall", tip: "打开文件墙，浏览 Boxes 中的图片/PDF/音视频/附件" },
            { n: "Moments", i: "moments", c: "run-moments", tip: "打开 Moments（读&写/Moments/YYYY.md）" },
            { n: "归档", i: "archive", c: "run-archive", tip: "归档当前或最近打开的 Markdown 笔记中已完成的待办" }
        ];
        const quickActionIconIds = { zap: "zap", doc: "file-text", moments: "sparkles", archive: "archive" };
        btns.forEach((item) => {
            const btn = btnBox.createEl("button", { cls: "sb-btn", attr: { title: item.tip, type: "button", "data-bc-command": item.c } });
            const iconHost = btn.createEl("span", { cls: "sb-btn-box", attr: { "aria-hidden": "true" } });
            setIcon(iconHost, quickActionIconIds[item.i]);
            btn.createEl("span", { cls: "sb-btn-name", text: item.n });
        });
        btnBox.addEventListener("click", (event) => {
            const trigger = event.target?.closest?.("[data-bc-command]");
            if (!trigger || !btnBox.contains(trigger)) return;
            void runCommand(trigger.dataset.bcCommand || "");
        });
        blocks['tasks'] = document.createElement('div');
        blocks['tasks'].setAttribute('data-bc-block', 'tasks');
        const tasksTip = "聚合生活待办（Inbox/Tasks.md）与当前周 Work 文件中的待办";
        {
            const titleRow = blocks['tasks'].createDiv({ cls: "sb-sec-title-row" });
            titleRow.createSpan({ cls: "sb-sec-title", text: "🎯 待办总览" });
            titleRow.createSpan({ cls: "sb-tip-icon", text: "ⓘ", attr: { title: tasksTip } });
            const taskList = blocks['tasks'].createDiv({ cls: "sb-task-list" });
            mountTaskList(taskList);
        }
        
        blocks['habits'] = document.createElement('div');
        blocks['habits'].setAttribute('data-bc-block', 'habits');
        mountHabitsInto(blocks['habits']);
        
        blocks['quote'] = document.createElement('div'); const qBox = blocks['quote'].createEl("div", { cls: "sb-quote-container" });
        const renderQuoteDom = (host, quote) => {
            host.empty();
            const wrap = host.createDiv({ cls: "sb-quote-wrap" });
            wrap.createDiv({ cls: "sb-quote-content", text: `"${String(quote?.t || "")}"` });
            wrap.createDiv({ cls: "sb-quote-src", text: `—— 《${String(quote?.s || "")}》` });
            return wrap;
        };
        const renderQuoteEmpty = (host) => {
            host.empty();
            const wrap = host.createDiv({ cls: "sb-quote-wrap" });
            wrap.style.borderLeftColor = "var(--lifeos-accent)";
            fillBcEmptyState(wrap, {
                message: "暂无金句。将 Weread 划线同步到「读书笔记」目录，或在随笔写 callout。",
                ctaLabel: "去设置读书笔记路径",
                onCta: () => this.plugin.openBrainCoreSettings({ tab: "paths" }),
            });
        };
        const cachedQ = sessionStorage.getItem("sb-quote-cache-f");
        if (cachedQ) { 
            try { 
                const qData = JSON.parse(cachedQ); 
                const cachedQuote = qData?.quote || (Array.isArray(qData?.pool) ? qData.pool[qData.index] : null);
                if (qData.seed === currentSeed && cachedQuote?.t && cachedQuote?.s) renderQuoteDom(qBox, cachedQuote);
                else renderQuoteEmpty(qBox);
            } catch (e) {
                console.warn("[BrainCore] 金句缓存读取失败:", e);
                renderQuoteEmpty(qBox);
            }
        } else renderQuoteEmpty(qBox);

        blocks['stats'] = document.createElement('div');
        blocks['stats'].setAttribute('data-bc-block', 'stats');
        mountStats(blocks['stats']);
        // 问候 + 进度 + 金句合成同一视觉块（点击切换金句，小时刷新种子不变）
        const heroIds = new Set(['greeting', 'progress', 'quote']);
        const enabledMods = this.plugin.settings.modules.filter(m => m.enabled && blocks[m.id]);
        const heroMods = enabledMods.filter(m => heroIds.has(m.id));
        let heroEmitted = false;
        const appendGap = () => container.createDiv({ cls: "sb-module-gap", attr: { "aria-hidden": "true" } });
        enabledMods.forEach(m => {
            if (heroIds.has(m.id)) {
                if (heroEmitted) return;
                heroEmitted = true;
                const heroCanCycle = heroMods.some(hm => hm.id === 'quote');
                const hero = container.createDiv({ cls: "sb-hero-block" });
                heroMods.forEach(hm => {
                    while (blocks[hm.id].firstChild) hero.appendChild(blocks[hm.id].firstChild);
                });
                appendGap();
                return;
            }
            // 保留 data-bc-block 外壳，便于 stats/tasks/habits 局部刷新
            if (m.id === "habits" || m.id === "tasks" || m.id === "stats") {
                container.appendChild(blocks[m.id]);
                appendGap();
                return;
            }
            while (blocks[m.id].firstChild) container.appendChild(blocks[m.id].firstChild);
            appendGap();
        });
        if (container.lastChild && container.lastChild.classList.contains('sb-module-gap')) { container.removeChild(container.lastChild); }

        // 首屏教练条：试用条已占位时不再叠 DV/AM；否则只显示一条（优先 Dataview）
        const dvStatus = getDataviewRuntimeStatus(this.app);
        const amInstalled = !!getAttachmentMgmtSettings(this.app);
        const amAligned = amInstalled && !!getFollowableAmSettings(this.app, settings);
        const needDvCoach = !dvStatus.installed || !dvStatus.jsEnabled;
        const needAmCoach = !amInstalled && !settings.attachmentMgmtHintSeen;
        if (!trialBannerShown && (needDvCoach || needAmCoach || (amInstalled && !amAligned))) {
            const banner = container.createDiv({ cls: "bc-dv-banner" });
            banner.style.cssText = "margin:0 0 12px;padding:10px 12px;border-radius:10px;background:var(--background-secondary);font-size:12px;line-height:1.5;color:var(--text-muted);border:1px solid var(--background-modifier-border);";
            const openCommunity = (e) => {
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
            if (needDvCoach) {
                if (!dvStatus.installed) {
                    banner.createSpan({ text: "文件墙需要 " });
                    const dvLink = banner.createEl("a", { text: "Dataview", href: "#" });
                    dvLink.style.color = "var(--text-accent)";
                    dvLink.addEventListener("click", openCommunity);
                    banner.createSpan({ text: "，并开启 DataviewJS。" });
                } else {
                    banner.createSpan({ text: "请开启 Dataview → JavaScript Queries / DataviewJS，文件墙才能显示卡片看板。" });
                }
            } else if (amInstalled && !amAligned) {
                banner.createSpan({ text: "Attachment Management 根目录未对齐 Boxes，捕捉已改用内置四分类；按使用说明「十三」配置后即可跟随 AM。" });
            } else if (needAmCoach) {
                banner.createSpan({ text: "全库粘贴分类可安装 " });
                const amLink = banner.createEl("a", { text: "Attachment Management", href: "#" });
                amLink.style.color = "var(--text-accent)";
                amLink.addEventListener("click", openCommunity);
                banner.createSpan({ text: "（可选；捕捉已有内置四分类）。" });
                const dismiss = banner.createEl("a", { text: "不再提示", href: "#" });
                dismiss.style.cssText = "margin-left:8px;color:var(--text-muted);text-decoration:underline;";
                dismiss.addEventListener("click", (e) => {
                    e.preventDefault();
                    this.plugin.settings.attachmentMgmtHintSeen = true;
                    void this.plugin.saveSettings();
                    banner.remove();
                });
            }
            container.prepend(banner);
        }

        // 空态链接已在 renderQuoteEmpty 内绑定；此处不再依赖易失效的一次性 querySelector
        const taskTipEl = container.querySelector(".sb-tip-icon");
        if (taskTipEl) {
            taskTipEl.setAttribute("role", "button");
            taskTipEl.setAttribute("tabindex", "0");
            taskTipEl.setAttribute("aria-label", tasksTip);
            const showTaskTip = (e) => {
                e.stopPropagation();
                new Notice(tasksTip, 5000);
            };
            taskTipEl.addEventListener("click", showTaskTip);
            taskTipEl.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") showTaskTip(e); });
        }

        if (settings.modules.find(m => m.id === 'quote' && m.enabled)) { 
            const persistQuoteCache = (quote, index, pool) => {
                try {
                    const slimPool = Array.isArray(pool)
                        ? pool.slice(0, 240).map(q => ({
                            id: String(q.id || ""),
                            t: String(q.t || ""),
                            s: String(q.s || ""),
                            kind: q.kind || "",
                        }))
                        : undefined;
                    sessionStorage.setItem("sb-quote-cache-f", JSON.stringify({
                        seed: currentSeed,
                        quote: {
                            id: String(quote?.id || ""),
                            t: String(quote?.t || ""),
                            s: String(quote?.s || ""),
                            kind: quote?.kind || "",
                        },
                        index,
                        pool: slimPool,
                    }));
                } catch (e) {
                    try {
                        sessionStorage.setItem("sb-quote-cache-f", JSON.stringify({
                            seed: currentSeed,
                            quote: { t: String(quote?.t || ""), s: String(quote?.s || "") },
                            index,
                        }));
                    } catch (err) { /* ignore */ }
                }
            };
            const applyQuoteAt = (index) => {
                const pool = this._quotePool;
                if (!pool?.length) return false;
                const idx = ((index % pool.length) + pool.length) % pool.length;
                this._quoteIndex = idx;
                const liveBox = container.querySelector(".sb-quote-container") || qBox;
                if (liveBox) {
                    const wrap = renderQuoteDom(liveBox, pool[idx]);
                    if (wrap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                        wrap.classList.add("is-cycling");
                        window.setTimeout(() => wrap.classList.remove("is-cycling"), 120);
                    }
                }
                persistQuoteCache(pool[idx], idx, pool);
                this.plugin.rememberShownQuote?.(pool[idx]?.id);
                plugin.notifyDataChanged("quote");
                return true;
            };
            const bindHeroQuoteCycle = () => {
                const quoteBox = container.querySelector(".sb-quote-container");
                if (!quoteBox || quoteBox.dataset.bcQuoteBound === "1") return;
                quoteBox.dataset.bcQuoteBound = "1";
                quoteBox.setAttribute("title", "点击切换金句");
                quoteBox.setAttribute("role", "button");
                quoteBox.setAttribute("tabindex", "0");
                quoteBox.setAttribute("aria-label", "点击切换金句");
                const cycle = (e) => {
                    if (e?.target?.closest?.("a, button, input, textarea, .bc-open-quotes-settings, .lifeos-empty-cta, .lifeos-empty-state")) return;
                    const sel = window.getSelection?.();
                    if (sel && !sel.isCollapsed && quoteBox.contains(sel.anchorNode)) return;
                    e?.preventDefault?.();
                    if (!this._quotePool?.length) return;
                    applyQuoteAt((this._quoteIndex ?? 0) + 1);
                };
                quoteBox.addEventListener("click", cycle);
                quoteBox.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        cycle(e);
                    }
                });
            };

            (async () => { 
                try {
                    const cachedQ = sessionStorage.getItem("sb-quote-cache-f");
                    let needPick = true;
                    if (cachedQ) {
                        try {
                        const qData = JSON.parse(cachedQ);
                            const cachedQuote = qData?.quote || (Array.isArray(qData?.pool) ? qData.pool[qData.index] : null);
                            if (qData.seed === currentSeed && cachedQuote?.t && cachedQuote?.s) {
                                if (Array.isArray(qData.pool) && qData.pool.length) {
                                    this._quotePool = qData.pool;
                                    this._quoteIndex = Number.isInteger(qData.index)
                                        ? qData.index
                                        : 0;
                                    needPick = false;
                                }
                            }
                        } catch (e) { /* fall through */ }
                    }
                    // 增量同步索引（含每日新增读书笔记）；同小时有缓存时仍后台追平，不挡展示
                    const syncResult = await this.plugin.ensureQuoteIndexReady?.({
                        budget: needPick ? BC_QUOTE_SYNC_BUDGET : Math.min(8, BC_QUOTE_SYNC_BUDGET),
                    });
                    if (!needPick) {
                        bindHeroQuoteCycle();
                        if (syncResult?.pending) this.plugin.scheduleQuoteIndexSync?.("catch-up");
                        return;
                    }

                    const picked = this.plugin.pickHourlyQuote?.(currentSeed);
                    if (picked?.pool?.length && picked.quote) {
                        this._quotePool = picked.pool;
                        applyQuoteAt(picked.index);
                    } else {
                        const liveBox = container.querySelector(".sb-quote-container") || qBox;
                        if (liveBox) renderQuoteEmpty(liveBox);
                    }
                    bindHeroQuoteCycle();
                    if (syncResult?.pending) this.plugin.scheduleQuoteIndexSync?.("catch-up");
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
                const WEATHER_FAIL_TEXT = "🌤️ 天气暂不可用";
                const WEATHER_PENDING_MARKERS = ["定位中", "天气加载中", "天气暂不可用"];
                const defLat = parseFloat(settings.defaultLat) || 31.81;
                const defLon = parseFloat(settings.defaultLon) || 119.97;

                const isWeatherCacheHit = (text, ts) => {
                    if (!text || !ts) return false;
                    const s = String(text);
                    if (WEATHER_PENDING_MARKERS.some(m => s.includes(m))) return false;
                    return Date.now() - ts < WEATHER_TTL_MS;
                };

                const writeWeather = (value, persist = true) => {
                    const text = weatherTextOf(value);
                    const wEl = container.querySelector('#' + weatherId);
                    if (wEl) {
                        const failed = text.includes("天气暂不可用");
                        wEl.setText(failed ? `${text} · 点此填城市坐标` : text);
                        wEl.toggleClass("is-error", failed);
                        wEl.setAttr("role", failed ? "button" : "status");
                        if (failed) {
                            wEl.setAttr("tabindex", "0");
                            wEl.setAttr("aria-label", "天气加载失败，点击去设置城市坐标");
                        } else {
                            wEl.removeAttribute("tabindex");
                            wEl.removeAttribute("aria-label");
                        }
                    }
                    if (persist && !text.includes("天气暂不可用")) {
                        sessionStorage.setItem("sb-weather-cache-f", JSON.stringify({ ts: Date.now(), text }));
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
                    if (!settings.weatherAutoLocate) return null;
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
                            if (isWeatherCacheHit(weatherTextOf(cached?.text || cached?.html), cached?.ts)) {
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
                    writeWeather(WEATHER_FAIL_TEXT, false);
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
        // Capture + quick panel CSS ship via styles.css.
        if (typeof CaptureModal !== "undefined" && CaptureModal.prototype?.injectStyles) {
            CaptureModal.prototype.injectStyles.call({ app: this.app, plugin: this.plugin });
        }
        ["bc-ios-quick-style-v3", "bc-ios-quick-style-v2", "bc-ios-quick-style-v1"].forEach((id) => {
            document.getElementById(id)?.remove();
        });
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
                if (e.shiftKey) { void this.saveByCaptureLogic({ label: "草稿", icon: "📋", isDraft: true }); return; }
                void this.submitActiveCategory();
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


    async submitActiveCategory() {
        const item = this.categoryRow?.getItem?.();
        if (!item) { new Notice("请先选择一个分类"); return; }
        if (item.isMaterial) { await this.saveByMaterialLogic(); return; }
        await this.saveByCaptureLogic(item);
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
        const addTool = (svg, cb, label) => {
            const btn = toolbar.createEl("button", { cls: "bc-tool-btn", attr: { type: "button", "aria-label": label, title: label } });
            btn.innerHTML = svg;
            btn.onclick = (e) => { e.preventDefault(); cb(e); };
            return btn;
        };
        addTool(ICONS.expand, () => this.toggleQuickSize(), "放大 / 还原输入框");
        addTool(ICONS.upload, () => this.triggerQuickUpload(), "上传文件");
        addTool(ICONS.tag, () => this.pickAndInsertTag(), "插入标签");
        addTool(ICONS.uList, () => this.insertAtCursor("- "), "插入无序列表");
        addTool(ICONS.oList, () => this.insertAtCursor("1. "), "插入有序列表");
        addTool(ICONS.time, () => this.insertAtCursor(` 📅 ${window.moment().format("YYYY-MM-DD HH:mm")}`), "插入日期时间");
        addTool(ICONS.flag, (e) => this.showPriorityMenu(e), "设置优先级");
        addTool(ICONS.doc, (e) => this.showDraftHistory(e), "草稿历史");

        const btnRow = shell.createDiv({ cls: "bc-button-row" });
        const items = [
            { label: "工作", icon: "💼", isWork: true },
            { label: "生活", icon: "🏠", isLife: true },
            { label: "Moments", iconName: "sparkles", isIdea: true },
            { label: "随笔", icon: "📝", isEssay: true },
            { label: "剪藏", icon: "🔖", isClipper: true },
            { label: "素材", icon: "🎨", isMaterial: true },
            { label: "草稿", icon: "📋", isDraft: true }
        ];
        const tips = { 工作: "写入周工作待办", 生活: "写入生活待办", Moments: "写入 Moments 年文件", 随笔: "写入随笔", 剪藏: "需粘贴 URL", 素材: "仅文件", 草稿: "写入草稿" };
        this.categoryRow = mountCaptureCategoryRow(shell, btnRow, items, {
            getTip: (item) => tips[item.label] || item.label,
            onCategoryClick: (item) => item.isMaterial ? this.saveByMaterialLogic() : this.saveByCaptureLogic(item),
            activeKey: items.some((item) => getCaptureCategoryKey(item) === this.plugin.settings.lastCaptureCategory)
                ? this.plugin.settings.lastCaptureCategory
                : "moments",
            onActiveChange: (key) => {
                if (!key || this.plugin.settings.lastCaptureCategory === key) return;
                this.plugin.settings.lastCaptureCategory = key;
                void this.plugin.saveSettings();
            },
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
        // 手机端不自动聚焦：避免快捷指令/下拉唤起时立刻弹键盘；点输入区再出键盘
        if (!this.app.isMobile) {
            try { this.quickTextArea?.focus?.({ preventScroll: true }); } catch (_) { /* ignore */ }
        }
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
        // Moments：Memoria 同源逻辑写入 BrainCore（视图 id = braincore-moments-view）
        registerMomentsViews(this);
        injectMomentsStyles();

        // 协议尽早挂上：Obsidian 冷启动时 deep link 可能先于 loadSettings 到达
        this.registerObsidianProtocolHandler("braincore", async (params) => {
            const action = String(params?.action || params?.a || "quick").toLowerCase();
            if (!this._deepLinkReady) {
                this._pendingDeepLink = action;
                return;
            }
            await this.handleBrainCoreDeepLink(action);
        });

        // 目录迁移（须在 loadSettings 前拷 data.json）
        try {
            if ((this.manifest?.id || "") === BRAINCORE_PERSONAL_ID) {
                const migratedPersonal = await migratePublicIdToPersonalInstall(this);
                if (migratedPersonal) {
                    window.setTimeout(() => {
                        new Notice("BrainCore 个人版已迁到独立目录 braincore-lifeos-personal（设置已保留；社区版已从启用列表移除）。若异常请重启 Obsidian。", 9000);
                    }, 1200);
                }
            } else {
            const migrated = await migrateLegacyBrainCoreInstall(this);
            if (migrated) {
                window.setTimeout(() => {
                    new Notice("BrainCore 已统一到 plugins/braincore-lifeos（设置/激活已保留）。若异常请重启 Obsidian。", 8000);
                }, 1200);
                }
            }
        } catch (e) {
            console.warn("BrainCore 目录迁移失败:", e);
        }

        // 3. 异步加载真实配置；设置一到手就放行 deep link（别等试用写入 / 路径迁移）
        await this.loadSettings();
        syncLicenseState(this.app, this.settings);
        this._deepLinkReady = true;
        this.startPluginDataWatch();
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
        this.addCommand({ id: "open-moments", name: "打开 BrainCore Moments", callback: () => { if (this.requireLicense()) void this.activateMomentsView(); } });
        this.addCommand({ id: "open-capsule", name: "打开 BrainCore Moments（兼容旧命令）", callback: () => { if (this.requireLicense()) void this.activateMomentsView(); } });
        this.addCommand({ id: "run-archive", name: "BrainCore 归档当前笔记待办", callback: () => { if (this.requireLicense()) this.archiveTasks(); } });
        this.addCommand({ id: "open-file-wall", name: "打开文件墙", callback: () => { if (this.requireLicense()) void this.openFileWall(); } });

        // 4. 暴露全局 API
        publishBrainCoreGlobal(this, "BrainCoreAPI", Object.freeze({
            openCapture: () => { if (this.requireLicense()) new CaptureModal(this.app, this).open(); },
            openMoments: () => { if (this.requireLicense()) void this.activateMomentsView(); },
            openCapsule: () => { if (this.requireLicense()) void this.activateMomentsView(); },
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
                        const raw = data?.text || data?.html;
                        const parsed = new DOMParser().parseFromString(String(raw || ""), "text/html");
                        const text = String(parsed.body?.textContent || "").replace(/\s+/g, " ").trim();
                        if (text && !text.includes("定位中") && !text.includes("天气加载中") && !text.includes("天气暂不可用") && Date.now() - (data.ts || 0) < 3600000) {
                            return text;
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
                        const quote = data?.quote || (Array.isArray(data?.pool) ? data.pool[data.index] : null);
                        if (quote?.t && quote?.s) return { text: String(quote.t), source: String(quote.s) };
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
                const stat = this._dashboardStatAction;
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
                    if (type === "ideas" || type === "moments") {
                        if (this.requireLicense()) void this.activateMomentsView();
                        return true;
                    }
                    stat(type, query);
                    return true;
                } catch (e) {
                    console.warn("[BrainCore] runStatAction 失败:", e);
                    return false;
                }
            },
        }));
        
        this.registerEvent(this.app.vault.on('create', async (file) => {
            if (file.extension !== 'md') return; const basePath = this.settings.pathWork.replace(/\/$/, '');
            if (!file.path.startsWith(basePath) || !file.name.match(/^WK\d{2}/)) return;
            setTimeout(async () => { if (!this.app.vault.getAbstractFileByPath(file.path)) return; const content = await this.app.vault.read(file); if (content.trim() === "") await this.populateWeeklyFile(file); }, 500);
        }));

        this.injectDashboardStyles();
        this.addRibbonIcon('cloud', '打开 BrainCore', () => { this.activateView(); });

        // 加载完成后：刷新使用说明版本戳；升级则弹一次更新说明
        this.app.workspace.onLayoutReady(async () => {
            await this.migrateOldHabitData();
            try {
                await migrateSuisuiAndIdeasToMoments(this);
            } catch (e) {
                console.warn("[BrainCore] Moments 迁移失败:", e);
            }
            await this.refreshPendingTasksCountCache();
            this.checkTrialExpiryReminders();
            maybeShowLifeOsSuitePrompt(this.app, this.manifest.id, this.manifest.name);
            if (this.isFirstInstall()) {
                await this.maybeOfferUsageGuideOnce();
                this.settings.lastSeenVersion = PLUGIN_VERSION;
                await this.saveSettings();
            } else {
                this.maybeShowUpdateNotice();
                await this.maybeOfferUsageGuideOnce();
            }
            this.startWeeklyWorkWatch();
            this.startDailyDashboardWatch();
            this.scheduleQuoteIndexSync?.("startup");
            void this.ensureCurrentWeekWorkFileIfNeeded("startup");
            // 延后打开 Moments，避免与更新说明/试用弹窗抢焦点
            if (this.settings.momentsSettings?.openOnStartup && isAccessAllowed(this.app, this.settings)) {
                window.setTimeout(() => {
                    if (!this.settings.momentsSettings?.openOnStartup) return;
                    if (!isAccessAllowed(this.app, this.settings)) return;
                    void this.activateMomentsView();
                }, 900);
            }
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
                "试用期间可随时在控制台输入激活码永久绑定本设备；若手机/电脑共用同一库，另一端也需各激活一次。",
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
        return this.settings.welcomeGuideVersion === USAGE_GUIDE_VERSION
            || this.settings.usageGuideAutoShownForVersion === PLUGIN_VERSION;
    }

    /** 仅初次安装或插件版本升级时自动生成并打开一次；删掉或读过后同一版本不再冒出来 */
    async maybeOfferUsageGuideOnce() {
        const version = typeof PLUGIN_VERSION === "string" ? PLUGIN_VERSION : "";
        if (!version) return;
        if (this.settings.usageGuideAutoShownForVersion === version) return;

        const seen = String(this.settings.lastSeenVersion || "").trim();
        if (seen === version) {
            this.settings.usageGuideAutoShownForVersion = version;
            this.settings.welcomeGuideVersion = USAGE_GUIDE_VERSION;
            await this.saveSettings();
            return;
        }

        try {
            if (typeof openBrainCoreUsageGuide === "function") {
                await openBrainCoreUsageGuide(this, { forceOpen: true, rewrite: true });
            }
        } catch (e) {
            console.warn("[BrainCore] 使用说明自动打开失败:", e);
        }
        this.settings.usageGuideAutoShownForVersion = version;
        this.settings.welcomeGuideVersion = USAGE_GUIDE_VERSION;
        await this.saveSettings();
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
        // 内置已按图片/PDF/音视频/附件分类；不再强推安装 AM
        if (this.settings.attachmentMgmtHintSeen) return;
        this.settings.attachmentMgmtHintSeen = true;
        this.saveSettings();
    }

    async resolveCaptureTargetNotePath(item, now) {
        if (item?.isWork) {
            const workFile = await this.getOrCreateWeeklyWorkFile(now);
            return workFile?.path || this.settings.pathWork || "Work";
        }
        if (item?.isLife) return this.settings.pathTasks || "Inbox/Tasks.md";
        if (item?.isIdea) return this.settings.pathMoments || "读&写/Moments";
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
        if (a === "capsule" || a === "voice" || a === "mic" || a === "moments") {
            if (!this.requireLicense()) return;
            await this.activateMomentsView();
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
        if (Platform.isMobileApp) {
            new Notice("📱 移动端使用基础剪藏解析", 4000);
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
        await this.ensureAttachmentFoldersReady();
        const dvStatus = getDataviewRuntimeStatus(this.app);
        if (!dvStatus.installed) {
            bcNoticeWarn("文件墙需要 Dataview，并开启 DataviewJS（设置 → Dataview）", 8000);
        } else if (!dvStatus.jsEnabled) {
            bcNoticeWarn("请开启 Dataview → JavaScript Queries / DataviewJS，文件墙才能渲染卡片看板", 8000);
        }
        let file = this.app.vault.getAbstractFileByPath(wallPath);
        const body = getFileWallNoteContent(this.settings);
        if (!(file instanceof TFile)) {
            try {
                await ensureFolderByPath(this.app.vault, wallPath);
                file = await this.app.vault.create(wallPath, body);
            } catch (e) {
                new Notice(`无法创建文件墙：${wallPath}`);
                console.warn("[BrainCore] 创建文件墙失败:", e);
                return;
            }
        } else {
            try {
                const current = await this.app.vault.read(file);
                if (isStubFileWallNote(current)) {
                    await this.app.vault.modify(file, body);
                    bcNoticeSuccess("已恢复完整文件墙看板（最近上传 + 图片/PDF/音视频/附件）");
                } else if (isFileWallOfficialBoard(current)) {
                    const synced = applyFileWallRootsToTemplate(current, this.settings);
                    // 旧官方模板若无递归扫描，整篇换成当前模板（保留路径注入）
                    const needsWalk = !/const walk = \(node\)/.test(current);
                    const next = needsWalk ? body : (synced !== current ? synced : null);
                    if (next && next !== current) {
                        await this.app.vault.modify(file, next);
                    }
                }
            } catch (e) {
                console.warn("[BrainCore] 升级文件墙模板失败:", e);
            }
        }
        if (file instanceof TFile) {
            await this.app.workspace.getLeaf(false).openFile(file);
        }
    }

    /** 确保 Boxes / 附件等上传依赖目录存在（可重复调用） */
    async ensureAttachmentFoldersReady() {
        const s = this.settings || {};
        const roots = typeof getBuiltinAttachmentRoots === "function"
            ? getBuiltinAttachmentRoots(s)
            : null;
        const folders = [
            "Boxes",
            roots?.images || "Boxes/图片",
            roots?.pdf || "Boxes/PDF",
            roots?.media || "Boxes/音视频",
            roots?.files || s.pathAttachments || "Boxes/附件",
            s.pathAttachments || "Boxes/附件",
        ];
        for (const folder of [...new Set(folders.filter(Boolean))]) {
            try {
                await ensureFolderByPath(this.app.vault, `${String(folder).replace(/\/+$/, "")}/.keep`);
            } catch (e) {
                console.warn("[BrainCore] 附件目录准备失败:", folder, e);
            }
        }
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
            // 老库里已经有「闪念归档」时继续往那儿写，避免同一批记录被劈成两个文件。
            archivePath = this.app.vault.getAbstractFileByPath("归档/闪念归档.md")
                ? "归档/闪念归档.md"
                : "归档/Moments归档.md";
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
        // Moments 已经接管随手记，新库不再生成 Inbox/Ideas.md 与归档/闪念归档.md；
        // 老库里已有的这两个文件保持原样，读取与归档仍然兼容。
        const archivePaths = ["归档/待办归档.md", "归档/草稿归档.md"];
        const filePaths = [s.pathTasks, s.pathDrafts, s.pathEssays, ...archivePaths].filter(Boolean);
        const folderList = [
            "Inbox", "Work", "Boxes", "Boxes/附件", "读&写", "归档",
            s.pathWork, s.pathClippings, s.pathClipReflections || "读&写/剪藏感悟", s.pathAttachments || "Boxes/附件",
            s.pathMoments || "读&写/Moments", "Boxes/图片",
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

        const momentsFolder = s.pathMoments || "读&写/Moments";
        await ensureFolder(momentsFolder);
        await ensureFolder("Boxes/图片");
        await ensureFolder("Boxes/PDF");
        await ensureFolder("Boxes/音视频");
        await ensureFolder("Boxes/附件");
        await createIfMissing(
            s.pathMaterials || "Boxes/文件墙.md",
            getFileWallNoteContent(s)
        );
        await createIfMissing(s.pathTasks, "## ✅ 待办\n\n");
        await createIfMissing(s.pathDrafts, "## ✍️ 随手草稿\n\n");
        await createIfMissing(s.pathEssays, "## 📝 随笔\n\n");
            await createIfMissing("归档/待办归档.md", "## 📦 归档记录\n\n");
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
        if (!prevFile) return true;
        const oldContent = await this.app.vault.read(prevFile);
        const sectionTodo = getWeeklySectionNames(this.settings).todo;
        const todoRegex = new RegExp(`((?:##\\s*${escapeRegex(sectionTodo)})\\n)([\\s\\S]*?)(\\n---|## |$)`);
        const match = oldContent.match(todoRegex);
        let carriedTasks = [];
        if (!match) return true;
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
            return true;
        }
        let thisFile = getWkFile(thisMonday);
        if (!thisFile) thisFile = await this.getOrCreateWeeklyWorkFile(nowObj);
        if (!thisFile) return false;
        const newContent = await this.app.vault.read(thisFile);
        const newMatch = newContent.match(todoRegex);
        if (!newMatch) return false;
            let combined = carriedTasks.join('\n') + '\n' + newMatch[2];
            combined = combined.replace(/(-\s*\[ \]\s*\n)+/g, '- [ ] \n');
            await this.app.vault.modify(thisFile, newContent.replace(todoRegex, `$1${combined}\n$3`));
        await this.app.vault.modify(prevFile, oldContent.replace(todoRegex, `$1${remainingLines.join('\n')}\n`));
            new Notice(`跨周啦！已自动将上周 ${carriedTasks.length} 个未完成待办平移至本周。可在本周 Work 文件中查看。`, 8000);
        return true;
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

    getCurrentIsoWeekKey(nowObj) {
        const now = nowObj || window.moment();
        const weekPad = now.isoWeek().toString().padStart(2, "0");
        const monday = now.clone().startOf("isoWeek");
        let targetYear = monday.year();
        const targetMonth = monday.month() + 1;
        if (weekPad === "01" && targetMonth === 12) targetYear += 1;
        return `${targetYear}-WK${weekPad}`;
    }

    async runWeeklyMigrateIfNeeded(nowObj) {
        const now = nowObj || window.moment?.();
        if (!now?.isValid?.()) return;
        const weekKey = this.getCurrentIsoWeekKey(now);
        const migrateKey = getVaultScopedStorageKey(this.app, "bc-migrated-wk-" + weekKey);
        if (localStorage.getItem(migrateKey) === "true") return;
        localStorage.setItem(migrateKey, "pending");
        try {
            const ok = await this.autoMigrateWeeklyTasks(now);
            localStorage.setItem(migrateKey, ok ? "true" : "pending");
        } catch (e) {
            localStorage.removeItem(migrateKey);
            console.warn("[BrainCore] 周迁移失败:", e);
        }
    }

    /** 不依赖控制台是否打开：系统时间跨周后，Obsidian 还在就会建本周模板并迁移待办 */
    startWeeklyWorkWatch() {
        if (this._weeklyWatchStarted) return;
        this._weeklyWatchStarted = true;
        const intervalMs = this.app.isMobile ? 120000 : 60000;
        this.registerInterval(window.setInterval(() => {
            void this.ensureCurrentWeekWorkFileIfNeeded("interval");
        }, intervalMs));
        this.registerDomEvent(document, "visibilitychange", () => {
            if (!document.hidden) void this.ensureCurrentWeekWorkFileIfNeeded("visible");
        });
        this.registerDomEvent(window, "focus", () => {
            void this.ensureCurrentWeekWorkFileIfNeeded("focus");
        });
        this.armWeeklyRolloverTimer();
    }

    /** 跨日：即使控制台在后台，午夜后也触发刷新；前台回来再核对一次日历日 */
    startDailyDashboardWatch() {
        if (this._dailyWatchStarted) return;
        this._dailyWatchStarted = true;
        const moment = window.moment || bcMoment;
        this._pluginCalendarDayKey = bcLocalDayKey();
        const notifyDashboardDayRollover = (reason) => {
            this.app.workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD).forEach((leaf) => {
                try {
                    leaf.view?.requestCalendarDayRollover?.(reason);
                } catch (_) { /* ignore */ }
            });
        };
        const check = (reason) => {
            const day = bcLocalDayKey();
            if (!this._pluginCalendarDayKey) {
                this._pluginCalendarDayKey = day;
                return;
            }
            if (day === this._pluginCalendarDayKey) return;
            this._pluginCalendarDayKey = day;
            notifyDashboardDayRollover(reason);
        };
        const intervalMs = this.app.isMobile ? 120000 : 60000;
        this.registerInterval(window.setInterval(() => check("interval"), intervalMs));
        this.registerDomEvent(document, "visibilitychange", () => {
            if (!document.hidden) check("visible");
        });
        this.registerDomEvent(window, "focus", () => check("focus"));
        this.armDailyRolloverTimer(check);
    }

    armDailyRolloverTimer(checkFn) {
        if (this._dailyRolloverTimer) {
            window.clearTimeout(this._dailyRolloverTimer);
            this._dailyRolloverTimer = null;
        }
        const now = new Date();
        const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1, 500);
        let wait = next.getTime() - now.getTime();
        if (!Number.isFinite(wait) || wait < 1000) wait = 60 * 1000;
        // 最长 6 小时重挂一次，避免超长 setTimeout 在休眠后漂移过大
        const delay = Math.min(wait, 6 * 60 * 60 * 1000);
        this._dailyRolloverTimer = window.setTimeout(() => {
            this._dailyRolloverTimer = null;
            checkFn?.("midnight");
            this.armDailyRolloverTimer(checkFn);
        }, delay);
    }

    armWeeklyRolloverTimer() {
        if (this._weeklyRolloverTimer) {
            window.clearTimeout(this._weeklyRolloverTimer);
            this._weeklyRolloverTimer = null;
        }
        const now = window.moment?.();
        if (!now?.isValid?.()) return;
        const nextMonday = now.clone().startOf("isoWeek").add(1, "week");
        let wait = nextMonday.diff(now) + 1500;
        if (!Number.isFinite(wait) || wait < 1000) wait = 60 * 1000;
        const delay = Math.min(wait, 6 * 60 * 60 * 1000);
        this._weeklyRolloverTimer = window.setTimeout(() => {
            this._weeklyRolloverTimer = null;
            void this.ensureCurrentWeekWorkFileIfNeeded("rollover");
            this.armWeeklyRolloverTimer();
        }, delay);
    }

    async ensureCurrentWeekWorkFileIfNeeded(reason = "check") {
        if (this._ensuringWeekWork) return;
        if (typeof isAccessAllowed === "function" && !isAccessAllowed(this.app, this.settings)) return;
        const now = window.moment?.();
        if (!now?.isValid?.()) return;
        const weekKey = this.getCurrentIsoWeekKey(now);
        const migrateKey = getVaultScopedStorageKey(this.app, "bc-migrated-wk-" + weekKey);
        const migrateDone = localStorage.getItem(migrateKey) === "true";
        const existing = this.findWeeklyWorkFile(now);
        if (existing && this._ensuredWeekKey === weekKey && migrateDone) return;
        this._ensuringWeekWork = true;
        try {
            await this.runWeeklyMigrateIfNeeded(now);
            if (!this.findWeeklyWorkFile(now)) {
                await this.getOrCreateWeeklyWorkFile(now);
            }
            this._ensuredWeekKey = weekKey;
        } finally {
            this._ensuringWeekWork = false;
        }
    }

    async loadSettings() { 
        const loaded = await this.loadData(); 
        this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded); 
        if (!Object.prototype.hasOwnProperty.call(loaded || {}, "weatherAutoLocate")) {
            this.settings.weatherAutoLocate = !!(loaded && Object.keys(loaded).length);
        } 
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
                if (m.id === "tasks" && (m.name === "本周待办列表" || m.name === "本周待办" || m.name === "待办列表")) m.name = "待办总览";
                if (m.id === "progress" && m.name === "时间进度条") m.name = "时间进度";
                if (m.id === "greeting") m.name = "问候+天气+进度+金句";
                if (m.id === "buttons" && (m.name === "快捷工具按钮" || m.name === "快速捕捉")) m.name = "快捷捕捉";
                if (m.id === "quote" && (m.name === "每日金句" || m.name === "读书笔记")) m.name = "每日金句";
            });
        }
        if (isTrialEdition() && this.settings.trialStartedAt && !this.settings.trialWelcomeSeen) {
            this.settings.trialWelcomeSeen = true;
        }
        ensureLicenseKeysMigrated(this.settings);
        const wasActivated = !!this.settings.licenseActivated;
        const hadTrialStart = !!this.settings.trialStartedAt;
        if (isTrialEdition() && this.settings.trialWelcomeSeen) {
            ensureTrialStarted(this.app, this.settings, true);
        }
        syncLicenseState(this.app, this.settings);
        if ((this.settings.licenseActivated && !wasActivated) || (this.settings.trialStartedAt && !hadTrialStart) || (isTrialEdition() && this.settings.trialWelcomeSeen && !hadTrialStart)) {
            await this.saveSettings();
        }
        await this.refreshPluginDataMtimeCache();
    }
    
    async saveSettings() {
        this._lastSaveSettingsAt = Date.now();
        await this.saveData(this.settings);
        await this.refreshPluginDataMtimeCache();
    }

    getPluginDataJsonPath() {
        return `.obsidian/plugins/${this.manifest.id}/data.json`;
    }

    async refreshPluginDataMtimeCache() {
        try {
            const stat = await this.app.vault.adapter.stat(this.getPluginDataJsonPath());
            if (stat?.mtime != null) this._pluginDataMtime = stat.mtime;
        } catch (_) { /* ignore */ }
    }

    /**
     * Mac App / 外部程序改写 data.json 后，Obsidian 内存里的 settings 不会自动更新。
     * 用 onExternalSettingsChange + 定时轮询 mtime 拉回 habitData。
     */
    async onExternalSettingsChange() {
        await this.applyExternalPluginData("external");
    }

    isHabitsModuleEnabled() {
        return (this.settings?.modules || []).some((m) => m && m.id === "habits" && m.enabled !== false);
    }

    isDashboardLeafActive() {
        try {
            if (typeof document !== "undefined" && document.hidden) return false;
            return this.app.workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD).some((leaf) => {
                const view = leaf?.view;
                if (view && typeof view.isDashboardActive === "function") return view.isDashboardActive();
                if (typeof leaf?.isVisible === "function" && !leaf.isVisible()) return false;
                const el = view?.containerEl;
                if (!el?.isConnected) return false;
                return (el.clientWidth || 0) >= 12 && (el.clientHeight || 0) >= 12;
            });
        } catch (_) {
            return false;
        }
    }

    /**
     * 仅在需要同步打卡数据时 stat data.json：
     * - 打卡模块关闭：不轮询
     * - 控制台可见：按 interval 轮询
     * - 控制台不可见：跳过 interval，窗口重新获得焦点 / 唤醒时仍同步一次
     */
    shouldPollPluginData(reason = "interval") {
        if (!this.isHabitsModuleEnabled()) return false;
        if (this.isDashboardLeafActive()) return true;
        return reason === "window-focus" || reason === "wake" || reason === "focus";
    }

    startPluginDataWatch() {
        if (this._pluginDataWatchStarted) return;
        this._pluginDataWatchStarted = true;
        // 桌面端约 2s；移动端 8s，仅 stat data.json，mtime 未变则立即返回
        const intervalMs = this.app.isMobile ? 8000 : 2000;
        this.registerInterval(window.setInterval(() => {
            if (!this.shouldPollPluginData("interval")) return;
            void this.pollPluginDataFromDisk("interval");
        }, intervalMs));
        this.registerDomEvent(window, "focus", () => {
            if (!this.shouldPollPluginData("window-focus")) return;
            void this.pollPluginDataFromDisk("window-focus");
        });
    }

    async pollPluginDataFromDisk(reason = "poll") {
        if (!this.shouldPollPluginData(reason)) return false;
        if (this._reloadingExternalData) return false;
        try {
            const stat = await this.app.vault.adapter.stat(this.getPluginDataJsonPath());
            if (!stat || stat.mtime == null) return false;
            const prev = this._pluginDataMtime;
            if (prev != null && stat.mtime === prev) return false;
            // 刚写入自己的 save，跳过一轮避免无意义重绘
            if (Date.now() - (this._lastSaveSettingsAt || 0) < 900) {
                this._pluginDataMtime = stat.mtime;
                return false;
            }
            this._pluginDataMtime = stat.mtime;
            return await this.applyExternalPluginData(reason);
        } catch (_) {
            return false;
        }
    }

    async applyExternalPluginData(reason = "external") {
        if (this._reloadingExternalData) return false;
        this._reloadingExternalData = true;
        try {
            const loaded = await this.loadData();
            if (!loaded || typeof loaded !== "object") return false;
            const prevHabit = JSON.stringify(this.settings?.habitData || {});
            const prevConfig = JSON.stringify(this.settings?.habitsConfig || []);
            const nextHabit = JSON.stringify(loaded.habitData || {});
            const nextConfig = JSON.stringify(loaded.habitsConfig || []);

            // 外部写入以磁盘为准合并关键字段，避免整表 Object.assign 冲掉尚未落盘的内存态时丢路径等
            const mergeKeys = [
                "habitData", "habitsConfig", "statsHistory",
                "pathIdeas", "pathMoments", "momentsMigrated", "momentsImportedToMemoria", "momentsYearlyMigratedV2", "momentsReadWriteMigrationV3", "momentsMigrationNoticeAt", "momentsSettings", "pathTasks", "pathEssays", "pathWork", "pathClippings",
                "pathClipReflections", "clipCategories", "pathDrafts", "pathAttachments",
                "pathMaterials", "pathQuotes", "modules",
            ];
            for (const key of mergeKeys) {
                if (loaded[key] !== undefined) this.settings[key] = loaded[key];
            }
            // 激活码按并集合并，避免手机/电脑互相覆盖
            const diskKeys = collectStoredLicenseKeys(loaded);
            const union = new Set([
                ...collectStoredLicenseKeys(this.settings),
                ...diskKeys,
            ]);
            this.settings.licenseKeys = [...union];
            const wasLicensed = !!this.settings.licenseActivated;
            syncLicenseState(this.app, this.settings);
            // 并集比磁盘多时写回，让另一端同步到双端码
            if (union.size > diskKeys.length || (!!this.settings.licenseActivated !== wasLicensed)) {
                await this.saveSettings();
            }
            if (!this.settings.habitsConfig || this.settings.habitsConfig.length === 0) {
                this.settings.habitsConfig = DEFAULT_SETTINGS.habitsConfig.map(m => ({ ...m }));
            }
            if (!Array.isArray(this.settings.clipCategories) || !this.settings.clipCategories.length) {
                this.settings.clipCategories = [...DEFAULT_CLIP_CATEGORIES];
            }

            const habitChanged = prevHabit !== nextHabit || prevConfig !== nextConfig;
            if (habitChanged) {
                this.app.workspace.getLeavesOfType(VIEW_TYPE_DASHBOARD).forEach((leaf) => {
                    const view = leaf?.view;
                    if (view && typeof view.queueRefresh === "function") {
                        view.queueRefresh("habits");
                    }
                });
                this.notifyDataChanged("habits");
            }
            await this.refreshPluginDataMtimeCache();
            return habitChanged;
        } catch (e) {
            console.warn("[BrainCore] 外部 data.json 同步失败:", e);
            return false;
        } finally {
            this._reloadingExternalData = false;
        }
    }

    initTodayRenameRegistry() {
        const momentFn = window.moment;
        this._todayRenameDate = momentFn ? momentFn().format("YYYY-MM-DD") : bcLocalDayKey();
        this._todayRenames = [];
        this.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
            const today = momentFn ? momentFn().format("YYYY-MM-DD") : bcLocalDayKey();
            if (today !== this._todayRenameDate) {
                this._todayRenameDate = today;
                this._todayRenames = [];
            }
            if (!oldPath || !file?.path || oldPath === file.path) return;
            if (isIgnoredStatPath(file.path) || isIgnoredStatPath(oldPath)) return;
            this._todayRenames.push({ from: oldPath, to: file.path });
            if (bcIsQuoteSourcePath?.(this.settings, oldPath) || bcIsQuoteSourcePath?.(this.settings, file.path)) {
                if (this._quoteIndex?.sources?.[oldPath]) {
                    delete this._quoteIndex.sources[oldPath];
                }
                this.scheduleQuoteIndexSync("rename", file.path);
            }
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
        const today = momentFn ? momentFn().format("YYYY-MM-DD") : bcLocalDayKey();
        if (today !== this._todayRenameDate) {
            this._todayRenameDate = today;
            this._todayRenames = [];
        }
        return Array.isArray(this._todayRenames) ? this._todayRenames.slice() : [];
    }

    scheduleQuoteIndexSync(reason = "sync", focusPath = "") {
        this._quoteSyncFocusPath = focusPath || this._quoteSyncFocusPath || "";
        if (this._quoteSyncTimer) window.clearTimeout(this._quoteSyncTimer);
        this._quoteSyncTimer = window.setTimeout(() => {
            this._quoteSyncTimer = null;
            const focus = this._quoteSyncFocusPath;
            this._quoteSyncFocusPath = "";
            void this.ensureQuoteIndexReady({
                budget: BC_QUOTE_SYNC_BUDGET,
                focusPath: focus,
                reason,
            }).then((res) => {
                if (res?.pending) this.scheduleQuoteIndexSync("catch-up");
            }).catch((e) => console.warn("[BrainCore] 金句索引同步失败:", e));
        }, reason === "startup" ? 1200 : 450);
    }

    async loadQuoteIndexFromDisk() {
        const quoteFolder = this.settings.pathQuotes || "Weread";
        const essayPath = this.settings.pathEssays || "读&写/随笔.md";
        try {
            const file = this.app.vault.getAbstractFileByPath(BC_QUOTE_INDEX_PATH);
            if (!file) {
                this._quoteIndex = bcEmptyQuoteIndex(quoteFolder, essayPath);
                return this._quoteIndex;
            }
            const raw = await this.app.vault.cachedRead(file);
            const parsed = JSON.parse(raw || "{}");
            if (!parsed || typeof parsed !== "object" || parsed.version !== BC_QUOTE_INDEX_VERSION) {
                this._quoteIndex = bcEmptyQuoteIndex(quoteFolder, essayPath);
                return this._quoteIndex;
            }
            if (!parsed.sources || typeof parsed.sources !== "object") parsed.sources = {};
            if (!Array.isArray(parsed.seenIds)) parsed.seenIds = [];
            parsed.quoteFolder = quoteFolder;
            parsed.essayPath = essayPath;
            this._quoteIndex = parsed;
            return this._quoteIndex;
        } catch (e) {
            console.warn("[BrainCore] 金句索引读取失败:", e);
            this._quoteIndex = bcEmptyQuoteIndex(quoteFolder, essayPath);
            return this._quoteIndex;
        }
    }

    async saveQuoteIndexToDisk(index) {
        try {
            const folder = "Scripts";
            if (!this.app.vault.getAbstractFileByPath(folder)) {
                try { await this.app.vault.createFolder(folder); } catch (e) { /* ignore */ }
            }
            index.updatedAt = Date.now();
            const payload = JSON.stringify(index, null, 2);
            const file = this.app.vault.getAbstractFileByPath(BC_QUOTE_INDEX_PATH);
            this._suppressDashboardRefresh = true;
            try {
                if (file) {
                    const old = await this.app.vault.cachedRead(file);
                    if (old !== payload) await this.app.vault.modify(file, payload);
                } else {
                    await this.app.vault.create(BC_QUOTE_INDEX_PATH, payload);
                }
            } finally {
                window.setTimeout(() => { this._suppressDashboardRefresh = false; }, 80);
            }
        } catch (e) {
            console.warn("[BrainCore] 金句索引写入失败:", e);
        }
    }

    async parseQuoteSourceFile(file, kind) {
        if (!file || file.extension !== "md") return { mtime: 0, quotes: [] };
        const content = await this.app.vault.cachedRead(file);
        if (String(content || "").length > BC_QUOTE_MAX_FILE_CHARS) {
            return { mtime: file.stat?.mtime || 0, quotes: [] };
        }
        const quotes = kind === "essay"
            ? bcExtractEssayQuotesFromContent(content, file.path)
            : bcExtractWereadQuotesFromContent(content, file.basename, file.path);
        return { mtime: file.stat?.mtime || 0, quotes };
    }

    /**
     * 增量同步金句索引：只解析 mtime 变化 / 新增文件，删除的路径直接出池。
     * budget 限制单次解析文件数，剩余下次 catch-up；每日新增笔记会在后续批次进池。
     */
    async ensureQuoteIndexReady(options = {}) {
        if (this._quoteIndexSyncing) {
            return { pending: true, busy: true };
        }
        this._quoteIndexSyncing = true;
        try {
            const budget = Math.max(1, Number(options.budget) || BC_QUOTE_SYNC_BUDGET);
            const focusPath = String(options.focusPath || "");
            const quoteFolder = this.settings.pathQuotes || "Weread";
            const essayPath = this.settings.pathEssays || "读&写/随笔.md";
            const index = this._quoteIndex?.sources
                ? this._quoteIndex
                : await this.loadQuoteIndexFromDisk();
            index.quoteFolder = quoteFolder;
            index.essayPath = essayPath;
            if (!index.sources) index.sources = {};
            if (!Array.isArray(index.seenIds)) index.seenIds = [];

            const wereadFiles = bcListWereadQuoteFiles(this.app, quoteFolder);
            const livePaths = new Set(wereadFiles.map((f) => f.path));
            const essayFile = this.app.vault.getAbstractFileByPath(essayPath);
            if (essayFile?.extension === "md") livePaths.add(essayFile.path);

            let changed = false;
            for (const path of Object.keys(index.sources)) {
                if (!livePaths.has(path)) {
                    delete index.sources[path];
                    changed = true;
                }
            }

            const dirty = [];
            const pushDirty = (file, kind) => {
                if (!file) return;
                const prev = index.sources[file.path];
                const mtime = file.stat?.mtime || 0;
                if (!prev || prev.mtime !== mtime || focusPath === file.path) {
                    dirty.push({ file, kind });
                }
            };
            for (const f of wereadFiles) pushDirty(f, "weread");
            if (essayFile?.extension === "md") pushDirty(essayFile, "essay");

            dirty.sort((a, b) => {
                if (a.file.path === focusPath) return -1;
                if (b.file.path === focusPath) return 1;
                return (b.file.stat?.mtime || 0) - (a.file.stat?.mtime || 0);
            });

            const batch = dirty.slice(0, budget);
            for (const item of batch) {
                const parsed = await this.parseQuoteSourceFile(item.file, item.kind);
                index.sources[item.file.path] = parsed;
                changed = true;
            }

            if (changed) {
                const valid = new Set(bcFlattenQuoteIndex(index).map((q) => q.id));
                index.seenIds = (index.seenIds || []).filter((id) => valid.has(id));
                this._quoteIndex = index;
                await this.saveQuoteIndexToDisk(index);
                // 用户刚改/删，或有条目被移除时清小时缓存；纯追平新增不打断当前小时展示
                if (focusPath || batch.some((item) => (index.sources[item.file.path]?.quotes || []).length === 0)) {
                    try { sessionStorage.removeItem("sb-quote-cache-f"); } catch (e) { /* ignore */ }
                }
            } else {
                this._quoteIndex = index;
            }

            return { pending: dirty.length > budget, changed, total: bcFlattenQuoteIndex(index).length };
        } finally {
            this._quoteIndexSyncing = false;
        }
    }

    pickHourlyQuote(seed) {
        const index = this._quoteIndex || bcEmptyQuoteIndex(
            this.settings.pathQuotes || "Weread",
            this.settings.pathEssays || "读&写/随笔.md"
        );
        const all = bcFlattenQuoteIndex(index);
        const preferred = bcPreferEssayPool(all, seed);
        const picked = bcPickQuoteAvoidRepeat(preferred, index.seenIds, seed);
        picked.pool = all.length ? all : picked.pool;
        if (picked.quote && all.length) {
            const i = all.findIndex((q) => q.id === picked.quote.id);
            if (i >= 0) picked.index = i;
        }
        index.seenIds = picked.seenIds;
        this._quoteIndex = index;
        void this.saveQuoteIndexToDisk(index);
        return picked;
    }

    rememberShownQuote(id) {
        if (!id) return;
        const index = this._quoteIndex;
        if (!index) return;
        if (!Array.isArray(index.seenIds)) index.seenIds = [];
        if (!index.seenIds.includes(id)) {
            index.seenIds.push(id);
            const valid = new Set(bcFlattenQuoteIndex(index).map((q) => q.id));
            index.seenIds = index.seenIds.filter((x) => valid.has(x));
            this._quoteIndex = index;
            void this.saveQuoteIndexToDisk(index);
        }
    }
    
    onunload() { 
        if (this._weeklyRolloverTimer) {
            window.clearTimeout(this._weeklyRolloverTimer);
            this._weeklyRolloverTimer = null;
        }
        if (this._dailyRolloverTimer) {
            window.clearTimeout(this._dailyRolloverTimer);
            this._dailyRolloverTimer = null;
        }
        if (this._quoteSyncTimer) {
            window.clearTimeout(this._quoteSyncTimer);
            this._quoteSyncTimer = null;
        }
        if (this._stopRightSidebarGuard) this._stopRightSidebarGuard();
        if (typeof releaseLifeOsStyle === "function") {
            releaseLifeOsStyle("bc-styles-min");
            releaseLifeOsStyle("bc-dashboard-content-guard");
            releaseLifeOsStyle("bc-moments-styles-v8");
            releaseLifeOsStyle("bc-moments-styles-v6");
            releaseLifeOsStyle("bc-moments-styles-v3");
            releaseLifeOsStyle("lifeos-ui-shared-styles-v14");
            releaseLifeOsStyle("lifeos-ui-shared-styles-v13");
            releaseLifeOsStyle("lifeos-ui-shared-styles-v12");
            releaseLifeOsStyle("lifeos-ui-shared-styles-v11");
            releaseLifeOsStyle("lifeos-ui-shared-styles-v10");
            releaseLifeOsStyle("lifeos-ui-shared-styles-v9");
            releaseLifeOsStyle("bc-settings-compact-styles-v6");
            releaseLifeOsStyle("bc-update-notice-styles");
        } else {
            document.getElementById("bc-styles-min")?.remove();
            document.getElementById("bc-moments-styles-v8")?.remove();
            document.getElementById("bc-moments-styles-v6")?.remove();
            document.getElementById("bc-moments-styles-v3")?.remove();
            document.getElementById("lifeos-ui-shared-styles-v14")?.remove();
            document.getElementById("lifeos-ui-shared-styles-v13")?.remove();
        }
        releaseBrainCoreGlobals(this);
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

    async activateMomentsView() {
        // BrainCore Moments（Memoria 同源操作，数据在 Moments/YYYY.md）
        try {
            await migrateVaultIntoMomentsFolder(this);
        } catch (e) {
            console.warn("[BrainCore] Moments 迁移失败:", e);
        }
        injectMomentsStyles();
        const rt = ensureMomentsRuntime(this);
        try { await rt.store.reloadAll(); } catch (e) { console.warn("[BrainCore] Moments reload:", e); }

        const { workspace } = this.app;
        // 关掉社区 Memoria / 失效标签
        for (const t of ["memoria-view", "memoria-stats-view", "memoria-year-view"]) {
            workspace.getLeavesOfType(t).forEach((leaf) => {
                try { leaf.detach(); } catch (_) { /* ignore */ }
            });
        }
        const type = (typeof BCMomentsCore !== "undefined" && BCMomentsCore.VIEW_TYPE_MOMENTS) || VIEW_TYPE_MOMENTS;
        let leaf = workspace.getLeavesOfType(type)[0];
        if (!leaf) {
            leaf = workspace.getLeaf("tab");
            await leaf.setViewState({ type, active: true });
        } else {
            await leaf.setViewState({ type, active: true });
        }
        await workspace.revealLeaf(leaf);
        workspace.setActiveLeaf(leaf, { focus: true });
    }

    injectDashboardStyles() {
        // Static dashboard CSS ships via styles.css. Keep a tiny runtime block only for
        // user-renamed weekly section headings + CSS variables.
        const colorTodo = this.settings.colorTodo || DEFAULT_SETTINGS.colorTodo;
        const colorMeeting = this.settings.colorMeeting || DEFAULT_SETTINGS.colorMeeting;
        const colorWeekly = this.settings.colorWeekly || DEFAULT_SETTINGS.colorWeekly;
        const colorDaily = this.settings.colorDaily || DEFAULT_SETTINGS.colorDaily;
        document.documentElement.style.setProperty("--bc-weekly-todo", colorTodo);
        document.documentElement.style.setProperty("--bc-weekly-meeting", colorMeeting);
        document.documentElement.style.setProperty("--bc-weekly-weekly", colorWeekly);
        document.documentElement.style.setProperty("--bc-weekly-daily", colorDaily);

        let styleEl = document.getElementById("bc-weekly-section-styles");
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "bc-weekly-section-styles";
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = buildWeeklyTemplateStyleBlock(
            { colorTodo, colorMeeting, colorWeekly, colorDaily },
            getWeeklySectionNames(this.settings)
        );

        // Remove legacy injected blobs if present
        ["bc-styles-min", "bc-dashboard-content-guard"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
    }
}

module.exports = BrainCorePlugin;
