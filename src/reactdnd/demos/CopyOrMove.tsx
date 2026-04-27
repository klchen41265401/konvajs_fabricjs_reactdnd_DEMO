import { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import DemoLayout from '../../components/DemoLayout';

const ITEM = 'cm-item';

type Item = { id: string; label: string };
type Side = 'left' | 'right';

function Draggable({ item, from }: { item: Item; from: Side }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM,
    item: { ...item, from },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }), [item.id, from]);
  return <div ref={drag as any} className={`sortable-item${isDragging ? ' dragging' : ''}`}>{item.label}</div>;
}

function List({
  title,
  items,
  side,
  onDrop,
}: {
  title: string;
  items: Item[];
  side: Side;
  onDrop: (item: Item & { from: Side }) => void;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ITEM,
    canDrop: (item: Item & { from: Side }) => item.from !== side,
    drop: (item: Item & { from: Side }) => { onDrop(item); },
    collect: (m) => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
  }), [items, side, onDrop]);

  const bg = isOver && canDrop ? 'rgba(46,204,113,.15)' : canDrop ? 'rgba(52,152,219,.08)' : 'transparent';

  return (
    <div ref={drop as any} style={{ flex: 1, border: '1px solid #333', borderRadius: 8, padding: 10, background: bg, minHeight: 280 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{title}</div>
      <div className="sortable-list" style={{ width: '100%' }}>
        {items.map(it => <Draggable key={it.id} item={it} from={side} />)}
        {items.length === 0 && <div style={{ color: '#888', fontSize: 12 }}>（清單為空）</div>}
      </div>
    </div>
  );
}

export default function CopyOrMove() {
  const [left, setLeft] = useState<Item[]>([
    { id: 'l1', label: '📘 Book' },
    { id: 'l2', label: '📒 Notebook' },
    { id: 'l3', label: '📕 Diary' },
  ]);
  const [right, setRight] = useState<Item[]>([
    { id: 'r1', label: '💻 Laptop' },
    { id: 'r2', label: '⌚ Watch' },
  ]);
  const [ctrl, setCtrl] = useState(false);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => { if (e.ctrlKey || e.metaKey) setCtrl(true); };
    const ku = (e: KeyboardEvent) => { if (!e.ctrlKey && !e.metaKey) setCtrl(false); };
    document.addEventListener('keydown', kd);
    document.addEventListener('keyup', ku);
    return () => {
      document.removeEventListener('keydown', kd);
      document.removeEventListener('keyup', ku);
    };
  }, []);

  const handleDrop = (to: Side) => (item: Item & { from: Side }) => {
    const copy = ctrl;
    const newItem: Item = { id: `${to}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, label: item.label };

    if (to === 'left') {
      setLeft(l => l.some(x => x.label === item.label) ? l : [...l, newItem]);
      if (!copy) setRight(r => r.filter(x => x.id !== item.id));
    } else {
      setRight(r => r.some(x => x.label === item.label) ? r : [...r, newItem]);
      if (!copy) setLeft(l => l.filter(x => x.id !== item.id));
    }
  };

  return (
    <DemoLayout
      title="Other · Copy or Move"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <>
          <div className="info-box">
            <strong>Copy or Move</strong><br />
            兩個清單互拖 item。預設為 <em>move</em>（從原清單移除）；按住 <kbd>Ctrl</kbd> 則為 <em>copy</em>（保留原 item）。
          </div>
          <div>目前模式：<strong>{ctrl ? 'COPY (Ctrl)' : 'MOVE'}</strong></div>
          <div style={{ fontSize: 12, marginTop: 6 }}>左 {left.length} 項 / 右 {right.length} 項</div>
        </>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 50 }}>
        <div className="dnd-stage">
          <div style={{ display: 'flex', gap: 16, width: '100%', maxWidth: '100%', flexWrap: 'wrap' }}>
            <List title="Left" items={left} side="left" onDrop={handleDrop('left')} />
            <List title="Right" items={right} side="right" onDrop={handleDrop('right')} />
          </div>
        </div>
      </DndProvider>
    </DemoLayout>
  );
}
