import { useEffect, useRef, useState } from 'react';
import { Layer, Rect } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const W = 720;
const H = 540;
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

type Bunny = { x: number; y: number; vx: number; vy: number; r: number; color: string };

function makeBunny(): Bunny {
  return {
    x: Math.random() * W,
    y: 0,
    vx: (Math.random() - 0.5) * 200,
    vy: Math.random() * 100,
    r: 4 + Math.random() * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  };
}

export default function BunniesStress() {
  const layerRef = useRef<Konva.Layer | null>(null);
  const bunniesRef = useRef<Bunny[]>([]);
  const [count, setCount] = useState(0);
  const [fps, setFps] = useState(0);

  const addBunnies = (n: number) => {
    for (let i = 0; i < n; i++) bunniesRef.current.push(makeBunny());
    setCount(bunniesRef.current.length);
  };

  const clear = () => {
    bunniesRef.current = [];
    setCount(0);
    if (layerRef.current) {
      layerRef.current.destroyChildren();
      layerRef.current.draw();
    }
  };

  useEffect(() => {
    addBunnies(100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!layerRef.current) return;
    const layer = layerRef.current;
    let lastTime = performance.now();
    let frames = 0;
    let acc = 0;
    const anim = new Konva.Animation((frame) => {
      if (!frame) return;
      const dt = Math.min(0.033, (frame.timeDiff ?? 16) / 1000);
      const bunnies = bunniesRef.current;
      const nodes = layer.getChildren();

      // Sync node count with bunny count
      while (nodes.length < bunnies.length) {
        const b = bunnies[nodes.length];
        const c = new Konva.Circle({ x: b.x, y: b.y, radius: b.r, fill: b.color, perfectDrawEnabled: false, listening: false });
        layer.add(c);
      }

      for (let i = 0; i < bunnies.length; i++) {
        const b = bunnies[i];
        b.vy += 800 * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.x < b.r) { b.x = b.r; b.vx = -b.vx; }
        if (b.x > W - b.r) { b.x = W - b.r; b.vx = -b.vx; }
        if (b.y + b.r > H) { b.y = H - b.r; b.vy = -b.vy * 0.85; }
        const node = nodes[i] as Konva.Circle;
        if (node) node.position({ x: b.x, y: b.y });
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
  }, []);

  return (
    <DemoLayout title="🖼️ Bunnies Stress Test" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <button type="button" onClick={() => addBunnies(100)}>+100 Bunnies</button>
          <button type="button" onClick={() => addBunnies(500)}>+500</button>
          <button type="button" onClick={clear}>清除</button>
        </div>
        <div className="control-group"><strong>數量: {count}</strong></div>
        <div className="control-group"><strong>FPS: {fps}</strong></div>
        <div className="info-box">仿 Pixi bunny mark: 每個 bunny 為受重力影響、落地彈跳的 Circle。點擊按鈕不斷新增觀察效能。</div>
      </>
    }>
      <div className="stage-wrapper dark">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer listening={false}>
            <Rect x={0} y={0} width={W} height={H} fill="#111827" />
          </Layer>
          <Layer ref={layerRef} listening={false} />
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
