// ================= 数据存储层 =================
// 负责从 vault 读取 md 文件 -> 解析成 memos
// 追加新 memo、删除、编辑、置顶/收藏

import { App, TFile, normalizePath } from "obsidian";
import { Memo, MemoriaSettings, PIN_TAG, STAR_TAG, ARCHIVE_TAG, DELETED_TAG } from "./types";
import {
  parseFile,
  renderMemo,
  fmtDate,
  fmtTime,
  fmtWeekday,
} from "./parser";
import { t } from "./i18n";

/** 写入源文件 mtime，对齐 memos-view 的 updatedAt */
function stampUpdatedAt(memos: Memo[], mtime: number): Memo[] {
  for (const m of memos) m.updatedAt = mtime;
  return memos;
}

export class MemoStore {
  private memos: Memo[] = [];
  private listeners: Array<() => void> = [];
  private loading = false;
  private reloadAllPending = false;
  /** v1.1.15 初版：每个文件一条 Promise 链（prev.then 套 prev.then...）保证串行。
   *  v1.4.11 改版：改为 running/pending flag，避免长期频繁写入时 Promise 链无限累积
   *    造成内存泄漏 + 每次新 reloadFile 要等前面全部 N 次做完。
   *    新策略：同一文件正在跑就标记 pending=true，当前这次跑完再跑一次（合并掉中间所有），
   *    任何时刻同一文件最多有 2 次待办（正在跑 + 最多 1 次待跑）。 */
  private reloadLocks = new Map<string, { running: boolean; pending: boolean }>();

  constructor(private app: App, private settings: MemoriaSettings) {}

  /** 订阅数据变更 */
  onChange(cb: () => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((x) => x !== cb);
    };
  }

  private emit(): void {
    for (const l of this.listeners) l();
  }

  /** v1.4.11: 仅触发监听器重渲染，不改动 memos 数据。
   *   用于设置项变更后刷 UI（替代原来误调的 reloadAll）。 */
  notifyChange(): void {
    this.emit();
  }

  getAll(): Memo[] {
    return this.memos;
  }

  /** 扫描 folder 下的所有 md 文件，重建 memo 列表
   *  v1.4.11: 改为并行读取（之前 for await 串行，5 个年份文件要等 200-400ms）
   *    并行后大致压到 50-80ms。parseFile 是纯 CPU，不用担心顺序问题。 */
  async reloadAll(): Promise<void> {
    if (this.loading) {
      this.reloadAllPending = true;
      return;
    }
    this.loading = true;
    try {
      do {
        this.reloadAllPending = false;
        const files = this.collectFiles();
        const parsed = await Promise.all(
          files.map(async (f) => {
            const raw = await this.app.vault.read(f);
            return stampUpdatedAt(parseFile(f.path, raw), f.stat.mtime);
          })
        );
        const result: Memo[] = [];
        for (const arr of parsed) result.push(...arr);
        this.sortMemos(result);
        this.memos = result;
        this.emit();
      } while (this.reloadAllPending);
    } finally {
      this.loading = false;
    }
  }

  /** 文件内容变化时重载单个文件
   *  v1.4.11: running/pending flag 策略（见类顶部注释），取代原来的 Promise 链。
   *    同一文件任意时刻最多执行 2 次：正在跑 + 最多 1 次 pending。
   *    好处：
   *      1. 不会无限累积 Promise 引用（内存泄漏）
   *      2. addMemo 主动 reload + vault.modify 事件 reload 两次会被合并为 1 次
   *      3. 用户连发多条时尾部 reload 不需要排队等前面所有做完 */
  async reloadFile(file: TFile): Promise<void> {
    if (!this.isInFolder(file)) return;
    const key = file.path;
    const existing = this.reloadLocks.get(key);
    if (existing && existing.running) {
      // 已有任务在跑，标记待跑一次即可（多次调用合并为 1 次）
      existing.pending = true;
      return;
    }
    const state = { running: true, pending: false };
    this.reloadLocks.set(key, state);
    try {
      // 只要有人在我跑的过程中标 pending，就再跑一次
      do {
        state.pending = false;
        // 文件可能在排队期间被删了，重读前再取一次
        const current = this.app.vault.getAbstractFileByPath(key);
        if (!(current instanceof TFile)) break;
        const raw = await this.app.vault.read(current);
        const fresh = stampUpdatedAt(parseFile(current.path, raw), current.stat.mtime);
        this.memos = this.memos.filter((m) => m.file !== current.path);
        this.memos.push(...fresh);
        this.sortMemos(this.memos);
        this.emit();
      } while (state.pending);
    } finally {
      this.reloadLocks.delete(key);
    }
  }

  /** 指定文件从 memo 列表中移除 */
  removeFile(path: string): void {
    const before = this.memos.length;
    this.memos = this.memos.filter((m) => m.file !== path);
    if (this.memos.length !== before) this.emit();
  }

  /**
   * 排序：
   *   1) 置顶的永远在最前
   *   2) 其他按 datetime 降序
   *   3) 同分钟按文件行号倒序（更晚追加的在前）
   */
  private sortMemos(arr: Memo[]): void {
    arr.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      const dt = b.datetime.getTime() - a.datetime.getTime();
      if (dt !== 0) return dt;
      if (a.file !== b.file) return a.file < b.file ? 1 : -1;
      return b.range[0] - a.range[0];
    });
  }

  private collectFiles(): TFile[] {
    const folder = normalizePath(this.settings.folder);
    return this.app.vault.getMarkdownFiles().filter((f) => {
      // v1.1.9: 忽略以 `_` 开头的 md（约定为"非笔记"特殊文件，如 _trash.md）
      if (f.name.startsWith("_")) return false;
      return f.path.startsWith(`${folder}/`);
    });
  }

  isInFolder(file: TFile): boolean {
    const folder = normalizePath(this.settings.folder);
    // v1.1.9: _trash.md 等"_"前缀文件不算入正常笔记扫描范围
    if (file.name.startsWith("_")) return false;
    return file.path.startsWith(`${folder}/`);
  }

  /**
   * 始终基于磁盘最新内容重新定位记录，避免外部编辑让旧 range 指向相邻记录。
   * 同一分钟、同内容的重复记录按原起始行距离择近，保证操作稳定可预测。
   */
  private locateMemoRange(raw: string, memo: Memo): [number, number] {
    const candidates = parseFile(memo.file, raw).filter(
      (item) =>
        item.date === memo.date &&
        item.time === memo.time &&
        item.content === memo.content
    );
    if (candidates.length === 0) {
      throw new Error(t("error.fileChanged"));
    }
    const originalStart = memo.range[0];
    candidates.sort((a, b) => {
      const distance = Math.abs(a.range[0] - originalStart) - Math.abs(b.range[0] - originalStart);
      return distance || a.range[0] - b.range[0];
    });
    return candidates[0].range;
  }

  /** 创建一条新 memo */
  async addMemo(content: string, when: Date = new Date()): Promise<void> {
    content = content.trim();
    if (!content) return;

    const year = when.getFullYear().toString();
    const dateStr = fmtDate(when);
    const timeStr = fmtTime(when);
    const weekday = fmtWeekday(when);

    const folder = normalizePath(this.settings.folder);
    await this.ensureFolder(folder);
    const filePath = `${folder}/${year}.md`;

    const file = this.app.vault.getAbstractFileByPath(filePath) as TFile | null;
    if (!file) {
      const initial = `${this.periodHeadings(new Date(when), [])}\n\n### ${dateStr} ${weekday}\n\n${renderMemo(
        timeStr,
        content
      )}\n\n`;
      await this.app.vault.create(filePath, initial);
    } else {
      const raw = await this.app.vault.read(file);
      const next = this.insertMemoIntoYear(
        raw,
        year,
        dateStr,
        weekday,
        timeStr,
        content
      );
      await this.app.vault.modify(file, next);
    }
    const f = this.app.vault.getAbstractFileByPath(filePath);
    if (f instanceof TFile) await this.reloadFile(f);
  }

  /** 编辑一条 memo
   *  v1.1.15: 写入前用最新文件内容重新 parse，按 (date, time) + 原 range 附近定位
   *    真实行号；如果 memo 已不存在（被外部删了）或位置完全对不上，抛错让上层提示用户刷新，
   *    避免用过期 range 盲写损坏相邻 memo。 */
  async editMemo(memo: Memo, newContent: string): Promise<void> {
    newContent = newContent.trim();
    if (!newContent) return;
    const file = this.app.vault.getAbstractFileByPath(memo.file) as TFile | null;
    if (!file) return;
    const raw = await this.app.vault.read(file);
    const lines = raw.split(/\r?\n/);
    const [s, e] = this.locateMemoRange(raw, memo);

    const rendered = renderMemo(memo.time, newContent).split("\n");
    lines.splice(s, e - s + 1, ...rendered);
    await this.app.vault.modify(file, lines.join("\n"));
    await this.reloadFile(file);
  }

  /** v1.6.0: 修改一条已存在 memo 的时间（年/月/日/时/分），可同时修改正文。
   *   实现策略：在源位置删除原 memo 块 + 在新时间位置插入新内容。
   *
   *   边界处理：
   *     1. 同年改日期或时间 → 同一文件内"块搬家"：先 splice 删旧位置，
   *        再调 insertMemoIntoYear 重新插入到目标日期块下。
   *     2. 跨年改 → 旧文件删块 + 目标年份文件 addMemo（必要时新建文件）。
   *     3. 旧位置删除后如果该日期下没别的 memo 了，会触发孤儿日期标题清理。
   *     4. 旧年份文件如果删空了**保留**（只剩 # YYYY 头），不主动删文件。
   *     5. 不写入回收站（这是搬移不是删除，避免污染 _trash.md）。
   *     6. 不做时间冲突检查 —— 同时间多条 memo 是合法状态（用户连发速记时常见）。
   *
   *   定位策略与 editMemo 一致：先按原 range 起点，原 range 失效就 fallback 到
   *   按 (date, time, content) 候选挑 range[0] 最近的那条。 */
  async editMemoDateTime(
    memo: Memo,
    newDateTime: Date,
    newContent?: string
  ): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(memo.file) as TFile | null;
    if (!file) {
      throw new Error(t("error.originNotFound"));
    }

    // 内容：默认用原内容，调用方可传新内容（例如编辑模式下用户同时改了时间和正文）
    const content = (newContent ?? memo.content).trim();
    if (!content) {
      throw new Error(t("error.emptyContent"));
    }

    // ---- 计算目标参数 ----
    const newYear = newDateTime.getFullYear().toString();
    const newDate = fmtDate(newDateTime);
    const newTime = fmtTime(newDateTime);
    const newWeekday = fmtWeekday(newDateTime);

    // 如果年/日/时/分都没变，且内容也没变 → 什么都不做
    if (
      newDate === memo.date &&
      newTime === memo.time &&
      content === memo.content
    ) {
      return;
    }

    // 如果只是时间和内容变了但年/日没变（同一文件、同一日期块） → 走 editMemo + 时间替换的捷径太复杂，
    // 这里统一走"删除 + 重插"，对所有情况一视同仁，逻辑更可预测。

    // ---- Step 1: 在内存中精确定位并生成移除旧块后的源码 ----
    const oldRaw = await this.app.vault.read(file);
    const [s, e] = this.locateMemoRange(oldRaw, memo);
    const sourceWithoutMemo = this.removeMemoFromRaw(oldRaw, [s, e]);

    // ---- Step 2: 把新内容插入到目标位置 ----
    const folder = normalizePath(this.settings.folder);
    await this.ensureFolder(folder);
    const newFilePath = `${folder}/${newYear}.md`;

    // 如果是同一年（最常见情况），在内存里完成删除与重插，只写磁盘一次。
    const sameFile = newFilePath === file.path;

    if (sameFile) {
      const next = this.insertMemoIntoYear(
        sourceWithoutMemo,
        newYear,
        newDate,
        newWeekday,
        newTime,
        content
      );
      await this.app.vault.modify(file, next);
      await this.reloadFile(file);
    } else {
      // 跨年先写目标、后删原文。若第二步失败，最坏只会出现一条可人工处理的
      // 重复记录，而不会因为目标写入失败丢失原文。
      const target = this.app.vault.getAbstractFileByPath(newFilePath) as
        | TFile
        | null;
      if (!target) {
        const periods = this.periodHeadings(newDateTime, []);
        const initial =
          `${periods}\n\n### ${newDate} ${newWeekday}\n\n` +
          `${renderMemo(newTime, content)}\n\n`;
        await this.app.vault.create(newFilePath, initial);
      } else {
        const targetRaw = await this.app.vault.read(target);
        const next = this.insertMemoIntoYear(
          targetRaw,
          newYear,
          newDate,
          newWeekday,
          newTime,
          content
        );
        await this.app.vault.modify(target, next);
      }
      try {
        await this.app.vault.modify(file, sourceWithoutMemo);
      } catch (error) {
        throw new Error(
          "目标年份已写入，但原年份未能移除旧记录；为避免丢失已保留两份，请刷新后手动确认。",
          { cause: error }
        );
      }
      // 两个文件都要 reload（旧文件减少一条，新文件增加一条）
      await this.reloadFile(file);
      const newFile = this.app.vault.getAbstractFileByPath(newFilePath) as
        | TFile
        | null;
      if (newFile) await this.reloadFile(newFile);
    }
  }


  /** 删除 memo（同时清理"孤儿"日期标题：某日下已无 memo 则把日期行也删掉）。
   *  不再写入 _trash.md；界面上的 5 秒撤销不依赖回收站文件。
   */
  async deleteMemo(memo: Memo): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(memo.file) as TFile | null;
    if (!file) return;

    const raw = await this.app.vault.read(file);
    const [s, e] = this.locateMemoRange(raw, memo);

    // 删除即从年文件移除，不再写 _trash.md。界面上另有 5 秒撤销。
    const imageFiles = this.collectOwnedImageFiles(memo);
    const updatedRaw = this.removeMemoFromRaw(raw, [s, e]);
    await this.app.vault.modify(file, updatedRaw);
    await this.reloadFile(file);

    // Boxes 图片可能被库内其他笔记复用；只有全库都不再引用时才删除。
    for (const image of imageFiles) {
      const stillUsed = await this.isAttachmentReferencedInVault(image, file.path, updatedRaw);
      if (!stillUsed) await this.app.vault.delete(image);
    }
  }

  private collectOwnedImageFiles(memo: Memo): TFile[] {
    const folder = normalizePath(this.settings.attachmentFolder).replace(/\/$/, "");
    if (!folder) return [];
    const links: string[] = [];
    memo.content.replace(/!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g, (_m, link: string) => { links.push(link.trim()); return _m; });
    memo.content.replace(/!\[[^\]]*\]\(([^)]+)\)/g, (_m, link: string) => { links.push(link.trim()); return _m; });
    const files = links.map((link) => this.app.metadataCache.getFirstLinkpathDest(link, memo.file)).filter((item): item is TFile => item instanceof TFile);
    return Array.from(new Map(files.filter((item) => item.path.startsWith(`${folder}/`)).map((item) => [item.path, item])).values());
  }

  /** 从最新源码移除一条记录，并统一清理分隔线、孤立日期标题和多余空行。 */
  private removeMemoFromRaw(raw: string, range: [number, number]): string {
    const lines = raw.split(/\r?\n/);
    const [start, end] = range;
    lines.splice(start, end - start + 1);

    let separatorAt = start;
    while (separatorAt < lines.length && lines[separatorAt].trim() === "") {
      lines.splice(separatorAt, 1);
    }
    if (lines[separatorAt]?.trim() === "---") {
      lines.splice(separatorAt, 1);
      while (separatorAt < lines.length && lines[separatorAt].trim() === "") {
        lines.splice(separatorAt, 1);
      }
    }

    this.removeOrphanDateHeaders(lines);
    const cleaned: string[] = [];
    let blank = 0;
    for (const line of lines) {
      if (line.trim() === "") {
        blank += 1;
        if (blank <= 2) cleaned.push(line);
      } else {
        blank = 0;
        cleaned.push(line);
      }
    }
    return cleaned.join("\n");
  }

  /** 删除 Boxes 图片前做全库保守检查；误判为仍在使用只会留下文件，不会丢数据。 */
  private async isAttachmentReferencedInVault(
    image: TFile,
    changedFilePath: string,
    changedFileRaw: string
  ): Promise<boolean> {
    const hasReference = (raw: string) => raw.includes(image.path) || raw.includes(image.name);
    if (hasReference(changedFileRaw)) return true;

    const cacheLooksLikeHit = (note: TFile): boolean | null => {
      const fileCache = this.app.metadataCache.getFileCache(note);
      if (!fileCache) return null;
      for (const embed of fileCache.embeds || []) {
        const dest = this.app.metadataCache.getFirstLinkpathDest(embed.link, note.path);
        if (dest?.path === image.path) return true;
      }
      for (const link of fileCache.links || []) {
        const dest = this.app.metadataCache.getFirstLinkpathDest(link.link, note.path);
        if (dest?.path === image.path) return true;
      }
      return false;
    };

    for (const note of this.app.vault.getMarkdownFiles()) {
      if (note.path === changedFilePath) continue;
      try {
        const cached = cacheLooksLikeHit(note);
        if (cached === true) return true;
        if (hasReference(await this.app.vault.cachedRead(note))) return true;
      } catch (err) {
        console.warn(`[Moments] 检查附件引用失败，保留 ${image.path}:`, err);
        return true;
      }
    }

    const extraExts = new Set(["canvas", "base", "json", "html", "excalidraw"]);
    for (const file of this.app.vault.getFiles()) {
      if (file.extension === "md") continue;
      if (!extraExts.has(String(file.extension || "").toLowerCase())) continue;
      try {
        if (hasReference(await this.app.vault.cachedRead(file))) return true;
      } catch (err) {
        console.warn(`[Moments] 检查非 Markdown 引用失败，保留 ${image.path}:`, err);
        return true;
      }
    }
    return false;
  }

  /**
   * v1.1.9: 把一条 memo 追加到 `<folder>/_trash.md`。
   *
   * 格式：每条带来源注释 + 原时间 + 原内容，方便将来人肉恢复：
   *   ## 已删除 2026-05-04 01:30
   *   - 来源：读&写/Moments/2026.md · 原时间 2026-04-25 12:43
   *     <原 memo 内容>
   *
   * 注意：_trash.md 没有 `# YYYY` 头、也不按日期分组，避免被 parseFile 误识别成正常 memo；
   *       也不放在 Moments 文件夹之外，因为用户停用插件后依然能在同一文件夹里看到它。
   */
  private async appendToTrash(memo: Memo): Promise<void> {
    const folder = normalizePath(this.settings.folder);
    await this.ensureFolder(folder);
    const trashPath = `${folder}/_trash.md`;

    const now = new Date();
    const delStamp = `${fmtDate(now)} ${fmtTime(now)}`;
    // 内容前缀加 2 空格缩进，与 memo 渲染风格一致
    const indented = memo.content
      .split("\n")
      .map((l) => (l === "" ? "" : `  ${l}`))
      .join("\n");

    const block =
      `\n## 已删除 ${delStamp}\n\n` +
      `- 来源：\`${memo.file}\` · 原时间 ${memo.date} ${memo.time}\n` +
      `${indented}\n`;

    const existing = this.app.vault.getAbstractFileByPath(trashPath) as
      | TFile
      | null;
    if (!existing) {
      const header =
        `# Moments 回收站\n\n` +
        `> 这里保存被删除的笔记。停用插件后依然可读，可手动恢复或清空。\n` +
        `> 该文件不会被 Moments 主视图识别为普通笔记。\n`;
      await this.app.vault.create(trashPath, header + block);
    } else {
      const old = await this.app.vault.read(existing);
      // v1.4.3: 先拼接新块，再按上限裁剪最旧的条目（FIFO 滚动）。
      //   这样 _trash.md 不会随时间无限膨胀；上限由 settings.trashMaxItems 控制，
      //   0 表示不限制。
      const merged = old + block;
      const trimmed = this.trimTrashToLimit(
        merged,
        this.settings.trashMaxItems
      );
      await this.app.vault.modify(existing, trimmed);
    }
  }

  /**
   * v1.4.3: 把 _trash.md 内容裁剪到最多 limit 条（保留最新的），
   *         返回裁剪后的完整文本。limit <= 0 表示不裁剪。
   *
   *   逻辑：以 `## 已删除 ...` 行作为每条记录的分界，切成 N 条；
   *         如果 N > limit，则丢掉最前面 N-limit 条，保留最新的 limit 条。
   *         文件头的说明块（`# Moments 回收站` 及其 > 引用）永远保留。
   */
  private trimTrashToLimit(raw: string, limit: number): string {
    if (!limit || limit <= 0) return raw;

    const lines = raw.split(/\r?\n/);
    const delHeaderRe = /^##\s+已删除\s+/;

    // 找到所有 "## 已删除 ..." 行的行号
    const headerIdxs: number[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (delHeaderRe.test(lines[i])) headerIdxs.push(i);
    }
    if (headerIdxs.length <= limit) return raw;

    // 保留最新的 limit 条 => 从第 (N - limit) 条开始保留
    const keepFromIdx = headerIdxs[headerIdxs.length - limit];
    // 文件头：保留从开头到第一条 "## 已删除" 之前的所有内容
    const headEndIdx = headerIdxs[0];
    const headPart = lines.slice(0, headEndIdx);
    const keptPart = lines.slice(keepFromIdx);
    // 拼回时在文件头和首条保留记录间保证恰好一个空行
    while (headPart.length && headPart[headPart.length - 1].trim() === "") {
      headPart.pop();
    }
    return headPart.join("\n") + "\n\n" + keptPart.join("\n");
  }

  /**
   * 原地移除所有"空日期标题"：
   *   ## 2025-06-28 周六     <- 下方没有任何 - HH:MM 行的标题将被删除
   */
  private removeOrphanDateHeaders(lines: string[]): void {
    const dateRe = /^#{2,3}\s+\d{4}-\d{2}-\d{2}(?:\s+.+)?$/;
    const memoRe = /^- \d{2}:\d{2}/;
    const nextBlockRe = /^#{1,2}\s+/;

    // 从后往前扫，遇到日期标题就检查它到下一个 header 之间有没有 memo
    const toDelete: number[] = [];
    for (let i = 0; i < lines.length; i++) {
      if (!dateRe.test(lines[i])) continue;
      let hasMemo = false;
      for (let j = i + 1; j < lines.length; j++) {
        if (nextBlockRe.test(lines[j])) break;
        if (memoRe.test(lines[j])) {
          hasMemo = true;
          break;
        }
      }
      if (!hasMemo) toDelete.push(i);
    }
    // 从后往前删，避免 index 错位
    for (let k = toDelete.length - 1; k >= 0; k--) {
      lines.splice(toDelete[k], 1);
    }
  }

  /** 切换置顶（追加/移除 #置顶 标签） */
  async togglePinned(memo: Memo): Promise<void> {
    await this.toggleReservedTag(memo, PIN_TAG);
  }

  /** 切换收藏（追加/移除 #收藏 标签） */
  async toggleStarred(memo: Memo): Promise<void> {
    await this.toggleReservedTag(memo, STAR_TAG);
  }

  /** 对齐 Memos View：切换归档 */
  async toggleArchived(memo: Memo): Promise<void> {
    await this.toggleReservedTag(memo, ARCHIVE_TAG);
  }

  /**
   * Moments 删除直接从 YYYY.md 移除。界面上的 5 秒撤销不依赖 _trash.md。
   */
  async softDeleteMemo(memo: Memo): Promise<void> {
    if (memo.isDeleted) return;
    await this.deleteMemo(memo);
  }

  /** 从回收站恢复 */
  async restoreDeletedMemo(memo: Memo): Promise<void> {
    if (!memo.isDeleted) return;
    await this.toggleReservedTag(memo, DELETED_TAG);
  }

  private async toggleReservedTag(memo: Memo, tag: string): Promise<void> {
    const has = memo.tags.includes(tag);
    let newContent: string;
    if (has) {
      // 移除所有出现的 #tag（含前缀空白）
      const re = new RegExp(
        `\\s*#${escapeRegex(tag)}(?![A-Za-z0-9_\\u4e00-\\u9fff/])`,
        "g"
      );
      newContent = memo.content.replace(re, "");
      newContent = newContent
        .split("\n")
        .map((l) => l.replace(/[ \t]+$/, ""))
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      // Bug fix (v1.1.2): 若去完后整条笔记什么都不剩，
      //   之前用 " "（单空格）占位会被 renderMemo 写成一条"内容为空格"的诡异笔记，
      //   严重时还会让这条 memo 在 UI 上彻底消失（stripTags 后文本为空 + 无图 + 无标签）。
      //   现在的策略：直接"退化为"一条只有原标签的占位内容，保证笔记可见、可再编辑；
      //   真正想彻底删除 memo 应该走"删除"菜单，而不是通过取消置顶/收藏隐式删除。
      if (newContent === "") {
        newContent = `（已取消${tag}）`;
      }
    } else {
      // 追加到**首行末尾**，确保 renderMemo 后 #tag 在 "- HH:MM XXX #tag" 行上
      // 这样后续 parser 解析时一定能通过 extractTags 识别出来
      const lines = memo.content.split("\n");
      if (lines.length === 0 || lines[0].trim() === "") {
        lines[0] = `#${tag}`;
      } else {
        lines[0] = `${lines[0].replace(/\s+$/, "")} #${tag}`;
      }
      newContent = lines.join("\n");
      // 注意：这里 **不** 调用 trim()，因为那会把内容末尾的图片块换行吃掉，
      // 不影响内容但可能影响 parser 的行号范围一致性
    }
    await this.editMemo(memo, newContent);
  }

  /**
   * 保存二进制图片到附件目录
   * 文件名：moments-YYYYMMDD-HHmmss-随机.<ext>
   */
  async saveImageAttachment(
    bytes: ArrayBuffer,
    extension: string
  ): Promise<string> {
    const folder = normalizePath(this.settings.attachmentFolder);
    await this.ensureFolder(folder);
    const now = new Date();
    const stamp =
      now.getFullYear().toString() +
      pad(now.getMonth() + 1) +
      pad(now.getDate()) +
      "-" +
      pad(now.getHours()) +
      pad(now.getMinutes()) +
      pad(now.getSeconds());
    const rand = Math.random().toString(36).slice(2, 6);
    const ext = (extension || "png").replace(/^\./, "").toLowerCase();
    const path = `${folder}/moments-${stamp}-${rand}.${ext}`;
    await this.app.vault.createBinary(path, bytes);
    return path;
  }

  private async ensureFolder(folder: string): Promise<void> {
    const folderPath = normalizePath(String(folder || "")).replace(/\/+$/, "");
    if (!folderPath) return;
    let current = "";
    for (const part of folderPath.split("/").filter(Boolean)) {
      current = current ? `${current}/${part}` : part;
      if (this.app.vault.getAbstractFileByPath(current)) continue;
      try {
        await this.app.vault.createFolder(current);
      } catch (e: unknown) {
        const msg = String((e as { message?: string })?.message || e || "");
        // iCloud / 并发：父目录可能刚被别处建好
        if (/already exists/i.test(msg)) continue;
        throw e;
      }
    }
  }

  /**
   * 智能插入一条 memo 到 raw 文本：
   *  - 没有 "# {year}" 标题则头部加上
   *  - 已有对应日期分组，插入到该组末尾
   *  - 没有日期分组，按日期升序新建分组
   */
  private insertMemoIntoYear(
    raw: string,
    year: string,
    date: string,
    weekday: string,
    time: string,
    content: string
  ): string {
    const lines = raw.split(/\r?\n/);
    const dateHeader = `### ${date} ${weekday}`;
    const memoBlock = renderMemo(time, content);

    // 年份由文件名承载（2025.md），不再额外写 # 2025，避免 Obsidian 标题栏重复显示。
    const yearLine = -1;

    const dateRe = new RegExp(`^#{2,3}\\s+${date}(?:\\s+.+)?$`);
    const dateLine = lines.findIndex((l) => dateRe.test(l));

    if (dateLine >= 0) {
      let end = lines.length;
      for (let i = dateLine + 1; i < lines.length; i++) {
        if (/^#{1,3}\s+/.test(lines[i])) {
          end = i;
          break;
        }
      }
      // v1.6.1: 同日期块内按时间升序找正确插入位置，而不是一律追加到末尾。
      //   旧行为对 addMemo 没问题（新笔记时间总是当天最晚），
      //   但 editMemoDateTime 可以把时间改到任意过去时刻，如果还追加到末尾，
      //   文件里的时间顺序会错乱（23:05 出现在 16:56 前面），Memoria 规范被破坏。
      //   策略：扫 dateLine+1..end 范围内的 `- HH:MM` 行，找第一个比新时间晚的行，
      //   插到它之前；都 ≤ 新时间就追加到末尾（和原行为一致）。
      const timeRe = /^-\s+(\d{2}:\d{2})(?:\s|$)/;
      let insertBeforeIdx = -1;
      for (let i = dateLine + 1; i < end; i++) {
        const tm = lines[i].match(timeRe);
        if (tm && tm[1] > time) {
          insertBeforeIdx = i;
          break;
        }
      }
      if (insertBeforeIdx >= 0) {
        // 向上退回所有前导空行（避免在空行之前插入，造成连续 3 个空行）
        let at = insertBeforeIdx;
        while (at > dateLine + 1 && lines[at - 1].trim() === "") {
          at--;
        }
        lines.splice(at, 0, memoBlock, "");
        return lines.join("\n");
      }
      // 所有已有 memo 时间都 ≤ 新时间：追加到日期块末尾（保持原行为）
      const insertAt = this.trimTrailingBlank(lines, dateLine + 1, end);
      lines.splice(insertAt, 0, "", memoBlock);
      return lines.join("\n");
    }

    // 新日期分组：在同一年内按日期升序插入
    // 规则：找到第一个 `## yyyy-MM-dd` 日期 > 当前日期的行，插在它之前；
    //       都比当前日期小则追加到文件末尾。
    // v1.1.14: 保险 —— 如果文件里意外有下一个 `# YYYY`（极端场景，如用户手动合并了
    //   两年内容到同一文件），扫描到下一个年份大标题时立刻停止，避免"穿透"到邻年。
    const allDateRe = /^#{2,3}\s+(\d{4}-\d{2}-\d{2})/;
    const nextYearRe = /^#\s+\d{4}\s*$/;
    let insertIdx = -1;
    let scanEnd = lines.length;
    for (let i = yearLine + 1; i < lines.length; i++) {
      if (nextYearRe.test(lines[i])) {
        scanEnd = i;
        break;
      }
    }
    for (let i = yearLine + 1; i < scanEnd; i++) {
      const m = lines[i].match(allDateRe);
      if (m && m[1] > date) {
        insertIdx = i;
        break;
      }
    }

    if (insertIdx === -1) {
      // v1.1.14: 如果后面还有下一个 `# YYYY` 段，就把新日期插到当前年段末尾
      //   （scanEnd 前），而不是整个文件末尾；否则新笔记会跑到下一年后面去。
      if (scanEnd < lines.length) {
        // 回退到 scanEnd 之前的最后一行非空内容后一行
        let endOfYear = scanEnd;
        while (endOfYear > yearLine + 1 && lines[endOfYear - 1].trim() === "") {
          endOfYear--;
        }
        const period = this.periodHeadings(new Date(`${date}T12:00:00`), lines);
        const block = [...(period ? [period, ""] : []), dateHeader, "", memoBlock, ""];
        lines.splice(endOfYear, 0, "", ...block);
        return lines.join("\n");
      }
      // 追加到文件末尾：保证前面有一个空行分隔，本块内容 dateHeader + 空行 + memoBlock
      // Bug fix (v1.1.2): 之前 block.filter((_, i) => i > 0) 会跳过前导空行但保留结尾空行，
      //   导致第一次在某年写笔记时，拼接出 "上一段内容##日期" 这样没空行的结构，
      //   解析器依赖 `## ` 行首识别日期头，会因此导致这条笔记无法被解析/定位错位。
      // 现在改为：显式确保尾部恰好 1 个空行，然后追加 [dateHeader, "", memoBlock, ""]
      while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
      const period = this.periodHeadings(new Date(`${date}T12:00:00`), lines);
      lines.push("", ...(period ? [period, ""] : []), dateHeader, "", memoBlock, "");
      return lines.join("\n");
    }

    // 在 insertIdx 前插入：前空行 + 日期头 + 空行 + memo + 空行
    const period = this.periodHeadings(new Date(`${date}T12:00:00`), lines);
    const block = ["", ...(period ? [period, ""] : []), dateHeader, "", memoBlock, ""];
    lines.splice(insertIdx, 0, ...block);
    return lines.join("\n");
  }

  private periodHeadings(when: Date, lines: string[]): string {
    const month = String(when.getMonth() + 1).padStart(2, "0");
    const probe = new Date(when); probe.setHours(12, 0, 0, 0);
    probe.setDate(probe.getDate() + 3 - ((probe.getDay() + 6) % 7));
    const first = new Date(probe.getFullYear(), 0, 4, 12);
    first.setDate(first.getDate() + 3 - ((first.getDay() + 6) % 7));
    const week = 1 + Math.round((probe.getTime() - first.getTime()) / 604800000);
    const monthHeading = `# ${month}月`;
    const weekHeading = `## 第${week}周`;
    return [lines.includes(monthHeading) ? "" : monthHeading, lines.includes(weekHeading) ? "" : weekHeading].filter(Boolean).join("\n\n");
  }

  private trimTrailingBlank(
    lines: string[],
    from: number,
    to: number
  ): number {
    let last = from;
    for (let i = from; i < to; i++) {
      if (lines[i].trim() !== "") last = i + 1;
    }
    return last;
  }
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}
