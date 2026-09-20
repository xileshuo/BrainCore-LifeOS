export interface TagNode {
  name: string;
  full: string;
  count: number;
  self: number;
  children: Map<string, TagNode>;
}

export function fmtDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * 基于 seed 的确定性采样：从数组里不重复地抽 n 个元素。
 * 同样的 seed + 同样的输入 → 同样的输出，保证 renderList 反复调用结果一致。
 * 使用 mulberry32 伪随机 + Fisher–Yates 洗牌的前 n 项。
 */
export function seededSample<T>(arr: T[], n: number, seed: number): T[] {
  if (n >= arr.length) return [...arr];
  let s = seed >>> 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const copy = [...arr];
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(rand() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

/**
 * 给 MarkdownRenderer 输入前做"块级语法"前后补空行规范化。
 *
 * 问题背景：Obsidian 的 MarkdownRenderer 对 CommonMark 严格遵循，
 * 某些块级语法（代码块围栏、表格、callout/blockquote、标题、分隔线）
 * 前后必须有空行，否则会被误识别为段落的一部分。
 *
 * 我们不修改 md 存储，只在渲染前做一份临时规范化，保证显示效果正确。
 */
export function normalizeForRender(raw: string): string {
  const lines = raw.split("\n");
  const out: string[] = [];
  let inFence = false;

  const isTableLine = (s: string) => /^\s*\|.*\|\s*$/.test(s);
  const isHeading = (s: string) => /^#{1,6}\s/.test(s);
  const isHr = (s: string) => /^\s*(?:---|\*\*\*|___)\s*$/.test(s);
  const isCallout = (s: string) => /^\s*>/.test(s);
  const isFence = (s: string) => /^\s*(?:```|~~~)/.test(s);

  const lastNonEmpty = () => {
    for (let i = out.length - 1; i >= 0; i--) {
      if (out[i].trim() !== "") return out[i];
    }
    return "";
  };
  const pushBlank = () => {
    if (out.length > 0 && out[out.length - 1].trim() !== "") out.push("");
  };

  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    const prev = i > 0 ? lines[i - 1] : "";
    const next = i < lines.length - 1 ? lines[i + 1] : "";

    if (isFence(ln) && !inFence) {
      pushBlank();
      out.push(ln);
      inFence = true;
      continue;
    }
    if (inFence) {
      out.push(ln);
      if (isFence(ln)) {
        inFence = false;
        if (next.trim() !== "") out.push("");
      }
      continue;
    }

    if (isHeading(ln)) {
      pushBlank();
      out.push(ln);
      if (next.trim() !== "") out.push("");
      continue;
    }

    if (isHr(ln) && prev.trim() !== "" && !isHeading(lastNonEmpty())) {
      pushBlank();
      out.push(ln);
      if (next.trim() !== "") out.push("");
      continue;
    }

    if (isTableLine(ln) && prev.trim() !== "" && !isTableLine(prev)) {
      pushBlank();
      out.push(ln);
      continue;
    }
    if (isTableLine(ln)) {
      out.push(ln);
      if (next.trim() !== "" && !isTableLine(next)) out.push("");
      continue;
    }

    if (isCallout(ln) && prev.trim() !== "" && !isCallout(prev)) {
      pushBlank();
      out.push(ln);
      continue;
    }

    out.push(ln);
  }

  return out.join("\n");
}
