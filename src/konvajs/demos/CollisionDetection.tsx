import { useState } from 'react';
import { Layer, Rect, Text } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const W = 720;
const H = 540;

type Box = { x: number; y: number; w: number; h: number };

export default function CollisionDetection() {
  const [a, setA] = useState<Box>({ x: 150, y: 160, w: 160, h: 120 });
  const [b, setB] = useState<Box>({ x: 400, y: 260, w: 180, h: 140 });

  const ix = Math.max(a.x, b.x);
  const iy = Math.max(a.y, b.y);
  const ir = Math.min(a.x + a.w, b.x + b.w);
  const ib = Math.min(a.y + a.h, b.y + b.h);
  const collide = ix < ir && iy < ib;
  const inter = collide ? { x: ix, y: iy, w: ir - ix, h: ib - iy } : null;

  return (
    <DemoLayout title="🖼️ Collision Detection (AABB)" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <strong style={{ color: collide ? '#ef4444' : '#22c55e' }}>
            {collide ? '⚠️ 碰撞中' : '✅ 未碰撞'}
          </strong>
        </div>
        <div className="control-group" style={{ fontSize: 13 }}>
          A: ({a.x.toFixed(0)}, {a.y.toFixed(0)}) {a.w}×{a.h}<br />
          B: ({b.x.toFixed(0)}, {b.y.toFixed(0)}) {b.w}×{b.h}
        </div>
        {inter && (
          <div className="control-group" style={{ fontSize: 13 }}>
            重疊區域: ({inter.x.toFixed(0)}, {inter.y.toFixed(0)}) {inter.w.toFixed(0)}×{inter.h.toFixed(0)}
          </div>
        )}
        <div className="info-box">拖曳兩個矩形，以 AABB（軸對齊包圍盒）演算法即時偵測碰撞，碰撞時兩者變紅並以黃色顯示交集區域。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer>
            <Rect x={0} y={0} width={W} height={H} fill="#f8fafc" listening={false} />
            <Rect
              x={a.x}
              y={a.y}
              width={a.w}
              height={a.h}
              fill={collide ? '#ef4444' : '#3b82f6'}
              opacity={0.8}
              draggable
              onDragMove={(e: Konva.KonvaEventObject<DragEvent>) => setA(prev => ({ ...prev, x: e.target.x(), y: e.target.y() }))}
            />
            <Rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              fill={collide ? '#ef4444' : '#22c55e'}
              opacity={0.8}
              draggable
              onDragMove={(e: Konva.KonvaEventObject<DragEvent>) => setB(prev => ({ ...prev, x: e.target.x(), y: e.target.y() }))}
            />
            {inter && (
              <Rect
                x={inter.x}
                y={inter.y}
                width={inter.w}
                height={inter.h}
                fill="#facc15"
                stroke="#b45309"
                strokeWidth={2}
                listening={false}
                opacity={0.7}
              />
            )}
            <Text x={a.x + 8} y={a.y + 8} text="A" fontSize={20} fill="#fff" fontStyle="bold" listening={false} />
            <Text x={b.x + 8} y={b.y + 8} text="B" fontSize={20} fill="#fff" fontStyle="bold" listening={false} />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
