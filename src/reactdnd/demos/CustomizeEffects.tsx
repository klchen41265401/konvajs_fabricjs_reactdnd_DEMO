import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import DemoLayout from '../../components/DemoLayout';

const ITEM = 'effect-box';

function Source({ label, color }: { label: string; color: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM,
    item: { label },
    options: { dropEffect: 'move' },
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));
  return <div ref={drag as any} className={`box${isDragging ? ' dragging' : ''}`} style={{ background: color, color: '#fff' }}>{label}</div>;
}

function Bin({
  title,
  accept,
  items,
  onDrop,
}: {
  title: string;
  accept: 'copy' | 'move';
  items: string[];
  onDrop: (label: string, effect: 'copy' | 'move') => void;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ITEM,
    drop: (item: { label: string }) => onDrop(item.label, accept),
    collect: (m) => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
  }));
  return (
    <div ref={drop as any} className={`dustbin${isOver ? ' over' : ''}${canDrop && !isOver ? ' accept' : ''}`} style={{ flexDirection: 'column' }}>
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 11 }}>dropEffect: {accept}</div>
      <div style={{ fontSize: 12, marginTop: 4 }}>{items.length === 0 ? '（空）' : items.join(', ')}</div>
    </div>
  );
}

export default function CustomizeEffects() {
  const [sources, setSources] = useState<string[]>(['📄 Doc A', '📄 Doc B', '📄 Doc C']);
  const [copied, setCopied] = useState<string[]>([]);
  const [moved, setMoved] = useState<string[]>([]);

  const handleDrop = (label: string, effect: 'copy' | 'move') => {
    if (effect === 'copy') {
      setCopied(c => [...c, label]);
    } else {
      setMoved(m => [...m, label]);
      setSources(s => s.filter(x => x !== label));
    }
  };

  return (
    <DemoLayout
      title="Customize · Drop Effects"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <>
          <div className="info-box">
            <strong>Copy (Ctrl) vs Move</strong><br />
            HTML5 DnD 會依據修飾鍵改變 <code>dropEffect</code>：<br />
            · 直接拖到 <em>Move Bin</em> → 從來源移除<br />
            · 按住 <kbd>Ctrl</kbd> 拖到 <em>Copy Bin</em> → 保留來源（留意游標變成 <code>+</code>）
          </div>
          <div style={{ fontSize: 12 }}>剩餘來源：{sources.length}</div>
        </>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 50 }}>
        <div className="dnd-stage" style={{ flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            {sources.map(s => <Source key={s} label={s} color="#16a085" />)}
            {sources.length === 0 && <div style={{ color: '#888' }}>（所有來源已被移走）</div>}
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Bin title="Copy Bin" accept="copy" items={copied} onDrop={handleDrop} />
            <Bin title="Move Bin" accept="move" items={moved} onDrop={handleDrop} />
          </div>
        </div>
      </DndProvider>
    </DemoLayout>
  );
}
