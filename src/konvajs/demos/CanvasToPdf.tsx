import { useRef, useState } from 'react';
import { Layer, Rect, Circle, Text } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

type Shape =
  | { id: number; type: 'rect'; x: number; y: number; w: number; h: number; fill: string }
  | { id: number; type: 'circle'; x: number; y: number; r: number; fill: string };

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function CanvasToPdf() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [bg, setBg] = useState('#ffffff');
  const [shapes, setShapes] = useState<Shape[]>([
    { id: 1, type: 'rect', x: 80, y: 80, w: 140, h: 100, fill: '#3b82f6' },
    { id: 2, type: 'circle', x: 400, y: 180, r: 60, fill: '#f59e0b' },
  ]);

  const addRect = () => {
    const s: Shape = {
      id: Date.now() + Math.random(), type: 'rect',
      x: 60 + Math.random() * 400,
      y: 60 + Math.random() * 260,
      w: 80 + Math.random() * 80,
      h: 60 + Math.random() * 80,
      fill: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setShapes(arr => [...arr, s]);
  };

  const addCircle = () => {
    const s: Shape = {
      id: Date.now() + Math.random(), type: 'circle',
      x: 80 + Math.random() * 440,
      y: 80 + Math.random() * 280,
      r: 30 + Math.random() * 40,
      fill: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setShapes(arr => [...arr, s]);
  };

  const downloadPdf = (dataUrl: string) => {
    const w = window.open('');
    if (!w) return;
    w.document.write(
      `<html><head><title>Canvas PDF</title><style>body{margin:0;display:flex;align-items:center;justify-content:center;}img{max-width:100%;}</style></head><body><img src="${dataUrl}" onload="setTimeout(()=>window.print(),300)"/></body></html>`
    );
    w.document.close();
  };

  const exportPdf = () => {
    if (!stageRef.current) return;
    const url = stageRef.current.toDataURL({ pixelRatio: 2 });
    downloadPdf(url);
  };

  return (
    <DemoLayout title="📄 Canvas to PDF" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>背景顏色</label>
          <input type="color" title="背景顏色" value={bg} onChange={e => setBg(e.target.value)} />
        </div>
        <div className="control-group">
          <button type="button" onClick={addRect}>新增矩形</button>
          <button type="button" onClick={addCircle}>新增圓形</button>
        </div>
        <div className="control-group">
          <button type="button" onClick={() => setShapes([])}>清空</button>
        </div>
        <div className="control-group">
          <button type="button" onClick={exportPdf}>Export PDF</button>
        </div>
        <div className="info-box">點擊 Export 會開啟列印對話框，可存為 PDF。利用 stage.toDataURL 將畫布匯出為圖片，再透過瀏覽器原生列印功能輸出 PDF。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage ref={stageRef} designWidth={640} designHeight={440}>
          <Layer>
            <Rect x={0} y={0} width={640} height={440} fill={bg} />
            {shapes.map(s => s.type === 'rect'
              ? <Rect key={s.id} x={s.x} y={s.y} width={s.w} height={s.h} fill={s.fill} draggable />
              : <Circle key={s.id} x={s.x} y={s.y} radius={s.r} fill={s.fill} draggable />
            )}
            <Text x={20} y={410} text="Konva.js → PDF Demo" fontSize={16} fill="#444" />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
