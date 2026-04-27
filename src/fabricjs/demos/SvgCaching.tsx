import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

const SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <circle cx="100" cy="100" r="90" fill="url(#g)"/>
  <polygon points="100,30 170,170 30,170" fill="#fff" opacity="0.85"/>
  <circle cx="100" cy="120" r="24" fill="#0f172a"/>
</svg>
`;

export default function SvgCaching() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [caching, setCaching] = useState(true);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    fabric.loadSVGFromString(SVG, (objs, opts) => {
      const group = fabric.util.groupSVGElements(objs, opts);
      group.set({ left: 40, top: 40 });
      (group as any).objectCaching = caching;
      canvas.add(group);
      // 複製 N 份展示快取差異
      for (let i = 0; i < 14; i++) {
        (group as any).clone((c: fabric.Object) => {
          c.set({ left: 40 + ((i + 1) % 5) * 230, top: 40 + Math.floor((i + 1) / 5) * 230 });
          (c as any).objectCaching = caching;
          canvas.add(c);
        });
      }
    });
    return () => { canvas.dispose(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = fabRef.current; if (!canvas) return;
    canvas.getObjects().forEach(o => { (o as any).objectCaching = caching; (o as any).dirty = true; });
    canvas.requestRenderAll();
  }, [caching]);

  useFabricResponsive(wrapperRef, fabRef, 1180, 720);

  return (
    <DemoLayout title="🎨 SVG caching" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>快取</h3>
        <div className="control-group">
          <label><input type="checkbox" checked={caching} onChange={e => setCaching(e.target.checked)} /> objectCaching</label>
        </div>
        <div className="info-box">快取開啟時 SVG 會先繪製到離線 canvas，之後平移旋轉就不必重畫 path，效能大幅提升。</div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={1180} height={720} /></div>
    </DemoLayout>
  );
}
