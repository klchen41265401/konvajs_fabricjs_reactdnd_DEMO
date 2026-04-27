import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

type Kind = 'dots' | 'stripes' | 'checker' | 'diag';

function buildPattern(kind: Kind, c1: string, c2: string): HTMLCanvasElement {
  const pc = document.createElement('canvas');
  pc.width = 40; pc.height = 40;
  const ctx = pc.getContext('2d')!;
  ctx.fillStyle = c1; ctx.fillRect(0, 0, 40, 40);
  ctx.fillStyle = c2;
  if (kind === 'dots') { ctx.beginPath(); ctx.arc(20, 20, 6, 0, Math.PI * 2); ctx.fill(); }
  else if (kind === 'stripes') { ctx.fillRect(0, 0, 40, 10); }
  else if (kind === 'checker') { ctx.fillRect(0, 0, 20, 20); ctx.fillRect(20, 20, 20, 20); }
  else if (kind === 'diag') { ctx.strokeStyle = c2; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-5, 45); ctx.lineTo(45, -5); ctx.stroke(); }
  return pc;
}

export default function DynamicPatterns() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const shapeRef = useRef<fabric.Rect | null>(null);
  const [kind, setKind] = useState<Kind>('dots');
  const [c1, setC1] = useState('#0f172a');
  const [c2, setC2] = useState('#f59e0b');

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    const shape = new fabric.Rect({ left: 80, top: 80, width: 500, height: 340, rx: 20, ry: 20 });
    shapeRef.current = shape;
    canvas.add(shape);
    return () => { canvas.dispose(); };
  }, []);

  useEffect(() => {
    const shape = shapeRef.current; if (!shape) return;
    const source = buildPattern(kind, c1, c2);
    shape.fill = new fabric.Pattern({ source: source as unknown as HTMLImageElement, repeat: 'repeat' });
    fabRef.current?.requestRenderAll();
  }, [kind, c1, c2]);

  useFabricResponsive(wrapperRef, fabRef, 680, 500);

  return (
    <DemoLayout title="🎨 Dynamic patterns" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>圖樣</h3>
        <div className="control-group">
          {(['dots', 'stripes', 'checker', 'diag'] as Kind[]).map(k => (
            <button type="button" key={k} className={kind === k ? 'active' : ''} onClick={() => setKind(k)}>{k}</button>
          ))}
        </div>
        <h3>顏色</h3>
        <div className="control-group"><label>底色</label><input type="color" value={c1} onChange={e => setC1(e.target.value)} /></div>
        <div className="control-group"><label>前景</label><input type="color" value={c2} onChange={e => setC2(e.target.value)} /></div>
        <div className="info-box">動態產生的 canvas 作為 <strong>fabric.Pattern</strong> 來源。</div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={680} height={500} /></div>
    </DemoLayout>
  );
}
