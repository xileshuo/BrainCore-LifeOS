# BrainCore LifeOS
BrainCore LifeOS is a paid LifeOS sidebar console with a **48-hour free trial**.

It helps you capture ideas, manage tasks and weekly work, track habits, browse Moments notes, and review vault stats.
Install free from Community Plugins / BRAT / GitHub. After a satisfying trial, unlock permanently for **¥99.9** by contacting the author on Xiaohongshu.
知识库侧边栏控制台（LifeOS）——捕捉、待办、周工作、习惯、统计与知识内化。
当前公开版本：**4.0.9 · 48 小时试用（到期需激活）**
## Pricing / 定价（Paid · free trial）

Community label: **Paid** (trial allowed).

- **Free**: install + **48-hour** full trial
- **Paid**: **¥99.9** one-time permanent activation after trial
- **How to buy**: if the trial feels right, contact the author on **Xiaohongshu (小红书)** to order and pay; copy the device fingerprint from the plugin, receive an activation code, paste to unlock
- Author profile (`authorUrl`): https://github.com/xileshuo
- Author Xiaohongshu (human link): https://xhslink.com/m/3uOoUHv2rI1

Suggested companion: **Dataview** (richer stats; other features work without it).

建议安装：**Dataview**（统计看板更完整；其它功能不强制依赖）。

## Installation / 安装

### Community Plugins

After approval: Settings → Community plugins → Browse → search the plugin → Install → Enable.

### BRAT

1. Install and enable **BRAT**
2. Add this repository:

```text
https://github.com/xileshuo/BrainCore-LifeOS
```

3. Enable the plugin; use BRAT to check for updates later.

## Trial & activation / 试用与激活

Public build = **48-hour trial**:

- Free install from Community Plugins / BRAT / GitHub Release
- Start the trial in-plugin for **48 hours** of full features
- After trial: **¥99.9** one-time permanent activation (per device fingerprint)
- Buy: contact the author on **Xiaohongshu (小红书)** to order and pay, copy the fingerprint, receive a code, paste to activate
- Phone and desktop each need one activation; upgrades usually keep the license

公开包为 **48 小时试用**：免费安装 → 插件内开启试用 → 到期后 ¥99.9 永久激活（小红书联系作者下单付款，复制设备指纹换码）。
### Manual install / 手动安装
Download plugin files from the [Latest Release](https://github.com/xileshuo/BrainCore-LifeOS/releases/latest) into `.obsidian/plugins/braincore-lifeos/`.
## Usage / 使用

1. Open the sidebar console (ribbon icon).
2. Start the **48-hour trial** when prompted.
3. Use Capture, Tasks, Weekly work, Habits, Stats, and Moments.
4. Optional: install **Dataview** for richer stats.
5. After trial: copy fingerprint → pay ¥99.9 via Xiaohongshu → paste activation code.

Detailed in-plugin help: activation panel / Settings → About → Usage guide.

详细中文说明请在插件内打开「使用说明」。

## Changelog / 更新日志
### 4.0.9

- 社区审核：authorUrl 改为 GitHub 个人主页（不可指向本插件仓库）
- 文档：公开 README 加强英文概览，避免中文使用说明淹没英文检测

### 4.0.8

- 社区审核：manifest 描述去 Obsidian 词并补句末标点；authorUrl 改为可访问的 GitHub 仓库
- 文档：README 补英文安装/使用说明；定价 ¥99.9 永久激活（试用满意后小红书联系下单）
- 许可：仓库 LICENSE 改为可识别的 MIT，并保留试用后需激活的商业说明

### 4.0.7

- 社区分发：公开包改为 48 小时试用，到期后需激活码（市场可免费安装）
- 文档：补充 Paid + 试用说明与 LICENSE，便于提交 Obsidian 社区目录

### 4.0.6

- 金句：改为 Scripts/braincore-quote-index.json 增量索引，覆盖全部读书笔记与随笔（不再限最新 80 本）
- 金句：改/删划线或随笔会同步更新池；每日新增笔记分批进池；展示尽量不重复，轮完再洗牌
- 金句：后台分批追平，避免全库硬扫造成卡顿

### 4.0.5

- 统计：跨日后强刷「今日累计」——Obsidian 挂后台过夜也不再沿用昨天的 ↑N；午夜定时 + 切回前台都会按日历日重算
- 统计：自愈「date 已是今天但基线滞后」——把 ctime 早于今天的文件并回基线，避免一直显示昨天的净增
- 控制台：跨日同步刷新习惯「今日」高亮与问候/日期条，不必重开插件或重启 Obsidian

### 4.0.4

- 授权：激活码改为 licenseKeys 数组保存，手机/电脑各自激活后互不覆盖（兼容旧 licenseKey）

### 4.0.3

- 关于：所有作品改为纵向排列
- 套件：设置折叠区块去掉箭头，点标题仍可展开 / 收起（与 PlainLedger / 纪念日对齐）

### 4.0.2

- 手机捕捉：键盘态不再锁死 228/300 高度，随键盘 inset 收缩，分类与发送不再被挡
- Moments：FAB 展开不再与键盘测量互相覆盖；常驻输入抬到 Obsidian 底栏之上（约 72px+safe）
- 手机：bc-mobile-force-top 仅作用于捕捉弹窗；关闭时始终清掉 body class，避免漏到其他弹层
- 套件顶距统一固定 41px spacer；关闭钮 44×44、不透明；分类键与排序触控 ≥44
- 清理无用的 momentsTrashDefaultV4 / is-fab-settling 死字段与死样式路径
---
## Distribution note / 分发说明
This repository is for **Community Plugins / BRAT / GitHub Release** distribution and product docs. It does not include the full private source tree.
Repo: https://github.com/xileshuo/BrainCore-LifeOS
