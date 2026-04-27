import { useEffect, useRef, useState } from 'react';
import { Layer, Circle, Rect, Text } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

type Drop = { id: number; x: number; y: number; color: string };

const ITEMS = [
  { label: 'Red', color: '#ef4444' },
  { label: 'Blue', color: '#3b82f6' },
  { label: 'Green', color: '#10b981' },
  { label: 'Purple', color: '#8b5cf6' },
];

export default function DropDomElement() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [drops, setDrops] = useState<Drop[]>([]);
  const dragColorRef = useRef<string>('#ef4444');

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const container = stage.container();

    const onDragOver = (e: DragEvent) => { e.preventDefault(); };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      stage.setPointersPositions(e);
      const pos = stage.getPointerPosition();
      const color = e.dataTransfer?.getData('text/plain') || dragColorRef.current;
      if (!pos) return;
      const sx = stage.scaleX() || 1;
      const sy = stage.scaleY() || 1;
      setDrops(arr => [...arr, { id: Date.now() + Math.random(), x: pos.x / sx, y: pos.y / sy, color }]);
    };

    container.addEventListener('dragover', onDragOver);
    container.addEventListener('drop', onDrop);
    return () => {
      container.removeEventListener('dragover', onDragOver);
      container.removeEventListener('drop', onDrop);
    };
  }, []);

  return (
    <DemoLayout title="🎯 Drop DOM Element" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>拖曳以下項目到畫布：</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
            {ITEMS.map(it => (
              <div
                key={it.label}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', it.color);
                  dragColorRef.current = it.color;
                }}
                style={{
                  padding: '10px 12px',
                  background: it.color,
                  color: 'white',
                  borderRadius: 6,
                  cursor: 'grab',
                  userSelect: 'none',
                  fontWeight: 600,
                }}
              >{it.label}</div>
            ))}
          </div>
        </div>
        <div className="control-group">
          <button type="button" onClick={() => setDrops([])}>清空畫布</button>
          <div style={{ marginTop: 8 }}>目前圓圈數: {drops.length}</div>
        </div>
        <div className="info-box">從左側 HTML 元素拖曳到 Konva 畫布。重點在於用 stage.container().addEventListener('drop') 監聽，再用 stage.setPointersPositions(event) 取得座標。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage ref={stageRef} designWidth={720} designHeight={480}>
          <Layer>
            <Rect x={0} y={0} width={720} height={480} fill="#f9fafb" />
            <Text x={20} y={20} text="將左側項目拖曳到此處" fontSize={18} fill="#6b7280" />
            {drops.map(d => (
              <Circle key={d.id} x={d.x} y={d.y} radius={28} fill={d.color} stroke="#111827" strokeWidth={1} draggable />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
