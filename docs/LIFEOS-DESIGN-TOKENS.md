# LifeOS Design Tokens（2026.07.16）

三插件（BrainCore / PlainLedger / 纪念日）共用视觉与交互规范。

## 颜色

| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `--lifeos-accent` | `#b48246` | `#d4a574` | 主按钮、强调数字、Tab 选中 |
| `--lifeos-accent-soft` | `rgba(180,130,70,0.12)` | `rgba(212,165,116,0.14)` | 卡片背景、试用横幅 |
| `--lifeos-accent-border` | `rgba(180,130,70,0.28)` | `rgba(212,165,116,0.32)` | 边框、分隔 |
| `--lifeos-error` | `var(--text-error)` | 同左 | 激活失败、错误文案 |

## 间距

| Token | 值 | 用途 |
|-------|-----|------|
| `--lifeos-sidebar-inset` | `10px` | 侧边栏内容区内边距 |
| `--lifeos-mobile-top-inset` | `41px` | 移动端顶栏安全区 |

**手机顶距统一方案（三插件）**

| 场景 | 做法 |
|------|------|
| **设置页**（Obsidian 已有「← 标题 ×」栏） | `*-mobile-top-spacer` **收掉**（`display:none`），内容紧贴标题栏下 |
| **全屏面板 / 更新日志 / 手机看板** | 使用 `*-mobile-top-spacer` **41px**，由宿主避让状态栏 |

不要在设置页再叠 `env(safe-area-inset-top)` + spacer。

## 圆角

| 层级 | 值 | 示例 |
|------|-----|------|
| 卡片 / 面板 | `10px`–`16px` | 设置块、更新弹窗 |
| 按钮 | `8px`–`10px` | 激活、Tab |
| 徽章 | `999px` | 版本 badge |

## 字号

| 层级 | 大小 | 用途 |
|------|------|------|
| 页面标题 | `18px` / `700` | 设置页 h2 |
| 区块标题 | `16px` / `700` | 设置块 h3 |
| 正文 | `12px`–`14px` | 描述、列表 |
| 辅助 | `11px` | 指纹、状态 |

## 按钮层级

1. **Primary**：`lifeos-act-btn-primary` / `mod-cta` — 验证并激活、知道了
2. **Secondary**：`lifeos-act-btn` — 复制、配置
3. **Ghost**：透明背景 + 下划线 — 设置页链接

## Empty State 规范

```html
.lifeos-empty-state
  .lifeos-empty-icon   （可选 emoji）
  .lifeos-empty-msg     （一句说明）
  button.lifeos-empty-cta （一个主操作）
```

## 移动端 Top Bar

```
[ 标题 + 版本徽章 ]  ……  [ + ] [ 关闭 ]
```

筛选 / 视图切换放在内容区顶栏，不与系统状态栏重叠。
