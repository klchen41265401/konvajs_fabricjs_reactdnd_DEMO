import { useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Rect, Transformer } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const W = 720;
const H = 540;
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

type RectData = { id: number; x: number; y: number; w: number; h: number; color: string };

function makeRects(n: number): RectData[] {
  const arr: RectData[] = [];
  for (let i = 0; i < n; i++) {
    arr.push({
      id: i,
      x: Math.random() * (W - 80),
      y: Math.random() * (H - 80),
      w: 40 + Math.random() * 40,
      h: 40 + Math.random() * 40,
      color: COLORS[i % COLORS.length],
    });
  }
  return arr;
}

function RectWithTransformer({ data }: { data: RectData }) {
  const rectRef = useRef<Konva.Rect | null>(null);
  const trRef = useRef<Konva.Transformer | null>(null);

  useEffect(() => {
    if (rectRef.current && trRef.current) {
      trRef.current.nodes([rectRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, []);

  return (
    <>
      <Rect
        ref={rectRef}
        x={data.x}
        y={data.y}
        width={data.w}
        height={data.h}
        fill={data.color}
        draggable
        perfectDrawEnabled={false}
      />
      <Transformer ref={trRef} rotateEnabled={false} />
    </>
  );
}

export default function ResizingStress() {
  const [count, setCount] = useState(20);
  const rects = useMemo(() => makeRects(count), [count]);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let last = performance.now();
    let frames = 0;
    let acc = 0;
    let raf = 0;
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
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <DemoLayout title="🖼️ Resizing Stress Test" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>方塊數量: {count}</label>
          <input type="range" min="5" max="80" step="1" value={count} onChange={e => setCount(+e.target.value)} />
        </div>
        <div className="control-group"><strong>FPS: {fps}</strong></div>
        <div className="info-box">每個方塊都有獨立的 Transformer，可同時拖曳與縮放。測試大量 Transformer 的效能影響。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer>
            <Rect x={0} y={0} width={W} height={H} fill="#f8fafc" listening={false} />
            {rects.map(r => <RectWithTransformer key={r.id} data={r} />)}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
