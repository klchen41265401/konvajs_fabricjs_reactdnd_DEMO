import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

export default function AnimationEasing() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(1500);
  const durRef = useRef(duration); durRef.current = duration;
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, { selection: false });
    fabRef.current = canvas;
    const ease = fabric.util.ease as unknown as Record<string, (t: number, b: number, c: number, d: number) => number>;
    const easings = Object.keys(ease);
    const startX = 120, endX = 640;
    const dots: { name: string; dot: fabric.Circle }[] = [];
    easings.forEach((name, i) => {
      const y = 22 + i * ((720 - 40) / easings.length);
      const label = new fabric.Text(name, { left: 8, top: y - 9, fontSize: 11, fill: '#334155', selectable: false });
      const line = new fabric.Line([startX, y, endX, y], { stroke: '#e2e8f0', selectable: false });
      const dot = new fabric.Circle({ left: startX, top: y, radius: 6, fill: '#f59e0b', originX: 'center', originY: 'center', selectable: false });
      canvas.add(line, label, dot);
      dots.push({ name, dot });
    });
    canvas.renderAll();

    function playAll() {
      const dur = durRef.current;
      dots.forEach(({ name, dot }) => {
        fabric.util.animate({
          startValue: startX, endValue: endX, duration: dur,
          easing: ease[name],
          onChange: v => { dot.set('left', v); canvas.requestRenderAll(); },
          onComplete: () => {
            fabric.util.animate({
              startValue: endX, endValue: startX, duration: durRef.current,
              easing: ease[name],
              onChange: v => { dot.set('left', v); canvas.requestRenderAll(); },
              onComplete: () => { if (runningRef.current && name === dots[0].name) playAll(); }
            });
          }
        });
      });
    }
    playAll();

    return () => { runningRef.current = false; canvas.dispose(); };
  }, []);

  useFabricResponsive(wrapperRef, fabRef, 720, 720);

  return (
    <DemoLayout title="🎨 Animation easing" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>設定</h3>
        <div className="control-group">
          <label>單程週期 (ms): {duration}</label>
          <input type="range" min="500" max="4000" step="100" value={duration} onChange={e => setDuration(+e.target.value)} />
        </div>
        <div className="info-box">所有 <strong>fabric.util.ease</strong> 一次對照，來回循環。</div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={720} /></div>
    </DemoLayout>
  );
}
