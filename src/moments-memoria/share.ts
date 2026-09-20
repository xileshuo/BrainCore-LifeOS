/**
 * Moments 分享弹窗 — 移植自 memos-view，水印改为徕卡式底栏（头像 + 名称 + 文案）
 */
import {
  App,
  Component,
  MarkdownRenderer,
  Modal,
  Notice,
  Platform,
  setIcon,
  TFile,
  normalizePath,
} from "obsidian";
import domtoimage from "dom-to-image-more";
import type { Memo, MemoriaSettings } from "./types";
import { t } from "./i18n";
import { applySharedCopyLayout, copyDensity } from "./export-layout";

type MemoShareStyleId = "paper" | "kraft" | "mint" | "peach" | "sky" | "lavender" | "midnight" | "charcoal";

interface MemoShareStyle {
  id: MemoShareStyleId;
  label: string;
  background: string;
  cardBackground: string;
  barBackground: string;
  text: string;
  muted: string;
  barText: string;
  barMuted: string;
  accent: string;
  border: string;
  shadow: string;
  swatch: string;
}

export interface ShareProfile {
  authorName: string;
  authorBio: string;
  avatar: string;
}

interface ShareMemoShape {
  content: string;
  sourcePath: string;
  createdLabel: string;
  dayKey: string;
}

const SHARE_STYLES: MemoShareStyle[] = [
  {
    id: "paper", label: "纸张白",
    background: "#fdfdfd", cardBackground: "#fdfdfd",
    barBackground: "#a9322d",
    text: "#1a1a1c", muted: "#8a8a8e", barText: "#fffaf5", barMuted: "#f2d0c9",
    accent: "#7c3aed", border: "#c8c8cc", shadow: "0 28px 70px rgba(30,30,35,.12)", swatch: "#fdfdfd",
  },
  {
    id: "kraft", label: "牛皮纸",
    background: "#f5ebd8", cardBackground: "#f5ebd8", barBackground: "#6d4626",
    text: "#3d2f1e", muted: "#8a6f4a", barText: "#fff9ed", barMuted: "#ecd6b4",
    accent: "#b45309", border: "#c8a876", shadow: "0 28px 64px rgba(96,65,28,.16)", swatch: "#c8a876",
  },
  {
    id: "mint", label: "薄荷绿",
    background: "#e8f5ec", cardBackground: "#e8f5ec", barBackground: "#1d5f48",
    text: "#1a3a28", muted: "#5a8368", barText: "#f5fff8", barMuted: "#c5e8d1",
    accent: "#059669", border: "#95c8a5", shadow: "0 28px 64px rgba(30,100,55,.15)", swatch: "#059669",
  },
  {
    id: "peach", label: "蜜桃粉",
    background: "#fde8e1", cardBackground: "#fde8e1", barBackground: "#59424b",
    text: "#3d1f18", muted: "#a77363", barText: "#fff8fa", barMuted: "#eed3d9",
    accent: "#ea580c", border: "#ecab93", shadow: "0 28px 64px rgba(155,65,35,.15)", swatch: "#ea580c",
  },
  {
    id: "sky", label: "晴空蓝",
    background: "#e0f2fe", cardBackground: "#e0f2fe", barBackground: "#145d88",
    text: "#0c2a3e", muted: "#5a7a95", barText: "#f4fbff", barMuted: "#c3e4f6",
    accent: "#0284c7", border: "#84bcd8", shadow: "0 28px 64px rgba(20,95,135,.14)", swatch: "#0284c7",
  },
  {
    id: "lavender", label: "薰衣草",
    background: "#eee7fa", cardBackground: "#eee7fa", barBackground: "#503a76",
    text: "#2a1a3e", muted: "#7a6a95", barText: "#fbf8ff", barMuted: "#ddcff6",
    accent: "#7c3aed", border: "#bba9de", shadow: "0 28px 64px rgba(90,55,140,.14)", swatch: "#7c3aed",
  },
  { id: "midnight", label: "午夜蓝", background: "#1a2238", cardBackground: "#1a2238", barBackground: "#c5d2f0", text: "#e8e8ea", muted: "#8a95b0", barText: "#15213d", barMuted: "#4e6086", accent: "#60a5fa", border: "#3a4568", shadow: "0 28px 70px rgba(0,0,0,.4)", swatch: "#1a2238" },
  { id: "charcoal", label: "木炭黑", background: "#1a1b1e", cardBackground: "#1a1b1e", barBackground: "#d6d2cb", text: "#e8e8ea", muted: "#8a8a90", barText: "#1b1c20", barMuted: "#62646a", accent: "#a78bfa", border: "#3a3a40", shadow: "0 28px 70px rgba(0,0,0,.46)", swatch: "#1a1b1e" },
];

const DEFAULT_SHARE_STYLE = SHARE_STYLES[0] as MemoShareStyle;
const SHARE_CARD_WIDTH = 900;
const SHARE_PREFERENCE_KEY = "braincore:moments:share-preference";
const MULTI_SHARE_MAX_ITEMS = 12;
const MULTI_SHARE_MAX_ESTIMATED_HEIGHT = 12000;
const MULTI_SHARE_PAGE_SIZE = 100;

interface ShareRenderProgress { current: number; total: number; }
interface ShareRenderOptions {
  signal?: AbortSignal;
  onProgress?: (progress: ShareRenderProgress) => void;
  /** 静默/预生成：缩短字体与图片等待，减轻按钮卡顿 */
  fast?: boolean;
}

function throwIfShareAborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw new DOMException("Share generation cancelled", "AbortError");
}

function isShareAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function estimateMemoShareHeight(memo: Memo): number {
  const imageCount = (memo.content.match(/!\[\[[\s\S]*?\]\]|!\[[^\]]*\]\([^)]+\)|<img\b/gi) || []).length;
  const plain = memo.content.replace(/!\[\[[\s\S]*?\]\]|!\[[^\]]*\]\([^)]+\)|<img\b[^>]*>/gi, "");
  const sourceLines = Math.max(1, plain.split(/\r?\n/).length);
  return 96 + Math.max(sourceLines, Math.ceil(plain.length / 34)) * 32 + imageCount * 520;
}

function memoToShareShape(memo: Memo): ShareMemoShape {
  return {
    content: memo.content,
    sourcePath: memo.file,
    createdLabel: memo.time,
    dayKey: memo.date,
  };
}

function profileFromSettings(settings: MemoriaSettings): ShareProfile {
  return {
    authorName: (settings.shareAuthorName || "").trim(),
    authorBio: (settings.shareAuthorBio || "").trim(),
    avatar: (settings.shareAvatar || "").trim(),
  };
}

function resolveAvatarUrl(app: App, avatar: string): string | null {
  const v = avatar.trim();
  if (!v) return null;
  if (/^https?:\/\//i.test(v) || /^data:/i.test(v)) return v;
  const file = app.vault.getAbstractFileByPath(normalizePath(v.replace(/^\//, "")));
  if (file instanceof TFile) return app.vault.getResourcePath(file);
  return null;
}

function formatShareDate(dayKey: string): string {
  // 徕卡水印常见：2023.12.17
  return dayKey.replace(/-/g, ".");
}

/** 打开分享弹窗（徕卡式水印） */
export function openMemoShareModal(
  app: App,
  memo: Memo,
  settings: MemoriaSettings
): void {
  new MemoShareModal(app, [memoToShareShape(memo)], profileFromSettings(settings), settings.exportTheme).open();
}

/** 从当前筛选结果选择多条 Moments，合并为一张只有一个底部水印的分享图。 */
export function openMultiMemoSharePicker(
  app: App,
  memos: Memo[],
  settings: MemoriaSettings
): void {
  new MultiMemoSharePickerModal(app, memos, settings).open();
}

class MultiMemoSharePickerModal extends Modal {
  private readonly memos: Memo[];
  private readonly settings: MemoriaSettings;
  private readonly selected = new Set<number>();
  private confirmButton: HTMLButtonElement | null = null;
  private countEl: HTMLElement | null = null;
  private budgetEl: HTMLElement | null = null;
  private listEl: HTMLElement | null = null;
  private query = "";
  private visibleLimit = MULTI_SHARE_PAGE_SIZE;

  constructor(app: App, memos: Memo[], settings: MemoriaSettings) {
    super(app);
    this.memos = memos;
    this.settings = settings;
  }

  onOpen(): void {
    this.modalEl.addClass("memos-multi-share-picker-modal");
    this.contentEl.empty();
    const header = this.contentEl.createDiv({ cls: "memos-multi-share-picker-header" });
    header.createEl("h2", { text: t("share.multiTitle") });
    const search = header.createEl("input", {
      cls: "memos-multi-share-picker-search",
      attr: { type: "search", placeholder: t("share.searchPlaceholder") },
    });
    search.addEventListener("input", () => {
      this.query = search.value.trim().toLowerCase();
      this.visibleLimit = MULTI_SHARE_PAGE_SIZE;
      this.renderRows();
    });
    const headerActions = header.createDiv({ cls: "memos-multi-share-picker-header-actions" });
    const selectAll = headerActions.createEl("button", { text: t("share.selectAll"), attr: { type: "button" } });
    const clear = headerActions.createEl("button", { text: t("share.clearSelection"), attr: { type: "button" } });
    this.listEl = this.contentEl.createDiv({ cls: "memos-multi-share-picker-list" });
    this.renderRows();
    selectAll.addEventListener("click", () => {
      this.selected.clear();
      let estimatedHeight = 0;
      for (const index of this.filteredIndexes()) {
        const memo = this.memos[index] as Memo;
        const nextHeight = estimatedHeight + estimateMemoShareHeight(memo);
        if (this.selected.size >= MULTI_SHARE_MAX_ITEMS || nextHeight > MULTI_SHARE_MAX_ESTIMATED_HEIGHT) break;
        this.selected.add(index);
        estimatedHeight = nextHeight;
      }
      this.renderRows();
      this.updateSelectionState();
    });
    clear.addEventListener("click", () => {
      this.selected.clear();
      this.renderRows();
      this.updateSelectionState();
    });
    const footer = this.contentEl.createDiv({ cls: "memos-multi-share-picker-footer" });
    const summary = footer.createDiv({ cls: "memos-multi-share-picker-budget" });
    this.countEl = summary.createSpan();
    this.budgetEl = summary.createSpan({ cls: "memos-multi-share-picker-budget-detail" });
    this.confirmButton = footer.createEl("button", { cls: "mod-cta", text: t("share.createCombined"), attr: { type: "button" } });
    this.confirmButton.addEventListener("click", () => {
      const chosen = this.memos.filter((_, index) => this.selected.has(index));
      if (!chosen.length) return;
      this.close();
      new MemoShareModal(this.app, chosen.map(memoToShareShape), profileFromSettings(this.settings), this.settings.exportTheme).open();
    });
    this.updateSelectionState();
  }

  onClose(): void { this.contentEl.empty(); this.modalEl.removeClass("memos-multi-share-picker-modal"); }

  private filteredIndexes(): number[] {
    const q = this.query;
    const indexes: number[] = [];
    for (let i = 0; i < this.memos.length; i++) {
      const memo = this.memos[i] as Memo;
      if (!q) {
        indexes.push(i);
        continue;
      }
      const hay = `${memo.date} ${memo.time} ${memo.content}`.toLowerCase();
      if (hay.includes(q)) indexes.push(i);
    }
    return indexes;
  }

  private renderRows(): void {
    if (!this.listEl) return;
    this.listEl.empty();
    const indexes = this.filteredIndexes();
    const shown = indexes.slice(0, this.visibleLimit);
    for (const index of shown) {
      const memo = this.memos[index] as Memo;
      const row = this.listEl.createEl("label", { cls: "memos-multi-share-picker-row" });
      const checkbox = row.createEl("input", { attr: { type: "checkbox" } });
      checkbox.checked = this.selected.has(index);
      row.toggleClass("is-selected", checkbox.checked);
      const summary = row.createDiv({ cls: "memos-multi-share-picker-summary" });
      summary.createSpan({ cls: "memos-multi-share-picker-date", text: `${memo.date} ${memo.time}` });
      summary.createSpan({ cls: "memos-multi-share-picker-copy", text: memo.content.replace(/!\[\[[\s\S]*?\]\]|!\[[^\]]*\]\([^)]+\)|<img\b[^>]*>/gi, "[图片]").replace(/\s+/g, " ").trim() || "[图片]" });
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          const nextHeight = Array.from(this.selected).reduce((sum, selectedIndex) => sum + estimateMemoShareHeight(this.memos[selectedIndex] as Memo), 0) + estimateMemoShareHeight(memo);
          if (this.selected.size >= MULTI_SHARE_MAX_ITEMS || nextHeight > MULTI_SHARE_MAX_ESTIMATED_HEIGHT) {
            checkbox.checked = false;
            new Notice(t("share.budgetExceeded"));
          } else {
            this.selected.add(index);
          }
        } else {
          this.selected.delete(index);
        }
        row.toggleClass("is-selected", checkbox.checked);
        this.updateSelectionState();
      });
    }
    if (indexes.length > this.visibleLimit) {
      const remaining = indexes.length - this.visibleLimit;
      const more = this.listEl.createEl("button", {
        cls: "memos-multi-share-load-more",
        text: t("share.loadMore", { n: remaining }),
        attr: { type: "button" },
      });
      more.addEventListener("click", () => {
        this.visibleLimit += MULTI_SHARE_PAGE_SIZE;
        this.renderRows();
      });
    }
  }

  private updateSelectionState(): void {
    const estimatedHeight = Array.from(this.selected).reduce((sum, index) => sum + estimateMemoShareHeight(this.memos[index] as Memo), 0);
    const overBudget = this.selected.size > MULTI_SHARE_MAX_ITEMS || estimatedHeight > MULTI_SHARE_MAX_ESTIMATED_HEIGHT;
    this.countEl?.setText(t("share.selectedCount", { n: this.selected.size }));
    this.budgetEl?.setText(t("share.budgetStatus", {
      height: Math.ceil(estimatedHeight / 100),
      maxHeight: Math.ceil(MULTI_SHARE_MAX_ESTIMATED_HEIGHT / 100),
      max: MULTI_SHARE_MAX_ITEMS,
    }));
    this.budgetEl?.toggleClass("is-over-budget", overBudget);
    if (this.confirmButton) this.confirmButton.disabled = this.selected.size === 0 || overBudget;
  }
}

class ShareCopyFailureModal extends Modal {
  constructor(app: App, private readonly retry: () => Promise<void>, private readonly save: () => Promise<void>) { super(app); }
  onOpen(): void {
    this.titleEl.setText(t("share.copyFailedTitle"));
    this.contentEl.createEl("p", { text: t("share.copyFailedChoice") });
    const actions = this.contentEl.createDiv({ cls: "memos-share-copy-failure-actions" });
    const retryButton = actions.createEl("button", { cls: "mod-cta", text: t("share.retryCopy"), attr: { type: "button" } });
    const saveButton = actions.createEl("button", { text: t("share.saveInstead"), attr: { type: "button" } });
    const cancelButton = actions.createEl("button", { text: t("share.cancel"), attr: { type: "button" } });
    retryButton.addEventListener("click", () => { this.close(); void this.retry(); });
    saveButton.addEventListener("click", () => { this.close(); void this.save(); });
    cancelButton.addEventListener("click", () => this.close());
  }
  onClose(): void { this.contentEl.empty(); }
}

class MemoShareModal extends Modal {
  private readonly memos: ShareMemoShape[];
  private readonly profile: ShareProfile;
  private readonly markdownRenderComponent = new Component();
  private selectedStyle: MemoShareStyle = DEFAULT_SHARE_STYLE;
  private customTitle = "";
  private previewWrapEl: HTMLElement | null = null;
  private styleListEl: HTMLElement | null = null;
  private titleInputEl: HTMLInputElement | null = null;
  private copyButtonEl: HTMLButtonElement | null = null;
  private saveButtonEl: HTMLButtonElement | null = null;
  private titlePreviewTimer: number | null = null;
  private copyFlashTimer: number | null = null;
  private previewRenderId = 0;
  private previewAbortController: AbortController | null = null;
  private exportAbortController: AbortController | null = null;
  private progressEl: HTMLElement | null = null;
  private progressLabelEl: HTMLElement | null = null;
  private progressBarEl: HTMLProgressElement | null = null;
  private lightboxEl: HTMLElement | null = null;
  private previewResizeObserver: ResizeObserver | null = null;
  /** 预生成导出图，避免点「保存」时长时间无响应，并保留用户手势以便系统分享进相册 */
  private exportCacheKey = "";
  private exportCacheBlob: Blob | null = null;
  private exportWarmPromise: Promise<Blob> | null = null;
  /** 切主题时防抖预生成，避免连点时反复 dom-to-image 卡主线程 */
  private exportWarmTimer: number | null = null;
  private onVisibilityChange: (() => void) | null = null;
  private saveBusy = false;

  constructor(app: App, memos: ShareMemoShape[], profile: ShareProfile, exportTheme?: string) {
    super(app);
    this.memos = memos;
    this.profile = profile;
    const preference = this.loadPreference();
    const requested = SHARE_STYLES.find((style) => style.id === preference.styleId || style.id === exportTheme);
    this.selectedStyle = requested || DEFAULT_SHARE_STYLE;
    this.customTitle = "";
  }

  private preferenceKey(): string {
    const name = this.app.vault?.getName?.() || "default";
    return `${SHARE_PREFERENCE_KEY}::${name}`;
  }

  private loadPreference(): { styleId?: string; title?: string } {
    try {
      const scoped = window.localStorage.getItem(this.preferenceKey());
      if (scoped) return JSON.parse(scoped);
      const legacy = window.localStorage.getItem(SHARE_PREFERENCE_KEY);
      return legacy ? JSON.parse(legacy) : {};
    } catch { return {}; }
  }
  private savePreference(): void {
    try { window.localStorage.setItem(this.preferenceKey(), JSON.stringify({ styleId: this.selectedStyle.id })); } catch { /* ignore */ }
  }

  onOpen(): void {
    document.body.addClass("memos-share-modal-open");
    this.modalEl.addClass("memos-share-modal");
    this.markdownRenderComponent.load();
    this.onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // 用户导出/复制进行中：勿 abort，否则系统分享 sheet 会误取消
        if (this.saveBusy) return;
        // 仅停预热：清 timer + 中断 warm，保留已有缓存 blob 供立即导出
        if (this.exportWarmTimer !== null) {
          window.clearTimeout(this.exportWarmTimer);
          this.exportWarmTimer = null;
        }
        if (this.exportWarmPromise) {
          this.exportAbortController?.abort();
          this.exportWarmPromise = null;
        }
      }
    };
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    this.render();
  }

  onClose(): void {
    if (this.onVisibilityChange) {
      document.removeEventListener("visibilitychange", this.onVisibilityChange);
      this.onVisibilityChange = null;
    }
    if (this.titlePreviewTimer !== null) window.clearTimeout(this.titlePreviewTimer);
    if (this.copyFlashTimer !== null) window.clearTimeout(this.copyFlashTimer);
    if (this.exportWarmTimer !== null) window.clearTimeout(this.exportWarmTimer);
    this.exportWarmTimer = null;
    this.previewResizeObserver?.disconnect();
    this.previewResizeObserver = null;
    this.closeLightbox();
    this.previewAbortController?.abort();
    this.exportAbortController?.abort();
    this.exportCacheBlob = null;
    this.exportCacheKey = "";
    this.exportWarmPromise = null;
    this.markdownRenderComponent.unload();
    this.contentEl.empty();
    this.modalEl.removeClass("memos-share-modal");
    document.body.removeClass("memos-share-modal-open");
  }

  private render(): void {
    this.contentEl.empty();

    const titleRow = document.createElement("div");
    titleRow.className = "memos-share-title-row";
    this.titleInputEl = titleRow.createEl("input", {
      cls: "memos-share-title-input",
      attr: {
        type: "text",
        placeholder: t("share.titlePlaceholder"),
      },
    });
    this.titleInputEl.value = this.customTitle;
    this.titleInputEl.addEventListener("input", () => {
      this.customTitle = this.titleInputEl?.value ?? "";
      this.savePreference();
      this.invalidateExportCache();
      // 输入标题时只在短暂停顿后刷新预览，避免每个字符都重绘 Markdown 图片。
      if (this.titlePreviewTimer !== null) window.clearTimeout(this.titlePreviewTimer);
      this.titlePreviewTimer = window.setTimeout(() => {
        this.titlePreviewTimer = null;
        void this.renderPreview();
      }, 140);
    });

    const scrollEl = this.contentEl.createDiv({ cls: "memos-share-scroll" });
    this.previewWrapEl = scrollEl.createDiv({ cls: "memos-share-preview-wrap", attr: { title: t("share.previewHint") } });
    this.previewWrapEl.addEventListener("click", () => {
      void this.previewImage();
    });
    this.previewResizeObserver?.disconnect();
    this.previewResizeObserver = new ResizeObserver(() => {
      const previewEl = this.previewWrapEl?.querySelector(".memos-share-preview");
      const previewInnerEl = previewEl?.querySelector(".memos-share-preview-inner");
      if (previewEl instanceof HTMLElement && previewInnerEl instanceof HTMLElement) {
        this.fitPreviewToContainer(previewEl, previewInnerEl);
      }
    });
    this.previewResizeObserver.observe(this.previewWrapEl);

    this.styleListEl = scrollEl.createDiv({ cls: "memos-share-style-list" });
    this.renderStyleList();

    // 标题属于导出参数：放在主题选择之后、最终操作之前。
    scrollEl.appendChild(titleRow);

    this.progressEl = this.contentEl.createDiv({ cls: "memos-share-generation-progress" });
    this.progressEl.hidden = true;
    this.progressLabelEl = this.progressEl.createSpan();
    this.progressBarEl = this.progressEl.createEl("progress", { attr: { max: "1", value: "0" } });
    const cancelGeneration = this.progressEl.createEl("button", { text: t("share.cancelGeneration"), attr: { type: "button" } });
    cancelGeneration.addEventListener("click", () => {
      this.previewAbortController?.abort();
      this.exportAbortController?.abort();
    });

    const actionsEl = this.contentEl.createDiv({ cls: "memos-share-actions" });
    const bindAction = (
      button: HTMLButtonElement,
      onClick: () => void | Promise<void>
    ) => {
      // pointerdown 立刻着色，避免触摸延迟让人以为没点到
      button.addEventListener("pointerdown", () => {
        button.addClass("is-pressed");
      });
      button.addEventListener("pointerup", () => {
        window.setTimeout(() => {
          if (button.isConnected) button.removeClass("is-pressed");
        }, 180);
      });
      button.addEventListener("pointercancel", () => button.removeClass("is-pressed"));
      button.addEventListener("click", () => {
        button.addClass("is-pressed");
        void onClick();
      });
    };
    const previewButtonEl = actionsEl.createEl("button", {
      cls: "memos-share-action",
      text: t("share.previewImage"),
      attr: { type: "button" },
    });
    bindAction(previewButtonEl, async () => {
      previewButtonEl.addClass("is-busy");
      const prev = previewButtonEl.getText();
      previewButtonEl.setText("预览中…");
      try {
        await this.previewImage();
      } finally {
        if (previewButtonEl.isConnected) {
          previewButtonEl.removeClass("is-busy");
          previewButtonEl.setText(prev);
          previewButtonEl.removeClass("is-pressed");
        }
      }
    });
    const copyButtonEl = actionsEl.createEl("button", {
      cls: "memos-share-action",
      text: t("share.copyImage"),
      attr: { type: "button" },
    });
    this.copyButtonEl = copyButtonEl;
    bindAction(copyButtonEl, async () => {
      copyButtonEl.addClass("is-busy");
      copyButtonEl.setText("复制中…");
      try {
        await this.copyImage();
      } finally {
        if (copyButtonEl.isConnected && !copyButtonEl.hasClass("is-success")) {
          copyButtonEl.removeClass("is-busy");
          if (copyButtonEl.getText() === "复制中…") {
            copyButtonEl.setText(t("share.copyImage"));
          }
          copyButtonEl.removeClass("is-pressed");
        }
      }
    });
    const saveButtonEl = actionsEl.createEl("button", {
      cls: "memos-share-action",
      text: t("share.saveImage"),
      attr: { type: "button" },
    });
    this.saveButtonEl = saveButtonEl;
    bindAction(saveButtonEl, () => this.saveImage());

    // 弹窗一开先排版预览；导出图延后预热，别和首屏抢主线程
    void this.renderPreview();
    this.scheduleWarmExportCache(Platform.isMobile ? 700 : 280);
  }

  private renderStyleList(): void {
    if (!this.styleListEl) return;
    this.styleListEl.empty();
    SHARE_STYLES.forEach((style) => {
      const buttonEl = this.styleListEl?.createEl("button", {
        cls: `memos-share-style-button${this.selectedStyle.id === style.id ? " is-active" : ""}`,
        attr: {
          type: "button",
          "aria-pressed": String(this.selectedStyle.id === style.id),
          "aria-label": `选择${style.label}主题`,
        },
      });
      if (!buttonEl) return;
      buttonEl.dataset.shareStyleId = style.id;
      buttonEl.style.setProperty("--share-swatch", style.swatch);
      buttonEl.empty();
      buttonEl.createSpan({ cls: "memos-share-style-swatch" });
      buttonEl.createSpan({ text: style.label });
      buttonEl.addEventListener("click", () => {
        this.selectedStyle = style;
        this.savePreference();
        this.updateStyleListActive();
        this.invalidateExportCache();
        // 内容不变时只替换色彩变量，避免图片重新加载造成闪烁。
        if (!this.updatePreviewStyle()) void this.renderPreview();
        // 手机：切主题不预热导出图（dom-to-image 会卡 UI）；桌面可短延迟预热
        else if (!Platform.isMobile) this.scheduleWarmExportCache(450);
      });
    });
  }

  private updateStyleListActive(): void {
    if (!this.styleListEl) return;
    this.styleListEl.querySelectorAll(".memos-share-style-button").forEach((buttonEl) => {
      if (!(buttonEl instanceof HTMLElement)) return;
      const isActive = buttonEl.dataset.shareStyleId === this.selectedStyle.id;
      buttonEl.toggleClass("is-active", isActive);
      buttonEl.setAttribute("aria-pressed", String(isActive));
    });
  }

  private async renderPreview(): Promise<void> {
    if (!this.previewWrapEl) return;

    this.previewAbortController?.abort();
    const controller = new AbortController();
    this.previewAbortController = controller;
    const renderId = ++this.previewRenderId;
    const previousPreviewEl = this.previewWrapEl.querySelector(".memos-share-preview");
    const previousHeight =
      previousPreviewEl instanceof HTMLElement
        ? previousPreviewEl.offsetHeight
        : this.previewWrapEl.offsetHeight;
    if (previousHeight > 0) {
      this.previewWrapEl.style.minHeight = `${previousHeight}px`;
    }

    const previewEl = this.previewWrapEl.createDiv({ cls: "memos-share-preview" });
    const previewInnerEl = previewEl.createDiv({ cls: "memos-share-preview-inner" });
    const avatarUrl = resolveAvatarUrl(this.app, this.profile.avatar);
    const previewCard = new DOMParser().parseFromString(
      buildShareCardHtml(
        this.memos,
        this.selectedStyle,
        "preview",
        this.profile,
        avatarUrl,
        this.customTitle
      ),
      "text/html"
    );
    previewInnerEl.append(...Array.from(previewCard.body.childNodes));
    previewEl.setCssStyles({
      position: "absolute",
      visibility: "hidden",
      pointerEvents: "none",
    });
    try {
      await renderShareContents(this.app, previewInnerEl, this.memos, this.markdownRenderComponent, {
        signal: controller.signal,
        onProgress: ({ current, total }) => this.updateGenerationProgress(t("share.progressLayout"), current, total),
      });
      throwIfShareAborted(controller.signal);
      applySharedCopyLayout(previewInnerEl);
    } catch (error) {
      previewEl.remove();
      if (!isShareAbort(error)) console.error("Failed to render share preview", error);
      return;
    } finally {
      if (this.previewAbortController === controller) {
        this.previewAbortController = null;
        this.hideGenerationProgress();
      }
    }

    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    if (renderId !== this.previewRenderId || !this.previewWrapEl) {
      previewEl.remove();
      return;
    }

    this.fitPreviewToContainer(previewEl, previewInnerEl);
    previewEl.setCssStyles({
      position: "",
      visibility: "",
      pointerEvents: "",
    });
    const nextHeight = previewEl.offsetHeight;
    if (nextHeight > 0) {
      this.previewWrapEl.style.minHeight = `${nextHeight}px`;
    }
    Array.from(this.previewWrapEl.querySelectorAll(".memos-share-preview")).forEach((node) => {
      if (node !== previewEl) node.remove();
    });
    this.scheduleWarmExportCache(Platform.isMobile ? 500 : 200);
  }

  private fitPreviewToContainer(previewEl: HTMLElement, previewInnerEl: HTMLElement): void {
    if (!this.previewWrapEl) return;
    const wrapStyle = window.getComputedStyle(this.previewWrapEl);
    const horizontalPadding =
      Number.parseFloat(wrapStyle.paddingLeft) + Number.parseFloat(wrapStyle.paddingRight);
    const availableWidth = Math.max(160, this.previewWrapEl.clientWidth - horizontalPadding);
    // 桌面弹窗按 80%（720px）校对成品；手机按容器宽度铺满，避免二次缩小和底部按钮被顶出屏。
    const maxScale = this.app.isMobile ? 1 : 0.8;
    const minScale = this.app.isMobile ? 0.28 : 0.38;
    const scale = Math.min(maxScale, Math.max(minScale, availableWidth / SHARE_CARD_WIDTH));
    const cardEl = previewInnerEl.querySelector(".memos-share-card");
    const cardHeight = cardEl instanceof HTMLElement ? cardEl.offsetHeight : 0;
    previewEl.style.width = `${SHARE_CARD_WIDTH * scale}px`;
    previewEl.style.height = cardHeight ? `${cardHeight * scale}px` : "";
    previewInnerEl.style.transform = `scale(${scale})`;
  }

  private async copyImage(): Promise<void> {
    let blob: Blob | null = null;
    try {
      blob = await this.getExportBlob({ label: t("share.progressCopy"), silent: false });
      await this.writeBlobToClipboard(blob);
      new Notice(t("share.imageCopied"));
      this.flashCopyButton();
    } catch (error) {
      if (isShareAbort(error)) { new Notice(t("share.generationCancelled")); return; }
      console.error("Failed to copy share image", error);
      new ShareCopyFailureModal(
        this.app,
        async () => { if (blob) await this.retryClipboard(blob); else await this.copyImage(); },
        async () => { if (blob) await this.downloadBlob(blob); else await this.saveImage(); }
      ).open();
    }
  }

  private async writeBlobToClipboard(blob: Blob): Promise<void> {
    if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") throw new Error("Image clipboard is unavailable");
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
  }

  private async retryClipboard(blob: Blob): Promise<void> {
    try {
      await this.writeBlobToClipboard(blob);
      new Notice(t("share.imageCopied"));
      this.flashCopyButton();
    } catch (error) {
      console.error("Failed to retry share image copy", error);
      new ShareCopyFailureModal(this.app, () => this.retryClipboard(blob), () => this.downloadBlob(blob)).open();
    }
  }

  private closeLightbox(): void {
    this.lightboxEl?.remove();
    this.lightboxEl = null;
  }

  private attachLightboxChrome(layer: HTMLElement, frame: HTMLElement, close: () => void): void {
    layer.addEventListener("click", (event) => { if (event.target === layer) close(); });
    const button = frame.createEl("button", {
      cls: "memos-share-lightbox-close",
      text: "×",
      attr: { type: "button", "aria-label": "关闭预览" },
    });
    frame.insertBefore(button, frame.firstChild);
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      close();
    });
    const actions = frame.createDiv({ cls: "memos-share-lightbox-actions" });
    actions.addEventListener("click", (event) => event.stopPropagation());
    const copyButtonEl = actions.createEl("button", {
      cls: "memos-share-action",
      text: t("share.copyImage"),
      attr: { type: "button" },
    });
    copyButtonEl.addEventListener("click", () => {
      close();
      void this.copyImage();
    });
    const saveButtonEl = actions.createEl("button", {
      cls: "memos-share-action",
      text: t("share.saveImage"),
      attr: { type: "button" },
    });
    saveButtonEl.addEventListener("click", () => {
      close();
      void this.saveImage();
    });
  }

  private openLightboxFromCard(cardEl: HTMLElement): void {
    this.closeLightbox();
    const layer = document.body.createDiv({ cls: "memos-share-lightbox" });
    this.lightboxEl = layer;
    const frame = layer.createDiv({ cls: "memos-share-lightbox-frame" });
    const stage = frame.createDiv({ cls: "memos-share-lightbox-stage" });
    // 先挂空舞台再下一帧克隆，避免同步深拷贝大图卡死点击反馈
    const scale = Math.min(1, Math.max(0.2, (Math.min(window.innerWidth, 900) - 32) / SHARE_CARD_WIDTH));
    const cardHeight = cardEl.offsetHeight;
    stage.style.width = `${SHARE_CARD_WIDTH * scale}px`;
    stage.style.height = cardHeight ? `${cardHeight * scale}px` : "";
    frame.style.width = stage.style.width;
    this.attachLightboxChrome(layer, frame, () => this.closeLightbox());
    stage.addEventListener("click", (event) => event.stopPropagation());
    window.requestAnimationFrame(() => {
      if (this.lightboxEl !== layer) return;
      const clone = cardEl.cloneNode(true) as HTMLElement;
      clone.addClass("memos-share-lightbox-card");
      clone.style.transform = `scale(${scale})`;
      stage.appendChild(clone);
    });
  }

  private async previewImage(): Promise<void> {
    let cardEl = this.previewWrapEl?.querySelector(".memos-share-card");
    if (!(cardEl instanceof HTMLElement) || cardEl.offsetHeight <= 0) {
      new Notice("正在准备预览…");
      await this.renderPreview();
      cardEl = this.previewWrapEl?.querySelector(".memos-share-card");
    }
    if (cardEl instanceof HTMLElement && cardEl.offsetHeight > 0) {
      this.openLightboxFromCard(cardEl);
      return;
    }
    new Notice("预览还没排好，请稍后再试");
  }

  private updatePreviewStyle(): boolean {
    if (!this.previewWrapEl) return false;
    const cardEl = this.previewWrapEl.querySelector(".memos-share-card");
    if (!(cardEl instanceof HTMLElement)) return false;
    this.applyStyleToShareCard(cardEl, this.selectedStyle);
    return true;
  }

  private applyStyleToShareCard(cardEl: HTMLElement, style: MemoShareStyle): void {
    cardEl.style.setProperty("--share-bg", style.cardBackground);
    const isPaper = style.id === "paper";
    cardEl.style.setProperty("--share-bar-bg", isPaper ? "#111" : "#fff");
    cardEl.style.setProperty("--share-text", style.text);
    cardEl.style.setProperty("--share-muted", style.muted);
    cardEl.style.setProperty("--share-bar-text", isPaper ? "#fff" : "#111");
    cardEl.style.setProperty("--share-bar-muted", isPaper ? "rgba(255,255,255,.68)" : "#737373");
    cardEl.style.setProperty("--share-accent", style.accent);
    cardEl.style.setProperty("--share-border", style.border);
    cardEl.style.setProperty("--share-shadow", style.shadow);
    cardEl.className = cardEl.className.replace(/share-style-[a-z-]+/g, "").trim();
    cardEl.addClass(`share-style-${style.id}`);
  }

  private flashCopyButton(): void {
    const button = this.copyButtonEl;
    if (!button) return;
    const original = t("share.copyImage");
    button.setText(t("share.imageCopied"));
    button.addClass("is-success");
    if (this.copyFlashTimer !== null) window.clearTimeout(this.copyFlashTimer);
    this.copyFlashTimer = window.setTimeout(() => {
      this.copyFlashTimer = null;
      if (!button.isConnected) return;
      button.setText(original);
      button.removeClass("is-success");
    }, 1300);
  }

  /** 点击瞬间着色反馈（三钮平等，不再永久高亮「复制」） */
  private pulseActionButton(button: HTMLElement): void {
    button.addClass("is-pressed");
    window.setTimeout(() => {
      if (button.isConnected) button.removeClass("is-pressed");
    }, 220);
  }

  private async saveImage(): Promise<void> {
    if (this.saveBusy) return;
    this.saveBusy = true;
    const saveBtn = this.saveButtonEl;
    const originalLabel = t("share.saveImage");
    try {
      const key = this.currentExportKey();
      const hadCache = Boolean(this.exportCacheBlob && this.exportCacheKey === key);

      if (!hadCache && saveBtn) {
        saveBtn.setText("生成中…");
        saveBtn.addClass("is-busy");
        new Notice("正在生成图片…");
      }

      const blob = await this.getExportBlob({ silent: true });

      if (saveBtn) {
        saveBtn.removeClass("is-busy");
        saveBtn.setText(originalLabel);
      }

      // 手机端：若刚经历长时间生成，系统分享常会丢手势 → 先试一次，失败则按钮变「再点保存」
      if (!hadCache && Platform.isMobile) {
        const shared = await this.tryShareFiles(blob);
        if (shared) {
          if (saveBtn) saveBtn.removeClass("is-primary");
          return;
        }
        if (saveBtn) {
          saveBtn.setText("再点保存到相册");
          saveBtn.addClass("is-primary");
        }
        new Notice("已就绪，再点一次即可保存到相册");
        return;
      }

      if (saveBtn) {
        saveBtn.setText("保存中…");
        saveBtn.addClass("is-busy");
      }
      await this.saveBlobToPhotos(blob);
      if (saveBtn) {
        saveBtn.removeClass("is-busy");
        saveBtn.removeClass("is-primary");
        saveBtn.setText(originalLabel);
      }
    } catch (error) {
      if (saveBtn) {
        saveBtn.removeClass("is-busy");
        saveBtn.removeClass("is-primary");
        saveBtn.setText(originalLabel);
      }
      if (isShareAbort(error)) { new Notice(t("share.generationCancelled")); return; }
      console.error("Failed to save share image", error);
      new Notice(t("share.saveFailed"));
    } finally {
      this.saveBusy = false;
    }
  }

  private shareFileName(): string {
    const firstMemo = this.memos[0];
    return `memo-share-${firstMemo?.dayKey || "moments"}-${this.memos.length > 1 ? `${this.memos.length}-items` : (firstMemo?.createdLabel || "").replace(/[:\s]/g, "")}.png`;
  }

  private currentExportKey(): string {
    return [
      this.selectedStyle.id,
      this.customTitle,
      String(this.memos.length),
      ...this.memos.map((m) => `${m.dayKey}|${m.createdLabel}|${m.content.length}`),
    ].join("::");
  }

  private invalidateExportCache(): void {
    this.exportCacheKey = "";
    this.exportCacheBlob = null;
    if (this.exportWarmTimer !== null) {
      window.clearTimeout(this.exportWarmTimer);
      this.exportWarmTimer = null;
    }
    // 打断正在跑的预生成，避免旧主题占满主线程、又挡住新主题预热
    this.exportAbortController?.abort();
    this.exportWarmPromise = null;
  }

  /** 延迟预热导出图：连点主题只保留最后一次 */
  private scheduleWarmExportCache(delayMs: number): void {
    if (document.visibilityState === "hidden") return;
    if (this.exportWarmTimer !== null) window.clearTimeout(this.exportWarmTimer);
    this.exportWarmTimer = window.setTimeout(() => {
      this.exportWarmTimer = null;
      this.warmExportCache();
    }, Math.max(0, delayMs));
  }

  /** 预览就绪后延迟后台生成，避免与首次点击抢主线程 */
  private warmExportCache(): void {
    if (document.visibilityState === "hidden") return;
    const key = this.currentExportKey();
    if (this.exportCacheBlob && this.exportCacheKey === key) return;
    const warmKey = key;
    const start = () => {
      if (document.visibilityState === "hidden") return;
      if (this.currentExportKey() !== warmKey) return;
      if (this.exportCacheBlob && this.exportCacheKey === warmKey) return;
      // 若仍有旧 promise 引用但已 abort，允许开新任务
      this.exportWarmPromise = (async () => {
        try {
          const blob = await this.createImageBlob("", { silent: true, fast: true });
          if (this.currentExportKey() === warmKey) {
            this.exportCacheKey = warmKey;
            this.exportCacheBlob = blob;
          }
          return blob;
        } finally {
          this.exportWarmPromise = null;
        }
      })();
    };
    // 让预览/按钮先响应，再在空闲时预生成
    const ric = (window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;
    if (typeof ric === "function") {
      ric(() => start(), { timeout: Platform.isMobile ? 1600 : 900 });
    } else {
      window.setTimeout(start, Platform.isMobile ? 480 : 320);
    }
  }

  private async getExportBlob(opts: { silent?: boolean; label?: string } = {}): Promise<Blob> {
    const key = this.currentExportKey();
    if (this.exportCacheBlob && this.exportCacheKey === key) return this.exportCacheBlob;
    if (this.exportWarmPromise) {
      try {
        await this.exportWarmPromise;
        if (this.exportCacheBlob && this.exportCacheKey === key) return this.exportCacheBlob;
      } catch {
        /* fall through */
      }
    }
    const blob = await this.createImageBlob(opts.label ?? "", {
      silent: opts.silent ?? true,
      fast: true,
    });
    this.exportCacheKey = key;
    this.exportCacheBlob = blob;
    return blob;
  }

  private async downloadBlob(blob: Blob): Promise<void> {
    const url = URL.createObjectURL(blob);
    const linkEl = document.createElement("a");
    linkEl.href = url;
    linkEl.download = this.shareFileName();
    linkEl.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    new Notice(t("share.imageSaved"));
  }

  /** 手机：系统分享 → 选「存储图像」进相册；桌面：下载。 */
  private async tryShareFiles(blob: Blob): Promise<boolean> {
    const fileName = this.shareFileName();
    const file = new File([blob], fileName, { type: blob.type || "image/png" });
    const nav = navigator as Navigator & {
      canShare?: (data: ShareData) => boolean;
      share?: (data: ShareData) => Promise<void>;
    };
    const shareData: ShareData = { files: [file], title: fileName };
    const canShareFiles =
      typeof nav.share === "function" &&
      (!nav.canShare || nav.canShare(shareData));
    if (!canShareFiles) return false;
    try {
      await nav.share(shareData);
      new Notice("请点「存储图像」保存到相册");
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return true; // 用户取消也算已唤起
      return false;
    }
  }

  private async saveBlobToPhotos(blob: Blob): Promise<void> {
    if (await this.tryShareFiles(blob)) return;

    // 部分 iOS WebView 不支持 files share：用 data URL 打开预览页，长按可存相册
    if (Platform.isMobile) {
      try {
        const dataUrl = await blobToDataUrl(blob);
        const opened = window.open(dataUrl, "_blank");
        if (opened) {
          new Notice("已打开图片，长按选择「存储图像」保存到相册");
          return;
        }
      } catch {
        /* fall through */
      }
    }

    await this.downloadBlob(blob);
  }

  private updateGenerationProgress(label: string, current: number, total: number): void {
    if (!label) {
      this.hideGenerationProgress();
      return;
    }
    if (!this.progressEl || !this.progressLabelEl || !this.progressBarEl) return;
    this.progressEl.hidden = false;
    this.progressLabelEl.setText(`${label} ${Math.min(current, total)}/${total}`);
    this.progressBarEl.max = Math.max(1, total);
    this.progressBarEl.value = Math.min(current, total);
  }

  private hideGenerationProgress(): void {
    if (this.progressEl) this.progressEl.hidden = true;
  }

  private async createImageBlob(
    label: string,
    opts: { silent?: boolean; fast?: boolean } = {}
  ): Promise<Blob> {
    // 不要 abort 预览：点复制/保存时中断预览会重绘，按钮会卡一下
    this.exportAbortController?.abort();
    const controller = new AbortController();
    this.exportAbortController = controller;
    const silent = Boolean(opts.silent) || !label;
    try {
      return await exportShareCardDomToBlob(
        this.app,
        this.memos,
        this.selectedStyle,
        this.markdownRenderComponent,
        this.profile,
        this.customTitle,
        {
          signal: controller.signal,
          fast: Boolean(opts.fast) || silent,
          onProgress: silent
            ? undefined
            : ({ current, total }) => this.updateGenerationProgress(label, current, total),
        }
      );
    } finally {
      if (this.exportAbortController === controller) {
        this.exportAbortController = null;
        this.hideGenerationProgress();
      }
    }
  }
}

/** 去掉 Obsidian 渲染带来的框线/背景，避免分享图「套框」 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("read failed"));
    reader.readAsDataURL(blob);
  });
}

function sanitizeShareContent(root: HTMLElement): void {
  root.querySelectorAll(".internal-embed, .markdown-embed, .markdown-embed-content, .callout").forEach((el) => {
    if (el instanceof HTMLElement) {
      el.style.border = "none";
      el.style.boxShadow = "none";
      el.style.background = "transparent";
      el.style.padding = "0";
      el.style.margin = "0";
    }
  });
  root.querySelectorAll("hr").forEach((el) => el.remove());
}

async function exportShareCardDomToBlob(
  app: App,
  memos: ShareMemoShape[],
  style: MemoShareStyle,
  component: Component,
  profile: ShareProfile,
  customTitle: string,
  options: ShareRenderOptions = {}
): Promise<Blob> {
  const surfaceEl = document.createElement("div");
  surfaceEl.addClass("memos-share-export-surface");
  surfaceEl.style.setProperty("--share-export-bg", style.background);
  const avatarUrl = resolveAvatarUrl(app, profile.avatar);
  const exportCard = new DOMParser().parseFromString(
    buildShareCardHtml(memos, style, "image", profile, avatarUrl, customTitle),
    "text/html"
  );
  surfaceEl.append(...Array.from(exportCard.body.childNodes));

  const cardEl = surfaceEl.querySelector(".memos-share-card");
  if (!(cardEl instanceof HTMLElement) || !cardEl.querySelector(".memos-share-card-content")) {
    throw new Error("Share card content element was not created.");
  }

  document.body.appendChild(surfaceEl);
  try {
    window.getSelection()?.removeAllRanges();
    await renderShareContents(app, surfaceEl, memos, component, options);
    throwIfShareAborted(options.signal);
    await waitForDomToSettle(surfaceEl, options.signal, options.fast);
    throwIfShareAborted(options.signal);
    applySharedCopyLayout(surfaceEl);
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    // 恢复早期稳定的单一导出根节方案。dom-to-image 直接截取带
    // overflow/flex 的卡片时会在某些缩放比下产生子像素左偏移；由零内边距
    // surface 统一定义截图边界，正文与水印自然共用同一画布宽度。
    const rect = surfaceEl.getBoundingClientRect();
    const blob = await domtoimage.toBlob(surfaceEl, {
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height),
      cacheBust: false,
      imagePlaceholder: TRANSPARENT_IMAGE_PLACEHOLDER,
    });
    throwIfShareAborted(options.signal);
    return blob;
  } finally {
    surfaceEl.remove();
  }
}

async function waitForDomToSettle(
  rootEl: HTMLElement,
  signal?: AbortSignal,
  fast = false
): Promise<void> {
  throwIfShareAborted(signal);
  const fontBudgetMs = fast
    ? Platform.isMobile ? 180 : 400
    : Platform.isMobile ? 600 : 2500;
  const imageWaitMs = fast
    ? Platform.isMobile ? 900 : 1600
    : Platform.isMobile ? 4000 : 8000;
  await Promise.race([
    Promise.resolve(document.fonts?.ready).catch(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, fontBudgetMs)),
  ]);
  const images = Array.from(rootEl.querySelectorAll("img"));
  await Promise.all(images.map((image) => waitForShareImage(image, signal, imageWaitMs)));
  throwIfShareAborted(signal);
  await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
}

function waitForShareImage(image: HTMLImageElement, signal: AbortSignal | undefined, timeoutMs: number): Promise<void> {
  if (image.complete) return Promise.resolve();
  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(timer);
      image.removeEventListener("load", finish);
      image.removeEventListener("error", finish);
      signal?.removeEventListener("abort", finish);
      resolve();
    };
    const timer = window.setTimeout(finish, timeoutMs);
    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
    signal?.addEventListener("abort", finish, { once: true });
  });
}

const TRANSPARENT_IMAGE_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

function buildShareCardHtml(
  memos: ShareMemoShape[],
  style: MemoShareStyle,
  mode: "preview" | "image",
  profile: ShareProfile,
  avatarUrl: string | null,
  customTitle: string
): string {
  const scale = mode === "preview" ? "memos-share-card-preview" : "memos-share-card-image";
  const memo = memos[0] as ShareMemoShape;
  const allContent = memos.map((item) => item.content).join("\n");
  const hasImage = /!\[\[[\s\S]*?\]\]|!\[[^\]]*\]\([^)]+\)|<img\b/i.test(allContent);
  const contentMode = hasImage ? "has-media" : "is-text-only";
  const plainText = allContent
    .replace(/!\[\[[\s\S]*?\]\]|!\[[^\]]*\]\([^)]+\)|<img\b[^>]*>/gi, "")
    .trim();
  const density = `is-copy-${copyDensity(plainText, { mediumChars: 60, mediumLines: 5, longChars: 145, longLines: 10 })}`;
  const name = profile.authorName || "Moments";
  // 左：本篇标题；空则用水印附加文案
  const leftTitle = (customTitle || "").trim() || profile.authorBio || "";
  const dateLabel = formatShareDate(memo.dayKey);
  const avatarHtml = avatarUrl
    ? `<img class="memos-share-leica-avatar" src="${escapeHtml(avatarUrl)}" alt="" />`
    : `<div class="memos-share-leica-avatar is-placeholder" aria-hidden="true">${escapeHtml(name.slice(0, 1) || "M")}</div>`;

  const leftHtml = leftTitle
    ? `<div class="memos-share-leica-left"><div class="memos-share-leica-title">${escapeHtml(leftTitle)}</div></div>`
    : `<div class="memos-share-leica-left is-empty"></div>`;

  const isPaper = style.id === "paper";
  const barBackground = isPaper ? "#111" : "#fff";
  const barText = isPaper ? "#fff" : "#111";
  const barMuted = isPaper ? "rgba(255,255,255,.68)" : "#737373";
  return [
    `<section class="memos-share-card ${scale} ${contentMode} ${density}${memos.length > 1 ? " is-multi-share" : ""} share-style-${style.id}" style="--share-bg:${style.cardBackground};--share-bar-bg:${barBackground};--share-text:${style.text};--share-muted:${style.muted};--share-bar-text:${barText};--share-bar-muted:${barMuted};--share-accent:${style.accent};--share-border:${style.border};--share-shadow:${style.shadow};">`,
    '<div class="memos-share-card-body">',
    ...memos.map((item, index) => `<section class="memos-share-entry"><div class="memos-share-entry-date">${escapeHtml(formatShareDate(item.dayKey))} · ${escapeHtml(item.createdLabel)}</div><article class="memos-share-card-content markdown-rendered" data-share-index="${index}"></article></section>`),
    "</div>",
    '<div class="memos-share-leica" role="contentinfo">',
    leftHtml,
    '<div class="memos-share-leica-right">',
    avatarHtml,
    '<div class="memos-share-leica-meta">',
    `<div class="memos-share-leica-name">${escapeHtml(name)}</div>`,
    `<div class="memos-share-leica-datetime"><span>${escapeHtml(dateLabel)}</span><span class="memos-share-leica-dot">·</span><span>${escapeHtml(memo.createdLabel)}</span></div>`,
    "</div>",
    "</div>",
    "</div>",
    "</section>",
  ].join("");
}

async function renderShareContents(
  app: App,
  root: HTMLElement,
  memos: ShareMemoShape[],
  component: Component,
  options: ShareRenderOptions = {}
): Promise<void> {
  const contentEls = Array.from(root.querySelectorAll<HTMLElement>(".memos-share-card-content"));
  options.onProgress?.({ current: 0, total: contentEls.length });
  for (let index = 0; index < contentEls.length; index++) {
    throwIfShareAborted(options.signal);
    const contentEl = contentEls[index] as HTMLElement;
    const memo = memos[index];
    if (!memo) continue;
    contentEl.empty();
    await MarkdownRenderer.render(app, memo.content.trimEnd(), contentEl, memo.sourcePath, component);
    sanitizeShareContent(contentEl);
    options.onProgress?.({ current: index + 1, total: contentEls.length });
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
