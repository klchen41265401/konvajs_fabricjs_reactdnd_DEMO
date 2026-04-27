import { useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Circle, Rect } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const W = 720;
const H = 540;
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

type Dot = { x: number; y: number; vx: number; vy: number; r: number; color: string };

function makeDots(n: number): Dot[] {
  const arr: Dot[] = [];
  for (let i = 0; i < n; i++) {
    arr.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 200,
      vy: (Math.random() - 0.5) * 200,
      r: 3 + Math.random() * 5,
      color: COLORS[i % COLORS.length],
    });
  }
  return arr;
}

export default function AnimationStress() {
  const [count, setCount] = useState(200);
  const dots = useMemo(() => makeDots(count), [count]);
  const layerRef = useRef<Konva.Layer | null>(null);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    if (!layerRef.current) return;
    const layer = layerRef.current;
    let lastTime = performance.now();
    let frames = 0;
    let acc = 0;
    const anim = new Konva.Animation((frame) => {
      if (!frame) return;
      const dt = frame.timeDiff / 1000;
      const children = layer.getChildren();
      for (let i = 0; i < children.length; i++) {
        const node = children[i] as Konva.Circle;
        const d = dots[i];
        if (!d) continue;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (d.x < d.r) { d.x = d.r; d.vx = -d.vx; }
        if (d.x > W - d.r) { d.x = W - d.r; d.vx = -d.vx; }
        if (d.y < d.r) { d.y = d.r; d.vy = -d.vy; }
        if (d.y > H - d.r) { d.y = H - d.r; d.vy = -d.vy; }
        node.position({ x: d.x, y: d.y });
      }
      const now = performance.now();
      const delta = now - lastTime;
      lastTime = now;
      acc += delta;
      frames++;
      if (acc >= 500) {
        setFps(Math.round((frames * 1000) / acc));
        frames = 0;
        acc = 0;
      }
    }, layer);
    anim.start();
    return () => { anim.stop(); };
  }, [dots]);

  return (
    <DemoLayout title="🖼️ Animation Stress Test" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>點數量: {count}</label>
          <input type="range" min="50" max="1000" step="50" value={count} onChange={e => setCount(+e.target.value)} />
        </div>
        <div className="control-group"><strong>FPS: {fps}</strong></div>
        <div className="info-box">使用 <code>Konva.Animation</code> 驅動大量粒子移動與牆壁反彈，測試動畫效能極限。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer listening={false}>
            <Rect x={0} y={0} width={W} height={H} fill="#0f172a" />
          </Layer>
          <Layer ref={layerRef} listening={false}>
            {dots.map((d, i) => (
              <Circle key={i} x={d.x} y={d.y} radius={d.r} fill={d.color} perfectDrawEnabled={false} />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
