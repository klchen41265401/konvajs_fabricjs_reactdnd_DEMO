import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

export default function Intersection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [overlapping, setOverlapping] = useState<string[]>([]);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    const a = new fabric.Rect({ left: 80, top: 120, width: 160, height: 110, fill: '#f87171', name: 'A' } as any);
    const b = new fabric.Rect({ left: 220, top: 180, width: 160, height: 110, fill: '#38bdf8', name: 'B' } as any);
    const c = new fabric.Circle({ left: 420, top: 100, radius: 60, fill: '#4ade80', name: 'C' } as any);
    const d = new fabric.Triangle({ left: 500, top: 260, width: 130, height: 120, fill: '#a78bfa', name: 'D' } as any);
    canvas.add(a, b, c, d);

    const check = () => {
      const objs = canvas.getObjects();
      const hits: string[] = [];
      for (let i = 0; i < objs.length; i++) {
        for (let j = i + 1; j < objs.length; j++) {
          if (objs[i].intersectsWithObject(objs[j])) {
            hits.push(`${(objs[i] as any).name} ⟷ ${(objs[j] as any).name}`);
            objs[i].set('opacity', 0.7); objs[j].set('opacity', 0.7);
          }
        }
      }
      objs.forEach(o => { if (o.opacity === undefined) o.set('opacity', 1); });
      setOverlapping(hits);
      canvas.requestRenderAll();
    };
    canvas.on('object:moving', check);
    canvas.on('object:scaling', check);
    canvas.on('object:rotating', check);
    check();
    return () => { canvas.dispose(); };
  }, []);

  useFabricResponsive(wrapperRef, fabRef, 720, 540);

  return (
    <DemoLayout title="🎨 Intersection" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>碰撞偵測</h3>
        <div className="info-box">拖曳/縮放物件，即時顯示兩兩相交的組合（使用 <strong>intersectsWithObject</strong>）。</div>
        <h3>目前相交</h3>
        <div className="log">{overlapping.length ? overlapping.join('\n') : '(無)'}</div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={540} /></div>
    </DemoLayout>
  );
}
