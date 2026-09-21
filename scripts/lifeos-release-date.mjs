/** LifeOS 统一发布日期：出包时写入 main.js，格式 YYYY.MM.DD */
export function getLifeOsReleaseDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export function patchLifeOsReleaseInCode(code, date = getLifeOsReleaseDate()) {
  return code.replace(/LIFEOS_RELEASE\s*=\s*"[^"]+"/g, `LIFEOS_RELEASE = "${date}"`);
}
