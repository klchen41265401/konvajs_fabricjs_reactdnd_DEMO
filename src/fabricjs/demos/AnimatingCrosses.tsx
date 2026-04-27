import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

export default function AnimatingCrosses() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [count, setCount] = useState(60);
  const [duration, setDuration] = useState(2000);
  const runningRef = useRef(false);
  const durRef = useRef(duration);
  durRef.current = duration;

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, { selection: false, backgroundColor: '#0b1220' });
    fabRef.current = canvas;
    return () => { runningRef.current = false; canvas.dispose(); };
  }, []);

  useEffect(() => {
    const canvas = fabRef.current;
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = '#0b1220';
    const W = canvas.getWidth(), H = canvas.getHeight();
    for (let i = 0; i < count; i++) {
      const size = 10 + Math.random() * 28;
      const g = new fabric.Group([
        new fabric.Rect({ left: -size / 2, top: -2, width: size, height: 4, fill: '#38bdf8' }),
        new fabric.Rect({ left: -2, top: -size / 2, width: 4, height: size, fill: '#38bdf8' })
      ], { left: Math.random() * W, top: Math.random() * H, angle: Math.random() * 360, selectable: false });
      canvas.add(g);
    }
    canvas.requestRenderAll();
  }, [count]);

  useFabricResponsive(wrapperRef, fabRef, 720, 540);

  const animateAll = () => {
    const canvas = fabRef.current!;
    canvas.getObjects().forEach((obj, i) => {
      const dx = (Math.random() - 0.5) * 400;
      const dy = (Math.random() - 0.5) * 400;
      const da = (Math.random() - 0.5) * 720;
      const dur = durRef.current;
      obj.animate('left', (obj.left || 0) + dx, {
        duration: dur, easing: fabric.util.ease.easeInOutQuad,
        onChange: canvas.renderAll.bind(canvas),
        onComplete: i === 0 ? () => { if (runningRef.current) animateAll(); } : undefined
      });
      obj.animate('top', (obj.top || 0) + dy, { duration: dur });
      obj.animate('angle', (obj.angle || 0) + da, { duration: dur });
    });
  };

  return (
    <DemoLayout title="🎨 Animating crosses" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>控制</h3>
        <div className="control-group">
          <button type="button" onClick={() => { runningRef.current = true; animateAll(); }}>▶ 播放</button>
          <button type="button" onClick={() => { runningRef.current = false; }}>■ 停止</button>
        </div>
        <div className="control-group">
          <label>十字數量: {count}</label>
          <input type="range" min="10" max="200" value={count} onChange={e => setCount(+e.target.value)} />
        </div>
        <div className="control-group">
          <label>週期 (ms): {duration}</label>
          <input type="range" min="500" max="5000" step="100" value={duration} onChange={e => setDuration(+e.target.value)} />
        </div>
        <div className="info-box">多個物件以 <strong>fabric.util.animate</strong> 同時運作。</div>
      </>
    }>
      <div className="stage-wrapper dark" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={540} /></div>
    </DemoLayout>
  );
}
