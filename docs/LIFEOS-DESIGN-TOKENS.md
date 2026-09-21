# LifeOS Design Tokens（2026.07.16）

LifeOS 家族（BrainCore / PlainLedger / 纪念日 / BrainCore Mac）共用视觉与交互规范；Mac 端在原生控件上允许使用已记录的特例。

## 颜色

| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `--lifeos-accent` | `#b48246` | `#d4a574` | 主按钮、强调数字、Tab 选中字色 |
| `--lifeos-accent-soft` | `rgba(180,130,70,0.12)` | `rgba(212,165,116,0.14)` | 卡片背景、试用横幅 |
| `--lifeos-accent-border` | `rgba(180,130,70,0.28)` | `rgba(212,165,116,0.32)` | 边框、分隔（能不用则不用） |

### Tab / 分段选中（统一）

| 状态 | 视觉 | 说明 |
|------|------|------|
| 未选中 | 透明底 + muted 字 | 轨道可有极淡底 |
| 选中 | **品牌色混合底**（约 accent 36% + surface）+ 深棕/米色字 | 与主界面「总年月周」一致；禁止仅靠下划线或无底色字色切换 |
| 弹层标题 | **无底部分割线** | 沉浸：用间距区分区块，不画框线 |
| `--lifeos-error` | `var(--text-error)` | 同左 | 激活失败、错误文案 |

## 间距

| Token | 值 | 用途 |
|-------|-----|------|
| `--lifeos-sidebar-inset` | `10px` | 侧边栏内容区内边距 |
| `--lifeos-mobile-top-inset` | `41px` | 移动端顶栏安全区 |

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

1. **Primary**：`lifeos-act-btn-primary` / `mod-cta` — 激活、知道了
2. **Secondary**：`lifeos-act-btn` — 复制、配置
3. **Ghost**：透明背景 + 下划线 — 设置页链接

## Empty State 规范

```html
.lifeos-empty-state
  .lifeos-empty-icon   （可选 emoji）
  .lifeos-empty-msg     （一句说明）
  button.lifeos-empty-cta （一个主操作）
```

## 动效

| Token | 默认 | 用途 |
|-------|------|------|
| `--lifeos-motion-fast` | `120ms` | 按钮按压、金句切换 |
| `--lifeos-motion-med` | `200ms` | 列表、卡片过渡 |
| `--lifeos-ease` | `cubic-bezier(.25,.8,.25,1)` | 通用缓动 |

`prefers-reduced-motion: reduce` 时上述时长降为 `1ms`，分享进度、主题切换与金句轮播不再做位移或透明度动画。

## 点击热区

| Token | 值 | 用途 |
|-------|-----|------|
| `--lifeos-hit-target` | `44px` | 移动端主操作最小点击高度 |

## 层级

| Token | 值 | 用途 |
|-------|-----|------|
| `--lifeos-z-overlay` | `1000100` | 更新日志、使用说明叠在设置 overlay 之上 |

## 断点

| Token | 值 | 用途 |
|-------|-----|------|
| `--lifeos-bp-narrow` | `480px` | 侧栏控制台习惯格放大、间距收紧 |

## 移动端 Top Bar

```
[ 标题 + 版本徽章 ]  ……  [ + ] [ 关闭 ]
```

筛选 / 视图切换放在内容区顶栏，不与系统状态栏重叠。
