/**
 * BrainCore Moments 入口：导出 Memoria 同源逻辑（MIT），供 BrainCore 注入。
 * 不注册独立 Plugin，由 BrainCore 托管视图与设置。
 */
export { MemoStore } from "./store";
export { MemoriaView } from "./view";
export { StatsView } from "./stats";
export { YearPanoramaView } from "./year-panorama";
export { initLocale, t } from "./i18n";
export {
  DEFAULT_SETTINGS,
  VIEW_TYPE_MEMORIA as VIEW_TYPE_MOMENTS,
  VIEW_TYPE_MEMORIA_STATS as VIEW_TYPE_MOMENTS_STATS,
  VIEW_TYPE_MEMORIA_YEAR as VIEW_TYPE_MOMENTS_YEAR,
  PIN_TAG,
  STAR_TAG,
  ARCHIVE_TAG,
  DELETED_TAG,
} from "./types";
export type { Memo, MemoriaSettings } from "./types";
export { parseFile, renderMemo, extractTags } from "./parser";
