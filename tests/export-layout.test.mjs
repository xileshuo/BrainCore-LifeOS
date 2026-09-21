import test from "node:test";
import assert from "node:assert/strict";
import esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import os from "node:os";
import fs from "node:fs/promises";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outfile = path.join(os.tmpdir(), `braincore-export-layout-${process.pid}.mjs`);
await esbuild.build({ entryPoints: [path.join(root, "src/moments-memoria/export-layout.ts")], outfile, bundle: true, format: "esm", platform: "node" });
const layout = await import(pathToFileURL(outfile).href + `?v=${Date.now()}`);
const contractCss = await fs.readFile(path.join(root, "src/moments-memoria/share-contract.css"), "utf8");
const shareSource = await fs.readFile(path.join(root, "src/moments-memoria/share.ts"), "utf8");
test.after(async () => fs.rm(outfile, { force: true }));

test("adaptive stages follow the product contract exactly", () => {
  assert.deepEqual(layout.COPY_STAGE_ORDER, ["single-normal", "single-small", "columns-normal", "columns-small", "truncated"]);
});

test("source lines normalize CRLF and trim only outer blank lines", () => {
  assert.deepEqual(layout.sourceLines("\r\n  春风\r\n\r\n归来  \r\n"), [
    { text: "  春风", blank: false, prose: false }, { text: "", blank: true, prose: false }, { text: "归来", blank: false, prose: false },
  ]);
});

test("poetry source line is one indivisible unit", () => {
  const poem = "黄昏来了\n红的归红\n白的归白\n蓝的归蓝\n而你\n归了我";
  assert.deepEqual(layout.sourceLines(poem).map((line) => line.text), poem.split("\n"));
  assert.equal(layout.sourceLines(poem).some((line) => line.text === "黄昏来"), false);
});

test("a long unbroken paragraph is prose while short poetic lines stay atomic", () => {
  const paragraph = "虚妄是虚妄，理想主义是理想主义，如若你能明白这期间的区分，自是再好不过。人皆言三十而立，而我仍在路上。";
  assert.equal(layout.sourceLines(paragraph)[0].prose, true);
  assert.equal(layout.sourceLines("黄昏来了\n而你\n归了我").every((line) => !line.prose), true);
});

test("prose expands into balanced column units while poetry lines remain untouched", () => {
  const paragraph = "第一句说明来意并补充必要的背景信息。第二句继续展开并说明人物关系。第三句补足此前遗漏的生活细节。第四句完成整段文字的收束。";
  const prose = layout.columnCopyUnits(layout.sourceLines(paragraph));
  assert.equal(prose.length, 4);
  assert.equal(prose.map((line) => line.text).join(""), paragraph);
  const poem = layout.columnCopyUnits(layout.sourceLines("黄昏来了\n而你\n归了我"));
  assert.deepEqual(poem.map((line) => line.text), ["黄昏来了", "而你", "归了我"]);
});

test("two-column split preserves order and complete source lines", () => {
  const lines = layout.sourceLines("一\n二\n三\n四\n五");
  const [left, right] = layout.splitLinesAt(lines, 3);
  assert.deepEqual(left.map((line) => line.text), ["一", "二", "三"]);
  assert.deepEqual(right.map((line) => line.text), ["四", "五"]);
});

test("truncation never cuts a line and ellipsis owns the final line", () => {
  const result = layout.truncateWholeLines("完整的第一行\n完整的第二行\n完整的第三行", 2);
  assert.equal(result, "完整的第一行\n完整的第二行\n……");
  assert.equal(result.split("\n").at(-1), "……");
});

test("untruncated text is preserved by whole lines", () => {
  assert.equal(layout.truncateWholeLines("第一行\n第二行", 2), "第一行\n第二行");
});

test("density remains presentation metadata only", () => {
  assert.equal(layout.copyDensity("短句"), "short");
  assert.equal(layout.copyDensity("一\n二\n三\n四\n五"), "medium");
  assert.equal(layout.copyDensity("一\n二\n三\n四\n五\n六\n七\n八"), "long");
});

test("single-image share uses plain black or white watermark bars", () => {
  assert.match(contractCss, /\.memos-share-leica[\s\S]*background:#fff/);
  assert.match(contractCss, /backdrop-filter:none/);
  assert.match(contractCss, /\.memos-share-card\.share-style-paper \.memos-share-leica/);
  assert.match(contractCss, /background:#111/);
  assert.match(contractCss, /\.memos-share-style-list,[\s\S]*\.memos-share-actions[\s\S]*720px/);
});

test("share preview opens the laid-out card instead of waiting for a screenshot", async () => {
  const share = await fs.readFile(path.join(root, "src/moments-memoria/share.ts"), "utf8");
  const preview = share.slice(share.indexOf("private async previewImage"), share.indexOf("private updatePreviewStyle"));
  assert.match(preview, /openLightboxFromCard/);
  assert.doesNotMatch(preview, /createImageBlob/);
  assert.match(share, /t\("share\.previewImage"\)/);
});

test("share modal is compact and scrolls without a visible scrollbar", () => {
  assert.match(contractCss, /max-width:752px/);
  assert.match(contractCss, /memos-share-scroll/);
  assert.match(contractCss, /flex:0 1 auto/);
  assert.match(contractCss, /height:fit-content/);
  assert.match(contractCss, /overflow-y:auto/);
  assert.doesNotMatch(contractCss, /scrollbar-width:/);
  assert.match(contractCss, /memos-share-preview-wrap[\s\S]*padding:0/);
  assert.match(contractCss, /env\(safe-area-inset-top/);
  assert.match(contractCss, /memos-share-lightbox-frame/);
  assert.match(contractCss, /memos-share-lightbox-actions/);
  assert.match(shareSource, /availableWidth \/ SHARE_CARD_WIDTH/);
  assert.doesNotMatch(shareSource, /availableWidth \/ SHARE_CARD_WIDTH\) \* 0\.8/);
  assert.match(shareSource, /openLightboxFromCard/);
  assert.match(shareSource, /attachLightboxChrome\(layer, frame,/);
});

test("multi-share has an explicit selection budget, progress and cancellation", () => {
  assert.match(shareSource, /MULTI_SHARE_MAX_ITEMS\s*=\s*12/);
  assert.match(shareSource, /MULTI_SHARE_MAX_ESTIMATED_HEIGHT\s*=\s*12000/);
  assert.match(shareSource, /AbortController/);
  assert.match(shareSource, /memos-share-generation-progress/);
  assert.match(shareSource, /share\.budgetExceeded/);
});

test("copy failure requires an explicit retry or save choice", () => {
  const copyMethod = shareSource.slice(shareSource.indexOf("private async copyImage"), shareSource.indexOf("private async writeBlobToClipboard"));
  assert.match(copyMethod, /ShareCopyFailureModal/);
  assert.doesNotMatch(copyMethod, /downloadBlob\(blob\)(?!; else)/);
  assert.doesNotMatch(copyMethod, /saveImage\(\);\s*new Notice/);
});

test("multi-share dates are unframed and content stays in one flow", () => {
  assert.match(contractCss, /is-multi-share \.memos-share-entry-date[\s\S]*border:none[\s\S]*border-width:0[\s\S]*text-align:left/);
  assert.match(contractCss, /memos-share-entry-date::before[\s\S]*memos-share-entry-date::after[\s\S]*content:none/);
  assert.match(contractCss, /is-multi-share \.memos-share-card-content[\s\S]*columns:auto/);
  assert.match(contractCss, /share-style-paper \.memos-share-card-body[\s\S]*border-right:0/);
});

test("all share content uses one left axis instead of horizontal centering", () => {
  assert.match(contractCss, /--share-content-width:680px/);
  assert.match(contractCss, /--share-content-gutter:48px/);
  assert.match(contractCss, /place-items:\s*center start/);
  assert.match(contractCss, /is-text-only \.bc-fit-block[\s\S]*margin-left:0[\s\S]*margin-right:0/);
  assert.match(contractCss, /is-multi-share \.memos-share-entry[\s\S]*width:var\(--share-content-width\)[\s\S]*min-width:var\(--share-content-width\)/);
  assert.match(contractCss, /is-multi-share \.memos-share-card-content > \*[\s\S]*margin-left:0/);
});
