# BrainCore 提交 Obsidian 社区插件（Paid + 48h 试用）

## 产品形态

| 环节 | 行为 |
|------|------|
| 安装 | 社区插件目录 / BRAT / GitHub **免费下载** |
| 试用 | 插件内开启后 **48 小时**全功能 |
| 到期 | **¥49.9** 永久激活：小红书联系作者下单付款 → 复制设备指纹换激活码 |

社区后台标签请选：**Paid**（含免费试用）。Obsidian **不代收款**。

## 当前状态（2026-09-16）

| 渠道 | 状态 |
|------|------|
| 网站介绍页 [community.obsidian.md/plugins/braincore-lifeos](https://community.obsidian.md/plugins/braincore-lifeos) | ✅ 可打开 |
| GitHub Release `4.1.9`（Latest，`main.js` + `manifest.json`） | ✅ 正常 |
| 官方目录 `community-plugins.json`（应用内市场搜索） | ❌ **尚未收录** → 设置里搜不到 |

说明：介绍页可以先上线；**应用内可搜/可装**要等目录收录。官方文档写明：自动化审核仍有 Error 时，即使点了 Publish，Obsidian 里也装不了。

## 你要做的（进应用内市场）

1. 打开 [community.obsidian.md](https://community.obsidian.md) → **Sign in**（Obsidian 账号）
2. 确认 GitHub 账号 `xileshuo` 已绑定到个人资料
3. 进入 Developer dashboard → 打开 **BrainCore LifeOS**（`xileshuo/BrainCore-LifeOS`）
4. 看 **Scorecard**：先清掉全部 **Error**（Warning/推荐项可后补）
5. 改完仓库后打新 Release（版本号与 tag 一致、无 `v` 前缀），再在后台点 **Publish**
6. 收录进 `community-plugins.json` 后，设置 → 第三方插件 → 浏览即可搜到

官方流程：https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin

## 上架前检查

- [x] 公开 Release 使用 **48小时体验版**（`PLUGIN_TRIAL_HOURS=48` + 需激活）
- [x] 仓库根有可识别的 `LICENSE`（MIT）与双语 `README.md`（安装 / 使用 / 定价）
- [x] `manifest.description` 不含单词 Obsidian，并以句号结尾
- [x] `authorUrl` 使用 GitHub **个人主页**（不可指向本插件仓库；小红书短链对审核爬虫会 403）
- [x] 个人版独立 id：`braincore-lifeos-personal`（避免社区更新覆盖）
- [x] GitHub Release 含 `main.js`、`manifest.json`；**tag = 版本号且无 `v` 前缀**（当前 `4.1.9`）
- [ ] Developer dashboard → Scorecard **无 Error** → Publish
- [ ] 确认已出现在 `community-plugins.json`（应用内可搜）

## 发布命令

```bash
# 从 Projects 根目录
node deploy-github-public-brat.mjs --only=braincore
# 或桌面四包：
# cd braincore-lifeos && node pack-desktop-all.mjs
```

## 注意

- 审核「推荐」项（CI 证明、vault 枚举、剪贴板、localStorage）一般不阻断；优先修 Error / Warning。
- 行为类推荐无需为过审改产品能力。
- 未进目录前可用 BRAT：`https://github.com/xileshuo/BrainCore-LifeOS`
