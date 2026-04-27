import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import DemoLayout from '../../components/DemoLayout';

const ITEM = 'nest-source';

function DraggableBox({ label, color, children }: { label: string; color: string; children?: React.ReactNode }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM,
    item: { label },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));
  return (
    <div
      ref={drag as any}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        padding: 14,
        background: color,
        color: '#fff',
        borderRadius: 8,
        margin: 8,
        cursor: 'move',
        opacity: isDragging ? 0.4 : 1,
        border: '1px solid rgba(255,255,255,.3)',
      }}
    >
      <div style={{ marginBottom: 6, fontSize: 13 }}>{label}</div>
      {children}
    </div>
  );
}

function Bin({ onDrop }: { onDrop: (l: string) => void }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ITEM,
    drop: (item: { label: string }) => onDrop(item.label),
    collect: (m) => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
  }));
  return <div ref={drop as any} className={`dustbin${isOver ? ' over' : ''}${canDrop && !isOver ? ' accept' : ''}`}>放到這</div>;
}

export default function NestingSources() {
  const [last, setLast] = useState('—');

  return (
    <DemoLayout
      title="Nesting · Drag Sources"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <>
          <div className="info-box">
            <strong>巢狀 Drag Sources</strong><br />
            父 / 子 / 孫都可拖曳。由於 HTML5 DnD 會冒泡，子層 <code>onMouseDown</code> 需 <code>stopPropagation</code>，
            避免拖子層時把父層也一起抓起來。
          </div>
          <div>最近 drop 的 source：<strong>{last}</strong></div>
        </>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 50 }}>
        <div className="dnd-stage" style={{ flexDirection: 'column' }}>
          <DraggableBox label="Parent" color="#c0392b">
            <DraggableBox label="Child A" color="#2980b9">
              <DraggableBox label="Grandchild" color="#16a085" />
            </DraggableBox>
            <DraggableBox label="Child B" color="#8e44ad" />
          </DraggableBox>
          <div style={{ marginTop: 16 }}>
            <Bin onDrop={setLast} />
          </div>
        </div>
      </DndProvider>
    </DemoLayout>
  );
}
