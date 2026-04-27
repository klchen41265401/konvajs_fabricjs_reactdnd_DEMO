import { useRef, useState } from 'react';
import { Layer, Line } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

type Stroke = { pts: number[]; color: string; width: number; mode: 'brush' | 'eraser' };

export default function CanvasDrawing() {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [color, setColor] = useState('#0f172a');
  const [width, setWidth] = useState(4);
  const [mode, setMode] = useState<'brush' | 'eraser'>('brush');
  const drawing = useRef(false);
  const stageRef = useRef<Konva.Stage | null>(null);

  const down = (e: any) => {
    drawing.current = true;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const x = pos.x / stage.scaleX(), y = pos.y / stage.scaleY();
    setStrokes(s => [...s, { pts: [x, y], color, width, mode }]);
  };
  const move = (e: any) => {
    if (!drawing.current) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const x = pos.x / stage.scaleX(), y = pos.y / stage.scaleY();
    setStrokes(s => s.map((st, i) => i === s.length - 1 ? { ...st, pts: [...st.pts, x, y] } : st));
  };
  const up = () => { drawing.current = false; };

  const undo = () => setStrokes(s => s.slice(0, -1));
  const clear = () => setStrokes([]);
  const exportPng = () => {
    if (!stageRef.current) return;
    const url = stageRef.current.toDataURL({ pixelRatio: 2 });
    const a = document.createElement('a'); a.href = url; a.download = 'drawing.png'; a.click();
  };

  return (
    <DemoLayout title="🖼️ Canvas Drawing" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>模式</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={() => setMode('brush')} style={{ fontWeight: mode === 'brush' ? 700 : 400 }}>✏️ 畫筆</button>
            <button type="button" onClick={() => setMode('eraser')} style={{ fontWeight: mode === 'eraser' ? 700 : 400 }}>🧹 橡皮擦</button>
          </div>
        </div>
        <div className="control-group"><label>顏色</label><input type="color" value={color} onChange={e => setColor(e.target.value)} /></div>
        <div className="control-group"><label>粗細: {width}</label><input type="range" min="1" max="40" value={width} onChange={e => setWidth(+e.target.value)} /></div>
        <div className="control-group">
          <button type="button" onClick={undo}>復原</button>
          <button type="button" onClick={clear}>清除</button>
          <button type="button" onClick={exportPng}>匯出 PNG</button>
        </div>
        <div className="info-box">自由繪圖工具，支援畫筆／橡皮擦模式、顏色與筆寬調整、復原、清除與匯出 PNG。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage
          ref={stageRef}
          designWidth={720}
          designHeight={540}
          onMouseDown={down}
          onMouseMove={move}
          onMouseUp={up}
          onTouchStart={down}
          onTouchMove={move}
          onTouchEnd={up}
        >
          <Layer>
            {strokes.map((s, i) => (
              <Line
                key={i}
                points={s.pts}
                stroke={s.color}
                strokeWidth={s.width}
                tension={0.4}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={s.mode === 'eraser' ? 'destination-out' : 'source-over'}
              />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
