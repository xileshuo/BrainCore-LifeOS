# BrainCore LifeOS

> **付费 · 48 小时试用 · ¥49.9 永久激活**

知识库侧边栏控制台（LifeOS）——捕捉、待办、周工作、习惯、统计与知识内化。

当前公开版本：**4.1.13 · 48 小时试用**

## 界面预览

**控制台** — 捕捉、待办、周工作与习惯一屏看清

![控制台](https://raw.githubusercontent.com/xileshuo/BrainCore-LifeOS/main/media/dashboard.jpg)

**Moments** — 速记、筛选与分享图

![Moments](https://raw.githubusercontent.com/xileshuo/BrainCore-LifeOS/main/media/moments.jpg)

**捕捉** — 快速收集想法与待办

![捕捉](https://raw.githubusercontent.com/xileshuo/BrainCore-LifeOS/main/media/capture.jpg)

## 定价与购买

| 项目 | 说明 |
| --- | --- |
| **试用** | 插件内开启后 48 小时全功能 |
| **付费** | ¥49.9 一次付费，按设备指纹永久激活 |
| **购买** | 小红书联系作者下单 → 复制设备指纹 → 粘贴激活码 |

作者：[github.com/xileshuo](https://github.com/xileshuo) · 小红书：[下单入口](https://xhslink.com/m/3uOoUHv2rI1)

## LifeOS 三插件互跳

同一作者的 LifeOS 系列，可在社区插件里互相打开，或前往 GitHub：

| 插件 | 社区插件（已上架后） | GitHub |
| --- | --- | --- |
| **BrainCore LifeOS** | [打开插件页](obsidian://show-plugin?id=braincore-lifeos) · 搜索 `BrainCore LifeOS` | [BrainCore LifeOS](https://github.com/xileshuo/BrainCore-LifeOS) |
| **PlainLedger** | [打开插件页](obsidian://show-plugin?id=plain-ledger) · 搜索 `PlainLedger` | [PlainLedger](https://github.com/xileshuo/plain-ledger-obsidian) |
| **jinianri** | [打开插件页](obsidian://show-plugin?id=jinianri) · 搜索 `jinianri` | [jinianri](https://github.com/xileshuo/jinianri) |

## 安装与上手

1. 设置 → 第三方插件 → 浏览 → 搜索 **BrainCore LifeOS** → 安装并启用
2. 点侧栏云图标，开启 48 小时试用
3. 试用满意后：复制指纹 → 小红书下单 → 粘贴激活码

### 其他安装方式

**BRAT**：添加仓库

```text
https://github.com/xileshuo/BrainCore-LifeOS
```

**手动**：下载 [Latest Release](https://github.com/xileshuo/BrainCore-LifeOS/releases/latest) 的 `main.js`、`manifest.json`、`styles.css` 到 `.obsidian/plugins/braincore-lifeos/`

## 使用说明（精简）

完整说明可在启用后打开插件内「使用说明」；下面是社区页够用的上手版。

### 打开控制台

启用后点左侧边栏 **☁️ 云朵图标**，进入 BrainCore 控制台。

### 七大模块

1. **问候语与天气** — 日期、问候、天气
2. **时间进度** — 今日 / 本周 / 本月 / 本年进度
3. **快捷工具** — 捕捉 · 文件 · Moments · 归档
4. **待办总览** — 聚合日常待办与本周工作事项
5. **习惯打卡** — 长期坚持项（与一次性待办分开）
6. **每日金句** — 从读书笔记与随笔抽取
7. **数据统计** — 笔记 / 标签 / 待办 / Moments 等概览

顶部 Hero（问候 + 时间进度 + 金句）一眼看清今天；下方推进待办与习惯。模块可在设置里开关与排序。

### 捕捉

点「捕捉」打开面板，分类一次展开：

| 分类 | 写入 |
| --- | --- |
| 工作 | 本周 Work →「本周待办」 |
| 生活 | 生活待办文件 |
| Moments | `读&写/Moments` 年文件 |
| 随笔 / 剪藏 / 素材 / 草稿 | 对应路径（可在设置修改） |

`⌘/Ctrl + Enter` 发送；空内容不会静默提交。

### Moments

- 记录写入 `读&写/Moments/年份.md`（按年汇总）
- 支持搜索、筛选、置顶、收藏、那年今日、分享图与年度报告
- 图片统一进 `Boxes/图片`，年文件只存引用

### 待办与周工作

- 待办用标准勾选语法：`- [ ] 任务`
- 打开控制台时会生成本周 Work；跨周尽量迁未完成项
- 待办总览会聚合周工作与日常待办，方便当天推进

### 习惯打卡

适合「每天都要做」的事项。项目可在设置 → 打卡里增删、改图标，并支持导入 / 导出。

### 推荐日常流程

1. **早上**：☁️ 打开控制台 → 看 Hero → 扫待办
2. **白天**：有事就捕捉；该推进的从待办总览点进去
3. **晚上**：习惯打卡；需要时归档已完成项
4. **每周**：在 Work 文件里复盘本周、安排下周

### 建议与注意

- **Dataview** 可选：没有也能用捕捉 / 待办 / 习惯 / Moments；装了统计更完整（建议开 DataviewJS）
- 不要随意删核心目录（Work、读&写、Boxes 等）或改插件文件夹名
- 手机与电脑共用同一库时：两端各用本机指纹各激活一次

## 更新日志

### 4.1.13（当前）

- 公开 README：中文在前、英文在后（市场介绍优先中文）

<details>
<summary>4.1.12</summary>

- 社区 CSS lint：去掉 !important / :has / text-indent / scrollbar / system-ui 等审核警告，版式规则保持原选择器
- 文档：公开 README 恢复中文说明（英文 Installation 仍在文首）

</details>

<details>
<summary>4.1.11</summary>

- 社区 Scorecard：修复 styles.css / src/css 抽取时混入 JS（Unknown word），CSS 恢复纯样式供社区 lint
- 文档：公开 README 保持英文短说明；中文长说明移至 README.zh.md

</details>

<details>
<summary>4.1.10</summary>

- 社区 Scorecard：README 英文 Installation/Usage 置顶；`npm run build` 固定 trial48h，与 Release main.js 字节一致
- 社区审核：LifeOS / Moments / 设置样式迁入 styles.css，去掉运行时 createElement("style")
- 社区审核：设置页与关于/授权/快捷指令区块统一 Setting.setHeading()

</details>

<details>
<summary>4.1.9</summary>

- 修复：Moments CSS 多余 `}`（社区 Scorecard Unexpected }）；公开仓补齐 docs/templates 等构建依赖，避免 Scorecard Build verification / readFile 失败

</details>

<details>
<summary>4.1.8</summary>

- 关于：所有作品互相介绍售价（PlainLedger ¥39.9 / 纪念日 ¥29.9 / BrainCore ¥49.9），未安装可跳转 GitHub

</details>

<details>
<summary>4.1.7</summary>

- 文件墙：写入完整卡片看板；旧表格占位打开「文件」时自动升级；官方看板会同步四根路径并递归扫描子目录
- 文件墙：仅升级已知简易占位，不覆盖用户自定义 DataviewJS；打开时检测 Dataview / DataviewJS
- 附件：AM 根目录未对齐 Boxes 时捕捉改用内置四分类；侧栏教练条同时只显示一条且 AM 提示可关闭
- 金句：空态改用 LifeOS 空态组件；读书笔记路径匹配改为目录前缀，避免误收
- 文档：明确文件墙需要 DataviewJS；工作区说明与当前推荐版本对齐
- 文档：Weread 配置写入完整笔记模板；去掉验收清单；「Hero」改为「控制台最上方」等白话

</details>

<details>
<summary>4.1.6</summary>

- iOS 快捷面板：手机端打开不再自动聚焦输入框，避免立刻弹键盘；点输入区再出键盘
- 修复：库内尚无 Boxes / 文件墙时上传图片或打开文件墙会报错；现会自动逐级创建目录并在缺失时生成文件墙笔记
- Moments：附件目录确保改为逐级创建（父文件夹不存在时不再失败）
- 捕捉/素材：未安装 Attachment Management 时也按类型自动分类（图片 / PDF / 音视频 / 附件），与文件墙四栏一致
- 附件策略：未装 AM 用内置四分类；已装且可读到 AM 配置则捕捉严格跟 AM，避免两套规则冲突
- 控制台：未装 Dataview / Attachment Management 时顶栏同时提示安装；使用说明补充 AM 完整配置（与文件墙四栏对齐）
- 金句：修复「去设置读书笔记路径」点了无反应（异步刷新后监听丢失）；现打开设置 → 路径
- 文档：补充 Weread（微信读书）安装与配置；金句空态增加安装入口；路径「读书笔记」注明需与 Weread 输出一致
- 文档：重排使用说明——模块讲行为、十三讲配置；AM / Weread 各有总览、步骤、验收与 FAQ

</details>

<details>
<summary>4.1.4</summary>

- 文档：社区 README 改为英文说明在前、中文在后，便于目录语言检测通过
- 发布：同步 4.1.4 公开包与 Release，便于社区后台重新审核

</details>

<details>
<summary>4.1.3</summary>

- Moments：无旧 Ideas/碎碎念 可迁时静默完成，不再每次启动弹「Folder already exists」
- Moments：建目录兼容已存在文件夹；失败提示改为最多每周一次

</details>

下方为英文说明（社区审核）。

---

# BrainCore LifeOS

> **Paid · 48-hour trial · ¥49.9 permanent unlock**

LifeOS sidebar console for capture, tasks, weekly work, habits, Moments, stats, and knowledge review.

Latest: [Release](https://github.com/xileshuo/BrainCore-LifeOS/releases/latest) · tag **Paid** (includes free trial)

## LifeOS family

Companion plugins by the same author — open each other in Community Plugins, or on GitHub:

| Plugin | Community (after listed) | GitHub |
| --- | --- | --- |
| **BrainCore LifeOS** | [Open plugin page](obsidian://show-plugin?id=braincore-lifeos) · search `BrainCore LifeOS` | [BrainCore LifeOS](https://github.com/xileshuo/BrainCore-LifeOS) |
| **PlainLedger** | [Open plugin page](obsidian://show-plugin?id=plain-ledger) · search `PlainLedger` | [PlainLedger](https://github.com/xileshuo/plain-ledger-obsidian) |
| **jinianri** | [Open plugin page](obsidian://show-plugin?id=jinianri) · search `jinianri` | [jinianri](https://github.com/xileshuo/jinianri) |

## Installation

1. Prefer Community Plugins: Settings → Community plugins → Browse → search **BrainCore LifeOS** → Install → Enable
2. Or install with **BRAT** using this repository:

```text
https://github.com/xileshuo/BrainCore-LifeOS
```

3. Or download [Latest Release](https://github.com/xileshuo/BrainCore-LifeOS/releases/latest) and place `main.js`, `manifest.json`, and `styles.css` in `.obsidian/plugins/braincore-lifeos/`
4. Click the cloud ribbon icon, then start the 48-hour trial
5. After the trial, unlock with an activation code from Xiaohongshu

## Usage

1. **Morning:** open the cloud icon → check greeting / progress / quote → scan tasks
2. **Daytime:** capture ideas as they appear; push work from the task overview
3. **Evening:** complete habit check-ins; archive finished items when needed
4. **Weekly:** review the current Work note and plan the next week

BrainCore LifeOS is a **paid** LifeOS sidebar console for Obsidian vaults.
It brings capture, tasks, weekly work, habits, Moments notes, daily quotes, weather, time progress, and vault stats into one sidebar.

| Item | Details |
| --- | --- |
| Trial | Start a **48-hour full trial** inside the plugin |
| Unlock | **¥49.9** one-time payment, permanent activation per device fingerprint |
| Purchase | Contact the author on **Xiaohongshu**, send your device fingerprint, then paste the activation code |

Moments notes live under `读&写/Moments/YYYY.md`. Images go to `Boxes/图片`.
Dataview is optional. Do not delete core folders (Work, Boxes, 读&写).
Full help is also inside the plugin Usage Guide. Author: https://github.com/xileshuo