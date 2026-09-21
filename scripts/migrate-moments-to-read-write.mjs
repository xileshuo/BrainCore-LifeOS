#!/usr/bin/env node
/* One-off, conservative migration for the user's vault. It leaves a recoverable
 * backup under 归档/ before removing legacy duplicate folders. */
import fs from "node:fs/promises";
import path from "node:path";

const vault = process.argv[2];
if (!vault) throw new Error("Usage: node scripts/migrate-moments-to-read-write.mjs <vault-path>");
const canonical = path.join(vault, "读&写", "Moments");
const legacyRoots = [path.join(vault, "Moments"), path.join(vault, "Memoria"), path.join(vault, "读&写", "碎碎念_已迁入Moments")];
const backup = path.join(vault, "归档", "Moments迁移备份-2026-08-17");
const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const exists = async p => fs.stat(p).then(() => true).catch(() => false);
const compact = s => String(s).replace(/^---[\s\S]*?\n---\s*/," ").replace(/创建日期[:：].*|标签[:：].*/g, "").replace(/#[^\s#]+/g, "").replace(/\s+/g, " ").trim();
const keyOf = (date, time, body) => `${date}|${time}|${compact(body).slice(0, 360)}`;
const records = new Map();

function add(date, time, body) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !body.trim()) return;
  const key = keyOf(date, time, body);
  if (!records.has(key)) records.set(key, { date, time: /^\d{2}:\d{2}$/.test(time) ? time : "12:00", body: body.trimEnd() });
}
function parseYearly(raw) {
  for (const block of String(raw).split(/^##\s+(\d{4}-\d{2}-\d{2}).*$/m).slice(1)) {
    // split() alternates date/body; handled by the indexed parser below.
  }
  const days = [...String(raw).matchAll(/^##\s+(\d{4}-\d{2}-\d{2})[^\n]*\n([\s\S]*?)(?=^##\s+\d{4}-\d{2}-\d{2}|\s*$)/gm)];
  for (const day of days) {
    for (const entry of day[2].split(/^\-\s+(\d{2}:\d{2})\s*\n/m).slice(1)) {}
    const entries = [...day[2].matchAll(/^\-\s+(\d{2}:\d{2})\s*\n([\s\S]*?)(?=^\-\s+\d{2}:\d{2}\s*$|\s*$)/gm)];
    for (const entry of entries) add(day[1], entry[1], entry[2].replace(/^  /gm, "").trim());
  }
}
function parseSingle(raw, fallback) {
  const front = String(raw).match(/^---\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  const meta = front?.[1] || "";
  let body = front ? front[2] : String(raw);
  const date = (meta.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})/m) || body.match(/创建日期[:：]\s*(\d{4})年(\d{1,2})月(\d{1,2})日/)) || [];
  const time = (meta.match(/^date:\s*["']?\d{4}-\d{2}-\d{2}T(\d{2}:\d{2})/m) || body.match(/创建日期[:：].*?(\d{1,2}:\d{2})/)) || [];
  const title = (meta.match(/^title:\s*["']?(.*?)["']?\s*$/m) || [])[1];
  const tags = (meta.match(/^tags:\s*\[(.*?)\]/m) || [])[1];
  if (date.length === 4) date[1] = `${date[1]}-${String(date[2]).padStart(2,"0")}-${String(date[3]).padStart(2,"0")}`;
  body = body.replace(/^创建日期[:：].*$/gm, "").replace(/^标签[:：].*$/gm, "").trim();
  if (title && !body.startsWith(title)) body = `${title}\n${body}`.trim();
  if (tags) body = `${body}\n${tags.split(",").map(t => "#" + t.trim().replace(/["']/g, "").replace(/^#/, "")).join(" ")}`.trim();
  add(date[1] || fallback.toISOString().slice(0,10), time[1] || fallback.toTimeString().slice(0,5), body);
}

async function collect(root) {
  if (!(await exists(root))) return;
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) { if (entry.name !== "attachments") await collect(file); continue; }
    if (!entry.name.endsWith(".md") || entry.name === "_trash.md") continue;
    const raw = await fs.readFile(file, "utf8");
    if (/^\d{4}\.md$/.test(entry.name)) parseYearly(raw);
    else parseSingle(raw, (await fs.stat(file)).birthtime);
  }
}

await fs.mkdir(backup, { recursive: true });
for (const source of [canonical, ...legacyRoots]) {
  if (await exists(source)) await fs.cp(source, path.join(backup, path.basename(source)), { recursive: true, force: true });
}
await Promise.all([canonical, ...legacyRoots].map(collect));
if (!records.size) throw new Error("No Moments records found; nothing changed.");

await fs.mkdir(canonical, { recursive: true });
const byYear = new Map();
for (const record of records.values()) {
  const year = record.date.slice(0,4); if (!byYear.has(year)) byYear.set(year, []); byYear.get(year).push(record);
}
for (const [year, items] of byYear) {
  items.sort((a,b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  let out = `# ${year}\n`;
  let current = "";
  for (const item of items) {
    if (item.date !== current) { current = item.date; out += `\n## ${current} ${weekday[new Date(`${current}T12:00:00`).getDay()]}\n`; }
    out += `\n- ${item.time}\n${item.body.split("\n").map(line => `  ${line}`).join("\n")}\n`;
  }
  await fs.writeFile(path.join(canonical, `${year}.md`), out);
}
await fs.mkdir(path.join(canonical, "attachments"), { recursive: true });
for (const root of legacyRoots) {
  const att = path.join(root, "attachments");
  if (await exists(att)) await fs.cp(att, path.join(canonical, "attachments"), { recursive: true, force: false, errorOnExist: false });
}
for (const root of legacyRoots) if (await exists(root)) await fs.rm(root, { recursive: true, force: true });
const ownFiles = await fs.readdir(canonical, { withFileTypes: true });
for (const file of ownFiles) if (file.isFile() && file.name.endsWith(".md") && !/^\d{4}\.md$/.test(file.name) && file.name !== "_trash.md") await fs.rm(path.join(canonical, file.name));
console.log(JSON.stringify({ canonical: "读&写/Moments", records: records.size, years: [...byYear.keys()].sort(), backup: path.relative(vault, backup) }, null, 2));
