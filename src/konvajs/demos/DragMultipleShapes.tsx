import { useRef, useState } from 'react';
import { Layer, Rect, Circle } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

interface ShapeDef {
  id: number;
  type: 'rect' | 'circle';
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

const INITIAL_SHAPES: ShapeDef[] = [
  { id: 1, type: 'rect', x: 80, y: 80, w: 100, h: 70, color: '#ff6b6b' },
  { id: 2, type: 'rect', x: 250, y: 150, w: 120, h: 80, color: '#4dabf7' },
  { id: 3, type: 'circle', x: 480, y: 120, w: 80, h: 80, color: '#feca57' },
  { id: 4, type: 'rect', x: 120, y: 320, w: 90, h: 90, color: '#1dd1a1' },
  { id: 5, type: 'circle', x: 350, y: 350, w: 70, h: 70, color: '#ff9ff3' },
  { id: 6, type: 'rect', x: 520, y: 320, w: 110, h: 80, color: '#5f27cd' },
];

function intersects(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) {
  return !(a.x > b.x + b.w || a.x + a.w < b.x || a.y > b.y + b.h || a.y + a.h < b.y);
}

export default function DragMultipleShapes() {
  const [shapes, setShapes] = useState<ShapeDef[]>(INITIAL_SHAPES);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [selRect, setSelRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const selStart = useRef<{ x: number; y: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragOrigPositions = useRef<Map<number, { x: number; y: number }>>(new Map());

  const handleStageDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    selStart.current = pos;
    setSelRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
    setSelected(new Set());
  };

  const handleStageMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!selStart.current) return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const x = Math.min(selStart.current.x, pos.x);
    const y = Math.min(selStart.current.y, pos.y);
    const w = Math.abs(pos.x - selStart.current.x);
    const h = Math.abs(pos.y - selStart.current.y);
    setSelRect({ x, y, w, h });
  };

  const handleStageUp = () => {
    if (!selRect || !selStart.current) {
      selStart.current = null;
      setSelRect(null);
      return;
    }
    const picked = new Set<number>();
    shapes.forEach((s) => {
      const bbox =
        s.type === 'rect'
          ? { x: s.x, y: s.y, w: s.w, h: s.h }
          : { x: s.x - s.w / 2, y: s.y - s.h / 2, w: s.w, h: s.h };
      if (intersects(selRect, bbox)) picked.add(s.id);
    });
    setSelected(picked);
    selStart.current = null;
    setSelRect(null);
  };

  const handleShapeDragStart = (e: Konva.KonvaEventObject<DragEvent>, id: number) => {
    if (!selected.has(id)) {
      setSelected(new Set([id]));
    }
    const ids = selected.has(id) ? selected : new Set([id]);
    dragStart.current = { x: e.target.x(), y: e.target.y() };
    dragOrigPositions.current.clear();
    shapes.forEach((s) => {
      if (ids.has(s.id)) {
        dragOrigPositions.current.set(s.id, { x: s.x, y: s.y });
      }
    });
  };

  const handleShapeDragMove = (e: Konva.KonvaEventObject<DragEvent>, id: number) => {
    if (!dragStart.current) return;
    const dx = e.target.x() - dragStart.current.x;
    const dy = e.target.y() - dragStart.current.y;
    setShapes((prev) =>
      prev.map((s) => {
        if (s.id === id) return { ...s, x: e.target.x(), y: e.target.y() };
        const orig = dragOrigPositions.current.get(s.id);
        if (!orig) return s;
        return { ...s, x: orig.x + dx, y: orig.y + dy };
      })
    );
  };

  const handleShapeDragEnd = () => {
    dragStart.current = null;
    dragOrigPositions.current.clear();
  };

  return (
    <DemoLayout
      title="🖱️ Drag Multiple Shapes"
      backTo="/konvajs"
      backLabel="← Konva.js 目錄"
      sidebar={
        <>
          <div className="control-group">
            <button type="button" onClick={() => setSelected(new Set())}>清除選取</button>
          </div>
          <div className="control-group">
            <label>已選取：{selected.size} 個</label>
          </div>
          <div className="info-box">
            <h4>說明</h4>
            <p>在空白處按住滑鼠拖曳可做橡皮筋選取，框選的形狀可一起拖動。</p>
            <p>拖曳任一被選中的形狀，所有選取的形狀會同步移動。</p>
          </div>
        </>
      }
    >
      <div className="stage-wrapper">
        <ResponsiveStage
          designWidth={720}
          designHeight={540}
          onMouseDown={handleStageDown}
          onMouseMove={handleStageMove}
          onMouseUp={handleStageUp}
          onTouchStart={handleStageDown as any}
          onTouchMove={handleStageMove as any}
          onTouchEnd={handleStageUp}
        >
          <Layer>
            {shapes.map((s) => {
              const isSel = selected.has(s.id);
              const stroke = isSel ? '#00c2ff' : '#333';
              const strokeWidth = isSel ? 4 : 1;
              const common = {
                draggable: true,
                onDragStart: (e: Konva.KonvaEventObject<DragEvent>) => handleShapeDragStart(e, s.id),
                onDragMove: (e: Konva.KonvaEventObject<DragEvent>) => handleShapeDragMove(e, s.id),
                onDragEnd: handleShapeDragEnd,
              };
              if (s.type === 'rect') {
                return (
                  <Rect
                    key={s.id}
                    x={s.x}
                    y={s.y}
                    width={s.w}
                    height={s.h}
                    fill={s.color}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    cornerRadius={6}
                    {...common}
                  />
                );
              }
              return (
                <Circle
                  key={s.id}
                  x={s.x}
                  y={s.y}
                  radius={s.w / 2}
                  fill={s.color}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  {...common}
                />
              );
            })}
            {selRect && (
              <Rect
                x={selRect.x}
                y={selRect.y}
                width={selRect.w}
                height={selRect.h}
                fill="rgba(0, 194, 255, 0.15)"
                stroke="#00c2ff"
                strokeWidth={1}
                dash={[4, 4]}
                listening={false}
              />
            )}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
