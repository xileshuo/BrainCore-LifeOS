import test from "node:test";
import assert from "node:assert/strict";
import esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import os from "node:os";
import fs from "node:fs/promises";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outfile = path.join(os.tmpdir(), `braincore-parser-${process.pid}.mjs`);
await esbuild.build({ entryPoints: [path.join(root, "src/moments-memoria/parser.ts")], outfile, bundle: true, format: "esm", platform: "node" });
const parser = await import(pathToFileURL(outfile).href + `?v=${Date.now()}`);
test.after(async () => fs.rm(outfile, { force: true }));

test("parses legacy ## and v3 ### date headings without losing entries", () => {
  const raw = `# 08月\n\n## 第34周\n\n### 2026-08-19 周三\n\n- 08:44\n  第一条\n\n---\n\n## 2026-08-20 周四\n\n- 09:30 旧格式`;
  const memos = parser.parseFile("读&写/Moments/2026.md", raw);
  assert.equal(memos.length, 2);
  assert.deepEqual(memos.map((m) => m.content), ["第一条", "旧格式"]);
});

test("render/parse preserves multiline text, blank lines and metadata", () => {
  const content = "第一行\n\n第三行 #生活\n- [ ] 待办\n![[图.png]]\n[链接](https://example.com)";
  const raw = `### 2026-08-20 周四\n\n${parser.renderMemo("10:08", content)}\n`;
  const [memo] = parser.parseFile("读&写/Moments/2026.md", raw);
  assert.equal(memo.content, content);
  assert.deepEqual(memo.tags, ["生活"]);
  assert.equal(memo.hasOpenTask, true);
  assert.equal(memo.hasImage, true);
  assert.equal(memo.hasLink, true);
});

test("image-only markdown is not classified as a normal link", () => {
  assert.equal(parser.detectImage("![](https://example.com/a.png)"), true);
  assert.equal(parser.detectLink("![](https://example.com/a.png)"), false);
});
