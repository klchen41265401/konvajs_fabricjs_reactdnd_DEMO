# Canvas & DnD Library Demos

純前端展示 **Fabric.js / Konva.js / React-DnD** 的 100+ 個官方範例 + 自製 Showcase。Vite + React 18 + TypeScript。

## 線上 Demo

🔗 https://klchen41265401.github.io/konvajs_fabricjs_reactdnd_DEMO/

## 內容

| 函式庫 | 範例數 | 特色 |
|---|---|---|
| 🎨 Fabric.js | 23 | 含 **Kitchensink**（類 Canva 自由創作編輯器） |
| 🖼️ Konva.js | 67 | 含 **Spreadsheet**（類 Excel 試算表） |
| 🔀 React-DnD | 15 | 含西洋棋教學、Sortable、Drop Effects |

## 功能

- ✅ 亮 / 暗主題（自動記憶 localStorage）
- ✅ RWD：桌面 / 平板 / 手機完整適配
- ✅ 手機抽屜式側邊欄（漢堡鈕）
- ✅ Konva Stage 自動依容器寬度縮放（`<ResponsiveStage>`）
- ✅ Fabric Canvas CSS 縮放保持點擊精度
- ✅ React-DnD 全部用 TouchBackend 同時支援 mouse + touch
- ✅ launcher 黏頂搜尋列 + 計數徽章（可搜「excel / canva / figma / miro / trello / 小畫家」等關鍵字）
- ✅ 純前端，所有狀態存記憶體，重整即清空

## 開發

```bash
npm install
npm run dev          # http://localhost:5173
npm run typecheck    # tsc --noEmit
npm run build        # 本機 build (base = '/')
```

## 部署 GitHub Pages

push 到 `main` 後 GitHub Actions 自動 build + 部署：

```yaml
# .github/workflows/deploy.yml 已設好
env:
  GITHUB_PAGES: '1'   # 讓 vite 用 /konvajs_fabricjs_reactdnd_DEMO/ 子路徑
```

第一次推完之後，去 GitHub Repo → Settings → Pages，把 Source 設成 **GitHub Actions**。

## 技術棧

- Vite 5 / React 18 / TypeScript 5
- Fabric.js 5.3 / Konva.js 9.3 + react-konva 18.2
- React-DnD 16 (HTML5Backend + TouchBackend)
- React Router 6 (HashRouter，Pages SPA 友善)

## 路由結構

```
/                       總覽
/#/fabricjs             Fabric.js launcher
/#/fabricjs/kitchensink Canva-like 編輯器
/#/konvajs              Konva.js launcher
/#/konvajs/spreadsheet  Excel-like 試算表
/#/reactdnd             React-DnD launcher
/#/reactdnd/chessboard  西洋棋教學
```
