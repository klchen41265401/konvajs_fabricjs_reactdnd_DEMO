import { useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import DemoLayout from '../../components/DemoLayout';
import { useState } from 'react';

const ITEM = 'handle-box';

function BoxWithHandle({ label, color }: { label: string; color: string }) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ITEM,
    item: { label },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));
  useEffect(() => { preview(getEmptyImage(), { captureDraggingState: true }); }, [preview]);

  return (
    <div
      className="box"
      style={{
        background: color,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: 10,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <span
        ref={drag as any}
        style={{
          cursor: 'move',
          padding: '2px 6px',
          background: 'rgba(0,0,0,.35)',
          borderRadius: 4,
          userSelect: 'none',
        }}
        title="只有這個把手可以拖"
      >
        ≡
      </span>
      <span>{label}（整個 box 其他部分拖不動）</span>
    </div>
  );
}

function Dustbin({ onDrop }: { onDrop: (l: string) => void }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ITEM,
    drop: (item: { label: string }) => onDrop(item.label),
    collect: (m) => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
  }));
  return <div ref={drop as any} className={`dustbin${isOver ? ' over' : ''}${canDrop && !isOver ? ' accept' : ''}`}>放到這</div>;
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
            <strong>Drag Handle + Empty Preview</strong><br />
            <code>drag</code> ref 只掛在左邊的 ≡ 小把手，整塊 box 其他部分不會被拖。
            另外以 <code>preview(getEmptyImage())</code> 隱藏預設的 drag preview 圖。
          </div>
          <div>最近 drop：<strong>{dropped}</strong></div>
        </>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 50 }}>
        <div className="dnd-stage" style={{ flexDirection: 'column', gap: 16 }}>
          <BoxWithHandle label="任務 A" color="#2c3e50" />
          <BoxWithHandle label="任務 B" color="#16a085" />
          <BoxWithHandle label="任務 C" color="#c0392b" />
          <Dustbin onDrop={setDropped} />
        </div>
      </DndProvider>
    </DemoLayout>
  );
}
