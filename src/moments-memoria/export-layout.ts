export type CopyDensity = "short" | "medium" | "long";
export type CopyStage = "single-normal" | "single-small" | "columns-normal" | "columns-small" | "truncated";

export interface DensityThresholds { mediumChars: number; mediumLines: number; longChars: number; longLines: number; }
export interface CopyLine { text: string; blank: boolean; prose: boolean; }

export const COPY_STAGE_ORDER: readonly CopyStage[] = ["single-normal", "single-small", "columns-normal", "columns-small", "truncated"] as const;
const ELLIPSIS = "……";
const COPY_SLOT_SELECTOR = [
  ".memos-share-card.is-text-only .memos-share-card-content",
].join(",");

export function sourceLines(value: string): CopyLine[] {
  const raw = value.replace(/\r\n?/g, "\n").replace(/[ \t]+$/gm, "").split("\n");
  while (raw.length && !raw[0].trim()) raw.shift();
  while (raw.length && !raw[raw.length - 1].trim()) raw.pop();
  // 短句按诗行保护；长行是没有手动换行的散文段落，允许浏览器自然折行。
  // 这样既不会拆散诗句，也不会把整段散文误排成“一行正文 + 一栏省略号”。
  return raw.map((text) => ({ text, blank: !text.length, prose: text.trim().length > 42 }));
}

export function textMetrics(value: string): { chars: number; lines: number } {
  const lines = sourceLines(value);
  return { chars: lines.reduce((sum, line) => sum + line.text.length, 0), lines: lines.length };
}

export function copyDensity(value: string, thresholds: DensityThresholds = { mediumChars: 30, mediumLines: 4, longChars: 70, longLines: 7 }): CopyDensity {
  const metric = textMetrics(value);
  if (metric.chars > thresholds.longChars || metric.lines > thresholds.longLines) return "long";
  if (metric.chars > thresholds.mediumChars || metric.lines > thresholds.mediumLines) return "medium";
  return "short";
}

/** 原文行是最小排版单位，绝不按字或标点拆开。 */
export function splitLinesAt(lines: CopyLine[], index: number): [CopyLine[], CopyLine[]] {
  const cut = Math.max(1, Math.min(lines.length - 1, index));
  return [lines.slice(0, cut), lines.slice(cut)];
}

export function truncateWholeLines(value: string, visibleSourceLines: number): string {
  const lines = sourceLines(value);
  if (visibleSourceLines >= lines.length) return lines.map((line) => line.text).join("\n");
  return [...lines.slice(0, Math.max(0, visibleSourceLines)).map((line) => line.text), ELLIPSIS].join("\n");
}

function lineElement(line: CopyLine): HTMLElement {
  const el = document.createElement("div");
  el.className = `bc-fit-line${line.blank ? " is-blank" : ""}${line.prose ? " is-prose" : ""}`;
  el.textContent = line.blank ? "\u00a0" : line.text;
  return el;
}

function proseUnits(line: CopyLine): CopyLine[] {
  if (!line.prose) return [line];
  const sentences = line.text.match(/[^。！？；.!?]+[。！？；.!?]?/g)?.filter(Boolean) ?? [line.text];
  const units: CopyLine[] = [];
  for (const sentence of sentences) {
    if (sentence.length <= 42) { units.push({ text: sentence, blank: false, prose: true }); continue; }
    for (let start = 0; start < sentence.length; start += 42) units.push({ text: sentence.slice(start, start + 42), blank: false, prose: true });
  }
  return units;
}

export function columnCopyUnits(lines: CopyLine[]): CopyLine[] {
  return lines.flatMap((line) => proseUnits(line));
}

function appendFlow(container: HTMLElement, lines: CopyLine[]): void {
  let prose = "";
  const flushProse = (): void => {
    if (!prose) return;
    container.appendChild(lineElement({ text: prose, blank: false, prose: true })); prose = "";
  };
  lines.forEach((line) => {
    if (line.prose) prose += line.text;
    else { flushProse(); container.appendChild(lineElement(line)); }
  });
  flushProse();
}

function columnElement(lines: CopyLine[]): HTMLElement {
  const column = document.createElement("div");
  column.className = "bc-fit-column";
  appendFlow(column, lines);
  return column;
}

function renderSingle(slot: HTMLElement, lines: CopyLine[], stage: CopyStage): void {
  slot.replaceChildren(); slot.dataset.fitStage = stage;
  const block = document.createElement("div"); block.className = "bc-fit-block bc-fit-single";
  appendFlow(block, lines); slot.appendChild(block);
}

function renderColumns(slot: HTMLElement, left: CopyLine[], right: CopyLine[], stage: CopyStage): void {
  slot.replaceChildren(); slot.dataset.fitStage = stage;
  const block = document.createElement("div"); block.className = "bc-fit-block bc-fit-columns";
  block.append(columnElement(left), columnElement(right)); slot.appendChild(block);
}

function elementFits(container: HTMLElement): boolean {
  const block = container.firstElementChild as HTMLElement | null;
  if (!block || container.clientWidth < 2 || container.clientHeight < 2) return false;
  const box = container.getBoundingClientRect(); const tolerance = 0.75;
  if (block.scrollWidth > container.clientWidth + tolerance || block.scrollHeight > container.clientHeight + tolerance) return false;
  for (const line of Array.from(block.querySelectorAll<HTMLElement>(".bc-fit-line"))) {
    const rect = line.getBoundingClientRect();
    if (rect.left < box.left - tolerance || rect.right > box.right + tolerance || rect.top < box.top - tolerance || rect.bottom > box.bottom + tolerance) return false;
  }
  return true;
}

function trySingle(slot: HTMLElement, lines: CopyLine[], stage: "single-normal" | "single-small"): boolean {
  renderSingle(slot, lines, stage); return elementFits(slot);
}

function tryBestColumns(slot: HTMLElement, lines: CopyLine[], stage: "columns-normal" | "columns-small" | "truncated"): boolean {
  const units = columnCopyUnits(lines);
  if (units.length < 2) return false;
  let best: { split: number; balance: number } | null = null;
  for (let split = 1; split < units.length; split++) {
    const [left, right] = splitLinesAt(units, split); renderColumns(slot, left, right, stage);
    if (!elementFits(slot)) continue;
    const columns = slot.querySelectorAll<HTMLElement>(".bc-fit-column");
    const balance = Math.abs((columns[0]?.scrollHeight || 0) - (columns[1]?.scrollHeight || 0));
    if (!best || balance < best.balance) best = { split, balance };
  }
  if (!best) return false;
  const [left, right] = splitLinesAt(units, best.split); renderColumns(slot, left, right, stage); return true;
}

function renderTruncated(slot: HTMLElement, lines: CopyLine[]): void {
  const ellipsis: CopyLine = { text: ELLIPSIS, blank: false, prose: false };
  const units = columnCopyUnits(lines);
  for (let count = units.length - 1; count >= 0; count--) {
    const shown = [...units.slice(0, count), ellipsis];
    if (tryBestColumns(slot, shown, "truncated")) { slot.dataset.fitTruncated = "true"; return; }
    renderSingle(slot, shown, "single-small");
    if (elementFits(slot)) { slot.dataset.fitStage = "truncated"; slot.dataset.fitTruncated = "true"; return; }
  }
  renderSingle(slot, [ellipsis], "truncated"); slot.dataset.fitTruncated = "true";
}

export function fitCopySlot(slot: HTMLElement): CopyStage {
  const source = slot.dataset.copySource ?? slot.textContent ?? "";
  slot.dataset.copySource = source; slot.classList.add("bc-fit-copy"); slot.removeAttribute("data-fit-truncated");
  const lines = sourceLines(source);
  if (!lines.length) { slot.replaceChildren(); slot.dataset.fitStage = "single-normal"; return "single-normal"; }
  if (trySingle(slot, lines, "single-normal")) return "single-normal";
  if (trySingle(slot, lines, "single-small")) return "single-small";
  if (tryBestColumns(slot, lines, "columns-normal")) return "columns-normal";
  if (tryBestColumns(slot, lines, "columns-small")) return "columns-small";
  renderTruncated(slot, lines); return "truncated";
}

export function applySharedCopyLayout(root: HTMLElement): void {
  const slots = new Set<HTMLElement>();
  if (root.matches(COPY_SLOT_SELECTOR)) slots.add(root);
  root.querySelectorAll<HTMLElement>(COPY_SLOT_SELECTOR).forEach((slot) => slots.add(slot));
  // 合并分享是一组自然文流，不应套用单卡片固定槽位的缩放/双栏算法。
  slots.forEach((slot) => {
    if (slot.closest(".memos-share-card.is-multi-share")) return;
    fitCopySlot(slot);
  });
}
