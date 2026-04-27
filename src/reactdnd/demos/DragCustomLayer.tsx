import { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDragLayer, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import DemoLayout from '../../components/DemoLayout';

const ITEM = 'layer-box';

type Pos = { id: string; x: number; y: number; label: string; color: string };

function DraggableBox({ pos }: { pos: Pos }) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ITEM,
    item: { id: pos.id, x: pos.x, y: pos.y, label: pos.label, color: pos.color },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }), [pos]);

  useEffect(() => { preview(getEmptyImage(), { captureDraggingState: true }); }, [preview]);

  return (
    <div
      ref={drag as any}
      className="box"
      style={{ position: 'absolute', left: pos.x, top: pos.y, background: pos.color, color: '#fff', opacity: isDragging ? 0 : 1, touchAction: 'none' }}
    >
      {pos.label}
    </div>
  );
}

function CustomDragLayer() {
  const { isDragging, item, currentOffset } = useDragLayer((m) => ({
    item: m.getItem(),
    currentOffset: m.getSourceClientOffset(),
    isDragging: m.isDragging(),
  }));
  if (!isDragging || !currentOffset || !item) return null;
  return (
    <div style={{ position: 'fixed', pointerEvents: 'none', left: 0, top: 0, zIndex: 100 }}>
      <div
        className="box"
        style={{
          transform: `translate(${currentOffset.x}px, ${currentOffset.y}px) rotate(-6deg) scale(1.1)`,
          background: item.color,
          color: '#fff',
          boxShadow: '0 8px 24px rgba(0,0,0,.5)',
        }}
      >
        {item.label} ✨
      </div>
    </div>
  );
}

function Board({ positions, setPositions }: { positions: Pos[]; setPositions: (p: Pos[]) => void }) {
  const [, drop] = useDrop(() => ({
    accept: ITEM,
    drop: (item: { id: string; x: number; y: number }, monitor) => {
      const diff = monitor.getDifferenceFromInitialOffset();
      if (!diff) return;
      setPositions(positions.map(p => p.id === item.id ? { ...p, x: Math.round(item.x + diff.x), y: Math.round(item.y + diff.y) } : p));
    },
  }), [positions]);

  return (
    <div ref={drop as any} style={{ position: 'relative', maxWidth: '100%', width: '100%', height: 400, background: '#111', border: '1px solid #333', borderRadius: 8, touchAction: 'none' }}>
      {positions.map(p => <DraggableBox key={p.id} pos={p} />)}
    </div>
  );
}

export default function DragCustomLayer() {
  const [positions, setPositions] = useState<Pos[]>([
    { id: 'a', x: 30, y: 30, label: 'Alpha', color: '#8e44ad' },
    { id: 'b', x: 240, y: 140, label: 'Beta', color: '#16a085' },
    { id: 'c', x: 430, y: 260, label: 'Gamma', color: '#d35400' },
  ]);

  return (
    <DemoLayout
      title="Drag Around · Custom Drag Layer"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <div className="info-box">
          <strong>Custom Drag Layer</strong><br />
          用 <code>getEmptyImage()</code> 取代原生預覽圖，改用 <code>useDragLayer</code> 取得滑鼠座標，
          手動 render 一個自訂樣式的預覽（旋轉、放大、陰影）。
        </div>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 50 }}>
        <div className="dnd-stage">
          <Board positions={positions} setPositions={setPositions} />
        </div>
        <CustomDragLayer />
      </DndProvider>
    </DemoLayout>
  );
}
