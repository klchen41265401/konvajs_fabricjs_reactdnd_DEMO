import { useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const W = 720;
const H = 540;
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

type Shape = { x: number; y: number; color: string };

function makeShapes(n: number): Shape[] {
  const arr: Shape[] = [];
  for (let i = 0; i < n; i++) {
    arr.push({ x: Math.random() * W, y: Math.random() * H, color: COLORS[i % COLORS.length] });
  }
  return arr;
}

export default function TenThousandShapes() {
  const shapes = useMemo(() => makeShapes(10000), []);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [fps, setFps] = useState(0);
  const stageRef = useRef<Konva.Stage | null>(null);

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

  // Manual hit detection on mouse move over the stage
  const onStageMove = () => {
    const stage = stageRef.current;
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    // Check only the closest few (brute-force bounded)
    const size = 4;
    for (let i = 0; i < shapes.length; i++) {
      const s = shapes[i];
      if (pos.x >= s.x && pos.x <= s.x + size && pos.y >= s.y && pos.y <= s.y + size) {
        setTooltip({ x: pos.x + 10, y: pos.y + 10, text: `#${i} (${s.x.toFixed(0)}, ${s.y.toFixed(0)})` });
        return;
      }
    }
    setTooltip(null);
  };

  return (
    <DemoLayout title="🖼️ 10,000 Shapes" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group"><strong>數量: 10000</strong></div>
        <div className="control-group"><strong>FPS: {fps}</strong></div>
        <div className="info-box">
          繪製 10000 個小方塊。所有形狀使用 <code>listening=false</code>，由 Stage 層級監聽滑鼠並手動進行 AABB 命中測試以顯示 tooltip。
        </div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={W} designHeight={H} ref={stageRef} onMouseMove={onStageMove} onMouseLeave={() => setTooltip(null)}>
          <Layer listening={false}>
            <Rect x={0} y={0} width={W} height={H} fill="#f8fafc" />
            {shapes.map((s, i) => (
              <Rect key={i} x={s.x} y={s.y} width={4} height={4} fill={s.color} perfectDrawEnabled={false} shadowForStrokeEnabled={false} />
            ))}
          </Layer>
          <Layer listening={false}>
            {tooltip && (
              <>
                <Rect x={tooltip.x} y={tooltip.y} width={140} height={24} fill="#111827" cornerRadius={4} opacity={0.9} />
                <Text x={tooltip.x + 6} y={tooltip.y + 6} text={tooltip.text} fill="#fff" fontSize={12} />
              </>
            )}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
