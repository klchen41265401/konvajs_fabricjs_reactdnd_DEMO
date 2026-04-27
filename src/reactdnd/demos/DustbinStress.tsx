import { useMemo, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import DemoLayout from '../../components/DemoLayout';

const TYPES = ['A', 'B', 'C', 'D', 'E'];

type BoxData = { id: number; type: string; label: string };
type BinData = { id: number; accepts: string[] };

function Box({ data }: { data: BoxData }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: data.type,
    item: data,
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));
  return <div ref={drag as any} className={`box${isDragging ? ' dragging' : ''}`} style={{ fontSize: 11, padding: 6, minWidth: 56, background: `hsl(${data.id * 12 % 360},70%,60%)`, color: '#fff' }}>{data.label}</div>;
}

function Bin({ data, hits, onDrop }: { data: BinData; hits: number; onDrop: (b: BoxData) => void }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: data.accepts,
    drop: (item: BoxData) => onDrop(item),
    collect: (m) => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
  }));
  const cls = 'dustbin' + (isOver && canDrop ? ' over' : '') + (canDrop && !isOver ? ' accept' : '');
  return (
    <div ref={drop as any} className={cls} style={{ width: 100, height: 70, fontSize: 12 }}>
      <div>Bin #{data.id}</div>
      <div style={{ fontSize: 10 }}>{data.accepts.join(',')}</div>
      <div>✓ {hits}</div>
    </div>
  );
}

export default function DustbinStress() {
  const boxes: BoxData[] = useMemo(
    () => Array.from({ length: 30 }, (_, i) => ({ id: i, type: TYPES[i % TYPES.length], label: `#${i} ${TYPES[i % TYPES.length]}` })),
    []
  );
  const bins: BinData[] = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const pick = TYPES.filter((_, ti) => (i + ti) % 3 === 0);
        return { id: i, accepts: pick.length ? pick : [TYPES[i % TYPES.length]] };
      }),
    []
  );
  const [hits, setHits] = useState<Record<number, number>>({});

  return (
    <DemoLayout
      title="Dustbin · Stress Test"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <>
          <div className="info-box">
            <strong>Stress Test</strong><br />
            30 個可拖曳 Box + 10 個 Bin，每個 Bin 接受不同 type 組合。
            即使大量 item，react-dnd 仍可正常運作。
          </div>
          <div style={{ fontSize: 12 }}>Types: {TYPES.join(', ')}</div>
        </>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 50 }}>
        <div className="dnd-stage" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 20 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {bins.map(b => <Bin key={b.id} data={b} hits={hits[b.id] || 0} onDrop={() => setHits(h => ({ ...h, [b.id]: (h[b.id] || 0) + 1 }))} />)}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {boxes.map(b => <Box key={b.id} data={b} />)}
          </div>
        </div>
      </DndProvider>
    </DemoLayout>
  );
}
