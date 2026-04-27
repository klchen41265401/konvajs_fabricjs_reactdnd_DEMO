import { Routes, Route, Link } from 'react-router-dom';
import FabricLauncher from './fabricjs/Launcher';
import KonvaLauncher from './konvajs/Launcher';
import DndLauncher from './reactdnd/Launcher';
import { fabricRoutes } from './fabricjs/routes';
import { konvaRoutes } from './konvajs/routes';
import { dndRoutes } from './reactdnd/routes';
import ThemeToggle from './components/ThemeToggle';
import { fabricCategories } from './fabricjs/routes';
import { konvaCategories } from './konvajs/routes';
import { dndCategories } from './reactdnd/routes';

function totalOf(cats: { demos: unknown[] }[]) { return cats.reduce((s, c) => s + c.demos.length, 0); }

function Home() {
  const fabricCount = totalOf(fabricCategories);
  const konvaCount = totalOf(konvaCategories);
  const dndCount = totalOf(dndCategories);
  const grand = fabricCount + konvaCount + dndCount;

  return (
    <>
      <ThemeToggle />
      <header className="site-header">
        <h1>Canvas &amp; DnD Library Demos</h1>
        <p className="subtitle">純前端 · Vite + React + TypeScript · Fabric.js / Konva.js / React-DnD 全官方範例 + Canva 編輯器 + Excel 試算表</p>
        <div className="site-stats">
          <span className="chip">🎯 共 <strong>{grand}</strong> 個 demo</span>
          <span className="chip">🎨 Fabric <strong>{fabricCount}</strong></span>
          <span className="chip">🖼️ Konva <strong>{konvaCount}</strong></span>
          <span className="chip">🔀 React-DnD <strong>{dndCount}</strong></span>
        </div>
      </header>
      <main className="library-grid">
        <Link className="library-card fabric" to="/fabricjs">
          <div className="library-icon">🎨</div>
          <h2>Fabric.js</h2>
          <p>基於 HTML5 Canvas 的互動式物件模型庫</p>
          <ul>
            <li>{fabricCount} 個範例（含 Kitchensink Canva 編輯器）</li>
            <li>動畫 · 濾鏡 · SVG · 文字</li>
            <li>編輯 · 控制點 · 事件</li>
          </ul>
          <span className="library-cta">進入 →</span>
        </Link>
        <Link className="library-card konva" to="/konvajs">
          <div className="library-icon">🖼️</div>
          <h2>Konva.js</h2>
          <p>2D Canvas 函式庫，支援桌面與行動裝置</p>
          <ul>
            <li>{konvaCount} 個範例（含 Excel 試算表）</li>
            <li>CAD · 工具 · 遊戲 · 效能測試</li>
            <li>常用場景 · 觸控手勢</li>
          </ul>
          <span className="library-cta">進入 →</span>
        </Link>
        <Link className="library-card dnd" to="/reactdnd">
          <div className="library-icon">🔀</div>
          <h2>React-DnD</h2>
          <p>React 的拖放 API，支援 HTML5 與觸控後端</p>
          <ul>
            <li>{dndCount} 個官方範例</li>
            <li>Dustbin · Drag Around · Sortable</li>
            <li>Nesting · Customize · 西洋棋</li>
          </ul>
          <span className="library-cta">進入 →</span>
        </Link>
      </main>
      <footer className="site-footer">
        <p>所有狀態僅存記憶體，重新整理後清空 · 支援亮/暗主題 · RWD 手機版</p>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/fabricjs" element={<FabricLauncher />} />
      <Route path="/konvajs" element={<KonvaLauncher />} />
      <Route path="/reactdnd" element={<DndLauncher />} />
      {fabricRoutes}
      {konvaRoutes}
      {dndRoutes}
    </Routes>
  );
}
