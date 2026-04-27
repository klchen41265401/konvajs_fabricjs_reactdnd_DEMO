import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import DemoLayout from '../../components/DemoLayout';

const ITEM_TYPE = 'box';

function Box() {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { name: '寶物' },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));
  return (
    <div ref={drag as any} className={`box${isDragging ? ' dragging' : ''}`} style={{ background: '#4a90e2', color: '#fff' }}>
      拖我 →
    </div>
  );
}

function Dustbin({ onDrop }: { onDrop: (name: string) => void }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { name: string }) => onDrop(item.name),
    collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
  }));
  const cls = 'dustbin' + (isOver ? ' over' : '') + (canDrop && !isOver ? ' accept' : '');
  return <div ref={drop as any} className={cls}>{isOver ? '放開即放入' : '拖到這'}</div>;
}

export default function DustbinSingle() {
  const [count, setCount] = useState(0);
  const [last, setLast] = useState<string>('—');
  const handleDrop = (name: string) => {
    setCount(c => c + 1);
    setLast(name);
  };

  return (
    <DemoLayout
      title="Dustbin · Single Target"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <>
          <div className="info-box">
            <strong>Single Target</strong><br />
            最簡單的範例：一個 draggable Box、一個 Dustbin drop target。
            拖曳 Box 到 Dustbin 即觸發 drop。
          </div>
          <div>總放入次數：<strong>{count}</strong></div>
          <div>最近放入：<strong>{last}</strong></div>
        </>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 50 }}>
        <div className="dnd-stage">
          <Box />
          <Dustbin onDrop={handleDrop} />
        </div>
      </DndProvider>
    </DemoLayout>
  );
}
