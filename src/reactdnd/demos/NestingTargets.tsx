import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import DemoLayout from '../../components/DemoLayout';

const ITEM = 'nest-item';

function Source() {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM,
    item: { name: 'Jewel' },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));
  return <div ref={drag as any} className={`box${isDragging ? ' dragging' : ''}`} style={{ background: '#f1c40f', color: '#111' }}>💎 拖我</div>;
}

function Target({ name, children, onDrop }: { name: string; children?: React.ReactNode; onDrop: (n: string) => void }) {
  const [{ isOver, isOverCurrent }, drop] = useDrop(() => ({
    accept: ITEM,
    drop: (_item, monitor) => {
      if (monitor.didDrop()) return; // child handled it
      onDrop(name);
    },
    collect: (m) => ({ isOver: m.isOver(), isOverCurrent: m.isOver({ shallow: true }) }),
  }));
  let bg = 'rgba(255,255,255,.04)';
  if (isOverCurrent) bg = 'rgba(46,204,113,.35)';
  else if (isOver) bg = 'rgba(52,152,219,.2)';
  return (
    <div ref={drop as any} style={{ padding: 20, border: '2px dashed #888', background: bg, borderRadius: 8, margin: 8 }}>
      <div style={{ color: '#ccc', marginBottom: 8 }}>{name}</div>
      {children}
    </div>
  );
}

export default function NestingTargets() {
  const [log, setLog] = useState<string[]>([]);
  const push = (t: string) => setLog(l => [`掉到：${t}`, ...l].slice(0, 8));

  return (
    <DemoLayout
      title="Nesting · Drop Targets"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <>
          <div className="info-box">
            <strong>巢狀 Drop Targets</strong><br />
            外層 / 中層 / 內層三個 target；drop 時用 <code>monitor.didDrop()</code> 判斷子層已處理，避免事件冒泡重覆觸發。
            淺綠底表示滑鼠直接在該層（shallow），淺藍表示 hover 到裡面的子層。
          </div>
          <div style={{ fontSize: 12 }}>
            {log.length === 0 ? <div style={{ color: '#888' }}>尚未 drop</div> : log.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 50 }}>
        <div className="dnd-stage" style={{ flexDirection: 'column' }}>
          <Source />
          <div style={{ marginTop: 20, maxWidth: '100%', width: '100%' }}>
            <Target name="Outer (外層)" onDrop={push}>
              <Target name="Middle (中層)" onDrop={push}>
                <Target name="Inner (內層)" onDrop={push} />
              </Target>
            </Target>
          </div>
        </div>
      </DndProvider>
    </DemoLayout>
  );
}
