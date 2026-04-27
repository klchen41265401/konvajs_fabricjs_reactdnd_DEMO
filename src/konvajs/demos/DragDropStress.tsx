import { useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Rect } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const W = 720;
const H = 540;
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

type Sq = { id: number; x: number; y: number; color: string; size: number };

function makeSquares(n: number): Sq[] {
  const arr: Sq[] = [];
  for (let i = 0; i < n; i++) {
    arr.push({
      id: i,
      x: Math.random() * (W - 30),
      y: Math.random() * (H - 30),
      color: COLORS[i % COLORS.length],
      size: 16 + Math.random() * 16,
    });
  }
  return arr;
}

export default function DragDropStress() {
  const [count, setCount] = useState(100);
  const squares = useMemo(() => makeSquares(count), [count]);
  const [fps, setFps] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let last = performance.now();
    let frames = 0;
    let acc = 0;
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      acc += dt;
      frames++;
      if (acc >= 500) {
        setFps(Math.round((frames * 1000) / acc));
        frames = 0;
        acc = 0;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <DemoLayout title="🖼️ Drag & Drop Stress Test" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>方塊數量: {count}</label>
          <input type="range" min="50" max="500" step="10" value={count} onChange={e => setCount(+e.target.value)} />
        </div>
        <div className="control-group"><strong>FPS: {fps}</strong></div>
        <div className="info-box">
          拖曳壓力測試: 預設 100 個可拖曳方塊。使用 <code>perfectDrawEnabled=false</code> 降低繪製成本，並觀察 FPS 變化。
        </div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer>
            <Rect x={0} y={0} width={W} height={H} fill="#f8fafc" listening={false} />
            {squares.map(s => (
              <Rect
                key={s.id}
                x={s.x}
                y={s.y}
                width={s.size}
                height={s.size}
                fill={s.color}
                draggable
                perfectDrawEnabled={false}
                shadowForStrokeEnabled={false}
                listening
              />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
