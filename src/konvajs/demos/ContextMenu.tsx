import { useEffect, useRef, useState } from 'react';
import { Layer, Rect, Circle, RegularPolygon } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

type ShapeItem = {
  id: number;
  kind: 'rect' | 'circle' | 'polygon';
  x: number; y: number; fill: string;
};

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function ContextMenu() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shapes, setShapes] = useState<ShapeItem[]>([
    { id: 1, kind: 'rect', x: 160, y: 160, fill: '#3b82f6' },
    { id: 2, kind: 'circle', x: 400, y: 200, fill: '#f59e0b' },
    { id: 3, kind: 'polygon', x: 560, y: 300, fill: '#10b981' },
  ]);
  const [menu, setMenu] = useState<{ x: number; y: number; id: number } | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const preventDefault = (e: MouseEvent) => { e.preventDefault(); };
    stage.container().addEventListener('contextmenu', preventDefault);
    return () => stage.container().removeEventListener('contextmenu', preventDefault);
  }, []);

  useEffect(() => {
    const onClick = () => setMenu(null);
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);

  const handleContextMenu = (id: number, e: Konva.KonvaEventObject<PointerEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const container = containerRef.current;
    if (!stage || !container) return;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;
    const rect = container.getBoundingClientRect();
    const stageRect = stage.container().getBoundingClientRect();
    setMenu({
      x: stageRect.left - rect.left + pointer.x,
      y: stageRect.top - rect.top + pointer.y,
      id,
    });
  };

  const doDelete = () => {
    if (!menu) return;
    setShapes(arr => arr.filter(s => s.id !== menu.id));
    setMenu(null);
  };

  const doBringToFront = () => {
    if (!menu) return;
    setShapes(arr => {
      const target = arr.find(s => s.id === menu.id);
      if (!target) return arr;
      return [...arr.filter(s => s.id !== menu.id), target];
    });
    setMenu(null);
  };

  const doChangeColor = () => {
    if (!menu) return;
    setShapes(arr => arr.map(s => s.id === menu.id ? { ...s, fill: COLORS[Math.floor(Math.random() * COLORS.length)] } : s));
    setMenu(null);
  };

  return (
    <DemoLayout title="🖱️ Context Menu" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <button type="button" onClick={() => setShapes([
            { id: 1, kind: 'rect', x: 160, y: 160, fill: '#3b82f6' },
            { id: 2, kind: 'circle', x: 400, y: 200, fill: '#f59e0b' },
            { id: 3, kind: 'polygon', x: 560, y: 300, fill: '#10b981' },
          ])}>重置</button>
        </div>
        <div className="info-box">在形狀上按右鍵會顯示自訂的 HTML 選單，可刪除、置頂、更換顏色。重點：在 stage 容器阻止原生 contextmenu，再透過 onContextMenu 事件計算絕對座標。</div>
      </>
    }>
      <div ref={containerRef} className="stage-wrapper" style={{ position: 'relative' }}>
        <ResponsiveStage ref={stageRef} designWidth={720} designHeight={480}>
          <Layer>
            <Rect x={0} y={0} width={720} height={480} fill="#f9fafb" />
            {shapes.map(s => {
              const common = {
                draggable: true,
                onContextMenu: (e: Konva.KonvaEventObject<PointerEvent>) => handleContextMenu(s.id, e),
                onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
                  setShapes(arr => arr.map(x => x.id === s.id ? { ...x, x: e.target.x(), y: e.target.y() } : x));
                },
              };
              if (s.kind === 'rect') return <Rect key={s.id} x={s.x} y={s.y} width={120} height={90} fill={s.fill} {...common} />;
              if (s.kind === 'circle') return <Circle key={s.id} x={s.x} y={s.y} radius={55} fill={s.fill} {...common} />;
              return <RegularPolygon key={s.id} x={s.x} y={s.y} sides={5} radius={60} fill={s.fill} {...common} />;
            })}
          </Layer>
        </ResponsiveStage>
        {menu && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: menu.y,
              left: menu.x,
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 6,
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              padding: 4,
              minWidth: 140,
              zIndex: 20,
            }}
          >
            <button type="button" style={menuBtn} onClick={doDelete}>刪除</button>
            <button type="button" style={menuBtn} onClick={doBringToFront}>置於頂層</button>
            <button type="button" style={menuBtn} onClick={doChangeColor}>更換顏色</button>
          </div>
        )}
      </div>
    </DemoLayout>
  );
}

const menuBtn: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 12px',
  background: 'transparent',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  borderRadius: 4,
};
