import { Route } from 'react-router-dom';
import type { Category } from '../components/LauncherShell';

// Showcase
import Spreadsheet from './demos/Spreadsheet';

// CAD
import CanvasEditor from './demos/CanvasEditor';
import SimpleWindowFrame from './demos/SimpleWindowFrame';
import WindowFrameDesigner from './demos/WindowFrameDesigner';
import SeatsReservation from './demos/SeatsReservation';
import DrawingLabels from './demos/DrawingLabels';
import InteractiveBuildingMap from './demos/InteractiveBuildingMap';

// Tools
import SignaturePad from './demos/SignaturePad';
import BadgeMaker from './demos/BadgeMaker';
import RotateFlipImage from './demos/RotateFlipImage';
import InfiniteCanvas from './demos/InfiniteCanvas';
import HeatmapGenerator from './demos/HeatmapGenerator';
import CropImage from './demos/CropImage';
import Watermark from './demos/Watermark';
import CanvasOverlay from './demos/CanvasOverlay';
import StickerEditor from './demos/StickerEditor';

// Games & Apps
import WheelOfFortune from './demos/WheelOfFortune';
import CanvasDrawing from './demos/CanvasDrawing';
import AnimalsOnTheBeach from './demos/AnimalsOnTheBeach';
import PlanetsImageMap from './demos/PlanetsImageMap';
import PhysicsSimulator from './demos/PhysicsSimulator';

// Common Use Cases
import EditableText from './demos/EditableText';
import RichTextRendering from './demos/RichTextRendering';
import CanvasScrolling from './demos/CanvasScrolling';
import ScrollByEdgeDrag from './demos/ScrollByEdgeDrag';
import GifAnimation from './demos/GifAnimation';
import DisplayVideo from './demos/DisplayVideo';
import SvgOnCanvas from './demos/SvgOnCanvas';
import CanvasBackground from './demos/CanvasBackground';
import TransparentGroup from './demos/TransparentGroup';
import FlipImage from './demos/FlipImage';
import CanvasToPdf from './demos/CanvasToPdf';
import CustomFont from './demos/CustomFont';
import RelativePointerPosition from './demos/RelativePointerPosition';
import DropDomElement from './demos/DropDomElement';
import ObjectsSnapping from './demos/ObjectsSnapping';
import ZoomRelativeToPointer from './demos/ZoomRelativeToPointer';
import ContextMenu from './demos/ContextMenu';
import ImageScaleToFit from './demos/ImageScaleToFit';
import LimitResizeDrag from './demos/LimitResizeDrag';

// Performance
import DragDropStress from './demos/DragDropStress';
import AnimationStress from './demos/AnimationStress';
import BunniesStress from './demos/BunniesStress';
import TenThousandShapes from './demos/TenThousandShapes';
import TwentyThousandNodes from './demos/TwentyThousandNodes';
import ResizingStress from './demos/ResizingStress';
import QuantumSquiggle from './demos/QuantumSquiggle';

// Other Random
import WebWorker from './demos/WebWorker';
import StarSpinner from './demos/StarSpinner';
import ConnectedObjects from './demos/ConnectedObjects';
import ManualImageResize from './demos/ManualImageResize';
import StagePreview from './demos/StagePreview';
import ModifyCurvesAnchors from './demos/ModifyCurvesAnchors';
import ImageBorder from './demos/ImageBorder';
import CollisionDetection from './demos/CollisionDetection';
import ElasticStars from './demos/ElasticStars';
import ShapeTango from './demos/ShapeTango';
import ImageBorderHighlighting from './demos/ImageBorderHighlighting';
import ZoomLayerOnHover from './demos/ZoomLayerOnHover';
import ResponsiveCanvasStage from './demos/ResponsiveCanvasStage';
import TouchGestures from './demos/TouchGestures';
import MultiTouchScaleShape from './demos/MultiTouchScaleShape';
import MultiTouchScaleStage from './demos/MultiTouchScaleStage';
import ModifyShapeColorClick from './demos/ModifyShapeColorClick';
import ExpandImagesHover from './demos/ExpandImagesHover';
import ShapeTooltip from './demos/ShapeTooltip';
import DragMultipleShapes from './demos/DragMultipleShapes';

const b = '/konvajs';

export const konvaCategories: Category[] = [
  {
    name: '⭐ Showcase',
    demos: [
      { path: `${b}/spreadsheet`, name: 'Spreadsheet (Excel-like)', desc: '類似 Excel / Google Sheets 試算表 · 公式 =SUM/AVG/MAX/MIN/COUNT · 欄寬拖曳 鍵盤導覽 CSV 匯出 · keywords: excel spreadsheet sheet 試算表 google sheets 公式 formula 表格 儲存格' }
    ]
  },
  {
    name: 'CAD Systems',
    demos: [
      { path: `${b}/canvas-editor`, name: 'Canvas Editor', desc: '類似 Figma / 簡易繪圖編輯器 · 加矩形/圓/星/線/文字 · 拖曳縮放旋轉 匯出 PNG · keywords: figma 編輯器 editor 圖形 向量 ppt' },
      { path: `${b}/simple-window-frame`, name: 'Simple Window Frame', desc: '簡易窗戶 / 門框 CAD 設計 · keywords: cad 窗戶 門 框 建築 設計' },
      { path: `${b}/window-frame-designer`, name: 'Window Frame Designer', desc: '窗框設計器進階版 · 可變寬高 多格窗 尺寸標註 · keywords: cad 窗戶 訂製 尺寸 設計 建築' },
      { path: `${b}/seats-reservation`, name: 'Seats Reservation', desc: '座位預定系統 · 劇場 / 演唱會 venue 座位圖 (已售/可售/選取) · keywords: 訂位 劇場 演唱會 電影院 座位 selector' },
      { path: `${b}/drawing-labels`, name: 'Drawing Labels on Image', desc: '影像標註工具 · 照片上畫框標記物件 · 類似 LabelImg / CVAT / Roboflow · keywords: 標註 annotation label bounding box 影像 標籤 labelimg cvat' },
      { path: `${b}/building-map`, name: 'Interactive Building Map', desc: '互動樓層平面圖 · 點擊房間顯示資訊 · 類似商場導覽圖 · keywords: 平面圖 樓層 商場 導覽 map floor plan' }
    ]
  },
  {
    name: 'Tools',
    demos: [
      { path: `${b}/signature-pad`, name: 'Signature Pad', desc: '手寫簽名板 · 粗細顏色可調 儲存 PNG · 類似合約電子簽名 · keywords: 簽名 signature 電子簽章 合約 手寫' },
      { path: `${b}/badge-maker`, name: 'Badge Maker', desc: '徽章 / 識別證 / 名牌產生器 · 頭像+文字+背景 · keywords: badge 徽章 識別證 名牌 會議 名片' },
      { path: `${b}/rotate-flip-image`, name: 'Rotate & Flip Image', desc: '旋轉翻轉圖片 · 90° 旋轉 / 水平 / 垂直翻轉 · keywords: 旋轉 翻轉 rotate flip mirror 編輯 圖片' },
      { path: `${b}/infinite-canvas`, name: 'Infinite Canvas', desc: '無限畫布 · 拖曳平移 滾輪縮放無邊界 · 類似 Miro / FigJam / Excalidraw · keywords: miro figjam excalidraw whiteboard 白板 無限' },
      { path: `${b}/heatmap`, name: 'Heatmap Generator', desc: '熱力圖產生器 · 點擊累積熱區顯示 · 類似 Hotjar 點擊熱圖 · keywords: heatmap 熱力圖 hotjar 點擊追蹤 熱區' },
      { path: `${b}/crop-image`, name: 'Crop Image', desc: '裁切圖片 · 四角拖曳調整裁切區域 · 類似 Instagram / Photoshop 裁切 · keywords: crop 裁切 剪裁 instagram photoshop 截圖' },
      { path: `${b}/watermark`, name: 'Watermark', desc: '浮水印工具 · 重複鋪滿文字浮水印 · 角度 / 透明度可調 · keywords: watermark 浮水印 版權 © 文字鋪排' },
      { path: `${b}/canvas-overlay`, name: 'Canvas Overlay', desc: 'Canvas 覆蓋在 HTML 圖片上做互動標記 · 類似地圖標點 · keywords: overlay 標記 map 地圖 標點 pin 互動' },
      { path: `${b}/sticker-editor`, name: 'Sticker Editor', desc: '貼紙編輯器 · 載入圖+加 emoji 貼紙+拖曳縮放 · 類似 Snapchat / IG 限動編輯 · keywords: sticker 貼紙 emoji snapchat instagram ig 限動 stories' }
    ]
  },
  {
    name: 'Games & Apps',
    demos: [
      { path: `${b}/wheel-of-fortune`, name: 'Wheel of Fortune', desc: '幸運輪盤抽獎 · 按 SPIN 隨機轉動停獎項 · 類似轉盤抽獎 · keywords: 輪盤 抽獎 轉盤 spin 抽抽樂 wheel lottery' },
      { path: `${b}/canvas-drawing`, name: 'Canvas Drawing', desc: '完整繪圖 App · 筆刷/橡皮擦/顏色/粗細/Undo/匯出 · 類似小畫家 / Paint · keywords: 小畫家 paint 塗鴉 whiteboard 手寫 橡皮擦 eraser 繪圖' },
      { path: `${b}/animals-beach`, name: 'Animals on the Beach', desc: '海灘動物 · 拖曳 emoji 動物在沙灘 · 類似互動童書場景 · keywords: 童書 互動 動物 emoji 場景 拖曳' },
      { path: `${b}/planets`, name: 'Planets Image Map', desc: '太陽系行星熱區 · 點擊行星顯示事實 · 類似 image map 熱區 · keywords: image map 熱區 太陽系 行星 hotspot 互動' },
      { path: `${b}/physics`, name: 'Physics Simulator', desc: '物理模擬器 · 球體重力+碰撞反彈+摩擦力 · 類似彈珠台 / pinball · keywords: 物理 physics 彈跳 重力 gravity 碰撞 彈珠台' }
    ]
  },
  {
    name: 'Common Use Cases',
    demos: [
      { path: `${b}/editable-text`, name: 'Editable Text', desc: '雙擊 Text 轉 HTML textarea 即時編輯 · 類似 Figma / PPT 文字編輯 · keywords: 可編輯 雙擊 textarea 文字編輯 figma ppt' },
      { path: `${b}/rich-text`, name: 'Rich Text rendering', desc: '富文本 · 混合粗體 / 斜體 / 顏色 · 類似 Word 段落排版 · keywords: rich text 富文本 粗體 斜體 混合 段落' },
      { path: `${b}/canvas-scrolling`, name: 'Canvas Scrolling', desc: '大畫布在小視窗內捲動瀏覽 · keywords: scroll 捲動 大畫布 viewport 大地圖' },
      { path: `${b}/scroll-edge`, name: 'Scroll by Edge Drag', desc: '拖曳到畫布邊緣自動捲動鏡頭 · 類似 RTS 遊戲 / 魔獸爭霸地圖 · keywords: rts 遊戲 邊緣捲動 鏡頭 camera 魔獸' },
      { path: `${b}/gif-animation`, name: 'Gif Animation', desc: 'Konva.Sprite 多幀動畫 · 類似 GIF / 遊戲角色行走 · keywords: gif sprite 幀動畫 角色 sprite sheet 動畫' },
      { path: `${b}/display-video`, name: 'Display Video', desc: 'Canvas 上播放 MP4 影片並同步更新 · keywords: video 影片 mp4 播放 播放器' },
      { path: `${b}/svg-on-canvas`, name: 'SVG on Canvas', desc: 'SVG path 轉 Konva.Path 渲染 (星/愛心/箭頭) · keywords: svg path 向量 icon 圖示' },
      { path: `${b}/canvas-bg`, name: 'Canvas Background', desc: 'Stage 背景用 CSS 圖片 Konva layer 疊上 · keywords: 背景 background 圖片 bg 底圖' },
      { path: `${b}/transparent-group`, name: 'Transparent Group', desc: '半透明群組 · 整組物件統一透明度 · keywords: 透明 opacity 群組 group alpha' },
      { path: `${b}/flip-image`, name: 'Flip Image', desc: '水平/垂直翻轉圖片 (scaleX/Y = -1) · keywords: flip 翻轉 鏡像 mirror 水平 垂直' },
      { path: `${b}/canvas-to-pdf`, name: 'Canvas to PDF', desc: 'Canvas 匯出 PDF (透過瀏覽器列印) · keywords: pdf 匯出 列印 print 文件 save' },
      { path: `${b}/custom-font`, name: 'Custom Font', desc: '載入 Google Fonts (Bungee/Pacifico) 用於 Text · keywords: google fonts 字型 font web font' },
      { path: `${b}/relative-pointer`, name: 'Relative Pointer Position', desc: '滑鼠相對於縮放/平移 group 的正確座標 · keywords: pointer 座標 相對位置 zoom pan 縮放 平移' },
      { path: `${b}/drop-dom`, name: 'Drop DOM Element', desc: 'HTML 元素拖入 Canvas · 從側邊 list 拖彩色方塊到 stage · keywords: drag drop 拖曳 html dom 元素 拖進' },
      { path: `${b}/snapping`, name: 'Objects Snapping', desc: '物件自動對齊 · 拖曳時顯示黃色輔助線吸附邊緣/中心 · 類似 Figma / Sketch 智慧輔助線 · keywords: snap 對齊 輔助線 figma sketch guide 吸附' },
      { path: `${b}/zoom-to-pointer`, name: 'Zoom Relative To Pointer', desc: '滾輪以指標為中心縮放 · 類似 Google Maps 縮放 · keywords: zoom 縮放 指標 滾輪 google maps 地圖 wheel' },
      { path: `${b}/context-menu`, name: 'Context Menu', desc: '右鍵選單 · Delete / Bring to front / Change color · keywords: 右鍵 context menu 選單 命令' },
      { path: `${b}/image-scale-fit`, name: 'Image Scale To Fit', desc: 'object-fit: contain / cover 模擬 · 圖片依框縮放 · keywords: object fit contain cover 縮放 fit 填滿' },
      { path: `${b}/limit-resize-drag`, name: 'Limit Resize and Drag', desc: '限制縮放最小/最大尺寸 · 拖曳不得超出舞台邊界 · keywords: 限制 bound 邊界 最小 最大 clamp' }
    ]
  },
  {
    name: 'Performance Tests',
    demos: [
      { path: `${b}/perf-dragdrop`, name: 'Drag & Drop Stress', desc: '拖曳壓力測試 · 100-500 可拖方塊 · FPS 顯示 · keywords: 效能 performance 壓力 fps 拖曳' },
      { path: `${b}/perf-anim`, name: 'Animation Stress', desc: '動畫壓力 · 200 個 Konva.Animation 同時跑 · keywords: 效能 fps 動畫 壓力 benchmark' },
      { path: `${b}/perf-bunnies`, name: 'Bunnies Stress', desc: '類 PixiJS bunnymark · 數千隻掉落物體 · keywords: bunny pixi 壓力 benchmark 效能 bunnymark' },
      { path: `${b}/perf-10k`, name: '10000 Shapes with Tooltip', desc: '1 萬形狀 + tooltip hit detection 極限測試 · keywords: 10000 效能 hit test 壓力' },
      { path: `${b}/perf-20k`, name: '20000 Nodes', desc: '2 萬節點渲染測試 · keywords: 20000 效能 nodes 壓力 大量' },
      { path: `${b}/perf-resize`, name: 'Resizing Stress', desc: '20 個 Transformer 同時縮放 · keywords: transformer 縮放 效能 壓力' },
      { path: `${b}/perf-quantum`, name: 'Quantum Squiggle', desc: '量子波形 · 多條正弦波相位疊加動畫 · keywords: wave 波形 正弦 sine 視覺 動畫' }
    ]
  },
  {
    name: 'Other Random',
    demos: [
      { path: `${b}/web-worker`, name: 'Web Worker', desc: 'Web Worker 計算質數不阻塞 UI · keywords: worker 多執行緒 背景 computation 不阻塞' },
      { path: `${b}/star-spinner`, name: 'Star Spinner', desc: '旋轉星形 Spinner (等速旋轉) · keywords: spinner 旋轉 loading 等速 星形' },
      { path: `${b}/connected`, name: 'Connected Objects', desc: '箭頭連接兩個可拖曳圓 · 連線隨拖曳更新 · 類似 draw.io / flowchart / 心智圖 · keywords: draw.io flowchart 流程圖 心智圖 連線 節點 node graph' },
      { path: `${b}/manual-resize`, name: 'Manual Image Resize', desc: '手動縮放圖片 · 四角 Circle 錨點自訂 Transformer · keywords: 手動 縮放 錨點 anchor 自訂 transformer' },
      { path: `${b}/stage-preview`, name: 'Stage Preview', desc: '主 stage + 側邊縮圖 mini-map · 類似 RTS 遊戲地圖縮圖 · keywords: minimap 縮圖 mini map 遊戲 預覽' },
      { path: `${b}/curves-anchors`, name: 'Modify Curves with Anchor Points', desc: '貝茲曲線錨點 · 拖錨點改變 tension 曲線 · 類似 Illustrator 鋼筆工具 · keywords: 貝茲 bezier 曲線 錨點 鋼筆 illustrator path 編輯' },
      { path: `${b}/image-border`, name: 'Image Border', desc: '圖片外框線樣式 (寬度/顏色/虛線) · keywords: border 邊框 框線 虛線 dash 外框' },
      { path: `${b}/collision`, name: 'Collision Detection', desc: '兩矩形 AABB 碰撞偵測 · 重疊時紅色高亮 · keywords: 碰撞 aabb 重疊 intersect 偵測' },
      { path: `${b}/elastic-stars`, name: 'Elastic Stars', desc: '星星彈性縮放動畫 (elastic easing) · keywords: elastic 彈性 動畫 星星 pulse 呼吸' },
      { path: `${b}/shape-tango`, name: 'Shape Tango', desc: '形狀合奏舞蹈 · 多物件同步正弦運動 · keywords: tango 同步 動畫 正弦 編舞 視覺' },
      { path: `${b}/image-highlight`, name: 'Image Border Highlighting', desc: '懸停圖片時邊框發光高亮 · keywords: hover 邊框 發光 highlight glow 懸停' },
      { path: `${b}/zoom-hover`, name: 'Zoom Layer On hover', desc: '懸停圖片放大至頂層 (自動縮放) · keywords: hover 放大 zoom 懸停 縮圖' },
      { path: `${b}/responsive-stage`, name: 'Responsive Canvas Stage', desc: '自適應 Stage · ResizeObserver 跟容器大小變化 · keywords: 自適應 responsive resize observer 跟隨' },
      { path: `${b}/touch-gestures`, name: 'Touch Gestures', desc: '觸控手勢 · tap/doubletap/longpress 事件記錄 · keywords: touch 觸控 手勢 gesture tap 長按 mobile' },
      { path: `${b}/multi-touch-shape`, name: 'Multi-touch Scale Shape', desc: '雙指捏合縮放單一形狀 · 類似手機相簿 pinch zoom · keywords: pinch 雙指 捏合 mobile 手機 多點觸控' },
      { path: `${b}/multi-touch-stage`, name: 'Multi-touch Scale Stage', desc: '雙指捏合縮放整個舞台 · 類似 Google Maps 手機縮放 · keywords: pinch zoom 舞台 stage mobile google maps' },
      { path: `${b}/click-color`, name: 'Modify Shape Color on Click', desc: '點擊方格循環切換 6 色 · 類似像素編輯格 · keywords: 點擊 切換 顏色 像素 pixel grid' },
      { path: `${b}/expand-hover`, name: 'Expand Images on Hover', desc: 'Netflix 式縮圖 · 懸停放大其餘縮窄 · keywords: netflix 縮圖 hover 列表 展開' },
      { path: `${b}/shape-tooltip`, name: 'Shape Tooltip', desc: '懸停形狀顯示 tooltip (Label + Tag + Text) · keywords: tooltip 提示 hover 標籤 label' },
      { path: `${b}/drag-multiple`, name: 'Drag Multiple Shapes', desc: '框選多物件 · 拖選取框整組同時拖 · 類似 Figma / 檔案總管框選 · keywords: 框選 rubber band 多選 整組 figma 選取' }
    ]
  }
];

export const konvaRoutes = [
  <Route key="k1" path="/konvajs/canvas-editor" element={<CanvasEditor />} />,
  <Route key="k2" path="/konvajs/simple-window-frame" element={<SimpleWindowFrame />} />,
  <Route key="k3" path="/konvajs/window-frame-designer" element={<WindowFrameDesigner />} />,
  <Route key="k4" path="/konvajs/seats-reservation" element={<SeatsReservation />} />,
  <Route key="k5" path="/konvajs/drawing-labels" element={<DrawingLabels />} />,
  <Route key="k6" path="/konvajs/building-map" element={<InteractiveBuildingMap />} />,
  <Route key="k7" path="/konvajs/signature-pad" element={<SignaturePad />} />,
  <Route key="k8" path="/konvajs/badge-maker" element={<BadgeMaker />} />,
  <Route key="k9" path="/konvajs/rotate-flip-image" element={<RotateFlipImage />} />,
  <Route key="k10" path="/konvajs/infinite-canvas" element={<InfiniteCanvas />} />,
  <Route key="k11" path="/konvajs/heatmap" element={<HeatmapGenerator />} />,
  <Route key="k12" path="/konvajs/crop-image" element={<CropImage />} />,
  <Route key="k13" path="/konvajs/watermark" element={<Watermark />} />,
  <Route key="k14" path="/konvajs/canvas-overlay" element={<CanvasOverlay />} />,
  <Route key="k15" path="/konvajs/sticker-editor" element={<StickerEditor />} />,
  <Route key="k16" path="/konvajs/wheel-of-fortune" element={<WheelOfFortune />} />,
  <Route key="k17" path="/konvajs/canvas-drawing" element={<CanvasDrawing />} />,
  <Route key="k18" path="/konvajs/animals-beach" element={<AnimalsOnTheBeach />} />,
  <Route key="k19" path="/konvajs/planets" element={<PlanetsImageMap />} />,
  <Route key="k20" path="/konvajs/physics" element={<PhysicsSimulator />} />,
  <Route key="k21" path="/konvajs/editable-text" element={<EditableText />} />,
  <Route key="k22" path="/konvajs/rich-text" element={<RichTextRendering />} />,
  <Route key="k23" path="/konvajs/canvas-scrolling" element={<CanvasScrolling />} />,
  <Route key="k24" path="/konvajs/scroll-edge" element={<ScrollByEdgeDrag />} />,
  <Route key="k25" path="/konvajs/gif-animation" element={<GifAnimation />} />,
  <Route key="k26" path="/konvajs/display-video" element={<DisplayVideo />} />,
  <Route key="k27" path="/konvajs/svg-on-canvas" element={<SvgOnCanvas />} />,
  <Route key="k28" path="/konvajs/canvas-bg" element={<CanvasBackground />} />,
  <Route key="k29" path="/konvajs/transparent-group" element={<TransparentGroup />} />,
  <Route key="k30" path="/konvajs/flip-image" element={<FlipImage />} />,
  <Route key="k31" path="/konvajs/canvas-to-pdf" element={<CanvasToPdf />} />,
  <Route key="k32" path="/konvajs/custom-font" element={<CustomFont />} />,
  <Route key="k33" path="/konvajs/relative-pointer" element={<RelativePointerPosition />} />,
  <Route key="k34" path="/konvajs/drop-dom" element={<DropDomElement />} />,
  <Route key="k35" path="/konvajs/snapping" element={<ObjectsSnapping />} />,
  <Route key="k36" path="/konvajs/zoom-to-pointer" element={<ZoomRelativeToPointer />} />,
  <Route key="k37" path="/konvajs/context-menu" element={<ContextMenu />} />,
  <Route key="k38" path="/konvajs/image-scale-fit" element={<ImageScaleToFit />} />,
  <Route key="k39" path="/konvajs/limit-resize-drag" element={<LimitResizeDrag />} />,
  <Route key="k40" path="/konvajs/perf-dragdrop" element={<DragDropStress />} />,
  <Route key="k41" path="/konvajs/perf-anim" element={<AnimationStress />} />,
  <Route key="k42" path="/konvajs/perf-bunnies" element={<BunniesStress />} />,
  <Route key="k43" path="/konvajs/perf-10k" element={<TenThousandShapes />} />,
  <Route key="k44" path="/konvajs/perf-20k" element={<TwentyThousandNodes />} />,
  <Route key="k45" path="/konvajs/perf-resize" element={<ResizingStress />} />,
  <Route key="k46" path="/konvajs/perf-quantum" element={<QuantumSquiggle />} />,
  <Route key="k47" path="/konvajs/web-worker" element={<WebWorker />} />,
  <Route key="k48" path="/konvajs/star-spinner" element={<StarSpinner />} />,
  <Route key="k49" path="/konvajs/connected" element={<ConnectedObjects />} />,
  <Route key="k50" path="/konvajs/manual-resize" element={<ManualImageResize />} />,
  <Route key="k51" path="/konvajs/stage-preview" element={<StagePreview />} />,
  <Route key="k52" path="/konvajs/curves-anchors" element={<ModifyCurvesAnchors />} />,
  <Route key="k53" path="/konvajs/image-border" element={<ImageBorder />} />,
  <Route key="k54" path="/konvajs/collision" element={<CollisionDetection />} />,
  <Route key="k55" path="/konvajs/elastic-stars" element={<ElasticStars />} />,
  <Route key="k56" path="/konvajs/shape-tango" element={<ShapeTango />} />,
  <Route key="k57" path="/konvajs/image-highlight" element={<ImageBorderHighlighting />} />,
  <Route key="k58" path="/konvajs/zoom-hover" element={<ZoomLayerOnHover />} />,
  <Route key="k59" path="/konvajs/responsive-stage" element={<ResponsiveCanvasStage />} />,
  <Route key="k60" path="/konvajs/touch-gestures" element={<TouchGestures />} />,
  <Route key="k61" path="/konvajs/multi-touch-shape" element={<MultiTouchScaleShape />} />,
  <Route key="k62" path="/konvajs/multi-touch-stage" element={<MultiTouchScaleStage />} />,
  <Route key="k63" path="/konvajs/click-color" element={<ModifyShapeColorClick />} />,
  <Route key="k64" path="/konvajs/expand-hover" element={<ExpandImagesHover />} />,
  <Route key="k65" path="/konvajs/shape-tooltip" element={<ShapeTooltip />} />,
  <Route key="k66" path="/konvajs/drag-multiple" element={<DragMultipleShapes />} />,
  <Route key="k67" path="/konvajs/spreadsheet" element={<Spreadsheet />} />
];
