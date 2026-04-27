import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import DemoLayout from '../../components/DemoLayout';

const TYPES = { GLASS: 'glass', FOOD: 'food', PAPER: 'paper' } as const;

const SOURCES: { name: string; type: string; color: string }[] = [
  { name: '🍾 Bottle', type: TYPES.GLASS, color: '#7ad' },
  { name: '🍌 Banana', type: TYPES.FOOD, color: '#eb4' },
  { name: '📰 Magazine', type: TYPES.PAPER, color: '#bbb' },
  { name: '⚙️ Machine', type: 'machine', color: '#555' },
];

function Source({ name, type, color }: { name: string; type: string; color: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { name },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));
  return <div ref={drag as any} className={`box${isDragging ? ' dragging' : ''}`} style={{ background: color, color: '#fff' }}>{name}</div>;
}

function Bin({ accept, label, count, lastItem, onDrop }: { accept: string; label: string; count: number; lastItem: string; onDrop: (n: string) => void }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept,
    drop: (item: { name: string }) => onDrop(item.name),
    collect: (m) => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
  }));
  const cls = 'dustbin' + (isOver && canDrop ? ' over' : '') + (canDrop && !isOver ? ' accept' : '');
  return (
    <div ref={drop as any} className={cls}>
      <div style={{ fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 12 }}>收 {accept}</div>
      <div style={{ fontSize: 12 }}>已放入：{count}</div>
      <div style={{ fontSize: 11, opacity: .8 }}>{lastItem}</div>
    </div>
  );
}

export default function DustbinMultiple() {
  const [stats, setStats] = useState<Record<string, { count: number; last: string }>>({
    [TYPES.GLASS]: { count: 0, last: '—' },
    [TYPES.FOOD]: { count: 0, last: '—' },
    [TYPES.PAPER]: { count: 0, last: '—' },
  });

  const mkDrop = (t: string) => (name: string) => {
    setStats(s => ({ ...s, [t]: { count: s[t].count + 1, last: name } }));
  };

  return (
    <DemoLayout
      title="Dustbin · Multiple Targets"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <>
          <div className="info-box">
            <strong>Multiple Targets</strong><br />
            3 個 dustbin 只接受特定類型；Machine 不屬於任何類型，無法放入任一 bin。
            注意 hover 狀態 (over/accept) 的差異。
          </div>
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} style={{ fontSize: 13, marginBottom: 4 }}>{k}：放入 {v.count} 次，最近：{v.last}</div>
          ))}
        </>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 50 }}>
        <div className="dnd-stage" style={{ flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Bin accept={TYPES.GLASS} label="玻璃回收" count={stats[TYPES.GLASS].count} lastItem={stats[TYPES.GLASS].last} onDrop={mkDrop(TYPES.GLASS)} />
            <Bin accept={TYPES.FOOD} label="廚餘" count={stats[TYPES.FOOD].count} lastItem={stats[TYPES.FOOD].last} onDrop={mkDrop(TYPES.FOOD)} />
            <Bin accept={TYPES.PAPER} label="紙類" count={stats[TYPES.PAPER].count} lastItem={stats[TYPES.PAPER].last} onDrop={mkDrop(TYPES.PAPER)} />
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {SOURCES.map(s => <Source key={s.name} {...s} />)}
          </div>
        </div>
      </DndProvider>
    </DemoLayout>
  );
}
