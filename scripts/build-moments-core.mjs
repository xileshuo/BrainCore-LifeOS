/**
 * Bundle Moments core (Memoria-adapted TS) → src/moments-core.bundle.js
 */
import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const entry = path.join(root, "src/moments-memoria/braincore-entry.ts");
const outFile = path.join(root, "src/moments-core.bundle.js");

const result = await esbuild.build({
  entryPoints: [entry],
  bundle: true,
  write: false,
  format: "cjs",
  platform: "browser",
  target: ["es2020"],
  external: ["obsidian"],
  logLevel: "warning",
});

const code = result.outputFiles[0].text;
// Isolate CJS module.exports so we don't overwrite BrainCore's plugin export
const wrapped = `/* BrainCore Moments core — Memoria (MIT) + Memos View archive/trash/sort/share */
var BCMomentsCore = (function () {
var module = { exports: {} };
var exports = module.exports;
${code}
var __exp = module.exports;
return {
  VIEW_TYPE_MOMENTS: __exp.VIEW_TYPE_MOMENTS,
  VIEW_TYPE_MOMENTS_STATS: __exp.VIEW_TYPE_MOMENTS_STATS,
  VIEW_TYPE_MOMENTS_YEAR: __exp.VIEW_TYPE_MOMENTS_YEAR,
  DEFAULT_SETTINGS: __exp.DEFAULT_SETTINGS,
  MemoStore: __exp.MemoStore,
  MomentsView: __exp.MemoriaView,
  MomentsStatsView: __exp.StatsView,
  MomentsYearView: __exp.YearPanoramaView,
  initLocale: __exp.initLocale,
  PIN_TAG: __exp.PIN_TAG,
  STAR_TAG: __exp.STAR_TAG,
  ARCHIVE_TAG: __exp.ARCHIVE_TAG,
  DELETED_TAG: __exp.DELETED_TAG,
};
})();
`;

fs.writeFileSync(outFile, wrapped);
console.log("Wrote", outFile, (wrapped.length / 1024).toFixed(1), "KB");
