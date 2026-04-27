import { useRef, useState } from 'react';
import { Layer, Rect, Line } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

type Box = { id: number; x: number; y: number; w: number; h: number; fill: string };

const INITIAL: Box[] = [
  { id: 1, x: 60, y: 60, w: 140, h: 100, fill: '#3b82f6' },
  { id: 2, x: 260, y: 200, w: 160, h: 120, fill: '#f59e0b' },
  { id: 3, x: 480, y: 100, w: 120, h: 160, fill: '#10b981' },
  { id: 4, x: 320, y: 60, w: 100, h: 80, fill: '#ec4899' },
];

type Guide = { orientation: 'H' | 'V'; value: number };

export default function ObjectsSnapping() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const [boxes, setBoxes] = useState<Box[]>(INITIAL);
  const [snap, setSnap] = useState(true);
  const [threshold, setThreshold] = useState(5);
  const [guides, setGuides] = useState<Guide[]>([]);

  const getLineStopsFor = (others: Box[]) => {
    const v: number[] = [0, 720];
    const h: number[] = [0, 480];
    for (const b of others) {
      v.push(b.x, b.x + b.w, b.x + b.w / 2);
      h.push(b.y, b.y + b.h, b.y + b.h / 2);
    }
    return { v, h };
  };

  const handleDragMove = (id: number, e: Konva.KonvaEventObject<DragEvent>) => {
    if (!snap) { setGuides([]); return; }
    const node = e.target as Konva.Rect;
    const box = boxes.find(b => b.id === id);
    if (!box) return;
    const others = boxes.filter(b => b.id !== id);
    const { v, h } = getLineStopsFor(others);

    const nx = node.x();
    const ny = node.y();
    const targets = {
      V: [nx, nx + box.w / 2, nx + box.w],
      H: [ny, ny + box.h / 2, ny + box.h],
    };

    let snapX: number | null = null;
    let snapY: number | null = null;
    const active: Guide[] = [];

    for (const target of targets.V) {
      for (const line of v) {
        if (Math.abs(line - target) < threshold) {
          const diff = line - target;
          if (snapX === null) snapX = node.x() + diff;
          active.push({ orientation: 'V', value: line });
        }
      }
    }
    for (const target of targets.H) {
      for (const line of h) {
        if (Math.abs(line - target) < threshold) {
          const diff = line - target;
          if (snapY === null) snapY = node.y() + diff;
          active.push({ orientation: 'H', value: line });
        }
      }
    }

    if (snapX !== null) node.x(snapX);
    if (snapY !== null) node.y(snapY);
    setGuides(active);
  };

  const handleDragEnd = (id: number, e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target as Konva.Rect;
    setBoxes(arr => arr.map(b => b.id === id ? { ...b, x: node.x(), y: node.y() } : b));
    setGuides([]);
  };

  return (
    <DemoLayout title="🧲 Objects Snapping" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label><input type="checkbox" checked={snap} onChange={e => setSnap(e.target.checked)} /> 啟用對齊</label>
        </div>
        <div className="control-group">
          <label>對齊閾值: {threshold}px</label>
          <input type="range" min="1" max="20" value={threshold} onChange={e => setThreshold(+e.target.value)} />
        </div>
        <div className="control-group">
          <button type="button" onClick={() => setBoxes(INITIAL)}>重置</button>
        </div>
        <div className="info-box">拖動矩形時，邊緣或中線若接近其他矩形或舞台邊界，會顯示黃色虛線輔助線並自動吸附。可調整閾值或關閉吸附。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage ref={stageRef} designWidth={720} designHeight={480}>
          <Layer>
            <Rect x={0} y={0} width={720} height={480} fill="#fafafa" />
            {boxes.map(b => (
              <Rect
                key={b.id}
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                fill={b.fill}
                draggable
                onDragMove={(e) => handleDragMove(b.id, e)}
                onDragEnd={(e) => handleDragEnd(b.id, e)}
              />
            ))}
            {guides.map((g, i) => g.orientation === 'V'
              ? <Line key={i} points={[g.value, 0, g.value, 480]} stroke="#eab308" strokeWidth={1} dash={[4, 4]} />
              : <Line key={i} points={[0, g.value, 720, g.value]} stroke="#eab308" strokeWidth={1} dash={[4, 4]} />
            )}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
