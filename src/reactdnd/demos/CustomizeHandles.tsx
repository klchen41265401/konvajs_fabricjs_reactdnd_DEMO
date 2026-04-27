import { DndProvider, useDrag, useDragLayer, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useState } from 'react';
import DemoLayout from '../../components/DemoLayout';

const ITEM = 'handle-box';

interface DragItem { label: string; color: string; }

function BoxWithHandle({ label, color }: { label: string; color: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM,
    item: { label, color } as DragItem,
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));

  return (
    <div
      className="box"
      style={{
        background: color,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: 10,
        opacity: isDragging ? 0.4 : 1,
        cursor: 'default',
      }}
    >
      <span
        ref={drag as unknown as React.Ref<HTMLSpanElement>}
        style={{
          cursor: 'grab',
          padding: '4px 8px',
          background: 'rgba(0,0,0,.35)',
          borderRadius: 4,
          userSelect: 'none',
          touchAction: 'none',
          fontSize: 18,
          lineHeight: 1,
        }}
        title="只有這個把手可以拖"
      >
        ≡
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      <span style={{ opacity: 0.7, fontSize: 12 }}>← 整塊其他位置拖不動</span>
    </div>
  );
}

function Dustbin({ onDrop }: { onDrop: (l: string) => void }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ITEM,
    drop: (item: DragItem) => onDrop(item.label),
    collect: (m) => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
  }));
  return (
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className={`dustbin${isOver ? ' over' : ''}${canDrop && !isOver ? ' accept' : ''}`}>
      放到這裡
    </div>
  );
}

function CustomDragLayer() {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem() as DragItem | null,
    currentOffset: monitor.getClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !item || !currentOffset) return null;

  return (
    <div
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 1000,
        left: currentOffset.x + 12,
        top: currentOffset.y + 12,
        background: item.color,
        color: '#fff',
        padding: '8px 14px',
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,.4)',
        fontWeight: 600,
        userSelect: 'none',
      }}
    >
      🤚 拖曳中：{item.label}
    </div>
  );
}

export default function CustomizeHandles() {
  const [dropped, setDropped] = useState<string>('—');

  return (
    <DemoLayout
      title="Customize · Handles and Previews"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <>
          <div className="info-box">
            <strong>Drag Handle + Custom Preview</strong><br />
            <code>drag</code> ref 只掛在左側 ≡ 把手 → 整個 box 其他位置都拖不動。<br />
            自訂 preview 用 <code>useDragLayer</code> 取代瀏覽器原生 ghost，跟著滑鼠 / 觸控位置即時繪製。
          </div>
          <div>最近 drop：<strong>{dropped}</strong></div>
        </>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayMouseStart: 0, delayTouchStart: 50 }}>
        <div className="dnd-stage" style={{ flexDirection: 'column', gap: 16 }}>
          <BoxWithHandle label="任務 A" color="#2c3e50" />
          <BoxWithHandle label="任務 B" color="#16a085" />
          <BoxWithHandle label="任務 C" color="#c0392b" />
          <Dustbin onDrop={setDropped} />
        </div>
        <CustomDragLayer />
      </DndProvider>
    </DemoLayout>
  );
}
