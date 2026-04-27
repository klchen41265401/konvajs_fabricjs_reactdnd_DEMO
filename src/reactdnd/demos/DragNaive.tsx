import { useCallback, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import DemoLayout from '../../components/DemoLayout';

const ITEM = 'naive-box';

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
      style={{ position: 'absolute', left: pos.x, top: pos.y, background: pos.color, color: '#fff', opacity: isDragging ? 0 : 1, touchAction: 'none' }}
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
      const nx = Math.round(item.x + diff.x);
      const ny = Math.round(item.y + diff.y);
      setPositions(positions.map(p => p.id === item.id ? { ...p, x: nx, y: ny } : p));
    },
  }), [positions]);

  return (
    <div ref={drop as any} style={{ position: 'relative', maxWidth: '100%', width: '100%', height: 400, background: '#111', border: '1px solid #333', borderRadius: 8, touchAction: 'none' }}>
      {positions.map(p => <DraggableBox key={p.id} pos={p} />)}
    </div>
  );
}

const INITIAL: Pos[] = [
  { id: 'a', x: 20, y: 20, label: 'Alpha', color: '#e74c3c' },
  { id: 'b', x: 200, y: 100, label: 'Beta', color: '#27ae60' },
  { id: 'c', x: 380, y: 200, label: 'Gamma', color: '#2980b9' },
];

export default function DragNaive() {
  const [positions, setPositions] = useState<Pos[]>(INITIAL);
  const reset = useCallback(() => setPositions(INITIAL), []);

  return (
    <DemoLayout
      title="Drag Around · Naive"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <>
          <div className="info-box">
            <strong>Naive</strong><br />
            用 state 儲存每個 box 的座標，drop 時以 <code>getDifferenceFromInitialOffset</code> 計算新位置。
            原生 HTML5 拖曳預覽會自動出現（虛化原元素）。
          </div>
          <button type="button" className="back-btn" onClick={reset}>重設位置</button>
          <div style={{ fontSize: 12, marginTop: 10 }}>
            {positions.map(p => <div key={p.id}>{p.label}: ({p.x}, {p.y})</div>)}
          </div>
        </>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 50 }}>
        <div className="dnd-stage">
          <Board positions={positions} setPositions={setPositions} />
        </div>
      </DndProvider>
    </DemoLayout>
  );
}
