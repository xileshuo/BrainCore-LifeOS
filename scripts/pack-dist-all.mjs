#!/usr/bin/env node
/**
 * Pack BrainCore LifeOS into dist/v{version}/ (personal / commercial / publicFree / trial24h)
 * 个人版使用独立 id：braincore-lifeos-personal，避免社区市场更新覆盖。
 */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const VERSION = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8")).version;
const DIST = path.join(ROOT, "dist", `v${VERSION}`);
const PUBLIC_ID = "braincore-lifeos";
const PERSONAL_ID = "braincore-lifeos-personal";

function getBuildStamp() {
  try {
    return execSync("git rev-parse --short HEAD", { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

function patchMain(edition) {
  execSync("node scripts/build-moments-core.mjs && node scripts/build.mjs", { cwd: ROOT, stdio: "inherit" });
  let code = fs.readFileSync(path.join(ROOT, "main.js"), "utf8");
  const profiles = {
    personal: { profile: "personal", trial: 0, license: false, edition: "personal", suffix: "个人版" },
    commercial: { profile: "commercial", trial: 0, license: true, edition: "public", suffix: "公版（商）" },
    publicFree: { profile: "commercial", trial: 0, license: false, edition: "public", suffix: "公版（免激活）" },
    trial24h: { profile: "commercial", trial: 48, license: true, edition: "public", suffix: "48小时体验版" },
  };
  const cfg = profiles[edition];
  code = code.replace(/const PLUGIN_WEEKLY_PROFILE = "[^"]+";/, `const PLUGIN_WEEKLY_PROFILE = "${cfg.profile}";`);
  code = code.replace(/const PLUGIN_TRIAL_HOURS = \d+;/, `const PLUGIN_TRIAL_HOURS = ${cfg.trial};`);
  code = code.replace(/const PLUGIN_LICENSE_REQUIRED = (true|false);/, `const PLUGIN_LICENSE_REQUIRED = ${cfg.license};`);
  code = code.replace(/const PLUGIN_EDITION = "[^"]+";/, `const PLUGIN_EDITION = "${cfg.edition}";`);
  return { code, suffix: cfg.suffix };
}

function buildManifest(edition) {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
  if (edition === "personal") {
    manifest.id = PERSONAL_ID;
    manifest.name = "BrainCore LifeOS（个人）";
  } else {
    manifest.id = PUBLIC_ID;
    manifest.name = "BrainCore LifeOS";
  }
  return manifest;
}

fs.rmSync(DIST, { recursive: true, force: true });

for (const edition of ["personal", "commercial", "publicFree", "trial24h"]) {
  const { code, suffix } = patchMain(edition);
  const dest = path.join(DIST, suffix);
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, "main.js"), code);
  const manifest = buildManifest(edition);
  fs.writeFileSync(path.join(dest, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  if (fs.existsSync(path.join(ROOT, "styles.css"))) {
    fs.copyFileSync(path.join(ROOT, "styles.css"), path.join(dest, "styles.css"));
  }
  const installId = edition === "personal" ? PERSONAL_ID : PUBLIC_ID;
  fs.writeFileSync(
    path.join(dest, "安装说明.txt"),
    `BrainCore LifeOS v${VERSION} · ${suffix}\n${getBuildStamp() ? `构建：${getBuildStamp()}\n` : ""}\n安装：复制到 你的库/.obsidian/plugins/${installId}/\n须同时包含 main.js、manifest.json\n${edition === "personal" ? "注意：个人版 id 独立，不会被社区市场更新覆盖。\n" : ""}Moments：BrainCore 自研，数据在 读&写/Moments/YYYY.md\n`,
    "utf8"
  );
  if (fs.existsSync(path.join(ROOT, "README.md"))) {
    fs.copyFileSync(path.join(ROOT, "README.md"), path.join(dest, "README.md"));
  }
  if (fs.existsSync(path.join(ROOT, "THIRD-PARTY-NOTICES.md"))) {
    fs.copyFileSync(path.join(ROOT, "THIRD-PARTY-NOTICES.md"), path.join(dest, "THIRD-PARTY-NOTICES.md"));
  }
  console.log("✅", dest, `id=${manifest.id}`);
}

console.log(`\nBrainCore dist/v${VERSION}/ 完成。`);
