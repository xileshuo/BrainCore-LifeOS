import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (name) => fs.readFileSync(path.join(root, name), "utf8");

test("docs no longer teach one-file memos, 闪念存放, or the old plugin folder", () => {
  const guide = read("docs/usage-guide-body.md");
  const readme = read("README.md");
  const shortcuts = read("docs/BrainCore快捷指令使用指南.md");
  const source = read("main.source.js");
  assert.equal(guide.includes("一条一文件"), false);
  assert.equal(guide.includes("闪念存放"), false);
  assert.equal(guide.includes("Ideas 闪念"), false);
  assert.equal(guide.includes("验证并激活"), false);
  assert.equal(readme.includes(".obsidian/plugins/BrainCore LifeOS/"), false);
  assert.match(readme, /plugins\/braincore-lifeos/);
  const version = JSON.parse(read("manifest.json")).version;
  assert.equal(shortcuts.includes("3.2.4"), false);
  assert.equal(shortcuts.includes("闪念"), false);
  assert.ok(shortcuts.includes(`**${version}**`), `快捷指令指南版本号应为 ${version}`);
  assert.equal(source.includes("写入 Moments（一条一文件）"), false);
  assert.equal(source.includes('pathMoments = v || "Moments"'), false);
});
