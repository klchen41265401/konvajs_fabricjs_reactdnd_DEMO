import { useState } from 'react';
import { Layer, Line, Circle, Rect } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const W = 720;
const H = 540;

type Pt = { id: number; x: number; y: number };

export default function ModifyCurvesAnchors() {
  const [points, setPoints] = useState<Pt[]>([
    { id: 1, x: 120, y: 360 },
    { id: 2, x: 280, y: 140 },
    { id: 3, x: 460, y: 420 },
    { id: 4, x: 620, y: 180 },
  ]);
  const [tension, setTension] = useState(0.5);
  const [nextId, setNextId] = useState(5);

  const linePoints = points.flatMap(p => [p.x, p.y]);

  const update = (id: number, x: number, y: number) => {
    setPoints(prev => prev.map(p => p.id === id ? { ...p, x, y } : p));
  };

  const addPoint = () => {
    setPoints(prev => [
      ...prev,
      { id: nextId, x: Math.random() * (W - 80) + 40, y: Math.random() * (H - 80) + 40 },
    ]);
    setNextId(n => n + 1);
  };

  const reset = () => {
    setPoints([
      { id: 1, x: 120, y: 360 },
      { id: 2, x: 280, y: 140 },
      { id: 3, x: 460, y: 420 },
      { id: 4, x: 620, y: 180 },
    ]);
    setNextId(5);
  };

  return (
    <DemoLayout title="🖼️ Modify Curves with Anchors" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>Tension: {tension.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.05" value={tension} onChange={e => setTension(+e.target.value)} />
        </div>
        <div className="control-group">
          <button type="button" onClick={addPoint}>新增錨點</button>
          <button type="button" onClick={reset}>重設</button>
        </div>
        <div className="control-group"><strong>錨點數: {points.length}</strong></div>
        <div className="info-box">拖曳圓點可即時修改 Konva.Line 的 points 陣列；tension 越大曲線越圓滑。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer>
            <Rect x={0} y={0} width={W} height={H} fill="#f8fafc" listening={false} />
            <Line points={linePoints} stroke="#3b82f6" strokeWidth={3} tension={tension} lineCap="round" lineJoin="round" listening={false} />
            {points.map(p => (
              <Circle
                key={p.id}
                x={p.x}
                y={p.y}
                radius={8}
                fill="#fff"
                stroke="#ef4444"
                strokeWidth={2}
                draggable
                onDragMove={(e: Konva.KonvaEventObject<DragEvent>) => update(p.id, e.target.x(), e.target.y())}
              />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
