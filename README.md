# BrainCore LifeOS
> **付费插件 · 48 小时免费试用 · ¥99.9 永久激活**
知识库侧边栏控制台：捕捉、待办、周工作、习惯、Moments、统计与知识内化。
当前版本：**4.1.0**
## 定价
| 项目 | 说明 |
| --- | --- |
| 安装 | 社区插件 / BRAT / GitHub **免费安装** |
| 试用 | 插件内开启后 **48 小时**全功能 |
| 付费 | **¥99.9** 一次付费，按设备指纹永久激活 |
| 购买 | 试用满意后，**小红书联系作者下单付款** → 复制设备指纹 → 粘贴激活码 |
- 作者主页：https://github.com/xileshuo
- 小红书：https://xhslink.com/m/3uOoUHv2rI1
## 功能一览
- 侧边栏控制台（捕捉 / 待办 / 周工作 / 打卡 / 统计）
- Moments：速记、筛选、分享图、年度报告
- 金句、天气、时间进度
- 建议搭配 **Dataview**（统计更完整；非必须）
## 安装

### 社区插件

设置 → 第三方插件 → 浏览 → 搜索 **BrainCore LifeOS** → 安装 → 启用。

### BRAT

1. 安装并启用 **BRAT**
2. 添加仓库：

```text
https://github.com/xileshuo/BrainCore-LifeOS
```

3. 启用插件；之后可用 BRAT 检查更新。

### 手动安装

下载 [Latest Release](https://github.com/xileshuo/BrainCore-LifeOS/releases/latest) 的 `main.js`、`manifest.json` 到 `.obsidian/plugins/braincore-lifeos/`。
## 上手
1. 点侧栏云图标打开控制台
2. 按提示开启 **48 小时试用**
3. 到期后：复制指纹 → 小红书下单 → 粘贴激活码
4. 详细说明：插件内「使用说明」/ 设置 → 关于
## 更新日志
### 4.1.0

- 文档：社区介绍改为中文为主、英文为辅，去掉中英混排与重复段落

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
---
## English
**BrainCore LifeOS** is a paid LifeOS sidebar console with a **48-hour free trial**, then **¥99.9** one-time permanent activation (per device fingerprint).
Install free from Community Plugins / BRAT / GitHub. After trial, contact the author on **Xiaohongshu** to pay, copy the device fingerprint in the plugin, and paste the activation code.
- Capture, tasks, weekly work, habits, Moments, and vault stats
- Author: https://github.com/xileshuo
- Repo: https://github.com/xileshuo/BrainCore-LifeOS
This repository distributes the community build and docs; it does not include the full private source tree.