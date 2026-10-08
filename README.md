# GLM 桌宠

一个基于 Electron 的透明像素风桌宠。角色素材来自 `C:\huahai` 中提供的四张参考帧。

## 功能

- 无边框、透明、置顶窗口
- 左键拖动桌宠，双击切换动作
- 右键菜单切换挥手、整理帽子、拉行李箱、喝饮料
- 托盘菜单控制显示、暂停动画和退出
- 原始参考图自动去背景并裁切为透明 PNG

## 本地运行

```powershell
npm install
npm start
```

如果需要重新生成素材：

```powershell
npm run extract-assets
```

## 结构

- `src/main.js`：Electron 主进程、窗口与托盘
- `src/renderer.js`：桌宠状态与交互
- `src/style.css`：像素风 UI 与动画
- `scripts/extract_sprites.py`：参考帧背景去除与裁切
