# BrainCore LifeOS

> **付费 · 48 小时试用 · ¥49.9 永久激活**

侧边栏控制台：捕捉、待办、周工作、习惯、Moments、统计与知识内化。

**English overview:** A paid LifeOS sidebar console — capture, tasks, weekly work, habits, Moments, and knowledge review. Free install · **48-hour trial** · **¥49.9** permanent unlock (Xiaohongshu).

版本与更新见 [Latest Release](https://github.com/xileshuo/BrainCore-LifeOS/releases/latest) · 标签 **Paid**（含免费试用）

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

## 安装与上手

1. 设置 → 第三方插件 → 浏览 → 搜索 **BrainCore LifeOS** → 安装并启用
2. 点侧栏云图标，开启 48 小时试用
3. 试用满意后：复制指纹 → 小红书下单 → 粘贴激活码

### 其他安装方式

**BRAT**：添加仓库

```text
https://github.com/xileshuo/BrainCore-LifeOS
```

**手动**：下载 [Latest Release](https://github.com/xileshuo/BrainCore-LifeOS/releases/latest) 的 `main.js`、`manifest.json` 到 `.obsidian/plugins/braincore-lifeos/`

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

### 4.1.2（当前）

- 定价更正：永久激活为 ¥49.9（试用满意后小红书联系作者下单）
- 社区介绍：补入精简使用说明；三张界面图全部展开；更新日志保留近 10 个版本（当前展开、其余折叠）

<details>
<summary>4.1.1</summary>

- 社区介绍：置顶三张界面预览图，中文排版收紧；英文说明加长以便目录检测
- 发布：同步仓库根与 Release 的 manifest，避免版本不一致警告

</details>

<details>
<summary>4.1.0</summary>

- 文档：社区介绍改为中文为主、英文为辅，去掉中英混排与重复段落

</details>

<details>
<summary>4.0.9</summary>

- 社区审核：authorUrl 改为 GitHub 个人主页（不可指向本插件仓库）
- 文档：公开 README 加强英文概览，避免中文使用说明淹没英文检测

</details>

<details>
<summary>4.0.8</summary>

- 社区审核：manifest 描述去 Obsidian 词并补句末标点；authorUrl 改为可访问的 GitHub 仓库
- 文档：README 补英文安装/使用说明；定价 ¥99.9 永久激活（试用满意后小红书联系下单）
- 许可：仓库 LICENSE 改为可识别的 MIT，并保留试用后需激活的商业说明

</details>

<details>
<summary>4.0.7</summary>

- 社区分发：公开包改为 48 小时试用，到期后需激活码（市场可免费安装）
- 文档：补充 Paid + 试用说明与 LICENSE，便于提交 Obsidian 社区目录

</details>

<details>
<summary>4.0.6</summary>

- 金句：改为 Scripts/braincore-quote-index.json 增量索引，覆盖全部读书笔记与随笔（不再限最新 80 本）
- 金句：改/删划线或随笔会同步更新池；每日新增笔记分批进池；展示尽量不重复，轮完再洗牌
- 金句：后台分批追平，避免全库硬扫造成卡顿

</details>

<details>
<summary>4.0.5</summary>

- 统计：跨日后强刷「今日累计」——Obsidian 挂后台过夜也不再沿用昨天的 ↑N；午夜定时 + 切回前台都会按日历日重算
- 统计：自愈「date 已是今天但基线滞后」——把 ctime 早于今天的文件并回基线，避免一直显示昨天的净增
- 控制台：跨日同步刷新习惯「今日」高亮与问候/日期条，不必重开插件或重启 Obsidian

</details>

<details>
<summary>4.0.4</summary>

- 授权：激活码改为 licenseKeys 数组保存，手机/电脑各自激活后互不覆盖（兼容旧 licenseKey）

</details>

<details>
<summary>4.0.3</summary>

- 关于：所有作品改为纵向排列
- 套件：设置折叠区块去掉箭头，点标题仍可展开 / 收起（与 PlainLedger / 纪念日对齐）

</details>

---

## English

BrainCore LifeOS is a **paid** LifeOS sidebar console for Obsidian vaults.

Install free from Community Plugins (recommended), BRAT, or GitHub Releases.
Start a **48-hour full trial** inside the plugin. After the trial, unlock permanent use for **¥49.9** (one-time, per device fingerprint) via **Xiaohongshu**, then paste the activation code.

Features include fast capture, tasks, weekly work, habits, Moments notes, quotes, weather, and vault stats. Dataview is optional for richer dashboards.

- Author profile: https://github.com/xileshuo
- Repository: https://github.com/xileshuo/BrainCore-LifeOS
- Buy / support: Xiaohongshu (see Chinese section above)

This repository hosts the community distribution build and documentation. It does not include the full private source tree.