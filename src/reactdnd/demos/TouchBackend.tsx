import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import DemoLayout from '../../components/DemoLayout';

const ITEM = 'touch-box';

type Pos = { id: string; x: number; y: number; label: string; color: string };

function DraggableBox({ pos }: { pos: Pos }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM,
    item: { id: pos.id, x: pos.x, y: pos.y },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }), [pos.id, pos.x, pos.y]);
  return (
    <div
      ref={drag as any}
      className={`box${isDragging ? ' dragging' : ''}`}
      style={{ position: 'absolute', left: pos.x, top: pos.y, background: pos.color, color: '#fff', opacity: isDragging ? 0.4 : 1, touchAction: 'none' }}
    >
      {pos.label}
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
    <div ref={drop as any} style={{ position: 'relative', width: 600, height: 400, background: '#111', border: '1px solid #333', borderRadius: 8, touchAction: 'none' }}>
      {positions.map(p => <DraggableBox key={p.id} pos={p} />)}
    </div>
  );
}

export default function TouchBackendDemo() {
  const [positions, setPositions] = useState<Pos[]>([
    { id: 'a', x: 30, y: 30, label: 'Alpha', color: '#e67e22' },
    { id: 'b', x: 240, y: 140, label: 'Beta', color: '#1abc9c' },
    { id: 'c', x: 420, y: 260, label: 'Gamma', color: '#9b59b6' },
  ]);

  return (
    <DemoLayout
      title="Other · Touch Backend"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <div className="info-box">
          <strong>Touch Backend</strong><br />
          使用 <code>TouchBackend</code> 替代 <code>HTML5Backend</code>，可在手機 / 平板上以手指拖曳。
          設定 <code>enableMouseEvents: true</code> 讓桌面滑鼠也能正常運作。
          元素加上 <code>touch-action: none</code> 避免瀏覽器預設滾動干擾。
        </div>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
        <div className="dnd-stage">
          <Board positions={positions} setPositions={setPositions} />
        </div>
      </DndProvider>
    </DemoLayout>
  );
}
