// ─── BrainCore settings tab layout (align with 纪念日 / BrainCore) ─────────

const BC_SETTINGS_STYLE_ID = "bc-settings-compact-styles-v13";
const BC_MOBILE_TOP_INSET_PX = 41;
const BC_MOBILE_TOP_SPACER_CLASS = "bc-mobile-top-spacer";

function getBcEditionLabel() {
  if (typeof getEditionDisplayName === "function") {
    const n = getEditionDisplayName();
    if (n) return n;
  }
  if (typeof isTrialEdition === "function" && isTrialEdition()) return "体验版";
  if (typeof PLUGIN_WEEKLY_PROFILE === "string" && PLUGIN_WEEKLY_PROFILE === "commercial") return "公版";
  if (typeof PLUGIN_EDITION === "string" && PLUGIN_EDITION === "public") return "公版";
  return "个人版";
}

function resolveBcSettingsTabFromFocus(focusOpts) {
  if (!focusOpts?.section) return null;
  const map = {
    categories: "categories",
    appearance: "appearance",
    pendingDues: "rules",
    subscription: "rules",
    recurring: "rules",
    globalKeywords: "rules",
  };
  return map[focusOpts.section] || "common";
}

function injectBcSettingsCompactStyles() {
  ["bc-settings-compact-styles-v8", "bc-settings-compact-styles-v9", "bc-settings-compact-styles-v10", "bc-settings-compact-styles-v11", "bc-settings-compact-styles-v12"].forEach((id) => {
    document.getElementById(id)?.remove();
  });
  registerLifeOsStyle(BC_SETTINGS_STYLE_ID, `
.bc-settings-compact h2.bc-settings-page-title {
  margin: 0 0 14px !important;
  padding: 0 !important;
  text-align: left !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  line-height: 1.35 !important;
}
.bc-settings-mobile .bc-settings-page-title { display: none !important; }
.bc-settings-intro {
  margin: 0 0 12px !important;
  padding: 0 !important;
  font-size: 12px !important;
  line-height: 1.55 !important;
  color: var(--text-muted) !important;
  opacity: 1 !important;
  text-indent: 2em !important;
}
.bc-settings-compact .bc-settings-block h3 {
  margin: 0 0 4px !important;
  padding: 0 !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  line-height: 1.35 !important;
  color: var(--text-normal) !important;
}
.bc-settings-compact .bc-settings-block > h4 {
  margin: 0 0 8px !important;
  padding: 12px 0 0 !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  line-height: 1.3 !important;
  letter-spacing: 0.04em !important;
  color: var(--text-muted) !important;
  opacity: 1 !important;
  border-top: 1px solid var(--background-modifier-border) !important;
}
.bc-settings-compact .bc-settings-block > p.setting-item-description + h4,
.bc-settings-compact .bc-settings-block > h3 + h4 {
  margin-top: 6px !important;
  padding-top: 0 !important;
  border-top: none !important;
}
.bc-settings-compact .bc-settings-tab-bar {
  display: flex !important;
  flex-wrap: nowrap !important;
  gap: 6px !important;
  width: 100% !important;
  margin: 0 0 14px !important;
  padding: 0 !important;
  box-sizing: border-box !important;
  justify-content: stretch !important;
}
.bc-settings-compact .bc-settings-tab-bar.is-many-tabs {
  flex-wrap: wrap !important;
}
.bc-settings-compact .bc-settings-tab-bar button {
  flex: 1 1 0 !important;
  min-width: 0 !important;
  width: auto !important;
  text-align: center !important;
  padding: 8px 6px !important;
  border-radius: 8px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  box-sizing: border-box !important;
  white-space: nowrap !important;
  color: var(--text-normal) !important;
  background: var(--background-secondary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  box-shadow: none !important;
}
.bc-settings-compact .bc-settings-tab-bar button:not(.mod-cta) {
  background: var(--background-secondary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  color: var(--text-normal) !important;
}
.bc-settings-compact .bc-settings-tab-bar button.mod-cta {
  font-weight: 700 !important;
  background: color-mix(in srgb, var(--lifeos-accent, #b48246) 36%, var(--background-primary)) !important;
  border: 1px solid transparent !important;
  color: #6b4f3a !important;
}
.theme-dark .bc-settings-compact .bc-settings-tab-bar button.mod-cta {
  background: color-mix(in srgb, var(--lifeos-accent, #d4a574) 42%, var(--background-primary)) !important;
  color: #f4e6d8 !important;
}
.bc-settings-compact .bc-settings-tab-bar.is-many-tabs button {
  font-size: 12px !important;
  padding: 8px 3px !important;
}
.bc-settings-compact button:active:not(:disabled),
.bc-settings-compact .clickable-icon:active {
  transform: scale(0.97);
  transition: transform 80ms ease;
}
@media (prefers-reduced-motion: reduce) {
  .bc-settings-compact button:active:not(:disabled),
  .bc-settings-compact .clickable-icon:active {
    transform: none;
    transition: none;
  }
}
.bc-settings-compact .bc-settings-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 0;
  padding-bottom: 20px;
}
.bc-settings-compact .bc-settings-block {
  margin: 0;
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid var(--background-modifier-border);
  box-sizing: border-box;
  overflow: visible;
}
.bc-settings-compact .bc-settings-block > p.setting-item-description {
  margin: 0 0 10px !important;
  padding: 0 !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  color: var(--text-muted) !important;
  opacity: 1 !important;
}
.bc-settings-compact .bc-diagnostics-summary {
  margin:10px 0;padding:10px 12px;border-radius:10px;
  background:var(--background-secondary);color:var(--text-muted);font-size:12px;
}
.bc-settings-compact .bc-diagnostics-results { display:grid;gap:1px;border-radius:10px;overflow:hidden;background:var(--background-modifier-border); }
.bc-settings-compact .bc-diagnostics-row { display:grid;grid-template-columns:minmax(110px,.34fr) minmax(0,1fr);gap:12px;padding:9px 12px;background:var(--background-primary);font-size:12px; }
.bc-settings-compact .bc-diagnostics-label { color:var(--text-muted); }
.bc-settings-compact .bc-diagnostics-value { min-width:0;overflow-wrap:anywhere;color:var(--text-normal); }
.bc-settings-compact .bc-diagnostics-row.is-ok .bc-diagnostics-value { color:var(--color-green); }
.bc-settings-compact .bc-diagnostics-row.is-warn .bc-diagnostics-value { color:var(--color-orange); }
.bc-settings-compact .bc-diagnostics-row.is-error .bc-diagnostics-value { color:var(--color-red); }
.bc-settings-compact .bc-diagnostics-actions { display:flex;justify-content:flex-end;margin-top:12px; }
.bc-settings-compact .bc-diagnostics-orphans { display:grid;gap:5px;margin-top:12px; }
.bc-settings-compact .bc-diagnostics-orphans code { display:block;padding:6px 8px;border-radius:6px;overflow-wrap:anywhere;background:var(--background-secondary);font-size:11px; }
.bc-settings-compact .bc-diagnostics-orphan-row { display:flex;align-items:center;gap:8px; }
.bc-settings-compact .bc-diagnostics-orphan-row code { flex:1;min-width:0; }
.bc-settings-compact .bc-diagnostics-orphan-row button { flex-shrink:0;font-size:11px;padding:4px 8px;height:auto; }
.bc-settings-compact .bc-storage-table { display:grid;gap:1px;border-radius:10px;overflow:hidden;background:var(--background-modifier-border);margin:0 0 12px; }
.bc-settings-compact .bc-storage-row { display:grid;grid-template-columns:minmax(84px,.9fr) minmax(0,1.5fr) minmax(64px,.7fr) minmax(0,1.2fr);gap:10px;padding:9px 12px;background:var(--background-primary);font-size:12px;line-height:1.5; }
.bc-settings-compact .bc-storage-row.is-head { background:var(--background-secondary);color:var(--text-muted);font-weight:600; }
.bc-settings-compact .bc-storage-row span { min-width:0;overflow-wrap:anywhere; }
@media (max-width: 620px) {
  .bc-settings-compact .bc-storage-row { grid-template-columns:1fr; gap:2px; }
  .bc-settings-compact .bc-storage-row.is-head { display:none; }
  .bc-settings-compact .bc-storage-row span:first-child { font-weight:600;color:var(--text-normal); }
  .bc-settings-compact .bc-storage-row span:not(:first-child) { color:var(--text-muted); }
}
.bc-settings-compact .bc-settings-section-hint {
  display: block !important;
  margin: 0 0 8px !important;
  padding: 0 !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  color: var(--text-muted) !important;
  opacity: 1 !important;
  white-space: pre-wrap;
  word-break: break-word;
  text-indent: 2em !important;
}
.bc-settings-compact .bc-settings-locked-hint {
  margin: -6px 0 12px !important;
  padding: 0 !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  color: var(--text-muted) !important;
  text-indent: 2em !important;
}
.bc-settings-compact .bc-settings-status-line {
  margin: 8px 0 0 !important;
  padding: 0 !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  color: var(--lifeos-accent) !important;
}
.bc-settings-compact .bc-license-fp-row {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
  margin: 6px 0 8px;
}
.bc-settings-compact .bc-license-fp-input {
  flex: 1;
  min-width: 160px;
  font-family: monospace;
  font-size: 11px;
  padding: 5px 8px;
  border-radius: 6px;
  background: var(--background-secondary);
  border: 1px solid var(--background-modifier-border);
  color: var(--text-normal);
}
.bc-settings-compact .bc-settings-inline-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.bc-settings-compact .bc-settings-inline-actions button {
  padding: 5px 14px;
}
.bc-settings-compact .bc-settings-foot {
  margin: 4px 0 0;
  padding: 0 0 8px;
}
.bc-settings-compact .bc-settings-foot p {
  margin: 0 0 4px !important;
  font-size: 12px !important;
  line-height: 1.45 !important;
  color: var(--text-muted) !important;
}
.bc-settings-compact .bc-settings-danger-block .setting-item-name {
  color: var(--text-error) !important;
}
.bc-settings-compact .setting-item {
  display: flex !important;
  flex-direction: row !important;
  flex-wrap: nowrap !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 12px !important;
  padding: 9px 0 !important;
  margin: 0 !important;
  width: 100%;
  box-sizing: border-box;
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  border-bottom: 1px solid var(--background-modifier-border) !important;
}
.bc-settings-compact .bc-settings-block .setting-item:last-child {
  border-bottom: none !important;
}
.bc-settings-compact .setting-item-info {
  flex: 0 0 88px !important;
  width: 88px !important;
  min-width: 88px !important;
  max-width: 88px !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  align-self: center !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  overflow: visible !important;
}
.bc-settings-compact .setting-item-name {
  font-size: 14px !important;
  font-weight: 500 !important;
  line-height: 1.3 !important;
  padding: 0 !important;
  white-space: nowrap !important;
  overflow: visible !important;
  text-overflow: clip !important;
  color: var(--text-normal) !important;
}
.bc-settings-compact .setting-item .setting-item-description {
  display: none !important;
}
.bc-settings-compact .bc-settings-rich-block .setting-item .setting-item-description {
  display: block !important;
  font-size: 11px !important;
  margin-top: 2px !important;
  color: var(--text-muted) !important;
  overflow-wrap: anywhere !important;
  white-space: normal !important;
}
.bc-settings-compact .bc-settings-rich-block .setting-item-info {
  flex: 1 1 auto !important;
  width: auto !important;
  min-width: 0 !important;
  max-width: none !important;
  padding-right: 12px !important;
  align-self: flex-start !important;
}
.bc-settings-compact .bc-settings-rich-block .setting-item {
  align-items: flex-start !important;
}
.bc-settings-compact .bc-settings-rich-block .setting-item-control {
  flex: 0 0 auto !important;
  width: auto !important;
  min-width: 168px !important;
  max-width: 46% !important;
  justify-content: flex-end !important;
  align-self: flex-start !important;
  padding-top: 2px !important;
}
.bc-settings-compact .bc-settings-rich-block .setting-item-control select,
.bc-settings-compact .bc-settings-rich-block .setting-item-control .dropdown {
  max-width: 100% !important;
}
.bc-settings-compact .setting-item-control {
  flex: 1 1 auto !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-end !important;
  gap: 8px !important;
  margin: 0 !important;
  padding: 0 !important;
  width: auto !important;
  min-width: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  align-self: center !important;
}
.bc-settings-compact .setting-item-control input[type="text"],
.bc-settings-compact .setting-item-control input[type="number"] {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  min-height: 34px !important;
  padding: 7px 10px !important;
  box-sizing: border-box !important;
  background: var(--background-secondary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 8px !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
  font-size: 14px !important;
}
.bc-settings-compact .setting-item-control .checkbox-container {
  flex-shrink: 0 !important;
  margin: 0 !important;
}
.bc-settings-compact .setting-item-control textarea,
.bc-settings-compact .bc-settings-textarea-row .setting-item-control textarea {
  flex: 1 1 auto !important;
  width: 100% !important;
  min-width: 0 !important;
  min-height: 72px !important;
  padding: 8px 10px !important;
  box-sizing: border-box !important;
  background: var(--background-secondary) !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 8px !important;
  box-shadow: none !important;
  color: var(--text-normal) !important;
  font-size: 14px !important;
  line-height: 1.45 !important;
  resize: vertical !important;
}
.bc-settings-compact .bc-settings-textarea-row,
.bc-settings-compact .setting-item:has(textarea) {
  align-items: center !important;
}
.bc-settings-compact .bc-settings-textarea-row .setting-item-info,
.bc-settings-compact .setting-item:has(textarea) .setting-item-info,
.bc-settings-compact .bc-settings-textarea-row .setting-item-control,
.bc-settings-compact .setting-item:has(textarea) .setting-item-control {
  align-self: center !important;
}
.bc-settings-compact .bc-settings-action-only {
  justify-content: flex-end !important;
  gap: 0 !important;
  padding-top: 4px !important;
  padding-bottom: 10px !important;
}
.bc-settings-compact .bc-settings-action-only .setting-item-info {
  display: none !important;
}
.bc-settings-compact .bc-settings-action-only .setting-item-control {
  flex: 1 1 auto !important;
  width: 100% !important;
  justify-content: flex-end !important;
}
.bc-settings-compact .bc-settings-action-only button {
  min-height: 34px !important;
  padding: 7px 14px !important;
  border-radius: 8px !important;
}
.bc-settings-mobile {
  padding-top: 0 !important;
  padding-inline: max(12px, env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px)) !important;
  padding-bottom: max(16px, env(safe-area-inset-bottom, 0px)) !important;
  box-sizing: border-box !important;
}
.${BC_MOBILE_TOP_SPACER_CLASS} {
  display: block;
  flex-shrink: 0;
  width: 100%;
  height: ${BC_MOBILE_TOP_INSET_PX}px;
  min-height: ${BC_MOBILE_TOP_INSET_PX}px;
  pointer-events: none;
}
.bc-settings-mobile .${BC_MOBILE_TOP_SPACER_CLASS} {
  margin-bottom: 0;
}
.is-mobile .vertical-tab-content.bc-settings-mobile-host,
.is-mobile .vertical-tab-content-container.bc-settings-mobile-host {
  padding-top: env(safe-area-inset-top, 0px) !important;
  box-sizing: border-box !important;
}
.bc-settings-mobile .bc-settings-tab-bar {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 6px !important;
  width: 100% !important;
  margin-top: 8px !important;
  margin-bottom: 14px !important;
  justify-content: stretch !important;
  overflow: visible !important;
}
.bc-settings-mobile .bc-settings-tab-bar button {
  flex: 1 1 calc(33.333% - 6px) !important;
  min-width: 72px !important;
  min-height: 44px !important;
  width: auto !important;
  text-align: center !important;
  padding: 8px 4px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  white-space: nowrap !important;
}
.bc-settings-mobile .bc-settings-tab-bar button.mod-cta {
  font-weight: 700 !important;
  background: color-mix(in srgb, var(--lifeos-accent, #b48246) 36%, var(--background-primary)) !important;
  border: 1px solid transparent !important;
  color: #6b4f3a !important;
}
.theme-dark .bc-settings-mobile .bc-settings-tab-bar button.mod-cta {
  background: color-mix(in srgb, var(--lifeos-accent, #d4a574) 42%, var(--background-primary)) !important;
  color: #f4e6d8 !important;
}
.bc-settings-mobile .bc-settings-tab-bar.is-many-tabs button {
  flex: 1 1 calc(33.333% - 6px) !important;
  font-size: 12px !important;
  padding: 8px 4px !important;
}
.bc-settings-compact .bc-settings-block-collapsible {
  padding: 0 !important;
  overflow: hidden;
}
.bc-settings-compact .bc-settings-block-collapsible .bc-settings-block-head {
  padding: 14px 16px 12px;
  cursor: pointer;
  user-select: none;
}
.bc-settings-compact .bc-settings-block-collapsible .bc-settings-block-head:hover {
  background: var(--background-modifier-hover);
}
.bc-settings-compact .bc-settings-block-collapsible .bc-settings-block-head h3 {
  margin: 0 !important;
  display: inline;
  font-size: 16px !important;
}
.bc-settings-compact .bc-settings-block-collapsible .bc-settings-block-head > p.setting-item-description {
  margin: 4px 0 0 !important;
  padding-left: 0;
}
.bc-settings-compact .bc-settings-block-title-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.bc-settings-compact .bc-settings-block-chevron {
  display: none !important;
}
.bc-settings-compact .setting-item.bc-settings-avatar-row {
  display: flex !important;
  flex-direction: column !important;
  flex-wrap: nowrap !important;
  align-items: stretch !important;
  justify-content: flex-start !important;
  gap: 8px !important;
}
.bc-settings-compact .setting-item.bc-settings-avatar-row .setting-item-info {
  flex: 0 0 auto !important;
  width: 100% !important;
  min-width: 0 !important;
  max-width: none !important;
  padding-right: 0 !important;
}
.bc-settings-compact .setting-item.bc-settings-avatar-row .setting-item-control,
.bc-settings-mobile .setting-item.bc-settings-avatar-row .setting-item-control {
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  column-gap: 8px !important;
  row-gap: 8px !important;
  width: 100% !important;
  max-width: none !important;
  min-width: 0 !important;
  flex: 0 0 auto !important;
  margin-left: 0 !important;
  justify-content: stretch !important;
  padding-top: 0 !important;
}
.bc-settings-compact .setting-item.bc-settings-avatar-row .setting-item-control input {
  grid-column: 1 / -1 !important;
  width: 100% !important;
  min-width: 0 !important;
}
.bc-settings-compact .setting-item.bc-settings-avatar-row .setting-item-control button {
  width: 100% !important;
  min-width: 0 !important;
  height: 36px !important;
  min-height: 36px !important;
  max-height: 36px !important;
  margin: 0 !important;
  padding: 0 6px !important;
  box-sizing: border-box !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
  white-space: nowrap !important;
}
.bc-settings-compact .bc-settings-block-collapsible .bc-settings-block-body {
  padding: 0 16px 14px;
}
.bc-settings-compact .bc-settings-block-collapsible .bc-settings-block-body.hidden {
  display: none !important;
}
.bc-settings-compact .bc-settings-block-collapsible:not(.open) .bc-settings-block-head > p.setting-item-description {
  display: none !important;
}
.bc-settings-compact .bc-settings-locked-hint {
  margin: -6px 0 12px !important;
  padding: 0 !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  color: var(--text-muted) !important;
  text-indent: 2em !important;
}
.bc-settings-compact .bc-am-section-hint {
  display: block !important;
  margin: 0 0 8px !important;
  padding: 0 !important;
  font-size: 12px !important;
  line-height: 1.5 !important;
  color: var(--text-muted) !important;
  text-indent: 2em !important;
}
.bc-settings-compact .bc-habits-config { margin-top: 4px; display: flex; flex-direction: column; gap: 0; }
.bc-settings-compact .bc-habit-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--background-modifier-border); }
.bc-settings-compact .bc-habit-fields { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
.bc-settings-compact .bc-habit-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: auto;
}
.bc-settings-compact .bc-habit-actions .bc-reorder-btn,
.bc-settings-compact .bc-habit-actions .bc-habit-drag,
.bc-settings-compact .bc-habit-actions .bc-habit-del-btn {
  width: 28px !important;
  height: 28px !important;
  min-width: 44px !important;
  min-height: 44px !important;
  max-width: 28px !important;
  max-height: 28px !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 6px !important;
  background: var(--background-secondary) !important;
  color: var(--text-muted) !important;
  box-sizing: border-box !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  line-height: 1 !important;
  font-size: 12px !important;
  flex: 0 0 28px !important;
}
.bc-settings-compact .bc-habit-drag {
  cursor: grab;
  touch-action: none;
}
.bc-settings-compact .bc-habit-actions .bc-habit-drag svg,
.bc-settings-compact .bc-habit-actions .bc-habit-del-btn svg {
  width: 16px !important;
  height: 16px !important;
  display: block;
}
.bc-settings-compact .bc-habit-icon-input {
  width: 70px !important;
  min-width: 70px !important;
  box-sizing: border-box !important;
  text-align: center;
  font-size: 14px !important;
  line-height: 1.2 !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 8px !important;
  background: var(--background-secondary) !important;
  padding: 6px 4px !important;
}
.bc-settings-compact .bc-habit-name-input { flex: 1; min-width: 0; border: none !important; background: transparent !important; font-size: 14px !important; font-weight: 500 !important; }
.bc-settings-compact .bc-habit-del-btn {
  cursor: pointer;
}
.bc-settings-compact .bc-habit-add-row { display: flex; align-items: center; justify-content: center; border: 1.5px dashed var(--background-modifier-border); border-radius: 8px; padding: 10px; margin-top: 12px; cursor: pointer; color: var(--text-muted) !important; font-size: 12px !important; font-weight: 600; }
.bc-settings-compact .bc-habit-io-section { margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--background-modifier-border); }
.bc-settings-compact .bc-habit-io-label { margin: 0 0 10px !important; font-size: 11px !important; font-weight: 700 !important; color: var(--text-muted) !important; }
.bc-settings-compact .bc-habit-io-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.bc-settings-compact .bc-habit-io-btn { min-height: 40px; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--background-modifier-border); background: var(--background-secondary); font-size: 14px !important; cursor: pointer; width: 100%; box-sizing: border-box; }
.bc-settings-compact .bc-module-name-multiline {
  display: flex;
  flex-direction: column;
  gap: 1px;
  line-height: 1.25;
  font-weight: 600;
}
.bc-settings-compact .bc-sortable-list .setting-item-info { flex: 1 1 auto !important; width: auto !important; min-width: 0 !important; max-width: none !important; }
.bc-settings-compact .bc-sortable-list .setting-item-control {
  flex: 0 0 auto !important;
  margin-left: auto !important;
  gap: 4px !important;
  min-width: 0 !important;
}
.bc-settings-compact .bc-module-drag {
  cursor: grab;
  color: var(--text-muted);
  touch-action: none;
  padding: 0;
  width: 22px;
  height: 22px;
  min-width: 22px;
  min-height: 22px;
  max-width: 22px;
  max-height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 22px;
  box-sizing: border-box;
}
.bc-settings-compact .bc-module-drag svg {
  width: 12px;
  height: 12px;
  display: block;
}
.bc-settings-compact .bc-sortable-list .bc-reorder-btn,
.bc-settings-compact .bc-habit-actions .bc-reorder-btn {
  width: 22px;
  height: 22px;
  min-width: 22px;
  min-height: 22px;
  max-width: 22px;
  max-height: 22px;
  padding: 0;
  border: 1px solid var(--background-modifier-border);
  border-radius: 6px;
  background: var(--background-secondary);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 11px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex: 0 0 22px;
}
.bc-settings-compact .bc-settings-action-only .bc-reorder-btn,
.bc-settings-compact .bc-settings-action-only .bc-undo-modules-btn {
  width: auto;
  min-width: 0;
  max-width: none;
  height: auto;
  min-height: 36px;
  max-height: none;
  padding: 7px 14px;
  flex: 1 1 auto;
  font-size: 13px;
}
.bc-settings-compact .setting-item-control input[type="color"],
.bc-settings-compact input[type="color"] {
  -webkit-appearance: none;
  appearance: none;
  width: 22px !important;
  height: 22px !important;
  min-width: 22px !important;
  min-height: 22px !important;
  max-width: 22px !important;
  max-height: 22px !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 1px solid var(--background-modifier-border) !important;
  border-radius: 50% !important;
  background: transparent !important;
  overflow: hidden;
  cursor: pointer;
  flex: 0 0 22px !important;
  box-sizing: border-box !important;
}
.bc-settings-compact .setting-item-control input[type="color"]::-webkit-color-swatch-wrapper,
.bc-settings-compact input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
  border: none;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.bc-settings-compact .setting-item-control input[type="color"]::-webkit-color-swatch,
.bc-settings-compact input[type="color"]::-webkit-color-swatch {
  border: none;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  padding: 0;
  box-sizing: border-box;
}
.bc-settings-compact .setting-item-control input[type="color"]::-moz-color-swatch,
.bc-settings-compact input[type="color"]::-moz-color-swatch {
  border: none;
  border-radius: 50%;
}
.is-mobile .bc-settings-compact .setting-item-control input[type="color"],
.is-mobile .bc-settings-compact input[type="color"] {
  width: 22px !important;
  height: 22px !important;
  min-width: 22px !important;
  min-height: 22px !important;
  max-width: 22px !important;
  max-height: 22px !important;
}
.bc-settings-compact .bc-reorder-live { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
.bc-settings-mobile,
.is-mobile .vertical-tab-content.bc-settings-mobile-host,
.is-mobile .vertical-tab-content-container.bc-settings-mobile-host {
  overflow-x: hidden !important;
  overscroll-behavior-x: none;
  touch-action: pan-y;
  max-width: 100% !important;
}
.bc-settings-mobile .setting-item {
  min-width: 0 !important;
  max-width: 100% !important;
  justify-content: space-between !important;
}
.bc-settings-mobile .setting-item-info {
  min-width: 0 !important;
}
.bc-settings-mobile .setting-item-control {
  margin-left: auto !important;
  min-width: 0 !important;
}
.bc-settings-mobile .setting-item:not(:has(input)):not(:has(select)):not(:has(textarea)):not(:has(.checkbox-container)) .setting-item-info {
  flex: 1 1 auto !important;
  width: auto !important;
  min-width: 0 !important;
  max-width: none !important;
}
.bc-settings-mobile .setting-item:not(:has(input)):not(:has(select)):not(:has(textarea)):not(:has(.checkbox-container)) .setting-item-control {
  flex: 0 0 auto !important;
  width: auto !important;
}
.bc-settings-mobile .setting-item-control button {
  margin-right: 0 !important;
}
.bc-settings-mobile .bc-settings-rich-block .setting-item-control {
  min-width: 0 !important;
  max-width: 48% !important;
  width: auto !important;
}
.bc-settings-mobile .setting-item-control select,
.bc-settings-mobile .setting-item-control .dropdown {
  max-width: 100% !important;
  min-width: 0 !important;
  width: 100% !important;
}
.bc-settings-mobile .bc-habit-io-row { grid-template-columns: 1fr; gap: 10px; }
.bc-settings-mobile .setting-item-control input[type="text"],
.bc-settings-mobile .setting-item-control input[type="number"],
.bc-settings-mobile .setting-item-control textarea,
.bc-settings-mobile .bc-settings-textarea-row .setting-item-control textarea {
  font-size: 16px !important;
  min-height: 44px !important;
}
.bc-settings-mobile .bc-habit-icon-input {
  width: 48px !important;
  min-width: 48px !important;
  min-height: 32px !important;
  height: 32px !important;
  font-size: 13px !important;
}
.bc-settings-mobile .bc-habit-name-input {
  font-size: 16px !important;
  min-height: 32px !important;
  height: 32px !important;
}
.bc-settings-mobile .bc-habit-row {
  gap: 6px;
}
.bc-settings-mobile .bc-habit-actions {
  gap: 4px;
}
.bc-settings-mobile .bc-habit-actions .bc-reorder-btn,
.bc-settings-mobile .bc-habit-actions .bc-habit-drag,
.bc-settings-mobile .bc-habit-actions .bc-habit-del-btn,
.bc-settings-mobile .bc-sortable-list .bc-reorder-btn,
.bc-settings-mobile .bc-sortable-list .bc-module-drag {
  width: 22px !important;
  height: 22px !important;
  min-width: 22px !important;
  min-height: 22px !important;
  max-width: 22px !important;
  max-height: 22px !important;
  flex: 0 0 22px !important;
}
.bc-settings-mobile .bc-settings-action-only button {
  min-height: 40px !important;
}
/* 设置页「打开/查看」统一为圆角矩形，避免短文案被撑成圆钮 */
.bc-settings-compact .setting-item-control > button,
.bc-settings-mobile .setting-item-control > button,
.jnr-settings-compact .jnr-settings-action-row .setting-item-control button,
.jnr-settings-mobile .jnr-settings-action-row .setting-item-control button {
  min-height: 28px !important;
  height: 28px !important;
  min-width: 0 !important;
  padding: 0 14px !important;
  border-radius: 8px !important;
  font-size: 12px !important;
  line-height: 28px !important;
  box-sizing: border-box !important;
}
`, "v14");
}

function appendBcMobileTopSpacer(containerEl) {
  containerEl.createDiv({ cls: BC_MOBILE_TOP_SPACER_CLASS });
}

function applyBcMobileSettingsLayout(containerEl, app) {
  document.querySelectorAll(".bc-settings-mobile-host").forEach((el) => {
    el.removeClass("bc-settings-mobile-host");
  });
  const isMobile = app?.isMobile || Platform.isMobileApp;
  if (!isMobile) return;
  injectBcSettingsCompactStyles();
  const host = containerEl.closest(".vertical-tab-content")
    || containerEl.closest(".vertical-tab-content-container")
    || containerEl.parentElement;
  host?.addClass("bc-settings-mobile-host");
  appendBcMobileTopSpacer(containerEl);
}

function createBcSettingsBlock(parent, title, desc) {
  const block = parent.createDiv({ cls: "bc-settings-block" });
  block.createEl("h3", { text: title });
  if (desc) {
    block.createEl("p", { cls: "setting-item-description", text: desc });
  }
  return block;
}

function addBcSubgroupTitle(block, title) {
  block.createEl("h4", { text: title });
}

function createBcCollapsibleBlock(parent, plugin, sectionId, title, desc, buildBody, opts = {}) {
  const uiSections = plugin.settings.uiState?.settingsSections || {};
  let expanded = uiSections[sectionId];
  if (expanded === undefined) expanded = opts.defaultExpanded !== false;
  if (opts.forceOpen) expanded = true;

  const block = parent.createDiv({
    cls: "bc-settings-block bc-settings-rich-block bc-settings-block-collapsible" + (expanded ? " open" : ""),
  });
  block.setAttr("data-settings-section", sectionId);

  const head = block.createDiv({ cls: "bc-settings-block-head clickable" });
  head.setAttr("role", "button");
  head.setAttr("tabindex", "0");
  head.setAttr("aria-expanded", expanded ? "true" : "false");

  const titleRow = head.createDiv({ cls: "bc-settings-block-title-row" });
  titleRow.createEl("h3", { text: title });
  if (desc) head.createEl("p", { cls: "setting-item-description", text: desc });

  const body = block.createDiv({
    cls: "bc-settings-block-body" + (expanded ? "" : " hidden"),
  });
  buildBody(body);

  const sync = (open) => {
    expanded = open;
    block.toggleClass("open", open);
    body.toggleClass("hidden", !open);
    head.setAttr("aria-expanded", open ? "true" : "false");
  };

  const toggle = () => {
    sync(!expanded);
    plugin.settings.uiState = plugin.settings.uiState || {};
    plugin.settings.uiState.settingsSections = plugin.settings.uiState.settingsSections || {};
    plugin.settings.uiState.settingsSections[sectionId] = expanded;
    plugin.saveSettings();
  };
  head.addEventListener("click", toggle);
  head.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  });

  return block;
}

function bindBcSettingsTabKeyboard(tabBar, showTab) {
  const buttons = () => Array.from(tabBar.querySelectorAll('[role="tab"]'));
  const syncTabIndex = (id) => {
    buttons().forEach((btn) => {
      btn.tabIndex = btn.dataset.tab === id ? 0 : -1;
    });
  };
  const wrappedShow = (id) => {
    showTab(id);
    syncTabIndex(id);
  };
  tabBar.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    const list = buttons();
    if (!list.length) return;
    const current = Math.max(0, list.findIndex((btn) => btn.tabIndex === 0));
    let next = current;
    if (e.key === "ArrowRight") next = (current + 1) % list.length;
    if (e.key === "ArrowLeft") next = (current - 1 + list.length) % list.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = list.length - 1;
    e.preventDefault();
    const id = list[next].dataset.tab;
    wrappedShow(id);
    list[next].focus();
  });
  return { showTab: wrappedShow, syncTabIndex };
}

function buildBcSettingsTabs(container, plugin, tabDefs, initialTabId) {
  const tabBar = container.createDiv({ cls: "bc-settings-tab-bar" });
  if (tabDefs.length >= 5) tabBar.addClass("is-many-tabs");
  tabBar.setAttr("role", "tablist");
  tabBar.setAttr("aria-label", "BrainCore 设置");

  const panelsWrap = container.createDiv({ cls: "bc-settings-panels" });
  const panels = {};
  tabDefs.forEach((t) => {
    panels[t.id] = panelsWrap.createDiv({
      cls: "bc-settings-panel",
      attr: {
        role: "tabpanel",
        id: `bc-panel-${t.id}`,
        "aria-labelledby": `bc-tab-${t.id}`,
      },
    });
    panels[t.id].style.display = "none";
  });

  const showTab = (id) => {
    tabDefs.forEach((t) => {
      panels[t.id].style.display = t.id === id ? "block" : "none";
    });
    tabBar.querySelectorAll("button").forEach((btn) => {
      const active = btn.dataset.tab === id;
      btn.toggleClass("mod-cta", active);
      btn.setAttr("aria-selected", active ? "true" : "false");
    });
  };

  const keyboard = bindBcSettingsTabKeyboard(tabBar, showTab);

  tabDefs.forEach((t) => {
    const btn = tabBar.createEl("button", { text: t.label, type: "button" });
    btn.dataset.tab = t.id;
    btn.setAttr("role", "tab");
    btn.setAttr("id", `bc-tab-${t.id}`);
    btn.setAttr("aria-controls", `bc-panel-${t.id}`);
    btn.setAttr("aria-selected", "false");
    btn.addEventListener("click", () => keyboard.showTab(t.id));
  });

  const startId = initialTabId && tabDefs.some((t) => t.id === initialTabId)
    ? initialTabId
    : tabDefs[0]?.id;
  if (startId) keyboard.showTab(startId);

  return { tabBar, panels, showTab: keyboard.showTab };
}
