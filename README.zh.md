# BrainCore LifeOS

> **付费 · 48 小时试用 · ¥49.9 永久激活**

知识库侧边栏控制台（LifeOS）——捕捉、待办、周工作、习惯、统计与知识内化。

当前公开版本：**4.1.17 · 48 小时试用**

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

### 4.1.17（当前）

- 审核：天气仅 open-meteo；自动定位改系统定位，去掉 IP 库 / wttr Disclosure

<details>
<summary>4.1.16</summary>

- 审核：manifest.description 改以英文句号结尾（Scorecard 不认中文 。）

</details>

<details>
<summary>4.1.15</summary>

- 设置：体验包激活后标题显示「公版」，不再写「体验版/48小时体验版」

</details>

<details>
<summary>4.1.14</summary>

- 审核：manifest 英文 description；minAppVersion 升至 1.7.2
- 审核：捕捉/仪表盘/素材弹窗样式迁入静态 styles.css，去掉大量运行时 style 注入

</details>

<details>
<summary>4.1.13</summary>

- 公开 README：中文在前、英文在后（市场介绍优先中文）

</details>

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

下方为英文说明（社区审核）。

