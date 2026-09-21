import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixturePath = path.join(root, "tests/visual/share-themes.html");
const alignmentFixturePath = path.join(root, "tests/visual/share-alignment.html");
const baselineDir = path.join(root, "tests/visual/baselines");
const fixture = await fs.readFile(fixturePath, "utf8");
const alignmentFixture = await fs.readFile(alignmentFixturePath, "utf8");

const expectedThemes = ["paper", "kraft", "mint", "peach", "sky", "lavender", "midnight", "charcoal"];
const expectedBaselines = [
  "share-themes-light-text.jpg",
  "share-themes-dark-text.jpg",
  "share-themes-light-image.jpg",
  "share-themes-dark-image.jpg",
  "share-themes-narrow.jpg",
  "share-alignment.jpg",
];

test("visual fixture covers all eight named share themes", () => {
  for (const theme of expectedThemes) assert.match(fixture, new RegExp(`\\['${theme}'`));
  assert.match(fixture, /data-content="text"/);
  assert.match(fixture, /visual-photo/);
  assert.match(fixture, /@media\(max-width:680px\)/);
});

test("alignment fixture measures the common 110px content axis", () => {
  assert.match(alignmentFixture, /900px 画布 \/ 110px 起点/);
  assert.match(alignmentFixture, /Math\.abs\(value-110\)<=1/);
  assert.match(alignmentFixture, /share-style-kraft is-multi-share/);
});

test("share CSS and picker keep preview/copy split plus settle timeouts", async () => {
  const share = await fs.readFile(path.join(root, "src/moments-memoria/share.ts"), "utf8");
  const css = await fs.readFile(path.join(root, "src/moments-memoria/share-contract.css"), "utf8");
  assert.match(css, /cursor:\s*zoom-in/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /memos-multi-share-picker-search/);
  assert.match(share, /waitForShareImage/);
  assert.match(share, /timeoutMs/);
  assert.match(share, /void this\.previewImage\(\)/);
});

test("share theme visual baselines are committed and valid JPEG files", async () => {
  for (const fileName of expectedBaselines) {
    const bytes = await fs.readFile(path.join(baselineDir, fileName));
    assert.ok(bytes.length > 20_000, `${fileName} is unexpectedly small`);
    assert.deepEqual(Array.from(bytes.subarray(0, 3)), [255, 216, 255]);
  }
});
