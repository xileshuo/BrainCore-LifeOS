import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = await fs.readFile(path.join(root, "main.source.js"), "utf8");
const start = source.indexOf("function getTaskIndentDepth(");
const end = source.indexOf("function markTaskLineComplete(", start);
assert.ok(start >= 0 && end > start, "pending-task parser source must be discoverable");

const context = {};
vm.createContext(context);
vm.runInContext(`${source.slice(start, end)}\nthis.parsePendingTaskLine = parsePendingTaskLine;`, context);
const parse = context.parsePendingTaskLine;

test("pending-task parser keeps real task content", () => {
  assert.equal(parse("- [ ] dashboard里面待办事项的展现")?.cleanText, "dashboard里面待办事项的展现");
  assert.equal(parse("    - [ ] #随笔")?.cleanText, "#随笔");
});

test("pending-task parser removes rows without readable content", () => {
  for (const line of [
    "- [ ]",
    "- [ ]   ",
    "- [ ] \u200B",
    "- [ ] <span></span>",
    "- [ ] •",
    "- [ ] ☐",
    "- [ ] 📅 2026-08-25",
  ]) {
    assert.equal(parse(line), null, `expected no task for ${JSON.stringify(line)}`);
  }
});
