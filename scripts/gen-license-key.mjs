#!/usr/bin/env node
/**
 * 作者用：根据指纹 BC-xxx / Obsidian appId / 库名生成 BrainCore LifeOS 激活码
 * 算法与 main.source.js 内的判定同源（PlainLedger / 纪念日 用同一套 xor 0x8899 兼容码）
 *
 * 用法：
 *   node scripts/gen-license-key.mjs BC-432239E
 *   node scripts/gen-license-key.mjs --app-id 1f2e3d4c5b6a7988
 *   node scripts/gen-license-key.mjs --vault "大鹏一日同风起"
 */

function hashStringToHex(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase();
}

function fnv1a32Hex(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

function fingerprintFrom(value) {
  return "BC-" + hashStringToHex(String(value));
}

function legacyKeyFromFingerprint(fp) {
  let hash = 0;
  for (let i = 0; i < fp.length; i++) {
    hash = (hash << 5) - hash + fp.charCodeAt(i);
    hash |= 0;
  }
  return "KEY-" + Math.abs(hash ^ 0x8899).toString(16).toUpperCase();
}

function strongKeyFromFingerprint(fp) {
  const a = fnv1a32Hex(`${fp}|BC1`);
  const b = fnv1a32Hex(`${fp.split("").reverse().join("")}|LIFEOS`);
  return `BC1-${a}-${b}`;
}

const args = process.argv.slice(2);
if (!args.length || args.includes("-h") || args.includes("--help")) {
  console.log(`用法:
  node scripts/gen-license-key.mjs <指纹 BC-xxx>
  node scripts/gen-license-key.mjs --app-id <Obsidian appId>
  node scripts/gen-license-key.mjs --vault "库名"

示例:
  node scripts/gen-license-key.mjs BC-432239E
  node scripts/gen-license-key.mjs --vault "大鹏一日同风起"

说明:
  用户在「设置 → 授权」页复制的就是 BC- 开头的设备指纹，直接传它最准。
  --vault 仅用于没有指纹时的兜底推算，库名须与用户左侧显示完全一致。`);
  process.exit(args.length ? 0 : 1);
}

let fp;
if (args[0] === "--app-id" || args[0] === "--vault") {
  const input = args.slice(1).join(" ").trim();
  if (!input) {
    console.error("缺少参数值。");
    process.exit(1);
  }
  fp = fingerprintFrom(input);
} else {
  const input = args.join(" ").trim();
  fp = input.toUpperCase().startsWith("BC-") ? input.toUpperCase() : fingerprintFrom(input);
}

console.log("指纹：      ", fp);
console.log("激活码：    ", strongKeyFromFingerprint(fp));
console.log("兼容激活码：", legacyKeyFromFingerprint(fp));
console.log("\n（两种都能激活；BC1 为当前主格式，KEY 为兼容旧版的短码）");
