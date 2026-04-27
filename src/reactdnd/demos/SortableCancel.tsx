import { useCallback, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import DemoLayout from '../../components/DemoLayout';

const ITEM = 'sort-cancel';

type Item = { id: string; text: string };

function SortItem({
  item,
  index,
  findIndex,
  move,
  onEnd,
}: {
  item: Item;
  index: number;
  findIndex: (id: string) => number;
  move: (id: string, to: number) => void;
  onEnd: (id: string, didDrop: boolean, originalIndex: number) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const originalIndex = findIndex(item.id);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM,
    item: { id: item.id, originalIndex },
    collect: (m) => ({ isDragging: m.isDragging() }),
    end: (dragged, monitor) => {
      onEnd(dragged.id, monitor.didDrop(), dragged.originalIndex);
    },
  }, [item.id, originalIndex, onEnd]);

  const [, drop] = useDrop({
    accept: ITEM,
    hover(dragItem: { id: string }) {
      if (dragItem.id !== item.id) {
        move(dragItem.id, index);
      }
    },
  });
  drag(drop(ref));

  return (
    <div ref={ref} className={`sortable-item${isDragging ? ' dragging' : ''}`}>
      <span style={{ opacity: .6, marginRight: 8 }}>≡</span>{item.text}
    </div>
  );
}

function ListDropTarget({ children }: { children: React.ReactNode }) {
  const [, drop] = useDrop({ accept: ITEM, drop: () => ({ inList: true }) });
  return <div ref={drop as any} className="sortable-list">{children}</div>;
}

const INITIAL: Item[] = [
  { id: '1', text: '🥇 Gold' },
  { id: '2', text: '🥈 Silver' },
  { id: '3', text: '🥉 Bronze' },
  { id: '4', text: '🎖️ Merit' },
  { id: '5', text: '🏅 Honor' },
  { id: '6', text: '🏆 Champion' },
];

export default function SortableCancel() {
  const [items, setItems] = useState<Item[]>(INITIAL);

  const findIndex = useCallback((id: string) => items.findIndex(i => i.id === id), [items]);

  const move = useCallback((id: string, to: number) => {
    setItems(prev => {
      const from = prev.findIndex(i => i.id === id);
      if (from < 0 || from === to) return prev;
      const next = prev.slice();
      const [removed] = next.splice(from, 1);
      next.splice(to, 0, removed);
      return next;
    });
  }, []);

  const onEnd = useCallback((id: string, didDrop: boolean, originalIndex: number) => {
    if (!didDrop) {
      // reverted: move id back to originalIndex
      setItems(prev => {
        const from = prev.findIndex(i => i.id === id);
        if (from < 0) return prev;
        const next = prev.slice();
        const [removed] = next.splice(from, 1);
        next.splice(originalIndex, 0, removed);
        return next;
      });
    }
  }, []);

  return (
    <DemoLayout
      title="Sortable · Cancel on Drop Outside"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <div className="info-box">
          <strong>拖出清單即取消</strong><br />
          拖曳過程中即時 hover 交換，若最後放在清單外（<code>!monitor.didDrop()</code>），
          在 <code>end</code> callback 中把 item 移回原始位置。
        </div>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 50 }}>
        <div className="dnd-stage">
          <ListDropTarget>
            {items.map((it, i) => (
              <SortItem key={it.id} item={it} index={i} findIndex={findIndex} move={move} onEnd={onEnd} />
            ))}
          </ListDropTarget>
        </div>
      </DndProvider>
    </DemoLayout>
  );
}
