import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

const PATHS = {
  wave: 'M 20 200 Q 160 60 300 200 T 580 200',
  circle: 'M 320 100 a 140 140 0 1 0 0.001 0',
  zigzag: 'M 20 200 L 120 100 L 220 200 L 320 100 L 420 200 L 520 100 L 620 200'
};

export default function TextOnPath() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<fabric.Text | null>(null);
  const [which, setWhich] = useState<keyof typeof PATHS>('wave');
  const [msg, setMsg] = useState('Fabric.js text on path!');
  const [fontSize, setFontSize] = useState(30);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    rebuild('wave', 'Fabric.js text on path!', 30);
    return () => { canvas.dispose(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rebuild = (k: keyof typeof PATHS, m: string, s: number) => {
    const canvas = fabRef.current!;
    canvas.clear();
    const path = new fabric.Path(PATHS[k], { fill: '', stroke: '#94a3b8', strokeDashArray: [4, 4], selectable: false });
    canvas.add(path);
    const t = new fabric.Text(m, { fontSize: s, fontFamily: 'Georgia', fill: '#0f172a', path } as any);
    textRef.current = t;
    canvas.add(t);
    canvas.requestRenderAll();
  };

  useEffect(() => { rebuild(which, msg, fontSize); }, [which, msg, fontSize]);

  useFabricResponsive(wrapperRef, fabRef, 720, 400);

  return (
    <DemoLayout title="🎨 Text on path" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>路徑</h3>
        <div className="control-group">
          {(Object.keys(PATHS) as (keyof typeof PATHS)[]).map(k => (
            <button type="button" key={k} className={which === k ? 'active' : ''} onClick={() => setWhich(k)}>{k}</button>
          ))}
        </div>
        <div className="control-group"><label>文字</label><input type="text" value={msg} onChange={e => setMsg(e.target.value)} /></div>
        <div className="control-group"><label>大小: {fontSize}</label><input type="range" min="14" max="60" value={fontSize} onChange={e => setFontSize(+e.target.value)} /></div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={720} height={400} /></div>
    </DemoLayout>
  );
}
