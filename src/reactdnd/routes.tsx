import { Route } from 'react-router-dom';
import type { Category } from '../components/LauncherShell';

import DustbinSingle from './demos/DustbinSingle';
import DustbinMultiple from './demos/DustbinMultiple';
import DustbinStress from './demos/DustbinStress';
import DragNaive from './demos/DragNaive';
import DragCustomLayer from './demos/DragCustomLayer';
import NestingTargets from './demos/NestingTargets';
import NestingSources from './demos/NestingSources';
import SortableSimple from './demos/SortableSimple';
import SortableCancel from './demos/SortableCancel';
import CustomizeHandles from './demos/CustomizeHandles';
import CustomizeEffects from './demos/CustomizeEffects';
import Chessboard from './demos/Chessboard';
import CopyOrMove from './demos/CopyOrMove';
import NativeFiles from './demos/NativeFiles';
import TouchBackend from './demos/TouchBackend';

export const dndCategories: Category[] = [
  {
    name: 'Dustbin',
    demos: [
      { path: '/reactdnd/dustbin-single', name: 'Single Target', desc: '單一垃圾桶 · 一個方塊丟進去 · 類似檔案丟垃圾桶 / 收納盒 · keywords: dustbin 垃圾桶 drop 單一 收納' },
      { path: '/reactdnd/dustbin-multiple', name: 'Multiple Targets', desc: '多類垃圾桶 · 玻璃/食物/紙分類 · 類似垃圾分類遊戲 · keywords: 多類型 分類 資源回收 遊戲 分組' },
      { path: '/reactdnd/dustbin-stress', name: 'Stress Test', desc: '30 方塊 × 10 垃圾桶 · 大量物件效能壓力測試 · keywords: 壓力 效能 大量 stress performance' },
    ],
  },
  {
    name: 'Drag Around',
    demos: [
      { path: '/reactdnd/drag-naive', name: 'Naive', desc: '自由拖曳方塊 · 絕對定位移動 · 最基礎拖曳範例 · 類似 Windows 桌面圖示拖曳 · keywords: 拖曳 drag 自由 桌面 desktop 最簡' },
      { path: '/reactdnd/drag-custom-layer', name: 'Custom Drag Layer', desc: '自訂拖曳預覽層 · useDragLayer 畫跟隨滑鼠的視覺 · keywords: 自訂預覽 preview dragLayer ghost 視覺化 拖曳' },
    ],
  },
  {
    name: 'Nesting',
    demos: [
      { path: '/reactdnd/nesting-targets', name: 'Drop Targets', desc: '巢狀 drop 目標 · 外/內兩層 · 判斷落在哪層 · keywords: 巢狀 nested drop 內外 bubble stopPropagation' },
      { path: '/reactdnd/nesting-sources', name: 'Drag Sources', desc: '巢狀 drag 來源 · parent / child 獨立拖 · keywords: 巢狀 nested drag source 父子 獨立' },
    ],
  },
  {
    name: 'Sortable',
    demos: [
      { path: '/reactdnd/sortable-simple', name: 'Simple', desc: '清單排序 · 拖曳項目即時重排 · 類似 Trello 卡片 / Notion 段落 / 待辦清單 · keywords: sortable 排序 trello notion kanban todo 看板 清單 重排 reorder' },
      { path: '/reactdnd/sortable-cancel', name: 'Cancel on Drop Outside', desc: '拖出清單外自動取消恢復原順序 · keywords: 取消 cancel outside 還原 revert 排序' },
    ],
  },
  {
    name: 'Customize',
    demos: [
      { path: '/reactdnd/customize-handles', name: 'Handles and Previews', desc: '僅把手可拖 (右下小 icon) · 隱藏預設預覽 · keywords: handle 把手 握把 僅部分 preview' },
      { path: '/reactdnd/customize-effects', name: 'Drop Effects', desc: '按住 Ctrl 複製 · 放開為移動 · 顯示 drop effect · keywords: copy move ctrl 複製 移動 drop effect' },
    ],
  },
  {
    name: 'Other',
    demos: [
      { path: '/reactdnd/chessboard', name: 'Chessboard Tutorial', desc: '西洋棋馬 Knight L 型合法走法教學 · 官方經典範例 · keywords: chess 西洋棋 knight 馬 tutorial 官方 教學' },
      { path: '/reactdnd/copy-or-move', name: 'Copy or Move', desc: '兩清單間拖 · 預設移動 · Ctrl 複製 · 類似檔案總管 · keywords: 兩列表 複製 移動 explorer 檔案總管' },
      { path: '/reactdnd/native-files', name: 'Native Files', desc: '拖 OS 檔案進瀏覽器 · 顯示檔名大小 · 類似檔案上傳拖拉區 · keywords: 檔案上傳 file upload 拖拉 os native 拖檔' },
      { path: '/reactdnd/touch-backend', name: 'Touch Backend', desc: '觸控裝置拖曳支援 (TouchBackend) · 類似 mobile 版拖曳 · keywords: touch 觸控 mobile 手機 行動裝置 ios android' },
    ],
  },
];

export const dndRoutes = [
  <Route key="dustbin-single" path="/reactdnd/dustbin-single" element={<DustbinSingle />} />,
  <Route key="dustbin-multiple" path="/reactdnd/dustbin-multiple" element={<DustbinMultiple />} />,
  <Route key="dustbin-stress" path="/reactdnd/dustbin-stress" element={<DustbinStress />} />,
  <Route key="drag-naive" path="/reactdnd/drag-naive" element={<DragNaive />} />,
  <Route key="drag-custom-layer" path="/reactdnd/drag-custom-layer" element={<DragCustomLayer />} />,
  <Route key="nesting-targets" path="/reactdnd/nesting-targets" element={<NestingTargets />} />,
  <Route key="nesting-sources" path="/reactdnd/nesting-sources" element={<NestingSources />} />,
  <Route key="sortable-simple" path="/reactdnd/sortable-simple" element={<SortableSimple />} />,
  <Route key="sortable-cancel" path="/reactdnd/sortable-cancel" element={<SortableCancel />} />,
  <Route key="customize-handles" path="/reactdnd/customize-handles" element={<CustomizeHandles />} />,
  <Route key="customize-effects" path="/reactdnd/customize-effects" element={<CustomizeEffects />} />,
  <Route key="chessboard" path="/reactdnd/chessboard" element={<Chessboard />} />,
  <Route key="copy-or-move" path="/reactdnd/copy-or-move" element={<CopyOrMove />} />,
  <Route key="native-files" path="/reactdnd/native-files" element={<NativeFiles />} />,
  <Route key="touch-backend" path="/reactdnd/touch-backend" element={<TouchBackend />} />,
];
