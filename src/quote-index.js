/**
 * BrainCore 金句增量索引（纯函数，由 build 注入）
 * 索引落盘：Scripts/braincore-quote-index.json
 */
const BC_QUOTE_INDEX_PATH = "Scripts/braincore-quote-index.json";
const BC_QUOTE_INDEX_VERSION = 1;
const BC_QUOTE_MAX_FILE_CHARS = 200000;
const BC_QUOTE_SYNC_BUDGET = 16;

function bcQuoteCleanText(text) {
  return String(text || "")
    .replace(/^[>\s]+(?:\[![a-zA-Z]+\])?\s*/g, "")
    .replace(/^(?:📌|💡|🔖|📝|📖|🚩)?\s*(?:笔记|随记|章节总结)?\s*/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`~#]/g, "")
    .trim();
}

function bcQuoteShouldKeep(text) {
  if (!text || text.length <= 10 || text.length > 220) return false;
  if (text.match(/^\d{4}[-\/]\d{2}[-\/]\d{2}/)) return false;
  if (text.match(/^\d{1,2}:\d{2}$/)) return false;
  if (text.startsWith("💭") || text.startsWith("[!")) return false;
  if (/书籍简介/.test(text)) return false;
  return true;
}

function bcQuoteId(sourcePath, text) {
  const raw = `${sourcePath}\n${text}`;
  let hash = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    hash ^= raw.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

function bcEmptyQuoteIndex(quoteFolder, essayPath) {
  return {
    version: BC_QUOTE_INDEX_VERSION,
    quoteFolder: String(quoteFolder || "Weread"),
    essayPath: String(essayPath || "读&写/随笔.md"),
    sources: {},
    seenIds: [],
    updatedAt: 0,
  };
}

function bcListWereadQuoteFiles(app, quoteFolder) {
  const folder = String(quoteFolder || "Weread").replace(/\/+$/, "").toLowerCase();
  const prefix = folder ? `${folder}/` : "";
  return (app.vault.getMarkdownFiles() || [])
    .filter((f) => {
      const p = String(f.path || "").toLowerCase();
      if (f.basename === "Weread-Book") return false;
      if (!folder) return false;
      return p === folder || p === `${folder}.md` || (prefix && p.startsWith(prefix));
    })
    .sort((a, b) => (b.stat?.mtime || 0) - (a.stat?.mtime || 0));
}

function bcIsQuoteSourcePath(settings, filePath) {
  const p = String(filePath || "");
  if (!p || !p.toLowerCase().endsWith(".md")) return false;
  const essay = String(settings?.pathEssays || "读&写/随笔.md");
  if (p === essay) return true;
  const folder = String(settings?.pathQuotes || "Weread").replace(/\/$/, "");
  if (!folder) return false;
  const pl = p.toLowerCase();
  const fl = folder.toLowerCase();
  return pl === fl || pl === `${fl}.md` || pl.startsWith(`${fl}/`);
}

function bcExtractEssayQuotesFromContent(content, sourcePath) {
  const quotes = [];
  if (String(content || "").length > BC_QUOTE_MAX_FILE_CHARS) return quotes;
  const lines = String(content || "").split("\n");
  let currentBlock = [];
  const flush = () => {
    const qText = bcQuoteCleanText(currentBlock.join(" ")).replace(/\s+/g, " ").trim();
    if (bcQuoteShouldKeep(qText)) {
      quotes.push({
        id: bcQuoteId(sourcePath, qText),
        t: qText,
        s: "随笔",
        path: sourcePath,
        kind: "essay",
      });
    }
    currentBlock = [];
  };
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^>\s*\[!/.test(trimmed)) {
      flush();
      continue;
    }
    if (trimmed.startsWith(">")) {
      const qText = bcQuoteCleanText(trimmed);
      if (qText && !qText.match(/^\d{1,2}:\d{2}$/) && !qText.startsWith("[!") && !qText.startsWith("💭")) {
        currentBlock.push(qText);
      }
      continue;
    }
    flush();
  }
  flush();
  return quotes;
}

function bcExtractWereadQuotesFromContent(content, basename, sourcePath) {
  const raw = extractQuotesFromWereadContent(content, basename, bcQuoteCleanText, bcQuoteShouldKeep);
  return raw.map((q) => ({
    id: bcQuoteId(sourcePath, q.t),
    t: q.t,
    s: q.s,
    path: sourcePath,
    kind: "weread",
  }));
}

function bcFlattenQuoteIndex(index) {
  const out = [];
  const sources = index?.sources || {};
  for (const path of Object.keys(sources)) {
    const entry = sources[path];
    if (!entry || !Array.isArray(entry.quotes)) continue;
    for (const q of entry.quotes) {
      if (q?.id && q?.t && q?.s) out.push(q);
    }
  }
  return out;
}

/** 尽量不重复：先从未看过的里按 seed 取；耗尽后清空 seen 再来一轮 */
function bcPickQuoteAvoidRepeat(allQuotes, seenIds, seed) {
  if (!allQuotes.length) return { quote: null, index: 0, pool: [], seenIds: [] };
  const seen = new Set(Array.isArray(seenIds) ? seenIds : []);
  const validIds = new Set(allQuotes.map((q) => q.id));
  for (const id of [...seen]) {
    if (!validIds.has(id)) seen.delete(id);
  }
  let candidates = allQuotes.filter((q) => !seen.has(q.id));
  if (!candidates.length) {
    seen.clear();
    candidates = allQuotes.slice();
  }
  const n = candidates.length;
  const idxInCand = Math.abs(Number(seed) || 0) % n;
  const quote = candidates[idxInCand];
  const pool = allQuotes.slice();
  const index = Math.max(0, pool.findIndex((q) => q.id === quote.id));
  seen.add(quote.id);
  // 防止 seen 无限膨胀：只保留仍存在的 id
  const nextSeen = [...seen].filter((id) => validIds.has(id));
  return { quote, index, pool, seenIds: nextSeen };
}

function bcPreferEssayPool(allQuotes, seed) {
  if (!allQuotes.length) return allQuotes;
  if (Number(seed) % 4 !== 0) return allQuotes;
  const essays = allQuotes.filter((q) => q.kind === "essay" || q.s === "随笔");
  return essays.length ? essays : allQuotes;
}
