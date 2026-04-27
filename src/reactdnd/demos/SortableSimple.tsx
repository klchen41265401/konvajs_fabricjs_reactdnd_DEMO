import { useCallback, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import type { Identifier } from 'dnd-core';
import DemoLayout from '../../components/DemoLayout';

const ITEM = 'sort-item';

type Item = { id: string; text: string };

interface DragItem { index: number; id: string; type: string; }

function SortItem({ item, index, move }: { item: Item; index: number; move: (from: number, to: number) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: ITEM,
    collect: (m) => ({ handlerId: m.getHandlerId() }),
    hover(dragItem, monitor) {
      if (!ref.current) return;
      const from = dragItem.index;
      const to = index;
      if (from === to) return;
      const rect = ref.current.getBoundingClientRect();
      const middleY = (rect.bottom - rect.top) / 2;
      const client = monitor.getClientOffset();
      if (!client) return;
      const hoverY = client.y - rect.top;
      if (from < to && hoverY < middleY) return;
      if (from > to && hoverY > middleY) return;
      move(from, to);
      dragItem.index = to;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ITEM,
    item: () => ({ id: item.id, index }),
    collect: (m) => ({ isDragging: m.isDragging() }),
  });
  drag(drop(ref));
  return (
    <div ref={ref} className={`sortable-item${isDragging ? ' dragging' : ''}`} data-handler-id={handlerId}>
      <span style={{ opacity: .6, marginRight: 8 }}>≡</span>{item.text}
    </div>
  );
}

const INITIAL: Item[] = [
  { id: '1', text: '🍎 Apple' },
  { id: '2', text: '🍌 Banana' },
  { id: '3', text: '🍇 Grape' },
  { id: '4', text: '🍊 Orange' },
  { id: '5', text: '🍓 Strawberry' },
  { id: '6', text: '🍉 Watermelon' },
];

export default function SortableSimple() {
  const [items, setItems] = useState<Item[]>(INITIAL);
  const move = useCallback((from: number, to: number) => {
    setItems(prev => {
      const next = prev.slice();
      const [removed] = next.splice(from, 1);
      next.splice(to, 0, removed);
      return next;
    });
  }, []);

  return (
    <DemoLayout
      title="Sortable · Simple"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <>
          <div className="info-box">
            <strong>Sortable · Simple</strong><br />
            使用 <code>useDrop</code> 的 <code>hover</code> callback 即時交換索引，拖曳過半 bounding box 就 swap。
            陣列以 <code>splice</code> 手動重排。
          </div>
          <button type="button" className="back-btn" onClick={() => setItems(INITIAL)}>重設順序</button>
        </>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 50 }}>
        <div className="dnd-stage">
          <div className="sortable-list">
            {items.map((it, i) => <SortItem key={it.id} item={it} index={i} move={move} />)}
          </div>
        </div>
      </DndProvider>
    </DemoLayout>
  );
}
