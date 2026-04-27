import { useState } from 'react';
import { Layer, Rect, Circle, Star } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const W = 720;
const H = 540;
const MINI_W = 220;
const MINI_H = 165;

type Shape =
  | { kind: 'rect'; id: string; x: number; y: number; w: number; h: number; color: string }
  | { kind: 'circle'; id: string; x: number; y: number; r: number; color: string }
  | { kind: 'star'; id: string; x: number; y: number; r: number; color: string };

const INITIAL: Shape[] = [
  { kind: 'rect', id: 'r1', x: 80, y: 80, w: 120, h: 80, color: '#ef4444' },
  { kind: 'circle', id: 'c1', x: 400, y: 150, r: 60, color: '#3b82f6' },
  { kind: 'star', id: 's1', x: 560, y: 380, r: 70, color: '#f59e0b' },
  { kind: 'rect', id: 'r2', x: 180, y: 360, w: 140, h: 100, color: '#22c55e' },
];

export default function StagePreview() {
  const [shapes, setShapes] = useState<Shape[]>(INITIAL);

  const update = (id: string, x: number, y: number) => {
    setShapes(prev => prev.map(s => s.id === id ? { ...s, x, y } : s));
  };

  const renderShape = (s: Shape, big: boolean) => {
    const common = {
      draggable: big,
      listening: big,
      onDragMove: big
        ? (e: Konva.KonvaEventObject<DragEvent>) => update(s.id, e.target.x(), e.target.y())
        : undefined,
      perfectDrawEnabled: false,
    };
    if (s.kind === 'rect') {
      return <Rect key={s.id} x={s.x} y={s.y} width={s.w} height={s.h} fill={s.color} {...common} />;
    }
    if (s.kind === 'circle') {
      return <Circle key={s.id} x={s.x} y={s.y} radius={s.r} fill={s.color} {...common} />;
    }
    return <Star key={s.id} x={s.x} y={s.y} numPoints={5} innerRadius={s.r / 2.2} outerRadius={s.r} fill={s.color} {...common} />;
  };

  return (
    <DemoLayout title="🖼️ Stage Preview (Mini-map)" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group"><strong>迷你預覽</strong></div>
        <div className="control-group">
          <div style={{ border: '1px solid #cbd5e1', borderRadius: 4, overflow: 'hidden', width: MINI_W, height: MINI_H }}>
            <ResponsiveStage designWidth={W} designHeight={H} maxWidth={MINI_W} listening={false}>
              <Layer listening={false}>
                <Rect x={0} y={0} width={W} height={H} fill="#f1f5f9" />
                {shapes.map(s => renderShape(s, false))}
              </Layer>
            </ResponsiveStage>
          </div>
        </div>
        <div className="info-box">在側邊欄額外建立一個縮小比例的 Stage，以相同形狀資料繪製，拖曳主畫面會即時同步小地圖。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer>
            <Rect x={0} y={0} width={W} height={H} fill="#f1f5f9" listening={false} />
            {shapes.map(s => renderShape(s, true))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
