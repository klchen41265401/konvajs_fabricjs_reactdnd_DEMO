import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';

export default function InfiniteCanvas() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 760, h: 520 });
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = wrapRef.current; if (!el) return;
    const findContainer = (): HTMLElement | null => {
      let n: HTMLElement | null = el.parentElement;
      while (n) {
        const d = getComputedStyle(n).display;
        if (d && !d.startsWith('inline')) return n;
        n = n.parentElement;
      }
      return el.parentElement;
    };
    const container = findContainer();
    const update = () => {
      let availW = 760;
      if (container) {
        const cs = getComputedStyle(container);
        const padX = parseFloat(cs.paddingLeft || '0') + parseFloat(cs.paddingRight || '0');
        availW = container.clientWidth - padX - 2;
      }
      const w = Math.max(280, Math.min(760, availW));
      const h = Math.max(320, Math.min(520, w * 520 / 760));
      setSize(prev => prev.w === w && prev.h === h ? prev : { w, h });
    };
    update();
    const ro = new ResizeObserver(update);
    if (container) ro.observe(container);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, []);

  const onWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current!;
    const old = stage.scaleX();
    const pointer = stage.getPointerPosition()!;
    const mousePointTo = { x: (pointer.x - stage.x()) / old, y: (pointer.y - stage.y()) / old };
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const ns = Math.max(0.1, Math.min(8, old * (1 + direction * 0.1)));
    setScale(ns);
    setPos({ x: pointer.x - mousePointTo.x * ns, y: pointer.y - mousePointTo.y * ns });
  };

  // Draw infinite grid dots
  const gridLines: any[] = [];
  const grid = 80;
  const extent = 3000;
  for (let x = -extent; x <= extent; x += grid) gridLines.push(<Line key={'vx' + x} points={[x, -extent, x, extent]} stroke="#e5e7eb" strokeWidth={1} />);
  for (let y = -extent; y <= extent; y += grid) gridLines.push(<Line key={'hy' + y} points={[-extent, y, extent, y]} stroke="#e5e7eb" strokeWidth={1} />);

  return (
    <DemoLayout title="🖼️ Infinite Canvas" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="info-box">滑鼠拖曳平移、滾輪縮放。縮放以滑鼠為中心。</div>
        <div className="kv">
          <strong>Scale:</strong><span>{scale.toFixed(2)}</span>
          <strong>X:</strong><span>{pos.x.toFixed(0)}</span>
          <strong>Y:</strong><span>{pos.y.toFixed(0)}</span>
        </div>
        <div className="control-group"><button type="button" onClick={() => { setScale(1); setPos({ x: 0, y: 0 }); }}>Reset</button></div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapRef}>
        <Stage ref={stageRef} width={size.w} height={size.h} draggable scaleX={scale} scaleY={scale} x={pos.x} y={pos.y} onWheel={onWheel} onDragEnd={(e: Konva.KonvaEventObject<DragEvent>) => setPos({ x: e.target.x(), y: e.target.y() })}>
          <Layer>
            {gridLines}
            {Array.from({ length: 30 }).map((_, i) => (
              <Rect key={i} x={-extent + Math.random() * 2 * extent} y={-extent + Math.random() * 2 * extent} width={60} height={40} fill={`hsl(${i * 12},70%,60%)`} />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <Circle key={'c' + i} x={-extent + Math.random() * 2 * extent} y={-extent + Math.random() * 2 * extent} radius={30} fill={`hsl(${i * 18},70%,60%)`} />
            ))}
          </Layer>
        </Stage>
      </div>
    </DemoLayout>
  );
}
