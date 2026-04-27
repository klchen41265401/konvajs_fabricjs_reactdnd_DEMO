import { Route } from 'react-router-dom';
import type { Category } from '../components/LauncherShell';
import AnimatingCrosses from './demos/AnimatingCrosses';
import AnimationEasing from './demos/AnimationEasing';
import CopyPaste from './demos/CopyPaste';
import ClippingMasking from './demos/ClippingMasking';
import CustomControls from './demos/CustomControls';
import CustomFilter from './demos/CustomFilter';
import DuotoneFilter from './demos/DuotoneFilter';
import DynamicPatterns from './demos/DynamicPatterns';
import EventsInspector from './demos/EventsInspector';
import FreeDrawing from './demos/FreeDrawing';
import ImportingPdf from './demos/ImportingPdf';
import Intersection from './demos/Intersection';
import RealtimeLanczos from './demos/RealtimeLanczos';
import LoadingCustomFonts from './demos/LoadingCustomFonts';
import ManageSelection from './demos/ManageSelection';
import PolygonControls from './demos/PolygonControls';
import Shadows from './demos/Shadows';
import StrokeUniform from './demos/StrokeUniform';
import SuperSubscript from './demos/SuperSubscript';
import SvgCaching from './demos/SvgCaching';
import TextOnPath from './demos/TextOnPath';
import VideoElement from './demos/VideoElement';
import Kitchensink from './demos/Kitchensink';

const base = '/fabricjs';

export const fabricCategories: Category[] = [
  {
    name: '⭐ Showcase',
    demos: [
      { path: `${base}/kitchensink`, name: 'Kitchensink (Canva 風編輯器)', desc: '類似 Canva / Figma 自由創作編輯器 · 加形狀 文字 圖片 SVG 漸層 · 濾鏡 圖層 群組 JSON 匯入匯出 · keywords: canva figma 設計 海報 編輯器 all-in-one' }
    ]
  },
  {
    name: 'Animation 動畫',
    demos: [
      { path: `${base}/animating-crosses`, name: 'Animating crosses', desc: '數十個十字同時用 util.animate 並行動畫 · 展示多物件動畫效能 · keywords: 動畫 並行 batch animation 多物件' },
      { path: `${base}/animation-easing`, name: 'Animation easing', desc: '一次對照 25+ 種 easing 緩動函數 (linear/quad/cubic/elastic/bounce) · keywords: easing tween 緩動 彈跳 回彈 曲線' }
    ]
  },
  {
    name: 'Editing 編輯',
    demos: [
      { path: `${base}/copy-paste`, name: 'Copy and paste', desc: '複製貼上物件 Ctrl+C/V/X/Delete · 類似繪圖軟體選取複製 · keywords: clipboard 複製 貼上 剪下 刪除 快捷鍵' },
      { path: `${base}/manage-selection`, name: 'Manage selection', desc: '程式碼控制選取狀態 · 全選 反選 依類型選取 · keywords: selection 多選 全選 過濾 選取管理' }
    ]
  },
  {
    name: 'Effects 特效',
    demos: [
      { path: `${base}/clipping-masking`, name: 'Clipping and masking', desc: '用 clipPath 把圖片裁成圓/矩/三角/星形遮罩 · 類似 Photoshop 剪裁遮色片 · keywords: mask 遮罩 裁切 clip 形狀裁切 photoshop' },
      { path: `${base}/shadows`, name: 'Shadows', desc: '物件陰影：顏色 模糊 偏移 · 類似 CSS box-shadow · keywords: 陰影 shadow 發光 glow 景深' }
    ]
  },
  {
    name: 'Controls 控制點',
    demos: [
      { path: `${base}/custom-controls`, name: 'Custom controls', desc: '客製 Transformer 控制點 · 自訂刪除/複製按鈕 拉桿位置樣式 · keywords: control handle 控制點 刪除按鈕 自訂' },
      { path: `${base}/polygon-controls`, name: 'Polygon controls', desc: '多邊形頂點編輯器 · 拖曳每個頂點改變形狀 · 類似 CAD / 向量編輯路徑 · keywords: polygon vertex 頂點 多邊形 路徑編輯 cad' }
    ]
  },
  {
    name: 'Filters 濾鏡',
    demos: [
      { path: `${base}/custom-filter`, name: 'Custom filter', desc: '自訂 WebGL shader 濾鏡 (RedifyFilter 紅調) · keywords: shader glsl webgl 濾鏡 自訂' },
      { path: `${base}/duotone-filter`, name: 'Duotone filter', desc: '雙色調 Duotone 濾鏡 (暗→深 亮→淺) · 類似 Spotify 封面風格 · keywords: duotone 雙色 spotify 濾鏡 風格化' },
      { path: `${base}/realtime-lanczos`, name: 'Realtime lanczos', desc: '即時 Lanczos 高品質縮放演算法 · keywords: lanczos 縮放 高解析 影像處理 超取樣' }
    ]
  },
  {
    name: 'Patterns / Events / Drawing',
    demos: [
      { path: `${base}/dynamic-patterns`, name: 'Dynamic patterns', desc: '動態 canvas 作 fabric.Pattern 重複填充 (圓點/條紋/棋盤/斜線) · keywords: pattern 圖樣 條紋 圓點 平鋪 背景' },
      { path: `${base}/events-inspector`, name: 'Events inspector', desc: '即時監看所有 mouse/keyboard/object/canvas 事件 · 開發 debug 用 · keywords: event 事件 debug 監聽 log inspector' },
      { path: `${base}/free-drawing`, name: 'Free drawing', desc: '自由筆刷 Pencil/Circle/Spray/Pattern 四種 · 類似小畫家 / MS Paint / Procreate · keywords: 畫筆 筆刷 小畫家 paint 塗鴉 繪圖 whiteboard' }
    ]
  },
  {
    name: 'File / Geometry',
    demos: [
      { path: `${base}/importing-pdf`, name: 'Importing PDF files', desc: '匯入 PDF 檔到 Canvas · 逐頁載入可編輯 · 類似 PDF 編輯器 · keywords: pdf 匯入 import 文件 pdf編輯' },
      { path: `${base}/intersection`, name: 'Intersection', desc: '物件碰撞偵測 · AABB 點擊測試 包圍盒交集 · keywords: intersect 碰撞 aabb 交集 hit-test 偵測' }
    ]
  },
  {
    name: 'Typography 字型',
    demos: [
      { path: `${base}/loading-custom-fonts`, name: 'Loading custom fonts', desc: '動態載入 Google Fonts / 自訂字型並套用 · keywords: google fonts 字型 font 載入 自訂' },
      { path: `${base}/super-subscript`, name: 'Superscript/Subscript', desc: '文字上標下標 (H₂O X²) · 類似 Word 公式排版 · keywords: 上標 下標 化學式 數學 word 排版' },
      { path: `${base}/text-on-path`, name: 'Text on path', desc: '文字沿曲線 / 波浪 / 圓形排列 · 類似徽章 / 印章文字 · keywords: 曲線文字 徽章 印章 sticker 環形文字 path' }
    ]
  },
  {
    name: 'Styling / Media',
    demos: [
      { path: `${base}/stroke-uniform`, name: 'Stroke uniform', desc: 'strokeUniform：縮放物件時邊框粗細保持不變 · keywords: 邊框 stroke 等比 縮放 粗細不變' },
      { path: `${base}/svg-caching`, name: 'SVG caching', desc: 'SVG 載入與快取機制 · 支援複雜 SVG 高效能渲染 · keywords: svg 向量 icon 快取 import svg' },
      { path: `${base}/video-element`, name: 'Video element', desc: '在 Canvas 上播放 HTML5 video 並當 fabric 物件操作 · keywords: video 影片 mp4 播放 canvas 視訊' }
    ]
  }
];

export const fabricRoutes = [
  <Route key="ac" path="/fabricjs/animating-crosses" element={<AnimatingCrosses />} />,
  <Route key="ae" path="/fabricjs/animation-easing" element={<AnimationEasing />} />,
  <Route key="cp" path="/fabricjs/copy-paste" element={<CopyPaste />} />,
  <Route key="cm" path="/fabricjs/clipping-masking" element={<ClippingMasking />} />,
  <Route key="cc" path="/fabricjs/custom-controls" element={<CustomControls />} />,
  <Route key="cf" path="/fabricjs/custom-filter" element={<CustomFilter />} />,
  <Route key="df" path="/fabricjs/duotone-filter" element={<DuotoneFilter />} />,
  <Route key="dp" path="/fabricjs/dynamic-patterns" element={<DynamicPatterns />} />,
  <Route key="ei" path="/fabricjs/events-inspector" element={<EventsInspector />} />,
  <Route key="fd" path="/fabricjs/free-drawing" element={<FreeDrawing />} />,
  <Route key="ip" path="/fabricjs/importing-pdf" element={<ImportingPdf />} />,
  <Route key="in" path="/fabricjs/intersection" element={<Intersection />} />,
  <Route key="rl" path="/fabricjs/realtime-lanczos" element={<RealtimeLanczos />} />,
  <Route key="lf" path="/fabricjs/loading-custom-fonts" element={<LoadingCustomFonts />} />,
  <Route key="ms" path="/fabricjs/manage-selection" element={<ManageSelection />} />,
  <Route key="pc" path="/fabricjs/polygon-controls" element={<PolygonControls />} />,
  <Route key="sh" path="/fabricjs/shadows" element={<Shadows />} />,
  <Route key="su" path="/fabricjs/stroke-uniform" element={<StrokeUniform />} />,
  <Route key="ss" path="/fabricjs/super-subscript" element={<SuperSubscript />} />,
  <Route key="sv" path="/fabricjs/svg-caching" element={<SvgCaching />} />,
  <Route key="tp" path="/fabricjs/text-on-path" element={<TextOnPath />} />,
  <Route key="ve" path="/fabricjs/video-element" element={<VideoElement />} />,
  <Route key="ks" path="/fabricjs/kitchensink" element={<Kitchensink />} />
];
