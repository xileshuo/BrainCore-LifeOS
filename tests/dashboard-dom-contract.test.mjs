import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = await fs.readFile(path.join(root, "main.source.js"), "utf8");
const bridge = await fs.readFile(path.join(root, "src/braincore-global-bridge.js"), "utf8");
const start = source.indexOf("    async renderDashboard(");
const end = source.indexOf("class BrainCoreIOSQuickModal", start);
const dashboard = source.slice(start, end);

test("Dashboard renders data through DOM APIs without inline event handlers", () => {
  assert.ok(start >= 0 && end > start);
  assert.doesNotMatch(dashboard, /\.innerHTML\s*=/);
  assert.doesNotMatch(dashboard, /insertAdjacentHTML/);
  assert.doesNotMatch(dashboard, /\.onclick\s*=/);
  assert.doesNotMatch(dashboard, /on(?:click|change|keydown)\s*=/i);
  assert.match(dashboard, /addEventListener\("click"/);
});

test("Dashboard caches structured quote and weather data", () => {
  assert.match(dashboard, /quote:\s*\{\s*t:/);
  assert.match(dashboard, /weatherTextOf/);
  assert.doesNotMatch(dashboard, /weatherEl\.innerHTML/);
});

test("Dashboard quick actions reset native button geometry in narrow sidebars", () => {
  assert.ok(source.includes(".sb-btn{-webkit-appearance:none!important;appearance:none!important"));
  assert.ok(source.includes("min-height:0!important;padding:0!important;border:0!important"));
  assert.ok(source.includes("background:transparent!important;box-shadow:none!important"));
  assert.ok(source.includes(".sb-btn-wrapper{grid-template-columns:repeat(4,minmax(0,1fr))!important"));
  assert.ok(source.includes(".sb-btn-name{display:block!important;position:static!important"));
  assert.ok(source.includes("white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important"));
});

test("Dashboard quick actions keep their original visible icon shapes", () => {
  assert.match(dashboard, /quickActionIconIds\s*=\s*\{\s*zap:\s*"zap",\s*doc:\s*"file-text",\s*moments:\s*"sparkles",\s*archive:\s*"archive"\s*\}/);
  assert.match(dashboard, /setIcon\(iconHost,\s*quickActionIconIds\[item\.i\]\)/);
  assert.doesNotMatch(dashboard, /parseFromString\(ICONS\[item\.i\],\s*"image\/svg\+xml"\)/);
});

test("Dashboard task pipeline suppresses empty and placeholder-only rows", () => {
  assert.match(source, /function getPendingTaskDisplayText\(/);
  assert.match(source, /if \(!cleanText\) return null;/);
  assert.match(source, /filter\(hasRenderablePendingTaskContent\)/);
  assert.ok(source.includes(".custom-list-item:has(>a.internal-link:empty)"));
});

test("only the versioned BrainCore API is published globally", () => {
  assert.match(bridge, /"BrainCoreAPI"/);
  assert.doesNotMatch(bridge, /statAction|toggleWkTask|BrainCoreTodayDeltaFiles/);
});
