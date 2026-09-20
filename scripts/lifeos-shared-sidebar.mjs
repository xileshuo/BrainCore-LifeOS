import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function readLifeOsSidebarInsetCss() {
  return fs.readFileSync(path.join(__dirname, "lifeos-shared-sidebar.css"), "utf8").trim();
}

export function injectLifeOsSidebarInsetIntoShared(code) {
  const css = readLifeOsSidebarInsetCss();
  const marker = "/* __LIFEOS_SIDEBAR_INSET_CSS__ */";
  if (!code.includes(marker)) {
    throw new Error(`lifeos-ui-shared missing placeholder ${marker}`);
  }
  return code.replace(marker, css);
}
