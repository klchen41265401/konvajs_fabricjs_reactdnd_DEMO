import { useEffect, useRef, useState } from 'react';
import { Layer, Circle, Rect } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

type Ball = { id: number; x: number; y: number; vx: number; vy: number; r: number; color: string };

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
const W = 720;
const H = 540;

export default function PhysicsSimulator() {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [nextId, setNextId] = useState(1);
  const [gravity, setGravity] = useState(900);
  const [friction, setFriction] = useState(0.85);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(performance.now());
  const gravityRef = useRef(gravity);
  const frictionRef = useRef(friction);

  useEffect(() => { gravityRef.current = gravity; }, [gravity]);
  useEffect(() => { frictionRef.current = friction; }, [friction]);

  const addBall = () => {
    const r = 14 + Math.random() * 16;
    const b: Ball = {
      id: nextId,
      x: r + Math.random() * (W - 2 * r),
      y: r + Math.random() * 80,
      vx: (Math.random() - 0.5) * 400,
      vy: Math.random() * 100,
      r,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setBalls(arr => [...arr, b]);
    setNextId(n => n + 1);
  };

  const clearAll = () => setBalls([]);

  useEffect(() => {
    const tick = (t: number) => {
      const dt = Math.min(0.033, (t - lastRef.current) / 1000);
      lastRef.current = t;
      setBalls(prev => prev.map(b => {
        let { x, y, vx, vy } = b;
        vy += gravityRef.current * dt;
        x += vx * dt;
        y += vy * dt;
        if (x - b.r < 0) { x = b.r; vx = -vx * frictionRef.current; }
        if (x + b.r > W) { x = W - b.r; vx = -vx * frictionRef.current; }
        if (y + b.r > H) { y = H - b.r; vy = -vy * frictionRef.current; vx *= 0.98; }
        if (y - b.r < 0) { y = b.r; vy = -vy * frictionRef.current; }
        return { ...b, x, y, vx, vy };
      }));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <DemoLayout title="🖼️ Physics Simulator" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <button type="button" onClick={addBall}>新增球</button>
          <button type="button" onClick={clearAll}>清除</button>
        </div>
        <div className="control-group"><label>重力: {gravity}</label><input type="range" min="100" max="2000" step="50" value={gravity} onChange={e => setGravity(+e.target.value)} /></div>
        <div className="control-group"><label>摩擦: {friction.toFixed(2)}</label><input type="range" min="0.3" max="0.99" step="0.01" value={friction} onChange={e => setFriction(+e.target.value)} /></div>
        <div className="control-group"><label>球數: {balls.length}</label></div>
        <div className="info-box">以 requestAnimationFrame 模擬重力與牆壁碰撞反彈，可調整重力與摩擦係數觀察不同物理行為。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer>
            <Rect x={0} y={0} width={W} height={H} fill="#f8fafc" />
            <Rect x={0} y={H - 6} width={W} height={6} fill="#cbd5e1" />
            {balls.map(b => (
              <Circle key={b.id} x={b.x} y={b.y} radius={b.r} fill={b.color} stroke="#0f172a" strokeWidth={1} />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
