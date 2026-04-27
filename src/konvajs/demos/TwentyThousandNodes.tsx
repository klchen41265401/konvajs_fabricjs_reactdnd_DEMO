import { useEffect, useMemo, useState } from 'react';
import { Layer, Circle, Rect } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const W = 720;
const H = 540;
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

type Dot = { x: number; y: number; r: number; color: string };

function makeDots(n: number): Dot[] {
  const arr: Dot[] = [];
  for (let i = 0; i < n; i++) {
    arr.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 1 + Math.random() * 2,
      color: COLORS[i % COLORS.length],
    });
  }
  return arr;
}

export default function TwentyThousandNodes() {
  const [count, setCount] = useState(5000);
  const dots = useMemo(() => makeDots(count), [count]);
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
    <DemoLayout title="🖼️ 20,000 Nodes" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>節點數量: {count}</label>
          <input type="range" min="1000" max="20000" step="500" value={count} onChange={e => setCount(+e.target.value)} />
        </div>
        <div className="control-group"><strong>FPS: {fps}</strong></div>
        <div className="info-box">
          每個節點都是一個 Konva Circle。節點數越多記憶體與 GC 壓力越大，<br />
          提示: 大量靜態節點建議轉為快取 bitmap 或用單一 Shape+sceneFunc 繪製。
        </div>
      </>
    }>
      <div className="stage-wrapper dark">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer listening={false}>
            <Rect x={0} y={0} width={W} height={H} fill="#020617" />
            {dots.map((d, i) => (
              <Circle key={i} x={d.x} y={d.y} radius={d.r} fill={d.color} perfectDrawEnabled={false} shadowForStrokeEnabled={false} />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
